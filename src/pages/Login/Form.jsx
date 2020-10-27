import React, { Component } from 'react';
import { Form, Icon, Input, Dropdown, Menu, Popconfirm } from 'antd';
import cls from 'classnames';
import { connect } from 'dva';
import { ExtIcon, utils } from 'suid';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { constants } from '@/utils';

const { LOCALE_USER_LIST_KEY } = constants;
const { storage } = utils;
const FormItem = Form.Item;

@connect(() => ({}))
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

  focusVerifyCodeInput = () => {
    if (this.verifyCodeInputRef) {
      const input = document.getElementById('verifyCode');
      if (input) {
        input.focus();
        input.select();
      }
    }
  };

  handlerDeleteLocalAccount = account => {
    const userData = storage.localStorage.get(LOCALE_USER_LIST_KEY) || [];
    const localUsers = userData.filter(u => u.account !== account);
    storage.localStorage.set(LOCALE_USER_LIST_KEY, localUsers);
    this.forceUpdate();
  };

  handlerSelectAccount = e => {
    const { form } = this.props;
    form.setFieldsValue({ account: e.key });
  };

  getLocaleAccount = userData => {
    const menu = (
      <Menu>
        {userData.map(u => (
          <Menu.Item key={u.account} onClick={this.handlerSelectAccount}>
            <div className="horizontal">
              <div className="row-start vertical">
                <div className="account">{u.account}</div>
                <div className="desc">{u.userName}</div>
              </div>
              <div className="action-box" onClick={e => e.stopPropagation()}>
                <Popconfirm
                  placement="topRight"
                  title={
                    <FormattedMessage
                      id="app.account.local.delete.confirm"
                      defaultMessage="确定要删除此账号的登录痕迹吗?"
                    />
                  }
                  onConfirm={() => this.handlerDeleteLocalAccount(u.account)}
                >
                  <ExtIcon type="delete" className="del" antd />
                </Popconfirm>
              </div>
            </div>
          </Menu.Item>
        ))}
      </Menu>
    );
    return menu;
  };

  renderUserMore = () => {
    const { timeoutLogin = false } = this.props;
    const userData = storage.localStorage.get(LOCALE_USER_LIST_KEY) || [];
    if (!timeoutLogin && userData.length > 0) {
      return (
        <Dropdown
          placement="bottomRight"
          getPopupContainer={() => document.getElementById('__user_form')}
          trigger={['click']}
          overlay={this.getLocaleAccount(userData)}
        >
          <div className="account-more">
            <Icon type="down" style={{ fontSize: 14, cursor: 'pointer' }} />
          </div>
        </Dropdown>
      );
    }
    return null;
  };

  render() {
    const {
      loading,
      verifyCode,
      form,
      errorMsg,
      children,
      showTenant,
      showVertifCode,
      tenantCode,
      account,
      timeoutLogin,
    } = this.props;
    const { getFieldDecorator } = form;
    const colorStyle = { color: 'rgba(0,0,0,.25)', fontSize: 18 };
    const FormItemStyle = { margin: 0, color: 'red' };

    return (
      <Form className={cls('login-from-wrapper')} id="__user_form">
        {errorMsg ? (
          <FormItem style={FormItemStyle}>
            {getFieldDecorator('errMessage')(<span className="errMessage">{errorMsg}</span>)}
          </FormItem>
        ) : null}
        {showTenant ? (
          <FormItem>
            {getFieldDecorator('tenant', {
              initialValue: tenantCode,
              rules: [{ required: true, message: '请输入租户账号!' }],
            })(
              <Input
                size="large"
                disabled={loading || !!tenantCode}
                prefix={<Icon type="user" style={colorStyle} />}
                placeholder="租户账号"
              />,
            )}
          </FormItem>
        ) : null}
        <FormItem className="user-account">
          {getFieldDecorator('account', {
            initialValue: account,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'login.userName-invalid', desc: '请输入用户名!' }),
              },
            ],
          })(
            <Input
              size="large"
              disabled={loading || timeoutLogin}
              autoFocus="autofocus"
              prefix={<Icon type="user" style={colorStyle} />}
              placeholder={formatMessage({ id: 'login.userName' })}
              autoComplete="off"
              allowClear={!timeoutLogin}
              addonAfter={this.renderUserMore()}
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
              size="large"
              disabled={loading}
              prefix={<Icon type="lock" style={colorStyle} />}
              type="password"
              allowClear
              placeholder={formatMessage({ id: 'login.password' })}
            />,
          )}
        </FormItem>
        {showVertifCode ? (
          <FormItem>
            {getFieldDecorator('verifyCode', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请输入验证码!',
                },
              ],
            })(
              <Input
                size="large"
                disabled={loading}
                ref={inst => (this.verifyCodeInputRef = inst)}
                allowClear
                autoFocus
                prefix={<Icon type="code" style={colorStyle} />}
                placeholder="验证码"
                addonAfter={<img alt="验证码" onClick={this.handleVertify} src={verifyCode} />}
              />,
            )}
          </FormItem>
        ) : null}
        <FormItem>{children}</FormItem>
      </Form>
    );
  }
}

export default LoginForm;
