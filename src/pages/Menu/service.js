import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取所有菜单 */
export async function getMenuList(params) {
  const url = `${SERVER_PATH}/sei-manager/menu/getMenuTree`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/** 菜单项保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-manager/menu/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 菜单项删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-manager/menu/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 菜单项移动 */
export async function move(data) {
  const url = `${SERVER_PATH}/sei-manager/menu/move`;
  return request({
    url,
    method: 'POST',
    data,
  });
}
