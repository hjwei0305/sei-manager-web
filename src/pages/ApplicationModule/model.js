import { get, lowerCase } from 'lodash';
import { utils, message } from 'suid';
import { removeModuleUser, addModuleUser, getVersionDetail, deriveModule } from './service';

const { dvaModel, pathMatchRegexp } = utils;
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
    devBaseUrl: '',
    showApiDoc: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/integration/applicationModule', location.pathname)) {
          dispatch({
            type: 'initEnv',
          });
        }
      });
    },
  },
  effects: {
    *initEnv(_, { select, put }) {
      const { envData } = yield select(sel => sel.menu);
      let devBaseUrl = '';
      if (envData && envData.length > 0) {
        const ds = envData.filter(
          e => lowerCase(e.code).indexOf('dev') >= 0 || e.name.indexOf('开发') >= 0,
        );
        if (ds.length > 0) {
          devBaseUrl = get(ds[0], 'gatewayServer');
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          devBaseUrl,
        },
      });
    },
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
    *deriveModule({ payload, callback }, { call }) {
      const re = yield call(deriveModule, payload);
      message.destroy();
      if (re.success) {
        message.success('操作成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
