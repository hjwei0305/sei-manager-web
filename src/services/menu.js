/*
 * @Author: Eason
 * @Date:   2020-01-09 15:57:34
 * @Last Modified by: Eason
 * @Last Modified time: 2020-10-29 15:10:39
 */
import { utils } from 'suid';
import { constants, userInfoOperation } from '@/utils';

const { request } = utils;
const { getCurrentUser } = userInfoOperation;
const { SERVER_PATH } = constants;
const testPath = 'http://202.98.157.34:8100/mock/5f98deffbd240382b5a7c400/sei-manager-web';

export const getMenu = () => {
  const { userId } = getCurrentUser() || {};
  return request.get(`${testPath}/sei-basic/user/getUserAuthorizedMenus?userId=${userId}`);
};

/** 收藏菜单 */
export const collectMenu = ({ id }) =>
  request.post(`${SERVER_PATH}/sei-basic/userMenu/insertMenu/${id}`);

/** 移除收藏菜单 */
export const deCollectMenu = ({ id }) =>
  request.post(`${SERVER_PATH}/sei-basic/userMenu/removeMenu/${id}`);
