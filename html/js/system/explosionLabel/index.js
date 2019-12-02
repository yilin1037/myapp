var table;
var flow = new Vue({
	el: '#flow',
	data: {
		explosion_code:'',
		countdown:0,
		printNow:0,
		unprintTplBq:'',  //已选择的电子面单模板id
		unprintname:'',   //已选择的打印机
		layprint:[],
		getTemplate:[],
		preDeliveryMsg:[],
		express_type:'',
		defaultMsg:[],
	},
	mounted: function() {
		var oWidth = $(window).width();
		$(".rightTable").css('width',(oWidth-400)+'px');
		layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
			var laydate = layui.laydate 	//日期
				,laypage = layui.laypage 	//分页
				,layer = layui.layer 		//弹层
				,upload = layui.upload 		//上传
				,form = layui.form 			//表单
				,element = layui.element; 	//元素操作
			table = layui.table;
			
			//初始化表格样式
			table.render(dataList);
			form.on('switch(printNow)', function(data){
				if(this.checked == true){
					flow.printNow = 1;
				}else{
					flow.printNow = 0;
				}
			});
		})
		
		$("#printNow").prop("checked", false);
		$("#logisticsSingle").focus();
	}
});

var dataList = {
	elem: '#dataList'
	,skin: 'row'
	,page: false 
	,limit: 100000 
	,cellMinWidth: 80
	,height: 'full-150'
	,cols: [[
		{checkbox: true}
		,{type:'numbers', width:50, title: '序号'}
		,{field:'pic_url', width:70, title: '图片', align: 'center', style:"height:60px;"}
		,{field:'printState', width:100, title: '打印状态', templet: '#printState', align: 'center'}
		,{field:'shopname', width:100, title: '店铺', align: 'center'}
		,{field:'addtime', width:160, title: '生成日期', align: 'center'}
		,{field:'payment_time', width:160, title: '付款时间', align: 'center'}
		,{field:'new_tid', width:160, title: '订单号', align: 'center'}
		,{field:'send_status_name', width:80, title: '状态', templet: '#send_status', align: 'center'}
		,{field:'refund_status', width:100, title: '退款状态', templet: '#refund_state', align: 'center'}
		,{field:'express_name', width:100, title: '快递', align: 'center'}
		,{field:'express_no', width:160, title: '快递单号', align: 'center'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
};
var tableLoad = {
	tableObj:false,
	tableLoadFunction:function(){
		dataList['page'] = {
			curr: 1 
		};
		
		var explosion_code = $("#logisticsSingle").val();
		$("#logisticsSingle").val("");
		explosion_code = $.trim(explosion_code);
		flow.explosion_code = explosion_code;
		var deliveryOnoff = flow.printNow;
		doGetPrinters(function(data){
			flow.layprint = data;
		});
		$('#printNum').val(0);
		$.ajax({
			url:'?m=system&c=explosionLabel&a=getData',
			dataType: 'json',
			type: "post",
			data:{
				explosion_code: explosion_code,
			},
			success:function(data){
				$("#logisticsSingle").attr("readonly",false);
				$("#logisticsSingle").blur();
				var order_data = data.order_data;
				var express_data = data.express_data;
				var print_num = data.print_num;
				
				if(order_data && order_data != ''){
					if(order_data[0].new_tid == ''){
						speckText('没有查找到订单');
						layer.msg('没有查找到订单',{
							icon: 2,
							time: 2000
						});
						dataList.data = [];
						if(tableLoad.tableObj){
							table.render(dataList);
						}
						return false;
					}
					
					var a = 0;
					var express_type = express_data.express_type;
					var express_name = express_data.express_name;
					flow.express_type = express_type;
					
					$.ajax({
						url: "/index.php?m=system&c=printShip&a=getDef",
						type: 'post',							
						data: {express_type: express_type},
						async:false,
						dataType: 'json',				
						success: function (data) {
							//console.log(data);
							if(data.print == "" || data.print == null){
								a = 1;
							}
							if(data.id =="" || data.id == null){
								a = 2;
							}
							
							flow.unprintTplBq = data.id;
							flow.unprintname = data.print;
							
							var layprintList = flow.layprint;
							var layOnOff = 0;
							for(var i=0;i<layprintList.length;i++){
								if(layprintList[i]['name'] == data.print){
									$("#layprint").val(data.print);
									layOnOff = 1;
								}
							}
							if(layOnOff == 0){
								a = 3;
								layer.msg('快递'+ express_name + '当前快递单打印机不存在<br/>',{
									icon: 0,
									time: 2000
								});
							}
						}													
					});
					
					if(a == 1){
						printerPrompt('快递'+ express_name + '未设置默认打印机','默认打印机设置','index.php?m=system&c=printer&a=printer');
						return false;
					}else if(a == 2){
						printerPrompt('快递'+ express_name + '未设置默认打印模板','电子面单设计','index.php?m=print&c=dzmdDesign&a=index');
						return false;
					}
					
					var dataLength = order_data.length;
					$('#printNum').val(print_num);
					
					if(!tableLoad.tableObj){
						for(var i=0;i<order_data.length;i++){
							dataList.data.push(order_data[i]);
						}
						tableLoad.tableObj = table.render(dataList);
					}else{
						dataList.data = [];
						for(var i=0;i<order_data.length;i++){
							dataList.data.push(order_data[i]);
						}
						tableLoad.tableObj = table.render(dataList);
					}
					
					
					//扫描发货
					if(deliveryOnoff == 1){
						timingDelivery('F',explosion_code);
					}
				}else{
					speckText('没有查找到订单');
					layer.msg('没有查找到订单',{
						icon: 2,
						time: 2000
					});
					dataList.data = [];
					if(tableLoad.tableObj){
						table.render(dataList);
					}
					//table.render(dataList);
				}
			}
		})
	}
};

//扫描发货
function logSingle(){
	if($("#logisticsSingle").val() == ""){
		layer.msg('请先扫描爆款标签',{
			icon: 0,
			time: 2000
		});
		return false;
	}
	$("#logisticsSingle").attr("readonly",true);
	tableLoad.tableLoadFunction();
}

function startDelivery(){
	timingDelivery('',flow.explosion_code);
}

//扫描发货
function timingDelivery(passError,explosion_code){//passError 跳过异常订单发货
	$("#printForce").attr("disabled",true);
	$("#delivery").attr("disabled",true);
	var printNum = $('#printNum').val();
	if(printNum == '' || printNum == 0){
		layer.msg('请先输入发货数量',{
			icon: 0,
			time: 2000
		});
		$("#logisticsSingle").focus();
		$("#printForce").attr("disabled",false);
		$("#delivery").attr("disabled",false);
		return false;
	}
	
	if(tableLoad.tableObj.config.data && tableLoad.tableObj.config.data.length > 0){
		var tabledata = tableLoad.tableObj.config.data;
		var printLength = tabledata.length;
		var onlySendWl = mini.get('onlySendWl').value;
		var onlySendWlList = mini.get('onlySendWlList').value;
		onlySendWlList = ',' + onlySendWlList + ',';
		
		for(var i = 0; i < printLength; i++){
			var new_tid = tabledata[i].new_tid;
			var express_type = tabledata[i].express_type;
			if(express_type == ''){
				layer.msg('订单'+ new_tid +'快递为空！请先选择发货快递',{
					icon: 0,
					time: 2000
				});
				$("#printForce").attr("disabled",false);
				$("#delivery").attr("disabled",false);
				return false;
			}
		}
		
		if(printNum < printLength){
			printLength = printNum;
		}
		
		//先进行预发货
		var preDeliveryIndex = layer.open({
			type: 1,
			title: '发货',
			skin: 'layui-layer-rim', 
			area: ['700px', '500px'],
			shade: 0.3,
			content: $("#edit-pages8"),
			cancel: function (index, layero) {
				
			}
		});
		$("#progress-delivery").css("display","block");
		var time = new Date().getTime();
		$.ajax({
			url: "/index.php?m=system&c=explosionLabel&a=preDelivery",
			type: 'post',
			data: {explosion_code: explosion_code, printLength: printLength, time: time},	
			dataType: 'json',
			success: function (return_data) {
				if(return_data.code == "error"){
					flow.preDeliveryMsg = return_data.error_msg;
					$("#printForce").attr("disabled",false);
					$("#delivery").attr("disabled",false);
					//btnObj.prop("disabled",false);
				}else if(return_data.code == "ok"){
					layer.close(preDeliveryIndex);
					layer.msg('预发货成功',{
						icon: 1,
						time: 2000
					});
					var successTids = return_data.successTids;
					if(!successTids || successTids == ""){
						layer.msg('没有可打印的订单',{
							icon: 0,
							time: 2000
						});
						$("#delivery").attr("disabled",false);
						$("#printForce").attr("disabled",false);
					}else{
						print_now(successTids);//打印
					}
				}
			}
		})
		
		var Interval = setInterval(function(){
			$.ajax({
				url: "/index.php?m=system&c=explosionLabel&a=getDeliveryPer",
				type: 'post',
				data: {time: time},
				dataType: 'json',
				success: function (data) {
					if(data){
						layui.use('element', function(){
							var element = layui.element;
							element.init();			//进度条
							element.progress('delivery', data.per + '%');
							$("#pages8-title").html(data.msg);					
						});
							
						if(data.code == "end"){
							clearInterval(Interval);
						}
					}else{
						clearInterval(Interval);
					}
				},error: function(){
					clearInterval(Interval);
				}
			});
		},1000);
			
		/*$.ajax({
			url: "?m=system&c=explosionLabel&a=delivery",
			type: "post",
			async:false,
			dataType:"json",
			data: { new_tid: new_tid},
			success: function (data) {
				if(data.code == 'error'){
					check = 'F';
					$("#delivery").attr("disabled",false);
					layer.msg(data.msg + '，自动打印停止，请自行选择要打印的订单！',{
						icon: 2,
						time: 2000
					});
				}else{
					miandan(new_tid, express_type);
				}
			}
		});*/
				
				
		/*var alltidList = [];
		for(var i = 0; i < printLength; i++){
			var new_tid = tabledata[i].new_tid;
			
			if(onlySendWl == 'true' && onlySendWlList.indexOf(',' + express_type + ',') == -1){
				
			}else{
				alltidList.push(new_tid);
			}
		}*/
		
		/*for(var i = 0; i < printLength; i++){
			var new_tid = tabledata[i].new_tid;
			var express_type = tabledata[i].express_type;
			var check = 'T';
			
			if(onlySendWl == 'true' && onlySendWlList.indexOf(',' + express_type + ',') == -1){
				//只发快递
			}else{
				$.ajax({
					url: "?m=system&c=explosionLabel&a=delivery",
					type: "post",
					async:false,
					dataType:"json",
					data: { new_tid: new_tid},
					success: function (data) {
						if(data.code == 'error'){
							check = 'F';
							$("#delivery").attr("disabled",false);
							layer.msg(data.msg + '，自动打印停止，请自行选择要打印的订单！',{
								icon: 2,
								time: 2000
							});
						}else{
							miandan(new_tid, express_type);
						}
					}
				});
			}
			
			if(check == 'F'){
				$("#delivery").attr("disabled",false);
				return;
			}
			
			layer.msg('发货完成',{
				icon: 1,
				time: 2000
			});
			$("#delivery").attr("disabled",false);
		}*/
		
	}else{
		layer.msg('没有可以发货的订单',{
			icon: 0,
			time: 2000
		});
		$("#printForce").attr("disabled",false);
		$("#delivery").attr("disabled",false);
		$("#logisticsSingle").focus();
		return false;
	}
}

function print_now(data){
	var unprintTplBq = flow.unprintTplBq;
	var unprintname = flow.unprintname;
	if(unprintTplBq == ''){
		layer.msg('未设置默认打印模板',{
			icon: 0,
			time: 2000
		});
		$("#printForce").attr("disabled",false);
		$("#delivery").attr("disabled",false);
		$("#logisticsSingle").focus();
		return false;
	}
	if(unprintname == ''){
		layer.msg('未设置默认打印机',{
			icon: 0,
			time: 2000
		});
		$("#printForce").attr("disabled",false);
		$("#delivery").attr("disabled",false);
		$("#logisticsSingle").focus();
		return false;
	}
	
	$.ajax({
		url: "/index.php?m=system&c=explosionLabel&a=printNow",			
		type: 'post',															
		data: {data: data, express_type: flow.express_type, explosion_code: flow.explosion_code},
		dataType: 'json',
		success: function (data) {
			$("#printForce").attr("disabled",false);
			$("#delivery").attr("disabled",false);
			if(data.dataCheck && data.numCheck > 0){
				flow.defaultMsg = data.dataCheck;
				
				layer.open({
					type: 1,																																											
					title: '打印详情',																																								
					skin: 'layui-layer-rim', //加上边框																																					
					area: ['800px', '400px'], //宽高																																					
					shade: 0.3,																																											
					content: $("#default")																																													
				});	
			}
			
			if(data.dates && data.dates.length > 0){
				var newData = [];												
				var num = 0;
				
				newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
				printTpl[unprintTplBq](unprintname,newData);
				
				var grid_data = tableLoad.tableObj.config.data;
				for(var i = 0; i < grid_data.length; i++){
					console.log(grid_data[i]);
					for(var j = 0; j < data.unprintall.length; j++){
						console.log(grid_data[i]);
						if(grid_data[i]['new_tid'] == data.unprintall[j]['new_tid']){
							grid_data[i]['send_status_name'] = '已发货';
							grid_data[i]['printState'] = '已打印';
							break;
						}
					}
				}
				
				dataList.data = grid_data;
				table.render(dataList);
			}
			
			$("#logisticsSingle").focus();
		}																
	});	
}

function printForce(){
	var btnClass = $("#printForce").attr('class');
	if(btnClass && btnClass.indexOf('layui-btn-disabled') != -1){
		return false;
	}
	$("#printForce").attr("disabled",true);
	$("#delivery").attr("disabled",true);
	var checkStatus = table.checkStatus('dataList');
	var onlySendWl = mini.get('onlySendWl').value;
	var onlySendWlList = mini.get('onlySendWlList').value;
	onlySendWlList = ',' + onlySendWlList + ',';
	
	if(checkStatus.data.length == 0){
		layer.msg('请先扫描一个爆款标签',{
			icon: 0,
			time: 2000
		});
		
		$("#printForce").attr("disabled",false);
		$("#delivery").attr("disabled",false);
		return false;
	}
	
	var tidList = [];
	for(var i = 0; i < checkStatus.data.length; i++){
		var new_tid =  checkStatus.data[i].new_tid;
		var express_type =  checkStatus.data[i].express_type;
		
		if(onlySendWl == 'true' && onlySendWlList.indexOf(',' + express_type + ',') == -1){
			//只发快递
		}else{
			tidList.push({new_tid: new_tid});
		}
	}
	
	if(tidList.length > 0){
		//先进行预发货
		var preDeliveryIndex = layer.open({
			type: 1,
			title: '发货',
			skin: 'layui-layer-rim', 
			area: ['700px', '500px'],
			shade: 0.3,
			content: $("#edit-pages8"),
			cancel: function (index, layero) {
				
			}
		});
		$("#progress-delivery").css("display","block");
		var time = new Date().getTime();
		$.ajax({
			url: "/index.php?m=system&c=explosionLabel&a=preDelivery",
			type: 'post',
			data: {tidList: tidList, printLength: tidList.length, time: time},	
			dataType: 'json',
			success: function (return_data) {
				if(return_data.code == "error"){
					flow.preDeliveryMsg = return_data.error_msg;
					$("#delivery").attr("disabled",false);
					$("#printForce").attr("disabled",false);
					//btnObj.prop("disabled",false);
				}else if(return_data.code == "ok"){
					layer.close(preDeliveryIndex);
					layer.msg('预发货成功',{
						icon: 1,
						time: 2000
					});
					var successTids = return_data.successTids;
					if(!successTids || successTids == ""){
						layer.msg('没有可打印的订单',{
							icon: 0,
							time: 2000
						});
						$("#delivery").attr("disabled",false);
						$("#printForce").attr("disabled",false);
					}else{
						print_now(successTids);//打印	
					}
				}
			}
		})
		
		var Interval = setInterval(function(){
			$.ajax({
				url: "/index.php?m=system&c=explosionLabel&a=getDeliveryPer",
				type: 'post',
				data: {time: time},
				dataType: 'json',
				success: function (data) {
					if(data){
						layui.use('element', function(){
							var element = layui.element;
							element.init();			//进度条
							element.progress('delivery', data.per + '%');
							$("#pages8-title").html(data.msg);					
						});
							
						if(data.code == "end"){
							clearInterval(Interval);
						}
					}else{
						clearInterval(Interval);
					}
				},error: function(){
					clearInterval(Interval);
				}
			});
		},1000);
	}
}

/*function miandan(new_tid,express_type, ForcePrint){
	var printConfig = flow.printConfig;
	if(ForcePrint == 'T'){
		var force = 'true';
	}else{
		var force = 'false';
	}
	
	var unprintTplBq = '';
	var unprintname = '';
	
	for(var i in printConfig){
		if(printConfig[i].express_type == express_type){
			unprintTplBq = printConfig[i].unprintTplBq;
			unprintname = printConfig[i].unprintname;
		}
	}
	
	if(unprintTplBq == ''){
		layer.msg('未设置默认打印模板',{
			icon: 0,
			time: 2000
		});
		return false;
	}
	if(unprintname == ''){
		layer.msg('未设置默认打印机',{
			icon: 0,
			time: 2000
		});
		return false;
	}
	
	$.ajax({
		url: "/index.php?m=system&c=printShip&a=printNow",			
		type: 'post',															
		data: {data: new_tid, type: express_type, force: force},
		dataType: 'json',
		success: function (data) {
			if(data.dates && data.dates[0] != ""){
				var newData = [];												
				var num = 0;
				
				newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
				printTpl[unprintTplBq](unprintname,newData);
			}else{
				if(data.code == "error"){
					layer.msg(data.msg,{
						icon: 2,
						time: 2000
					});
				}else{
					layer.msg('订单已打印',{
						icon: 2,
						time: 2000
					});
				}
			}
		}																
	});		
}*/

function userPrinterSetup(){
	$("#layprintTplBq").val("");
	$("#layprint").val("");
	//打印模板
	$.ajax({
		url:'/?m=system&c=printShip&a=getTemplate',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			flow.getTemplate = data;
		}
	})
	//打印机
	doGetPrinters(function(data){
		flow.layprint = data;
	});
	
	layer.open({
		type: 1,
		title: '当前操作员打印机设置',
		skin: 'layui-layer-rim', 
		area: ['500px', '300px'], 
		shade: 0.3,
		shade: 0,
		content: $("#userPrinterSetupWindow"),
		btn: ['确定', '取消'],
		yes: function(index, layero){
			var layprintTplBq = $("#layprintTplBq").val();
			//console.log(layprintTplBq);
			var layprint = $("#layprint").val();
			$.ajax({
				url:'/?m=system&c=printShip&a=getTplBqLayprint',
				dataType: 'json',
				type: "post",
				data:{
					layprintTplBq:layprintTplBq,
					layprint:layprint,
				},
				success:function(data){
					if(data.code == 'error'){
						layer.msg(data.msg);
					}else{
						layer.msg('绑定成功');
					}
				}
			});
		}
	});
}


//监听打印机
function layprintTplBqChoose(){
	var layprintTplBq = $("#layprintTplBq").val();
	//console.log(layprintTplBq);
	$.ajax({
		url:'/?m=system&c=printShip&a=getLayprintChoose',
		dataType: 'json',
		type: "post",
		data:{
			layprintTplBq:layprintTplBq
		},
		success:function(data){
			if(data.code == 'ok'){
				var layprintList = flow.layprint;
				var layOnOff = 0;
				var values = data.msg;
				for(var i=0;i<layprintList.length;i++){
					if(layprintList[i]['name'] == values){
						$("#layprint").val(values);
						layOnOff = 1;
					}
				}
				if(layOnOff == 0){
					$("#layprint").append('<option style="display:none;" value="'+values+'">'+values+'</option>');
					layer.msg('不存在当前名称的打印机');
					$("#layprint").val(values);
				}
			}else{
				$("#layprint").val("");
			}
		}
	})
}

$(document).ready(function(){
	$(document).keydown(function(event){
		if(event.keyCode==13){
			var id=$("input:focus").attr("id"); 
			if(id == undefined || (id != 'logisticsSingle'))
			{
				setTimeout(function(){
					var id=$("input:focus").attr("id");
					if(id == undefined || (id != 'logisticsSingle'))
					{
						$('#logisticsSingle').focus();	
					}
				},1000);
			}
		}
	})
});