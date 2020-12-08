import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get, omit, isEqual } from 'lodash';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input } from 'antd';
import { BannerTitle, utils } from 'suid';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-terminal';
import styles from './Form.less';

const { getUUID } = utils;
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
class FeatureGroupForm extends PureComponent {
  constructor(props) {
    super(props);
    this.aceId = getUUID();
    const { templateData } = props;
    const { globalParam = '{}' } = templateData || {};
    this.state = {
      globalParam,
    };
  }

  componentDidUpdate(prevProps) {
    const { templateData } = this.props;
    if (!isEqual(prevProps.templateData, templateData)) {
      const { globalParam = '{}' } = templateData || {};
      this.setState({ globalParam });
    }
  }

  handlerFormSubmit = () => {
    const { form, saveDeployTemplate, templateData, handlerPopoverHide } = this.props;
    const { validateFields, getFieldsValue } = form;
    const { globalParam } = this.state;
    validateFields(errors => {
      if (errors) {
        return;
      }
      const params = { globalParam };
      Object.assign(params, omit(templateData, ['globalParam']) || {});
      Object.assign(params, getFieldsValue());
      saveDeployTemplate(params, handlerPopoverHide);
    });
  };

  handlerAceChannge = globalParam => {
    this.setState({ globalParam });
  };

  render() {
    const { form, templateData, saving } = this.props;
    const { getFieldDecorator } = form;
    const { globalParam } = this.state;
    const title = templateData ? '编辑' : '新建';
    return (
      <div key="form-box" className={cls(styles['form-box'])}>
        <div className="base-view-body">
          <div className="header">
            <BannerTitle title={title} subTitle="模板" />
          </div>
          <Form {...formItemLayout}>
            <FormItem label="模板名称">
              {getFieldDecorator('name', {
                initialValue: get(templateData, 'name'),
                rules: [
                  {
                    required: true,
                    message: '模板名称不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="模板描述">
              {getFieldDecorator('remark', {
                initialValue: get(templateData, 'remark'),
                rules: [
                  {
                    required: true,
                    message: '描述不能为空',
                  },
                ],
              })(<Input maxLength={30} />)}
            </FormItem>
            <FormItem label="模板参数(Json对象)">
              <AceEditor
                mode="json"
                theme="terminal"
                name={this.aceId}
                fontSize={14}
                onChange={this.handlerAceChannge}
                showPrintMargin={false}
                showGutter={false}
                highlightActiveLine
                width="100%"
                height="120px"
                value={globalParam}
                setOptions={{
                  enableBasicAutocompletion: false,
                  enableLiveAutocompletion: false,
                  enableSnippets: true,
                  showLineNumbers: false,
                  tabSize: 4,
                }}
              />
            </FormItem>
            <FormItem wrapperCol={{ span: 4 }} className="btn-submit">
              <Button type="primary" loading={saving} onClick={this.handlerFormSubmit}>
                <FormattedMessage id="global.save" defaultMessage="保存" />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default FeatureGroupForm;
