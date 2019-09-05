# qqmusic

> A Vue.js project 通过解析qq音乐api
>完成部分：

         1 歌手 
         2 排行 
         3 首页 
         4 推荐随机歌曲 
         5 歌手列表 
         6 歌曲播放 
         7 歌曲切换 
>未完成部分：电台

## 基于Vue的高仿QQ音乐webapp
## 技术栈：vue vuex axios rem适配 flex布局
## 内含打包好的apk安装包，可下载在手机上演示,想学习如何打包成apk装包在手机上调试，可直接Issue
## PC端
>
1 npm install下载依赖 
2 npm run dev 或 npm start 
3 打包：npm run build 
4 chrome f12查看
## 配置跨域获取QQ音乐数据接口
>1 在config/index.js中配置
    proxyTable: {
      '/api':{
        target:'https://c.y.qq.com/',
        bypass: function (req, res, proxyOptions) {
          req.headers.referer = 'https://c.y.qq.com';
          req.headers.host = 'c.y.qq.com';
        },
        changeOrigin:true,
        secure:true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
>2 在main.js,配置全局的公共请求参数params,在axios请求数据时公共参数this.basicParams,也可以自己全部写入
    Vue.prototype.basicParams = {
        g_tk: 1604785682,
        uin: 494873674, // qq acount
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform:'h5',
        needNewCode: 0,
        _: new Date().getTime()
    }
    比如：
    params:{
        g_tk: 1604785682,
        uin: 494873674, // qq acount
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform:'h5',
        needNewCode: 0,
        _: new Date().getTime(),
        guid:'21231'
    }
    可以写成：
    params:{
        ...this.basicParams,
        guid:'21231'
    }
>3 在组件内axios请求
  比如：
    axios({
        method:'get',
        url:'/api/v8/fcg-bin/v8.fcg',(实际地址：https://c.y.qq.com/v8/fcg-bin/v8.fcg)
        params:{
        ...this.basicParams,
        page: 'list',
        channel: 'singer',
        pagesize: 100,
        hostUin: 0,
        pagenum: 1,
        key: 'all_all_all',
        hostUin:0
        }
    }).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
## QQ音乐数据接口API
>1 首页轮播图数据api:
    axios({
        method:'get',
        url:'/api/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
        params:this.basicParams
    }).then(res => {

    }).catch(err => {

    })
>2 首页热门推荐数据api:
    axios({
        url:'/api/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
        method:'get',
        params:{
            g_tk: 1604785682,
            uin: 494873674, // qq acount
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform:'h5',
            needNewCode: 0,
            _: new Date().getTime(),
            tpl:3,
            page:'detail',
            type:'top',
            topid:36
        }
    }).then(res => {

    }).catch(err => {
        
    })
>3 歌手列表api:
    axios({
        method:'get',
        url:'/api/v8/fcg-bin/v8.fcg',
        params:{
        g_tk: 1604785682,
        uin: 494873674,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform:'h5',
        needNewCode: 0,
        _: new Date().getTime(),
        page: 'list',
        channel: 'singer',
        pagesize: 100,
        hostUin: 0,
        pagenum: 1,
        key: 'all_all_all',
        hostUin:0
        }
    }).then(res => {
       
    }).catch(err => {

    })
>4 旁行榜列表api:
    axios({
        method:'get',
        url:'/api/v8/fcg-bin/fcg_myqq_toplist.fcg',
        params:this.basicParams
    }).then(res => {
        
    }).catch(err => {

    })
5 获取音乐播放地址的具体方法就不说了，需要获取vkey,可以查看源码。(不好解释)
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
