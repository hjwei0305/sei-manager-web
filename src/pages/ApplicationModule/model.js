import { utils, message } from 'suid';
import { removeModuleUser } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'applicationModule',

  state: {
    filter: {},
    currentModule: null,
    showModal: false,
  },
  effects: {
    *removeModuleUser({ payload, callback }, { call }) {
      const re = yield call(removeModuleUser, payload);
      message.destroy();
      if (re.success) {
        message.success('移除模块成员成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
