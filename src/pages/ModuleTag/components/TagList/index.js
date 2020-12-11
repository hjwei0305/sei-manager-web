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
class TagList extends Component {
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
        onlyView: false,
      },
    });
    dispatch({
      type: 'moduleTag/getNewTag',
    });
  };

  gitlabAsync = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'moduleTag/gitlabAsync',
      callback: res => {
        if (res.success) {
          this.reloadData();
        }
      },
    });
  };

  view = tagData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'moduleTag/updateState',
      payload: {
        onlyView: true,
        showTagModal: true,
        tagData,
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
        onlyView: false,
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
    const { currentModule, showTagModal, tagData } = moduleTag;
    const gitlabAsyncLoading = loading.effects['moduleTag/gitlabAsync'];
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_text, record) => (
          <span className={cls('action-box')} onClick={e => e.stopPropagation()}>
            <ExtIcon className="edit" onClick={() => this.view(record)} type="tag" antd />
            {this.renderDelBtn(record)}
          </span>
        ),
      },
      {
        title: '标签名称',
        dataIndex: 'tagName',
        width: 420,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.add}>
            添加标签
          </Button>
          <Popconfirm title="确定要同步Gitlab上的标签吗？" onConfirm={() => this.gitlabAsync()}>
            <Button type="primary" loading={gitlabAsyncLoading} ghost>
              同步GitLab
            </Button>
          </Popconfirm>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      toolBar: toolBarProps,
      columns,
      rowKey: 'tagName',
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '输入标签名称关键字',
      searchProperties: ['tagName'],
      searchWidth: 260,
      store: {
        url: `${SERVER_PATH}/sei-manager/tag/getTags`,
      },
      cascadeParams: {
        moduleCode: get(currentModule, 'code'),
      },
    };
    const formModalProps = {
      showTagModal,
      currentModule,
      tagData,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['moduleTag/createTag'],
      save: this.save,
      dataLoading: loading.effects['moduleTag/getNewTag'],
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

export default TagList;
