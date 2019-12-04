__CreateJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
}
var bootPATH = __CreateJSPath("miniui-boot.js");
 
//debugger
mini_debugger = false;   
mini_useShims = true;
//miniui
document.write('<script src="' + bootPATH + '/plug-in/jquery/jquery-3.2.1.min.js?V=20160905" type="text/javascript" ></script>');
document.write('<script src="' + bootPATH + '/plug-in/miniui/miniui.js?V=20160905" type="text/javascript" ></script>');
document.write('<link href="' + bootPATH + '/plug-in/miniui/themes/default/miniui.css?V=20160905" rel="stylesheet" type="text/css" />');
//document.write('<link href="' + bootPATH + 'miniui/themes/default/fontcss.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + '/plug-in/miniui/themes/icons.css?V=20160905" rel="stylesheet" type="text/css" />');

//skin
var skin = getCookie("miniuiSkin");
skin = 'pure';
if (skin) {
    document.write('<link href="' + bootPATH + '/plug-in/miniui/themes/' + skin + '/skin.css?V=20160909" rel="stylesheet" type="text/css" />');
}
////////////////////////////////////////////////////////////////////////////////////////
function getCookie(sName) {
    var aCookie = document.cookie.split("; ");
    var lastMatch = null;
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (sName == aCrumb[0]) {
            lastMatch = aCrumb;
        }
    }
    if (lastMatch) {
        var v = lastMatch[1];
        if (v === undefined) return v;
        return unescape(v);
    }
    return null;
}