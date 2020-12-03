import React, { PureComponent } from 'react';
import { get, omit, isEqual } from 'lodash';
import { Form, Input, Row, Col } from 'antd';
import { ExtModal, utils, ListLoader } from 'suid';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/ext-language_tools';

const FormItem = Form.Item;
const { getUUID } = utils;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class FormModal extends PureComponent {
  static aceId;

  static propTypes = {
    rowData: PropTypes.object,
    save: PropTypes.func,
    showModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
    saving: PropTypes.bool,
    getStageParams: PropTypes.func,
    stageParamsLoading: PropTypes.bool,
    stageParams: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.aceId = getUUID();
    const { rowData } = props;
    const { playscript = '' } = rowData || {};
    this.state = {
      scriptText: playscript,
    };
  }

  componentDidMount() {
    const { getStageParams } = this.props;
    getStageParams();
  }

  componentDidUpdate(preProps) {
    const { rowData, getStageParams } = this.props;
    if (!isEqual(preProps.rowData, rowData)) {
      this.setState({ scriptText: get(rowData, 'playscript') });
      const stageId = get(rowData, 'id');
      getStageParams(stageId);
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

  handlerComplete = ace => {
    if (ace) {
      const { stageParams } = this.props;
      const completers = stageParams.map(p => {
        return {
          name: `params.${p.code}`,
          value: `params.${p.code}`,
          score: 10,
          meta: p.name,
        };
      });
      ace.completers.push({
        getCompletions(editor, session, pos, prefix, callback) {
          if (prefix.length === 0) {
            return callback(null, []);
          }
          return callback(null, completers);
        },
      });
    }
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal, stageParamsLoading } = this.props;
    const { getFieldDecorator } = form;
    const { scriptText } = this.state;
    const title = rowData ? '修改部署阶段' : '新建部署阶段';
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        width={880}
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        title={title}
        onOk={this.handlerFormSubmit}
      >
        {stageParamsLoading ? (
          <ListLoader />
        ) : (
          <Form layout="horizontal" {...formItemLayout}>
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
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem label="阶段描述">
                  {getFieldDecorator('remark', {
                    initialValue: get(rowData, 'remark'),
                  })(<Input />)}
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
                fontSize={16}
                onChange={this.handlerAceChannge}
                showPrintMargin={false}
                showGutter={false}
                highlightActiveLine
                width="830px"
                height="260px"
                value={scriptText}
                onLoad={this.handlerComplete}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: false,
                  tabSize: 4,
                }}
              />
            </FormItem>
          </Form>
        )}
      </ExtModal>
    );
  }
}

export default FormModal;
