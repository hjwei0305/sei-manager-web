import { utils } from 'suid';
import { constants } from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 提交审核 */
export async function approve(data) {
  const url = `${SERVER_PATH}/sei-manager/requisition/submit`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/**
 * 终止审核
 * @message string
 * @requisitionId string
 * @operationType string
 */
export async function stopApprove(data) {
  const url = `${SERVER_PATH}/sei-manager/requisition/handle`;
  return request({
    url,
    method: 'POST',
    data,
  });
}
