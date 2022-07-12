// ============== setTimeout模式 ==============
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
});

// ============== 动画帧模式 ==============
(function () {
  /**
   * 九宫抽奖
   * @param {object} info 
   * @param {number} info.rangeIndex 概率索引`0-7` 
   * @param {(index: number, last: boolean) => void} info.callback 间隔回调
   */
  function luckDrawGrid(info) {
    /**
     * 动画帧
     * @type {requestAnimationFrame}
     */
    const animation = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    /** 圈数（第一圈和最后一圈不算） */
    const circleTotal = 3;
    /** 最小间隔（帧） */
    const minInterval = 6;
    /** 最大间隔（帧） */
    const maxInterval = 26;
    /** 最大索引数 */
    const maxTotal = 8;
    /** 一共要跑的格子总数 */
    let totalGrid = (circleTotal + 2) * maxTotal - (maxTotal - (info.rangeIndex + 1));
    /** 计数间隔 */
    let countInterval = maxInterval;
    /** 计数帧 */
    let countFrame = 0;
    /** 当前索引 */
    let index = 0;
    /** 每次增加&减少值 */
    const value = (maxInterval - minInterval) / maxTotal;

    function update() {
      if (totalGrid <= 0) return;

      if (countFrame >= countInterval) {
        countFrame = 0;
        typeof info.callback === "function" && info.callback(index, totalGrid === 1);

        index++;
        if (index == maxTotal) index = 0;

        // 判断是减速还是加速
        if (totalGrid <= maxTotal) {
          countInterval += value;
          if (countInterval > maxInterval) countInterval = maxInterval;
        } else {
          countInterval -= value;
          if (countInterval < minInterval) countInterval = minInterval;
        }

        totalGrid--;
      }

      countFrame++;
      animation(update);
    }
    update();
    // 先执行一次
    typeof info.callback === "function" && info.callback(index, false);
  }

  const content = document.querySelector(".box");
  /** 高亮样式 */
  const activeClassName = "item-active";
  /** 动画进行列表 */
  const list = [0, 1, 2, 5, 8, 7, 6, 3];
  /** 概率列表（加起来必须是100）对应上面 */
  const rangeList = [1, 5, 37, 20, 10, 10, 8, 9];

  function switchItem(index) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (i == index) {
        content.children[list[index]].classList.add(activeClassName);
        content.children[list[index]].textContent = `${i + 1}: index-${i}`
      } else {
        content.children[item].classList.remove(activeClassName);
        content.children[item].textContent = i + 1;
      }
    }
  }

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

  let isMove = false;

  content.children[4].addEventListener('click', function () {
    if (isMove) return console.log("动画进行中");
    isMove = true;
    luckDrawGrid({
      rangeIndex: getRangeIndex(),
      callback(index, last) {
        // console.log(index);
        switchItem(index);
        if (last) {
          // console.log(index);
          isMove = false;
        }
      }
    })
  });

})();