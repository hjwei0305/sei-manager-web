import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual, trim } from 'lodash';
import { Card, Input, Tree, Empty, Layout, Button } from 'antd';
import { ScrollBar, ExtIcon, ListLoader } from 'suid';
import empty from '@/assets/item_empty.svg';
import NodeForm from './components/NodeForm';
import styles from './index.less';

const { Search } = Input;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';
const { Sider, Content } = Layout;

@connect(({ projectGroup, loading }) => ({ projectGroup, loading }))
class ProjectGroup extends Component {
  static allValue = '';

  static data = [];

  constructor(props) {
    super(props);
    const { projectGroup } = props;
    const { currentNode } = projectGroup;
    this.state = {
      treeData: [],
      expandedKeys: [],
      selectedKeys: currentNode ? [currentNode.id] : [],
      autoExpandParent: false,
      childParentNode: null,
    };
  }

  componentDidUpdate(preProps) {
    const { projectGroup } = this.props;
    const { treeData: dataSource } = projectGroup;
    if (!isEqual(preProps.projectGroup.treeData, dataSource)) {
      this.data = [...dataSource];
      this.setState(
        {
          treeData: dataSource,
        },
        () => {
          let expandedKeys = [];
          const { currentNode } = projectGroup;
          if (currentNode && currentNode.id) {
            const { treeData } = this.state;
            const parentData = this.getCurrentNodeAllParents(treeData, currentNode.id);
            expandedKeys = parentData.map(p => p.id);
          } else {
            // expandedKeys = dataSource.map(p => p.id);
          }
          this.setState({ expandedKeys });
        },
      );
    }
    if (
      !isEqual(preProps.projectGroup.currentNode, projectGroup.currentNode) &&
      projectGroup.currentNode &&
      projectGroup.currentNode.id
    ) {
      const { currentNode } = projectGroup;
      this.setState({
        selectedKeys: [currentNode.id],
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectGroup/updateState',
      payload: {
        treeData: [],
        currentNode: null,
      },
    });
  }

  addParent = e => {
    e.stopPropagation();
    const { dispatch } = this.props;
    this.setState({
      selectedKeys: [],
    });
    dispatch({
      type: 'projectGroup/updateState',
      payload: {
        currentNode: {},
      },
    });
  };

  addChild = parent => {
    if (parent) {
      this.setState({ childParentNode: parent });
      const currentNode = {
        parentId: parent.id,
        parentName: parent.name,
        parentNodeLevel: parent.nodeLevel,
        [childFieldKey]: [],
      };
      const { dispatch } = this.props;
      dispatch({
        type: 'projectGroup/updateState',
        payload: {
          currentNode,
        },
      });
    }
  };

  goBackToChildParent = () => {
    const { childParentNode } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'projectGroup/updateState',
      payload: {
        currentNode: childParentNode,
      },
    });
    this.setState({ childParentNode: null });
  };

  deleteProjectGroup = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectGroup/del',
      payload: {
        id,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'projectGroup/getProjectList',
          });
        }
      },
    });
  };

  saveProjectGroup = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectGroup/save',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'projectGroup/getProjectList',
          });
          this.setState({ childParentNode: null });
        }
      },
    });
  };

  filterNodes = (valueKey, treeData, expandedKeys) => {
    const newArr = [];
    treeData.forEach(treeNode => {
      const nodeChildren = treeNode[childFieldKey];
      if (
        treeNode.remark.toLowerCase().indexOf(valueKey) > -1 ||
        treeNode.name.toLowerCase().indexOf(valueKey) > -1
      ) {
        newArr.push(treeNode);
        expandedKeys.push(treeNode.id);
      } else if (nodeChildren && nodeChildren.length > 0) {
        const ab = this.filterNodes(valueKey, nodeChildren, expandedKeys);
        const obj = {
          ...treeNode,
          [childFieldKey]: ab,
        };
        if (ab && ab.length > 0) {
          newArr.push(obj);
        }
      }
    });
    return newArr;
  };

  getLocalFilterData = () => {
    const { expandedKeys: expKeys } = this.state;
    let newData = [...this.data];
    const expandedKeys = [...expKeys];
    const searchValue = this.allValue;
    if (searchValue) {
      newData = this.filterNodes(searchValue.toLowerCase(), newData, expandedKeys);
    }
    return { treeData: newData, expandedKeys };
  };

  handlerSearchChange = v => {
    this.allValue = trim(v);
  };

  handlerSearch = () => {
    const { treeData, expandedKeys } = this.getLocalFilterData();
    this.setState({
      treeData,
      expandedKeys,
      autoExpandParent: true,
    });
  };

  getSelectData = (selectedKey, treeData, currentNode) => {
    for (let i = 0; i < treeData.length; i += 1) {
      const item = treeData[i];
      const childData = item[childFieldKey];
      if (item.id === selectedKey) {
        Object.assign(currentNode, item);
        break;
      }
      if (childData && childData.length > 0) {
        this.getSelectData(selectedKey, childData, currentNode);
      }
    }
  };

  handlerSelect = (selectedKeys, e) => {
    const { treeData } = this.state;
    const { dispatch } = this.props;
    let currentNode = null;
    if (e.selected) {
      currentNode = {};
      this.getSelectData(selectedKeys[0], treeData, currentNode);
    }
    this.setState(
      {
        selectedKeys,
      },
      () => {
        dispatch({
          type: 'projectGroup/updateState',
          payload: {
            currentNode,
          },
        });
      },
    );
  };

  handlerExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  getCurrentNodeAllParents = (treeData, id) => {
    const temp = [];
    const forFn = (arr, tempId) => {
      for (let i = 0; i < arr.length; i += 1) {
        const item = arr[i];
        if (item.id === tempId) {
          temp.push(item);
          forFn(treeData, item.parentId);
          break;
        } else if (item.children && item.children.length > 0) {
          forFn(item.children, tempId);
        }
      }
    };
    forFn(treeData, id);
    return temp;
  };

  renderTreeNodes = treeData => {
    const searchValue = this.allValue || '';
    return treeData.map(item => {
      const readerValue = item.remark;
      const readerChildren = item[childFieldKey];
      const i = readerValue.toLowerCase().indexOf(searchValue.toLowerCase());
      const beforeStr = readerValue.substr(0, i);
      const afterStr = readerValue.substr(i + searchValue.length);
      const title =
        i > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: hightLightColor }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{readerValue}</span>
        );
      if (readerChildren && readerChildren.length > 0) {
        return (
          <TreeNode title={title} key={item.id}>
            {this.renderTreeNodes(readerChildren)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          switcherIcon={<ExtIcon type="dian" style={{ fontSize: 12 }} />}
          title={title}
          key={item.id}
        />
      );
    });
  };

  render() {
    const { loading, projectGroup } = this.props;
    const { allValue, treeData, expandedKeys, selectedKeys, autoExpandParent } = this.state;
    const { currentNode } = projectGroup;
    const nodeFormProps = {
      loading,
      editData: currentNode,
      saveProjectGroup: this.saveProjectGroup,
      addChild: this.addChild,
      deleteProjectGroup: this.deleteProjectGroup,
      goBackToChildParent: this.goBackToChildParent,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={380} className="auto-height" theme="light">
            <Card
              title="项目组"
              bordered={false}
              className="left-content"
              extra={
                <Button icon="plus" type="link" onClick={e => this.addParent(e)}>
                  新建
                </Button>
              }
            >
              <div className="header-tool-box">
                <Search
                  placeholder="输入名称或描述关键字"
                  defaultValue={allValue}
                  onChange={e => this.handlerSearchChange(e.target.value)}
                  onSearch={this.handlerSearch}
                  onPressEnter={this.handlerSearch}
                />
              </div>
              <div className="tree-body">
                <ScrollBar>
                  {loading.effects['projectGroup/getProjectList'] ? (
                    <ListLoader />
                  ) : (
                    <Tree
                      blockNode
                      autoExpandParent={autoExpandParent}
                      selectedKeys={selectedKeys}
                      expandedKeys={expandedKeys}
                      switcherIcon={<ExtIcon type="down" antd style={{ fontSize: 12 }} />}
                      onSelect={this.handlerSelect}
                      onExpand={this.handlerExpand}
                    >
                      {this.renderTreeNodes(treeData)}
                    </Tree>
                  )}
                </ScrollBar>
              </div>
            </Card>
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            {currentNode ? (
              <NodeForm {...nodeFormProps} />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="可选择单节点获得相关的操作" />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    );
  }
}
export default ProjectGroup;
