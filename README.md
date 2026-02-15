# 🎮 Relationship Quiz - Y2K Valentine Edition

一个充满 Y2K 复古风格的情侣默契测试应用，使用 AI 生成个性化问题，测试你和 TA 的默契程度。

## ✨ 特性

- 🎨 Y2K 复古像素风格设计
- 🤖 基于 Google Gemini AI 生成个性化测试问题
- 📱 支持双人同时答题
- 🎯 实时计算默契度评分
- 📸 生成可分享的结果图片
- 🔗 支持通过 URL 分享测试结果

## 🚀 快速开始

### 前置要求

- Node.js (推荐 v18+)
- Google Gemini API Key

### 本地运行

1. 克隆仓库
```bash
git clone https://github.com/mathilda20011003/kuku-quiz.git
cd kuku-quiz
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量

在项目根目录创建 `.env.local` 文件，添加你的 Gemini API Key：
```
VITE_GEMINI_API_KEY=your_api_key_here
```

4. 启动开发服务器
```bash
npm run dev
```

5. 在浏览器中打开 `http://localhost:5173`

### 构建部署

```bash
npm run build
```

构建产物将生成在 `dist` 目录。

## 📖 使用说明

1. 输入两人的昵称
2. AI 会生成 5 道个性化测试题
3. 两人分别作答
4. 查看默契度评分和详细分析
5. 生成并分享结果图片

## 🛠 技术栈

- React 19
- TypeScript
- Vite
- Google Gemini AI
- html2canvas (截图功能)

## 📝 相关文档

- [AWS S3 部署指南](./AWS_S3_SETUP_GUIDE.md)
- [分享功能实现说明](./SHARE_IMPLEMENTATION.md)

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
