/**
 * swiper 轮播组件
 * @param {object} params 默认全部 false
 * @param {string} params.el 组件节点 class|id|<label>
 * @param {number} params.moveTime 过渡时间（毫秒）默认 300
 * @param {number} params.interval 自动播放间隔（毫秒）默认 3000
 * @param {boolean} params.loop 是否需要回路
 * @param {boolean} params.vertical 是否垂直
 * @param {boolean} params.autoPaly 是否需要自动播放
 * @param {boolean} params.pagination 是否需要底部圆点
 */
function swiper(params) {
    /** 是否需要底部圆点 */
    let pagination = false; 
    /** 是否需要回路 */
    let isLoop = false;
    /** 方向 true = X & Y = false */
    let direction = false; 
    /** 是否需要自动播放 */
    let autoPaly = false; 
    /** 自动播放间隔（毫秒）默认 3000 */
    let interval = 3000; 
    /** 过渡时间（毫秒）默认 300 */
    let moveTime = 300;
    /**
     * css class 命名列表
     * @type {['滑动列表','滑动item','底部圆点','圆点高亮','圆点容器']}
     */
    const classNames = ['.swiper_list', '.swiper_item', '.swiper_dot', '.swiper_dot_active', '.swiper_pagination'];

    /**
     * 触摸事件
     * @param {Element} div 组件最外层节点 
     * @param {number} width 滚动容器的宽度
     * @param {number} height 滚动容器的高度
     */
    function touch(div, width, height) {
        /** item 列表 */
        let list = div.querySelector(classNames[0]);
        /** swiper */
        let items = list.querySelectorAll(classNames[1]);
        /** 底部圆点 */
        let dots = div.querySelectorAll(classNames[2]);
        /** 触摸开始时间 */
        let startTime = 0; 
        /** 触摸结束时间 */
        let endTime = 0;
        /** 开始的距离 */
        let startDistance = 0;
        /** 结束的距离 */ 
        let endDistance = 0;
        /** 结束距离状态 */
        let endState = 0;
        /** 移动的距离 */
        let moveDistance = 0;
        /** 圆点位置 && 当前 item 索引 */
        let index = 0;
        /** 动画帧计数 */
        let count = 0;
        /** loop 帧计数 */
        let loopCount = 0;
        /** 移动范围 */
        let range = direction ? height : width;
        /** 
         * 动画帧 
         * @type {requestAnimationFrame}
         */
        let animationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        
        /** 设置动画 */
        function startAnimation() {
            list.style.transition = list.style.WebkitTransition = `${moveTime / 1000}s all`;
        }
        
        /** 关闭动画 */
        function stopAnimation() {
            list.style.transition = list.style.WebkitTransition = '0s all';
        }
        
        /**
         * 属性样式滑动
         * @param {number} num 移动的距离
         */
        function slideStyle(num) {
            let x = 0, y = 0;
            if (direction) {
                y = num;
            } else {
                x = num;
            }
            list.style.transform = list.style.WebkitTransform = `translate3d(${x}px, ${y}px, 0px)`;
        }

        /** 判断最大拖动距离 */
        function touchRange() {
            /** 拖动距离 */
            let _d = 0;
            // 默认这个公式
            _d = moveDistance + (endDistance - startDistance);
            // 判断最大正负值
            if ((endDistance - startDistance) >= range) {
                _d = moveDistance + range;
            } else if ((endDistance - startDistance) <= -range) {
                _d = moveDistance - range;
            }
            // 没有 loop 的时候惯性拖拽
            if (!isLoop) {
                if ((endDistance - startDistance) > 0 && index === 0) {
                    // console.log('到达最初');
                    _d = moveDistance + ((endDistance - startDistance) - ((endDistance - startDistance) * 0.6));
                } else if ((endDistance - startDistance) < 0 && index === items.length - 1) {
                    // console.log('到达最后');
                    _d = moveDistance + ((endDistance - startDistance) - ((endDistance - startDistance) * 0.6));
                }
            }
            return _d;
        }
        
        /**
         * 判断触摸处理函数 
         * @param {number} _d 移动的距离
         */
        function judgeTouch(_d) {
            //	这里我设置了200毫秒的有效拖拽间隔
            if ((endTime - startTime) < 200) return true;
            // 这里判断方向（正值和负值）
            if (_d < 0) {
                if ((endDistance - startDistance) < (_d / 2)) return true;
                return false;
            } else {
                if ((endDistance - startDistance) > (_d / 2)) return true;
                return false;
            }
        }
 
        /** 返回原来位置 */
        function backLocation() {
            startAnimation();
            slideStyle(moveDistance);
        }
        
        /**
         * 滑动
         * @param {number} _d 滑动的距离
         */
        function slideMove(_d) {
            startAnimation();
            slideStyle(_d);
            loopCount = 0;
            // 判断 loop 时回到第一张或最后一张
            if (isLoop && index < 0) {
                // 我这里是想让滑块过渡完之后再重置位置所以加的延迟 (之前用setTimeout，快速滑动有问题，然后换成 requestAnimationFrame解决了这类问题)
                function loopMoveMin() {
                    loopCount += 1;
                    if (loopCount < moveTime / 1000 * 60) return animationFrame(loopMoveMin);
                    stopAnimation();
                    slideStyle(range * -(items.length - 3));
                    // 重置一下位置
                    moveDistance = range * -(items.length - 3);
                }
                loopMoveMin();
                index = items.length - 3;
            } else if (isLoop && index > items.length - 3) {
                function loopMoveMax() {
                    loopCount += 1;
                    if (loopCount < moveTime / 1000 * 60) return animationFrame(loopMoveMax);
                    stopAnimation();
                    slideStyle(0);
                    moveDistance = 0;
                }
                loopMoveMax();
                index = 0;
            }
            // console.log(`第${ index+1 }张`);	// 这里可以做滑动结束回调
            if (pagination) {
                div.querySelector(classNames[3]).className = classNames[2].slice(1);
                dots[index].classList.add(classNames[3].slice(1));
            }
        }

        /** 判断移动 */ 
        function judgeMove() {
            // 判断是否需要执行过渡
            if (endDistance < startDistance) {
                // 往上滑动 or 向左滑动
                if (judgeTouch(-range)) {
                    // 判断有loop的时候不需要执行下面的事件
                    if (!isLoop && moveDistance === (-(items.length - 1) * range)) return backLocation();
                    index += 1;
                    slideMove(moveDistance - range);
                    moveDistance -= range;
                } else backLocation();
            } else {
                // 往下滑动 or 向右滑动
                if (judgeTouch(range)) {
                    if (!isLoop && moveDistance === 0) return backLocation();
                    index -= 1;
                    slideMove(moveDistance + range);
                    moveDistance += range;
                } else backLocation();
            }
        }
        
        /** 自动播放移动 */
        function autoMove() {
            // 这里判断 loop 的自动播放
            if (isLoop) {
                index += 1;
                slideMove(moveDistance - range);
                moveDistance -= range;
            } else {
                if (index >= items.length - 1) {
                    index = 0;
                    slideMove(0);
                    moveDistance = 0;
                } else {
                    index += 1;
                    slideMove(moveDistance - range);
                    moveDistance -= range;
                }
            }
        }

        /** 开始自动播放 */
        function startAuto() {
            count += 1;
            if (count < interval / 1000 * 60) return animationFrame(startAuto);
            count = 0;
            autoMove();
            startAuto();
        }

        // 判断是否需要开启自动播放
        if (autoPaly && items.length - 1) startAuto();

        // 开始触摸
        list.addEventListener('touchstart', ev => {
            startTime = new Date().getTime();
            count = 0;
            loopCount = moveTime / 1000 * 60;
            stopAnimation();
            startDistance = direction ? ev.touches[0].pageY : ev.touches[0].pageX;
        });

        // 触摸移动
        list.addEventListener('touchmove', ev => {
            ev.preventDefault();
            count = 0;
            endDistance = direction ? ev.touches[0].pageY : ev.touches[0].pageX;
            slideStyle(touchRange());
        });

        // 触摸离开
        list.addEventListener('touchend', () => {
            endTime = new Date().getTime();
            // 判断是否点击
            if (endState !== endDistance) {
                judgeMove();
            } else {
                backLocation();
            }
            // console.log(`index: ${index}`);	//  这里可以做触摸之后位置回调
            // 更新位置 
            endState = endDistance;
            // 重新打开自动播
            count = 0;
        });
    }
    
    /**
     * 动态布局
     * @param {Element} div 组件最外层节点 
     * @param {number} width 滚动容器的宽度
     * @param {number} height 滚动容器的高度
     */
    function layout(div, width, height) {
        let list = div.querySelector(classNames[0]), 
            items = div.querySelectorAll(classNames[1]);
        if (direction) {
            for (let i = 0; i < items.length; i++) {
                items[i].style.height = `${height}px`;
            }
        } else {
            list.style.width = `${width * items.length}px`;
            for (let i = 0; i < items.length; i++) {
                items[i].style.width = `${width}px`;
            }
        }
        touch(div, width, height);
    }
    
    /**
     * 如果要回路的话前后增加元素
     * @param {Element} div 组件最外层节点 
     * @param {number} width 滚动容器的宽度
     * @param {number} height 滚动容器的高度
     */
    function outputLoop(div, width, height) {
        let list = div.querySelector(classNames[0]);
        let items = list.querySelectorAll(classNames[1]);
        let first = items[0].cloneNode(true),
            last = items[items.length - 1].cloneNode(true);
        list.insertBefore(last, items[0]);
        list.appendChild(first);
        if (direction) {
            list.style.top = `${-height}px`;
        } else {
            list.style.left = `${-width}px`;
        }
        layout(div, width, height);
    }

    /**
     * 输出底部圆点
     * @param {Element} div 组件最外层节点 
     */
    function outputPagination(div) {
        let btnList = div.querySelector(classNames[4]),
            liNum = div.querySelectorAll(classNames[1]).length,
            html = '';
        for (let i = 0; i < liNum; i++) {
            html += `<div class="${classNames[2].slice(1)}"></div>`;
        }
        btnList.innerHTML = html;
        btnList.querySelector(classNames[2]).classList.add(classNames[3].slice(1));
    }
    
    /**
     * 动态布局初始化 
     * @param {string} el 组件节点 class|id|<label> 
     */
    function format(el) {
        /** 组件最外层节点 */
        let node = document.querySelector(el);
        let moveWidth = node.offsetWidth, 
            moveHeight = node.offsetHeight;
        if (pagination) outputPagination(node);
        if (isLoop) {
            outputLoop(node, moveWidth, moveHeight);
        } else {
            layout(node, moveWidth, moveHeight);
        }
    }
    
    /** 初始化参数 */
    function init() {
        if (typeof params !== 'object') return console.warn('传参有误');
        if (!params.el) return console.warn('没有可执行的元素！');
        pagination = params.pagination || false;
        direction = params.vertical || false;
        autoPaly = params.autoPaly || false;
        isLoop = params.loop || false;
        moveTime = params.moveTime || 300;
        interval = params.interval || 3000;
        format(params.el);
    }
    init();
}
