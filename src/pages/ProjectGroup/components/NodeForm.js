import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { Button, Form, Input, Popconfirm, Alert } from 'antd';
import { ScrollBar, ExtIcon, BannerTitle, ComboList } from 'suid';
import { constants } from '@/utils';
import styles from './NodeForm.less';

const { SERVER_PATH } = constants;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

@Form.create({
  mapPropsToFields: props => {
    const { editData } = props;
    return {
      name: Form.createFormField({
        value: editData.name,
      }),
      remark: Form.createFormField({
        value: editData.remark,
      }),
    };
  },
})
class NodeForm extends PureComponent {
  onFormSubmit = e => {
    e.stopPropagation();
    const { form, editData, saveProjectGroup } = this.props;
    form.validateFields({ force: true }, (err, formData) => {
      if (err) {
        return false;
      }
      const params = { ...editData };
      Object.assign(params, formData);
      saveProjectGroup(params);
    });
  };

  handlerDelete = (e, id) => {
    e.stopPropagation();
    const { deleteProjectGroup } = this.props;
    deleteProjectGroup(id);
  };

  handlerAddChild = (e, editData) => {
    e.stopPropagation();
    const { addChild } = this.props;
    addChild(editData);
  };

  handlerGoBackParent = e => {
    e.stopPropagation();
    const { goBackToChildParent } = this.props;
    goBackToChildParent();
  };

  renderPopconfirmTitle = (title, subTitle) => {
    return (
      <>
        <span style={{ fontWeight: 700, marginBottom: 8, display: 'inline-block' }}>{title}</span>
        <br />
        {subTitle}
      </>
    );
  };

  getExtAction = () => {
    const { editData, loading } = this.props;
    const deleting = loading.effects['projectGroup/del'];
    const saving = loading.effects['projectGroup/save'];
    if (editData && editData.id) {
      return (
        <>
          <Button disabled={saving || deleting} onClick={e => this.handlerAddChild(e, editData)}>
            新建子项目
          </Button>
          <Popconfirm
            overlayClassName={cls(styles['pop-confirm-box'])}
            title={this.renderPopconfirmTitle('确定要删除吗？', '提示：删除后不能恢复')}
            placement="top"
            icon={<ExtIcon type="question-circle" antd />}
            onConfirm={e => this.handlerDelete(e, editData.id)}
          >
            <Button type="danger" disabled={saving} ghost loading={deleting}>
              删除
            </Button>
          </Popconfirm>
        </>
      );
    }
    return (
      <Popconfirm
        disabled={saving || deleting}
        overlayClassName={cls(styles['pop-confirm-box'])}
        title={this.renderPopconfirmTitle('确定要返回吗？', '提示：未保存的数据将会丢失')}
        placement="top"
        icon={<ExtIcon type="question-circle" antd />}
        onConfirm={e => this.handlerGoBackParent(e)}
      >
        <Button disabled={saving || deleting}>返回</Button>
      </Popconfirm>
    );
  };

  getFormTitle = () => {
    const { editData } = this.props;
    let title = '';
    let subTitle = '';
    if (editData.parentId) {
      if (editData.id) {
        title = editData.name;
        subTitle = '编辑';
      } else {
        title = editData.parentName;
        subTitle = '新建子项目';
      }
    } else if (editData.id) {
      title = editData.name;
      subTitle = '编辑';
    } else {
      title = '新建';
    }
    return <BannerTitle title={title} subTitle={subTitle} />;
  };

  validateName = (rule, value, callback) => {
    const reg = /^(?!-)[A-Z0-9-](?!.*-$)/;
    if (value && !reg.test(value)) {
      callback('项目组名不规范!');
    }
    callback();
  };

  render() {
    const { form, loading, editData } = this.props;
    const { getFieldDecorator } = form;
    const title = this.getFormTitle();
    const saving = loading.effects['projectGroup/save'];
    const deleting = loading.effects['projectGroup/del'];
    getFieldDecorator('managerAccount', { initialValue: get(editData, 'managerAccount') });
    const adminProps = {
      form,
      name: 'managerAccountName',
      remotePaging: true,
      field: ['managerAccount'],
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/user/findByPage`,
      },
      placeholder: '选择项目管理员',
      searchProperties: ['userName', 'account'],
      reader: {
        name: 'userName',
        description: 'account',
        field: ['account'],
      },
    };
    return (
      <div key="node-form" className={cls(styles['node-form'])}>
        <div className="base-view-body">
          <div className="header">{title}</div>
          <div className="tool-bar-box">
            <div className="tool-action-box">
              <Button
                type="primary"
                loading={saving}
                disabled={deleting}
                onClick={e => this.onFormSubmit(e)}
              >
                保存
              </Button>
              {this.getExtAction()}
            </div>
            <div className="tool-right-box" />
          </div>
          <div className="form-box">
            <ScrollBar>
              {!editData || !editData.id ? (
                <Alert type="warning" message="项目组名一旦创建就不能修改" banner />
              ) : null}
              <Form {...formItemLayout} className="form-body" layout="vertical">
                <FormItem
                  label="项目组名"
                  extra={
                    <span style={{ fontSize: 12 }}>
                      只能是字母或字母与中横线组成,且不能以中横线开头和结尾
                    </span>
                  }
                >
                  {getFieldDecorator('name', {
                    initialValue: get(editData, 'name'),
                    rules: [
                      {
                        required: true,
                        message: '项目组名不能为空',
                      },
                      {
                        validator: this.validateName,
                      },
                    ],
                  })(<Input disabled={!editData || !!editData.id} autoComplete="off" />)}
                </FormItem>
                <FormItem label="项目组标题">
                  {getFieldDecorator('remark', {
                    initialValue: get(editData, 'remark'),
                    rules: [
                      {
                        required: true,
                        message: '项目组标题不能为空',
                      },
                    ],
                  })(<Input autoComplete="off" />)}
                </FormItem>
                <FormItem label="项目组管理员" wrapperCol={{ span: 12 }}>
                  {getFieldDecorator('managerAccountName', {
                    initialValue: get(editData, 'managerAccountName'),
                    rules: [
                      {
                        required: true,
                        message: '项目组管理员不能为空',
                      },
                    ],
                  })(<ComboList {...adminProps} />)}
                </FormItem>
              </Form>
            </ScrollBar>
          </div>
        </div>
      </div>
    );
  }
}

export default NodeForm;
