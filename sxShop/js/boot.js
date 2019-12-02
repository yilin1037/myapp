//获取路径
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
//获取参数
__CreateJSParam = function (js) {
    var scripts = document.getElementsByTagName("script");
    var pathParam = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            pathParam = ss[1];
            break;
        }
    }
    pathParam = pathParam.split("?")[1];
    pathParam = pathParam.split("&");
    var pathParamObj = {};
    for(var i in pathParam){
        var pp = pathParam[i].split("=");
        pathParamObj[pp[0]] = pp[1];
    }
    return pathParamObj;
}
var bootPATH = __CreateJSPath("boot.js");
//jQuery
//layui中自带了jQuery
document.write('<script src="js/plug-in/jQuery/jquery-3.2.1.min.js" type="text/javascript" ></script>');
document.write('<script src="js/plug-in/jQuery/jquery.dataTables.min.js" type="text/javascript" ></script>');
//vue
document.write('<script src="js/plug-in/vue/vue.min.js" type="text/javascript" ></script>');
//checkbox
document.write('<script src="js/icheck.min.js" type="text/javascript" ></script>');
//bootstrap
document.write('<script src="js/plug-in/bootstrap/js/bootstrap.js" type="text/javascript" ></script>');
document.write('<link href="js/plug-in/bootstrap/css/bootstrap.css" rel="stylesheet" type="text/css" />');
//layui
document.write('<script src="js/plug-in/layui/layui.js" type="text/javascript" ></script>');
document.write('<script src="js/plug-in/layui/table-tool.js" type="text/javascript" ></script>');
document.write('<link href="js/plug-in/layui/css/layui.css" rel="stylesheet" type="text/css" />');

//checkbox
document.write('<link href="css/all.css" rel="stylesheet" type="text/css" />');

//全局函数
document.write('<script src="js/function.js" type="text/javascript" ></script>');
//基础UI样式
document.write('<link href="css/ui-base.css" rel="stylesheet" type="text/css" />');
document.write('<link href="css/ui-box.css" rel="stylesheet" type="text/css" />');
document.write('<link href="css/ui-color.css" rel="stylesheet" type="text/css" />');