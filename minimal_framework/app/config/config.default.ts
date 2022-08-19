import path from 'path';

export default {
  sayHi: 'hi this is default config',
  framework: {
    path: path.resolve(__dirname, '..', '..', 'framework_http'),
  },
};
