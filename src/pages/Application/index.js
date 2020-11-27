import React, { Component } from 'react';
import cls from 'classnames';
import { Button } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH } = constants;
class Application extends Component {
  static tableRef;

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  render() {
    const columns = [
      {
        title: '应用代码',
        dataIndex: 'code',
        width: 180,
        required: true,
      },
      {
        title: '应用名称',
        dataIndex: 'name',
        width: 260,
        required: true,
      },
      {
        title: '应用版本',
        dataIndex: 'version',
        width: 120,
        required: true,
        render: t => t || '-',
      },
      {
        title: '描述说明',
        dataIndex: 'remark',
        width: 380,
        required: true,
        render: t => t || '-',
      },
      {
        title: '所属组代码',
        dataIndex: 'groupCode',
        width: 200,
        render: t => t || '-',
      },
      {
        title: '所属组名称',
        dataIndex: 'groupName',
        width: 280,
        render: t => t || '-',
      },
    ];
    const toolBarProps = {
      left: (
        <>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      toolBar: toolBarProps,
      columns,
      onTableRef: ref => (this.tableRef = ref),
      showSearchTooltip: true,
      searchPlaceHolder: '应用代码、应用名称、描述说明、所属组代码、所属组名称',
      searchProperties: ['code', 'name', 'remark', 'groupCode', 'groupName'],
      searchWidth: 260,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/application/findByPage`,
        params: {
          filters: [{ fieldName: 'frozen', operator: 'EQ', value: false }],
        },
      },
      sort: {
        multiple: true,
        field: {
          name: 'asc',
          version: 'asc',
          code: null,
          remark: null,
          groupCode: null,
          groupName: null,
        },
      },
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...extTableProps} />
      </div>
    );
  }
}

export default Application;
