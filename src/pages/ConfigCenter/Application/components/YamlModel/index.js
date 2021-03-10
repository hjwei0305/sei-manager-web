import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get, isEqual } from 'lodash';
import cls from 'classnames';
import { utils, ListLoader } from 'suid';
import { Button } from 'antd';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-kuroir';
import styles from './index.less';

const { getUUID } = utils;

class YamlModel extends PureComponent {
  static aceId;

  static propTypes = {
    selectedApp: PropTypes.object,
    selectedEnv: PropTypes.object,
    yamlText: PropTypes.string,
    saveYaml: PropTypes.func,
    saving: PropTypes.bool,
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const { yamlText } = props;
    this.aceId = getUUID();
    this.state = {
      yamlText,
    };
  }

  componentDidMount() {
    this.resize();
  }

  componentDidUpdate(preProps) {
    const { yamlText } = this.props;
    if (!isEqual(preProps.yamlText, yamlText)) {
      this.setState({ yamlText });
    }
  }

  handlerAceChannge = yamlText => {
    this.setState({ yamlText }, this.resize);
  };

  resize = () => {
    setTimeout(() => {
      const winResize = new Event('resize');
      window.dispatchEvent(winResize);
    }, 300);
  };

  handlerComplete = ace => {
    if (ace) {
      this.resize();
    }
  };

  handlerSave = () => {
    const { yamlText } = this.state;
    const { saveYaml, selectedApp, selectedEnv } = this.props;
    if (saveYaml && saveYaml instanceof Function) {
      const data = {
        appCode: get(selectedApp, 'code'),
        envCode: get(selectedEnv, 'code'),
        yamlText,
      };
      saveYaml(data);
    }
  };

  render() {
    const { yamlText } = this.state;
    const { saving, loading } = this.props;
    return (
      <div className={cls(styles['yaml-model-box'], 'auto-height')}>
        <div className={cls('yaml-content')}>
          {loading ? (
            <ListLoader />
          ) : (
            <AceEditor
              mode="yaml"
              theme="kuroir"
              name={this.aceId}
              fontSize={16}
              onChange={this.handlerAceChannge}
              showPrintMargin={false}
              showGutter
              highlightActiveLine
              width="100%"
              height="100%"
              value={yamlText}
              onLoad={this.handlerComplete}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          )}
        </div>
        <div className="tool-box">
          <Button loading={saving} disabled={loading} onClick={this.handlerSave} type="primary">
            保存
          </Button>
        </div>
      </div>
    );
  }
}

export default YamlModel;
