import React, { PureComponent } from 'react';
import { get, isEqual } from 'lodash';
import { Empty, Form, Input, Row, Col, Card } from 'antd';
import { ExtModal, ListCard, ComboList, BannerTitle } from 'suid';
import { constants } from '@/utils';
import empty from '@/assets/server_empty.svg';
import styles from './FormModal.less';

const FormItem = Form.Item;
const { SERVER_PATH } = constants;
const { TextArea, Search } = Input;
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
  static listCardRef;

  static serverNodes;

  constructor(props) {
    super(props);
    this.serverNodes = [];
    this.state = {
      currentEnv: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { rowData } = this.props;
    if (!isEqual(prevProps.rowData, rowData)) {
      this.setState({
        currentEnv: {
          code: get(rowData, 'envCode'),
          name: get(rowData, 'envName'),
        },
      });
    }
  }

  handlerFormSubmit = () => {
    const { form, save, currentModule, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        appId: get(currentModule, 'appId'),
        appName: get(currentModule, 'appName'),
        moduleId: get(currentModule, 'id'),
        moduleName: get(currentModule, 'name'),
      };
      Object.assign(params, rowData);
      Object.assign(params, formData);
      Object.assign(params, {
        nodes: this.serverNodes.join(','),
      });
      save(params);
    });
  };

  handlerServerNodeSelect = keys => {
    this.serverNodes = keys;
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  closeFormModal = () => {
    const { closeFormModal } = this.props;
    this.setState({ currentEnv: null });
    if (closeFormModal) {
      closeFormModal();
    }
  };

  renderServerNodeDescription = item => {
    return (
      <>
        <div>{`地址：${item.address}`}</div>
        <div>{`描述：${item.remark}`}</div>
      </>
    );
  };

  renderCustomTool = () => (
    <>
      <Search
        allowClear
        placeholder="代码、名称、描述"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
    </>
  );

  render() {
    const { currentEnv } = this.state;
    const { form, saving, showModal, rowData } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '新建配置' : '修改配置';
    const envProps = {
      form,
      name: 'envName',
      store: {
        url: `${SERVER_PATH}/sei-manager/env/findAllUnfrozen`,
      },
      showSearch: false,
      pagination: false,
      field: ['envCode'],
      afterSelect: item => {
        this.setState({ currentEnv: item });
      },
      reader: {
        name: 'name',
        description: 'remark',
        field: ['code'],
      },
    };
    getFieldDecorator('envCode', { initialValue: get(rowData, 'envCode') });
    const tmpProps = {
      form,
      name: 'tempName',
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/deployTemplate/findByPage`,
      },
      field: ['tempId'],
      reader: {
        name: 'name',
        description: 'remark',
        field: ['id'],
      },
    };
    getFieldDecorator('tempId', { initialValue: get(rowData, 'tempId') });
    const selectedKeys = (get(rowData, 'nodes') || '').split(',');
    const serverNodeListProps = {
      className: 'left-content',
      selectedKeys,
      title: <BannerTitle title={get(currentEnv, 'name') || ''} subTitle="服务器节点列表" />,
      showSearch: false,
      onSelectChange: this.handlerServerNodeSelect,
      customTool: this.renderCustomTool,
      searchProperties: ['remark', 'name', 'value'],
      onListCardRef: ref => (this.listCardRef = ref),
      itemField: {
        title: item => item.name,
        description: this.renderServerNodeDescription,
      },
      checkbox: true,
      store: {
        url: `${SERVER_PATH}/sei-manager/node/getNode`,
      },
      cascadeParams: {
        env: get(currentEnv, 'code'),
      },
    };
    return (
      <ExtModal
        destroyOnClose
        onCancel={this.closeFormModal}
        visible={showModal}
        centered
        width={820}
        maskClosable={false}
        wrapClassName={styles['form-box']}
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        onOk={this.handlerFormSubmit}
        title={title}
      >
        <Row gutter={8}>
          <Col span={12}>
            <Card bordered={false} className="form-box" title="基本信息">
              <Form {...formItemLayout} layout="horizontal">
                <FormItem label="运行环境">
                  {getFieldDecorator('envName', {
                    initialValue: get(rowData, 'envName'),
                    rules: [
                      {
                        required: true,
                        message: '运行环境不能为空',
                      },
                    ],
                  })(<ComboList {...envProps} />)}
                </FormItem>
                <FormItem label="部署模板">
                  {getFieldDecorator('tempName', {
                    initialValue: get(rowData, 'tempName'),
                    rules: [
                      {
                        required: true,
                        message: '部署模板不能为空',
                      },
                    ],
                  })(<ComboList {...tmpProps} />)}
                </FormItem>
                <FormItem label="配置名称">
                  {getFieldDecorator('name', {
                    initialValue: get(rowData, 'name'),
                    rules: [
                      {
                        required: true,
                        message: '配置名称不能为空',
                      },
                    ],
                  })(<Input />)}
                </FormItem>
                <FormItem label="配置描述">
                  {getFieldDecorator('remark', {
                    initialValue: get(rowData, 'remark'),
                    rules: [
                      {
                        required: true,
                        message: '配置描述不能为空',
                      },
                    ],
                  })(<TextArea style={{ resize: 'none' }} rows={3} />)}
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col span={12}>
            {currentEnv && currentEnv.code ? (
              <ListCard {...serverNodeListProps} />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="选择运行环境后显示服务器节点" />
              </div>
            )}
          </Col>
        </Row>
      </ExtModal>
    );
  }
}

export default FormModal;
