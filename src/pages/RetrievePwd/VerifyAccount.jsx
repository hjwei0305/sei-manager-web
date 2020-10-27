import React, { Component } from 'react';
import { Input, Form } from 'antd';
import cls from 'classnames';
import { findDOMNode } from 'react-dom';
import { connect } from 'dva';
import { utils } from 'suid';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@connect(({ user, loading }) => ({ user, loading }))
@Form.create({})
class VerifyAccount extends Component {
  static reqId = utils.getUUID();

  state = {
    showTenant: false,
  };

  componentDidMount() {
    const { onRef } = this.props;
    this.handleVertify();
    if (onRef) {
      onRef(this);
    }
  }

  handleCheck = () => {
    const { form, dispatch, afterChecked } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'user/checkExisted',
        payload: Object.assign(formData, { reqId: this.reqId }),
      }).then(res => {
        const { success, data } = res || {};
        const { result } = data || {};
        if (success) {
          if (result === 'success' && afterChecked) {
            afterChecked(data);
          }

          if (result === 'multiTenant') {
            this.setState(
              {
                showTenant: true,
              },
              () => {
                const dom = findDOMNode(this.tenantRef);
                if (dom) {
                  dom.focus();
                  form.resetFields(['verifyCode']);
                }
              },
            );
            this.handleVertify();
          }
        }
      });
    });
  };

  handleSendVerifyCode = () => {
    const { form, dispatch, channel } = this.props;
    const { getFieldValue } = form;
    dispatch({
      type: 'user/sendVerifyCode',
      payload: {
        reqId: getFieldValue('openId'),
        channel,
        operation: '绑定账号',
      },
    });
  };

  getLabel = () => {
    const { channel } = this.props;
    if (channel === 'EMAIL') {
      return '绑定邮箱';
    }

    if (channel === 'WeChat') {
      return '绑定企业微信';
    }

    if (channel === 'DingTalk') {
      return '绑定钉钉';
    }

    return '绑定手机号';
  };

  validateOpenId = () => {
    const { form } = this.props;

    return new Promise((resolve, reject) => {
      form.validateFields(['openId'], (err, formData) => {
        if (err) {
          reject(err);
        }
        resolve(formData);
      });
    });
  };

  handleVertify = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getVerifyCode',
      payload: {
        reqId: this.reqId,
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

  render() {
    const { form, user } = this.props;
    const { showTenant } = this.state;
    const { getFieldDecorator } = form;
    const { verifyCode } = user;
    return (
      <div className={cls('binding-form')}>
        <Form {...formItemLayout}>
          {showTenant ? (
            <FormItem label="租户">
              {getFieldDecorator('tenant', {
                rules: [
                  {
                    required: true,
                    message: '租户不能为空',
                  },
                ],
              })(<Input ref={inst => (this.tenantRef = inst)} />)}
            </FormItem>
          ) : null}
          <FormItem label="账号">
            {getFieldDecorator('openId', {
              rules: [
                {
                  required: true,
                  message: '账号不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="验证码">
            {getFieldDecorator('verifyCode', {
              rules: [
                {
                  required: true,
                  message: '验证码不能为空',
                },
              ],
            })(
              <Input
                addonAfter={<img alt="验证码" onClick={this.handleVertify} src={verifyCode} />}
              />,
            )}
          </FormItem>
          {/* <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={this.handleCheck}>
              立即验证
            </Button>
          </FormItem> */}
        </Form>
      </div>
    );
  }
}

export default VerifyAccount;
