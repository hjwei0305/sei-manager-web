/*
 * @Author: Eason
 * @Date:   2020-01-16 09:17:57
 * @Last Modified by: Eason
 * @Last Modified time: 2020-12-14 14:17:08
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取用户信息 */
export async function getUser(params) {
  return request({
    method: 'GET',
    url: `${SERVER_PATH}/sei-manager/user/findOne`,
    params,
  });
}

/**
 * 保存用户个人信息
 */
export async function saveUser(data) {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-manager/user/save`,
    data,
  });
}

/**
 * 修改密码
 * @account string
 * @oldPassword string
 * @password string
 */
export async function updatePassword(data) {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-manager/user/updatePassword`,
    data,
  });
}
