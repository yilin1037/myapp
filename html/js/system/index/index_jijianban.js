var flow = new Vue({
	el: '#flow',
	data: {
	   shopConfigItems:[],
	   isHave:false,
	   turnTo:false,
	},
    mounted: function() {
		var self = this;
		
        layui.use(['element','layer'], function(){
            var $ = layui.jquery,element = layui.element();
			addTab('zm','?m=desktop&c=desktop&a=index','桌面');
            
            //--------------------------------------
        	
            element.on('tab(my-tab)', function(elem){
                var layId = $(this).attr('lay-id');
                if(layId && !isOpenTab[layId]){
                    isOpenTab[layId] = true;
                    loadPage();
                }
            });
            $("#kefu").hover(function() {
        		$(this).addClass("current");
        		var a = $(this).find(".content");
        		if ($(this).find(".content").children().length == 0) {
			a.html('<iframe border="0" scroll="no" frameborder="no" style="border:0;overflow:hidden;width:200px;height:1110px;" src="service.html?v=9"></iframe>').show()
        		} else {
        			a.show()
        		}
        		$(this).css({
        			"background-position": "0 -190px",
        			color: "#3077D1",
        			border: "1px solid #ccc"
        		});
				$(this).find('img').attr("src","images/qqpng2.png");
        	},
        	function() {
        		$(this).removeClass("current");
        		$(this).find(".content").hide();
        		$(this).css({
        			"background-position": "0 -214px",
        			color: "#FFFFFF",
        			border: "1px solid #3077D1"
        		})
				$(this).find('img').attr("src","images/qqpng.png");
        	});
        	$("#help").hover(function() {
        		$(this).addClass("current");
        		$(this).find(".content").show();
        		$(this).css({
        			"background-position": "0 -286px",
        			color: "#3077D1",
        			border: "1px solid #ccc"
        		})
        	},
        	function() {
        		$(this).removeClass("current");
        		$(this).find(".content").hide();
        		$(this).css({
        			"background-position": "0 -310px",
        			color: "#FFFFFF",
        			border: "1px solid #3077D1"
        		})
        	});
        	$("#dataCenter").hover(function() {
        		$(this).addClass("current");
        		$(this).find(".content").show();
        		$(this).css({
        			"background-position": "0 -531px",
        			color: "#3077D1",
        			border: "1px solid #ccc"
        		})
        	},
        	function() {
        		$(this).removeClass("current");
        		$(this).find(".content").hide();
        		$(this).css({
        			"background-position": "0 -556px",
        			color: "#FFFFFF",
        			border: "1px solid #3077D1"
        		})
        	});
            $("#selectMenu").hover(function() {
        		$(this).addClass("current");
        		$(this).find(".content").show();
        		$(this).css({
        			"background-position": "0 -239px",
        			color: "#3077D1",
        			border: "1px solid #ccc"
        		})
        	},
        	function() {
        		$(this).removeClass("current");
        		$(this).find(".content").hide();
        		$(this).css({
        			"background-position": "0 -262px",
        			color: "#FFFFFF",
        			border: "1px solid #3077D1"
        		})
        	});
        	$("#user").hover(function() {
        		$(this).addClass("current");
        		$(this).find(".content").show();
        		$(this).css({
        			"background-position": "0 -239px",
        			color: "#3077D1",
        			border: "1px solid #ccc"
        		})
        	},
        	function() {
        		$(this).removeClass("current");
        		$(this).find(".content").hide();
        		$(this).css({
        			"background-position": "0 -262px",
        			color: "#FFFFFF",
        			border: "1px solid #3077D1"
        		})
        	});
        	$("#fankui").hover(function() {
        		$(this).addClass("current");
        		$(this).find(".content").show();
        		$(this).css({
        			"background-position": "0 -239px",
        			color: "#3077D1",
        			border: "1px solid #ccc"
        		})
        	},
        	function() {
        		$(this).removeClass("current");
        		$(this).find(".content").hide();
        		$(this).css({
        			"background-position": "0 -262px",
        			color: "#FFFFFF",
        			border: "1px solid #3077D1"
        		})
        	});
            $("#money").hover(function() {
        		$(this).addClass("current");
        		$(this).find(".content").show();
        		$(this).css({
        			"background-position": "0 -239px",
        			color: "#3077D1",
        			border: "1px solid #ccc"
        		})
        	},
        	function() {
        		$(this).removeClass("current");
        		$(this).find(".content").hide();
        		$(this).css({
        			"background-position": "0 -262px",
        			color: "#FFFFFF",
        			border: "1px solid #3077D1"
        		})
        	});
        	 $("#shop").hover(function() {
        		$(this).addClass("current");
        		$(this).find(".content").show();
        		$(this).css({
        			"background-position": "0 -239px",
        			color: "#3077D1",
        			border: "1px solid #ccc"
        		})
        	},
        	function() {
        		$(this).removeClass("current");
        		$(this).find(".content").hide();
        		$(this).css({
        			"background-position": "0 -262px",
        			color: "#FFFFFF",
        			border: "1px solid #3077D1"
        		})
        	});
            $("#app").hover(function() {
        		$(this).addClass("current");
        		$(this).find(".content").show();
        		$(this).css({
        			"background-position": "0 -239px",
        			color: "#3077D1",
        			border: "1px solid #ccc"
        		})
        	},
        	function() {
        		$(this).removeClass("current");
        		$(this).find(".content").hide();
        		$(this).css({
        			"background-position": "0 -262px",
        			color: "#FFFFFF",
        			border: "1px solid #3077D1"
        		})
        	});
            $("#openGetOrder").hover(function() {
        		$(this).addClass("current");
        		$(this).find(".content").show();
        		$(this).css({
        			"background-position": "0 -239px",
        			color: "#3077D1",
        			border: "1px solid #ccc"
        		})
        	},
        	function() {
        		$(this).removeClass("current");
        		$(this).find(".content").hide();
        		$(this).css({
        			"background-position": "0 -262px",
        			color: "#FFFFFF",
        			border: "1px solid #3077D1"
        		})
        	});
        	$("#infoLi").hover(function() {
        		$("#infoPanel").show()
        	},
        	function() {
        		$("#infoPanel").hide()
        	});
            $("#root li").hover(function() {
        		$(this).not('.group > *').addClass("curItem");
                $(this).find("ul").show();
        	},
        	function() {
        		$(this).not('.group > *').removeClass("curItem");
                $(this).find("ul").hide();
        	});
            //--------------------------------
            
            //新增一个Tab项
            $(".menuNode").click(function(){
                var a_t = $(this),
                id 		= a_t.attr("data-id"),
            	url 	= a_t.attr("data-url"),
            	title 	= a_t.html();
                addTab(id,url,title);
            });
            //$('.layui-this').children("a:first").click();
        });
        loadShopConfig();
        lastGetOrderTime();
		upLoadLog();
    },
    methods: {
        //修改密码
        modify_password:function(){
            addTab('updatepassword','?m=system&c=setup&a=updatepassword','修改密码');
        },
		accountSale:function(){
			layer.open({
                title :'数据安全',
                type: 2,
                shade: false,
                area: ['550px', '500px'],
                maxmin: false,
                content: '?m=system&c=accountSafe&a=accountSafe'
            }); 
		},
        //退出
        re_login:function(){
            layer.confirm('退出超群专业版?', function(index){
                execAjax({
                    m:'system',
                    c:'index',
                    a:'outLogin',
                    data:{},
                    success:function(data){
                        window.location.href='?m=system&c=main&a=login';
                    }
                });
                layer.close(index);
            });
        },
        //账户充值
        payIdList:function(){
            addTab('recharge','?m=system&c=finance&a=oldRecharge','账户充值');
        },
        //流水明细
        costList:function(){
            addTab('detail','?m=system&c=finance&a=waterDetail','流水明细');
        },
        //抓单
        openGetOrder:function(){
            layer.open({
                title :'抓单',
                type: 2,
                shade: false,
                area: ['650px', '550px'],
                maxmin: false,
                content: '?m=widget&c=getOrder&a=index'
            }); 
        }
    }
});
setInterval(function(){
    lastGetOrderTime();																																																//===========
},300000);//5分钟

