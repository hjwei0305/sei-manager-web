import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { get } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Input, Popconfirm } from 'antd';
import { ExtTable, ListCard, ExtIcon } from 'suid';
import { constants } from '@/utils';
import JenkinsState from './JenkinsState';
import RecordeLogModal from './RecordeLogModal';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Search } = Input;
const FILTER_FIELDS = [
  { fieldName: 'appId', operator: 'EQ', value: null },
  { fieldName: 'name', operator: 'LK', value: null },
  { fieldName: 'moduleName', operator: 'LK', value: null },
  { fieldName: 'tagName', operator: 'LK', value: null },
];

@connect(({ publishRecord, loading }) => ({ publishRecord, loading }))
class PublishRecord extends Component {
  static tableRef;

  static listCardRef = null;

  constructor(props) {
    super(props);
    this.state = {
      appName: '全部',
      buildId: null,
    };
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleColumnSearch = (selectedKeys, dataIndex, confirm) => {
    const { dispatch, publishRecord } = this.props;
    const { filter: originFilter } = publishRecord;
    const filter = { ...originFilter };
    Object.assign(filter, { [dataIndex]: selectedKeys[0] });
    confirm();
    dispatch({
      type: 'publishRecord/updateState',
      payload: {
        filter,
      },
    });
  };

  handleColumnSearchReset = (dataIndex, clearFilter) => {
    const { dispatch, publishRecord } = this.props;
    const { filter: originFilter } = publishRecord;
    const filter = { ...originFilter };
    Object.assign(filter, { [dataIndex]: '' });
    clearFilter();
    dispatch({
      type: 'publishRecord/updateState',
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
    if (dataIndex === 'appName') {
      const { appName } = this.state;
      const appListProps = {
        className: 'search-content',
        showArrow: false,
        showSearch: false,
        selectedKeys,
        remotePaging: true,
        onSelectChange: (keys, items) => {
          setSelectedKeys(keys);
          this.setState({ appName: items[0].name });
          this.handleColumnSearch(keys, 'appId', confirm);
        },
        store: {
          type: 'POST',
          url: `${SERVER_PATH}/sei-manager/application/findByPage`,
          params: {
            filters: [{ fieldName: 'frozen', operator: 'EQ', value: false }],
          },
        },
        customTool: () => this.renderCustomTool('appId', clearFilters),
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
            <div style={{ fontWeight: 700, fontSize: 16 }}>{appName}</div>
            <Button
              onClick={() => {
                this.setState({ appName: '全部' });
                this.handleColumnSearchReset('appId', clearFilters);
              }}
              style={{ marginLeft: 8 }}
            >
              重置
            </Button>
          </div>
          <div className="list-body" style={{ height: 462 }}>
            <ListCard {...appListProps} />
          </div>
        </div>
      );
    }
    return (
      <div style={{ padding: 8, width: 320, boxShadow: '0 3px 8px rgba(0,0,0,0.15)' }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder="输入关键字查询"
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleColumnSearch(selectedKeys, dataIndex, confirm)}
          style={{ width: '100%', marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleColumnSearch(selectedKeys, dataIndex, confirm)}
          icon="search"
          size="small"
          style={{ width: 70, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button
          onClick={() => this.handleColumnSearchReset(dataIndex, clearFilters)}
          size="small"
          style={{ width: 70 }}
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

  getFilter = () => {
    const { publishRecord } = this.props;
    const { filter } = publishRecord;
    const filters = [{ fieldName: 'frozen', operator: 'EQ', value: false }];
    FILTER_FIELDS.forEach(f => {
      const value = get(filter, f.fieldName, null) || null;
      if (value !== null) {
        const param = { ...f };
        Object.assign(param, { value });
        filters.push(param);
      }
    });
    return { filters };
  };

  build = record => {
    const { dispatch } = this.props;
    this.setState({ buildId: record.id });
    dispatch({
      type: 'publishRecord/build',
      payload: {
        id: record.id,
      },
      callback: res => {
        if (res.success) {
          this.reloadData();
        }
      },
    });
  };

  showRecordLog = row => {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishRecord/updateState',
      payload: {
        showModal: true,
        rowData: row,
      },
    });
    dispatch({
      type: 'publishRecord/getBuildDetail',
      payload: {
        id: row.id,
      },
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishRecord/updateState',
      payload: {
        showModal: false,
        rowData: null,
        logData: null,
      },
    });
    this.reloadData();
  };

  renderBuildBtn = row => {
    const { loading } = this.props;
    const { buildId } = this.state;
    if (loading.effects['publishRecord/build'] && buildId === row.id) {
      return <ExtIcon className="loading" type="loading" antd />;
    }
    return (
      <Popconfirm title="确定要发起Jenkins构建吗？" onConfirm={() => this.build(row)}>
        <ExtIcon type="play-circle" className="build" antd />
      </Popconfirm>
    );
  };

  render() {
    const { publishRecord, loading } = this.props;
    const { showModal, rowData, logData } = publishRecord;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_text, record) => (
          <span className={cls('action-box')}>
            {this.renderBuildBtn(record)}
            <ExtIcon
              type="alert"
              antd
              tooltip={{ title: '构建详情' }}
              onClick={() => this.showRecordLog(record)}
            />
          </span>
        ),
      },
      {
        title: '构建状态',
        dataIndex: 'buildStatus',
        width: 100,
        required: true,
        render: t => <JenkinsState state={t} />,
      },
      {
        title: '发布主题',
        dataIndex: 'name',
        width: 260,
        required: true,
        ...this.getColumnSearchProps('name'),
      },
      {
        title: '应用名称',
        dataIndex: 'appName',
        width: 160,
        required: true,
        ...this.getColumnSearchProps('appName'),
      },
      {
        title: '模块名称',
        dataIndex: 'moduleName',
        width: 260,
        required: true,
        ...this.getColumnSearchProps('moduleName'),
      },
      {
        title: '标签名称',
        dataIndex: 'tagName',
        width: 180,
        render: t => t || '-',
        ...this.getColumnSearchProps('tagName'),
      },
      {
        title: '最后一次构建时间',
        dataIndex: 'buildTime',
        width: 180,
        required: true,
        render: t => t || '-',
      },
    ];
    const toolBarProps = {
      left: (
        <>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      toolBar: toolBarProps,
      columns,
      onTableRef: ref => (this.tableRef = ref),
      showSearchTooltip: false,
      searchPlaceHolder: '版本名称、描述说明',
      searchProperties: ['name', 'remark'],
      searchWidth: 260,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/releaseRecord/findByPage`,
      },
      cascadeParams: {
        ...this.getFilter(),
      },
      sort: {
        field: {
          buildTime: 'desc',
        },
      },
    };
    const recordeLogModalProps = {
      title: get(rowData, 'name'),
      showModal,
      logData,
      closeFormModal: this.closeFormModal,
      dataLoading: loading.effects['publishRecord/getBuildDetail'],
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...extTableProps} />
        {showModal ? <RecordeLogModal {...recordeLogModalProps} /> : null}
      </div>
    );
  }
}

export default PublishRecord;
