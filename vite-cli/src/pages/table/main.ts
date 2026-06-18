import "@/styles/common.scss";
import "@/styles/custom-button.scss";
import "./styles/index.scss";
import { randomText, ranInt } from "@/utils";
import { createTable, exportExcelByNative, formatJson } from "./js/table";
import { exportToWindow } from "@/utils/dom";
import { messageBox } from "@/utils/message";

let id = 0;

/**
 * 图片前缀
 * [图片来源](https://lol.qq.com/data/info-heros.shtml)
 */
const photoPrefix = "https://game.gtimg.cn/images/lol/act/img";

const photoList = [
  "/champion/Talon.png",
  "/champion/Quinn.png",
  "/champion/Vladimir.png",
  "/champion/Sona.png",
  "/champion/Zed.png",
  "/champion/MissFortune.png",
  "/champion/Lux.png",
];

/**
 * 
 * @param length 
 * @returns 
 */
function useTableData(length = 10) {
  return new Array(length).fill(0).map(() => {
    id++;
    const now = Date.now();
    const start = ranInt(1, 10) * 10000;
    const state = ranInt(0, 2);
    return {
      id,
      name: randomText(10, 30),
      type: randomText(2, 4),
      user: randomText(2, 4),
      state: state,
      stateText: ["待开始", "进行中", "已结束"][state],
      createTime: new Date(now + start).toLocaleString(),
      updateTime: new Date(now + start * 2).toLocaleString(),
      photo: photoPrefix + photoList[ranInt(0, photoList.length - 1)],
    }
  });
}

const tableData = useTableData();

const table = createTable({
  el: document.body,
  data: tableData,
  columns: [
    { label: "ID", prop: "id", minWidth: "50px" },
    { label: "项目名称", prop: "name", minWidth: "200px" },
    { label: "项目类型", prop: "type", width: "140px" },
    { label: "项目创建人", prop: "user", minWidth: "140px" },
    { label: "项目状态", prop: "stateText", width: "100px" },
    { label: "创建时间", prop: "createTime", width: "160px" },
    { label: "更新时间", prop: "updateTime", width: "160px" },
    {
      label: "图片",
      prop: "photo",
      width: "100px",
      render(row, index) {
        // const image = new Image();
        // image.style.cssText = "display: block; width: 80px; height: 80px; margin: 0 auto";
        // image.src = row.photo;
        // image.alt = `${row.id}-${index}`;
        // image.onclick = function () {
        //   console.log("替换图片");
        //   image.src = photoPrefix + "/champion/Sett.png";
        //   image.onclick = null;
        // }
        // return image;
        return `<img style="display: block; width: 80px; height: 80px; margin: 0 auto" src="${row.photo}" alt="${row.id}-${index}">`;
      }
    },
    { label: "操作", prop: "actions", width: "100px" },
  ],
  actions: [
    {
      text: row => row.state === 2 ? "删除" : "不可删除",
      disabled: row => row.state != 2,
      click(row, index) {
        messageBox({
          title: "操作提示",
          content: `是否删除【${row.name}】？`,
          cancelText: "取消",
          confirm() {
            table.remove(index);
            console.log('删除后的表格数据', row.id, tableData);
          }
        });
      },
    },
  ]
});

function setTableData(isInit = false) {
  if (isInit) {
    table.update(useTableData());
  } else {
    table.add(useTableData());
  }
}

function download(insertHeader = false) {
  const id = Math.random().toString(36).slice(2);
  const list = table.data;

  const json = formatJson(list, [
    {
      header: "项目ID",
      key: "id"
    },
    {
      header: "项目名称",
      key: "name"
    },
    {
      header: "项目类型",
      key: "type"
    },
    {
      header: "项目创建人",
      key: "user"
    },
    {
      header: "项目状态",
      key: "stateText"
    },
    {
      header: "创建时间",
      key: "createTime"
    },
    {
      header: "项目缩略图",
      key: "photo",
      handle: row => row.photo || ""
    }
  ]);

  const title = (insertHeader ? "自定义表头" : "") + "表格-" + id;

  /**
   * 获取`HTML`空格符号
   * @param number 
   * @returns 
   */
  const getSpaceCode = (number = 1) => "&emsp;".repeat(number);

  const addHeader = `
  <tr><th colspan="20" style="font-size: 24px; line-height: 48px;">${title}</th></tr>
  <tr style="text-align: left; font-size: 18px; line-height: 32px;"><th colspan="20">填报单位：${getSpaceCode(10)}填报日期：${getSpaceCode(4)}年${getSpaceCode(2)}月${getSpaceCode(2)}日</th></tr>
  `;

  exportExcelByNative({
    header: json.headers,
    data: json.list,
    fileName: title,
    insertHeader: insertHeader ? addHeader : undefined
  });
}

exportToWindow({
  setTableData,
  download,
});
