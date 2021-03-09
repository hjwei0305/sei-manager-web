import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 配置新建保存 */
export async function saveConfig(data) {
  const url = `${SERVER_PATH}/sei-manager/appConfig/addConfig`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 配置修改保存 */
export async function saveConfigItem(data) {
  const url = `${SERVER_PATH}/sei-manager/appConfig/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 配置项删除 */
export async function delConfigItem(params) {
  const url = `${SERVER_PATH}/sei-manager/appConfig/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 批量禁用配置 */
export async function disableConfig(data) {
  const url = `${SERVER_PATH}/sei-manager/appConfig/disableConfig`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 批量启用配置 */
export async function enableConfig(data) {
  const url = `${SERVER_PATH}/sei-manager/appConfig/enableConfig`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 同步配置到多环境 */
export async function syncConfigs(data) {
  const url = `${SERVER_PATH}/sei-manager/appConfig/syncConfigs`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 发布前比较 */
export async function compareBeforeRelease(data) {
  const { appCode, envCode } = data;
  const url = `${SERVER_PATH}/sei-manager/appConfig/compareBeforeRelease/${appCode}/${envCode}`;
  return request({
    url,
    method: 'POST',
    data: {},
  });
}

/** 发布前比较 */
export async function appRelease(data) {
  const { appCode, envCode } = data;
  const url = `${SERVER_PATH}/sei-manager/appConfig/release/${appCode}/${envCode}`;
  return request({
    url,
    method: 'POST',
    data: {},
  });
}

/** 获取应用yaml格式配置 */
export async function getYamlData(data) {
  const { appCode, envCode } = data;
  const url = `${SERVER_PATH}/sei-manager/appConfig/getYamlData/${appCode}/${envCode}`;
  return request({
    url,
  });
}

/** 保存应用yaml格式配置 */
export async function saveYamlData(data) {
  const { yamlText, appCode, envCode } = data;
  const url = `${SERVER_PATH}/sei-manager/appConfig/saveYamlData/${appCode}/${envCode}`;
  return request({
    url,
    method: 'POST',
    data: {
      yaml: yamlText,
    },
  });
}
