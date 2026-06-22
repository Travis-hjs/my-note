# 构建脚本

- 配合[package.json](../package.json)使用。

当前脚本构建作用在当构建目录在非`dist`时，处理构建目录用，同时需要改造一下[package.json](../package.json)和[vite.config.ts](../vite.config.ts)`

```json
{
  "scripts": {
    "clean:static": "node scripts/clean-static.cjs",
    "build:table": "npm run clean:static -- table && vite build --mode table",
  }
}
```

```ts
function getBuildByMode(mode: string): BuildEnvironmentOptions {
  return {
    outDir: `../static/${mode}`,
    emptyOutDir: true,
  }
}
```
