/*
 * @Author: Eason
 * @Date:   2020-01-16 09:17:05
 * @Last Modified by: Eason
 * @Last Modified time: 2020-11-12 16:59:01
 */
import { router } from 'umi';
import { notification } from 'antd';
import { setLocale } from 'umi-plugin-react/locale';
import { message, utils } from 'suid';
import {
  userLogin,
  userLogout,
  bindingSocialAccount,
  getVerifyCode,
  getUserByXsid,
  updatePwd,
  getPortrait,
  sendVerifyCode,
  findpwd,
  checkExisted,
} from '@/services/user';
import { userInfoOperation, eventBus, constants } from '@/utils';

const { storage } = utils;
const defaultHeadIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAFhUlEQVRYR71Za4gbVRT+zkyaZNLdbWvJPvrY7U0o/pCWKiwIUnUtCEKLVOsDRCmCpX8KChaK1IqPIkJRKIpof2gRwa5YoRT8VWgVH1hf1PaHQmamqU1rtvtod5PdPGaunLBZstlscu+k7gdDyOz5vvPNzb13zrlLaANSypDrutsA3AtgM4AkgDUA7piVHQOQAZACcAHAT67rnhkaGioHTUtBiKlUarthGM8A2AkgoqlRAPC17/ufJ5PJ05pcaBl2HOdpAPsB3KObqFE8Ef0qpTwihPhCVU/JsG3bdxqGcURKuV1VWCeOiE77vv9yIpH4qxWvpeHLly8/6/v+xwCircTa/PuMlHJPIpH4rJlOU8Ou6x6UUr7ZphEtupTy1UQi8dZipEUN27Z9mIhe0cp2m4KJ6PCGDRsONpz3jW46jnMAwNu3KX9QmQNCiHfqyQtG2HGcpwAor1oWjEaj6OrqQigUqlyGYczlmZmZwdTUVOXShe/7u5LJ5Fe1vHmGM5lMf6FQ+APAKlXx1atXo7Ozs2W453m4cuVKy7i6gBEp5aZEIvFv9f48w7ZtDxPRE6qqbJQNqyKfzyObzaqGV+OOCyF2LzBs2/YOIjqlqsY/fV9fH0zTVKVU4m7evInx8XEtDoAhIcRZJs2NsOM4fOMBVSXVqVCvJ6XEtWvXUCwWVVNx3CkhxKNzhm3bvp+IzukorFu3rrLAgmBsbAy3bt3Sopqmuam/v/9iZYQdx/kQwF5VBTbKhoOCd4wbN25o0at7c9Uwl4B9qgqWZaGnp0c1fEFcoVCoTAtN/CmE2EyO42wB8LsOefny5YjH4zqUebGlUglXr17V5nue10+2bb9ARFzcKEN3O6sXDrgng4ge5xF+F8BLym4BrFy5snIFBe8UmUwGPNI6IKJD5Lrul1LKXarEcDiMNWu4C2oPExMT4EsTn/IInwHwkA6xnS2tmuf69evgOkMT37DhH2ebSGVuu1OCjbJhXRDR92xY6w1XTcLbGm9vuuD5y2Z5awuAs2z45Gz3q8WPRCLo7e3llavFC/KWq0lwkhfdUSnlPq2ss8ErVqzAqlXKlShyuRxGRkaCpKpyjvI+vI+IjgZV6e7uRiwWa0kvl8uVqcCfQcEDy4a3EtG3QUW4vGTTPEWagWuHIF1HraZhGFtJSmk6jjNNRMuCmlYpNV3XDSpf4Ukpi0IIq1r8cOG+I4gi93O8Y7RafAFfFLWWKjVx1TC3IJ/oGu7o6AAvvGXL1H4cbpF4WvBnAOwWQhyvGB4eHjYHBwe52aqeOjbV42qNCyAe3SDQNU5EowMDA91E5Ne2SK8DONTMAL8ouJ0P8sJopMvGJycnMT093fS5fd9/I5lMvsZBc4YvXbrUEYvFbAALCl3uMHi/5ZH9P8DThBtTLjsbIGtZVqK3tzc3zzB/sW17DxF9VEtqt27QeUAu6utLztkDwmNVnUYnPycAPFkNWLt2rfKi0jHXKJZHmY8BanBCCMFn0nNYYHh0dLRrcnLyBynlXbyouF5YKtT2ekR0sVQq3bdx48Z57XXDyiWVSm0iojPxeDzOW9dSIp1Ow/f9rGma27itr8+9aKmVTqcH169f//NSmuVc2Wx2Ympq6uFkMnm+Ue6mtWE+n3/Rsqz3ltK053nvh0KhRavHlsVsuVx+jEXC4bDyuUWQBywWi/8Q0c5wOPxLM35Lw1VyLpc7Fg6HnwuFQuEghhbj+L7vF4vF45ZlPa+iq2yYxaSU3fl8/gPTNB+JRCJtvUU8zyuVSqVz0Wh0PxHxmbQStAzXKo6Pj/No741Go3eHQiHloqJUKqXL5fKwZVn8PxTtPj+w4TrzAwAeBLDFNE1hmmaPaZqdhmHEPM/7W0p5wTCM7yKRyG9EpH9GVZPsP4tSI7alLL2bAAAAAElFTkSuQmCC';

const { LOCALE_USER_LIST_KEY } = constants;
const {
  setCurrentUser,
  setSessionId,
  clearUserInfo,
  setCurrentLocale,
  getCurrentLocale,
  adaptLocale,
  setCurrentPolicy,
} = userInfoOperation;

