/**
 * fetch request
 * 打开跨域，服务器端须设置设置 response'Access-Control-Allow-Origin'
 * 转义base64: 
 * _img = _img.split('+').join('%2B').split('&').join('%26')
 * let _img = this.baseImg
 * @param {string} website 域名
 * @param {number} timeout 超时 0 或不给则不超时
 */
class FetchRequest {
    constructor(params) {
        this.website = params.website || '';
        this.timeout = params.timeout || 0;
    }
    post(url, sendData, successHandler, errorHandler, timeoutHandler) {
        let _data = '', timer = null;
        // 解析对象传参
        for (let key in sendData) _data += '&' + key + '=' + sendData[key];
        _data = _data.slice(1);
        // 检测请求类型
        if (window.fetch) {
            fetch(this.website + url, {
                // credentials: 'include', // 打开 cookie
                // mode: 'cors',           // 打开跨域
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: _data // JSON.stringify(sendData) 若后台没设置接收JSON则不行
            }).then(response => {
                // 请求状态 => 注意，这里不转换 json 下面会 undefined
                return response.json();
            }).then(successData => {
                if (timer === null) return;
                if (typeof successHandler === 'function') successHandler(successData);
                clearTimeout(timer);
                timer = null;
            }).catch(error => {
                if (timer === null) return;
                if (typeof errorHandler === 'function') errorHandler(error);
                clearTimeout(timer);
                timer = null;
            });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', this.website + url);
            // xhr.responseType = 'json';
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                if (xhr.status === 200 || xhr.status === 304) {
                    if (timer === null) return;
                    if (typeof successHandler === 'function') successHandler(JSON.parse(xhr.responseText));
                    clearTimeout(timer);
                    timer = null;
                } else {
                    if (timer === null) return;
                    if (typeof errorHandler === 'function') errorHandler(xhr);
                    clearTimeout(timer);
                    timer = null;
                }
            }
            // xhr.withCredentials = true;		// 打开cookie
            xhr.send(_data);
        }
        // 超时检测
        if (this.timeout) {
            timer = setTimeout(() => {
                if (typeof timeoutHandler === 'function') timeoutHandler();
                timer = null;
            }, this.timeout);
        } else {
            timer = 1;
        }
    }
    get(url, sendData, successHandler, errorHandler, timeoutHandler) {
        let _data = '', timer = null;
        // 解析对象传参
        for (let key in sendData) _data += '&' + key + '=' + sendData[key];
        _data = '?' + _data.slice(1);
        // 检测请求类型
        if (window.fetch) {
            fetch(this.website + url + _data).then(response => {
                return response.json();
            }).then(successData => {
                if (timer === null) return;
                if (typeof successHandler === 'function') successHandler(successData);
                clearTimeout(timer);
                timer = null;
            }).catch(error => {
                if (timer === null) return;
                if (typeof errorHandler === 'function') errorHandler(error);
                clearTimeout(timer);
                timer = null;
            })
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.website + url + _data);
            // xhr.withCredentials = true;
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                if (xhr.status === 200 || xhr.status == 304) {
                    if (timer === null) return;
                    if (typeof successHandler === 'function') successHandler(JSON.parse(xhr.responseText));
                    clearTimeout(timer);
                    timer = null;
                } else {
                    if (timer === null) return;
                    if (typeof errorHandler === 'function') errorHandler(xhr);
                    clearTimeout(timer);
                    timer = null;
                }
            }
            xhr.send(null);
        }
        // 超时检测
        if (this.timeout) {
            timer = setTimeout(() => {
                if (typeof timeoutHandler === 'function') timeoutHandler();
                timer = null;
            }, this.timeout);
        } else {
            timer = 1
        }
    }
}
let Ajax = new FetchRequest({
    website: 'http://che.qihao.lzei.com',
    timeout: 5000
});
// console.log(Ajax);

function getDataTimer() {
    Ajax.post('/api/app/parking', {
        appkey: 'e2fb20ea3f3df33310788a4247834c93',
        token: '2a11d6d67a8b8196afbcefbac3e0a573',
        page: '1',
        limit: '7',
        longitude: '113.30764968',
        latitude: '23.1200491',
        sort: 'distance',
        order: 'asc',
        keyword: ''
    }, res => {
        console.log('timerout', res);

    }, err => {
        console.warn('timerout', err);

    }, () => {
        console.log('请求超时');
    });
}

