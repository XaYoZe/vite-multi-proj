import { devTool } from '.';

type JsBridgeRegister<params = undefined, result = undefined> = result extends undefined
  ? params extends undefined
    ? () => void
    : (params: params) => void
  : params extends undefined
    ? (callback: (data: params) => void) => void
    : (params: params, callback: (data: result) => void) => void;

/** 交互方式 */
export interface HandlerList extends Record<string, any> {
  getToken: JsBridgeRegister<
    undefined,
    {
      /** token */
      token: string;
    }
  >;
  generalRouteJump: JsBridgeRegister<{ jumpUrl: string }>;
  closePage: JsBridgeRegister;
}

devTool();

let callbackIndex = 1;
const jsBridgeCallbackCache: Record<string, any> = {};
window.jsClientBridge = new Proxy<HandlerList>({} as HandlerList, {
  get: <T extends string>(target: Partial<HandlerList>, method: T) => {
    if (target[method as string]) {
      return target[method];
    }
    const register: HandlerList[T] = (params: any, callback: any) => {
      if (typeof params === 'function') {
        callback = params;
        params = {};
      }
      const eventParams = {
        action: method.trim(),
        params,
        callbackId: ''
      };
      if (callback) {
        eventParams.callbackId = `${method}_${callbackIndex++}`;
        jsBridgeCallbackCache[eventParams.callbackId] = callback;
      }
      window?.flutter_inappwebview?.callHandler('FlutterBridge', eventParams) ||
        console.log(
          '%cflutter_inappwebview not found',
          'background: #f00;color: #fff;padding: 2px 10px;border-radius: 4px;font-weight: bold;font-size : 13px;'
        );
    };
    return register;
  },
  set: () => {
    return false;
  }
});

interface FlutterBridgeCallbackArgs {
  success: boolean;
  data: any;
  callbackId?: string;
}
/** flutter 回调 */
window.flutterBridgeCallback = (result: FlutterBridgeCallbackArgs) => {
  if (result.callbackId) {
    jsBridgeCallbackCache[result.callbackId]?.(result.data);
  }
};
