import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { saveFeature, delFeature } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'feature',

  state: {
    currentFeaturePage: null,
    currentFeatureHandler: null,
    selectedFeaturePage: null,
    showPageHandler: false,
    showPageFormModal: false,
    showHandlerFormModal: false,
  },
  effects: {
    *saveFeature({ payload, callback }, { call, put }) {
      const re = yield call(saveFeature, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            selectedFeaturePage: re.data,
            showPageHandler: true,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *delFeature({ payload, callback }, { call, put }) {
      const re = yield call(delFeature, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentFeaturePage: null,
            selectedFeaturePage: null,
            showPageHandler: false,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *saveFeatureHandler({ payload, callback }, { call }) {
      const re = yield call(saveFeature, payload);
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
    *delFeatureHandler({ payload, callback }, { call }) {
      const re = yield call(delFeature, payload);
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
  },
});
