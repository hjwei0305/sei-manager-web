import React from 'react';
import { Spin } from 'antd';
import { message } from 'suid';
import { userInfoOperation } from '@/utils';
import { getUserByXsid } from '@/services/user';

import withUrlQs from '@/components/withUrlQs';

const { processSessionUser } = userInfoOperation;

@withUrlQs
export default class SupPageTurnPage extends React.Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    const { urlQsObj } = this.props;
    const { redirectUrl, sid } = urlQsObj;
    if (!redirectUrl) {
      message.error('缺少参数redirectUrl');
    } else if (sid) {
      getUserByXsid({
        sid,
      })
        .then(result => {
          const { success, data, message: msg } = result || {};
          if (success) {
            processSessionUser(data);
            window.open(redirectUrl, '_self');
          } else {
            message.error(msg);
          }
        })
        .catch(err => {
          message.error(err && err.message);
        });
    } else {
      message.error('缺少参数sid');
    }
  }

  render() {
    const { loading } = this.state;

    return (
      <Spin spinning={loading}>
        <div
          style={{
            height: 'calc(100vh)',
          }}
         />
      </Spin>
    );
  }
}
