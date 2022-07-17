
// 类型提示用（运行时不会引用）
/// <reference path="../utils/string.js" />

/**
 * 基于`fetch`请求 [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
 * @param {"GET"|"POST"|"PUT"|"DELETE"} method 请求方法
 * @param {string} url 请求路径
 * @param {object} data 请求参数对象
 * @param {number} timeout 超时毫秒
 */
function fetchRequest(method, url, data = {}, timeout = 5000) {
  let body = null;
  let query = "";
  if (method === "GET") {
    // 解析对象传参
    for (const key in data) {
      query += `&${key}=${data[key]}`;
    }
    if (query) {
      query = "?" + query.slice(1);
    }
  } else {
    // 若后台没设置接收 JSON 则不行 需要跟 GET 一样的解析对象传参
    body = JSON.stringify(data);
  }
  return new Promise((resolve, reject) => {
    fetch(url + query, {
      // credentials: "include",  // 携带cookie配合后台用
      // mode: "cors",            // 貌似也是配合后台设置用的跨域模式
      method: method,
      headers: {
        "Content-Type": "application/json"
        // "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body
    }).then(response => {
      // 把响应的信息转为`json`
      return response.json();
    }).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
    setTimeout(reject.bind(this, "fetch is timeout"), timeout);
  });
}

const apiUrl = "http://wthrcdn.etouch.cn/weather_mini";

const cityList = ["北京", "上海", "广州", "深圳"];

function getCity() {
  const city = cityList[Math.floor(Math.random() * cityList.length)];
  return encodeURIComponent(city);
}

function clickFetchRequest() {
  fetchRequest("GET", apiUrl, {
    city: getCity()
  }).then(res => {
    console.log("Fetch success", res);
  }).catch(err => {
    console.warn("Fetch fail", err);
  })
}

/**
 * `XMLHttpRequest`请求 [MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
 * @param {object} params 传参对象
 * @param {string} params.url 请求路径
 * @param {"GET"|"POST"|"PUT"|"DELETE"} params.method 请求方法
 * @param {object|FormData|string} params.data 传参对象，json、formdata、普通表单字符串
 * @param {{ [key: string]: string }} params.headers `XMLHttpRequest.header`设置对象
 * @param {number?} params.overtime 超时检测毫秒数
 * @param {(result?: any, response: XMLHttpRequest) => void} params.success 成功回调 
 * @param {(error?: XMLHttpRequest) => void} params.fail 失败回调 
 * @param {(info?: XMLHttpRequest) => void} params.timeout 超时回调
 * @param {(res?: ProgressEvent<XMLHttpRequestEventTarget>) => void} params.progress 进度回调（暂时没用到）
 * @param {"arraybuffer"|"blob"|"document"|"json"|"text"} params.responseType 响应结果类型，默认`json`
 */
function ajax(params) {
  if (checkType(params) !== "object") return console.error("ajax 请求参数类型有误");
  if (!params.method) return console.error("ajax 缺少请求方法");
  if (!params.url) return console.error("ajax 缺少请求 url");

  const XHR = new XMLHttpRequest();
  /** 请求方法 */
  const method = params.method;
  /** 超时检测 */
  const overtime = checkType(params.overtime) === "number" ? params.overtime : 0;
  /** 请求链接 */
  let url = params.url;
  /** 非`GET`请求传参 */
  let body = "";
  /** `GET`请求传参 */
  let query = "";
  /** 传参数据类型 */
  const dataType = checkType(params.data);

  // 传参处理
  if (method === "GET") {
    // 解析对象传参
    if (dataType === "object") {
      for (const key in params.data) {
        query += "&" + key + "=" + params.data[key];
      }
    } else {
      console.warn("ajax 传参处理 GET 传参有误，需要的请求参数应为 object 类型");
    }
    if (query) {
      query = "?" + query.slice(1);
      url += query;
    }
  } else {
    body = dataType === "object" ? JSON.stringify(params.data) : params.data;
  }

  // 监听请求变化；XHR.status learn: http://tool.oschina.net/commons?type=5
  XHR.onreadystatechange = function () {
    if (XHR.readyState !== 4) return;
    if (XHR.status === 200 || XHR.status === 304) {
      typeof params.success === "function" && params.success(XHR.response, XHR);
    } else {
      typeof params.fail === "function" && params.fail(XHR);
    }
  }

  // 判断请求进度
  if (params.progress) {
    XHR.addEventListener("progress", params.progress);
  }
  
  XHR.responseType = params.responseType || "json"; // TODO: 设置响应结果为`json`这个一般由后台返回指定格式，前端无配置
  // XHR.withCredentials = true;	// 是否Access-Control应使用cookie或授权标头等凭据进行跨站点请求。
  XHR.open(method, url, true);

  // 设置对应的传参请求头，GET 方法不需要
  if (params.method !== "GET") {
    switch (dataType) {
      case "object":
        XHR.setRequestHeader("Content-Type", "application/json"); // `json`请求
        break;

      case "string":
        XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // 表单请求，非`new FormData`
        break;

      default:
        break;
    }
  }

  // 判断设置配置头信息
  if (params.headers) {
    for (const key in params.headers) {
      const value = params.headers[key];
      XHR.setRequestHeader(key, value);
    }
  }

  // 在IE中，超时属性只能在调用 open() 方法之后且在调用 send() 方法之前设置。
  if (overtime > 0) {
    XHR.timeout = overtime;
    XHR.ontimeout = function () {
      console.warn("XMLHttpRequest 请求超时 !!!");
      XHR.abort();
      typeof params.timeout === "function" && params.timeout(XHR);
    }
  }

  XHR.send(body);
}

function ajaxRequest() {
  const error = {
    message: "",
    info: null
  }
  ajax({
    url: apiUrl,
    method: "GET",
    data: {
      city: getCity()
    },
    overtime: 5000,
    success: function (res, response) {
      console.log("xhr success >>", res);
      console.log("XMLHttpRequest 对象 >>", response);
    },
    fail: function (err) {
      error.message = "接口报错，请看 network";
      error.info = err;
      if (err.response.charAt(0) == "{") {
        error.info = JSON.parse(err.response);
      }
      console.log("xhr fail >>", error);
    },
    timeout: function (info) {
      error.message = "请求超时";
      error.info = info;
      console.log("xhr timeout >>", error);
    },
    progress: function (e) {
      if (e.lengthComputable) {
        let percentComplete = e.loaded / e.total;
        console.log("请求进度 >>", percentComplete, e.loaded, e.total);
      }
      console.log("xhr progress >>", e);
    }
  });
}
