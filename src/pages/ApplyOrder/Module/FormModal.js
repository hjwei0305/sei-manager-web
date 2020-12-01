import React, { PureComponent } from 'react';
import { get, trim, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { Form, Input, Button, Radio } from 'antd';
import { ExtModal, ComboList, MoneyInput } from 'suid';
import { constants } from '../../../utils';
import styles from './FormModal.less';

const { TextArea } = Input;
const FormItem = Form.Item;
const { SERVER_PATH } = constants;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const getVersion = rowData => {
  let moduleCode = '';
  let appVersion = '0';
  if (rowData) {
    const version = get(rowData, 'version') || '';
    const vers = version.split('.');
    if (vers.length === 2) {
      [appVersion, moduleCode] = vers;
    }
  }
  return [appVersion, moduleCode];
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
    const [appVersion] = getVersion(rowData);
    this.state = {
      appVersion,
      moduleType: get(rowData, 'nameSpace') ? 'java' : 'web',
    };
  }

  componentDidUpdate(preProps) {
    const { rowData } = this.props;
    if (!isEqual(preProps.rowData, rowData)) {
      const [appVersion] = getVersion(rowData);
      this.setState({ appVersion, moduleType: get(rowData, 'nameSpace') ? 'java' : 'web' });
    }
  }

  handlerFormSubmit = approve => {
    const { form, save, rowData, saveToApprove } = this.props;
    const { appVersion } = this.state;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      Object.assign(params, { version: `${appVersion}.${trim(params.version)}` });
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
    this.setState({ moduleType: e.target.value });
  };

  render() {
    const { appVersion, moduleType } = this.state;
    const { form, rowData, showModal, closeFormModal, onlyView } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改模块申请' : '新建模块申请';
    getFieldDecorator('appId', { initialValue: get(rowData, 'appId') });
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
      afterSelect: item => {
        this.setState({ appVersion: item.version });
      },
      remotePaging: true,
      field: ['appId'],
      reader: {
        name: 'name',
        description: 'remark',
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
        wrapClassName={styles['form-box']}
        onCancel={closeFormModal}
        bodyStyle={{ paddingBottom: 0 }}
        title={onlyView ? '模块详情' : title}
        footer={this.renderFooterBtn()}
      >
        <Form {...formItemLayout} layout="horizontal">
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
          <FormItem label="模块类型">
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
              ],
            })(<Input disabled={onlyView} />)}
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
              initialValue: getVersion(rowData)[1],
              rules: [
                {
                  required: true,
                  message: '	模块版本不能为空',
                },
              ],
            })(
              <MoneyInput
                disabled={onlyView}
                textAlign="left"
                thousand={false}
                precision={0}
                prefix={`${appVersion}.`}
              />,
            )}
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
          {moduleType === 'java' ? (
            <FormItem label="命名空间(包路径)">
              {getFieldDecorator('nameSpace', {
                initialValue: get(rowData, 'nameSpace'),
                rules: [
                  {
                    required: true,
                    message: '命名空间(包路径)不能为空',
                  },
                ],
              })(<Input disabled={onlyView} />)}
            </FormItem>
          ) : null}
          {onlyView ? (
            <>
              <FormItem label="Git地址">
                {getFieldDecorator('gitUrl', {
                  initialValue: get(rowData, 'gitUrl'),
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
