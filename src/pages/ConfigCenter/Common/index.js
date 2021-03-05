import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Empty, Layout } from 'antd';
import { ListCard } from 'suid';
import empty from '@/assets/item_empty.svg';
import ConfigItem from './components/ConfigItem';
import styles from './index.less';

const { Sider, Content } = Layout;

@connect(({ configCommon, loading }) => ({ configCommon, loading }))
class ConfigCommon extends Component {
  handlerEnvSelect = (keys, items) => {
    const { dispatch } = this.props;
    const selectedEnv = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'configCommon/updateState',
      payload: {
        selectedEnv,
      },
    });
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  closeAssignUsers = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configCommon/updateState',
      payload: {
        showAssign: false,
      },
    });
  };

  assignUsers = childIds => {
    const { configCommon, dispatch } = this.props;
    const { selectedEnv } = configCommon;
    dispatch({
      type: 'configCommon/assignUsers',
      payload: {
        parentId: selectedEnv.id,
        childIds,
      },
      callback: res => {
        if (res.success && this.assignedUserRef) {
          this.assignedUserRef.reloadData();
        }
      },
    });
  };

  handlerAssignedRef = ref => {
    this.assignedUserRef = ref;
  };

  render() {
    const { configCommon } = this.props;
    const { selectedEnv, envData } = configCommon;
    const selectedKeys = selectedEnv ? [selectedEnv.id] : [];
    const userGroupProps = {
      className: 'left-content',
      title: '环境列表',
      showSearch: false,
      onSelectChange: this.handlerEnvSelect,
      selectedKeys,
      customTool: () => null,
      itemField: {
        title: item => item.name,
        description: item => item.remark,
      },
      dataSource: envData,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={320} className="auto-height" theme="light">
            <ListCard {...userGroupProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            {selectedEnv ? (
              <ConfigItem />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="选择左边项目进行的相关配置" />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    );
  }
}
export default ConfigCommon;
