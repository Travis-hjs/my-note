/**
 * ES5 传统
 * 原型链 模式
*/
var Msg = function () { };
Msg.prototype = {
    createNode: function () {
        var el = document.createElement('div');
        el.className = 'prompts';
        return el;
    },
    output: function (el, num, _html, callback) {
        el.appendChild(_html);
        document.body.appendChild(el);
        el.style.backgroundColor = 'rgba(0,0,0,' + num + ')';
        setTimeout(function () {
            el.style.opacity = 1;
            if (typeof callback === 'function') callback.call(this);
        }, 20);
    },
    removeThis: function (el) {
        el.style.opacity = 0;
        setTimeout(function () {
            el.parentNode.removeChild(el);
        }, 241);
    },
    remove: function () {
        var layer = document.getElementsByClassName('prompts');
        if (!layer.length) return;
        for (var i = 0; i < layer.length; i++) this.removeThis(layer[i]);
    },
    alertMsg: function (text, callback, title) {
        var layer = this.createNode(),
            _module = document.createElement('div'),
            button = document.createElement('div'),
            that = this;
        text = text || '内容';
        title = title || '提示';
        _module.className = 'prompt';
        button.className = 'callback_btn';
        button.textContent = '确认';
        _module.innerHTML = '<h2>' + title + '</h2><div class="text_box"><p>' + text + '</p></div>';
        _module.appendChild(button);
        that.output(layer, 0.4, _module, function () {
            _module.classList.add('scale_in');
            button.addEventListener('click', function () {
                if (typeof callback === 'function') callback.call(that);
                _module.classList.add('scale_out');
                that.removeThis(layer);
            });
        });
    },
    confirmMsg: function (text, success, title, cancel) {
        var layer = this.createNode(),
            _module = document.createElement('div'),
            button_left = document.createElement('div'),
            button_right = document.createElement('div'),
            that = this;
        text = text || '内容';
        title = title || '提示';
        _module.className = 'confirm';
        button_left.className = 'callback_btn';
        button_left.textContent = '取消';
        button_right.className = 'callback_btn callback_right';
        button_right.textContent = '确认';
        _module.innerHTML = '<h2>' + title + '</h2><div class="text_box"><p>' + text + '</p></div>';
        _module.appendChild(button_left);
        _module.appendChild(button_right);
        that.output(layer, 0.4, _module, function () {
            _module.classList.add('scale_in');
            button_right.addEventListener('click', function () {
                if (typeof success === 'function') success.call(that);
                _module.classList.add('scale_out');
                that.removeThis(layer);
            });
            button_left.addEventListener('click', function () {
                if (typeof cancel === 'function') cancel.call(that);
                _module.classList.add('scale_out');
                that.removeThis(layer);
            });
        });
    },
    loadBall: function () {
        var layer = this.createNode(), _module = document.createElement('div');
        _module.className = 'loding_ball';
        _module.innerHTML = '<div></div><div></div><div></div>';
        this.output(layer, 0.4, _module);
    },
    loading: function (text) {
        var layer = this.createNode(), _module = document.createElement('div');
        text = text || 'loading';
        _module.className = 'loading_box';
        _module.innerHTML = '<div></div><p>' + text + '</p>';
        this.output(layer, 0, _module);
    },
    toast: function (text, time, callback) {
        var _module = document.createElement('div'), that = this;
        text = text || 'toast';
        time = time || 1500;
        _module.className = 'itoast';
        _module.textContent = text;
        document.body.appendChild(_module);
        setTimeout(function () {
            _module.style.opacity = 0;
            setTimeout(function () {
                _module.parentNode.removeChild(_module);
                if (typeof callback === 'function') callback.call(that);
            }, 200);
        }, time);
    }
};

var _Msg = new Msg();
function testBtn() {
    _Msg.loading();
    setTimeout(function () {
        _Msg.remove();
        _Msg.alertMsg('这是一个原型链提示框~', function () {
            _Msg.confirmMsg('还要继续吗？', function () {
                _Msg.toast('接下来是一个加载球的动画，然后就没有了', 1000, function () {
                    _Msg.loadBall();
                    setTimeout(function () {
                        _Msg.remove();
                    }, 1500);
                });
            }, '确认提示', function () {
                console.log('你取消了~');
            });
        }, 'hello');
    }, 3000);
}


/** 消息交互组件 */
class Dialogs {
    constructor() {}
    /** 创建整体 */
    createNode() {
        let el = document.createElement('div');
        el.className = 'prompts';
        return el;
    }

    /**
     * 
     * @param {Element} el 
     * @param {number} num 透明度
     * @param {Element} childNode 插入节点 
     * @param {Function} callback 回调
     */
    output(el, num, childNode, callback) {
        el.appendChild(childNode);
        document.body.appendChild(el);
        el.style.backgroundColor = 'rgba(0,0,0,' + num + ')';
        setTimeout(() => {
            el.style.opacity = 1;
            if (typeof callback === 'function') callback.call(this);
        }, 20);
    }

