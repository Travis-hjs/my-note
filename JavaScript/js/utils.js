/** 字符串模块 */
class ModuleString {
    /**
     * 过滤只保留数字及小数点
     * @param {string} string 字符串
     */
    filterOnlyNumber(string) {
        // 去空格
        let value = string.trim();
        // 默认返回 0
        if (value.length === 0) return 0;
        // 正则过滤剩下数字和小数点
        value = value.replace(/[^0-9.]+/g, "");
        return parseFloat(value);
    }

    /**
     * 输入只能是数字(包括小数点)
     * @param {string} value 字符串
     */
    inputOnlyNumber(value) {
        let result = value.trim();
        if (result.length == 0) return "";
        result = result.replace(/[^0-9.]+/ig, "");
        let array = result.split(".");
        if (array.length > 1) {
            result = array[0] + "." + array[1];
        }
        return result;
    }

    /**
     * 过滤掉特殊字符（包括emoji）
     * @param {string} value
     */
    filterSpecialValue(value) {
        value = value.trim();
        const emojiReg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
        const symbolReg = /[`~!@#$^&()=|{}':;,\[\].<>/?！￥…*（）—【】‘；：”“。，、？`%+\-_"\\]/g; // 漏了可以自己加进去
        return value.replace(emojiReg, "").replace(symbolReg, "");
    }

    /**
     * 数字带逗号分隔
     * @param {number} num
     * @example 
     * ```js
     * stringToThousand(10000) => "10,000"
     * ```
     */
    stringToThousand(num) {
        // return num.toLocaleString("en-US");
        return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
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
        if (value === 0) return 0;
        const units = ["", "k", "m", "b", "f", "e", "ae", "be", "ce", "de", "ee", "fe", "ge", "he", "ie"];
        const index = Math.floor(Math.log(value) / Math.log(1000));
        let result = value / Math.pow(1000, index);
        if (index === 0) return result;
        result = result.toFixed(3);
        // 不进行四舍五入 取小数点后一位
        result = result.substring(0, result.lastIndexOf(".") + 2);
        return result + units[index];
    }

    /**
     * 获取`url?`后面参数（JSON对象）
     * @param {string} name 获取指定参数名
     * @param {string} target 目标字段，默认`location.search`
     * @example 
     * ```js
     * // 当前网址为 www.https://hjs.com?id=99&age=123&key=sdasfdfr
     * const targetAge = getQueryParam("age", "id=12&age=14&name=hjs");
     * const params = getQueryParam();
     * const age = getQueryParam("age");
     * // 非IE浏览器下简便方法
     * new URLSearchParams(location.search).get("age");
     * ```
     * @returns {object|string}
     */
    getQueryParam(name = null, target = null) {
        // const code = target || location.search.slice(1); // location.search 在 http://192.168.89.53:1080/#/page?id=10 这种情况下获取不到
        const code = target || location.href.split("?")[1] || "";
        const list = code.split("&");
        const params = {};
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const items = item.split("=");
            if (items.length > 1) {
                params[items[0]] = item.replace(`${items[0]}=`, "");
            }
        }
        if (name) {
            return params[name] || "";
        } else {
            return params;
        }
        // const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        // const results = location.search.substr(1).match(reg);
        // if (results != null) return unescape(results[2]);
        // return null;
    }

    /**
     * rgb 转 16进制 
     * @param {string} string rgb(125, 125, 125)
     */
    rgbToHex(string) {
        var rgb = string.split(",");
        var r = parseInt(rgb[0].split("(")[1]);
        var g = parseInt(rgb[1]);
        var b = parseInt(rgb[2].split(")")[0]);
        var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return hex;
    }

    /** 
    * hex16 进制颜色转 rgb(rgba)
    * @param {string} hex "#23ff45" 
    */
    hexToRgb(hex) {
        return "rgb(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + ")";
    }

    /** 随机16进制颜色 */
    randomHex() {
        return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0");
    }

    /**
     * 检测类型
     * @param {any} target 检测的目标
     * @returns {"string"|"number"|"array"|"object"|"function"|"null"|"undefined"} 只枚举一些常用的类型
     */
    checkType(target) {
        /** @type {string} */
        const value = Object.prototype.toString.call(target);
        const result = value.match(/\[object (\S*)\]/)[1];
        return result.toLocaleLowerCase();
    }
}

