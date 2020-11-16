import constants from './constants';
import eventBus from './eventBus';
import * as userAuth from './userAuth';
import * as tree from './tree';
import * as userUtils from './user';
import speech from './speechSynthesis';

const getAllParentIdsByNode = (treeData, nodeId) => {
  const treeFindPath = (treeArr, func, path = []) => {
    if (!treeArr) return [];
    for (const data of treeArr) {
      path.push(data.id);
      if (func(data)) {
        path.pop();
        return path;
      }
      if (data.children) {
        const findChildren = treeFindPath(data.children, func, path);
        if (findChildren.length) return findChildren;
      }
      path.pop();
    }
    return [];
  };
  const ids = treeFindPath(treeData, data => data.id === nodeId);
  return ids;
};

const getAllChildIdsByNode = (treeData, nodeId) => {
  const childNodesDeep = (nodes, arr) => {
    if (nodes)
      nodes.forEach(ele => {
        arr.push(ele.id);
        if (ele.children) {
          childNodesDeep(ele.children, arr);
        }
      });
  };
  const getChild = (nodes, id, arr) => {
    for (const el of nodes) {
      if (el.id === id && el.children) {
        childNodesDeep(el.children, arr);
      } else if (el.children) {
        getChild(el.children, id, arr);
      }
    }
    return arr;
  };
  const ids = [];
  getChild(treeData, nodeId, ids);
  return ids;
};

export {
  constants,
  userUtils,
  eventBus,
  userAuth as userInfoOperation,
  tree as treeOperation,
  speech,
  getAllParentIdsByNode,
  getAllChildIdsByNode,
};
