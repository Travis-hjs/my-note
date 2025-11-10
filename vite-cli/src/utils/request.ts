import { checkType, isType, jsonToPath } from "./index";
import { message } from "./message";

export namespace Api {
  export interface Result<T> {
    /** 当`code === 1`时为成功 */
    code: number
    /** 响应数据 */
    data: T
    /** 接口描述 */
    msg: string
  }
}

interface RequestOption {
  url: string;
  method: "GET" | "POST";
  params?: string | object | FormData;
  headers?: Record<string, string>;
  /**
   * 接口响应类型
   * - 默认为`json`
   */
  responseType?: "json" | "blob" | "arraybuffer" | "text";
  /** 请求超时毫秒数，不传则永不超时 */
  timeout?: number;
  /**
   * 响应错误提示（默认`true`）
   * - 响应错误时展示的文本
   * - `false`时关闭错误提示
   */
  errorTips?: boolean | string;
}

/**
 * 基础请求
 * - 始终返回`Promise.resolve`
 * @param option
 */
export function request<T = any>(option: RequestOption) {
  const { url, method, params, headers = {}, responseType, timeout, errorTips = true } = option;
  const result = {
    code: -1,
    data: null,
    msg: "",
  } as Api.Result<T>;
  const dataType = checkType(params);
  let fetchUrl = url;
  let body: any = undefined;
  if (method === "GET") {
    let query = "";
    if (dataType === "object") {
      query = jsonToPath(params as object);
    } else {
      console.warn("fetch 传参处理 GET 传参有误，需要的请求参数应为 object 类型！");
    }
    if (query) {
      fetchUrl = `${url}?${query}`;
    }
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
  } else {
    body = params;
    switch (dataType) {
      case "object":
        body = JSON.stringify(params);
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }
        break;

      case "string":
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        break;

      default:
        break;
    }
  }
  return new Promise<Api.Result<T>>(function (resolve) {
    const init: RequestInit = {
      method,
      headers,
      body,
    }
    let controller: AbortController;
    let timer: number;
    if (timeout) {
      controller = new AbortController();
      init.signal = controller.signal;
    }
    function showError(tips: string) {
      if (isType(errorTips, "string")) {
        return message.error(errorTips);
      }
      if (errorTips === true) {
        return message.error(tips);
      }
    }
    fetch(fetchUrl, init).then(response => {
      if (response.ok) {
        if (responseType === "blob") {
          return response.blob();
        }
        if (responseType === "arraybuffer") {
          return response.arrayBuffer();
        }
        if (responseType === "text") {
          return response.text();
        }
        return response.json();
      }
      try {
        return response.json();
      } catch (error) {
        console.warn(`请求响应解析 JSON 出错: ${error}`);
        const code = response.status;
        return {
          code,
          message: getStatusText(code),
        }
      }
    }).then(res => {
      const text = res.message || res.msg;
      if (res.code === 200) {
        result.code = 1;
        result.data = res.data;
        result.msg = text || "ok";
      } else {
        result.code = res.code;
        result.msg = text || "请求失败！";
        showError(`code: ${res.code}; ${result.msg}`);
      }
      timer && clearTimeout(timer);
      resolve(result);
    }).catch(error => {
      result.msg = `error: ${error}`;
      showError(result.msg);
      timer && clearTimeout(timer);
      resolve(result);
    });
    if (timeout) {
      timer = setTimeout(function () {
        result.msg = "请求超时";
        message.warning(result.msg);
        resolve(result);
        controller.abort();
      }, timeout);
    }
  });
}

function getStatusText(status: number) {
  if (status >= 500) {
    return "服务器错误";
  }
  const map = {
    301: "永久重定向",
    302: "临时重定向",
    400: "请求错误",
    401: "未授权",
    403: "访问被拒绝",
    404: "请求的资源不存在",
  }
  return map[status as keyof typeof map] || "请求失败";
}
