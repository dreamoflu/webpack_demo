var express = require('express');
var proxy = require('http-proxy-middleware');

var app = express();
app.use('/medapp', proxy({
    target: 'http://101.200.234.55:8080',
    changeOrigin: true,
    pathRewrite: {
          '^/medapp': ''
     }
    // onProxyRes: function(proxyRes, req, res) {
    //     res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    //     res.header('Access-Control-Allow-Credentials', 'true');
    // },
    // cookieDomainRewrite: 'localhost'
}));

app.listen(8081);
