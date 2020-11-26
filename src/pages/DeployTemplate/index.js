import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input, Empty, Popconfirm, Layout } from 'antd';
import { ExtIcon, ListCard } from 'suid';
import empty from '@/assets/item_empty.svg';
import { constants } from '@/utils';
import TemplateAdd from './components/DeployTemplateForm/Add';
import TemplateEdit from './components/DeployTemplateForm/Edit';
import AssignedStage from './components/AssignedStage';
import UnAssignStage from './components/UnAssignStage';
import TemplatePreview from './components/TemplatePreview';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Search } = Input;
const { Sider, Content } = Layout;

@connect(({ deployTemplate, loading }) => ({ deployTemplate, loading }))
class DeployTemplate extends Component {
  static listCardRef = null;

  static assignedStageRef = null;

  constructor(props) {
    super(props);
    this.state = {
      delId: null,
    };
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployTemplate/updateState',
      payload: {
        showAssign: false,
      },
    });
  }

  reloadTemplateData = () => {
    if (this.listCardRef) {
      this.listCardRef.remoteDataRefresh();
    }
  };

  saveDeployTemplate = (data, handlerPopoverHide) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployTemplate/saveDeployTemplate',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.reloadTemplateData();
          if (handlerPopoverHide) handlerPopoverHide();
        }
      },
    });
  };

  delDeployTemplate = (data, e) => {
    if (e) e.stopPropagation();
    const { dispatch } = this.props;
    this.setState(
      {
        delId: data.id,
      },
      () => {
        dispatch({
          type: 'deployTemplate/delDeployTemplate',
          payload: {
            id: data.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                delId: null,
              });
              this.reloadTemplateData();
            }
          },
        });
      },
    );
  };

  handlerSelect = (keys, items) => {
    const { dispatch } = this.props;
    const selectedTemplate = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'deployTemplate/updateState',
      payload: {
        selectedTemplate,
      },
    });
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  closeAssignStages = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployTemplate/updateState',
      payload: {
        showAssign: false,
      },
    });
  };

  assignStages = childIds => {
    const { deployTemplate, dispatch } = this.props;
    const { selectedTemplate } = deployTemplate;
    dispatch({
      type: 'deployTemplate/assignStages',
      payload: {
        parentId: selectedTemplate.id,
        childIds,
      },
      callback: res => {
        if (res.success && this.assignedStageRef) {
          this.assignedStageRef.reloadData();
        }
      },
    });
  };

  handlerAssignedRef = ref => {
    this.assignedStageRef = ref;
  };

  previewTemplate = item => {
    const templateId = get(item, 'id');
    if (templateId) {
      const { dispatch } = this.props;
      dispatch({
        type: 'deployTemplate/updateState',
        payload: {
          currentTemplate: item,
          showPreview: true,
        },
      });
      dispatch({
        type: 'deployTemplate/getTemplateXml',
        payload: {
          templateId,
        },
      });
    }
  };

  handlerClosePreview = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployTemplate/updateState',
      payload: {
        showPreview: false,
        currentTemplate: null,
      },
    });
  };

  renderCustomTool = () => (
    <>
      <Search
        allowClear
        placeholder="输入名称、描述关键字查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
    </>
  );

  renderItemAction = item => {
    const { loading } = this.props;
    const { delId } = this.state;
    const saving = loading.effects['deployTemplate/saveDeployTemplate'];
    return (
      <>
        <div className="tool-action" onClick={e => e.stopPropagation()}>
          <TemplateEdit
            saving={saving}
            saveDeployTemplate={this.saveDeployTemplate}
            templateData={item}
          />
          <Popconfirm
            title={formatMessage({ id: 'global.delete.confirm', defaultMessage: '确定要删除吗?' })}
            onConfirm={e => this.delDeployTemplate(item, e)}
          >
            {loading.effects['deployTemplate/delDeployTemplate'] && delId === item.id ? (
              <ExtIcon className={cls('del', 'action-item')} type="loading" antd />
            ) : (
              <ExtIcon className={cls('del', 'action-item')} type="delete" antd />
            )}
          </Popconfirm>
          <ExtIcon
            className={cls('action-item')}
            onClick={() => this.previewTemplate(item)}
            type="profile"
            antd
          />
        </div>
      </>
    );
  };

  render() {
    const { loading, deployTemplate } = this.props;
    const {
      currentTemplate,
      selectedTemplate,
      showAssign,
      showPreview,
      templateXml,
    } = deployTemplate;
    const saving = loading.effects['deployTemplate/saveDeployTemplate'];
    const selectedKeys = selectedTemplate ? [selectedTemplate.id] : [];
    const deployTemplateProps = {
      className: 'left-content',
      title: '部署模板',
      showSearch: false,
      onSelectChange: this.handlerSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['remark', 'name'],
      selectedKeys,
      extra: <TemplateAdd saving={saving} saveDeployTemplate={this.saveDeployTemplate} />,
      itemField: {
        title: item => item.name,
        description: item => item.remark,
      },
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/deployTemplate/findByPage`,
      },
      itemTool: this.renderItemAction,
    };
    const unAssignStagesProps = {
      selectedTemplate,
      showAssign,
      closeAssignStages: this.closeAssignStages,
      assignStages: this.assignStages,
      assignLoading: loading.effects['deployTemplate/assignStages'],
    };
    const templatePreviewProps = {
      currentTemplate,
      showPreview,
      closePreview: this.handlerClosePreview,
      templateXml,
      templateXmlLoading: loading.effects['deployTemplate/getTemplateXml'],
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={320} className="auto-height" theme="light">
            <ListCard {...deployTemplateProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 8 }}>
            {selectedTemplate ? (
              <AssignedStage onRef={this.handlerAssignedRef} />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="可选择左边列表项进行相应的操作" />
              </div>
            )}
          </Content>
        </Layout>
        {selectedTemplate ? <UnAssignStage {...unAssignStagesProps} /> : null}
        <TemplatePreview {...templatePreviewProps} />
      </div>
    );
  }
}
export default DeployTemplate;
