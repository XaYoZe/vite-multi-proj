export interface HandlerList extends Record<string, any> {
  initData: () => Promise<{
    /** token */
    token: string
    /** 客户端版本 */
    version: string
    /** 语言 */
    language: string
    /** 用户id */
    userId: string
    /** 用户短id */
    userNum: string
    /** 用户名 */
    userName: string
    /** 用户头像 */
    userAvatar: string
  }>
}

// window.jsClientBridge =  new JsClientBridge();
window.jsClientBridge =  new Proxy<HandlerList>({} as HandlerList, {
  get: <T extends string>(target: Partial<HandlerList>, method:T)=> {
    if (target[method as string]) {
      return target[method]
    }
    return (params: (HandlerList[T] extends (args: infer P) => any ? P : Record<string, any>)) => window.flutter_inappwebview?.callHandler(method, params) || Promise.reject('flutter_inappwebview not found')
  },
  set: () => {
    return false
  }
});
