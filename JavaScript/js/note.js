// 阻止事件冒泡
// event.cancelBubble = true;
// event.stopPropagation(); //  阻止事件向上传播
// event.preventDefault();  //  取消事件的默认动作。submit类型标签有效
// addEventListener中的第三个参 数是useCapture,一个bool类型。
// 当为false时为冒泡获取(由里向外)，true为capture方式(由外向里)
// 等价于jQuery的 $(document).ready()
// window.addEventListener('DOMContentLoaded', functionName) // mouseover, mouseout:hover()

// 永久储存
// localStorage.setItem("key","value"); 以“key”为名称存储一个值“value”
// localStorage.getItem("key"); 获取名称为“key”的值
// 周期储存（浏览器关闭之前）
// sessionStorage.setItem('','')
// sessionStorage.getItem('')

/** 列表容器 */
let wrap = utils.find('#wrap');
/** p标签 */
let label = utils.find('#wrap p');

label.addEventListener('click', () => {
    utils.toggleClass(wrap, 'tra');
    let now = utils.timeFormat();
    console.log(now);
});

// console.log('日期列表', utils.dayJson());

/** 点击测试 */
function clickTest() {
    /** 总数 */
    const total = 5;
    /** 菜单列表容器 */
    let list = utils.find('.menu');

    // // 1、传统写法 添加function完成闭包 用 let 定义的变量可以不用闭包 
    // for (var i = 0; i < total; i++) {
    //     var item = document.createElement('li');
    //     item.textContent = '测试li-' + i;
        
    //     (function (index) {
    //         item.addEventListener('click', function () {
    //             console.log('第' + index + '个li');
    //         });
    //     })(i);

    //     list.appendChild(item);
    // }

    // 2、使用事假代理 添加点击事件 (事件委托就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件)
    for (var i = 0; i < total; i++) {
        var item = document.createElement('li');
        item.textContent = '测试li-' + i;
        item.dataset.index = i;
        list.appendChild(item);
    }
    // 在最外层容器做事件添加
    list.addEventListener('click', function () {
        // console.log(this);
        console.log(`第 ${event.target.dataset.index} 个li`);
    });

    // 事件代理高级：
    // // 方法二、全局查找节点
    // var ul = utils.find('#app ul');
    // ul.addEventListener('click', function (e) {
    //     var target = e.target;
    //     while(target !== ul ){
    //        if(target.tagName.toLowerCase() == 'li'){
    //            // console.log(target.dataset.id);
    //            break;
    //        }
    //        target = target.parentNode;
    //     }
    // });

    // // 方法一、指定某个节点
    // ul.addEventListener('click', function (e) {
    // 	if (e.target.nodeName.toLowerCase() == 'h5') {
    // 		console.log(e.target.dataset.id);
    // 	}
    // });
}
clickTest();

/** new 构造函数理解 */
function newFun() {
    /** 构造函数 Animal */
    function Animal(name) {
        this.name = name;
    }
    // 静态属性
    Animal.color = 'black';
    // 构造函数定义的对象只有在 new 之后才能调用
    Animal.prototype.say = function () {
        console.log("I'm " + this.name);    // I'm cat
        console.log(this.color);            // undefined
    };
    var cat = new Animal('cat');
    console.log(
        cat.name, // cat
        cat.color // undefined
    );
    cat.say();

    console.log(
        Animal.name, // Animal
        Animal.color // back
    );
}
// newFun();


/** bind() 使用 */
function bindFun() {
    window.number = 9;
    /** Module 对象 */
    const Module = {
        number: 72,
        getNumber() {
            console.log(this.number);
        }
    }
    Module.getNumber(); // 72

    /** 将 Module 的方法赋值给 number */
    let number = Module.getNumber;
    number(); // 9 因为在这个例子中，"this"指向全局对象 window

    /** 将 Module 的方法赋值给 number 并且绑定自身 */
    let bound = Module.getNumber.bind(Module); // number.bind(Module); 这样也可以
    bound();
}
// bindFun();

/**
 * 工厂模式
 * 工厂模式下不需要 new 因为他本身就是创建一个新的对象
 * @param {string} name class | id | label <div> <p>
 */
function $(name) {
    /** 当前对象 */
    var obj = new Object();
    /** 元素类型 */
    var type = typeof name == 'string' ? 'array' : 'single';
    // 元素定义
    obj.el = typeof name == 'string' ? document.querySelectorAll(name) : name;
    // 遍历 
    obj.forEach = function (array, callback) {
        for (var i = 0; i < array.length; i++) {
            array[i].index = i;
            if (typeof callback === 'function') callback(array[i], i);
        }
    }
    // 添加事件
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
    // 修改内容
    obj.html = function (str) {
        if (type == 'array') {
            obj.forEach(obj.el, function (item, index) {
                item.innerHTML = str;
            });
        } else {
            obj.el.innerHTML = str;
        }
        return obj;
    }
    return obj;
}
// jQuery 的链式实现
// $('.menu li').html('工厂模式更改').on('click', function () {
//     console.log('索引', this.index);
//     $(this).html(`li-${this.index+1}`);
// });

/** 字符串类型 */
function stringModule() {
    let string = 'www.https/#/hjihsaih/#/sad.com';
    let code = 'CEde_128,1214534';
    let value = 456;
    // 将任意值转换成字符串
    String(value);
    // 关键字以外转字符串 toString(num) 可带参数转进制，限定 number.toString(num);
    value.toString();
    // 对字符串进行编码(数字和英文不变)
    encodeURIComponent();
    // 对应的解码     
    decodeURIComponent();
    // 过滤数字
    let filterNum = string.replace(/\d+/g, '');
    // 过滤英文
    let filterEnglish = string.replace(/[a-zA-Z]/g, '');
    /**
     * 检测字符串是否存在指定字符串
     * ES6 && ES5
     * array 同样适用
     */
    string.includes('name');    // return false true              
    string.search('name');      // return -1 or index
    // 正则替换：i是首个，g是全局 
    let regular = string.replace(/#/i, '?#');
    // 下面这种替换性能会更好点，但是不够灵活，只能是全局替换
    let replace = string.split('#').join('?#');
    // 截取从","之后的字符串
    let _code = code.slice(code.indexOf(',') + 1);

    /** 
     * ES5 
     * Objeco.keys(obj)
     * ES6
     * Objeco.values(obj);
     * Objeco.entries(obj);
    */
}

/** 数组类型 */
function arrayModule() {
    // 数组处理
    array.join('&');
    array.split(',');   // 把字符串分割成数组
    array.slice(index, num); // 索引截取数组 从 index 开始往往后截取 num 不填则 index 之后的都截取掉
    array.shift();      // 移除第一项 并返回第一项
    array.unshift();    // 在第一项添加
    array.pop();        // 移除最后一项 并返回最后一项
    array.push();       // 在第一项添加
    array.reverse();    // 反转数组
    Math.ceil(25.9);    // 向上取舍
    Math.round(25.9);   // 四舍五入
    Math.floor(25.9);   // 向下取舍
    // 1~100 随机一个数
    Math.floor(100 * Math.random()) + 1;
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
}

function disc() {
    /** 概率索引 */
    let index = 0;
    /** 抽奖概率范围 */
    let range = parseInt(100 * Math.random()) + 1;
    /** 概率列表 */
    let list = [1, 5, 54, 20, 10, 10];
    /** 单个概率 */
    let rate = 0;
    // console.log('随机数', range);
    for (let i = 0; i < list.length; i++) {
        const number = list[i];
        rate += number;
        if (range <= rate) {
            index = i;
            break;
        }
    }
    console.log('概率索引', index);
}