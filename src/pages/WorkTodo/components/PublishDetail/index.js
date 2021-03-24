import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Form, Input, Layout, Card } from 'antd';
import { ExtModal, ExtIcon, BannerTitle, ScrollBar } from 'suid';
import { MdEditorView } from '@/components';
import styles from './index.less';

const { Sider, Content } = Layout;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
class PublishDetail extends PureComponent {
  static propTypes = {
    showModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
    rowData: PropTypes.object,
  };

  renderTitle = () => {
    const { closeFormModal } = this.props;
    return (
      <>
        <ExtIcon onClick={closeFormModal} type="left" className="trigger-back" antd />
        <BannerTitle title="显示" subTitle="发版申请" />
      </>
    );
  };

  render() {
    const { form, rowData, showModal, closeFormModal } = this.props;
    const { getFieldDecorator } = form;
    return (
      <ExtModal
        centered
        destroyOnClose
        width={860}
        visible={showModal}
        onCancel={closeFormModal}
        wrapClassName={styles['form-box']}
        bodyStyle={{ paddingBottom: 0 }}
        title={this.renderTitle()}
        footer={null}
      >
        <Layout className="auto-height">
          <Sider width={300} className="auto-height form-box" theme="light">
            <ScrollBar>
              <Form {...formItemLayout} layout="horizontal">
                <FormItem label="发版主题">
                  {getFieldDecorator('name', {
                    initialValue: get(rowData, 'name'),
                    rules: [
                      {
                        required: true,
                        message: '发版主题不能为空',
                      },
                    ],
                  })(<Input autoComplete="off" placeholder="请输入发版主题" disabled />)}
                </FormItem>
                <FormItem label="发版应用">
                  {getFieldDecorator('appName', {
                    initialValue: get(rowData, 'appName'),
                    rules: [
                      {
                        required: true,
                        message: '发版应用不能为空',
                      },
                    ],
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="模块名称">
                  {getFieldDecorator('moduleName', {
                    initialValue: get(rowData, 'moduleName'),
                    rules: [
                      {
                        required: true,
                        message: '模块名称不能为空',
                      },
                    ],
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="标签名称">
                  {getFieldDecorator('refTag', {
                    initialValue: get(rowData, 'refTag'),
                    rules: [
                      {
                        required: true,
                        message: '标签名称不能为空',
                      },
                    ],
                  })(<Input disabled />)}
                </FormItem>
              </Form>
            </ScrollBar>
          </Sider>
          <Content className="auto-height main-content" style={{ paddingLeft: 8 }}>
            <Card bordered={false} key="tag-content" className="tag-content" title="发版说明">
              <MdEditorView
                key="tag-content-md"
                message={get(rowData, 'remark') || '<span style="color:#999">暂无数据</span>'}
              />
            </Card>
          </Content>
        </Layout>
      </ExtModal>
    );
  }
}

export default PublishDetail;
