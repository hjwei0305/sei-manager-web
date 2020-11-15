/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:49:29
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { CI_SERVER_PATH } = constants;
const { request } = utils;
const project_contextPath = '/project';
const app_contextPath = '/appModule';
const contextPath = '/simple-master';

/** 保存父表格数据 */
export async function saveParent(data) {
  const url = `${CI_SERVER_PATH}${app_contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 快速创建 */
export async function quickCreate(data) {
  const url = `${CI_SERVER_PATH}${app_contextPath}/quickCreate`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 保存字表行数据 */
export async function saveChild(data) {
  const url = `${CI_SERVER_PATH}${project_contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除父亲表格数据 */
export async function delParentRow(params) {
  const url = `${CI_SERVER_PATH}${app_contextPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 删除字表格数据 */
export async function delChildRow(params) {
  const url = `${CI_SERVER_PATH}${contextPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/**
 * 获取仓库组
 */
export async function getGroups(data) {
  return request({
    url: `${CI_SERVER_PATH}${project_contextPath}/getProjectGroupList`,
    method: 'POST',
    data,
  });
}
