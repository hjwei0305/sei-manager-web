import { utils } from 'suid';
import { constants } from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 创建保存 */
export async function createSave(data) {
  const url = `${SERVER_PATH}/sei-manager/application/createRequisition`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 修改保存 */
export async function editSave(data) {
  const url = `${SERVER_PATH}/sei-manager/application/modifyRequisition`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-manager/application/deleteRequisition/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
