import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { get, isEqual } from 'lodash';
import { Layout, Input, Button, Result, Form, Alert } from 'antd';
import { Animate, ComboList, message } from 'suid';
import user from '@/assets/people.svg';
import styles from './index.less';

const { Content } = Layout;
const FormItem = Form.Item;

@connect(({ userSignup, loading }) => ({ userSignup, loading }))
@Form.create()
class UserSignup extends PureComponent {
  constructor(props) {
    super(props);
    const {
      userSignup: { defaultMailHost },
    } = props;
    this.state = {
      mailHost: defaultMailHost,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentDidUpdate(prevProps) {
    const {
      userSignup: { defaultMailHost },
    } = this.props;
    if (!isEqual(prevProps.userSignup.defaultMailHost, defaultMailHost) && defaultMailHost) {
      this.setState({
        mailHost: defaultMailHost,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    this.clearData();
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.handlerFormSubmit();
    }
  };

  handleVertify = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSignup/getVerifyCode',
    });
  };

  clearData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSignup/updateState',
      payload: {
        verifyTip: '',
        successTip: '',
        sign: '',
      },
    });
  };

  handlerContinueSignup = () => {
    this.clearData();
    this.handleVertify();
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
      message.destroy();
      const { mailHost } = this.state;
      if (!mailHost) {
        message.error('邮箱Host不能为空!');
        return;
      }
      const mailName = get(formData, 'mailName');
      dispatch({
        type: 'userSignup/registVerify',
        payload: {
          verifyCode: get(formData, 'verifyCode'),
          email: `${mailName}${mailHost}`,
        },
        callback: res => {
          if (res.success) {
            form.resetFields(['verifyCode']);
          } else {
            this.handleVertify();
          }
        },
      });
    });
  };

  handlerGoSignup = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'userSignup/goSignup',
        payload: {
          verifyCode: get(formData, 'verifyCode'),
        },
      });
    });
  };

  renderVerifyTip = () => {
    const {
      form,
      userSignup: { verifyTip },
      loading,
    } = this.props;
    const submiting = loading.effects['userSignup/goSignup'];
    const { getFieldDecorator } = form;
    return (
      <div className="vertical verify-success-form">
        <Alert message="提交成功" description={verifyTip} type="success" showIcon />
        <Form>
          <FormItem className="verifyCode">
            {getFieldDecorator('verifyCode', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '验证码不能为空',
                },
              ],
            })(<Input allowClear size="large" placeholder="验证码" autoComplete="off" />)}
          </FormItem>
          <div className="tip-btn-box">
            <Button
              type="primary"
              ghost
              style={{ width: 140 }}
              disabled={submiting}
              onClick={this.handlerGoBack}
              size="large"
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={this.handlerGoSignup}
              disabled={submiting}
              style={{ width: 140 }}
              size="large"
            >
              注册
            </Button>
          </div>
        </Form>
      </div>
    );
  };

  renderSuccessTip = () => {
    const {
      userSignup: { successTip },
    } = this.props;
    return (
      <div className="signup-success-tip-box">
        <Alert message="注册成功" description={successTip} type="success" showIcon />
        <div className="tip-btn-box">
          <Button
            type="primary"
            ghost
            style={{ width: 140 }}
            onClick={this.handlerContinueSignup}
            size="large"
          >
            继续注册
          </Button>
          <Button type="primary" style={{ width: 140 }} onClick={this.handlerGoBack} size="large">
            去登录
          </Button>
        </div>
      </div>
    );
  };

  renderForm = () => {
    const {
      userSignup: { verifyCode, successTip, verifyTip, suffixHostData, sign },
      form,
      loading,
    } = this.props;
    const { mailHost } = this.state;
    const { getFieldDecorator } = form;
    const verifySubmiting = loading.effects['userSignup/registVerify'];
    const suffixProps = {
      dataSource: suffixHostData,
      showSearch: false,
      value: mailHost,
      pagination: false,
      afterSelect: item => {
        this.setState({ mailHost: item.host });
      },
      reader: {
        name: 'host',
      },
    };
    if (successTip) {
      return this.renderSuccessTip();
    }
    if (verifyTip && sign) {
      return this.renderVerifyTip();
    }
    return (
      <div className="vertical">
        <Form>
          <FormItem className="mailName">
            {getFieldDecorator('mailName', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '邮箱账户名不能为空',
                },
              ],
            })(
              <Input
                allowClear
                autoComplete="off"
                size="large"
                placeholder="邮箱账户名"
                addonAfter={<ComboList {...suffixProps} />}
              />,
            )}
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
                allowClear
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
            loading={verifySubmiting}
            type="primary"
            size="large"
          >
            提交
          </Button>
          <Button
            style={{ width: '100%' }}
            onClick={this.handlerGoBack}
            disabled={verifySubmiting}
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
