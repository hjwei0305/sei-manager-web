import React from 'react';
import cls from 'classnames';
import { get, groupBy, sortBy } from 'lodash';
import { Drawer, Layout, Button, Popconfirm, Collapse, Tag } from 'antd';
import { BannerTitle, ExtIcon, ExtTable, ScrollBar } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { Content, Footer } = Layout;
const { Panel } = Collapse;
const { CHANGE_TYPE } = constants;
let scrollBarRef;

const AppRelease = ({
  selectedApp,
  showRelease,
  handlerClose,
  compareBeforeReleaseData,
  handlerRelease,
  releasing,
}) => {
  const updateScroll = () => {
    if (scrollBarRef) {
      scrollBarRef.updateScroll();
    }
  };

  const renderTitle = () => {
    const title = get(selectedApp, 'name');
    return (
      <>
        <ExtIcon onClick={handlerClose} type="left" className="trigger-back" antd />
        <BannerTitle title={title} subTitle="配置参数比较结果" />
      </>
    );
  };

  const renderChangeContent = () => {
    const changeObj = groupBy(compareBeforeReleaseData, 'changeType');
    const changeItems = Object.keys(changeObj);
    if (changeItems.length >= 0) {
      return (
        <Collapse onChange={updateScroll} bordered={false} defaultActiveKey={changeItems}>
          {sortBy(changeItems, itemKey => itemKey).map(itemKey => {
            const items = changeObj[itemKey];
            const tbProps = {
              fixedHeader: false,
              bordered: false,
              lineNumber: false,
              showSearch: false,
              pagination: false,
              dataSource: items,
              rowKey: 'key',
            };
            let columns = [];
            switch (itemKey) {
              case CHANGE_TYPE.CREATE.key:
                columns = [
                  {
                    title: '键名',
                    dataIndex: 'key',
                    width: 380,
                    required: true,
                  },
                  {
                    title: '键值',
                    dataIndex: 'targetValue',
                    width: 260,
                    render: t => t || '-',
                  },
                ];
                return (
                  <Panel
                    header={<Tag color="#029688">{`新增 (${items.length}) 项`}</Tag>}
                    key={itemKey}
                  >
                    <ExtTable {...tbProps} columns={columns} />
                  </Panel>
                );
              case CHANGE_TYPE.MODIFY.key:
                columns = [
                  {
                    title: '键名',
                    dataIndex: 'key',
                    width: 380,
                    required: true,
                  },
                  {
                    title: '键值变更前',
                    dataIndex: 'currentValue',
                    width: 220,
                    render: t => t || '-',
                  },
                  {
                    title: '键值变更后',
                    dataIndex: 'targetValue',
                    width: 220,
                    render: t => t || '-',
                  },
                  {
                    title: '发布人',
                    dataIndex: 'publisherName',
                    width: 100,
                    render: t => t || '-',
                  },
                  {
                    title: '发布时间',
                    dataIndex: 'publishDate',
                    width: 180,
                    render: t => t || '-',
                  },
                ];
                return (
                  <Panel
                    header={<Tag color="#357bd8">{`修改 ( ${items.length}项 )`}</Tag>}
                    key={itemKey}
                  >
                    <ExtTable {...tbProps} columns={columns} />
                  </Panel>
                );
              case CHANGE_TYPE.DELETE.key:
                columns = [
                  {
                    title: '键名',
                    dataIndex: 'key',
                    width: 380,
                    required: true,
                  },
                  {
                    title: '键值',
                    dataIndex: 'currentValue',
                    width: 260,
                    render: t => t || '-',
                  },
                ];
                return (
                  <Panel
                    header={<Tag color="#ca1955">{`删除 ( ${items.length}项 )`}</Tag>}
                    key={itemKey}
                  >
                    <ExtTable {...tbProps} columns={columns} />
                  </Panel>
                );
              default:
                return null;
            }
          })}
        </Collapse>
      );
    }
    return null;
  };
  return (
    <Drawer
      width="100%"
      destroyOnClose
      getContainer={false}
      placement="right"
      visible={showRelease}
      title={renderTitle()}
      className={cls(styles['app-release-box'])}
      onClose={handlerClose}
      style={{ position: 'absolute' }}
    >
      <Layout className="auto-height">
        <Content className={cls('main-content', 'auto-height')}>
          <ScrollBar ref={ref => (scrollBarRef = ref)}>{renderChangeContent()}</ScrollBar>
        </Content>
        <Footer className="tool-box">
          <Button onClick={handlerClose}>取消</Button>
          <Popconfirm disabled={releasing} title="确定要发布吗？" onConfirm={handlerRelease}>
            <Button loading={releasing} type="primary">
              发布
            </Button>
          </Popconfirm>
        </Footer>
      </Layout>
    </Drawer>
  );
};

export default AppRelease;
