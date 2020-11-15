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
const tag_contextPath = '/tag';

export const deploy = async data =>
  request({
    url: `${MockServerPath}${tag_contextPath}/deploy`,
    method: 'POST',
    data,
  });

/** 保存父表格数据 */
export async function saveParent(data) {
  const url = `${MockServerPath}${project_contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 保存字表行数据 */
export async function saveChild(data) {
  const url = `${MockServerPath}${tag_contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除父亲表格数据 */
export async function delParentRow(params) {
  const url = `${MockServerPath}${project_contextPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 删除字表格数据 */
export async function delChildRow(params) {
  const url = `${MockServerPath}${tag_contextPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/**
 * 根据id查询tag
 * @param {object} { id }
 */
export async function findTagById({ id }) {
  const url = `${MockServerPath}${tag_contextPath}/findById`;
  return request({
    url,
    method: 'GET',
    params: { id },
  });
}

/**
 * 根据id查询tag
 * @param {object} { jobId }
 */
export async function findItemsByJobId({ jobId }) {
  const url = `${MockServerPath}/deploy/findItemsByJobId`;
  return request({
    url,
    method: 'POST',
    data: { jobId },
  });
}