export default {
  namespace: 'user',

  state: {
    userInfo: null,
    sessionId: null,
    verifyCode: null,
    qrConfig: null,
  },

  subscriptions: {
    eventBusListenter({ dispatch }) {
      eventBus.addListener('redirectLogin', () => {
        dispatch({
          type: 'redirectLogin',
        });
      });
    },
  },

  effects: {
    *processUser({ payload }, { put, call }) {
      const { userInfo } = payload;
      const { sessionId, locale, authorityPolicy, account, userName } = userInfo || {};
      const userData = storage.localStorage.get(LOCALE_USER_LIST_KEY) || [];
      const localUsers = userData.filter(u => u.account === account);
      if (localUsers.length === 0) {
        userData.unshift({ account, userName });
      }
      storage.localStorage.set(LOCALE_USER_LIST_KEY, userData);
      let portrait = defaultHeadIcon;
      setSessionId(sessionId);
      setCurrentPolicy(authorityPolicy);
      setCurrentLocale(adaptLocale(locale || 'zh_CN'));
      setLocale(adaptLocale(locale || 'zh_CN'));
      const resultPortrait = yield call(getPortrait);
      if (resultPortrait.success) {
        portrait = resultPortrait.data || defaultHeadIcon;
      }
      yield put({
        type: 'updateState',
        payload: {
          userInfo: {
            ...userInfo,
            portrait,
          },
          sessionId,
        },
      });
      setCurrentUser({ ...userInfo, portrait });
    },
    *bindingSocialAccount({ payload }, { call }) {
      const result = yield call(bindingSocialAccount, payload);
      const { success, data, message: msg } = result || {};
      if (success) {
        if (data && data.redirectUrl) {
          window.open(data.redirectUrl, '_self');
        }
      } else {
        notification.error({
          message: '请求错误',
          description: msg,
        });
      }
    },
    *getUserByXsid({ payload }, { put, call, take }) {
      const result = yield call(getUserByXsid, payload);
      const { success, data, message: msg } = result || {};
      if (success) {
        yield put({
          type: 'processUser',
          payload: {
            userInfo: data,
          },
        });
        yield take('processUser/@@end');
        router.replace('/');
      } else {
        notification.error({
          message: '请求错误',
          description: msg,
        });
      }

      return result;
    },
    *userLogin({ payload }, { put, take }) {
      const result = yield userLogin({ ...payload, locale: adaptLocale(getCurrentLocale()) });
      const { success, data, message: msg } = result || {};
      if (success) {
        yield put({
          type: 'menu/updateState',
          payload: {
            loginVisible: false,
          },
        });
        yield put({
          type: 'processUser',
          payload: {
            userInfo: data,
          },
        });
        yield take('processUser/@@end');
        /** 更新菜单相关状态 */
        yield put({
          type: 'menu/updateState',
          payload: {
            visibleTabData: [],
            moreTabData: [],
            activedMenu: null,
          },
        });
        router.replace('/');
      } else {
        notification.error({
          message: '请求错误',
          description: msg,
        });
      }
      return result;
    },
    *updatePwd({ payload }, { call }) {
      const result = yield call(updatePwd, payload);
      const { success, message: msg } = result || {};
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *quickLogin({ payload }, { put, take }) {
      const result = yield userLogin({ ...payload, locale: adaptLocale(getCurrentLocale()) });
      const { success, data, message: msg } = result || {};
      const { loginStatus } = data || {};
      if (success && loginStatus === 'success') {
        yield put({
          type: 'processUser',
          payload: {
            userInfo: data,
          },
        });
        yield take('processUser/@@end');
      } else {
        notification.error({
          message: '请求错误',
          description: msg,
        });
      }

      return result;
    },
    *userLogout(_, { put }) {
      router.replace('/user/login');
      yield userLogout();
      clearUserInfo();
      yield put({
        type: 'updateState',
        payload: {
          userInfo: null,
        },
      });
      /** 更新菜单相关状态 */
      yield put({
        type: 'menu/updateState',
        payload: {
          visibleTabData: [],
          moreTabData: [],
          activedMenu: null,
        },
      });
    },
    *redirectLogin(_, { put }) {
      router.replace('/user/login');
      /** 更新菜单相关状态 */
      yield put({
        type: 'menu/updateState',
        payload: {
          visibleTabData: [],
          moreTabData: [],
          activedMenu: null,
        },
      });
    },
    *getVerifyCode({ payload }, { call, put }) {
      const result = yield call(getVerifyCode, payload.reqId);
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
    *sendVerifyCode({ payload }, { call }) {
      const result = yield call(sendVerifyCode, payload);
      const { success, message: msg } = result || {};
      if (success) {
        message.success(msg);
        // TODO:
        // yield put({
        //   type: 'updateState',
        //   payload: {
        //     verifyCode: data,
        //   },
        // });
      } else {
        message.error(msg);
      }
      return result;
    },
    *checkExisted({ payload }, { call }) {
      const result = yield call(checkExisted, payload);
      const { success, message: msg } = result || {};
      if (success) {
        // TODO:
        // yield put({
        //   type: 'updateState',
        //   payload: {
        //     verifyCode: data,
        //   },
        // });
      } else {
        message.error(msg);
      }
      return result;
    },
    *findpwd({ payload }, { call }) {
      const result = yield call(findpwd, payload);
      const { success, message: msg } = result || {};
      if (success) {
        // TODO:
        // yield put({
        //   type: 'updateState',
        //   payload: {
        //     verifyCode: data,
        //   },
        // });
      } else {
        message.error(msg);
      }
      return result;
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
