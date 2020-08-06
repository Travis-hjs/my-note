/** 旧版的做法 canvas 绘画 效果不好 */
function rippleClick(el) {
    let canvas = {},
        context = {},
        centerX = 0,
        centerY = 0,
        radius = 0,
        scale = 8,  // 这个值和扩散速度有关
        color = el.dataset.color || "#999999",
        myAinmFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
        ev = window.event || arguments.callee.caller.arguments[0];
    canvas = document.createElement("canvas");
    el.appendChild(canvas);
    canvas.style.width = canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    context = canvas.getContext("2d");
    centerX = ev.offsetX;
    centerY = ev.offsetY;
    if (canvas.offsetWidth <= 60) scale = 3;
    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.globalAlpha = 0.5
        context.fill();
        radius += scale;
        if (radius < canvas.width) {
            myAinmFrame(draw);
        } else if (radius >= canvas.width) {
            el.removeChild(canvas);
        }
    }
    draw();
}

/**
 * 新的做法，效果最好
 * 这里只是防止和其他全局变量重名而添加的立即执行函数包裹，`webpack` 环境下可以不需要
 */
(function () {
    /**
     * 水波纹节点对象池
     * @type {Array<HTMLElement>}
     */
    const RIPPLE_POOL = [];

    /**
     * 点击水波纹
     * @param {Event} event 点击事件
     * @param {HTMLElement} target 点击目标
     */
    function ripple(event, target) {
        /**
         * 水波纹动画节点
         * @type {HTMLElement}
         */
        let node = null;

        // 从对象池里面拿取节点
        if (RIPPLE_POOL.length > 1) {
            node = RIPPLE_POOL.shift();
        } else {
            node = document.createElement("div");
            node.className = "ripple";
        }

        /** 点击目标矩阵尺寸 */
        let rect = target.getBoundingClientRect();
        /** 当前自定义颜色值 */
        let color = target.getAttribute("color");
        /** 波纹大小 */
        let size = Math.max(rect.width, rect.height);
        // 设置最大范围
        if (size > 200) size = 200;
        // 设置大小
        node.style.height = node.style.width = size + "px";
        // 默认是白色透明
        node.style.backgroundColor = color || "rgba(255, 255, 255, .45)";
        // 这里必须输出节点后再设置位置，不然会有问题
        target.appendChild(node);

        let y = event.touches ? event.touches[0].clientY : event.clientY;
        let x = event.touches ? event.touches[0].clientX : event.clientX;
        let top = y - rect.top - (node.offsetHeight / 2);
        let left = x - rect.left - (node.offsetWidth / 2);
        // console.log(top, left);
        node.style.top = top + "px";
        node.style.left = left + "px";

        function end() {
            node.removeEventListener("animationend", end);
            // console.log("动画结束", node);
            target.removeChild(node);
            RIPPLE_POOL.push(node);
        }
        node.addEventListener("animationend", end);
    }

    /** 是否移动端 */
    const isMobile = utils.isMobile();

    /** 添加事件类型 */
    const eventType = isMobile ? "touchstart" : "mousedown";

    // 这里我使用事件代理去完成方法操作，因为节点是动态生成的
    // Vue项目中可以使用自定义指令的方式代替事假代理
    document.body.addEventListener(eventType, function (e) {
        /** 事件类型 */
        const event = e || window.event || arguments.callee.caller.arguments[0];
        /** 循环的次数 */
        let loop_count = 3; // 这里的 3 次是布局的子节点层数，可根据布局层数增加减少
        /** 
         * 定义目标变量 
         * @type {HTMLElement} 
         */
        let target = event.target;
        // 循环 3 次由里向外查找目标节点
        while (loop_count > 0 && target && target != document.body) {
            loop_count--;
            if (target.hasAttribute("ripple")) {
                ripple(event, target);
                break;
            }
            target = target.parentNode;
        }
    });
})();

/** 创建按钮 */
function createButton() {
    /** 按钮列表 */
    let listNode = utils.find(".button-list");

    for (let i = 0; i < 11; i++) {
        const button = document.createElement("button");
        button.className = "button";
        button.setAttribute("ripple", "");
        button.textContent = "BUTTON-" + (i + 1);
        listNode.appendChild(button);
    }
}
createButton();
