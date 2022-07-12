class ImgZoom {
  constructor(_params) {
    this.pack = document.querySelector(_params.pack);
    this.packImg = document.querySelector(_params.zoomImg);
    this.support = {
      transform3d: ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()),
      touch: ('ontouchstart' in window)
    };
  }
  getTranslate(_x, _y) {
    return this.support.transform3d ? 'translate3d(' + _x + 'px, ' + _y + 'px, 0)' : 'translate(' + _x + 'px, ' + _y + 'px)';
  }
  getPage(ev, page) {
    return this.support.touch ? ev.changedTouches[0][page] : ev[page];
  }
  init(_url) {
    this.packImg.innerHTML = ' ';
    this.zoomImg = document.createElement('img');
    this.zoomImg.src = _url;
    this.packImg.appendChild(this.zoomImg);
    this.zoomImg.onload = () => {
      this.zoomImg.style.marginTop = -(this.zoomImg.offsetHeight / 2) + 'px';
      this._touch();
    }
  }
  _touch() {
    this.buffMove = 3;      // 缓冲系数
    this.buffScale = 2;     // 放大系数
    this.finger = false;    // 触摸手指的状态 false：单手指 true：多手指
    this.distX = 0;         // 重置坐标数据
    this.distY = 0;
    this.newX = 0;
    this.newY = 0;
    this.imgBaseWidth = this.zoomImg.offsetWidth;   // 重置宽高数据
    this.imgBaseHeight = this.zoomImg.offsetHeight;
    this.wrapX = this.pack.offsetWidth || 0;        // 可视区域宽度
    this.wrapY = this.pack.offsetHeight || 0;       // 可视区域高度
    this.mapX = this.zoomImg.width || 0;            // 地图宽度
    this.mapY = this.zoomImg.height || 0;           // 地图高度
    // 添加事件柄
    this.zoomImg.addEventListener('touchstart', e => this._touchstart(e));
    this.zoomImg.addEventListener('touchmove', e => this._touchmove(e));
    this.zoomImg.addEventListener('touchend', e => this._touchend(e));
  }
  // 更新地图信息
  _changeData() {
    this.mapX = this.zoomImg.offsetWidth;           //地图宽度
    this.mapY = this.zoomImg.offsetHeight;          //地图高度
    // this.outDistY = (this.mapY - this.wrapY)/2;  //当图片高度超过屏幕的高度时候。图片是垂直居中的，这时移动有个高度做为缓冲带
    this.width = this.mapX - this.wrapX;            //地图的宽度减去可视区域的宽度
    this.height = this.mapY - this.wrapY;           //地图的高度减去可视区域的高度
  }
  // 触摸开始
  _touchstart(e) {
    e.preventDefault();
    let touchTarget = e.targetTouches.length;   //获得触控点数
    this._changeData();                         //重新初始化图片、可视区域数据，由于放大会产生新的计算
    if (touchTarget === 1) {
      // 获取开始坐标
      this.basePageX = this.getPage(e, 'pageX');
      this.basePageY = this.getPage(e, 'pageY');
      this.finger = false;
    } else {
      this.finger = true;
      this.startFingerDist = this.getTouchDist(e).dist;
      this.startFingerX = this.getTouchDist(e).x;
      this.startFingerY = this.getTouchDist(e).y;
    }
    console.log('pageX: ' + this.getPage(e, 'pageX'));
    console.log('pageY: ' + this.getPage(e, 'pageY'));
  }
  // 触摸中
  _touchmove(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('event.changedTouches[0].pageY: ' + e.changedTouches[0].pageY);
    let touchTarget = e.targetTouches.length; //获得触控点数
    if (touchTarget === 1 && !this.finger) this._move(e);
    if (touchTarget >= 2) this._zoom(e);
  }
  // 触摸结束
  _touchend(e) {
    this._changeData(); //重新计算数据
    if (this.finger) {
      this.distX = -this.imgNewX;
      this.distY = -this.imgNewY;
    }
    if (this.distX > 0) {
      this.newX = 0;
    } else if (this.distX <= 0 && this.distX >= -this.width) {
      this.newX = this.distX;
      this.newY = this.distY;
    } else if (this.distX < -this.width) {
      this.newX = -this.width;
    }
    this.reset();
  }
  // 获取多点触控
  getTouchDist(e) {
    let x1 = 0,
      y1 = 0,
      x2 = 0,
      y2 = 0,
      x3 = 0,
      y3 = 0,
      result = {};
    x1 = e.touches[0].pageX;
    x2 = e.touches[1].pageX;
    y1 = e.touches[0].pageY - document.body.scrollTop;
    y2 = e.touches[1].pageY - document.body.scrollTop;
    if (!x1 || !x2) return;
    if (x1 <= x2) {
      x3 = (x2 - x1) / 2 + x1;
    } else {
      x3 = (x1 - x2) / 2 + x2;
    }
    if (y1 <= y2) {
      y3 = (y2 - y1) / 2 + y1;
    } else {
      y3 = (y1 - y2) / 2 + y2;
    }
    result = {
      dist: Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))),
      x: Math.round(x3),
      y: Math.round(y3)
    };
    return result;
  }
  _move(e) {
    let pageX = this.getPage(e, 'pageX'), //获取移动坐标
      pageY = this.getPage(e, 'pageY');
    // 获得移动距离
    this.distX = (pageX - this.basePageX) + this.newX;
    this.distY = (pageY - this.basePageY) + this.newY;
    if (this.distX > 0) {
      this.moveX = Math.round(this.distX / this.buffMove);
    } else if (this.distX <= 0 && this.distX >= -this.width) {
      this.moveX = this.distX;
    } else if (this.distX < -this.width) {
      this.moveX = -this.width + Math.round((this.distX + this.width) / this.buffMove);
    }
    this.movePos();
    this.finger = false;
  }
  // 图片缩放
  _zoom(e) {
    let nowFingerDist = this.getTouchDist(e).dist,      // 获得当前长度
      ratio = nowFingerDist / this.startFingerDist,   // 计算缩放比
      imgWidth = Math.round(this.mapX * ratio),       // 计算图片宽度
      imgHeight = Math.round(this.mapY * ratio);      // 计算图片高度
    // 计算图片新的坐标
    this.imgNewX = Math.round(this.startFingerX * ratio - this.startFingerX - this.newX * ratio);
    this.imgNewY = Math.round((this.startFingerY * ratio - this.startFingerY) / 2 - this.newY * ratio);
    if (imgWidth >= this.imgBaseWidth) {
      this.zoomImg.style.width = imgWidth + 'px';
      this.refresh(-this.imgNewX, -this.imgNewY, '0s', 'ease');
      this.finger = true;
    } else {
      if (imgWidth < this.imgBaseWidth) {
        this.zoomImg.style.width = this.imgBaseWidth + 'px';
      }
    }
    this.finger = true;
  }
  // 移动坐标
  movePos() {
    if (this.height < 0) {
      if (this.zoomImg.offsetWidth == this.imgBaseWidth) {
        this.moveY = Math.round(this.distY / this.buffMove);
      } else {
        let moveTop = Math.round((this.zoomImg.offsetHeight - this.imgBaseHeight) / 2);
        this.moveY = -moveTop + Math.round((this.distY + moveTop) / this.buffMove);
      }
    } else {
      let a = Math.round((this.wrapY - this.imgBaseHeight) / 2),
        b = this.zoomImg.offsetHeight - this.wrapY + Math.round(this.wrapY - this.imgBaseHeight) / 2;

      if (this.distY >= -a) {
        this.moveY = Math.round((this.distY + a) / this.buffMove) - a;
      } else if (this.distY <= -b) {
        this.moveY = Math.round((this.distY + b) / this.buffMove) - b;
      } else {
        this.moveY = this.distY;
      }
    }
    this.refresh(this.moveX, this.moveY, '0s', 'ease');
  }
  // 重置数据
  reset() {
    if (this.height < 0) {
      this.newY = -Math.round(this.zoomImg.offsetHeight - this.imgBaseHeight) / 2;
    } else {
      let a = Math.round((this.wrapY - this.imgBaseHeight) / 2),
        b = this.zoomImg.offsetHeight - this.wrapY + Math.round(this.wrapY - this.imgBaseHeight) / 2;
      if (this.distY >= -a) {
        this.newY = -a;
      } else if (this.distY <= -b) {
        this.newY = -b;
      } else {
        this.newY = this.distY;
      }
    }
    this.refresh(this.newX, this.newY, '0.2s', 'ease-in-out');
  }
  // 执行图片移动
  refresh(x, y, timer, type) {
    this.zoomImg.style.webkitTransitionProperty = '-webkit-transform';
    this.zoomImg.style.webkitTransitionDuration = timer;
    this.zoomImg.style.webkitTransitionTimingFunction = type;
    this.zoomImg.style.webkitTransform = this.getTranslate(x, y);
  }
}
/**
 * 手势缩放图片 有问题！！！
 * @param {Object} params.pack 控件 div
 * @param {Object} params.packImg 装载图片 div
 * @param {Object} params.url 图片 url
 */
