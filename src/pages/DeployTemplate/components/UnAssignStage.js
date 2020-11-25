import React, { Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, Input, Drawer } from 'antd';
import { ListCard } from 'suid';
import { constants } from '@/utils';
import styles from './UnAssignStage.less';

const { SERVER_PATH } = constants;
const { Search } = Input;

class UnAssignStages extends Component {
  static listCardRef;

  static propTypes = {
    selectedTemplate: PropTypes.object.isRequired,
    showAssign: PropTypes.bool,
    closeAssignStages: PropTypes.func,
    assignStages: PropTypes.func,
    assignLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  assignStages = () => {
    const { assignStages } = this.props;
    const { selectedRowKeys: childIds } = this.state;
    if (assignStages) {
      assignStages(childIds);
    }
  };

  handlerClose = () => {
    const { closeAssignStages } = this.props;
    if (closeAssignStages) {
      closeAssignStages();
    }
  };

  handlerSelectRow = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  onCancelAssigned = () => {
    this.setState({
      selectedRowKeys: [],
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

  renderCustomTool = () => {
    const { selectedRowKeys } = this.state;
    const { assignLoading } = this.props;
    return (
      <>
        <Button
          type="primary"
          onClick={this.assignStages}
          loading={assignLoading}
          disabled={selectedRowKeys.length === 0}
        >
          {`确定( ${selectedRowKeys.length} )`}
        </Button>
        <Search
          placeholder="输入阶段名称、阶段描述关键字"
          onChange={e => this.handlerSearchChange(e.target.value)}
          onSearch={this.handlerSearch}
          onPressEnter={this.handlerPressEnter}
          style={{ width: 240 }}
        />
      </>
    );
  };

  render() {
    const { showAssign, selectedTemplate } = this.props;
    const listCardProps = {
      showSearch: false,
      onSelectChange: this.handlerSelectRow,
      searchProperties: ['name', 'remark'],
      checkbox: true,
      itemField: {
        title: item => item.name,
        description: item => item.remark,
      },
      store: {
        url: `${SERVER_PATH}/sei-manager/deployTemplateStage/getUnassigned`,
      },
      cascadeParams: {
        parentId: get(selectedTemplate, 'id'),
      },
      onListCardRef: ref => (this.listCardRef = ref),
      customTool: this.renderCustomTool,
    };
    return (
      <Drawer
        width={460}
        destroyOnClose
        getContainer={false}
        placement="right"
        visible={showAssign}
        title="可以使用的阶段"
        className={cls(styles['user-item-box'])}
        onClose={this.handlerClose}
        style={{ position: 'absolute' }}
      >
        <ListCard {...listCardProps} />
      </Drawer>
    );
  }
}

export default UnAssignStages;
