/**
 * 百分百圆环
 * @param {HTMLCanvasElement} el
 * @param {object} info 圆环的信息
 * @param {number} info.width 宽
 * @param {number} info.height 高
 * @param {number} info.lineWidth 圆环的宽度 
 * @param {string} info.lineColor 圆环的颜色: rgba()|rgb()|#xxx|orange
 * @param {string} info.fontStyle 字体样式：'bold 35px Arial'
 * @param {string} info.fontColor 字体颜色：rgba()|rgb()|#xxx|orange
 */
function ringProgress(el, info) {
    if (!el) return console.warn('没有设置 canvas 节点!!!');
    /**
     * 动画帧
     * @type {requestAnimationFrame}
     */
    const animation = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    /** canvas节点 */
    const node = el;    
    /** canvas 上下文 */
    const context = el.getContext('2d');
    /** 结束角 */
    const CIRC = Math.PI * 2;
    /** 起始角，以弧度计（弧的圆形的三点钟位置是 0 度） */
    const QUART = Math.PI / 2;
    /** 圆环进度 0-1 */
    let progress = 0; 
    /** 当前进度 */
    let progress_now = 50;
    /**
     * 画布上的矩形的像素数据
     * @type {ImageData}
     */
    let imgData = null;
    node.width = info.width || 200;
    node.height = info.height || 200;

    /** 圆环尺寸 */
    let ringSize = Math.min(node.width, node.height);

    // 初始化绘画圆环
    context.beginPath();
    context.strokeStyle = info.lineColor || 'orange';
    context.lineCap = 'round';
    context.lineWidth = info.lineWidth || 1;
    context.closePath();
    context.fill();
    imgData = context.getImageData(0, 0, node.width, node.height);

    // 设置文字样式
    context.font = info.fontStyle || 'bold 35px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = info.fontColor || 'orange';

    // 这里要减去圆环的线宽
    ringSize -= context.lineWidth;

    /**
     * 设置百分比 0 - 100
     * @param {number} value 百分比数字
     */
    function setValue(value) {
        progress_now = value;
        if (progress_now > 100) progress_now = 100;
        if (progress_now < 0) progress_now = 0; 
    }

    /** 每一帧更新 */
    function update() {
        if (progress > progress_now) {
            progress --;
            if (progress <= progress_now) progress = progress_now;
        }

        if (progress < progress_now) {
            progress ++;
            if (progress >= progress_now) progress = progress_now;
        }

        /** 百分比值 */
        let value = progress / 100;
        let x = node.width / 2;
        let y = node.height / 2;
        let radius = ringSize / 2;

        context.putImageData(imgData, 0, 0);
        context.beginPath();
        context.arc(x, y, radius, -QUART, CIRC * value - QUART, false);
        context.stroke();
        // context.fill();

        // 绘画文字
        context.fillText(progress + '%', x, y);

        animation(update);
    }
    update();
    
    return {
        setValue
    }
}

const canvas = document.getElementById('ring');

const ring = ringProgress(canvas, {
    width: 500,
    height: 300,
    lineWidth: 20,
    lineColor: '#6990f6',
    fontColor: '#6990f6'
});

/**
 * @type {HTMLElement}
 */
const line = document.querySelector('.progress');

line.style.backgroundSize = '50%';

/**
 * 输入百分比值
 * @param {HTMLInputElement} el 
 */
function inputNumber(el) {
    ring.setValue(el.value);
    line.style.backgroundSize = el.value + '%';
}

