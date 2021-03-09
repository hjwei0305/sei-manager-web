import { formatMessage } from 'umi-plugin-react/locale';
import { get } from 'lodash';
import { utils, message } from 'suid';
import {
  saveConfig,
  saveConfigItem,
  delConfigItem,
  disableConfig,
  enableConfig,
  syncConfigs,
  compareBeforeRelease,
  appRelease,
  getYamlData,
  saveYamlData,
  getCompareData,
} from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'configApp',

  state: {
    selectedEnv: null,
    targetCompareEvn: null,
    selectedApp: null,
    envData: [],
    currentConfigItem: null,
    showRelease: false,
    compareBeforeReleaseData: null,
    showCompare: false,
    showFormModal: false,
    compareData: null,
    yamlText: '',
    currentTabKey: 'appParam',
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
      let selectedEnv = null;
      if (!selectedEnv && envData && envData.length > 0) {
        [selectedEnv] = envData;
      }
      yield put({
        type: 'updateState',
        payload: {
          selectedEnv,
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
    *compareBeforeRelease({ callback }, { call, put, select }) {
      const { selectedEnv, selectedApp } = yield select(sel => sel.configApp);
      const re = yield call(compareBeforeRelease, {
        appCode: get(selectedApp, 'code'),
        envCode: get(selectedEnv, 'code'),
      });
      message.destroy();
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            showRelease: true,
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
    *appRelease({ callback }, { call, put, select }) {
      const { selectedEnv, selectedApp } = yield select(sel => sel.configApp);
      const re = yield call(appRelease, {
        appCode: get(selectedApp, 'code'),
        envCode: get(selectedEnv, 'code'),
      });
      message.destroy();
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            showRelease: false,
            compareBeforeReleaseData: null,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *getYamlData({ callback }, { call, put, select }) {
      const { selectedEnv, selectedApp } = yield select(sel => sel.configApp);
      const re = yield call(getYamlData, {
        appCode: get(selectedApp, 'code'),
        envCode: get(selectedEnv, 'code'),
      });
      message.destroy();
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            yamlText: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *saveYamlData({ payload, callback }, { call }) {
      const re = yield call(saveYamlData, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *getCompareData({ callback }, { call, put, select }) {
      const { selectedEnv, targetCompareEvn, selectedApp } = yield select(sel => sel.configApp);
      const re = yield call(getCompareData, {
        appCode: get(selectedApp, 'code'),
        currentEnv: get(selectedEnv, 'code'),
        targetEnv: get(targetCompareEvn, 'code'),
      });
      message.destroy();
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            compareData: re.data,
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
