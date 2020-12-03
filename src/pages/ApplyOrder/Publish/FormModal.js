import React, { PureComponent } from 'react';
import { get, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form, Input, Button, Row, Col, DatePicker } from 'antd';
import { ExtModal, ComboList, utils, ScrollBar } from 'suid';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-mysql';
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

  renderFooterBtn = () => {
    const { saving, closeFormModal, saveToApproving, onlyView } = this.props;
    if (onlyView) {
      return (
        <Button type="primary" onClick={closeFormModal}>
          关闭
        </Button>
      );
    }
    return (
      <>
        <Button disabled={saving || saveToApproving} onClick={closeFormModal}>
          取消
        </Button>
        <Button
          disabled={saveToApproving}
          loading={saving}
          onClick={() => this.handlerFormSubmit()}
        >
          仅保存
        </Button>
        <Button
          disabled={saving}
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
    const { form, rowData, showModal, closeFormModal, onlyView } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改发布申请' : '新建发布申请';
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
      placeholder: '选择要发布到哪个环境',
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
      placeholder: '选择要发布的应用',
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
      placeholder: '请先选择要发布的应用',
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
      placeholder: '请先选择要发布的模块',
      reader: {
        name: 'name',
        description: 'message',
      },
    };
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
        title={onlyView ? '发布详情' : title}
        footer={this.renderFooterBtn()}
      >
        <Row gutter={8}>
          <Col span={10}>
            <div className="item-box">
              <div className="form-body">
                <ScrollBar>
                  <Form {...formItemLayout} layout="horizontal">
                    <FormItem label="发布主题">
                      {getFieldDecorator('name', {
                        initialValue: get(rowData, 'name'),
                        rules: [
                          {
                            required: true,
                            message: '发布主题不能为空',
                          },
                        ],
                      })(<Input placeholder="请输入发布主题" disabled={onlyView} />)}
                    </FormItem>
                    <FormItem label="发布环境">
                      {getFieldDecorator('envName', {
                        initialValue: get(rowData, 'envName'),
                        rules: [
                          {
                            required: true,
                            message: '发布环境不能为空',
                          },
                        ],
                      })(<ComboList {...envProps} disabled={onlyView} />)}
                    </FormItem>
                    <FormItem label="发布应用">
                      {getFieldDecorator('appName', {
                        initialValue: get(rowData, 'appName'),
                        rules: [
                          {
                            required: true,
                            message: '发布应用不能为空',
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
                        initialValue: get(rowData, 'expCompleteTime'),
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
                </ScrollBar>
              </div>
            </div>
          </Col>
          <Col span={14}>
            <div className="item-box">
              <div className="item-label">发布说明</div>
              <div className="item-body">
                <AceEditor
                  style={{ marginBottom: 24 }}
                  mode="mysql"
                  theme="textmate"
                  placeholder="请输入发布说明(例如：部署要求,脚本内容)"
                  name={this.aceId}
                  fontSize={16}
                  onChange={this.handlerAceChannge}
                  showPrintMargin={false}
                  showGutter={false}
                  highlightActiveLine
                  width="100%"
                  height="100%"
                  value={remark}
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
      </ExtModal>
    );
  }
}

export default FormModal;
