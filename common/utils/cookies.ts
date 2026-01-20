/**
 * Cookie 通用工具方法
 */

/**
 * Cookie 正则表达式常量
 */
const GET_COOKIE_REGEX = (key: string) =>
  new RegExp(
    '(?:(?:^|.*;)\\s*' +
      encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') +
      '\\s*\\=\\s*([^;]*).*$)|^.*$'
  );
const HAS_COOKIE_REGEX = (key: string) =>
  new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=');

/**
 * 获取指定名称的 cookie 值
 * @param key - cookie 名称
 * @returns cookie 值，如果不存在则返回 undefined
 */
export const getCookie = (key: string): string | undefined => {
  if (!key) return undefined;
  const match = document.cookie.replace(GET_COOKIE_REGEX(key), '$1');
  return match ? decodeURIComponent(match) : undefined;
};

/**
 * 设置 cookie
 * @param key - cookie 名称
 * @param value - cookie 值
 * @param expires - 可选的过期时间
 * @param path - 可选的路径
 * @param domain - 可选的域名
 * @param secure - 可选的安全标志
 * @returns 设置成功返回 true，否则返回 false
 */
export const setCookie = (
  key: string,
  value: string,
  expires?: Date | number | string,
  path?: string,
  domain?: string,
  secure?: boolean
): boolean => {
  if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
    return false;
  }

  let expiresStr = '';
  if (expires !== undefined) {
    if (typeof expires === 'number') {
      expiresStr =
        expires === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + expires;
    } else if (typeof expires === 'string') {
      expiresStr = '; expires=' + expires;
    } else if (expires instanceof Date) {
      expiresStr = '; expires=' + expires.toUTCString();
    }
  }

  document.cookie =
    encodeURIComponent(key) +
    '=' +
    encodeURIComponent(value) +
    expiresStr +
    (domain ? '; domain=' + domain : '') +
    (path ? '; path=' + path : '') +
    (secure ? '; secure' : '');
  return true;
};

/**
 * 检查指定名称的 cookie 是否存在
 * @param key - cookie 名称
 * @returns 存在返回 true，否则返回 false
 */
export const hasCookie = (key: string): boolean => {
  if (!key) return false;
  return HAS_COOKIE_REGEX(key).test(document.cookie);
};

/**
 * 删除指定名称的 cookie
 * @param key - cookie 名称
 * @param path - 可选的路径
 * @param domain - 可选的域名
 * @returns 删除成功返回 true，否则返回 false
 */
export const removeCookie = (key: string, path?: string, domain?: string): boolean => {
  if (!key || !hasCookie(key)) {
    return false;
  }
  document.cookie =
    encodeURIComponent(key) +
    '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
    (domain ? '; domain=' + domain : '') +
    (path ? '; path=' + path : '');
  return true;
};

/**
 * 获取所有 cookie 的键名列表
 * @returns cookie 键名数组
 */
export const cookieKeys = (): string[] => {
  const keys = document.cookie
    .split(';')
    .map(pair => pair.trim().split('=')[0])
    .filter((key): key is string => key != null && key.length > 0);
  return keys.map(decodeURIComponent);
};
