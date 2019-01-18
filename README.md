# SSR
#什么是服务器端渲染 (SSR)？
----
Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

服务器渲染的 Vue.js 应用程序也可以被认为是"同构"或"通用"，因为应用程序的大部分代码都可以在**服务器**和**客户端**上运行。
#为什么使用服务器端渲染 (SSR)？
----

与传统 SPA (单页应用程序 (Single-Page Application)) 相比，服务器端渲染 (SSR) 的优势主要在于：
* 更好的 SEO，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。
* 更快的内容到达时间 (time-to-content)，特别是对于缓慢的网络情况或运行缓慢的设备。无需等待所有的 JavaScript 都完成下载并执行，才显示服务器渲染的标记，所以你的用户将会更快速地看到完整渲染的页面。通常可以产生更好的用户体验，并且对于那些「内容到达时间(time-to-content) 与转化率直接相关」的应用程序而言，服务器端渲染 (SSR) 至关重要。

使用服务器端渲染 (SSR) 时还需要有一些权衡之处：
* 开发条件所限。浏览器特定的代码，只能在某些生命周期钩子函数 (lifecycle hook) 中使用；一些外部扩展库 (external library) 可能需要特殊处理，才能在服务器渲染应用程序中运行。
* 涉及构建设置和部署的更多要求。与可以部署在任何静态文件服务器上的完全静态单页面应用程序 (SPA) 不同，服务器渲染应用程序，需要处于 Node.js server 运行环境。
* 更多的服务器端负载。在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用 CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 (high traffic) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。
# 服务器端渲染 vs 预渲染 (SSR vs Prerendering)
----
如果你调研服务器端渲染 (SSR) 只是用来改善少数营销页面（例如 /, /about, /contact 等）的 SEO，那么你可能需要预渲染。无需使用 web 服务器实时动态编译 HTML，而是使用预渲染方式，在构建时 (build time) 简单地生成针对特定路由的静态 HTML 文件。优点是设置预渲染更简单，并可以将你的前端作为一个完全静态的站点。

## 项目（一）
----
在项目一中我们创建一个最原始的SSR项目，便于理解SSR的原理

首先创建一个文件夹ssr，然后进入ssr
```
$ cd ssr
$ npm init
```
创建server文件夹，创建一个app.js文件，下载相应的插件
```
$ npm i vue
$ npm i vue-server-renderer
$ npm i express
# vue  vue-server-renderer 版本要一致
```
app.js文件内容为：
```
/**** app.js ***/

//创建一个 Vue 实例
const Vue = require('vue');
const express = require('express')();
const app = new Vue({
  template: `<div>Hello World</div>`
});

//创建一个renderer
const renderer = require('vue-server-renderer').createRenderer();

//相应路由请求
express.get('/', (req, res) => {
  //将Vue实例渲染为HTML
  renderer.renderToString(app, (err, html) => {
    if (err) throw err;
    console.log("==html==", html);
    res.send(
      `
       <!DOCTYPE html>
       <html lang="en">
          <head>
             <meta charset="UTF-8"></meta>
             <title>SSR渲染页面1</title>
          </head>
          <body>
             ${html}
          </body>
       </html>
      `
    );
  });

   //在 2.5.0 + ,如果没有传入回调函数，则会返回 Promise
   // renderer.renderToString(app).then(html => {
   //   console.log(html);
   //   res.send(
   //     `
   //     <!DOCTYPE html>
   //     <html lang="en">
   //        <head>
   //           <meta charset="UTF-8"></meta>
   //           <title>SSR渲染页面1</title>
   //        </head>
   //        <body>
   //           ${html}
   //        </body>
   //     </html>
   //    `
   //   );
   // }).catch(err => {
   //  console.log(err);
  //});
});

//服务器监听地址
express.listen(8082, () => {
  console.log('服务器已启动');
});

```
ssr文件夹目录结构：
```
/* ssr目录结构 */
| - node_modules
  - package.json
  - package-lock.json
  - server
     |  -app.js
```
启动服务：
```
$ node app
```
打开浏览器，地址栏输入：
```
http://localhost:8082
```
我们可以看到，页面加载成功：
![image.png](https://upload-images.jianshu.io/upload_images/13178554-06c2dae179cf350a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

打开chrome开发者工具查看Network可以看到：
![image.png](https://upload-images.jianshu.io/upload_images/13178554-aa7e058bf16ae253.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
我们可以看到Vue实例中的模板已经被渲染到了html页面并返回到了客户端
服务端渲染的核心就在于：**通过 vue-server-renderer 插件的renderToString()方法，将Vue实例转换为字符串插入到html文件中**
