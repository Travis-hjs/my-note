(function() {
    const webUrl = 'https://img12.360buyimg.com/img/';

    let images = [
        'jfs/t1/93992/8/9049/4680/5e0aea04Ec9dd2be8/608efd890fd61486.png',
        'jfs/t1/108305/14/2849/4908/5e0aea04Efb54912c/bfa59f27e654e29c.png',
        'jfs/t1/98805/29/8975/5106/5e0aea05Ed970e2b4/98803f8ad07147b9.png',
        'jfs/t1/94291/26/9105/4344/5e0aea05Ed64b9187/5165fdf5621d5bbf.png',
        'jfs/t1/102753/34/8504/5522/5e0aea05E0b9ef0b4/74a73178e31bd021.png',
        'jfs/t1/102954/26/9241/5069/5e0aea05E7dde8bda/720fcec8bc5be9d4.png'
    ];
    
    images = images.map(item => webUrl + item);

    /**
     * canvas点赞动画
     * @param {object} option
     * @param {HTMLElement} option.el 要输出的节点
     * @param {Array<string>} option.imgList 点赞图片列表
     */
    function canvasLikeAnimation(option) {
        // if (!option.el) return console.warn('缺少输出节点');
        // if (!option.imgList.length) return console.warn('图片列表不能为空');
        // const a = new Image();
        const animationFrame = requestAnimationFrame;
        /**
         * 图片对象列表
         * @type {Array<HTMLImageElement>}
         */
        const images = [];
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = option.el.clientWidth;
        canvas.height = option.el.clientHeight;
        option.el.appendChild(canvas);

        /** 
         * 节点列表对象 
         * @type {Array<{id: string, node: {render(): void}}>}
        */
        const nodeList = [];
        /** 节点数量，默认10个 */
        let nodeTotal = 10;
        /** 节点的`id`递增 */
        let nodeId = 0;

        /**
         * 获取随机数
         * @param {number} min
         * @param {number} max 
         */
        function ranInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        /**
         * 加载图片，完成后添加到列表中去
         * @param {string} src 图片路径
         */
        function loadImage(src) {
            const image = new Image;
            image.onload = function() {
                images.push(image);
            }
            image.src = src;
        }

        // 加载图片列表
        for (let i = 0; i < option.imgList.length; i++) {
            const path = option.imgList[i]; 
            loadImage(path);
        }

        /** 
         * 单个节点函数 
         * @param {number} id 节点id
        */
        function node(id) {
            const addY = 4;
            const addX = 1.5;
            const centerX = canvas.width / 2;
            /** @type {HTMLImageElement} */
            let image = null;
            let y = 0;
            let x = 0;
            let direction = 1;
            let speed = 0.1;
            let alpha = 0;
            let scale = 0;
            let maxScale = 0;
            let initX = 0;
            let offsetX = 0;
            /** 初始化运动参数 */
            function init() {
                image = images[ranInt(0, images.length - 1)];
                y = canvas.height;
                direction = ranInt(0, 1) > 0 ? 1 : -1;
                initX = x = centerX + ranInt(0, 10) * direction;
                speed = ranInt(5, 10) / 10;
                maxScale = ranInt(6, 12) / 10;
                alpha = 1;
                scale = 0;
                offsetX = 12;
            }

            /** 每一帧运动函数 */
            function move() {
                // 初始化缩放是固定的移动速度
                if (scale < maxScale) {
                    scale += 0.06;
                    y -= 2.4;
                    if (scale >= maxScale) scale = maxScale;
                    return;
                }

                // 判断左右两边交替位置
                if (x >= initX + offsetX) {
                    offsetX += 2;
                    direction = -1;
                } else if (x <= initX - offsetX) {
                    offsetX += 2;
                    direction = 1;
                }

                // 判断左右晃动的范围
                if (offsetX > 26) offsetX = 26;
                
                y = y - (addY * speed);

                x = x + (addX * speed) * direction;

                // 判断快结束时透明值
                if (y <= (image.height / 3) + (addY * speed * 20)) {
                    alpha = (alpha * 100 - 5) / 100;
                    if (alpha <= 0) alpha = 0;
                }

                // 判断运动到顶部结束
                if (y <= image.height / 3) {
                    if (nodeList.length > nodeTotal) {
                        for (let i = 0; i < nodeList.length; i++) {
                            const item = nodeList[i];
                            if (item.id == id) {
                                item.node = null;       // 释放内存
                                nodeList.splice(i, 1);  // 从列表中删除自己
                                break;
                            }
                        }
                    } else {
                        init();
                    }
                }
            }
            init();
            return {
                render() {
                    context.save();
                    context.translate(x, y);
                    context.scale(scale, scale);
                    context.globalAlpha = alpha;
                    context.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);
                    context.restore();
                    move();
                }
            }
        }

        /** 每一帧渲染函数 */
        function render() {
            // console.log(images);
            // 没有加载出图片的时候阻止渲染
            if (images.length == 0) return;
            // 判断总数是否足够，不够则添加进去
            if (nodeList.length < nodeTotal) {
                nodeId ++;
                const id = 'node-' + nodeId;
                nodeList.push({
                    id: id,
                    node: node(id)
                });
            }
            // 这里要先清除当前画布
            context.clearRect(0, 0, canvas.width, canvas.height);
            // 逐个节点渲染
            for (let i = 0; i < nodeList.length; i++) {
                const item = nodeList[i];
                item.node.render();
            }
        }
            

        function update() {
            render();
            animationFrame(update);
        }
        update();

        return {
            /**
             * 设置显示的数量
             * @param {number} n 
             */
            setNumber(n) {
                nodeTotal = n;
                console.log('点赞总数：', nodeTotal);
                
            }
        }
    }

    let number = 10;

    const like = canvasLikeAnimation({
        el: document.querySelector('.box'),
        imgList: images
    });
    
    // console.log(images);
    document.querySelector('.add').addEventListener('click', function() {
        number ++;
        like.setNumber(number);
    });

    document.querySelector('.remove').addEventListener('click', function() {
        if (number == 1) return;
        number --;
        like.setNumber(number);
    });

})();