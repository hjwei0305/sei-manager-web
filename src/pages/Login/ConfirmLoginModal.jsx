/*
 * @Author: zp
 * @Date: 2020-04-13 15:01:55
 * @Last Modified by: Eason
 * @Last Modified time: 2020-10-27 16:29:32
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { ExtModal, utils } from 'suid';
import { Button } from 'antd';
import md5 from 'md5';
import { userInfoOperation } from '@/utils';
import LoginForm from './Form';
import styles from './ConfirmLoginModal.less';

const { getCurrentUser } = userInfoOperation;

@connect(({ user, loading }) => ({ user, loading }))
class ConfirmLoginModal extends Component {
  static loginReqId = utils.getUUID();

  state = {
    showTenant: false,
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
      this.handleQuickLogin();
    }
  };

  handleVertify = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getVerifyCode',
      payload: {
        reqId: this.loginReqId,
      },
    });
  };

  handleQuickLogin = e => {
    const { dispatch, afterSuccess } = this.props;
    this.loginFormRef.onSubmit().then(values => {
      dispatch({
        type: 'user/userLogin',
        payload: { ...values, password: md5(values.password), reqId: this.loginReqId },
      }).then(res => {
        const { success, data } = res || {};
        if (success) {
          /** 多租户 */
          if (data.loginStatus === 'multiTenant') {
            this.setState({
              showTenant: true,
            });
          }
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
                this.setState({
                  showVertifCode: true,
                });
              }
            });
          }
          if (data.loginStatus === 'success') {
            dispatch({
              type: 'menu/updateState',
              payload: {
                loginVisible: false,
              },
            }).then(() => {
              if (afterSuccess) {
                afterSuccess();
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

  handleReLogin = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/updateState',
      payload: {
        loginVisible: false,
      },
    }).then(() => {
      router.replace('/user/login');
    });
  };

  render() {
    const { loading, user, visible } = this.props;
    const { verifyCode } = user;
    const { showTenant, showVertifCode } = this.state;
    const isLoading = loading.effects['user/quickLogin'];
    const userInfo = getCurrentUser();
    const { account, tenantCode } = userInfo || {};

    return (
      <ExtModal
        title="过期登录"
        wrapClassName={styles['container-box']}
        width={400}
        closable={false}
        footer={null}
        visible={visible}
      >
        <LoginForm
          onRef={inst => {
            this.loginFormRef = inst;
          }}
          timeoutLogin
          verifyCode={verifyCode}
          loading={isLoading}
          showTenant={showTenant}
          showVertifCode={showVertifCode}
          account={account}
          tenantCode={tenantCode}
        >
          <div style={{ float: 'right' }}>
            <Button
              size="large"
              loading={isLoading}
              onClick={this.handleReLogin}
              style={{ marginRight: 10 }}
            >
              新账号登录
            </Button>
            <Button size="large" loading={isLoading} type="primary" onClick={this.handleQuickLogin}>
              登录
            </Button>
          </div>
        </LoginForm>
      </ExtModal>
    );
  }
}

export default ConfirmLoginModal;
