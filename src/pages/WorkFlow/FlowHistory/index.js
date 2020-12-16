import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { get } from 'lodash';
import { Empty, Layout, Input } from 'antd';
import { ListCard, ExtModal, BannerTitle } from 'suid';
import empty from '@/assets/item_empty.svg';
import { constants } from '@/utils';
import NodeList from './NodeList';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Search } = Input;
const { Sider, Content } = Layout;

class FlowHistory extends PureComponent {
  static listCardRef = null;

  static propTypes = {
    historyFlowType: PropTypes.object.isRequired,
    showFlowHistory: PropTypes.bool,
    closeFormModal: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentVersion: null,
    };
  }

  handlerSelect = (keys, items) => {
    const currentVersion = keys.length === 1 ? items[0] : null;
    this.setState({ currentVersion });
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
        placeholder="输入版本号查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
    </>
  );

  render() {
    const { currentVersion } = this.state;
    const { historyFlowType, showFlowHistory, closeFormModal } = this.props;
    const workflowTypeProps = {
      className: 'left-content',
      title: '版本列表',
      showSearch: false,
      customTool: this.renderCustomTool,
      onSelectChange: this.handlerSelect,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['version'],
      store: {
        url: `${SERVER_PATH}/sei-manager/flow/definition/getTypeVersion`,
      },
      cascadeParams: {
        typeId: get(historyFlowType, 'id'),
      },
      itemField: {
        title: item => `V${item.version}`,
      },
    };
    const nodeListProps = {
      historyFlowType,
      currentVersion,
    };
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showFlowHistory}
        centered
        width={880}
        wrapClassName={styles['container-box']}
        bodyStyle={{ padding: 0 }}
        footer={null}
        title={<BannerTitle title={get(historyFlowType, 'remark')} subTitle="流程版本历史" />}
      >
        <Layout className="auto-height">
          <Sider width={220} className="auto-height" theme="light">
            <ListCard {...workflowTypeProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            {currentVersion ? (
              <NodeList {...nodeListProps} />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="可选择左边列表项进行相应的操作" />
              </div>
            )}
          </Content>
        </Layout>
      </ExtModal>
    );
  }
}

export default FlowHistory;
