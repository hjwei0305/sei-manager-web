import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get, omit } from 'lodash';
import md5 from 'md5';
import { Form, Input, Card, Button } from 'antd';

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
class Account extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    saving: PropTypes.bool,
    save: PropTypes.func,
  };

  handlerFormSubmit = () => {
    const { form, save } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        oldPassword: md5(get(formData, 'oldPassword')),
        password: md5(get(formData, 'password')),
      };
      Object.assign(params, omit(formData, ['confirmPassword', 'password', 'oldPassword']));
      save(params, res => {
        if (res.success) {
          form.resetFields(['oldPassword', 'password', 'confirmPassword']);
        }
      });
    });
  };

  validatePassword = (rule, value, callback) => {
    const { form } = this.props;
    const { confirmPassword } = form.getFieldsValue(['confirmPassword']);
    if (value && confirmPassword && value !== confirmPassword) {
      callback('新密码与确认新密码不正确!');
    }
    callback();
  };

  validateConfirmPassword = (rule, value, callback) => {
    const { form } = this.props;
    const { password } = form.getFieldsValue(['password']);
    if (value && password && value !== password) {
      callback('确认新密码与新密码不正确!');
    }
    callback();
  };

  render() {
    const { form, saving, user } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Card title="账户信息" bordered={false}>
        <Form {...formItemLayout}>
          <FormItem label="账号">
            {getFieldDecorator('account', {
              initialValue: get(user, 'account'),
              rules: [
                {
                  required: true,
                  message: '账号不能为空',
                },
              ],
            })(<Input disabled autoComplete="off" style={{ width: 320 }} />)}
          </FormItem>
          <FormItem label="旧密码">
            {getFieldDecorator('oldPassword', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '旧密码不能为空',
                },
              ],
            })(<Input allowClear type="password" autoComplete="off" style={{ width: 320 }} />)}
          </FormItem>
          <FormItem label="新密码">
            {getFieldDecorator('password', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '新密码不能为空',
                },
                {
                  validator: this.validatePassword,
                },
              ],
            })(<Input allowClear type="password" autoComplete="off" style={{ width: 320 }} />)}
          </FormItem>
          <FormItem label="确认新密码">
            {getFieldDecorator('confirmPassword', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '确认新密码不能为空',
                },
                {
                  validator: this.validateConfirmPassword,
                },
              ],
            })(<Input allowClear type="password" autoComplete="off" style={{ width: 320 }} />)}
          </FormItem>
          <Button loading={saving} onClick={this.handlerFormSubmit} type="primary">
            确定
          </Button>
        </Form>
      </Card>
    );
  }
}

export default Account;
