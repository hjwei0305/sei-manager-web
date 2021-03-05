import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 配置新建保存 */
export async function saveConfig(data) {
  const url = `${SERVER_PATH}/sei-manager/userGroup/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 配置修改保存 */
export async function saveConfigItem(data) {
  const url = `${SERVER_PATH}/sei-manager/userGroup/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 配置项删除 */
export async function delConfigItem(params) {
  const url = `${SERVER_PATH}/sei-manager/userGroup/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 获取比对配置 */
export async function getCompareConfig(data) {
  const url = `${SERVER_PATH}/sei-manager/userGroupUser/insertRelations`;
  return request({
    url,
    data,
  });
}
