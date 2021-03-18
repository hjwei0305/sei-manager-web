import get from 'lodash.get';
import { utils, message } from 'suid';
import { removeModuleUser, addModuleUser, getVersionDetail } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'applicationModule',

  state: {
    filter: {},
    currentModule: null,
    showModal: false,
    showAssignedModal: false,
    showVersionHistory: false,
    logData: null,
    selectVersion: null,
  },
  effects: {
    *addModuleUser({ payload, callback }, { call }) {
      const re = yield call(addModuleUser, payload);
      message.destroy();
      if (re.success) {
        message.success('添加成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *getVersionDetail({ payload, callback }, { call, put }) {
      const { selectVersion } = payload;
      yield put({
        type: 'updateState',
        payload: {
          selectVersion,
        },
      });
      const re = yield call(getVersionDetail, { id: get(selectVersion, 'id') });
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
