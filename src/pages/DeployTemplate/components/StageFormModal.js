import React, { PureComponent } from 'react';
import { get, isEqual } from 'lodash';
import { Button, InputNumber } from 'antd';
import { ExtModal, utils, message, BannerTitle } from 'suid';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/ext-language_tools';
import styles from './StageFormModal.less';

const { getUUID } = utils;

class StageFormModal extends PureComponent {
  static aceId;

  constructor(props) {
    super(props);
    this.aceId = getUUID();
    const { rowData } = props;
    const { playscript = '', rank = 0 } = rowData || {};
    this.state = {
      scriptText: playscript,
      rank,
    };
  }

  componentDidUpdate(preProps) {
    const { rowData } = this.props;
    if (!isEqual(preProps.rowData, rowData)) {
      this.setState({ scriptText: get(rowData, 'playscript'), rank: get(rowData, 'rank') });
    }
  }

  handlerFormSubmit = () => {
    const { save, rowData } = this.props;
    const { scriptText, rank } = this.state;
    message.destroy();
    if (!scriptText) {
      message.error('阶段执行脚本不能为空');
    } else {
      const params = { id: get(rowData, 'id'), rank, playscript: scriptText };
      save(params);
    }
  };

  handlerAceChannge = scriptText => {
    this.setState({ scriptText });
  };

  handlerRankChange = rank => {
    this.setState({ rank });
  };

  handlerComplete = ace => {
    if (ace) {
      const completers = [
        {
          name: 'params.PROJECT_NAME',
          value: 'params.PROJECT_NAME',
          score: 10,
          meta: '项目名称',
        },
      ];
      ace.completers.push({
        getCompletions(editor, session, pos, prefix, callback) {
          if (prefix.length === 0) {
            return callback(null, []);
          }
          return callback(null, completers);
        },
      });
    }
  };

  renderFooter = () => {
    const { rank } = this.state;
    const { closeFormModal, saving } = this.props;
    return (
      <>
        <span style={{ marginRight: 8 }}>
          <label>序号：</label>
          <InputNumber value={rank} onChange={this.handlerRankChange} precision={0} />
        </span>
        <Button disabled={saving} onClick={closeFormModal}>
          取消
        </Button>
        <Button loading={saving} onClick={this.handlerFormSubmit} type="primary">
          确定
        </Button>
      </>
    );
  };

  render() {
    const { closeFormModal, showModal, rowData } = this.props;
    const { scriptText } = this.state;
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        width={780}
        wrapClassName={styles['stage-box']}
        bodyStyle={{ paddingBottom: 0 }}
        title={<BannerTitle title={get(rowData, 'name')} subTitle="阶段执行脚本" />}
        footer={this.renderFooter()}
      >
        <AceEditor
          style={{ marginBottom: 24 }}
          mode="json"
          theme="terminal"
          name={this.aceId}
          fontSize={16}
          onChange={this.handlerAceChannge}
          showPrintMargin={false}
          showGutter={false}
          highlightActiveLine
          width="100%"
          height="100%"
          value={scriptText}
          onLoad={this.handlerComplete}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: false,
            tabSize: 4,
          }}
        />
      </ExtModal>
    );
  }
}

export default StageFormModal;
