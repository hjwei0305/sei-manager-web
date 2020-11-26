import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-terminal';
import { utils, ListLoader, BannerTitle } from 'suid';
import styles from './TemplatePreview.less';

const { getUUID } = utils;

class UnAssignUsers extends PureComponent {
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

  render() {
    const { showPreview, templateXml, templateXmlLoading, currentTemplate } = this.props;
    const title = get(currentTemplate, 'name');
    return (
      <Drawer
        width="100%"
        destroyOnClose
        getContainer={false}
        placement="right"
        visible={showPreview}
        title={<BannerTitle title={title} subTitle="模板预览" />}
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
              tabSize: 4,
            }}
          />
        )}
      </Drawer>
    );
  }
}

export default UnAssignUsers;
