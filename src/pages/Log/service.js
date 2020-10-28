import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取实体类型列表 */
export async function getEntityNames() {
  const url = `${SERVER_PATH}/sei-datachange/dataChangeLog/getEntityNames`;
  return request({
    url,
    method: 'GET',
  });
}
