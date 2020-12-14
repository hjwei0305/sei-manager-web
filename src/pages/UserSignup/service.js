/*
 * @Author: Eason
 * @Date:   2020-01-16 09:17:57
 * @Last Modified by: Eason
 * @Last Modified time: 2020-12-10 11:45:43
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取验证码 */
export async function getVerifyCode(params) {
  return request({
    method: 'GET',
    url: `${SERVER_PATH}/sei-manager/user/generate?reqId=${params.reqId}`,
    headers: {
      needToken: false,
    },
  });
}

/**
 * 提交注册
 */
export async function goSignup(data) {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-manager/user/registered`,
    data,
    headers: {
      needToken: false,
    },
  });
}

/** 获取支持的邮箱 */
export async function getMailServer() {
  return request({
    method: 'GET',
    url: `${SERVER_PATH}/sei-manager/user/getMailServer`,
    headers: {
      needToken: false,
    },
  });
}