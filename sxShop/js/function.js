function execAjax(params){
    var ajaxUrl = '';
    if(params['url']){
        ajaxUrl = params['url'];
    }else if(params['m'] && params['c'] && params['a']){
        ajaxUrl = '?m='+params['m']+'&c='+params['c']+'&a='+params['a'];
    }
    $.ajax({
        url : ajaxUrl,
        type : 'POST',
        dataType : (params['dataType'] || 'json'),
        async : (params['async'] === false ? false : true),
        data : (params['data'] || {}),
        success : function(data) {
            params['success'](data);
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            if ( typeof (params['fail']) == 'function') {
                params['fail'](XMLHttpRequest, textStatus, errorThrown);
            } else {
                layer.msg('请检查网络连接', {icon: 2});
            }
        }
    });
}
//获取临时标识
function getTimeStamp(isRandom) {
    var timestamp = new Date().getTime();
    if (isRandom) {
        return parseInt(timestamp * Math.random());
    }
    return timestamp;
}
//小数位保留
function formatFloat($, l) {
    if (l === false)
        return $;
    if ($ === null || $ === undefined)
        null == "";
    $ = String($).replace(/\$|\,/g, "");
    if (isNaN($))
        $ = "0";
    var S = 1;
    for (var i = 1; i <= l; i++) {
        S = S * 10;
    }
    var R = Math.round($ * S);
    return R / S;
}
//保留小数位,保留末尾零
function formatFloatEnd(s, n ,i)   
{   
    if(i && s * 1 == 0){
        return '';
    }
    n = n >= 0 && n <= 20 ? n : 2;   
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    if(n == 0){
        return s;
    }
    var l = s.split(".")[0],   
    r = s.split(".")[1]; 
    return l + "." + r;   
} 
//NaN返回0
function NaN_0(v){
    if(isNaN(v)){
        v = 0;
    }
    return v * 1;
}
//提示框 =======================================================
//
//		text      =>     提示框文字
//		bgcolor   =>     提示框背景颜色
//		tecolor   =>	 字体颜色
//
//==============================================================
 var msg=function (text,bgcolor,tecolor){
    tecolor = tecolor || '#3c763d';
	var div = document.createElement(div);
	//div.className = "alert alert-danger";
	div.roleName = "alert";
	div.innerHTML = text;

	div.style.float = "left";
	div.style.height = "52px";
	div.style.lineHeight = "52px";
	div.style.backgroundColor = bgcolor;
	div.style.color = tecolor;
	div.style.textAlign = "center";
	div.style.borderRadius = "5px";
	div.style.position = "fixed";
	div.style.left = "50%";
	div.style.top = "20%";
	div.style.marginLeft = "-44px";
	div.style.marginTop = "-26px";
	div.style.paddingLeft = "10px";
	div.style.paddingRight = "10px";
	div.style.zIndex = "1000";
	div.style.transition = "all 0.3s";
	div.style.overflow = "hidden";
	document.body.appendChild(div);
	setTimeout(function(){
		div.style.height = "0";
		setTimeout(function(){
			document.body.removeChild(div);
		},300);
	},1000);
}

function speckText(str){//语音播报
        　　   //var request=  new URLRequest();
        var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);        // baidu
              //url = "http://translate.google.cn/translate_tts?ie=UTF-8&tl=zh-CN&total=1&idx=0&textlen=19&prev=input&q=" + encodeURI(str); // google
            
　　         //request.url = encodeURI(url);
            // request.contentType = "audio/mp3"; // for baidu
            //request.contentType = "audio/mpeg"; // for google

        　　var n = new Audio(url);

       　　 n.src = url;

       　　 n.play();
        　　
       　　 // $("...").play();
        　　// var sound = new Sound(request);
        　　// sound.play();
    }
	
//解决乘法浮点类型精确度
function accMul(arg1,arg2)
{
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}

//解决加法浮点类型精确度
function addNum(arg1,arg2){
	var r1,r2,m;
	try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
	try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
	m=Math.pow(10,Math.max(r1,r2))
	return (arg1*m+arg2*m)/m
}

//解决减法浮点类型精确度
function accSub(arg1,arg2){  
	var r1,r2,m,n;  
	try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}  
	try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}  
	m=Math.pow(10,Math.max(r1,r2));  
	//last modify by deeka  
	//动态控制精度长度  
	n=(r1>=r2)?r1:r2;  
	return ((arg1*m-arg2*m)/m).toFixed(n);  
}  

