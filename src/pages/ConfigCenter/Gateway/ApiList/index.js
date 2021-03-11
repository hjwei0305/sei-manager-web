import React, { Component } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card, Popconfirm, Drawer } from 'antd';
import { ExtTable, BannerTitle, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH } = constants;

@connect(({ appGateway, loading }) => ({ appGateway, loading }))
class ApiList extends Component {
  static tableRef;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/updateState',
      payload: {
        showModal: true,
        rowData: null,
      },
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/updateState',
      payload: {
        showModal: true,
        rowData,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/save',
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

  handlerSelectRow = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  onCancelBatchRemove = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  del = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys: ids } = this.state;
    dispatch({
      type: 'appGateway/del',
      payload: ids,
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

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const hasSelected = selectedRowKeys.length > 0;
    const { appGateway, loading } = this.props;
    const { selectedApp, showModal, rowData } = appGateway;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 80,
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
          </span>
        ),
      },
      {
        title: '接口地址',
        dataIndex: 'interfaceURI',
        width: 220,
      },
      {
        title: '接口名称',
        dataIndex: 'interfaceName',
        width: 100,
        render: t => t || '-',
      },
      {
        title: '接口描述',
        dataIndex: 'interfaceRemark',
        width: 260,
        render: t => t || '-',
      },
    ];
    const removing = loading.effects['appGateway/del'];
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.add}>
            新建
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
            <Button onClick={this.onCancelBatchRemove} disabled={removing}>
              取消
            </Button>
            <Popconfirm title="确定要删除吗？" onConfirm={this.del}>
              <Button type="danger" loading={removing}>
                {`删除( ${selectedRowKeys.length} )`}
              </Button>
            </Popconfirm>
          </Drawer>
        </>
      ),
    };
    const extTableProps = {
      toolBar: toolBarProps,
      columns,
      checkbox: {
        rowCheck: false,
      },
      selectedRowKeys,
      onSelectRow: this.handlerSelectRow,
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '接口地址、接口名称、接口描述关键字',
      searchProperties: ['interfaceURI', 'interfaceName', 'interfaceRemark'],
      searchWidth: 260,
      store: {
        url: `${SERVER_PATH}/sei-manager/flow/definition/getTypeNode`,
      },
      lineNumber: false,
      cascadeParams: {
        appId: get(selectedApp, 'id'),
      },
    };
    const formModalProps = {
      showModal,
      rowData,
      selectedApp,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['appGateway/save'],
      save: this.save,
    };
    return (
      <div className={cls(styles['app-list-box'])}>
        <Card
          title={<BannerTitle title={get(selectedApp, 'name')} subTitle="网关白名单" />}
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default ApiList;
