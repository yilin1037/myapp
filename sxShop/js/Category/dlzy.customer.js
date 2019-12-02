/* File Created: 三月 07, 2016 */
//扩张方法，取数组
//往JQuery中添加静态扩展方法，注意不可以使用具有返回值的类似于类的方法。
(function($) {
	$.fn.extend({
		arrayVal: function() {
			var self = $(this);
			var result = [];
			if(self.length > 0) {
				self.each(function(i, o) {
					result.push($(o).val());
				});
			}
			return result;
		}
	});

})(jQuery)

$("li.item-link").live("click", function() {
	if($(this).attr("href") != undefined) {
		window.location.href = ($(this).attr("href"));
	}
});
$(".item-href").live("click", function() {
	if($(this).attr("href") != undefined) {
		window.location.href = ($(this).attr("href"));
	}
});

//ajaxjsondo
function ajaxJsonDo(tag, callback, callback_e, formName) {
	var form = undefined;
	if(formName != undefined) {
		form = $("body").find("form[name=" + formName + "]").first();
	} else {
		form = $(tag).parents("form").first();
	}
	var url = $(tag).attr("refurl");
	$.ajax({
		url: url,
		type: 'POST',
		data: form.serialize(),
		dataType: "json",
		async: true,
		mask: false,
		error: function(e) {
			if(callback_e != null && callback_e != undefined) {
				callback_e(e);
			}
		},
		success: function(data) {
			if(callback != null && callback != undefined) {
				callback(data);
			}
		}
	});
}
//打开一个div
function ajaxOpenDiv(tag, callback) {
	var form = $(tag).parents("form").first();
	var url = $(tag).attr("refurl");
	$.ajax({
		url: url,
		type: 'POST',
		data: form.serialize(),
		async: true,
		mask: false,
		error: function(e) {},
		success: function(data) {
			if(callback != null && callback != undefined) {
				callback(tag, data);
			}
		}
	});
}
//打开一个div
function ajaxOpenUrl(url, callback) {
	$.ajax({
		url: url,
		type: 'Get',
		async: true,
		mask: false,
		error: function(e) {},
		success: function(data) {
			if(callback != null && callback != undefined) {
				callback(data);
			}
		}
	});
}
//提交
function ajaxSubmitUrl(url, form, callback) {
	$.ajax({
		url: url,
		type: 'POST',
		data: form.serialize(),
		async: true,
		mask: false,
		error: function(e) {},
		success: function(data) {
			if(callback != null && callback != undefined) {
				callback(data);
			}
		}
	});
}

function post(URL, PARAMS) {
	var temp = document.createElement("form");
	temp.action = URL;
	temp.method = "post";
	temp.style.display = "none";
	for(var x in PARAMS) {
		var opt = document.createElement("textarea");
		opt.name = x;
		opt.value = PARAMS[x];
		// alert(opt.name)        
		temp.appendChild(opt);
	}
	document.body.appendChild(temp);
	temp.submit();
	return temp;
}

function get(URL, PARAMS) {
	var temp = document.createElement("form");
	temp.action = URL;
	temp.method = "get";
	temp.style.display = "none";
	for(var x in PARAMS) {
		var opt = document.createElement("textarea");
		opt.name = x;
		opt.value = PARAMS[x];
		// alert(opt.name)        
		temp.appendChild(opt);
	}
	document.body.appendChild(temp);
	temp.submit();
	return temp;
}

