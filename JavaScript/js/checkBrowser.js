function checkVersion() {
    var msg = 'You are not using Internet Explorer.';
    var ver = (function () {
        var rv = -1;
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    })();
    if (ver > -1) {
        if (ver > 9.0) {
            msg = '通过';
        }else{
            window.location.href = 'http://modesign.cc/outdatedbrowser/';
        }
    }
    // console.log(msg, ver);
    // alert(ver);
}

function checkBrowser() {
    var userAgentInfo = navigator.userAgent,
        Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
    return Agents.some(function (item) {
        return (userAgentInfo.indexOf(item) > 0);
    });
}
