import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'antd';
import { ExtModal, ScrollBar, ComboList } from 'suid';
import { get } from 'lodash';
import { constants } from '@/utils';

const { CI_SERVER_PATH } = constants;
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

  getComboListProps = () => {
    const { form } = this.props;

    return {
      form,
      name: 'jobName',
      field: ['jobId'],
      showSearch: false,
      store: {
        type: 'POST',
        url: `${CI_SERVER_PATH}/deploy/findAll`,
      },
      reader: {
        name: 'name',
        field: ['id'],
      },
    };
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
              <FormItem label="项目名称">
                {getFieldDecorator('name', {
                  initialValue: get(rowData, 'name', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入项目名称',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="项目类型">
                {getFieldDecorator('type', {
                  initialValue: get(rowData, 'type', ''),
                  rules: [
                    {
                      required: true,
                      message: '请选择项目类型',
                    },
                  ],
                })(
                  <Select disabled={!!isSaving} placeholder="选择项目类型" allowClear>
                    <Option value="web">前端</Option>
                    <Option value="java">后端</Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem label="项目描述">
                {getFieldDecorator('description', {
                  initialValue: get(rowData, 'description', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入项目描述',
                    },
                  ],
                })(<Input disabled={!!isSaving} />)}
              </FormItem>
              <FormItem label="git项目Id">
                {getFieldDecorator('gitId', {
                  initialValue: get(rowData, 'gitId', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入git项目Id',
                    },
                  ],
                })(<Input disabled={!!isSaving} />)}
              </FormItem>
              <FormItem label="git项目地址">
                {getFieldDecorator('gitUrl', {
                  initialValue: get(rowData, 'gitUrl', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入git项目地址',
                    },
                  ],
                })(<Input disabled={!!isSaving} />)}
              </FormItem>
              <FormItem label="git分组id">
                {getFieldDecorator('groupId', {
                  initialValue: get(rowData, 'groupId', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入git分组id',
                    },
                  ],
                })(<Input disabled={!!isSaving} />)}
              </FormItem>
              <FormItem label="git分组名称">
                {getFieldDecorator('groupName', {
                  initialValue: get(rowData, 'groupName', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入git分组名称',
                    },
                  ],
                })(<Input disabled={!!isSaving} />)}
              </FormItem>
              <FormItem label="部署配置" hidden>
                {getFieldDecorator('jobId', {
                  initialValue: get(rowData, 'jobId', ''),
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="部署配置">
                {getFieldDecorator('jobName', {
                  initialValue: get(rowData, 'deployJob.name', ''),
                  rules: [
                    {
                      required: true,
                      message: '请输入部署配置',
                    },
                  ],
                })(<ComboList disabled={!!isSaving} {...this.getComboListProps()} />)}
              </FormItem>
            </Form>
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;