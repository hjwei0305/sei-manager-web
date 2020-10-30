import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get } from 'lodash';
import copy from 'copy-to-clipboard';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Input, Button, Menu, Drawer } from 'antd';
import { ExtTable, ExtIcon, message, ListCard } from 'suid';
import { constants } from '@/utils';
import { FilterView } from '@/components';
import FilterDate from './components/FilterDate';
import ExtAction from './components/ExtAction';
import TranceLog from './components/TranceLog';
import LogDetail from './components/LogDetail';
import LogLevel from './components/LogLevel';
import styles from './index.less';

const { LEVEL_CATEGORY, LOG_ACTION } = constants;
const { Search } = Input;
const FILTER_FIELDS = [
  { fieldName: 'level', operator: 'EQ', value: null },
  { fieldName: 'currentServer', operator: 'EQ', value: null },
  { fieldName: 'fromServer', operator: 'EQ', value: null },
  { fieldName: 'logger', operator: 'EQ', value: null },
  { fieldName: 'message', operator: 'EQ', value: null },
  { fieldName: 'serviceName', operator: 'EQ', value: null },
  { fieldName: 'traceId', operator: 'EQ', value: null },
];

@connect(({ runtimeLog, loading }) => ({ runtimeLog, loading }))
class LogList extends PureComponent {
  static tableRef = null;

  static listCardRef = null;

  reloadData = () => {
    this.tableRef.remoteDataRefresh();
  };

  handleColumnSearch = (selectedKeys, dataIndex, confirm) => {
    const { dispatch, runtimeLog } = this.props;
    const { filter: originFilter } = runtimeLog;
    const filter = { ...originFilter };
    Object.assign(filter, { [dataIndex]: selectedKeys[0] });
    confirm();
    dispatch({
      type: 'runtimeLog/updateState',
      payload: {
        filter,
      },
    });
  };

