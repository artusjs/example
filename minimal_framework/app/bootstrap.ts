import path from 'path';
import { Application } from '../framework/application';
import UserService from './service/user';

(async () => {
  const app = await Application.start({
    root: path.resolve(__dirname),
    name: 'app',
    configDir: 'config',
  });

  console.log(app.config);
  const userService = await app.container.get(UserService);
  const result = await userService.info();
  console.log(result);
})()