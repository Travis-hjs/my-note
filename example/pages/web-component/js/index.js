(function () {
  // learn: https://blog.csdn.net/qdmoment/article/details/102782378

  /**
   * 作用域模式
   * @description `HTMLElement.attachShadow`设置作用域
   */
  class UserCard extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.outputStyle();
      this.outputTemplate(
        this.getAttribute("name"),
        this.getAttribute("description"),
        this.getAttribute("image"),
        this.getAttribute("link")
      );
    }

    outputStyle() {
      // const style = `.user-card {
      //   display: flex;
      //   align-items: center;
      //   width: 100%;
      //   max-width: 680px;
      //   height: 180px;
      //   background-color: #d4d4d4;
      //   border: 1px solid #d5d5d5;
      //   box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
      //   border-radius: 3px;
      //   overflow: hidden;
      //   padding: 10px;
      //   box-sizing: border-box;
      //   font-family: "Poppins", sans-serif;
      // }

      // .user-card a{
      //   text-decoration: none;
      //   color: inherit;
      // }

      // .user-card .head {
      //   flex: 0 0 auto;
      //   width: 160px;
      //   height: 160px;
      //   vertical-align: middle;
      //   border-radius: 5px;
      // }

      // .user-card .info {
      //   box-sizing: border-box;
      //   flex: 1;
      //   padding: 20px;
      //   height: 160px;
      // }

      // .user-card .info .name {
      //   font-size: 20px;
      //   font-weight: 600;
      //   line-height: 1;
      //   margin: 0;
      //   margin-bottom: 16px;
      // }

      // .user-card .info .email {
      //   font-size: 12px;
      //   opacity: 0.75;
      //   line-height: 1;
      //   margin: 0;
      //   margin-bottom: 15px;
      // }

      // .user-card .info .button {
      //   padding: 10px 25px;
      //   font-size: 12px;
      //   border-radius: 5px;
      //   text-transform: uppercase;
      // }`;
      // const label = document.createElement("style");
      // label.textContent = style;
      // this.shadow.className = "user-card";

      const linkLabel = document.createElement("link");
      linkLabel.rel = "stylesheet";
      linkLabel.href = "./css/the-card.css";
      this.shadow.appendChild(linkLabel);
    }

    /**
     * 输出模板
     * @param {string} name
     * @param {string} desc
     * @param {string} img
     * @param {string} link
     */
    outputTemplate(name, desc, img, link) {
      const box = document.createElement("div");
      box.className = "user-card";
      box.innerHTML = `
      <img class="head" src="${img || ""}">
      <div class="info">
        <p class="name">${name || ""}</p>
        <p class="email">${desc || ""}</p>
        <button class="the-btn blue"><a href="${link || "###"}" target="_blank">open link</a></button>
      </div>`;
      this.shadow.appendChild(box);
      // this.insertAdjacentHTML("beforeend", template);
    }
  }

  window.customElements.define("user-card", UserCard);

  /**
   * 无作用域模式，样式会受到外部的`css`影响
   */
  class TheInput extends HTMLElement {
    constructor() {
      super();
      this.outputTemplate();
      /**
       * 输入模式
       * @type {"capitalize"|"capitalizeEveryWord"|"normal"}
       */
      this.mode = this.getAttribute("input-mode") || "normal";
    }

    outputTemplate() {
      const THAT = this;
      const input = document.createElement("input");
      input.className = "input";
      input.placeholder = "Please input English words";
      input.addEventListener("input", function (e) {
        // console.log(e.target.value);
        input.value = THAT.inputFilter(e.target.value);
      });
      this.appendChild(input);
    }

    /**
     * 过滤输入
     * @param {string} value 输入的内容
     */
    inputFilter(value) {
      let result = value;
      /**
       * 每个单词首字母大写
       * @param {string} val
       */
      const capitalizeEveryWord = (val) =>
        val.replace(/\b[a-z]/g, (char) => char.toUpperCase());
      /** 首字母大写 */
      const capitalize = ([first, ...rest]) =>
        first.toUpperCase() + rest.join("");
      // console.log(this.mode);
      switch (this.mode) {
        case "capitalize":
          result = capitalize(value);
          break;

        case "capitalizeEveryWord":
          result = capitalizeEveryWord(value);
          break;

        default:
          break;
      }
      return result;
    }
  }

  window.customElements.define("the-input", TheInput);

  /**
   * 用户列表组件
   */
  class UserList extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      const value = this.getAttribute("total");
      if (value) {
        this.total = Number(value);
      }
      this.outputStyle();
      this.init();
    }

    /**
     * 当前组件 <封闭模式>
     * @type {ShadowRoot}
     */
    shadow = null;

    /**
     * 当前组件容器
     * @type {HTMLDivElement}
     */
    component = null;

    /** 显示列表总数 */
    total = 6;

    /** 当前`item`索引 */
    itemIndex = 0;

    /**
     * 用户列表
     * @type {Array<{name: string, avatar: string}>}
     */
    list = [];

    init() {
      const url = `https://game.gtimg.cn/images/lol/act/img/champion/`;
      /** `item`节点高度 */
      const itemHeight = 60;
      const names = [
        "海豹星人",
        "陈佑白",
        "青葉廚",
        "小星仔may",
        "邻居的窗",
        "小铭又饿了",
        "超人回来了",
        "美食家大雄",
        "芒果妈妈",
        "八大商人",
        "水逆寒",
      ];
      const images = [
        "Annie.png",
        "Olaf.png",
        "Galio.png",
        "TwistedFate.png",
        "XinZhao.png",
        "Urgot.png",
        "MasterYi.png",
        "Ezreal.png",
        "Yasuo.png",
        "Zed.png",
        "Aatrox.png",
      ];
      images.sort(() => (Math.random() > 0.5 ? -1 : 1));
      names.sort(() => (Math.random() > 0.5 ? -1 : 1));
      for (let i = 0; i < names.length; i++) {
        this.list.push({
          name: names[i],
          avatar: url + images[i],
        });
      }
      this.component = document.createElement("div");
      this.component.className = "user_list";
      this.component.style.height = this.total * itemHeight + "px";
      for (let i = 0; i < this.total; i++) {
        this.outputItem(true);
      }
      this.shadow.appendChild(this.component);
      setInterval(() => {
        this.outputItem();
      }, 2000);
    }

    /** 输出样式 */
    outputStyle() {
      const linkLabel = document.createElement("link");
      linkLabel.rel = "stylesheet";
      linkLabel.href = "./css/user-list.css";
      this.shadow.appendChild(linkLabel);
    }

    /**
     * 输出`item`
     * @param {boolean} first 是否第一次输出
     */
    outputItem(first = false) {
      const item = document.createElement("div");
      const data = this.list[this.itemIndex];
      const box = this.component;
      const lastItem = box.lastChild;
      function getMoney() {
        const MONEY_VALUE = 100;
        let number = Math.floor(Math.random() * 50 * MONEY_VALUE) + 100 * MONEY_VALUE;
        number /= MONEY_VALUE;
        return number.toFixed(2);
      }
      item.className = "item";
      item.innerHTML = `<img class="head" src="${
        data.avatar
      }" /><div class="name">${
        data.name
      }</div><div class="value">领取了 ${getMoney()} 元</div>`;
      box.insertBefore(item, box.firstChild);
      if (!first) {
        item.addEventListener("animationend", function () {
          box.removeChild(lastItem);
        });
      }
      this.itemIndex++;
      if (this.itemIndex == this.list.length - 1) {
        this.itemIndex = 0;
      }
    }
  }

  window.customElements.define("user-list", UserList);

  class CollapseBox extends HTMLElement {
    constructor() {
      super();
      /**
       * 元素出现
       * @param {HTMLElement} el
       * @returns
       */
      function show(el) {
        if (!el) return;
        el.style.display = "block";
        el.style.height = "";
        // console.log(el.clientHeight, el.offsetHeight);
        const height = el.clientHeight;
        el.style.height = "0px";
        el.offsetHeight; // 回流
        el.style.height = `${height}px`;
      }
      /**
       * 元素隐藏
       * @param {HTMLElement} el
       */
      function hide(el) {
        if (!el) return;
        const height = el.clientHeight;
        el.style.height = `${height}px`;
        el.offsetHeight; // 回流
        el.style.height = "0px";
      }

      const el = this;
      const getShow = () => ["true", true].includes(el.getAttribute("show"));
      function update() {
        if (getShow()) {
          show(el);
        } else {
          hide(el);
        }
      }
      // 设置基础属性
      el.style.transition = "0.3s height";
      el.style.overflow = "hidden";
      el.style.display = "block";
      // 监听动画过渡
      el.addEventListener("transitionend", function() {
        if (getShow()) {
          el.style.height = "";
        } else {
          el.style.display = "none";
          // el.style.height = "";
        }
      });
      update();
      // 这个判断操作的行为是：当组件的父元一开始处于素隐藏时，这个时候获取不到真实高度，所以不运行 show 函数
      // el.clientHeight > 0 && show(el);
      // 开始监听属性变化
      const observer = new MutationObserver(function(list) {
        if (list[0].attributeName === "show") {
          update();
        }
      });
      observer.observe(el, { attributes: true });
    }
  }

  customElements.define("collapse-box", CollapseBox);

  const el = document.querySelector(".el-collapse");

  function onSwitch() {
    const value = el.getAttribute("show");
    el.setAttribute("show", value === "true" ? false : true);
  }

  window.onSwitch = onSwitch;
})();
