module.exports = {
  // productionSourceMap: false,
  publicPath: '/',
  outputDir: 'apmMonitor',
  devServer: {
    port: '8085',
    proxy: {
      '/apm': {
        target: 'http://127.0.0.1:8000', // 开发
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  }
}
