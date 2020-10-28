import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { trim } from 'lodash';
import { Tag, Input, Button } from 'antd';
import { ExtTable, ListCard } from 'suid';
import { constants } from '@/utils';
import QueryForm from './QueryForm';
import styles from './index.less';

const { SERVER_PATH, OPERATION_CATEGORY } = constants;
const { Search } = Input;

@connect(({ dataAudit, loading }) => ({ dataAudit, loading }))
class DataAuditHome extends PureComponent {
  static tableRef = null;

  static listCardRef = null;

  query = queryData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataAudit/updateState',
      payload: {
        ...queryData,
      },
    });
    this.tableRef.remoteDataRefresh();
  };

  renderOperation = optType => {
    switch (optType) {
      case OPERATION_CATEGORY.CREATE:
        return <Tag color="green">{optType}</Tag>;
      case OPERATION_CATEGORY.UPDATE:
        return <Tag color="blue">{optType}</Tag>;
      case OPERATION_CATEGORY.DELETE:
        return <Tag color="red">{optType}</Tag>;
      default:
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

  handleColumnSearch = (selectedKeys, dataIndex, confirm) => {
    const { dispatch } = this.props;
    confirm();
    dispatch({
      type: 'dataAudit/updateState',
      payload: {
        [dataIndex]: selectedKeys[0],
      },
    });
  };

  handleColumnSearchReset = (dataIndex, clearFilter) => {
    const { dispatch } = this.props;
    clearFilter();
    dispatch({
      type: 'dataAudit/updateState',
      payload: {
        [dataIndex]: '',
      },
    });
  };

  handlerColumnSearchChange = (e, dataIndex) => {
    this.searchValue[dataIndex] = trim(e.target.value);
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

  getColumnSearchComponent = (dataIndex, setSelectedKeys, selectedKeys, confirm, clearFilters) => {
    if (dataIndex === 'className') {
      const { dataAudit } = this.props;
      const { entityNames } = dataAudit;
      const entityNameProps = {
        className: 'search-content',
        dataSource: entityNames,
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
        onListCardRef: ref => (this.listCardRef = ref),
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
    const { dataAudit, loading } = this.props;
    const { startTime, endTime, className, entityName, operatorName } = dataAudit;
    const columns = [
      {
        title: '变更时间',
        dataIndex: 'operateTime',
        width: 180,
        align: 'center',
        required: true,
        fixed: 'left',
      },
      {
        title: '变更人',
        dataIndex: 'operatorName',
        width: 100,
        fixed: 'left',
        required: true,
        ...this.getColumnSearchProps('operatorName'),
      },
      {
        title: '数据类型',
        dataIndex: 'entityName',
        width: 220,
        required: true,
        ...this.getColumnSearchProps('className'),
      },
      {
        title: '变更类型',
        dataIndex: 'operationCategory',
        width: 100,
        align: 'center',
        required: true,
        render: optType => this.renderOperation(optType),
      },
      {
        title: '变更字段',
        dataIndex: 'propertyRemark',
        width: 240,
        required: true,
      },
      {
        title: '变更字段代码',
        dataIndex: 'propertyName',
        width: 220,
        optional: true,
      },
      {
        title: '变更前',
        dataIndex: 'originalValue',
        width: 220,
        required: true,
      },
      {
        title: '变更后',
        dataIndex: 'newValue',
        width: 380,
        required: true,
      },
      {
        title: '变更人账号',
        dataIndex: 'operatorAccount',
        width: 180,
        optional: true,
        ...this.getColumnSearchProps('operatorAccount'),
      },
      {
        title: '数据类型代码',
        dataIndex: 'className',
        width: 320,
        optional: true,
      },
    ];
    const queryFormProps = {
      queryData: {
        startTime,
        endTime,
        className,
        entityName,
        operatorName,
      },
      loading: loading.global,
      query: this.query,
    };
    const toolBarProps = {
      layout: { leftSpan: 24 },
      left: (
        <Fragment>
          <QueryForm {...queryFormProps} />
        </Fragment>
      ),
    };
    const tableProps = {
      bordered: false,
      toolBar: toolBarProps,
      columns,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-datachange/dataChangeLog/queryByPage`,
      },
      cascadeParams: {
        startTime,
        endTime,
        operatorName,
        className,
      },
      remotePaging: true,
      showSearch: false,
      onTableRef: ref => (this.tableRef = ref),
      sort: {
        field: {
          operateTime: 'desc',
          entityName: null,
          operatorName: null,
          originalValue: null,
          newValue: null,
          operationCategory: null,
          propertyRemark: null,
          propertyName: null,
          operatorAccount: null,
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

export default DataAuditHome;
