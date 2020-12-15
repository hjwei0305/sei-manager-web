import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { get } from 'lodash';
import { Button, Input, Tag } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, ListCard } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Search } = Input;
const FILTER_FIELDS = [
  { fieldName: 'appId', operator: 'EQ', value: null },
  { fieldName: 'moduleName', operator: 'LK', value: null },
  { fieldName: 'name', operator: 'LK', value: null },
];

@connect(({ versionRecord, loading }) => ({ versionRecord, loading }))
class VersionRecord extends Component {
  static tableRef;

  static listCardRef = null;

  constructor(props) {
    super(props);
    this.state = {
      appName: '全部',
    };
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleColumnSearch = (selectedKeys, dataIndex, confirm) => {
    const { dispatch, versionRecord } = this.props;
    const { filter: originFilter } = versionRecord;
    const filter = { ...originFilter };
    Object.assign(filter, { [dataIndex]: selectedKeys[0] });
    confirm();
    dispatch({
      type: 'versionRecord/updateState',
      payload: {
        filter,
      },
    });
  };

  handleColumnSearchReset = (dataIndex, clearFilter) => {
    const { dispatch, versionRecord } = this.props;
    const { filter: originFilter } = versionRecord;
    const filter = { ...originFilter };
    Object.assign(filter, { [dataIndex]: '' });
    clearFilter();
    dispatch({
      type: 'versionRecord/updateState',
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
    const { versionRecord } = this.props;
    const { filter } = versionRecord;
    const filters = [];
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

  renderVersionName = (v, row) => {
    const { available } = row;
    let color = 'red';
    if (available) {
      color = 'blue';
    }
    return (
      <>
        {v || '-'}
        <Tag color={color} style={{ marginLeft: 4, marginRight: 0 }}>
          可用
        </Tag>
      </>
    );
  };

  render() {
    const columns = [
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
        title: '版本名称',
        dataIndex: 'name',
        width: 200,
        ...this.getColumnSearchProps('name'),
      },
      {
        title: '版本号',
        dataIndex: 'version',
        width: 180,
        render: this.renderVersionName,
        ...this.getColumnSearchProps('version'),
      },
      {
        title: '版本创建时间',
        dataIndex: 'createTime',
        width: 180,
        render: t => t || '-',
      },
      {
        title: 'CommitId',
        dataIndex: 'commitId',
        width: 420,
        required: true,
        ...this.getColumnSearchProps('commitId'),
      },
      {
        title: '镜像名',
        dataIndex: 'imageName',
        width: 320,
        required: true,
        render: t => t || '-',
        ...this.getColumnSearchProps('imageName'),
      },
      {
        title: '描述说明',
        dataIndex: 'remark',
        width: 320,
        required: true,
        render: t => t || '-',
        ...this.getColumnSearchProps('remark'),
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
        url: `${SERVER_PATH}/sei-manager/releaseVersion/findByPage`,
      },
      cascadeParams: {
        ...this.getFilter(),
      },
      sort: {
        field: {
          createTime: 'desc',
        },
      },
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...extTableProps} />
      </div>
    );
  }
}

export default VersionRecord;
