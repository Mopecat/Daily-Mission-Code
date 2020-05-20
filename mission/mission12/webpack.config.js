const path = require('path')

module.exports = {
  entry: './src/index.js',
  output:{
    filename: 'bundle.js',
    path: path.resolve(__dirname,'dist')
  },
  // mode: 'development',
  // 默认情况下usedExports在生产环境（production）下使用 其他模式下 默认关闭，所以这里手动的开启用以试验
  // optimization: {
  //   usedExports: true 
  // }
  mode: 'production'
}