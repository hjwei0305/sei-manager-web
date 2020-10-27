import React, { Component } from 'react';
import { router } from 'umi';
import { Button, Card, Modal } from 'antd';
import { connect } from 'dva';
import withUrlQs from '@/components/withUrlQs';
import UpdatePwdForm from './FormModal';

@withUrlQs
@connect(({ user, loading }) => ({ user, loading }))
class UpdatePwd extends Component {
  handleOk = () => {
    router.replace('/user/login');
  };

  handleUpadtePwd = () => {
    const { dispatch } = this.props;
    this.formRef.onFormSubmit().then(formVal => {
      dispatch({
        type: 'user/updatePwd',
        payload: formVal,
      }).then(result => {
        const { success } = result || {};
        if (success) {
          Modal.confirm({
            title: '密码更新成功',
            content: '是否重新登录？',
            okText: '重新登录',
            onOk: this.handleOk,
            cancelText: '取消',
          });
        }
      });
    });
  };

  render() {
    const { urlQsObj } = this.props;
    return (
      <Card title="更新密码" bordered={false}>
        <div
          style={{
            width: '60%',
            margin: '100px auto 0 auto',
          }}
        >
          <UpdatePwdForm
            onRef={inst => {
              this.formRef = inst;
            }}
            editData={urlQsObj}
          >
            <Button type="primary" onClick={this.handleUpadtePwd}>
              更新密码
            </Button>
          </UpdatePwdForm>
        </div>
      </Card>
    );
  }
}

export default UpdatePwd;
