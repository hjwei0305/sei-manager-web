import { utils, message } from 'suid';
import { assignAppAdminUser } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'application',

  state: {
    currentApp: null,
    showModal: false,
  },
  effects: {
    *assignAppAdminUser({ payload, callback }, { call, put }) {
      const re = yield call(assignAppAdminUser, payload);
      message.destroy();
      if (re.success) {
        message.success('设置成功');
        yield put({
          type: 'updateState',
          payload: {
            currentApp: null,
            showModal: false,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
