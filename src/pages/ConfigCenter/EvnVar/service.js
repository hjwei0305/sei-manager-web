import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-manager/envVariable/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 保存环境变量值 */
export async function saveVariableValue(data) {
  const url = `${SERVER_PATH}/sei-manager/envVariable/saveVariableValue`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-manager/envVariable/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
