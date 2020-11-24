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
const tag_contextPath = '/tag';

export const deploy = async data =>
  request({
    url: `${CI_SERVER_PATH}${tag_contextPath}/deploy`,
    method: 'POST',
    data,
  });

/** 保存父表格数据 */
export async function saveParent(data) {
  const url = `${CI_SERVER_PATH}${project_contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 保存字表行数据 */
export async function saveChild(data) {
  const url = `${CI_SERVER_PATH}${tag_contextPath}/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除父亲表格数据 */
export async function delParentRow(params) {
  const url = `${CI_SERVER_PATH}${project_contextPath}/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 删除字表格数据 */
export async function delChildRow(params) {
  const url = `${CI_SERVER_PATH}${tag_contextPath}/delete/${params.id}`;
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
  const url = `${CI_SERVER_PATH}${tag_contextPath}/findById`;
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
  const url = `${CI_SERVER_PATH}/deploy/findItemsByJobId`;
  return request({
    url,
    method: 'POST',
    data: { jobId },
  });
}

/**
 * 根据id查询构建日志
 * @param {object} { jobId }
 */
export async function findLogById({ id }) {
  const url = `${CI_SERVER_PATH}/deployLog/findById`;
  return request({
    url,
    method: 'GET',
    params: { id },
  });
}

/**
 * 手动发布开发
 * @param {object} { jobId }
 */
export async function manualDeploy({ projectId }) {
  const url = `${CI_SERVER_PATH}/project/gitHooksHandler`;
  return request({
    url,
    method: 'POST',
    headers: {
      'X-Gitlab-Token': projectId,
    },
  });
}
