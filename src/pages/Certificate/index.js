import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, ExtIcon } from 'suid';
import FormModal from './FormModal';
import styles from './index.less';

@connect(({ certificate, loading }) => ({ certificate, loading }))
class Certificate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delRowId: null,
    };
  }

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'certificate/queryList',
    });
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'certificate/updateState',
      payload: {
        showModal: true,
        rowData: null,
      },
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'certificate/updateState',
      payload: {
        showModal: true,
        rowData,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'certificate/save',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'certificate/updateState',
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
          type: 'certificate/del',
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
      type: 'certificate/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['certificate/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  render() {
    const { certificate, loading } = this.props;
    const { showModal, rowData, list } = certificate;
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
        title: '凭证名称',
        dataIndex: 'name',
        width: 220,
        required: true,
      },
      {
        title: '凭证的值',
        dataIndex: 'value',
        width: 280,
        required: true,
      },
      {
        title: '凭证描述',
        dataIndex: 'remark',
        width: 380,
      },
    ];
    const formModalProps = {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['certificate/save'],
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
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable
          searchPlaceHolder="凭证名称、凭证的值、凭证描述"
          searchProperties={['name', 'value', 'remark']}
          showSearchTooltip
          loading={loading.effects['certificate/queryList']}
          toolBar={toolBarProps}
          columns={columns}
          dataSource={list}
          searchWidth={260}
          sort={{
            field: { name: 'asc', remark: null, value: null },
          }}
        />
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default Certificate;
