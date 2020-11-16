/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: Eason
 * @Last Modified time: 2020-11-16 15:57:50
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { SERVER_PATH } = constants;

const contextPath = '/sei-manager/dataModel';
const treeTextPath = '/sei-manager/dataModelType';

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}${contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 保存模型字段 */
export async function saveModelField(data) {
  const url = `${SERVER_PATH}${contextPath}/saveModelField`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除模型字段 */
export async function deleteModelFields(data) {
  const url = `${SERVER_PATH}${contextPath}/deleteModelFields`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 添加审计字段 */
export async function addAuditFields(params) {
  const url = `${SERVER_PATH}${contextPath}/addAuditFields`;
  return request({
    url,
    params,
    method: 'POST',
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}${contextPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 保存树结点 */
export async function saveTreeNode(data) {
  const url = `${SERVER_PATH}${treeTextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除树结点 */
export async function delTreeNode(params) {
  const url = `${SERVER_PATH}${treeTextPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/**
 * 获取所有树结构数据
 */
export async function listAllTree(params = {}) {
  const url = `${SERVER_PATH}${treeTextPath}/getModelTypeTree`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/**
 * 根据树结点code获取模型类型
 */
export async function findByTreeNodeId({ typeCode }) {
  const url = `${SERVER_PATH}${contextPath}/getDataModelByTypeCode?typeCode=${typeCode}`;
  return request({
    url,
    method: 'GET',
  });
}
