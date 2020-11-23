import React, { PureComponent } from 'react';
import { get, omit, isEqual } from 'lodash';
import { Form, Input, Row, Col } from 'antd';
import { ExtModal, utils } from 'suid';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-terminal';

const FormItem = Form.Item;
const { getUUID } = utils;

@Form.create()
class FormModal extends PureComponent {
  static aceId;

  constructor(props) {
    super(props);
    this.aceId = getUUID();
    const { rowData } = props;
    const { playscript = '' } = rowData || {};
    this.state = {
      scriptText: playscript,
    };
  }

  componentDidUpdate(preProps) {
    const { rowData } = this.props;
    if (!isEqual(preProps.rowData, rowData)) {
      this.setState({ scriptText: get(rowData, 'playscript') });
    }
  }

  handlerFormSubmit = () => {
    const { form, save, rowData } = this.props;
    const { scriptText } = this.state;
    form.validateFields((err, formData) => {
      if (err || !scriptText) {
        return;
      }
      const params = { playscript: scriptText };
      Object.assign(params, omit(rowData, ['playscript']) || {});
      Object.assign(params, formData);
      save(params);
    });
  };

  handlerAceChannge = scriptText => {
    this.setState({ scriptText });
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const { scriptText } = this.state;
    const title = rowData ? '修改部署阶段' : '新建部署阶段';
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        width={780}
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        title={title}
        onOk={this.handlerFormSubmit}
      >
        <Form layout="inline">
          <Row style={{ height: 70, overflow: 'hidden' }}>
            <Col span={10}>
              <FormItem label="阶段名称">
                {getFieldDecorator('name', {
                  initialValue: get(rowData, 'name'),
                  rules: [
                    {
                      required: true,
                      message: '阶段名称不能为空',
                    },
                  ],
                })(<Input style={{ width: 204 }} />)}
              </FormItem>
            </Col>
            <Col span={14}>
              <FormItem label="阶段描述">
                {getFieldDecorator('remark', {
                  initialValue: get(rowData, 'remark'),
                })(<Input style={{ width: 340 }} />)}
              </FormItem>
            </Col>
          </Row>
          <FormItem
            required
            label="部署执行脚本"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            validateStatus="error"
          >
            <AceEditor
              style={{ marginBottom: 24 }}
              mode="json"
              theme="terminal"
              name={this.aceId}
              fontSize={14}
              onChange={this.handlerAceChannge}
              showPrintMargin={false}
              showGutter={false}
              highlightActiveLine
              width={730}
              height={260}
              value={scriptText}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: false,
                tabSize: 2,
              }}
            />
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
