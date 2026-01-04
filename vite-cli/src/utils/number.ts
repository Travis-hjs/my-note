
interface Coordinate {
  x: number;
  y: number;
}

/**
 * 获取两个坐标（二维）之间距离
 * @param size1 坐标一
 * @param size2 坐标二
 */
export function getSizeDistance(size1: Coordinate, size2: Coordinate) {
  const dx = size2.x - size1.x;
  const dy = size2.y - size1.y;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  // return hypot(size2.x - size1.x, size2.y - size1.y);
}
