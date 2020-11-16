/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: Eason
 * @Last Modified time: 2020-11-16 15:51:43
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { SERVER_PATH } = constants;

const contextPath = '/sei-manager/labelLibrary';

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}${contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}${contextPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
