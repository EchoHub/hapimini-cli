# taro-alipay-boilerplate

```
> 基于Taro.js的支付宝小程序开发模版
```

## 安装

```shell
# npm 全局安装 cli
$ npm i -g @tarojs/cli
# 进入项目目录
$ cd ./your_project_directory
# 安装依赖
$ npm i
```



## 目录结构

```
├── config                         配置目录
|   ├── dev.js                     开发环境配置
|   ├── index.js                   默认配置
|   └── prod.js                    生产环境配置
├── src                            源码目录
|   ├── assets                     静态资源目录
|   ├── components                 公共组件目录
|   ├── public                     公共逻辑目录
|   |   |   ├── constant.ts        静态变量
|   |   |   ├── util.ts            公共工具类方法
|   ├── pages                      页面文件目录
|   |   ├── index                  index 页面目录
|   |   |   ├── index.tsx          index 页面逻辑
|   |   |   └── index.scss         index 页面样式
|   ├── app.scss                   项目总通用样式
|   └── app.tsx                    项目入口文件
├── dist                           生产环境代码输出目录
├── dev                            开发环境代码输出目录
├── src                            源码目录
├── .eslintrc                      eslint配置global.d
├── global.d.ts                    ts全局变量声明
└── package.json
    
```



## 使用

```shell
# 开发环境本地运行
npm run dev
# 生产环境打包
npm run build
```