function upLoadLog()
{
	setTimeout(function () {
		$.ajax({						
			url: "/index.php?m=system&c=index&a=uploadLoginLog",					
			type: 'post',			
			data: {},			
			dataType: 'json',			
			success: function (data) {
			}
		});
	}, 10000);
}	
function loadShopConfig(){
    execAjax({
        m:'system',
        c:'index',
        a:'getShopConfig',
        data:{},
        success:function(data){
            flow.shopConfigItems = data;
        }
    });
}
//上传执行时间
function lastGetOrderTime(){
    execAjax({
        m:'system',
        c:'index',
        a:'lastGetOrderTime',
        data:{},
        success:function(data){
            $("#lastGetOrderTime").text('上次抓单'+data['configValue']);
			if(data['limit_ddfh'] != 'T'){
				$("#bottom-right").hide();
			}
        }
    });
}
var isOpenTab = {};
function reMenuOpen(){
    isOpenTab = {};
}
var mainHeight = 0;
var iframeArr = [];
window.setInterval("refreshIframe()", 200);
function addTab(id,url,title){
	 mainHeight = window.innerHeight-100;
    var tab = 'my-tab';
    var length 	= $(".layui-tab-title").children("li[lay-id='" + id + "']").length;
    if (!length) {

        var iframe = '<iframe id="iframe'+id+'" src="' + url + '" style="height:' + mainHeight + 'px;"></iframe>';
		iframeArr.push("iframe"+id);
        layui.element().tabAdd(tab, {
            title	: title,
            content	: iframe,
            id		: id
        });
    }
    layui.element().tabChange(tab, id);
    isOpenTab[id] = true;
    if(!isOpenTab[id]){
        length && loadPage();
    }
}

