
class NodeModule {
    /**
     * 节点组件
     * @author hjs
     * @param {HTMLCanvasElement} canvas 父容器 canvas
     * @param {CanvasRenderingContext2D} context 上下文
     */
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.init();
    }

    /**
     * canvas容器
     * @private 
     * @type {HTMLCanvasElement}
     */
    canvas = null;

    /**
     * 上下文
     * @private 
     * @type {CanvasRenderingContext2D}
     */
    context = null;

    /** 节点半径 */
    radius = 50;
    /** 最大半径 */
    max_radius = 80;
    /** 节点 x 位置 */
    x = 0;
    /** 节点 y 位置 */
    y = 0;
    /** 节点颜色 */
    color = 'orange';
    /** 透明 */
    opacity = 0.5;
    /** 左右移动的范围 */
    move_range = 100;
    /** 范围 */
    range = 80;
    /** 水平方向 */
    direction = Math.floor(2 * Math.random()) > 0 ? 1 : -1; 
    /** 移动速度 */
    speed = {
        /** 水平速度 */
        horizontal: 1,
        /** 垂直速度 */
        vertical: 1
    }

    /** 颜色列表 */
    colorList = ['orange', 'purple', '#0ae004', '#00c9d0', '#fcff00', '#ff006c', '#0036ff'];

    /** 初始化节点参数 */
    init() {
        this.radius = 15;
        this.opacity = 0.15;
        this.move_range = this.range;
        this.x = Math.floor((this.canvas.width - this.radius * 2) * Math.random()) + this.radius;
        this.y = this.canvas.height + this.radius;
        this.color = this.colorList[Math.floor(this.colorList.length * Math.random())];
        this.speed.vertical = 2.2 * Math.random() + 0.8;
    }

    /** 绘画圆 */
    draw() {
        // 路径开始 相当于 <div>
        this.context.beginPath();
        // 绘画一个圆
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        // 填充色
        this.context.fillStyle = this.color;
        // 设置透明度
        this.context.globalAlpha = this.opacity;
        
        // 描边色
        // this.context.strokeStyle = '#ccc';
        // 填充描边
        // this.context.stroke();

        // 路径结束 相当于 </div>
        this.context.closePath();
        // 填充
        this.context.fill();
    }

    /** 圆运动 */
    move() {
        this.x += this.direction;
        this.y -= this.speed.vertical;

        // 透明度
        if (this.opacity < 0.6) {
            this.opacity += 0.002 * this.speed.vertical;
            if (this.opacity >= 0.6) this.opacity = 0.6;
        }

        // 扩大
        if (this.radius < this.max_radius) {
            this.radius += 0.1 * this.speed.vertical;
            if (this.radius >= this.max_radius) this.radius = this.max_radius;
        }

        // 左右移动
        this.move_range -= 1;
        if (this.move_range == 0) {
            this.move_range = this.range;
            this.direction = this.direction > 0 ? -1 : 1;
        }

        // 判断正负水平移动范围
        if (this.x >= this.canvas.width - this.radius) {
            this.direction = -1;
            this.move_range = this.range;
        }
        if (this.x <= this.radius) {
            this.direction = 1;
            this.move_range = this.range;
        }

        // 判断垂直移动范围
        if (this.y <= -this.radius) {
            this.init();
        }
        this.draw();
    }

    /** 每一帧更新 */
    update() {
        this.move();
    }
}

class Main {
    /**
     * 主函数
     * @author hjs
     * @param {HTMLElement} el canvas 输出节点
     * @param {number} total 气泡总数
     */
    constructor(el, total) {
        if (!el) return console.warn('没有指定输出容器节点');
        if (typeof total === 'number') this.bubble_total = total;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.size = el.getBoundingClientRect();
        // 初始化 canvas 尺寸
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        // 输出 canvas
        el.appendChild(this.canvas);
        this.start();
    }

    /**
     * canvas容器
     * @private 
     * @type {HTMLCanvasElement}
     */
    canvas = null;

    /**
     * 上下文
     * @private 
     * @type {CanvasRenderingContext2D}
     */
    context = null;

    /**
     * 最外层容器尺寸
     * @private
     * @type {ClientRect | DOMRect}
     */
    size = null;

    /**
     * 气泡总数
     * @private
     */
    bubble_total = 30;

    /**
     * 节点列表
     * @private
     * @type {Array<NodeModule>}
     */
    nodeList = [];

    /** 清空绘画 */
    remove() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // console.log('清空 canvas 所有绘画');
    }

    start() {
        for (let i = 0; i < this.bubble_total; i++) {
            setTimeout(() => {
                const node = new NodeModule(this.canvas, this.context);
                this.nodeList.push(node);
            }, i * 300);
        }
        
        utils.update(() => {
            if (this.nodeList.length > 0) {
                // 这里一定要清空再重新绘画
                this.remove();
                for (let i = 0; i < this.nodeList.length; i++) {
                    const node = this.nodeList[i];                    
                    if (node instanceof NodeModule) {
                        node.update();
                    }
                }
            }
        });
    }
}

let page = utils.find('.page');

const bubble = new Main(page);

function screenShot() {
    const imgUrl = bubble.canvas.toDataURL("image/png");
    const image = document.createElement("img");
    image.src = imgUrl;
    document.body.appendChild(image);
}