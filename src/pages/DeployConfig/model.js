import { utils, message } from 'suid';
import { save, remove } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'deployConfig',

  state: {
    currentModule: null,
    showModal: false,
    rowData: null,
    moduleFilter: {},
  },
  effects: {
    *save({ payload, callback }, { call, put }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success('保存成功');
        yield put({
          type: 'updateState',
          payload: {
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
    *remove({ payload, callback }, { call }) {
      const re = yield call(remove, payload);
      message.destroy();
      if (re.success) {
        message.success('删除成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
