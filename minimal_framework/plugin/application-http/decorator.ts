import { addTag, Injectable, ScopeEnum } from "@artus/core/injection";

export const ROUTER_METADATA = Symbol.for('ROUTE_METADATA');
export const CONTROLLER_METADATA = Symbol.for('CONTROLLER_METADATA');
export const WEB_CONTROLLER_TAG = 'WEB_CONTROLLER_TAG';
export enum HTTPMethod {
  GET = 'GET'
}

export function HTTPController(prefix?: string) {
  return (target: any) => {
    const controllerMetadata = {
      prefix,
    };

    Reflect.defineMetadata(CONTROLLER_METADATA, controllerMetadata, target);
    addTag(WEB_CONTROLLER_TAG, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  }
}

// 多个 method 可以采用 factory 模式处理，示例仅展示最基础的 GET
export function GET(path: string) {
  return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const routeMetadataList = Reflect.getMetadata(ROUTER_METADATA, descriptor.value) ?? [];
    routeMetadataList.push({
      path,
      method: HTTPMethod.GET,
    });
    Reflect.defineMetadata(ROUTER_METADATA, routeMetadataList, descriptor.value);
    return descriptor;
  }
}
