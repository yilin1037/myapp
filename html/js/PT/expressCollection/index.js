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
		,{field:'refund_status', width:100, title: '退款状态'}
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
		flow.data = [];
		dataList.data = [];
		if(tableLoad.tableObj){
			tableLoad.tableObj.reload(dataList);	
		}
		
		$.ajax({
			url:'?m=PT&c=expressCollection&a=sendDelivery',
			dataType: 'json',
			type: "post",
			data:{
				express_no: express_no,
				DROP_SHIPPING_PAGE: flow.DROP_SHIPPING_PAGE,
			},
			success:function(data){
				$("#logisticsSingle").attr("readonly",false);
				if(data && data != ''){
					if(data.code == 'error'){
						speckText(data.msg);
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});
					}
					
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
					
					var checkStatus = 0;
					for(var i=0;i<data.length;i++){
						if(data[i]['send_status'] == 'WAIT_FAULT'){  //已取消
							checkStatus = 1;
							break;
						}else if(data[i]['refund'] == 'SUCCESS'){
							checkStatus = 2;
							break;
						}else if(data[i]['refund'] == 'WAIT_SELLER_AGREE'){
							checkStatus = 3;
							break;
						}else if(data[i]['mark_status'] == 'LOCK'){
							checkStatus = 4;
							break;
						}else if(data[i]['send_status'] == 'WAIT_SENDED'){  //已发货
							checkStatus = 5;
						}else{
							checkStatus = 6;
							break;
						}
					}
					
					if(checkStatus == 1){  //已取消
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
					}else if(checkStatus == 2){
						speckText('此单有退款成功商品');
						layer.msg('此单有退款成功商品',{
							icon: 0,
							time: 2000
						});
						deliveryOnoff = 0;
						return false;
					}else if(checkStatus == 3){
						speckText('此单申请退款');
						layer.msg('此单申请退款',{
							icon: 0,
							time: 2000
						});
						deliveryOnoff = 0;
						return false;
					}else if(checkStatus == 4){
						speckText('此单已锁定');
						layer.msg('此单已锁定',{
							icon: 0,
							time: 2000
						});
						deliveryOnoff = 0;
						return false;
					}else if(checkStatus == 5){  //已发货
						speckText('通过');
						layer.msg('通过',{
							icon: 1,
							time: 2000
						});
						deliveryOnoff = 0;
					}else{
						speckText('此单状态异常');
						layer.msg('此单状态异常',{
							icon: 0,
							time: 2000
						});
						deliveryOnoff = 0;
						return false;
					}
						
					if(!tableLoad.tableObj){

						for(var i=0;i<data.length;i++){
							if(data[i]['send_status']=='WAIT_SENDED'){
								dataList.data.push(data[i]);
							}
						}
						tableLoad.tableObj = table.render(dataList);
					}else{
						dataList.data = [];
						for(var i=0;i<data.length;i++){
							if(data[i]['send_status']=='WAIT_SENDED'){
								dataList.data.push(data[i]);
							}
						}
						tableLoad.tableObj.reload(dataList);
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
			},error: function(){
				layer.msg('扫描异常，请重新扫描',{
					icon: 2,
					time: 2000
				});
				$("#logisticsSingle").attr("readonly",false);
			}
		})
	}
};

//扫描发货
function logSingle(){
	if($("#logisticsSingle").val() == ""){
		layer.msg('请输入快递号',{
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