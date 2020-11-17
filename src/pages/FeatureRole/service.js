import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

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
  const url = `${SERVER_PATH}/sei-manager/roleFeature/getRelationsByParentId`;
  return request({
    url,
    params,
  });
}

/** 为功能角色分配功能项 */
export async function assignFeatureItem(data) {
  const url = `${SERVER_PATH}/sei-manager/roleFeature/insertRelations`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 功能角色移除已分配的功能项 */
export async function removeAssignedFeatureItem(data) {
  const url = `${SERVER_PATH}/sei-manager/roleFeature/removeRelations`;
  return request({
    url,
    method: 'DELETE',
    data,
  });
}

/**
 * 获取功能角色未分配功能项树形结构
 * @featureRoleId 功能角色id
 */
export async function getUnAssignedFeatureItemList(params) {
  const url = `${SERVER_PATH}/sei-manager/roleFeature/getUnassignedFeatureTree`;
  return request({
    url,
    method: 'GET',
    params,
  });
}
