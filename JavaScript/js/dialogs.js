/** 交互提示组件（不需要额外引入css） */
function theDialog() {
    const doc = document;

    /** 输出样式 */
    function outputStyle() {
        if (doc.getElementById('the-dialog-style')) return;
        const css = `.the-dialog, .the-dialog div, .the-dialog button, .the-dialog p{ padding: 0px; margin: 0px; box-sizing: border-box; }
        .the-dialog{ width: 100%; height: 100vh; background-color: rgba(0,0,0,0.4); position: fixed; top: 0; left: 0; z-index: 999; transition: .2s all; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; }
        .the-dialog .the-dialog-box{ width: 78%; max-width: 360px; padding: 24px 24px 12px; box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12); border-radius: 2px; background-color: #fff; overflow: hidden; animation: dialogBoxShow .2s; transition: .2s all; }
        .the-dialog .t{ font-size: 22px; line-height: 32px; color: #333; margin-bottom: 20px; }
        .the-dialog .c{ font-size: 15px; color: rgba(0,0,0,.64); line-height: 22px; margin-bottom: 24px; }
        .the-dialog .b{ width: 100%; overflow: hidden; }
        .the-dialog .b button{ cursor: pointer; outline: none; border: none; float: right; padding: 0 15px; margin-left: 10px; font-size: 15px; line-height: 36px; border-radius: 2px; background-color: transparent; transition: .2s all; }
        .the-dialog .b .the-confirm{ color: #2196f3; }
        .the-dialog .b .the-confirm:active{ background-color: rgba(33, 150, 243, 0.2); }
        .the-dialog .b .the-cancel{ color: #999; }
        .the-dialog .b .the-cancel:active{ background-color: rgba(0,0,0,0.1); } 
        .the-dialog .the-loading .the-ring{ width: 46px; height: 46px; border: solid 3px #fff; border-radius: 50%; border-right-color: rgba(0,0,0,0); margin: 0 auto 16px; animation: circular 1.3s ease infinite; }
        .the-dialog .the-loading .the-text{ font-size: 15px; color: #fff; text-align: center; }
        .the-toast{ padding: 8px 16px; background-color: rgba(0,0,0,0.45); border-radius: 4px; position: fixed; z-index: 999; bottom: 10%; left: 50%; transform: translateX(-50%); animation: toastMove 0.4s ease; transition: 0.2s all; }
        .the-toast p{ line-height: 22px; font-size: 14px; color: #fff; }
        .the-dialog-hide{ opacity: 0; visibility: hidden; }
        .the-dialog-hide .the-dialog-box{ transform: scale(0.5); }
        .the-dialog .hide{ display: none; }
        @keyframes dialogBoxShow {
            0% { transform: scale(0.5); }
            100% { transform: scale(1); }
        }
        @keyframes circular {
            0% { transform: rotate(0deg); }
            50% { opacity: 0.5; }
            100% { transform: rotate(360deg); opacity: 1; }
        }
        @keyframes toastMove {
            0% { opacity: 0; transform: translate(-50%, 300%); }
            50% { opacity: 1; transform: translate(-50%, -100%); }
            100% { transform: translate(-50%, 0%); }
        }`;
        const style = doc.createElement('style');
        style.type = 'text/css';
        style.id = 'the-dialog-style';
        style.appendChild(doc.createTextNode(css));
        const head = doc.getElementsByTagName('head')[0];
        head.appendChild(style);
    }

    /** 输出组件模板 */
    function outputTemplate() {
        if (doc.querySelector('.the-dialog')) return;
        const template = `<div class="the-dialog the-dialog-hide">
            <div class="the-dialog-box hide">
                <div class="t"></div>
                <div class="c"></div>
                <div class="b">
                    <button class="the-confirm">确认</button>
                </div>
            </div>
            <div class="the-dialog-box hide">
                <div class="t"></div>
                <div class="c"></div>
                <div class="b">
                    <button class="the-confirm">确认</button>
                    <button class="the-cancel">取消</button>
                </div>
            </div>
            <div class="the-loading hide">
                <div class="the-ring"></div>
                <div class="the-text"></div>
            </div>
        </div>`;
        doc.body.insertAdjacentHTML('beforeend', template);
    }

    outputStyle();
    outputTemplate();

    /** 整体 */
    const box = doc.querySelector('.the-dialog');
    const alert = box.children[0];
    const alertTitle = alert.querySelector('.t');
    const alertContent = alert.querySelector('.c');
    const alertConfirm = alert.querySelector('.the-confirm');
    const confirm = box.children[1];
    const confirmTitle = confirm.querySelector('.t');
    const confirmContent = confirm.querySelector('.c');
    const confirmConfirm = confirm.querySelector('.the-confirm');
    const confirmCancel = confirm.querySelector('.the-cancel');
    const load = box.children[2];
    const loadText = load.querySelector('.the-text');

    function hideBox() {
        box.classList.add('the-dialog-hide');
    }
    
    function showBox() {
        box.classList.remove('the-dialog-hide');
    }

    /**
     * 显示的节点
     * @param {HTMLElement} el 显示的节点
     */
    function showNode(el) {
        [alert, confirm, load].forEach(item => {
            if (item === el) {
                item.classList.remove('hide');
            } else {
                item.classList.add('hide');
            }
        });
    }

    return {
        /**
         * 提示弹框
         * @param {string} content 内容
         * @param {Function} callback 确认回调
         * @param {string} title 提示文字
         */
        alert(content = '内容', callback = null, title = '提示') {
            alertTitle.textContent = title;
            alertContent.textContent = content;
            alertConfirm.onclick = function() {
                hideBox();
                if (typeof callback === 'function') callback();
            }
            showBox();
            showNode(alert);
        },
        /**
         * 确认弹框
         * @param {object} option
         * @param {string} option.content 内容
         * @param {string} option.title 提示文字
         * @param {string} option.comfirmText 确认按钮文字
         * @param {string} option.cancelText 取消按钮文字
         * @param {Function} callback 确认回调
         * @param {Function} fail 取消回调
         */
        confirm(option, callback = null, fail = null) {
            confirmTitle.textContent = option.title || '提示';
            confirmContent.textContent = option.content || '内容';
            confirmConfirm.textContent = option.comfirmText || '确定';
            confirmCancel.textContent = option.cancelText || '取消';
            confirmConfirm.onclick = function() {
                hideBox();
                if (typeof callback === 'function') callback();
            }
            confirmCancel.onclick = function() {
                hideBox();
                if (typeof fail === 'function') fail();
            }
            showBox();
            showNode(confirm);
        },
        /**
         * 显示加载
         * @param {string} content 加载提示文字
         */
        loading(content = '加载中') {
            loadText.textContent = content;
            showBox();
            showNode(load);
        },
        /**
         * 显示提示条
         * @param {string} content 提示文字
         * @param {number} time 消失的时间
         */
        toast(content = 'toast', time = 1400) {
            const toast = doc.createElement('div');
            toast.className = 'the-toast';
            toast.innerHTML = `<p>${content}</p>`;
            doc.body.appendChild(toast);
            setTimeout(() => {
                doc.body.removeChild(toast);
            }, time);
        },
        /** 关闭组件（配合loading用） */
        hide() {
            hideBox();
        }
    }
}

const dialog = theDialog();

function showAlert() {
    dialog.alert('这是一个提示框');
}

let count = 0;

function showComfirm() {
    dialog.confirm({
        content: count > 0 ? `第${count}次点击继续`: '这是一个确认提示框',
        title: '是否继续',
        comfirmText: '继续',
        cancelText: '取消继续'
    }, function() {
        count++;
        showComfirm();
    }, function() {
        count = 0;
        dialog.alert('已经取消继续');
    });
}

function showLoad() {
    dialog.loading();
    setTimeout(() => {
        dialog.hide();
        dialog.toast('加载完成！');
    }, 2000);
}

function showToast() {
    dialog.toast('显示提示条~');
}
