import React, { Component } from 'react';
import cls from 'classnames';
import { Button, Popover, Menu, Dropdown } from 'antd';
import { utils } from 'suid';
import Form from './Form';
import GitlabList from './GitlabList';
import styles from './index.less';

const { Item } = Menu;
const { getUUID } = utils;

class GroupAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      formShow: false,
      gitlabShow: false,
      selectedKeys: '',
    };
  }

  handlerPopoverHide = () => {
    this.setState({
      formShow: false,
      visible: false,
      gitlabShow: false,
      selectedKeys: '',
    });
  };

  handlerFormShowChange = formShow => {
    this.setState({ formShow, gitlabShow: false });
  };

  handlerGitlabShowChange = gitlabShow => {
    this.setState({ gitlabShow, formShow: false });
  };

  handlerShowChange = visible => {
    this.setState({ visible, formShow: false, gitlabShow: false });
  };

  onActionOperation = e => {
    e.domEvent.stopPropagation();
    this.setState({
      selectedKeys: e.key,
      visible: true,
    });
  };

  getMenu = () => {
    const addProps = {
      handlerPopoverHide: this.handlerPopoverHide,
      ...this.props,
    };
    const { formShow, selectedKeys, gitlabShow } = this.state;
    const menuId = getUUID();
    return (
      <Menu
        id={menuId}
        className={cls(styles['action-menu-box'])}
        onClick={e => this.onActionOperation(e)}
        selectedKeys={[selectedKeys]}
      >
        <Item key="add">
          <Popover
            trigger="click"
            placement="rightTop"
            key="form-popover-box"
            destroyTooltipOnHide
            visible={formShow}
            getPopupContainer={document.getElementById(menuId)}
            onVisibleChange={v => this.handlerFormShowChange(v)}
            overlayClassName={cls(styles['form-popover-box'])}
            content={<Form {...addProps} />}
          >
            <span className="view-popover-box-trigger">新建</span>
          </Popover>
        </Item>
        <Item key="async">
          <Popover
            trigger="click"
            placement="right"
            key="gitlab-popover-box"
            destroyTooltipOnHide
            visible={gitlabShow}
            getPopupContainer={document.getElementById(menuId)}
            onVisibleChange={v => this.handlerGitlabShowChange(v)}
            overlayClassName={cls(styles['gitlab-popover-box'])}
            content={<GitlabList {...addProps} />}
          >
            <span className="view-popover-box-trigger">从GitLab新建</span>
          </Popover>
        </Item>
      </Menu>
    );
  };

  render() {
    const { visible } = this.state;
    return (
      <Dropdown
        trigger={['click']}
        overlay={this.getMenu()}
        className="action-drop-down"
        placement="bottomLeft"
        visible={visible}
        onVisibleChange={this.handlerShowChange}
      >
        <Button icon="plus" type="link">
          用户组
        </Button>
      </Dropdown>
    );
  }
}

export default GroupAdd;
