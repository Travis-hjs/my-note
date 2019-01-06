// 选择器
let $ = el => document.querySelector(el);
let $$ = el => document.querySelectorAll(el);

/*
 * 阻止事件冒泡
 * event.cancelBubble = true;
 * event.stopPropagation(); //  阻止事件向上传播
 * event.preventDefault();  //  取消事件的默认动作。submit类型标签有效
 * addEventListener中的第三个参 数是useCapture,一个bool类型。
 * 当为false时为冒泡获取(由里向外)，true为capture方式(由外向里)
 * 等价于jQuery的 $(document).ready()
 * window.addEventListener('DOMContentLoaded', functionName) // mouseover, mouseout:hover()
 * encodeURIComponent() 对字符串进行编码(数字和英文不变)
 * decodeURIComponent() 对应的解码
 * str.replace(/\d+/g, '') => 过滤数字
 * str.replace(/[a-zA-Z]/g, '') => 过滤英文
 * string.includes()字符串监测 ES6
*/

/**
 * 永久储存
 * localStorage.setItem("key","value"); 以“key”为名称存储一个值“value”
 * localStorage.getItem("key"); 获取名称为“key”的值
 * 周期储存（浏览器关闭之前）
 * sessionStorage.setItem('','')
 * sessionStorage.getItem('')
*/

