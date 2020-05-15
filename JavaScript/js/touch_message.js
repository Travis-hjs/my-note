(function () {
    /**
     * 查找单个元素
     * @param {string} el
     * @returns {HTMLElement} 
     */
    const find = el => document.querySelector(el);

    /**
     * 初始化鼠标事件
     * @param {HTMLElement} box 拖拽的整体节点
     * @param {HTMLElement} drag 拖拽的节点
     */
    function initMouse(box, drag) {
        const beforeTransition = box.style.transition;
        let start = false;
        let left = 0;
        let top = 0;
        let dragPosition = {
            x: 0,
            left: 0,
            y: 0,
            top: 0
        }
        // 当鼠标在指定元素按下时
        drag.addEventListener('mousedown', function(event) {
            // console.log(left, top);
            dragPosition.x = event.clientX;
            dragPosition.y = event.clientY;
            left = dragPosition.x - box.getBoundingClientRect().left;
            top = dragPosition.y - box.getBoundingClientRect().top;
            start = true;
        });

        document.addEventListener('mousemove', function boxMove(event) {
            if (!start) return;
            dragPosition.left = event.clientX - left;
            dragPosition.top = event.clientY - top;
            box.style.top = dragPosition.top + 'px';
            box.style.left = dragPosition.left + 'px';
            box.style.margin = 0;
            box.style.transition = '0s all';
            if (box.getBoundingClientRect().left <= 0) {
                box.style.left = '0px';
            }
            if (box.getBoundingClientRect().left >= document.documentElement.clientWidth - box.offsetWidth) {
                box.style.left = document.documentElement.clientWidth - box.offsetWidth + 'px';
            }
            if (box.getBoundingClientRect().top <= 0) {
                box.style.top = '0px';
            }
            if (box.getBoundingClientRect().top >= document.documentElement.clientHeight - box.offsetHeight) {
                box.style.top = document.documentElement.clientHeight - box.offsetHeight + 'px';
            }
        });

        // 当鼠标在任意地方松开时
        document.addEventListener('mouseup', () => {
            start = false;
            box.style.transition = beforeTransition;
        });
        
    }

    /** 关闭联系人列表 */
    function closeMessageList() {
        openMessageList.classList.remove('hide');
        messageList.classList.add('message_list_hide');
    }
    
    /** 聊天窗口 */
    const messageWindow = find('.message_window');
    /** 聊天联系人列表 */
    const messageList = find('.message_list');
    /** 打开`聊天联系人列表`节点 */
    const openMessageList = find('.open_message_list');

    initMouse(messageWindow, messageWindow.querySelector('.top'));

    initMouse(messageList, messageList.querySelector('.message_list_header'));

    messageList.querySelector('.icon_close').addEventListener('click', closeMessageList);

    messageList.querySelector('.list_content').addEventListener('click', function(e) {
        /**
         * @type {HTMLElement}
         */
        let target = e.target
        const p1 = target.parentElement;
        const p2 = target.parentElement.parentElement;
        if (p1.className.includes('contact_item') || p2.className.includes('contact_item')) {
            // console.log('点击item');
            messageWindow.classList.remove('message_window_hide');
            closeMessageList();
        }
    })

    openMessageList.addEventListener('click', function () {
        openMessageList.classList.add('hide');
        messageList.classList.remove('message_list_hide');
    });

    messageWindow.querySelector('.close_window').addEventListener('click', function() {
        messageWindow.classList.add('message_window_hide');
    });

})();