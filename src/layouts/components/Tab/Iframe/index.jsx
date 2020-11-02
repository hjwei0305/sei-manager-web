import React, { Component } from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import NProgress from 'nprogress';
// import { Spin } from 'antd';
import { PageLoader } from 'suid';
import { noop } from 'lodash';
import styles from './index.less';

import 'nprogress/nprogress.css';

class Iframe extends Component {
  static refIframe = null;

  static propTypes = {
    /** iframe 加载成功后的回调函数 */
    onLoaded: propTypes.func,
    /** iframe src地址 */
    url: propTypes.string.isRequired,
    /** 是否显示这个iframe */
    visible: propTypes.bool.isRequired,
    /** id */
    id: propTypes.string,
    /** 标题 */
    title: propTypes.string,
  };

  static defaultProps = {
    onLoaded: noop,
    id: '',
    title: '',
  };

  state = {
    loading: false,
  };

  componentDidMount() {
    const { id } = this.props;
    // console.log('test')
    NProgress.configure({ parent: `#np_${id}`, showSpinner: false });
    // NProgress.set(0.0);
    NProgress.start();
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;
    if (onUnmount) {
      onUnmount();
    }
  }

  // componentWillUnmount() {
  //   if (this.refIframe && this.refIframe.contentWindow) {
  //     this.refIframe.src = 'about:blank';
  //     this.refIframe.contentWindow.document.write('');
  //     this.refIframe.contentWindow.document.clear();
  //   }
  //   this.refIframe = null;
  // }

  setIframeRef = ref => {
    this.refIframe = ref;
  };

  reload = () => {
    this.refIframe.contentWindow.location.reload(true);
  };

  handleLoaded = () => {
    const { onLoaded, url } = this.props;
    NProgress.done();
    this.setState({ loading: false }, () => {
      onLoaded(url);
    });
  };

  render() {
    const { url = '', visible, id, title } = this.props;
    const { loading } = this.state;

    const className = classNames({
      [styles['iframe-wrap']]: true,
      [styles['iframe-wrap_hidden']]: !visible,
      [styles['iframe-wrap_loading']]: loading,
    });

    return (
      <div key={id} className={className} id={`np_${id}`}>
        {loading && <PageLoader className="iframe-wrap-loading" size="large" tip="加载中..." />}
        <iframe
          key={id}
          ref={this.setIframeRef}
          title={title}
          src={url}
          onLoad={this.handleLoaded}
          id={id}
        />
      </div>
    );
  }
}

export default Iframe;
