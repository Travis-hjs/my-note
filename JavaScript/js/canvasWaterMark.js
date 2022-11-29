/**
 * 给图片添加水印
 * @param {object} params
 * @param {string} params.img 图片地址
 * @param {string} params.title 水印标题
 * @param {string=} params.desc 水印描述，默认时间日期
 * @param {"jpeg"|"png"=} params.type 生成图片的类型，默认`"jpeg"`
 * @param {string=} params.color 水印颜色，默认`rgba(255, 255, 255, 0.4)`
 * @param {number=} params.markSize 水印矩阵宽高（默认150）
 * @param {number=} params.markFontSize 水印字体大小（默认12）
 * @returns {Promise<string>}
 */
function getWaterMarkImage(params) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.style.cssText = "position: fixed; top: -110%; left: -110%; z-index: -10;";
  document.body.appendChild(canvas);
  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = params.img;
  function getDrawMark() {
    const mark = document.createElement("canvas");
    const markSize = params.markSize || 150;
    const radius = markSize / 2;
    mark.width = markSize;
    mark.height = markSize;
    const ctx = mark.getContext("2d");
    const title = params.title || "";
    const desc = params.desc || new Date().toLocaleString();
    const fontSize = params.markFontSize || 12;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `${fontSize}px Microsoft Yahei`;
    ctx.fillStyle = params.color || "rgba(255, 255, 255, 0.5)";
    // TODO: 必须要设置完字体样样式大小再获取字体高度
    // const titleWidth = ctx.measureText(title).width;
    // const descWidth = ctx.measureText(desc).width;
    const angle = 45;
    ctx.translate(-(radius / 2), radius);
    ctx.rotate(-angle * Math.PI / 180);
    ctx.fillText(title, radius, radius - fontSize);
    ctx.fillText(desc, radius, radius + fontSize * 0.6);
    return mark;
  }
  return new Promise(function(resolve) {
    image.onload = function() {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      context.fillStyle = context.createPattern(getDrawMark(), "repeat"); 
      context.fillRect(0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL(`image/${params.type || "jpeg"}`, 1);
      resolve(base64);
      canvas.remove();
    }
    image.onerror = function() {
      resolve("");
      canvas.remove();
    }
  });
}

getWaterMarkImage({
  img: "http://street-statistics.oss-cn-guangzhou.aliyuncs.com/images/group-14/41-1668504089464-2022-11-15_17.21.22.jpg",
  title: "测试测试测试",
  markSize: 200,
}).then(base64 => {
  if (base64) {
    const img = document.createElement("img");
    img.src = base64;
    img.style.display = "block";
    img.style.width = "500px";
    document.body.appendChild(img);
  }
});

/**
 * 测试
 * @param {object} params
 * @param {string} params.img 图片地址
 * @param {string} params.title 水印标题
 * @param {string=} params.desc 水印描述，默认时间日期
 * @param {"jpeg"|"png"=} params.type 生成图片的类型，默认`"jpeg"`
 * @param {string=} params.color 水印颜色，默认`rgba(255, 255, 255, 0.4)`
 */
function getDrawMark(params) {
  const mark = document.createElement("canvas");
  const markSize = 200;
  mark.width = markSize;
  mark.height = markSize;
  const radius = markSize / 2;
  const fontSize = 18;
  
  // mark.width = waterMarkSize;
  // mark.height = waterMarkSize;
  mark.style.cssText = `border: solid 1px orange; margin-bottom: 10px`;
  const ctx = mark.getContext("2d");

  // ctx.beginPath();
  // ctx.fillStyle = "orange";
  // ctx.fillRect(0, 0, markSize, markSize);
  // ctx.closePath();

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = `${fontSize}px Microsoft Yahei`;
  // ctx.fillStyle = params.color || "rgba(255, 255, 255, 0.5)";
  
  const title = params.title || "";
  const desc = params.desc || new Date().toLocaleString();
  // const titleWidth = ctx.measureText(title).width;
  // const descWidth = ctx.measureText(desc).width;

  ctx.fillStyle = params.color || "rgba(255, 255, 255, 0.5)";
  const angle = 45;
  const val = Math.sqrt(markSize * markSize * 2);
  // console.log(descWidth);
  ctx.translate(-(radius / 2), radius);
  ctx.rotate(-angle * Math.PI / 180);
  // ctx.fillText(desc, radius, radius);
  ctx.fillText(title, radius, radius - fontSize);
  ctx.fillText(desc, radius, radius + fontSize / 2);
  
  return mark;
}

document.body.appendChild(getDrawMark({ title: "标题标题标题", color: "#000" }));
