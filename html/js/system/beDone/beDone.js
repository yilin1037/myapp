
var done = new Vue({
	el: '#done',
	data: {
		isHave:false,
        pinDD:false,
		arr:{},
	},
	mounted: function() {
		var self = this;
		$.ajax({																																														
			url: "/index.php?m=system&c=beDone&a=getData",																																		
			type: 'post',																																												
			data: {},																																													
			dataType: 'json',																																											
			success: function (data) {
				self.arr = data;
			}																																															
		});
		
	},
	methods: {
		turnTo:function(a,url){
			parent.addTab(a,url,a);
		}
	}
});
var socket;
var socket_pdd;
var requestID = ""+parseInt(1000*Math.random());
function doConnect(func){
    if(typeof(socket) == 'undefined'){
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
            done.isHave=true;
            var data = JSON.parse(event.data);
            //console.log(data);
            if ("getPrinters" == data.cmd) {
                if(typeof(cbDoGetPrinters) == 'function'){
                    cbDoGetPrinters(data.printers);
                    cbDoGetPrinters = null;
                }
            }else if ("setPrinterConfig" == data.cmd) {
                if(typeof(cbSetPrinterConfig) == 'function'){
                    cbSetPrinterConfig(data);
                }
            }else if("print" == data.cmd){
                if(typeof(cbPrintView) == 'function' && data['previewImage']){
                    cbPrintView(data);
                }/*else if(typeof(cbPrintSend) == 'function' && data['taskID'].substring(0,4) == 'send'){
                    cbPrintSend(data);
                }*/
            }
        };
        socket.onerror = function(event) {
            done.isHave=false;
        };
    }
}
function doConnectPdd(func){
    if(typeof(socket_pdd) == 'undefined'){
        socket_pdd = new WebSocket('ws://127.0.0.1:5000');
        // 打开Socket
        socket_pdd.onopen = function(event){
            if(typeof(func) == 'function'){
                func();
            }
        };
        // 监听消息
        socket_pdd.onmessage = function(event)
        {
            done.pinDD=true;
            var data = JSON.parse(event.data);
            if ("getPrinters" == data.cmd) {
               
                if(typeof(cbDoGetPrinters) == 'function'){
                    cbDoGetPrinters(data.printers);
                    cbDoGetPrinters = null;
                }
            }else if ("setPrinterConfig" == data.cmd) {
                if(typeof(pddSetPrinterConfig) == 'function'){
                    pddSetPrinterConfig(data);
                }
            }else if("print" == data.cmd){
                if(typeof(cbPrintView) == 'function' && data['previewImage']){
                    cbPrintView(data);
                }
            }
        };
        socket_pdd.onerror = function(event) {
            done.PpinDDdd=false;
        };
    }
}
function doConnectPdd2(func){
    if(typeof(socket_pdd) == 'undefined'){
        socket_pdd = new WebSocket('ws://127.0.0.1:5000');
        // 打开Socket
        socket_pdd.onopen = function(event){
            if(typeof(func) == 'function'){
                func();
            }
        };
        // 监听消息
        socket_pdd.onmessage = function(event)
        {
            var data = JSON.parse(event.data);
            //console.log(data);
            if ("setPrinterConfig" == data.cmd) {
                if(typeof(pddSetPrinterConfig) == 'function'){
                    pddSetPrinterConfig(data);
                }
            } 
        };
        socket_pdd.onerror = function(event) {
            /*if(typeof(layer) == 'object'){
                layer.alert('请下载拼多多打印组件');
            }else{
                alert('请下载拼多多打印组件');
            }*/
        };
    }
}
//创建连接
doConnect(function(){
    doGetPrinters();
});
doConnectPdd(function(){
    doGetPrinters2();
});
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
function doGetPrinters2(func) {
    var request  = {
        requestID : requestID,
        version : '1.0',
        cmd : 'getPrinters'
    };
    socket_pdd.send(JSON.stringify(request));
    if(typeof(func) == 'function'){
        cbDoGetPrinters = func;
    }
}
var sendPrint = {};
function cbSetPrinterConfig(data){
    if(sendPrint[data['requestID']]){
        socket.send(sendPrint[data['requestID']]);
        sendPrint[data['requestID']] = {};
    }
    layer.closeAll('loading');
}

var sendPrintPdd = {};
function pddSetPrinterConfig(data){
    if(sendPrintPdd[data['requestID']]){
        socket_pdd.send(sendPrintPdd[data['requestID']]);
        sendPrintPdd[data['requestID']] = {};
    }
    layer.closeAll('loading');
}
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



