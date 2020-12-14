const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) { // node.js module export (used together with require(filepath)
  app.use(
    '/api', // context --> all url starting with '/api'
    createProxyMiddleware({
      target: 'https://api.n2yo.com',
      changeOrigin: true,
    })
  );
};
