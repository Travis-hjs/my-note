/** 字符串模块 */
class StringModule {
    /**
     * 过滤只保留数字及小数点
     * @param {string} string 字符串
     * @return {number}
     */
    onlyNumber(string) {
        /** 最终返回值 */
        let value = string.trim();
        // 去空格
        if (value.length == 0) return 0;
        // 正则过滤剩下数字和小数点
        value = value.replace(/[^0-9.]+/g, '');
        /** 分割小数点数组 */
        let array = value.split('.');
        // 判断是否有小数点
        if (array.length > 1) {
            value = array[0] + '.' + array[1];
        }
        // 最后转数字
        value = Number(value);
        return isNaN(value) ? 0 : value;
    }

    /**
     * 过滤掉特殊符号
     * @param {string} string 
     */
    filterSpecial(string) {
        let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
        let result = '';
        for (let i = 0; i < string.length; i++) {
            result += string.substr(i, 1).replace(pattern, '');
        }
        return result;
    }

    /**
     * 数字带逗号分隔
     * 10000 => "10,000"
     * @param {number} num
     */
    flterToThousand(num) {
        // return num.toLocaleString('en-US');
        return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
    }

    /**
     * 首字母大写
     * @param {string} string 
     */
    firstToUpperCase(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * 带单位的数值转换
     * @param {number} value 数字
     */
    unitsNumber(value) {
        value = Math.floor(value);
        if (value == 0) return 0;
        let units = ['', 'k', 'm', 'b', 'f', 'e', 'ae', 'be', 'ce', 'de', 'ee', 'fe', 'ge', 'he', 'ie'];
        let index = Math.floor(Math.log(value) / Math.log(1000));
        let result = value / Math.pow(1000, index);
        if (index === 0) return result;
        result = result.toFixed(3);
        // 不进行四舍五入 取小数点后一位
        result = result.substring(0, result.lastIndexOf('.') + 2);
        return result + units[index];
    }

    /**
     * 格式化?后面参数成 JSON 对象
     * @param {string} value 
     * @example {
     * searchFormat(window.location.search);
     * }
     */
    searchFormat(value) {
        return JSON.parse(`{"${decodeURIComponent(value.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`);
    }

    /**
     * rgb 转 16进制 
     * @param {string} string rgb(125, 125, 125)
     */
    rgbToHex(string) {
        var rgb = string.split(',');
        var r = parseInt(rgb[0].split('(')[1]);
        var g = parseInt(rgb[1]);
        var b = parseInt(rgb[2].split(')')[0]);
        var hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return hex;
    }

    /** 
    * hex16 进制颜色转 rgb(rgba)
    * @param {string} hex '#23ff45' 
    */
    hexToRgb(hex) {
        return 'rgb(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ',' + parseInt('0x' + hex.slice(5, 7)) + ')';
    }


}

/** 数组类处理模块 */
class ArrayModule extends StringModule {
    /**
     * 从对象数组中查找匹配项 ES5 实现 ES6 array.find()
     * @param {Array<object>} array array
     * @param {Function} contrast 对比函数
     */
    findItem(array, contrast) {
        if (typeof contrast !== 'function') return console.warn('findItem 传入的第二个参数类型必须为function');
        var result = null;
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (contrast(item, i)) {
                result = item;
                break;
            }
        }
        return result;
    }

    /**
     * 范围随机数
     * @param {number} min 最小数
     * @param {number} max 最大数
     */
    ranInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 随机打乱数组
     * @param {array} array
     */
    shuffleArray(array) {
        return array.sort(() => Math.random() > 0.5 ? -1 : 1);
    }

    /**
     * 数组中随机取几个元素
     * @param {array} array 数组
     * @param {number} count 元素个数
     */
    getRandomArrayElements(array, count) {
        let length = array.length;
        let min = length - count;
        let index = 0;
        let value = '';
        while (length-- > min) {
            index = Math.floor((length + 1) * Math.random());
            value = array[index];
            array[index] = array[length];
            array[length] = value;
        }
        return array.slice(min);
    }

    /**
     * 将指定位置的元素置顶
     * @param {array} array 改数组
     * @param {number} index 元素索引
     */
    zIndexToTop(array, index) {
        if (index != 0) {
            let item = array[index];
            array.splice(index, 1);
            array.unshift(item);
        } else {
            console.log('已经处于置顶');
        }
    }

    /**
     * 将指定位置的元素置底
     * @param {array} array 改数组
     * @param {number} index 元素索引
     */
    zIndexToBottom(array, index) {
        if (index != array.length - 1) {
            let item = array[index];
            array.splice(index, 1);
            array.push(item);
        } else {
            console.log('已经处于置底');
        }
    }
    
    /**
     * 获取两点距离
     * @param {number} lng1 经度
     * @param {number} lat1 纬度
     * @param {number} lng2 经度
     * @param {number} lat2 纬度
     */
    getDistance(lng1, lat1, lng2, lat2) {
        let toRad = d => d * Math.PI / 180;
        let radLat1 = toRad(lat1);
        let radLat2 = toRad(lat2);
        let deltaLat = radLat1 - radLat2;
        let deltaLng = toRad(lng1) - toRad(lng2);
        let dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
        return dis * 6378137;
    }
}

