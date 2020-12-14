import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get, omit } from 'lodash';
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
class Profile extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    saving: PropTypes.bool,
    save: PropTypes.func,
  };

  handlerFormSubmit = () => {
    const { form, save, user } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = { id: get(user, 'id') };
      Object.assign(params, omit(formData, ['email']));
      save(params);
    });
  };

  render() {
    const { form, saving, user } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Card title="个人信息" bordered={false}>
        <Form {...formItemLayout}>
          <FormItem label="昵称">
            {getFieldDecorator('nickname', {
              initialValue: get(user, 'nickname'),
              rules: [
                {
                  required: true,
                  message: '昵称不能为空',
                },
              ],
            })(<Input autoComplete="off" style={{ width: 320 }} />)}
          </FormItem>
          <FormItem label="手机号">
            {getFieldDecorator('phone', {
              initialValue: get(user, 'phone'),
            })(<Input autoComplete="off" style={{ width: 320 }} />)}
          </FormItem>
          <FormItem label="电子邮箱">
            {getFieldDecorator('email', {
              initialValue: get(user, 'email'),
            })(<Input autoComplete="off" disabled style={{ width: 320 }} />)}
          </FormItem>
          <Button loading={saving} onClick={this.handlerFormSubmit} type="primary">
            保存
          </Button>
        </Form>
      </Card>
    );
  }
}

export default Profile;
