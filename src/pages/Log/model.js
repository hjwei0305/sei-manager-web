import { utils } from 'suid';
import moment from 'moment';
import { getEntityNames } from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const defaultFormat = 'YYYY-MM-DD hh:mm:00';
export default modelExtend(model, {
  namespace: 'dataAudit',

  state: {
    startTime: moment().format(defaultFormat),
    endTime: moment().format(defaultFormat),
    className: '',
    operatorName: '',
    operationCategory: '',
    propertyName: '',
    operatorAccount: '',
    propertyRemark: '',
    entityNames: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/data/audit', location.pathname)) {
          dispatch({
            type: 'getDataRoleList',
          });
        }
      });
    },
  },
  effects: {
    *getDataRoleList({ payload }, { call, put }) {
      const re = yield call(getEntityNames, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            entityNames: re.data,
          },
        });
      }
    },
  },
});
