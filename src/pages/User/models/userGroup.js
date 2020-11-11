import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { delUserGroup, getUserGroupList, saveUserGroup } from '../service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'userGroup',

  state: {
    listData: [],
    currentUserGroup: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/backConfig/feature', location.pathname)) {
          dispatch({
            type: 'queryUserGroupList',
          });
        }
      });
    },
  },
  effects: {
    *queryUserGroupList({ payload }, { call, put }) {
      const re = yield call(getUserGroupList, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            listData: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    *saveUserGroup({ payload, callback }, { call, put }) {
      const re = yield call(saveUserGroup, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentUserGroup: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *delUserGroup({ payload, callback }, { call, put }) {
      const re = yield call(delUserGroup, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentUserGroup: null,
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
