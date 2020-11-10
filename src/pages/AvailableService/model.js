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
    instanceData: [],
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
    *clearState(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          currentEnvViewType: ENV_CATEGORY_DATA[0],
          envViewData: ENV_CATEGORY_DATA,
          currentService: null,
          serviceData: [],
          interfaceData: [],
          instanceData: [],
        },
      });
    },
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
    *getCurrentServiceData({ payload }, { call, put, select }) {
      const { currentService } = payload;
      const { currentEnvViewType } = yield select(sel => sel.availableService);
      yield put({
        type: 'updateState',
        payload: {
          currentService,
        },
      });
      let interfaceData = [];
      let instanceData = [];
      const resInterface = yield call(getInterfacesByAppCode, { appCode: currentService.code });
      if (resInterface.success) {
        interfaceData = resInterface.data || [];
      }
      const resInstanceData = yield call(getInstancesByAppEnvCode, {
        envCode: currentEnvViewType.key,
        appCode: currentService.code,
      });
      if (resInstanceData.success) {
        instanceData = resInstanceData.data || [];
      }
      yield put({
        type: 'updateState',
        payload: {
          interfaceData,
          instanceData,
        },
      });
    },
  },
});
