import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;
/** 获取流程类型清单 */
export async function getFlowTypeList(data) {
  const url = `${SERVER_PATH}/sei-manager/flow/definition/findTypeByPage`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/**
 * 保存流程类型节点
 * @typeId string
 */
export async function saveFlowTypeNode(data) {
  const url = `${SERVER_PATH}/sei-manager/flow/definition/saveTypeNode`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/**
 * 删除流程类型节点
 * @ids array
 */
export async function deleteFlowTypeNode(data) {
  const url = `${SERVER_PATH}/sei-manager/flow/definition/deleteTypeNode`;
  return request({
    url,
    method: 'DELETE',
    data,
  });
}

/**
 * 流程类型版本发布
 * @typeId string
 */
export async function publishFlowType(params) {
  const url = `${SERVER_PATH}/sei-manager/flow/definition/publish`;
  return request({
    url,
    method: 'POST',
    params,
  });
}
