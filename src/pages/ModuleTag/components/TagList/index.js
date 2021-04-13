import React, { Component } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card } from 'antd';
import { ExtTable, BannerTitle, ExtIcon, ComboList } from 'suid';
import { MdEditorView } from '@/components';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH } = constants;

@connect(({ moduleTag, loading }) => ({ moduleTag, loading }))
class TagList extends Component {
  static tableRef;

  static startTagName = '';

  static endTagName = '';

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'moduleTag/updateState',
      payload: {
        showTagModal: true,
        tagData: null,
        onlyView: false,
      },
    });
    dispatch({
      type: 'moduleTag/getNewTag',
    });
  };

  view = tagData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'moduleTag/updateState',
      payload: {
        onlyView: true,
        showTagModal: true,
        tagData,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'moduleTag/createTag',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'moduleTag/updateState',
            payload: {
              showTagModal: false,
            },
          });
          this.reloadData();
        }
      },
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'moduleTag/updateState',
      payload: {
        showTagModal: false,
        tagData: null,
        onlyView: false,
        newTag: false,
      },
    });
  };

  getTagMessage = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'moduleTag/getTag',
      payload: {
        id: record.id,
      },
      callback: data => {
        Object.assign(record, {
          expanding: false,
          message: data.message || '<span style="color:#999">暂无数据</span>',
        });
        this.forceUpdate();
      },
    });
  };

  handlerCollapsed = () => {
    const { dispatch, moduleTag } = this.props;
    const { hideSider } = moduleTag;
    dispatch({
      type: 'moduleTag/updateState',
      payload: {
        hideSider: !hideSider,
      },
    });
  };

  renderCollapsedTool = () => {
    const { moduleTag } = this.props;
    const { hideSider, currentModule } = moduleTag;
    return (
      <>
        <ExtIcon
          className="btn-collapsed"
          tooltip={{ title: hideSider ? '显示模块列表' : '收起模块列表' }}
          onClick={this.handlerCollapsed}
          type={hideSider ? 'double-right' : 'double-left'}
          antd
        />
        {get(currentModule, 'name')}
      </>
    );
  };

  handleColumnSearchReset = (dataIndex, clearFilter) => {
    const { dispatch, moduleTag } = this.props;
    const { filter: originFilter } = moduleTag;
    const filter = { ...originFilter };
    Object.assign(filter, { [dataIndex]: '' });
    if (dataIndex === 'tagName') {
      this.startTagName = '';
      this.endTagName = '';
    }
    clearFilter();
    dispatch({
      type: 'moduleTag/updateState',
      payload: {
        filter,
      },
    });
  };

  handlerFitlerTagName = (dataIndex, confirm) => {
    const { dispatch, moduleTag } = this.props;
    const { filter: originFilter } = moduleTag;
    const filter = { ...originFilter };
    if (dataIndex === 'tagName') {
      Object.assign(filter, {
        [dataIndex]:
          !this.startTagName || !this.endTagName ? null : [this.startTagName, this.endTagName],
      });
    }
    confirm();
    dispatch({
      type: 'moduleTag/updateState',
      payload: {
        filter,
      },
    });
  };

  getStartTagNameFilter = () => {
    const { moduleTag } = this.props;
    const { currentModule } = moduleTag;
    const filters = [{ fieldName: 'moduleId', operator: 'EQ', value: get(currentModule, 'id') }];
    if (this.endTagName) {
      filters.push({
        fieldName: 'code',
        operator: 'LE',
        value: this.endTagName,
      });
    }
    return { filters };
  };

  getEndTagNameFilter = () => {
    const { moduleTag } = this.props;
    const { currentModule } = moduleTag;
    const filters = [{ fieldName: 'moduleId', operator: 'EQ', value: get(currentModule, 'id') }];
    if (this.startTagName) {
      filters.push({
        fieldName: 'code',
        operator: 'GE',
        value: this.startTagName,
      });
    }
    return { filters };
  };

  getColumnSearchComponent = (dataIndex, setSelectedKeys, selectedKeys, confirm, clearFilters) => {
    if (dataIndex === 'tagName') {
      const listProps = {
        allowClear: true,
        remotePaging: true,
        searchPlaceHolder: '输入标签名称关键字',
        searchProperties: ['tagName'],
        store: {
          type: 'POST',
          url: `${SERVER_PATH}/sei-manager/tag/getTags`,
        },
        reader: {
          name: 'tagName',
        },
      };
      const startTagName = {
        name: 'startTagName',
        cascadeParams: {
          ...this.getStartTagNameFilter(),
        },
        afterClear: () => {
          this.startTagName = '';
          this.forceUpdate();
        },
        afterSelect: item => {
          this.startTagName = get(item, 'tagName');
          this.forceUpdate();
        },
      };
      const endTagName = {
        name: 'endTagName',
        cascadeParams: {
          ...this.getEndTagNameFilter(),
        },
        afterClear: () => {
          this.endTagName = '';
          this.forceUpdate();
        },
        afterSelect: item => {
          this.endTagName = get(item, 'tagName');
          this.forceUpdate();
        },
      };
      return (
        <div
          style={{
            padding: 24,
            maxHeight: 180,
            height: 180,
            width: 320,
            boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
          }}
        >
          <div className="list-body" style={{ height: 100 }}>
            <div>
              <div style={{ margin: '4px 4px 4px 24px' }}>
                <ComboList
                  value={this.startTagName}
                  placeholder="起始标签"
                  style={{ width: '100%' }}
                  {...listProps}
                  {...startTagName}
                />
              </div>
              <div>到</div>
              <div style={{ margin: '4px 4px 4px 24px' }}>
                <ComboList
                  value={this.endTagName}
                  placeholder="结束标签"
                  style={{ width: '100%' }}
                  {...listProps}
                  {...endTagName}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              height: 42,
              padding: '0 24px',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Button onClick={() => this.handleColumnSearchReset(dataIndex, clearFilters)}>
              重置
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setSelectedKeys(
                  !this.startTagName || !this.endTagName
                    ? null
                    : [this.startTagName, this.endTagName],
                );
                this.handlerFitlerTagName(dataIndex, confirm);
              }}
              style={{ marginLeft: 8 }}
            >
              确定
            </Button>
          </div>
        </div>
      );
    }
  };

  getColumnSearchProps = dataIndex => {
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        this.getColumnSearchComponent(
          dataIndex,
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        ),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => {
            if (this.searchInput) {
              this.searchInput.select();
            }
          });
        }
      },
    };
  };

  getFilter = () => {
    const { moduleTag } = this.props;
    const { filter, currentModule } = moduleTag;
    const filters = [{ fieldName: 'moduleId', operator: 'EQ', value: get(currentModule, 'id') }];
    const tagName = get(filter, 'tagName', null) || null;
    if (tagName && tagName.length === 2 && tagName[0] && tagName[1]) {
      filters.push({ fieldName: 'code', operator: 'GE', value: tagName[0] });
      filters.push({ fieldName: 'code', operator: 'LE', value: tagName[1] });
    }
    return { filters };
  };

  render() {
    const { moduleTag, loading } = this.props;
    const { currentModule, showTagModal, tagData, onlyView, newTag } = moduleTag;
    const columns = [
      {
        title: '标签名称',
        dataIndex: 'tagName',
        width: 320,
        required: true,
        ...this.getColumnSearchProps('tagName'),
      },
      {
        title: '分支',
        dataIndex: 'branch',
        width: 140,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.add}>
            添加标签
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      toolBar: toolBarProps,
      columns,
      lineNumber: false,
      remotePaging: true,
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '输入标签名称关键字',
      showSearch: false,
      searchProperties: ['tagName'],
      searchWidth: 260,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/tag/getTags`,
        loaded: () => {
          this.tableRef.expandedRowKeys = [];
        },
      },
      cascadeParams: {
        ...this.getFilter(),
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
    const formModalProps = {
      showTagModal,
      currentModule,
      tagData,
      onlyView,
      newTag,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['moduleTag/createTag'],
      save: this.save,
      dataLoading: loading.effects['moduleTag/getNewTag'],
    };
    return (
      <div className={cls(styles['user-box'])}>
        <Card
          title={<BannerTitle title={this.renderCollapsedTool()} subTitle="标签列表" />}
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default TagList;
