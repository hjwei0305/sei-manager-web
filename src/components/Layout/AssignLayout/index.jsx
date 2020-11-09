import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import cls from 'classnames';
import styles from './index.less';

export default class AssignLayout extends PureComponent {
  renderChildren = () => {
    const {
      children,
      title = ['未分配', '已分配'],
      extra = [null, null],
      layout = [11, 2, 11],
    } = this.props;
    const [leftTitle, rightTitle] = title;
    const [leftSpan, centerSpan, rightSpan] = layout;
    const [leftExtra, rightExtra] = extra;
    const bordered = false;
    if (!children) {
      return null;
    }

    return []
      .concat(children)
      .map(child => {
        const { slot, slotClassName } = child.props;
        if (['left', 'center', 'right'].includes(slot)) {
          if (slot === 'left') {
            return (
              <Col key={slot} className={cls('layout-col', slotClassName)} span={leftSpan}>
                <Card title={leftTitle} bordered={bordered} extra={leftExtra}>
                  {child}
                </Card>
              </Col>
            );
          }
          if (slot === 'center') {
            return (
              <Col
                key={slot}
                className={cls('layout-col', 'layout-col-center', slotClassName)}
                span={centerSpan}
              >
                <div className={cls('opt-wrapper')}>{child}</div>
              </Col>
            );
          }
          if (slot === 'right') {
            return (
              <Col key={slot} className={cls('layout-col', slotClassName)} span={rightSpan}>
                <Card title={rightTitle} bordered={bordered} extra={rightExtra}>
                  {child}
                </Card>
              </Col>
            );
          }
        }

        return null;
      })
      .filter(child => !!child);
  };

  render() {
    const { className } = this.props;

    return (
      <Row className={cls(styles['assign-layout-wrapper'], className)}>{this.renderChildren()}</Row>
    );
  }
}
