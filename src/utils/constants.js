/*
 * @Author: Eason
 * @Date: 2020-02-21 18:03:16
 * @Last Modified by: Eason
 * @Last Modified time: 2020-11-20 13:32:15
 */
import { name } from '../../package.json';

/** 服务接口基地址，默认是当前站点的域名地址 */
const BASE_DOMAIN = '';

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
  return `${BASE_DOMAIN}`;
};

const MOCKER_PATH = 'http://202.98.157.34:8100/mock/5f98deffbd240382b5a7c400/sei-manager-web';

const CI_SERVER_PATH = 'http://10.4.208.130:7001';

/** 项目的站点基地址 */
const APP_BASE = name;

/** 站点的地址，用于获取本站点的静态资源如json文件，xls数据导入模板等等 */
const LOCAL_PATH = process.env.NODE_ENV !== 'production' ? '..' : `../${APP_BASE}`;

const SERVER_PATH = getServerPath();

const MANAGER_CONTEXT = `/sei-manager/`;
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
  dev: { key: 'dev', title: '开发环境' },
  test: { key: 'test', title: '测试环境' },
  prd: { key: 'prd', title: '生产环境' },
};

const LEVEL_CATEGORY = {
  ALL: { key: 'ALL', title: '全部' },
  INFO: { key: 'INFO', title: 'INFO', color: '' },
  WARN: { key: 'WARN', title: 'WARN', color: 'orange' },
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
    remark: '近30分钟',
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
    remark: '自定义',
  },
};

const LOG_ACTION = {
  DETAIL: 'detail',
  BY_TRANCE_ID: 'traceId',
};

const REQUEST_TYPE = {
  POST: { key: 'POST', color: '#49cc90' },
  GET: { key: 'GET', color: '#61affe' },
  DELETE: { key: 'DELETE', color: '#f93e3e' },
};

const ROLE_VIEW = {
  CONFIG_STATION: 'config-station',
  CONFIG_USER: 'config-user',
  STATION: 'role-station',
  USER: 'role-user',
};

/** 功能类型 */
const FEATURE_TYPE = {
  PAGE: 1,
  OPERATE: 2,
};

const USER_ACTION = {
  RESET_PASSWORD: 'reset-password',
  FEATURE_ROLE: 'feature-role',
};

const USER_BTN_KEY = {
  EDIT: 'USER_EDIT',
  DELETE: 'USER_DELETE',
  ASSIGN_ROLE: 'USER_ASSIGN_ROLE',
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
  MOCKER_PATH,
  MANAGER_CONTEXT,
  REQUEST_TYPE,
  ROLE_VIEW,
  FEATURE_TYPE,
  USER_ACTION,
  CI_SERVER_PATH,
  USER_BTN_KEY,
};