var request = {
		QueryString: function(val) {
			var uri = window.location.search;
			var re = new RegExp("" + val + "\=([^\&\?]*)", "ig");
			return((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : null);
		},
		QueryStrings: function() {
			var uri = window.location.search;
			var re = /\w*\=([^\&\?]*)/ig;
			var retval = [];
			while((arr = re.exec(uri)) != null)
				retval.push(arr[0]);
			return retval;
		},
		setQuery: function(val1, val2) {
			var a = this.QueryStrings();
			var retval = "";
			var seted = false;
			var re = new RegExp("^" + val1 + "\=([^\&\?]*)$", "ig");
			for(var i = 0; i < a.length; i++) {
				if(re.test(a[i])) {
					seted = true;
					a[i] = val1 + "=" + val2;
				}
			}
			retval = a.join("&");
			return "?" + retval + (seted ? "" : (retval ? "&" : "") + val1 + "=" + val2);
		}
	}
	//往JQuery中添加静态扩展方法，注意不可以使用具有返回值的类似于类的方法。
$.extend({
	/*********************客户端图片直接浏览***********************/
	/*  divImage将要显示的图片的容器；
	upload放置文件路径的文本框等；
	width显示的图片的宽度
	height显示的图片的高度
	*/
	preview: function(divImage, upload, width, height) {
		var picId = $("#" + upload).val();
		//获取图片的客户端文件路径
		var imgPath;
		//图片路径
		var Browser_Agent = navigator.userAgent;
		//判断浏览器的类型
		if(Browser_Agent.indexOf("Firefox") != -1) {
			//火狐浏览器
			imgPath = window.URL.createObjectURL($("#" + upload)[0].files[0]);
			//在容器内添加img对象
			document.getElementById(divImage).innerHTML = "<img id='imgPreview' src='" + imgPath + "' width='" + width + "px' height='" + height + "px'/>";
		} else {
			//IE=--需要将网站加入到信任
			var imgDiv = $("#" + divImage)[0];
			imgDiv.innerHTML = "";
			imgDiv.style.width = width + "px";
			imgDiv.style.height = height + "px";
			//以filter的方式添加图片显示
			imgDiv.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod = scale)";
			imgDiv.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = picId;
		}
	},
	/***************************************************************/
	/************ 从json类型数据转换为date类型的对象****************/
	jsontodate: function(val) {
		var re = /-?\d+/;
		var m = re.exec(val);
		var d = new Date(parseInt(m[0]));
		return d;

	},
	/***************************************************************/
	/************ 用于格式化日期显示，返回的是字符串****************/
	/*
	date：为Date类型日期数据
	format：为格式化字符串"yyyy-MM-dd HH:mm:ss"等
	*/
	formattime: function(date, format) {
		var o = {
			"M+": date.getMonth() + 1, //month
			"d+": date.getDate(), //day
			"h+": date.getHours(), //hour
			"m+": date.getMinutes(), //minute
			"s+": date.getSeconds(), //second
			"q+": Math.floor((date.getMonth() + 3) / 3), //quarter
			"S": date.getMilliseconds() //millisecond
		}
		if(/(y+)/.test(format))
			format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(format))
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		return format;
	},
	/***************************************************************/
	indexof: function(item, data) {
		for(index = 0; index < data.length; index++) {
			if(data[index] == item)
				return index;
		}
		return -1;
	},
	/***************************alret************************************/
	jmallAlert: function(msg) {
		if((typeof mui) == "undefined") {
			alert(msg);
		} else {
			mui.alert(msg);
		}
	}

});

/***********实例方法使用：$("#.")等方式访问***********************/
$.fn.extend({
	fillControl: function(data) {
		$this = $(this);
		$.each(data, function(key, value) {
			if(key.indexOf('Price')!=-1 && typeof(value) ==  'number'){
				value = value.toFixed("2");
			}
			if(key.indexOf('Amount')!=-1  && typeof(value) ==  'number'){
				value = value.toFixed("2");
			}
			$this.find("input[name=" + key + "]").val(value);
			$this.find("span[name=" + key + "]").html(value);
			$this.find("p[name=" + key + "]").html(value);
			$this.find("s[name=" + key + "]").html(value);
			$this.find("a[name=" + key + "]").attr("href", value);	
			if(value && value != '') {
				$this.find("img[name=" + key + "]").attr("src", value);
			}
			$this.find("b[name=" + key + "]").html(value);
		});
	},

});

function pad(num, n) {
	var len = num.toString().length;
	while(len < n) {
		num = "0" + num;
		len++;
	}
	return num;
}
var TimeOutHours = 24;

//日期格式转换
function ConvertJSONDateToJSDateObject(jsondate) {
	var date = new Date(parseInt(jsondate.replace("/Date(", "").replace(")/", ""), 10));
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	return year + "-" + month + "-" + day;
}