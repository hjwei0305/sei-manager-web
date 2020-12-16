import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual, trim } from 'lodash';
import { Button, Card, Input, Tree, Empty, Layout } from 'antd';
import { ScrollBar, ExtIcon, ListLoader } from 'suid';
import empty from '@/assets/item_empty.svg';
import NodeForm from './components/NodeForm';
import MenuMoveModal from './components/MenuMoveModal';
import styles from './index.less';

const { Search } = Input;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';
const { Sider, Content } = Layout;

@connect(({ appMenu, loading }) => ({ appMenu, loading }))
class AppMenu extends Component {
  static allValue = '';

  static data = [];

  constructor(props) {
    super(props);
    const { appMenu } = props;
    const { currentNode } = appMenu;
    this.state = {
      treeData: [],
      expandedKeys: [],
      selectedKeys: currentNode ? [currentNode.id] : [],
      autoExpandParent: true,
      childParentNode: null,
    };
  }

  componentDidUpdate(preProps) {
    const { appMenu } = this.props;
    const { treeData: dataSource } = appMenu;
    if (!isEqual(preProps.appMenu.treeData, dataSource)) {
      this.data = [...dataSource];
      this.setState(
        {
          treeData: dataSource,
        },
        () => {
          let expandedKeys = [];
          const { currentNode } = appMenu;
          if (currentNode && currentNode.id) {
            const { treeData } = this.state;
            const parentData = this.getCurrentNodeAllParents(treeData, currentNode.id);
            expandedKeys = parentData.map(p => p.id);
          } else {
            expandedKeys = dataSource.map(p => p.id);
          }
          this.setState({ expandedKeys });
        },
      );
    }
    if (
      !isEqual(preProps.appMenu.currentNode, appMenu.currentNode) &&
      appMenu.currentNode &&
      appMenu.currentNode.id
    ) {
      const { currentNode } = appMenu;
      this.setState({
        selectedKeys: [currentNode.id],
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'appMenu/updateState',
      payload: {
        treeData: [],
        currentNode: null,
        showMove: false,
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
      type: 'appMenu/updateState',
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
        type: 'appMenu/updateState',
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
      type: 'appMenu/updateState',
      payload: {
        currentNode: childParentNode,
      },
    });
    this.setState({ childParentNode: null });
  };

  moveChild = currentNode => {
    if (currentNode) {
      const { dispatch } = this.props;
      dispatch({
        type: 'appMenu/updateState',
        payload: {
          currentNode,
          showMove: true,
        },
      });
    }
  };

  submitMove = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appMenu/move',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'appMenu/getMenuList',
          });
        }
      },
    });
  };

  closeMenuMoveModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appMenu/updateState',
      payload: {
        showMove: false,
      },
    });
  };

  deleteMenu = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appMenu/del',
      payload: {
        id,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'appMenu/getMenuList',
          });
        }
      },
    });
  };

  saveMenu = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appMenu/save',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'appMenu/getMenuList',
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
      const fieldValue = treeNode.name;
      if (fieldValue.toLowerCase().indexOf(valueKey) > -1) {
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
          type: 'appMenu/updateState',
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
      const readerValue = item.name;
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
    const { loading, appMenu } = this.props;
    const { allValue, treeData, expandedKeys, selectedKeys, autoExpandParent } = this.state;
    const { currentNode, showMove } = appMenu;
    const nodeFormProps = {
      loading,
      editData: currentNode,
      saveMenu: this.saveMenu,
      addChild: this.addChild,
      deleteMenu: this.deleteMenu,
      moveChild: this.moveChild,
      goBackToChildParent: this.goBackToChildParent,
    };
    const menuMoveModalProps = {
      loading,
      currentNode,
      submitMove: this.submitMove,
      showMove,
      treeData,
      closeMenuMoveModal: this.closeMenuMoveModal,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={380} className="auto-height" theme="light">
            <Card
              title="平台菜单"
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
                  placeholder="输入名称关键字查询"
                  defaultValue={allValue}
                  onChange={e => this.handlerSearchChange(e.target.value)}
                  onSearch={this.handlerSearch}
                  onPressEnter={this.handlerSearch}
                />
              </div>
              <div className="tree-body">
                <ScrollBar>
                  {loading.effects['appMenu/getMenuList'] ? (
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
                <Empty image={empty} description="可选择左侧菜单节点获得相关的操作" />
              </div>
            )}
          </Content>
        </Layout>
        <MenuMoveModal {...menuMoveModalProps} />
      </div>
    );
  }
}
export default AppMenu;
