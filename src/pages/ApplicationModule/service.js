/*
 * @Author: Eason
 * @Date:   2020-01-16 09:17:57
 * @Last Modified by: Eason
 * @Last Modified time: 2021-03-31 11:03:20
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 移除应用模块用户 */
export async function removeModuleUser(params) {
  const { accounts, moduleId } = params;
  return request({
    method: 'DELETE',
    url: `${SERVER_PATH}/sei-manager/appModule/removeModuleUser/${moduleId}`,
    data: accounts,
  });
}

/** 为应用模块添加用户 */
export async function addModuleUser(data) {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-manager/projectUser/assign`,
    data,
  });
}

/** 获取日志详情 */
export async function getVersionDetail(params) {
  return request({
    url: `${SERVER_PATH}/sei-manager/releaseVersion/findOne`,
    params,
  });
}

/** 应用模块派生二开模块 */
export async function deriveModule(data) {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-manager/projectUser/assign`,
    data,
  });
}