  handleColumnSearchReset = (dataIndex, clearFilter) => {
    const { dispatch, runtimeLog } = this.props;
    const { filter: originFilter } = runtimeLog;
    const filter = { ...originFilter };
    Object.assign(filter, { [dataIndex]: '' });
    clearFilter();
    dispatch({
      type: 'runtimeLog/updateState',
      payload: {
        filter,
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

  onLevelChange = (e, dataIndex, setSelectedKeys, confirm, clearFilters) => {
    const { dispatch, runtimeLog } = this.props;
    const { filter: originFilter } = runtimeLog;
    const filter = { ...originFilter };
    if (e.key === LEVEL_CATEGORY.ALL.key) {
      clearFilters();
      Object.assign(filter, { [dataIndex]: null });
    } else {
      setSelectedKeys(e.key);
      Object.assign(filter, { [dataIndex]: e.key });
      confirm();
    }
    dispatch({
      type: 'runtimeLog/updateState',
      payload: {
        filter,
      },
    });
  };

  handlerFitlerDate = (dataIndex, currentDate, confirm) => {
    const { startTime = null, endTime = null } = currentDate;
    const { dispatch, runtimeLog } = this.props;
    const { filter: originFilter } = runtimeLog;
    const filter = { ...originFilter };
    Object.assign(filter, {
      [dataIndex]: startTime === null || endTime === null ? null : [startTime, endTime],
    });
    confirm();
    dispatch({
      type: 'runtimeLog/updateState',
      payload: {
        filter,
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

  getColumnSearchComponent = (dataIndex, setSelectedKeys, selectedKeys, confirm, clearFilters) => {
    if (dataIndex === 'level') {
      const { runtimeLog } = this.props;
      const { levelViewData, filter } = runtimeLog;
      const selectedKey = get(filter, 'level') || LEVEL_CATEGORY.ALL.key;
      return (
        <div
          style={{
            padding: 8,
            maxHeight: 300,
            height: 300,
            width: 160,
            boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
          }}
        >
          <Menu
            className={cls(styles['level-box'])}
            onClick={e => this.onLevelChange(e, dataIndex, setSelectedKeys, confirm, clearFilters)}
            selectedKeys={[`${selectedKey}`]}
          >
            {levelViewData.map(m => {
              return (
                <Menu.Item key={m.key}>
                  {m.key === selectedKey ? (
                    <ExtIcon type="check" className="selected" antd />
                  ) : null}
                  <span className="view-popover-box-trigger">{m.title}</span>
                </Menu.Item>
              );
            })}
          </Menu>
        </div>
      );
    }
    if (dataIndex === 'serviceName') {
      const { runtimeLog } = this.props;
      const { serviceList, filter } = runtimeLog;
      const serviceName = get(filter, 'serviceName') || '全部';
      const serviceNameProps = {
        className: 'search-content',
        dataSource: serviceList,
        searchProperties: ['code', 'name'],
        showArrow: false,
        showSearch: false,
        rowKey: 'code',
        selectedKeys,
        pagination: { pageSize: 60 },
        onSelectChange: keys => {
          setSelectedKeys(keys);
          this.handleColumnSearch(keys, dataIndex, confirm);
        },
        customTool: () => this.renderCustomTool(dataIndex, clearFilters),
        onListCardRef: ref => (this.listCardRef = ref),
        itemField: {
          title: item => item.code,
          description: item => item.name,
        },
      };
      return (
        <div
          style={{
            padding: 8,
            maxHeight: 520,
            height: 520,
            width: 320,
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
            <div style={{ fontWeight: 700, fontSize: 16 }}>{serviceName}</div>
            <Button
              onClick={() => this.handleColumnSearchReset(dataIndex, clearFilters)}
              style={{ marginLeft: 8 }}
            >
              重置
            </Button>
          </div>
          <ListCard {...serviceNameProps} />
        </div>
      );
    }
    if (dataIndex === 'timestamp') {
      return (
        <div style={{ padding: 8, boxShadow: '0 3px 8px rgba(0,0,0,0.15)' }}>
          <FilterDate
            onAction={currentDate => {
              const { startTime = null, endTime = null } = currentDate;
              setSelectedKeys(startTime === null || endTime === null ? null : [startTime, endTime]);
              this.handlerFitlerDate(dataIndex, currentDate, confirm);
            }}
          />
        </div>
      );
    }
    return (
      <div style={{ padding: 8, boxShadow: '0 3px 8px rgba(0,0,0,0.15)' }}>
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
          setTimeout(() => {
            if (this.searchInput) {
              this.searchInput.select();
            }
          });
        }
      },
    };
  };

  handlerCopy = text => {
    copy(text);
    message.success(`已复制到粘贴板`);
  };

  getFilter = () => {
    const { runtimeLog } = this.props;
    const { filter, currentEnvViewType } = runtimeLog;
    const filters = [{ fieldName: 'env', operator: 'EQ', value: currentEnvViewType.key }];
    let idxName = '*';
    FILTER_FIELDS.forEach(f => {
      const value = get(filter, f.fieldName, null) || null;
      if (value !== null) {
        const param = { ...f };
        if (param.fieldName === 'serviceName') {
          idxName = `${value}*`;
        } else {
          Object.assign(param, { value });
          filters.push(param);
        }
      }
    });
    const timestamp = get(filter, 'timestamp', null) || null;
    if (timestamp && timestamp.length === 2) {
      filters.push({ fieldName: 'timestamp', operator: 'GE', value: timestamp[0] });
      filters.push({ fieldName: 'timestamp', operator: 'LE', value: timestamp[1] });
    }
    return { filters, idxName };
  };

  renderCopyColumn = t => {
    if (t) {
      return <span onClick={() => this.handlerCopy(t)}>{t}</span>;
    }
    return '-';
  };

  handlerAction = (key, record) => {
    const { dispatch } = this.props;
    switch (key) {
      case LOG_ACTION.DETAIL:
        dispatch({
          type: 'runtimeLog/getLogDetail',
          payload: {
            currentLog: record,
          },
        });
        break;
      case LOG_ACTION.BY_TRANCE_ID:
        dispatch({
          type: 'runtimeLog/getTranceLog',
          payload: {
            currentLog: record,
          },
        });
        break;
      default:
    }
  };

  handerTranceLogDetail = (keys, items) => {
    if (keys.length === 1) {
      const { dispatch } = this.props;
      dispatch({
        type: 'runtimeLog/getTranceLogDetail',
        payload: {
          currentLog: items[0],
        },
      });
    }
  };

  handlerClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'runtimeLog/updateState',
      payload: {
        logData: null,
        tranceData: [],
        currentLog: null,
        showTranceLog: false,
        showDetail: false,
      },
    });
  };

  render() {
    const { runtimeLog, loading } = this.props;
    const {
      currentLog,
      currentEnvViewType,
      envViewData,
      showDetail,
      showTranceLog,
      logData,
      tranceData,
    } = runtimeLog;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 60,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        fixed: 'left',
        render: (id, record) => (
          <span className={cls('action-box')}>
            <ExtAction key={id} onAction={this.handlerAction} recordItem={record} />
          </span>
        ),
      },
      {
        title: '时间',
        dataIndex: 'timestamp',
        width: 210,
        align: 'center',
        fixed: 'left',
        required: true,
        ...this.getColumnSearchProps('timestamp'),
      },
      {
        title: '应用',
        dataIndex: 'serviceName',
        width: 200,
        required: true,
        render: this.renderCopyColumn,
        ...this.getColumnSearchProps('serviceName'),
      },
      {
        title: '当前服务',
        dataIndex: 'currentServer',
        width: 220,
        optional: true,
        render: this.renderCopyColumn,
        ...this.getColumnSearchProps('currentServer'),
      },
      {
        title: '调用服务',
        dataIndex: 'fromServer',
        width: 220,
        optional: true,
        render: this.renderCopyColumn,
        ...this.getColumnSearchProps('fromServer'),
      },
      {
        title: '日志等极',
        dataIndex: 'level',
        width: 120,
        required: true,
        render: (_t, record) => <LogLevel item={record} />,
        ...this.getColumnSearchProps('level'),
      },
      {
        title: '日志消息',
        dataIndex: 'message',
        width: 780,
        render: this.renderCopyColumn,
        ...this.getColumnSearchProps('message'),
      },
      {
        title: '	日志类',
        dataIndex: 'logger',
        width: 420,
        optional: true,
        render: this.renderCopyColumn,
        ...this.getColumnSearchProps('logger'),
      },
      {
        title: '跟踪id',
        dataIndex: 'traceId',
        width: 380,
        optional: true,
        render: this.renderCopyColumn,
        ...this.getColumnSearchProps('traceId'),
      },
    ];
    const toolBarProps = {
      left: (
        <>
          <FilterView
            title="环境视图"
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
      storageId: '14a948c7-b777-4d30-b845-392dc7c55307',
      columns,
      searchProperties: columns.map(col => col.dataIndex),
      searchPlaceHolder: '输入关键字查询',
      store: {
        type: 'POST',
        url: `/sei-manager/log/findByPage`,
      },
      cascadeParams: this.getFilter(),
      remotePaging: true,
      onTableRef: ref => (this.tableRef = ref),
      sort: {
        field: {
          timestamp: 'desc',
        },
      },
    };
    const tranceLogProps = {
      visible: showTranceLog,
      onCloseModal: this.handlerClose,
      loading: loading.effects['runtimeLog/getTranceLog'],
      logLoading: loading.effects['runtimeLog/getTranceLogDetail'],
      logData,
      tranceData,
      currentLog,
      onSelectLog: this.handerTranceLogDetail,
    };
    const logDetailProps = {
      loading: loading.effects['runtimeLog/getLogDetail'],
      logData,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...tableProps} />
        <TranceLog {...tranceLogProps} />
        <Drawer
          width="60%"
          destroyOnClose
          getContainer={false}
          placement="right"
          visible={showDetail}
          title="日志详情"
          className={cls(styles['log-detail-box'])}
          onClose={this.handlerClose}
          style={{ position: 'absolute' }}
        >
          <LogDetail {...logDetailProps} />
        </Drawer>
      </div>
    );
  }
}

export default LogList;
