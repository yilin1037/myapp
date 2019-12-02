var flow = new Vue({
	el: '#flow',
	data: {
		dataList:[],
		proList:"",  	//当前扫描的唯一码
		cus_no:"",		//供应商编码
		prd_loc:"",		//货位编号
		wh_loc:"",		//仓库编号
	}
})
layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,upload = layui.upload //上传
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;
	
	//监听供应商选择
	table.on('tool(treeCustList)', function(obj){
		var data = obj.data;
		flow.cus_no = data.cus_no;
		layer.closeAll();
		$("#intoCust").val(data.cus_name);
	});
	
	//初始化右侧表格
	table.render(dataListOne);
})

//扫描商品条码
function scanProInventory(){
	var serial_no = $("#prdBarcode").val();
	if(serial_no == ''){
		layer.msg('请输入商品条码');
		speckText('请输入商品条码');
		return false;
	}
	var cus_no = flow.cus_no;
	if(cus_no == ''){
		layer.msg('请选择供应商');
		speckText('请选择供应商');
		return false;
	}
	$.ajax({
		url:'?m=WMS&c=BarcodeOutbound&a=prdBarcodeInCheck',
		dataType: 'json',
		type: "post",
		data:{
			serial_no:serial_no,
			cus_no:cus_no,
		},
		success:function(data){
			if(data['code'] == "ok"){
				layer.msg('采购退回成功');
				speckText('成功');
				flow.dataList = data['data'];
				dataLoadOne.tableLoadTable();
			}else{
				layer.msg(data['msg']);
				speckText(data['msg']);
			}
		}
	})
	$("#prdBarcode").val("");
	$("#prdBarcode").focus();
}

var dataListOne = {
	elem: '#dataListOnes'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,height: 'full-150'
	,cols: [[ 
		{type:'numbers', width:50}
		,{field:'prd_no', width:150, title: '商品编码'}
		,{field:'prd_name', width:150, title: '商品名称'}
		,{field:'prd_sku_name', width:150, title: '商品属性'}
		,{field:'nums', width:90, title: '数量'}
		,{field:'up_cst', width:90, title: '进货价'}
	]]
	,id: 'dataListOnes'
	,data:[]
	,even: true
};
var dataLoadOne = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		dataListOne['page'] = {
			curr: 1 
		};
		var nowTime = $("#nowTime").val();
		var cus_no = $("#intoCust").val();
		$.ajax({
			url:'/?m=WMS&c=BarcodeOutbound&a=getLocProList',
			dataType: 'json',
			type: "post",
			data:{
				nowTime:nowTime,
				cus_no:cus_no,
			},
			success:function(dataList){
				if(!dataLoadOne.tableObj){
					for(var i=0;i<dataList.length;i++){
						dataListOne.data.push(dataList[i]);
					}
					dataLoadOne.tableObj = table.render(dataListOne);
				}else{
					dataListOne.data = [];
					for(var i=0;i<dataList.length;i++){
						dataListOne.data.push(dataList[i]);
					}
					dataLoadOne.tableObj.reload(dataListOne);
				}
			}
		})
	}
};

//供应商
function intoCustSell( state ){
	custTableLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: "选择供应商",
		skin: 'layui-layer-rim', //加上边框
		area: ['800px', '550px'], //宽高
		shade: 0.3,
		content: $("#custSetChoose"),
		cancel: function(index, layero){ 
			flow.cus_no = "";
			$("#intoCust").val("");
		}
	});
}
var custLoad = {
	elem: '#treeCustList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: '400'
	,cols: [[ 
		{type:'numbers', width:80, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'cus_no', width:250, title: '供应商编号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'cus_name', minWidth:443, title: '供应商名称', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'treeWhList'
	,data:[]
	,even: true
};

var custTableLoad = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		custLoad['page'] = {
			curr: 1 
		};
		var custName = $("#custName").val();
		$.ajax({
			url:"/?m=PT&c=purchase&a=getCustTable",
			dataType: 'json',
			type: "post",
			data:{
				custName:custName
			},
			success:function(data){
				if(!custTableLoad.tableObj){
					for(var i=0;i<data.length;i++){
						custLoad.data.push(data[i]);
					}
					custTableLoad.tableObj = table.render(custLoad);
				}else{
					custLoad.data = [];
					for(var i=0;i<data.length;i++){
						custLoad.data.push(data[i]);
					}
					custTableLoad.tableObj.reload(custLoad);
				}
			}
		})
	}
};

//保存入库
$("#savePutin").click(function(){
	var table = layui.table;
	var data = dataListOne.data;
	if(flow.stateHidden == 'T'){
		for(var i in data){
			data[i]['price'] = data[i]['cost_price'];
		}
	}
	var cus_no = flow.cus_no;
	if(!cus_no || cus_no == ""){
		layer.msg('请选择供应商');
		return false;
	}
	var stateHidden = $("#stateHidden").val();
	$.ajax({
		url:'/?m=PT&c=BarcodeOutbound&a=savePutin',
		dataType: 'json',
		type: "post",
		data:{
			data:data,
			state:stateHidden,
			cus_no:cus_no,
			prd_loc:prd_loc,
		},
		success:function(data){
			if(data['code'] == 'ok'){
				dataListOne.data = [];
				dataLoadOne.tableObj.reload(dataListOne);
				layer.msg('保存成功');
				speckText('成功');
			}else{
				layer.msg(data['msg']);
				speckText(data['msg']);
			}
		}
	})
	$("#prdBarcode").focus();
})

function custSearchBtn(){
	custTableLoad.tableLoadTable();
}



