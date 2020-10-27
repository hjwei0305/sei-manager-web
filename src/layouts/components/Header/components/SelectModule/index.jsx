import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { omit } from 'lodash';
import { Row, Col, Drawer } from 'antd';
import { ExtIcon, ScrollBar, utils } from 'suid';
import { constants, userInfoOperation } from '@/utils';
import styles from './index.less';

const { storage } = utils;

const { RECENT_APP_EKY } = constants;

const { getCurrentUser } = userInfoOperation;

const tempImgHolder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdFJREFUeNrsl91xgkAUhSVjATz7ZDqADqCDdBCoIFpBYgVqBWoFSQfSgelAnnymA3POzCHDJEZY3NU4s3fmDiPC7neX+xscj8fBPcnD4M7EA3tgD+yBPfBtZdj1wSAIWp85HA5jXF6hT7q1hC5Go1HV9m7Xiht0fvAMMEBDgU5O/E3YJaDfbg4sUEK+QMOWJUroDODrqwMbgnYCdwYMWPrnHDq+MH4K6BTgnybAfbLEuwVYSiLDnae1maUMxWDcmL7U14fr9JX1BP2V7qy7BCAz6BbK9FRhsxzXR+jaAHbBd+oUh7XmWjNy4RLP8jue7I4GYONS4KmC6C9ZC3QqUALvlWmSRqFxVprpEitsvIcmACmg6QnwGjSncTSSxsrosM/GwwsDh+D8pHWKKk6dNI1SRogujVRbzU8iN1mpqHwHJ32URtmAtXHCPyUTWCzwXd9Pfy1gSqSoD23DuuyHQ0fr+onjXwFX9wa8ccRQmZT3zsAoCh9MVy0l2FTqSli67tbaKleq6/ZM8543QV028AP1DjztXCNPV+F0kbLvMDlVa1lCc1mspr46E6ClTjRWv9FbrIz5jcE0kyEL3Zs0f191zPeFwwN7YA/sgT0w5UuAAQCqb9STix6pkwAAAABJRU5ErkJggg==';

@connect(({ menu }) => ({ menu }))
class SelectModule extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      showShadow: false,
    };
  }

  handleClick = currMenuTree => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/updateState',
      payload: {
        currMenuTree,
        activedMenu: null,
      },
    });
    this.recordRecentApp(currMenuTree);
    this.handlerClose();
  };

  // 记录最后一次使用的应用
  recordRecentApp = currMenuTree => {
    const userInfo = getCurrentUser();
    if (currMenuTree && userInfo && userInfo.userId) {
      const key = `${RECENT_APP_EKY}_${userInfo.userId}`;
      const recentApp = omit(currMenuTree, ['children', 'appBase64ImgStr']);
      storage.localStorage.set(key, recentApp);
    }
  };

  handlerVisibleChange = visible => {
    this.setState({
      visible,
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  handlerClose = () => {
    this.setState({
      visible: false,
    });
  };

  handerScrollDown = () => {
    this.setState({ showShadow: true });
  };

  handerYReachStart = () => {
    this.setState({ showShadow: false });
  };

  renderAppList = () => {
    const { menu } = this.props;
    const { menuTrees, currMenuTree } = menu;
    return (
      <div
        ref={ref => {
          this.appElm = ref;
        }}
        className={cls('app-box-wrapper')}
      >
        <ScrollBar onYReachStart={this.handerYReachStart} onScrollDown={this.handerScrollDown}>
          <Row className={cls('app-box')} gutter={0}>
            {menuTrees.map(menuTree => {
              const { appBase64ImgStr, id } = menuTree;
              return (
                <Col
                  span={8}
                  key={id}
                  className={cls('app-item-wrap', { actived: currMenuTree.id === id })}
                  onClick={() => this.handleClick(menuTree)}
                >
                  <div className="logo-wrap">
                    <div className="app-logo">
                      <img alt="应用图标" src={appBase64ImgStr || tempImgHolder} />
                    </div>
                  </div>
                  <div title={menuTree.title} className={cls('desc')}>
                    {menuTree.title}
                  </div>
                </Col>
              );
            })}
          </Row>
        </ScrollBar>
      </div>
    );
  };

  renderTitle = () => (
    <>
      <ExtIcon
        type="app"
        onClick={this.handlerClose}
        style={{ fontSize: '16px', marginRight: '24px', color: 'rgb(166, 166, 166)' }}
      />
      我的应用
    </>
  );

  render() {
    const { menu } = this.props;
    const { currMenuTree } = menu;
    const { visible, showShadow } = this.state;
    const headerStyle = {
      boxShadow: showShadow ? ' 0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
    };
    return (
      <>
        <span className={cls('trigger', { 'trigger-open': visible })} onClick={this.showDrawer}>
          <span className="title">
            {currMenuTree ? currMenuTree.title : <span>应用加载中...</span>}
          </span>
          <ExtIcon type="app" style={{ fontSize: '18px', marginLeft: '6px' }} />
        </span>
        <Drawer
          headerStyle={headerStyle}
          title={this.renderTitle()}
          visible={visible}
          placement="left"
          maskClosable
          width={380}
          onClose={this.handlerClose}
          className={cls(styles['select-module-wrapper'], 'app-module-select')}
          afterVisibleChange={this.handlerVisibleChange}
        >
          {this.renderAppList()}
        </Drawer>
      </>
    );
  }
}

export default SelectModule;
