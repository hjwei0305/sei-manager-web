import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { USER_BTN_KEY } = constants;
const { authAction } = utils;

@connect(({ userList, loading }) => ({ userList, loading }))
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delRowId: null,
    };
  }

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/queryList',
    });
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/updateState',
      payload: {
        showModal: true,
        rowData: null,
      },
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/updateState',
      payload: {
        showModal: true,
        rowData,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/save',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'userList/updateState',
            payload: {
              showModal: false,
            },
          });
          this.reloadData();
        }
      },
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'userList/del',
          payload: {
            id: record.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                delRowId: null,
              });
              this.reloadData();
            }
          },
        });
      },
    );
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['userList/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  render() {
    const { userList, loading } = this.props;
    const { showModal, rowData } = userList;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (text, record) => (
          <span className={cls('action-box')}>
            {authAction(
              <ExtIcon
                key={USER_BTN_KEY.EDIT}
                className="edit"
                onClick={() => this.edit(record)}
                type="edit"
                ignore="true"
                antd
              />,
            )}
            <Popconfirm
              key={USER_BTN_KEY.DELETE}
              placement="topLeft"
              title={formatMessage({
                id: 'global.delete.confirm',
                defaultMessage: '确定要删除吗？提示：删除后不可恢复',
              })}
              onConfirm={() => this.del(record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'global.rank', defaultMessage: '序号' }),
        dataIndex: 'rank',
        width: 80,
      },
      {
        title: formatMessage({ id: 'global.code', defaultMessage: '代码' }),
        dataIndex: 'code',
        width: 160,
        required: true,
      },
      {
        title: formatMessage({ id: 'global.name', defaultMessage: '名称' }),
        dataIndex: 'name',
        width: 220,
        required: true,
      },
      {
        title: formatMessage({ id: 'userList.apiBaseAddress', defaultMessage: '服务名' }),
        dataIndex: 'apiBaseAddress',
        width: 160,
      },
      {
        title: formatMessage({ id: 'userList.webBaseAddress', defaultMessage: 'WEB基地址' }),
        dataIndex: 'webBaseAddress',
        width: 220,
      },
      {
        title: formatMessage({ id: 'global.remark', defaultMessage: '说明' }),
        dataIndex: 'remark',
        width: 320,
        optional: true,
      },
    ];
    const formModalProps = {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['userList/save'],
    };
    const toolBarProps = {
      left: (
        <>
          {authAction(
            <Button key={USER_BTN_KEY.CREATE} type="primary" onClick={this.add} ignore="true">
              <FormattedMessage id="global.add" defaultMessage="新建" />
            </Button>,
          )}
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const tableProps = {
      toolBar: toolBarProps,
      columns,
      searchWidth: 260,
      sort: {
        field: { rank: 'asc', code: null, name: null },
      },
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...tableProps} />
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default UserList;
