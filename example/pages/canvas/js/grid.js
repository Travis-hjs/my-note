function start() {
  /** canvas标签 */
  const canvas = document.createElement("canvas");
  /** canvas 2d 属性 */
  const context = canvas.getContext("2d");
  // 生成 canvas
  document.body.appendChild(canvas);
  /** 宽高 */
  let size = Math.max(window.innerWidth, window.innerHeight);
  canvas.width = size;
  canvas.height = size;
  let n = 12;
  let u = size / n;
  /** 时间 */
  let time = 0;
  let slice = 2 * Math.PI / 3;
  /** 速度 */
  let speed = 0.08;
  /** 圆角半径 */
  let radius = 0.58;
  let r3d2 = Math.sqrt(3) / 2;
  function draw() {
    time++;
    size = Math.max(window.innerWidth, window.innerHeight);
    u = size / n;
    canvas.width = size;
    canvas.height = size;
    context.fillStyle = "transparent";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    context.lineWidth = u * 0.1;
    for (let y = 0; y <= n + 2; y++) {
      for (let x = 0; x <= n; x++) {
        for (let l = 0; l < 3; l++) {
          let d = Math.sqrt(Math.pow(Math.abs(x - (n / 2)), 2) +
            Math.pow(Math.abs(y - (n / 2)), 2)) * 0.05;
          let ta = speed * (time + (1000 - (d * 100)));
          let angle = ((ta * 2 / n) + ((1 + Math.sin(ta)) * 2 / n) + (slice / 2.37)) % 360;
          context.strokeStyle = `hsl(${80 + angle * 540 / Math.PI}, 100%, 50%)`;
          context.beginPath();
          context.moveTo(
            (x * u) + (u / 2 * (y % 2)),
            (y * u * r3d2)
          );
          context.lineTo(
            (x * u) + (Math.cos(angle + (l * slice)) * u * radius) + (u / 2 * (y % 2)),
            (y * u * r3d2) + (Math.sin(angle + (l * slice)) * u * radius)
          );
          context.stroke();
        } // l loop
      } // x loop
    } // y loop
    requestAnimationFrame(draw);
  };
  draw();
}
start();

