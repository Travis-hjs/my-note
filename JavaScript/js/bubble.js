function start() {
    /** canvas容器 */
    const canvas = utils.find('.bubble');
    /** 圆 */
    const context = canvas.getContext('2d');
    /** 清空绘画 */
    function removeDraw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // console.log('清空 canvas 所有绘画');
    }

    /** 每一帧更新的函数列表 */
    let updateList = [];

    /** 颜色列表 */
    let colorList = ['orange', 'purple', '#0ae004', '#00c9d0', '#fcff00', '#ff006c', '#0036ff'];

    /** 气泡数量 */
    let bubble_total = 30;

    /** 最外层容器尺寸 */
    let size = utils.getRect(utils.find('.page'));

    // 设置 canvas 尺寸
    canvas.width = size.width;
    canvas.height = size.height;
    
    /**
     * 绘画圆
     * @param {CanvasRenderingContext2D} context CanvasRenderingContext2D 对象
     * @param {object} node 圆的节点属性
     */
    function drawCircular(context, node) {
        // 路径开始 相当于 <div>
        context.beginPath();
        // 绘画一个圆
        context.arc(node.x, node.y, node.radius, 0, 2 * Math.PI, false);
        // 填充色
        context.fillStyle = node.color;
        // 设置透明度
        context.globalAlpha = node.opacity;
        // 填充
        context.fill();

        // 描边色
        // context.strokeStyle = '#ccc';
        // 填充描边
        // context.stroke();

        // 路径介绍 相当于 </div>
        context.closePath();
    }

    /** 创建气泡 */
    function createBubble() {
        /** 创建一个节点属性 */
        const node = {
            /** 节点半径 */
            radius: 50,
            /** 最大半径 */
            max_radius: 80,
            /** 节点 x 位置 */
            x: 0,
            /** 节点 y 位置 */
            y: 0,
            /** 节点颜色 */
            color: 'orange',
            /** 透明 */
            opacity: 0.5,
            /** 左右移动的范围 */
            move_range: 100,
            /** 范围 */
            range: 80,
            /** 水平方向 */
            direction: Math.floor(2 * Math.random()) > 0 ? 1 : -1, 
            /** 移动速度 */
            speed: {
                /** 水平速度 */
                horizontal: 1,
                /** 垂直速度 */
                vertical: 1
            }
        };

        /** 初始化 node 参数 */
        function initNode() {
            node.radius = 15;
            node.opacity = 0.15;
            node.move_range = node.range;
            node.x = Math.floor((canvas.width - node.radius * 2) * Math.random()) + node.radius;
            node.y = canvas.height + node.radius;
            node.color = colorList[Math.floor(colorList.length * Math.random())];
            node.speed.vertical = 2.2 * Math.random() + 0.8;
        }

        initNode();
        drawCircular(context, node);
        // console.log('节点属性', node);

        /** 圆运动 */
        function move() {
            node.x += node.direction;
            node.y -= node.speed.vertical;

            // 透明度
            if (node.opacity < 0.6) {
                node.opacity += 0.002 * node.speed.vertical;
                if (node.opacity >= 0.6) node.opacity = 0.6;
            }

            // 扩大
            if (node.radius < node.max_radius) {
                node.radius += 0.1 * node.speed.vertical;
                if (node.radius >= node.max_radius) node.radius = node.max_radius;
            }

            // 左右移动
            node.move_range -= 1;
            if (node.move_range == 0) {
                node.move_range = node.range;
                node.direction = node.direction > 0 ? -1 : 1;
            }

            // 判断正负水平移动范围
            if (node.x >= canvas.width - node.radius) {
                node.direction = -1;
                node.move_range = node.range;
            }
            if (node.x <= node.radius) {
                node.direction = 1;
                node.move_range = node.range;
            }

            // 判断垂直移动范围
            if (node.y <= -node.radius) {
                initNode();
            }
            drawCircular(context, node);
        }
        // 添加到动画帧更新
        updateList.push(move);
    }

    for (let i = 0; i < bubble_total; i++) {
        createBubble();
    }

    utils.update(function () {
        if (updateList.length) {
            // 这里一定要清空再重新绘画
            removeDraw();
            for (let i = 0; i < updateList.length; i++) {
                const item = updateList[i];
                if (typeof item === 'function') {
                    item();
                }
            }
        }
    });
}
start();
