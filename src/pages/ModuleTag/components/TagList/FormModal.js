/* eslint-disable no-empty */
import React, { PureComponent } from 'react';
import { get, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { Form, Input, Button, Layout } from 'antd';
import { ExtModal, ListLoader, utils, ComboList, NoticeBar } from 'suid';
import * as MarkdownIt from 'markdown-it';
import MdEditor, { Plugins } from 'react-markdown-editor-lite';
import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-light.css';
import 'react-markdown-editor-lite/lib/index.css';
import { constants } from '@/utils';
import { MdEditorViewSwitch } from '@/components';
import styles from './FormModal.less';

MdEditor.unuse(Plugins.ModeToggle);
MdEditor.use(MdEditorViewSwitch);

const { SERVER_PATH } = constants;
const { Sider, Content } = Layout;
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

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  langPrefix: 'language-',
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ''; // 使用额外的默认转义
  },
});

@Form.create()
class FormModal extends PureComponent {
  static editorId;

  static mdEditor;

  static propTypes = {
    onlyView: PropTypes.bool,
    showTagModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
    currentModule: PropTypes.object,
    save: PropTypes.func,
    saving: PropTypes.bool,
    dataLoading: PropTypes.bool,
    tagData: PropTypes.object,
    newTag: PropTypes.bool,
  };

  static defaultProps = {
    onlyView: false,
  };

  constructor(props) {
    super(props);
    const { tagData } = props;
    const { message = '' } = tagData || {};
    this.state = {
      message,
    };
    this.editorId = getUUID();
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
      const params = {
        message,
        moduleCode: get(currentModule, 'code'),
        moduleId: get(currentModule, 'id'),
      };
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

  handlerAceChannge = ({ text }) => {
    this.setState({ message: text });
  };

  renderFooterBtn = () => {
    const { saving, onlyView, closeFormModal } = this.props;
    if (onlyView) {
      return (
        <Button type="primary" onClick={closeFormModal}>
          关闭
        </Button>
      );
    }
    return (
      <>
        <Button disabled={saving} onClick={closeFormModal}>
          取消
        </Button>
        <Button type="primary" loading={saving} onClick={() => this.handlerFormSubmit()}>
          确定
        </Button>
      </>
    );
  };

  renderHTML = text => {
    return mdParser.render(text);
  };

  render() {
    const { message } = this.state;
    const {
      form,
      closeFormModal,
      showTagModal,
      dataLoading,
      onlyView,
      tagData,
      newTag,
      currentModule,
    } = this.props;
    const { getFieldDecorator } = form;
    const title = newTag ? '新建标签' : '显示标签';
    const modalProps = {
      destroyOnClose: true,
      onCancel: closeFormModal,
      visible: showTagModal,
      centered: true,
      width: 880,
      wrapClassName: styles['form-box'],
      bodyStyle: { padding: 0 },
      footer: this.renderFooterBtn(),
      title,
    };
    const branchProps = {
      form,
      name: 'branch',
      showSearch: false,
      pagination: false,
      store: {
        url: `${SERVER_PATH}/sei-manager/tag/getBranches`,
      },
      cascadeParams: {
        gitId: get(currentModule, 'gitId'),
      },
      placeholder: '选择分支',
      reader: {
        name: 'key',
      },
    };
    return (
      <ExtModal {...modalProps}>
        {dataLoading ? (
          <ListLoader />
        ) : (
          <Layout className="auto-height">
            <Sider width={300} className="auto-height" theme="light">
              <div className="item-box">
                <div className="form-body">
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
                    <FormItem label="修订版本(提示:默认在当前版本上自增1)">
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
                    <FormItem label="分支">
                      {getFieldDecorator('branch', {
                        initialValue: get(tagData, 'branch'),
                        rules: [
                          {
                            required: true,
                            message: '分支不能为空',
                          },
                        ],
                      })(<ComboList {...branchProps} disabled={onlyView} />)}
                    </FormItem>
                  </Form>
                </div>
              </div>
            </Sider>
            <Content className="auto-height" style={{ paddingLeft: 4 }}>
              <div className="item-box">
                <div className="item-label">
                  <span className="title">
                    标签描述(Markdown)
                    <NoticeBar
                      style={{ marginLeft: 8, display: 'inline-flex', fontSize: 12, width: 410 }}
                      marqueeProps={{ style: { padding: '0 7.5px' } }}
                    >
                      标签保存以后不能修改，请保存前检查版本、分支及标签描述。
                    </NoticeBar>
                  </span>
                </div>
                <div className="item-body">
                  <MdEditor
                    ref={ref => (this.mdEditor = ref || undefined)}
                    style={{ height: '526px', width: '100%' }}
                    name={this.editorId}
                    value={message || ''}
                    readOnly={onlyView}
                    placeholder="请输入标签说明(例如：修订的内容)"
                    renderHTML={text => this.renderHTML(text)}
                    onChange={this.handlerAceChannge}
                    config={{
                      view: {
                        menu: !onlyView,
                        md: !onlyView,
                        html: onlyView,
                      },
                      canView: { fullScreen: true, hideMenu: false },
                    }}
                  />
                </div>
              </div>
            </Content>
          </Layout>
        )}
      </ExtModal>
    );
  }
}

export default FormModal;
