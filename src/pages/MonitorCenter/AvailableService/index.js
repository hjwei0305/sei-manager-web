import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button } from 'antd';
import { ExtTable } from 'suid';
import { FilterView } from '@/components';
import get from 'lodash.get';
import InstanceList from './components/InstanceList';
import styles from './index.less';

@connect(({ availableService, loading }) => ({ availableService, loading }))
class AvailableService extends Component {
  static tableRef;

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'availableService/updateState',
      payload: {
        currentEnvViewType: null,
        envViewData: [],
        currentInstanceData: [],
        serviceData: [],
      },
    });
  }

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'availableService/getServices',
    });
  };

  handlerEnvChange = currentEnvViewType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'availableService/updatePageState',
      payload: {
        currentEnvViewType,
        serviceData: [],
      },
    }).then(() => {
      dispatch({
        type: 'availableService/getServices',
      });
    });
  };

  getServiceInstance = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'availableService/getServiceInstance',
      payload: {
        serviceCode: record.code,
      },
      callback: re => {
        Object.assign(record, {
          loading: false,
          instanceData: re.data || '<span style="color:#999">暂无数据</span>',
        });
        this.forceUpdate();
      },
    });
  };

  render() {
    const { availableService, loading } = this.props;
    const { currentEnvViewType, envViewData, serviceData } = availableService;
    const columns = [
      {
        title: '服务名',
        dataIndex: 'code',
        width: 320,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <>
          <FilterView
            title="视图"
            currentViewType={currentEnvViewType}
            viewTypeData={envViewData}
            onAction={this.handlerEnvChange}
            reader={{
              title: 'name',
              value: 'code',
            }}
          />
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      toolBar: toolBarProps,
      columns,
      lineNumber: false,
      loading: loading.effects['availableService/getServices'],
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '输入服务名称关键字',
      searchProperties: ['code'],
      searchWidth: 260,
      rowKey: 'code',
      dataSource: serviceData,
      expandedRowRender: record => {
        return <InstanceList loading={record.loading} dataSource={record.instanceData} />;
      },
      onExpand: (expanded, record) => {
        if (expanded === true) {
          if (!record.instanceData) {
            Object.assign(record, { loading: true });
            this.getServiceInstance(record);
          }
        }
      },
    };
    return (
      <div className={cls(styles['service-box'])}>
        <ExtTable key={get(currentEnvViewType, 'id')} {...extTableProps} />
      </div>
    );
  }
}

export default AvailableService;
