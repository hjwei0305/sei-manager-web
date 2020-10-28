import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { get, isEqual, omit } from 'lodash';
import { Drawer, Form, Button, Input } from 'antd';
import { ScrollBar, ComboList, ComboTree, MoneyInput } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH, RECEIVE_TYPE } = constants;
const RECEIVE_TYPE_DATA = Object.keys(RECEIVE_TYPE).map(key => RECEIVE_TYPE[key]);
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
class FilterView extends PureComponent {
  static propTypes = {
    showFilter: PropTypes.bool,
    filterData: PropTypes.object,
    onFilterSubmit: PropTypes.func,
    onCloseFilter: PropTypes.func,
    onResetFilter: PropTypes.func,
  };

  static defaultProps = {
    showFilter: false,
  };

  constructor(props) {
    super(props);
    const { filterData } = props;
    this.state = {
      filterData,
      receiveAccountType: null,
    };
  }

  componentDidUpdate(preProps) {
    const { filterData } = this.props;
    if (!isEqual(preProps.filterData, filterData)) {
      if (Object.keys(filterData).length === 0) {
        this.handlerReset();
      } else {
        this.setState({
          filterData,
        });
      }
    }
  }

  handlerFilter = () => {
    const { filterData } = this.state;
    const { form, onFilterSubmit } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const omitFields = ['organizationName', 'payeeTypeName', 'companyName'];
      if (formData.paymentBillMoney === 0) {
        omitFields.push('paymentBillMoney');
      }
      const submitData = omit({ ...filterData, ...formData }, omitFields);
      onFilterSubmit(submitData);
    });
  };

  handlerReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      filterData: {},
    });
  };

  handlerClose = () => {
    const { onCloseFilter } = this.props;
    if (onCloseFilter) {
      onCloseFilter();
    }
  };

  handlerReceiveTypeChange = item => {
    const { key } = item;
    const { form } = this.props;
    this.setState({ receiveAccountType: RECEIVE_TYPE[key] });
    form.resetFields(['receiveName']);
  };

  getFields() {
    const { filterData, receiveAccountType } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator('organizationId', {
      initialValue: get(filterData, 'organizationId', null),
    });
    getFieldDecorator('corporationCode', {
      initialValue: get(filterData, 'corporationCode', null),
    });
    getFieldDecorator('payeeType', {
      initialValue: get(filterData, 'payeeType', null),
    });
    const corporationComboListProps = {
      placeholder: formatMessage({ id: 'global.all', defaultMessage: '全部' }),
      allowClear: true,
      form,
      store: {
        url: `${SERVER_PATH}/sei-basic/corporation/getUserAuthorizedEntities`,
      },
      name: 'companyName',
      field: ['corporationCode'],
      reader: {
        name: 'name',
        field: ['code'],
        description: 'code',
      },
    };

    const organizationProps = {
      placeholder: formatMessage({ id: 'global.all', defaultMessage: '全部' }),
      allowClear: true,
      form,
      name: 'organizationName',
      field: ['organizationId'],
      store: {
        url: `${SERVER_PATH}/sei-basic/organization/findAllAuthTreeEntityData`,
      },
      reader: {
        name: 'name',
        field: ['id'],
      },
    };
    const payeeTypeProps = {
      form,
      placeholder: formatMessage({ id: 'global.all', defaultMessage: '全部' }),
      allowClear: true,
      name: 'payeeTypeName',
      field: ['payeeType'],
      showSearch: false,
      pagination: false,
      dataSource: RECEIVE_TYPE_DATA,
      afterSelect: item => {
        this.handlerReceiveTypeChange(item);
      },
      afterClear: () => {
        this.setState({ receiveAccountType: null });
        form.resetFields(['receiveName']);
      },
      searchProperties: ['title'],
      reader: {
        name: 'title',
        field: ['key'],
      },
    };
    const receiverType = get(receiveAccountType, 'key', null);
    const receiveAccountComboListProps = {
      placeholder: '全部',
      form,
      name: 'receiveName',
      allowClear: true,
      cascadeParams: {
        receiverType,
      },
      emptyText: receiverType ? '暂无数据' : '请选择收款方类型',
      store: {
        url: `${SERVER_PATH}/sei-fim/paymentInfo/findByBmsReceiverTypeAndReceiverType`,
      },
      reader: {
        name: 'receiverName',
      },
      searchProperties: ['receiverName'],
    };
    const payeeType = RECEIVE_TYPE[get(filterData, 'payeeType')] || null;
    return (
      <>
        <FormItem label="付款方名称">
          {getFieldDecorator('companyName', {
            initialValue: get(filterData, 'companyName', null),
          })(<ComboList {...corporationComboListProps} />)}
        </FormItem>
        <FormItem label="收款方类型">
          {getFieldDecorator('payeeTypeName', {
            initialValue: get(payeeType, 'title'),
          })(<ComboList {...payeeTypeProps} />)}
        </FormItem>
        <FormItem label="收款方名称">
          {getFieldDecorator('receiveName', {
            initialValue: get(filterData, 'receiveName'),
          })(<ComboList {...receiveAccountComboListProps} />)}
        </FormItem>
        <FormItem label="申请部门">
          {getFieldDecorator('organizationName', {
            initialValue: get(filterData, 'organizationName', null),
          })(<ComboTree {...organizationProps} />)}
        </FormItem>
        <FormItem label="创建人">
          {getFieldDecorator('creatorName', {
            initialValue: get(filterData, 'creatorName', null),
          })(<Input allowClear />)}
        </FormItem>
        <FormItem label="付款金额">
          {getFieldDecorator('paymentBillMoney', {
            initialValue: get(filterData, 'paymentBillMoney', null),
          })(<MoneyInput />)}
        </FormItem>
      </>
    );
  }

  render() {
    const { showFilter } = this.props;
    return (
      <Drawer
        width={350}
        getContainer={false}
        placement="right"
        visible={showFilter}
        title={formatMessage({ id: 'global.filter', defaultMessage: '过滤' })}
        className={cls(styles['filter-box'])}
        onClose={this.handlerClose}
        style={{ position: 'absolute' }}
      >
        <ScrollBar>
          <div className={cls('content')}>
            <Form {...formItemLayout} layout="vertical">
              {this.getFields()}
            </Form>
          </div>
        </ScrollBar>
        <div className="footer">
          <Button onClick={this.handlerReset}>
            <FormattedMessage id="global.reset" defaultMessage="重置" />
          </Button>
          <Button type="primary" onClick={e => this.handlerFilter(e)}>
            <FormattedMessage id="global.ok" defaultMessage="确定" />
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default FilterView;
