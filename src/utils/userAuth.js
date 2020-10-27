/*
 * @Author: zp
 * @Date:   2020-01-16 10:51:41
 * @Last Modified by: zp
 * @Last Modified time: 2020-08-27 12:05:34
 */
import { utils } from 'suid';

const { sessionStorage, localStorage } = utils.storage;
const { CONST_GLOBAL } = utils.constants;
const { CURRENT_USER, TOKEN_KEY, CURRENT_LOCALE, AUTH, POLICY } = CONST_GLOBAL;

/** 用户信息保存到session */
export const setCurrentUser = user => {
  sessionStorage.set(CURRENT_USER, user);
};

/** 获取当前用户信息 */
export const getCurrentUser = () => sessionStorage.get(CURRENT_USER);

export const getCurrentLocale = () => {
  const temp = window.localStorage.getItem(CURRENT_LOCALE);
  if (temp) {
    try {
      window.atob(temp);
      return localStorage.get(CURRENT_LOCALE);
    } catch {
      try {
        return JSON.parse(temp);
      } catch {
        return temp;
      }
    }
  }
  return null;
};

export const setCurrentLocale = locale => {
  localStorage.set(CURRENT_LOCALE, locale);
};

export const setCurrentAuth = auths => sessionStorage.set(AUTH, auths);
export const setCurrentPolicy = policy => sessionStorage.set(POLICY, policy);

export const adaptLocale = locale => {
  if (locale) {
    if (locale.includes('-')) {
      return locale.split('-').join('_');
    }
    return locale.split('_').join('-');
  }
  return 'zh_CN';
};

/** sid保存到session */
export const setSessionId = sid => {
  sessionStorage.set(TOKEN_KEY, sid);
};

/** 获取当前sid */
export const getSessionId = () => sessionStorage.get(TOKEN_KEY);

/** 根据键清空 */
export const clearUserInfo = () => sessionStorage.clear([CURRENT_USER, TOKEN_KEY]);

/** 处理sessionUser */
export const processSessionUser = (userInfo = {}) => {
  const { sessionId, locale, authorityPolicy } = userInfo;
  setSessionId(sessionId);
  setCurrentPolicy(authorityPolicy);
  setCurrentLocale(adaptLocale(locale || 'zh_CN'));
  setCurrentUser(userInfo);
};
