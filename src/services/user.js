/*
 * @Author: Eason
 * @Date:   2020-01-16 09:17:57
 * @Last Modified by: Eason
 * @Last Modified time: 2020-10-27 15:38:39
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 更新密码 */
export const updatePwd = data =>
  request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-auth/account/updatePassword`,
    data,
    headers: {
      needToken: false,
    },
  });

/**
 * 单点登录获取用户信息
 * @param {object} data 参数
 */
export const getUserByXsid = params =>
  request({
    url: `${SERVER_PATH}/sei-auth/auth/getSessionUser?sid=${params.sid}`,
    headers: {
      needToken: false,
      'x-sid': params.sid,
    },
  });

/**
 * 绑定社交账号
 * @param {object} data 参数
 */
export const bindingSocialAccount = data =>
  request.post(`${SERVER_PATH}/sei-auth/sso/binding/socialAccount`, data, {
    headers: {
      needToken: false,
    },
  });

/**
 * 登录方法
 * @param {object} params [参数]
 * account {string} 账号
 * password {string} 密码
 * tenant {string} 租户
 * id {string} 唯一值
 */
export async function userLogin(params) {
  return request.post(`${SERVER_PATH}/sei-auth/auth/login`, params, {
    headers: {
      needToken: false,
    },
  });
}

/**
 * 用户退出
 * @param  {object} params {sid: ''}
 */
export async function userLogout(params) {
  return request({
    url: `${SERVER_PATH}/sei-auth/auth/logout`,
    method: 'POST',
    data: params.sid,
  });
}

/** 获取验证码 */
export async function getVerifyCode(reqId) {
  return request({
    method: 'GET',
    url: `${SERVER_PATH}/verifyCode/generate?reqId=${reqId}`,
    headers: {
      needToken: false,
    },
  });
}

/** 获取生成二维码配置信息 */
export async function authorizeData(authType = 'weChat') {
  return request({
    method: 'GET',
    url: `${SERVER_PATH}/sso/authorizeData?authType=${authType}`,
    headers: {
      needToken: false,
    },
  });
}

/** 获取wechat, sdk,配置信息 */
export async function getWeChatCfg(params = { authType: 'weChat' }) {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sso/js/sdk`,
    params,
  });
}

/** 获取当前用户有权限的功能项集合 */
export async function getAuthorizedFeatures(userId) {
  return request.get(`${SERVER_PATH}/auth/getAuthorizedFeatures?userId=${userId}`);
}

/** 清除用户缓存 */
export async function clearUserAuthCaches(userId) {
  return request.post(`${SERVER_PATH}/sei-basic/user/clearUserAuthorizedCaches/${userId}`);
}

export const getPortrait = (params = {}) =>
  request({
    method: 'GET',
    url: `${SERVER_PATH}/sei-basic/userProfile/findPortrait`,
    params,
  });

/**
 * 忘记密码，发送验证码
 */
export const sendVerifyCode = (params = {}) =>
  request({
    method: 'GET',
    url: `${SERVER_PATH}/account/sendVerifyCode`,
    params,
  });

/**
 * 检查账号是否存在
 * @param {*} params
 */
export const checkExisted = ({ openId, reqId, tenant, verifyCode }) =>
  request({
    method: 'POST',
    url: `${SERVER_PATH}/account/checkExisted`,
    data: {
      openId,
      reqId,
      tenant,
      verifyCode,
    },
  });

/**
 * 找会密码
 */
export const findpwd = ({ id, newPassword, verifyCode }) =>
  request({
    method: 'POST',
    url: `${SERVER_PATH}/account/findpwd`,
    data: {
      id,
      newPassword,
      verifyCode,
    },
  });
