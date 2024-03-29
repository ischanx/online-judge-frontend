import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  css: {
    modules: {
      scopeBehaviour: 'local',
      generateScopedName: 'oj__[local]__[hash:6]',
    },
  },
  plugins: [
    vue(),
    vueJsx({}),
    Components({
      dirs: ['src'],
      deep: true,
      include: [/\.vue$/, /\.jsx$/, /\.tsx$/],
      exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
      dts: true,
      resolvers: [AntDesignVueResolver()],
    }),
  ],
});
