# Active-Template

### 需求文档


### UI


### 接口文档


### 埋点文档


### 翻译文案


## Project setup

### 更新项目配置

> *可搜索 （TODO: 需要替换）查找需要替换的配置项*

-  更新.gitlab-ci.yml中**S3路径**
-  更新vue.config.js中**pve_cur**
-  更新fest.config.js中**离线包资源路径**
-  如需使用sentry，请检查`src/plugins/sentry`，`src/main.js`，`vue.config.js` 中配置项并替换项目名、dsn等信息



### 安装依赖

```
npm install
```

### 启动本地服务
```
npm run serve
```

### 构建目标
```
npm run build
npm run build:test
npm run build:pre
npm run build:offline
npm run build:insert
```

### 代码检查
```
npm run lint
```

### 生成离线包

```
npm run offlineZip
```

### 上传构建资源及sourceMap到sentry

```
npm run serntry
```

### 打包分析报告

```
npm run report
```

### 查看browserslist范围
https://github.com/browserslist/browserslist
```
npm run browserslist
```



## 功能

### 适配

使用vw+rem