function ajaxTest() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://longrenhui.ws.6-315.com/index.php/wap/agent/mine.html');
    // xhr.responseType = 'json';
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send('deviceid=864147010086266');
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200 || xhr.status == 304) {
            console.log('XMLHttpRequest-success', JSON.parse(xhr.responseText));
        } else {
            errorHandler(xhr);
            console.warn('XMLHttpRequest-error', xhr);
        }
    }
}

// $.ajax({
//     type: "post",
//     url: "http://xxxxxxxx",
//     data: {
//         key: ''
//     },
//     success (msg) {
//         console.log(msg);
//     }
// });


/**
 * XMLHttpRequest 请求 
 * learn: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 * @param {object} param {}
 * @param {string} param.url 请求路径
 * @param {string} param.method GET 或者 POST
 * @param {object} param.data 传参对象
 * @param {Function} param.success 成功回调 
 * @param {Function} param.fail 失败回调 
 * @param {number} param.overtime 超时检测毫秒数
 * @param {Function} param.timeout 超时回调
 * @param {Function} param.progress 进度回调 貌似没什么用 
 */
function ajax(param) {
    if (typeof param !== 'object') return console.warn('ajax 缺少请求传参');
    if (!param.method) return console.warn('ajax 缺少请求类型 GET 或者 POST');
    if (!param.url) return console.warn('ajax 缺少请求 url');
    
    /** XMLHttpRequest */
    var XHR = new XMLHttpRequest();
    /** 请求方法 */
    var method = param.method.toUpperCase();
    /** 请求链接 */
    var url = param.url;
    /** 请求数据 */
    var data = null;
    /** 超时检测 */
    var overtime = param.overtime ? param.overtime : 0;

    // 传参处理
    switch (method) {
        case 'POST':
            data = param.data ? param.data : {};
            break;
    
        case 'GET':
            // 解析对象传参
            var send_data = '';
            for (var key in param.data) send_data += '&' + key + '=' + param.data[key];
            send_data = '?' + send_data.slice(1);
            url += send_data;
            break;
    }

    // 监听请求变化
    XHR.onreadystatechange = function () {
        if (XHR.readyState !== 4) return;
        if (XHR.status === 200 || XHR.status === 304) {
            if (typeof param.success === 'function') param.success(JSON.parse(XHR.responseText));
        } else {
            if (typeof param.fail === 'function') param.fail(XHR);
        }
    }

    // 判断请求进度
    if (param.progress) {
        XHR.addEventListener('progress', param.progress, false);
    }
    
    // XHR.responseType = 'json';
    // 是否Access-Control应使用cookie或授权标头等凭据进行跨站点请求。
    // XHR.withCredentials = true;	
    XHR.open(method, url, true);
    XHR.setRequestHeader('Content-Type', 'application/json');// application/x-www-form-urlencoded

    // 在IE中，超时属性只能在调用 open() 方法之后且在调用 send() 方法之前设置。
    if (overtime > 0) {
        XHR.timeout = overtime;
        XHR.ontimeout = function () {
            console.warn('ajax 请求超时 !!!');
            XHR.abort();
            if (typeof param.timeout === 'function') param.timeout(XHR);
        } 
    }

    XHR.send(data);

    return XHR;
}

var BASEURL = 'http://che.qihao.lzei.com';

ajax({
    url: BASEURL + '/api/app/parking',
    method: 'post',
    data: {
        appkey: 'e2fb20ea3f3df33310788a4247834c93',
        token: '2a11d6d67a8b8196afbcefbac3e0a573',
        page: '1',
        limit: '7',
        longitude: '113.30764968',
        latitude: '23.1200491',
        sort: 'distance',
        order: 'asc',
        keyword: ''
    },
    overtime: 5000,
    success: function (res) {
        console.log('请求成功', res);
        console.error('asf');
    },
    fail: function (err) {
        console.log('请求失败', err);
    },
    timeout: function () {
        console.log('请求超时');
    },
    progress: function (e) {
        if (e.lengthComputable) {
            var percentComplete = e.loaded / e.total
            console.log('请求进度', percentComplete, e.loaded ,e.total);
        }
        console.log(e);
    }
});

// ajax({
//     url:'http://www.runoob.com/try/ajax/ajax_info.txt',
//     method: 'get',
//     success: function (res) {
//         console.log('请求成功', res);
//     },
//     fail: function (err) {
//         console.log('请求失败', err);
//     }
// });
// Http.get('http://www.runoob.com/try/ajax/ajax_info.txt', {}, res => {
//     console.log(res);
// }, err => {
//     console.warn(err);
// });

// /** 网络请求 */
// export default class AjaxModule {
//     constructor() {
        
//     }
// }