import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import copy from 'copy-to-clipboard';
import { Modal, Layout, Card, Empty, Input } from 'antd';
import { BannerTitle, ExtIcon, utils, message, ListCard } from 'suid';
import PropTypes from 'prop-types';
import { constants } from '@/utils';
import empty from '@/assets/item_empty.svg';
import MdEditorView from './MdEditorView';
import styles from './VersionHistory.less';

const { Search } = Input;
const { Sider, Content } = Layout;
const { getUUID } = utils;
const { SERVER_PATH } = constants;

class RecordeLogModal extends PureComponent {
  static ace;

  static aceId;

  static listCardRef = null;

  static propTypes = {
    currentModule: PropTypes.object,
    onVersionSelect: PropTypes.func,
    selectVersion: PropTypes.object,
    logLoading: PropTypes.bool,
    logData: PropTypes.string,
    showModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.aceId = getUUID();
  }

  resize = () => {
    setTimeout(() => {
      const resize = new Event('resize');
      window.dispatchEvent(resize);
    }, 300);
  };

  closeFormModal = () => {
    const { closeFormModal } = this.props;
    if (closeFormModal) {
      closeFormModal();
    }
  };

  handlerCopy = text => {
    if (text) {
      copy(text);
      message.success(`已复制到粘贴板`);
    }
  };

  handlerComplete = ace => {
    this.ace = ace;
    if (ace) {
      this.resize();
    }
  };

  renderLog = () => {
    const { logData, logLoading, selectVersion } = this.props;
    const messageText = get(logData, 'remark');
    return (
      <>
        <div className="log-box">
          {selectVersion ? (
            <>
              <div className="log-header">
                日志详情
                <ExtIcon
                  type="copy"
                  className="copy-btn"
                  antd
                  tooltip={{ title: '复制内容到粘贴板' }}
                  onClick={() => this.handlerCopy(messageText)}
                />
              </div>
              <div className="log-content">
                <MdEditorView
                  loading={logLoading}
                  message={messageText || '<span style="color:#999">暂无数据</span>'}
                />
              </div>
            </>
          ) : (
            <div className="blank-empty">
              <Empty image={empty} description="选择相应的版本查看日志" />
            </div>
          )}
        </div>
      </>
    );
  };

  renderTitle = () => {
    const { currentModule } = this.props;
    return (
      <>
        <ExtIcon onClick={this.closeFormModal} type="left" className="trigger-back" antd />
        <BannerTitle title={`${get(currentModule, 'name')}`} subTitle="版本历史" />
      </>
    );
  };

  handlerVersionSelect = (keys, items) => {
    const { onVersionSelect } = this.props;
    const currentVersion = keys.length === 1 ? items[0] : null;
    if (onVersionSelect && onVersionSelect instanceof Function) {
      onVersionSelect(currentVersion);
    }
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

  renderCustomTool = () => (
    <>
      <Search
        allowClear
        placeholder="版本名称、版本号关键字"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
    </>
  );

  renderLogContent = () => {
    const { currentModule } = this.props;
    const versionListProps = {
      showSearch: false,
      onSelectChange: this.handlerVersionSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['name', 'version'],
      itemField: {
        title: item => item.name,
        description: item => item.version,
      },
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/releaseVersion/findByPage`,
      },
      cascadeParams: {
        filters: [
          { fieldName: 'appId', operator: 'EQ', value: get(currentModule, 'appId') },
          { fieldName: 'moduleCode', operator: 'EQ', value: get(currentModule, 'code') },
          { fieldName: 'frozen', operator: 'EQ', value: false },
        ],
      },
    };
    return (
      <Layout className="auto-height">
        <Sider width={360} className="auto-height left-content" theme="light">
          <Card className="auto-height" bordered={false} title={this.renderTitle()}>
            <ListCard {...versionListProps} />
          </Card>
        </Sider>
        <Content className={cls('main-content', 'auto-height', 'vertical')}>
          {this.renderLog()}
        </Content>
      </Layout>
    );
  };

  render() {
    const { showModal } = this.props;
    return (
      <Modal
        destroyOnClose
        visible={showModal}
        centered
        onCancel={this.closeFormModal}
        closable={false}
        wrapClassName={styles['log-box']}
        footer={null}
      >
        {this.renderLogContent()}
      </Modal>
    );
  }
}

export default RecordeLogModal;