function refreshIframe()
{
	var nowHeight = window.innerHeight-100;
	if(mainHeight != nowHeight)
	{
		for (i=0; i<iframeArr.length; i++)
		{
			var obj = $('#'+iframeArr[i]);
			if(obj)
			{
				obj.height(nowHeight);	
			}
		}	
	}
	mainHeight = nowHeight;
}

function loadPage(){
	var index = $(".layui-tab-content").find(".layui-show").index()+1;
	window[index].location.reload();
}

//判断是否安装菜鸟组件
var socket;
var requestID = ""+parseInt(1000*Math.random());
function doConnect(func){
    socket = new WebSocket('ws://127.0.0.1:13528');
    // 打开Socket
    socket.onopen = function(event){
        if(typeof(func) == 'function'){
            func();
        }
    };
    // 监听消息
    socket.onmessage = function(event)
    {
		flow.isHave = true;
		
		$.ajax({																																														
			url: "/index.php?m=system&c=index&a=getData",																																		
			type: 'post',																																												
			data: {},																																													
			dataType: 'json',																																											
			success: function (data) {
				if(data.limit_ddfh == "T" && data.ORDER_APPROVAL != '1'){
					addTab('0001_001','?m=system&c=delivery&a=indexJijian','打单发货');	
				}
				
				if(data.code == "ok"){
				
				}else if(data.limit_dbsx == "T"){
					addTab('0010','?m=system&c=beDone&a=beDone','待办事项');
				}
				
				if(data.accountSafe == 'F'){
					flow.accountSale();
				}
			}																																															
		});
				
        var data = JSON.parse(event.data);
        
        if ("getPrinters" == data.cmd) {
            if(typeof(cbDoGetPrinters) == 'function'){
                cbDoGetPrinters(data.printers);
            }
        }else if("print" == data.cmd){
            if(typeof(cbPrintView) == 'function' && data['previewImage']){
                cbPrintView(data);
            }
        }
    };
    socket.onerror = function(event) {
        flow.isHave = false;
		addTab('dbsx','?m=system&c=beDone&a=beDone','待办事项');
    };
}

