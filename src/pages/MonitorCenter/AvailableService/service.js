/* eslint-disable @typescript-eslint/no-unused-vars */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/**
 * 获取服务目录
 */
export async function getServices(params) {
  const { agentServer } = params;
  const url = `${agentServer}/serviceInstance/getServices`;
  return request({
    url,
    method: 'GET',
  });
}

/**
 * 获取服务实例列表
 * @agentServer string
 * @serviceCode  string
 */
export async function getServiceInstance(params) {
  const { agentServer, ...rest } = params;
  const url = `${agentServer}/serviceInstance/getServiceInstance`;
  return request({
    url,
    method: 'GET',
    params: rest,
  });
}
