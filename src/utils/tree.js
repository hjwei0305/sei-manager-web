/*
 * @Author: zp
 * @Date:   2020-01-29 20:03:21
 * @Last Modified by: zp
 * @Last Modified time: 2020-06-19 13:53:27
 */
import { cloneDeep } from 'lodash';

/** 获取树的所有叶子结点 */
export const getTreeLeaf = (trees = [], result = []) => {
  for (let i = trees.length - 1; i >= 0; i -= 1) {
    const item = trees[i];
    if (item.children && item.children.length) {
      getTreeLeaf(item.children, result);
    } else {
      result.push(item);
    }
  }

  return result;
};

/** 遍历树 */
export const traverseTrees = (trees, cb) => {
  for (let i = trees.length - 1; i >= 0; i -= 1) {
    const item = trees[i];
    if (item.children && item.children.length) {
      traverseTrees(item.children, cb);
    } else {
      cb(item);
    }
  }
};

/**
 * 遍历复制树
 * @param  {Array} trees  菜单树
 * @param  {Fun}   callback 回调函数
 * @param  {Array}  result 结果数组
 * @return {Array}        复制后的树
 */
export const traverseCopyTrees = (
  trees = [],
  callback,
  result = [],
  rootId = '',
  rootName = '',
) => {
  /** 没有回调函数，直接深copy一个树 */
  if (!callback) {
    return cloneDeep(trees);
  }

  for (let i = 0, len = trees.length; i < len; i += 1) {
    const tree = cloneDeep(trees[i]);
    if (!rootId) {
      tree.rootId = tree.id;
    } else {
      tree.rootId = rootId;
    }
    if (!rootName) {
      tree.rootName = tree.name;
    } else {
      tree.rootName = rootName;
    }
    const menuTree = callback(tree) || tree;
    const { children } = menuTree;
    if (children && children.length) {
      menuTree.children = traverseCopyTrees(
        children,
        callback,
        [],
        menuTree.rootId,
        menuTree.rootName,
      );
    }
    result.push(menuTree);
  }

  return result;
};
