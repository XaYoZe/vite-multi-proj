import axios, { type AxiosRequestConfig } from 'axios';
import { getLang } from './index';
import { getToken } from 'UTILS/index';
import { showFailToast } from 'vant';

export type ApiRes<T> = Promise<T>;

// const offsetTime = (new Date().getTimezoneOffset() / 60) * -1;
// const time_zone = `GMT${offsetTime >= 0 ? '+' : ''}${offsetTime}:00`;

const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'app_lang': getLang(),
    'Authorization': `Bearer ${getToken()}`
  }
});

interface LogFormat {
  delay: number;
  request: AxiosRequestConfig;
  response: any;
  error: boolean;
}

/** 方法样式 */
const getMethodTagStyle = (method: string, error: boolean) => {
  let color = '';
  switch (method.toLocaleLowerCase()) {
    case 'get':
      color = '#61affe';
      break;
    case 'post':
      color = '#49cc90';
      break;
    case 'put':
      color = '#fca130';
      break;
    case 'delete':
      color = '#f93e3e';
      break;
    default:
      color = '#61affe';
      break;
  }
  return [
    `background-color: ${color}; color: #fff;padding: 2px 10px;border-radius: 4px 0 0 4px;font-weight: bold;font-size : 13px;`,
    `background-color: ${color}1a; color:#000000aa;padding: 2px 10px;border-radius: 0 4px 4px 0;font-size: 13px;font-weight: bold; margin-right: 5px;`,
    `background-color: ${
      error ? '#ff2222' : '#22cc22'
    }; color: #fff;padding: 2px 10px;border-radius: 4px;font-weight: bold;font-size : 13px;margin-left: 10px;`
  ];
};

/** 格式化日志 */
const logFormat = (options: LogFormat) => {
  console.groupCollapsed(
    `%c${options.request.method?.toLocaleUpperCase()}%c${options.request.url}%c请求${
      options.error ? '失败' : '成功'
    }`,
    ...getMethodTagStyle(options.request.method || 'get', options.error)
  );
  console.log('%c耗时:', 'color:blue', `${options.delay}ms`);
  console.log('%c请求参数:', 'color:blue', options);
  if (options.error) {
    console.info('%c请求失败:', 'color:red', options.response);
  } else {
    console.info('%c请求成功', 'color:green', options.response);
  }
  console.groupEnd();
};

/** 通用请求 */
const apiCommon = <T>(options: AxiosRequestConfig): ApiRes<T> => {
  const startTime = Date.now();
  const headers: AxiosRequestConfig['headers'] = { ...(options?.headers || {}) };
  if (!headers?.['Authorization']) {
    let token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${getToken()}`;
    }
  }
  return request({ ...options, headers })
    .then(res => {
      if (res.status === 200) {
        if (res.data.code === 0) {
          logFormat({
            request: options,
            response: res.data.data,
            error: false,
            delay: Date.now() - startTime
          });
          return res.data.data;
        }
      }
      return Promise.reject(res);
    })
    .catch(err => {
      let errMsg = err.data
        ? `${err.data.key} \n ${err.data.code} \n ${err.data.msg}`
        : `${err.name} \n ${err.code} \n ${err.message}`;
      let errData = err.data || {
        /** 错误码 */
        code: err.code || 9999,
        key: err.name || 'Net Error',
        /** 错误消息 */
        msg: err.message || `${err.status} ${err.statusText}`,
        /** 是否成功 */
        success: false,
        /** 是否失败 */
        fail: true
      };
      /** 弹出错误 */
      showFailToast({
        message: errMsg,
        wordBreak: 'normal'
      });
      logFormat({ request: options, response: err, error: true, delay: Date.now() - startTime });
      return Promise.reject(errData);
    });
};

/** Get 请求 */
export const apiGet = <T>(
  url: string,
  data: any = {},
  headers: AxiosRequestConfig['headers'] = {}
): ApiRes<T> => {
  return apiCommon(
    Object.assign({
      url,
      params: data,
      headers,
      method: 'get'
    })
  );
};
/** Post 请求 */
export const apiPost = <T>(
  url: string,
  data: any = {},
  headers: AxiosRequestConfig['headers'] = {}
): ApiRes<T> => {
  return apiCommon({
    url,
    data,
    headers,
    method: 'post'
  });
};

export default request;
