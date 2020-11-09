import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Switch, Row, Col } from 'antd';
import { ExtModal, ComboGrid } from 'suid';
import { constants } from '@/utils';

const { MDMSCONTEXT } = constants;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const colFormItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
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

  getElementComboGridProps = () => {
    const { form } = this.props;

    return {
      form,
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/elementLibrary/findByPage`,
      },
      columns: [
        {
          title: '代码',
          width: 120,
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
        field: ['code', 'name', 'dataType', 'precision', 'dataLength', 'dataTypeDesc'],
      },
      field: ['fieldName', 'remark', 'dataType', 'precision', 'dataLength', 'dataTypeDesc'],
      remotePaging: true,
    };
  };

  getDsComboGridProps = () => {
    const { form } = this.props;

    return {
      form,
      name: 'dataTypeDesc',
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/dataType/findByPage`,
      },
      columns: [
        {
          title: '代码',
          width: 120,
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
        field: ['code', 'precision', 'dataLength', 'dataTypeDesc'],
      },
      field: ['dataType', 'precision', 'dataLength', 'dataTypeDesc'],
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
          <FormItem label="模型Id" style={{ display: 'none' }}>
            {getFieldDecorator('dataModelId', {
              initialValue: parentData && parentData.id,
            })(<Input />)}
          </FormItem>
          <FormItem label="参考元素">
            {getFieldDecorator('refEle', {
              initialValue: '',
            })(<ComboGrid {...this.getElementComboGridProps()} />)}
          </FormItem>
          <FormItem label="字段名称">
            {getFieldDecorator('fieldName', {
              initialValue: editData && editData.fieldName,
              rules: [
                {
                  required: true,
                  message: '字段名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="字段描述">
            {getFieldDecorator('remark', {
              initialValue: editData && editData.remark,
              rules: [
                {
                  required: true,
                  message: '字段描述不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem label="类型代码" {...colFormItemLayout}>
                {getFieldDecorator('dataType', {
                  initialValue: editData && editData.dataType,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="类型名称" {...colFormItemLayout}>
                {getFieldDecorator('dataTypeDesc', {
                  initialValue: editData && editData.dataTypeDesc,
                  rules: [
                    {
                      required: true,
                      message: '数据类型不能为空',
                    },
                  ],
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="长度" {...colFormItemLayout}>
                {getFieldDecorator('dataLength', {
                  initialValue: editData && editData.dataLength,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="精度" {...colFormItemLayout}>
                {getFieldDecorator('precision', {
                  initialValue: editData && editData.precision,
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="是否不为空" {...colFormItemLayout}>
                {getFieldDecorator('notNull', {
                  valuePropName: 'checked',
                  initialValue: editData && editData.notNull,
                })(<Switch />)}
              </FormItem>
            </Col>
            <Col span={12}>
              {form.getFieldValue('notNull') ? (
                <FormItem label="默认值" {...colFormItemLayout}>
                  {getFieldDecorator('defaultValue', {
                    initialValue: editData && editData.defaultValue,
                  })(<Input />)}
                </FormItem>
              ) : null}
            </Col>
          </Row>
          <FormItem label="是否是主键">
            {getFieldDecorator('primaryKey', {
              valuePropName: 'checked',
              initialValue: editData && editData.primaryKey,
            })(<Switch />)}
          </FormItem>
          <FormItem label="排序">
            {getFieldDecorator('rank', {
              initialValue: editData ? editData.rank : 0,
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
