import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout, Menu } from 'antd';
import { ScrollBar } from 'suid';
import Profile from './Profile';
import Account from './Account';
import styles from './index.less';

const { Content, Sider } = Layout;
const cmpType = { profile: 'profile', account: 'account' };

@connect(({ userProfile, loading }) => ({ userProfile, loading }))
class UserProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      settingType: cmpType.profile,
    };
  }

  handlerMenuAction = e => {
    e.domEvent.stopPropagation();
    this.setState({ settingType: e.key });
  };

  handlerSaveUser = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userProfile/saveUser',
      payload: {
        ...data,
      },
    });
  };

  handlerUpdatePassword = (data, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userProfile/updatePassword',
      payload: {
        ...data,
      },
      callback,
    });
  };

  renderContent = () => {
    const { settingType } = this.state;
    const {
      userProfile: { userData },
      loading,
    } = this.props;
    switch (settingType) {
      case cmpType.profile:
        return (
          <Profile
            user={userData}
            saving={loading.effects['userProfile/saveUser']}
            save={this.handlerSaveUser}
          />
        );
      case cmpType.account:
        return (
          <Account
            user={userData}
            saving={loading.effects['userProfile/updatePassword']}
            save={this.handlerUpdatePassword}
          />
        );
      default:
    }
  };

  render() {
    const { settingType } = this.state;
    return (
      <div className={styles['container-box']}>
        <Layout>
          <Sider width="220" theme="light">
            <Menu selectedKeys={[settingType]} mode="inline" onClick={this.handlerMenuAction}>
              <Menu.Item key={cmpType.profile}>个人信息</Menu.Item>
              <Menu.Item key={cmpType.account}>账户管理</Menu.Item>
            </Menu>
          </Sider>
          <Content style={{ paddingLeft: 4 }}>
            <div className="content-box">
              <ScrollBar>{this.renderContent()}</ScrollBar>
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default UserProfile;
