# memory_capsule

> this is a project that stores your memory,someday in the future, somewhere to evoke your  memories
# 项目简介
``` bash
这是一个储存你记忆的项目，在将来的某一天，在某个地方唤起你的记忆。

本项目主要用于记录用户在某一时间，某一点的的生活思绪，我把这个称作记忆胶囊。虽然朋友圈，QQ控件也能做到这一点。但是本项项目引入了地图，以地图的形式来做记忆回放的媒介，可以让用户更直观的知道自己在何时何地有何种情绪，以便于用户更好的回归之前的感受。通过拖动地图来寻找用户自己的和他人的记忆胶囊，当地图被拖动，从新获取地图中心店，获取中心点位置，然后拉取该点1000米范围内的所有的记忆胶囊。用户通过点击地图上的用户头像标记来查看详情。本来准备做成用户仅能查询自己的记忆胶囊，但是感觉缺少趣味性，所以就做成了可以查看所有人的记忆胶囊。也许在未来的某一天，你打开本项目，突然发现在某个时间，某一地点，竟然后某一陌生人有了同样的想法和情绪。哈哈哈，这也是莫大的缘分吧。

```

# 所用技术
``` bash
前端主要采用vue全家桶，高德地图，h5, es6, css3, less, cube-ui,前后端通讯采用的是axios
后端采用的是node + express
用户登录信息缓存采用的是 express-session
图片上传采用的是node插件 multer
服务自动重启采用的是nodemon
数据库采用的是mysql
```
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
