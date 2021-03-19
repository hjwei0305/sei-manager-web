import React, { PureComponent } from 'react';
import cls from 'classnames';
import { isEqual, trim } from 'lodash';
import PropTypes from 'prop-types';
import { Button, Dropdown, Input, Tree } from 'antd';
import { ScrollBar, ExtIcon } from 'suid';
import styles from './index.less';

const { Search } = Input;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';

class DropdownGroup extends PureComponent {
  static allValue = '';

  static data = [];

  static propTypes = {
    onAction: PropTypes.func,
    projectGroupData: PropTypes.array,
  };

  constructor(props) {
    super(props);
    const { projectGroupData } = props;
    this.data = [...projectGroupData];
    this.state = {
      appGroupName: '全部项目组',
      showApp: false,
      treeData: projectGroupData,
      expandedKeys: [],
      selectedKeys: [],
      autoExpandParent: false,
    };
  }

  componentDidUpdate(preProps) {
    const { projectGroupData } = this.props;
    if (!isEqual(preProps.projectGroupData, projectGroupData)) {
      this.data = [...projectGroupData];
      this.setState({ treeData: projectGroupData });
    }
  }

  handlerFilter = item => {
    const { onAction } = this.props;
    let appGroupCode = '';
    let appGroupName = '全部项目组';
    if (item) {
      appGroupCode = item.code;
      appGroupName = item.remark;
    }
    this.setState({ appGroupName, showApp: false });
    if (onAction) {
      onAction(appGroupCode);
    }
  };

  handlerVisibleChange = showApp => {
    this.setState({ showApp });
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
        this.handlerFilter(currentNode);
      },
    );
  };

  handlerExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
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

  renderDropdownGroup = () => {
    const { appGroupName, treeData, expandedKeys, selectedKeys, autoExpandParent } = this.state;
    return (
      <div
        style={{
          padding: 8,
          maxHeight: 420,
          height: 420,
          width: 320,
          backgroundColor: '#fff',
          boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: 42,
            padding: '0 24px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 16 }} title={appGroupName}>
            {appGroupName}
          </div>
          <Button onClick={() => this.handlerFilter()} style={{ marginLeft: 8 }}>
            重置
          </Button>
        </div>
        <div className="header-tool-box">
          <Search
            placeholder="输入项目名或标题关键字"
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerSearch}
          />
        </div>
        <div className="list-body" style={{ height: 330 }}>
          <ScrollBar>
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
          </ScrollBar>
        </div>
      </div>
    );
  };

  render() {
    const { appGroupName, showApp } = this.state;
    return (
      <Dropdown
        onVisibleChange={this.handlerVisibleChange}
        visible={showApp}
        overlay={this.renderDropdownGroup()}
        trigger={['click']}
      >
        <span className={cls(styles['view-box'], 'filter-box')}>
          <span className="view-content" title={appGroupName}>
            {appGroupName}
          </span>
          <ExtIcon type="down" antd />
        </span>
      </Dropdown>
    );
  }
}
export default DropdownGroup;
