import React, { Component } from 'react';
import { Steps, Button, Card, Row, Col, Result } from 'antd';
import { router } from 'umi';
import cls from 'classnames';
import VerifyAccount from './VerifyAccount';
import UpdatePwd from './UpdatePwd';

import styles from './index.less';

const { Step } = Steps;

const steps = [
  {
    title: '验证账号',
  },
  {
    title: '找回密码',
  },
  {
    title: '成功找回',
    content: 'Last-content',
  },
];

class RetrievePwd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  next = () => {
    const { current } = this.state;
    if (current === 0 && this.verifyAccountRef) {
      this.verifyAccountRef.handleCheck();
    }
    if (current === 1 && this.updatePwdRef) {
      this.updatePwdRef.handleFindPwd().then(() => {
        this.updateStep(1);
      });
    }
  };

  handleCheck = checkedResult => {
    this.checkedResult = checkedResult;
    this.updateStep(1);
  };

  prev = () => {
    this.updateStep(-1);
  };

  updateStep = step => {
    const { current } = this.state;
    this.setState({ current: current + step });
  };

  handleRelogin = () => {
    router.replace('/user/login');
  };

  render() {
    const { current } = this.state;
    return (
      <Card title="用户密码找回" bordered={false} className={cls(styles['retrieve-pwd-wrapper'])}>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">
          {current === 0 ? (
            <VerifyAccount
              afterChecked={this.handleCheck}
              onRef={inst => (this.verifyAccountRef = inst)}
            />
          ) : null}
          {current === 1 ? (
            <UpdatePwd editData={this.checkedResult} onRef={inst => (this.updatePwdRef = inst)} />
          ) : null}
          {current === 2 ? (
            <Result
              status="success"
              title="密码找回成功!"
              extra={[
                <Button type="primary" key="login" onClick={this.handleRelogin}>
                  去登录
                </Button>,
              ]}
            />
          ) : null}
        </div>
        <div className="steps-action">
          <Row>
            <Col offset={6}>
              {current < steps.length - 1 && (
                <Button type="primary" onClick={() => this.next()}>
                  下一步
                </Button>
              )}
              {current > 0 && current !== steps.length - 1 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  上一步
                </Button>
              )}
            </Col>
          </Row>
        </div>
      </Card>
    );
  }
}

export default RetrievePwd;
