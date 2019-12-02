var flow = new Vue({
	el: '#flow',
	data: {
		dataList:[],
		proList:"",  	//当前扫描的唯一码
		cus_no:"",		//供应商编码
		prd_loc:"",		//货位编号
		wh_loc:"",		//仓库编号
		stateHidden:'',	//页面功能标记
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
	$.ajax({
		url:'/?m=PT&c=BarcodeLibrary&a=getTemplate',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			var ohtml = "";
			for(var i=0;i<data.length;i++){
				if(data[i].def == 'T'){
					ohtml += "<option value='"+data[i].id+"' selected=''>"+data[i].tpl_name+"</option>";
				}else{
					ohtml += "<option value='"+data[i].id+"'>"+data[i].tpl_name+"</option>";
				}
			}
			$("#template").html(ohtml);
			form.render('select');
		}
	})
	
	//监听货位选择
	table.on('tool(locTableList)', function(obj){
		var datas = obj.data;
		if($("#stateHidden").val() == 'T'){
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
		}else if($("#stateHidden").val() == 'F'){
			flow.prd_loc = datas.prd_loc;
			flow.wh_loc = datas.wh_loc;
			layer.closeAll();
			$("#hotLoc").val(datas.name);
		}
	});
	
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
	
	//修改显示货位
	table.on('tool(dataListOnes)', function(obj){
		var data = obj.data;
		if(obj.event === 'edit'){
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
	
	var stateHidden = $("#stateHidden").val();
	flow.stateHidden = stateHidden;
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

//扫描商品条码
function scanProInventory(){
	var stateHidden = $("#stateHidden").val();
	var barcode = $("#prdBarcode").val();
	if(barcode == ''){
		layer.msg('请输入商品条码');
		return false;
	}
	var cus_no = flow.cus_no;
	var prd_loc = flow.prd_loc;
	if(stateHidden == "F"){
		if(!prd_loc || prd_loc == ""){
			layer.msg('请选择要入库的货位');
			return false;
		}
	}
	if(!cus_no || cus_no == ""){
		if(stateHidden == "T"){
			layer.msg('请选择客户');
		}else{
			layer.msg('请选择供应商');
		}
		return false;
	}
	$("#prdBarcode").val("");
	$.ajax({
		url:'?m=PT&c=BarcodeLibrary&a=prdBarcodeInCheck',
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
			if(datas[i]['prd_no'] == data['prd_no'] && datas[i]['sku_name'] == data['sku_name'] && datas[i]['title'] == data['title']){
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

//选择商品
function chooseTableList( data ){
	chooseTableLoad.tableLoadTable( data );
	layer.open({
		type: 1,
		title: '选择商品',
		skin: 'layui-layer-rim',
		area: ['800px', '550px'],
		shade: 0.3,
		content: $("#choosePrdBarcode"),
	});
}

if($("#stateHidden").val() == 'T'){
	var cols = [[ 
		{type:'numbers', width:50, event: 'setSign', style:'cursor: pointer;'}
		,{field:'prd_no', width:180, title: '商品编码', event: 'setSign', style:'cursor: pointer;'}
		,{field:'title', width:180, title: '商品名称', event: 'setSign', style:'cursor: pointer;'}
		,{field:'sku_name', width:180, title: '商品属性', event: 'setSign', style:'cursor: pointer;'}
		,{field:'nums', width:90, title: '数量',edit: 'text'}
		,{field:'price', width:90, title: '销售价',edit: 'text'}
	]];
}else{
	var cols = [[ 
		{type:'numbers', width:50, event: 'setSign', style:'cursor: pointer;'}
		,{field:'prd_no', width:180, title: '商品编码', event: 'setSign', style:'cursor: pointer;'}
		,{field:'title', width:180, title: '商品名称', event: 'setSign', style:'cursor: pointer;'}
		,{field:'sku_name', width:180, title: '商品属性', event: 'setSign', style:'cursor: pointer;'}
		,{field:'nums', width:90, title: '数量',edit: 'text'}
		,{field:'cost_price', width:90, title: '进货价',edit: 'text'}
	]];
}

//多件商品选择一个
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
	,cols:cols 
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

if($("#stateHidden").val() == 'T'){
	var cols = [[ 
		{type:'numbers', width:50}
		,{field:'prd_no', minWidth:100, title: '商品编码'}
		,{field:'title', minWidth:100, title: '商品名称'}
		,{field:'sku_name', minWidth:100, title: '商品属性'}
		,{field:'nums', width:90, title: '数量',edit: 'text'}
		,{field:'prd_loc', width:90, title: '货位'}
		,{field:'price', width:90, title: '销售价',edit: 'text'}
		,{fixed:'right', width:100, title: '操作', align:'center', toolbar: '#barDemo'}
	]];
}else{
	var cols = [[ 
		{type:'numbers', width:50}
		,{field:'prd_no', minWidth:100, title: '商品编码'}
		,{field:'title', minWidth:100, title: '商品名称'}
		,{field:'sku_name', minWidth:100, title: '商品属性'}
		,{field:'nums', width:90, title: '数量',edit: 'text'}
		,{field:'cost_price', width:90, title: '进货价',edit: 'text'}
	]];
}

var dataListOne = {
	elem: '#dataListOnes'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,where: {}
	,height: 'full-150'
	,cols: cols
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
		custTableLoad.tableLoadTable( 'T' );
	}else if($("#stateHidden").val() == 'F'){
		custTableLoad.tableLoadTable( 'F' );
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
	var table = layui.table;
	var data = dataListOne.data;
	var stateHidden = $("#stateHidden").val();
	var cus_no = flow.cus_no;
	if(stateHidden == "F"){
		var prd_loc = flow.prd_loc;
		if(!prd_loc || prd_loc == ""){
			layer.msg('请选择要入库的货位');
			return false;
		}
	}
	if(!cus_no || cus_no == ""){
		layer.msg('请选择供应商');
		return false;
	}
	console.log(1);
	$("#savePutin").prop("disabled",true);
	$.ajax({
		url:'/?m=PT&c=BarcodeLibrary&a=savePutin',
		dataType: 'json',
		type: "post",
		data:{
			data:data,
			state:stateHidden,
			print:'F',
			cus_no:cus_no,
			prd_loc:prd_loc,
		},
		success:function(data){
			if(data['code'] == 'ok'){
				dataListOne.data = [];
				$("#savePutin").prop("disabled",false);
				dataLoadOne.tableObj.reload(dataListOne);
				layer.msg('保存成功');
				speckText('成功');
				$("#shopNum").html("");
				$("#shopMoney").html("");
			}else{
				$("#savePutin").prop("disabled",false);
				layer.msg(data['msg']);
				speckText(data['msg']);
			}
		}
	})
	$("#prdBarcode").focus();
})

//打单并入库
$("#putinPrint").click(function(){
	var table = layui.table;
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
	var data = dataListOne.data;
	if(data == ''){
		layer.msg('请扫描商品条码');
		return false;
	}
	var stateHidden = $("#stateHidden").val();
	var cus_no = flow.cus_no;
	if(stateHidden == "F"){
		var prd_loc = flow.prd_loc;
		if(!prd_loc || prd_loc == ""){
			layer.msg('请选择要入库的货位');
			return false;
		}
	}
	if(!cus_no || cus_no == ""){
		layer.msg('请选择供应商');
		return false;
	}
	$("#putinPrint").prop("disabled",true);
	$.ajax({
		url:'/?m=PT&c=BarcodeLibrary&a=savePutin',
		dataType: 'json',
		type: "post",
		data:{
			data:data,
			state:stateHidden,
			print:'F',
			cus_no:cus_no,
			prd_loc:prd_loc,
		},
		success:function(data){
			if(data['code'] == 'ok'){
				dataListOne.data = [];
				$("#shopNum").html("");
				$("#shopMoney").html("");
				layer.msg('保存成功');
				speckText('成功');
				$("#putinPrint").prop("disabled",false);
				dataLoadOne.tableObj.reload(dataListOne);
				printLabel(data['data'],printer,template);
			}else{
				$("#putinPrint").prop("disabled",false);
				layer.msg(data['msg']);
				speckText(data['msg']);
			}
		}
	})
	$("#prdBarcode").focus();
})

function printLabel( data,unprintname,unprintTplBq ){
	for(var j=0;j<data.length;j++){	
		$.ajax({
			url: '/index.php?m=PT&c=Storage&a=getPrintLabelPcNo',							
			type: 'post',
			data: {pc_no:data[j]},
			dataType: 'json',
			success: function ( msg ) {
				if(msg.code == "ok"){
					for(var i=0;i<msg['data'].length;i++){
						console.log(msg['data'][i]);
						printTpl[unprintTplBq](unprintname,msg['data'][i]);
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




