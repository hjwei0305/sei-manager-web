import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Switch, Row, Col, Divider } from 'antd';
import { ExtModal } from 'suid';

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
      if (onSave) {
        onSave(params);
      }
    });
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
        width={600}
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <Row>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="代码">
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
            </Col>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="名称">
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
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="长度">
                {getFieldDecorator('dataLength', {
                  initialValue: editData && editData.dataLength,
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="精度">
                {getFieldDecorator('precision', {
                  initialValue: editData && editData.precision,
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="java类型">
                {getFieldDecorator('javaType', {
                  initialValue: editData && editData.javaType,
                  rules: [
                    {
                      required: true,
                      message: 'java类型不能为空',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="冻结">
                {getFieldDecorator('frozen', {
                  valuePropName: 'checked',
                  initialValue: editData && editData.frozen,
                })(<Switch />)}
              </FormItem>
            </Col>
          </Row>
          <Divider orientation="left">数据库对应类型</Divider>
          <Row>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="mysql类型">
                {getFieldDecorator('mysqlType', {
                  initialValue: editData && editData.mysqlType,
                  rules: [
                    {
                      required: true,
                      message: 'mysql类型不能为空',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="postgre类型">
                {getFieldDecorator('postgreType', {
                  initialValue: editData && editData.postgreType,
                  rules: [
                    {
                      required: true,
                      message: 'postgre类型不能为空',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="oracle类型">
                {getFieldDecorator('oracleType', {
                  initialValue: editData && editData.oracleType,
                  rules: [
                    {
                      required: true,
                      message: 'oracle类型不能为空',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="mssql类型">
                {getFieldDecorator('mssqlType', {
                  initialValue: editData && editData.mssqlType,
                  rules: [
                    {
                      required: true,
                      message: 'mssql类型不能为空',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>

          <FormItem label="备注">
            {getFieldDecorator('remark', {
              initialValue: editData && editData.remark,
            })(<Input.TextArea />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
