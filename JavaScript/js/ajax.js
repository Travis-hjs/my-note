/** 请求域名 */
const BASEURL = 'http://che.qihao.lzei.com';

/**
 * fetch 请求 learn：https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API
 * @param {'GET'|'POST'} type 请求方法 => 这里我只枚举了常用的两种
 * @param {string} url 请求路径
 * @param {object} data 请求参数对象
 * @param {Function} success 请求成功 
 * @param {Function} fail 请求失败
 */
function fetchRequest(type, url, data, success, fail) {
    if (!type) return console.error('fetch 缺少请求类型 GET 或者 POST');
    if (!url) return console.error('fetch 缺少请求 url');
    if (typeof data !== "object") return console.error('fetch 传参必须为 object');
    /** 请求选项设置 */
    let options = {
        // credentials: 'include', // 打开 cookie
        // mode: 'cors',           // 打开跨域
        method: type,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: null
    };
    switch (type) {
        case 'POST':
            // 若后台没设置接收 JSON 则不行 需要跟 GET 一样的解析对象传参
            options.body = JSON.stringify(data);
            break;

        case 'GET':
            // 判断是否一个空对象
            if (JSON.stringify(data) != '{}') {
                /** 参数拼接字符串 */
                let str = '';
                // 解析对象传参
                for (let key in data) str += '&' + key + '=' + data[key];
                if (str) str = '?' + str.slice(1);
                url += str;
            }
            break;
    }

    fetch(url, options).then(response => {
        // 请求状态 => 注意，这里不转换 json 下面会 undefined
        return response.json();
    }).then(res => {
        if (typeof success === 'function') success(res);
    }).catch(error => {
        if (typeof fail === 'function') fail(error);
    });
}

function fetchData() {
    fetchRequest('post', BASEURL + '/api/app/parking', {
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
        console.log('Fetch success', res);
    }, err => {
        console.warn('Fetch fail', err);
    });
}

/**
 * XMLHttpRequest 请求 
 * learn: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 * @param {object} param 传参对象
 * @param {string} param.url 请求路径
 * @param {'GET'|'POST'} param.method 请求方法 => 这里我只枚举了常用的两种
 * @param {object} param.data 传参对象
 * @param {FromData} param.file 上传图片 FromData
 * @param {Function} param.success 成功回调 
 * @param {Function} param.fail 失败回调 
 * @param {number} param.overtime 超时检测毫秒数
 * @param {Function} param.timeout 超时回调
 * @param {Function} param.progress 进度回调 貌似没什么用 
 */
function ajax(param) {
    if (typeof param !== 'object') return console.error('ajax 缺少请求传参');
    if (!param.method) return console.error('ajax 缺少请求类型 GET 或者 POST');
    if (!param.url) return console.error('ajax 缺少请求 url');
    if (typeof param.data !== 'object') return console.error('请求参数类型必须为 object');

    /** XMLHttpRequest */
    var XHR = new XMLHttpRequest();
    /** 请求方法 */
    var method = param.method.toUpperCase();
    /** 请求链接 */
    var url = param.url;
    /** 请求数据 */
    var data = null;
    /** 超时检测 */
    var overtime = typeof param.overtime === 'number' ? param.overtime : 0;

    // 传参处理
    switch (method) {
        case 'POST':
            data = JSON.stringify(param.data);
            break;

        case 'GET':
            // 判断是否一个空对象
            if (JSON.stringify(param.data) != '{}') {
                // 解析对象传参
                var send_data = '';
                for (var key in param.data) send_data += '&' + key + '=' + param.data[key];
                send_data = '?' + send_data.slice(1);
                url += send_data;
            }
            break;
    }

    // 监听请求变化
    // XHR.status learn: http://tool.oschina.net/commons?type=5
    XHR.onreadystatechange = function () {
        if (XHR.readyState !== 4) return;
        if (XHR.status === 200 || XHR.status === 304) {
            if (typeof param.success === 'function') param.success(JSON.parse(XHR.response));
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

    // 判断是否上传文件通常用于上传图片
    if (param.file) {
        data = param.file;
    } else {
        // Content-Type:
        // application/json
        // application/x-www-form-urlencoded
        XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    

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

    // return XHR;
}

function ajaxRequest() {
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
        },
        fail: function (err) {
            let error = { message: '接口报错，请看 network ' };
            if (err.response.charAt(0) == '{') {
                error = JSON.parse(err.response);
            }
            console.log('请求失败', error);
        },
        timeout: function () {
            var error = {
                message: '请求超时'
            }
            console.log(error.message);
        },
        progress: function (e) {
            if (e.lengthComputable) {
                var percentComplete = e.loaded / e.total
                console.log('请求进度', percentComplete, e.loaded, e.total);
            }
            console.log(e);
        }
    });
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