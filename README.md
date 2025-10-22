# 🖼️ 图床管理系统

一个功能完整、架构清晰的图床管理系统，支持图片上传、管理、预览和删除功能，带有安全的登录认证系统。

## ✨ 功能特性

- 🔐 **安全登录** - 基于环境变量的账号密码认证
- 📤 **图片上传** - 支持单张/批量上传，拖拽上传
- 🖼️ **图片管理** - 查看、预览、删除图片
- 📋 **快速复制** - 一键复制图片链接
- 🗑️ **批量操作** - 批量选择和删除图片
- 🔍 **搜索过滤** - 按文件名搜索图片
- 📊 **统计信息** - 显示图片数量和存储空间
- 📱 **响应式设计** - 完美支持移动端和桌面端
- 🎨 **现代UI** - 美观的界面设计，良好的用户体验
- 🏗️ **清晰架构** - 分层设计，代码组织良好

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 文件为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 服务器端口
PORT=3000

# 基础URL（用于生成图片链接）
BASE_URL=http://localhost:3000

# 管理员账号（必需）
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# Session 密钥（必需，请修改为随机字符串）
SESSION_SECRET=your-random-secret-key-here

# Cookie 安全配置（可选）
# true: 只允许 HTTPS 传输 Cookie（更安全，需要 SSL 证书）
# false: HTTP 和 HTTPS 都可以（更通用，默认值）
COOKIE_SECURE=false

# API Key（可选）
API_KEY=your-api-key-here
```

### 3. 启动服务

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

### 4. 访问管理界面

在浏览器中打开：`http://localhost:3000`

使用配置的管理员账号密码登录。

## 🐳 Docker 部署

### 构建镜像

```bash
docker build -t image-host .
```

### 运行容器

```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/images:/usr/src/app/images \
  -e NODE_ENV=production \
  -e COOKIE_SECURE=false \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=your-password \
  -e SESSION_SECRET=your-secret-key \
  --name image-host \
  image-host
```

## 📖 API 文档

### 管理界面 API

所有管理 API 需要先登录认证。

#### 登录

```http
POST /api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}
```

#### 退出登录

```http
POST /api/logout
```

#### 检查认证状态

```http
GET /api/check-auth
```

#### 获取图片列表

```http
GET /api/images
```

#### 获取统计信息

```http
GET /api/stats
```

#### 上传图片

```http
POST /api/upload
Content-Type: multipart/form-data

files: [图片文件]
```

#### 删除图片

```http
DELETE /api/images/:filename
```

#### 批量删除

```http
POST /api/images/batch-delete
Content-Type: application/json

{
  "filenames": ["file1.png", "file2.jpg"]
}
```

### 外部上传 API

用于外部调用（如 Markdown 编辑器插件）。

```http
POST /upload
Content-Type: application/octet-stream
X-API-Key: your-api-key (如果设置了 API_KEY)

[二进制文件数据]
```

响应：

```json
{
  "success": true,
  "url": "http://localhost:3000/images/xxxxx.png",
  "filename": "xxxxx.png",
  "localPath": "images/xxxxx.png"
}
```

## 📁 项目结构

```
.
├── src/                    # 后端源代码
│   ├── config/             # 配置文件
│   │   ├── env.js          # 环境变量配置
│   │   └── constants.js    # 常量定义
│   ├── middlewares/        # 中间件
│   │   ├── auth.js         # 认证中间件
│   │   ├── upload.js       # 文件上传中间件
│   │   ├── errorHandler.js # 错误处理中间件
│   │   └── requestLogger.js # 请求日志中间件
│   ├── controllers/        # 控制器层
│   │   ├── authController.js   # 认证控制器
│   │   ├── imageController.js  # 图片管理控制器
│   │   └── uploadController.js # 上传控制器
│   ├── services/           # 服务层
│   │   ├── authService.js      # 认证服务
│   │   ├── imageService.js     # 图片管理服务
│   │   └── uploadService.js    # 上传服务
│   ├── routes/             # 路由层
│   │   ├── authRoutes.js       # 认证路由
│   │   ├── imageRoutes.js      # 图片路由
│   │   ├── uploadRoutes.js     # 上传路由
│   │   ├── statsRoutes.js      # 统计路由
│   │   └── index.js            # 路由汇总
│   ├── utils/              # 工具函数
│   │   ├── fileHelper.js       # 文件操作工具
│   │   ├── formatter.js        # 格式化工具
│   │   ├── response.js         # 响应工具
│   │   └── logger.js           # 日志工具
│   └── app.js              # Express 应用配置
├── public/                 # 前端静态文件
│   ├── css/
│   │   └── style.css       # 样式文件
│   ├── js/
│   │   └── app.js          # 前端逻辑
│   ├── index.html          # 主页面
│   └── favicon.ico         # 网站图标
├── images/                 # 图片存储目录
├── server.js               # 服务器入口文件
├── package.json            # 项目配置
├── Dockerfile              # Docker 配置
├── .env.example            # 环境变量示例
└── README.md               # 项目说明
```

