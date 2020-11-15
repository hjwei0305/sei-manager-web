import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'antd';
import { ExtModal, ScrollBar } from 'suid';
import { get } from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class FormModal extends PureComponent {
  onFormSubmit = () => {
    const { form, onSave } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onSave) {
        onSave(formData);
      }
    });
  };

  handleValueChange = () => {
    setTimeout(() => {
      const { form } = this.props;

      const { versionType, version } = form.getFieldsValue(['versionType', 'version']);

      form.setFieldsValue({
        name: `${version}-${versionType}`,
      });
    }, 0);
  };

  render() {
    const { form, isSaving, visible, onCancel, rowData, pRowData } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const title = rowData ? '编辑' : '新建';
    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        confirmLoading={isSaving}
        title={title}
        onOk={() => {
          this.onFormSubmit();
        }}
        width={550}
        okText="保存"
      >
        <div>
          <ScrollBar>
            <Form style={{ padding: '0 10px' }} {...formItemLayout} layout="horizontal">
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('id', {
                  initialValue: get(rowData, 'id', ''),
                })(<Input />)}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('projectId', {
                  initialValue: get(pRowData, 'id', ''),
                })(<Input />)}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('gitId', {
                  initialValue: get(pRowData, 'gitId', ''),
                })(<Input />)}
              </FormItem>
              <FormItem label="参考分支">
                {getFieldDecorator('refBranch', {
                  initialValue: get(rowData, 'refBranch', 'master'),
                  rules: [
                    {
                      required: true,
                      message: '请选择参考分支',
                    },
                  ],
                })(
                  <Select disabled={!!isSaving} placeholder="选择参考分支">
                    <Option value="master">master</Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem label="版本类别">
                {getFieldDecorator('versionType', {
                  initialValue: get(rowData, 'versionType', 'beta'),
                  rules: [
                    {
                      required: true,
                      message: '请选择版本类别',
                    },
                  ],
                })(
                  <Select
                    disabled={!!isSaving}
                    placeholder="选择版本类别"
                    onChange={this.handleValueChange}
                  >
                    <Option value="beta">beta</Option>
                    <Option value="release">release</Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem label="版本号">
                {getFieldDecorator('version', {
                  initialValue: get(rowData, 'version', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入版本号',
                    },
                  ],
                })(<Input disabled={!!isSaving} onChange={this.handleValueChange} />)}
              </FormItem>
              <FormItem label="标签名称">
                {getFieldDecorator('name', {
                  initialValue: get(rowData, 'name', 'bata'),
                  rules: [
                    {
                      required: true,
                      message: '请输入标签名称',
                    },
                  ],
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="标签描述">
                {getFieldDecorator('description', {
                  initialValue: get(rowData, 'description', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入标签描述',
                    },
                  ],
                })(<Input disabled={!!isSaving} />)}
              </FormItem>
            </Form>
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
