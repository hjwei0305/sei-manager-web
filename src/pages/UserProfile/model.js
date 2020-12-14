/*
 * @Author: Eason
 * @Date:   2020-01-16 09:17:05
 * @Last Modified by: Eason
 * @Last Modified time: 2020-12-14 14:42:37
 */
import { utils, message } from 'suid';
import { getUser, saveUser, updatePassword } from './service';
import { userUtils } from '../../utils';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const { getCurrentUser } = userUtils;

export default modelExtend(model, {
  namespace: 'userProfile',
  state: {
    userData: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/my-center/userProfile', location.pathname)) {
          dispatch({
            type: 'getUser',
          });
        }
      });
    },
  },
  effects: {
    *getUser(_, { call, put }) {
      const { userId } = getCurrentUser();
      const re = yield call(getUser, { id: userId });
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            userData: re.data,
          },
        });
      } else {
        message.destroy();
        message.error(re.message);
      }
    },
    *saveUser({ payload }, { call }) {
      const re = yield call(saveUser, payload);
      message.destroy();
      if (re.success) {
        message.success('保存成功');
      } else {
        message.error(re.message);
      }
    },
    *updatePassword({ payload, callback }, { call }) {
      const re = yield call(updatePassword, payload);
      message.destroy();
      if (re.success) {
        message.success('密码修改成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
