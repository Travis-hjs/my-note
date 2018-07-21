/**
 * fetch request
 * 打开跨域，服务器端须设置设置 response'Access-Control-Allow-Origin'
 * 转义base64: 
 * _img = _img.split('+').join('%2B').split('&').join('%26')
 * let _img = this.baseImg
 * @param {*} website 域名
 * @param {*} timeout 超时 0 或不给则不超时
 * @param {*} timer 定时器
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
 * ES5 原型链模式，没有超时检测（最初的做法）
 * @param {*} params website 域名
 */
var HttpRequest = function (params) {
    this.website = params.website || '';
}
HttpRequest.prototype = {
    post: function (url, sendData, successHandler, errorHandler) {
        var _data = '';
        for (var key in sendData) _data += '&' + key + '=' + sendData[key];
        _data = _data.slice(1);
        if (window.fetch) {
            fetch(this.website + url, {
                // credentials: 'include', 
                // mode: 'cors',           
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: _data
            }).then(function (response) {
                return response.json();
            }).then(function (successData) {
                if (typeof successHandler === 'function') successHandler(successData);
            }).catch(function (error) {
                if (typeof errorHandler === 'function') errorHandler(error);
            });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', this.website + url);
            // xhr.responseType = 'json';
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                if (xhr.status === 200 || xhr.status === 304) {
                    if (typeof successHandler === 'function') successHandler(JSON.parse(xhr.responseText));
                } else {
                    if (typeof errorHandler === 'function') errorHandler(xhr);
                }
            }
            // xhr.withCredentials = true;		
            xhr.send(_data);
        }
    },
    get: function (url, sendData, successHandler, errorHandler) {
        var _data = '';
        // 解析对象传参
        for (var key in sendData) _data += '&' + key + '=' + sendData[key];
        _data = '?' + _data.slice(1);
        // 检测请求类型
        if (window.fetch) {
            fetch(this.website + url + _data).then(function (response) {
                return response.json();
            }).then(function (successData) {
                if (typeof successHandler === 'function') successHandler(successData);
            }).catch(function (error) {
                if (typeof errorHandler === 'function') errorHandler(error);
            })
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.website + url + _data);
            // xhr.withCredentials = true;
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                if (xhr.status === 200 || xhr.status == 304) {
                    if (typeof successHandler === 'function') successHandler(JSON.parse(xhr.responseText));
                } else {
                    if (typeof errorHandler === 'function') errorHandler(xhr);
                }
            }
            xhr.send(null);
        }
    }
}
let Http = new HttpRequest({
    website: 'http://che.qihao.lzei.com'
});

function getData() {
    Http.post('/api/app/parking', {
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
        console.log(res);
    }, err => {
        console.warn(err);
    })
}

