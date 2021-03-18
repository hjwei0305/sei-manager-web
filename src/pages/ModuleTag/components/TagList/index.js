import React, { Component } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card } from 'antd';
import { ExtTable, BannerTitle, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import MdEditorView from './MdEditorView';
import styles from './index.less';

const { SERVER_PATH } = constants;

@connect(({ moduleTag, loading }) => ({ moduleTag, loading }))
class TagList extends Component {
  static tableRef;

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

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'moduleTag/updateState',
      payload: {
        showTagModal: false,
        tagData: null,
        onlyView: false,
        newTag: false,
      },
    });
  };

  getTagMessage = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'moduleTag/getTag',
      payload: {
        id: record.id,
      },
      callback: data => {
        Object.assign(record, {
          expanding: false,
          message: data.message || '<span style="color:#999">暂无数据</span>',
        });
        this.forceUpdate();
      },
    });
  };

  handlerCollapsed = () => {
    const { dispatch, moduleTag } = this.props;
    const { hideSider } = moduleTag;
    dispatch({
      type: 'moduleTag/updateState',
      payload: {
        hideSider: !hideSider,
      },
    });
  };

  renderCollapsedTool = () => {
    const { moduleTag } = this.props;
    const { hideSider, currentModule } = moduleTag;
    return (
      <>
        <ExtIcon
          className="btn-collapsed"
          tooltip={{ title: hideSider ? '显示应用模块' : '收起应用模块' }}
          onClick={this.handlerCollapsed}
          type={hideSider ? 'double-right' : 'double-left'}
          antd
        />
        {get(currentModule, 'name')}
      </>
    );
  };

  render() {
    const { moduleTag, loading } = this.props;
    const { currentModule, showTagModal, tagData, onlyView, newTag } = moduleTag;
    const columns = [
      {
        title: '标签名称',
        dataIndex: 'tagName',
        width: 320,
        required: true,
      },
      {
        title: '分支',
        dataIndex: 'branch',
        width: 140,
        required: true,
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
      lineNumber: false,
      remotePaging: true,
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '输入标签名称关键字',
      searchProperties: ['tagName'],
      searchWidth: 260,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/tag/getTags`,
      },
      cascadeParams: {
        filters: [{ fieldName: 'moduleId', operator: 'EQ', value: get(currentModule, 'id') }],
      },
      expandedRowRender: record => {
        return <MdEditorView expanding={record.expanding} message={record.message} />;
      },
      onExpand: (expanded, record) => {
        if (expanded === true) {
          if (!record.message) {
            Object.assign(record, { expanding: true });
            this.getTagMessage(record);
          }
        }
      },
    };
    const formModalProps = {
      showTagModal,
      currentModule,
      tagData,
      onlyView,
      newTag,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['moduleTag/createTag'],
      save: this.save,
      dataLoading: loading.effects['moduleTag/getNewTag'],
    };
    return (
      <div className={cls(styles['user-box'])}>
        <Card
          title={<BannerTitle title={this.renderCollapsedTool()} subTitle="标签列表" />}
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
