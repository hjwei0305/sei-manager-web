import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input, Empty, Popconfirm, Layout } from 'antd';
import { ExtIcon, ListCard } from 'suid';
import empty from '@/assets/item_empty.svg';
import { constants } from '@/utils';
import GroupAdd from './components/UserGroupForm/Add';
import GroupEdit from './components/UserGroupForm/Edit';
import AssignedUser from './components/AssignedUser';
import UnAssignUsers from './components/UnAssignUsers';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Search } = Input;
const { Sider, Content } = Layout;

@connect(({ userGroup, loading }) => ({ userGroup, loading }))
class UserGroup extends Component {
  static listCardRef = null;

  static assignedUserRef = null;

  constructor(props) {
    super(props);
    this.state = {
      delGroupId: null,
    };
  }

  reloadUserGroupData = () => {
    if (this.listCardRef) {
      this.listCardRef.remoteDataRefresh();
    }
  };

  saveUserGroup = (data, handlerPopoverHide) => {
    const { dispatch } = this.props;
    let action = 'saveUserGroup';
    let ds = null;
    if (data && data instanceof Array) {
      action = 'saveUserGroups';
      ds = [...data];
    } else {
      ds = { ...data };
    }
    dispatch({
      type: `userGroup/${action}`,
      payload: ds,
      callback: res => {
        if (res.success) {
          this.reloadUserGroupData();
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

  closeAssignUsers = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userGroup/updateState',
      payload: {
        showAssign: false,
      },
    });
  };

  assignUsers = childIds => {
    const { userGroup, dispatch } = this.props;
    const { selectedUserGroup } = userGroup;
    dispatch({
      type: 'userGroup/assignUsers',
      payload: {
        parentId: selectedUserGroup.id,
        childIds,
      },
      callback: res => {
        if (res.success && this.assignedUserRef) {
          this.assignedUserRef.reloadData();
        }
      },
    });
  };

  handlerAssignedRef = ref => {
    this.assignedUserRef = ref;
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
    const { selectedUserGroup, showAssign } = userGroup;
    const saving =
      loading.effects['userGroup/saveUserGroup'] || loading.effects['userGroup/saveUserGroups'];
    const selectedKeys = selectedUserGroup ? [selectedUserGroup.id] : [];
    const userGroupProps = {
      className: 'left-content',
      title: '用户组',
      showSearch: false,
      onSelectChange: this.handlerGroupSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['description', 'name'],
      selectedKeys,
      extra: <GroupAdd saving={saving} saveUserGroup={this.saveUserGroup} />,
      itemField: {
        title: item => item.name,
        description: item => item.description,
      },
      store: {
        url: `${SERVER_PATH}/sei-manager/userGroup/findAll`,
      },
      itemTool: this.renderItemAction,
    };
    const unAssignUsersProps = {
      selectedUserGroup,
      showAssign,
      closeAssignUsers: this.closeAssignUsers,
      assignUsers: this.assignUsers,
      assignLoading: loading.effects['userGroup/assignUsers'],
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={320} className="auto-height" theme="light">
            <ListCard {...userGroupProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            {selectedUserGroup ? (
              <AssignedUser onRef={this.handlerAssignedRef} />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="可选择左边列表项进行相应的操作" />
              </div>
            )}
          </Content>
        </Layout>
        {selectedUserGroup ? <UnAssignUsers {...unAssignUsersProps} /> : null}
      </div>
    );
  }
}
export default UserGroup;
