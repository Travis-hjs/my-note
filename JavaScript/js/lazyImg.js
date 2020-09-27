/**
 * 图片懒加载
 * @param {object} params 传参对象
 * @param {number?} params.toBottom 距离底部像素加载开始加载（可选）
 * @param {string?} params.errorImage 加载失败时显示的图片路径（可选）
 * @param {string?} params.lazyAttr 自定义加载的属性（可选）
 * @param {number?} params.interval 函数节流间隔`毫秒`为单位（可选） 
 * @param {() => void} params.callback 全部加载完回调（可选）
 */
function lazyLoadImage(params) {
    const doc = document;
    /** 懒加载属性类型 */
    const attr = params.lazyAttr || "lazy";
    /** 函数节流间隔 */
    const space = params.interval || 100;
    /** 距离底部距离 */
    let offset = params.toBottom || 0;
    /** 上一次代码执行时间（节流用） */
    let before = 0;
    /**
     * 加载图片
     * @param {HTMLImageElement} el 图片节点
     */
    function loadImage(el) {
        /** 缓存当前 src 加载失败时候用 */
        const cache = el.src;
        el.src = el.getAttribute(attr);
        el.removeAttribute(attr);
        // 图片加载失败
        el.onerror = function () {
            el.src = params.errorImage || cache;
        }
    }
    /** 判断监听图片加载 */
    function judgeImages() {
        const now = Date.now();
        if (now - before < space) return;
        before = now;
        const images = doc.querySelectorAll(`[${attr}]`);
        const viewHeight = window.innerHeight || doc.documentElement.clientHeight;
        if (images.length) {
            for (let i = 0; i < images.length; i++) {
                const imageTop = images[i].getBoundingClientRect().top;
                if (imageTop <= viewHeight - Math.floor(offset)) {
                    loadImage(images[i]);
                }
            }
        } else {
            window.removeEventListener("scroll", judgeImages);
            typeof params.callback === "function" && params.callback();
        }
    }
    judgeImages();
    window.addEventListener("scroll", judgeImages);
}

lazyLoadImage({
    errorImage: "./img/big-1.jpg",
    lazyAttr: "lazy",
    toBottom: 100,
    callback() {
        console.log("全部加载完成");
    }
});