/** 时间日期类型日期模块 */
class DateModule extends ArrayModule {
    constructor() {
        super();
        // new Date().toLocaleDateString(); => 2020/12/12
        // new Date().toLocaleTimeString(); => 上/下午12:12:12
        // new Date().toLocaleString();     => 2020/12/12 上/下午12:12:12          
    }
    /** 日期列表生成 */
    dateJson() {
        var calendar = [],
            minYears = new Date().getFullYear(),
            maxYears = new Date().getFullYear() + 10,
            dayCount = 1;
        for (var i = minYears; i <= maxYears; i++) {
            /** 年 */
            var year = {};
            year.name = i.toString();
            year.sub = [];
            for (var j = 1; j <= 12; j++) {
                /** 月 */
                var month = {};
                month.name = ('0' + j.toString()).slice(-2);
                month.sub = [];
                year.sub.push(month);
                dayCount = new Date(i, j, 0).getDate();
                for (var k = 1; k <= dayCount; k++) {
                    month.sub.push({
                        name: ('0' + k.toString()).slice(-2)
                    });
                }
            }
            calendar.push(year);
        }
        // 这里是限制不能选小于之前的日期
        calendar[0].sub.splice(0, new Date().getMonth());
        calendar[0].sub[0].sub.splice(0, new Date().getDate());
        return calendar;
    }

    /**
     * 时间生成器
     * @param {number} minInterval 时间间隔(分钟)
     */
    timeInterval(minInterval) {
        let arr = [], minTotal = 0;
        while (minTotal < 1440) {
            let hour = Math.floor(minTotal / 60);
            let minute = Math.floor(minTotal % 60);
            hour = ('0' + hour).slice(-2);
            minute = ('0' + minute).slice(-2);
            arr.push(`${hour}':'${minute}`);
            minTotal += minInterval;
        }
        return arr;
    }

    /**
     * 时间戳生成 
     * @param {number} num 1时为明天，-1为昨天天，以此类推
     * @return {'yyyy/mm/dd hh:mm:ss'}
     */
    getDateFormat(num = 0) {
        let _date, year, month, day, hour, minute, second;
        _date = new Date(new Date().getTime() + (num * 24 * 3600 * 1000));
        year = _date.getFullYear();
        month = ('0' + (_date.getMonth() + 1)).slice(-2);
        day = ('0' + _date.getDate()).slice(-2);
        hour = ('0' + _date.getHours()).slice(-2);
        minute = ('0' + _date.getMinutes()).slice(-2);
        second = ('0' + _date.getSeconds()).slice(-2);
        return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    }

    /**
     * 获取日期周几
     * @param {string} date 日期 '2019/04/28' & '2019/04/28 12:12:12'
     */
    getDateDayString(date) {
        return '周' + '日一二三四五六'.charAt(new Date(date).getDay());
    }

    /**
     * 获取两个时间段的秒数
     * @param {Date} now 现在时间
     * @param {Date} before 之前的时间
     */
    getDateSlotSecond(now, before) {
        return (now.getTime() - before.getTime()) / 1000;
    }

    /**
     * 获取两个日期之间的天数
     * @param {Date} now 现在时间
     * @param {Date} before 之前时间
     */
    getDateSlotDays(now, before) {
        return Math.floor((now.getTime() - before.getTime()) / 86400000);
    }

    /**
     * 将秒数换成时分秒格式
     * @param {number} value 
     */
    secondFormat(value) {
        let second = Math.floor(value),
            minute = 0,
            hour = 0;
        // 如果秒数大于60，将秒数转换成整数
        if (second > 60) {
            // 获取分钟，除以60取整数，得到整数分钟
            minute = Math.floor(second / 60);
            // 获取秒数，秒数取佘，得到整数秒数
            second = Math.floor(second % 60);
            // 如果分钟大于60，将分钟转换成小时
            if (minute > 60) {
                // 获取小时，获取分钟除以60，得到整数小时
                hour = Math.floor(minute / 60);
                // 获取小时后取佘的分，获取分钟除以60取佘的分
                minute = Math.floor(minute % 60);
            }
        }
        return { hour, minute, second };
    }

    /**
     * 带天数的倒计时
     * @param {number} value 秒数
     */
    countDown(value) {
        let timer = setInterval(() => {
            if (value <= 0) return clearInterval(timer);
            let day = 0, hour = 0, minute = 0, second = 0;
            day = Math.floor(value / (3600 * 24));
            hour = Math.floor(value / 3600) - (day * 24);
            minute = Math.floor(value / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(value) - (day * 24 * 3600) - (hour * 3600) - (minute * 60);
            // 格式化
            day = ('0' + day).slice(-2);
            hour = ('0' + hour).slice(-2);
            minute = ('0' + minute).slice(-2);
            second = ('0' + second).slice(-2);
            console.log(`${day}天：${hour}小时：${minute}分钟：${second}秒`);
            value--;
        }, 1000);
    }
}

/** 浏览器模块 */
class BomModule extends DateModule {
    constructor() {
        /** 缓存类型 */
        this.cache = window.sessionStorage;
    }

