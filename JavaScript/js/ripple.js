/** 旧版的做法 canvas 绘画 效果不好 */
function rippleClick(el) {
    let canvas = {},
        context = {},
        centerX = 0,
        centerY = 0,
        radius = 0,
        scale = 8,  // 这个值和扩散速度有关
        color = el.dataset.color || '#999999',
        myAinmFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
        ev = window.event || arguments.callee.caller.arguments[0];
    canvas = document.createElement('canvas');
    el.appendChild(canvas);
    canvas.style.width = canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    context = canvas.getContext('2d');
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
 * 水波纹节点对象池
 * @type {Array<HTMLElement>}
 */
const RIPPLE_LIST = [];

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
    let ripple = null;

    // 从对象池里面拿取节点
    if (RIPPLE_LIST.length > 1) {
        ripple = RIPPLE_LIST.shift(); 
    } else {
        ripple = document.createElement('div');
        ripple.className = 'ripple';
    }

    /** 点击目标矩阵尺寸 */
    let rect = target.getBoundingClientRect();
    /** 当前自定义颜色值 */
    let color = target.getAttribute('color');
    /** 波纹大小 */
    let size = Math.max(rect.width, rect.height);
    // 设置最大范围
    if (size > 200) size = 200;
    // 设置大小
    ripple.style.height = ripple.style.width = size + 'px';
    // 默认是白色透明
    ripple.style.backgroundColor = color || 'rgba(255, 255, 255, .45)';
    // 这里必须输出节点后再设置位置，不然会有问题
    target.appendChild(ripple);

    let y = event.touches ? event.touches[0].pageY : event.clientY;
    let x = event.touches ? event.touches[0].pageX : event.clientX;
    let top = y - rect.top - (ripple.offsetHeight / 2);
    let left = x - rect.left - (ripple.offsetWidth / 2);
    // console.log(top, left);
    ripple.style.top = top + 'px';
    ripple.style.left = left + 'px';

    function an() {
        ripple.removeEventListener('animationend', an);
        // console.log('动画结束', ripple);
        target.removeChild(ripple);
        RIPPLE_LIST.push(ripple);
    }
    ripple.addEventListener('animationend', an);
}

/** 是否移动端 */
let isMobile = utils.checkMobile();

/** 添加事件类型 */
let eventType = isMobile ? 'touchstart' : 'mousedown';

/** 创建按钮 */
function createButton() {
    /** 按钮列表 */
    let listNode = utils.find('.button-list');
    
    for (let i = 0; i < 11; i++) {
        const button = document.createElement('button');
        button.className = 'button';
        button.setAttribute('ripple', 'true');
        button.textContent = 'BUTTON-' + (i + 1);
        listNode.appendChild(button);
    }
}
createButton();

// 这里我使用事件代理去完成方法操作
// 因为我在Vue项目中，节点是动态生成的，不可能每次生成都单独为对应节点绑定事件
document.body.addEventListener(eventType, function(e) {
    /** 事件类型 */
    let event = e || window.event || arguments.callee.caller.arguments[0];
    /** 循环的次数 */
    let loop_count = 3; // 这里的 3 次是布局的子节点层数，可根据布局层数增加减少
    /** 
     * 定义目标变量 
     * @type {HTMLElement} 
     */
    let target = event.target;
    // 循环 3 次由里向外查找目标节点
    while(loop_count > 0 && target != document.body) {
        loop_count --;
        if(target.getAttribute('ripple') === 'true') {
            ripple(event, target);
            break;
        }
        target = target.parentNode;
    }
});
