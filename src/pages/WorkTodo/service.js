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
