import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { ExtModal, ComboGrid } from 'suid';
import { constants } from '@/utils';

const { MDMSCONTEXT } = constants;
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
      onSave(params);
    });
  };

  getDsComboGridProps = () => {
    const { form } = this.props;

    return {
      form,
      name: 'dsName',
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/dataSource/findByPage`,
      },
      columns: [
        {
          title: '代码',
          width: 80,
          dataIndex: 'code',
        },
        {
          title: '描述',
          width: 200,
          dataIndex: 'remark',
        },
      ],
      rowKey: 'id',
      reader: {
        name: 'remark',
        field: ['id'],
      },
      field: ['dsId'],
      remotePaging: true,
    };
  };

  render() {
    const { form, editData, onClose, saving, visible, parentData } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新建';

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        okText="保存"
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="模型类型代码" style={{ display: 'none' }}>
            {getFieldDecorator('modelTypeCode', {
              initialValue: parentData && parentData.code,
            })(<Input disabled={!!parentData} />)}
          </FormItem>
          <FormItem label="模型类型">
            {getFieldDecorator('modelTypeName', {
              initialValue: parentData && parentData.name,
            })(<Input disabled={!!parentData} />)}
          </FormItem>
          <FormItem
            label="数据源Id"
            style={{
              display: 'none',
            }}
          >
            {getFieldDecorator('dsId', {
              initialValue: editData && editData.dsId,
            })(<Input />)}
          </FormItem>
          <FormItem label="数据源">
            {getFieldDecorator('dsName', {
              initialValue: editData && editData.dsName,
              rules: [
                {
                  required: true,
                  message: '数据源不能为空',
                },
              ],
            })(<ComboGrid {...this.getDsComboGridProps()} />)}
          </FormItem>
          <FormItem label="表名">
            {getFieldDecorator('tableName', {
              initialValue: editData ? editData.tableName : '',
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remark', {
              initialValue: editData ? editData.remark : '',
            })(<Input.TextArea />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
