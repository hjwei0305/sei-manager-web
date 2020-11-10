import React, { PureComponent } from 'react';
import { Form, Input, Switch } from 'antd';
import { ExtModal, ComboGrid } from 'suid';
import { constants } from '@/utils';

const { MANAGER_CONTEXT } = constants;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class FormModal extends PureComponent {
  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      if (onSave) {
        onSave(params);
      }
    });
  };

  getComboGridProps = () => {
    const { form } = this.props;
    return {
      form,
      name: 'dataTypeDesc',
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MANAGER_CONTEXT}/dataType/findByPage`,
      },
      columns: [
        {
          title: '代码',
          width: 80,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 200,
          dataIndex: 'name',
        },
        {
          title: '长度',
          width: 80,
          dataIndex: 'dataLength',
        },
        {
          title: '精度',
          width: 80,
          dataIndex: 'precision',
        },
      ],
      rowKey: 'id',
      reader: {
        name: 'name',
        field: ['code', 'precision', 'dataLength'],
      },
      field: ['dataType', 'precision', 'dataLength'],
      remotePaging: true,
    };
  };

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem
            label="精度"
            style={{
              display: 'none',
            }}
          >
            {getFieldDecorator('precision', {
              initialValue: editData && editData.precision,
            })(<Input />)}
          </FormItem>
          <FormItem
            label="长度"
            style={{
              display: 'none',
            }}
          >
            {getFieldDecorator('dataLength', {
              initialValue: editData && editData.dataLength,
            })(<Input />)}
          </FormItem>
          <FormItem label="代码">
            {getFieldDecorator('code', {
              initialValue: editData && editData.code,
              rules: [
                {
                  required: true,
                  message: '代码不能为空',
                },
              ],
            })(<Input disabled={!!editData} />)}
          </FormItem>
          <FormItem label="名称">
            {getFieldDecorator('name', {
              initialValue: editData && editData.name,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="数据类型代码" style={{ display: 'none' }}>
            {getFieldDecorator('dataType', {
              initialValue: editData && editData.dataType,
            })(<Input />)}
          </FormItem>
          <FormItem label="数据类型">
            {getFieldDecorator('dataTypeDesc', {
              initialValue: editData && editData.dataTypeDesc,
              rules: [
                {
                  required: true,
                  message: '数据类型不能为空',
                },
              ],
            })(<ComboGrid {...this.getComboGridProps()} />)}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remark', {
              initialValue: editData && editData.remark,
            })(<Input.TextArea />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              valuePropName: 'checked',
              initialValue: editData && editData.frozen,
            })(<Switch />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
