import React, { PureComponent } from 'react';
import { get, trim } from 'lodash';
import { Form, Input } from 'antd';
import { ExtModal } from 'suid';
import md5 from 'md5';
import { BannerTitle } from '@/components';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

@Form.create()
class ResetFormModal extends PureComponent {
  handlerFormSubmit = () => {
    const { form, save, currentEmployee } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        tenant: currentEmployee.tenantCode,
        account: currentEmployee.code,
      };
      Object.assign(params, formData, {
        password: md5(formData.password),
      });
      save(params);
    });
  };

  checkPassword = (_rule, password, callback) => {
    const pws = trim(password);
    if (!pws || pws.length < 8) {
      callback('密码须包含字母、数字、特殊字符至少2种,密码长度不能小于8位');
      return false;
    }
    let iNow = 0;
    if (pws.match(/[0-9]/g)) {
      iNow += 1;
    }
    if (pws.match(/[a-z]/gi)) {
      iNow += 1;
    }
    if (pws.match(/[~!@#$%^&*]/g)) {
      iNow += 1;
    }
    if (iNow < 2) {
      callback('密码须包含字母、数字、特殊字符至少2种,密码长度不能小于8位');
      return false;
    }
    callback();
  };

  handlerCloseModal = () => {
    const { closeModal } = this.props;
    if (closeModal) {
      closeModal();
    }
  };

  render() {
    const { form, currentEmployee, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    return (
      <ExtModal
        destroyOnClose
        onCancel={this.handlerCloseModal}
        visible={showModal}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={<BannerTitle title={get(currentEmployee, 'userName', '')} subTitle="重置密码" />}
        onOk={this.handlerFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="新密码">
            {getFieldDecorator('password', {
              initialValue: '',
              rules: [
                { required: true, message: '请填写新密码!' },
                { validator: this.checkPassword },
              ],
            })(<Input.Password visibilityToggle />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default ResetFormModal;
