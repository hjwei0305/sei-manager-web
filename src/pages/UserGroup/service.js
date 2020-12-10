import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 用户组保存 */
export async function saveUserGroup(data) {
  const url = `${SERVER_PATH}/sei-manager/userGroup/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 多用户组保存 */
export async function saveUserGroups(data) {
  const url = `${SERVER_PATH}/sei-manager/userGroup/saveList`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 用户组删除 */
export async function delUserGroup(params) {
  const url = `${SERVER_PATH}/sei-manager/userGroup/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 为用户组分配用户 */
export async function assignUsers(data) {
  const url = `${SERVER_PATH}/sei-manager/userGroupUser/insertRelations`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 用户组移除已分配的用户 */
export async function removeAssignedUsers(data) {
  const url = `${SERVER_PATH}/sei-manager/userGroupUser/removeRelations`;
  return request({
    url,
    method: 'DELETE',
    data,
  });
}
