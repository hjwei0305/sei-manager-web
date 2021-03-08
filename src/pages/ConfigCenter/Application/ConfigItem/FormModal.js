import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Form, Input, Popover } from 'antd';
import { ExtModal, ExtIcon, ListCard, BannerTitle } from 'suid';
import { constants } from '@/utils';
import styles from './FormModal.less';

const { SERVER_PATH } = constants;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

@Form.create()
class FormModal extends PureComponent {
  static syncData;

  constructor(props) {
    super(props);
    this.syncData = [];
    this.state = {
      showRefer: false,
    };
  }

  handlerRefer = showRefer => {
    this.setState({ showRefer });
  };

  handlerFormSubmit = () => {
    const { form, save, rowData, selectedEnv } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      if (rowData) {
        save(params, () => {
          this.syncData = [];
        });
      } else {
        const envData = [].concat(selectedEnv, this.syncData);
        const items = [];
        envData.forEach(evn => {
          items.push({
            ...params,
            envCode: get(evn, 'code'),
            envName: get(evn, 'name'),
          });
        });
        save(items, () => {
          this.syncData = [];
        });
      }
    });
  };

  closeFormModal = () => {
    const { closeFormModal } = this.props;
    if (closeFormModal && closeFormModal instanceof Function) {
      closeFormModal();
      this.syncData = [];
    }
  };

  renderEvnVarList = () => {
    const { form } = this.props;
    const listProps = {
      searchProperties: ['code', 'remark'],
      showArrow: false,
      customTool: () => null,
      itemField: {
        title: item => item.code,
        description: item => item.remark,
      },
      onSelectChange: (keys, items) => {
        if (keys && keys.length === 1) {
          this.setState(
            {
              showRefer: false,
            },
            () => {
              form.setFieldsValue({ value: `\${${items[0].code}}` });
            },
          );
        }
      },
      store: {
        url: `${SERVER_PATH}/sei-manager/envVariable/getEnableKey`,
      },
    };
    return <ListCard {...listProps} />;
  };

  render() {
    const { showRefer } = this.state;
    const { form, rowData, saving, showModal, envData, selectedEnv } = this.props;
    const dataSource = envData.filter(env => selectedEnv && env.code !== selectedEnv.code);
    const { getFieldDecorator } = form;
    const title = rowData ? '修改配置键' : '新建配置键';
    const listProps = {
      pagination: false,
      dataSource,
      checkbox: true,
      onSelectChange: (_keys, items) => {
        this.syncData = items;
      },
      showSearch: false,
      showArrow: false,
      customTool: () => null,
      itemField: {
        title: item => item.code,
        description: item => item.name,
      },
    };
    return (
      <ExtModal
        destroyOnClose
        onCancel={this.closeFormModal}
        visible={showModal}
        centered
        width={420}
        wrapClassName={styles['form-modal-box']}
        bodyStyle={{ padding: 0 }}
        confirmLoading={saving}
        title={<BannerTitle title={get(selectedEnv, 'name')} subTitle={title} />}
        onOk={this.handlerFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal" style={{ margin: 24 }}>
          <FormItem label="键名">
            {getFieldDecorator('key', {
              initialValue: get(rowData, 'key'),
              rules: [
                {
                  required: true,
                  message: '键名不能为空',
                },
              ],
            })(<Input autoComplete="off" disabled={!!rowData} />)}
          </FormItem>
          <FormItem label="键值">
            {getFieldDecorator('value', {
              initialValue: get(rowData, 'value'),
              rules: [
                {
                  required: true,
                  message: '键值不能为空',
                },
              ],
            })(
              <Input
                autoComplete="off"
                addonAfter={
                  <Popover
                    overlayClassName={styles['form-popover-box']}
                    onVisibleChange={this.handlerRefer}
                    visible={showRefer}
                    trigger="click"
                    placement="rightTop"
                    content={this.renderEvnVarList()}
                    title="环境变量列表"
                  >
                    <span className="btn-evn">引用环境变量</span>
                  </Popover>
                }
              />,
            )}
          </FormItem>
          <FormItem label="键描述">
            {getFieldDecorator('remark', {
              initialValue: get(rowData, 'remark'),
            })(<Input autoComplete="off" />)}
          </FormItem>
        </Form>
        {!rowData ? (
          <>
            <div className="sync-title">
              同步到(可选){' '}
              <ExtIcon
                style={{ marginLeft: 4, color: '#666' }}
                tooltip={{ title: '同步后需要手动启用噢' }}
                type="question-circle"
                antd
              />
            </div>
            <div style={{ height: 160 }}>
              <ListCard {...listProps} />
            </div>
          </>
        ) : null}
      </ExtModal>
    );
  }
}

export default FormModal;
