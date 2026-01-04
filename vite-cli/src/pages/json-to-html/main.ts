import "@/styles/common.scss";
import { find, jsonToHtml } from "@/utils/dom";

const obj = {
  id: 12,
  name: "the object",
  info: {
    desc: "this is a text",
    sub: {
      date: "2024-12-22"
    }
  },
  ids: [1, 2, 3],
  list: [
    {
      id: 1,
      value: "content-1",
      uuid: undefined
    },
    {
      id: 2,
      value: "content-2",
      uuid: null
    }
  ]
}

find(".app").innerHTML = jsonToHtml(JSON.stringify(obj));
