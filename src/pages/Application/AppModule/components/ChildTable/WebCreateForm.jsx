import React from 'react';
import { Form, Input, Select } from 'antd';

import { connect } from 'dva';

const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

@connect(({ appModule, loading }) => ({ appModule, loading }))
@Form.create({ name: 'web' })
class WebCreateForm extends React.Component {
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
          Object.assign(values.tplFieldValues, {
            projectName: values.name,
            description: values.description,
          });
          const temp = values.groupId.split(' ');
          const [groupId, groupName] = temp;
          resolve(
            Object.assign(values, {
              groupId,
              groupName,
              refInitTemplate: values.type === 'web' ? 'sei-blank-app' : 'java_common_boilerplate',
            }),
          );
        }
        reject(err);
      });
    });
  };

  onSearch = val => {
    console.log('search:', val);
  };

  onChange = value => {
    console.log(`selected ${value}`);
  };

  onBlur = () => {
    console.log('blur');
  };

  onFocus = () => {
    console.log('focus');
  };

  getSelectOptions = () => {
    const { appModule } = this.props;
    const { groups } = appModule;
    return groups.map(item => {
      const { id, name, description } = item;
      return <Option key={id} value={`${id} ${name}`}>{`${name}(${description})`}</Option>;
    });
  };

  render() {
    const { form, loading } = this.props;
    const { getFieldDecorator } = form;
    const isLoading = loading.effects['appModule/initProject'];

    return (
      <Form {...formItemLayout}>
        <FormItem label="项目类型">
          {getFieldDecorator('type', {
            initialValue: 'web',
            rules: [
              {
                required: true,
                message: '请选择项目类型',
              },
            ],
          })(
            <Select disabled placeholder="选择项目类型">
              <Option value="web">前端</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem label="项目名称">
          {getFieldDecorator('name', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '请输入项目名称',
              },
            ],
          })(<Input disabled={isLoading} />)}
        </FormItem>
        <FormItem label="项目描述">
          {getFieldDecorator('description', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '请输入项目描述',
              },
            ],
          })(<Input disabled={isLoading} />)}
        </FormItem>
        <FormItem label="仓库分组">
          {getFieldDecorator('groupId', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '请选择仓库分组',
              },
            ],
          })(
            <Select
              showSearch
              placeholder="选择仓库分组"
              optionFilterProp="children"
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onSearch={this.onSearch}
              disabled={isLoading}
            >
              {this.getSelectOptions()}
            </Select>,
          )}
        </FormItem>
        <FormItem label="项目名称" hidden>
          {getFieldDecorator('tplFieldValues.projectName', {
            initialValue: '',
          })(<Input disabled={isLoading} />)}
        </FormItem>
        <FormItem label="项目描述" hidden>
          {getFieldDecorator('tplFieldValues.description', {
            initialValue: '',
          })(<Input disabled={isLoading} />)}
        </FormItem>
        <FormItem label="版本" hidden>
          {getFieldDecorator('tplFieldValues.version', {
            initialValue: '1.0.0',
          })(<Input disabled={isLoading} />)}
        </FormItem>
      </Form>
    );
  }
}

export default WebCreateForm;
