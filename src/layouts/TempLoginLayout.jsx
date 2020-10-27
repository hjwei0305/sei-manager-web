import React, { PureComponent } from 'react';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Helmet } from 'react-helmet';
import { PageLoader, Animate } from 'suid';
import { constants } from '@/utils';
import Footer from '@/components/Footer';
import styles from './TempLoginLayout.less';

const { LOCAL_PATH } = constants;

export class TempLoginLayout extends PureComponent {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  onFrameLoaded = () => {
    this.setState({ loading: false });
  };

  render() {
    const { children } = this.props;
    const { loading } = this.state;
    return (
      <>
        <Helmet>
          <title>{formatMessage({ id: 'login.login', desc: '登录' })}</title>
          <meta name="description" content={formatMessage({ id: 'login.login', desc: '登录' })} />
        </Helmet>
        <div
          className="canvas-an"
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
        >
          <iframe
            title="dynamic-point"
            frameBorder="0"
            src={`${LOCAL_PATH}/ani/index.html?v=2`}
            style={{ width: '100%', height: '100%' }}
            onLoad={this.onFrameLoaded}
          />
        </div>
        <div className={styles['login-box']}>
          <div className="main-wrapper">
            <div className={cls('logo', 'horizontal')} />
            <div className={cls('form-box')}>
              {loading ? <PageLoader /> : <Animate type="bounceIn">{children}</Animate>}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default TempLoginLayout;
