import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { utils } from 'suid';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';

const { getUUID } = utils;

class YamlModel extends PureComponent {
  static aceId;

  static propTypes = {
    yamlText: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.aceId = getUUID();
  }

  componentDidMount() {
    this.resize();
  }

  resize = () => {
    setTimeout(() => {
      const resize = new Event('resize');
      window.dispatchEvent(resize);
    }, 300);
  };

  handlerComplete = ace => {
    if (ace) {
      this.resize();
    }
  };

  render() {
    const { yamlText } = this.props;
    return (
      <AceEditor
        mode="json"
        theme="tomorrow"
        name={this.aceId}
        fontSize={14}
        onChange={this.handlerAceChannge}
        showPrintMargin={false}
        showGutter={false}
        highlightActiveLine
        width="100%"
        height="100%"
        readOnly
        value={yamlText}
        onLoad={this.handlerComplete}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: false,
          tabSize: 2,
        }}
      />
    );
  }
}

export default YamlModel;
