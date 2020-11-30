import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { SERVER_PATH } = constants;

/** 获取待办消息统计 */
export async function getTodoTaskNum() {
  return request({
    method: 'GET',
    url: `${SERVER_PATH}/sei-manager/requisition/getTodoTaskNum`,
  });
}
