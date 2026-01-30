# 页面元素转换为图片

- [snapdom使用文档](https://github.com/zumerlab/snapdom/blob/main/README_CN.md)

`snapdom`的下载机制需要在`https`策略下下运行，所以需要在[vite.config.mts](../../../vite.config.mts)中开启`https`配置（放开注释即可）

```ts
import { snapdom } from "@zumer/snapdom";
```

在上面代码中（基于vite工程项目），提示错误：`Cannot find module '@zumer/snapdom'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?`。已经确定`@zumer/snapdom`已进行正确安装，那么tsconfig.json中应该如何配置？
