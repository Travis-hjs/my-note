
// 十六进制颜色值域RGB格式颜色值之间的相互转换
(function () {
    // 十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // RGB颜色转换为16进制
    String.prototype.colorHex = function () {
        let that = this;
        if (/^(rgb|RGB)/.test(that)) {
            let aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
            let strHex = '#';
            for (let i = 0; i < aColor.length; i++) {
                let hex = Number(aColor[i]).toString(16);
                if (hex === '0') hex += hex;
                strHex += hex;
            }
            if (strHex.length !== 7) strHex = that;
            return strHex;
        } else if (reg.test(that)) {
            let aNum = that.replace(/#/, '').split('');
            if (aNum.length === 6) {
                return that;
            } else if (aNum.length === 3) {
                let numHex = '#';
                for (let i = 0; i < aNum.length; i += 1) numHex += (aNum[i] + aNum[i]);
                return numHex;
            }
        } else {
            return that;
        }
    };
    // 16进制颜色转为RGB格式
    String.prototype.colorRgb = function () {
        let rgb = this.toLowerCase();
        if (rgb && reg.test(rgb)) {
            if (rgb.length === 4) {
                let sColorNew = '#';
                for (let i = 1; i < 4; i += 1) sColorNew += rgb.slice(i, i + 1).concat(rgb.slice(i, i + 1));
                rgb = sColorNew;
            }
            //处理六位的颜色值
            let rgbList = [];
            for (let i = 1; i < 7; i += 2) rgbList.push(parseInt('0x' + rgb.slice(i, i + 2)));
            return 'RGB(' + rgbList.join(', ') + ')';
        } else {
            return rgb;
        }
    };
})();

/** 
* hex16 进制颜色转 rgb(rgba)
* @param hex 例如:'#23ff45' 
* @param opacity 透明度 
* @returns {string} 
*/
function hexToRgba(hex, opacity) {
    if (opacity) {
        return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ',' + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')';
    } else {
        return 'rgb(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ',' + parseInt('0x' + hex.slice(5, 7)) + ')';
    }
}
/**
 * rgb 转 16进制 hex
 * @param {string} color rgb
 */
function rgbToHex(color) {
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);
    var hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}
