import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input, Popconfirm, InputNumber } from 'antd';
import { ScrollBar, ExtIcon, ComboGrid, BannerTitle } from 'suid';
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
      iconCls: Form.createFormField({
        value: editData.iconCls,
      }),
      rank: Form.createFormField({
        value: editData.rank,
      }),
    };
  },
})
class NodeForm extends PureComponent {
  onFormSubmit = e => {
    e.stopPropagation();
    const { form, editData, saveMenu } = this.props;
    form.validateFields({ force: true }, (err, formData) => {
      if (err) {
        return false;
      }
      const params = { ...editData };
      Object.assign(params, formData);
      saveMenu(params);
    });
  };

  handlerDelete = (e, id) => {
    e.stopPropagation();
    const { deleteMenu } = this.props;
    deleteMenu(id);
  };

  handlerAddChild = (e, editData) => {
    e.stopPropagation();
    const { addChild } = this.props;
    addChild(editData);
  };

  handlerMove = (e, editData) => {
    e.stopPropagation();
    const { moveChild } = this.props;
    moveChild(editData);
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
    if (editData && editData.id) {
      return (
        <>
          <Button onClick={e => this.handlerAddChild(e, editData)}>新建子菜单</Button>
          {editData.parentId ? (
            <Button
              loading={loading.effects['appMenu/move']}
              onClick={e => this.handlerMove(e, editData)}
            >
              移动
            </Button>
          ) : null}
          <Popconfirm
            overlayClassName={cls(styles['pop-confirm-box'])}
            title={this.renderPopconfirmTitle('确定要删除吗？', '提示：删除后不能恢复')}
            placement="top"
            icon={<ExtIcon type="question-circle" antd />}
            onConfirm={e => this.handlerDelete(e, editData.id)}
          >
            <Button type="danger" ghost loading={loading.effects['appMenu/del']}>
              删除
            </Button>
          </Popconfirm>
        </>
      );
    }
    return (
      <Popconfirm
        overlayClassName={cls(styles['pop-confirm-box'])}
        title={this.renderPopconfirmTitle('确定要返回吗？', '提示：未保存的数据将会丢失')}
        placement="top"
        icon={<ExtIcon type="question-circle" antd />}
        onConfirm={e => this.handlerGoBackParent(e)}
      >
        <Button>返回</Button>
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
        subTitle = '新建子菜单';
      }
    } else if (editData.id) {
      title = editData.name;
      subTitle = '编辑';
    } else {
      title = '新建';
    }
    return <BannerTitle title={title} subTitle={subTitle} />;
  };

  render() {
    const { form, loading, editData } = this.props;
    const { getFieldDecorator } = form;
    const title = this.getFormTitle();
    getFieldDecorator('featureId', { initialValue: get(editData, 'featureId') });
    getFieldDecorator('featureCode', { initialValue: get(editData, 'featureCode') });
    const featureProps = {
      form,
      allowClear: true,
      remotePaging: true,
      name: 'featureName',
      field: ['featureId', 'featureCode'],
      searchPlaceHolder: '输入代码或名称关键字查询',
      searchProperties: ['name', 'code'],
      searchWidth: 220,
      width: 420,
      columns: [
        {
          title: '名称',
          width: 160,
          dataIndex: 'name',
        },
        {
          title: '页面地址',
          width: 220,
          dataIndex: 'url',
        },
      ],
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/feature/findByFilters`,
        params: {
          filters: [
            {
              fieldName: 'type',
              operator: 'EQ',
              value: 1,
            },
          ],
        },
      },
      reader: {
        name: 'name',
        field: ['id', 'code'],
      },
    };
    const hasIcon = (!editData.id && !editData.parentId) || editData.nodeLevel === 0;
    return (
      <div key="node-form" className={cls(styles['node-form'])}>
        <div className="base-view-body">
          <div className="header">{title}</div>
          <div className="tool-bar-box">
            <div className="tool-action-box">
              <Button
                type="primary"
                loading={loading.effects['appMenu/save']}
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
              <Form {...formItemLayout} className="form-body" layout="vertical">
                <FormItem label="菜单名称">
                  {getFieldDecorator('name', {
                    initialValue: get(editData, 'name'),
                    rules: [
                      {
                        required: true,
                        message: '菜单名称不能为空',
                      },
                    ],
                  })(<Input />)}
                </FormItem>
                {hasIcon ? (
                  <FormItem label="图标类名">
                    {getFieldDecorator('iconCls', {
                      initialValue: get(editData, 'iconCls'),
                      rules: [
                        {
                          required: true,
                          message: '图标类名不能为空',
                        },
                      ],
                    })(<Input />)}
                  </FormItem>
                ) : null}
                <FormItem label="序号">
                  {getFieldDecorator('rank', {
                    initialValue: get(editData, 'rank'),
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'global.rank.required',
                          defaultMessage: '序号不能为空',
                        }),
                      },
                    ],
                  })(<InputNumber precision={0} min={0} style={{ width: '100%' }} />)}
                </FormItem>
                {editData.children && editData.children.length === 0 && editData.parentId ? (
                  <FormItem label="菜单项">
                    {getFieldDecorator('featureName', {
                      initialValue: get(editData, 'featureName'),
                      rules: [
                        {
                          required: false,
                          message: '菜单项不能为空',
                        },
                      ],
                    })(<ComboGrid {...featureProps} />)}
                  </FormItem>
                ) : null}
              </Form>
            </ScrollBar>
          </div>
        </div>
      </div>
    );
  }
}

export default NodeForm;
