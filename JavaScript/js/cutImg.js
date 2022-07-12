(function () {
  /**
   * @param {string} name 
   * @returns {HTMLElement}
   */
  const $ = name => document.querySelector(name);

  /**
   * 裁剪图片组件
   * @description 
   * learn: https://juejin.im/post/5e5f5a716fb9a07ca301e3c4#heading-0
   * learn: https://fengyuanchen.github.io/cropperjs/
   * @param {HTMLCanvasElement} canvas 裁剪图片的<canvas>
   */
  function componentCutImg(canvas) {
    /** 上下文 */
    const context = canvas.getContext('2d');

    /** 裁剪框坐标集合 */
    const position = {
      /** 开始`X` */
      sx: 100,
      /** 开始`Y` */
      sy: 100,
      /** 结束`X` */
      ex: 280,
      /** 结束`Y` */
      ey: 240
    }

    /** 四个点的宽度 */
    const spotWidth = 10;

    /**
     * 4个角的坐标
     * @type {Array<{sx: number, sy: number, ex: number, ey: number}>}
     * @description ['左上', '右上', '左下', '右下']
     */
    let rectPosition = [];

    /**
     * 加载好的图片对象
     * @type {HTMLImageElement}
     */
    let image = null;

    /** 是否摁下 */
    let isDown = false;

    /** 鼠标摁下去的坐标 */
    let downPosition = { x: 0, y: 0 };

    /** 
     * `canvas`的缩放比 
     * @description `canvas.width` / `canvas.clientWidth` 
    */
    let scaleValue = 0;

    /**
     * 检测是否相交
     * @param {{x: number, y: number}} pos 对比坐标
     * @param {{sx: number, sy: number, ex: number, ey: number}} target 目标四个矩阵坐标
     */
    function isBounding(pos, target) {
      let result = false;
      if (target.sx <= pos.x && target.ex >= pos.x && target.sy <= pos.y && target.ey >= pos.y) {
        result = true;
      }
      return result;
    }

    /**
     * 监听摁下
     * @param {MouseEvent} e 
     */
    function onDown(e) {
      // console.log(e);
      isDown = true;
      downPosition = {
        x: e.offsetX,
        y: e.offsetY
      }
      onMove(e);
    }

    /**
     * 监听移动
     * @param {MouseEvent} e 
     */
    function onMove(e) {
      /** 裁剪框的宽度 */
      const width = position.ex - position.sx;
      /** 裁剪框的高度 */
      const height = position.ey - position.sy;
      /** 裁剪框的中心坐标 */
      const cut = {
        x: position.ex - width / 2,
        y: position.ey - height / 2
      }
      /** 计算好的鼠标 */
      const offset = {
        x: e.offsetX * scaleValue,
        y: e.offsetY * scaleValue
      }
      /** 是否在裁剪框内 */
      const onBounding = isBounding(offset, position);
      if (onBounding) {
        const lt = isBounding(offset, rectPosition[0]);
        const rt = isBounding(offset, rectPosition[1]);
        const lb = isBounding(offset, rectPosition[2]);
        const rb = isBounding(offset, rectPosition[3]);
        if (lt) {
          // console.log('左上');
          canvas.style.cursor = 'nw-resize';
          // const x = (e.offsetX - downPosition.x) * scaleValue;
          // const y = (e.offsetY - downPosition.y) * scaleValue;
          // position.sx += x;
          // position.sy += y;
          // draw();
          // downPosition.x = e.offsetX;
          // downPosition.y = e.offsetY;
          return;
        } else if (rt) {
          // console.log('右上');
          canvas.style.cursor = 'ne-resize';

          return;
        } else if (lb) {
          // console.log('左下');
          canvas.style.cursor = 'ne-resize';

          return;
        } else if (rb) {
          // console.log('右下');
          canvas.style.cursor = 'nw-resize';

          return;
        } else {
          // console.log('中间');
          canvas.style.cursor = 'move';
          if (isDown) {
            if (offset.x < width / 2) {
              offset.x = width / 2;
            }
            if (offset.x > canvas.width - width / 2) {
              offset.x = canvas.width - width / 2;
            }
            if (offset.y < height / 2) {
              offset.y = height / 2;
            }
            if (offset.y > canvas.height - height / 2) {
              offset.y = canvas.height - height / 2;
            }
            position.sx = offset.x - width / 2;
            position.ex = offset.x + width / 2;
            position.sy = offset.y - height / 2;
            position.ey = offset.y + height / 2;
            draw();
          }

        }
      } else {
        canvas.style.cursor = 'default';
      }
    }

    /** 绘制画布内容 */
    function draw() {
      /** 裁剪框的宽度 */
      const width = position.ex - position.sx;
      /** 裁剪框的高度 */
      const height = position.ey - position.sy;

      // 清除画布
      context.clearRect(0, 0, canvas.width, canvas.height);
      // 绘画图片
      // context.drawImage(image, 0, 0, canvas.width, canvas.height);

      // 绘制遮罩
      context.save();
      context.fillStyle = 'rgba(0,0,0,0.5)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // 将遮罩层挖开
      context.globalCompositeOperation = 'source-atop';
      // 裁剪选择框
      context.clearRect(position.sx, position.sy, width, height);

      // 绘制`4`个边框像素点并保存坐标信息以及事件参数
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = '#ec7259';
      rectPosition = [
        {
          sx: position.sx - spotWidth / 2,
          sy: position.sy - spotWidth / 2
        }, {
          sx: position.sx - spotWidth / 2 + width,
          sy: position.sy - spotWidth / 2
        }, {
          sx: position.sx - spotWidth / 2,
          sy: position.sy - spotWidth / 2 + height
        }, {
          sx: position.sx - spotWidth / 2 + width,
          sy: position.sy - spotWidth / 2 + height
        }
      ];
      for (let i = 0; i < rectPosition.length; i++) {
        const { sx, sy } = rectPosition[i];
        rectPosition[i].ex = sx + spotWidth;
        rectPosition[i].ey = sy + spotWidth;
        context.fillRect(sx, sy, spotWidth, spotWidth);
      }
      context.restore();

      // 使用`drawImage`将图片绘制到遮罩下方
      context.save();
      context.globalCompositeOperation = 'destination-over';
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      context.restore();
    }

    canvas.addEventListener('mousedown', function (e) {
      onDown(e);
    })

    canvas.addEventListener('mousemove', function (e) {
      onMove(e);
    })

    document.addEventListener('mouseup', function () {
      // console.log('松开');
      isDown = false;
    });

    return {
      /** 
       * 开始裁剪 
       * @param {HTMLImageElement} res 要裁剪的图片对象
      */
      start(res) {
        image = res;

        // 设置画布大小
        canvas.width = image.width;
        canvas.height = image.height;

        // 设置<canvas>大小，永远居中
        if (canvas.height > image.width) {
          canvas.style.width = `${image.width / image.height * 100}%`;
        } else {
          canvas.style.width = '100%';
        }

        scaleValue = canvas.width / canvas.clientWidth;

        // 先初始渲染出来
        draw();
      },
      /** 保存当前裁剪区域图片 */
      save() {
        /** 裁剪框的宽度 */
        const width = position.ex - position.sx;
        /** 裁剪框的高度 */
        const height = position.ey - position.sy;
        return context.getImageData(position.sx, position.sy, width, height);
      }
    }
  }

  const cutImg = componentCutImg($('.cut-canvas'));

  /**
   * `base64`转`image`
   * @param {string} base64 
   * @param {(image: HTMLImageElement) => void} callback 
   */
  function base64ToImg(base64, callback) {
    const image = new Image();
    image.onload = function () {
      if (typeof callback === 'function') callback(image);
    }
    image.crossOrigin = 'Anonymous';
    image.src = base64;
  }

  /** 
   * 获取 base64
   * @param {File} file 文件
   * @param {(base64: string) => void} callback 回调
   */
  function getBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function () {
      const base64 = reader.result;
      if (typeof callback === 'function') callback(base64);
    }
    reader.readAsDataURL(file);
  }

  /**
   * <input>上传图片
   * @param {HTMLInputElement} el 
   */
  function uploadImg(el) {
    /** 上传文件 */
    const file = el.files[0];
    /** 上传类型数组 */
    const types = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif'];
    // 判断文件类型
    if (types.indexOf(file.type) < 0) {
      el.value = null;
      return alert('文件格式只支持：jpg 和 png');
    }
    // 判断大小
    if (file.size > 2 * 1024 * 1024) {
      el.value = null;
      return alert('上传的文件不能大于2M');
    }

    getBase64(file, base64 => {
      el.value = null;
      $('.cut-img').classList.remove('cut-hide');
      // $('.img-box .image').src = base64;
      base64ToImg(base64, img => {
        cutImg.start(img);
      })
    });
  }

  /**
   * 清除图片
   * @param {HTMLElement} el 
   */
  function removeImg(el) {
    el.parentNode.classList.add('hide');
    el.parentNode.querySelector('.image').src = '';
    el.parentNode.parentNode.querySelector('.upload').classList.remove('hide');
  }

  // 上传图片
  $('.upload-input').addEventListener('change', function () {
    uploadImg(this);
  });

  // 清除图片
  $('.remove').addEventListener('click', function () {
    removeImg(this);
  });

  // 取消裁剪
  $('.cancel').addEventListener('click', function () {
    $('.cut-img').classList.add('cut-hide');
  });

  // 保存裁剪
  $('.save').addEventListener('click', function () {
    const data = cutImg.save();
    console.log(data);
    // $('.img-box .image').src = data;
    $('.cut-img').classList.add('cut-hide');
  });

})();