import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get } from 'lodash';
import copy from 'copy-to-clipboard';
import { Input, Empty, Layout, Tooltip } from 'antd';
import { ListCard, message, ExtIcon } from 'suid';
import empty from '@/assets/item_empty.svg';
import { constants } from '@/utils';
import ConfigList from './components/ConfigList';
import DropdownApp from './components/DropdownApp';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Search } = Input;
const { Sider, Content } = Layout;
const FILTER_FIELDS = [{ fieldName: 'appId', operator: 'EQ', value: null }];

@connect(({ deployConfig, loading }) => ({ deployConfig, loading }))
class DeployConfig extends Component {
  static listCardRef = null;

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployConfig/updateState',
      payload: {
        currentModule: null,
        moduleFilter: {},
      },
    });
  }

  reloadModuleData = () => {
    if (this.listCardRef) {
      this.listCardRef.remoteDataRefresh();
    }
  };

  handlerModuleSelect = (keys, items) => {
    const { dispatch } = this.props;
    const currentModule = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'deployConfig/updateState',
      payload: {
        currentModule,
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

  closeAssignUsers = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployConfig/updateState',
      payload: {
        showTagModal: false,
      },
    });
  };

  handlerAppChange = appId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployConfig/updateState',
      payload: {
        moduleFilter: { appId },
      },
    });
  };

  getFilter = () => {
    const { deployConfig } = this.props;
    const { moduleFilter } = deployConfig;
    const filters = [{ fieldName: 'frozen', operator: 'EQ', value: false }];
    FILTER_FIELDS.forEach(f => {
      const value = get(moduleFilter, f.fieldName, null) || null;
      if (value !== null && value !== '') {
        const param = { ...f };
        Object.assign(param, { value });
        filters.push(param);
      }
    });
    return { filters };
  };

  handlerCopy = text => {
    copy(text);
    message.success(`已复制到粘贴板`);
  };

  renderCustomTool = () => (
    <>
      <DropdownApp onAction={this.handlerAppChange} />
      <Tooltip title="输入代码、名称、描述关键字查询">
        <Search
          allowClear
          placeholder="代码、名称、描述"
          onChange={e => this.handlerSearchChange(e.target.value)}
          onSearch={this.handlerSearch}
          onPressEnter={this.handlerPressEnter}
          style={{ width: 160 }}
        />
      </Tooltip>
    </>
  );

  renderModuleName = item => {
    return (
      <>
        {item.name}
        <span
          style={{ marginLeft: 4, fontSize: 12, color: '#999' }}
        >{`版本：${item.version}`}</span>
        <ExtIcon
          type="copy"
          className="copy-btn"
          style={{ marginLeft: 4 }}
          antd
          tooltip={{ title: '复制Git地址到粘贴板' }}
          onClick={e => {
            e.stopPropagation();
            this.handlerCopy(item.gitHttpUrl);
          }}
        />
      </>
    );
  };

  render() {
    const { deployConfig } = this.props;
    const { currentModule } = deployConfig;
    const moduleProps = {
      className: 'left-content',
      title: '模块列表',
      showSearch: false,
      onSelectChange: this.handlerModuleSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['remark', 'name', 'code'],
      itemField: {
        title: this.renderModuleName,
        description: item => item.remark,
      },
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/appModule/findByPage`,
      },
      cascadeParams: {
        ...this.getFilter(),
      },
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={480} className="auto-height" theme="light">
            <ListCard {...moduleProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 8 }}>
            {currentModule ? (
              <ConfigList />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="可选择模块进行标签管理" />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    );
  }
}
export default DeployConfig;
