import { utils } from 'suid';
import { constants } from '../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/**
 * 获取所有的待办
 */
export async function getTodoList() {
  const url = `${SERVER_PATH}/sei-manager/requisition/getTodoTasks`;
  return request({
    url,
  });
}

/**
 * 获取指定类型的待办
 */
export async function getTypeTodoList(params) {
  const { type } = params;
  const url = `${SERVER_PATH}/sei-manager/requisition/${type}/getTodoTasks`;
  return request({
    url,
  });
}

/**
 * 待办处理
 * @message	驳回处理意见 string
 * @operationType	审核操作类型,可用值:SUBMIT,PASSED,REJECT,CANCEL	string
 * @requisitionId	申请单id		string
 * @taskId 任务实例id string
 */
export async function submitHanlder(data) {
  const url = `${SERVER_PATH}/sei-manager/requisition/handle`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/**
 * 获取应用详情
 * @id	单据id string
 */
export async function getApplicationDetail(params) {
  const url = `${SERVER_PATH}/sei-manager/application/findOne`;
  return request({
    url,
    params,
  });
}

/**
 * 获取应用模块申请详情
 * @id	单据id string
 */
export async function getAppModuleDetail(params) {
  const url = `${SERVER_PATH}/sei-manager/appModule/findOne`;
  return request({
    url,
    params,
  });
}

/**
 * 获取发版申请详情
 * @id	单据id string
 */
export async function getReleaseDetail(params) {
  const url = `${SERVER_PATH}/sei-manager/releaseVersion/findOne`;
  return request({
    url,
    params,
  });
}

/**
 * 获取部署申请详情
 * @id	单据id string
 */
export async function getDeployDetail(params) {
  const url = `${SERVER_PATH}/sei-manager/releaseRecord/findOne`;
  return request({
    url,
    params,
  });
}
