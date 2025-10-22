# 使用官方 Node.js LTS 镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json & package-lock.json 并安装依赖
COPY package*.json ./
RUN npm install --production

# 复制源代码
COPY server.js ./
COPY src ./src
COPY public ./public

# 创建 images 文件夹
RUN mkdir -p images

# 暴露端口
EXPOSE 3001

# 设置环境变量（可通过 docker run -e 覆盖）
ENV NODE_ENV=production
ENV PORT=3001
ENV COOKIE_SECURE=false

# 启动命令
CMD ["node", "server.js"]
