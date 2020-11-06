import { utils } from 'suid';
import { constants } from '@/utils';
import { getServices, getInstancesByAppEnvCode, getInterfacesByAppCode } from './service';

const { ENV_CATEGORY } = constants;
const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const ENV_CATEGORY_DATA = Object.keys(ENV_CATEGORY).map(key => ENV_CATEGORY[key]);

export default modelExtend(model, {
  namespace: 'availableService',

  state: {
    currentEnvViewType: ENV_CATEGORY_DATA[0],
    envViewData: ENV_CATEGORY_DATA,
    currentService: null,
    serviceData: [],
    interfaceData: [],
    InstanceData: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/service/view', location.pathname)) {
          dispatch({
            type: 'getServices',
          });
        }
      });
    },
  },
  effects: {
    *getServices(_, { call, put }) {
      const re = yield call(getServices);
      if (re.success) {
        const data = re.data || [];
        const serviceData = data.map(d => {
          return { id: d, code: d, name: d };
        });
        yield put({
          type: 'updateState',
          payload: {
            serviceData,
          },
        });
      }
    },
    *getCurrentServiceData({ payload }, { call, put }) {
      const re = yield call(getInterfacesByAppCode, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            interfaceData: re.data || [],
          },
        });
      }
    },
    *getInterfacesByAppCode({ payload }, { call, put }) {
      const re = yield call(getInterfacesByAppCode, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            interfaceData: re.data || [],
          },
        });
      }
    },
    *getInstancesByAppEnvCode({ payload }, { call, put }) {
      const re = yield call(getInstancesByAppEnvCode, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            InstanceData: re.data || [],
          },
        });
      }
    },
  },
});
