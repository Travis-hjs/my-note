// 这里我做的不是用 window 的滚动事件，而是用最外层的绑定触摸下拉事件去实现
// 好处是我用在Vue这类单页应用的时候，路由销毁时不用去解绑 window 的 scroll 事件
// 但是滑动到底部事件就必须要用 window 的 scroll 事件，这点需要注意

class DropDownRefresh {
    /**
     * 下拉刷新
     * @param {string} name class|id|<label> 
     */
    constructor(name) {
        /** 页面整体 */
        this.page = document.querySelector(name);
        /** 下拉时遮罩层 */
        this.layer = document.createElement('div');
        /** 下拉刷新的提示节点 */
        this.pagetitle = document.createElement('div');
        // 设置
        this.layer.style.cssText = 'position: fixed;top: 0;left: 0;width: 100vh;height: 100vh;background-color: rgba(0,0,0,0);z-index: 100;';
        this.pagetitle.className = 'refresh_title';
        this.pagetitle.innerHTML = '<div class="icon_refresh"></div><div class="preloader hide"><span class="preloader-inner"><span class="preloader-inner-gap"></span><span class="preloader-inner-left"><span class="preloader-inner-half-circle"></span></span><span class="preloader-inner-right"><span class="preloader-inner-half-circle"></span></span></span></div>';
    }

    /**
     * 设置动画
     * @param {number} time 动画时间（秒）
     */
    getAnimation(time) {
        this.page.style.WebkitTransition = this.page.style.transition = this.pagetitle.style.WebkitTransition = this.pagetitle.style.transition = `${time}s all`;
    }
    
    /**
     * 滑动距离设置
     * @param {number} num 滑动的距离（像素）
     */
    setStyle(num) {
        this.page.style.WebkitTransform = this.pagetitle.style.WebkitTransform = this.page.style.transform = `translate3d(0px, ${num}px, 0px)`;
    }
    
    /**
     * 监听开始刷新
     * @param {number} max 下拉距离（像素）
     * @param {Function} callback 下拉回调距离函数
     * @param {Function} rangeCallback 回调距离函数 如果有需要
     */
    onStart(max = 100, callback, rangeCallback) {
        /** 顶部距离 */
        let scrollTop = 0;
        /** 下拉提示 icon */
        let icon = this.pagetitle.querySelector('.icon_refresh');
        /** 下拉 loading 动画 */
        let loading = this.pagetitle.querySelector('.preloader');
        /** 开始距离 */
        let sd = 0;	
        /** 结束距离 */
        let ed = 0;	
        /** 最后移动的距离 */
        let range = 0;	

        // 开始执行就添加提示头部
        this.page.parentNode.insertBefore(this.pagetitle, this.page);
        this.pagetitle.style.height = max + 'px';
        this.pagetitle.style.top = -max + 'px';

        // 触摸开始
        this.page.addEventListener('touchstart', ev => {
            sd = ev.touches[0].pageY;
            this.getAnimation(0);
        });

        // 触摸移动
        this.page.addEventListener('touchmove', ev => {
            scrollTop = document.documentElement.scrollTop === 0 ? document.body.scrollTop : document.documentElement.scrollTop;
            // 没到达顶部就停止
            if (scrollTop != 0) return;
            ed = ev.touches[0].pageY;
            range = Math.floor(ed - sd);
            // 判断如果是下滑才执行
            if (range > 0) {
                // 阻止浏览自带的下拉效果
                ev.preventDefault();
                // 最主要的物理回弹公式计算距离
                range = range - (range * 0.5);
                // 下拉时icon旋转
                icon.style.WebkitTransform = icon.style.transform = `rotate(${180 * (range / max)}deg)`;
                if (range > max) {
                    icon.classList.add('hide');
                    loading.classList.remove('hide');
                } else {
                    icon.classList.remove('hide');
                    loading.classList.add('hide');
                }
                this.setStyle(range);
                // 回调距离函数 如果有需要
                if (typeof rangeCallback === 'function') rangeCallback(range);
            }
        });

        // 触摸结束
        this.page.addEventListener('touchend', ev => {
            this.getAnimation(0.3);
            // console.log(`移动的距离：${range}, 最大距离：${max}`);
            if (range > max && range > 1 && scrollTop == 0) {
                this.setStyle(max);
                document.body.appendChild(this.layer);
                // 阻止往上滑动
                this.layer.ontouchmove = e => e.preventDefault();
                // 回调成功下拉到最大距离并松开函数
                if (typeof callback === 'function') callback.call(this);
            } else {
                this.setStyle(0);
            }
        });
    }

    /** 下拉结束 */
    end() {
        this.layer.parentNode.removeChild(this.layer);
        this.getAnimation(0.3);
        this.setStyle(0);
    }
}

// 调用
let Ddr = new DropDownRefresh('.wrap');
Ddr.onStart(100, function () {
    console.log('下拉成功');
    setTimeout(function () {
        Ddr.end();
    }, 2000);
}, function (num) {
    // console.log('下拉的距离：', num);
});