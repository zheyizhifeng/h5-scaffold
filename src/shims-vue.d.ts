declare const REPLACE_LOG_PVE_CUR;
declare const REPLACE_LOG_EXTRAS;
declare const APP_ENV;

interface Window {
  rem: number;
  shareitBridge: {
    syncInvoke: (portal: string, method: string, params: string) => any;
    asyncInvoke: (portal: string, method: string, blank: string, params: string) => any;
  };
}
declare module "shareit-hybird-js-sdk";

interface Navigator {
  userLanguage?: string;
  browserLanguage?: string;
  systemLanguage?: string;
}
