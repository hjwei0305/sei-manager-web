/* eslint-disable @typescript-eslint/no-unused-vars */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/**
 * 获取日志详情
 * @id string
 * @serviceName string
 */
export async function getLogDetail(params) {
  const url = `${SERVER_PATH}/sei-manager/log/detail`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/**
 * 获取链路日志
 * @traceId string
 * @serviceName string
 */
export async function getTranceLog(params) {
  const url = `${SERVER_PATH}/sei-manager/log/findByTraceId`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/**
 * 获取当前所有可用应用服务清单
 */
export async function getServices() {
  const url = `${SERVER_PATH}/sei-manager/application/getServices`;
  return request({
    url,
    method: 'GET',
  });
}
