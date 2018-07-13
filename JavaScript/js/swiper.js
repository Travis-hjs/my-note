/**
 * swiper
 * 默认全部 false
 * @param {*} pagination 是否需要底部圆点
 * @param {*} loop 是否需要回路
 * @param {*} direction 方向 true = X & Y = false
 * @param {*} moveTime 过渡时间（毫秒）默认 300
 * @param {*} autoPaly 是否需要自动播放
 * @param {*} interval 自动播放间隔（毫秒）默认 3000
 */
function swiper(params) {
    let _pagination = false, _loop = false, _direction = false, _autoPaly = false, _interval = 3000, _moveTime = 300;
    // 触摸事件
    function _touch(_div, _w, _h) {
        let _ul = _div.querySelector('.swiper_list');
        let _li = _ul.querySelectorAll('.swiper_slider');
        let _btn = _div.querySelectorAll('.swiper_btn');
        // 触摸开始时间，触摸结束时间，开始的距离，结束的距离，结束距离状态，移动的距离，圆点位置，自动播放定计算数值，loop定时器计算值
        let sTime = 0, eTime = 0, sd = 0, ed = 0, eState = 0, md = 0, index = 0, count = 0, loopNum = 0,
            // 选择方向距离
            _distance = _direction ? _h : _w,
            // 定义 requestAnimationFrame
            myAnimation = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        // 设置动画
        function hasAnimation() {
            _ul.style.transition = _ul.style.WebkitTransition = `${_moveTime / 1000}s all`;
        }
        // 关闭动画
        function noAnimation() {
            _ul.style.transition = _ul.style.WebkitTransition = '0s all';
        }
        // 属性样式
        function slideStyle(num) {
            if (_direction) {
                _ul.style.transform = _ul.style.WebkitTransform = `translate3d(0px, ${num}px, 0px)`;
            } else {
                _ul.style.transform = _ul.style.WebkitTransform = `translate3d(${num}px, 0px, 0px)`;
            }
        }
        // 判断最大拖动距离
        function touchRange() {
            let num = 0;
            // 默认这个公式
            num = md + (ed - sd);
            // 判断最大正负值
            if ((ed - sd) >= _distance) {
                num = md + _distance;
            } else if ((ed - sd) <= -_distance) {
                num = md - _distance;
            }
            // md : 移动的距离 ed : 结束的距离 sd 开始的距离
            // 没有loop的时候惯性拖拽
            if (!_loop) {
                if ((ed - sd) > 0 && index === 0) {
                    // console.log('到达最初');
                    num = md + ((ed - sd) - ((ed - sd) * 0.6));
                } else if ((ed - sd) < 0 && index === _li.length - 1) {
                    // console.log('到达最后');
                    num = md + ((ed - sd) - ((ed - sd) * 0.6));
                }
            }
            return num;
        }
        // 判断触摸处理函数 _d是距离X/Y
        function judgeTouch(_d) {
            //	这里我设置了200毫秒的有效拖拽间隔
            if ((eTime - sTime) < 200) return true;
            // 这里判断方向（正值和负值）
            if (_d < 0) {
                if ((ed - sd) < (_d / 2)) return true;
                return false;
            } else {
                if ((ed - sd) > (_d / 2)) return true;
                return false;
            }
        }
        // 返回原来位置
        function returnLocation() {
            hasAnimation();
            slideStyle(md);
        }
        // 移动
        function slideMove(_d) {
            hasAnimation();
            slideStyle(_d);
            loopNum = 0;
            // 判断loop时回到第一张或最后一张
            if (_loop && index < 0) {
                // 我这里是想让滑块过渡完之后再重置位置所以加的延迟 (之前用setTimeout，快速滑动有问题，然后换成 requestAnimationFrame解决了这类问题)
                function loopMoveMin() {
                    loopNum += 1;
                    if (loopNum < _moveTime / 1000 * 60) return myAnimation(loopMoveMin);
                    noAnimation();
                    slideStyle(_distance * -(_li.length - 3));
                    // 重置一下位置
                    md = _distance * -(_li.length - 3);
                }
                loopMoveMin();
                index = _li.length - 3;
            } else if (_loop && index > _li.length - 3) {
                function loopMoveMax() {
                    loopNum += 1;
                    if (loopNum < _moveTime / 1000 * 60) return myAnimation(loopMoveMax);
                    noAnimation();
                    slideStyle(0);
                    md = 0;
                }
                loopMoveMax();
                index = 0;
            }
            // console.log(`第${ index+1 }张`);	// 这里可以做滑动结束回调
            if (_pagination) {
                _div.querySelector('.swiper_btn_active').className = 'swiper_btn';
                _btn[index].classList.add('swiper_btn_active');
            }
        }
        // 判断移动
        function judgeMove() {
            // 判断是否需要执行过渡
            if (ed < sd) {
                // 往上滑动 or 向左滑动
                if (judgeTouch(-_distance)) {
                    // 判断有loop的时候不需要执行下面的事件
                    if (!_loop && md === (-(_li.length - 1) * _distance)) return returnLocation();
                    index += 1;
                    slideMove(md - _distance);
                    md -= _distance;
                } else returnLocation();
            } else {
                // 往下滑动 or 向右滑动
                if (judgeTouch(_distance)) {
                    if (!_loop && md === 0) return returnLocation();
                    index -= 1;
                    slideMove(md + _distance);
                    md += _distance;
                } else returnLocation();
            }
        }
        // 自动播放移动
        function autoMove() {
            // 这里判断是否有回路loop的自动播放
            if (_loop) {
                index += 1;
                slideMove(md - _distance);
                md -= _distance;
            } else {
                if (index >= _li.length - 1) {
                    index = 0;
                    slideMove(0);
                    md = 0;
                } else {
                    index += 1;
                    slideMove(md - _distance);
                    md -= _distance;
                }
            }
        }
        // 自动播放
        function startAuto() {
            count += 1;
            //	这里帧数是1秒60次
            if (count < _interval / 1000 * 60) return myAnimation(startAuto);
            count = 0;
            autoMove();
            startAuto();
        }
        // 判断是否需要开启自动播放
        if (_autoPaly && _li.length - 1) startAuto();
        // 开始触摸
        _ul.addEventListener('touchstart', ev => {
            // loopNum = _moveTime/1000*60;
            [sTime, count, loopNum] = [new Date().getTime(), 0, _moveTime / 1000 * 60];
            noAnimation();
            sd = _direction ? ev.touches[0].pageY : ev.touches[0].pageX;
        });
        // 触摸移动
        _ul.addEventListener('touchmove', ev => {
            ev.preventDefault();
            count = 0;
            ed = _direction ? ev.touches[0].pageY : ev.touches[0].pageX;
            slideStyle(touchRange());
        });
        // 触摸离开
        _ul.addEventListener('touchend', () => {
            eTime = new Date().getTime();
            // 判断是否点击
            if (eState !== ed) {
                judgeMove();
            } else {
                // console.log('执行');
                returnLocation();
            }
            // console.log(`index: ${index}`);	//  这里可以做触摸之后位置回调
            // 更新位置 && 重新打开自动播放要放到最后
            [eState, count] = [ed, 0];
        });
    }
    // 动态布局
    function layout(_div, _w, _h) {
        let _ul = _div.querySelector('.swiper_list'), _li = _div.querySelectorAll('.swiper_slider');
        if (_direction) {
            for (let i = 0; i < _li.length; i++) {
                _li[i].style.height = `${_h}px`;
            }
        } else {
            _ul.style.width = `${_w * _li.length}px`;
            for (let i = 0; i < _li.length; i++) {
                _li[i].style.width = `${_w}px`;
            }
        }
        _touch(_div, _w, _h);
    }
    // 如果要回路的话前后增加元素
    function outputLoop(_div, _w, _h) {
        let _ul = _div.querySelector('.swiper_list');
        let _li = _ul.querySelectorAll('.swiper_slider');
        let _first = _li[0].cloneNode(true),
            _last = _li[_li.length - 1].cloneNode(true);
        _ul.insertBefore(_last, _li[0]);
        _ul.appendChild(_first);
        if (_direction) {
            _ul.style.top = `${-_h}px`;
        } else {
            _ul.style.left = `${-_w}px`;
        }
        layout(_div, _w, _h);
    }
    // 输出底部圆点
    function outputPagination(_div) {
        let _btnList = _div.querySelector('.swiper_pagination'),
            _liNum = _div.querySelectorAll('.swiper_slider').length,
            _html = '';
        for (let i = 0; i < _liNum; i++) {
            _html += '<div class="swiper_btn"></div>';
        }
        _btnList.innerHTML = _html;
        _btnList.querySelector('.swiper_btn').classList.add('swiper_btn_active');
    }
    // 动态布局初始化
    function format(_el) {
        let _swiper = document.querySelector(_el);
        let _moveWidth = _swiper.offsetWidth, _moveHeight = _swiper.offsetHeight;
        if (_pagination) outputPagination(_swiper);
        if (_loop) {
            outputLoop(_swiper, _moveWidth, _moveHeight);
        } else {
            layout(_swiper, _moveWidth, _moveHeight);
        }
    }
    // 配置传参
    function init() {
        if (!params.el) return console.warn('没有可执行的元素！');
        _pagination = params.pagination || false;
        _direction = params.direction || false;
        _autoPaly = params.autoPaly || false;
        _loop = params.loop || false;
        _moveTime = params.moveTime || 300;
        _interval = params.interval || 3000;
        format(params.el);
    }
    init();
}
