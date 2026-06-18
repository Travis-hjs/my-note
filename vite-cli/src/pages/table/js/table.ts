namespace CustomTable {
  interface Column<T> {
    /** 标题 */
    label: string;
    /**
     * 数据键值
     * - 当`prop: "actions"`时固定为靠右操作列
     */
    prop: keyof T | "actions";
    /** 列宽 */
    width?: string;
    /** 最小列宽 */
    minWidth?: string;
    /**
     * 自定义渲染函数
     * @param row
     * @param index
     */
    render?: (row: T, index: number) => string | HTMLElement;
  }

  interface Action<T> {
    /**
     * 按钮文字
     */
    text: string | ((row: T, index: number) => string);
    /**
     * 按钮点击事件
     * @param row 当前表格行数据对象
     * @param index 行索引
     */
    click?: (row: T, index: number) => void;
    /** 按钮禁用条件 */
    disabled?: boolean | ((row: T) => boolean);
    /** 按钮类名 */
    className?: string;
  }

  export interface Props<T> {
    /** 表格挂载的节点 */
    el: HTMLElement;
    /** 表格数据 */
    data: Array<T>;
    /** 表格列配置 */
    columns: Array<Column<T>>;
    /**
     * 操作列表
     * - 当`option.columns`中存在`prop: "actions"`时生效
     */
    actions?: Array<Action<T>>;
  }
}

/**
 * 生成表格到指定节点中
 * @param option 
 */
