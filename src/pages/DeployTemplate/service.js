import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 模板保存 */
export async function saveDeployTemplate(data) {
  const url = `${SERVER_PATH}/sei-manager/deployTemplate/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 模板删除 */
export async function delDeployTemplate(params) {
  const url = `${SERVER_PATH}/sei-manager/deployTemplate/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 为模板分配阶段 */
export async function assignStages(data) {
  const url = `${SERVER_PATH}/sei-manager/deployTemplateStage/insertRelations`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 模板移除已分配的阶段 */
export async function removeAssignedStages(data) {
  const url = `${SERVER_PATH}/sei-manager/deployTemplateStage/removeRelations`;
  return request({
    url,
    method: 'DELETE',
    data,
  });
}

/** 模板阶段保存 */
export async function saveTemplateStage(data) {
  const url = `${SERVER_PATH}/sei-manager/deployTemplateStage/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/**
 * 获取模板XML内容
 * @templateId string
 */
export async function getTemplateXml(params) {
  const url = `${SERVER_PATH}/sei-manager/deployTemplate/getXml`;
  return request({
    url,
    params,
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
