/* eslint-disable @typescript-eslint/no-unused-vars */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/**
 * 获取日志详情
 *  * @agentServer string
 * @id string
 * @serviceName string
 */
export async function getLogDetail(params) {
  const { agentServer, ...rest } = params;
  const url = `${agentServer}/log/detail`;
  return request({
    url,
    method: 'GET',
    params: rest,
  });
}

/**
 * 获取链路日志
 * @agentServer string
 * @traceId string
 * @serviceName string
 */
export async function getTranceLog(params) {
  const { agentServer, ...rest } = params;
  const url = `${agentServer}/log/findByTraceId`;
  return request({
    url,
    method: 'GET',
    params: rest,
  });
}

/**
 * 获取当前所有可用应用服务清单
 */
export async function getServices(params) {
  const { agentServer } = params;
  const url = `${agentServer}/serviceInstance/getServices`;
  return request({
    url,
    method: 'GET',
  });
}