function gestureScale(params) {
  if (!params.pack) return console.warn('element: pack 参数为空');
  if (!params.packImg) return console.warn('element: packImg 参数为空');
  if (!params.url) return console.warn('图片url 为空');
  /** 控件容器 pack */
  let pack = document.querySelector(params.pack);
  /** 触摸图片容器 */
  let packImg = pack.querySelector(params.packImg);
  /** 触摸图片 */
  let zoomImg = document.createElement('img');
  /** 图片url */
  let url = params.url;
  /** 检测兼容支持 */
  let support = {
    transform3d: ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()),
    touch: ('ontouchstart' in window)
  }
  /** 缓冲系数 */
  let buffMove = 3;
  /** 放大系数 */
  let buffScale = 2;
  /** 触摸手指的状态 false => 单手指; true => 多手指 */
  let finger = false;
  // 重置坐标数据 
  let distX = 0;
  let distY = 0;
  let newX = 0;
  let newY = 0;
  /** 重置宽数据 */
  let imgBaseWidth = zoomImg.offsetWidth;
  /** 重置高数据 */
  let imgBaseHeight = zoomImg.offsetHeight;
  /** 可视区域宽度 */
  let wrapX = pack.offsetWidth || 0;
  /** 可视区域高度 */
  let wrapY = pack.offsetHeight || 0;
  /** 地图宽度 */
  let mapX = zoomImg.width || 0;
  /** 地图高度 */
  let mapY = zoomImg.height || 0;
  /** 地图的宽度减去可视区域的宽度 */
  let value_width = 0;
  /** 地图的高度减去可视区域的高度 */
  let value_height = 0;
  /** 开始坐标 X */
  let basePageX = 0;
  /** 开始坐标 Y */
  let basePageY = 0;
  /** 移动 X 距离 */
  let moveX = 0;
  /** 移动 Y 距离 */
  let moveY = 0;
  /** 图片新坐标 X */
  let imgNewX = 0;
  /** 图片新坐标 Y */
  let imgNewY = 0;
  let startFingerDist = 0;
  let startFingerX = 0;
  let startFingerY = 0;

  /**
   * 平移滑动
   * @param {Number} x 
   * @param {Number} y 
   */
  function getTranslate(x, y) {
    return support.transform3d ? 'translate3d(' + x + 'px, ' + y + 'px, 0)' : 'translate(' + x + 'px, ' + y + 'px)';
  }

  /**
   * 获取移动坐标
   * @param {event} event 
   * @param {String} page pageX & pageY
   */
  function getPage(event, page) {
    return support.touch ? event.changedTouches[0][page] : event[page];
  }

  // 获取多点触控
  function getTouchDist(e) {
    let x1 = 0,
      y1 = 0,
      x2 = 0,
      y2 = 0,
      x3 = 0,
      y3 = 0,
      result = {};
    x1 = e.touches[0].pageX;
    x2 = e.touches[1].pageX;
    y1 = e.touches[0].pageY - document.body.scrollTop;
    y2 = e.touches[1].pageY - document.body.scrollTop;
    if (!x1 || !x2) return;
    if (x1 <= x2) {
      x3 = (x2 - x1) / 2 + x1;
    } else {
      x3 = (x1 - x2) / 2 + x2;
    }
    if (y1 <= y2) {
      y3 = (y2 - y1) / 2 + y1;
    } else {
      y3 = (y1 - y2) / 2 + y2;
    }
    result = {
      dist: Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))),
      x: Math.round(x3),
      y: Math.round(y3)
    };
    return result;
  }

  /**
   * 执行图片移动
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} timer 持续时间
   * @param {String} type 动画类型
   */
  function refresh(x, y, timer, type) {
    zoomImg.style.webkitTransitionProperty = '-webkit-transform';
    zoomImg.style.webkitTransitionDuration = timer;
    zoomImg.style.webkitTransitionTimingFunction = type;
    zoomImg.style.webkitTransform = getTranslate(x, y);
  }

  /** 图片缩放 */
  function startZoom(e) {
    /** 当前长度 */
    let nowFingerDist = getTouchDist(e).dist;
    /** 缩放比 */
    let ratio = nowFingerDist / startFingerDist;
    /** 图片宽度 */
    let imgWidth = Math.round(mapX * ratio);
    /** 图片高度 */
    let imgHeight = Math.round(mapY * ratio);
    // 计算图片新的坐标
    imgNewX = Math.round(startFingerX * ratio - startFingerX - newX * ratio);
    imgNewY = Math.round((startFingerY * ratio - startFingerY) / 2 - newY * ratio);
    if (imgWidth >= imgBaseWidth) {
      zoomImg.style.width = imgWidth + 'px';
      refresh(-imgNewX, -imgNewY, '0s', 'ease');
      finger = true;
    } else {
      if (imgWidth < imgBaseWidth) {
        zoomImg.style.width = imgBaseWidth + 'px';
      }
    }
    finger = true;
  }

  /** 重置数据 */
  function reset() {
    if (value_height < 0) {
      newY = -Math.round(zoomImg.offsetHeight - imgBaseHeight) / 2;
    } else {
      let a = Math.round((wrapY - imgBaseHeight) / 2),
        b = zoomImg.offsetHeight - wrapY + Math.round(wrapY - imgBaseHeight) / 2;
      if (distY >= -a) {
        newY = -a;
      } else if (distY <= -b) {
        newY = -b;
      } else {
        newY = distY;
      }
    }
    refresh(newX, newY, '0.2s', 'ease-in-out');
  }

  /** 移动坐标 */
  function movePos() {
    if (value_height < 0) {
      if (zoomImg.offsetWidth == imgBaseWidth) {
        moveY = Math.round(distY / buffMove);
      } else {
        let moveTop = Math.round((zoomImg.offsetHeight - imgBaseHeight) / 2);
        moveY = -moveTop + Math.round((distY + moveTop) / buffMove);
      }
    } else {
      let a = Math.round((wrapY - imgBaseHeight) / 2),
        b = zoomImg.offsetHeight - wrapY + Math.round(wrapY - imgBaseHeight) / 2;

      if (distY >= -a) {
        moveY = Math.round((distY + a) / buffMove) - a;
      } else if (distY <= -b) {
        moveY = Math.round((distY + b) / buffMove) - b;
      } else {
        moveY = distY;
      }
    }
    refresh(moveX, moveY, '0s', 'ease');
  }

  /** 开始移动 */
  function startMove(e) {
    let pageX = getPage(e, 'pageX'),
      pageY = getPage(e, 'pageY');
    // 获得移动距离
    distX = (pageX - basePageX) + newX;
    distY = (pageY - basePageY) + newY;
    if (distX > 0) {
      moveX = Math.round(distX / buffMove);
    } else if (distX <= 0 && distX >= -value_width) {
      moveX = distX;
    } else if (distX < -value_width) {
      moveX = -value_width + Math.round((distX + value_width) / buffMove);
    }
    movePos();
    finger = false;
  }

  /** 更新地图信息 */
  function changeData() {
    mapX = zoomImg.offsetWidth;
    mapY = zoomImg.offsetHeight;
    // outDistY = (mapY - wrapY) / 2;       // 当图片高度超过屏幕的高度时候。图片是垂直居中的，这时移动有个高度做为缓冲带
    value_width = mapX - wrapX;             // 地图的宽度减去可视区域的宽度
    vlaue_height = mapY - wrapY;            // 地图的高度减去可视区域的高度
  }

  /** 触摸方法 */
  function touch() {
    // 添加事件柄
    zoomImg.addEventListener('touchstart', e => touchStart(e));
    zoomImg.addEventListener('touchmove', e => touchMove(e));
    zoomImg.addEventListener('touchend', e => touchEnd(e));
  }

  /** 触摸开始 */
  function touchStart(e) {
    e.preventDefault();
    /** 触控点数 */
    let touchTarget = e.targetTouches.length;
    changeData(); //重新初始化图片、可视区域数据，由于放大会产生新的计算
    if (touchTarget === 1) {
      // 获取开始坐标
      basePageX = getPage(e, 'pageX');
      basePageY = getPage(e, 'pageY');
      finger = false;
    } else {
      finger = true;
      startFingerDist = getTouchDist(e).dist;
      startFingerX = getTouchDist(e).x;
      startFingerY = getTouchDist(e).y;
    }
    console.log('start => pageX: ' + getPage(e, 'pageX'));
    console.log('start => pageY: ' + getPage(e, 'pageY'));
  }

  /** 触摸中 */
  function touchMove(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('event.changedTouches[0].pageY: ' + e.changedTouches[0].pageY);
    /** 获得触控点数 */
    let touchTarget = e.targetTouches.length;
    if (touchTarget === 1 && !finger) startMove(e);
    if (touchTarget >= 2) startZoom(e);
  }

  /** 触摸结束 */
  function touchEnd(e) {
    changeData(); //重新计算数据
    if (finger) {
      distX = -imgNewX;
      distY = -imgNewY;
    }
    if (distX > 0) {
      newX = 0;
    } else if (distX <= 0 && distX >= -value_width) {
      newX = distX;
      newY = distY;
    } else if (distX < -value_width) {
      newX = -value_width;
    }
    reset();
  }

  /** 初始化 */
  function init() {
    packImg.innerHTML = ' ';
    zoomImg.src = url;
    packImg.appendChild(zoomImg);
    zoomImg.onload = () => {
      zoomImg.style.marginTop = -(zoomImg.offsetHeight / 2) + 'px';
      touch();
    }
  }
  init();
}

