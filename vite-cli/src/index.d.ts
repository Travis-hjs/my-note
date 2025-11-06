interface Window {
  /**
   * 当前页面版本号
   * - 时间戳
   * - `vite`项目构建后添加的全局变量
   */
  _version: number;
}

/**
 * `JavaScript`类型映射表
 * - 这里只枚举一些常见类型，后续根据使用场景自行添加即可
 */
interface JavaScriptType {
  string: string;
  number: number;
  boolean: boolean;
  null: null;
  undefined: undefined;
  array: Array<any>;
  object: object;
  regexp: RegExp;
  function: Function;
  asyncfunction: (...params: any) => Promise<any>;
  promise: Promise<any>;
  formdata: FormData;
}

/** `JavaScript`类型 */
type JavaScriptTypes = keyof JavaScriptType;
