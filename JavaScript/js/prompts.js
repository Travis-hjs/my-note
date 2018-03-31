function Prompts(params, Afn, Bfn) {
    let _fn = params.type || null;
    let _title = params.title || '提示';
    let _content = params.text || '内容';
    let _time = Number(params.time) || 1000;
    // 输出html
    let _div = document.createElement('div');
    function output(_num, _html, fun) {
        _div.className = 'prompts';
        _div.appendChild(_html);
        document.body.appendChild(_div);
        _div.style.backgroundColor = 'rgba(0,0,0,'+_num+')';
        setTimeout(() => {
            _div.style.opacity = 1;
            if (typeof fun === 'function') fun.call(this);
        }, 20);
    }
    // 清除当前DOM
    function removeThis () {
        _div.style.opacity = 0;
        setTimeout(() => document.body.removeChild(_div), 301);
    }
    // 确认框
    function alertMsg() {
        let [_module, _btn] = [document.createElement('div'), document.createElement('div')];
        [_module.className, _btn.className, _btn.textContent] = ['prompt', 'callback_btn', '确认'];
        _module.innerHTML = '<h2>'+_title+'</h2><div class="text_box"><p>'+_content+'</p></div>';
        _module.appendChild(_btn);
        output(.3, _module, () => {
            _module.classList.add('boxScale');
            _btn.addEventListener('click', () => {
                if (typeof Afn === 'function') Afn.call(this);
                _module.classList.remove('boxScale');
                removeThis();
            });
        });
    }
    // 操作确认框
    function confirmMsg () {
        let [_module, _Lbtn, _Rbtn] = [document.createElement('div'),document.createElement('div'),document.createElement('div')];
        [_module.className, _Lbtn.className, _Lbtn.textContent, _Rbtn.className, _Rbtn.textContent] = ['confirm', 'callback_btn','取消','callback_btn callback_right','确认'];
        _module.innerHTML = '<h2>'+_title+'</h2><div class="text_box"><p>'+_content+'</p></div>';
        _module.appendChild(_Lbtn);
        _module.appendChild(_Rbtn);
        output(.3, _module, () => {
            _module.classList.add('boxScale');
            _Rbtn.addEventListener('click', () => {
                if (typeof Afn === 'function') Afn.call(this);
                _module.classList.remove('boxScale');
                removeThis();
            });
            _Lbtn.addEventListener('click', () => {
                if (typeof Bfn === 'function') Bfn.call(this);
                _module.classList.remove('boxScale');
                removeThis();
            });
        });
    }
    //	加载球
    function loadingBall() {
        let _module = document.createElement('div');
        _module.className = 'loding_ball';
        _module.innerHTML = '<div></div><div></div><div></div>';
        output(.3, _module);
    }
    //	加载中
    function loading() {
        let _module = document.createElement('div');
        _module.className = 'loading_box';
        _module.innerHTML = '<div></div><p>'+_content+'</p>';
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
    }else if (_fn === 'confirm') {
        confirmMsg();
    }else if (_fn === 'ball') {
        loadingBall();
    }else if (_fn === 'load') {
        loading();
    }else if (_fn === 'toast') {
        toast();
    }else if (_fn === 'remove') {
        let _self = document.querySelector('.prompts');
        _self.style.opacity = 0;
        setTimeout(() => document.body.removeChild(_self), 301);
    }else console.log('没有可执行的type对象');
}