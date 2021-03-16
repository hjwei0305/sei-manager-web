import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { ExtModal, BannerTitle, ComboList } from 'suid';
import { constants } from '@/utils';
import styles from './FormModal.less';

const { REQUEST_TYPE } = constants;
const REQUEST_TYPE_DATA = Object.keys(REQUEST_TYPE).map(key => REQUEST_TYPE[key]);
const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
class FormModal extends PureComponent {
  static propTypes = {
    rowData: PropTypes.object,
    selectedEnv: PropTypes.object,
    selectedApp: PropTypes.object,
    showModal: PropTypes.bool,
    save: PropTypes.func,
    closeFormModal: PropTypes.func,
    saving: PropTypes.bool,
  };

  handlerFormSubmit = () => {
    const { form, save, selectedApp, selectedEnv, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        appCode: get(selectedApp, 'code'),
        appName: get(selectedApp, 'name'),
        envCode: get(selectedEnv, 'code'),
        envName: get(selectedEnv, 'name'),
      };
      Object.assign(params, rowData);
      Object.assign(params, formData);
      save(params);
    });
  };

  closeFormModal = () => {
    const { closeFormModal } = this.props;
    if (closeFormModal) {
      closeFormModal();
    }
  };

  render() {
    const { form, saving, showModal, rowData } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改' : '新建';
    const methodProps = {
      form,
      name: 'method',
      showSearch: false,
      dataSource: REQUEST_TYPE_DATA,
      rowKey: 'key',
      pagination: false,
      reader: {
        name: 'key',
      },
    };
    return (
      <ExtModal
        destroyOnClose
        onCancel={this.closeFormModal}
        visible={showModal}
        centered
        width={420}
        maskClosable={false}
        wrapClassName={styles['form-box']}
        bodyStyle={{ padding: 0 }}
        confirmLoading={saving}
        onOk={this.handlerFormSubmit}
        title={<BannerTitle title={title} subTitle="网关白名单" />}
      >
        <Form {...formItemLayout} layout="horizontal" style={{ margin: '8px 24px' }}>
          <FormItem label="接口地址">
            {getFieldDecorator('uri', {
              initialValue: get(rowData, 'uri'),
              rules: [
                {
                  required: true,
                  message: '接口地址不能为空',
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="请求方法">
            {getFieldDecorator('method', {
              initialValue:
                get(rowData, 'method') || REQUEST_TYPE_DATA.length > 0
                  ? REQUEST_TYPE_DATA[0].key
                  : '',
            })(<ComboList {...methodProps} />)}
          </FormItem>
          <FormItem label="接口描述">
            {getFieldDecorator('remark', {
              initialValue: get(rowData, 'remark'),
              rules: [
                {
                  required: true,
                  message: '接口描述不能为空',
                },
              ],
            })(<TextArea style={{ resize: 'none' }} rows={3} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
