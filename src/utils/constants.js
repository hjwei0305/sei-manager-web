/*
 * @Author: Eason
 * @Date: 2020-02-21 18:03:16
 * @Last Modified by: Eason
 * @Last Modified time: 2020-12-16 16:22:17
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

const WSBaseUrl =
  process.env.NODE_ENV !== 'production'
    ? 'ws://dsei.changhong.com'
    : `ws://${window.location.host}`;

const MANAGER_CONTEXT = `/sei-manager/`;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

/** 新建申请菜单统一入口 */
export const NoMenuNewApply = {
  newApp: {
    id: 'newApp',
    icon: 'appstore',
    title: '应用申请',
    url: '/my-center/apply/application/new',
  },
  newModule: {
    id: 'newModule',
    icon: 'file',
    title: '模块申请',
    url: '/my-center/apply/applicationModule/new',
  },
  publish: {
    id: 'publish',
    icon: 'rocket',
    title: '发版申请',
    url: '/my-center/apply/publish/new',
  },
  deploy: {
    id: 'deploy',
    icon: 'share-alt',
    title: '部署申请',
    url: '/my-center/apply/deploy/new',
  },
};

/** 非菜单页面 */
export const NoMenuPage = {
  'my-apply': {
    id: 'my-apply',
    title: '我的申请单',
    url: '/my-center/apply',
  },
  myTodoList: {
    id: 'myTodoList',
    title: '我的待办',
    url: `/my-center/workTodo?t=ALL`,
  },
  userProfile: {
    id: 'userProfile',
    title: '个人设置',
    url: '/my-center/userProfile',
  },
  // 'my-dashboard-home': {
  //   id: 'my-dashboard-home',
  //   title: '自定义首页',
  //   url: '/sei-dashboard-web/scene/myHome',
  // },
};

export const NoMenuPages = Object.keys(NoMenuPage)
  .map(key => NoMenuPage[key])
  .concat(Object.keys(NoMenuNewApply).map(key => NoMenuNewApply[key]));

const ENV_CATEGORY = {
  dev: { key: 'dev', title: '开发环境' },
  test: { key: 'test', title: '测试环境' },
  prd: { key: 'prd', title: '生产环境' },
};

const LEVEL_CATEGORY = {
  ALL: { key: 'ALL', title: '全部' },
  ERROR: { key: 'ERROR', title: 'ERROR', color: 'red' },
  WARN: { key: 'WARN', title: 'WARN', color: 'orange' },
  INFO: { key: 'INFO', title: 'INFO', color: '' },
  DEBUG: { key: 'DEBUG', title: 'DEBUG', color: 'blue' },
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

const APPLY_STATUS = {
  ALL: { remark: '全部', name: 'ALL', color: '' },
  INITIAL: { remark: '草稿', name: 'INITIAL', color: '' },
  PROCESSING: { remark: '审核中', name: 'PROCESSING', color: 'blue' },
  PASSED: { remark: '审核通过', name: 'PASSED', color: 'green' },
  UNPASSED: { remark: '审核未通过', name: 'UNPASSED', color: 'red' },
};

const JENKINS_STATUS = {
  ALL: { remark: '全部', name: 'ALL', color: '', stepResult: '' },
  FAILURE: { remark: '构建失败', name: 'FAILURE', color: 'red', stepResult: 'error' },
  UNSTABLE: { remark: '不稳定', name: 'UNSTABLE', color: 'orange', stepResult: 'finish' },
  BUILDING: { remark: '构建中', name: 'BUILDING', color: 'blue', stepResult: 'process' },
  ABORTED: { remark: '构建终止', name: 'ABORTED', color: 'magenta', stepResult: 'process' },
  SUCCESS: { remark: '构建成功', name: 'SUCCESS', color: 'green', stepResult: 'finish' },
  UNKNOWN: { remark: '未知', name: 'UNKNOWN', color: 'geekblue', stepResult: 'process' },
  CANCELLED: { remark: '构建取消', name: 'CANCELLED', color: 'purple', stepResult: 'wait' },
  NOT_BUILT: { remark: '未构建', name: 'NOT_BUILT', color: 'cyan', stepResult: 'wait' },
};

const APPLY_ORDER_TYPE = {
  ALL: { remark: '全部', name: 'ALL' },
  APPLICATION: { remark: '应用申请', name: 'APPLICATION' },
  MODULE: { remark: '模块申请', name: 'MODULE' },
  PUBLISH: { remark: '发版申请', name: 'PUBLISH' },
  DEPLOY: { remark: '部署申请', name: 'DEPLOY' },
};

const VERSION_TYPE = {
  BETA: { remark: '公测版', name: 'Beta' },
  RELEASE: { remark: '正式版', name: 'Release' },
};

const TEMPLATE_TYPE = {
  PUBLISH_WEB: 'PUBLISH_WEB',
  PUBLISH_JAVA: 'PUBLISH_JAVA',
  DEPLOY: 'DEPLOY',
};

/**
 * 应用申请功能项操作
 */
const APPLY_APPLICATION_ACTION = {
  EDIT: 'edit',
  DELETE: 'delete',
  VIEW: 'view',
  APPROVE: 'approve',
  STOP_APPROVE: 'stop_approve',
};

const FLOW_OPERATION_TYPE = {
  CANCEL: 'CANCEL',
  REJECT: 'REJECT',
  PASSED: 'PASSED',
};
export default {
  NoMenuPage,
  NoMenuPages,
  NoMenuNewApply,
  APP_BASE,
  LOCAL_PATH,
  SERVER_PATH,
  WSBaseUrl,
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
  APPLY_APPLICATION_ACTION,
  APPLY_STATUS,
  APPLY_ORDER_TYPE,
  FLOW_OPERATION_TYPE,
  JENKINS_STATUS,
  VERSION_TYPE,
  TEMPLATE_TYPE,
};
