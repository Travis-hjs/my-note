(function () {
    /**
     * 缓动滚动到顶部
     * @description 兼容移动端  && IE-10+
     * @param {HTMLElement} el 
     */
    function scrollToTop(el) {
        /**
         * @type {requestAnimationFrame}
         */
        const animation = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        const beforeDisplay = el.style.display || document.defaultView.getComputedStyle(el).display;
        /**
         * @type {HTMLElement}
         */
        let rootNode = null;
        /** 是否在运动 阻止重复点击 */
        let isMove = false;
        
        function move() {
            // 缓动: rootNode.scrollTop = rootNode.scrollTop - rootNode.scrollTop * 0.1;
            // 线性: rootNode.scrollTop = rootNode.scrollTop - number;
            rootNode.scrollTop = rootNode.scrollTop - 150;
            if (rootNode.scrollTop > 0 && isMove) {
                animation(move);
            } else {
                isMove = false;
            }
        }

        function onScroll() {
            rootNode = document.body.scrollTop === 0 ? document.documentElement : document.body;
            if (rootNode.scrollTop > (document.body.scrollHeight / 2)) {
                el.style.display = beforeDisplay;
            } else {
                el.style.display = "none";
            }
        }
        // 先执行一次
        onScroll();

        window.addEventListener("scroll", onScroll);
        // 滚轮, 触摸事件
        // Firefox下要用 DOMMouseScroll 代替 mousewheel
        document.body.addEventListener("DOMMouseScroll", e => isMove = false);
        document.body.addEventListener("mousewheel", e => isMove = false);
        document.body.addEventListener("touchmove", e => isMove = false);

        el.addEventListener("click", e => {
            if (isMove) return;
            isMove = true;
            move();
        });
    }
    scrollToTop(document.querySelector(".goback"));


    // window.scrollTo({
    //     top: 0,
    //     behavior: "smooth"
    // });

})();