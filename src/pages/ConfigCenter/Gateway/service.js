import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-manager/authWhitelist/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-manager/authWhitelist/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 同步配置到多环境 */
export async function syncConfigs(data) {
  const url = `${SERVER_PATH}/sei-manager/authWhitelist/sync`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 发布 */
export async function releaseConfigs(params) {
  const url = `${SERVER_PATH}/sei-manager/authWhitelist/publish`;
  return request({
    url,
    method: 'POST',
    params,
    data: {},
  });
}

/** 获取所有项目组 */
export async function getProjectList(params) {
  const url = `${SERVER_PATH}/sei-manager/projectGroup/getGroupTree`;
  return request({
    url,
    method: 'GET',
    params,
  });
}
