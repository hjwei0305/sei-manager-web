import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 创建标签 */
export async function createTag(data) {
  const url = `${SERVER_PATH}/sei-manager/tag/create`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除标签 */
export async function removeTag(data) {
  const url = `${SERVER_PATH}/sei-manager/tag/delete/${data.id}`;
  return request({
    url,
    method: 'DELETE',
    data: {},
  });
}

/**
 * 获取当前最新标签
 * @moduleCode string
 */
export async function getNewTag(params) {
  const url = `${SERVER_PATH}/sei-manager/tag/getLastTag`;
  return request({
    url,
    params,
  });
}

/**
 * 同步Gitlab上的模块标签
 * @moduleCode string
 */
export async function gitlabAsync(params) {
  const url = `${SERVER_PATH}/sei-manager/tag/syncTag`;
  return request({
    url,
    method: 'POST',
    params,
  });
}

/**
 * 获取一个标签
 * @id string
 */
export async function getTag(params) {
  const url = `${SERVER_PATH}/sei-manager/tag/getTag`;
  return request({
    url,
    params,
  });
}