    /**
     * 清除节点
     * @param {Element} el 清除的节点
     */
    removeThis(el) {
        el.style.opacity = 0;
        setTimeout(() => el.parentNode.removeChild(el), 241);
    }

    /** 清除当前组件节点 */
    remove() {
        let layer = document.getElementsByClassName('prompts');
        if (!layer.length) return;
        for (let i = 0; i < layer.length; i++) this.removeThis(layer[i]);
    }

    /**
     * 确认提示框
     * @param {string} text 提示内容
     * @param {Function} callback 确认回调
     * @param {string} title 提示标题
     */
    alertMsg(text = '内容', callback, title = '提示') {
        let layer = this.createNode(), box = document.createElement('div'), button = document.createElement('div');
        [box.className, button.className, button.textContent] = ['prompt', 'callback_btn', '确认'];
        box.innerHTML = '<h2>' + title + '</h2><div class="text_box"><p>' + text + '</p></div>';
        box.appendChild(button);
        this.output(layer, .4, box, () => {
            box.classList.add('scale_in');
            button.addEventListener('click', () => {
                if (typeof callback === 'function') callback.call(this);
                box.classList.add('scale_out');
                this.removeThis(layer);
            });
        });
    }

    /**
     * 确认取消提示框
     * @param {string} text 提示内容
     * @param {Function} success 确认回调
     * @param {string} title 提示标题
     * @param {Function} cancel 取消回调
     */
    confirmMsg(text = '内容', success, title = '提示', cancel) {
        let layer = this.createNode(), box = document.createElement('div'), btn_left = document.createElement('div'), btn_right = document.createElement('div');
        [box.className, btn_left.className, btn_left.textContent, btn_right.className, btn_right.textContent] = ['confirm', 'callback_btn', '取消', 'callback_btn callback_right', '确认'];
        box.innerHTML = '<h2>' + title + '</h2><div class="text_box"><p>' + text + '</p></div>';
        box.appendChild(btn_left);
        box.appendChild(btn_right);
        this.output(layer, .4, box, () => {
            box.classList.add('scale_in');
            btn_right.addEventListener('click', () => {
                if (typeof success === 'function') success.call(this);
                box.classList.add('scale_out');
                this.removeThis(layer);
            });
            btn_left.addEventListener('click', () => {
                if (typeof cancel === 'function') cancel.call(this);
                box.classList.add('scale_out');
                this.removeThis(layer);
            });
        });
    }

    /** 显示加载动画球 */
    loadBall() {
        let layer = this.createNode(), box = document.createElement('div');
        box.className = 'loding_ball';
        box.innerHTML = '<div></div><div></div><div></div>';
        this.output(layer, .4, box);
    }

    /**
     * 显示加载中
     * @param {string} text 加载内容
     */
    loading(text = 'loading') {
        let layer = this.createNode(), box = document.createElement('div');
        box.className = 'loading_box';
        box.innerHTML = '<div></div><p>' + text + '</p>';
        this.output(layer, 0, box);
    }

    /**
     * 显示 toast 提示
     * @param {string} text 提示内容
     * @param {number} time 提示时间 (毫秒)
     * @param {Function} callback 结束回调
     */
    toast(text = 'toast', time = 1500, callback) {
        let box = document.createElement('div');
        box.className = 'itoast';
        box.textContent = text;
        document.body.appendChild(box);
        setTimeout(() => {
            box.style.opacity = 0;
            setTimeout(() => {
                box.parentNode.removeChild(box);
                if (typeof callback === 'function') callback.call(this);
            }, 200);
        }, time);
    }
}
let _Dialogs = new Dialogs();
function classBtn() {
    _Dialogs.loading();
    setTimeout(() => {
        _Dialogs.remove();
        _Dialogs.alertMsg('这是一个类提示框~', function () {
            _Dialogs.confirmMsg('还要继续吗？', function () {
                _Dialogs.toast('接下来是一个加载球的动画，然后就没有了', 2000, function () {
                    _Dialogs.loadBall();
                    setTimeout(() => _Dialogs.remove(), 2000);
                });
            }, '确认提示', function () {
                console.log('你取消了~');
            });
        }, 'hello');
    }, 3000);
}

/** 对话框 */
class Dialog {
    constructor() {
        this.init();
    }

    /** 初始化 */
    init() {
        /** 整体容器 */
        this.box = document.createElement('div');
        this.box.className = 'prompts';
    }

}