/** 数字模块 */
class ModuleNumber extends ModuleString {
    /**
     * 范围随机整数
     * @param {number} min 最小数
     * @param {number} max 最大数
     */
    ranInt(min, max) {
        return Math.round(Math.random() * (max - min) + min);       //不会保留小数
        // return Math.floor(Math.random() * (max - min + 1)) + min; // 会保留小数
    }

    /**
     * 数字运算（主要用于小数点精度问题）
     * [see](https://juejin.im/post/6844904066418491406#heading-12)
     * @param {number} a 前面的值
     * @param {"+"|"-"|"*"|"/"} type 计算方式
     * @param {number} b 后面的值
     * @example 
     * ```js
     * // 可链式调用
     * const res = computeNumber(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
     * console.log(res);
     * ```
     */
    computeNumber(a, type, b) {
        const THAT = this;
        /**
         * 获取数字小数点的长度
         * @param {number} n 数字
         */
        function getDecimalLength(n) {
            const decimal = n.toString().split(".")[1];
            return decimal ? decimal.length : 0;
        }
        /** 倍率 */
        const power = Math.pow(10, Math.max(getDecimalLength(a), getDecimalLength(b)));
        let result = 0;
        
        // 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的暴力处理
        a = Math.round(a * power);
        b = Math.round(b * power);

        switch (type) {
            case "+":
                result = (a + b) / power;
                break;
            case "-":
                result = (a - b) / power;
                break;
            case "*":
                result = (a * b) / (power * power);
                break;
            case "/":
                result = a  / b ;
                break;
        }
        
        return {
            /** 计算结果 */
            result,
            /**
             * 继续计算
             * @param {"+"|"-"|"*"|"/"} nextType 继续计算方式
             * @param {number} nextValue 继续计算的值
             */
            next(nextType, nextValue) {
                return THAT.computeNumber(result, nextType, nextValue);
            },
            /** 
             * 小数点进位 
             * @param {number} n 小数点后的位数
            */
            toHex(n) {
                const strings = result.toString().split(".");
                if (n > 0 && strings[1] && strings[1].length > n) {
                    const decimal = strings[1].slice(0, n);
                    const value = Number(`${strings[0]}.${decimal}`);
                    const difference = 1 / Math.pow(10, decimal.length);
                    result = THAT.computeNumber(value, "+", difference).result;
                }
                return result;
            }
        };
    }

    /**
     * Math.hypot 兼容方法
     * @param {Array<number>} values 
     */
    hypot(...values) {
        const length = values.length;
        let result = 0;
        for (let i = 0; i < length; i++) {
            if (values[i] === Infinity || values[i] === -Infinity) {
                return Infinity;
            }
            result += values[i] * values[i];
        }
        return Math.sqrt(result);
    }

    /**
     * 获取两个坐标（二维）之间距离
     * @param {{x: number, y: number}} size1 坐标一
     * @param {{x: number, y: number}} size2 坐标二
     */
    getSizeDistance(size1, size2) {
        const dx = size2.x - size1.x;
        const dy = size2.y - size1.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));  
        // return this.hypot(size2.x - size1.x, size2.y - size1.y);
    }

    /**
     * 传入角度计算圆周长上的点坐标
     * @param {number} deg 角度
     * @param {number} radius 范围半径
     */
    computeCircularPosition(deg = 0, radius = 100) {
        const x = Math.round(radius * Math.sin(deg * Math.PI / 180));
        const y = Math.round(radius * Math.cos(deg * Math.PI / 180));
        return { x, y }
    }

    /**
     * 获取两个坐标（经纬度）点距离
     * @param {object} location1 坐标1
     * @param {number} location1.lng 经度
     * @param {number} location1.lat 维度
     * @param {object} location2 坐标2
     * @param {number} location2.lng 经度
     * @param {number} location2.lat 维度
     */
    getLocationDistance(location1, location2) {
        const toRad = d => d * Math.PI / 180;
        const radLat1 = toRad(location1.lat);
        const radLat2 = toRad(location2.lat);
        const deltaLat = radLat1 - radLat2;
        const deltaLng = toRad(location1.lng) - toRad(location2.lng);
        const dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
        return dis * 6378137;
    }

    /**
     * 检测两个节点坐标是否相交
     * @param {{left: number, top: number, width: number, height: number}} a 
     * @param {{left: number, top: number, width: number, height: number}} b 
     */
    isCollision(a, b) {
        const ax = a.left;
        const ay = a.top;
        const aw = a.width;
        const ah = a.height;
        const bx = b.left;
        const by = b.top;
        const bw = b.width;
        const bh = b.height;
        return (ax + aw > bx && ax < bx + bw && ay + ah > by && ay < by + bh);
    }
}

