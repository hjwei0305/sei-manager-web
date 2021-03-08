import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { Button, Dropdown, Input } from 'antd';
import { ListCard, ExtIcon } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { Search } = Input;
const { SERVER_PATH } = constants;

class DropdownApp extends PureComponent {
  static listCardRef = null;

  static propTypes = {
    onAction: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      appName: '全部应用',
      appId: '',
      showApp: false,
    };
  }

  handlerFilter = item => {
    const { onAction } = this.props;
    let appId = '';
    let appName = '全部应用';
    if (item) {
      appId = item.id;
      appName = item.name;
    }
    this.setState({ appName, appId, showApp: false });
    if (onAction) {
      onAction(appId);
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

  handlerVisibleChange = showApp => {
    this.setState({ showApp });
  };

  renderCustomTool = () => (
    <>
      <Search
        allowClear
        placeholder="输入代码或名称关键字"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
    </>
  );

  renderDropdownApp = () => {
    const { appName, appId } = this.state;
    const appListProps = {
      className: 'search-content',
      showArrow: false,
      showSearch: false,
      remotePaging: true,
      selectedKeys: [appId],
      onSelectChange: (_keys, items) => {
        this.handlerFilter(items[0]);
        this.setState({ showApp: false });
      },
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/application/findByPage`,
        params: {
          filters: [{ fieldName: 'frozen', operator: 'EQ', value: false }],
        },
      },
      customTool: () => this.renderCustomTool(),
      onListCardRef: ref => (this.listCardRef = ref),
      itemField: {
        title: item => item.name,
        description: item => item.code,
      },
    };
    return (
      <div
        style={{
          padding: 8,
          maxHeight: 420,
          height: 420,
          width: 320,
          backgroundColor: '#fff',
          boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: 42,
            padding: '0 24px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 16 }}>{appName}</div>
          <Button onClick={() => this.handlerFilter()} style={{ marginLeft: 8 }}>
            重置
          </Button>
        </div>
        <div className="list-body" style={{ height: 362 }}>
          <ListCard {...appListProps} />
        </div>
      </div>
    );
  };

  render() {
    const { appName, showApp } = this.state;
    return (
      <Dropdown
        onVisibleChange={this.handlerVisibleChange}
        visible={showApp}
        overlay={this.renderDropdownApp()}
        trigger={['click']}
      >
        <span className={cls(styles['view-box'], 'filter-box')}>
          <span className="view-content">{appName}</span>
          <ExtIcon type="down" antd />
        </span>
      </Dropdown>
    );
  }
}
export default DropdownApp;
