import React from 'react';
import { get } from 'lodash';
import { Tabs, Card } from 'antd';
import { BannerTitle } from 'suid';
import TypeNodeList from './TypeNodeList';
import styles from './index.less';

const { TabPane } = Tabs;

const RedefinedTypes = ({
  redefinedTypeData,
  currentModule,
  currentTabKey,
  onTabChange,
  typeNodeData,
  refreshNodeData,
  refreshing,
  saving,
  save,
}) => {
  return (
    <Card
      className={styles['view-box']}
      bordered={false}
      title={<BannerTitle title={get(currentModule, 'name')} subTitle="评审活动" />}
    >
      <Tabs activeKey={currentTabKey} onChange={onTabChange} animated={false}>
        {redefinedTypeData.map(redefinedType => {
          const typeNodeListProps = {
            currentModule,
            typeNodeData: typeNodeData[redefinedType.code] || [],
            refreshNodeData,
            refreshing,
            saving,
            save,
          };
          return (
            <TabPane tab={redefinedType.name} key={redefinedType.code} forceRender>
              <TypeNodeList {...typeNodeListProps} />
            </TabPane>
          );
        })}
      </Tabs>
    </Card>
  );
};

export default RedefinedTypes;
