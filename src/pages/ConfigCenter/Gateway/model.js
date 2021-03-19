import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import get from 'lodash.get';
import { save, del, syncConfigs, releaseConfigs, getProjectList } from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'appGateway',

  state: {
    envData: [],
    selectedEnv: null,
    selectedApp: null,
    showModal: false,
    rowData: null,
    projectGroupData: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/configCenter/gateway', location.pathname)) {
          dispatch({
            type: 'initEnv',
          });
        }
      });
    },
  },
  effects: {
    *initEnv(_, { call, select, put }) {
      const { selectedEnv: originSelectedEnv } = yield select(sel => sel.appGateway);
      const { envData } = yield select(sel => sel.menu);
      let selectedEnv = { ...originSelectedEnv };
      if (!originSelectedEnv && envData && envData.length > 0) {
        [selectedEnv] = envData;
      }
      let projectGroupData = [];
      const re = yield call(getProjectList);
      if (re.success) {
        projectGroupData = re.data;
      } else {
        message.error(re.message);
      }
      yield put({
        type: 'updateState',
        payload: {
          selectedEnv,
          envData,
          projectGroupData,
        },
      });
    },
    *save({ payload, callback }, { call, put }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
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
    *del({ payload, callback }, { call }) {
      const re = yield call(del, payload);
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
    *releaseConfigs(_, { call, select }) {
      const { selectedEnv } = yield select(sel => sel.appGateway);
      const basePath = get(selectedEnv, 'gatewayServer');
      message.destroy();
      if (basePath) {
        const re = yield call(releaseConfigs, { basePath: get(selectedEnv, 'gatewayServer') });
        if (re.success) {
          message.success('发布成功');
        } else {
          message.error(re.message);
        }
      } else {
        message.error(`环境[${get(selectedEnv, 'name')}]未配置网关基地址`);
      }
    },
  },
});
