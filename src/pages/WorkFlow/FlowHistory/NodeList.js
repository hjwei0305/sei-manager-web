import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Card, Tag } from 'antd';
import { ExtTable } from 'suid';
import { constants } from '@/utils';
import styles from './Nodelist.less';

const { SERVER_PATH } = constants;

class NodeList extends PureComponent {
  static propTypes = {
    currentVersion: PropTypes.string.isRequired,
  };

  renderNodeName = (t, row) => {
    return (
      <>
        <Tag>{row.code}</Tag>
        {t}
      </>
    );
  };

  render() {
    const { currentVersion } = this.props;
    const columns = [
      {
        title: '审核节点名称',
        dataIndex: 'name',
        width: 220,
        render: this.renderNodeName,
      },
      {
        title: '审核人',
        dataIndex: 'handleUserName',
        width: 100,
      },
      {
        title: '审核节点描述',
        dataIndex: 'remark',
        width: 200,
        render: t => t || '-',
      },
    ];
    const extTableProps = {
      columns,
      showSearch: false,
      lineNumber: false,
      store: {
        url: `${SERVER_PATH}/sei-manager/flow/definition/getTaskByInstanceId`,
      },
      cascadeParams: {
        instanceId: get(currentVersion, 'id'),
      },
    };

    return (
      <div className={cls(styles['user-box'])}>
        <Card title="审核节点列表" bordered={false}>
          <ExtTable {...extTableProps} />
        </Card>
      </div>
    );
  }
}

export default NodeList;
