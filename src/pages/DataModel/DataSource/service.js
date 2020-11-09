/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-07-29 10:11:52
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { MANAGER_CONTEXT: MockServerPath } = constants;

const contextPath = '/dataSource';

/** 保存 */
export async function save(data) {
  const url = `${MockServerPath}${contextPath}/saveRequest`;

  return request.post(url, data);
}

/** 删除 */
export async function del(params) {
  const url = `${MockServerPath}${contextPath}/delete/${params.id}`;
  return request.delete(url);
}
