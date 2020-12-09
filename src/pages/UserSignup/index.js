import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { Layout, Input, Button, Result, Form } from 'antd';
import { Animate } from 'suid';
import user from '@/assets/people.svg';
import styles from './index.less';

const { Content } = Layout;
const FormItem = Form.Item;

@connect(({ userSignup, loading }) => ({ userSignup, loading }))
@Form.create()
class UserSignup extends PureComponent {
  handleVertify = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSignup/getVerifyCode',
    });
  };

  handlerGoBack = () => {
    router.push('/user/login');
  };

  handlerFormSubmit = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'userSignup/goSignup',
        payload: {
          ...formData,
        },
        callback: res => {
          if (!res.success) {
            this.handleVertify();
          }
        },
      });
    });
  };

  renderForm = () => {
    const {
      userSignup: { verifyCode },
      form,
      loading,
    } = this.props;
    const { getFieldDecorator } = form;
    const submiting = loading.effects['userSignup/goSignup'];
    return (
      <div className="vertical">
        <Form>
          <FormItem className="email">
            {getFieldDecorator('email', {
              initialValue: '',
              rules: [
                {
                  type: 'email',
                  message: '电子邮箱格式不正确!',
                },
                {
                  required: true,
                  message: '电子邮箱不能为空',
                },
              ],
            })(<Input autoComplete="off" size="large" placeholder="电子邮箱" />)}
          </FormItem>
          <FormItem className="verifyCode">
            {getFieldDecorator('verifyCode', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '验证码不能为空',
                },
              ],
            })(
              <Input
                size="large"
                placeholder="验证码"
                autoComplete="off"
                addonAfter={<img alt="验证码" onClick={this.handleVertify} src={verifyCode} />}
              />,
            )}
          </FormItem>
          <Button
            style={{ width: '100%' }}
            onClick={this.handlerFormSubmit}
            loading={submiting}
            type="primary"
            size="large"
          >
            注册
          </Button>
          <Button
            style={{ width: '100%' }}
            onClick={this.handlerGoBack}
            disabled={submiting}
            size="large"
          >
            返回
          </Button>
        </Form>
      </div>
    );
  };

  renderTitle = () => {
    return (
      <>
        <span className="logo">
          <Animate type="fadeInLeft" delay={200}>
            S
          </Animate>
          <Animate type="tada" delay={400} duration={1500}>
            E
          </Animate>
          <Animate type="fadeInRight" delay={200}>
            I
          </Animate>
        </span>
        开发运维平台
      </>
    );
  };

  render() {
    return (
      <div className={styles['container-box']}>
        <Layout>
          <Content>
            <div className="content-box">
              <Result
                icon={<img src={user} alt="" />}
                title={this.renderTitle()}
                subTitle="用户注册仅需一步，与更多的小伙伴一起用"
                extra={this.renderForm()}
              />
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default UserSignup;
