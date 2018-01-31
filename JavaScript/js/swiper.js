const Swiper = {
	_pagination: false,
	_loop: false,
	_direction: false,
	_moveTime: 300,
	_autoPaly: false,
	_interval: 3000,
	init (_obj) {
		this._pagination = _obj.pagination || false;
		this._direction = _obj.direction || false;
		this._autoPaly = _obj.autoPaly || false;
		this._loop = _obj.loop || false;
		this._moveTime = _obj.moveTime || 300;
		this._interval = _obj.interval || 3000;
		if (!_obj.el) return console.log('没有可执行的元素！');
		this.format(_obj.el);
	},
	format (_el) {
		let _swiper = document.querySelector(_el);
		let _moveWidth = _swiper.offsetWidth;
		let _moveHeight = _swiper.offsetHeight;
		if (this._pagination) this.outputPagination(_swiper);
		if (this._loop) {
			this.outputLoop(_swiper,_moveWidth,_moveHeight);
		}else {
			this.layout(_swiper,_moveWidth,_moveHeight);
		}
	},
	// 动态布局 之后才有触摸事件
	layout (_div, _w, _h) {
		let _ul = _div.querySelector('.swiper_list');
		let _li = _div.querySelectorAll('.swiper_slider');
		if (this._direction) {
			for (let i = 0; i < _li.length; i++) {
				_li[i].style.height = _h + 'px';
			}
		}else {
			_ul.style.width = _w * _li.length + 'px';
			for (let i = 0; i < _li.length; i++) {
				_li[i].style.width = _w + 'px';
			}
		}
		this.touch(_div, _w, _h);
	},
	// 输出底部圆点
	outputPagination (_div) {
		let _btnList = _div.querySelector('.swiper_pagination');
		let _liNum = _div.querySelectorAll('.swiper_slider').length;
		let _html = '';
		for (let i = 0; i < _liNum; i++) {
			_html += '<div class="swiper_btn"></div>'
		}
		_btnList.innerHTML = _html;
		_btnList.querySelector('.swiper_btn').classList.add('swiper_btn_active');
	},
	// 如果要回路的话前后增加元素
	outputLoop (_div, _w, _h) {
		let _ul = _div.querySelector('.swiper_list');
		let _li = _ul.querySelectorAll('.swiper_slider');
		let _first = _li[0].cloneNode(true);
		let _last = _li[_li.length-1].cloneNode(true);
		_ul.insertBefore(_last, _li[0]);
		_ul.appendChild(_first);
		if (this._direction) {
			_ul.style.top = -_h + 'px';
		}else {
			_ul.style.left = -_w + 'px';
		}
		this.layout(_div, _w, _h)
	},
	// 触摸事件
	touch (_div, _w, _h) {
		let that = this;
		let _ul = _div.querySelector('.swiper_list');
		let _li = _ul.querySelectorAll('.swiper_slider')
		// 触摸开始的距离;结束的距离;结束距离状态;触摸的时间;平移的距离;跳转的位置;触摸时间计时器id;自动播放定时器id
		let [_start, _end, _endState, _t, _moveP, _index, _Interval, _auto] = [0, 0, 0, 0, 0, 0, null, null];
		// 判断最大拖动距离 type为true时则 Y, false反之
		function touchRange(type) {
			let _d = 0;
			if (type) {
				if ((_end-_start) >= _h) {
					_d = _moveP+_h;
				}else if ((_end-_start) <= -_h) {
					_d = _moveP-_h
				}else {
					_d = _moveP+(_end-_start);
				}
			}else {
				if ((_end-_start) >= _w) {
					_d = _moveP+_w;
				}else if ((_end-_start) <= -_w) {
					_d = _moveP-_w
				}else {
					_d = _moveP+(_end-_start);
				}
			}
			return _d;
		}
		// 判断触摸处理函数 _d是距离X/Y
		function judgeTouch(_d) {
			//	这里我设置了120毫秒的有效拖拽间隔
			if (_t < 120) return true;
			// 这里判断方向（正值和负值）
			if (_d < 0) {
				if ((_end-_start) < (_d/2)) return true;
				return false
			}else {
				if ((_end-_start) > (_d/2)) return true;
				return false
			}
		}
		// 设置动画
		function hasAnimation() {
			_ul.style.WebkitTransition = that._moveTime/1000+'s all';
			_ul.style.transition = that._moveTime/1000+'s all';
		}
		// 关闭动画
		function noAnimation() {
			_ul.style.WebkitTransition = '0s all';
			_ul.style.transition = '0s all'
		}
		// 返回原来位置
		function returnP () {
			hasAnimation();
			if (that._direction) {
				_ul.style.WebkitTransform = 'translateY('+_moveP+'px)';
				_ul.style.transform = 'translateY('+_moveP+'px)';
			}else {
				_ul.style.WebkitTransform = 'translateX('+_moveP+'px)';
				_ul.style.transform = 'translateX('+_moveP+'px)';
			}
		}
		// 自动播放
		function autoPaly() {
			if (!that._autoPaly) return ;
			// 这里判断是否有回路loop的自动播放
			if (that._loop) {
				// 判断X-Y方向
				if (that._direction) {
					_index += 1;
					slideMove(_moveP-_h);
					_moveP -= _h;
				}else {
					_index += 1;
					slideMove(_moveP-_w);
					_moveP -= _w;
				}
			}else {
				// 判断X-Y方向
				if (that._direction) {
					if (_index >= _li.length-1) {
						_index = 0;
						slideMove(0);
						_moveP = 0;
					}else {
						_index += 1;
						slideMove(_moveP-_h);
						_moveP -= _h;
					}
				}else {
					if (_index >= _li.length-1) {
						_index = 0;
						slideMove(0);
						_moveP = 0;
					}else {
						_index += 1;
						slideMove(_moveP-_w);
						_moveP -= _w;
					}
				}
			}
		}
		// 判断移动
		function judgeMove() {
			// 判断是否需要执行过渡
			if (that._direction) {
				if (_end < _start) {
					// 往上拉
					if (judgeTouch(-_h)) {
						// 判断有loop的时候不需要执行下面的事件
						if (!that._loop && _moveP === -(_li.length-1) * _h) return returnP();
						_index += 1;
						slideMove(_moveP-_h);
						_moveP -= _h;
					}else {
						returnP()
					}
				}else {
					// 往下拉
					if (judgeTouch(_h)) {
						if (!that._loop && _moveP === 0) return returnP();
						_index -= 1;
						slideMove(_moveP+_h);
						_moveP += _h;
					}else {
						returnP()
					}
				}
			}else {
				if (_end < _start) {
					// 向左滑动
					if (judgeTouch(-_w)) {
						if (!that._loop && _moveP === -(_li.length-1) * _w) return returnP();
						_index += 1;
						slideMove(_moveP-_w);
						_moveP -= _w;
					}else {
						returnP()
					}
				}else {
					// 向右滑动
					if (judgeTouch(_w)) {
						if (!that._loop && _moveP === 0) return returnP();
						_index -= 1;
						slideMove(_moveP+_w);
						_moveP += _w;
					}else {
						returnP()
					}
				}
			}
		}
		// 移动
		function slideMove (_d) {
			let _btn = _div.querySelectorAll('.swiper_btn');
			hasAnimation();
			if (that._direction) {
				_ul.style.WebkitTransform = 'translateY('+_d+'px)';
				_ul.style.transform = 'translateY('+_d+'px)';
			}else {
				_ul.style.WebkitTransform = 'translateX('+_d+'px)';
				_ul.style.transform = 'translateX('+_d+'px)';
			}
			// 判断loop时回到第一张或最后一张
			if (that._loop && _index < 0) {
				// 我这里是想让滑块过渡完之后再重置位置所以加的延迟
				setTimeout(() => {
					noAnimation();
					if (that._direction) {
						_ul.style.WebkitTransform = 'translateY('+_h*-(_li.length-3)+'px)';
						_ul.style.transform = 'translateY('+_h*-(_li.length-3)+'px)';
						// 重置一下位置
						_moveP = _h*-(_li.length-3);
					}else {
						_ul.style.WebkitTransform = 'translateX('+_w*-(_li.length-3)+'px)';
						_ul.style.transform = 'translateX('+_w*-(_li.length-3)+'px)';
						_moveP = _w*-(_li.length-3);
					}
				},that._moveTime);
				_index = _li.length-3;
			}if (that._loop && _index > _li.length-3) {
				// 我这里是想让滑块过渡完之后再重置位置所以加的延迟
				setTimeout(() => {
					noAnimation();
					if (that._direction) {
						_ul.style.WebkitTransform = 'translateY(0px)';
						_ul.style.transform = 'translateY(0px)';
					}else {
						_ul.style.WebkitTransform = 'translateX(0px)';
						_ul.style.transform = 'translateX(0px)';
					}
					// 重置一下位置
					_moveP = 0;
				},that._moveTime);
				_index = 0;
			}
			_div.querySelector('.swiper_btn_active').className = 'swiper_btn';
			_btn[_index].classList.add('swiper_btn_active');
		}
		// 首次开启
		_auto = setInterval(autoPaly, that._interval);
		// 开始触摸
		_ul.addEventListener('touchstart', ev => {
			clearInterval(_auto);
			noAnimation();
			// 开始计算触摸时间
			_Interval = setInterval(() => _t += 1,1);
			if (that._direction) {
				_start = ev.touches[0].pageY
			}else {
				_start = ev.touches[0].pageX
			}
		});
		// 触摸移动
		_ul.addEventListener('touchmove', ev => {
			// 清除默认动作
			ev.preventDefault();
			// noAnimation();	// 一开始我把触摸时停止动画放在这里，不过好像没有达到我想要的效果，所以我放在了开始触摸事件那边
			if (that._direction) {
				_end = ev.touches[0].pageY;
				_ul.style.WebkitTransform = 'translateY('+touchRange(true)+'px)';
				_ul.style.transform = 'translateY('+touchRange(true)+'px)';
			}else {
				_end = ev.touches[0].pageX;
				_ul.style.WebkitTransform = 'translateX('+touchRange(false)+'px)';
				_ul.style.transform = 'translateX('+touchRange(false)+'px)';
			}
		});
		// 触摸离开
		_ul.addEventListener('touchend', () => {
			clearInterval(_Interval);
			// 判断如果是点击的话就不执行移动
			if (_endState !== _end) judgeMove();
			// 开启自动播放
			_auto = setInterval(autoPaly, that._interval);
			// 走完之后再更改触摸距离,重置触摸时间一定要写在最后
			[_endState, _t] = [_end, 0];
		});
	}
}
