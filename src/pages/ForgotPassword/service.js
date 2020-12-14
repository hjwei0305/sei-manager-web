/*
 * @Author: Eason
 * @Date:   2020-01-16 09:17:57
 * @Last Modified by: Eason
 * @Last Modified time: 2020-12-14 10:53:37
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
 * 验证用户
 * @reqId string
 * @usernameOrEmailOrPhone string
 * @verifyCode string
 */
export async function checkUser(data) {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-manager/user/forgetPassword/checkUser`,
    data,
    headers: {
      needToken: false,
    },
  });
}

/**
 * 验证用户成功后，发送密码到邮箱
 * @sign
 */
export async function sendForgetPassword(params) {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-manager/user/forgetPassword/${params.sign}`,
    headers: {
      needToken: false,
    },
  });
}
