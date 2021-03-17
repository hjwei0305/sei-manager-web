import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form, Input, Row, Col, DatePicker } from 'antd';
import { ExtModal, utils } from 'suid';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-textmate';
import styles from './index.less';

const FormItem = Form.Item;
const { getUUID } = utils;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
class DeployDetail extends PureComponent {
  static aceId;

  static propTypes = {
    showModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
    rowData: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.aceId = getUUID();
  }

  render() {
    const { form, rowData, showModal, closeFormModal } = this.props;
    const { getFieldDecorator } = form;
    const expCompleteTime = get(rowData, 'expCompleteTime');
    return (
      <ExtModal
        maskClosable={false}
        centered
        destroyOnClose
        width={860}
        visible={showModal}
        onCancel={closeFormModal}
        wrapClassName={styles['form-box']}
        bodyStyle={{ paddingBottom: 0 }}
        title="部署申请详情"
        footer={null}
      >
        <Row gutter={8}>
          <Col span={10}>
            <div className="item-box">
              <div className="form-body">
                <Form {...formItemLayout} layout="horizontal">
                  <FormItem label="部署主题">
                    {getFieldDecorator('name', {
                      initialValue: get(rowData, 'name'),
                      rules: [
                        {
                          required: true,
                          message: '部署主题不能为空',
                        },
                      ],
                    })(<Input placeholder="请输入部署主题" disabled />)}
                  </FormItem>
                  <FormItem label="部署环境">
                    {getFieldDecorator('envName', {
                      initialValue: get(rowData, 'envName'),
                      rules: [
                        {
                          required: true,
                          message: '部署环境不能为空',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                  <FormItem label="部署应用">
                    {getFieldDecorator('appName', {
                      initialValue: get(rowData, 'appName'),
                      rules: [
                        {
                          required: true,
                          message: '部署应用不能为空',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                  <FormItem label="模块名称">
                    {getFieldDecorator('moduleName', {
                      initialValue: get(rowData, 'moduleName'),
                      rules: [
                        {
                          required: true,
                          message: '模块名称不能为空',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                  <FormItem label="标签名称">
                    {getFieldDecorator('tagName', {
                      initialValue: get(rowData, 'tagName'),
                      rules: [
                        {
                          required: true,
                          message: '标签名称不能为空',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                  <FormItem label="期望完成时间">
                    {getFieldDecorator('expCompleteTime', {
                      initialValue: expCompleteTime ? moment(expCompleteTime) : null,
                      rules: [
                        {
                          required: true,
                          message: '期望完成时间不能为空',
                        },
                      ],
                    })(
                      <DatePicker
                        allowClear={false}
                        style={{ width: '100%' }}
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm:00"
                        disabled
                      />,
                    )}
                  </FormItem>
                </Form>
              </div>
            </div>
          </Col>
          <Col span={14}>
            <div className="item-box">
              <div className="item-label">部署说明(支持Markdown)</div>
              <div className="item-body">
                <AceEditor
                  style={{ marginBottom: 24 }}
                  mode="markdown"
                  theme="textmate"
                  placeholder="请输入部署说明(例如：部署要求,脚本内容)"
                  name={this.aceId}
                  fontSize={14}
                  showPrintMargin={false}
                  showGutter={false}
                  readOnly
                  highlightActiveLine
                  width="100%"
                  height="526px"
                  value={get(rowData, 'remark')}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: false,
                    tabSize: 2,
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </ExtModal>
    );
  }
}

export default DeployDetail;
