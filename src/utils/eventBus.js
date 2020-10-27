/*
 * @Author: zp
 * @Date:   2020-02-13 23:50:48
 * @Last Modified by:   zp
 * @Last Modified time: 2020-02-14 10:42:24
 */
import { EventEmitter } from 'events';

const eventBus = new EventEmitter();
/* eslint no-underscore-dangle: 0 */
window.__portal__ = {
  eventBus,
};

export default eventBus;
