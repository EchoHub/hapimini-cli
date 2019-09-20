import cst from "@/public/constant";
import {showErrorNotify} from "@/public/util";

export let Uid = '';
export let Token = '';
export let UserId = '';
/**
 * 原生请求方法
 */
export const nativeRequest = my.request || my.httpRequest;

export function auth() {
  return new Promise((resolve, reject) => {
    my.getAuthCode({
      scopes: 'auth_base',
      fail: reject,
      success(res) {
        nativeRequest({
          url: cst.URL + '/alipay/auth',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            source: 'steps',
            authCode: res.authCode
          },
          success(res) {
            const result = res.data;

            if (result.data.user) {
              Uid = result.data.user.uid;
              UserId = result.data.user.userId;
            }
            Token = result.data.token;
            resolve(result);
          },
          fail: reject
        });
      }
    })
  })
}
/**
 * 请求方法封装
 */
interface RequestArgs {
  path?: string,
  data?: any,
  headers?: {
    [key: string]: any
  }
  method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT',
  [key: string]: any
}

export default function request (
  {
    path = '',
    headers = {},
    method = 'POST',
    ...args
  }: RequestArgs): Promise<any> {
  return new Promise((resolve, reject) => {
    const failCallback = e => {
      const errorMessage = e && e.msg ? e.msg : '请求错误';

      if (reject) {
        reject({
          e,
          showErrorNotify: () => showErrorNotify(errorMessage)
        });
      } else {
        showErrorNotify(errorMessage)
      }
    };
    const successCallback = res => {
      const data = res.data;

      data && data.success ? resolve(data) : failCallback(data)
    };
    const params = {
      method,
      headers,
      url: cst.URL + path,
      success: successCallback,
      fail: failCallback,
      ...args
    };

    if (Token) params.headers['token'] = Token;

    my.request(params);
  });
}
