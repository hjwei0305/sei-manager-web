import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取能再定义的流程类型 */
export async function getRedefinedTypes() {
  const url = `${SERVER_PATH}/sei-manager/flow/definition/findRedefinedTypes`;
  return request({
    url,
  });
}

/**
 * 通过流程类型,版本,关联值获取流程实例任务节点
 * @relation string
 * @typeCode string
 * @version number
 */
export async function getFlowInstanceTask(params) {
  const url = `${SERVER_PATH}/sei-manager/flow/definition/getFlowInstanceTask`;
  return request({
    url,
    params,
  });
}

/**
 * 保存流程实例任务节点
 * @relation string
 * @taskList array
 */
export async function saveInstanceTask(data) {
  const { relation, taskList } = data;
  const url = `${SERVER_PATH}/sei-manager/flow/definition/saveInstanceTask/${relation}`;
  return request({
    method: 'POST',
    url,
    data: taskList,
  });
}
