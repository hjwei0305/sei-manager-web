import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get, includes, isEqual } from 'lodash';
import { Modal, Layout, Descriptions, Steps, Card } from 'antd';
import { ListLoader, BannerTitle, ScrollBar, ExtIcon, utils } from 'suid';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-textmate';
import { wsocket, constants } from '../../utils';
import JenkinsState from './JenkinsState';
import styles from './RecordeLogModal.less';

const { Sider, Content } = Layout;
const { Step } = Steps;
const { getUUID } = utils;
const { WSBaseUrl, JENKINS_STATUS } = constants;
const { closeWebSocket, createWebSocket } = wsocket;

class RecordeLogModal extends PureComponent {
  static aceId;

  static propTypes = {
    title: PropTypes.string,
    logData: PropTypes.object,
    dataLoading: PropTypes.bool,
    showModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.aceId = getUUID();
    this.state = {
      currentStage: 0,
      buildLog: '',
      building: false,
    };
  }

  componentDidUpdate(preProps) {
    const { logData } = this.props;
    if (!isEqual(preProps.logData, logData) && logData) {
      const buildLog = get(logData, 'buildLog') || '';
      const state = this.getFieldValue('buildStatus');
      let building = false;
      if (state === JENKINS_STATUS.BUILDING.name) {
        building = true;
        const id = get(logData, 'id') || null;
        const url = `${WSBaseUrl}/websocket/buildLog/${id}`;
        createWebSocket(url);
      }
      const stages = get(logData, 'stages') || [];
      this.counterStep(stages);
      this.setState({ buildLog, building });
    }
  }

  closeFormModal = () => {
    const { closeFormModal } = this.props;
    if (closeFormModal) {
      closeFormModal();
      closeWebSocket();
    }
  };

  getFieldValue = fieldName => {
    const { logData } = this.props;
    return get(logData, fieldName) || '-';
  };

  counterStep = stages => {
    const { buildLog } = this.state;
    let currentStage = 0;
    for (let i = 0; i < stages.length; i += 1) {
      const { name } = stages[i];
      if (includes(buildLog, name)) {
        currentStage = i;
      }
    }
    this.setState({ currentStage });
  };

  renderStages = () => {
    const { currentStage, buildLog, building } = this.state;
    const { logData } = this.props;
    const stages = get(logData, 'stages') || [];
    return (
      <>
        <div className="step-box">
          <Steps current={currentStage} labelPlacement="horizontal">
            {stages.map((item, idx) => (
              <Step
                key={item.id}
                icon={
                  idx === currentStage && building ? (
                    <ExtIcon type="sync" antd spin style={{ marginRight: 4 }} />
                  ) : null
                }
                title={item.name}
                description={item.remark}
              />
            ))}
          </Steps>
        </div>
        <div className="log-content">
          <AceEditor
            mode="markdown"
            theme="textmate"
            name={this.aceId}
            fontSize={14}
            onChange={this.handlerAceChannge}
            showPrintMargin={false}
            showGutter={false}
            highlightActiveLine
            width="100%"
            height="100%"
            value={buildLog || '暂无构建日志!'}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: false,
              tabSize: 4,
            }}
          />
        </div>
      </>
    );
  };

  renderTitle = () => {
    const { title } = this.props;
    return (
      <>
        <ExtIcon onClick={this.closeFormModal} type="left" className="trigger-back" antd />
        <BannerTitle title={title} subTitle="构建详情" />
      </>
    );
  };

  renderLogContent = () => {
    return (
      <Layout className="auto-height">
        <Sider width={360} className="auto-height left-content" theme="light">
          <Card className="auto-height" bordered={false} title={this.renderTitle()}>
            <ScrollBar>
              <Descriptions column={1} colon={false}>
                <Descriptions.Item label="构建状态">
                  <JenkinsState state={this.getFieldValue('buildStatus')} />
                </Descriptions.Item>
                <Descriptions.Item label="目标环境">
                  {`${this.getFieldValue('envName')}(${this.getFieldValue('envCode')})`}
                </Descriptions.Item>
                <Descriptions.Item label="应用名称">
                  {this.getFieldValue('appName')}
                </Descriptions.Item>
                <Descriptions.Item label="模块名称">
                  {`${this.getFieldValue('moduleName')}(${this.getFieldValue('moduleCode')})`}
                </Descriptions.Item>
                <Descriptions.Item label="标签名称">
                  {this.getFieldValue('tagName')}
                </Descriptions.Item>
                <Descriptions.Item label="期望完成时间">
                  {this.getFieldValue('expCompleteTime')}
                </Descriptions.Item>
              </Descriptions>
            </ScrollBar>
          </Card>
        </Sider>
        <Content className={cls('main-content', 'auto-height', 'vertical')}>
          {this.renderStages()}
        </Content>
      </Layout>
    );
  };

  render() {
    const { showModal, dataLoading } = this.props;
    return (
      <Modal
        destroyOnClose
        visible={showModal}
        centered
        closable={false}
        wrapClassName={styles['build-box']}
        footer={null}
      >
        {dataLoading ? <ListLoader /> : this.renderLogContent()}
      </Modal>
    );
  }
}

export default RecordeLogModal;
