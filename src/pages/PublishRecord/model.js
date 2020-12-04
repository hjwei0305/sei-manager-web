import { utils, message } from 'suid';
import { build } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'publishRecord',

  state: {
    filter: {},
  },
  effects: {
    *build({ payload, callback }, { call }) {
      const re = yield call(build, payload);
      message.destroy();
      if (re.success) {
        message.success('启动构建成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
