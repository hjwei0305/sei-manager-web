import { utils } from 'suid';
import { get } from 'lodash';
import moment from 'moment';
import { constants } from '@/utils';
import { getLogDetail, getTranceLog, getServices } from './service';

const { LEVEL_CATEGORY, SEARCH_DATE_PERIOD } = constants;
const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;
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
    currentEnvViewType: null,
    envViewData: [],
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
    *getServices(_, { call, put, select }) {
      const { envData } = yield select(sel => sel.menu);
      let currentEnvViewType = null;
      let envViewData = [];
      if (envData && envData.length > 0) {
        envViewData = envData;
        [currentEnvViewType] = envData;
      }
      const agentServer = get(currentEnvViewType, 'agentServer');
      yield put({
        type: 'updateState',
        payload: {
          currentEnvViewType,
          envViewData,
        },
      });
      const re = yield call(getServices, { agentServer });
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            serviceList: re.data || [],
          },
        });
      }
    },
    *getLogDetail({ payload }, { call, put, select }) {
      const { currentEnvViewType } = yield select(sel => sel.runtimeLog);
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
        agentServer: get(currentEnvViewType, 'agentServer'),
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
    *getTranceLog({ payload }, { call, put, select }) {
      const { currentEnvViewType } = yield select(sel => sel.runtimeLog);
      const agentServer = get(currentEnvViewType, 'agentServer');
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
        agentServer,
        traceId: get(currentLog, 'traceId', null),
        serviceName: serviceName ? `${serviceName}*` : '',
      });
      if (re.success) {
        let logData = null;
        const reLog = yield call(getLogDetail, {
          agentServer,
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
    *getTranceLogDetail({ payload }, { call, put, select }) {
      const { currentEnvViewType } = yield select(sel => sel.runtimeLog);
      const agentServer = get(currentEnvViewType, 'agentServer');
      const { currentLog } = payload;
      const serviceName = get(currentLog, 'serviceName', '') || '';
      const re = yield call(getLogDetail, {
        agentServer,
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
