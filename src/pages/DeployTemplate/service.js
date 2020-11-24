import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 模板保存 */
export async function saveDeployTemplate(data) {
  const url = `${SERVER_PATH}/sei-manager/deployTemplate/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 模板删除 */
export async function delDeployTemplate(params) {
  const url = `${SERVER_PATH}/sei-manager/deployTemplate/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 为模板分配阶段 */
export async function assignStages(data) {
  const url = `${SERVER_PATH}/sei-manager/deployTemplateStage/insertRelations`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 模板移除已分配的阶段 */
export async function removeAssignedStages(data) {
  const url = `${SERVER_PATH}/sei-manager/deployTemplateStage/removeRelations`;
  return request({
    url,
    method: 'DELETE',
    data,
  });
}
