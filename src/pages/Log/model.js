import { utils } from 'suid';
import { get } from 'lodash';
import { constants } from '@/utils';
import { getLogDetail, getTranceLog } from './service';

const { ENV_CATEGORY, LEVEL_CATEGORY } = constants;
const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const ENV_CATEGORY_DATA = Object.keys(ENV_CATEGORY).map(key => ENV_CATEGORY[key]);
const LEVEL_CATEGORY_DATA = Object.keys(LEVEL_CATEGORY).map(key => LEVEL_CATEGORY[key]);

export default modelExtend(model, {
  namespace: 'runtimeLog',

  state: {
    currentEnvViewType: ENV_CATEGORY_DATA[0],
    envViewData: ENV_CATEGORY_DATA,
    levelViewData: LEVEL_CATEGORY_DATA,
    currentLog: null,
    showDetail: false,
    showTranceLog: false,
    filter: {},
    logData: null,
    tranceData: [],
  },
  effects: {
    *getLogDetail({ payload }, { call, put }) {
      const { currentLog } = payload;
      yield put({
        type: 'updateState',
        payload: {
          currentLog,
          showDetail: true,
          showTranceLog: false,
        },
      });
      const serviceName = get(currentLog, 'serviceName', '') || '';
      const re = yield call(getLogDetail, {
        id: get(currentLog, 'id', null),
        serviceName: serviceName ? `${serviceName}*` : '',
      });
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            logData: re.data,
          },
        });
      }
    },
    *getTranceLog({ payload }, { call, put }) {
      const { currentLog } = payload;
      yield put({
        type: 'updateState',
        payload: {
          currentLog,
          showDetail: false,
          showTranceLog: true,
        },
      });
      const serviceName = get(currentLog, 'serviceName', '') || '';
      const re = yield call(getTranceLog, {
        traceId: get(currentLog, 'traceId', null),
        serviceName: serviceName ? `${serviceName}*` : '',
      });
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            tranceData: re.data,
          },
        });
      }
    },
    *getTranceLogDetail({ payload }, { call, put }) {
      const { currentLog } = payload;
      const serviceName = get(currentLog, 'serviceName', '') || '';
      const re = yield call(getLogDetail, {
        id: get(currentLog, 'id', null),
        serviceName: serviceName ? `${serviceName}*` : '',
      });
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            logData: re.data,
          },
        });
      }
    },
  },
});
