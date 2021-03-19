import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { del, getProjectList, save } from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'projectGroup',

  state: {
    treeData: [],
    currentNode: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/integration/projectGroup', location.pathname)) {
          dispatch({
            type: 'getProjectList',
          });
        }
      });
    },
  },
  effects: {
    *getProjectList({ payload }, { call, put }) {
      const re = yield call(getProjectList, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            treeData: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    *save({ payload, callback }, { call, put }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentNode: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *del({ payload, callback }, { call, put }) {
      const re = yield call(del, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentNode: null,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
