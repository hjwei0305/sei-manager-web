import React, { Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get, isEqual } from 'lodash';
import { Drawer } from 'antd';
import { BannerTitle, ExtIcon, ListLoader, utils } from 'suid';
import { diff as DiffEditor } from 'react-ace';
import 'ace-builds/src-noconflict/mode-toml';
import 'ace-builds/src-noconflict/theme-kuroir';
import styles from './index.less';

const { getUUID } = utils;

class AppCompare extends Component {
  static aceId;

  static propTypes = {
    selectedApp: PropTypes.object,
    selectedEnv: PropTypes.object,
    targetCompareEvn: PropTypes.object,
    showCompare: PropTypes.bool,
    handlerClose: PropTypes.func,
    compareData: PropTypes.object,
    compareLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const { compareData } = props;
    this.aceId = getUUID();
    this.state = {
      currentConfig: get(compareData, 'currentConfig') || '',
      targetConfig: get(compareData, 'targetConfig') || '',
    };
  }

  componentDidMount() {
    this.resize();
  }

  componentDidUpdate(preProps) {
    const { compareData } = this.props;
    if (!isEqual(preProps.compareData, compareData)) {
      this.setState({
        currentConfig: get(compareData, 'currentConfig') || '',
        targetConfig: get(compareData, 'targetConfig') || '',
      });
    }
  }

  renderMasterTitle = (title, currentEnvName, targetEnvName) => {
    return (
      <>
        {title}
        <span style={{ color: '#029688', marginLeft: 16 }}>{currentEnvName}</span>
        <span style={{ fontSize: 14 }}>(当前)</span>
        <ExtIcon type="swap-right" style={{ margin: '0 4px' }} antd />
        <span style={{ color: '#357bd8' }}>{targetEnvName}</span>
        <span style={{ fontSize: 14 }}>(目标)</span>
      </>
    );
  };

  renderTitle = () => {
    const { selectedApp, selectedEnv, targetCompareEvn, handlerClose } = this.props;
    const title = get(selectedApp, 'name');
    const currentEnvName = get(selectedEnv, 'name');
    const targetEnvName = get(targetCompareEvn, 'name');
    return (
      <>
        <ExtIcon onClick={handlerClose} type="left" className="trigger-back" antd />
        <BannerTitle
          title={this.renderMasterTitle(title, currentEnvName, targetEnvName)}
          subTitle="比较结果"
        />
      </>
    );
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

  render() {
    const { compareLoading, showCompare, handlerClose } = this.props;
    const { currentConfig, targetConfig } = this.state;
    return (
      <Drawer
        width="100%"
        destroyOnClose
        getContainer={false}
        placement="right"
        visible={showCompare}
        title={this.renderTitle()}
        className={cls(styles['app-compare-box'])}
        onClose={handlerClose}
        style={{ position: 'absolute' }}
      >
        <div className={cls('body-content', 'auto-height')}>
          {compareLoading ? (
            <ListLoader />
          ) : (
            <DiffEditor
              value={[currentConfig, targetConfig]}
              height="100%"
              width="100%"
              name={this.aceId}
              setOptions={{
                useWorker: 16,
              }}
              onLoad={this.handlerComplete}
              mode="toml"
              theme="kuroir"
            />
          )}
        </div>
      </Drawer>
    );
  }
}

export default AppCompare;
