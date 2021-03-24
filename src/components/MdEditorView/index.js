/* eslint-disable no-empty */

import React from 'react';
import { utils, ListLoader } from 'suid';
import * as MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-light.css';
import 'react-markdown-editor-lite/lib/index.css';
import styles from './index.less';

const { getUUID } = utils;
const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  langPrefix: 'language-',
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ''; // 使用额外的默认转义
  },
});

const editorId = getUUID();
const MdEditorView = ({ message, expanding }) => {
  if (expanding === true) {
    return <ListLoader />;
  }
  return (
    <div className={styles.box}>
      <MdEditor
        style={{ height: '100%', width: '100%' }}
        name={editorId}
        value={message || ''}
        readOnly
        renderHTML={text => mdParser.render(text)}
        config={{
          view: {
            menu: false,
            md: false,
            html: true,
          },
          canView: { fullScreen: false, hideMenu: false },
        }}
      />
    </div>
  );
};

export default MdEditorView;
