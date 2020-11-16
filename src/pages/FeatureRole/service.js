import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH, MOCKER_PATH } = constants;

/** 功能角色保存 */
export async function saveFeatureRole(data) {
  const url = `${SERVER_PATH}/sei-manager/role/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 功能角色删除 */
export async function delFeatureRole(data) {
  const url = `${SERVER_PATH}/sei-manager/role/delete/${data.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/**
 * 根据功能角色获取已分配功能项树形结构
 * @featureRoleId 功能角色Id
 */
export async function getAssignFeatureItem(params) {
  const url = `${MOCKER_PATH}/sei-manager/featureRoleFeature/getRelationsByParentId`;
  return request({
    url,
    params,
  });
}

/** 为功能角色分配功能项 */
export async function assignFeatureItem(data) {
  const url = `${SERVER_PATH}/sei-basic/featureRoleFeature/insertRelations`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 功能角色移除已分配的功能项 */
export async function removeAssignedFeatureItem(data) {
  const url = `${SERVER_PATH}/sei-basic/featureRoleFeature/removeRelations`;
  return request({
    url,
    method: 'DELETE',
    data,
  });
}

/**
 * 获取功能角色未分配功能项树形结构
 * @appModuleId 应用模块id
 * @featureRoleId 功能角色id
 */
export async function getUnAssignedFeatureItemList(params) {
  const url = `${MOCKER_PATH}/sei-manager/featureRoleFeature/getUnassignedFeatureTree`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/**
 * 根据功能角色的id获取已分配的用户
 * params featureRoleId
 */
export async function getAssignedEmployeesByFeatureRole(params) {
  const url = `${SERVER_PATH}/sei-basic/featureRole/getAssignedEmployeesByFeatureRole`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/**
 * 根据功能角色的id获取已分配的岗位
 * params featureRoleId
 */
export async function getAssignedPositionsByFeatureRole(params) {
  const url = `${SERVER_PATH}/sei-basic/featureRole/getAssignedPositionsByFeatureRole`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/**
 * 移除功能角色分配的岗位
 * params featureRoleId
 */
export async function unAssignStation(data) {
  const url = `${SERVER_PATH}/sei-basic/positionFeatureRole/removeRelationsByParents`;
  return request({
    url,
    method: 'DELETE',
    data,
  });
}

/**
 * 给功能角色分配岗位
 */
export async function assignStation(data) {
  const url = `${SERVER_PATH}/sei-basic/positionFeatureRole/insertRelationsByParents`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/**
 * 移除功能角色分配的用户
 * params featureRoleId
 */
export async function unAssignUser(data) {
  const url = `${SERVER_PATH}/sei-basic/userFeatureRole/removeRelationsByParents`;
  return request({
    url,
    method: 'DELETE',
    data,
  });
}

/**
 * 给功能角色分配用户
 */
export async function assignUser(data) {
  const url = `${SERVER_PATH}/sei-basic/userFeatureRole/insertRelationsByParents`;
  return request({
    url,
    method: 'POST',
    data,
  });
}
