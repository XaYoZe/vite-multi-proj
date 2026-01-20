export default {
  plugins: {
    'autoprefixer': {},
    'postcss-preset-env': {},
    'postcss-px-to-viewport-8-plugin': {
      unitToConvert: 'px', // 转换的单位
      viewportWidth: 780, // 设计稿宽度
      unitPrecision: 6, // 转换后小数位数
      propList: ['*'], // 转换所有CSS属性
      viewportUnit: 'vw', // 目标单位
      selectorBlackList: ['.no_change_px'], // 排除的类名
      minPixelValue: 1, // 最小转换值
      mediaQuery: true, // 转换媒体查询
      replace: true, // 直接替换属性值
      exclude: [/node_modules/], // 忽略的文件
      landscape: false // 横屏适配
    }
  }
};
