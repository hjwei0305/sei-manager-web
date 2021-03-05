import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card, Tag, Drawer, Popconfirm } from 'antd';
import { ExtTable, BannerTitle, ExtIcon } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH } = constants;

@connect(({ configCommon, loading }) => ({ configCommon, loading }))
class ConfigItem extends Component {
  static tableRef;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      delRowId: null,
    };
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handlerSelectRow = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  onCancelBatchSync = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  edit = currentConfigItem => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configCommon/updateState',
      payload: {
        showFormModal: true,
        currentConfigItem,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configCommon/saveConfigItem',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
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
          type: 'configCommon/delConfigItem',
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
      type: 'configCommon/updateState',
      payload: {
        showFormModal: false,
        currentConfigItem: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['configCommon/delConfigItem'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  renderItemName = (t, row) => {
    return (
      <>
        {t}
        {row.status === false ? (
          <Tag color="red" style={{ marginLeft: 8 }}>
            已禁用
          </Tag>
        ) : null}
      </>
    );
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { loading, configCommon } = this.props;
    const { selectedEnv } = configCommon;
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 140,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_text, record) => (
          <span className={cls('action-box')} onClick={e => e.stopPropagation()}>
            <ExtIcon
              className="edit"
              onClick={() => this.edit(record)}
              type="edit"
              ignore="true"
              antd
            />
            <Popconfirm
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
        title: '键名',
        dataIndex: 'key',
        width: 220,
        required: true,
        render: this.renderItemName,
      },
      {
        title: '键值',
        dataIndex: 'value',
        width: 180,
        render: t => t || '-',
      },
      {
        title: '描述说明',
        dataIndex: 'remark',
        width: 360,
        render: t => t || '-',
      },
    ];
    const removeLoading = loading.effects['configCommon/removeAssignedUsers'];
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.showAssignUser}>
            新建配置键
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
            <Button onClick={this.onCancelBatchSync} disabled={removeLoading}>
              取消
            </Button>
            <Button type="danger" loading={removeLoading}>
              {`同步到( ${selectedRowKeys.length} )`}
            </Button>
          </Drawer>
        </>
      ),
    };
    const extTableProps = {
      bordered: false,
      lineNumber: false,
      toolBar: toolBarProps,
      columns,
      checkbox: {
        rowCheck: false,
      },
      selectedRowKeys,
      onSelectRow: this.handlerSelectRow,
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '输入键名、键值、描述关键字',
      searchProperties: ['key', 'value', 'remark'],
      searchWidth: 260,
      store: {
        url: `${SERVER_PATH}/sei-manager/generalConfig/findByEnv`,
      },
      cascadeParams: {
        envCode: get(selectedEnv, 'code'),
      },
    };
    return (
      <div className={cls(styles['user-box'])}>
        <Card
          title={<BannerTitle title={get(selectedEnv, 'name')} subTitle="配置键清单" />}
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
      </div>
    );
  }
}

export default ConfigItem;
