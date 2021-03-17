import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Form, Input, Row, Col } from 'antd';
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
class PublishDetail extends PureComponent {
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
    return (
      <ExtModal
        centered
        destroyOnClose
        width={860}
        visible={showModal}
        onCancel={closeFormModal}
        wrapClassName={styles['form-box']}
        bodyStyle={{ paddingBottom: 0 }}
        title="发版申请详情"
        footer={null}
      >
        <Row gutter={8}>
          <Col span={10}>
            <div className="item-box">
              <div className="form-body">
                <Form {...formItemLayout} layout="horizontal">
                  <FormItem label="发版主题">
                    {getFieldDecorator('name', {
                      initialValue: get(rowData, 'name'),
                      rules: [
                        {
                          required: true,
                          message: '发版主题不能为空',
                        },
                      ],
                    })(<Input autoComplete="off" placeholder="请输入发版主题" disabled />)}
                  </FormItem>
                  <FormItem label="发版应用">
                    {getFieldDecorator('appName', {
                      initialValue: get(rowData, 'appName'),
                      rules: [
                        {
                          required: true,
                          message: '发版应用不能为空',
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
                    {getFieldDecorator('refTag', {
                      initialValue: get(rowData, 'refTag'),
                      rules: [
                        {
                          required: true,
                          message: '标签名称不能为空',
                        },
                      ],
                    })(<Input disabled />)}
                  </FormItem>
                </Form>
              </div>
            </div>
          </Col>
          <Col span={14}>
            <div className="item-box">
              <div className="item-label">发版说明(支持Markdown)</div>
              <div className="item-body">
                <AceEditor
                  style={{ marginBottom: 24 }}
                  mode="markdown"
                  theme="textmate"
                  placeholder="请输入发版说明(例如：部署要求,脚本内容)"
                  name={this.aceId}
                  fontSize={14}
                  onChange={this.handlerAceChannge}
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

export default PublishDetail;
