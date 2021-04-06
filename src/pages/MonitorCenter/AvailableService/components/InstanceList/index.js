import React from 'react';
import { Card, Avatar, Popover } from 'antd';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { utils, ListLoader, ExtIcon } from 'suid';

const { getUUID } = utils;
const { Meta } = Card;

const InstanceList = ({ loading, dataSource = [] }) => {
  const paramsDemo = item => {
    const aceId = getUUID();
    const value =
      Object.keys(item.metadata).length === 0 ? '无' : JSON.stringify(item.metadata, null, '\t');
    return (
      <AceEditor
        mode="json"
        theme="github"
        name={aceId}
        fontSize={14}
        showPrintMargin={false}
        showGutter={false}
        value={value}
        highlightActiveLine={false}
        width="420px"
        height="120px"
        readOnly
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: true,
          showLineNumbers: false,
          showFoldWidgets: false,
          tabSize: 2,
        }}
      />
    );
  };

  const renderOther = it => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>其它(metadata)</span>
        <Popover title="metadata" content={paramsDemo(it)} placement="rightTop">
          <ExtIcon
            antd
            type="exclamation-circle"
            style={{ marginLeft: 4, position: 'relative', cursor: 'pointer' }}
          />
        </Popover>
      </div>
    );
  };

  return (
    <>
      {loading ? <ListLoader /> : null}
      {dataSource.map((it, idx) => {
        const { uri } = it;
        return (
          <Card bordered={false}>
            <Meta
              avatar={<Avatar size="small">{idx + 1}</Avatar>}
              title={uri}
              description={renderOther(it)}
            />
          </Card>
        );
      })}
    </>
  );
};

export default InstanceList;
