import React, { PureComponent } from 'react';
import { get, omit, isEqual } from 'lodash';
import { Form, Input, Row, Col } from 'antd';
import { ExtModal, utils, ListLoader } from 'suid';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/ext-language_tools';
import styles from './FormModal.less';

const FormItem = Form.Item;
const { TextArea } = Input;
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
        wrapClassName={styles['stage-box']}
        confirmLoading={saving}
        title={title}
        onOk={this.handlerFormSubmit}
      >
        {stageParamsLoading ? (
          <ListLoader />
        ) : (
          <Row gutter={8}>
            <Col span={6}>
              <div className="item-box">
                <div className="form-body">
                  <Form layout="horizontal" {...formItemLayout}>
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
                    <FormItem label="阶段描述">
                      {getFieldDecorator('remark', {
                        initialValue: get(rowData, 'remark'),
                      })(<TextArea style={{ resize: 'none' }} rows={4} />)}
                    </FormItem>
                  </Form>
                </div>
              </div>
            </Col>
            <Col span={18}>
              <div className="item-box">
                <div className="item-label">部署执行脚本</div>
                <div className="item-body">
                  <AceEditor
                    mode="json"
                    theme="terminal"
                    name={this.aceId}
                    fontSize={16}
                    onChange={this.handlerAceChannge}
                    showPrintMargin={false}
                    showGutter={false}
                    highlightActiveLine
                    width="100%"
                    height="100%"
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
                </div>
              </div>
            </Col>
          </Row>
        )}
      </ExtModal>
    );
  }
}

export default FormModal;
