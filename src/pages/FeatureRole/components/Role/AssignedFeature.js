import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual, get, uniqBy, without } from 'lodash';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Card, Popconfirm, Button, Drawer, Empty, Tree, Input } from 'antd';
import { ScrollBar, ListLoader, ExtIcon, BannerTitle } from 'suid';
import { constants, getAllChildIdsByNode } from '@/utils';
import styles from './AssignedFeature.less';

const { FEATURE_TYPE } = constants;

const { Search } = Input;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';

@connect(({ featureRole, loading }) => ({ featureRole, loading }))
class AssignedFeature extends Component {
  constructor(props) {
    super(props);
    const { featureRole } = props;
    const { assignListData = [] } = featureRole;
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      allValue: '',
      assignListData,
      checkedKeys: [],
      delRowId: null,
    };
  }

  componentDidMount() {
    this.getAssignData();
  }

  componentDidUpdate(prevProps) {
    const { featureRole } = this.props;
    const { assignListData, selectedFeatureRole } = featureRole;
    if (!isEqual(prevProps.featureRole.selectedFeatureRole, selectedFeatureRole)) {
      this.setState(
        {
          delRowId: null,
          autoExpandParent: true,
          expandedKeys: [],
          checkedKeys: [],
        },
        this.getAssignData,
      );
    }
    if (!isEqual(prevProps.featureRole.assignListData, assignListData)) {
      this.setState({
        allValue: '',
        assignListData,
        autoExpandParent: true,
        expandedKeys: this.getAllExpandKeys(assignListData),
      });
    }
  }

  getAssignData = () => {
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

  showAssignFeature = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureRole/updateState',
      payload: {
        showAssignFeature: true,
      },
    });
  };

  assignFeatureItem = childIds => {
    const { featureRole, dispatch } = this.props;
    const { selectedFeatureRole } = featureRole;
    dispatch({
      type: 'featureRole/assignFeatureItem',
      payload: {
        parentId: selectedFeatureRole.id,
        childIds,
      },
      callback: res => {
        if (res.success) {
          this.getAssignData();
        }
      },
    });
  };

  removeAssignFeatureItem = childIds => {
    const { featureRole, dispatch } = this.props;
    const { selectedFeatureRole } = featureRole;
    if (childIds.length === 1) {
      this.setState({
        delRowId: childIds[0],
      });
    }
    dispatch({
      type: 'featureRole/removeAssignedFeatureItem',
      payload: {
        parentId: selectedFeatureRole.id,
        childIds,
      },
      callback: res => {
        if (res.success) {
          this.setState({
            delRowId: null,
            checkedKeys: [],
          });
          this.getAssignData();
        }
      },
    });
  };

  batchRemoveAssignedFeatureItem = () => {
    const { checkedKeys } = this.state;
    this.removeAssignFeatureItem(checkedKeys);
  };

  onCancelBatchRemoveAssignedFeatureItem = () => {
    this.setState({
      checkedKeys: [],
    });
  };

  handlerSelectRow = checkedKeys => {
    this.setState({
      checkedKeys,
    });
  };

  renderRemoveBtn = item => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    let icon = <ExtIcon className="del" type="minus-circle" antd />;
    if (loading.effects['featureRole/removeAssignedFeatureItem'] && delRowId === item.id) {
      icon = <ExtIcon className="del-loading" type="loading" antd />;
    }
    return (
      <Popconfirm
        title={formatMessage({
          id: 'global.remove.confirm',
          defaultMessage: '确定要移除功能项吗?',
        })}
        onConfirm={() => this.removeAssignFeatureItem([item.id])}
        placement="topLeft"
      >
        {icon}
      </Popconfirm>
    );
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
    const { assignListData } = featureRole;
    const { allValue } = this.state;
    let newData = [...assignListData];
    const searchValue = allValue;
    if (searchValue) {
      newData = this.filterNodes(searchValue.toLowerCase(), newData);
    }
    return {
      assignListData: newData,
      expandedKeys: this.getAllExpandKeys(newData),
    };
  };

  handlerSearchChange = v => {
    this.setState({ allValue: v });
  };

  handlerSearch = () => {
    const { assignListData, expandedKeys } = this.getLocalFilterData();
    this.setState({ assignListData, expandedKeys, autoExpandParent: true });
  };

  handlerCheckedChange = (checkedKeys, e) => {
    const { assignListData } = this.state;
    const { checked: nodeChecked } = e;
    const nodeId = get(e, 'node.props.eventKey', null) || null;
    const { checked } = checkedKeys;
    let originCheckedKeys = [...checked];
    const cids = getAllChildIdsByNode(assignListData, nodeId);
    if (nodeChecked) {
      // 选中：所有子节点选中
      originCheckedKeys.push(...cids);
    } else {
      // 取消：父节点状态不变，所有子节点取消选中
      originCheckedKeys = without(originCheckedKeys, ...cids);
    }
    const checkedData = uniqBy([...originCheckedKeys], id => id);
    this.setState({ checkedKeys: checkedData });
  };

  handlerExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  getAllExpandKeys = treeData => {
    const temp = [];
    const forFn = arr => {
      for (let i = 0; i < arr.length; i += 1) {
        const item = arr[i];
        if (item[childFieldKey] && item[childFieldKey].length > 0) {
          temp.push(item.id);
          forFn(item[childFieldKey]);
        }
      }
    };
    forFn(treeData);
    return temp;
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
      const nodeTitle = (
        <>
          {title}
          <div className="action-box">{this.renderRemoveBtn(item)}</div>
        </>
      );
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
    const { checkedKeys, assignListData, expandedKeys, autoExpandParent } = this.state;
    if (assignListData.length === 0) {
      return (
        <div className="blank-empty">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂时没有数据" />
        </div>
      );
    }
    return (
      <Tree
        className="assigned-tree"
        checkable
        defaultExpandAll
        blockNode
        showIcon
        checkStrictly
        autoExpandParent={autoExpandParent}
        expandedKeys={expandedKeys}
        switcherIcon={<ExtIcon type="down" antd style={{ fontSize: 12 }} />}
        onCheck={this.handlerCheckedChange}
        checkedKeys={checkedKeys}
        onExpand={this.handlerExpand}
      >
        {this.renderTreeNodes(assignListData)}
      </Tree>
    );
  };

  render() {
    const { featureRole, loading } = this.props;
    const { selectedFeatureRole } = featureRole;
    const { checkedKeys, allValue } = this.state;
    const hasSelected = checkedKeys.length > 0;
    const loadingAssigned = loading.effects['featureRole/getAssignFeatureItem'];
    return (
      <div className={cls(styles['assigned-feature-box'])}>
        <Card
          title={<BannerTitle title={selectedFeatureRole.name} subTitle="功能权限" />}
          bordered={false}
        >
          <div className={cls('tool-box')}>
            <Button
              type="primary"
              loading={loading.effects['featureRole/getUnAssignedFeatureItemList']}
              onClick={this.showAssignFeature}
            >
              分配权限
            </Button>
            <Button onClick={this.getAssignData}>
              <FormattedMessage id="global.refresh" defaultMessage="刷新" />
            </Button>
            <div className="tool-search-box">
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
              visible={hasSelected}
            >
              <Button
                onClick={this.onCancelBatchRemoveAssignedFeatureItem}
                disabled={loading.effects['featureRole/removeAssignedFeatureItem']}
              >
                取消
              </Button>
              <Popconfirm
                title="确定要移除选择的项目吗？"
                onConfirm={this.batchRemoveAssignedFeatureItem}
              >
                <Button
                  ghost
                  type="danger"
                  loading={loading.effects['featureRole/removeAssignedFeatureItem']}
                >
                  批量移除
                </Button>
              </Popconfirm>
              <span className={cls('select')}>{`已选择 ${checkedKeys.length} 项`}</span>
            </Drawer>
          </div>
          <div className="assigned-body">
            <ScrollBar>{loadingAssigned ? <ListLoader /> : this.renderTree()}</ScrollBar>
          </div>
        </Card>
      </div>
    );
  }
}

export default AssignedFeature;
