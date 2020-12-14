import React, { PureComponent } from 'react';
import { get, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { Form, Input, Alert, Row, Col } from 'antd';
import { ExtModal, ListLoader, utils } from 'suid';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-textmate';
import styles from './FormModal.less';

const { getUUID } = utils;
const FormItem = Form.Item;
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
    onlyView: PropTypes.bool,
    showTagModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
    currentModule: PropTypes.object,
    save: PropTypes.func,
    saving: PropTypes.bool,
    dataLoading: PropTypes.bool,
    tagData: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { tagData } = props;
    const { message = '' } = tagData || {};
    this.state = {
      message,
    };
    this.aceId = getUUID();
  }

  componentDidUpdate(prevProps) {
    const { tagData } = this.props;
    if (!isEqual(prevProps.tagData, tagData)) {
      const { message = '' } = tagData || {};
      this.setState({ message });
    }
  }

  handlerFormSubmit = () => {
    const { form, save, currentModule } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const { message } = this.state;
      const params = { message, moduleCode: get(currentModule, 'code') };
      Object.assign(params, formData);
      save(params);
    });
  };

  validateMinor = (rule, value, callback) => {
    const reg = /^(\d){1,3}$/;
    if (value && !reg.test(value)) {
      callback('版本格式不正确!');
    }
    callback();
  };

  validateRevised = (rule, value, callback) => {
    const reg = /^(\d){1,4}$/;
    if (value && !reg.test(value)) {
      callback('版本格式不正确!');
    }
    callback();
  };

  setTagName = () => {
    const { form } = this.props;
    const { major, minor, revised } = form.getFieldsValue(['major', 'minor', 'revised']);
    let tagName = '';
    if (major !== '' && minor !== '' && revised !== '') {
      tagName = `${major}.${minor}.${revised}`;
      form.setFieldsValue({ tagName });
    }
  };

  handlerAceChannge = message => {
    this.setState({ message });
  };

  render() {
    const { message } = this.state;
    const {
      form,
      closeFormModal,
      saving,
      showTagModal,
      dataLoading,
      onlyView,
      tagData,
    } = this.props;
    const { getFieldDecorator } = form;
    const title = tagData && tagData.id ? '显示标签' : '新建标签';
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showTagModal}
        centered
        width={780}
        wrapClassName={styles['form-box']}
        bodyStyle={{ padding: 0 }}
        confirmLoading={saving}
        onOk={this.handlerFormSubmit}
        title={title}
      >
        {dataLoading ? (
          <ListLoader />
        ) : (
          <Row gutter={8}>
            <Col span={10}>
              <div className="item-box">
                <div className="form-body">
                  <Alert message="请合并代码到 master 分支后，再创建标签!" banner />
                  <Form {...formItemLayout} layout="horizontal">
                    <FormItem label="主版本">
                      {getFieldDecorator('major', {
                        initialValue: get(tagData, 'major'),
                        rules: [
                          {
                            required: true,
                            message: '主版本不能为空',
                          },
                        ],
                      })(<Input disabled />)}
                    </FormItem>
                    <FormItem label="次版本">
                      {getFieldDecorator('minor', {
                        initialValue: get(tagData, 'minor'),
                        rules: [
                          {
                            required: true,
                            message: '次版本不能为空',
                          },
                          {
                            validator: this.validateMinor,
                          },
                        ],
                      })(
                        <Input
                          disabled={onlyView}
                          autoComplete="off"
                          onBlur={this.setTagName}
                          placeholder="最多3位数字"
                        />,
                      )}
                    </FormItem>
                    <FormItem label="修订版本">
                      {getFieldDecorator('revised', {
                        initialValue: get(tagData, 'revised'),
                        rules: [
                          {
                            required: true,
                            message: '修订版本不能为空',
                          },
                          {
                            validator: this.validateRevised,
                          },
                        ],
                      })(
                        <Input
                          disabled={onlyView}
                          autoComplete="off"
                          onBlur={this.setTagName}
                          placeholder="最多4位数字"
                        />,
                      )}
                    </FormItem>
                    <FormItem label="标签名称(自动生成)">
                      {getFieldDecorator('tagName', {
                        initialValue: get(tagData, 'tagName'),
                        rules: [
                          {
                            required: true,
                            message: '标签名称不能为空',
                          },
                        ],
                      })(<Input autoComplete="off" disabled placeholder="根据版本号自动生成" />)}
                    </FormItem>
                  </Form>
                </div>
              </div>
            </Col>
            <Col span={14}>
              <div className="item-box">
                <div className="item-label">标签描述(支持Markdown)</div>
                <div className="item-body">
                  <AceEditor
                    style={{ marginBottom: 24 }}
                    mode="markdown"
                    theme="textmate"
                    placeholder="请输入标签说明(例如：修订的内容)"
                    name={this.aceId}
                    fontSize={14}
                    onChange={this.handlerAceChannge}
                    showPrintMargin={false}
                    showGutter={false}
                    readOnly={onlyView}
                    highlightActiveLine
                    width="100%"
                    height="526px"
                    value={message}
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
        )}
      </ExtModal>
    );
  }
}

export default FormModal;
