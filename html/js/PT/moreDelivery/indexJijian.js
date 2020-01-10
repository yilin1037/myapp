var flow = new Vue({
	el: '#flow',
	data: {
		data:[],
		express_no:'',
		countdown:0,
		system_id:'',
		DROP_SHIPPING_PAGE:"F",
		printNow:1,
		unprintTplBq:'',  //已选择的电子面单模板id
		unprintname:'',   //已选择的打印机
		layprint:[],
		getTemplate:[],
		express_type:'',
		new_tid:'',
	},
	mounted: function() {
		var oWidth = $(window).width();
		$(".rightTable").css('width',(oWidth-300)+'px');
		layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
			var laydate = layui.laydate 	//日期
				,laypage = layui.laypage 	//分页
				,layer = layui.layer 		//弹层
				,upload = layui.upload 		//上传
				,form = layui.form 			//表单
				,element = layui.element; 	//元素操作
			var table = layui.table;
			
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
		
		$("#printNow").prop("checked", true);
		
		var urlObj = GetRequest();
		var sysPlan = "";
		if(urlObj){
			if(urlObj.DROP_SHIPPING && urlObj.DROP_SHIPPING == "T"){
				flow.DROP_SHIPPING_PAGE = "T";//代发
			}
		}
	}
});

var dataList = {
	elem: '#dataList'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: 'full-80'
	,cols: [[ 
		{type:'numbers', width:100, title: '序号'}
		,{field:'pic_url', width:60, title: '图片'}
		,{field:'prd_no', minWidth:200, title: '编号'}
		,{field:'title', minWidth:200, title: '宝贝'}
		,{field:'sku_name', minWidth:200, title: '属性'}
		,{field:'nums', width:100, title: '数量'}
		,{field:'refund_status', width:100, title: '退货状态', templet: '#refund_state'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
};
var tableLoad = {
	tableObj:false,
	tableLoadFunction:function(){
		var table = layui.table;
		dataList['page'] = {
			curr: 1 
		};
		var express_no = $("#logisticsSingle").val();
		$("#logisticsSingle").val("");
		flow.express_no = express_no;
		var deliveryOnoff = 1;
		doGetPrinters(function(data){
			flow.layprint = data;
		});
			
		$.ajax({
			url:'?m=PT&c=moreDelivery&a=sendDelivery',
			dataType: 'json',
			type: "post",
			data:{
				express_no: express_no,
				DROP_SHIPPING_PAGE: flow.DROP_SHIPPING_PAGE,
			},
			success:function(data){
				if(data && data != ''){
					flow.data = data[0];
					if(data[0].system_id && data[0].system_id != ''){
						flow.system_id = data[0].system_id;
					}else{
						flow.system_id = '';
					}
					
					if(data[0].express_type && data[0].express_type != ''){
						flow.express_type = data[0].express_type;
					}else{
						flow.express_type = '';
					}
					
					if(data[0].new_tid && data[0].new_tid != ''){
						flow.new_tid = data[0].new_tid;
					}else{
						flow.new_tid = '';
					}
					
					if(data[0].tid == ''){
						speckText('没有查找到订单');
						layer.msg('没有查找到订单',{
							icon: 2,
							time: 2000
						});
						dataList.data = [];
						if(tableLoad.tableObj){
							tableLoad.tableObj.reload(dataList);	
						}
						return false;
					}
					
					for(var i=0;i<data.length;i++){
						if(data[i]['send_status'] == 'WAIT_SENDED'){  //已发货
							speckText('此单已发货');
							layer.msg('此单已发货',{
								icon: 0,
								time: 2000
							});
							deliveryOnoff = 0;
						}else if(data[i]['send_status'] == 'WAIT_FAULT'){  //已取消
							speckText('此单已取消');
							layer.msg('此单已取消',{
								icon: 0,
								time: 2000
							});
							dataList.data = [];
							if(tableLoad.tableObj){
								tableLoad.tableObj.reload(dataList);	
							}
							return false;
						}else if(data[i]['refund'] == 'SUCCESS'){
							speckText('此单已退款');
							layer.msg('此单已退款',{
								icon: 0,
								time: 2000
							});
							deliveryOnoff = 0;
						}else if(data[i]['refund'] == 'WAIT_SELLER_AGREE'){
							speckText('此单申请退款');
							layer.msg('此单申请退款',{
								icon: 0,
								time: 2000
							});
							deliveryOnoff = 0;
						}else if(data[i]['mark_status'] == 'LOCK'){
							speckText('此单已锁定');
							layer.msg('此单已锁定',{
								icon: 0,
								time: 2000
							});
							deliveryOnoff = 0;
						}else if(data[i]['express_no'] == ''){
							speckText('此单没有快递单号');
							layer.msg('此单没有快递单号',{
								icon: 0,
								time: 2000
							});
							deliveryOnoff = 0;
						}
					}
					if(!tableLoad.tableObj){
						for(var i=0;i<data.length;i++){
							dataList.data.push(data[i]);
						}
						tableLoad.tableObj = table.render(dataList);
					}else{
						dataList.data = [];
						for(var i=0;i<data.length;i++){
							dataList.data.push(data[i]);
						}
						tableLoad.tableObj.reload(dataList);
					}
					
					var a = 0;
					$.ajax({								
						url: "/index.php?m=system&c=printShip&a=getDef",
						type: 'post',							
						data: {express_type: data[0]['express_type'].replace('DF_','')},
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
								alert('当前快递单打印机不存在');
							}
						}													
					});
					
					if(a == 1){
						printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
						return false;
					}else if(a == 2){
						printerPrompt("未设置默认打印模板","电子面单设计","index.php?m=print&c=dzmdDesign&a=index");
						return false;
					}

					//扫描发货
					if(deliveryOnoff == 1){
						timingDelivery('F');
					}
				}else{
					flow.system_id = '';
					speckText('没有查找到订单');
					layer.msg('没有查找到订单',{
						icon: 2,
						time: 2000
					});
					table.render(dataList);
				}
			}
		})
		$("#logisticsSingle").attr("readonly",false);
	}
};

//扫描发货
function logSingle(){
	if($("#logisticsSingle").val() == ""){
		layer.msg('请输入快递/订单单号',{
			icon: 0,
			time: 2000
		});
		return false;
	}
	$("#logisticsSingle").attr("readonly",true);
	tableLoad.tableLoadFunction();
}

//扫描发货
var oSi = "";
var oDi = "";
function timingDelivery( state ){
	var setTime = $('input[name="setTime"]:checked').val();
	var express_no = flow.express_no;
	if(express_no == ''){
		express_no = $("#logisticsSingle").val();
		if(express_no == ""){
			layer.msg('请输入快递/订单单号',{
				icon: 0,
				time: 2000
			});
			return false;
		}
	}
	if(setTime<100 && state=='F'){
		flow.countdown = setTime;
		oSi = setInterval(function(){
			setTime--;
			if(setTime<0){
				clearInterval(oSi);
			}else{
				flow.countdown = setTime;
			}
		},1000);
		oDi = setTimeout(function(){
			$.ajax({
				url:'?m=PT&c=moreDelivery&a=timingExpress',
				dataType: 'json',
				type: "post",
				data:{
					express_no:express_no,
					system_id:flow.system_id,
				},
				success:function(data){
					if(data['code'] == 'ok'){
						// speckText('发货成功');
						// layer.msg('发货成功',{
						// 	icon: 1,
						// 	time: 2000
						// });7
						
						if(flow.printNow == 1 && data['data']['new_tid'] != ''){
							layer.msg('开始打印',{
								icon: 1,
								time: 2000
							});
							speckText('开始打印');

							
							miandan(data['data']['new_tid'], data['data']['express_type']);
						}else if(flow.printNow == 1 && data['data']['new_tid'] == ''){
							speckText('打印失败');
							layer.msg('打印失败',{
								icon: 2,
								time: 2000
							});
						}
					}else{
						speckText('查询无记录');
						layer.msg('查询无记录' + data['msg'],{
							icon: 2,
							time: 2000
						});
					}
				}
			})
			$("#logisticsSingle").focus();
			$("#logisticsSingle").val("");
			$("#logisticsSingle").attr("readonly",false);
		},setTime*1000);
	}else if(state=='T'){
		//清除N秒后自动发货
		if(oDi){
			clearTimeout(oDi);
		}
		//清空倒计时，并将时间归零
		if(oSi){
			clearInterval(oSi);
			flow.countdown = '0';
		}
		$.ajax({
			url:'?m=PT&c=moreDelivery&a=timingExpress',
			dataType: 'json',
			type: "post",
			data:{
				express_no:express_no,
				system_id:flow.system_id,
			},
			success:function(data){
				if(data['code'] == 'ok'){
					// speckText('发货成功');
					// layer.msg('发货成功',{
					// 	icon: 1,
					// 	time: 2000
					// });
					
					if(flow.printNow == 1 && data['data']['new_tid'] != ''){
						layer.msg('开始打印',{
							icon: 1,
							time: 2000
						});
						speckText('开始打印');
						miandan(data['data']['new_tid'], data['data']['express_type']);
					}else if(flow.printNow == 1 && data['data']['new_tid'] == ''){
						speckText('打印失败');
						layer.msg('打印失败',{
							icon: 2,
							time: 2000
						});
					}
				}else{
					speckText('查询无记录');
					layer.msg('查询无记录' + data['msg'],{
						icon: 2,
						time: 2000
					});
				}
			}
		})
		$("#logisticsSingle").focus();
		$("#logisticsSingle").val("");
		$("#logisticsSingle").attr("readonly",false);
	}
	$("#logisticsSingle").val("");
	$("#logisticsSingle").attr("readonly",false);
}

function GetRequest() {
	var url = location.search;
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

function printForce(){
	var btnClass = $("#printForce").attr('class');
	if(btnClass && btnClass.indexOf('layui-btn-disabled') != -1){
		return false;
	}
			
	$("#printForce").attr("disabled",true);
			
	var new_tid = flow.new_tid;
	var express_type = flow.express_type;
	if(new_tid == ""){
		layer.msg('请先扫描一个订单',{
			icon: 0,
			time: 2000
		});
	}
	
	miandan(new_tid, express_type.replace('DF_',''), 'T');
}

function miandan(new_tid,express_type, ForcePrint){
	if(ForcePrint == 'T'){
		var force = 'true';
	}else{
		var force = 'false';
	}
	$.ajax({
		url: "/index.php?m=PT&c=moreDelivery&a=printNowJijian",			
		type: 'post',															
		data: {data: new_tid, type: express_type, force: force, system_id: flow.system_id},
		dataType: 'json',
		success: function (data) {
			$("#printForce").attr("disabled",false);
			if(data.code =='ok'){
				var newData = [];												
				var num = 0;
				
				doGetPrinters(function(){
					newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
					printTpl[flow.unprintTplBq](flow.unprintname,newData);
				});
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
}

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











