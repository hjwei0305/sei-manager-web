import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { saveConfig, saveConfigItem, delConfigItem, getCompareConfig } from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'configCommon',

  state: {
    envData: [],
    selectedEnv: null,
    currentConfigItem: null,
    showCompare: false,
    showFormModal: false,
    compareData: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/configCenter/common', location.pathname)) {
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
    *saveConfig({ payload, callback }, { call }) {
      const re = yield call(saveConfig, payload);
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
    *getCompareConfig({ payload, callback }, { call, put }) {
      const re = yield call(getCompareConfig, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.assign-success', defaultMessage: '分配成功' }));
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
