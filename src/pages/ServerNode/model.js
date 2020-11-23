import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { constants } from '@/utils';
import { del, getList, save } from './service';

const { ENV_CATEGORY } = constants;
const evnData = Object.keys(ENV_CATEGORY).map(key => ENV_CATEGORY[key]);
const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'serverNode',

  state: {
    list: [],
    rowData: null,
    showModal: false,
    evnData,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/deploy/serverNode', location.pathname)) {
          dispatch({
            type: 'queryList',
          });
        }
      });
    },
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const re = yield call(getList, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            list: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    *save({ payload, callback }, { call }) {
      const re = yield call(save, payload);
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
  },
});
