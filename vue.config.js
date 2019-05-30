const path = require('path');

module.exports = {
  devServer: {
    publicPath: '/',
    disableHostCheck: true,
    // host: '192.168.212.99',
    // port: 4200,
 /*   proxy: {
        '/soso': {
          target: 'https://c.y.qq.com',
          changeOrigin: true
        }
    },*/
    quiet: true
  },

  lintOnSave: false,

  chainWebpack(config) {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.hotReload = false;
        return options;
      });
    config.resolve.extensions.add('.less');
    config.resolve.alias.set('service', resolve('src/service')).set('assets', resolve('src/assets'));
  }
}

function resolve (dir) {
  return path.join(__dirname, '.', dir);
}
