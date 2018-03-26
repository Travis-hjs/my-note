function exportOne() {
    console.log('导出的函数');
}
const exportTwo = '导出的变量';

export { exportOne, exportTwo };
// ES5  (貌似要引入require再配置目前未实现)
// Object.defineProperty(exports, "__esModule", {
//   value: true
// });
// exports.exportOne = exportOne;
// exports.exportTwo = exportTwo;
