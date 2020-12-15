import { utils, message } from 'suid';
import { build, getBuildDetail } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'buildRecord',

  state: {
    filter: {},
    showModal: false,
    rowData: null,
    logData: null,
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
    *getBuildDetail({ payload, callback }, { call, put }) {
      const re = yield call(getBuildDetail, payload);
      message.destroy();
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            logData: re.data,
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
