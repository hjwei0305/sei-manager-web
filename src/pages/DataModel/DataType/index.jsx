import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tag } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import { constants } from '@/utils';
import PageWrapper from '@/components/PageWrapper';
import EditModal from './EditModal';
import styles from './index.less';

const { SERVER_PATH } = constants;

@withRouter
@connect(({ dataType, loading }) => ({ dataType, loading }))
class DataType extends Component {
  state = {
    delId: null,
  };

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleEvent = (type, row) => {
    const { dispatch } = this.props;

    switch (type) {
      case 'add':
      case 'edit':
        dispatch({
          type: 'dataType/updateState',
          payload: {
            modalVisible: true,
            editData: row,
          },
        });
        break;
      case 'del':
        this.setState(
          {
            delId: row.id,
          },
          () => {
            dispatch({
              type: 'dataType/del',
              payload: {
                id: row.id,
              },
            }).then(res => {
              if (res.success) {
                this.setState(
                  {
                    delId: null,
                  },
                  () => this.reloadData(),
                );
              }
            });
          },
        );
        break;
      default:
        break;
    }
  };

  handleSave = data => {
    const { dispatch } = this.props;

    dispatch({
      type: 'dataType/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'dataType/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataType/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['dataType/del'] && delId === row.id) {
      return <ExtIcon className="del-loading" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon className="del" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => {
          if (record.system) {
            return (
              <ExtIcon
                tooltip={{
                  title: '系统内置类型，禁止操作',
                }}
                type="stop"
                antd
                style={{
                  cursor: 'not-allowed',
                }}
              />
            );
          }
          return (
            <span className={cls('action-box')}>
              <ExtIcon
                key="edit"
                className="edit"
                onClick={() => this.handleEvent('edit', record)}
                type="edit"
                ignore="true"
                tooltip={{ title: '编辑' }}
                antd
              />
              <Popconfirm
                key="del"
                placement="topLeft"
                title="确定要删除吗？"
                onConfirm={() => this.handleEvent('del', record)}
              >
                {this.renderDelBtn(record)}
              </Popconfirm>
            </span>
          );
        },
      },
      {
        title: '代码',
        dataIndex: 'code',
        width: 120,
        required: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 220,
        required: true,
      },
      {
        title: '长度',
        dataIndex: 'dataLength',
        width: 80,
        required: true,
      },
      {
        title: '精度',
        dataIndex: 'precision',
        width: 80,
        required: true,
      },
      {
        title: 'java类型',
        dataIndex: 'javaType',
        width: 120,
        required: true,
      },
      {
        title: 'mysql类型',
        dataIndex: 'mysqlType',
        width: 120,
        required: true,
      },
      {
        title: 'postgre类型',
        dataIndex: 'postgreType',
        width: 120,
        required: true,
      },
      {
        title: 'oracle类型',
        dataIndex: 'oracleType',
        width: 120,
        required: true,
      },
      {
        title: 'mssql类型',
        dataIndex: 'mssqlType',
        width: 120,
        required: true,
      },
      {
        title: '冻结',
        dataIndex: 'frozen',
        width: 80,
        required: true,
        render: frozen => <Tag color={frozen ? 'red' : 'green'}>{frozen ? '已冻结' : '可用'}</Tag>,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button
            key="add"
            type="primary"
            onClick={() => {
              this.handleEvent('add', null);
            }}
            ignore="true"
          >
            新建
          </Button>
          <Button onClick={this.reloadData}>刷新</Button>
        </Fragment>
      ),
    };
    return {
      columns,
      bordered: false,
      toolBar: toolBarProps,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/dataType/findByPage`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, dataType } = this.props;
    const { modalVisible, editData } = dataType;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['dataType/save'],
    };
  };

  render() {
    const { dataType } = this.props;
    const { modalVisible } = dataType;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </PageWrapper>
    );
  }
}

export default DataType;
