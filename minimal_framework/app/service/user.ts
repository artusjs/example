import { Injectable } from '@artus/core';

@Injectable()
export default class UserService {
  async info() {
    return {
      name: 'DuanXiaohan',
    };
  }
}
