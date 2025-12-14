import { HandlerList } from '../common/utils/jsBridge';
declare global {
  const jsClientBridge: HandlerList;
  interface Window {
    jsClientBridge: HandlerList;
    flutter_inappwebview: {
      callHandler: <T extends keyof HandlerList>(
        method: T,
        params?: HandlerList[T] extends (args: infer P) => any ? P : Record<string, any>
      ) => ReturnType<HandlerList[T]>;
    };
  }
}

export {};
