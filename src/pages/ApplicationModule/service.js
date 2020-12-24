/*
 * @Author: Eason
 * @Date:   2020-01-16 09:17:57
 * @Last Modified by: Eason
 * @Last Modified time: 2020-12-24 15:29:17
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 移除应用模块用户 */
export async function removeModuleUser(params) {
  const { gitUserIds, gitId } = params;
  return request({
    method: 'DELETE',
    url: `${SERVER_PATH}/sei-manager/appModule/removeModuleUser/${gitId}`,
    data: gitUserIds,
  });
}

/** 为应用模块添加用户 */
export async function addModuleUser(data) {
  const { gitId, accounts } = data;
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-manager/appModule/addModuleUser/${gitId}`,
    data: accounts,
  });
}
