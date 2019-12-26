(function () {
    const content = document.querySelector('.box');
    const activeClassName = 'item-active';
    /** 动画进行列表 */
    const list = [0, 1, 2, 5, 8, 7, 6, 3];
    /** 概率列表（加起来必须是100）对应上面 */
    const rangeList = [1, 5, 37, 20, 10, 10, 8, 9];
    /** 最高延迟毫秒 */
    const maxTime = 220;
    /** 最低延迟毫秒 */
    const minTime = 80;
    /** 圈数 */
    let circleTotal = 4;
    /** 每一次减少的毫秒间隔 */
    let reduceValue = 5;
    /** 动画进行状态 */
    let move = false;
    /** 动画闪烁索引 */
    let index = 0;
    /** 定时器间隔 */
    let interval = 0;
    /** 最终结果索引 */
    let resultIndex = 0;
    /** 圈数 */
    let count = 0;

    /** 获取概率索引 */
    function getRangeIndex() {
        /** 抽奖概率范围 */
        const range = parseInt(100 * Math.random()) + 1;
        /** 概率索引 */
        let index = 0;
        /** 单个概率 */
        let rate = 0;
        for (let i = 0; i < rangeList.length; i++) {
            const number = rangeList[i];
            rate += number;
            if (range <= rate) {
                index = i;
                break;
            }
        }
        console.log(`概率:${rangeList[index]}% 索引:${index}`);
        return index;
    }

    /** `item`闪烁到下一个 */
    function next() {
        const beforeIndex = index > 0 ? index - 1 : list.length - 1;
        content.children[list[beforeIndex]].classList.remove(activeClassName);
        content.children[list[index]].classList.add(activeClassName);
        if (circleTotal > 0 || index != resultIndex) {
            index++;
            count++;
            if (index > list.length - 1) {
                index = 0;
            }
            if (count == list.length) {
                count = 0;
                circleTotal--;
                // console.count('圈数');
            }
            interval -= reduceValue;
            // console.log(interval);
            setTimeout(next, interval);
        } else {
            move = false;
        }
    }

    /** 点击开始 */
    function srart() {
        if (move) return;
        move = true;
        count = 0;
        circleTotal = 3;
        resultIndex = getRangeIndex();
        reduceValue = Math.floor((maxTime - minTime) / (circleTotal * list.length));
        interval = maxTime;
        next();
    }

    // 添加点击事件
    content.children[4].addEventListener('click', srart);
})();