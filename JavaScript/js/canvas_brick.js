/**
 * 俄罗斯方块（未完成）
 */
class Tetris {
    /**
     * @type {CanvasRenderingContext2D}
     */
    context = null;

    /**
     * 缓存数据（减少性能消耗）
     * @type {number[][]}
     */
    cacheList = null;

    /**
     * 地图数据
     * @type {number[][]}
     */
    map = null;

    /** 整体节点数据 */
    node = {
        /** 行数 */
        row: 30,
        /** column */
        column: 30,
        /** 间距 */
        spacing: 4,
        /** 网格大小 */
        size: 20
    }

    /** 砖块数据 */
    brick = {
        /** x坐标 */
        x: 0,
        /** y坐标 */
        y: 0,
        /** 砖块宽度 */
        width: 0,
        /** 砖块高度 */
        height: 0,
        /**
         * 砖块类型
         * @type {number[][]}
         */
        type: null
    }

    /** 倒计帧下落 */
    downCount = 0;

    /**
     * 初始化
     * @param {HTMLCanvasElement} el canvas节点
     */
    init(el) {
        // 设置容器大小
        el.width = this.node.row * (this.node.spacing + this.node.size) - this.node.spacing;
        el.height = this.node.column * (this.node.spacing + this.node.size) - this.node.spacing;

        this.context = el.getContext('2d');
        this.map = this.createMap();
        this.createBlock();

        const render = () => {
            this.update();
            this.downCount++;
            if (this.downCount >= 60) {
                this.downCount = 0;
                this.move('bottom');
            }
            window.requestAnimationFrame(render);
        }
        render();

        this.onKeyDown();
    }

    /**
     * 创建地图数据
     * @return {number[][]}
     */
    createMap() {
        if (this.cacheList) return JSON.parse(JSON.stringify(this.cacheList));
        this.cacheList = [];
        for (let i = 0; i < this.node.column; i++) {
            this.cacheList.push([]);
            this.cacheList[i].length = this.node.row;
            this.cacheList[i].fill(0);
        }
        return JSON.parse(JSON.stringify(this.cacheList));
    }

    /** 创建一个砖块 */
    createBlock() {
        /** 方块类型 */
        const types = [
            [[1, 1, 1, 1]],
            [[1, 1], [1, 1]],
            [[1, 1, 0], [0, 1, 1]],
            [[0, 1, 1], [1, 1, 0]],
            [[0, 1, 0], [1, 1, 1]],
            [[1, 0, 0], [1, 1, 1]],
            [[0, 0, 1], [1, 1, 1]]
        ];
        let index = Math.floor(Math.random() * types.length);
        let type = types[index];
        // 初始化砖块参数
        this.brick.type = type;
        this.brick.width = Math.max(type[0].length, type[1] ? type[1].length : 0);
        this.brick.height = type.length;
        this.brick.y = 0;
        this.brick.x = Math.floor(this.node.row / 2) - Math.floor(type[0].length);
    }

    /** 每一帧更新 */
    update() {

        for (let i = 0; i < this.brick.type.length; i++) {
            for (let j = 0; j < this.brick.type[0].length; j++) {
                // 要向 x 轴偏移 需要为 j 加一个偏移量即可
                this.map[i + this.brick.y][j + this.brick.x] = this.brick.type[i][j];
            }
        }

        for (let i = 0; i < this.node.row; i++) {
            for (let j = 0; j < this.node.column; j++) {
                // 判断数组里的值 若为1 则渲染为红色 0 则渲染为白色
                this.context.fillStyle = this.map[i][j] === 0 ? '#fef397' : '#ec3d00';
                let x = (this.node.size + this.node.spacing) * j;
                let y = (this.node.size + this.node.spacing) * i;
                this.context.fillRect(x, y, this.node.size, this.node.size);
            }
        }
    }

    /** 输出下一块砖 */
    next() {
        this.cacheList = JSON.parse(JSON.stringify(this.map));

        // 判断是否游戏结束
        if (this.cacheList) {

        }

        this.createBlock();
    }

    /**
     * 移动
     * @param {'top'|'right'|'bottom'|'left'} direction 方向
     */
    move(direction) {
        switch (direction) {
            case 'top':
                if (this.brick.y <= 0) return;
                this.map = this.createMap();
                this.brick.y--;
                break;

            case 'right':
                if (this.brick.x >= this.node.row - this.brick.width) return;
                this.map = this.createMap();
                this.brick.x++;
                break;

            case 'bottom':
                if (this.brick.y >= this.node.column - this.brick.height) return this.next();
                this.map = this.createMap();
                this.brick.y++;
                break;

            case 'left':
                if (this.brick.x <= 0) return;
                this.map = this.createMap();
                this.brick.x--;
                break;
        }
    }

    /** 监听键盘事件 */
    onKeyDown() {
        document.addEventListener('keydown', e => {
            // console.log(e.keyCode);
            switch (e.keyCode) {
                case 38:
                    // console.log('上');
                    // this.move('top');
                    break;

                case 39:
                    // console.log('右');
                    this.move('right');
                    break;

                case 40:
                    // console.log('下');
                    this.downCount = 0;
                    this.move('bottom');
                    break;

                case 37:
                    // console.log('左');
                    this.move('left');
                    break;
            }
        });
    }
}

const canvas = document.getElementById('main');
const Game = new Tetris();
Game.init(canvas);