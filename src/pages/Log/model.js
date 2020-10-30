import { utils } from 'suid';
import { get } from 'lodash';
import moment from 'moment';
import { constants } from '@/utils';
import { getLogDetail, getTranceLog, getServices } from './service';

const { ENV_CATEGORY, LEVEL_CATEGORY, SEARCH_DATE_PERIOD } = constants;
const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const ENV_CATEGORY_DATA = Object.keys(ENV_CATEGORY).map(key => ENV_CATEGORY[key]);
const LEVEL_CATEGORY_DATA = Object.keys(LEVEL_CATEGORY).map(key => LEVEL_CATEGORY[key]);

const getDefaultTimeViewType = () => {
  const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
  const startTime = moment(endTime)
    .subtract(5, 'minute')
    .format('YYYY-MM-DD HH:mm:ss');
  return [startTime, endTime];
};

export default modelExtend(model, {
  namespace: 'runtimeLog',

  state: {
    currentTimeViewType: SEARCH_DATE_PERIOD.THIS_5M,
    currentEnvViewType: ENV_CATEGORY_DATA[0],
    envViewData: ENV_CATEGORY_DATA,
    levelViewData: LEVEL_CATEGORY_DATA,
    currentLog: null,
    showDetail: false,
    showTranceLog: false,
    filter: { timestamp: getDefaultTimeViewType() },
    logData: null,
    tranceData: [],
    serviceList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/log/logRecord', location.pathname)) {
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
        yield put({
          type: 'updateState',
          payload: {
            serviceList: re.data || [],
          },
        });
      }
    },
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
        let logData = null;
        const reLog = yield call(getLogDetail, {
          id: get(currentLog, 'id', null),
          serviceName: serviceName ? `${serviceName}*` : '',
        });
        if (reLog.success) {
          logData = reLog.data;
        }
        yield put({
          type: 'updateState',
          payload: {
            tranceData: re.data,
            logData,
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
