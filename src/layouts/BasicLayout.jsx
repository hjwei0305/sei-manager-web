import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { router } from 'umi';
import { Helmet } from 'react-helmet';
import { ScrollBar } from 'suid';
import { formatMessage } from 'umi-plugin-react/locale';
import { userInfoOperation } from '@/utils';
import ConfirmLoginModal from '@/pages/Login/ConfirmLoginModal';
import Header from './components/Header';
import NavLeft from './components/NavLeft';
import Tab from './components/Tab';

import styles from './BasicLayout.less';

const { TabPane, TabHeader } = Tab;
const { getCurrentUser } = userInfoOperation;

@connect(({ base, menu, user }) => ({ base, menu, user }))
class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /** 是否折叠菜单 */
      collapsed: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { userId } = getCurrentUser() || {};
    /** 动态获取子模块配置，并且启动微前端应用 */
    dispatch({
      type: 'base/getApps',
    });
    if (userId) {
      dispatch({
        type: 'menu/updateState',
        payload: {
          menuTrees: [],
          currMenuTree: null,
        },
      }).then(() => {
        dispatch({
          type: 'menu/getMenus',
          payload: {
            userId,
          },
        });
      });
    }
    window.addEventListener('message', this.delegateTab, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.delegateTab);
  }

  handleAfterSuccess = () => {
    const { menu } = this.props;
    const { activedMenu } = menu;
    if (activedMenu) {
      this.handleReload(activedMenu.id);
    }
  };

  delegateTab = e => {
    const { data } = e;
    const { tabAction, item } = data || {};
    if (['open', 'close'].includes(tabAction)) {
      const { id, name: title, featureUrl: url } = item || {};
      let params = {
        activedMenu: { id, title, url },
      };
      if (tabAction === 'close') {
        params = {
          tabIds: [id],
        };
      }
      this.handleTabs(tabAction, params);
    }
  };

  handleTogCollapsed = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  handleCloseTab = (ids, isCloseAll) => {
    this.handleTabs('close', {
      tabIds: ids,
    }).then(() => {
      if (isCloseAll) {
        this.handleHomeClick();
      }
    });
  };

  handleReload = id => {
    if (this.tabPaneRef && id) {
      this.tabPaneRef.reload(id);
    }
  };

  handleToggleTab = (id, activedMenu) => {
    this.handleTabs('open', {
      activedMenu,
    });
  };

  handleResize = showTabCounts => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/updateShowTabCounts',
      payload: {
        showTabCounts,
      },
    });
  };

  /** 页签操作 */
  handleTabs = (type, payload) => {
    const { dispatch } = this.props;
    return dispatch({
      type: `menu/${type}Tab`,
      payload,
    });
  };

  handleHomeClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/updateState',
      payload: {
        activedMenu: null,
      },
    }).then(() => {
      router.push('/DashBoard');
    });

    // this.handleTabs('open', {
    //   activedMenu: null,
    // }).then(() => {
    //   router.push('/DashBoard');
    // });
  };

  /** 判断是否是子应用路由 */
  isSubAppRouter = () => {
    const { base, history } = this.props;
    return base.apps.some(item => history.location.pathname.startsWith(item.base));
  };

  getBreadCrumb = () => {
    const { menu } = this.props;
    const { urlPath = '' } = menu.activedMenu || {};
    if (urlPath) {
      const urlPaths = urlPath.slice(1).split('/');
      let preUrlPath = urlPaths.slice(0, -1).join('/');
      if (preUrlPath) {
        preUrlPath += '/';
      }

      return (
        <div className={cls(styles['breadcrumb-wrapper'])}>
          <span className="pre-urlpath">{preUrlPath}</span>
          <span className="curr-urlpath">{urlPaths.pop()}</span>
        </div>
      );
    }

    return urlPath;
  };

  render() {
    const { collapsed } = this.state;
    const { menu, children } = this.props;
    const {
      tabData,
      mode,
      currMenuTree,
      activedMenu,
      loginVisible,
      allLeafMenus,
      showTabCounts,
      visibleTabData,
      moreTabData,
      favoriteMenus,
    } = menu;
    const isSubAppRouter = this.isSubAppRouter();
    let activedKey = '';
    let title = formatMessage({ id: 'app.dashboard', desc: '平台首页' });
    if (activedMenu) {
      const { id, title: tempTitle, rootName } = activedMenu;
      activedKey = id;
      if (rootName) {
        title = `${currMenuTree && currMenuTree.title}-${tempTitle}`;
      } else {
        title = tempTitle;
      }
    }
    return (
      <ScrollBar>
        <section className={cls(styles['portal-layout'])}>
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={title} />
          </Helmet>
          <nav
            className={cls({
              'layout-sidebar': true,
              'layout-sidebar-collapsed': collapsed,
            })}
          >
            <NavLeft
              onSelectSearchMenu={currMenu => {
                const { dispatch } = this.props;
                dispatch({
                  type: 'menu/openTab',
                  payload: {
                    activedMenu: currMenu,
                  },
                });
                // .then(() => router.push(currMenu.url));
              }}
              favoriteMenus={favoriteMenus}
              allLeafMenus={allLeafMenus}
              onLogoClick={this.handleLogoClick}
              menuConfig={currMenuTree ? currMenuTree.children || [] : []}
              onMenuClick={currMenu => {
                this.handleTabs('open', {
                  activedMenu: currMenu,
                });
              }}
              collapsed={collapsed}
              activedMenuKey={activedKey}
              mode={mode}
              onCollapse={this.handleTogCollapsed}
            />
          </nav>
          <section className={cls('layout-center')}>
            <header className={cls('layout-center-header')}>
              <Header
                // onCollapse={this.handleTogCollapsed}
                // collapsed={collapsed}
                onHomeClick={this.handleHomeClick}
              >
                {mode === 'spa' ? (
                  this.getBreadCrumb()
                ) : (
                  <TabHeader
                    data={tabData}
                    activedKey={activedKey}
                    activedMenu={activedMenu}
                    onClose={this.handleCloseTab}
                    onChange={this.handleToggleTab}
                    onReload={this.handleReload}
                    onResize={this.handleResize}
                    visibleTabData={visibleTabData}
                    moreTabData={moreTabData}
                    showTabCounts={showTabCounts}
                    mode={mode}
                  />
                )}
              </Header>
            </header>
            <content className={cls('layout-center-content')}>
              {/* <div
                style={{
                  display: !isSubAppRouter && !activedKey ? 'block' : 'none',
                  height: '100%',
                }}
              >
                <DashBoard />
              </div> */}
              {!isSubAppRouter && !activedKey ? children : null}
              {mode === 'iframe' ? (
                <TabPane
                  style={activedKey === '' ? { visibility: 'hidden', height: 0 } : {}}
                  // data={visibleTabData.concat(moreTabData)}
                  data={tabData}
                  activedKey={activedKey}
                  onHomeClick={this.handleHomeClick}
                  ref={inst => {
                    this.tabPaneRef = inst;
                  }}
                />
              ) : (
                <div
                  id="root-subapp"
                  style={{
                    display: isSubAppRouter ? 'block' : 'none',
                  }}
                />
              )}
            </content>
          </section>
          {loginVisible ? (
            <ConfirmLoginModal
              title="用户登录"
              visible={loginVisible}
              footer={null}
              afterSuccess={this.handleAfterSuccess}
            />
          ) : null}
        </section>
      </ScrollBar>
    );
  }
}

export default BasicLayout;
