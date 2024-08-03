import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "./" : "/",
  plugins: [react()],
  resolve: {
    // 配置路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "192.168.20.246",
    proxy: {
      "/api": {
        // 目标地址
        target:
          "http://is-08-small-http-cp4i.apps.ocp4.universalchain.com.cn/queryrest/v1",
        // 是否改变请求的源地址，这里设置为 true，表示强制使用绝对路径
        changeOrigin: true,
        // 路径重写规则，这里将 /api 开头的请求路径替换为空字符串，即去掉 /api 前缀
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
