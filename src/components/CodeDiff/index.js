/* eslint-disable react/no-danger */
import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { createPatch } from 'diff';
import * as Diff2Html from 'diff2html';
import 'highlight.js/styles/googlecode.css';
import 'diff2html/bundles/css/diff2html.min.css';
import style from './index.less';

class CodeDiff extends PureComponent {
  static boxRef;

  static propTypes = {
    oldText: PropTypes.string,
    newText: PropTypes.string,
    context: PropTypes.number,
    outputFormat: PropTypes.oneOf(['line-by-line', 'side-by-side']),
  };

  static defaultProps = {
    oldText: '',
    newText: '',
    context: 5,
    outputFormat: 'side-by-side',
  };

  createdHtml = () => {
    const { oldText, newText, context, outputFormat } = this.props;
    function hljsText(html) {
      return html.replace(
        /<span class="d2h-code-line-ctn">(.+?)<\/span>/g,
        '<span class="d2h-code-line-ctn"><code>$1</code></span>',
      );
    }
    const args = ['', oldText, newText, '', '', { context }];
    const dd = createPatch(...args);
    const outStr = Diff2Html.parse(dd, {
      inputFormat: 'diff',
      outputFormat,
      matching: 'lines',
      drawFileList: false,
      renderNothingWhenEmpty: false,
    });
    const html = Diff2Html.html(outStr, {
      inputFormat: 'json',
      outputFormat,
      matching: 'lines',
      drawFileList: true,
      renderNothingWhenEmpty: false,
    });
    return hljsText(html);
  };

  render() {
    return (
      <div className={cls(style['code-diff-box'])} ref={ref => (this.boxRef = ref)}>
        <div id="code-diff" dangerouslySetInnerHTML={{ __html: this.createdHtml() }} />
      </div>
    );
  }
}

export default CodeDiff;
