// 这里我做的不是用`window`的滚动事件，而是用最外层的绑定触摸下拉事件去实现
// 好处是我用在Vue这类单页应用的时候，组件销毁时不用去解绑`window`的 `scroll`事件
// 但是滑动到底部事件就必须要用`window`的`scroll`事件，这点需要注意

/**
 * 下拉刷新组件
 * @param {object} option 配置
 * @param {HTMLElement} option.el 下拉元素（必选）
 * @param {number} option.distance 下拉距离[px]（可选）
 * @param {number} option.deviation 顶部往下偏移量[px]（可选）
 * @param {string} option.loadIcon 下拉中的 icon html（可选）
 */
function dropDownRefresh(option) {
    const doc = document;
    /** 整体节点 */
    const page = option.el;
    /** 下拉距离 */
    const distance = option.distance || 88;
    /** 顶部往下偏移量 */
    const deviation = option.deviation || 0;
    /** 顶层节点 */
    const topNode = doc.createElement("div");
    /** 下拉时遮罩 */
    const maskNode = doc.createElement("div");

    topNode.innerHTML = `
    <div refresh-icon style="transition: .2s all;">
        <svg style="transform: rotate(90deg); display: block;" width="48" height="48" t="1570593064555" viewBox="0 0 1575 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26089">
            <path d="M1013.76 0v339.968H484.115692V679.778462h529.644308v339.968l529.644308-485.612308v-48.600616L1013.76 0zM243.396923 679.857231h144.462769V339.968H243.396923V679.778462z m-240.797538 0h144.462769V339.968H2.599385V679.778462z" fill="#000000" fill-opacity=".203" p-id="26090"></path>
        </svg>
    </div>
    <div refresh-loading style="display: none; animation: refresh-loading 1s linear infinite;">
        ${option.loadIcon || '<p style="font-size: 15px; color: #666;">loading...</p>'}
    </div>
    `;
    topNode.style.cssText = `width: 100%; height: ${distance}px; position: fixed; top: ${-distance + deviation}px; left: 0; z-index: 10; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; box-sizing: border-box; margin: 0; padding: 0;`;
    maskNode.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100vh; box-sizing: border-box; margin: 0; padding: 0; background-color: rgba(0,0,0,0); z-index: 999;";
    page.parentNode.insertBefore(topNode, page);

    /**
     * 设置动画时间
     * @param {number} n 秒数 
     */
    function setAnimation(n) {
        page.style.transition = topNode.style.transition = n + "s all";
    }

    /**
     * 设置滑动距离
     * @param {number} n 滑动的距离（像素）
     */
    function setSlide(n) {
        page.style.transform = topNode.style.transform = `translate3d(0px, ${n}px, 0px)`;
    }
    
    /** 下拉提示 icon */
    const icon = topNode.querySelector("[refresh-icon]");
    /** 下拉 loading 动画 */
    const loading = topNode.querySelector("[refresh-loading]");

    return {
        /**
         * 监听开始刷新
         * @param {() => void} callback 下拉结束回调
         * @param {(n: number) => void} rangeCallback 下拉状态回调
         */
        onRefresh(callback, rangeCallback = null) {
            /** 顶部距离 */
            let scrollTop = 0;
            /** 开始距离 */
            let startDistance = 0;
            /** 结束距离 */
            let endDistance = 0;
            /** 最后移动的距离 */
            let range = 0;

            // 触摸开始
            page.addEventListener("touchstart", function (e) {
                startDistance = e.touches[0].pageY;
                scrollTop = 1;
                setAnimation(0);
            });

            // 触摸移动
            page.addEventListener("touchmove", function (e) {
                scrollTop = doc.documentElement.scrollTop === 0 ? doc.body.scrollTop : doc.documentElement.scrollTop;
                // 没到达顶部就停止
                if (scrollTop != 0) return;
                endDistance = e.touches[0].pageY;
                range = Math.floor(endDistance - startDistance);
                // 判断如果是下滑才执行
                if (range > 0) {
                    // 阻止浏览自带的下拉效果
                    e.preventDefault();
                    // 物理回弹公式计算距离
                    range = range - (range * 0.5);
                    // 下拉时icon旋转
                    if (range > distance) {
                        icon.style.transform = "rotate(180deg)";
                    } else {
                        icon.style.transform = "rotate(0deg)";
                    }
                    setSlide(range);
                    // 回调距离函数 如果有需要
                    typeof rangeCallback === "function" && rangeCallback(range);
                }
            });

            // 触摸结束
            page.addEventListener("touchend", function () {
                setAnimation(0.3);
                // console.log(`移动的距离：${range}, 最大距离：${distance}`);
                if (range > distance && range > 1 && scrollTop === 0) {
                    setSlide(distance);
                    doc.body.appendChild(maskNode);
                    // 阻止往上滑动
                    maskNode.ontouchmove = e => e.preventDefault();
                    // 回调成功下拉到最大距离并松开函数
                    typeof callback === "function" && callback();
                    icon.style.display = "none";
                    loading.style.display = "block";
                } else {
                    setSlide(0);
                }
            });

        },
        /** 结束下拉 */
        end() {
            maskNode.parentNode.removeChild(maskNode);
            setAnimation(0.3);
            setSlide(0);
            icon.style.display = "block";
            loading.style.display = "none";
        }
    }
}

(function () {
    let items = '';
    for (let i = 0; i < 10; i++) {
        items += '<div class="item"></div>';
    }
    document.querySelector('.page').innerHTML = items;

    /** 旋转的圈圈 */
    const icon = document.getElementById('loading-icon').innerHTML;

    const drop = dropDownRefresh({
        el: document.querySelector('.page'),
        loadIcon: icon,
        distance: 100
    });

    drop.onRefresh(() => {
        setTimeout(() => {
            drop.end();
        }, 3000);
    }, n => {
        console.log('下拉的距离：', n);
    });

})();


