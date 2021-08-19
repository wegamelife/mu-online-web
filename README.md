# 开源奇迹网站

一个容易使用的奇迹私服网站, 该项目基于[nextjs](https://github.com/vercel/next.js)

## 特色

+ 注册
+ 登录
+ 转生
+ 洗点

## 如何使用

1. 请确保你服务器上安装了nodejs
2. 下载该代码
3. 命令行中运行 `npm config set registry https://registry.npm.taobao.org`
4. 打开 CMD 切换到代码根目录运行 `npm install`
5. 运行 `npm run build`
6. 运行 `npm run start`

## 如何修改网站监听端口

请修改 package.json 文件中的 `"start": "next start --port 80"` 这一样