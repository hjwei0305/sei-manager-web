import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get, omit, isEqual } from 'lodash';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input, Popover, Alert } from 'antd';
import { BannerTitle, utils, ExtIcon } from 'suid';
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
    const { globalParam = '{\n}' } = templateData || {};
    this.state = {
      globalParam,
      valid: true,
    };
  }

  componentDidUpdate(prevProps) {
    const { templateData } = this.props;
    if (!isEqual(prevProps.templateData, templateData)) {
      const { globalParam = '{\n}' } = templateData || {};
      this.setState({ globalParam });
    }
  }

  handlerFormSubmit = () => {
    const { form, saveDeployTemplate, templateData, handlerPopoverHide } = this.props;
    const { validateFields, getFieldsValue } = form;
    const { globalParam } = this.state;
    const valid = this.validJson(globalParam);
    this.setState({ valid });
    validateFields(errors => {
      if (errors || valid === false) {
        return;
      }
      const params = { globalParam };
      Object.assign(params, omit(templateData, ['globalParam']) || {});
      Object.assign(params, getFieldsValue());
      saveDeployTemplate(params, handlerPopoverHide);
    });
  };

  validJson = globalParam => {
    let valid = true;
    if (globalParam) {
      try {
        const str = globalParam.replace(/[\r\n\s]/g, '');
        JSON.parse(str);
      } catch (e) {
        valid = false;
      }
    }
    return valid;
  };

  handlerAceChannge = globalParam => {
    this.setState({ globalParam });
  };

  handlerComplete = ace => {
    const { globalParam } = this.state;
    if (ace && globalParam) {
      const str = globalParam.replace(/[\r\n\s]/g, '');
      const json = JSON.parse(str);
      ace.setValue(JSON.stringify(json, null, '\t'));
    }
  };

  paramsDemo = () => {
    const demoAce = getUUID();
    return (
      <AceEditor
        mode="json"
        theme="github"
        name={demoAce}
        fontSize={14}
        showPrintMargin={false}
        showGutter={false}
        readOnly
        highlightActiveLine={false}
        width="260px"
        height="120px"
        value={'{\n  "key1":1,\n  "key2":true,\n  "key3":"text"\n}'}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: true,
          showLineNumbers: false,
          tabSize: 2,
        }}
      />
    );
  };

  renderParamsTitle = () => {
    return (
      <>
        模板参数(Json对象)
        <Popover title="样例参考" content={this.paramsDemo()}>
          <ExtIcon
            antd
            type="question-circle"
            style={{ marginLeft: 4, position: 'relative', top: 4, cursor: 'pointer' }}
          />
        </Popover>
      </>
    );
  };

  render() {
    const { form, templateData, saving } = this.props;
    const { getFieldDecorator } = form;
    const { globalParam, valid } = this.state;
    const title = templateData ? '编辑' : '新建';
    return (
      <div key="form-box" className={cls(styles['form-box'])}>
        <div className="base-view-body">
          <div className="header">
            <BannerTitle title={title} subTitle="模板" />
          </div>
          {valid === false ? (
            <Alert
              type="error"
              message="Json格式不正确。属性请使用双引号，值如果是字符串也需用双引号"
              banner
            />
          ) : null}
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
            <FormItem label={this.renderParamsTitle()}>
              <AceEditor
                mode="json"
                theme="terminal"
                name={this.aceId}
                fontSize={14}
                onLoad={this.handlerComplete}
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
                  tabSize: 2,
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
