interface ViteTypeOptions {
  // 添加这行代码，你就可以将 ImportMetaEnv 的类型设为严格模式，
  // 这样就不允许有未知的键值了。
  // strictImportMetaEnv: unknown
}

// 环境变量...
interface ImportMetaEnv {
  readonly API_BASE_URL: string;
  readonly CDN_URL: string;
}

// 全局变量声明
declare const __BUILD_TIME__: string;
declare const __PROJECT__: string;
declare const __VUE_PROD_DEVTOOLS__: boolean;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
