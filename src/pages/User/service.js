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

/** 为用户组分配角色 */
export async function assignRoles(data) {
  const url = `${SERVER_PATH}/sei-manager/userRole/insertRelations`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 移除用户已分配的角色 */
export async function removeAssignedRoles(data) {
  const url = `${SERVER_PATH}/sei-manager/userRole/removeRelations`;
  return request({
    url,
    method: 'DELETE',
    data,
  });
}