function dataCut() {
    let _str = 'www.https/#/hjihsaih/#/sad.com',
        _code = 'CEde_128,1214534',
        _obj = {
            name: 'hjs',
            tall: '178cm',
            weight: '128kg'
        };
    // 正则替换：i是首个，g是全局 
    console.log(_str.replace(/#/i, '?#'));
    // 下面这种替换性能会更好点，但是不够灵活，只能是全局替换
    console.log(_str.split('#').join('?#'));
    console.log(_code.slice(_code.indexOf(',') + 1));
    // 对象属性获取值
    console.log(Object.keys(_obj));
    console.log(String(Object.keys(_obj)));
    /** 
     * ES5 
     * Object.keys(obj)
     * ES6
     * Object.values(obj);
     * Object.entries(obj);
    */
}

function _click() {
    var list = $(".menu");
    for (var i = 1; i <= 5; i++) {
        var item = document.createElement("LI");
        item.dataset.index = i;
        item.appendChild(document.createTextNode("测试li " + i));
        list.appendChild(item);
        /**
         * 不用let的传统写法，添加function完成闭包
         * 1、添加点击事件
        */
        // (function (j) {
        //   // var j = i;
        //   item.addEventListener('click',() => {
        //     console.log("第" + j + "个li");
        //   });
        // })(i)
    }
    /**
     * 2、添加点击事件
     * 使用事假代理 (事件委托就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件)
    */
    list.addEventListener('click', ev => {
        console.log(`第 ${ev.target.dataset.index} 个li`);
    });
    // 方法二、全局查找节点
    // var _ul = document.querySelector('#app ul');
    // _ul.addEventListener('click', function (e) {
    //     var _target = e.target;
    //     while(_target !== _ul ){
    //        if(_target.tagName.toLowerCase() == 'li'){
    //            // console.log(_target.dataset.id);
    //            break;
    //        }
    //        _target = _target.parentNode;
    //     }
    // })
    // 方法一、指定某个节点
    // _ul.addEventListener('click', function (e) {
    // 	if (e.target.nodeName.toLowerCase() == 'h5') {
    // 		console.log(e.target.dataset.id);
    // 	}
    // })
}
_click();

// new 理解
function newFunction() {
    function Animal(name) {
        this.name = name;
    }
    Animal.color = "black";
    Animal.prototype.say = function () { // prototype 向对象添加属性，此时 Animal.say() 不可用
        console.log("I'm " + this.name);
    };
    var cat = new Animal("cat");
    console.log(
        cat.name, // cat
        cat.color // undefined
    );
    cat.say(); // I'm cat

    console.log(
        Animal.name, // Animal
        Animal.color // back
    );
    Animal.say(); // Animal.say is not a function
    //上面的意思是：把 Animal 的作用赋值给了 cat ，
}
// newFunction();

// 对象
function objFunction() {
    // 1
    var Boy = {
        name: 'Hansen',
        color: 'lightgreen'
    };
    // 2
    var Boy = (name, color) => {
        return {
            name: name,
            color: color
        }
    }
    var cat = Boy('小米', '黄色');
    var dog = Boy('华为', '蓝色')
    console.log(cat, dog);
    // 3
    function Boy(name, color) { // 这里不能用箭头函数
        this.name = name;
        this.color = color;
    }
    // var cat = new Boy('小米','黄色');
    // var dog = new Boy('华为','蓝色');
    // console.log(cat.name,dog);
}
// objFunction();

/**
 * class处理事件
 * IE10+
 * el.classList.contains(className)
 * el.classList.add(className)
 * el.classList.remove(className)
 * el.classList.toggle(className)
*/
function hasClass(el, c) {
    return el.className.match(new RegExp('(\\s|^)' + c + '(\\s|$)'));
}
function addClass(el, c) {
    if (!hasClass(el, c)) {
        var _c = el.className.charAt(el.className.length - 1) === ' ' ? c : ' ' + c;
        el.className += _c;
    }
}
function removeClass(el, c) {
    if (hasClass(el, c)) {
        var reg = new RegExp('(\\s|^)' + c + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}
function toggleClass(el, c) {
    if (hasClass(el, c)) {
        removeClass(el, c);
    } else {
        addClass(el, c);
    }
}
$('#wrap').querySelector('p').addEventListener('click', function () {
    toggleClass($('#wrap'), 'tra');
    // this.classList.toggle('tra');
});

// bind()
this.num = 9;
var mymodule = {
    num: 81,
    getNum() {
        console.log(this.num)
    }
};
mymodule.getNum(); // 81
var getNum = mymodule.getNum;
getNum(); // 9, 因为在这个例子中，"this"指向全局对象
// 创建一个'this'绑定到mymodule的函数
var boundGetNum = getNum.bind(mymodule);
boundGetNum(); // 81

/**
 * 工厂模式
 * 工厂模式下不需要 new 因为他本身就是创建一个新的对象
*/
function dom(name) {
    var obj = new Object(),
        type = '';
    function watchElement() {
        if (typeof (name) == 'single') {
            obj.el = name;
            type = 'single';
        } else {
            obj.el = document.querySelectorAll(name);
            type = 'array';
        }
    }
    watchElement();
    obj.forEach = function (array, callback) {
        for (var i = 0; i < array.length; i++) {
            array[i].index = i;
            callback(array[i], i);
        }
    }
    obj.on = function (method, callback) {
        if (type == 'array') {
            obj.forEach(obj.el, function (item, index) {
                item.addEventListener(method, callback);
            });
        } else {
            obj.el.addEventListener(method, callback);
        }
        return obj;
    }
    obj.html = function (str) {
        if (type == 'array') {
            obj.forEach(obj.el, function (item, index) {
                item.textContent = str;
            });
        } else {
            obj.el.textContent = str;
        }
        return obj;
    }
    return obj;
}
// jQuery 的链式实现
// dom('.menu li').html('工厂模式更改').on('click', function () {
//     console.log('索引', this.index);
//     dom(this).html(`li-${this.index+1}`);
// });
/**
 * 构造函数
 * 注意构造函数名第一个字母大写
*/
function Person(name, url) {
    this.name = name;
    this.url = url;
    this.alertUrl = myalert; // 函数定义可以写在外面（工厂模式也一样），不推荐
    // this.alertUrl = function () {
    //     alert(this.url);
    // };
}
function myalert() {
    alert(this.url);
}
// new Person('hjs','www.com').alertUrl() // 调用

/** 数组类型 */
function ArrayModule() {
    // 数组处理
    array.join('&');
    array.split(',');   // 把字符串分割成数组
    array.slice(i, num);// 索引截取数组
    array.shift();      // 移除第一项
    array.pop();        // 移除最后一项
    array.unshift();    // 在第一项添加
    array.reverse();    // 反转数组
    Math.ceil(25.9);    // 向上取舍
    Math.round(25.9);   // 四舍五入
    Math.floor(25.9);   // 向下取舍
    // 1~100 随机一个数
    parseInt(100 * Math.random()) + 1;
    // 把数字，小数点 格式化为指定的长度
    number.toPrecision(3);
    // 保留小数位
    number.toFixed(2);
    // 历遍数组结果 所有成立才返回 true
    var everyResult = array.every(function (item, index, array) {
        return (item > 2);
    });
    // 历遍数组结果 有一个成立返回 true
    var someResult = array.some(function (item, index, array) {
        return (item > 2);
    });
    // 过滤一个数组
    var filterResult = array.filter(function (item, index, array) {
        return (item > 2);
    });
    // 在原有数组中运行传入函数
    var mapResult = array.map(function (item, index, array) {
        return item * 2;
    });
    // 数组累加 values.reduceRight() 反向执行
    var sum = values.reduce(function (prev, cur, index, array) {
        return prev + cur;
    });
    
    // 数组排序从小到大
    let stob = (a, b) => a - b;
    array.sort(stob);

    /**
     * 数组对象排序从小到大
     * @param {string} key 对象key值
     */
    function compare(key) {
        return function (obj1, obj2) {
            let val1 = obj1[key],
                val2 = obj2[key];
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
            }
            return val1 - val2;
        }
    }
    array.sort(compare('key'));

    /** 多个key值排列判断 */
    function demo(a, b) {
        if (Number(a.level) === Number(b.level)) {
            return Number(a.levelscore) - Number(b.levelscore);
        } else {
            return Number(a.level) - Number(b.level);
        }
    }

    /**
     * 范围随机数
     * @param {Number} min 最小数
     * @param {Number} max 最大数
     */
    function ranInt(min, max) {
        return parseInt(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 随机打乱数组
     * @param {Array} array
     */
    function shuffleArray(array) {
        // 用 Math.random()函数生成 0~1 之间的随机数与 0.5 比较，返回 -1 或 1
        let randomsort = (a, b) => Math.random() > 0.5 ? -1 : 1;
        return array.sort(randomsort);
    }

    /**
     * 将指定位置的元素置顶
     * @param {Array} array 改数组
     * @param {Number} index 元素索引
     */
    function zIndexToTop(array, index) {
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
     * @param {Array} array 改数组
     * @param {Number} index 元素索引
     */
    function zIndexToBottom(array, index) {
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
     * @param {Number} lng 经度
     * @param {Number} lat 纬度
     */
    function getDistance(lng1, lat1, lng2, lat2) {
        let toRad = d => d * Math.PI / 180;
        let radLat1 = toRad(lat1);
        let radLat2 = toRad(lat2);
        let deltaLat = radLat1 - radLat2;
        let deltaLng = toRad(lng1) - toRad(lng2);
        let dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
        return dis * 6378137;
    }

    return {
        ranInt,
        shuffleArray,
        zIndexToTop,
        zIndexToBottom,
        getDistance
    }
}

// 时间日期类型
class DateModule {
    constructor() { }
    /** 日期列表生成 */
    dayJson() {
        var calendar = [],
            minYears = new Date().getFullYear(),
            maxYears = new Date().getFullYear() + 10,
            monthCount = 1,
            dayCount = 1;
        for (var i = minYears; i <= maxYears; i++) {
            var _year = {};
            _year.name = i.toString();
            _year.sub = [];
            for (var j = monthCount; j <= 12; j++) {
                var _month = {};
                _month.name = ('0' + j.toString()).slice(-2);
                _month.sub = [];
                _year.sub.push(_month);
                dayCount = new Date(i, j, 0).getDate();
                for (var k = 1; k <= dayCount; k++) {
                    _month.sub.push({
                        name: ('0' + k.toString()).slice(-2)
                    });
                }
            }
            calendar.push(_year);
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
        var arr = [],
            minTotal = 0;
        while (minTotal < 1440) {
            var hour = parseInt(minTotal / 60),
                min = parseInt(minTotal % 60);
            hour = ('0' + hour).slice(-2);
            min = ('0' + min).slice(-2);
            arr.push(hour + ':' + min);
            minTotal += minInterval;
        }
        return arr;
    }
    /**
     * 时间戳生成
     * @param {number} num 1时为明天，-1为昨天天，以此类推
     */
    timeFormat(num = 0) {
        let _Appoint, month, day, hour, minute, second, date;
        if (num > 0) {
            _Appoint = new Date(new Date().getTime() + (num * 24 * 3600 * 1000));
        } else {
            _Appoint = new Date(new Date() - (num * 24 * 3600 * 1000));
        }
        month = ('0' + (_Appoint.getMonth() + 1)).slice(-2);
        day = ('0' + _Appoint.getDate()).slice(-2);
        hour = ('0' + _Appoint.getHours()).slice(-2);
        minute = ('0' + _Appoint.getMinutes()).slice(-2);
        second = ('0' + _Appoint.getSeconds()).slice(-2);
        date = `${_Appoint.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`
        return date;
    }
    /** 获取两个时间段的秒数 */
    getSecond(newTime, oldTime) {
        return (new Date(newTime) - new Date(oldTime)) / 1000;
    }
    /**
     * 带天数的倒计时
     * @param {number} times 秒数
     */
    countDown(times) {
        let timer = setInterval(() => {
            if (times <= 0) return clearInterval(timer);
            let day = 0, hour = 0, minute = 0, second = 0;
            day = Math.floor(times / (3600 * 24));
            hour = Math.floor(times / 3600) - (day * 24);
            minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(times) - (day * 24 * 3600) - (hour * 3600) - (minute * 60);
            // 格式化
            day = ('0' + day).slice(-2);
            hour = ('0' + hour).slice(-2);
            minute = ('0' + minute).slice(-2);
            second = ('0' + second).slice(-2);
            console.log(`${day}天：${hour}小时：${minute}分钟：${second}秒`);
            times--;
        }, 1000);
    }
    /**
     * 将秒数换成时分秒格式
     * @param {number} value 
     */
    secondFormat(value) {
        let second = parseInt(value),
            minute = 0,
            hour = 0;
        // 如果秒数大于60，将秒数转换成整数
        if (second > 60) {
            // 获取分钟，除以60取整数，得到整数分钟
            minute = parseInt(second / 60);
            // 获取秒数，秒数取佘，得到整数秒数
            second = parseInt(second % 60);
            // 如果分钟大于60，将分钟转换成小时
            if (minute > 60) {
                // 获取小时，获取分钟除以60，得到整数小时
                hour = parseInt(minute / 60);
                // 获取小时后取佘的分，获取分钟除以60取佘的分
                minute = parseInt(minute % 60);
            }
        }
        return { hour, minute, second };
    }
    /**
     * 获取两个日期之间的天数
     * @param {Date} nowdate 现在时间
     * @param {Date} olddate 之前时间
     */
    getDaysDiffBetweenDates(nowdate, olddate) {
        return Math.floor((nowdate - olddate) / 86400000);
    }
}