(function () {
    const doc = document;
    /**
     * 查找单个元素
     * @param {string} name 
     * @returns {HTMLElement}
     */
    const $ = name => doc.querySelector(name);
    /** `tab`组件容器 */
    const box = $('.tab-component');
    /** `tab`导航 */
    const menu = $('.tab-menu');
    /** `tab`容器 */
    const content = $('.tab-content');
    /** 选择容器 */
    const select = $('.select');
    /** 组件宽度 */
    let width = box.getBoundingClientRect().width;
    /** 是否为`fade`切换效果 */
    let isFade = false;
    
    /**
     * 导航点击
     * @param {number} index 高亮索引 
     */
    function menuSwitch(index) {
        for (let i = 0; i < menu.children.length; i++) {
            const item = menu.children[i];
            if (i == index) {
                item.classList.add('tab-active');
            } else {
                item.classList.remove('tab-active');
            }   
        }
    }

    /**
     * 列表内容切换
     * @param {number} index 
     */
    function contentSwitch(index) {
        if (isFade) {
            content.style.display = 'none';
            setTimeout(() => {
                content.style.display = '';
            }, 1000 / 60);
        } 
        content.style.transform = `translateX(-${index * width}px)`;
    }

    function init() {
        const total = 4;
        let menuNodes = '';
        let contentNodes = '';
        for (let i = 0; i < total; i++) {
            menuNodes += `<li class="${ i == 0 ? 'tab-active' : ''}" data-index="${i}">menu-${i + 1}</li>`;
            contentNodes += `<li class="tab-content-item" style="width: ${width}px;">item-${i + 1}</li>`;
        }
        menu.innerHTML = menuNodes;
        content.innerHTML = contentNodes;
        content.style.width = total * width + 'px';
        // 给导航绑定点击事件
        menu.addEventListener('click', e => {
            const target = e.target;
            if (target.nodeName == 'LI') {
                const index = Number(target.dataset.index);
                menuSwitch(index);
                contentSwitch(index);
            }
        });
        // 给切换按钮绑定事件
        select.children[0].addEventListener('click', function () {
            // console.log(this.checked);
            isFade = this.checked;
            select.children[1].textContent = isFade ? '切换效果 fade' : '切换效果 translateX';
            content.classList.toggle('tab-content-fade');
        });
        select.children[1].textContent = isFade ? '切换效果 fade' : '切换效果 translateX';
    }
    init();

})();