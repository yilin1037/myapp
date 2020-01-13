//连接打印客户端
var socket;
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
            var data = JSON.parse(event.data);
            //console.log(data);
            if ("getPrinters" == data.cmd) {
                for(var i in data.printers){
                    var myDate = new Date();
                    var printTaskId = myDate.getTime()+parseInt(1000*Math.random());
                    socket.send(JSON.stringify({
                        "cmd":"resetPrinterPreferences", //重置打印机配置命令
                        "requestID":""+printTaskId,
                        "version":"1.0",
                        "printer":data.printers[i]["name"]
                    }));
                }
                if(typeof(cbDoGetPrinters) == 'function'){
                    cbDoGetPrinters(data.printers);
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
            if(typeof(layer) == 'object'){
                layer.alert('请下载菜鸟云打印插件2');
            }else{
                alert('请下载菜鸟云打印插件2');
            }
        };
    }
}
//创建连接

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
var sendPrint = {};
function cbSetPrinterConfig(data){
    if(sendPrint[data['requestID']]){
        socket.send(sendPrint[data['requestID']]);
        sendPrint[data['requestID']] = {};
    }
}