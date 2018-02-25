var $ = el => document.querySelector(el);
var $$ = el => document.querySelectorAll(el);
// $("#wrap").style.background = '#ccc';
// var objbox = document.getElementById('wrap');
/*
阻止事件冒泡
event.cancelBubble = true;
addEventListener中的第三个参 数是useCapture,一个bool类型。
当为false时为冒泡获取(由里向外)，true为capture方式(由外向里)
等价于jQuery的 $(document).ready()
addEventListener('DOMContentLoaded',functionName) // mouseover,mouseout:hover()
*/
// 字符串替换
var _str = 'www.https/#/hjihsaih/#/sad.com';
// 正则替换：i是首个，g是全局
console.log(_str.replace(/#/i, '?#'));
// 下面这种替换性能会更好点，但是不够灵活，只能是全局替换
console.log(_str.split('#').join('?#'));
var _obj = {
    name: 'hjs',
    tall: '178cm',
    weight: '128kg'
}
console.log(Object.keys(_obj));
console.log(String(Object.keys(_obj)));

// var _code = 'CEde_128,1214534';
// console.log(_code.slice(_code.indexOf(',')+1));

var objbox = $('#wrap'), objP = objbox.querySelector('p'), list = $(".menu");
for (var i = 1; i <= 5; i++) {
  var item = document.createElement("LI");
  item.dataset.index = i;
  item.appendChild(document.createTextNode("测试li " + i));
  list.appendChild(item);
  // 不用let的传统写法，添加function完成闭包
  // (function (j) {
  //   // var j = i;
  //   item.addEventListener('click',() => {
  //     console.log("第" + j + "个li");
  //   });
  // })(i)
}
// 使用事假代理 (事件委托就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件)
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

// 正则表达式
function regular() {
  var phoneNum = '13265317656';
  var standard = /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/;
  // var aa = standard.exec(5).index
  if (standard.test(phoneNum)) {
    console.log('正确的手机号码');
  }else{
    console.log('错误的手机号码');
  }
}
// regular();

// 循环语句
var loopStatement = () => {
  let loopArr = new Array(); //  等价于 loopArr = []
  let testArr = [
    {
      id: '今天',
      value: '青瓜瘦肉',
      childs: [{ state: false },{ state: true }]
    },
    {
      id: '明天',
      value: '肉末豆腐',
      childs: [{ state: false },{ state: true }]
    },
    {
      id: '明天',
      value: '尖椒牛肉',
      childs: [{ state: false },{ state: true }]
    },
    {
      id: '昨天',
      value: '剁椒鱼头',
      childs: [{ state: false },{ state: true }]
    }
  ];
  let nameArr = ["字符串一","字符串二","字符串三","字符串四","字符串五","字符串六"];
  let valueArr = {
    one_key: {
      text: 'asdsad'
    },
    two_key: {
      text: 'ggxdfdxf'
    },
    three_key: {
      text: 'qweretw'
    }
  };
  // for in (循环数组和对象！)
  for (let key in valueArr) {
    console.log(key, valueArr[key].text);
  }
  // forEach (循环数组)
  testArr.forEach((str, index, arr) => {
    console.log(str.childs, index);
    str.childs.forEach((child, index) => {
      console.log(child.state,index );
    })
    loopArr.push(index + ':' + str.value);
  });
  console.log(loopArr);
}
// loopStatement();

// 判断语句
function judge() {
  let j = 0, jArr = [], num1 = 7, num2 = 8;
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
    default:       // 如果不是以上情况，则会输出默认的消息：
    x = "Today it's Weenkend!";
  }
  console.log(x);
}
// judge();
// 日期生成
function dayJson () {
    var calendar = [];
    var minYears = new Date().getFullYear();
    var maxYears = new Date().getFullYear()+10;
    var monthCount = 1;
    var dayCount = 1;
    for (var i = minYears; i <= maxYears; i++) {
        var yearObj = {};    // 这里的定义变量放在外面会导致变量key一直重复
        yearObj.name = i.toString();
        yearObj.sub = [];
        for (var j = monthCount; j <= 12; j++) {
            var monthObj = {};
            monthObj.name = j.toString();
            monthObj.sub = [];
            yearObj.sub.push(monthObj);
            dayCount = new Date(i, j, 0).getDate();
            for (var k = 1; k <= dayCount; k++) {
                var dayObj = {};
                dayObj.name = k.toString();
                monthObj.sub.push(dayObj)
            }
        }
        calendar.push(yearObj)
    }
    // 这里是限制不能选小于之前的日期
    calendar[0].sub.splice(0,new Date().getMonth());
    calendar[0].sub[0].sub.splice(0,new Date().getDate());
    return calendar
}
// 时间生成器
function timeInterval(minInterval) {   // minInterval 时间（5分钟间隔）
  let arr = [];
  let minTotal = 0;
  while (minTotal < 1440) {      // while 循环，如果（）内值为 true 时会一直循环执行
    let hour = parseInt(minTotal / 60);
    let min = parseInt(minTotal % 60);
    hour = hour < 10 ? `0${hour}` : hour;
    min = min < 10 ? `0${min}` : min;
    arr.push(`${hour}:${min}`);
    minTotal += minInterval;
  }
  return arr;
}
// console.log(timeInterval(120));
function timeStr() {
    var _date = new Date();
    var hour = _date.getHours() < 10 ? "0" + _date.getHours() : _date.getHours();
    var minute = _date.getMinutes() < 10 ? "0" + _date.getMinutes() : _date.getMinutes();
    var second = _date.getSeconds() < 10 ? "0" + _date.getSeconds() : _date.getSeconds();
  //   字符串拼接
    var dayArr = _date.getFullYear() + '-' + (_date.getMonth()+1) + '-' + _date.getDate();
    var timeArr = hour + ':' + minute + ':' + second;
    console.log(dayArr, timeArr);
}


// new 理解
function newFunction() {
  function Animal(name){
    this.name = name;
  }
  Animal.color = "black";
  Animal.prototype.say = function(){  // prototype 向对象添加属性，此时 Animal.say() 不可用
    console.log("I'm " + this.name);
  };
  var cat = new Animal("cat");
  console.log(
  cat.name,       // cat
  cat.color       // undefined
  );
  cat.say();        // I'm cat

  console.log(
  Animal.name,    // Animal
  Animal.color    // back
  );
  Animal.say();     // Animal.say is not a function
  //上面的意思是：把 Animal 的作用赋值给了 cat ，
}
// newFunction();

// 对象
function objFunction(){
  // 1
  var Boy = {
    name:'Hansen',
    color:'lightgreen'
  };
  // 2
  var Boy = (name,color) => {
    return {
      name:name,
      color:color
    }
  }
  var cat = Boy('小米','黄色');
  var dog = Boy('华为','蓝色')
  console.log(cat,dog);
  // 3
  function Boy(name,color) {  // 这里不能用箭头函数
    this.name = name;
    this.color = color;
  }
  // var cat = new Boy('小米','黄色');
  // var dog = new Boy('华为','蓝色');
  // console.log(cat.name,dog);
}
// objFunction();

// class事件
function classFunction(){
  function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  }
  function addClass(obj, cls) {
    if (!hasClass(obj, cls)) {
      obj.className += ' '+cls;
    }
  }
  function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      obj.className = obj.className.replace(reg, '');
    }
  }
  function toggleClass(obj,cls){
    if(hasClass(obj,cls)){
      removeClass(obj, cls);
    } else {
      addClass(obj, cls);
    }
  }
  // IE10+
  // el.classList.contains(className);
  // el.classList.add(className);
  // el.classList.remove(className);
  // el.classList.toggle(className);
  objP.addEventListener('click',function(){
    toggleClass(objbox,'tra');
    // this.classList.toggle('tra');
  });
}
classFunction();

