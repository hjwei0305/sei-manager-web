/* eslint-disable @typescript-eslint/no-unused-vars */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { MOCKER_PATH } = constants;

/**
 * 获取当前所有可用应用服务清单
 */
export async function getServices() {
  const url = `${MOCKER_PATH}/sei-manager/serviceInstance/getServiceList`;
  return request({
    url,
    method: 'GET',
  });
}

/**
 * 获取当前应用服务的实例清单
 * @appCode
 * @envCode
 */
export async function getInstancesByAppEnvCode(params) {
  const url = `${MOCKER_PATH}/sei-manager/serviceInstance/getInstance`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/**
 * 获取当前应用服务的接口配置清单
 * @appCode
 */
export async function getInterfacesByAppCode(params) {
  const url = `${MOCKER_PATH}/sei-manager/interface/findByAppCode`;
  return request({
    url,
    method: 'GET',
    params,
  });
}
