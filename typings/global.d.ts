import { HandlerList } from '../common/utils/jsBridge';

declare global {
  const API_BASE_URL: string;

  const jsClientBridge: HandlerList;
  interface Window {
    jsClientBridge: HandlerList;
    flutterBridgeCallback: (data: any) => void;
    flutter_inappwebview: {
      callHandler: any;
    };
  }
}

export {};
