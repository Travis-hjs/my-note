
/**
 * 百分百圆环
 * @param {object} info 圆环的信息
 * @param {HTMLCanvasElement} info.el 承载的节点
 * @param {number} info.width 宽
 * @param {number} info.height 高
 * @param {number} info.lineWidth 圆环的宽度 
 * @param {string} info.lineColor 圆环的颜色: rgba()|rgb()|#xxx|orange
 * @param {string} info.lineLayerColor 圆环的底色: rgba()|rgb()|#xxx|orange
 * @param {string} info.backgroundColor 圆环的底色: rgba()|rgb()|#xxx|orange
 * @param {string} info.fontStyle 字体样式："bold 35px Arial"
 * @param {string} info.fontColor 字体颜色：rgba()|rgb()|#xxx|orange
 */
function ringProgress(info) {
    if (!info.el) return console.warn("没有设置 canvas 节点!!!");
    /**
     * 动画帧
     * @type {requestAnimationFrame}
     */
    const animation = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    /**
     * 移除动画帧
     * @type {cancelAnimationFrame}
     */
    const clearAnimation = window.cancelAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    /** canvas节点 */
    const node = info.el;    
    /** canvas 上下文 */
    const context = info.el.getContext("2d");
    /** 结束角 */
    const CIRC = Math.PI * 2;
    /** 起始角，以弧度计（弧的圆形的三点钟位置是 0 度） */
    const QUART = Math.PI / 2;
    /** 当前动画的`id` */
    let animationId = 0;
    /** 圆环进度 0-1 */
    let progress = 0; 
    /** 当前进度 */
    let progressNow = 50;

    node.width = info.width || info.el.parentNode.clientWidth;
    node.height = info.height || info.el.parentNode.clientHeight;

    /** 圆环尺寸 */
    const ringSize = Math.min(node.width, node.height);
    /** 中心坐标`x` */
    const centerX = node.width / 2;
    /** 中心坐标`y` */
    const centerY = node.height / 2;

    /** 绘制背景 */
    function drawBackground() {
        context.beginPath();
        context.arc(centerX, centerY, ringSize / 2, 0 , 360, false);
        context.fillStyle = info.backgroundColor || "#ffffff";
        context.fill();
        context.closePath();
    }

    /** 绘制底层圆环 */
    function drawLayerLine() {
        // 初始化绘画圆环
        context.beginPath();
        context.strokeStyle = info.lineLayerColor || "#eeeeee";
        context.lineCap = "round";
        context.lineWidth = info.lineWidth || 1;
        /** 圆环的半径 这里要减去圆环的线宽 */
        const radius = (ringSize - context.lineWidth) / 2; 
        context.arc(centerX, centerY, radius, -QUART, CIRC - QUART, false);
        context.stroke();
        // context.fill();
        context.closePath();
    }
    
    /** 
     * 绘制圆环进度 
     * @param {number} value
    */
    function drawLine(value) {
        // 初始化绘画圆环
        context.beginPath();
        context.strokeStyle = info.lineColor || "orange";
        context.lineCap = "round";
        context.lineWidth = info.lineWidth || 1;
        /** 圆环的半径 这里要减去圆环的线宽 */
        const radius = (ringSize - context.lineWidth) / 2; 
        context.arc(centerX, centerY, radius, -QUART, CIRC * value - QUART, false);
        context.stroke();
        // context.fill();
        context.closePath();
    }
    
    /** 
     * 绘制圆环进度文字 
     * @param {string} text
    */
    function drawText(text) {
        // /** 画布上的矩形的像素数据 */
        // const imgData = context.getImageData(0, 0, node.width, node.height);
        // context.putImageData(imgData, 0, 0);
        // 设置文字样式
        context.font = info.fontStyle || "bold 35px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = info.fontColor || "orange";
        // 绘画文字
        context.fillText(text + "%", centerX, centerY);
    }

    /** 每一帧更新 */
    function update() {
        if (progress > progressNow) {
            progress --;
            if (progress <= progressNow) progress = progressNow;
        }

        if (progress < progressNow) {
            progress ++;
            if (progress >= progressNow) progress = progressNow;
        }

        /** 百分比值 */
        let value = progress / 100;
        drawBackground();
        drawLayerLine();
        drawLine(value);
        drawText(progress);

        animationId = animation(update);
    }
    update();

    return {
        /**
         * 设置百分比 0 - 100
         * @param {number} value 百分比数字
         */
        setValue(value) {
            progressNow = value;
            if (progressNow > 100) progressNow = 100;
            if (progressNow < 0) progressNow = 0; 
        },
    
        destroy() {
            // console.log(animationId);
            clearAnimation(animationId);
        }
    }
}

const canvas = document.getElementById("ring");

const ring = ringProgress({
    el: canvas,
    width: 500,
    height: 300,
    lineWidth: 20,
    lineColor: "#6990f6",
    fontColor: "#6990f6"
});

/**
 * @type {HTMLElement}
 */
const line = document.querySelector(".progress");

line.style.backgroundSize = "50%";

/**
 * 输入百分比值
 * @param {HTMLInputElement} el 
 */
function inputNumber(el) {
    ring.setValue(el.value);
    line.style.backgroundSize = el.value + "%";
}

setTimeout(function () {
    ring.destroy();
}, 3000)
