import { utils } from 'suid';
import { constants } from '../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/sei-manager/deployStage/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/sei-manager/deployStage/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/**
 * 获取阶段参数
 * @stageId string
 */
export async function getStageParameters(params) {
  const url = `${SERVER_PATH}/sei-manager/deployStage/getStageParameters`;
  return request({
    url,
    params,
  });
}
