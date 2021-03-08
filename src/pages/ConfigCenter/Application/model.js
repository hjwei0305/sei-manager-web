import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import {
  saveConfig,
  saveConfigItem,
  delConfigItem,
  disableConfig,
  enableConfig,
  syncConfigs,
  compareBeforeRelease,
} from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'configApp',

  state: {
    selectedApp: null,
    envData: [],
    selectedEnv: null,
    currentConfigItem: null,
    showRelease: false,
    compareBeforeReleaseData: null,
    showCompare: false,
    showFormModal: false,
    compareData: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/configCenter/application', location.pathname)) {
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
      yield put({
        type: 'updateState',
        payload: {
          envData,
        },
      });
    },
    *saveConfig({ payload, callback }, { call, put }) {
      const re = yield call(saveConfig, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            showFormModal: false,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *saveConfigItem({ payload, callback }, { call, put }) {
      const re = yield call(saveConfigItem, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            showFormModal: false,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *delConfigItem({ payload, callback }, { call }) {
      const re = yield call(delConfigItem, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *enableConfig({ payload, callback }, { call }) {
      const re = yield call(enableConfig, payload);
      message.destroy();
      if (re.success) {
        message.success('批量启用成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *disableConfig({ payload, callback }, { call }) {
      const re = yield call(disableConfig, payload);
      message.destroy();
      if (re.success) {
        message.success('批量禁用成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *syncConfigs({ payload, callback }, { call }) {
      const re = yield call(syncConfigs, payload);
      message.destroy();
      if (re.success) {
        message.success('同步成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *compareBeforeRelease({ payload, callback }, { call, put }) {
      const re = yield call(compareBeforeRelease, payload);
      message.destroy();
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            compareBeforeReleaseData: re.data,
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
