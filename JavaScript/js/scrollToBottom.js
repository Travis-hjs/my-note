(function () {

    /**
     * 监听到达底部（方法一，可能有兼容问题）
     * @param {() => void} callback 到达底部回调函数
     * @param {number} distance 距离底部多少像素触发（px）
     * @param {boolean} once 是否为一次性
     */
    function onBottom(callback, distance = 0, once = false) {
        function onScroll() {
            let { scrollTop, scrollHeight } = document.scrollingElement;
            let clientHeight = window.innerHeight;
            // 当前滚动高度 + 视口高度 >= 文档总高度
            if (scrollTop + clientHeight >= scrollHeight - distance) {
                if (typeof callback === "function") callback();
                if (once) window.removeEventListener("scroll", onScroll);
            }
        }
        window.addEventListener("scroll", onScroll);
        onScroll();
    }

    /**
     * 监听滚动到底部（方法二）
     * @param {() => void} callback 到达底部回调函数
     * @param {number} number 距离底部多少像素触发（px）
     * @param {boolean} once 是否为一次性（防止重复用）
     */
    function scrollToBottom(callback, number = 0, once = false) {
        const doc = document;
        /** 滚动事件 */
        function onScroll() {
            /** 滚动的高度 */
            let scrollTop = doc.documentElement.scrollTop === 0 ? doc.body.scrollTop : doc.documentElement.scrollTop;
            /** 滚动条高度 */
            let scrollHeight = doc.documentElement.scrollTop === 0 ? doc.body.scrollHeight : doc.documentElement.scrollHeight;
            if (scrollHeight - scrollTop - number <= window.innerHeight) {
                if (typeof callback === "function") callback();
                if (once) window.removeEventListener("scroll", onScroll);
            }
        }
        window.addEventListener("scroll", onScroll);
        // 必要时先执行一次
        // onScroll(); 
    }

    scrollToBottom(function () {
        console.log("页面到底底部了，只监听一次");
    }, 100, true);

    /**
     * 监听指定元素滚动到底部
     * @param {HTMLElement} el 指定的元素
     * @param {() => void} callback 到达底部回调函数
     * @param {number} number 距离底部多少像素触发（px）
     * @param {boolean} once 是否为一次性
     */
    function elementScrollToBottom(el, callback, number = 0, once = false) {
        /** 滚动事件 */
        function onScroll() {
            /** 滚动的高度 */
            let scrollTop = el.scrollTop;
            /** 滚动条高度 */
            let scrollHeight = el.scrollHeight;
            if (scrollHeight - scrollTop - number <= el.clientHeight) {
                if (typeof callback === "function") callback();
                if (once) el.removeEventListener("scroll", onScroll);
            }
        }
        el.addEventListener("scroll", onScroll);
        // 先执行一次
        // onScroll();
    }
    const scrollEl = document.querySelector(".scroll_view");

    elementScrollToBottom(scrollEl, function () {
        console.log("节点滚动到底部了");
    });

})();