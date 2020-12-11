import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import { Drawer } from 'antd';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-terminal';
import { utils, ListLoader, BannerTitle, message, ExtIcon } from 'suid';
import styles from './TemplatePreview.less';

const { getUUID } = utils;

class TemplatePreview extends PureComponent {
  static aceId;

  static propTypes = {
    currentTemplate: PropTypes.object,
    showPreview: PropTypes.bool,
    closePreview: PropTypes.func,
    templateXml: PropTypes.string,
    templateXmlLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.aceId = getUUID();
  }

  handlerClose = () => {
    const { closePreview } = this.props;
    if (closePreview) {
      closePreview();
    }
  };

  handlerCopy = text => {
    copy(text);
    message.success(`已复制到粘贴板`);
  };

  renderTitle = () => {
    const { currentTemplate, templateXml } = this.props;
    const title = get(currentTemplate, 'name');
    return (
      <>
        <ExtIcon onClick={this.handlerClose} type="left" className="trigger-back" antd />
        <BannerTitle title={title} subTitle="模板预览" />
        <ExtIcon
          type="copy"
          className="copy-btn"
          antd
          tooltip={{ title: '复制内容到粘贴板' }}
          onClick={() => this.handlerCopy(templateXml)}
        />
      </>
    );
  };

  render() {
    const { showPreview, templateXml, templateXmlLoading } = this.props;
    return (
      <Drawer
        width="100%"
        destroyOnClose
        getContainer={false}
        placement="right"
        visible={showPreview}
        title={this.renderTitle()}
        className={cls(styles['preview-box'])}
        onClose={this.handlerClose}
        style={{ position: 'absolute' }}
      >
        {templateXmlLoading ? (
          <ListLoader />
        ) : (
          <AceEditor
            mode="markdown"
            theme="terminal"
            name={this.aceId}
            fontSize={14}
            showPrintMargin={false}
            showGutter
            readOnly
            highlightActiveLine
            width="100%"
            height="100%"
            value={templateXml}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        )}
      </Drawer>
    );
  }
}

export default TemplatePreview;
