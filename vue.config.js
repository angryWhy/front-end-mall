const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8003, // 启动端口号
    open: true, // 
    proxy: {
      '^/api': {
        target: 'http://localhost:8080/',
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true
      }
    }
  }
})
