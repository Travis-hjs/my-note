(function () {
  /**
   * @type {HTMLElement}
   */
  const box = document.querySelector('.box');
  const boxList = box.nextElementSibling;

  /**
   * 绘画单个五角星
   * @param {HTMLElement} el 
   * @learn https://www.cnblogs.com/wufangfang/p/6373972.html
   */
  function drawSingleStar(el) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // 设置canvas尺寸
    el.appendChild(canvas);
    canvas.width = el.clientWidth;
    canvas.height = el.clientHeight;

    context.beginPath();

    /** 半径 */
    const radius = Math.min(canvas.width, canvas.height) / 2;
    /** 每个角的厚度 */
    const angle = radius / (150 / 68);

    //设置是个顶点的坐标，根据顶点制定路径   
    for (let i = 0; i < 5; i++) {
      context.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * radius + radius, -Math.sin((18 + i * 72) / 180 * Math.PI) * radius + radius);
      context.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * angle + radius, -Math.sin((54 + i * 72) / 180 * Math.PI) * angle + radius);
    }
    context.closePath();

    //设置边框样式以及填充颜色   
    // context.lineWidth = '2';
    context.fillStyle = 'yellow';
    context.strokeStyle = 'yellow';
    context.fill();
    context.stroke();
  }

  drawSingleStar(box);

  /**
   * 绘画星星列表
   * @param {object} option 
   * @param {HTMLElement} option.el 节点容器
   * @param {Array<boolean>} option.list 星星列表
   * @param {number} option.starWidth 星星宽度
   * @param {number} option.interval 星星之间距离
   */
  function drawStarList(option) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // 设置canvas尺寸
    option.el.appendChild(canvas);
    canvas.width = option.el.clientWidth;
    canvas.height = option.el.clientHeight;

    /** 星星列表 */
    const starList = option.list || [true, true, true, false, false];
    /** 星星间隔 */
    const interval = option.interval || 4;
    /** 半径 */
    const radius = option.starWidth ? option.starWidth / 2 : ((canvas.width - (starList.length - 1) * interval) / starList.length) / 2;
    /** 每个角的厚度 */
    const angle = radius / (150 / 68);

    /**
     * 绘画单个星星
     * @param {number} index 
     */
    function drawStarSing(index) {
      const x = (radius * 2 + interval) * index;
      context.beginPath();
      //设置是个顶点的坐标，根据顶点制定路径   
      for (let i = 0; i < 5; i++) {
        context.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * radius + radius + x, -Math.sin((18 + i * 72) / 180 * Math.PI) * radius + radius);
        context.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * angle + radius + x, -Math.sin((54 + i * 72) / 180 * Math.PI) * angle + radius);
      }
      context.closePath();

      //设置边框样式以及填充颜色   
      // context.lineWidth = '2';
      const color = starList[index] ? 'yellow' : '#eeeeee';
      context.fillStyle = color;
      context.strokeStyle = color;

      context.fill();
      context.stroke();
    }

    for (let i = 0; i < starList.length; i++) {
      drawStarSing(i);
    }
  }

  drawStarList({
    el: boxList,
    list: [true, false, false, false],
    // starWidth: 30,
    // interval: 10
  });

})();