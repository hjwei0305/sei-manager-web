import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import { constants } from '@/utils';
import PageWrapper from '@/components/PageWrapper';
import EditModal from './EditModal';
import styles from './index.less';

const { SERVER_PATH } = constants;
@withRouter
@connect(({ dataSource, loading }) => ({ dataSource, loading }))
class DataSource extends Component {
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
          type: 'dataSource/updateState',
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
              type: 'dataSource/del',
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
      type: 'dataSource/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'dataSource/updateState',
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
      type: 'dataSource/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['dataSource/del'] && delId === row.id) {
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
        render: (_, record) => (
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
        ),
      },
      {
        title: '数据库名',
        dataIndex: 'code',
        width: 120,
        required: true,
      },
      {
        title: '描述说明',
        dataIndex: 'remark',
        width: 220,
        required: true,
      },
      {
        title: '数据库类型',
        dataIndex: 'dbType',
        width: 120,
        required: true,
      },
      {
        title: 'url地址',
        dataIndex: 'url',
        width: 300,
        required: true,
      },
      {
        title: '域名',
        dataIndex: 'host',
        width: 120,
        required: true,
      },
      {
        title: '端口',
        dataIndex: 'port',
        width: 80,
        required: true,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        width: 120,
        required: true,
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
      searchProperties: ['code', 'remark'],
      searchPlaceHolder: '请输入代码和描述进行搜索',
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/dataSource/findByPage`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, dataSource } = this.props;
    const { modalVisible, editData } = dataSource;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['dataSource/save'],
    };
  };

  render() {
    const { dataSource } = this.props;
    const { modalVisible } = dataSource;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </PageWrapper>
    );
  }
}

export default DataSource;
