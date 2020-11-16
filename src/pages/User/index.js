import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input, Empty, Popconfirm, Layout } from 'antd';
import { ExtIcon, ListCard } from 'suid';
import empty from '@/assets/item_empty.svg';
import { constants } from '@/utils';
import GroupAdd from './components/UserGroupForm/Add';
import GroupEdit from './components/UserGroupForm/Edit';
import UserList from './components/User';
import styles from './index.less';

const { MOCKER_PATH } = constants;
const { Search } = Input;
const { Sider, Content } = Layout;

@connect(({ userGroup, authUser, loading }) => ({ userGroup, authUser, loading }))
class User extends Component {
  static listCardRef = null;

  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      delGroupId: null,
    };
  }

  componentDidUpdate() {
    const { userGroup } = this.props;
    const { listData: stateListData } = this.state;
    if (!isEqual(stateListData, userGroup.listData)) {
      const { listData } = userGroup;
      this.setState({
        listData,
      });
    }
  }

  reloadUserGroupData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userGroup/queryUserGroupList',
    });
  };

  saveUserGroup = (data, handlerPopoverHide) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userGroup/saveUserGroup',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'userGroup/queryUserGroupList',
          });
          if (handlerPopoverHide) handlerPopoverHide();
        }
      },
    });
  };

  delUserGroup = (data, e) => {
    if (e) e.stopPropagation();
    const { dispatch } = this.props;
    this.setState(
      {
        delGroupId: data.id,
      },
      () => {
        dispatch({
          type: 'userGroup/delUserGroup',
          payload: {
            id: data.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                delGroupId: null,
              });
              this.reloadUserGroupData();
            }
          },
        });
      },
    );
  };

  handlerGroupSelect = (keys, items) => {
    const { dispatch } = this.props;
    const selectedUserGroup = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'userGroup/updateState',
      payload: {
        selectedUserGroup,
      },
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

  renderCustomTool = () => (
    <>
      <Search
        allowClear
        placeholder="输入代码、名称关键字查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
    </>
  );

  renderItemAction = item => {
    const { loading } = this.props;
    const { delGroupId } = this.state;
    const saving = loading.effects['userGroup/saveUserGroup'];
    return (
      <>
        <div className="tool-action" onClick={e => e.stopPropagation()}>
          <GroupEdit saving={saving} saveUserGroup={this.saveUserGroup} groupData={item} />
          <Popconfirm
            title={formatMessage({ id: 'global.delete.confirm', defaultMessage: '确定要删除吗?' })}
            onConfirm={e => this.delUserGroup(item, e)}
          >
            {loading.effects['userGroup/delUserGroup'] && delGroupId === item.id ? (
              <ExtIcon className={cls('del', 'action-item')} type="loading" antd />
            ) : (
              <ExtIcon className={cls('del', 'action-item')} type="delete" antd />
            )}
          </Popconfirm>
        </div>
      </>
    );
  };

  render() {
    const { loading, userGroup } = this.props;
    const { currentUserGroup, selectedUserGroup } = userGroup;
    const saving = loading.effects['userGroup/saveUserGroup'];
    const selectedKeys = currentUserGroup ? [currentUserGroup.id] : [];
    const userGroupProps = {
      className: 'left-content',
      title: '用户组',
      showSearch: false,
      onSelectChange: this.handlerGroupSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['code', 'name'],
      selectedKeys,
      extra: <GroupAdd saving={saving} saveUserGroup={this.saveUserGroup} />,
      itemField: {
        title: item => item.name,
        description: item => item.code,
      },
      store: {
        url: `${MOCKER_PATH}/sei-manager/user/getUserGroupList`,
      },
      itemTool: this.renderItemAction,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={320} className="auto-height" theme="light">
            <ListCard {...userGroupProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 8 }}>
            {selectedUserGroup ? (
              <UserList userGroup={selectedUserGroup} />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="可选择左边列表项进行相应的操作" />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    );
  }
}
export default User;
