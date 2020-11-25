import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tag } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, ExtIcon } from 'suid';
import { constants } from '../../utils';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH } = constants;

@connect(({ env, loading }) => ({ env, loading }))
class DeployStage extends Component {
  static tablRef;

  constructor(props) {
    super(props);
    this.state = {
      delRowId: null,
    };
  }

  reloadData = () => {
    if (this.tablRef) {
      this.tablRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'env/updateState',
      payload: {
        showModal: true,
        rowData: null,
      },
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'env/updateState',
      payload: {
        showModal: true,
        rowData,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'env/save',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'env/updateState',
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
          type: 'env/del',
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
      type: 'env/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['env/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  renderCode = (t, row) => {
    if (row.frozen) {
      return (
        <>
          {t}
          <Tag color="red" style={{ marginLeft: 8 }}>
            已冻结
          </Tag>
        </>
      );
    }
    return t;
  };

  render() {
    const { env, loading } = this.props;
    const { showModal, rowData } = env;
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
        title: '序号',
        dataIndex: 'rank',
        width: 80,
        required: true,
      },
      {
        title: '环境代码',
        dataIndex: 'code',
        width: 100,
        required: true,
        render: this.renderCode,
      },
      {
        title: '环境名称',
        dataIndex: 'name',
        width: 140,
        required: true,
      },
      {
        title: '环境描述',
        dataIndex: 'remark',
        width: 280,
        render: t => t || '-',
      },
      {
        title: '代理服务基地址',
        dataIndex: 'agentServer',
        width: 380,
        render: t => t || '-',
      },
    ];
    const formModalProps = {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['env/save'],
    };
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.add} ignore="true">
            <FormattedMessage id="global.add" defaultMessage="新建" />
          </Button>
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
      searchPlaceHolder: '环境代码、环境名称、环境描述、代理服务基地址',
      searchProperties: ['name', 'code', 'remark', 'agentServer'],
      showSearchTooltip: true,
      onTableRef: ref => (this.tablRef = ref),
      store: {
        url: `${SERVER_PATH}/sei-manager/env/findAll`,
      },
      sort: {
        field: { rank: 'asc', name: null, code: null, remark: null, agentServer: null },
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

export default DeployStage;
