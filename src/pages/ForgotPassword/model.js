/*
 * @Author: Eason
 * @Date:   2020-01-16 09:17:05
 * @Last Modified by: Eason
 * @Last Modified time: 2020-12-14 13:54:00
 */
import { utils, message } from 'suid';
import { getVerifyCode, checkUser, sendForgetPassword } from './service';

const { pathMatchRegexp, dvaModel, getUUID } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'forgotPassword',
  state: {
    reqId: getUUID(),
    verifyCode: null,
    successTip: '',
    email: '',
    sign: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/userForgotPassword', location.pathname)) {
          dispatch({
            type: 'getVerifyCode',
          });
        }
      });
    },
  },
  effects: {
    *checkUser({ payload, callback }, { call, put, select }) {
      const { reqId } = yield select(sel => sel.forgotPassword);
      const re = yield call(checkUser, { reqId, ...payload });
      if (re.success) {
        const { email, sign } = re.data;
        yield put({
          type: 'updateState',
          payload: {
            sign,
            email,
          },
        });
      } else {
        message.destroy();
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *sendForgetPassword({ callback }, { call, put, select }) {
      const { sign } = yield select(sel => sel.forgotPassword);
      const re = yield call(sendForgetPassword, { sign });
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            successTip: re.message,
          },
        });
      } else {
        message.destroy();
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *getVerifyCode(_, { call, put, select }) {
      const { reqId } = yield select(sel => sel.forgotPassword);
      const result = yield call(getVerifyCode, { reqId });
      const { success, data, message: msg } = result || {};
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            verifyCode: data,
          },
        });
      } else {
        message.destroy();
        message.error(msg);
      }
    },
  },
});
