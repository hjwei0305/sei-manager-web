import React, { Component } from 'react';
import cls from 'classnames';
import { cloneDeep, isEqual } from 'lodash';
import { Tree } from 'antd';
import { ScrollBar, ExtIcon, ExtModal } from 'suid';
import styles from './MenuMoveModal.less';

const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';

class MenuMoveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      targetParentId: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { treeData, currentNode } = this.props;
    if (currentNode && !isEqual(currentNode, prevProps.currentNode)) {
      const newTreeData = [];
      this.getMoveTreeData(cloneDeep(treeData), newTreeData, currentNode.id);
      this.setState({
        treeData: newTreeData,
      });
    }
  }

  getMoveTreeData = (data, result, excludeId) =>
    data.forEach(item => {
      if (item[childFieldKey] && item[childFieldKey].length > 0) {
        if (item.id !== excludeId) {
          const tempItem = cloneDeep(item);
          tempItem[childFieldKey] = [];
          result.push(tempItem);
          this.getMoveTreeData(item[childFieldKey], tempItem[childFieldKey], excludeId);
        }
      } else if (item.id !== excludeId) {
        result.push(item);
      }
    });

  submitMove = () => {
    const { targetParentId } = this.state;
    const { submitMove, currentNode } = this.props;
    const params = { nodeId: currentNode.id, targetParentId };
    submitMove(params);
  };

  handlerSelect = (selectedKeys, e) => {
    let targetParentId = null;
    if (e.selected) {
      [targetParentId] = selectedKeys;
    }
    this.setState({
      targetParentId,
    });
  };

  handlerCloseMenuMoveModal = () => {
    const { closeMenuMoveModal } = this.props;
    this.setState({ targetParentId: null }, () => {
      if (closeMenuMoveModal) {
        closeMenuMoveModal();
      }
    });
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
      const iconProps = {
        type: item.parentId ? 'dian' : 'down',
        antd: !item.parentId,
      };
      return (
        <TreeNode
          switcherIcon={<ExtIcon {...iconProps} style={{ fontSize: 10 }} />}
          title={title}
          key={item.id}
        />
      );
    });
  };

  render() {
    const { targetParentId, treeData } = this.state;
    const { showMove, currentNode, loading } = this.props;
    const title = currentNode ? `将菜单【${currentNode.name}】移动到...` : '';
    const modalProps = {
      destroyOnClose: true,
      onCancel: this.handlerCloseMenuMoveModal,
      visible: showMove,
      centered: true,
      title,
      okButtonProps: { disabled: !targetParentId, loading: loading.effects['appMenu/move'] },
      onOk: this.submitMove,
    };
    return (
      <ExtModal {...modalProps} className={cls(styles['meun-move-modal'])}>
        <ScrollBar>
          <Tree
            blockNode
            switcherIcon={<ExtIcon type="down" antd style={{ fontSize: 12 }} />}
            onSelect={this.handlerSelect}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
        </ScrollBar>
      </ExtModal>
    );
  }
}
export default MenuMoveModal;
