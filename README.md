# vite 多项目仓库

使用 pnpm 进行包管理和运行命令

## 技术栈

- **前端框架**: Vue 3.5.24 + Composition API
- **路由管理**: Vue Router 4.6.3
- **状态管理**: Pinia 3.0.4
- **国际化**: Vue I18n 11.2.2 (支持中文、英语、印尼语、阿拉伯语)
- **构建工具**: Vite 7.2.2
- **类型系统**: TypeScript 5.9.3
- **样式处理**: Sass + PostCSS + Autoprefixer
- **移动端适配**: postcss-px-to-viewport-8-plugin
- **HTTP 客户端**: Axios 1.13.2
- **代码生成**: Plop 4.0.4
- **代码检查**: Vue TSC 3.1.3
- **包管理**: pnpm
- **云存储**: AWS S3 SDK

## 命令行

- `pnpm create:proj 年份:项目名`
  生成新项目，在`src`目录下使用模板生成新的项目，路劲为`/src/年份/项目名`
- `pnpm dev 年份:项目名`
  开发模式，测试环境
- `pnpm dev:prod 年份:项目名`
  开发模式，正式环境
- `pnpm build:test 年份:项目名`
  构建测试环境
- `pnpm build:prod 年份:项目名`
  构建正式环境

## 项目结构

生成的项目将位于 `src/{目录名}/{项目名}/` 目录下：

```
common/
├── assets/                  # 公用样式和图片资源
│   ├── styles/              # 公用样式资源
│   └── images/              # 公用图片资源
└── utils/                   # 公用工具库
    ├── axios.ts             # HTTP 请求封装
    ├── jsBridge.js          # JS Bridge 工具
    └── index.ts             # 工具库入口

config/                      # 配置文件目录
├── *.ts                     # Vite 配置文件
├── postcss.config.js        # PostCSS 配置
├── plugins/                 # Rollup/Vite 插件
├── command/                 # 命令行工具
└── templates/               # 项目模板（activity 模板等）

src/
├── {目录名}/
│   └── {项目名}/
│       ├── index.html       # HTML 入口文件
│       ├── index.ts         # TypeScript 入口文件
│       ├── tsconfig.json    # TypeScript 配置
│       ├── layouts/         # 布局组件
│       │   └── index.vue
│       ├── pages/           # 页面组件
│       │   └── index.vue
│       ├── api/             # API 接口
│       │   └── index.ts
│       ├── stores/          # Pinia 状态管理
│       │   └── index.ts
│       ├── assets/          # 静态资源
│       │   ├── images/      # 图片目录（保留空目录）
│       │   └── styles/
│       │       └── style.css
│       ├── public/          # 公共资源目录（保留空目录）
│       ├── router/          # Vue Router (可选)
│       │   └── index.ts
│       └── i18n/            # Vue I18n (可选)
│           ├── index.ts
│           └── locale/
│               ├── en.ts    # 英语
│               ├── in.ts    # 印尼语
│               └── ar.ts    # 阿拉伯语

types/                       # 类型定义文件
└── *.d.ts                   # TypeScript 类型声明
```
