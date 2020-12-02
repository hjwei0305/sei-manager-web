import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 创建标签 */
export async function createTag(data) {
  const url = `${SERVER_PATH}/sei-manager/appModule/createTag`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除标签 */
export async function removeTag(data) {
  const { gitId, tagName } = data;
  const url = `${SERVER_PATH}/sei-manager/appModule/deleteRelease/${gitId}?tagName=${tagName}`;
  return request({
    url,
    method: 'DELETE',
    data: {},
  });
}
