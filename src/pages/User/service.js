import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取应用模块列表 */
export async function getList(params) {
  const url = `${SERVER_PATH}/sei-basic/appModule/findAll`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/** 应用模块保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-basic/appModule/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 应用模块删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-basic/appModule/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