/** 数组类处理模块 */
class ModuleArray extends ModuleNumber {
    /**
     * es5兼容es6 "Array.find"
     * @param {Array<T>} array
     * @param {(value: T, index: number) => boolean} compare 对比函数
     */
    findItem(array, compare) {
        var result = null;
        for (var i = 0; i < array.length; i++) {
            var value = array[i];
            if (compare(value, i)) {
                result = value;
                break;
            }
        }
        return result;
    }

    /**
     * es5兼容es6 "Array.findIndex"
     * @param {Array<T>} array 
     * @param {(value: T, index: number) => boolean} compare 对比函数
     */
    findIndex(array, compare) {
        var result = null;
        for (var i = 0; i < array.length; i++) {
            if (compare(array[i], i)) {
                result = i;
                break;
            }
        }
        return result;
    }

    /**
     * 自定义对象数组去重
     * @param {Array<T>} array 
     * @param {(a: T, b: T) => void} compare 对比函数
     * @example 
     * ```js
     * const list = [{ id: 10, code: "abc" }, {id: 12, code: "abc"}, {id: 12, code: "abc"}];
     * findIndex(list, (a, b) => a.id == b.id)
     * ```
     */
    filterRepeat(array, compare) {
        return array.filter((element, index, self) => {
            // return this.findIndex(self, el => compare(el, element)) === index;
            return self.findIndex(el => compare(el, element)) === index;
        })
    }

    /**
     * 扁平化数组
     * @description `Array.flat()`兼容写法
     * @param {Array<T>} array 目标数组
     * @param {number} d 层数
     * @returns {Array<T>}
     */
    flatArray(array, d = 1) {
        if (d > 0) {
            return array.reduce((pre, val) => pre.concat(Array.isArray(val) ? this.flatArray(val, d - 1) : val), []);
        } else {
            return array.slice();
        }
    };

    /**
     * 随机打乱数组
     * @param {Array<T>} array
     */
    shuffleArray(array) {
        // return array.sort(() => Math.random() > 0.5 ? -1 : 1);
        // 洗牌随机法（性能最优）
        for (let i = array.length - 1; i >= 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            let itemAtIndex = array[randomIndex];
            array[randomIndex] = array[i];
            array[i] = itemAtIndex;
        }
        return array;
    }

    /**
     * 数组中随机取几个元素
     * @param {Array<T>} array 数组
     * @param {number} count 元素个数
     */
    getRandomArrayElements(array, count) {
        let length = array.length;
        let min = length - count;
        let index = 0;
        let value = "";
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
     * @param {Array<T>} array 改数组
     * @param {number} index 元素索引
     */
    zIndexToTop(array, index) {
        if (index != 0) {
            const item = array[index];
            array.splice(index, 1);
            array.unshift(item);
        } else {
            console.log("已经处于置顶");
        }
    }

    /**
     * 将指定位置的元素置底
     * @param {Array<T>} array 改数组
     * @param {number} index 元素索引
     */
    zIndexToBottom(array, index) {
        if (index != array.length - 1) {
            const item = array[index];
            array.splice(index, 1);
            array.push(item);
        } else {
            console.log("已经处于置底");
        }
    }

}

class ModuleDate extends ModuleArray {
    /**
     * 时间日期类型日期模块
     * @example
     * new Date().toLocaleDateString();         => "2020/12/12"
     * new Date().toTimeString().slice(0, 8);   => "12:12:12"
     * new Date().toLocaleTimeString();         => "上/下午12:12:12"
     * new Date().toLocaleString();             => "2020/12/12 上/下午12:12:12"
     */
    constructor() {
        super();
    }

