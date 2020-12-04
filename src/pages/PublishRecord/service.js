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
