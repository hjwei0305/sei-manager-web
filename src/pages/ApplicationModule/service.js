/*
 * @Author: Eason
 * @Date:   2020-01-16 09:17:57
 * @Last Modified by: Eason
 * @Last Modified time: 2020-12-15 09:25:12
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 移除应用模块用户 */
export async function removeModuleUser(params) {
  const { gitUserIds, gitId } = params;
  return request({
    method: 'DELETE',
    url: `${SERVER_PATH}/sei-manager/appModule/removeModuleUser/${gitId}`,
    data: gitUserIds,
  });
}