//获取打印机列表
function doGetPrinters(func) {
    var request  = {
        requestID : requestID,
        version : '1.0',
        cmd : 'getPrinters'
    };
    socket.send(JSON.stringify(request));
    if(typeof(func) == 'function'){
        cbDoGetPrinters = func;
    }
}

//创建连接
doConnect(function(){
	doGetPrinters();
});

var printTpl = {};
var printTplDzmd = {};
var printTplBq = [];
var printTplYd = [];
    if(!printTplDzmd['HTKY']){
        printTplDzmd['HTKY'] = [];
    }
    printTplDzmd['HTKY'].push({id:'46',name:'百世汇通呀',express_no:'HTKY'});
    printTpl['46'] = function (printer,printData,isView){
        var myDate = new Date();
        var printTaskId = myDate.getTime()+parseInt(1000*Math.random());
        socket.send(JSON.stringify({
            "cmd":"setPrinterConfig",
            "requestID":""+printTaskId,
            "version":"1.0",
            "printer":
			{
				"name":printer,
				"needTopLogo":true,
				"needBottomLogo":true,
                forceNoPageMargins:true,
                //horizontalOffset:0,
                //verticalOffset:0
			}
        }));
        var documents = [];
        for(var i in printData){
            documents.push({
                documentID : (printData[i]['data']['waybillCode']||printTaskId),
                contents : [
                    //电子面单部分
                    {
                        templateURL : 'http://cloudprint.cainiao.com/template/standard/84010/21',
                        signature : "ALIBABACAINIAOWANGLUO",
                        "data": printData[i]['data']
                    },
                    //自定义区部分
                    {
                        templateURL : 'http://192.168.1.145:999/upload/cainiaoYunPrint/d9d4f495e875a2e075a1a4a6e1b9770f.xml',
                        data : printData[i]['cust_data']
                    }
                ]
            });
        }
        var request  = {
            cmd : "print",
            requetID : ""+printTaskId,
            version : "1.0",
            task : {
                taskID : ""+printTaskId,
                preview : (isView || false),
    			previewType : "image",
                printer : printer,
                documents : documents
            }
        };
        socket.send(JSON.stringify(request));
    }
        if(!printTplDzmd['YTO']){
        printTplDzmd['YTO'] = [];
    }
    printTplDzmd['YTO'].push({id:'50',name:'圆通',express_no:'YTO'});
    printTpl['50'] = function (printer,printData,isView){
        var myDate = new Date();
        var printTaskId = myDate.getTime()+parseInt(1000*Math.random());
        socket.send(JSON.stringify({
            "cmd":"setPrinterConfig",
            "requestID":""+printTaskId,
            "version":"1.0",
            "printer":
			{
				"name":printer,
				"needTopLogo":true,
				"needBottomLogo":true,
                forceNoPageMargins:true,
                //horizontalOffset:0,
                //verticalOffset:0
			}
        }));
        var documents = [];
        for(var i in printData){
            documents.push({
                documentID : (printData[i]['data']['waybillCode']||printTaskId),
                contents : [
                    //电子面单部分
                    {
                        templateURL : 'http://cloudprint.cainiao.com/template/standard/101/572',
                        signature : "ALIBABACAINIAOWANGLUO",
                        "data": printData[i]['data']
                    },
                    //自定义区部分
                    {
                        templateURL : 'http://192.168.1.23:81/upload/cainiaoYunPrint/c0c7c76d30bd3dcaefc96f40275bdc0a.xml',
                        data : printData[i]['cust_data']
                    }
                ]
            });
        }
        var request  = {
            cmd : "print",
            requetID : ""+printTaskId,
            version : "1.0",
            task : {
                taskID : ""+printTaskId,
                preview : (isView || false),
    			previewType : "image",
                printer : printer,
                documents : documents
            }
        };
        socket.send(JSON.stringify(request));
    }
        if(!printTplDzmd['YTO']){
        printTplDzmd['YTO'] = [];
    }
    printTplDzmd['YTO'].push({id:'51',name:'国通',express_no:'YTO'});
    printTpl['51'] = function (printer,printData,isView){
        var myDate = new Date();
        var printTaskId = myDate.getTime()+parseInt(1000*Math.random());
        socket.send(JSON.stringify({
            "cmd":"setPrinterConfig",
            "requestID":""+printTaskId,
            "version":"1.0",
            "printer":
			{
				"name":printer,
				"needTopLogo":true,
				"needBottomLogo":true,
                forceNoPageMargins:true,
                //horizontalOffset:0,
                //verticalOffset:0
			}
        }));
        var documents = [];
        for(var i in printData){
            documents.push({
                documentID : (printData[i]['data']['waybillCode']||printTaskId),
                contents : [
                    //电子面单部分
                    {
                        templateURL : 'http://cloudprint.cainiao.com/template/standard/1101/99',
                        signature : "ALIBABACAINIAOWANGLUO",
                        "data": printData[i]['data']
                    },
                    //自定义区部分
                    {
                        templateURL : 'http://192.168.1.23:81/upload/cainiaoYunPrint/2838023a778dfaecdc212708f721b788.xml',
                        data : printData[i]['cust_data']
                    }
                ]
            });
        }
        var request  = {
            cmd : "print",
            requetID : ""+printTaskId,
            version : "1.0",
            task : {
                taskID : ""+printTaskId,
                preview : (isView || false),
    			previewType : "image",
                printer : printer,
                documents : documents
            }
        };
        socket.send(JSON.stringify(request));
    }
        if(!printTplDzmd['']){
        printTplDzmd[''] = [];
    }
    printTplDzmd[''].push({id:'55',name:'申通菜鸟物流',express_no:''});
    printTpl['55'] = function (printer,printData,isView){
        var myDate = new Date();
        var printTaskId = myDate.getTime()+parseInt(1000*Math.random());
        socket.send(JSON.stringify({
            "cmd":"setPrinterConfig",
            "requestID":""+printTaskId,
            "version":"1.0",
            "printer":
			{
				"name":printer,
				"needTopLogo":true,
				"needBottomLogo":true,
                forceNoPageMargins:true,
                //horizontalOffset:0,
                //verticalOffset:0
			}
        }));
        var documents = [];
        for(var i in printData){
            documents.push({
                documentID : (printData[i]['data']['waybillCode']||printTaskId),
                contents : [
                    //电子面单部分
                    {
                        templateURL : 'http://cloudprint.cainiao.com/template/standard/201/162',
                        signature : "ALIBABACAINIAOWANGLUO",
                        "data": printData[i]['data']
                    },
                    //自定义区部分
                    {
                        templateURL : '',
                        data : printData[i]['cust_data']
                    }
                ]
            });
        }
        var request  = {
            cmd : "print",
            requetID : ""+printTaskId,
            version : "1.0",
            task : {
                taskID : ""+printTaskId,
                preview : (isView || false),
    			previewType : "image",
                printer : printer,
                documents : documents
            }
        };
        socket.send(JSON.stringify(request));
    }
        if(!printTplDzmd['']){
        printTplDzmd[''] = [];
    }
    printTplDzmd[''].push({id:'58',name:'中通',express_no:''});
    printTpl['58'] = function (printer,printData,isView){
        var myDate = new Date();
        var printTaskId = myDate.getTime()+parseInt(1000*Math.random());
        socket.send(JSON.stringify({
            "cmd":"setPrinterConfig",
            "requestID":""+printTaskId,
            "version":"1.0",
            "printer":
			{
				"name":printer,
				"needTopLogo":true,
				"needBottomLogo":true,
                forceNoPageMargins:true,
                //horizontalOffset:0,
                //verticalOffset:0
			}
        }));
        var documents = [];
        for(var i in printData){
            documents.push({
                documentID : (printData[i]['data']['waybillCode']||printTaskId),
                contents : [
                    //电子面单部分
                    {
                        templateURL : 'http://cloudprint.cainiao.com/template/standard/301/176',
                        signature : "ALIBABACAINIAOWANGLUO",
                        "data": printData[i]['data']
                    },
                    //自定义区部分
                    {
                        templateURL : '',
                        data : printData[i]['cust_data']
                    }
                ]
            });
        }
        var request  = {
            cmd : "print",
            requetID : ""+printTaskId,
            version : "1.0",
            task : {
                taskID : ""+printTaskId,
                preview : (isView || false),
    			previewType : "image",
                printer : printer,
                documents : documents
            }
        };
        socket.send(JSON.stringify(request));
    }
        if(!printTplDzmd['HTKY']){
        printTplDzmd['HTKY'] = [];
    }
    printTplDzmd['HTKY'].push({id:'61',name:'百世123',express_no:'HTKY'});
    printTpl['61'] = function (printer,printData,isView){
        var myDate = new Date();
        var printTaskId = myDate.getTime()+parseInt(1000*Math.random());
        socket.send(JSON.stringify({
            "cmd":"setPrinterConfig",
            "requestID":""+printTaskId,
            "version":"1.0",
            "printer":
			{
				"name":printer,
				"needTopLogo":true,
				"needBottomLogo":true,
                forceNoPageMargins:true,
                //horizontalOffset:0,
                //verticalOffset:0
			}
        }));
        var documents = [];
        for(var i in printData){
            documents.push({
                documentID : (printData[i]['data']['waybillCode']||printTaskId),
                contents : [
                    //电子面单部分
                    {
                        templateURL : 'http://cloudprint.cainiao.com/template/standard/84010/21',
                        signature : "ALIBABACAINIAOWANGLUO",
                        "data": printData[i]['data']
                    },
                    //自定义区部分
                    {
                        templateURL : 'http://192.168.1.23:81/upload/cainiaoYunPrint/7f39f8317fbdb1988ef4c628eba02591.xml',
                        data : printData[i]['cust_data']
                    }
                ]
            });
        }
        var request  = {
            cmd : "print",
            requetID : ""+printTaskId,
            version : "1.0",
            task : {
                taskID : ""+printTaskId,
                preview : (isView || false),
    			previewType : "image",
                printer : printer,
                documents : documents
            }
        };
        socket.send(JSON.stringify(request));
    }
        printTplBq.push({id:'42',name:'666'});
    printTpl['42'] = function (printer,printData,isView){
        var myDate = new Date();
        var printTaskId = myDate.getTime()+parseInt(1000*Math.random());
        var documents = [];
        var double_row = {};
        var printDataLength = (printData.length);
        for(var i in printData){
            var documentID = myDate.getTime()+parseInt(1000*Math.random());
            if('T' == 'T'){
                var isPrintRow = false;
                var indexPrint = i * 1 + 1;
                if(indexPrint%2 == 1){
                    for(var field in printData[i]['cust_data']){
                        double_row[field+'1'] = printData[i]['cust_data'][field];
                    }
                    isPrintRow = false;
                }else if(indexPrint%2 == 0){
                    for(var field in printData[i]['cust_data']){
                        double_row[field+'2'] = printData[i]['cust_data'][field];
                    }
                    isPrintRow = true;
                }
                if(indexPrint == printDataLength){
                    isPrintRow = true;
                }
                if(isPrintRow){
                    documents.push({
                        documentID : ""+documentID,
                        contents : [
                            //自定义区部分
                            {
                                templateURL : 'http://192.168.1.147:999/upload/cainiaoYunPrint/a1d0c6e83f027327d8461063f4ac58a6.xml',
                                data : double_row
                            }
                        ]
                    });
                    double_row = {};
                }
            }else{
                documents.push({
                    documentID : ""+documentID,
                    contents : [
                        //自定义区部分
                        {
                            templateURL : 'http://192.168.1.147:999/upload/cainiaoYunPrint/a1d0c6e83f027327d8461063f4ac58a6.xml',
                            data : printData[i]['cust_data']
                        }
                    ]
                });
            }
        }
        request  = {
    		cmd : "print",
    		requetID : ""+printTaskId,
    		version : "1.0",
    		task : {
    			taskID :  '' + printTaskId,
    			preview : (isView || false),
                previewType : "image",
    			printer : printer,
    			documents : documents
    		}
    	};
        socket.send(JSON.stringify(request));
    }
        printTplBq.push({id:'47',name:'标签呀'});
    printTpl['47'] = function (printer,printData,isView){
        var myDate = new Date();
        var printTaskId = myDate.getTime()+parseInt(1000*Math.random());
        var documents = [];
        var double_row = {};
        var printDataLength = (printData.length);
        for(var i in printData){
            var documentID = myDate.getTime()+parseInt(1000*Math.random());
            if('T' == 'T'){
                var isPrintRow = false;
                var indexPrint = i * 1 + 1;
                if(indexPrint%2 == 1){
                    for(var field in printData[i]['cust_data']){
                        double_row[field+'1'] = printData[i]['cust_data'][field];
                    }
                    isPrintRow = false;
                }else if(indexPrint%2 == 0){
                    for(var field in printData[i]['cust_data']){
                        double_row[field+'2'] = printData[i]['cust_data'][field];
                    }
                    isPrintRow = true;
                }
                if(indexPrint == printDataLength){
                    isPrintRow = true;
                }
                if(isPrintRow){
                    documents.push({
                        documentID : ""+documentID,
                        contents : [
                            //自定义区部分
                            {
                                templateURL : 'http://192.168.1.23:81/upload/cainiaoYunPrint/67c6a1e7ce56d3d6fa748ab6d9af3fd7.xml',
                                data : double_row
                            }
                        ]
                    });
                    double_row = {};
                }
            }else{
                documents.push({
                    documentID : ""+documentID,
                    contents : [
                        //自定义区部分
                        {
                            templateURL : 'http://192.168.1.23:81/upload/cainiaoYunPrint/67c6a1e7ce56d3d6fa748ab6d9af3fd7.xml',
                            data : printData[i]['cust_data']
                        }
                    ]
                });
            }
        }
        request  = {
    		cmd : "print",
    		requetID : ""+printTaskId,
    		version : "1.0",
    		task : {
    			taskID :  '' + printTaskId,
    			preview : (isView || false),
                previewType : "image",
    			printer : printer,
    			documents : documents
    		}
    	};
        socket.send(JSON.stringify(request));
    }
        printTplBq.push({id:'57',name:'丁楠测试'});
    printTpl['57'] = function (printer,printData,isView){
        var myDate = new Date();
        var printTaskId = myDate.getTime()+parseInt(1000*Math.random());
        var documents = [];
        var double_row = {};
        var printDataLength = (printData.length);
        for(var i in printData){
            var documentID = myDate.getTime()+parseInt(1000*Math.random());
            if('F' == 'T'){
                var isPrintRow = false;
                var indexPrint = i * 1 + 1;
                if(indexPrint%2 == 1){
                    for(var field in printData[i]['cust_data']){
                        double_row[field+'1'] = printData[i]['cust_data'][field];
                    }
                    isPrintRow = false;
                }else if(indexPrint%2 == 0){
                    for(var field in printData[i]['cust_data']){
                        double_row[field+'2'] = printData[i]['cust_data'][field];
                    }
                    isPrintRow = true;
                }
                if(indexPrint == printDataLength){
                    isPrintRow = true;
                }
                if(isPrintRow){
                    documents.push({
                        documentID : ""+documentID,
                        contents : [
                            //自定义区部分
                            {
                                templateURL : 'http://192.168.1.23:81/upload/cainiaoYunPrint/72b32a1f754ba1c09b3695e0cb6cde7f.xml',
                                data : double_row
                            }
                        ]
                    });
                    double_row = {};
                }
            }else{
                documents.push({
                    documentID : ""+documentID,
                    contents : [
                        //自定义区部分
                        {
                            templateURL : 'http://192.168.1.23:81/upload/cainiaoYunPrint/72b32a1f754ba1c09b3695e0cb6cde7f.xml',
                            data : printData[i]['cust_data']
                        }
                    ]
                });
            }
        }
        request  = {
    		cmd : "print",
    		requetID : ""+printTaskId,
    		version : "1.0",
    		task : {
    			taskID :  '' + printTaskId,
    			preview : (isView || false),
                previewType : "image",
    			printer : printer,
    			documents : documents
    		}
    	};
        socket.send(JSON.stringify(request));
    }
        printTplYd.push({id:'48',name:'运单'});
    printTpl['48'] = function (printer,printData,isView){
        var myDate = new Date();
        var printTaskId = myDate.getTime()+parseInt(1000*Math.random());
        var documents = [];
        var double_row = {};
        var printDataLength = (printData.length);
        for(var i in printData){
            var documentID = myDate.getTime()+parseInt(1000*Math.random());
            if('T' == 'T'){
                var isPrintRow = false;
                var indexPrint = i * 1 + 1;
                if(indexPrint%2 == 1){
                    for(var field in printData[i]['cust_data']){
                        double_row[field+'1'] = printData[i]['cust_data'][field];
                    }
                    isPrintRow = false;
                }else if(indexPrint%2 == 0){
                    for(var field in printData[i]['cust_data']){
                        double_row[field+'2'] = printData[i]['cust_data'][field];
                    }
                    isPrintRow = true;
                }
                if(indexPrint == printDataLength){
                    isPrintRow = true;
                }
                if(isPrintRow){
                    documents.push({
                        documentID : ""+documentID,
                        contents : [
                            //自定义区部分
                            {
                                templateURL : 'http://192.168.1.146:999/upload/cainiaoYunPrint/642e92efb79421734881b53e1e1b18b6.xml',
                                data : double_row
                            }
                        ]
                    });
                    double_row = {};
                }
            }else{
                documents.push({
                    documentID : ""+documentID,
                    contents : [
                        //自定义区部分
                        {
                            templateURL : 'http://192.168.1.146:999/upload/cainiaoYunPrint/642e92efb79421734881b53e1e1b18b6.xml',
                            data : printData[i]['cust_data']
                        }
                    ]
                });
            }
        }
        request  = {
    		cmd : "print",
    		requetID : ""+printTaskId,
    		version : "1.0",
    		task : {
    			taskID :  '' + printTaskId,
    			preview : (isView || false),
                previewType : "image",
    			printer : printer,
    			documents : documents
    		}
    	};
        socket.send(JSON.stringify(request));
    }

	//公告功能
	$.ajax({
		type:'POST',
		url:'/index.php?m=system&c=index&a=ggTimeShow',
		data:{},
		dataType:'json',
		async:false,
		success:function(data){
			for(var i=0;i<data.length;i++){
				$("#news").append("<li><a href='javascript:;' onclick=\"ggAlert('"+data[i].id+"')\">"+data[i].title+"【"+data[i].begin_time+"】</a></li>");
			}
			ggRun();
		}
	});	
	function ggRun(){
		var lengths = $("#news").find("li").length;
		$("#news").append($("#news").html());
		var timeNum = 0;
		var ggTimer = setInterval(function(){
			$("#news").animate({top:-20*timeNum+"px"});
			if(timeNum>lengths/2){
				$("#news").animate({top:"0px"},0);
				timeNum = 0;
			}
			timeNum++;
		},3000);
		$("#news").hover(function(){
			clearInterval(ggTimer);
		},function(){
			ggTimer = setInterval(function(){
				$("#news").animate({top:-20*timeNum+"px"});
				if(timeNum>lengths/2){
					$("#news").animate({top:"0px"},0);
					timeNum = 0;
				}
				timeNum++;
			},3000);
		})
	} 
	function ggAlert(id){
		$.ajax({
			type:'POST',
			url:'/index.php?m=system&c=index&a=ggTimeShow',
			data:{id:id},
			dataType:'json',
			async:false,
			success:function(data){
				layer.open({
					type: 1,
					title: data[0].title,
					skin: 'layui-layer-rim', 
					area: ['620px', '350px'],
					content: data[0].content
				});
			}
		});
		
	}

