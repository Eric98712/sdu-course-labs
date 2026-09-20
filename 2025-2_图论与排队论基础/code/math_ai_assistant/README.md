# 数学考研助手 ∞

基于 Coze API 的数学考研智能助手 Web 应用，支持文字输入和图片识别，流式展示 AI 回复。

## 功能特性

- **文字提问**：输入数学问题，AI 流式返回解答
- **图片识别**：上传数学题图片，AI 识别并解答
- **LaTeX 公式渲染**：实时渲染行内和块级数学公式
- **会话管理**：多会话支持，历史记录本地存储
- **数学主题 UI**：深色学术风格，丰富的数学装饰元素

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Token

点击右上角齿轮图标，在设置面板中输入你的 Coze API Token。

> Token 仅存储在浏览器本地 localStorage 中。

### 3. 启动开发服务器

```bash
npm run dev
```

浏览器访问 `http://localhost:5173` 即可使用。

### 4. 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录下。

## 技术栈

- **React 18** + **TypeScript**
- **Vite** 构建工具
- **Tailwind CSS** 样式框架
- **KaTeX** 公式渲染
- **Lucide React** 图标库

## 项目结构

```
src/
├── components/       # UI 组件
│   ├── Navbar.tsx         # 顶部导航栏
│   ├── Sidebar.tsx        # 侧边栏
│   ├── ChatArea.tsx       # 聊天区域
│   ├── MessageBubble.tsx  # 消息气泡
│   ├── InputArea.tsx      # 输入区域
│   ├── ImagePreview.tsx   # 图片预览
│   ├── SettingsModal.tsx  # 设置面板
│   ├── WelcomeScreen.tsx  # 欢迎界面
│   ├── LoadingDots.tsx    # 加载动画
│   └── MathBackground.tsx # 数学背景
├── hooks/            # 自定义 Hooks
│   ├── useChat.ts         # 聊天逻辑
│   └── useSession.ts      # 会话管理
├── utils/            # 工具函数
│   ├── api.ts             # API 调用
│   ├── image.ts           # 图片处理
│   ├── latex.ts           # LaTeX 渲染
│   └── storage.ts         # 本地存储
├── types/            # TypeScript 类型
├── App.tsx           # 主应用组件
├── main.tsx          # 入口文件
└── index.css         # 全局样式
```

## API 说明

应用通过 Vite 代理将 `/api/coze/*` 请求转发到 `https://9vr2hrvydc.coze.site`。如需修改代理目标，编辑 `vite.config.ts` 中的 `server.proxy` 配置。

## 注意事项

- API Token 请妥善保管，勿提交到代码仓库
- 上传图片建议小于 5MB，应用会自动压缩至 1024px 以内
- 生产部署时请配置反向代理以隐藏 API 地址
