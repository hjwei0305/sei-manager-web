import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
// import { ExtModal } from 'suid';
import md5 from 'md5';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 18,
      offset: 6,
    },
  },
};
@Form.create()
class ResetPwd extends PureComponent {
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  onFormSubmit = () => {
    const { form } = this.props;
    const { tenantCode } = {};
    return new Promise((resolve, reject) => {
      form.validateFields((err, formData) => {
        if (err) {
          reject(err);
        }
        const { oldPassword, newPassword, confirmNewPassword } = formData;
        const params = {};
        Object.assign(params, { tenant: tenantCode });
        Object.assign(params, formData, {
          oldPassword: md5(oldPassword),
          newPassword: md5(newPassword),
          confirmNewPassword: md5(confirmNewPassword),
        });
        resolve(params);
      });
    });
  };

  // eslint-disable-next-line consistent-return
  checkPassword = (_, password, callback) => {
    if (!password || password.length < 8) {
      callback('密码须包含字母、数字、特殊字符至少2种,密码长度不能小于8位');
      return false;
    }
    let iNow = 0;
    if (password.match(/[0-9]/g)) {
      iNow += 1;
    }
    if (password.match(/[a-z]/gi)) {
      iNow += 1;
    }
    if (password.match(/[~!@#$%^&*]/g)) {
      iNow += 1;
    }
    if (iNow < 2) {
      callback('密码须包含字母、数字、特殊字符至少2种,密码长度不能小于8位');
      return false;
    }
    callback();
  };

  render() {
    const { form, editData = {}, saving, children } = this.props;
    const { getFieldDecorator } = form;

    return (
      // <ExtModal
      //   destroyOnClose
      //   onCancel={onClose}
      //   visible={visible}
      //   centered
      //   confirmLoading={saving}
      //   maskClosable={false}
      //   title={title}
      //   okText="保存"
      //   onOk={this.onFormSubmit}
      // >
      <Form {...formItemLayout} layout="horizontal">
        <FormItem label="租户代码">
          {getFieldDecorator('tenant', {
            initialValue: editData.tenant,
          })(<Input disabled={!!saving} />)}
        </FormItem>
        <FormItem label="账号">
          {getFieldDecorator('account', {
            initialValue: editData.account,
            rules: [
              {
                required: true,
                message: '账号不能为空',
              },
            ],
          })(<Input disabled={!!saving} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="旧密码">
          {getFieldDecorator('oldPassword', {
            initialValue: '',
            rules: [{ required: true, message: '请填写旧密码!' }],
          })(<Input.Password autoFocus visibilityToggle disabled={!!saving} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="新密码">
          {getFieldDecorator('newPassword', {
            initialValue: '',
            rules: [
              { required: true, message: '请填写新密码!' },
              { validator: this.checkPassword },
            ],
          })(<Input.Password visibilityToggle disabled={!!saving} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="确认新密码">
          {getFieldDecorator('confirmNewPassword', {
            initialValue: '',
            rules: [
              { required: true, message: '请填写确认新密码!' },
              { validator: this.checkPassword },
            ],
          })(<Input.Password visibilityToggle disabled={!!saving} />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>{children}</FormItem>
      </Form>
      // </ExtModal>
    );
  }
}

export default ResetPwd;
