/*
 * @Author: Eason
 * @Date:   2020-01-09 15:57:34
 * @Last Modified by: Eason
 * @Last Modified time: 2020-10-27 15:35:44
 */
import { utils } from 'suid';
import { constants, userInfoOperation } from '@/utils';

const { request } = utils;
const { getCurrentUser } = userInfoOperation;
const { SERVER_PATH } = constants;
export const getMenu = () => {
  const { userId } = getCurrentUser() || {};

  return request.get(`${SERVER_PATH}/sei-basic/user/getUserAuthorizedMenus?userId=${userId}`);
};

/** 收藏菜单 */
export const collectMenu = ({ id }) =>
  request.post(`${SERVER_PATH}/sei-basic/userMenu/insertMenu/${id}`);

/** 移除收藏菜单 */
export const deCollectMenu = ({ id }) =>
  request.post(`${SERVER_PATH}/sei-basic/userMenu/removeMenu/${id}`);
