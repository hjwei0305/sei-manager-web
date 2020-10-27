import React, { Component } from 'react';
import { Input, Form, Radio } from 'antd';
import { message } from 'suid';
import cls from 'classnames';
import { connect } from 'dva';
import md5 from 'md5';
import { get } from 'lodash';
import TimerButton from './TimerButton';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

// const tailFormItemLayout = {
//   wrapperCol: {
//     xs: {
//       span: 24,
//       offset: 0,
//     },
//     sm: {
//       span: 16,
//       offset: 8,
//     },
//   },
// };

@connect(({ user, loading }) => ({ user, loading }))
@Form.create({})
class UpdatePwd extends Component {
  static findType = 'Mobile';

  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  handleFindPwd = () => {
    const { form, dispatch } = this.props;
    return new Promise((resolve, reject) => {
      form.validateFields((err, formData) => {
        if (err) {
          reject(err);
        }
        const { newPassword, confirmNewPassword } = formData;
        if (newPassword !== confirmNewPassword) {
          message.error('新密码和确认密码不同，请重新输入');
          reject();
        } else {
          dispatch({
            type: 'user/findpwd',
            payload: Object.assign(formData, { newPassword: md5(formData.newPassword) }),
          }).then(result => {
            const { success } = result;
            if (success) {
              resolve(result);
            }
            reject(result);
          });
        }
      });
    });
  };

  handleSendVerifyCode = () => {
    const { form, dispatch, editData } = this.props;
    const { getFieldValue } = form;
    dispatch({
      type: 'user/sendVerifyCode',
      payload: {
        id: editData.id,
        channel: getFieldValue('channel'),
      },
    });
  };

  validateOpenId = () => {
    const { form } = this.props;
    const { getFieldValue } = form;

    return new Promise((resolve, reject) => {
      const channel = getFieldValue('channel');
      let validateValues = [];
      if (channel === 'Mobile') {
        validateValues = ['mobile'];
      }
      if (channel === 'EMAIL') {
        validateValues = ['email'];
      }
      form.validateFields(validateValues, (err, formData) => {
        if (err) {
          reject(err);
        }
        resolve(formData);
      });
    });
  };

  checkPassword = (_rule, password, callback) => {
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
    return callback();
  };

  handleFindType = e => {
    this.findType = e.target.value;
  };

  render() {
    const { form, editData } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <div className={cls('binding-form')}>
        <Form {...formItemLayout}>
          <FormItem label="id" style={{ display: 'none' }}>
            {getFieldDecorator('id', {
              initialValue: get(editData, 'id'),
            })(<Input />)}
          </FormItem>

          <FormItem label="找回方式">
            {getFieldDecorator('channel', {
              initialValue: this.findType,
              rules: [{ required: true, message: '找回方式不能为空!' }],
            })(
              <Radio.Group onChange={this.handleFindType}>
                <Radio.Button value="Mobile">短信</Radio.Button>
                <Radio.Button value="EMAIL">邮箱</Radio.Button>
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem label="账号">
            {getFieldDecorator('openId', {
              initialValue: get(editData, 'openId'),
            })(<Input disabled />)}
          </FormItem>
          {getFieldValue('channel') === 'Mobile' ? (
            <FormItem label="电话">
              {getFieldDecorator('mobile', {
                initialValue: get(editData, 'mobile'),
                rules: [
                  {
                    required: true,
                    message: '电话号不能为空',
                  },
                ],
              })(<Input disabled />)}
            </FormItem>
          ) : (
            <FormItem label="邮箱">
              {getFieldDecorator('email', {
                initialValue: get(editData, 'email'),
                rules: [
                  {
                    required: true,
                    message: '邮箱不能为空',
                  },
                ],
              })(<Input disabled />)}
            </FormItem>
          )}
          <FormItem label="新密码">
            {getFieldDecorator('newPassword', {
              initialValue: '',
              rules: [
                { required: true, message: '请填写新密码!' },
                { validator: this.checkPassword },
              ],
            })(<Input.Password visibilityToggle />)}
          </FormItem>
          <FormItem label="确认新密码">
            {getFieldDecorator('confirmNewPassword', {
              initialValue: '',
              rules: [
                { required: true, message: '请填写确认新密码!' },
                { validator: this.checkPassword },
              ],
            })(<Input.Password visibilityToggle />)}
          </FormItem>
          <FormItem key={getFieldValue('channel')} label="验证码">
            {getFieldDecorator('verifyCode', {
              rules: [
                {
                  required: true,
                  message: '验证码不能为空',
                },
              ],
            })(
              <Input
                addonAfter={
                  <TimerButton
                    size="small"
                    beforeClick={this.validateOpenId}
                    onClick={this.handleSendVerifyCode}
                  >
                    发送验证码
                  </TimerButton>
                }
              />,
            )}
          </FormItem>
          {/* <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={this.handleFindPwd}>
              立即绑定
            </Button>
          </FormItem> */}
        </Form>
      </div>
    );
  }
}

export default UpdatePwd;
