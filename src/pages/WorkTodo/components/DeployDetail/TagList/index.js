import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { ExtTable } from 'suid';
import { MdEditorView } from '@/components';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH } = constants;

class TagList extends PureComponent {
  static tableRef;

  static startTagName = '';

  static endTagName = '';

  static filter;

  static propTypes = {
    currentEnvCode: PropTypes.string,
    currentModuleId: PropTypes.string,
    currentTagName: PropTypes.string,
    getTag: PropTypes.func,
  };

  getTagMessage = record => {
    const { getTag } = this.props;
    if (getTag && getTag instanceof Function) {
      getTag(record.id, data => {
        Object.assign(record, {
          expanding: false,
          message: data.message || '<span style="color:#999">暂无数据</span>',
        });
        this.forceUpdate();
      });
    }
  };

  render() {
    const { currentModuleId, currentEnvCode, currentTagName } = this.props;
    const columns = [
      {
        title: '标签名称',
        dataIndex: 'tagName',
        width: 320,
        required: true,
      },
      {
        title: '分支',
        dataIndex: 'branch',
        width: 140,
        required: true,
      },
    ];
    const extTableProps = {
      columns,
      lineNumber: false,
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '输入标签名称关键字',
      showSearch: false,
      searchProperties: ['tagName'],
      searchWidth: 260,
      store: {
        url: `${SERVER_PATH}/sei-manager/buildJob/getTags`,
      },
      cascadeParams: {
        moduleId: currentModuleId,
        envCode: currentEnvCode,
        tag: currentTagName,
      },
      expandedRowRender: record => {
        return <MdEditorView expanding={record.expanding} message={record.message} />;
      },
      onExpand: (expanded, record) => {
        if (expanded === true) {
          if (!record.message) {
            Object.assign(record, { expanding: true });
            this.getTagMessage(record);
          }
        }
      },
    };
    return (
      <div className={cls(styles['tag-list-box'])}>
        <ExtTable {...extTableProps} />
      </div>
    );
  }
}

export default TagList;
