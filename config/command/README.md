# Activity 项目模板生成

这个模板生成器基于 `@/src/test/demo` 文件夹结构，使用真正的 **plop** 来创建可配置的 Vue3 项目模板。

## 功能特性

- ✅ 基于 Vue3 + TypeScript + Vite
- ✅ 支持可选的 Vue Router
- ✅ 支持可选的 Vue I18n
- ✅ 支持可选的 Pinia 状态管理
- ✅ 支持 SCSS 样式
- ✅ 包含完整的目录结构（包括空目录）
- ✅ 使用 Handlebars 模板引擎

## 使用方法

### 命令格式：`pnpm run create 目录名:项目名`

```bash
pnpm run create:proj
# or
pnpm run create:proj demo:test
```

## 命令格式详解

### 目录名:项目名 格式

- **目录名**: 项目存放的父目录（如：`demo1`、`demo2`、`demo3`等）
- **项目名**: 具体项目名称（如：`test1`、`test2`等）
- **冒号分隔**: 使用 `:` 分隔目录名和项目名

### 示例

```bash
# 在 demo 目录下创建 test 项目
pnpm run create demo:test
# 结果: src/demo/test/

# 在 test 目录下创建 demo-app 项目，启用 Router 和 I18n
pnpm run create test:demo-app --router --i18n
# 结果: src/test/demo-app/ (包含 router/ 和 i18n/ 目录)
```

## 生成的项目结构

生成的项目将位于 `src/{目录名}/{项目名}/` 目录下：

```
src/
├── {目录名}/
│   └── {项目名}/
│       ├── index.html          # HTML 入口文件
│       ├── index.ts            # TypeScript 入口文件
│       ├── tsconfig.json       # TypeScript 配置
│       ├── layouts/            # 布局组件
│       │   └── index.vue
│       ├── pages/              # 页面组件
│       │   └── index.vue
│       ├── api/                # API 接口
│       │   └── index.ts
│       ├── stores/             # Pinia 状态管理
│       │   └── index.ts
│       ├── assets/             # 静态资源
│       │   ├── images/         # 图片目录（保留空目录）
│       │   └── styles/
│       │       └── style.css
│       ├── public/             # 公共资源目录（保留空目录）
│       ├── router/             # Vue Router (可选)
│       │   └── index.ts
│       └── i18n/               # Vue I18n (可选)
│           ├── index.ts
│           └── locale/
│               ├── en.ts       # 英语
│               ├── in.ts       # 印尼语
│               └── ar.ts       # 阿拉伯语
```

## 模板配置选项

### Router 选项

- 当启用时，会创建 `router/index.ts` 文件并配置基础路由
- 在主入口文件中注册路由
- 在布局组件中使用 `<RouterView />`

### I18n 选项

- 当启用时，会创建 i18n 配置文件和三种语言文件
- 在主入口文件中注册 i18n
- 在页面组件中使用国际化文本

### 空目录保留

- `assets/images/`: 保留空的图片目录，使用 `.gitkeep.hbs` 文件
- `public/`: 保留空的公共资源目录，使用 `.gitkeep.hbs` 文件

## 开发注意事项

1. 生成的项目会自动配置路径别名，包括：
   - `@/` - 指向项目根目录
   - `@api/` - API 接口目录
   - `@stores/` - 状态管理目录
   - `@pages/` - 页面组件目录
   - `@assets/` - 静态资源目录
   - 等等

2. 项目依赖需要在项目根目录的 `package.json` 中确保包含：
   - `vue`
   - `vue-router` (如果启用 Router)
   - `vue-i18n` (如果启用 I18n)
   - `pinia`
   - `typescript`
   - `vite`

## 模板引擎

使用 Handlebars 模板引擎，支持以下语法：

- `{{projectName}}` - 项目名称占位符
- `{{#if useRouter}}...{{/if}}` - Router 条件渲染
- `{{#if useI18n}}...{{/if}}` - I18n 条件渲染

## 文件位置

- 模板文件: `config/templates/activity/**/*.hbs`
- Plopfile 配置: `config/plopfile.js`
- 创建命令脚本: `config/command/create-project.mjs`
- NPM 脚本: `package.json` 中的 `create` 和 `create:activity`

## 错误处理

### 常见错误

1. **格式错误**: `❌ 错误: 请使用 "目录名:项目名" 的格式`
   - 解决: 确保使用 `目录名:项目名` 格式，如 `demo:test`

2. **目录名或项目名为空**: `❌ 错误: 目录名和项目名都不能为空`
   - 解决: 确保目录名和项目名都不为空

3. **文件已存在**: 覆盖现有项目时需要确认
   - 解决: 删除现有项目或使用不同的目录名/项目名

### 帮助信息

运行 `pnpm run create` 或 `npm run create` 不带参数会显示帮助信息。

## 故障排除

### 如果遇到模板解析错误

检查模板文件中的 Handlebars 语法，确保：

- 双引号正确转义：`{{ t(\"key\") }}`
- 条件块格式正确：`{{#if condition}}...{{/if}}`

### 如果 plop 命令不存在

确保已经安装 plop 依赖：

```bash
npm install --save-dev plop
```

### 测试生成的项目

生成的项目应该可以正常运行 Vite 开发服务器：

```bash
cd src/{目录名}/{项目名}
npm run dev
```
