import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { utils, ListLoader } from 'suid';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-kuroir';
import styles from './index.less';

const { getUUID } = utils;

class RuntimeModel extends PureComponent {
  static aceId;

  static propTypes = {
    runtimeConfig: PropTypes.object,
    loading: PropTypes.bool,
  };

  constructor() {
    super();
    this.aceId = getUUID();
  }

  componentDidMount() {
    this.resize();
  }

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

  render() {
    const { loading, runtimeConfig } = this.props;
    return (
      <div className={cls(styles['json-model-box'], 'auto-height')}>
        <div className={cls('json-content')}>
          {loading ? (
            <ListLoader />
          ) : (
            <AceEditor
              mode="json"
              theme="kuroir"
              name={this.aceId}
              fontSize={16}
              showPrintMargin={false}
              showGutter
              readOnly
              highlightActiveLine
              width="100%"
              height="100%"
              value={JSON.stringify(runtimeConfig || '', null, '\t')}
              onLoad={this.handlerComplete}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default RuntimeModel;
