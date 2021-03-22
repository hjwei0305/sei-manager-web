/*
 * @Author: Eason
 * @Date:   2020-01-16 09:17:57
 * @Last Modified by: Eason
 * @Last Modified time: 2021-03-22 11:21:51
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/**
 * 为应用设置管理员
 */
export async function assignAppAdminUser(params) {
  return request({
    method: 'POST',
    url: `${SERVER_PATH}/sei-manager/application/assignManager`,
    params,
    data: {},
  });
}