/*
永久储存
localStorage.setItem("key","value");//以“key”为名称存储一个值“value”
localStorage.getItem("key");//获取名称为“key”的值
周期储存（浏览器关闭之前）
sessionStorage.setItem('','')
sessionStorage.getItem('')
*/


// 数组处理
function contrast() {
  // 数组
  var arr = [23, 4, 4, 78, 3, 5, 1];
  /*
  arr.join('&')
  arr.split(',')
  arr.shift(); 移除第一项
  arr.unshift(); 在第一项添加
  arr.reverse(); 反转数组
  Math.ceil(25.9) 向上取舍
  Math.round(25.9) 四舍五入有
  Math.floor(25.9) 向下取舍
  */
  // arr.every() & arr.some() 历遍数
  var everyResult = arr.every(function(item, index, array){
    return (item > 2);
  });
  var someResult = arr.some(function(item, index, array){
    return (item > 2);
  });
  // arr.filter() 过滤一个数组
  var filterResult = arr.filter(function(item, index, array){
    return (item > 2);
  });
  // arr.map() 在原有数组中运行传入函数
  var mapResult = arr.map(function(item, index, array){
    return item * 2;
  });
  console.log(everyResult, someResult, filterResult, mapResult);
  var values = [1,2,3,4,5];
  // 数组累加 values.reduceRight() 反向执行
  var sum = values.reduce(function(prev, cur, index, array){
    return prev + cur;
  });
  console.log(sum);
  // 小到大
  function sab(x, y){
    if (x < y) {
      return -1;
    } else if (x > y) {
      return 1;
    } else {
      return 0;
    }
  }
  // 大到小
  function bas(x, y){
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
  let arrObj = [{name: "zlw", age: '24'}, {name: "wlz", age: '50'},{name: "hjs", age: '15'}];
  let compare = function (prop) {
    return function (obj1, obj2) {
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
  console.log(num.toFixed(2),num.toPrecision(3));
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
  function createFunctions(){
    var result = new Array();
    for (var i = 0; i < 10; i++){
      result[i] = function(num){
        return function(){
          return num;
        };
      }(i);
    }
    return result;
  }
  console.log(createFunctions());
    // 数组拼接
    // ES5的 写法
    // var arr1 = [0, 1, 2];
    // var arr2 = [3, 4, 5];
    // Array.prototype.push.apply(arr1, arr2);
    // 或者(好像不生效)
    // arr1.concat(arr2);
    // console.log(arr1);

    // ES6 的写法
    let arr1 = [0, 1, 2];
    let arr2 = [3, 4, 5];
    arr1.push(...arr2);
    console.log(arr1);
    // 或者
    console.log([...arr1,...arr2]);
}
// contrast();
