import React, { Component } from 'react';
import cls from 'classnames';
import { isEqual, without, uniqBy, get } from 'lodash';
import { connect } from 'dva';
import { Button, Input, Drawer, Tree, Empty } from 'antd';
import { ScrollBar, ListLoader, ExtIcon } from 'suid';
import { constants, getAllParentIdsByNode, getAllChildIdsByNode } from '@/utils';
import styles from './UnAssignFeature.less';

const { FEATURE_TYPE } = constants;
const { Search } = Input;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';

@connect(({ featureRole, loading }) => ({ featureRole, loading }))
class UnAssignFeature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allValue: '',
      checkedKeys: [],
      unAssignListData: [],
    };
  }

  componentDidUpdate(prevProps) {
    const { featureRole } = this.props;
    const { showAssignFeature } = featureRole;
    if (!isEqual(prevProps.featureRole.selectedFeatureRole, featureRole.selectedFeatureRole)) {
      this.setState({
        checkedKeys: [],
        unAssignListData: [],
      });
    }
    if (
      !isEqual(prevProps.featureRole.showAssignFeature, showAssignFeature) &&
      showAssignFeature === true
    ) {
      this.setState({ checkedKeys: [] }, this.getUnAssignData);
    }
    if (!isEqual(prevProps.featureRole.unAssignListData, featureRole.unAssignListData)) {
      this.setState(
        {
          unAssignListData: featureRole.unAssignListData,
        },
        () => {
          const { allValue } = this.state;
          if (allValue) {
            this.handlerSearch();
          }
        },
      );
    }
  }

  getUnAssignData = () => {
    const { featureRole, dispatch } = this.props;
    const { selectedFeatureRole } = featureRole;
    if (selectedFeatureRole) {
      dispatch({
        type: 'featureRole/getUnAssignedFeatureItemList',
        payload: {
          roleId: selectedFeatureRole.id,
        },
      });
    }
  };

  assignFeatureItem = e => {
    e.stopPropagation();
    const { featureRole, dispatch } = this.props;
    const { selectedFeatureRole } = featureRole;
    const { checkedKeys: childIds } = this.state;
    if (childIds.length > 0) {
      dispatch({
        type: 'featureRole/assignFeatureItem',
        payload: {
          parentId: selectedFeatureRole.id,
          childIds,
        },
        callback: res => {
          if (res.success) {
            this.handlerClose(true);
            this.refreshAssignData();
          }
        },
      });
    }
  };

  handlerClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureRole/updateState',
      payload: {
        showAssignFeature: false,
      },
    });
  };

  refreshAssignData = () => {
    const { featureRole, dispatch } = this.props;
    const { selectedFeatureRole } = featureRole;
    if (selectedFeatureRole) {
      dispatch({
        type: 'featureRole/getAssignFeatureItem',
        payload: {
          roleId: selectedFeatureRole.id,
        },
      });
    }
  };

  handlerSearchChange = v => {
    this.setState({ allValue: v });
  };

  handlerSearch = () => {
    const { unAssignListData } = this.getLocalFilterData();
    this.setState({ unAssignListData });
  };

  handlerCheckedChange = (checkedKeys, e) => {
    const { unAssignListData } = this.state;
    const { checked: nodeChecked } = e;
    const nodeId = get(e, 'node.props.eventKey', null) || null;
    const { checked } = checkedKeys;
    let originCheckedKeys = [...checked];
    const pids = getAllParentIdsByNode(unAssignListData, nodeId);
    const cids = getAllChildIdsByNode(unAssignListData, nodeId);
    if (nodeChecked) {
      // 选中：所有父节点选中，及所有子节点选中
      originCheckedKeys.push(...pids);
      originCheckedKeys.push(...cids);
    } else {
      // 取消：父节点状态不变，所有子节点取消选中
      originCheckedKeys = without(originCheckedKeys, ...cids);
    }
    const checkedData = uniqBy([...originCheckedKeys], id => id);
    this.setState({ checkedKeys: checkedData });
  };

  onCancelBatchAssignedFeatureItem = () => {
    this.setState({
      checkedKeys: [],
    });
  };

  filterNodes = (valueKey, treeData) => {
    const newArr = [];
    treeData.forEach(treeNode => {
      const nodeChildren = treeNode[childFieldKey];
      const fieldValue = treeNode.name;
      if (fieldValue.toLowerCase().indexOf(valueKey) > -1) {
        newArr.push(treeNode);
      } else if (nodeChildren && nodeChildren.length > 0) {
        const ab = this.filterNodes(valueKey, nodeChildren);
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
    const { featureRole } = this.props;
    const { unAssignListData } = featureRole;
    const { allValue } = this.state;
    let newData = [...unAssignListData];
    const searchValue = allValue;
    if (searchValue) {
      newData = this.filterNodes(searchValue.toLowerCase(), newData);
    }
    return { unAssignListData: newData };
  };

  renderNodeIcon = featureType => {
    let icon = null;
    switch (featureType) {
      case FEATURE_TYPE.PAGE:
        icon = <ExtIcon type="doc" tooltip={{ title: '页面' }} style={{ color: '#722ed1' }} />;
        break;
      case FEATURE_TYPE.OPERATE:
        icon = <ExtIcon type="dian" tooltip={{ title: '功能项' }} />;
        break;
      default:
    }
    return icon;
  };

  renderTreeNodes = treeData => {
    const { allValue } = this.state;
    const searchValue = allValue || '';
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
      const nodeTitle = title;
      if (readerChildren && readerChildren.length > 0) {
        return (
          <TreeNode title={nodeTitle} key={item.id} icon={this.renderNodeIcon(item.type)}>
            {this.renderTreeNodes(readerChildren)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          icon={this.renderNodeIcon(item.type)}
          switcherIcon={<span />}
          title={nodeTitle}
          key={item.id}
        />
      );
    });
  };

  renderTree = () => {
    const { checkedKeys, unAssignListData } = this.state;
    if (unAssignListData.length === 0) {
      return (
        <div className="blank-empty">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂时没有数据" />
        </div>
      );
    }
    return (
      <Tree
        className="unassigned-tree"
        checkable
        defaultExpandAll
        blockNode
        showIcon
        checkStrictly
        autoExpandParent={false}
        switcherIcon={<ExtIcon type="down" antd style={{ fontSize: 12 }} />}
        onCheck={this.handlerCheckedChange}
        checkedKeys={checkedKeys}
      >
        {this.renderTreeNodes(unAssignListData)}
      </Tree>
    );
  };

  render() {
    const { featureRole, loading } = this.props;
    const { showAssignFeature } = featureRole;
    const assigning = loading.effects['featureRole/assignFeatureItem'];
    const { checkedKeys, allValue } = this.state;
    const checkCount = checkedKeys.length;
    const loadingUnAssigned = loading.effects['featureRole/getUnAssignedFeatureItemList'];
    return (
      <Drawer
        width={520}
        destroyOnClose
        getContainer={false}
        placement="right"
        visible={showAssignFeature}
        title="分配权限"
        className={cls(styles['feature-item-box'])}
        onClose={this.handlerClose}
        style={{ position: 'absolute' }}
      >
        <div className="header-tool-box">
          <div className="tool-search-box">
            <Button
              style={{ marginLeft: 8 }}
              className="refresh"
              type="reload"
              antd
              onClick={this.getUnAssignData}
            >
              刷新
            </Button>
            <Search
              placeholder="输入名称关键字查询"
              value={allValue}
              onChange={e => this.handlerSearchChange(e.target.value)}
              onSearch={this.handlerSearch}
              onPressEnter={this.handlerSearch}
              style={{ width: 172 }}
            />
          </div>
          <Drawer
            placement="top"
            closable={false}
            mask={false}
            height={44}
            getContainer={false}
            style={{ position: 'absolute' }}
            visible={checkCount > 0}
          >
            <Button
              type="danger"
              ghost
              onClick={this.onCancelBatchAssignedFeatureItem}
              disabled={assigning}
            >
              取消
            </Button>
            <Button
              loading={assigning}
              type="primary"
              disabled={checkCount === 0}
              onClick={e => this.assignFeatureItem(e)}
            >
              {`确定 (${checkCount})`}
            </Button>
            <span className={cls('select')}>{`已选择 ${checkedKeys.length} 项`}</span>
          </Drawer>
        </div>
        <div className="unassigned-body">
          <ScrollBar>{loadingUnAssigned ? <ListLoader /> : this.renderTree()}</ScrollBar>
        </div>
      </Drawer>
    );
  }
}

export default UnAssignFeature;