## 🏗️ 架构说明

本项目采用分层架构设计，各层职责清晰：

### 后端架构

- **配置层 (config)**: 管理环境变量和常量配置
- **工具层 (utils)**: 提供通用工具函数
- **中间件层 (middlewares)**: 处理请求拦截、认证、日志等
- **服务层 (services)**: 实现核心业务逻辑
- **控制器层 (controllers)**: 处理 HTTP 请求和响应
- **路由层 (routes)**: 定义 API 路由

### 前端架构

- **HTML**: 语义化的页面结构
- **CSS**: 模块化的样式设计
- **JavaScript**: 清晰的前端逻辑

### 数据流

```
客户端请求 
  ↓
路由层 (routes)
  ↓
中间件 (middlewares)
  ↓
控制器 (controllers)
  ↓
服务层 (services)
  ↓
工具层 (utils)
  ↓
返回响应
```

## 🔒 安全建议

1. **修改默认密码** - 生产环境务必修改默认的管理员密码
2. **设置强密码** - 使用强密码保护管理界面
3. **修改 Session 密钥** - 使用随机生成的 SESSION_SECRET
4. **启用 HTTPS** - 生产环境建议使用 HTTPS 协议
5. **限制访问** - 建议配置防火墙或反向代理限制访问
6. **设置 API Key** - 为外部上传接口设置 API Key

## 🔧 环境变量说明

### COOKIE_SECURE

控制 Session Cookie 是否仅通过 HTTPS 传输。

**配置值**：
- `true`: 启用安全模式，Cookie 仅通过 HTTPS 传输（推荐用于有 SSL 证书的生产环境）
- `false`: 兼容模式，HTTP 和 HTTPS 都可以使用（默认值，适用于测试环境或无 SSL 证书的部署）

**使用场景**：

| 场景 | NODE_ENV | COOKIE_SECURE | 说明 |
|------|----------|---------------|------|
| 本地开发 | development | false | 支持 HTTP 访问 |
| 测试服务器（无SSL） | production | false | 支持 HTTP 访问，更通用 ✅ |
| 生产环境（有SSL） | production | true | 只允许 HTTPS，更安全 🔒 |

**Docker 部署示例**：

```bash
# HTTP 环境（无 SSL 证书）- 通用部署
docker run -d \
  -p 3000:3000 \
  -e COOKIE_SECURE=false \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=your-password \
  -e SESSION_SECRET=your-secret-key \
  --name image-host \
  image-host

# HTTPS 环境（配合 Nginx/Caddy）- 安全部署
docker run -d \
  -p 3000:3000 \
  -e COOKIE_SECURE=true \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=your-password \
  -e SESSION_SECRET=your-secret-key \
  --name image-host \
  image-host
```

## 🛠️ 技术栈

### 后端
- **Node.js** - JavaScript 运行时
- **Express** - Web 框架
- **express-session** - 会话管理
- **cookie-parser** - Cookie 解析
- **Multer** - 文件上传处理
- **dotenv** - 环境变量管理

### 前端
- **原生 HTML/CSS/JavaScript** - 无框架依赖
- **现代 CSS** - 渐变、动画、响应式布局

### 开发工具
- **nodemon** - 开发时自动重启

## 📝 开发指南

### 添加新功能

1. 在 `services` 层实现业务逻辑
2. 在 `controllers` 层处理 HTTP 请求
3. 在 `routes` 层定义路由
4. 如需中间件，在 `middlewares` 层添加
5. 更新前端代码以使用新功能

### 代码规范

- 使用 ES6+ 模块语法
- 遵循单一职责原则
- 保持函数简洁，单个函数不超过 50 行
- 添加适当的注释和文档
- 使用有意义的变量和函数名

## 📝 许可证

MIT License

## 🙋 问题反馈

如有问题或建议，欢迎提交 Issue。
