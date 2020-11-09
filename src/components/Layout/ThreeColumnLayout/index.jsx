import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import cls from 'classnames';
import { ScrollBar } from 'suid';
import styles from './index.less';

export default class ThreeColumnLayout extends PureComponent {
  renderChildren = () => {
    const { children, title = ['左标题', '中间标题', '右标题'], layout = [8, 8, 8] } = this.props;
    const [leftTitle, centerTitle, rightTitle] = title;
    const [leftSpan, centerSpan, rightSpan] = layout;
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
          if (slot === 'center') {
            return (
              <Col
                key={slot}
                className={cls('layout-col', 'layout-center-col', slotClassName)}
                span={centerSpan}
              >
                <Card
                  className={cls({
                    'no-card-title': !centerTitle,
                  })}
                  title={centerTitle}
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
      <Row gutter={gutter} className={cls(styles['three-column-layout-wrapper'], className)}>
        {this.renderChildren()}
      </Row>
    );
  }
}