export function createTable<T extends object>(option: CustomTable.Props<T>) {
  const styleId = "the-table-style";
  if (!document.getElementById(styleId)) {
    const cssText = `
    .the-table,
    .the-table thead,
    .the-table tbody,
    .the-table th,
    .the-table tr,
    .the-table td,
    .the-table-btn {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .the-table {
      width: 100%;
      --border: solid 1px #eee;
      --padding: 8px 6px;
      --transition: .24s all;
      --head-bg: #fafafa;
      --head-color: #333;
      --head-size: 15px;
      --head-height: 50px;
      --striped-bg: #fafafa;
      --column-size: 14px;
      --column-height: 44px;
      --column-line-height: 22px;
      --column-color: #555;
      --row-hover-bg: #f0f9eb;
      --cell-btn-bg: #42b883;
      background-color: #fff;
      border-spacing: 0;
      border-collapse: collapse;
      border: var(--border);
    }
    .the-table th, .the-table td {
      border: var(--border);
      word-break: break-all;
    }
    .the-table-header {
      background-color: var(--head-bg);
      text-align: center;
    }
    .the-table-header th {
      height: var(--head-height);
      font-size: var(--head-size);
      color: var(--head-color);
      padding: var(--padding);
    }
    .the-table-body td {
      height: var(--column-height);
      padding: var(--padding);
      font-size: var(--column-size);
      color: var(--column-color);
      line-height: var(--column-line-height);
      text-align: center;
    }
    .the-table-body tr {
      transition: var(--transition);
    }
    .the-table-body tr:nth-child(even) {
      background-color: var(--striped-bg);
    }
    .the-table-body tr:hover {
      background-color: var(--row-hover-bg);
    }
    .the-table-btn {
      border: none;
      outline: none;
      padding: 0 8px;
      border-radius: 2px;
      background-color: transparent;
      cursor: pointer;
      line-height: 1;
      font-size: var(--column-size);
      height: var(--column-line-height);
      transition: var(--transition);
      color: var(--cell-btn-bg);
    }
    .the-table-btn:hover {
      background-color: var(--striped-bg);
    }
    .the-table-btn:disabled {
      color: #999;
      cursor: no-drop;
    }
    `;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = cssText;
    document.head.appendChild(style);
  }

  const map = {
    table: { class: "the-table", tag: "table" },
    header: { class: "the-table-header", tag: "thead" },
    body: { class: "the-table-body", tag: "tbody" },
    row: { class: "", tag: "tr" },
    column: { class: "", tag: "td" },
    tcolumn: { class: "", tag: "th" },
    btn: { class: "the-table-btn", tag: "button" }
  }

  /**
   * 创建表格元素
   * @param type 
   * @param styles 要设置的样式
   */
  function createElement(type: keyof typeof map, styles?: Partial<CSSStyleDeclaration>) {
    const el = document.createElement(map[type].tag);
    map[type].class && (el.className = map[type].class);
    if (styles) {
      for (const key in styles) {
        el.style[key] = styles[key]!;
      }
    }
    return el;
  }

  const table = createElement("table");
  const tableHeader = createElement("header");
  const tableBody = createElement("body");
  table.append(tableHeader, tableBody);
  option.el.appendChild(table);

  /**
   * 获取表格栏的宽度样式
   * @param column 
   */
  function getStyle(column: { width?: string; minWidth?: string }) {
    return {
      width: column.width,
      minWidth: column.minWidth || column.width
    }
  }

  function renderHeader() {
    const columns = option.columns.map(column => {
      const el = createElement("tcolumn", getStyle(column));
      el.textContent = column.label || "-";
      return el;
    });
    tableHeader.append(...columns);
  }

  /**
   * 内部缓存的表格数据，点击时需要
   */
  let _tableData: Array<T> = [];

  /**
   * 渲染表格
   * @param tableData 
   * @param isPush 是否添加新数据
   */
  function renderBody(tableData: Array<T>, isPush = false) {
    if (!Array.isArray(tableData)) return console.warn("传入的表格数据有误");
    let rowIndex = isPush ? _tableData.length : 0;
    const rowEls = tableData.map(row => {
      const columnEls = option.columns.map(column => {
        const columnEl = createElement("column", getStyle(column));
        let btnEls: Array<HTMLButtonElement> = [];
        if (column.prop === "actions" && option.actions) {
          btnEls = option.actions.map((btn, bIndex) => {
            const btnEl = createElement("btn") as HTMLButtonElement;
            btn.className && btnEl.classList.add(btn.className);
            btnEl.disabled = typeof btn.disabled === "function" ? !!btn.disabled(row) : !!btn.disabled;
            btnEl.textContent = typeof btn.text === "function" ? btn.text(row, rowIndex) : btn.text;
            btnEl.dataset["row"] = rowIndex.toString();
            btnEl.dataset["index"] = bIndex.toString();
            return btnEl;
          });
        }
        if (btnEls.length) {
          columnEl.append(...btnEls);
        } else {
          if (typeof column.render === "function") {
            const value = column.render(row, rowIndex);
            if (typeof value === "string") {
              columnEl.innerHTML = value || "-";
            }
            if (typeof value === "object" && value instanceof HTMLElement) {
              columnEl.append(value);
            }
          } else {
            columnEl.textContent = (row as any)[column.prop] || "-";
          }
        }
        return columnEl;
      });
      rowIndex++;
      const rowEl = createElement("row");
      rowEl.append(...columnEls);
      return rowEl;
    });
    if (isPush) {
      _tableData = _tableData.concat(tableData);
    } else {
      _tableData = tableData;
      tableBody.innerHTML = "";
    }
    tableBody.append(...rowEls);
  }

  renderHeader();

  renderBody(option.data);

  table.addEventListener("click", e => {
    const btn = e.target as HTMLButtonElement;
    if (btn && btn.tagName && btn.tagName.toLocaleLowerCase() === "button") {
      const rowIndex = Number(btn.dataset["row"]);
      const actionIndex = Number(btn.dataset["index"]);
      const action = option.actions ? option.actions[actionIndex] : undefined;
      action && action.click && action.click(_tableData[rowIndex], rowIndex);
    }
  });

  return {
    /** 
     * 更新整个表格数据
     * @param data
     */
    update(data: Array<T>) {
      renderBody(data);
    },
    /**
     * 累加数据
     * @param data
     */
    add(data: Array<T>) {
      renderBody(data, true);
    },
    /**
     * 删除指定索引行
     * @param index 
     */
    remove(index: number) {
      const els = tableBody.children;
      els[index].remove();
      _tableData.splice(index, 1);
      // 更新之前绑定的索引
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        const btns = el.querySelectorAll("button");
        for (let j = 0; j < btns.length; j++) {
          const btn = btns[j];
          if (Number(btn.dataset.row) !== i) {
            btn.dataset.row = i.toString();
          }
        }
      }
    },
    /** 
     * 当前表格数据
     */
    get data() {
      return JSON.parse(JSON.stringify(_tableData)) as Array<T>;
    }
  }
}

