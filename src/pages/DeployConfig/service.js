import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 保存部署配置 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-manager/deployConfig/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除部署配置 */
export async function remove(data) {
  const { id } = data;
  const url = `${SERVER_PATH}/sei-manager/deployConfig/delete/${id}`;
  return request({
    url,
    method: 'DELETE',
    data: {},
  });
}

/** 初始化模块部署 */
export async function initDeploy(data) {
  const { id } = data;
  const url = `${SERVER_PATH}/sei-manager/deployConfig/initializeDeploy/${id}`;
  return request({
    url,
    method: 'POST',
    data: {},
  });
}
