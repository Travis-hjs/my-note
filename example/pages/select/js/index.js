class selectBoxModule {
  constructor() {
    /** 整体遮罩 */
    this.mask = document.querySelector('.mask');
    /** menu按钮列表 */
    this.menuBtns = Array.from(document.querySelectorAll('.mask .menu .menu-item'));
  }

  /** 初始化 */
  init() {
    const THAT = this;
    /** item容器列表 */
    this.selectBoxs = Array.from(document.querySelectorAll('.mask .select-list .box'));

    this.menuBtns.forEach((item, index) => {
      // 标记索引
      item['index'] = index;
      // 标记选中状态
      item['state'] = false;
      item.addEventListener('click', function () {
        THAT.menuClick(this.index);
      });
    });

    // item 添加点击事件
    this.selectBoxs.forEach((item, index) => {
      Array.from(item.children).forEach(btn => {
        btn['select'] = false;
        btn.addEventListener('click', function () {
          THAT.itemClick(this, index);
        });
      });
    });
  }

  /**
   * 菜单点击
   * @param {number} index 按钮索引 
   */
  menuClick(index) {
    /** 当前按钮选中状态 */
    let state = this.menuBtns[index]['state'];
    // console.log('状态 >>', state, index);

    switch (index) {
      case 0:
        this.menuBtns.forEach((item, index) => {
          // console.log('item >>', item, index);
          const checkbox = item.querySelector('.checkbox');
          if (state) {
            checkbox.classList.remove('checkbox_on');
            item['state'] = false;
          } else {
            checkbox.classList.add('checkbox_on');
            item['state'] = true;
          }
        });
        this.itemSelect(!state);
        break;

      case 1: case 2:
        /** 选择器容器列表 */
        const itemList = Array.from(this.selectBoxs[index].children);
        if (state) {
          this.menuBtns[index].querySelector('.checkbox').classList.remove('checkbox_on');
          itemList.forEach(item => {
            item.querySelector('.checkbox').classList.remove('checkbox_on');
            item['select'] = false;
          });
        } else {
          // console.log(itemList);
          this.menuBtns[index].querySelector('.checkbox').classList.add('checkbox_on');
          itemList.forEach(item => {
            item.querySelector('.checkbox').classList.add('checkbox_on');
            item['select'] = true;
          });
        }
        this.menuBtns[index]['state'] = !state;
        /** 是否全选 */
        let isAll = this.menuBtns[1]['state'] && this.menuBtns[2]['state'];
        // console.log('是否全选 >>', isAll);
        if (isAll) {
          this.menuBtns[0].querySelector('.checkbox').classList.add('checkbox_on');
        } else {
          this.menuBtns[0].querySelector('.checkbox').classList.remove('checkbox_on');
        }
        this.menuBtns[0]['state'] = isAll;
        break;
    }

  }

  /**
   * item选择
   * @param {boolean} all 是否全选 
   */
  itemSelect(all) {
    this.selectBoxs.forEach(item => {
      if (item.children) {
        Array.from(item.children).forEach(btn => {
          if (all) {
            btn.querySelector('.checkbox').classList.add('checkbox_on');
          } else {
            btn.querySelector('.checkbox').classList.remove('checkbox_on');
          }
          btn['select'] = all;
        });
      }
    });
  }

  /**
   * 选项点击
   * @param {Element} el 
   * @param {number} index 选项item索引
   */
  itemClick(el, index) {
    // console.log(el, index);
    if (el['select']) {
      el.querySelector('.checkbox').classList.remove('checkbox_on');
    } else {
      el.querySelector('.checkbox').classList.add('checkbox_on');
    }
    el['select'] = !el['select'];
    /** 是否当前列表选择全部 */
    let isAll = Array.from(this.selectBoxs[index].children).every(item => item['select']);
    if (isAll) {
      this.menuClick(index);
    } else {
      this.menuBtns[index].querySelector('.checkbox').classList.remove('checkbox_on');
      this.menuBtns[index]['state'] = false;
    }
  }

  /** 提交 */
  submit() {
    let btns = document.querySelectorAll('.mask .select-list .select-item');
    let idList = Array.from(btns).filter(item => item['select']).map(item => item.dataset['id']);
    console.log('id >>', idList);
    return idList;
  }

  hide() {
    this.mask.style.visibility = 'hidden';
  }

  show() {
    this.mask.style.visibility = '';
  }
}
let popBox = new selectBoxModule();


function createList() {
  let boxs = Array.from(document.querySelectorAll('.mask .select-list .box'));
  boxs.forEach((item, index) => {
    if (index > 0) {
      let html = ''
      for (let i = 0; i < 10; i++) {
        html += `<div class="select-item fvertical" data-id="${index * 100 + i}">
                  <div class="checkbox"></div>
                  <div class="text">选项${i + 1}</div>
                </div>`

      }
      item.innerHTML = html;
    }
  });
  popBox.init();
}
createList();