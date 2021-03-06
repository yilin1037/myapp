var flow = new Vue({
	el: '#flow',
	data: {
		dataList:[],
		proList:"",  	//当前扫描的唯一码
		cus_no:"",		//供应商编码
		prd_loc:"",		//货位编号
		wh_loc:"",		//仓库编号
		stateHidden:'',	//页面功能标记
		intoWh:"",    //仓库序号id
		intoWh_no:"", //仓库编号
		prd_id:'',		//选择的商品id
		prd_sku_id:'',	//选择的商品sku_id
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
	//获取打印机
	doGetPrinters(function(data){
		var ohtml = "";
		for(var i=0;i<data.length;i++){
			ohtml += "<option value='"+data[i].name+"'>"+data[i].name+"</option>";
		}
		$("#printer").html(ohtml);
		form.render('select');
	});
	//获取库存标签模板
	var ohtml = "";
	for(var i in printLodopTplList['SAKP']){
		if(printLodopTplList['SAKP'][i].def == 'T'){
			ohtml += "<option value='"+printLodopTplList['SAKP'][i].id+"' selected=''>"+printLodopTplList['SAKP'][i].name+"</option>";
		}else{
			ohtml += "<option value='"+printLodopTplList['SAKP'][i].id+"'>"+printLodopTplList['SAKP'][i].name+"</option>";
		}
	}
	$("#template").html(ohtml);
	form.render('select');
	//监听供应商选择
	table.on('tool(treeCustList)', function(obj){
		var data = obj.data;
		flow.cus_no = data.cus_no;
		layer.closeAll();
		$("#intoCust").val(data.cus_name);
	});
	
	//监听多个商品选择
	table.on('tool(choosePrdList)', function(obj){
		var data = obj.data;
		flow.dataList = data;
		loadTableList( data );
		layer.closeAll();
	});
	
	//初始化右侧表格
	table.render(dataListOne);
	
	var stateHidden = $("#stateHidden").val();
	flow.stateHidden = stateHidden;
	
	//监听数量修改，为负值是自动转换零
	table.on('edit(dataListOnes)', function(obj){
		var value = obj.value 	//得到修改后的值
		,data = obj.data 		//得到所在行所有键值
		,field = obj.field; 	//得到字段
		
		var tableData = dataListOne.data;
		for(var i=0;i<tableData.length;i++){
			if(tableData[i]['prd_id'] == data['prd_id'] && tableData[i]['prd_sku_id'] == data['prd_sku_id']){
				if(value<0){
					value = 0;
				}
				tableData[i][field] = value;
			}
		}
		dataListOne.data = tableData;
		dataLoadOne.tableObj.reload(dataListOne);
		totalSum(tableData);
	});
	
	table.on('tool(dataListOnes)', function(obj){
		var data = obj.data;
		if(obj.event === 'edit'){
			console.log(data);
			flow.prd_id = data['prd_id'];
			flow.prd_sku_id = data['prd_sku_id'];
			$("#locName").val("");
			locTableLoad.tableLoadTable();
			layer.open({
				type: 1,
				title: '选择货位',
				skin: 'layui-layer-rim', 
				area: ['800px', '550px'],
				shade: 0.3,
				content: $("#locTreeList"),
				cancel: function(index, layero){ 
					flow.prd_loc = "";
					flow.wh_loc = "";
					$("#hotLoc").val("");
				}
			});
		}
	});
	
	//监听货位选择
	table.on('tool(locTableList)', function(obj){
		var datas = obj.data;
		if($("#stateHidden").val() == 'T'){
			flow.prd_loc = datas.prd_loc;
			flow.wh_loc = datas.wh_loc;
			layer.closeAll();
			$("#hotLoc").val(datas.name);
		}else if($("#stateHidden").val() == 'F'){
			var prd_id = flow.prd_id;
			var prd_sku_id = flow.prd_sku_id;
			
			var tableData = dataListOne.data;
			for(var i=0;i<tableData.length;i++){
				if(tableData[i]['prd_id'] == prd_id && tableData[i]['prd_sku_id'] == prd_sku_id){
					tableData[i]['prd_loc'] = datas.prd_loc;
				}
			}
			dataListOne.data = tableData;
			dataLoadOne.tableObj.reload(dataListOne);
			layer.closeAll();
		}
	});
	//监听仓库选择
	table.on('tool(treeWhList)', function(obj){
		var data = obj.data;
		flow.intoWh = data.name;
		flow.intoWh_no = data.wh;
		res="";
		$.ajax({
			url:'/?m=goods&c=otherOut&a=memory',
			dataType: 'json',
			type: "post",
			data:{
				whName:data.wh
			},
			success:function(data){
				
			}
		})
		layer.closeAll();
		$("#intoWh").val(data.name);
		$("#hotLoc").val("");
	});
})

//货位选择
$("#hotLoc").click(function(){
	$("#locName").val("");
	locTableLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '选择货位',
		skin: 'layui-layer-rim', 
		area: ['800px', '550px'],
		shade: 0.3,
		content: $("#locTreeList"),
		cancel: function(index, layero){ 
			flow.prd_loc = "";
			flow.wh_loc = "";
			$("#hotLoc").val("");
		}
	});
})

