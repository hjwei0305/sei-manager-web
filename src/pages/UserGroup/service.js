import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH, MOCKER_PATH } = constants;

/** 获取用户组列表 */
export async function getUserGroupList() {
  const url = `${MOCKER_PATH}/sei-manager/authUser/getUserGroupList`;
  return request({
    url,
    method: 'GET',
  });
}

/** 用户组保存 */
export async function saveUserGroup(data) {
  const url = `${SERVER_PATH}/sei-basic/userGroup/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 用户组删除 */
export async function delUserGroup(params) {
  const url = `${SERVER_PATH}/sei-basic/userGroup/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 用户保存 */
export async function saveUser(data) {
  const url = `${SERVER_PATH}/sei-basic/authUser/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 用户删除 */
export async function delUser(params) {
  const url = `${SERVER_PATH}/sei-basic/authUser/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 获取用户列表 */
export async function getUserItemList(params) {
  const url = `${SERVER_PATH}/sei-basic/authUser/findChildByUserId`;
  return request({
    url,
    method: 'GET',
    params,
  });
}