    /**
     * 本地储存数据
     * @param {string} key 对应的 key 值
     * @param {object} data 对应的数据
     */
    saveData(key, data) {
        this.cache.setItem(key, JSON.stringify(data));
    }

    /**
     * 获取本地数据
     * @param {string} key 对应的 key 值
     */
    fetchData(key) {
        let data = this.cache.getItem(key) ? JSON.parse(this.cache.getItem(key)) : null;
        return data;
    }

    /** 清除本地数据 */
    removeData() {
        this.cache.clear();
        // this.cache.removeItem('key');　// 删除键值对
    }

    /** 长震动 */
    vibrateLong() {
        if ('vibrate' in window.navigator) {
            window.navigator.vibrate(400);
        } else if (window['wx'] && wx.vibrateLong) {
            wx.vibrateLong();
        }
    }

    /** 短震动 */
    vibrateShort() {
        if ('vibrate' in window.navigator) {
            window.navigator.vibrate(15);
        } else if (window['wx'] && wx.vibrateShort) {
            wx.vibrateShort();
        }
    }

    /** 检查是否移动端 */
    checkMobile() {
        const pattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i;
        return pattern.test(navigator.userAgent); //  ? 'Mobile' : 'Desktop';
    }
}

/** dom 模块 */
class DomModule extends BomModule {
    /**
     * 单个元素查找
     * @param {string} name class | id | label <div> <p>
     */
    find(name) {
        return document.querySelector(name);
    }

    /**
     * 多个元素查找 返回 array[...dom]
     * @param {string} name class | id | label <div> <p>
     */
    findAll(name) {
        let nodes = document.querySelectorAll(name);
        if (Array.from) {
            nodes = Array.from(nodes);
        } else {
            nodes = [].slice.call(nodes);
        }
        return nodes;
    }

    /**
     * 设置样式
     * @param {Element} el 设置样式的元素
     * @param {object} styles 样式 Example: {display: 'block', width: '100px'}
     */
    setStyle(el, styles) {
        for (let key in styles) {
            el.style[key] = styles[key];
        }
    }

    /**
     * 检测元素是否存在指定 calss
     * @param {Element} el 当前元素
     * @param {string} className class name
     */
    hasClass(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        }
    }

    /**
     * 给元素添加 calss
     * @param {Element} el 当前元素
     * @param {string} className class name
     */
    addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            if (!this.hasClass(el, className)) {
                let name = el.className.charAt(el.className.length - 1) === ' ' ? className : ' ' + className;
                el.className += name;
            }
        }
    }

    /**
     * 给元素移除指定 calss
     * @param {Element} el 当前元素
     * @param {string} className class name
     */
    removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            if (this.hasClass(el, className)) {
                let reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                el.className = el.className.replace(reg, ' ');
            }
        }
    }

    /**
     * 切换 calss name
     * @param {Element} el 当前元素
     * @param {string} className class name
     */
    toggleClass(el, className) {
        if (el.classList) {
            el.classList.toggle(className);
        } else {
            if (this.hasClass(el, className)) {
                this.removeClass(el, className);
            } else {
                this.addClass(el, className);
            }
        }
    }

    /**
     * 获取元素的的矩阵坐标
     * @param {Element} el 当前元素
     */
    getRect(el) {
        return el.getBoundingClientRect();
    }

    /**
     * 动画帧更新
     * @param {Function} fn 动画帧函数
     */
    update(fn = null) {
        if (typeof fn !== 'function') return console.log('缺少动画函数');
        /** 动画帧 */
        const AnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        /** 动画开始 */
        function move() {
            fn();
            AnimationFrame(move);
        }
        move();
    }

    /**
     * 复制内容
     * @param {string} value 内容 
     */
    copyText(value) {
        let input = document.createElement("input");
        input.value = value;
        document.body.appendChild(input);
        input.select(); // 选择对象;
        // 执行浏览器复制命令
        document.execCommand("Copy");
        input.remove();
    }

    /**
     * rem 适应
     * @param {HTMLElement} el 指定元素适配
     */
    remSetting(el) {
        const html = document.documentElement; // 注意这里不能 使用 document.body
        /** 比例值 */
        let value = 375 / 50;
        /** 视口宽度 */
        let width = el.getBoundingClientRect().width;
        html.style.fontSize = width / value + 'px';
        // 窗口变动时更新适配
        window.addEventListener('resize', function () {
            width = el.getBoundingClientRect().width;
            html.style.fontSize = width / value + 'px';
        });
    }
}

const utils = new DomModule();