//货位中仓库树形图
var setting = {
	data: {
		key: {
			title:"t"
		},
		simpleData: {
			enable: true
		}
	},
	callback: {
		onClick: onClick
	}
};
$(document).ready(function(){
	$.ajax({
		url:'/?m=PT&c=locInventory&a=getWhTable',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			var zNodes = data;
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
		}
	})
});
function onClick(event, treeId, treeNode, clickFlag) {
	locTableLoad.tableLoadTable(treeNode.id);
}
function locSetSearch(){
	locTableLoad.tableLoadTable();
}
//货位列表
var locLoad = {
	elem: '#locTableList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: '370'
	,cols: [[ 
		{type:'numbers', width:100, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'prd_loc', minWidth:140, title: '货位编号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'name', width:140, title: '货位名称', event: 'setSign', style:'cursor: pointer;'}
		,{field:'wh', width:140, title: '所属仓库', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'locTableList'
	,data:[]
	,even: true
};

var locTableLoad = {
	tableObj:false,
	tableLoadTable:function(id){
		var table = layui.table;
		locLoad['page'] = {
			curr: 1 
		};
		var locName = $("#locName").val();
		
		$.ajax({
			url:'/?m=PT&c=locInventory&a=getLocTable',
			dataType: 'json',
			type: "post",
			data:{
				id:id,
				locName:locName,
			},
			success:function(data){
				if(!locTableLoad.tableObj){
					for(var i=0;i<data.length;i++){
						locLoad.data.push(data[i]);
					}
					locTableLoad.tableObj = table.render(locLoad);
				}else{
					locLoad.data = [];
					for(var i=0;i<data.length;i++){
						locLoad.data.push(data[i]);
					}
					locTableLoad.tableObj.reload(locLoad);
				}
			}
		})
	}
};
var whTableLoad = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		whLoad['page'] = {
			curr: 1 
		};
		var whName = $("#whName").val();
		
		$.ajax({
			url:'/?m=PT&c=purchase&a=getWhTable',
			dataType: 'json',
			type: "post",
			data:{
				whName:whName
			},
			success:function(data){
				if(!whTableLoad.tableObj){
					for(var i=0;i<data.length;i++){
						whLoad.data.push(data[i]);
					}
					whTableLoad.tableObj = table.render(whLoad);
				}else{
					whLoad.data = [];
					for(var i=0;i<data.length;i++){
						whLoad.data.push(data[i]);
					}
					whTableLoad.tableObj.reload(whLoad);
				}
			}
		})
	}
};

function whSetBtn(){
	whTableLoad.tableLoadTable();
}

var whLoad = {
	elem: '#treeWhList'
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
		,{field:'wh', width:250, title: '仓库编号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'name', width:443, title: '仓库名称', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'treeWhList'
	,data:[]
	,even: true
};

//扫描商品条码
function scanProInventory(){
	var stateHidden = $("#stateHidden").val();
	var barcode = $("#prdBarcode").val();
	var jinxiaocun = $("#jinxiaocun").val();
	if(barcode == ''){
		layer.msg('请输入商品条码');
		return false;
	}
	$("#prdBarcode").val("");
	var cus_no = flow.cus_no;
	var prd_loc = flow.prd_loc;
	var wh = flow.intoWh_no;
	if(jinxiaocun == 'T'){
		if(!wh || wh == ""){
			layer.msg('请选择仓库');
			return false;
		}else{
			prd_loc = '@'+wh;
		}
	}
	if(stateHidden == "T"){
		if(!prd_loc || prd_loc == ""){
			layer.msg('请选择要出库的货位');
			return false;
		}
	}
	if(!cus_no || cus_no == ""){
		if(stateHidden == "T"){
			layer.msg('请选择供应商');
		}else{
			layer.msg('请选择客户');
		}
		return false;
	}
	$.ajax({
		url:'?m=PT&c=BarcodeOutbound&a=prdBarcodeInCheck',
		dataType: 'json',
		type: "post",
		data:{
			barcode:barcode,
			prd_loc:prd_loc,
            cus_no:cus_no,
			state:stateHidden,
		},
		success:function(data){
			if(data.code == 'ok'){
				speckText('通过');
				flow.dataList = data['msg'][0];
				loadTableList(data['msg'][0]);
			}else if(data.code == 'list'){
				chooseTableList(data['msg']);
			}else{
				layer.msg(data.msg);
				speckText(data.msg);
			}
		}
	})
	$("#prdBarcode").focus();
}

//增加列表商品
function loadTableList( data ){
	var table = layui.table;
	if(!dataLoadOne.tableObj){
		dataListOne.data.push(data);
		dataLoadOne.tableObj = table.render(dataListOne);
	}else{
		var onOff = 0;
		var datas = dataListOne.data;
		for(var i in datas){
			if(datas[i]['prd_no'] == data['prd_no'] && datas[i]['sku_name'] == data['sku_name'] && datas[i]['title'] == data['title'] && datas[i]['prd_loc'] == data['prd_loc']){
				dataListOne.data[i]['nums'] = parseInt(dataListOne.data[i]['nums']) + 1;
				dataLoadOne.tableObj.reload(dataListOne);
				onOff = 1;
			}
		}
		if(onOff == 0){
			dataListOne.data.push(data);
			dataLoadOne.tableObj.reload(dataListOne);
		}
	}
	totalSum(dataListOne.data);
}

//选择仓库
$("#intoWh").click(function(){
	$("#whName").val("");
	whTableLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '选择仓库',
		skin: 'layui-layer-rim', //加上边框
		area: ['800px', '550px'], //宽高
		shade: 0.3,
		content: $("#whSetChoose"),
		cancel: function(index, layero){ 
			flow.intoWh = "";
			flow.intoWh_no= "";
			$("#intoWh").val("");
		}
	});
})

//选择商品
function chooseTableList( data ){
	chooseTableLoad.tableLoadTable( data );
	layer.open({
		type: 1,
		title: '选择商品',
		skin: 'layui-layer-rim',
		area: ['800px', '500px'],
		shade: 0.3,
		content: $("#choosePrdBarcode"),
	});
}

if($("#stateHidden").val() == 'T'){
	var colsTable = [[ 
		{type:'numbers', width:50}
		,{field:'prd_no', minWidth:150, title: '商品编码', event: 'setSign', style:'cursor: pointer;'}
		,{field:'title', minWidth:150, title: '商品名称', event: 'setSign', style:'cursor: pointer;'}
		,{field:'sku_name', minWidth:150, title: '商品属性', event: 'setSign', style:'cursor: pointer;'}
		,{field:'nums', width:90, title: '数量', edit: 'text'}
		,{field:'cost_price', width:90, title: '进货价', edit: 'text'}
	]];
}else{
	var colsTable = [[ 
		{type:'numbers', width:50}
		,{field:'prd_no', minWidth:120, title: '商品编码', event: 'setSign', style:'cursor: pointer;'}
		,{field:'title', width:120, title: '商品名称', event: 'setSign', style:'cursor: pointer;'}
		,{field:'sku_name', width:120, title: '商品属性', event: 'setSign', style:'cursor: pointer;'}
		,{field:'nums', width:90, title: '数量', edit: 'text'}
		,{field:'prd_loc', width:90, title: '货位'}
		,{field:'price', width:90, title: '销售价', edit: 'text'}
		,{field:'qty', width:90, title: '库存'}
		,{fixed:'right', width:100, title: '操作', align:'center', toolbar: '#barDemo'}
	]];
}

var chooseLoad = {
	elem: '#choosePrdList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: '400'
	,cols: colsTable
	,id: 'choosePrdList'
	,data:[]
	,even: true
};
var chooseTableLoad = {
	tableObj:false,
	tableLoadTable:function( data ){
		var table = layui.table;
		chooseLoad['page'] = {
			curr: 1 
		};
		chooseLoad.data = [];
		for(var i=0;i<data.length;i++){
			chooseLoad.data.push(data[i]);
		}
		table.render(chooseLoad);
	}
};

var dataListOne = {
	elem: '#dataListOnes'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,where: {}
	,height: 'full-150'
	,cols: colsTable
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
		var prd_loc = flow.hotLoc_no;
		$.ajax({
			url:'/?m=PT&c=locInventory&a=getLocProList',
			dataType: 'json',
			type: "post",
			data:{
				prd_loc:prd_loc,
			},
			success:function(data){
				if(data.code == 'ok'){
					var dataList = data.data;
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
			}
		})
	}
};

//供应商
function intoCustSell( state ){
	var oTitle = "";
	if(state == 'T'){
		custTableLoad.tableLoadTable( 'T' );
		oTitle = "选择客户";
	}else if(state == 'F'){
		custTableLoad.tableLoadTable( 'F' );
		oTitle = "选择供应商";
	}
	layer.open({
		type: 1,
		title: oTitle,
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

function custSearchBtn(){
	if($("#stateHidden").val() == 'T'){
		custTableLoad.tableLoadTable( 'F' );
	}else if($("#stateHidden").val() == 'F'){
		custTableLoad.tableLoadTable( 'T' );
	}
	return false;
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
	tableLoadTable:function( state ){
		var table = layui.table;
		custLoad['page'] = {
			curr: 1 
		};
		var custName = $("#custName").val();
		var custName = $("#custName").val();
		var oUrl = "";
		if(state == 'T'){
			oUrl = "/?m=PT&c=BarcodeOutbound&a=getCustTable";
			custLoad['cols'] = [[ 
				{type:'numbers', width:80, title: '序号', event: 'setSign', style:'cursor: pointer;'}
				,{field:'cus_no', width:250, title: '客户编号', event: 'setSign', style:'cursor: pointer;'}
				,{field:'cus_name', minWidth:443, title: '客户名称', event: 'setSign', style:'cursor: pointer;'}
			]];
		}else if(state == 'F'){
			oUrl = "/?m=PT&c=purchase&a=getCustTable";
		}
		$.ajax({
			url:oUrl,
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
	var stateHidden = $("#stateHidden").val();
	var jinxiaocun = $("#jinxiaocun").val();
	var table = layui.table;
	var data = dataListOne.data;
	var wh = flow.intoWh_no;
	if(flow.stateHidden == 'T'){
		for(var i in data){
			data[i]['price'] = data[i]['cost_price'];
		}
	}
	
	if(flow.stateHidden == 'F' && jinxiaocun == 'F'){
		var onOff = 0;
		for(var i in data){
			if(data[i]['prd_loc'] == ""){
				onOff = 1;
			}
		}
		if(onOff == 1){
			layer.msg('请输入要出库的货位');
			return false;
		}
	}
	var cus_no = flow.cus_no;
	var prd_loc = flow.prd_loc;
	if(jinxiaocun == 'T'){
		if(!wh || wh == ""){
			layer.msg('请选择仓库');
			return false;
		}else{
			prd_loc = '@'+wh
		}
	}
	if(stateHidden == "T"){
		if(!prd_loc || prd_loc == ""){
			layer.msg('请选择要出库的货位');
			return false;
		}
	}


	if(!cus_no || cus_no == ""){
		if(stateHidden == "T"){
			layer.msg('请选择供应商');
		}else{
			layer.msg('请选择客户');
		}
		return false;
	}
	var stateHidden = $("#stateHidden").val();
	$("#savePutin").attr({"disabled":"disabled"});
	$("#putinPrint").attr({"disabled":"disabled"});
	$("#rePrint").attr({"disabled":"disabled"});
	
	data = JSON.stringify(data);
	data = encodeURI(data);
	
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
				$("#shopNum").html("");
				$("#shopMoney").html("");
			}else{
				layer.msg(data['msg']);
				speckText(data['msg']);
			}
			$("#savePutin").removeAttr("disabled");
			$("#putinPrint").removeAttr("disabled");
			$("#rePrint").removeAttr("disabled");
		}
	})
	$("#prdBarcode").focus();
});
//打单并入库
$("#putinPrint").click(function(){
	var printer = $("#printer").val();
	if(printer == ''){
		layer.msg('请选择打印机');
		return false;
	}
	var template = $("#template").val();
	if(template == ''){
		layer.msg('请选择打印模板');
		return false;
	}
	var stateHidden = $("#stateHidden").val();
	var jinxiaocun = $("#jinxiaocun").val();
	var table = layui.table;
	var data = dataListOne.data;
	var wh = flow.intoWh_no;
	if(flow.stateHidden == 'T'){
		for(var i in data){
			data[i]['price'] = data[i]['cost_price'];
		}
	}
	if(flow.stateHidden == 'F' && jinxiaocun == 'F'){
		var onOff = 0;
		for(var i in data){
			if(data[i]['prd_loc'] == ""){
				onOff = 1;
			}
		}
		if(onOff == 1){
			layer.msg('请输入要出库的货位');
			return false;
		}
	}
	var cus_no = flow.cus_no;
	var prd_loc = flow.prd_loc;
	if(jinxiaocun == 'T'){
		if(!wh || wh == ""){
			layer.msg('请选择仓库');
			return false;
		}else{
			prd_loc = '@'+wh;
		}
	}
	if(stateHidden == "T"){
		if(!prd_loc || prd_loc == ""){
			layer.msg('请选择要出库的货位');
			return false;
		}
	}
	if(!cus_no || cus_no == ""){
		if(stateHidden == "T"){
			layer.msg('请选择供应商');
		}else{
			layer.msg('请选择客户');
		}
		return false;
	}
	var stateHidden = $("#stateHidden").val();
	$("#savePutin").attr({"disabled":"disabled"});
	$("#putinPrint").attr({"disabled":"disabled"});
	$("#rePrint").attr({"disabled":"disabled"});
	
	data = JSON.stringify(data);
	data = encodeURI(data);
	
	$.ajax({
		url:'/?m=PT&c=BarcodeOutbound&a=savePutin',
		dataType: 'json',
		type: "post",
		data:{
			data:data,
			state:stateHidden,
			cus_no:cus_no,
			prd_loc:prd_loc,
			wh_no:wh
		},
		success:function(data){
			if(data['code'] == 'ok'){
				dataListOne.data = [];
				dataLoadOne.tableObj.reload(dataListOne);
				printLabel(data['data'],printer,template,2);
				layer.msg('保存成功');
				speckText('成功');
				$("#shopNum").html("");
				$("#shopMoney").html("");
			}else{
				layer.msg(data['msg']);
				speckText(data['msg']);
			}
			$("#savePutin").removeAttr("disabled");
			$("#putinPrint").removeAttr("disabled");
			$("#rePrint").removeAttr("disabled");
		}
	})
	$("#prdBarcode").focus();
});
//重新打印
var isClick = true;
$("#rePrint").click(function(){
	if(isClick) {
		isClick = false;
		//事件
		var printer = $("#printer").val();
		if(printer == ''){
			layer.msg('请选择打印机');
			return false;
		}
		var template = $("#template").val();
		if(template == ''){
			layer.msg('请选择打印模板');
			return false;
		}
		printLabel(lastPrintData,printer,template,1);
			//定时器
		setTimeout(function() {
			isClick = true;
		}, 3000);//三秒内不能重复点击
	}
});
var lastPrintData = [];
function printLabel( data,unprintname,unprintTplSakp,printNum){
	lastPrintData = data;
	for(var j=0;j<data.length;j++){	
		$.ajax({
			url: '/index.php?m=PT&c=Storage&a=getPrintSakpPcNo',							
			type: 'post',
			data: {pc_no:data[j]},
			dataType: 'json',
			success: function ( msg ) {
				if(msg.code == "ok"){
					for(var i = 0;i<printNum;i++){
						printLodopTpl[unprintTplSakp](unprintname,msg['data']);
					}
				}
			}
		});
	}
}
function totalSum(tableData){
	var totalNum = 0;
	var totalMoney = 0;
	for(var i=0;i<tableData.length;i++){
		totalNum += parseInt(tableData[i]['nums']);
		totalMoney += parseInt(tableData[i]['nums'])*parseFloat(tableData[i]['price']);
	}
	$("#shopNum").html(totalNum);
	$("#shopMoney").html(totalMoney);
}
$("#selectPrd").click(function(){
	var stateHidden = $("#stateHidden").val();
	var jinxiaocun = $("#jinxiaocun").val();
	var cus_no = flow.cus_no;
	var wh = flow.intoWh_no;
	var prd_loc = flow.prd_loc;
	if(jinxiaocun == 'T'){
		if(!wh || wh == ""){
			layer.msg('请选择仓库');
			return false;
		}else{
			prd_loc = '@'+wh;
		}
	}
	if(stateHidden == "T"){
		if(!prd_loc || prd_loc == ""){
			layer.msg('请选择要出库的货位');
			return false;
		}
	}
	if(!cus_no || cus_no == ""){
		if(stateHidden == "T"){
			layer.msg('请选择供应商');
		}else{
			layer.msg('请选择客户');
		}
		return false;
	}
	layer.open({
		title: '选择商品',
		type: 2,
		shade: false,
		area: ['700px', '510px'],
		maxmin: false,
		content: '?m=widget&c=selectLocalProduct&a=index&type=2&prd_loc='+(prd_loc||'')+'&cus_no='+(cus_no||'')+'&state='+(stateHidden||'')
	});
});
function cbProductRows(ProductTableRows,widgetType){
	if(ProductTableRows.length > 0){
		for(var i in ProductTableRows){
			if(typeof(ProductTableRows[i]) == 'object'){
				flow.dataList = ProductTableRows[i];
				loadTableList(ProductTableRows[i]);
			}
		}
	}
}