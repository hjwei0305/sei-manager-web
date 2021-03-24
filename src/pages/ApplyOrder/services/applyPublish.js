import { utils } from 'suid';
import { constants } from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 创建保存 */
export async function createSave(data) {
  const url = `${SERVER_PATH}/sei-manager/releaseVersion/createRequisition`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 修改保存 */
export async function editSave(data) {
  const url = `${SERVER_PATH}/sei-manager/releaseVersion/modifyRequisition`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 获取申请 */
export async function getPublish(params) {
  const url = `${SERVER_PATH}/sei-manager/releaseVersion/findOne`;
  return request({
    url,
    params,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-manager/releaseVersion/deleteRequisition/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 获取标签内容 */
export async function getTag(params) {
  const url = `${SERVER_PATH}/sei-manager/tag/getTag`;
  return request({
    url,
    params,
  });
}
