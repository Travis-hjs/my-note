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
 * window.addEventListener('DOMContentLoaded',functionName) // mouseover,mouseout:hover()
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
    console.log(_code.slice(_code.indexOf(',')+1));
    // 对象属性获取值
    console.log(Object.keys(_obj));
    console.log(String(Object.keys(_obj)));
}

function _click() {
    var objbox = $('#wrap'),
        objP = objbox.querySelector('p'),
        list = $(".menu");
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

// 判断语句
function judge() {
    let j = 0,
        jArr = [],
        num1 = 7,
        num2 = 8;
    //  三元表达式 ?
    var max = (num1 > num2) ? num1 : num2;
    console.log(max);
    // while 循环判断
    while (j <= 5) {
        jArr.push(j);
        j++;
    }
    console.log(jArr);
    // switch
    let day = new Date().getDay();
    switch (day) {
        case 1:
            x = "Today it's Monday";
            break;
        case 2:
            x = "Today it's Tuesday";
            break;
        case 3:
            x = "Today it's Wednesday";
            break;
        case 4:
            x = "Today it's Thursday";
            break;
        case 5:
            x = "Today it's Friday";
            break;
        default: // 如果不是以上情况，则会输出默认的消息：
            x = "Today it's Weenkend!";
    }
    console.log(x);
}
// judge();

// 日期生成
function dayJson() {
    var calendar = [];
    var minYears = new Date().getFullYear();
    var maxYears = new Date().getFullYear() + 10;
    var monthCount = 1;
    var dayCount = 1;
    for (var i = minYears; i <= maxYears; i++) {
        var _year = {}; // 这里的定义变量放在外面会导致变量key一直重复
        _year.name = i.toString();
        _year.sub = [];
        for (var j = monthCount; j <= 12; j++) {
            var _month = {};
            _month.name = j.toString();
            _month.sub = [];
            _year.sub.push(_month);
            dayCount = new Date(i, j, 0).getDate();
            for (var k = 1; k <= dayCount; k++) {
                _month.sub.push({
                    name: k.toString()
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
// console.log(dayJson());

/**
 * 时间生成器
 *  params: minInterval 时间（5分钟间隔）
*/
function timeInterval(minInterval) {
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
// console.log(timeInterval(5));

// 一般的做法
function timeStr() {
    var _date = new Date();
    var hour = _date.getHours() < 10 ? "0" + _date.getHours() : _date.getHours(),
        minute = _date.getMinutes() < 10 ? "0" + _date.getMinutes() : _date.getMinutes(),
        second = _date.getSeconds() < 10 ? "0" + _date.getSeconds() : _date.getSeconds();
    // 字符串拼接
    var dayArr = _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate(),
        timeArr = hour + ':' + minute + ':' + second;
    console.log(dayArr, timeArr);
}
// 我的做法
function timeFormat(_num = 0) {
    let _Appoint,_month,_day,_hour,_minute,_second,_date;
    // 指定天数 _num: 1时为昨天，2为前天，以此类推  增加天数则：new Date(new Date().getTime()+(_num*24*60*60*1000));
    _Appoint = new Date(new Date() - (_num * 24 * 60 * 60 * 1000));
    _month = ('0'+(_Appoint.getMonth()+1)).slice(-2);
    _day = ('0'+_Appoint.getDate()).slice(-2);
    _hour = ('0'+_Appoint.getHours()).slice(-2);
    _minute = ('0'+_Appoint.getMinutes()).slice(-2);
    _second = ('0'+_Appoint.getSeconds()).slice(-2);
    _date = `${ _Appoint.getFullYear() }-${ _month }-${ _day } ${ _hour }:${ _minute }:${ _second }`
    return _date;
}
// console.log(`日期：${ timeFormat(2) }`);

// new 理解
function newFunction() {
    function Animal(name) {
        this.name = name;
    }
    Animal.color = "black";
    Animal.prototype.say = function() { // prototype 向对象添加属性，此时 Animal.say() 不可用
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
function hasClass(e, c) {
    return e.className.match(new RegExp('(\\s|^)' + c + '(\\s|$)'));
}
function addClass(e, c) {
    if (!hasClass(e, c)) {
        var _c = e.className.charAt(e.className.length - 1) === ' ' ? c : ' ' + c;
        e.className += _c;
    }
}
function removeClass(e, c) {
    if (hasClass(e, c)) {
        var reg = new RegExp('(\\s|^)' + c + '(\\s|$)');
        e.className = e.className.replace(reg, ' ');
    }
}
function toggleClass(e, c) {
    if (hasClass(e, c)) {
        removeClass(e, c);
    } else {
        addClass(e, c);
    }
}
$('#wrap').querySelector('p').addEventListener('click', function() {
    toggleClass(objbox, 'tra');
    // this.classList.toggle('tra');
});

/*
    永久储存
    localStorage.setItem("key","value");//以“key”为名称存储一个值“value”
    localStorage.getItem("key");//获取名称为“key”的值
    周期储存（浏览器关闭之前）
    sessionStorage.setItem('','')
    sessionStorage.getItem('')
*/

/**
 * 数组处理
 * arr.join('&')
 * arr.split(',')
 * arr.shift(); 移除第一项
 * arr.pop();  移除最后一项
 * arr.unshift(); 在第一项添加
 * arr.reverse(); 反转数组
 * Math.ceil(25.9) 向上取舍
 * Math.round(25.9) 四舍五入
 * Math.floor(25.9) 向下取舍
*/
function contrast() {
    // 数组
    var arr = [23, 4, 4, 78, 3, 5, 1], values = [1, 2, 3, 4, 5];
    // arr.every() & arr.some() 历遍数
    var everyResult = arr.every(function(item, index, array) {
        return (item > 2);
    });
    var someResult = arr.some(function(item, index, array) {
        return (item > 2);
    });
    // arr.filter() 过滤一个数组
    var filterResult = arr.filter(function(item, index, array) {
        return (item > 2);
    });
    // arr.map() 在原有数组中运行传入函数
    var mapResult = arr.map(function(item, index, array) {
        return item * 2;
    });
    console.log(everyResult, someResult, filterResult, mapResult);
    // 数组累加 values.reduceRight() 反向执行
    var sum = values.reduce(function(prev, cur, index, array) {
        return prev + cur;
    });
    console.log(sum);
    // 小到大
    function sab(x, y) {
        if (x < y) {
            return -1;
        } else if (x > y) {
            return 1;
        } else {
            return 0;
        }
    }
    // 大到小
    function bas(x, y) {
        if (x > y) {
            return -1;
        } else if (x < y) {
            return 1;
        } else {
            return 0;
        }
    }
    console.log(arr.sort(bas));
    // 数组对象
    let arrObj = [{
        name: "zlw",
        age: '24'
    }, {
        name: "wlz",
        age: '50'
    }, {
        name: "hjs",
        age: '15'
    }];
    let compare = function(prop) {
        return function(obj1, obj2) {
            let val1 = obj1[prop];
            let val2 = obj2[prop];
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
            }
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    console.log(arrObj.sort(compare("age")));
    var num = 99;
    console.log(num.toFixed(2), num.toPrecision(3));
    // 思考
    // function createFunctions(){
    //   var result = new Array();
    //   for (var i = 0; i < 10; i++){
    //     result[i] = function(){
    //       return i;
    //     };
    //   }
    //   return result;
    // }
    function createFunctions() {
        var result = new Array();
        for (var i = 0; i < 10; i++) {
            result[i] = function(num) {
                return function() {
                    return num;
                };
            }(i);
        }
        return result;
    }
    console.log(createFunctions());
}
// contrast();

// bind()
this.num = 9;
var mymodule = {
    num: 81,
    getNum () {
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
 *工厂模式
 *工厂模式下不需要 new 因为他本身就是创建一个新的对象
 */
function createPerson(name,age,say){
    var obj = new Object();
    obj.name = name;
    obj.age = age;
    obj.say = say;
    obj.should = function(){
        alert(this.say);
    }
    return obj;
}

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
function myalert(params) {
    alert(this.url);
}
// new Person('hjs','www.com').alertUrl() // 调用
