let _stop = 0;
/**
 * 原型链 模式
*/
let Msg = function () { };
Msg.prototype = {
    createNode() {
        let _box = document.createElement('div');
        _box.className = 'prompts';
        return _box;
    },
    output(_box, _num, _html, fun) {
        _box.appendChild(_html);
        document.body.appendChild(_box);
        _box.style.backgroundColor = 'rgba(0,0,0,' + _num + ')';
        setTimeout(() => {
            _box.style.opacity = 1;
            if (typeof fun === 'function') fun.call(this);
        }, 20);
    },
    removeThis(_box) {
        _box.style.opacity = 0;
        setTimeout(() => document.body.removeChild(_box), 241);
    },
    remove() {
        let _prompts = document.getElementsByClassName('prompts');
        if (!_prompts.length) return;
        for (let i = 0; i < _prompts.length; i++) this.removeThis(_prompts[i]);
    },
    alertMsg(_text = '内容', fn, _title = '提示') {
        let _div = this.createNode(), _module = document.createElement('div'), _btn = document.createElement('div');
        [_module.className, _btn.className, _btn.textContent] = ['prompt', 'callback_btn', '确认'];
        _module.innerHTML = '<h2>' + _title + '</h2><div class="text_box"><p>' + _text + '</p></div>';
        _module.appendChild(_btn);
        this.output(_div, .4, _module, () => {
            _module.classList.add('scale_in');
            _btn.addEventListener('click', () => {
                if (typeof fn === 'function') fn.call(this);
                _module.classList.add('scale_out');
                this.removeThis(_div);
            });
        });
    },
    confirmMsg(_text = '内容', Afn, _title = '提示', Bfn) {
        let _div = this.createNode(), _module = document.createElement('div'), _Lbtn = document.createElement('div'), _Rbtn = document.createElement('div');
        [_module.className, _Lbtn.className, _Lbtn.textContent, _Rbtn.className, _Rbtn.textContent] = ['confirm', 'callback_btn', '取消', 'callback_btn callback_right', '确认'];
        _module.innerHTML = '<h2>' + _title + '</h2><div class="text_box"><p>' + _text + '</p></div>';
        _module.appendChild(_Lbtn);
        _module.appendChild(_Rbtn);
        this.output(_div, .4, _module, () => {
            _module.classList.add('scale_in');
            _Rbtn.addEventListener('click', () => {
                if (typeof Afn === 'function') Afn.call(this);
                _module.classList.add('scale_out');
                this.removeThis(_div);
            });
            _Lbtn.addEventListener('click', () => {
                if (typeof Bfn === 'function') Bfn.call(this);
                _module.classList.add('scale_out');
                this.removeThis(_div);
            });
        });
    },
    loadBall() {
        let _div = this.createNode(), _module = document.createElement('div');
        _module.className = 'loding_ball';
        _module.innerHTML = '<div></div><div></div><div></div>';
        this.output(_div, .4, _module);
    },
    loading(_text = 'loading') {
        let _div = this.createNode(), _module = document.createElement('div');
        _module.className = 'loading_box';
        _module.innerHTML = '<div></div><p>' + _text + '</p>';
        this.output(_div, 0, _module);
    },
    toast(_text = 'toast', _time = 1500, fn) {
        let _module = document.createElement('div');
        _module.className = 'itoast';
        _module.textContent = _text;
        document.body.appendChild(_module);
        setTimeout(() => {
            _module.style.opacity = 0;
            setTimeout(() => {
                document.body.removeChild(_module);
                if (typeof fn === 'function') fn.call(this);
            }, 200);
        }, _time);
    }
}
let _Msg = new Msg();
function testBtn() {
    if (_stop >= 2) return;
    _Msg.loading();
    setTimeout(() => {
        _Msg.remove();
        _Msg.alertMsg('这是一个原型链提示框~', function () {
            _Msg.confirmMsg('还要继续吗？', function () {
                _Msg.toast('接下来是一个加载球的动画，然后就没有了', 1000, function () {
                    _Msg.loadBall();
                    setTimeout(() => { _Msg.remove() }, 1500)
                });
            }, '确认提示', function () {
                console.log('你取消了~');
            });
        }, 'hello');
    }, 3000);
}
/**
 * ES6 class
*/
class Dialogs {
    constructor(str = '用class代替原型链') {
        console.log(str)
    }
    createNode() {
        let _box = document.createElement('div');
        _box.className = 'prompts';
        return _box;
    }
    output(_box, _num, _html, fun) {
        _box.appendChild(_html);
        document.body.appendChild(_box);
        _box.style.backgroundColor = 'rgba(0,0,0,' + _num + ')';
        setTimeout(() => {
            _box.style.opacity = 1;
            if (typeof fun === 'function') fun.call(this);
        }, 20);
    }
    removeThis(_box) {
        _box.style.opacity = 0;
        setTimeout(() => document.body.removeChild(_box), 241);
    }
    remove() {
        let _prompts = document.getElementsByClassName('prompts');
        if (!_prompts.length) return;
        for (let i = 0; i < _prompts.length; i++) this.removeThis(_prompts[i]);
    }
    alertMsg(_text = '内容', fn, _title = '提示') {
        let _div = this.createNode(), _module = document.createElement('div'), _btn = document.createElement('div');
        [_module.className, _btn.className, _btn.textContent] = ['prompt', 'callback_btn', '确认'];
        _module.innerHTML = '<h2>' + _title + '</h2><div class="text_box"><p>' + _text + '</p></div>';
        _module.appendChild(_btn);
        this.output(_div, .4, _module, () => {
            _module.classList.add('scale_in');
            _btn.addEventListener('click', () => {
                if (typeof fn === 'function') fn.call(this);
                _module.classList.add('scale_out');
                this.removeThis(_div);
            });
        });
    }
    confirmMsg(_text = '内容', Afn, _title = '提示', Bfn) {
        let _div = this.createNode(), _module = document.createElement('div'), _Lbtn = document.createElement('div'), _Rbtn = document.createElement('div');
        [_module.className, _Lbtn.className, _Lbtn.textContent, _Rbtn.className, _Rbtn.textContent] = ['confirm', 'callback_btn', '取消', 'callback_btn callback_right', '确认'];
        _module.innerHTML = '<h2>' + _title + '</h2><div class="text_box"><p>' + _text + '</p></div>';
        _module.appendChild(_Lbtn);
        _module.appendChild(_Rbtn);
        this.output(_div, .4, _module, () => {
            _module.classList.add('scale_in');
            _Rbtn.addEventListener('click', () => {
                if (typeof Afn === 'function') Afn.call(this);
                _module.classList.add('scale_out');
                this.removeThis(_div);
            });
            _Lbtn.addEventListener('click', () => {
                if (typeof Bfn === 'function') Bfn.call(this);
                _module.classList.add('scale_out');
                this.removeThis(_div);
            });
        });
    }
    loadBall() {
        let _div = this.createNode(), _module = document.createElement('div');
        _module.className = 'loding_ball';
        _module.innerHTML = '<div></div><div></div><div></div>';
        this.output(_div, .4, _module);
    }
    loading(_text = 'loading') {
        let _div = this.createNode(), _module = document.createElement('div');
        _module.className = 'loading_box';
        _module.innerHTML = '<div></div><p>' + _text + '</p>';
        this.output(_div, 0, _module);
    }
    toast(_text = 'toast', _time = 1500, fn) {
        let _module = document.createElement('div');
        _module.className = 'itoast';
        _module.textContent = _text;
        document.body.appendChild(_module);
        setTimeout(() => {
            _module.style.opacity = 0;
            setTimeout(() => {
                document.body.removeChild(_module);
                if (typeof fn === 'function') fn.call(this);
            }, 200);
        }, _time);
    }
}
let _Dialogs = new Dialogs('随便传点什么');
function classBtn() {
    if (_stop >= 2) return;
    _Dialogs.loading();
    setTimeout(() => {
        _Dialogs.remove();
        _Dialogs.alertMsg('这是一个类提示框~', function () {
            _Dialogs.confirmMsg('还要继续吗？', function () {
                _Dialogs.toast('接下来是一个加载球的动画，然后就没有了', 2000, function () {
                    _Dialogs.loadBall();
                    setTimeout(() => { _Dialogs.remove() }, 2000);
                });
            }, '确认提示', function () {
                console.log('你取消了~');
            });
        }, 'hello');
    }, 3000);
}

