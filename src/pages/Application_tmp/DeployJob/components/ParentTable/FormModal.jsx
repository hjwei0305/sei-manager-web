import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { ExtModal, ScrollBar } from 'suid';
import { get } from 'lodash';

const FormItem = Form.Item;

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

  render() {
    const { form, isSaving, visible, onCancel, rowData } = this.props;
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
              <FormItem label="名称">
                {getFieldDecorator('name', {
                  initialValue: get(rowData, 'name', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入任务名称',
                    },
                  ],
                })(<Input disabled={!!isSaving} />)}
              </FormItem>
              <FormItem label="描述">
                {getFieldDecorator('description', {
                  initialValue: get(rowData, 'description', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入任务描述',
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
