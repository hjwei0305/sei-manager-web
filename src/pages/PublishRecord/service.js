import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 用户新建 */
export async function build(params) {
  const url = `${SERVER_PATH}/sei-manager/releaseRecord/buildJob`;
  return request({
    url,
    method: 'POST',
    params,
  });
}

/** 获取构建详情 */
export async function getBuildDetail(params) {
  const url = `${SERVER_PATH}/sei-manager/releaseRecord/getBuildDetail`;
  return request({
    url,
    params,
  });
}
