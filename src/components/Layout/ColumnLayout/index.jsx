import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import { ScrollBar } from 'suid';
import cls from 'classnames';
import styles from './index.less';

export default class ColumnLayout extends PureComponent {
  renderChildren = () => {
    const { children, title = ['左标题', '右标题'], layout = [10, 14] } = this.props;
    const [leftTitle, rightTitle] = title;
    const [leftSpan, rightSpan] = layout;
    const bordered = false;

    if (!children) {
      return null;
    }

    return []
      .concat(children)
      .map(child => {
        const { slot, slotClassName } = child.props;
        if (['left', 'right'].includes(slot)) {
          if (slot === 'left') {
            return (
              <Col
                key={slot}
                className={cls('layout-col', 'layout-left-col', slotClassName)}
                span={leftSpan}
              >
                <Card
                  className={cls({
                    'no-card-title': !leftTitle,
                  })}
                  title={leftTitle}
                  bordered={bordered}
                >
                  <ScrollBar>{child}</ScrollBar>
                </Card>
              </Col>
            );
          }
          if (slot === 'right') {
            return (
              <Col
                key={slot}
                className={cls('layout-col', 'layout-right-col', slotClassName)}
                span={rightSpan}
              >
                <Card
                  className={cls({
                    'no-card-title': !rightTitle,
                  })}
                  title={rightTitle}
                  bordered={bordered}
                >
                  <ScrollBar>{child}</ScrollBar>
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
    const { className, gutter = 8 } = this.props;

    return (
      <Row gutter={gutter} className={cls(styles['cascade-layout-wrapper'], className)}>
        {this.renderChildren()}
      </Row>
    );
  }
}