interface FormatJsonOption<T> {
  /** 表头字段 */
  header: string
  /** 对应表头的字段`key` */
  key: keyof T
  /** 
   * 条件处理函数
   * @param item 表单当前项
   * @param index 索引
   */
  handle?: (item: T, index: number) => number | string
}

/**
 * 格式化`json`返回导出表格需要的数据
 * @param target 处理的目标数组
 * @param options 处理配置数组，字段顺序按照这个来
 */
export function formatJson<T>(target: Array<T>, options: Array<FormatJsonOption<T>>) {
  const headers = options.map((item) => item.header);
  const list: Array<Array<any>> = [];

  for (let i = 0; i < target.length; i++) {
    const item = target[i];
    list[i] = [];
    for (let j = 0; j < options.length; j++) {
      const option = options[j];
      const key = option.key;
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        if (option.handle) {
          list[i].push(option.handle(item, i));
        } else {
          list[i].push(item[key]);
        }
      } else {
        console.warn("function formatJson >> item 中不存在对应的 key 值");
      }
    }
  }
  return {
    headers,
    list,
  };
}

interface NativeExportOptions {
  /** 表格头部列表 */
  header: Array<string>
  /**
   * 添加的表格头部
   * - 在固定头部的前面插入
   */
  insertHeader?: string
  /** 导出的表格数据（二维数组） */
  data: Array<Array<string | number>>
  /** 导出的文件名 */
  fileName: string
  /** 表格文字排版 */
  textAlign?: "left" | "center" | "right"
  /** 图片尺寸配置 */
  imgSize?: {
    /** 图片宽度，默认 100 */
    width?: number
    /** 图片宽度，默认 100 */
    height?: number
  }
}

/**
 * 原生导出`Excel`函数
 * @param option
 */
export function exportExcelByNative(option: NativeExportOptions) {
  /** 字符串中包含`http`则默认为图片地址 */
  const reg = /http/;
  /** 表头的长度 */
  const headLength = option.header.length;
  /** 记录条数 */
  const tableLength = option.data.length;
  /** 设置图片大小 */
  const width = option.imgSize?.width || 100;
  /** 图片高度 */
  const height = option.imgSize?.height || 100;

  // 添加表头信息
  let thead = `<thead>${option.insertHeader || ""}<tr>`;
  for (let i = 0; i < headLength; i++) {
    thead += `<th>${option.header[i]}</th>`;
  }
  thead += "</tr></thead>";

  // 添加每一行数据
  let tbody = "<tbody>";

  for (let i = 0; i < tableLength; i++) {
    tbody += "<tr>";
    const rows = option.data[i];
    for (let j = 0; j < rows.length; j++) {
      const row = rows[j];
      // 如果为图片，则需要加 div包住图片
      if (reg.test(row.toString())) {
        tbody += `<td style="width: ${width}px; height: ${height}px; text-align: center; vertical-align: middle">
                    <div style="display: inline">
                        <img src="${row}" width="${width}" height="${height}">
                    </div>
                </td>`;
      } else {
        tbody += `<td style="text-align: ${option.textAlign || "left"}">${row}</td>`;
      }
    }
    tbody += "</tr>";
  }

  tbody += "</tbody>";

  const ctx = {
    worksheet: option.fileName,
    table: thead + tbody,
  };
  // return console.log(ctx);

  // 编码要用`utf-8`不然默认`gbk`会出现中文乱码
  const prefix = "data:application/vnd.ms-excel;base64,";
  const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>`;

  function base64(val: string) {
    const bytes = new TextEncoder().encode(val);
    let binary = "";
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return window.btoa(binary);
  }

  function format(value: string, info: Record<string, string>) {
    return value.replace(/{(\w+)}/g, (_, p) => {
      return info[p];
    });
  }

  // 创建下载
  const label = document.createElement("a");
  label.setAttribute("href", `${prefix}` + base64(format(template, ctx)));
  label.setAttribute("download", option.fileName);
  document.body.appendChild(label);
  label.click();
  label.remove();
}
