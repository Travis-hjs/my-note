# 懒加载

可以加载任意属性，不局限为图片。

## vue3.x指令式使用

```ts
import { createApp } from "vue";

const app = createApp();

/** 添加一个加载`src`的指令 */
const lazySrc = lazyLoad({
  lazyAttr: "lazy-src",
  errorPath: "./img/error.jpg"
})

app.directive("lazy-src", {
  mounted(el, binding) {
    el.setAttribute("lazy-src", binding.value); // 跟上面`lazyAttr`的对应
    lazySrc.observer.observe(el);
  },
  unmounted(el) {
    lazySrc.observer.unobserve(el);
  }
});

/** 添加一个加载`background`的指令 */
const lazyBg = lazyLoad({
  lazyAttr: "lazy-bg",
  loadType: "background"
});

app.directive("lazy-bg", {
  mounted(el, binding) {
    el.setAttribute("lazy-bg", binding.value); // 跟上面`lazyAttr`的对应
    lazyBg.observer.observe(el);
  },
  unmounted(el) {
    lazyBg.observer.unobserve(el);
  }
});
```
