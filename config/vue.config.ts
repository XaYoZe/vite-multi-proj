import type { Options as VuePluginOptions } from "@vitejs/plugin-vue";

/**
 * @vitejs/plugin-vue 常用配置项
 * 文档: https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue
 */
export const vuePluginOptions: VuePluginOptions = {
  /**
   * 包含需要作为 Vue SFC 处理的文件
   * 默认: /\.vue$/
   */
  include: /\.vue$/,

  /**
   * 排除不需要处理的文件
   */
  // exclude: /node_modules/,

  /**
   * 是否将 Vue 模板编译为 render 函数时保留注释
   * 默认: false
   */
  isProduction: false,

  /**
   * template 编译选项
   */
  template: {
    /**
     * 编译器选项
     */
    compilerOptions: {
      /**
       * 自定义元素白名单，匹配的标签不会被当作 Vue 组件解析
       * 适用于 Web Components
       */
      isCustomElement: (tag) => tag.startsWith("custom-"),

      /**
       * 是否保留模板中的注释
       * 默认: false
       */
      comments: false,

      /**
       * 是否保留模板中的空白字符
       * 'preserve': 保留所有空白
       * 'condense': 压缩空白（默认）
       */
      whitespace: "condense",
    },

    /**
     * 自定义模板转换器
     * 可用于处理自定义块或预处理模板
     */
    transformAssetUrls: {
      video: ['src', 'poster'],
      source: ['src'],
      img: ['src'],
      image: ['xlink:href', 'href'],
      use: ['xlink:href', 'href'],
    },
  },

  /**
   * script 块配置
   */
  script: {
    /**
     * 启用响应式语法糖（实验性）
     * 注意: Vue 3.4+ 已移除此特性
     */
    // reactivityTransform: false,

    /**
     * 启用 defineModel 宏
     * Vue 3.3+ 已默认启用
     */
    defineModel: true,

  },

  /**
   * style 块配置
   */
  style: {
    /**
     * 是否去除样式中的空白
     */
    // trim: true,
  },

  /**
   * 功能标志
   * 用于启用/禁用某些 Vue 特性
   */
  features: {
    /**
     * 启用 options API
     * 如果只使用 Composition API，可设为 false 减少打包体积
     */
    optionsAPI: true,

    /**
     * 启用 prod devtools
     * 生产环境下是否允许 devtools
     */
    // prodDevtools: false,


    /**
     * 启用 prod hydration mismatch 详情
     */
    prodHydrationMismatchDetails: false,

    /**
     * 自定义块处理
     * 例如处理 <i18n> 块
     */
    customElement: false,
    
    /**
     * 启用 propsDestructure
     * 允许在 defineProps 中使用解构
     */
    propsDestructure: true,
  },
};

export default vuePluginOptions;
