/*
 * @Author: Eason
 * @Date: 2020-02-15 11:53:29
 * @Last Modified by: Eason
 * @Last Modified time: 2021-03-17 10:04:14
 */
import React, { Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, Input, Tooltip } from 'antd';
import { ListCard } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Search } = Input;

class FeatureRoleAssign extends Component {
  static listCardRef;

  static propTypes = {
    currentUser: PropTypes.object,
    onBackAssigned: PropTypes.func,
    saving: PropTypes.bool,
    save: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
    };
  }

  handerAssignUserSelectChange = selectedKeys => {
    this.setState({ selectedKeys });
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  assignedSave = () => {
    const { selectedKeys } = this.state;
    const { save, onBackAssigned } = this.props;
    if (save) {
      save(selectedKeys, re => {
        if (re.success && onBackAssigned) {
          onBackAssigned();
        }
      });
    }
  };

  assignedCancel = () => {
    this.setState({ selectedKeys: [] });
  };

  renderCustomTool = () => {
    const { selectedKeys } = this.state;
    const { saving } = this.props;
    const hasSelected = selectedKeys.length > 0;
    return (
      <>
        <div>
          <Button
            type="danger"
            ghost
            disabled={!hasSelected || saving}
            onClick={this.assignedCancel}
          >
            取消
          </Button>
          <Button
            type="primary"
            disabled={!hasSelected}
            loading={saving}
            onClick={this.assignedSave}
          >
            {`确定 (${selectedKeys.length})`}
          </Button>
        </div>
        <div>
          <Tooltip title="输入名称关键字查询">
            <Search
              placeholder="输入名称关键字查询"
              onChange={e => this.handlerSearchChange(e.target.value)}
              onSearch={this.handlerSearch}
              onPressEnter={this.handlerPressEnter}
              style={{ width: 132 }}
            />
          </Tooltip>
        </div>
      </>
    );
  };

  render() {
    const { selectedKeys } = this.state;
    const { currentUser } = this.props;
    const listCardProps = {
      className: 'anyone-user-box',
      title: '角色列表',
      bordered: false,
      searchPlaceHolder: '输入名称关键字查询',
      checkbox: true,
      selectedKeys,
      itemField: {
        title: item => item.name,
        description: item => item.description,
      },
      showArrow: false,
      showSearch: false,
      cascadeParams: {
        parentId: get(currentUser, 'id', null),
      },
      store: {
        url: `${SERVER_PATH}/sei-manager/userRole/getUnassigned`,
      },
      onListCardRef: ref => (this.listCardRef = ref),
      onSelectChange: this.handerAssignUserSelectChange,
      customTool: this.renderCustomTool,
    };
    return (
      <div className={cls(styles['user-panel-box'])}>
        <ListCard {...listCardProps} />
      </div>
    );
  }
}

export default FeatureRoleAssign;
