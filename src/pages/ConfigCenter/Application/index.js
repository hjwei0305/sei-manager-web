import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Empty, Layout, Input } from 'antd';
import { ListCard } from 'suid';
import empty from '@/assets/item_empty.svg';
import { constants } from '@/utils';
import DropdownGroup from './components/DropdownGroup';
import Config from './Config';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Sider, Content } = Layout;
const { Search } = Input;

@connect(({ configApp, loading }) => ({ configApp, loading }))
class ConfigCommon extends Component {
  static listCardRef = null;

  constructor() {
    super();
    this.state = {
      groupCode: null,
    };
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
    const { dispatch } = this.props;
    const selectedApp = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'configApp/updateState',
      payload: {
        selectedApp,
      },
    });
  };

  handlerTabChange = currentTabKey => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configApp/updateState',
      payload: {
        currentTabKey,
      },
    });
  };

  handlerEnvChange = selectedEnv => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configApp/updateState',
      payload: {
        selectedEnv,
      },
    });
  };

  render() {
    const { groupCode } = this.state;
    const { configApp } = this.props;
    const { envData, selectedApp, currentTabKey, yamlText, selectedEnv } = configApp;
    const selectedKeys = selectedApp ? [selectedApp.id] : [];
    const userGroupProps = {
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
    const configProps = {
      selectedApp,
      currentTabKey,
      onTabChange: this.handlerTabChange,
      yamlText,
      envData,
      selectedEnv,
      handlerEnvChange: this.handlerEnvChange,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={320} className="auto-height" theme="light">
            <ListCard {...userGroupProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            {selectedApp ? (
              <Config {...configProps} />
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
export default ConfigCommon;
