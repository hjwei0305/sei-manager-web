import React, { Component } from 'react';
import { Drawer } from 'antd';
import { ScrollBar, ListLoader } from 'suid';

import { findTagById } from '../../service';

class Logs extends Component {
  state = {
    buildLog: '',
    deploymentStatus: 1,
  };

  componentDidMount() {
    const { tag } = this.props;
    if (tag) {
      this.getLogs(0);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.logref);
  }

  findTagById = () => {
    const { tag } = this.props;
    return findTagById({ id: tag.id });
  };

  getLogs = (time = 2000) => {
    this.logref = setTimeout(() => {
      this.findTagById().then(result => {
        const { success, data } = result;
        if (success) {
          const { deploymentStatus, buildLog } = data;
          this.setState(
            {
              buildLog: buildLog || '暂无日志',
              deploymentStatus,
            },
            () => {
              if (this.scrollBarRef) {
                this.scrollBarRef.scrollTop = 100000;
              }
            },
          );
          if (deploymentStatus === 1 || deploymentStatus === 2) {
            this.getLogs();
          }
        }
      });
    }, time);
  };

  render() {
    const { visible, onClose } = this.props;
    const { buildLog, deploymentStatus } = this.state;
    return (
      <Drawer title="实时日志" width={800} visible={visible} onClose={onClose} destroyOnClose>
        <div style={{ height: 'calc(100vh - 110px)', padding: 10, backgroundColor: 'black' }}>
          <ScrollBar containerRef={inst => (this.scrollBarRef = inst)}>
            <pre>{buildLog}</pre>
            {deploymentStatus === 1 || deploymentStatus === 2 ? <ListLoader /> : null}
          </ScrollBar>
        </div>
      </Drawer>
    );
  }
}

export default Logs;
