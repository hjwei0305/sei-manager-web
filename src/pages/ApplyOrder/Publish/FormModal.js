/* eslint-disable no-empty */
import React, { PureComponent } from 'react';
import { get, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import { Form, Input, Button, Row, Col, Layout, Card } from 'antd';
import { ExtModal, ComboList, utils, ListLoader, ExtIcon, BannerTitle, ScrollBar } from 'suid';
import * as MarkdownIt from 'markdown-it';
import MdEditor, { Plugins } from 'react-markdown-editor-lite';
import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-light.css';
import 'react-markdown-editor-lite/lib/index.css';
import { MdEditorView, MdEditorViewSwitch } from '@/components';
import { constants } from '../../../utils';
import styles from './FormModal.less';

MdEditor.unuse(Plugins.ModeToggle);
MdEditor.use(MdEditorViewSwitch);

const { Sider, Content } = Layout;
const FormItem = Form.Item;
const { getUUID } = utils;
const { SERVER_PATH } = constants;
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
    showModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
    rowData: PropTypes.object,
    dataLoading: PropTypes.bool,
    save: PropTypes.func,
    saving: PropTypes.bool,
    saveToApprove: PropTypes.func,
    saveToApproving: PropTypes.bool,
    loadingTagContent: PropTypes.bool,
    getTagContent: PropTypes.func,
    tagContent: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { rowData } = props;
    const { remark = '' } = rowData || {};
    this.state = {
      remark,
      tagId: '',
    };
    this.editorId = getUUID();
  }

  componentDidUpdate(preProps) {
    const { rowData } = this.props;
    if (!isEqual(preProps.rowData, rowData)) {
      const { remark = '' } = rowData || {};
      this.setState({
        remark,
      });
    }
  }

  handlerFormSubmit = approve => {
    const { remark } = this.state;
    const { form, save, rowData, saveToApprove } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      Object.assign(params, {
        remark,
        version: get(params, 'refTag'),
      });
      if (approve) {
        saveToApprove(params);
      } else {
        save(params);
      }
    });
  };

  handlerMdChannge = ({ text }) => {
    this.setState({ remark: text });
  };

  renderHTML = text => {
    return mdParser.render(text);
  };

  closeFormModal = () => {
    const { closeFormModal } = this.props;
    this.setState({ remark: '' });
    if (closeFormModal) {
      closeFormModal();
    }
  };

  renderFooterBtn = () => {
    const { saving, saveToApproving, onlyView, dataLoading } = this.props;
    if (!onlyView) {
      return (
        <>
          <Button disabled={saving || saveToApproving} onClick={this.closeFormModal}>
            取消
          </Button>
          <Button
            disabled={saveToApproving || dataLoading}
            loading={saving}
            onClick={() => this.handlerFormSubmit()}
          >
            仅保存
          </Button>
          <Button
            disabled={saving || dataLoading}
            loading={saveToApproving}
            onClick={() => this.handlerFormSubmit(true)}
            type="primary"
          >
            保存并提交
          </Button>
        </>
      );
    }
  };

  handlerTagContent = () => {
    const { tagId } = this.state;
    const { tagContent, getTagContent } = this.props;
    if (
      tagId &&
      !isEqual(get(tagContent, 'id'), tagId) &&
      getTagContent &&
      getTagContent instanceof Function
    ) {
      getTagContent(tagId);
    }
  };

  renderTitle = () => {
    const { rowData, onlyView } = this.props;
    let title = rowData ? '修改' : '新建';
    if (onlyView) {
      title = '显示';
    }
    return (
      <>
        <ExtIcon onClick={this.closeFormModal} type="left" className="trigger-back" antd />
        <BannerTitle title={title} subTitle="发版申请" />
      </>
    );
  };

  render() {
    const { remark, tagId } = this.state;
    const {
      form,
      rowData,
      showModal,
      onlyView,
      dataLoading,
      loadingTagContent,
      tagContent,
    } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator('appId', { initialValue: get(rowData, 'appId') });
    getFieldDecorator('gitId', { initialValue: get(rowData, 'gitId') });
    getFieldDecorator('moduleId', { initialValue: get(rowData, 'moduleId') });
    getFieldDecorator('moduleCode', { initialValue: get(rowData, 'moduleCode') });
    const appProps = {
      form,
      name: 'appName',
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/application/findByPage`,
        params: {
          filters: [{ fieldName: 'frozen', operator: 'EQ', value: false }],
        },
      },
      placeholder: '选择要发版的应用',
      afterSelect: () => {
        form.setFieldsValue({ moduleName: '', gitId: '', refTag: '' });
        this.setState({ tagId: '' }, this.handlerTagContent);
      },
      remotePaging: true,
      field: ['appId'],
      reader: {
        name: 'name',
        description: 'remark',
        field: ['id'],
      },
    };
    const moduleProps = {
      form,
      name: 'moduleName',
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/appModule/findByPage`,
      },
      placeholder: '请先选择要发版的应用',
      cascadeParams: {
        filters: [
          { fieldName: 'frozen', operator: 'EQ', value: false },
          { fieldName: 'appId', operator: 'EQ', value: form.getFieldValue('appId') || null },
        ],
      },
      afterSelect: () => {
        form.setFieldsValue({ refTag: '' });
        this.setState({ tagId: '' }, this.handlerTagContent);
      },
      remotePaging: true,
      field: ['gitId', 'moduleCode', 'moduleId'],
      reader: {
        name: 'name',
        description: 'remark',
        field: ['gitId', 'code', 'id'],
      },
    };
    const tagProps = {
      form,
      name: 'refTag',
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/tag/getTags`,
      },
      remotePaging: true,
      searchProperties: ['tagName'],
      cascadeParams: {
        filters: [
          { fieldName: 'moduleId', operator: 'EQ', value: form.getFieldValue('moduleId') || '' },
        ],
      },
      afterSelect: item => {
        this.setState({ tagId: get(item, 'id') }, this.handlerTagContent);
      },
      placeholder: '请先选择要发版的模块',
      reader: {
        name: 'tagName',
        description: 'branch',
      },
    };
    return (
      <ExtModal
        maskClosable={false}
        centered
        destroyOnClose
        visible={showModal}
        onCancel={this.closeFormModal}
        wrapClassName={styles['form-box']}
        bodyStyle={{ paddingBottom: 0 }}
        title={this.renderTitle()}
        footer={null}
      >
        {dataLoading ? (
          <ListLoader />
        ) : (
          <Layout className="auto-height">
            <Sider width={300} className="auto-height form-box" theme="light">
              <ScrollBar>
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
                    })(
                      <Input autoComplete="off" placeholder="请输入发版主题" disabled={onlyView} />,
                    )}
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
                    })(<ComboList {...appProps} disabled={onlyView} />)}
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
                    })(<ComboList {...moduleProps} disabled={onlyView} />)}
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
                    })(<ComboList {...tagProps} disabled={onlyView} />)}
                  </FormItem>
                </Form>
              </ScrollBar>
            </Sider>
            <Content className="auto-height main-content" style={{ paddingLeft: 8 }}>
              <Row className="auto-height" gutter={4}>
                <Col span={tagId ? 12 : 0} className="auto-height tag-content-box">
                  <QueueAnim
                    className="auto-height"
                    key="tag-content-anim"
                    delay={200}
                    animConfig={[
                      { opacity: [1, 0], scale: [1, 0] },
                      { opacity: [1, 0], scale: [1, 0] },
                    ]}
                  >
                    {tagId ? (
                      <Card
                        bordered={false}
                        key="tag-content"
                        className="tag-content"
                        title={`标签描述${tagId ? `(${get(tagContent, 'tagName')})` : ''}`}
                      >
                        <MdEditorView
                          key="tag-content-md"
                          expanding={loadingTagContent}
                          message={
                            get(tagContent, 'message') || '<span style="color:#999">暂无数据</span>'
                          }
                        />
                      </Card>
                    ) : null}
                  </QueueAnim>
                </Col>
                <Col span={tagId ? 12 : 24} className="auto-height">
                  <QueueAnim
                    className="auto-height"
                    key="mk-content-anim"
                    forcedReplay={!!tagId}
                    appear={false}
                    animConfig={[{ translateX: [0, 500] }, { translateX: [0, -500] }]}
                  >
                    <Card
                      key="mk-content-box"
                      bordered={false}
                      title="发版说明(Markdown)"
                      extra={this.renderFooterBtn()}
                    >
                      <MdEditor
                        key="mk-content"
                        ref={ref => (this.mdEditor = ref || undefined)}
                        style={{ height: '100%', width: '100%' }}
                        name={this.editorId}
                        value={remark || ''}
                        placeholder="请输入发版说明(例如：部署要求,脚本内容)"
                        renderHTML={text => this.renderHTML(text)}
                        onChange={this.handlerMdChannge}
                        config={{
                          view: {
                            menu: !onlyView,
                            md: !onlyView,
                            html: onlyView,
                          },
                          canView: { fullScreen: true, hideMenu: false },
                        }}
                      />
                    </Card>
                  </QueueAnim>
                </Col>
              </Row>
            </Content>
          </Layout>
        )}
      </ExtModal>
    );
  }
}

export default FormModal;
