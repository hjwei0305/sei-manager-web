/*
 * @Author: Eason
 * @Date: 2020-02-15 11:53:29
 * @Last Modified by: Eason
 * @Last Modified time: 2020-11-13 14:58:22
 */
import React, { Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { Layout, Button, Input } from 'antd';
import { ListCard } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Content } = Layout;
const { Search } = Input;

class UserAssign extends Component {
  static listCardRef;

  static propTypes = {
    onBackAssigned: PropTypes.func,
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
        if (re.success) {
          if (onBackAssigned) onBackAssigned();
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
          <Button type="danger" ghost disabled={!hasSelected} onClick={this.assignedCancel}>
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
          <Search
            placeholder="输入名称关键字查询"
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerPressEnter}
            style={{ width: 220 }}
          />
        </div>
      </>
    );
  };

  render() {
    const { selectedKeys } = this.state;
    const { extParams } = this.props;
    const listCardProps = {
      className: 'anyone-user-box',
      bordered: false,
      searchPlaceHolder: '输入用户代码或名称关键字查询',
      searchProperties: ['code', 'userName'],
      checkbox: true,
      selectedKeys,
      itemField: {
        title: item => item.userName,
        description: item => (
          <>
            {item.userTypeRemark}
            <br />
            {item.remark}
          </>
        ),
      },
      remotePaging: true,
      showArrow: false,
      showSearch: false,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/user/queryUsers`,
        params: { ...extParams, includeSubNode: true },
      },
      onListCardRef: ref => (this.listCardRef = ref),
      onSelectChange: this.handerAssignUserSelectChange,
      customTool: this.renderCustomTool,
    };
    return (
      <Layout className={cls(styles['user-panel-box'])}>
        <Content className={cls('auto-height')}>
          <ListCard {...listCardProps} />
        </Content>
      </Layout>
    );
  }
}

export default UserAssign;