/**
 * 普通函数模式
*/
function Prompts(params, Afn, Bfn) {
    let _fn = params.type || null;
    let _title = params.title || '提示';
    let _content = params.text || '内容';
    let _time = Number(params.time) || 1500;
    // 输出html
    let _div = document.createElement('div');
    function output(_num, _html, fun) {
        _div.className = 'prompts';
        _div.appendChild(_html);
        document.body.appendChild(_div);
        _div.style.backgroundColor = 'rgba(0,0,0,' + _num + ')';
        setTimeout(() => {
            _div.style.opacity = 1;
            if (typeof fun === 'function') fun.call(this);
        }, 20);
    }
    // 清除当前DOM
    function removeThis() {
        _div.style.opacity = 0;
        setTimeout(() => document.body.removeChild(_div), 241);
    }
    // 确认框
    function alertMsg() {
        let _module = document.createElement('div'), _btn = document.createElement('div');
        [_module.className, _btn.className, _btn.textContent] = ['prompt', 'callback_btn', '确认'];
        _module.innerHTML = '<h2>' + _title + '</h2><div class="text_box"><p>' + _content + '</p></div>';
        _module.appendChild(_btn);
        output(.4, _module, () => {
            _module.classList.add('scale_in');
            _btn.addEventListener('click', () => {
                if (typeof Afn === 'function') Afn.call(this);
                _module.classList.add('scale_out');
                removeThis();
            });
        });
    }
    // 操作确认框
    function confirmMsg() {
        let _module = document.createElement('div'), _Lbtn = document.createElement('div'), _Rbtn = document.createElement('div');
        [_module.className, _Lbtn.className, _Lbtn.textContent, _Rbtn.className, _Rbtn.textContent] = ['confirm', 'callback_btn', '取消', 'callback_btn callback_right', '确认'];
        _module.innerHTML = '<h2>' + _title + '</h2><div class="text_box"><p>' + _content + '</p></div>';
        _module.appendChild(_Lbtn);
        _module.appendChild(_Rbtn);
        output(.4, _module, () => {
            _module.classList.add('scale_in');
            _Rbtn.addEventListener('click', () => {
                if (typeof Afn === 'function') Afn.call(this);
                _module.classList.add('scale_out');
                removeThis();
            });
            _Lbtn.addEventListener('click', () => {
                if (typeof Bfn === 'function') Bfn.call(this);
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
        _module.innerHTML = '<div></div><p>' + _content + '</p>';
        output(0, _module);
    }
    // toast
    function toast() {
        let _module = document.createElement('div');
        _module.className = 'itoast';
        _module.textContent = _content;
        document.body.appendChild(_module);
        setTimeout(() => {
            _module.style.opacity = 0;
            setTimeout(() => {
                document.body.removeChild(_module);
                if (typeof Afn === 'function') Afn.call(this);
            }, 200);
        }, _time);
    }
    // 判断执行哪个方法
    if (_fn === 'alert') {
        alertMsg()
    } else if (_fn === 'confirm') {
        confirmMsg();
    } else if (_fn === 'ball') {
        loadingBall();
    } else if (_fn === 'load') {
        loading();
    } else if (_fn === 'toast') {
        toast();
    } else if (_fn === 'remove') {
        let _prompts = document.getElementsByClassName('prompts');
        for (let i = 0; i < _prompts.length; i++) {
            _prompts[i].style.opacity = 0;
            setTimeout(() => {
                document.body.removeChild(_prompts[i]);
            }, 241);
        }
    } else console.log('没有可执行的type对象');
}
//
function myAlert() {
    Prompts({
        type: 'alert',
        title: 'title',
        text: '确认框文字描述'
    }, function () {
        console.log('确认');
        // myAlert()
    })
}
function myComfirm() {
    Prompts({
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
    new Prompts({ type: 'ball' });
    setTimeout(() => new Prompts({ type: 'remove' }), 3000);
}
function myLoad() {
    Prompts({ type: 'load', text: '加载中...' });
    setTimeout(() => Prompts({ type: 'remove' }), 30000);
}
function myToast() {
    Prompts({ type: 'toast', text: '这里是底部弹出文字', time: 2500 });
}