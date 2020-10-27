import React, { Component } from 'react';
import { Form, Icon, Input } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

const FormItem = Form.Item;

@Form.create()
class LoginForm extends Component {
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  onSubmit = () => {
    const { form } = this.props;
    return new Promise((resolve, reject) => {
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          resolve(values);
        }
        reject(err);
      });
    });
  };

  handleVertify = () => {
    const { dispatch, loginReqId } = this.props;
    dispatch({
      type: 'user/getVerifyCode',
      payload: {
        reqId: loginReqId,
      },
    });
  };

  render() {
    const {
      loading,
      form,
      formTitle = '账号绑定',
      children,
      openId,
      tenant,
      account,
      authType,
    } = this.props;
    const { getFieldDecorator } = form;
    const colorStyle = { color: 'rgba(0,0,0,.25)' };

    return (
      <Form className="bind-from-wrapper">
        <div className="bind-form-title">{formTitle}</div>
        {tenant ? (
          <FormItem>
            {getFieldDecorator('tenant', {
              initialValue: tenant,
            })(<Input disabled={!!tenant} prefix={<Icon type="team" style={colorStyle} />} />)}
          </FormItem>
        ) : null}
        <FormItem>
          {getFieldDecorator('account', {
            initialValue: account,
            rules: [
              {
                // required: true,
                message: formatMessage({ id: 'login.userName-invalid', desc: '请输入用户名!' }),
              },
            ],
          })(
            <Input
              disabled={loading || !!account}
              autoFocus="autofocus"
              prefix={<Icon type="user" style={colorStyle} />}
              placeholder={formatMessage({ id: 'login.userName' })}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'login.password-invalid', desc: '请输入密码!' }),
              },
            ],
          })(
            <Input
              disabled={loading}
              prefix={<Icon type="lock" style={colorStyle} />}
              type="password"
              placeholder={formatMessage({ id: 'login.password' })}
            />,
          )}
        </FormItem>
        {/* openId */}
        <FormItem style={{ display: 'none' }}>
          {getFieldDecorator('reqId', {
            initialValue: openId,
          })(<Input />)}
        </FormItem>
        {/* openId */}
        <FormItem style={{ display: 'none' }}>
          {getFieldDecorator('authType', {
            initialValue: authType,
          })(<Input />)}
        </FormItem>
        <FormItem>{children}</FormItem>
      </Form>
    );
  }
}

export default LoginForm;
