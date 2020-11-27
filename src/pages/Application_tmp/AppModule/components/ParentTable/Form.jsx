import React, { PureComponent } from 'react';
import { Form, Input, Checkbox } from 'antd';

const FormItem = Form.Item;

@Form.create({ name: 'app' })
class AppForm extends PureComponent {
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  onFormSubmit = () => {
    const { form } = this.props;
    return new Promise((resolve, reject) => {
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          resolve(values);
        }
        reject(err);
      });
    });
  };

  render() {
    const { form, isSaving, rowData, onTypeChange } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const { id, code, name } = rowData || {};

    return (
      <Form style={{ padding: '0 10px' }} {...formItemLayout} layout="inline">
        <FormItem style={{ display: 'none' }}>
          {getFieldDecorator('id', {
            initialValue: id,
          })(<Input />)}
        </FormItem>
        <FormItem label="应用代码">
          {getFieldDecorator('code', {
            initialValue: code,
            rules: [
              {
                required: true,
                message: '请输入应用代码',
              },
            ],
          })(<Input disabled={!!rowData || isSaving} />)}
        </FormItem>
        <FormItem label="应用名称">
          {getFieldDecorator('name', {
            initialValue: name,
            rules: [
              {
                required: true,
                message: '请输入应用名称',
              },
            ],
          })(<Input disabled={isSaving} />)}
        </FormItem>
        <FormItem label="项目类型">
          {getFieldDecorator('type', {
            initialValue: ['web', 'java'],
          })(
            <Checkbox.Group
              options={[
                {
                  label: '前端',
                  value: 'web',
                },
                {
                  label: '后端',
                  value: 'java',
                },
              ]}
              onChange={onTypeChange}
            />,
          )}
        </FormItem>
      </Form>
    );
  }
}

export default AppForm;
