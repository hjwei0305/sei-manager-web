import React, { Component } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card, Popconfirm } from 'antd';
import { ExtTable, BannerTitle, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH } = constants;

@connect(({ moduleTag, loading }) => ({ moduleTag, loading }))
class ConfigList extends Component {
  static tableRef;

  constructor(props) {
    super(props);
    this.state = {
      delRowId: null,
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
      type: 'moduleTag/updateState',
      payload: {
        showTagModal: true,
        tagData: null,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'moduleTag/createTag',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'moduleTag/updateState',
            payload: {
              showTagModal: false,
            },
          });
          this.reloadData();
        }
      },
    });
  };

  del = record => {
    const {
      dispatch,
      moduleTag: { currentModule },
    } = this.props;
    this.setState(
      {
        delRowId: record.name,
      },
      () => {
        dispatch({
          type: 'moduleTag/removeTag',
          payload: {
            tagName: record.name,
            gitId: get(currentModule, 'gitId'),
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
      type: 'moduleTag/updateState',
      payload: {
        showTagModal: false,
        tagData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['moduleTag/removeTag'] && delRowId === row.name) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    if (row.release === true) {
      return <ExtIcon className="disabled" type="delete" antd />;
    }
    return (
      <Popconfirm
        title={formatMessage({
          id: 'global.delete.confirm',
          defaultMessage: '确定要删除吗？提示：删除后不可恢复',
        })}
        onConfirm={() => this.del(row)}
      >
        <ExtIcon className="del" type="delete" antd />
      </Popconfirm>
    );
  };

  render() {
    const { moduleTag, loading } = this.props;
    const { currentModule, showTagModal } = moduleTag;
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
            {this.renderDelBtn(record)}
          </span>
        ),
      },
      {
        title: '环境名称',
        dataIndex: 'envName',
        width: 220,
        required: true,
      },
      {
        title: '模版名称',
        dataIndex: 'tempName',
        width: 280,
        render: t => t || '-',
      },
      {
        title: '描述说明',
        dataIndex: 'remark',
        width: 480,
        render: t => t || '-',
      },
    ];
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.add}>
            添加标签
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      toolBar: toolBarProps,
      columns,
      rowKey: 'name',
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '输入标签名称、标签消息关键字',
      searchProperties: ['tagName', 'tagMessage'],
      searchWidth: 260,
      store: {
        url: `${SERVER_PATH}/sei-manager/appModule/getTags`,
      },
      cascadeParams: {
        gitId: get(currentModule, 'gitId'),
      },
    };
    const formModalProps = {
      showTagModal,
      currentModule,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['moduleTag/createTag'],
      save: this.save,
    };
    return (
      <div className={cls(styles['user-box'])}>
        <Card
          title={<BannerTitle title={get(currentModule, 'name')} subTitle="标签列表" />}
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default ConfigList;
