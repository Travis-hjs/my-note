
/**
 * 百分比圆环
 * @param {object} info 圆环的信息
 * @param {HTMLElement} info.el 挂载的节点
 * @param {number} info.lineWidth 圆环的宽度（像素）
 * @param {string} info.lineColor 圆环的颜色: rgba() | rgb() | #xxx | orange
 * @param {string} info.lineLayerColor 圆环的底色: rgba() | rgb() | #xxx | orange
 * @param {string} info.backgroundColor 背景颜色: rgba() | rgb() | #xxx | orange
 * @param {string} info.fontColor 字体颜色：rgba()|rgb()|#xxx|orange
 * @param {number} info.fontSize 字体大小（像素）
 * @param {"bold"} info.fontWeight 字重：只有"bold"和不传（普通）两种
 * @param {"Arial"|"Helvetica"} info.fontStyle 字体样式，只枚举了两种，具体跟`css`一致
 */
function ringProgress(info) {
    if (!info.el) return console.warn("没有设置挂载 canvas 的节点!!!");
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
    const canvas = document.createElement("canvas");    
    const context = canvas.getContext("2d");
    /** 结束角 */
    const CIRC = Math.PI * 2;
    /** 起始角，以弧度计（弧的圆形的三点钟位置是 0 度） */
    const QUART = Math.PI / 2;
    /** 缩放比 */
    const scaleValue = window.devicePixelRatio <= 1 ? 2 : window.devicePixelRatio;
    /** 当前动画的`id` */
    let animationId = 0;
    /** 圆环进度 0-1 */
    let progress = 0; 
    /** 当前进度 */
    let progressNow = 68;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    info.el.appendChild(canvas);

    // 移动端上抗锯齿要乘以像素比，然后 canvas 设置 css { width: 100%; height: 100% } ↑↑↑ 上面的代码
    canvas.width = info.el.clientWidth * scaleValue;
    canvas.height = info.el.clientHeight * scaleValue;
    
    /** 圆环尺寸 */
    // const ringSize = Math.min(canvas.width, canvas.height);
    const ringSize = Math.min(canvas.width, canvas.height) - scaleValue; // 这里减去缩放比是因为让canvas绘画不贴近边界（类似padding的效果），不然会有些许切割的瑕疵
    /** 中心坐标`x` */
    const centerX = canvas.width / 2;
    /** 中心坐标`y` */
    const centerY = canvas.height / 2;

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
        context.beginPath();
        context.strokeStyle = info.lineLayerColor || "#eeeeee";
        context.lineCap = "butt";
        context.lineWidth = (info.lineWidth || 1) * scaleValue;
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
        context.beginPath();
        context.strokeStyle = info.lineColor || "orange";
        context.lineCap = "round";
        context.lineWidth = (info.lineWidth || 1) * scaleValue;
        /** 圆环的半径 这里要减去圆环的线宽 */
        const radius = (ringSize - context.lineWidth) / 2; 
        context.arc(centerX, centerY, radius, -QUART, CIRC * value - QUART, false);
        context.stroke();
        // context.fill();
        context.closePath();
    }
    
    /** 
     * 绘制圆环进度文字 
     * @param {string | number} text
    */
    function drawText(text) {
        // 不设置字体大小将不会显示字体
        if (!info.fontSize) return; 
        // /** 画布上的矩形的像素数据 */
        // const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        // context.putImageData(imgData, 0, 0);
        // 设置文字样式
        context.font = `${ (info.fontWeight || "normal") } ${ (info.fontSize * scaleValue) }px ${ (info.fontStyle || "Arial") }`;
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
        const value = progress / 100;
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
            clearAnimation(animationId);
        }
    }
}

const ringBox = document.querySelector(".ring_box");

// const ring = ringProgress({
//     el: ringBox,
//     lineWidth: 20,
//     lineColor: "#6990f6",
//     fontColor: "#6990f6",
//     fontSize: 30,
//     fontWeight: "bold",
//     fontStyle: "Helvetica"
// });

