declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.sass";
declare module "*.styl";

// @ts-ignore
// eslint-disable-next-line no-unused-vars
declare const process: {
  env: {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt';
    [key: string]: any;
  }
};

// eslint-disable-next-line no-unused-vars
declare const my: {
  getAuthCode: any,
  alert: any,
  showToast: any,
  httpRequest: any,
  request: any,
  redirectTo: any,
  navigateTo: any,
  getSystemInfo: any,
  createAnimation: any,
  createSelectorQuery: any,
  [key: string]: any
};

// eslint-disable-next-line no-unused-vars
declare const getApp: () => any;

// eslint-disable-next-line no-unused-vars
declare const getCurrentPages: () => any;
