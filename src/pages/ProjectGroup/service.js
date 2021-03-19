import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取所有项目 */
export async function getProjectList(params) {
  const url = `${SERVER_PATH}/sei-manager/projectGroup/getGroupTree`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/** 项目保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-manager/projectGroup/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 项目删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-manager/projectGroup/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
