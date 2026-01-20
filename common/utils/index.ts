import { getCookie } from './cookies';

/** 获取客户端环境
 * token
 * Authorization
 * app_lang app语言
 * pkg 报名
 * ver 版本
 * device 设备
 * platform 平台
 * platform_ver 平台版本
 * sys_lan 系统语言
 * device_lang 设备语言
 * device_country 设备国家
 * time_zone 时区
 */
export const ENV = {
  /** token */
  token: getCookie('token'),
  /** Authorization */
  Authorization: getCookie('Authorization'),
  /** app语言 */
  appLang: getCookie('app_lang'),
  /** 报名 */
  pkg: getCookie('pkg'),
  /** 版本 */
  ver: getCookie('ver'),
  /** 设备 */
  device: getCookie('device'),
  /** 平台 */
  platform: getCookie('platform'),
  /** 平台版本 */
  platformVer: getCookie('platform_ver'),
  /** 系统语言 */
  sysLan: getCookie('sys_lan'),
  /** 设备语言 */
  deviceLang: getCookie('device_lang'),
  /** 设备国家 */
  deviceCountry: getCookie('device_country'),
  /** 时区 */
  timeZone: getCookie('time_zone')
};

/** 解析 URL 参数 **/
export const urlParams = (url: string = location.href): Record<string, string> => {
  let searchParams: Record<string, string> = {};
  let searchArr: string[] = [];
  let splitText = url.split('#');
  if (typeof url != 'string' || !url.trim()) return searchParams;
  splitText.forEach(item => {
    let [_, search] = item.split('?');
    search && searchArr.push(search);
  });
  if (searchArr.length) {
    let urlSearchParams = new URLSearchParams(searchArr.join('&'));
    urlSearchParams.forEach((value, key) => {
      searchParams[key] = value;
    });
  }

  return searchParams;
};

/** 获取当前浏览器语言 */
export const getLang = () => {
  const search = window.location.search;
  const params = urlParams(search);
  const lang =
    params.lang ||
    ENV.appLang ||
    navigator.userAgent.match(/lang=(\w+)\b/)?.[1] ||
    navigator.language.split('-')[0] ||
    'en';
  if (['en', 'hi'].includes(lang)) {
    return lang;
  }
  return 'en';
};

/** token */
let userToken = urlParams().key || localStorage.getItem('_key_') || ENV.token || '';

/** 设置用户token */
export const setToken = (token: string) => {
  userToken = token;
};
/** 获取用户token */
export const getToken = () => {
  return userToken;
};

/** 复制到剪贴板 */
export const copyToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.readOnly = true;
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

/** 加载调试工具 */
export const devTool = async () => {
  if (urlParams().debug && ENV.token) {
    try {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/eruda';
        document.body.appendChild(script);
        script.onload = function () {
          (window as any).eruda.init();
          resolve(true);
        };
        script.onerror = function (e) {
          reject(e);
        };
      });
    } catch (error) {}
  }
  console.log('构建时间:', __BUILD_TIME__);
  console.log('构建项目:', __PROJECT__);
  console.log('应用语言:', getLang());
  try {
    if (typeof userToken === 'string' && userToken) {
      let jwt = userToken?.split('.')[1] || '';
      const json = JSON.parse(atob(jwt));
      console.log('用户ID:', json.sub);
    }
  } catch (error) {}
};


/**
 * 获取图片并转化成 ArrayBuffer
 * @param url 图片地址
 * @returns
 */
export function getImgBuffer(url: string) {
  if (!url) return;
  return new Promise(async resolve => {
    if (Object.prototype.toString.call(window.fetch) === '[object Function]') {
      const reader = new FileReader();
      const blob = await fetch(url).then(res => res.blob());
      reader.readAsArrayBuffer(blob);
      reader.onload = () => {
        resolve(reader.result);
      };
    } else {
      // 兼容fetch函数
      const fetchObj = window.XMLHttpRequest
        ? new XMLHttpRequest()
        : new (window as any).ActiveXObject('fetch');

      fetchObj.open('GET', url, true);
      fetchObj.send(null);
      fetchObj.responseType = 'arraybuffer';
      fetchObj.onreadystatechange = () => {
        if (fetchObj.readyState === 4 && fetchObj.status == 200) {
          resolve(fetchObj.response);
        }
      };
    }
  });
}