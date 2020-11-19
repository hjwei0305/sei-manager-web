import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 用户新建 */
export async function createdSave(data) {
  const url = `${SERVER_PATH}/sei-manager/user/createUser`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 用户修改保存 */
export async function editSave(data) {
  const url = `${SERVER_PATH}/sei-manager/user/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}
