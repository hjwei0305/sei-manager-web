import { utils } from 'suid';
import { constants } from '../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取列表 */
export async function getList(params) {
  const url = `${SERVER_PATH}/sei-manager/certificate/findAll`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-manager/certificate/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-manager/certificate/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