    /** 日期列表生成 */
    dateJson() {
        /**
         * 日历数组
         * @type {Array<{name: string, sub: Array<{name: string, sub: Array<{name: string}>}>}>}
         */
        const calendar = [];
        const date = new Date();
        const minYear = date.getFullYear();
        const maxYear = date.getFullYear() + 10;
        let dayCount = 1;
        for (let i = minYear; i <= maxYear; i++) {
            const year = {
                name: i.toString(),
                sub: []
            }
            for (let j = 1; j <= 12; j++) {
                const month = {
                    name: ("0" + j.toString()).slice(-2),
                    sub: []
                };
                year.sub.push(month);
                dayCount = new Date(i, j, 0).getDate();
                for (let k = 1; k <= dayCount; k++) {
                    month.sub.push({
                        name: ("0" + k.toString()).slice(-2)
                    });
                }
            }
            calendar.push(year);
        }
        // 这里是限制不能选小于之前的日期
        calendar[0].sub.splice(0, date.getMonth());
        calendar[0].sub[0].sub.splice(0, date.getDate());
        return calendar;
    }

    /**
     * 时间生成器
     * @param {number} minInterval 时间间隔(分钟)
     */
    timeInterval(minInterval) {
        let arr = [];
        let minTotal = 0;
        while (minTotal < 1440) {
            let hour = Math.floor(minTotal / 60);
            let minute = Math.floor(minTotal % 60);
            hour = ("0" + hour).slice(-2);
            minute = ("0" + minute).slice(-2);
            minTotal += minInterval;
            arr.push(hour + ":" + minute);
            return arr;
        }
    }

    /**
     * 格式化日期
     * @param {string | number | Date} value 指定日期
     * @param {string} format 格式化的规则
     * @example
     * ```js
     * formatDate();
     * formatDate(1603264465956);
     * formatDate(1603264465956, "h:m:s");
     * formatDate(1603264465956, "Y年M月D日");
     * ```
     */
    formatDate(value = Date.now(), format = "Y-M-D h:m:s") {
        const formatNumber = n => `0${n}`.slice(-2);
        const date = new Date(value);
        const formatList = ["Y", "M", "D", "h", "m", "s"];
        const resultList = [];
        resultList.push(date.getFullYear().toString());
        resultList.push(formatNumber(date.getMonth() + 1));
        resultList.push(formatNumber(date.getDate()));
        resultList.push(formatNumber(date.getHours()));
        resultList.push(formatNumber(date.getMinutes()));
        resultList.push(formatNumber(date.getSeconds()));
        for (let i = 0; i < resultList.length; i++) {
            format = format.replace(formatList[i], resultList[i]);
        }
        return format;
    }

    /**
     * 获取日期周几
     * @param {string | string | Date} value 指定日期
     */
    getDateDayString(value) {
        return "周" + "日一二三四五六".charAt(new Date(value).getDay());
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
     * @param {number} value 秒数
     * @param {boolean} withDay 是否带天数倒计
     * @returns {{day: string, hour: string, minute: string, second: string}}
     */
    formatSecond(value, withDay = false) {
        let day = Math.floor(value / (24 * 3600));
        let hour = Math.floor(value / 3600) - day * 24;
        let minute = Math.floor(value / 60) - (day * 24 * 60) - (hour * 60);
        let second = Math.floor(value) - (day * 24 * 3600) - (hour * 3600) - (minute * 60);
        if (!withDay) {
            hour = hour + day * 24;
        }
        // 格式化
        day = day < 10 ? ("0" + day).slice(-2) : day.toString();
        hour = hour < 10 ? ("0" + hour).slice(-2) : hour.toString();
        minute = ("0" + minute).slice(-2);
        second = ("0" + second).slice(-2);
        return { day, hour, minute, second }
    }

}

class ModuleBom extends ModuleDate {
    /** 浏览器模块 */
    constructor() {
        super();
        /** 缓存类型 */
        this.cache = window.sessionStorage;
    }

