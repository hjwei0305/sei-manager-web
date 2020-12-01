import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Layout, Menu, Card } from 'antd';
import { ScrollBar, BannerTitle } from 'suid';
import { constants } from '@/utils';
import Application from './Application';
import Module from './Module';
import styles from './index.less';

const { APPLY_ORDER_TYPE } = constants;
const { Sider, Content } = Layout;
const { Item } = Menu;

@connect(({ applyOrder, loading }) => ({ applyOrder, loading }))
class ApplyOrder extends PureComponent {
  onActionOperation = e => {
    const { key, domEvent } = e;
    domEvent.stopPropagation();
    const {
      dispatch,
      applyOrder: { appyTypeData },
    } = this.props;
    const appyType = appyTypeData.filter(a => a.name === key);
    dispatch({
      type: 'applyOrder/selectApplyOrderType',
      payload: {
        currentAppyType: appyType[0],
      },
    });
  };

  renderApplyOrder = () => {
    const {
      applyOrder: { currentAppyType },
    } = this.props;
    switch (currentAppyType.name) {
      case APPLY_ORDER_TYPE.APPLICATION.name:
        return <Application />;
      case APPLY_ORDER_TYPE.MODULE.name:
        return <Module />;
      default:
    }
  };

  render() {
    const {
      applyOrder: { appyTypeData, currentAppyType },
    } = this.props;
    const currentSelectedKeys = [currentAppyType.name];
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={220} className="auto-height left-content" theme="light">
            <Card bordered={false} title="我的申请单" className="apply-index">
              <ScrollBar>
                <Menu
                  mode="inline"
                  selectedKeys={currentSelectedKeys}
                  className={cls(styles['action-menu-box'])}
                  onClick={e => this.onActionOperation(e)}
                >
                  {appyTypeData.map(m => {
                    return (
                      <Item key={m.name}>
                        <span className="menu-title">{m.remark}</span>
                      </Item>
                    );
                  })}
                </Menu>
              </ScrollBar>
            </Card>
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 8 }}>
            <Card
              bordered={false}
              title={<BannerTitle title={currentAppyType.remark} subTitle="单据列表" />}
              className="apply-box"
            >
              {this.renderApplyOrder()}
            </Card>
          </Content>
        </Layout>
      </div>
    );
  }
}
export default ApplyOrder;
