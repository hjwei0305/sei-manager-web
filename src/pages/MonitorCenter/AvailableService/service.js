/* eslint-disable @typescript-eslint/no-unused-vars */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/**
 * 获取服务目录
 */
export async function getServices(params) {
  const url = `${SERVER_PATH}/sei-manager/serviceInstance/getServices`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/**
 * 获取服务实例列表
 * @serviceCode  string
 */
export async function getServiceInstance(params) {
  const url = `${SERVER_PATH}/sei-manager/serviceInstance/getServiceInstance`;
  return request({
    url,
    method: 'GET',
    params,
  });
}
