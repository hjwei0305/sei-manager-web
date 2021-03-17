import React, { Component } from 'react';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import cls from 'classnames';
import { get } from 'lodash';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card, Input } from 'antd';
import { ExtTable, BannerTitle } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH } = constants;

@connect(({ configEvnVar, loading }) => ({ configEvnVar, loading }))
class ValueItem extends Component {
  static tableRef;

  static envVarData;

  constructor(props) {
    super(props);
    this.envVarData = [];
    this.state = {
      envVarData: [],
    };
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'configEvnVar/updateState',
      payload: {
        editHanlderValue: false,
      },
    });
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  edit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configEvnVar/updateState',
      payload: {
        editHanlderValue: true,
      },
    });
  };

  save = () => {
    const {
      dispatch,
      configEvnVar: { editHanlderValue },
    } = this.props;
    if (editHanlderValue) {
      const { envVarData } = this.state;
      dispatch({
        type: 'configEvnVar/saveVariableValue',
        payload: envVarData,
        callback: res => {
          if (res.success) {
            this.reloadData();
          }
        },
      });
    }
  };

  saveCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configEvnVar/updateState',
      payload: {
        editHanlderValue: false,
      },
    });
    this.setState({ envVarData: this.envVarData });
  };

  initEvnVarData = envVarData => {
    this.envVarData = [...envVarData];
    this.setState({ envVarData });
  };

  setValue = (e, row) => {
    const { envVarData: originEvnVarData } = this.state;
    const envVarData = [...originEvnVarData];
    for (let i = 0; i < envVarData.length; i += 1) {
      const item = envVarData[i];
      if (item.envCode === row.envCode) {
        Object.assign(item, { value: e.target.value });
        break;
      }
    }
    this.setState({ envVarData });
  };

  renderHandleValue = (t, row) => {
    const {
      configEvnVar: { editHanlderValue },
    } = this.props;
    if (editHanlderValue) {
      const inputProps = {
        style: { width: '100%' },
        placeholder: '环境变量的值',
        value: row.value,
        onChange: e => this.setValue(e, row),
      };
      return (
        <TweenOne animation={{ opacity: 0, scale: 0, type: 'from' }}>
          <Input key={row.id} {...inputProps} />
        </TweenOne>
      );
    }
    return <span style={{ padding: '12px 8px' }}>{t || '-'}</span>;
  };

  render() {
    const { loading, configEvnVar } = this.props;
    const { selectedEvnVar, editHanlderValue } = configEvnVar;
    const columns = [
      {
        title: '环境',
        dataIndex: 'envName',
        width: 160,
        required: true,
      },
      {
        title: '变量值',
        dataIndex: 'value',
        width: 380,
        required: true,
        className: 'handler-value',
        render: this.renderHandleValue,
      },
    ];
    const saving = loading.effects['configEvnVar/saveVariableValue'];
    const toolBarProps = {
      left: (
        <>
          {editHanlderValue ? (
            <>
              <Button disabled={saving} onClick={this.saveCancel}>
                取消
              </Button>
              <Button type="primary" loading={saving} onClick={this.save}>
                保存
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={this.edit}>
              编辑
            </Button>
          )}
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      bordered: false,
      toolBar: toolBarProps,
      columns,
      showSearch: false,
      rowKey: 'envCode',
      onTableRef: ref => (this.tableRef = ref),
      store: {
        url: `${SERVER_PATH}/sei-manager/envVariable/getVariableValues`,
        loaded: res => {
          this.initEvnVarData(res.data || []);
        },
      },
      cascadeParams: {
        code: get(selectedEvnVar, 'code'),
      },
    };
    return (
      <div className={cls(styles['user-box'])}>
        <Card
          title={<BannerTitle title={get(selectedEvnVar, 'code')} subTitle="环境变量值" />}
          bordered={false}
        >
          <QueueAnim style={{ height: '100%' }}>
            <ExtTable key="aa" {...extTableProps} />
          </QueueAnim>
        </Card>
      </div>
    );
  }
}

export default ValueItem;
