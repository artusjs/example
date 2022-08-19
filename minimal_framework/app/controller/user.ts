import { ArtusInjectEnum, Inject } from '@artus/core';
import {
  GET,
  HTTPController
} from '../../plugin/application-http/decorator';
import UserService from '../service/user';

@HTTPController()
export default class UserController {
  @Inject()
  userService: UserService;

  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  @GET('/user')
  async info(_, res) {
    const user = await this.userService.info();

    res.end(JSON.stringify({
      config: this.config,
      user,
    }));
  }
}
