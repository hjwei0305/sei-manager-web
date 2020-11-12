import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 页面功能项保存 */
export async function saveFeature(data) {
  const url = `${SERVER_PATH}/sei-manager/feature/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 功能项删除 */
export async function delFeature(params) {
  const url = `${SERVER_PATH}/sei-manager/feature/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
