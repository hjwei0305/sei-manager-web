/*
 * @Author: Eason
 * @Date: 2020-02-15 11:53:29
 * @Last Modified by: Eason
 * @Last Modified time: 2021-04-22 10:10:35
 */
import React, { Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { Input, Radio } from 'antd';
import { ListCard } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Search } = Input;

class FeatureRoleAssign extends Component {
  static listCardRef;

  static propTypes = {
    userSelectChange: PropTypes.func,
  };

  handerAssignUserSelectChange = (_selectedKeys, items) => {
    const { userSelectChange } = this.props;
    if (userSelectChange && userSelectChange instanceof Function) {
      const [account] = items;
      userSelectChange(account);
    }
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

  renderAvatar = ({ keyValue, checkedList }) => {
    return <Radio checked={!!checkedList[keyValue]} />;
  };

  renderCustomTool = () => {
    return (
      <>
        <Search
          placeholder="输入名称关键字查询"
          onChange={e => this.handlerSearchChange(e.target.value)}
          onSearch={this.handlerSearch}
          onPressEnter={this.handlerPressEnter}
          style={{ width: '100%' }}
        />
      </>
    );
  };

  render() {
    const listCardProps = {
      className: 'anyone-user-box',
      bordered: false,
      searchPlaceHolder: '输入姓名关键字',
      searchProperties: ['userName', 'account'],
      itemField: {
        avatar: this.renderAvatar,
        title: item => item.userName,
        description: item => item.account,
      },
      rowKey: 'account',
      showArrow: false,
      showSearch: false,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/user/findByPage`,
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
