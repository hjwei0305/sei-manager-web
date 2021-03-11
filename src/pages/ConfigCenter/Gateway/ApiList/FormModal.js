import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { ExtModal, BannerTitle } from 'suid';
import styles from './FormModal.less';

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
    selectedApp: PropTypes.object,
    showModal: PropTypes.bool,
    save: PropTypes.func,
    closeFormModal: PropTypes.func,
    saving: PropTypes.bool,
  };

  handlerFormSubmit = () => {
    const { form, save, selectedApp, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        appCode: get(selectedApp, 'code'),
        appName: get(selectedApp, 'name'),
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
            {getFieldDecorator('interfaceURI', {
              initialValue: get(rowData, 'interfaceURI'),
              rules: [
                {
                  required: true,
                  message: '接口地址不能为空',
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="接口名称">
            {getFieldDecorator('interfaceName', {
              initialValue: get(rowData, 'interfaceName'),
              rules: [
                {
                  required: true,
                  message: '接口名称不能为空',
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="接口描述">
            {getFieldDecorator('interfaceRemark', {
              initialValue: get(rowData, 'interfaceRemark'),
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
