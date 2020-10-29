/*
 * @Author: Eason
 * @Date: 2020-02-21 18:03:16
 * @Last Modified by: Eason
 * @Last Modified time: 2020-10-29 10:28:47
 */
import { name } from '../../package.json';

/** 服务接口基地址，默认是当前站点的域名地址 */
const BASE_DOMAIN = '/';

/** 网关地址 */
const GATEWAY = 'api-gateway';

/**
 * 非生产环境下是使用mocker开发，还是与真实后台开发或联调
 * 注：
 *    yarn start 使用真实后台开发或联调
 *    yarn start:mock 使用mocker数据模拟
 */
const getServerPath = () => {
  if (process.env.NODE_ENV !== 'production') {
    if (process.env.MOCK === 'yes') {
      return '/mocker.api';
    }
    return '/api-gateway';
  }
  return `${BASE_DOMAIN}${GATEWAY}`;
};

/** 项目的站点基地址 */
const APP_BASE = name;

/** 站点的地址，用于获取本站点的静态资源如json文件，xls数据导入模板等等 */
const LOCAL_PATH = process.env.NODE_ENV !== 'production' ? '..' : `../${APP_BASE}`;

const SERVER_PATH = getServerPath();

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

/** 非菜单页面 */
export const NoMenuPages = [
  // {
  //   id: 'flow-homepage',
  //   url: '/sei-flow-web/homepage',
  //   title: '我的任务',
  //   noClosable: true,
  //   /** 激活刷新 */
  //   activedRefresh: true,
  // },
  {
    id: 'userProfile',
    title: '个人设置',
    url: '/sei-basic-web/userProfile',
    // closeActiveParentTab: true,
  },
];

const ENV_CATEGORY = {
  dev: { key: 'dev', title: '开发' },
  test: { key: 'test', title: '测试' },
  prd: { key: 'prd', title: '生产' },
};

const LEVEL_CATEGORY = {
  ALL: { key: 'ALL', title: '全部' },
  INFO: { key: 'INFO', title: 'INFO', color: '' },
  DEBUG: { key: 'DEBUG', title: 'DEBUG', color: 'blue' },
  ERROR: { key: 'ERROR', title: 'ERROR', color: 'red' },
  FATAL: { key: 'FATAL', title: 'FATAL', color: 'magenta' },
};

/** 日期枚举 */
const SEARCH_DATE_PERIOD = {
  ALL: {
    name: 'ALL',
    remark: '全部',
  },
  THIS_5M: {
    name: 'THIS_5M',
    remark: '近5分钟',
  },
  THIS_30M: {
    name: 'THIS_30M',
    remark: '近半小时',
  },
  THIS_60M: {
    name: 'THIS_60M',
    remark: '近1小时',
  },
  TODAY: {
    name: 'TODAY',
    remark: '今日',
  },
  PERIOD: {
    name: 'PERIOD',
    remark: '指定时间段',
  },
};

const LOG_ACTION = {
  DETAIL: 'detail',
  BY_TRANCE_ID: 'traceId',
};

export default {
  NoMenuPages,
  APP_BASE,
  LOCAL_PATH,
  SERVER_PATH,
  IS_DEVELOPMENT,
  ENV_CATEGORY,
  LEVEL_CATEGORY,
  SEARCH_DATE_PERIOD,
  LOG_ACTION,
};
