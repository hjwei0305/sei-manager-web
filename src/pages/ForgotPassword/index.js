import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { get } from 'lodash';
import { Layout, Input, Button, Form, Result, Steps } from 'antd';
import { ExtIcon } from 'suid';
import styles from './index.less';

const { Content } = Layout;
const FormItem = Form.Item;
const { Step } = Steps;

@connect(({ forgotPassword, loading }) => ({ forgotPassword, loading }))
@Form.create()
class ForgotPassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      stepStatus: ['process', 'wait', 'wait'],
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.handlerFormSubmit();
    }
  };

  handleVertify = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'forgotPassword/getVerifyCode',
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
      this.setState({ currentStep: 1 });
      const stepStatus = ['finish', 'process', 'wait'];
      dispatch({
        type: 'forgotPassword/checkUser',
        payload: {
          verifyCode: get(formData, 'verifyCode'),
          usernameOrEmailOrPhone: get(formData, 'usernameOrEmailOrPhone'),
        },
        callback: res => {
          if (res.success) {
            stepStatus[1] = 'finish';
          } else {
            stepStatus[1] = 'error';
            this.handleVertify();
          }
          this.setState({ stepStatus }, () => {
            if (res.success) {
              this.sendForgetPassword();
            }
          });
        },
      });
    });
  };

  sendForgetPassword = () => {
    const { dispatch } = this.props;
    this.setState({ currentStep: 2 });
    const stepStatus = ['finish', 'finish', 'process'];
    dispatch({
      type: 'forgotPassword/sendForgetPassword',
      callback: res => {
        if (res.success) {
          stepStatus[2] = 'finish';
        } else {
          stepStatus[2] = 'error';
          this.handleVertify();
        }
        this.setState({ stepStatus });
      },
    });
  };

  renderAlert = successTip => {
    return (
      <>
        {successTip}
        <Button type="link" style={{ width: 140 }} onClick={this.handlerGoBack}>
          立即登录
        </Button>
      </>
    );
  };

  renderForm = () => {
    const {
      forgotPassword: { verifyCode, successTip },
      form,
      loading,
    } = this.props;
    const { getFieldDecorator } = form;
    const submiting = loading.effects['forgotPassword/checkUser'];
    if (successTip) {
      return (
        <div className="signup-success-tip-box">
          <Result
            status="success"
            title="密码找回成功"
            subTitle={successTip}
            extra={[
              <Button
                type="primary"
                size="large"
                style={{ width: 140 }}
                onClick={this.handlerGoBack}
              >
                立即登录
              </Button>,
            ]}
          />
        </div>
      );
    }
    return (
      <div className="vertical">
        <Form>
          <FormItem className="usernameOrEmailOrPhone">
            {getFieldDecorator('usernameOrEmailOrPhone', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '账号/邮箱/手机号不能为空',
                },
              ],
            })(<Input allowClear autoComplete="off" size="large" placeholder="账号/邮箱/手机号" />)}
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
            loading={submiting}
            type="primary"
            size="large"
          >
            确定
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

  render() {
    const { loading } = this.props;
    const { currentStep, stepStatus } = this.state;
    const checking = loading.effects['forgotPassword/checkUser'];
    const finishing = loading.effects['forgotPassword/sendForgetPassword'];
    return (
      <div className={styles['container-box']}>
        <Layout>
          <Content>
            <div className="head">
              <ExtIcon style={{ fontSize: 32 }} type="safety" antd />
              SEI安全中心
            </div>
            <div className="step-box">
              <Steps current={currentStep} labelPlacement="vertical">
                <Step key="account" status={stepStatus[0]} title="填写账号" />
                <Step
                  key="check"
                  status={stepStatus[1]}
                  icon={
                    currentStep === 1 && checking ? (
                      <ExtIcon type="loading" antd spin style={{ fontSize: 32 }} />
                    ) : null
                  }
                  title="身份验证"
                />
                <Step
                  key="success"
                  status={stepStatus[2]}
                  icon={
                    currentStep === 2 && finishing ? (
                      <ExtIcon type="loading" antd spin style={{ fontSize: 32 }} />
                    ) : null
                  }
                  title="完成"
                />
              </Steps>
            </div>
            <div className="content-box">{this.renderForm()}</div>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default ForgotPassword;
