const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('✅ setupProxy.js 已加载');
  
  // 代理中航服API请求
  app.use(
    '/api/yqf',
    createProxyMiddleware({
      target: 'https://bizapi.yiqifei.cn',
      changeOrigin: true,
      pathRewrite: {
        '^/api/yqf': '/servings', // 将 /api/yqf 重写为 /servings
      },
      secure: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        // 保持原始请求头
        console.log('🔵 [代理] 请求:', req.method, req.originalUrl || req.url);
        console.log('🔵 [代理] 目标路径:', proxyReq.path);
        console.log('🔵 [代理] 目标主机:', proxyReq.getHeader('host'));
      },
      onProxyRes: (proxyRes, req, res) => {
        // 添加CORS头（如果需要）
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        console.log('🟢 [代理] 响应:', proxyRes.statusCode, req.originalUrl || req.url);
      },
      onError: (err, req, res) => {
        console.error('🔴 [代理] 错误:', err.message);
        console.error('🔴 [代理] 请求URL:', req.originalUrl || req.url);
        if (!res.headersSent) {
          res.status(500).json({ error: '代理服务器错误', details: err.message });
        }
      }
    })
  );
  
  console.log('✅ 代理配置已设置: /api/yqf -> https://bizapi.yiqifei.cn/servings');
};

