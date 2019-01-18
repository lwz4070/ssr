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
express.listen(8083, () => {
    console.log('服务器已启动');
});
