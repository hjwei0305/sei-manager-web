/*
 * @Author: Eason
 * @Date:   2020-01-16 09:17:05
 * @Last Modified by: Eason
 * @Last Modified time: 2020-12-10 10:27:30
 */
import { utils, message } from 'suid';
import { getVerifyCode, goSignup } from './service';

const { pathMatchRegexp, dvaModel, getUUID } = utils;
const { modelExtend, model } = dvaModel;
const suffixHostData = [
  { id: 1, host: '@changhong.com' },
  { id: 2, host: '@qq.com' },
  { id: 3, host: '@gmail.com' },
  { id: 4, host: '@hotmail.com' },
  { id: 5, host: '@msn.com' },
  { id: 6, host: '@163.com' },
  { id: 7, host: '@163.net' },
];

export default modelExtend(model, {
  namespace: 'userSignup',
  state: {
    loginReqId: getUUID(),
    verifyCode: null,
    successTip: '',
    suffixHostData,
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
    *goSignup({ payload, callback }, { call, select, put }) {
      const { loginReqId } = yield select(sel => sel.userSignup);
      const re = yield call(goSignup, { reqId: loginReqId, ...payload });
      const { success, message: msg } = re || {};
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            successTip: msg,
          },
        });
      } else {
        message.destroy();
        message.error(msg);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
