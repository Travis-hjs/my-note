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

    /**
     * 输出聊天界面列表节点
     * @param {Array<{id: number, name: string, image: string, label: string}>} list 
     */
    function outputUserList(list) {
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const el = document.createElement('div');
            el['the-id'] = item.id;
            el.className = 'user_item flex fvertical';
            el.innerHTML = `<img class="user_head" src="${item.image}" alt=""><div class="user_name f1">${item.name}</div>`;
            el.addEventListener('click', function() {
                switchUserItemState(item.id, item);
                setCurrentUserInfo(item);
            });
            messageList.appendChild(el);
        }
    }

    /**
     * 输出联系人列表节点
     * @param {Array<{id: number, name: string, image: string, label: string}>} list 
     */
    function outputContactList(list) {
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const el = document.createElement('div');
            el['the-id'] = item.id;
            el.className = 'contact_item flex fvertical';
            el.innerHTML = `<img class="contact_head" src="${item.image}" alt="">
            <div class="f1">
                <div class="contact_name">${item.name}</div>
                <div class="contact_label">${item.label}</div>
            </div>`;
            el.addEventListener('click', function() {
                messageWindow.classList.remove('message_window_hide');
                closeMessageList();
                switchUserItemState(item.id, item);
                setCurrentUserInfo(item);
            });
            contactList.appendChild(el);
        }
    }

    /**
     * 切换聊天界面联系人状态
     * @param {number} id 
     * @param {{id: number, name: string, image: string, label: string}} info
     */
    function switchUserItemState(id, info) {
        const className = 'user_item_active';
        for (let i = 0; i < messageList.children.length; i++) {
            const item = messageList.children[i];
            if (item['the-id'] == id) {
                item.classList.add(className);
            } else {
                item.classList.remove(className);
            }
        }
    }

    /**
     * 设置当前用户信息
     * @param {{id: number, name: string, image: string, label: string}} info 
     */
    function setCurrentUserInfo(info) {
        // console.log(info);
        currentMessageUser.head.src = info.image;
        currentMessageUser.name.textContent = info.name;
        currentMessageUser.label.textContent = info.label;
    }

    /** 关闭联系人列表 */
    function closeMessageList() {
        openContactBox.classList.remove('hide');
        contactBox.classList.add('contact_box_hide');
    }
    
    /** 聊天窗口 */
    const messageWindow = find('.message_window');
    /** 聊天界面联系人列表 */
    const messageList = find('.message_window .user_list');
    /** 聊天联系人节点 */
    const contactBox = find('.contact_box');
    /** 聊天联系人列表节点 */
    const contactList = find('.contact_box .contact');
    /** 打开`聊天联系人列表`节点 */
    const openContactBox = find('.open_contact_box');
    /** 当前聊天用户节点对象 */
    const currentMessageUser = {
        /**
         * @type {HTMLImageElement}
         */
        head: find('.content_box .top .user_head'),
        name: find('.content_box .top .user_name'),
        label: find('.content_box .user_label')
    }

    /**
     * 用户数据
     * @type {Array<{id: number, name: string, image: string, label: string}>}
     */
    const userData = [
        {
            name: '刀锋之影-泰隆',
            image: 'https://game.gtimg.cn/images/lol/act/img/champion/Talon.png',
            label: '刀下生，刀下死'
        }, {
            name: '德玛西亚之翼-奎因',
            image: 'https://game.gtimg.cn/images/lol/act/img/champion/Quinn.png',
            label: '遮住ta的眼睛！'
        }, {
            name: '猩红收割者-弗拉基米尔',
            image: 'https://game.gtimg.cn/images/lol/act/img/champion/Vladimir.png',
            label: '嘶~呼~'
        }, {
            name: '琴瑟仙女-娑娜',
            image: 'https://game.gtimg.cn/images/lol/act/img/champion/Sona.png',
            label: '奏乐模式开始了'
        }, {
            name: '影流之主-劫',
            image: 'https://game.gtimg.cn/images/lol/act/img/champion/Zed.png',
            label: '无知者，在劫难逃'
        }, {
            name: '赏金猎人-厄运小姐',
            image: 'https://game.gtimg.cn/images/lol/act/img/champion/MissFortune.png',
            label: '好运，不会眷顾傻瓜'
        }, {
            name: '光辉女郎-拉克丝',
            image: 'https://game.gtimg.cn/images/lol/act/img/champion/Lux.png',
            label: '照亮你的未来'
        }
    ];

    userData.forEach((item, index) => {
        item.id = index;
    });

    outputUserList(userData);

    outputContactList(userData);

    initMouse(messageWindow, messageWindow.querySelector('.top'));

    initMouse(contactBox, contactBox.querySelector('.contact_header'));

    // 联系人列表关闭按钮点击事件
    contactBox.querySelector('.icon_close').addEventListener('click', closeMessageList);

    openContactBox.addEventListener('click', function () {
        openContactBox.classList.add('hide');
        contactBox.classList.remove('contact_box_hide');
    });

    messageWindow.querySelector('.close_window').addEventListener('click', function() {
        messageWindow.classList.add('message_window_hide');
    });

    // https://lol.qq.com/data/info-heros.shtml
    
})();