/**
 * 给图片添加水印，并返回`base64`
 * @param {object} params
 * @param {string} params.img 图片地址，支持CDN和base64
 * @param {string} params.title 水印标题
 * @param {string=} params.desc 水印描述
 * @param {"jpeg"|"png"=} params.type 生成图片的类型，默认`"jpeg"`
 * @param {string=} params.color 水印颜色，默认`rgba(255, 255, 255, 0.5)`
 * @param {number=} params.markSize 水印矩阵宽高（默认150）
 * @param {number=} params.fontSize 水印字体大小（默认12）
 * @param {number=} params.angle 水印旋转的角度（默认315则-45）
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
    const desc = params.desc || "";
    const fontSize = params.fontSize || 12;
    const angle = params.angle || 315;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${fontSize}px Microsoft Yahei`;
    ctx.fillStyle = params.color || "rgba(255, 255, 255, 0.5)";
    // TODO: 必须要设置完字体样样式大小再获取字体高度
    // const titleWidth = ctx.measureText(title).width;
    // const descWidth = ctx.measureText(desc).width;
    ctx.translate(radius, radius);
    ctx.rotate(angle * Math.PI / 180);
    ctx.translate(-radius, -radius);
    if (desc) {
      ctx.fillText(title, radius, radius - fontSize);
      ctx.fillText(desc, radius, radius + fontSize * 0.6);
    } else {
      ctx.fillText(title, radius, radius);
    }
    return mark;
  }
  return new Promise(function (resolve) {
    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      context.fillStyle = context.createPattern(getDrawMark(), "repeat");
      context.fillRect(0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL(`image/${params.type || "jpeg"}`, 1);
      resolve(base64);
      canvas.remove();
    }
    image.onerror = function () {
      resolve("");
      canvas.remove();
    }
  });
}

getWaterMarkImage({
  // img: "./img/big-2.jpg",
  img: "http://street-statistics.oss-cn-guangzhou.aliyuncs.com/images/group-14/41-1668504089464-2022-11-15_17.21.22.jpg",
  title: "测试测试测试",
  desc: new Date().toLocaleString(),
  markSize: 200,
  angle: -30
}).then(base64 => {
  if (base64) {
    const img = document.createElement("img");
    img.src = base64;
    img.style.cssText = "display: block; width: 500px";
    document.body.appendChild(img);
  }
});

function rotateTest() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const size = 200;
  const radius = size / 2;
  canvas.width = size;
  canvas.height = size;
  canvas.style.cssText = "border: 1px solid orange";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `20px Microsoft Yahei`;

  let angle = 0;

  function run() {
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "orange";
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(radius, radius); // 先偏移至矩阵中心
    ctx.rotate(angle * Math.PI / 180);
    ctx.translate(-radius, -radius); // 旋转完之后复原位置
    ctx.fillText("content", radius, radius);
    ctx.strokeRect(0, 0, size, size);
    // ctx.fillRect(0, 0, size, size);
    ctx.restore();
    angle++;
    requestAnimationFrame(run);
  }

  document.body.appendChild(canvas);
  run();
}

rotateTest();