const ring = ringProgressRadius({
    el: ringBox,
    lineWidth: 20,
    lineColor: "#6990f6",
    fontColor: "#6990f6",
    lineLayerColor: "pink",
    fontSize: 30,
    fontPaddingBottom: 4,
    fontWeight: "bold",
    fontStyle: "Helvetica",
    stateFontSize: 15,
    statePaddingBottom: 20
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

/**
 * 百分比圆环（半圆）
 * @param {object} info 圆环的信息
 * @param {HTMLElement} info.el 挂载的节点
 * @param {number} info.lineWidth 圆环的宽度（像素）
 * @param {string} info.lineColor 圆环的颜色: rgba() | rgb() | #xxx | orange
 * @param {string} info.lineLayerColor 圆环的底色: rgba() | rgb() | #xxx | orange
 * @param {string} info.backgroundColor 背景颜色: rgba() | rgb() | #xxx | orange
 * @param {string} info.fontColor 字体颜色：rgba()|rgb()|#xxx|orange
 * @param {number} info.fontSize 字体大小（像素）
 * @param {number} info.fontPaddingBottom 字体下边距（像素）
 * @param {"bold"} info.fontWeight 字重：只有"bold"和不传（普通）两种
 * @param {"Arial"|"Helvetica"} info.fontStyle 字体样式，只枚举了两种，具体跟`css`一致
 * @param {number} info.stateFontSize 状态字体大小（像素）
 * @param {number} info.statePaddingBottom 状态字体下边距（像素）
 * @param {string} info.stateFontColor 状态字体字体颜色：rgba()|rgb()|#xxx|orange
 * @param {"bold"} info.stateFontWeight 状态字重：只有"bold"和不传（普通）两种
 */
function ringProgressRadius(info) {
    if (!info.el) return console.warn("没有设置挂载 canvas 的节点!!!");
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
    const canvas = document.createElement("canvas");    
    const context = canvas.getContext("2d");
    /** 结束角 */
    const CIRC = Math.PI;
    /** 起始角，以弧度计（弧的圆形的三点钟位置是 0 度） */
    const QUART = Math.PI;
    /** 缩放比 */
    const scaleValue = window.devicePixelRatio <= 1 ? 2 : window.devicePixelRatio;
    /** 百分比字体下边距 */
    const paddingBottom = info.fontPaddingBottom ? scaleValue * info.fontPaddingBottom : 0;
    /** 状态字体下边距 */
    const statePaddingBottom = info.statePaddingBottom ? scaleValue * info.statePaddingBottom : 0;
    /** 当前动画的`id` */
    let animationId = 0;
    /** 圆环进度 0-1 */
    let progress = 0; 
    /** 当前进度 */
    let progressNow = 68;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    info.el.appendChild(canvas);

    canvas.width = info.el.clientWidth * scaleValue;
    canvas.height = info.el.clientHeight * scaleValue;
    
    /** 圆环尺寸 */
    const ringSize = Math.min(canvas.width, canvas.height) - scaleValue; 
    /** 中心坐标`x` */
    const centerX = canvas.width / 2;

    /** 绘制背景 */
    function drawBackground() {
        context.beginPath();
        context.lineWidth = (info.lineWidth || 1) * scaleValue;
        /** 圆环的半径 这里要减去圆环的线宽 */
        const radius = ringSize - context.lineWidth * 2; 
        context.arc(centerX, canvas.height - context.lineWidth / 2, radius, -QUART, 0, false);
        context.fillStyle = info.backgroundColor || "#ffffff";
        context.fill();
        context.closePath();
    }

    /** 绘制底层圆环 */
    function drawLayerLine() {
        context.beginPath();
        context.strokeStyle = info.lineLayerColor || "#eeeeee";
        context.lineCap = "round";
        context.lineWidth = (info.lineWidth || 1) * scaleValue;
        /** 圆环的半径 这里要减去圆环的线宽 */
        const radius = ringSize - context.lineWidth * 2; 
        context.arc(centerX, canvas.height - context.lineWidth, radius, -QUART, CIRC - QUART, false);
        context.stroke();
        // context.fill();
        context.closePath();
    }
    
    /** 
     * 绘制圆环进度 
     * @param {number} value
    */
    function drawLine(value) {
        context.beginPath();
        context.strokeStyle = info.lineColor || "orange";
        context.lineCap = "round";
        context.lineWidth = (info.lineWidth || 1) * scaleValue;
        /** 圆环的半径 这里要减去圆环的线宽 */
        const radius = ringSize - context.lineWidth * 2; 
        context.arc(centerX, canvas.height - context.lineWidth, radius, -QUART, CIRC * value - QUART, false);
        context.stroke();
        // context.fill();
        context.closePath();
    }
    
    /** 
     * 绘制圆环进度文字 
     * @param {string | number} text
    */
    function drawText(text) {
        // 不设置字体大小将不会显示字体
        if (!info.fontSize) return; 
        // 设置文字样式
        context.font = `${ (info.fontWeight || "normal") } ${ (info.fontSize * scaleValue) }px ${ (info.fontStyle || "Arial") }`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = info.fontColor || "orange";
        // 绘画文字
        context.fillText(text + "%", centerX, canvas.height - context.lineWidth - statePaddingBottom - (info.stateFontSize * 1.5 * scaleValue) - paddingBottom);
    }

    /** 
     * 绘制圆环状态文字 
     * @param {string | number} text
    */
    function drawState(text) {
        // 不设置字体大小将不会显示字体
        if (!info.stateFontSize) return; 
        // 设置文字样式
        context.font = `${ (info.stateFontWeight || "normal") } ${ (info.stateFontSize * scaleValue) }px ${ (info.fontStyle || "Arial") }`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = info.stateFontColor || "#999";
        // 绘画文字
        context.fillText(text, centerX, canvas.height - context.lineWidth - statePaddingBottom);
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
        const value = progress / 100;
        drawBackground();
        drawLayerLine();
        drawLine(value);
        drawText(progress);
        drawState(value == 1 ? "完成" : "未完成");
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
            clearAnimation(animationId);
        }
    }
}