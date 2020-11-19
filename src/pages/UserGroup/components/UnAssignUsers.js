import React, { Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, Input, Drawer } from 'antd';
import { ListCard } from 'suid';
import { constants } from '@/utils';
import styles from './UnAssignUsers.less';

const { SERVER_PATH } = constants;
const { Search } = Input;

class UnAssignUsers extends Component {
  static listCardRef;

  static propTypes = {
    selectedUserGroup: PropTypes.object.isRequired,
    showAssign: PropTypes.bool,
    closeAssignUsers: PropTypes.func,
    assignUsers: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  assignUsers = () => {
    const { assignUsers } = this.props;
    const { checkedList } = this.state;
    const childIds = [];
    if (Object.keys(checkedList).length > 0) {
      Object.keys(checkedList).forEach(key => childIds.push(key));
    }
    if (assignUsers) {
      assignUsers(childIds);
    }
  };

  handlerClose = () => {
    const { closeAssignUsers } = this.props;
    if (closeAssignUsers) {
      closeAssignUsers();
    }
  };

  handlerSelectRow = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  onCancelAssigned = () => {
    this.setState({
      selectedRowKeys: [],
    });
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

  renderCustomTool = () => {
    const { selectedRowKeys } = this.state;
    return (
      <>
        <Button type="primary" disabled={selectedRowKeys.length === 0}>
          {`确定( ${selectedRowKeys.length} )`}
        </Button>
        <Search
          placeholder="输入昵称、手机、邮箱关键字"
          onChange={e => this.handlerSearchChange(e.target.value)}
          onSearch={this.handlerSearch}
          onPressEnter={this.handlerPressEnter}
          style={{ width: 240 }}
        />
      </>
    );
  };

  render() {
    const { showAssign, selectedUserGroup } = this.props;
    const listCardProps = {
      showSearch: false,
      onSelectChange: this.handlerSelectRow,
      searchProperties: ['nickname', 'phone', 'email'],
      itemField: {
        title: item => item.name,
        description: item => item.email,
        extra: item => <span style={{ fontSize: 12 }}>{item.phone}</span>,
      },
      store: {
        url: `${SERVER_PATH}/sei-manager/userGroupUser/getUnassigned`,
      },
      cascadeParams: {
        parentId: get(selectedUserGroup, 'id'),
      },
      onListCardRef: ref => (this.listCardRef = ref),
      customTool: this.renderCustomTool,
    };
    return (
      <Drawer
        width={460}
        destroyOnClose
        getContainer={false}
        placement="right"
        visible={showAssign}
        title="未分配的成员"
        className={cls(styles['user-item-box'])}
        onClose={this.handlerClose}
        style={{ position: 'absolute' }}
      >
        <ListCard {...listCardProps} />
      </Drawer>
    );
  }
}

export default UnAssignUsers;
