const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(
        '/Api',
        // createProxyMiddleware({
        //     target: 'http://localhost:9090',
        // })
        createProxyMiddleware({
            target: 'https://hubbe.myddns.me',
            changeOrigin: true,
            secure: false,
            // logLevel: 'debug',
            // onProxyReq: (proxyReq, req, res) => {
            //     console.log(proxyReq.getHeaders())
            // }
        })
    );
};
