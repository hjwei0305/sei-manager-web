import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get } from 'lodash';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card, Tag, Drawer, Popconfirm } from 'antd';
import { ExtTable, BannerTitle } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH, USER_ACTION } = constants;

@connect(({ userGroup, loading }) => ({ userGroup, loading }))
class AssignedUser extends Component {
  static tableRef;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handlerAction = (key, userGroup) => {
    const { dispatch } = this.props;
    const payload = { currentUser: userGroup };
    const extData = {};
    switch (key) {
      case USER_ACTION.RESET_PASSWORD:
        extData.showResetPasswordModal = true;
        break;
      case USER_ACTION.FEATURE_ROLE:
        extData.showConfigFeatrueRole = true;
        break;
      default:
    }
    dispatch({
      type: 'userGroup/updateState',
      payload: {
        ...payload,
        ...extData,
      },
    });
  };

  handlerSelectRow = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  onCancelBatchRemoveAssigned = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  showAssignUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userGroup/updateState',
      payload: {
        showAssign: true,
      },
    });
  };

  removeAssignedUsers = () => {
    const { userGroup, dispatch } = this.props;
    const { selectedUserGroup } = userGroup;
    const { selectedRowKeys: childIds } = this.state;
    dispatch({
      type: 'userGroup/removeAssignedUsers',
      payload: {
        parentId: selectedUserGroup.id,
        childIds,
      },
      callback: res => {
        if (res.success) {
          this.setState({
            selectedRowKeys: [],
          });
          this.reloadData();
        }
      },
    });
  };

  renderNickname = (t, row) => {
    return (
      <>
        {t}
        {row.admin ? (
          <Tag color="blue" style={{ marginLeft: 8 }}>
            管理员
          </Tag>
        ) : null}
        {row.status === false ? (
          <Tag color="red" style={{ marginLeft: 8 }}>
            已停用
          </Tag>
        ) : null}
      </>
    );
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { loading, userGroup } = this.props;
    const { selectedUserGroup } = userGroup;
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      // {
      //   title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
      //   key: 'operation',
      //   width: 80,
      //   align: 'center',
      //   dataIndex: 'id',
      //   className: 'action',
      //   required: true,
      //   render: (_text, record) => (
      //     <span className={cls('action-box')} onClick={e => e.stopPropagation()}>
      //       <ExtAction userData={record} onAction={this.handlerAction} />
      //     </span>
      //   ),
      // },
      {
        title: '昵称',
        dataIndex: 'nickname',
        width: 220,
        required: true,
        render: this.renderNickname,
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        width: 180,
        render: t => t || '-',
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
        width: 360,
        render: t => t || '-',
      },
    ];
    const removeLoading = loading.effects['userGroup/removeAssignedUsers'];
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.showAssignUser}>
            添加成员
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
          <Drawer
            placement="top"
            closable={false}
            mask={false}
            height={44}
            getContainer={false}
            style={{ position: 'absolute' }}
            visible={hasSelected}
          >
            <Button onClick={this.onCancelBatchRemoveAssigned} disabled={removeLoading}>
              取消
            </Button>
            <Popconfirm title="确定要移除选择的成员吗？" onConfirm={this.removeAssignedUsers}>
              <Button type="danger" loading={removeLoading}>
                {`移除成员( ${selectedRowKeys.length} )`}
              </Button>
            </Popconfirm>
          </Drawer>
        </>
      ),
    };
    const extTableProps = {
      bordered: false,
      toolBar: toolBarProps,
      columns,
      checkbox: {
        rowCheck: false,
      },
      selectedRowKeys,
      onSelectRow: this.handlerSelectRow,
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '输入昵称、手机、邮箱关键字',
      searchProperties: ['nickname', 'phone', 'email'],
      searchWidth: 260,
      store: {
        url: `${SERVER_PATH}/sei-manager/userGroupUser/getChildrenFromParentId`,
      },
      cascadeParams: {
        parentId: get(selectedUserGroup, 'id'),
      },
    };
    return (
      <div className={cls(styles['user-box'])}>
        <Card
          title={<BannerTitle title={get(selectedUserGroup, 'name')} subTitle="组成员" />}
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
      </div>
    );
  }
}

export default AssignedUser;
