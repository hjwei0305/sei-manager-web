/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-07-29 09:45:48
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { MANAGER_CONTEXT: MockServerPath } = constants;

const contextPath = '/elementLibrary';

/** 保存 */
export async function save(data) {
  const url = `${MockServerPath}${contextPath}/save`;

  return request.post(url, data);
}

/** 删除 */
export async function del(params) {
  const url = `${MockServerPath}${contextPath}/delete/${params.id}`;
  return request.delete(url);
}
