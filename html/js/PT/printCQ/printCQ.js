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
		getTemplateCheck:[],
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

function printCQ(){
	var btnClass = $("#printCQ").attr('class');	
	$("#printCQ").attr("disabled",true);
		setTimeout(function() {
			$("#printCQ").attr("disabled",false);
		}, 2000);
	var new_tid = flow.new_tid;
	var express_type = flow.express_type;
	if(new_tid == ""){
		layer.msg('请先扫描一个订单',{
			icon: 0,
			time: 2000
		});
	}
	
	printCQlabel(new_tid, express_type.replace('DF_',''), 'T');
}

function userPrinterSetup(){
	//质检标签打印模板
	$("#layprintTplBq").val("");
	$("#layprint").val("");
	//打印模板
	$.ajax({
		url:'/?m=system&c=printShip&a=getTemplateCheck',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			flow.getTemplateCheck = data;
		}
	})
	//打印机
	doGetPrinters(function(data){
		flow.layprint = data;
	});
	layer.open({
		type: 1,
		title: '质检标签打印机设置',
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
				url:'/?m=system&c=printShip&a=checkTplBqLayprint',
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
	$.ajax({
		url:'/?m=system&c=printShip&a=getLayprintCheckChoose',
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

function printCQlabel(){
	var express_no = flow.express_no;
	var a = 0;
	$.ajax({								
		url: "/index.php?m=PT&c=printCQ&a=getDefCQlable",
		type: 'post',							
		data: {},
		async:false,
		dataType: 'json',				
		success: function (data) {
			var print = data.print;
			var printTplModule = data.printTplModule;
		
			if(print == "" || print == null){
				a = 1;
			}
			if(printTplModule =="" || printTplModule == null){
				a = 2;
			}
			var layprintList = flow.layprint;
			var layOnOff = 0;
			for(var i=0;i<layprintList.length;i++){
				if(layprintList[i]['name'] == print){
					layOnOff = 1;
				}
			}
			if(layOnOff == 0){
				layer.msg('当前质检标签打印机不存在');
			}else if(a == 1){
				layer.msg('请先设置质检标签打印机');
			}else if(a == 2){
				layer.msg('请先设置质检标签打印模板');
			}else{
				$.ajax({								
					url: "/index.php?m=PT&c=printCQ&a=getPrintDataCQ",
					type: 'post',							
					data: {express_no: express_no},
					async:false,
					dataType: 'json',				
					success: function (data) {
						printTpl[printTplModule](print,data);	
					}
				});
			}
		}
		
	});
	var alem= document.getElementById('logisticsSingle');
	alem.focus();		
}











