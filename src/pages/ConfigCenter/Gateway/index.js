import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Empty, Layout, Input } from 'antd';
import { ListCard } from 'suid';
import empty from '@/assets/item_empty.svg';
import { constants } from '@/utils';
import DropdownGroup from './components/DropdownGroup';
import ApiList from './ApiList';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Sider, Content } = Layout;
const { Search } = Input;

@connect(({ appGateway, loading }) => ({ appGateway, loading }))
class AppGateway extends Component {
  static listCardRef = null;

  static itemRef = null;

  constructor() {
    super();
    this.state = {
      groupCode: null,
    };
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/updateState',
      payload: {
        targetCompareEvn: null,
        currentConfigItem: null,
        showRelease: false,
        compareBeforeReleaseData: null,
        showCompare: false,
        showFormModal: false,
        compareData: null,
        yamlText: '',
        currentTabKey: 'appParam',
      },
    });
  }

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  handlerGroupChange = groupCode => {
    this.setState({ groupCode });
  };

  renderCustomTool = () => (
    <>
      <Search
        allowClear
        placeholder="输入代码、名称关键字查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
    </>
  );

  handlerAppSelect = (keys, items) => {
    const {
      dispatch,
      appGateway: { currentTabKey },
    } = this.props;
    const selectedApp = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'appGateway/updateState',
      payload: {
        selectedApp,
        showRelease: false,
        showCompare: false,
        compareData: null,
        compareBeforeReleaseData: null,
      },
    });
    if (currentTabKey === 'yamlPreview') {
      this.getYamlData();
    }
  };

  handlerTabChange = currentTabKey => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/updateState',
      payload: {
        currentTabKey,
      },
    });
    if (currentTabKey === 'yamlPreview') {
      this.getYamlData();
    }
    if (currentTabKey === 'appParam') {
      this.itemRef.reloadData();
    }
  };

  getYamlData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/getYamlData',
    });
  };

  handlerEnvChange = selectedEnv => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/updateState',
      payload: {
        selectedEnv,
      },
    });
  };

  closeCompareModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/updateState',
      payload: {
        showRelease: false,
        compareBeforeReleaseData: null,
        showCompare: false,
        compareData: null,
      },
    });
  };

  handlerRelease = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/appRelease',
    });
  };

  handlerSaveYmal = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/saveYamlData',
      payload: data,
    });
  };

  handlerShowRelease = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/compareBeforeRelease',
      payload: {
        showRelease: true,
      },
    });
  };

  handlerShowCompare = targetCompareEvn => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/updateState',
      payload: {
        showCompare: true,
        targetCompareEvn,
      },
    });
    dispatch({
      type: 'appGateway/getCompareData',
    });
  };

  render() {
    const { groupCode } = this.state;
    const { appGateway } = this.props;
    const { selectedApp } = appGateway;
    const selectedKeys = selectedApp ? [selectedApp.code] : [];
    const appListProps = {
      className: 'left-content',
      title: '应用列表',
      extra: <DropdownGroup onAction={this.handlerGroupChange} />,
      showSearch: false,
      onSelectChange: this.handlerAppSelect,
      selectedKeys,
      rowKey: 'code',
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['code', 'name'],
      customTool: this.renderCustomTool,
      itemField: {
        title: item => item.name,
        description: item => item.code,
      },
      store: {
        url: `${SERVER_PATH}/sei-manager/appConfig/getAppList`,
      },
      cascadeParams: {
        groupCode,
      },
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={280} className="auto-height" theme="light">
            <ListCard {...appListProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            {selectedApp ? (
              <ApiList />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="选择左边项目进行的相关配置" />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    );
  }
}
export default AppGateway;