    /**
     * 本地储存数据
     * @param {string} key 对应的 key 值
     * @param {object} data 对应的数据
     */
    saveData(key, data) {
        window.sessionStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * 获取本地数据
     * @param {string} key 对应的 key 值
     */
    fetchData(key) {
        let data = window.sessionStorage.getItem(key) ? JSON.parse(window.sessionStorage.getItem(key)) : null;
        return data;
    }

    /** 清除本地数据 */
    removeData() {
        window.sessionStorage.clear();
        // window.sessionStorage.removeItem("key");　// 删除键值对
    }

    /** 长震动 */
    vibrateLong() {
        if ("vibrate" in window.navigator) {
            window.navigator.vibrate(400);
        } else if (window["wx"] && wx.vibrateLong) {
            wx.vibrateLong();
        }
    }

    /** 短震动 */
    vibrateShort() {
        if ("vibrate" in window.navigator) {
            window.navigator.vibrate(15);
        } else if (window["wx"] && wx.vibrateShort) {
            wx.vibrateShort();
        }
    }

    /** 检查是否移动端 */
    isMobile() {
        const pattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i;
        return pattern.test(navigator.userAgent); //  ? "Mobile" : "Desktop";
    }

    /**
     * 创建浏览器指纹
     * @param {string} domain window.location.host
     */
    createFingerprint(domain) {
        /**
         * @param {string} string 
         */
        function bin2hex(string) {
            let result = "";
            for (let i = 0; i < string.length; i++) {
                const n = string.charCodeAt(i).toString(16);
                result += n.length < 2 ? "0" + n : n;
            }
            return result;
        }
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const txt = domain || "hjs.com";
        ctx.textBaseline = "top";
        ctx.font = "14px Arial";
        ctx.textBaseline = "tencent";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText(txt, 4, 17);
        let b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
        let bin = atob(b64);
        return bin2hex(bin.slice(-16, -12));
    }

    /**
     * 写入并下载文件（只支持Chrome && Firefox）
     * @param {string} filename 文件名 xxx.text | xxx.js | xxx.[type]
     * @param {string} content 文件内容
     */
    download(filename, content) {
        const label = document.createElement("a");
        label.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
        label.setAttribute("download", filename);
        if (document.createEvent) {
            const event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            label.dispatchEvent(event);
        } else {
            label.click();
        }
    }

    /**
     * 复制文本
     * @param {string} text 复制的内容
     * @param {() => void} success 成功回调
     * @param {(error: string) => void} fail 出错回调
     */
    copyText(text, success = null, fail = null) {
        text = text.replace(/(^\s*)|(\s*$)/g, "");
        if (!text) {
            typeof fail === "function" && fail("复制的内容不能为空！");
            return;
        }
        const id = "the-clipboard";
        /**
         * 粘贴板节点
         * @type {HTMLTextAreaElement}
         */
        let clipboard = document.getElementById(id);
        if (!clipboard) {
            clipboard = document.createElement("textarea");
            clipboard.id = id;
            clipboard.style.cssText = "font-size: 15px; position: fixed; top: -1000%; left: -1000%;";
            document.body.appendChild(clipboard);
        }
        clipboard.value = text;
        clipboard.select();
        clipboard.setSelectionRange(0, clipboard.value.length);
        document.execCommand("copy");
        clipboard.blur();
        typeof success === "function" && success();
    }
}

/** dom 模块 */
class ModuleDom extends ModuleBom {
    /**
     * 单个元素查找
     * @param {string} name class | id | label <div> <p>
     * @returns {HTMLElement}
     */
    find(name) {
        return document.querySelector(name);
    }

    /**
     * 多个元素查找
     * @param {string} name class | id | label <div> <p>
     * @returns {Array<HTMLElement>}
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
     * @param {HTMLElement} el 设置样式的元素
     * @param {CSSStyleDeclaration} styles 样式 
     */
    setStyle(el, styles) {
        for (const key in styles) {
            el.style[key] = styles[key];
        }
    }

    /**
     * 检测元素是否存在指定 calss
     * @param {HTMLElement} el 当前元素
     * @param {string} className class name
     */
    hasClass(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
        }
    }

