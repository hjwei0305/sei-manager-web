import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'antd';
import { ExtModal, ScrollBar } from 'suid';
import { get } from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

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
      const { form, pRowData } = this.props;

      const { deployEnv } = form.getFieldsValue(['deployEnv']);

      form.setFieldsValue({
        name: `${deployEnv}_${pRowData.name}`,
      });
    }, 0);
  };

  render() {
    const { form, saving, visible, onCancel, rowData, pRowData } = this.props;
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
        confirmLoading={saving}
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
                {getFieldDecorator('jobId', {
                  initialValue: get(pRowData, 'id', ''),
                })(<Input />)}
              </FormItem>
              <FormItem label="任务项名称">
                {getFieldDecorator('name', {
                  initialValue: get(rowData, 'name', `dev_${pRowData.name}`),
                  rules: [
                    {
                      required: true,
                      message: '请输入任务项名称',
                    },
                  ],
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="部署环境">
                {getFieldDecorator('deployEnv', {
                  initialValue: get(rowData, 'deployEnv', 'dev'),
                  rules: [
                    {
                      required: true,
                      message: '请选择部署环境',
                    },
                  ],
                })(
                  <Select onChange={this.handleValueChange}>
                    <Option value="dev">开发</Option>
                    <Option value="test">测试</Option>
                    <Option value="prod">生产</Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem label="部署描述">
                {getFieldDecorator('description', {
                  initialValue: get(rowData, 'description', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入部署描述',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="部署脚本">
                {getFieldDecorator('deployScript', {
                  initialValue: get(rowData, 'deployScript', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入部署脚本',
                    },
                  ],
                })(<TextArea />)}
              </FormItem>
            </Form>
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
