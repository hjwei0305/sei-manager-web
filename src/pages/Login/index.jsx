import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import cls from 'classnames';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import md5 from 'md5';
import { utils, Animate } from 'suid';
import SelectLang from '@/components/SelectLang';
import LoginForm from './Form';
import styles from './index.less';

@connect(({ user, loading }) => ({ user, loading }))
@Form.create()
class Login extends Component {
  static loginReqId = utils.getUUID();

  state = {
    showVertifCode: false,
  };

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.login();
    }
  };

  login = e => {
    const { dispatch } = this.props;
    this.loginFormRef.onSubmit().then(values => {
      dispatch({
        type: 'user/userLogin',
        payload: { ...values, password: md5(values.password), reqId: this.loginReqId },
      }).then(res => {
        const { success, data } = res || {};
        if (success) {
          /** 验证码 */
          if (data.loginStatus === 'captchaError') {
            dispatch({
              type: 'user/getVerifyCode',
              payload: {
                reqId: this.loginReqId,
              },
            }).then(result => {
              const { success: scs } = result || {};
              if (scs) {
                this.setState(
                  {
                    showVertifCode: true,
                  },
                  () => {
                    if (this.loginFormRef) {
                      this.loginFormRef.focusVerifyCodeInput();
                    }
                  },
                );
              }
            });
          }
        }
      });
    });
    if (e) {
      e.preventDefault();
    }
  };

  handleRetrievePwd = () => {
    router.push('/userForgotPassword');
  };

  handlerUserSignup = () => {
    router.push('/userSignup');
  };

  render() {
    const { loading, user } = this.props;
    const { verifyCode } = user;
    const { showVertifCode } = this.state;
    const isLoading = loading.effects['user/userLogin'];

    return (
      <div className={styles['container-box']}>
        <div className={cls('form-logo', 'horizontal')}>
          <Animate type="fadeInLeft" delay={200}>
            U
          </Animate>
          <Animate type="tada" delay={400} duration={1500}>
            A
          </Animate>
          <Animate type="fadeInRight" delay={200}>
            P
          </Animate>
        </div>
        <div className="login-form-title">
          <Animate type="flipInY" delay={400}>
            <span className="title">开发运维平台</span>
          </Animate>
        </div>

        <LoginForm
          onRef={inst => {
            this.loginFormRef = inst;
          }}
          loginReqId={this.loginReqId}
          verifyCode={verifyCode}
          loading={isLoading}
          showVertifCode={showVertifCode}
        >
          <Button
            loading={isLoading}
            type="primary"
            size="large"
            onClick={this.login}
            className="login-form-button"
          >
            {!isLoading
              ? formatMessage({ id: 'login.login', desc: '登录' })
              : formatMessage({ id: 'login.loginning', desc: '登录中...' })}
          </Button>
        </LoginForm>
        <div className="tool-box">
          <span>
            <Button type="link" className="btn-link" onClick={this.handlerUserSignup}>
              <FormattedMessage id="user.signup" defaultMessage="注册" />
            </Button>
            <Button type="link" className="btn-link" onClick={this.handleRetrievePwd}>
              <FormattedMessage id="login.forgot-password" defaultMessage="忘记密码?" />
            </Button>
          </span>
          <div className="tool-action">
            <SelectLang />
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
