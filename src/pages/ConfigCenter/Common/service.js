import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 配置新建保存 */
export async function saveConfig(data) {
  const url = `${SERVER_PATH}/sei-manager/generalConfig/addConfig`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 配置修改保存 */
export async function saveConfigItem(data) {
  const url = `${SERVER_PATH}/sei-manager/generalConfig/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 配置项删除 */
export async function delConfigItem(params) {
  const url = `${SERVER_PATH}/sei-manager/generalConfig/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 批量停用配置 */
export async function disableConfig(data) {
  const url = `${SERVER_PATH}/sei-manager/generalConfig/disableConfig`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 批量启用配置 */
export async function enableConfig(data) {
  const url = `${SERVER_PATH}/sei-manager/generalConfig/enableConfig`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 同步配置到多环境 */
export async function syncConfigs(data) {
  const url = `${SERVER_PATH}/sei-manager/generalConfig/syncConfigs`;
  return request({
    url,
    method: 'POST',
    data,
  });
}