    /**
     * 给元素添加 calss
     * @param {HTMLElement} el 当前元素
     * @param {string} className class name
     */
    addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            if (!this.hasClass(el, className)) {
                let name = el.className.charAt(el.className.length - 1) === " " ? className : " " + className;
                el.className += name;
            }
        }
    }

    /**
     * 给元素移除指定 calss
     * @param {HTMLElement} el 当前元素
     * @param {string} className class name
     */
    removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            if (this.hasClass(el, className)) {
                let reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
                el.className = el.className.replace(reg, " ");
            }
        }
    }

    /**
     * 切换 calss name
     * @param {HTMLElement} el 当前元素
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
     * @param {HTMLElement} el 当前元素
     */
    getRect(el) {
        return el.getBoundingClientRect();
    }

    /**
     * 动画帧更新
     * @param {Function} callback 动画帧函数
     */
    update(callback = null) {
        if (typeof callback !== "function") return console.log("缺少动画函数");
        /** 动画帧 */
        const AnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        /** 动画开始 */
        function move() {
            callback();
            AnimationFrame(move);
        }
        move();
    }

    /**
     * `rem`适配
     * @param {HTMLElement} el 指定元素
     * @param {number} designWidth 设计稿的宽度：之后的单位直接`1:1`使用设计稿的大小，单位是`rem`
     * @description [一行css适配rem](https://juejin.im/post/6844904066418491406/#heading-13)
     */
    remSetting(el, designWidth = 750) {
        const html = document.documentElement; // 注意这里不能使用 document.body
        /** 视口宽度 */
        let width = el.clientWidth;
        // 首次适配
        html.style.fontSize = width / designWidth + "px";
        // 窗口变动时更新适配
        window.addEventListener("resize", function () {
            width = el.clientWidth;
            html.style.fontSize = width / designWidth + "px";
        });
    }

    /**
     * 设置节点数字动画
     * @param {object} options 配置参数
     * @param {HTMLElement} options.el 目标节点
     * @param {number} options.number 最终显示的数字
     * @param {number} options.decimals 小数位（传`0`则为整数）
     * @param {number} options.time （可选）多少毫秒内完成，默认1秒
     * @param {Function} options.callback （可选）完成回调
     */
    setNumberAnimation(options) {
        const animation = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        const el = options.el;
        const int = options.decimals == 0;
        const result = options.number || 188.88;
        const time = (options.time || 1000) / 1000;
        const step = result / (time * 60);
        let count = 0;
        function move() {
            count += step;
            if (count >= result) {
                count = result;
                el.textContent = int ? Math.round(count) : count.toFixed(options.decimals);
                typeof options.callback === "function" && options.callback();
            } else {
                el.textContent = int ? Math.round(count) : count.toFixed(options.decimals);
                animation(move);
            }
        }
        el.textContent = count;
        move();
    }
    /** 
     * 获取 body 标签中的所有内容 
     * @param {string} value 
    */
    getBodyLabelContent(value) {
        // value = value.replace(/\n/g, "");
        const rule = /<[^>]*?body[^>]*?>([\s\S]*)<\/\s*body\s*>/;
        // console.log(rule.exec(value));
        const result = rule.exec(value);
        if(result && result.length === 2) {
            return result[1];
        }
        return value;
    }

    /**
     * 获取所有 script 标签的内容
     * @param {string} value 
     */
    getAllScriptContent(value) {
        const rule = /<[^>]*?script[^>]*?>[\s\S]*<\/\s*script\s*>/i;  // /<script id="main">([\s\S]*)<\/script>/;
        const start = /<script[^>]*?>/g; // <[^>]*?script[^>]*?>
        const end = /<\/\s*script\s*>/g;
        const code = rule.exec(value);
        let result = "";
        // console.log(code);
        if(code && code.length === 1) {
            result = code[0];
        } 
        // console.log(result.replace(start, ""));
        return result.replace(start, "").replace(end, ";");
    }

    /** 自定义 log */
    log() {
        const args = [].slice.call(arguments);
        args.unshift("%c the-log >>", "color: #4fc08d");
        console.log.apply(console, args);
    }
}

const utils = new ModuleDom();

export default utils;