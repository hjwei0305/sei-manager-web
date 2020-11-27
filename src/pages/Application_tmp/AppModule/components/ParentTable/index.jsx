import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Popconfirm, Input } from 'antd';
import { utils, ExtIcon, ListCard } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { CI_SERVER_PATH } = constants;
const { authAction } = utils;
const { Search } = Input;

@connect(({ appModule, loading }) => ({ appModule, loading }))
class CascadeTableMaster extends Component {
  static listCardRef;

  state = {
    delRowId: null,
  };

  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'appModule/updatePageState',
      payload: {
        pVisible: true,
        isAddP: true,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appModule/updatePageState',
      payload: {
        pVisible: true,
        isAddP: false,
        currPRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appModule/saveParent',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'appModule/updatePageState',
          payload: {
            pVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = (record, e) => {
    e.stopPropagation();
    const { dispatch, appModule } = this.props;
    const { currPRowData } = appModule;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'appModule/delPRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currPRowData && currPRowData.id === record.id) {
              dispatch({
                type: 'appModule/updatePageState',
                payload: {
                  currPRowData: null,
                },
              }).then(() => {
                this.setState({
                  delRowId: null,
                });
              });
            } else {
              this.setState({
                delRowId: null,
              });
            }
            this.reloadData();
          }
        });
      },
    );
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appModule/updatePageState',
      payload: {
        pVisible: false,
      },
    });
  };

  handleQuickCreate = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appModule/updatePageState',
      payload: {
        isQuickCreate: true,
      },
    });
  };

  getFormModalProps = () => {
    const { loading, appModule } = this.props;
    const { pVisible, currPRowData, isAddP } = appModule;

    return {
      onSave: this.save,
      rowData: isAddP ? null : currPRowData,
      visible: pVisible,
      onCancel: this.closeFormModal,
      isSaving: loading.effects['appModule/saveParent'],
    };
  };

  reloadData = () => {
    if (this.listCardRef) {
      this.listCardRef.remoteDataRefresh();
    }
  };

  handlerAppSelect = (keys, items) => {
    const { dispatch } = this.props;
    const currPRowData = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'appModule/updateState',
      payload: {
        currPRowData,
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

  renderCustomTool = () => (
    <>
      <div>
        {authAction(
          <Button type="primary" ignore="true" onClick={this.handleQuickCreate}>
            新建
          </Button>,
        )}
      </div>
      <Search
        allowClear
        placeholder="输入名称关键字查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: 180 }}
      />
    </>
  );

  renderItemAction = item => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    return (
      <>
        <div className="tool-action" onClick={e => e.stopPropagation()}>
          <ExtIcon
            className={cls('action-item')}
            type="edit"
            antd
            onClick={e => this.edit(item, e)}
          />
          {item.frozen ? null : (
            <Popconfirm
              title={formatMessage({
                id: 'global.delete.confirm',
                defaultMessage: '确定要删除吗?',
              })}
              onConfirm={e => this.del(item, e)}
            >
              {loading.effects['featureRole/delFeatureRole'] && delRowId === item.id ? (
                <ExtIcon className={cls('del', 'action-item')} type="loading" antd />
              ) : (
                <ExtIcon className={cls('del', 'action-item')} type="delete" antd />
              )}
            </Popconfirm>
          )}
        </div>
      </>
    );
  };

  render() {
    const { appModule } = this.props;
    const { currPRowData } = appModule;
    const selectedKeys = currPRowData ? [currPRowData.id] : [];
    const listCardProps = {
      className: 'left-content',
      showSearch: false,
      onSelectChange: this.handlerAppSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      selectedKeys,
      itemField: {
        title: item => item.name,
        description: item => item.code,
      },
      store: {
        url: `${CI_SERVER_PATH}/appModule/findAll`,
      },
      itemTool: this.renderItemAction,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ListCard {...listCardProps} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default CascadeTableMaster;
