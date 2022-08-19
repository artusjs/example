import Router from 'find-my-way';
import path from 'path';
import http from 'http';
import { Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, Container } from '@artus/core';
import { CONTROLLER_METADATA, ROUTER_METADATA, WEB_CONTROLLER_TAG } from './decorator';

@LifecycleHookUnit()
export default class Lifecycle implements ApplicationLifecycle {
  // @Inject()
  // private readonly app: Application;

  @Inject()
  private readonly container: Container

  private router = Router();

  // 在 Artus 生命周期 willReady 时启动 HTTP server
  @LifecycleHook()
  public async willReady() {
    // 读取已经附加 metadata 信息并注入到 container 的 controller
    const controllerClazzList = this.container.getInjectableByTag(WEB_CONTROLLER_TAG);
    for (const controllerClazz of controllerClazzList) {
      const controllerMetadata = Reflect.getMetadata(CONTROLLER_METADATA, controllerClazz);
      const controller = this.container.get(controllerClazz) as any;

      // 读取 controller 中的 function
      const handlerDescriptorList = Object.getOwnPropertyDescriptors(controllerClazz.prototype);
      for (const key of Object.keys(handlerDescriptorList)) {
        const handlerDescriptor = handlerDescriptorList[key];
        const routeMetadataList = Reflect.getMetadata(ROUTER_METADATA, handlerDescriptor.value) ?? [];
        if (routeMetadataList.length === 0) continue;

        // 注入 router
        this.registerRoute(controllerMetadata, routeMetadataList, controller[key].bind(controller));
      }
    }

    // 启动 HTTP Server
    const server = http.createServer((req, res) => {
      this.router.lookup(req, res);
    });

    server.listen(3000, () => {
      console.log('Server listening on: http://localhost:3000');
    });
  }

  private registerRoute(controllerMetadata, routeMetadataList, handler) {
    for (const routeMetadata of routeMetadataList) {
      const routePath = path.normalize(controllerMetadata.prefix ?? '/' + routeMetadata.path);
      this.router.on(routeMetadata.method, routePath, handler);
    }
  }
}
