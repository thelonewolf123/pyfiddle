const {
  defineConfig
} = require("@vue/cli-service");
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

let config = defineConfig({
  transpileDependencies: true,
});

let vuetifyConfig = {
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin(),
    ],
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      }
    }
  },
};

module.exports = {
  ...config,
  ...vuetifyConfig
};