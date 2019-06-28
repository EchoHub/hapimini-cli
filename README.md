# hapimini-cli
支付宝小程序脚手架工具
## 概述
hapimini-cli是一款针对支付宝小程序原生开发框架定制的命令行开发工具。
- 创建自定义组件、页面
- 删除组件、页面功能
- 接入YApi接口管理平台
- 模版创建
## 安装
- npm install hapimini-cli -g
- yarn global add hapimini
## 文档
### 创建工程 init <project>
用于创建项目
### 创建组件模版 -c <name>
用于配置组件模版路径
### 创建组件模版 -p <name>
用于配置页面模版路径
### 创建组件模版 new <name>
用于根据组件模版创建自定义组件目录包括axml、json、acss、js等文件，通过hapi -c 可以设置组件模版的路径。
例如：执行以下命令，则会根据配置的模版路径从"./src/template"目录下去拷贝模版文件
```
hapi -c ./src/template new test
```
### 创建组件模版 create <name>
类似 new 的功能，用于根据页面模版创建页面目录包括axml、json、acss、js等文件，通过hapi -p 可以设置页面模版的路径。
例如：执行以下命令，则会根据配置的模版路径从"./src/template"目录下去拷贝模版文件
```
hapi -p ./src/template create test
```
### 创建组件模版 rm <path>
用于删除指定路径下的文件
例如：执行以下命令，会删除pages/test目录下所有文件
```
hapi rm pages/test
```
### 封装API接口函数 api
根据YApi接口管理工具生成的api.json文件封装成对应的接口函数
- m生成mock数据 
- u xxx.xxx配置forwardUrl
- i 配置索引，根据索引选择需要生产api函数的队列
- f 配置api源文件路径，即api.json路径
例如：执行以下命令，会根据api.json文件封装API函数，且生成对应的mock数据
```
hapi api -m
```
## 