/*
 * @Author: Eason
 * @Date:   2020-01-09 15:57:34
 * @Last Modified by: Eason
 * @Last Modified time: 2020-11-10 16:46:38
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { SERVER_PATH, LOCAL_PATH } = constants;

/** 获取所有的大屏模板 */
export const getMenu = () => {
  const url = `${LOCAL_PATH}/local/menu.json`;
  return request({
    url,
    method: 'GET',
  });
};

/** 收藏菜单 */
export const collectMenu = ({ id }) =>
  request.post(`${SERVER_PATH}/sei-basic/userMenu/insertMenu/${id}`);

/** 移除收藏菜单 */
export const deCollectMenu = ({ id }) =>
  request.post(`${SERVER_PATH}/sei-basic/userMenu/removeMenu/${id}`);
