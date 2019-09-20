import {genRandomStr} from '@/public/util';

const cst = {
  URL: process.env.API,
  AUTH_APP_ID: '',
  SESSION_ID: (+new Date()) + genRandomStr(16),
  APP_KEY: '',
  APP_TYPE: 'miniapp',
  STAT_KEY: ''
};

export default cst;
