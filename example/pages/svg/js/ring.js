/**
 * 绘制一个 svg 圆环
 * @param {object} params
 * @param {HTMLElement} params.el
 * @param {number=} params.size 整体大小，不传则根据外部节点大小自适应
 * @param {number=} params.strokeWidth 绘制的线宽，不传则根据外部节点大小自适应(20%)
 * @param {Array<{ color: string; percentage: number; }>} params.configs 配置项列表，请确保`percentage`的和加起来要等于`100`
 */
function createRing(params) {
  const { el, configs } = params;
  if (!el) return console.warn("svg 缺少挂载元素节点 el 属性");
  if (!configs || !configs.length) return console.warn("配置项 configs 不能为空且长度不能为 0");
  const size = params.size || Math.min(el.clientWidth, el.clientHeight);
  const strokeWidth = params.strokeWidth || size * 0.2;
  /** 半径 */
  const radius = (size - strokeWidth) / 2;
  /** 圆周长 */
  const circumference = 2 * Math.PI * radius;
  /** 每段的起始位置偏移 */
  let dashOffset = circumference * 0.75; // 将起始点设置为 12 点钟方向
  const svgNS = `${location.protocol === "https:" ? "https:" : "http:"}//www.w3.org/2000/svg`;
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", size.toString());
  svg.setAttribute("height", size.toString());
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  // 处理只有一条数据的情况
  if (configs.length === 1) {
    configs.push({ color: "#f0f0f0", percentage: 100 - configs[0].percentage });
  }
  // 最后循环输出即可
  configs.forEach((segment) => {
    const circle = document.createElementNS(svgNS, "circle");
    const { color, percentage } = segment;
    /** 当前段的长度 */
    const segmentLength = (percentage / 100) * circumference;
    /** 间隙部分 */
    const gap = circumference - segmentLength;
    circle.setAttribute("cx", (size / 2).toString());
    circle.setAttribute("cy", (size / 2).toString());
    circle.setAttribute("r", radius.toString());
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", color);
    circle.setAttribute("stroke-width", strokeWidth.toString());
    circle.setAttribute("stroke-dasharray", `${segmentLength} ${gap}`);
    circle.setAttribute("stroke-dashoffset", `-${dashOffset}`);
    svg.appendChild(circle);
    dashOffset += segmentLength; // 更新下一段的偏移量
  });
  el.appendChild(svg);
}

createRing({
  el: document.querySelector(".svg-box"),
  configs: [
    { color: "#409eff", percentage: 20 },
    { color: "orange", percentage: 30 },
    { color: "#4caf50", percentage: 12 },
    { color: "#9e019e", percentage: 38 },
  ],
});

// /**
//  * 圆环 svg 组件
//  * @param {object} props
//  * @param {number} props.size 整体大小
//  * @param {number=} props.strokeWidth 绘制的线宽，不传则使用`size * 0.2`
//  * @param {Array<{ color: string; percentage: number; }>} props.configs 配置项列表，请确保`percentage`的和加起来要等于`100`
//  */
// function RingSvg(props) {
//   /** @type {typeof props.configs} */
//   const list = JSON.parse(JSON.stringify(props.configs));
//   const size = props.size;
//   const strokeWidth = props.strokeWidth || size * 0.2;
//   /** 半径 */
//   const radius = (size - strokeWidth) / 2;
//   /** 圆周长 */
//   const circumference = 2 * Math.PI * radius;
//   /** 每段的起始位置偏移 */
//   let dashOffset = circumference * 0.75; // 将起始点设置为 12 点钟方向
//   // 处理只有一条数据的情况
//   if (list.length === 1) {
//     list.push({ color: "#f0f0f0", percentage: 100 - list[0].percentage });
//   }
//   return (
//     <svg>
//       {list.map((segment, index) => {
//         const { color, percentage } = segment;
//         /** 当前段的长度 */
//         const segmentLength = (percentage / 100) * circumference;
//         /** 间隙部分 */
//         const gap = circumference - segmentLength;
//         const circle = (
//           <circle
//             key={index}
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             fill="none"
//             stroke={color}
//             strokeWidth={strokeWidth}
//             strokeDasharray={`${segmentLength} ${gap}`}
//             strokeDashoffset={-dashOffset}
//           />
//         );
//         dashOffset += segmentLength; // 更新下一段的偏移量
//         return circle;
//       })}
//     </svg>
//   );
// }
