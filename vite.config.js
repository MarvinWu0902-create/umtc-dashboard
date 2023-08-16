import { fileURLToPath, URL } from 'node:url'
import requireTransform from 'vite-plugin-require-transform';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), requireTransform({
    fileRegex: /.ts$|.tsx$|.vue$/
    //fileRegex: /.js$|.jsx$|.vue$/
  })],///這段解決了本地 無法返回上一頁;Server OK

  // build: {
  //   assetsInclude: ['**/*.css']
  // },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/build.js`,
        chunkFileNames: `assets/build.js`,
        assetFileNames: `assets/build.css`,
      }
    },
    ///
    minify: true,
    cssCodeSplit: false
    ///
  },
  base: '/ymyip/',///影響build後的js/css import 位置前綴
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
      ///可以任一位置使用根目錄來import資料,ex:@/component/Header.vue
    }
  },
  // server:{
  //   port: '5173',///5173
  //   proxy:{
  //     '/api':{
  //       target:'http://localhost:88/',////'http://localhost:88/'
  //       changeOrigin:true,
  //       secure:false,
  //       rewrite: (path) => path.replace(/^\/api/, '')
  //     },
  //     cors:false
  //   }
  // }
})
