import React, { PureComponent } from 'react';
import { get, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import { Form, Input, Button, Radio, Alert } from 'antd';
import { ExtModal, ComboList, message, ExtIcon } from 'suid';
import { constants } from '../../../utils';

const { TextArea } = Input;
const FormItem = Form.Item;
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
    this.state = {
      moduleType: get(rowData, 'nameSpace') ? 'java' : 'web',
    };
  }

  componentDidUpdate(preProps) {
    const { rowData } = this.props;
    if (!isEqual(preProps.rowData, rowData)) {
      this.setState({ moduleType: get(rowData, 'nameSpace') ? 'java' : 'web' });
    }
  }

  handlerFormSubmit = approve => {
    const { form, save, rowData, saveToApprove } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      if (approve) {
        saveToApprove(params);
      } else {
        save(params);
      }
    });
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

  handlerModuleTypeChange = e => {
    const { form } = this.props;
    const moduleType = e.target.value;
    if (moduleType === 'web') {
      form.setFieldsValue({ nameSpace: '' });
    }
    this.setState({ moduleType });
  };

  handlerCopy = text => {
    copy(text);
    message.success(`已复制到粘贴板`);
  };

  renderGitAddress = () => {
    const { rowData } = this.props;
    const gitUrl = get(rowData, 'gitHttpUrl');
    if (gitUrl) {
      return (
        <>
          Git地址
          <ExtIcon
            type="copy"
            className="copy-btn"
            antd
            style={{ marginTop: 4 }}
            tooltip={{ title: '复制Git地址到粘贴板' }}
            onClick={() => this.handlerCopy(gitUrl)}
          />
        </>
      );
    }
    return ' Git地址';
  };

  validateMoudleCode = (rule, value, callback) => {
    const reg = /^[a-z][a-z-]*[a-z][0-9]*$/;
    if (value && !reg.test(value)) {
      callback('代码不规范!');
    }
    callback();
  };

  render() {
    const { moduleType } = this.state;
    const { form, rowData, showModal, closeFormModal, onlyView } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改模块申请' : '新建模块申请';
    getFieldDecorator('appId', { initialValue: get(rowData, 'appId') });
    const appProps = {
      form,
      name: 'appName',
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/application/findByPageNoAuth`,
        params: {
          filters: [{ fieldName: 'frozen', operator: 'EQ', value: false }],
        },
      },
      afterSelect: item => {
        form.setFieldsValue({ version: `${item.version}.0.0` });
      },
      remotePaging: true,
      field: ['appId'],
      reader: {
        name: 'name',
        description: 'code',
        field: ['id'],
      },
    };
    return (
      <ExtModal
        maskClosable={false}
        centered
        destroyOnClose
        width={580}
        visible={showModal}
        onCancel={closeFormModal}
        bodyStyle={{ padding: 0 }}
        title={onlyView ? '模块详情' : title}
        footer={this.renderFooterBtn()}
      >
        <Alert message="提示:模块代码一旦创建后不能修改" banner />
        <Form {...formItemLayout} layout="horizontal" style={{ margin: '8px 24px' }}>
          <FormItem label="所属应用">
            {getFieldDecorator('appName', {
              initialValue: get(rowData, 'appName'),
              rules: [
                {
                  required: true,
                  message: '所属应用不能为空',
                },
              ],
            })(<ComboList {...appProps} disabled={onlyView} />)}
          </FormItem>
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator('moduleType', {
              initialValue: moduleType,
              rules: [
                {
                  required: true,
                  message: '模块类型不能为空',
                },
              ],
            })(
              <Radio.Group onChange={this.handlerModuleTypeChange} disabled={onlyView} size="small">
                <Radio.Button key="web" value="web">
                  前端模块
                </Radio.Button>
                <Radio.Button key="java" value="java">
                  后端模块
                </Radio.Button>
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem label="模块代码">
            {getFieldDecorator('code', {
              initialValue: get(rowData, 'code'),
              rules: [
                {
                  required: true,
                  message: '模块代码不能为空',
                },
                {
                  validator: this.validateMoudleCode,
                },
              ],
            })(<Input placeholder="规则：字母小写或中横线" disabled={!!rowData || onlyView} />)}
          </FormItem>
          <FormItem label="模块名称">
            {getFieldDecorator('name', {
              initialValue: get(rowData, 'name'),
              rules: [
                {
                  required: true,
                  message: '模块名称不能为空',
                },
              ],
            })(<Input disabled={onlyView} />)}
          </FormItem>
          <FormItem label="模块版本">
            {getFieldDecorator('version', {
              initialValue: get(rowData, 'version'),
              rules: [
                {
                  required: true,
                  message: '模块版本不能为空',
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="模块描述">
            {getFieldDecorator('remark', {
              initialValue: get(rowData, 'remark'),
              rules: [
                {
                  required: true,
                  message: '模块描述不能为空',
                },
              ],
            })(<TextArea style={{ resize: 'none' }} rows={3} disabled={onlyView} />)}
          </FormItem>
          <FormItem label="命名空间(包路径)">
            {getFieldDecorator('nameSpace', {
              initialValue: get(rowData, 'nameSpace'),
              rules: [
                {
                  required: moduleType === 'java',
                  message: '命名空间(包路径)不能为空',
                },
              ],
            })(<Input disabled={onlyView || moduleType === 'web'} />)}
          </FormItem>
          {onlyView ? (
            <>
              <FormItem label={this.renderGitAddress()}>
                {getFieldDecorator('gitHttpUrl', {
                  initialValue: get(rowData, 'gitHttpUrl'),
                })(<Input disabled />)}
              </FormItem>
            </>
          ) : null}
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
