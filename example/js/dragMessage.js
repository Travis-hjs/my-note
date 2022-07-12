(function () {
  /**
   * 查找单个元素
   * @param {string} el
   * @returns {HTMLElement} 
   */
  const find = el => document.querySelector(el);

  /** 聊天内容（类型提示用） */
  const messageInfo = {
    /** 是否为自己 */
    self: false,
    /** 聊天内容 */
    content: "",
    /** 聊天时间 */
    date: ""
  }

  /** 用户数据（类型提示用） */
  const userInfo = {
    /** 用户id */
    id: 0,
    /** 用户名 */
    name: "",
    /** 用户头像 */
    image: "",
    /** 个性签名 */
    label: "",
    /** 
     * 聊天记录
     * @type {Array<messageInfo>}
     * 
    */
    messages: []
  }

  /**
   * 图片前缀
   * [图片来源](https://lol.qq.com/data/info-heros.shtml)
   */
  const photoPrefix = "https://game.gtimg.cn/images/lol/act/img/champion";

  /**
   * 用户数据列表
   * @type {Array<userInfo>}
   */
  const userList = [
    {
      name: "刀锋之影-泰隆",
      image: photoPrefix + "/Talon.png",
      label: "刀下生，刀下死"
    }, {
      name: "德玛西亚之翼-奎因",
      image: photoPrefix + "/Quinn.png",
      label: "遮住ta的眼睛！"
    }, {
      name: "猩红收割者-弗拉基米尔",
      image: photoPrefix + "/Vladimir.png",
      label: "嘶~呼~"
    }, {
      name: "琴瑟仙女-娑娜",
      image: photoPrefix + "/Sona.png",
      label: "奏乐模式开始了"
    }, {
      name: "影流之主-劫",
      image: photoPrefix + "/Zed.png",
      label: "无知者，在劫难逃"
    }, {
      name: "赏金猎人-厄运小姐",
      image: photoPrefix + "/MissFortune.png",
      label: "好运，不会眷顾傻瓜"
    }, {
      name: "光辉女郎-拉克丝",
      image: photoPrefix + "/Lux.png",
      label: "照亮你的未来"
    }
  ];

  /** 自己头像 */
  const selfHead = "https://mirror-gold-cdn.xitu.io/16b64a3a3b2baec66af?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1";

  /** 聊天窗口 */
  const messageWindow = find(".message_window");
  /** 聊天界面联系人列表 */
  const messageList = find(".message_window .user_list");
  /** 聊天记录容器 */
  const messageContent = find(".message_window .content");
  /** 聊天联系人节点 */
  const contactBox = find(".contact_box");
  /** 聊天联系人列表节点 */
  const contactList = find(".contact_box .contact");
  /** 打开`聊天联系人列表`节点 */
  const openContactBox = find(".open_contact_box");
  /** 
   * 输入框节点
   * @type {HTMLTextAreaElement} 
   * 
  */
  const inputBox = find(".message_window .input_box");
  /** 当前聊天用户节点对象 */
  const currentMessageUser = {
    /**
     * @type {HTMLImageElement}
     */
    head: find(".content_box .top .user_head"),
    name: find(".content_box .top .user_name"),
    label: find(".content_box .user_label")
  }

  /** 当前聊天用户`id`在列表中的索引 */
  let currentMessageIndex = 0;
  /** 输入框输入内容 */
  let inputValue = "";
  /** 自动回复计时器 */
  let autoReplyTimer = 0;

  /**
   * 随机生成中文
   * @param {number} min 
   * @param {number} max 
   */
  function randomText(min, max) {
    const len = parseInt(Math.random() * max) + min;
    const base = 20000;
    const range = 1000;
    let str = "";
    let i = 0;
    while (i < len) {
      i++;
      const lower = parseInt(Math.random() * range);
      str += String.fromCharCode(base + lower);
    }
    return str;
  }

  /**
   * 拖拽节点
   * @param {object} option 
   * @param {HTMLElement} option.el 拖拽的整体节点
   * @param {HTMLElement} option.dragTarget 指定拖拽的目标节点，不指定则点击整体均可拖拽
   * @param {"fixed"|"absolute"} option.position 定位模式，默认`"fixed"`，设置为`"absolute"`时，根据父容器的尺寸来设置拖拽区域
   */
  function elementDraggable(option) {
    const el = option.el;
    const target = option.dragTarget || el;
    const position = option.position || "fixed";
    const beforeTransition = el.style.transition;
    const coordinate = {
      /** 记录的坐标位置`pageX` */
      x: 0,
      /** 使用的定位值`X */
      left: 0,
      /** 记录的坐标位置`pageY` */
      y: 0,
      /** 使用的定位值`Y` */
      top: 0
    }

    let wrap = document.documentElement;
    let start = false;

    target.style.cursor = "move";
    el.style.position = position;
    if (position === "absolute") {
      el.parentNode.style.position = "relative";
      wrap = el.parentNode;
    }

    const rect = () => el.getBoundingClientRect();

    /**
     * 鼠标移动
     * @param {MouseEvent} e 
     */
    function move(e) {
      if (!start) return;
      if (el.style.margin != "0px") {
        el.style.margin = "0px";
      }
      switch (position) {
        case "absolute":
          el.style.left = coordinate.left + (e.pageX - coordinate.x) + "px";
          el.style.top = coordinate.top + (e.pageY - coordinate.y) + "px";
          if (el.offsetLeft <= 0) {
            el.style.left = "0px";
          }
          if (el.offsetLeft + el.clientWidth >= wrap.clientWidth) {
            el.style.left = wrap.clientWidth - el.clientWidth + "px";
          }
          if (el.offsetTop <= 0) {
            el.style.top = "0px";
          }
          if (el.offsetTop + el.clientHeight >= wrap.clientHeight) {
            el.style.top = wrap.clientHeight - el.clientHeight + "px";
          }
          break;

        case "fixed":
          el.style.left = e.pageX - coordinate.left + "px";
          el.style.top = e.pageY - coordinate.top + "px";
          if (rect().left <= 0) {
            el.style.left = "0px";
          }
          if (rect().left >= wrap.clientWidth - el.clientWidth) {
            el.style.left = wrap.clientWidth - el.clientWidth + "px";
          }
          if (rect().top <= 0) {
            el.style.top = "0px";
          }
          if (rect().top >= wrap.clientHeight - el.clientHeight) {
            el.style.top = wrap.clientHeight - el.clientHeight + "px";
          }
          break;
      }
    }

    /** 鼠标抬起 */
    function up() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      el.style.transition = beforeTransition;
      start = false;
    }

    // 当鼠标在指定元素按下时
    target.addEventListener("mousedown", function (e) {
      el.style.transition = "0s all";
      switch (position) {
        case "absolute":
          coordinate.x = e.pageX;
          coordinate.y = e.pageY;
          coordinate.left = el.offsetLeft;
          coordinate.top = el.offsetTop;
          break;

        case "fixed":
          const size = rect();
          coordinate.left = e.pageX - size.left;
          coordinate.top = e.pageY - size.top;
          break;
      }
      start = true;
      // 当鼠标在任意地方移动时
      document.addEventListener("mousemove", move);
      // 当鼠标在任意地方松开时
      document.addEventListener("mouseup", up);
    });
  }

  /**
   * 输出聊天界面列表节点
   * @param {Array<userInfo>} list 
   */
  function outputUserList(list) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const el = document.createElement("div");
      el["the-id"] = item.id;
      el.className = "user_item fvertical";
      el.innerHTML = `<img class="user_head" src="${item.image}" alt=""><div class="user_name f1">${item.name}</div>`;
      el.addEventListener("click", function () {
        switchUserItemState(item.id);
        setCurrentUserInfo(item);
      });
      messageList.appendChild(el);
    }
  }

  /**
   * 输出联系人列表节点
   * @param {Array<userInfo>} list 
   */
  function outputContactList(list) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const el = document.createElement("div");
      el["the-id"] = item.id;
      el.className = "contact_item fvertical";
      el.innerHTML = `
      <img class="contact_head" src="${item.image}" alt="">
      <div class="f1">
        <div class="contact_name">${item.name}</div>
        <div class="contact_label">${item.label}</div>
      </div>`;
      el.addEventListener("click", function () {
        messageWindow.classList.remove("message_window_hide");
        closeMessageList();
        switchUserItemState(item.id);
        setCurrentUserInfo(item);
      });
      contactList.appendChild(el);
    }
  }

  /**
   * 切换聊天界面联系人状态
   * @param {number} id 
   */
  function switchUserItemState(id) {
    const className = "user_item_active";
    for (let i = 0; i < messageList.children.length; i++) {
      const item = messageList.children[i];
      if (item["the-id"] == id) {
        item.classList.add(className);
      } else {
        item.classList.remove(className);
      }
    }
  }

  /**
   * 设置当前用户信息
   * @param {userInfo} info 
   */
  function setCurrentUserInfo(info) {
    // console.log("设置当前用户信息", info);
    currentMessageUser.head.src = info.image;
    currentMessageUser.name.textContent = info.name;
    currentMessageUser.label.textContent = info.label;
    for (let i = 0; i < userList.length; i++) {
      const item = userList[i];
      if (item.id == info.id) {
        currentMessageIndex = i;
        break;
      }
    }
    updateRecord();
  }

  /** 更新聊天记录 */
  function updateRecord() {
    messageContent.innerHTML = "";
    for (let i = 0; i < userList[currentMessageIndex].messages.length; i++) {
      const record = userList[currentMessageIndex].messages[i];
      outputRecordItem(record);
    }
    messageContentToBottom(true);
  }

  /**
   * 输出单条聊天记录
   * @param {messageInfo} data 
   */
  function outputRecordItem(data) {
    const el = document.createElement("div");
    if (data.self) {
      el.className = "message flex message_right";
      el.innerHTML = `
      <div class="placeholder"></div>
      <div class="f1">
        <div class="state">${data.date}</div>
        <div class="text">${data.content}</div>
      </div>
      <img class="user_head" src="${selfHead}" alt="">`
    } else {
      el.className = "message flex message_left";
      el.innerHTML = `
      <img class="user_head" src="${userList[currentMessageIndex].image}" alt="">
      <div class="f1">
        <div class="state">${data.date}</div>
        <div class="text">${data.content}</div>
      </div>
      <div class="placeholder"></div>`
    }
    messageContent.appendChild(el);
  }

  /** 自己发送一条信息 */
  function sendSelfMessage() {
    if (inputValue.trim() == "") {
      inputBox.value = "";
      return alert("输入的内容不能为空");
    }
    const data = {
      self: true,
      content: inputValue.trim(),
      date: new Date().toLocaleString()
    }
    userList[currentMessageIndex].messages.push(data);
    inputValue = "";
    inputBox.value = "";
    outputRecordItem(data);
    messageContentToBottom();
    clearTimeout(autoReplyTimer);
    autoReplyTimer = setTimeout(sendAutoMessage, 1000, currentMessageIndex);
  }

  /**
   * 机器人自动回复信息
   * @param {number} index 列表索引
   */
  function sendAutoMessage(index) {
    const value = randomText(2, 30);
    const data = {
      self: false,
      content: "【自动回复】" + value,
      date: new Date().toLocaleString()
    }
    userList[index].messages.push(data);
    // 防止自动回复前切换其他操作
    if (index == currentMessageIndex) {
      outputRecordItem(data);
      messageContentToBottom();
    }
  }

  /** 
   * 将聊天界面容器滚动至底 
   * @param {boolean} init 是否初始化
  */
  function messageContentToBottom(init) {
    let height = 0;
    for (let i = 0; i < messageContent.children.length; i++) {
      const item = messageContent.children[i];
      height += item.clientHeight;
    }
    messageContent.scrollTo({
      top: height,
      behavior: init ? "auto" : "smooth"
    });
  }

  /** 关闭联系人列表 */
  function closeMessageList() {
    openContactBox.classList.remove("hide");
    contactBox.classList.add("contact_box_hide");
  }

  userList.forEach((item, index) => {
    item.id = index * 2;
    item.messages = [];
  });

  outputUserList(userList);

  outputContactList(userList);

  elementDraggable({
    el: messageWindow,
    dragTarget: messageWindow.querySelector(".top")
  });

  elementDraggable({
    el: contactBox,
    dragTarget: contactBox.querySelector(".contact_header")
  });

  // 联系人列表关闭按钮点击事件
  contactBox.querySelector(".icon_close").addEventListener("click", closeMessageList);

  openContactBox.addEventListener("click", function () {
    openContactBox.classList.add("hide");
    contactBox.classList.remove("contact_box_hide");
  });

  messageWindow.querySelector(".close_window").addEventListener("click", function () {
    messageWindow.classList.add("message_window_hide");
  });

  // 监听输入框输入事件
  inputBox.addEventListener("keydown", function (ev) {
    // console.log("value >>", this.value, "code >>", ev.code, "keyCode >>", ev.keyCode, "key >>", ev.key);
    if (ev.key == "Enter") {
      sendSelfMessage();
    }
  });

  inputBox.addEventListener("input", function () {
    inputValue = this.value;
  });

  find(".message_window .send_btn").addEventListener("click", sendSelfMessage);

})();