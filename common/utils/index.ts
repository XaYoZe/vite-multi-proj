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
    navigator.userAgent.match(/lang=(\w+)\b/)?.[1] ||
    navigator.language.split('-')[0] ||
    'en';

  return lang;
};

/**
 * 将对象中的下划线键名转换为驼峰命名法
 *
 * 功能：将对象的键名从 snake_case 转换为 camelCase
 * 支持嵌套对象的递归转换
 *
 * @param obj - 要转换的对象
 * @returns 转换后的新对象，键名使用驼峰命名法
 *
 * @example
 * // 基本用法
 * const obj = { user_name: 'John', user_age: 25 };
 * toCamelCase(obj); // 返回 { userName: 'John', userAge: 25 }
 *
 * @example
 * // 嵌套对象
 * const obj = { user_info: { first_name: 'John', last_name: 'Doe' } };
 * toCamelCase(obj); // 返回 { userInfo: { firstName: 'John', lastName: 'Doe' } }
 *
 * @example
 * // 数组处理
 * const arr = [{ user_name: 'John' }, { user_name: 'Jane' }];
 * toCamelCase(arr); // 返回 [{ userName: 'John' }, { userName: 'Jane' }]
 */
export const toCamelCase = (obj: any): any => {
  // 处理null和undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // 处理基本类型（string, number, boolean）
  if (typeof obj !== 'object' || (Array.isArray(obj) === false && Object.keys(obj).length === 0)) {
    return obj;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  }

  // 处理对象
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    // 将下划线命名转换为驼峰命名
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

    // 递归处理嵌套对象和数组
    if (typeof value === 'object' && value !== null) {
      result[camelKey] = toCamelCase(value);
    } else {
      result[camelKey] = value;
    }
  }

  return result;
};

/**
 * 将对象中的驼峰键名转换为下划线命名法
 *
 * 功能：将对象的键名从 camelCase 转换为 snake_case
 * 支持嵌套对象的递归转换
 *
 * @param obj - 要转换的对象
 * @returns 转换后的新对象，键名使用下划线命名法
 *
 * @example
 * // 基本用法
 * const obj = { userName: 'John', userAge: 25 };
 * toSnakeCase(obj); // 返回 { user_name: 'John', user_age: 25 }
 *
 * @example
 * // 嵌套对象
 * const obj = { userInfo: { firstName: 'John', lastName: 'Doe' } };
 * toSnakeCase(obj); // 返回 { user_info: { first_name: 'John', last_name: 'Doe' } }
 */
export const toSnakeCase = (obj: any): any => {
  // 处理null和undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // 处理基本类型
  if (typeof obj !== 'object' || (Array.isArray(obj) === false && Object.keys(obj).length === 0)) {
    return obj;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => toSnakeCase(item));
  }

  // 处理对象
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    // 将驼峰命名转换为下划线命名
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

    // 递归处理嵌套对象和数组
    if (typeof value === 'object' && value !== null) {
      result[snakeKey] = toSnakeCase(value);
    } else {
      result[snakeKey] = value;
    }
  }
  return result;
};
