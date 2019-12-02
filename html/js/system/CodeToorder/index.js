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
		layprintTplBq:[],
		chooseLayprint:"",
		chooseTplBq:"",
		uniqueCode:"",
		defPrinter:"",
		defTpl:"",
		printData:[],
	},
	mounted: function() {
		//获取模板
		$.ajax({
			url:'/?m=system&c=cusUniqueCheck&a=getPrintTpl',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				flow.layprintTplBq = data['data'];
			}
		})
		//获取默认模板和打印机
		$.ajax({
			url:'/?m=system&c=cusUniqueCheck&a=getDefaultTplPrinter',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				flow.defPrinter = data['defPrinter'];
				flow.defTpl = data['defTpl'];
			}
		})
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
			//获取打印机
			doGetPrinters(function(data){
				var layprint = '<option value="">打印机</option>';
				for(var i=0;i<data.length;i++){
					if(data[i]['name'] == flow.defPrinter){
						layprint += '<option value="'+data[i]['name']+'" selected>'+data[i]['name']+'</option>';
					}else{
						layprint += '<option value="'+data[i]['name']+'">'+data[i]['name']+'</option>';
					}
				}
				$("#layprint").html(layprint);
				form.render('select');
			});
			//重打标签
			$("#savePrintOrder").click(function(){
				var onOff = $("#savePrintOrder").hasClass('layui-btn-disabled');
				if(!onOff){
					if(flow.isFirst == true){
						var layprintTplBq = flow.chooseTplBq;
						var layprint = flow.chooseLayprint;
						var printData = flow.printData;
						printTpl[layprintTplBq](layprint,printData[0]);
						flow.isFirst = false;
					}
					setTimeout(function(){
						flow.isFirst = true;
					},200);
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
		,{field:'prd_no', width:300, title: '商品编码'}
		,{field:'tid', minWidth:200, title: '订单号'}
		,{field:'unique_code', minWidth:200, title: '唯一码'}
		,{field:'sku_name', minWidth:200, title: '商品属性'}
		,{field:'title', minWidth:200, title: '商品名称'}
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
		var unique_code = $("#prdBarcode").val();
		$("#prdBarcode").val("");
		flow.unique_code = unique_code;
		var deliveryOnoff = 1;
		doGetPrinters(function(data){
			flow.layprint = data;
		});
			
		$.ajax({
			url:'?m=system&c=CodeToorder&a=getOrderToCode',
			dataType: 'json',
			type: "post",
			data:{
				unique_code: unique_code,
			},
			success:function(data){
				if(data.res && data.res!=''){
					if(!tableLoad.tableObj){
						dataList.data.push(data.res);
						flow.printData=data.printData;
						flow.data = data.res;
						tableLoad.tableObj = table.render(dataList);
					}else{
						dataList.data = [];
						dataList.data.push(data.res);
						flow.printData=data.printData;
						flow.data = data.res;
						tableLoad.tableObj.reload(dataList);
					}
					var saveData=flow.data;
					var printData= flow.printData;
					if(saveData == ""){
						speckText('请先扫描唯一码');
						layer.msg('请先扫描唯一码');
						return false;
					}
					var layprint = $("#layprint").val();
					if(layprint == ""){
						speckText('请选择打印机');
						layer.msg('请选择打印机');
						return false;
					}
					flow.chooseLayprint = layprint;
					var layprintTplBq = $("#layprintTplBq").val();
					if(layprintTplBq == ""){
						speckText('请选择打印模板');
						layer.msg('请选择打印模板');
						return false;
					}
					flow.chooseTplBq = layprintTplBq;
					var printData= flow.printData;
					printTpl[layprintTplBq](layprint,printData[0]);
					speckText('匹配成功');
					layer.msg('打印完成',{
									icon: 1,
									time: 2000
							});
				}else{
					flow.system_id = '';
					speckText('没有查找到订单');
					layer.msg('没有查找到订单',{
						icon: 2,
						time: 2000
					});
	
					if(tableLoad.tableObj){
						tableLoad.tableObj.reload(dataList);	
					}
					return false;
				}
			}
		})
		$("#prdBarcode").attr("readonly",false);
	}
};

	

//扫描发货
function logSingle(){
	var unique_code = $("#prdBarcode").val();
	if(unique_code == ''){
	speckText('请扫描唯一码');
	layer.msg('请扫描唯一码',{
		icon: 0,
		time: 2000
	});
		return false;
	}
	$("#prdBarcode").attr("readonly",true);
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