/**
 * 普通函数模式
 * @param {*} params
 * params.type: 'alert', 'confirm', 'ball', 'load', 'toast', 'remove',
 * params.time 适用类型：toast
 * params.title 适用类型：alert，confirm
 * params.text 适用类型：alert，confirm，toast
 * @param {*} success 确认回调 适用类型：alert，confirm，toast
 * @param {*} cancel 取消按钮回调 适用类型：confirm
 */
function prompts(params, success, cancel) {
    let method = params.type || null;
    let title = params.title || '提示';
    let content = params.text || '内容';
    let time = Number(params.time) || 1500;
    // 输出html
    let layer = document.createElement('div');
    function output(num, _html, callback) {
        layer.className = 'prompts';
        layer.appendChild(_html);
        document.body.appendChild(layer);
        layer.style.backgroundColor = 'rgba(0,0,0,' + num + ')';
        setTimeout(() => {
            layer.style.opacity = 1;
            if (typeof callback === 'function') callback();
        }, 20);
    }
    // 清除当前DOM
    function removeThis() {
        layer.style.opacity = 0;
        setTimeout(() => layer.parentNode.removeChild(layer), 241);
    }
    // 确认框
    function alertMsg() {
        let _module = document.createElement('div'), button = document.createElement('div');
        [_module.className, button.className, button.textContent] = ['prompt', 'callback_btn', '确认'];
        _module.innerHTML = '<h2>' + title + '</h2><div class="text_box"><p>' + content + '</p></div>';
        _module.appendChild(button);
        output(.4, _module, () => {
            _module.classList.add('scale_in');
            button.addEventListener('click', () => {
                if (typeof success === 'function') success.call(this);
                _module.classList.add('scale_out');
                removeThis();
            });
        });
    }
    // 操作确认框
    function confirmMsg() {
        let _module = document.createElement('div'), button_left = document.createElement('div'), button_right = document.createElement('div');
        [_module.className, button_left.className, button_left.textContent, button_right.className, button_right.textContent] = ['confirm', 'callback_btn', '取消', 'callback_btn callback_right', '确认'];
        _module.innerHTML = '<h2>' + title + '</h2><div class="text_box"><p>' + content + '</p></div>';
        _module.appendChild(button_left);
        _module.appendChild(button_right);
        output(.4, _module, () => {
            _module.classList.add('scale_in');
            button_right.addEventListener('click', () => {
                if (typeof success === 'function') success.call(this);
                _module.classList.add('scale_out');
                removeThis();
            });
            button_left.addEventListener('click', () => {
                if (typeof cancel === 'function') cancel.call(this);
                _module.classList.add('scale_out');
                removeThis();
            });
        });
    }
    //	加载球
    function loadingBall() {
        let _module = document.createElement('div');
        _module.className = 'loding_ball';
        _module.innerHTML = '<div></div><div></div><div></div>';
        output(.4, _module);
    }
    //	加载中
    function loading() {
        let _module = document.createElement('div');
        _module.className = 'loading_box';
        _module.innerHTML = '<div></div><p>' + content + '</p>';
        output(0, _module);
    }
    // toast
    function toast() {
        let _module = document.createElement('div');
        _module.className = 'itoast';
        _module.textContent = content;
        document.body.appendChild(_module);
        setTimeout(() => {
            _module.style.opacity = 0;
            setTimeout(() => {
                document.body.removeChild(_module);
                if (typeof success === 'function') success.call(this);
            }, 200);
        }, time);
    }
    // 判断执行哪个方法
    switch (method) {
        case 'alert':
            alertMsg();
            break;
        case 'confirm':
            confirmMsg();
            break;
        case 'ball':
            loadingBall();
            break;
        case 'load':
            loading();
            break;
        case 'toast':
            toast();
            break;
        case 'remove':
            let _prompts = document.getElementsByClassName('prompts');
            for (let i = 0; i < _prompts.length; i++) {
                _prompts[i].style.opacity = 0;
                setTimeout(() => {
                    document.body.removeChild(_prompts[i]);
                }, 241);
            }
            break;
        default:
            console.warn('没有可执行的type对象');
    }
}
function myAlert() {
    prompts({
        type: 'alert',
        title: 'title',
        text: '确认框文字描述'
    }, function () {
        console.log('确认');
        // myAlert()
    })
}
function myComfirm() {
    prompts({
        type: 'confirm',
        text: '操作确认框文字描述'
    }, function () {
        console.log('确认');
        // myAlert()
    }, function () {
        console.log('取消');
    })
}
function myBall() {
    prompts({ type: 'ball' });
    setTimeout(() => prompts({ type: 'remove' }), 3000);
}
function myLoad() {
    prompts({ type: 'load', text: '加载中...' });
    setTimeout(() => prompts({ type: 'remove' }), 3000);
}
function myToast() {
    prompts({ type: 'toast', text: '这里是底部弹出文字', time: 2500 });
}
