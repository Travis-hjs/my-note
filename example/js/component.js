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
            this.outputTemplate(this.getAttribute('name'), this.getAttribute('email'), this.getAttribute('image'));
        }

        outputStyle() {
            const style = `.user-card {
                display: flex;
                align-items: center;
                width: 100%;
                max-width: 680px;
                height: 180px;
                background-color: #d4d4d4;
                border: 1px solid #d5d5d5;
                box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
                border-radius: 3px;
                overflow: hidden;
                padding: 10px;
                box-sizing: border-box;
                font-family: 'Poppins', sans-serif;
            }
            
            .user-card a{
                text-decoration: none;
                color: inherit;
            }

            .user-card .head {
                flex: 0 0 auto;
                width: 160px;
                height: 160px;
                vertical-align: middle;
                border-radius: 5px;
            }

            .user-card .info {
                box-sizing: border-box;
                flex: 1;
                padding: 20px;
                height: 160px;
            }

            .user-card .info .name {
                font-size: 20px;
                font-weight: 600;
                line-height: 1;
                margin: 0;
                margin-bottom: 16px;
            }

            .user-card .info .email {
                font-size: 12px;
                opacity: 0.75;
                line-height: 1;
                margin: 0;
                margin-bottom: 15px;
            }

            .user-card .info .button {
                padding: 10px 25px;
                font-size: 12px;
                border-radius: 5px;
                text-transform: uppercase;
            }`;
            const label = document.createElement('style');
            label.textContent = style;
            this.shadow.className = 'user-card';
            this.shadow.appendChild(label);
        }

        outputTemplate(name = 'none-name', email = 'none-email', img = '') {
            const box = document.createElement('div');
            box.className = 'user-card';
            box.innerHTML = `<img class="head" src="${img}">
            <div class="info">
                <p class="name">${name}</p>
                <p class="email">${email}</p>
                <button class="button blue-btn"><a href="https://github.com/Hansen-hjs">give star</a></button>
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

})();