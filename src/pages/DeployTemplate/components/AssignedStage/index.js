import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card, Tag, Drawer, Popconfirm } from 'antd';
import { ExtTable, BannerTitle, ExtIcon } from 'suid';
import { constants } from '@/utils';
import StageFormModal from '../StageFormModal';
import styles from './index.less';

const { SERVER_PATH, USER_ACTION } = constants;

@connect(({ deployTemplate, loading }) => ({ deployTemplate, loading }))
class AssignedStage extends Component {
  static tableRef;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handlerAction = (key, deployTemplate) => {
    const { dispatch } = this.props;
    const payload = { currentUser: deployTemplate };
    const extData = {};
    switch (key) {
      case USER_ACTION.RESET_PASSWORD:
        extData.showResetPasswordModal = true;
        break;
      case USER_ACTION.FEATURE_ROLE:
        extData.showConfigFeatrueRole = true;
        break;
      default:
    }
    dispatch({
      type: 'deployTemplate/updateState',
      payload: {
        ...payload,
        ...extData,
      },
    });
  };

  handlerSelectRow = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  onCancelBatchRemoveAssigned = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  showAssignUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployTemplate/updateState',
      payload: {
        showAssign: true,
      },
    });
  };

  removeAssignedStages = () => {
    const { deployTemplate, dispatch } = this.props;
    const { selectedTemplate } = deployTemplate;
    const { selectedRowKeys: childIds } = this.state;
    dispatch({
      type: 'deployTemplate/removeAssignedStages',
      payload: {
        parentId: selectedTemplate.id,
        childIds,
      },
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

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployTemplate/updateState',
      payload: {
        currentTemplateState: rowData,
        showEditStateModal: true,
      },
    });
  };

  closeEditStateModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployTemplate/updateState',
      payload: {
        currentTemplateState: null,
        showEditStateModal: false,
      },
    });
  };

  saveTemplateStage = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployTemplate/saveTemplateStage',
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

  renderNickname = (t, row) => {
    return (
      <>
        <Tag>{row.rank}</Tag>
        {t}
      </>
    );
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { loading, deployTemplate } = this.props;
    const { selectedTemplate, currentTemplateState, showEditStateModal } = deployTemplate;
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 60,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_text, record) => (
          <span className={cls('action-box')} onClick={e => e.stopPropagation()}>
            <ExtIcon
              className={cls('action-item')}
              onClick={() => this.edit(record)}
              tooltip={{ title: '编辑' }}
              type="edit"
              antd
            />
          </span>
        ),
      },
      {
        title: '阶段名称',
        dataIndex: 'name',
        width: 220,
        required: true,
        render: this.renderNickname,
      },
      {
        title: '阶段描述',
        dataIndex: 'remark',
        width: 360,
        render: t => t || '-',
      },
    ];
    const removeLoading = loading.effects['deployTemplate/removeAssignedStages'];
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.showAssignUser}>
            添加阶段
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
            <Button onClick={this.onCancelBatchRemoveAssigned} disabled={removeLoading}>
              取消
            </Button>
            <Popconfirm title="确定要移除选择的阶段吗？" onConfirm={this.removeAssignedStages}>
              <Button type="danger" loading={removeLoading}>
                {`移除阶段( ${selectedRowKeys.length} )`}
              </Button>
            </Popconfirm>
          </Drawer>
        </>
      ),
    };
    const extTableProps = {
      bordered: false,
      toolBar: toolBarProps,
      columns,
      checkbox: true,
      selectedRowKeys,
      onSelectRow: this.handlerSelectRow,
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '输入阶段名称、阶段描述关键字',
      searchProperties: ['name', 'remark'],
      searchWidth: 260,
      store: {
        url: `${SERVER_PATH}/sei-manager/deployTemplateStage/getStageByTemplateId`,
      },
      cascadeParams: {
        templateId: get(selectedTemplate, 'id'),
      },
    };
    const stageFormModalProps = {
      rowData: currentTemplateState,
      showModal: showEditStateModal,
      closeFormModal: this.closeEditStateModal,
      saving: loading.effects['deployTemplate/removeAssignedStages'],
      save: this.saveTemplateStage,
    };
    return (
      <div className={cls(styles['user-box'])}>
        <Card
          title={<BannerTitle title={get(selectedTemplate, 'name')} subTitle="阶段" />}
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
        <StageFormModal {...stageFormModalProps} />
      </div>
    );
  }
}

export default AssignedStage;
