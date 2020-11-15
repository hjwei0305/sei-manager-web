/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:49:29
 */
import { utils } from 'suid';

const { request } = utils;
const MockServerPath = 'http://127.0.0.1:7001';
const project_contextPath = '/project';
const app_contextPath = '/appModule';
// const MockServerPath = 'http://rddgit.changhong.com:7300/mock/5e02d29836608e42d52b1d81/template-service';
const contextPath = '/simple-master';

/** 保存父表格数据 */
export async function saveParent(data) {
  const url = `${MockServerPath}${app_contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 快速创建 */
export async function quickCreate(data) {
  const url = `${MockServerPath}${app_contextPath}/quickCreate`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 保存字表行数据 */
export async function saveChild(data) {
  const url = `${MockServerPath}${project_contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除父亲表格数据 */
export async function delParentRow(params) {
  const url = `${MockServerPath}${app_contextPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 删除字表格数据 */
export async function delChildRow(params) {
  const url = `${MockServerPath}${contextPath}/delete/${params.id}`;
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
    url: `${MockServerPath}${project_contextPath}/getProjectGroupList`,
    method: 'POST',
    data,
  });
}
