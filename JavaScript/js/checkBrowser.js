function getIEVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}
function checkVersion() {
    var msg = "You're not using Internet Explorer.";
    var ver = getIEVersion();
    if (ver > -1) {
        // alert(ver);
        if (ver > 9.0) {
            msg = "通过";
        }else{
            window.location.href = "http://modesign.cc/outdatedbrowser/";
        }  
    }
    // alert(msg);
}
checkVersion()