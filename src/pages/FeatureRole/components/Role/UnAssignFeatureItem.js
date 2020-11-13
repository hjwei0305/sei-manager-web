import React, { Component } from 'react';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { connect } from 'dva';
import { Button, Input, Drawer, Tree, Empty, Tooltip } from 'antd';
import { ScrollBar, ListLoader, ExtIcon, ComboList } from 'suid';
import { constants } from '@/utils';
import styles from './UnAssignFeatureItem.less';

const { FEATURE_TYPE, SERVER_PATH } = constants;
const { Search } = Input;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';

@connect(({ featureRole, loading }) => ({ featureRole, loading }))
class UnAssignFeatureItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allValue: '',
      appModuleId: '',
      appModuleName: '',
      checkedKeys: [],
      pageKeys: [],
      unAssignListData: [],
    };
  }

  componentDidUpdate(prevProps) {
    const { featureRole, showAssignFeature } = this.props;
    if (!isEqual(prevProps.featureRole.currentRole, featureRole.currentRole)) {
      this.setState({
        checkedKeys: [],
        unAssignListData: [],
      });
    }
    if (!isEqual(prevProps.showAssignFeature, showAssignFeature) && showAssignFeature === true) {
      this.setState(
        {
          checkedKeys: [],
          pageKeys: [],
        },
        this.getUnAssignData,
      );
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
    const { appModuleId } = this.state;
    const { featureRole, dispatch } = this.props;
    const { currentRole } = featureRole;
    if (currentRole && appModuleId) {
      dispatch({
        type: 'featureRole/getUnAssignedFeatureItemList',
        payload: {
          appModuleId,
          featureRoleId: currentRole.id,
        },
      });
    }
  };

  assignFeatureItem = e => {
    e.stopPropagation();
    const { featureRole, dispatch } = this.props;
    const { currentRole } = featureRole;
    const { checkedKeys, pageKeys } = this.state;
    if (checkedKeys.length > 0) {
      const childIds = checkedKeys.concat(pageKeys);
      dispatch({
        type: 'featureRole/assignFeatureItem',
        payload: {
          parentId: currentRole.id,
          childIds,
        },
        callback: res => {
          if (res.success) {
            this.handlerClose(true);
          }
        },
      });
    }
  };

  handlerClose = refresh => {
    const { closeAssignFeatureItem } = this.props;
    if (closeAssignFeatureItem) {
      closeAssignFeatureItem(refresh);
    }
  };

  handlerSearchChange = v => {
    this.setState({ allValue: v });
  };

  handlerSearch = () => {
    const { unAssignListData } = this.getLocalFilterData();
    this.setState({ unAssignListData });
  };

  handlerCheckedChange = (checkedKeys, { halfCheckedKeys: pageKeys }) => {
    this.setState({ checkedKeys, pageKeys });
  };

  onCancelBatchAssignedFeatureItem = () => {
    this.setState({
      checkedKeys: [],
      pageKeys: [],
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

  getTooltip = code => {
    return {
      placement: 'top',
      title: (
        <>
          代码
          <br />
          <span style={{ fontSize: 12, color: '#d2d2d2' }}>{code}</span>
        </>
      ),
    };
  };

  renderNodeIcon = featureType => {
    let icon = null;
    switch (featureType) {
      case FEATURE_TYPE.APP_MODULE:
        icon = (
          <ExtIcon
            type="appstore"
            tooltip={{ title: '应用模块' }}
            antd
            style={{ color: '#13c2c2' }}
          />
        );
        break;
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
      const nodeTitle = <Tooltip {...this.getTooltip(item.code)}>{title}</Tooltip>;
      if (readerChildren && readerChildren.length > 0) {
        return (
          <TreeNode title={nodeTitle} key={item.id} icon={this.renderNodeIcon(item.featureType)}>
            {this.renderTreeNodes(readerChildren)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          icon={this.renderNodeIcon(item.featureType)}
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
    const { showAssignFeature, loading } = this.props;
    const assigning = loading.effects['featureRole/assignFeatureItem'];
    const { checkedKeys, appModuleName, allValue, appModuleId } = this.state;
    const checkCount = checkedKeys.length;
    const loadingUnAssigned = loading.effects['featureRole/getUnAssignedFeatureItemList'];
    const appModulePros = {
      style: { width: 180 },
      placeholder: '请选择应用模块',
      store: {
        url: `${SERVER_PATH}/sei-basic/tenantAppModule/getTenantAppModules`,
      },
      value: appModuleName,
      afterSelect: item => {
        this.setState(
          {
            appModuleId: item.id,
            appModuleName: item.name,
          },
          this.getUnAssignData,
        );
      },
      reader: {
        name: 'name',
        description: 'code',
      },
    };
    return (
      <Drawer
        width={520}
        destroyOnClose
        getContainer={false}
        placement="right"
        visible={showAssignFeature}
        title="分配功能项"
        className={cls(styles['feature-item-box'])}
        onClose={this.handlerClose}
        style={{ position: 'absolute' }}
      >
        <div className="header-tool-box">
          <div className="app-box">
            <span className="label">应用模块</span>
            <ComboList {...appModulePros} />
          </div>
          <div className="tool-search-box">
            <Search
              placeholder="输入名称关键字查询"
              value={allValue}
              onChange={e => this.handlerSearchChange(e.target.value)}
              onSearch={this.handlerSearch}
              onPressEnter={this.handlerSearch}
              style={{ width: 172 }}
            />
            {appModuleId ? (
              <ExtIcon
                style={{ marginLeft: 8 }}
                className="refresh"
                type="reload"
                antd
                spin={loadingUnAssigned}
                onClick={this.getUnAssignData}
              />
            ) : null}
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

export default UnAssignFeatureItem;
