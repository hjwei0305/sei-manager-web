import React, { PureComponent } from 'react';
import { get, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form, Input, Button, Row, Col, DatePicker } from 'antd';
import { ExtModal, ComboList, utils, ListLoader } from 'suid';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-textmate';
import { constants } from '../../../utils';
import styles from './FormModal.less';

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

@Form.create()
class FormModal extends PureComponent {
  static aceId;

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
  };

  constructor(props) {
    super(props);
    const { rowData } = props;
    const { remark = '' } = rowData || {};
    this.state = {
      remark,
    };
    this.aceId = getUUID();
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
        expCompleteTime: moment(params.expCompleteTime).format('YYYY-MM-DD HH:mm:00'),
      });
      if (approve) {
        saveToApprove(params);
      } else {
        save(params);
      }
    });
  };

  handlerAceChannge = remark => {
    this.setState({ remark });
  };

  disabledDate = current => {
    return current && current < moment().startOf('day');
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
    if (onlyView) {
      return (
        <Button type="primary" onClick={this.closeFormModal}>
          关闭
        </Button>
      );
    }
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
  };

  render() {
    const { remark } = this.state;
    const { form, rowData, showModal, onlyView, dataLoading } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改部署申请' : '新建部署申请';
    getFieldDecorator('envCode', { initialValue: get(rowData, 'envCode') });
    getFieldDecorator('appId', { initialValue: get(rowData, 'appId') });
    getFieldDecorator('gitId', { initialValue: get(rowData, 'gitId') });
    getFieldDecorator('moduleCode', { initialValue: get(rowData, 'moduleCode') });
    const envProps = {
      form,
      name: 'envName',
      store: {
        url: `${SERVER_PATH}/sei-manager/env/findAllUnfrozen`,
      },
      placeholder: '选择要部署到哪个环境',
      showSearch: false,
      pagination: false,
      field: ['envCode'],
      reader: {
        name: 'name',
        description: 'remark',
        field: ['code'],
      },
    };
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
      placeholder: '选择要部署的应用',
      afterSelect: () => {
        form.setFieldsValue({ moduleName: '', gitId: '', tagName: '' });
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
      placeholder: '请先选择要部署的应用',
      cascadeParams: {
        filters: [
          { fieldName: 'frozen', operator: 'EQ', value: false },
          { fieldName: 'appId', operator: 'EQ', value: form.getFieldValue('appId') || null },
        ],
      },
      afterSelect: () => {
        form.setFieldsValue({ tagName: '' });
      },
      remotePaging: true,
      field: ['gitId', 'moduleCode'],
      reader: {
        name: 'name',
        description: 'remark',
        field: ['gitId', 'code'],
      },
    };
    const tagProps = {
      form,
      name: 'tagName',
      store: {
        url: `${SERVER_PATH}/sei-manager/appModule/getTags`,
      },
      cascadeParams: {
        gitId: form.getFieldValue('gitId') || '',
      },
      placeholder: '请先选择要部署的模块',
      reader: {
        name: 'name',
        description: 'message',
      },
    };
    const expCompleteTime = get(rowData, 'expCompleteTime');
    const modalTitle = onlyView || dataLoading ? '部署详情' : title;
    return (
      <ExtModal
        maskClosable={false}
        centered
        destroyOnClose
        width={860}
        visible={showModal}
        onCancel={this.closeFormModal}
        wrapClassName={styles['form-box']}
        bodyStyle={{ paddingBottom: 0 }}
        title={modalTitle}
        footer={this.renderFooterBtn()}
      >
        {dataLoading ? (
          <ListLoader />
        ) : (
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
                      })(<Input placeholder="请输入部署主题" disabled={onlyView} />)}
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
                      })(<ComboList {...envProps} disabled={onlyView} />)}
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
                      {getFieldDecorator('tagName', {
                        initialValue: get(rowData, 'tagName'),
                        rules: [
                          {
                            required: true,
                            message: '标签名称不能为空',
                          },
                        ],
                      })(<ComboList {...tagProps} disabled={onlyView} />)}
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
                          disabledDate={this.disabledDate}
                          style={{ width: '100%' }}
                          showTime={{ format: 'HH:mm' }}
                          format="YYYY-MM-DD HH:mm:00"
                          disabled={onlyView}
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
                    onChange={this.handlerAceChannge}
                    showPrintMargin={false}
                    showGutter={false}
                    readOnly={onlyView}
                    highlightActiveLine
                    width="100%"
                    height="526px"
                    value={remark}
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
