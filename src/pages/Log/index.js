import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Tag, Input, Button } from 'antd';
import { ExtTable, ListCard } from 'suid';
import { constants } from '@/utils';
import { FilterView } from '@/components';
import styles from './index.less';

const { ENV_CATEGORY, LEVEL_CATEGORY } = constants;
const { Search } = Input;

@connect(({ runtimeLog, loading }) => ({ runtimeLog, loading }))
class LogList extends PureComponent {
  static tableRef = null;

  reload = () => {
    this.tableRef.remoteDataRefresh();
  };

  handleColumnSearch = (selectedKeys, dataIndex, confirm) => {
    const { dispatch } = this.props;
    confirm();
    dispatch({
      type: 'runtimeLog/updateState',
      payload: {
        [dataIndex]: selectedKeys[0],
      },
    });
  };

  handleColumnSearchReset = (dataIndex, clearFilter) => {
    const { dispatch } = this.props;
    clearFilter();
    dispatch({
      type: 'runtimeLog/updateState',
      payload: {
        [dataIndex]: '',
      },
    });
  };

  handlerEnvChange = currentEnvViewType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'runtimeLog/updateState',
      payload: {
        currentEnvViewType,
      },
    });
  };

  renderCustomTool = (dataIndex, clearFilters) => (
    <>
      <Search
        placeholder="可输入关键字查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
      <Button
        onClick={() => this.handleColumnSearchReset(dataIndex, clearFilters)}
        style={{ width: 90, marginLeft: 8 }}
      >
        重置
      </Button>
    </>
  );

  renderEnv = env => {
    const evnData = ENV_CATEGORY[env];
    if (evnData) {
      return <Tag color={evnData.color}>{evnData.title}</Tag>;
    }
    return env;
  };

  renderLevel = level => {
    const evnData = LEVEL_CATEGORY[level];
    if (evnData) {
      return <Tag color={evnData.color}>{evnData.title}</Tag>;
    }
    return level;
  };

  getColumnSearchComponent = (dataIndex, setSelectedKeys, selectedKeys, confirm, clearFilters) => {
    if (dataIndex === 'className') {
      const entityNameProps = {
        className: 'search-content',
        dataSource: [],
        searchProperties: ['entityName'],
        showArrow: false,
        showSearch: false,
        rowKey: 'className',
        allowCancelSelect: true,
        selectedKeys,
        onSelectChange: keys => {
          setSelectedKeys(keys);
          this.handleColumnSearch(keys, dataIndex, confirm);
        },
        customTool: () => this.renderCustomTool(dataIndex, clearFilters),
        itemField: {
          title: item => item.entityName,
        },
      };
      return (
        <div style={{ padding: 8, maxHeight: 360, height: 360 }}>
          <ListCard {...entityNameProps} />
        </div>
      );
    }
    return (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder="输入关键字查询"
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleColumnSearch(selectedKeys, dataIndex, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleColumnSearch(selectedKeys, dataIndex, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button
          onClick={() => this.handleColumnSearchReset(dataIndex, clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          重置
        </Button>
      </div>
    );
  };

  getColumnSearchProps = dataIndex => {
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        this.getColumnSearchComponent(
          dataIndex,
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        ),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
    };
  };

  render() {
    const { runtimeLog } = this.props;
    const { currentEnvViewType, envViewData } = runtimeLog;
    const columns = [
      {
        title: '时间',
        dataIndex: 'timestamp',
        width: 180,
        align: 'center',
        required: true,
        fixed: 'left',
      },
      {
        title: '环境',
        dataIndex: 'env',
        width: 100,
        fixed: 'left',
        required: true,
        render: this.renderEnv,
        // ...this.getColumnSearchProps('operatorName'),
      },
      {
        title: '调用服务',
        dataIndex: 'fromServer',
        width: 220,
        required: true,
        // ...this.getColumnSearchProps('className'),
      },
      {
        title: '日志等极',
        dataIndex: 'level',
        width: 100,
        align: 'center',
        required: true,
        render: this.renderLevel,
      },
      {
        title: '	日志类',
        dataIndex: 'logger',
        width: 240,
        required: true,
      },
      {
        title: '日志消息',
        dataIndex: 'message',
        width: 220,
        optional: true,
      },
      {
        title: '应用代码',
        dataIndex: 'serviceName',
        width: 220,
        required: true,
      },
      {
        title: '跟踪id',
        dataIndex: 'traceId',
        width: 380,
        required: true,
      },
    ];
    const toolBarProps = {
      layout: { leftSpan: 24 },
      left: (
        <>
          <FilterView
            currentViewType={currentEnvViewType}
            viewTypeData={envViewData}
            onAction={this.handlerEnvChange}
          />
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const tableProps = {
      bordered: false,
      toolBar: toolBarProps,
      columns,
      store: {
        type: 'POST',
        url: `/sei-manager/log/findByPage`,
      },
      remotePaging: true,
      onTableRef: ref => (this.tableRef = ref),
      sort: {
        field: {
          timestamp: 'desc',
        },
      },
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...tableProps} />
      </div>
    );
  }
}

export default LogList;
