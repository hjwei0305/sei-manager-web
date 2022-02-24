import { utils } from 'suid';
import { get } from 'lodash';
import { getServices, getServiceInstance } from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'availableService',

  state: {
    currentEnvViewType: null,
    envViewData: [],
    serviceData: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/monitorCenter/availableService', location.pathname)) {
          dispatch({
            type: 'initEnvViewData',
          });
        }
      });
    },
  },
  effects: {
    *initEnvViewData(_, { put, select }) {
      const { envData } = yield select(sel => sel.menu);
      let currentEnvViewType = null;
      let envViewData = [];
      if (!currentEnvViewType && envData && envData.length > 0) {
        envViewData = envData;
        [currentEnvViewType] = envData;
      }
      yield put({
        type: 'updateState',
        payload: {
          currentEnvViewType,
          envViewData,
        },
      });
      yield put({
        type: 'getServices',
      });
    },
    *updatePageState({ payload }, { put }) {
      return yield put({
        type: 'updateState',
        payload,
      });
    },
    *getServices(_, { call, put, select }) {
      const { currentEnvViewType } = yield select(sel => sel.availableService);
      const re = yield call(getServices, {
        env: get(currentEnvViewType, 'code'),
      });
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            serviceData: re.data,
          },
        });
      }
    },
    *getServiceInstance({ payload, callback }, { call, select }) {
      const { currentEnvViewType } = yield select(sel => sel.availableService);
      const env = get(currentEnvViewType, 'code');
      const { serviceCode } = payload;
      const re = yield call(getServiceInstance, {
        env,
        serviceCode,
      });
      callback(re);
    },
  },
});
