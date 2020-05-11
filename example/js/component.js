(function () {
    // learn: https://blog.csdn.net/qdmoment/article/details/102782378 

    /**
     * 作用域模式
     * @description `HTMLElement.attachShadow`设置作用域 
     */
    class UserCard extends HTMLElement {
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'open' });
            this.outputStyle();
            this.outputTemplate(this.getAttribute('name'), this.getAttribute('description'), this.getAttribute('image'), this.getAttribute('link'));
        }

        outputStyle() {
            // const style = `.user-card {
            //     display: flex;
            //     align-items: center;
            //     width: 100%;
            //     max-width: 680px;
            //     height: 180px;
            //     background-color: #d4d4d4;
            //     border: 1px solid #d5d5d5;
            //     box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
            //     border-radius: 3px;
            //     overflow: hidden;
            //     padding: 10px;
            //     box-sizing: border-box;
            //     font-family: 'Poppins', sans-serif;
            // }
            
            // .user-card a{
            //     text-decoration: none;
            //     color: inherit;
            // }

            // .user-card .head {
            //     flex: 0 0 auto;
            //     width: 160px;
            //     height: 160px;
            //     vertical-align: middle;
            //     border-radius: 5px;
            // }

            // .user-card .info {
            //     box-sizing: border-box;
            //     flex: 1;
            //     padding: 20px;
            //     height: 160px;
            // }

            // .user-card .info .name {
            //     font-size: 20px;
            //     font-weight: 600;
            //     line-height: 1;
            //     margin: 0;
            //     margin-bottom: 16px;
            // }

            // .user-card .info .email {
            //     font-size: 12px;
            //     opacity: 0.75;
            //     line-height: 1;
            //     margin: 0;
            //     margin-bottom: 15px;
            // }

            // .user-card .info .button {
            //     padding: 10px 25px;
            //     font-size: 12px;
            //     border-radius: 5px;
            //     text-transform: uppercase;
            // }`;
            // const label = document.createElement('style');
            // label.textContent = style;
            // this.shadow.className = 'user-card';
            const linkLabel = document.createElement('link');
            linkLabel.rel = 'stylesheet';
            linkLabel.href = './css/the-card.css';
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
            const box = document.createElement('div');
            box.className = 'user-card';
            box.innerHTML = `<img class="head" src="${img || ''}">
            <div class="info">
                <p class="name">${name || ''}</p>
                <p class="email">${desc || ''}</p>
                <button class="button button_blue"><a href="${link || '###'}">open link</a></button>
            </div>`;
            this.shadow.appendChild(box);
            // this.insertAdjacentHTML('beforeend', template);
        }

    }

    window.customElements.define('user-card', UserCard);

    /**
     * 无作用域模式，样式会受到外部的`css`影响
     */
    class TheInput extends HTMLElement {
        constructor() {
            super();
            this.outputTemplate();
            /**
             * 输入模式
             * @type {'capitalize'|'capitalizeEveryWord'|'normal'}
             */
            this.mode = this.getAttribute('input-mode') || 'normal';
            
        }

        outputTemplate() {
            const THAT = this;
            const input = document.createElement('input');
            input.className = 'input';
            input.placeholder = 'Please input English words';
            input.addEventListener('input', function (e) {
                // console.log(e.target.value);
                input.value = THAT.filtInput(e.target.value);
            });
            this.appendChild(input);
        }

        /**
         * 过滤输入
         * @param {string} value 输入的内容
         */
        filtInput(value) {
            let result = value;
            /**
             * 每个单词首字母大写
             * @param {string} val 
             */
            const capitalizeEveryWord = val => val.replace(/\b[a-z]/g, char => char.toUpperCase());
            /** 首字母大写 */
            const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('');
            // console.log(this.mode);
            switch (this.mode) {
                case 'capitalize':
                    result = capitalize(value);
                    break;

                case 'capitalizeEveryWord':
                    result = capitalizeEveryWord(value);
                    break;
                
                default:
                    break;
            }
            return result;
        }

    }

    window.customElements.define('the-input', TheInput);

    /**
     * 用户列表组件
     */
    class UserList extends HTMLElement {
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'open' });
            const value = this.getAttribute('total');
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
            /** `item`节点高度 */
            const itemHeight = 60;
            const names = ["海豹星人","陈佑白","青葉廚","小星仔may","邻居的窗","小铭又饿了","超人回来了","美食家大雄","芒果妈妈","八大商人","水逆寒","想有钱咯","我的偶像巨顽皮","纯良英俊的笑了笑","鲁国平先生","赵鹏飞","哈侠","锦鲤王一宝"]; 
            const images = ["https://tvax1.sinaimg.cn/crop.0.0.664.664.180/007YYPioly8gaa6txoz8ij30ig0igq3o.jpg","https://tvax2.sinaimg.cn/crop.0.0.1080.1080.180/70514322ly8gbh5tn5npbj20u00u0gpe.jpg","https://tvax3.sinaimg.cn/crop.0.0.304.304.180/83f48a0ely8gbdwaus84zj208g08habc.jpg","https://tvax3.sinaimg.cn/crop.0.0.1080.1080.180/6938bef1ly8gbcjs484nkj20u00u0q5x.jpg","https://tva1.sinaimg.cn/crop.140.163.772.772.180/81f892c2jw8ezm6blnms8j20q00q0dlt.jpg","https://tvax1.sinaimg.cn/crop.0.0.1080.1080.180/006LEXFVly8g81jxirsu9j30u00u0jun.jpg","https://tvax2.sinaimg.cn/crop.0.0.512.512.180/628458ebly8g8a12bktq0j20e80e83yt.jpg","https://tva2.sinaimg.cn/crop.2.0.636.636.180/7c9be6d9jw8f9zvk0w3tlj20hs0hoq3x.jpg","https://tva2.sinaimg.cn/crop.136.142.1797.1797.180/489e7e74jw8fa25104bgyj21kw1kwgri.jpg","https://tvax4.sinaimg.cn/crop.0.8.1125.1125.180/95e58417ly8fgon78b9ofj20v90vpgnf.jpg","https://tvax4.sinaimg.cn/crop.0.0.664.664.180/005OJAOPly8gai1q09uwtj30ig0ig0tg.jpg","https://tvax1.sinaimg.cn/crop.0.0.996.996.180/006RSw8uly8g7ohx2wpe2j30ro0rodhe.jpg","https://tvax2.sinaimg.cn/crop.0.0.751.751.180/005KFxrcly8g1prpzzuz2j30kv0kvab6.jpg","https://tvax4.sinaimg.cn/crop.0.0.1080.1080.180/65b722fcly8gb5u8wybcdj20u00u00v9.jpg","https://tvax1.sinaimg.cn/crop.0.0.1080.1080.180/441b6f80ly8g8ipmhvlpwj20u00u0449.jpg","https://tva3.sinaimg.cn/crop.0.0.180.180.180/6eb4d7aajw1e8qgp5bmzyj2050050aa8.jpg","https://tvax2.sinaimg.cn/crop.0.0.995.995.180/755d050cly8gaxda1udswj20rn0rngoh.jpg","https://tvax1.sinaimg.cn/crop.0.0.1002.1002.180/00625P6Ply8g8ic0pqzljj30ru0rumz1.jpg"]
            images.sort(() => Math.random() > 0.5 ? -1 : 1);
            names.sort(() => Math.random() > 0.5 ? -1 : 1);
            for (let i = 0; i < names.length; i++) {
                this.list.push({
                    name: names[i],
                    avatar: images[i]
                });
            }
            this.component = document.createElement('div');
            this.component.className = 'user_list';
            this.component.style.height = this.total * itemHeight + 'px';
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
            const linkLabel = document.createElement('link');
            linkLabel.rel = 'stylesheet';
            linkLabel.href = './css/user-list.css';
            this.shadow.appendChild(linkLabel);
        }

        /**
         * 输出`item`
         * @param {boolean} first 是否第一次输出
         */
        outputItem(first = false) {
            const item = document.createElement('div');
            const data = this.list[this.itemIndex];
            const box = this.component;
            const lastItem = box.lastChild;
            function getMoney() {
                const MONEY_VALUE = 100;
                let number = 0;
                number = Math.floor(Math.random() * 50 * MONEY_VALUE) + (100 * MONEY_VALUE);
                number /= MONEY_VALUE;
                return number.toFixed(2);
            }
            item.className = 'item';
            item.innerHTML = `<img class="head" src="${data.avatar}" /><div class="name">${data.name}</div><div class="value">领取了 ${getMoney()} 元</div>`;
            box.insertBefore(item, box.firstChild);
            if (!first) {
                item.addEventListener('animationend', function() {
                    box.removeChild(lastItem);
                });
            }
            this.itemIndex ++;
            if (this.itemIndex == this.list.length - 1) {
                this.itemIndex = 0;
            }
        }
    }

    window.customElements.define('user-list', UserList);

})();