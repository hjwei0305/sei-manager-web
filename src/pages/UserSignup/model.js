/*
 * @Author: Eason
 * @Date:   2020-01-16 09:17:05
 * @Last Modified by: Eason
 * @Last Modified time: 2020-12-09 15:37:27
 */
import { utils, message } from 'suid';
import { getVerifyCode, goSignup } from './service';

const { pathMatchRegexp, dvaModel, getUUID } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'userSignup',
  state: {
    loginReqId: getUUID(),
    verifyCode: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/userSignup', location.pathname)) {
          dispatch({
            type: 'getVerifyCode',
          });
        }
      });
    },
  },
  effects: {
    *getVerifyCode(_, { call, put, select }) {
      const { loginReqId } = yield select(sel => sel.userSignup);
      const result = yield call(getVerifyCode, { reqId: loginReqId });
      const { success, data, message: msg } = result || {};
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            verifyCode: data,
          },
        });
      } else {
        message.error(msg);
      }
      return result;
    },
    *goSignup({ payload, callback }, { call, select }) {
      const { loginReqId } = yield select(sel => sel.userSignup);
      const re = yield call(goSignup, { reqId: loginReqId, ...payload });
      const { success, message: msg } = re || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
