import fs from "node:fs";
import path from "path";
import {
  type BuildEnvironmentOptions,
  defineConfig
} from "vite";

const version = Date.now();

const getPageInput = (page: string) => path.resolve(__dirname, `src/pages/${page}/index.html`);

/**
 * 获取构建配置
 * - 新增页面时，需要和`package.json`同步添加构建命令
 * @param mode 
 */
function getBuildConfig(mode: string) {
  const pages = ["home", "about", "snapdom", "lazy-load"];

  if (pages.includes(mode)) {
    return getBuildByMode(mode);
  }

  const config: BuildEnvironmentOptions = {
    rolldownOptions: {
      input: {
        main: path.resolve(__dirname, "index.html")
      }
    }
  }

  pages.forEach(page => {
    config.rolldownOptions!.input![page] = getPageInput(page);
  });
  
  return config;
}

/**
 * 获取对应的构建模式配置
 * @param mode 
 */
function getBuildByMode(mode: string): BuildEnvironmentOptions {  
  return {
    outDir: `dist/${mode}`,
    // outDir: `../static/${mode}`,
    // emptyOutDir: true,
    rollupOptions: {
      input: getPageInput(mode),
      output: {
        entryFileNames: "js/[name]-[hash].js",
        chunkFileNames: "js/[name]-[hash].js",
        /**
         * 处理资源目录结构
         * @param target 
         */
        assetFileNames(target) {
          const fileName = target.names[0] || target.name;
          
          // FIXME: 不生效，需要使用下面的 plugins[0] 正则替换静态资源路径和文件移动操作
          // 如果是 HTML 文件，直接输出到根目录
          // if (fileName?.endsWith(".html")) {
          //   return "[name][extname]";
          // }
        
          if (fileName?.endsWith(".css")) {
            return "css/[name]-[hash].css";
          }

          const imageTypes = [".png", "jpg", "jpeg", ".webp", ".gif"];

          if (fileName && imageTypes.some(type => fileName.endsWith(type))) {
            return "image/[name]-[hash].[ext]";
          }

          return "assets/[name]-[hash].[ext]";
        }
      },
      plugins: [
        {
          name: "adjust-html-path",
          generateBundle(options, bundle) {
            // 查找 HTML 文件并调整其输出路径
            for (const fileName in bundle) {
              const chunk = bundle[fileName];
              if (fileName.endsWith(".html") && chunk.type === "asset") {
                // 将 HTML 文件移动到根目录
                const newFileName = fileName.split("/").pop();
                if (!newFileName) return;
                chunk.fileName = newFileName;
                // TODO: 修正 HTML 中的资源引用路径
                if (typeof chunk.source !== "string") return;
                // 暴力处理相对路径
                chunk.source = chunk.source.replace(/="\.\.\/\.\.\/\.\.\//g, `="./`);
              }
            }
          },
        }
      ]
    },
    // copyPublicDir: true,
  }
}

// https://vitejs.dev/config/
export default defineConfig(config => {
  return {
    plugins: [
      {
        buildEnd() {
          const versionFilePath = path.join(__dirname, "./public/version.json");
          fs.writeFileSync(versionFilePath, JSON.stringify({ version }, null, 2));
        },
        name: "inject-version",
        transformIndexHtml(html) {
          return html.replace(
            /<\/head>/,
            `  <script>window._version = ${version};</script>
</head>`,
          );
        },
      }
    ],
    build: getBuildConfig(config.mode),
    base: "./",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    },
    server: {
      port: 1010,
      host: "0.0.0.0",
      // proxy: {
      //   "/free": {
      //     target: "https://www.tianqiapi.com",
      //     changeOrigin: true,
      //     rewrite: path => path.replace(/^\//, "")
      //   }
      // },
      // https: {
      //   key: fs.readFileSync("./localhost-key.pem"),
      //   cert: fs.readFileSync("./localhost.pem"),
      //   open: true,
      //   // strictPort: true,
      //   // port: 3000,
      // },
    },
  }
})
