import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import cls from 'classnames';
import copy from 'copy-to-clipboard';
import { Descriptions } from 'antd';
import { ListLoader, ScrollBar, message, ExtIcon } from 'suid';
import LogLevel from './LogLevel';
import styles from './LogDetail.less';

class LogDetail extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    logData: PropTypes.object,
  };

  static defaultProps = {
    loading: false,
  };

  getFieldValue = fieldName => {
    const { logData } = this.props;
    const value = get(logData, fieldName);
    return value || '-';
  };

  handlerCopy = fieldName => {
    const { logData } = this.props;
    const value = get(logData, fieldName);
    if (value) {
      copy(value);
      message.success(`已复制到粘贴板`);
    }
  };

  render() {
    const { loading, logData } = this.props;
    return (
      <>
        {loading ? (
          <ListLoader />
        ) : (
          <ScrollBar>
            <Descriptions column={1} colon={false} className={cls(styles['log-content-box'])}>
              <Descriptions.Item label="环境">{this.getFieldValue('env')}</Descriptions.Item>
              <Descriptions.Item label="用户">{`${get(logData, 'userName')}-${get(
                logData,
                'account',
              )}`}</Descriptions.Item>
              <Descriptions.Item label="主机">{this.getFieldValue('host')}</Descriptions.Item>
              <Descriptions.Item label="日志等级">
                <LogLevel item={logData} />
              </Descriptions.Item>
              <Descriptions.Item label="模块名称">
                {this.getFieldValue('serviceName')}
              </Descriptions.Item>
              <Descriptions.Item label="时间戳">
                {this.getFieldValue('timestamp')}
              </Descriptions.Item>
              <Descriptions.Item label="跟踪id">{this.getFieldValue('traceId')}</Descriptions.Item>
              <Descriptions.Item label="调用链路径">
                {this.getFieldValue('tracePath')}
              </Descriptions.Item>
              <Descriptions.Item label="URL" className="message-text">
                <ExtIcon
                  type="copy"
                  className="copy-btn"
                  antd
                  tooltip={{ title: '复制内容到粘贴板' }}
                  onClick={() => this.handlerCopy('url')}
                />
                {this.getFieldValue('url')}
              </Descriptions.Item>
              <Descriptions.Item label="日志类">{this.getFieldValue('logger')}</Descriptions.Item>
              <Descriptions.Item label="日志消息" className="message-text">
                <ExtIcon
                  type="copy"
                  className="copy-btn"
                  antd
                  tooltip={{ title: '复制内容到粘贴板' }}
                  onClick={() => this.handlerCopy('message')}
                />
                {this.getFieldValue('message')}
              </Descriptions.Item>
              <Descriptions.Item label="堆栈信息" className="message-text">
                <ExtIcon
                  type="copy"
                  className="copy-btn"
                  antd
                  tooltip={{ title: '复制内容到粘贴板' }}
                  onClick={() => this.handlerCopy('stackTrace')}
                />
                {this.getFieldValue('stackTrace')}
              </Descriptions.Item>
              <Descriptions.Item label="用户代理" className="message-text">
                <ExtIcon
                  type="copy"
                  className="copy-btn"
                  antd
                  tooltip={{ title: '复制内容到粘贴板' }}
                  onClick={() => this.handlerCopy('userAgent')}
                />
                {this.getFieldValue('userAgent')}
              </Descriptions.Item>
              <Descriptions.Item label="Java类">
                {this.getFieldValue('className')}
              </Descriptions.Item>
              <Descriptions.Item label="方法">{this.getFieldValue('methodName')}</Descriptions.Item>
              <Descriptions.Item label="参数" className="message-text">
                <ExtIcon
                  type="copy"
                  className="copy-btn"
                  antd
                  tooltip={{ title: '复制内容到粘贴板' }}
                  onClick={() => this.handlerCopy('args')}
                />
                {this.getFieldValue('args')}
              </Descriptions.Item>
              <Descriptions.Item label="版本">{this.getFieldValue('version')}</Descriptions.Item>
            </Descriptions>
          </ScrollBar>
        )}
      </>
    );
  }
}

export default LogDetail;
