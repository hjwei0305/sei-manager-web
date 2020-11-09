import React, { PureComponent } from 'react';
import { Form, Input, Checkbox, InputNumber } from 'antd';
import { connect } from 'dva';
import { ScrollBar } from 'suid';

const FormItem = Form.Item;

@connect(({ dataModelManager }) => ({ dataModelManager }))
@Form.create()
class FormItems extends PureComponent {
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  onFormSubmit = () => {
    const { form, parentData, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = editData || {};
      if (parentData) {
        Object.assign(params, { parentId: parentData.id });
      }

      Object.assign(params, formData);
      this.save(params);
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelManager/saveTreeNode',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'dataModelManager/queryTree',
        });
        dispatch({
          type: 'dataModelManager/updateState',
          payload: {
            showCreateModal: false,
          },
        });
      }
    });
  };

  render() {
    const { form, parentData, editData } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };

    const { code = '', name = '', rank = '', frozen = false, remark = '' } = editData || {};

    return (
      <ScrollBar>
        <Form {...formItemLayout} layout="horizontal">
          {parentData && parentData.name ? (
            <FormItem label="父亲节点">
              {getFieldDecorator('parentName', {
                initialValue: parentData.name,
              })(<Input disabled />)}
            </FormItem>
          ) : null}

          <FormItem label="代码">
            {getFieldDecorator('code', {
              initialValue: code,
              rules: [
                {
                  required: true,
                  message: '代码不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="名称">
            {getFieldDecorator('name', {
              initialValue: name,
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
              initialValue: remark,
            })(<Input.TextArea />)}
          </FormItem>
          <FormItem label="排序">
            {getFieldDecorator('rank', {
              initialValue: rank,
              rules: [
                {
                  required: true,
                  message: '序号不能为空',
                },
              ],
            })(<InputNumber style={{ width: '100%' }} precision={0} />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              valuePropName: 'checked',
              initialValue: frozen,
            })(<Checkbox />)}
          </FormItem>
        </Form>
      </ScrollBar>
    );
  }
}

export default FormItems;
