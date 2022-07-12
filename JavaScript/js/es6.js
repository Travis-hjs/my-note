let $ = el => document.querySelector(el);

function variable() {
  var functions = [];
  // ES5
  // for (var i = 0; i < 10; i++) {
  //     functions.push((function(value) {
  //         return function() {
  //             console.log(value)
  //         }
  //     }(i)));
  // }
  // ES6
  for (let i = 0; i < 10; i++) {
    functions.push(function () {
      console.log(i)
    });
  }
  functions.forEach(function (fun) {
    fun();
  });
}
// variable();

function stringExtend() {
  let str = 'my name is Huang jing sheng~';
  /**
   * includes()：返回布尔值，表示是否找到了参数字符串。
   * startsWith()：返回布尔值，表示参数字符串是否在源字符串的头部。
   * endsWith()：返回布尔值，表示参数字符串是否在源字符串的尾部。
   * repeat() 获取字符串重复n次
   * 如果是小数, Math.floor(num) 来处理
  */
  console.log(str.includes('y'));
  console.log(str.repeat(3));
}
// stringExtend();

//  ES5
// function action(num) {
//     num = num || 200;
//     console.log(num)
// }
//  ES6
function action(num = 200) {
  console.log(num)
}
// action();
// action(300);

//  拓展的对象功能
// function people(name, age) {
//     return {
//         name: name,
//         age: age
//     };
// }
//  键值对重名，ES6可以简写如下：
function people(name, age) {
  return {
    name,
    age
  };
}

// 对象浅复制
const objA = { name: 'hjs' }
const objB = { age: 18 }
const obj = Object.assign({}, objA, objB);
// console.log(obj); // {name: "hjs", age: 18}

//  解构赋值
const personal = {
  name: '黄景圣',
  age: 18,
  info: ['hjs', '178cm', '64kg']
}
// ES5
// var name = personal.name
// var age = personal.age
// ES6e
let { name, age } = personal;
let [Egname, tall, weight] = personal.info;
// console.log(name, age, Egname, tall, weight);

// 数组拼接 展开运算符
const arr1 = [0, 1, 2];
const arr2 = [3, 4, 5];
// ES5的 写法
// var _newArr = Array.prototype.push.apply(arr1, arr2);
// console.log(arr1.concat(arr2), _newArr);
// ES6 的写法
arr1.push(...arr2);
// console.log(arr1);
// 或者
// console.log([...arr1,...arr2]);

function promiseFn() {
  // 同步的方式去写异步代码
  new Promise(function (resolve) {
    console.log(2);
    // 这里的意思是，如果不执行 resolve 该函数时，下面所有的then()里面的函数都不会执行
    setTimeout(() => resolve(), 1000);
    console.log(3);
  }).then(function () {
    // setTimeout(() => variable(), 1000);
    console.log(4);
  }).then(function () {
    console.log(6);
  }).then(function () {
    console.log('最后一个');
  });
  function timeout(_time) {
    return new Promise(function (resolve, reject) {
      // 这里 resolve & reject 只会有其中一个执行
      setTimeout(resolve, _time);
      setTimeout(reject, 2000);
    })
  }
  timeout(3000).then(() => {
    console.log('Promise then');
  }).catch(() => {
    console.log('Promise catch');
  })
}
// promiseFn();

// 生成器
function* createIterator() {
  yield 'one';
  yield 'two';
  yield 'three';
}
// 生成器能像正规函数那样被调用，但会返回一个迭代器
let iterator = createIterator();
// console.log(iterator.next().value, iterator.next().value); // one, two
// console.log(iterator.next().value);  // three
//taskDef即一个生成器函数
function run(taskDef) {
  // 创建迭代器，让它在别处可用
  let task = taskDef();
  // 启动任务
  let result = task.next();
  // 递归使用函数来保持对 next() 的调用
  function step() {
    // 如果还有更多要做的
    console.log(result);
    if (!result.done) {
      result = task.next();
      step();
    }
  }
  // 开始处理过程
  step();
}
// run(createIterator)


//  set 和 for..of
function set_of() {
  const setArr = new Set();
  [2, 3, 5, 4, 5, 2, 2].forEach(x => setArr.add(x));
  console.log('set:', typeof (setArr), setArr, Array.from(setArr), [...setArr]);

  for (let key of setArr.keys()) {
    console.log(key);
  }

  const typeArr = ['type-1', 'type-2', { type: 'type-3' }];
  for (let index in typeArr) {
    console.log(index, 'key', typeArr[index]);
  }

  let _obj = new Proxy({}, {
    get: function (target, key, receiver) {
      console.log(`getting ${key}!`);
      return Reflect.get(target, key, receiver);
    },
    set: function (target, key, value, receiver) {
      console.log(`setting ${key}!`);
      return Reflect.set(target, key, value, receiver);
    }
  });
}
// set_of()

/** 类 */
function classModule() {
  /** 构造函数: 动物 */
  function Animal() {

  }

  Animal.prototype = {
    /** 动物列表 */
    animals: function () {
      return ['长颈鹿', '袋鼠', '斑马'];
    }
  }

  /** 类: 植物 */
  class Plant extends Animal {
    /** 植物列表 */
    plants() {
      return ['玫瑰', '山茶花', '血色红阳'];
    }
  }

  /** 类 Price */
  class Price extends Plant {
    /** 金币 */
    money = 0;

    /** 打印类名 */
    static logName() {
      return 'name: Price'
    }

    // 这里的 get 和 set 必须要以一个值作为返回和修改 => money
    /** 金钱 */
    get gold() {
      return this.money;
    }

    set gold(value) {
      this.money = value;
    }
  }

  /** 整合所有 */
  class MergeModule extends Price {
    constructor() {
      // 注意这里的构造函数定义会覆盖 继承 Price 的 constructor();
      // 所以要执行继承者的 constructor();
      super();
      // 静态方法是在构造后无法使用的，所以这里是 undefined
      console.log(super.logName);
    }
    /** 基础值 */
    base = 10;
    /** 倍数 */
    value = 5;
    /** 分数 */
    score = 0;
    /** 计算结果 */
    result() {
      function compute() {
        this.score = (this.base + this.value) * 2;
      }
      // 先绑定再执行
      compute.bind(this)();
      return this.score;
    }
  }

  /** 实例化整合的模块 */
  let cc = new MergeModule();

  console.log(cc.animals(), cc.plants(), cc.result());

  console.log('静态方法：', MergeModule.logName());
}
// classModule();

function watch() {
  const Android = {
    version: 9.0,
    styem: 'MIUI',
    list: [1, 2, 3, 4]
  }

  // Proxy 可以监听任意类型值，不支持 IE
  const info = new Proxy(Android, {
    get(target, key, receiver) {
      // console.log('get', target, key, receiver);
      return target[key];
    },
    set(target, key, value, receiver) {
      console.log('set', target, key, value, receiver);
      target[key] = value;
    }
  });

  // Object.defineProperty 无法监听数组
  const watchList = Object.defineProperty(Android, 'list', {
    set(val) {
      console.log('watchList', val);

    }
  });
}
