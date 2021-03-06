var flow = new Vue({
	el: '#flow',
	data: {
		dataList:[],
		proList:"",  //当前扫描的唯一码
		stock: '',//in为盘入，out为盘出，其他为盘点
		pc_no:'',
		hotLoc_no:'',
		intoWh:"",    //仓库序号id
		intoWh_no:"", //仓库编号
	},
	methods: {
		blackInPut:function( state ){
			var tmp = true;
			$("#fileName").val("");
			$("#fileExcel").val("");
			layer.open({
				type: 1,
				title: '商品条码，编号导入',
				skin: 'layui-layer-rim',
				area: ['700px', '250px'],
				shade: 0.3,
				content: $("#importExcel"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					if(!tmp){
						return false;
					}
					tmp = false;
					var hotLoc = $("#hotLoc").val();
					var jinxiaocun = $("#jinxiaocun").val();
					var wh = flow.intoWh_no;
					if(jinxiaocun == 'T'){
						if(!wh || wh == ""){
							layer.msg('请选择仓库', {icon: 2});
							return false;
						}else{
							hotLoc = '@'+wh;
						}
					}
					if(!hotLoc){
						layer.msg('请选择货位', {icon: 2});
						return false;
					}
					//采用FormData上传文件
					var fileExcel = $("#fileExcel")[0].files[0];
					if(!fileExcel){
						layer.msg('请选择上传文件', {icon: 2});
						return false;
					}
					var formData = new FormData();
					formData.append("file",fileExcel );
					formData.append("state",state );
					formData.append("hotLoc",hotLoc );
					$.ajax({
						url:'/?m=PT&c=locInventory&a=saveImportExcel',
						type: "post",
						data: formData,
						processData: false,
						contentType: false,
						success:function(dataList){
							if(Object.prototype.toString.call(dataList) === "[object String]"){
								var dataList = JSON.parse(dataList);
							}
							console.log(dataList);
							if(dataList['code'] == 'ok'){
								layer.close(index);
								layer.msg(dataList['msg'], {icon: 1});
							}else{
								var repeatData = dataList['data'];
								var oHtml = '';
								oHtml += '<table width="90%" align="center" border="1" bgcolor="#bbbbbb" cellspacing="1" cellpadding="1" style="margin-top:10px;margin-left: 5%;">';
								oHtml += '<tr align="center" style="height: 30px;">';
								oHtml += '<td>序号</td>';
								oHtml += '<td>商品条码 / 编码</td>';
								oHtml += '<td>导入错误原因</td>';
								oHtml += '</tr>';
								for(var i=0;i<repeatData.length;i++){
									oHtml += '<tr align="center" style="height: 30px;">';
									oHtml += '<td>'+(i+1)+'</td>';
									oHtml += '<td>'+repeatData[i]['code']+'</td>';
									oHtml += '<td>'+repeatData[i]['msg']+'</td>';
									oHtml += '</tr>';
								}
								oHtml += '</table>';
								layer.open({
									type: 1,
									title: '导入错误原因',
									skin: 'layui-layer-rim',
									area: ['800px', '500px'],
									shade: 0.3,
									content: oHtml,
									btn: ['取消'],
								})
							}
							tmp = true;
							dataLoadOne.tableLoadTable();
						}
					})	
				}
			})
		}
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
	
	var urlObj = GetRequest();
	var stock = "";
	if(urlObj){
		if(urlObj.stock){
			flow.stock = urlObj.stock;		
		}
	}
	
	//监听货位选择
	table.on('tool(locTableList)', function(obj){
		var datas = obj.data;
		
		if(flow.stock == "in" || flow.stock == "out"){
			flow.hotLoc_no = datas.prd_loc;
			layer.closeAll();
			$("#hotLoc").val(datas.name);
			dataLoadOne.tableLoadTable();
			return false;
		}
		
		layer.confirm('盘点货位将删除当前货位全部货品，确定？', {
			btn: ['确定','取消'] //按钮
		}, function(){
			$.ajax({
				url:'/?m=PT&c=Storage&a=clearStorageQty',
				dataType: 'json',
				type: "post",
				data:{
					prd_loc : datas.prd_loc,
				},
				success:function(data){
					if(data.code == 'ok'){
						flow.hotLoc_no = datas.prd_loc;
                        flow.pc_no = data.pc_no;
						layer.closeAll();
						$("#hotLoc").val(datas.name);
					}
				}
			})
		}, function(){});
	});
	//监听仓库选择
	table.on('tool(treeWhList)', function(obj){
		var datas = obj.data;
		var prd_loc = '@' +datas.wh

		if(flow.stock == "in" || flow.stock == "out"){
			flow.hotLoc_no = prd_loc;
			flow.intoWh = datas.name;
			flow.intoWh_no = prd_loc;
			$("#intoWh").val(datas.name);
			layer.closeAll();
			dataLoadOne.tableLoadTable();
			return false;
		}
		
		layer.confirm('盘点货位将删除当前货位全部货品，确定？', {
			btn: ['确定','取消'] //按钮
		}, function(){
	
			$.ajax({
				url:'/?m=PT&c=Storage&a=clearStorageQty',
				dataType: 'json',
				type: "post",
				data:{
					prd_loc : prd_loc,
				},
				success:function(data){
					if(data.code == 'ok'){
						flow.hotLoc_no = prd_loc;
						flow.pc_no = data.pc_no;
						flow.intoWh = datas.name;
						flow.intoWh_no = datas.wh;
						layer.closeAll();
						$("#intoWh").val(datas.name);
					}
				}
			})
		}, function(){});
	});

	//监听数量变更
	table.on('edit(dataListOnes)', function(obj){
	    var value = (obj.value); //得到修改后的值
        var data = (obj.data); //所在行的所有相关数据
        var prdBarcode = data['barcode'];
    	var prd_loc = flow.hotLoc_no;
		var pc_no = flow.pc_no;
		var jinxiaocun = $("#jinxiaocun").val();
		var wh = flow.intoWh_no;
		if(jinxiaocun == 'T'){
			if(!wh || wh == ""){
				layer.msg('请选择仓库', {icon: 2});
				return false;
			}
		}
    	if(!prd_loc || prd_loc == ""){
    		layer.msg('请选择要盘点的货位');
    		return false;
    	}
		var stock = flow.stock;
    	$.ajax({
    		url:'?m=PT&c=Storage&a=prdBarcodeInCheck',
    		dataType: 'json',
    		type: "post",
    		data:{
    			barcode:prdBarcode,
    			prd_loc:prd_loc,
                num:value,
                pc_no:pc_no,
				stock:stock,
    		},
    		success:function(data){
    			if(data.code == 'ok'){
    				layer.msg(data.msg);
    				speckText(data.msg);
    			}else{
    				layer.msg(data.msg);
    				speckText(data.msg);
    			}
    		}
    	});
	});

	//初始化右侧表格
	table.render(dataListOne);
})

//监听选择文件变化
$("#fileExcel").change(function(){
	var fileName = $(this).val();
	$("#fileName").val(fileName);
})

//货位选择
$("#hotLoc").click(function(){
	$("#locName").val("");
	locTableLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '选择货位',
		skin: 'layui-layer-rim', 
		area: ['850px', '550px'],
		shade: 0.3,
		content: $("#locTreeList"),
		cancel: function(index, layero){ 
			flow.hotLoc_no = "";
			$("#hotLoc").val("");
		}
	});
})
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
	,height: '370'
	,cols: [[ 
		{type:'numbers', width:50, event: 'setSign', style:'cursor: pointer;'}
		,{field:'prd_loc', width:100, title: '货位编号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'name', minWidth:100, title: '货位名称', event: 'setSign', style:'cursor: pointer;'}
		,{field:'wh', minWidth:100, title: '所属仓库', event: 'setSign', style:'cursor: pointer;'}
		,{field:'explosion', minWidth:100, title: '货位类型', event: 'setSign', style:'cursor: pointer;'}
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
	var prdBarcode = $("#prdBarcode").val();
	if(!prdBarcode || prdBarcode == ""){
		layer.msg('商品条码不可为空');
		return false;
	}
	$("#prdBarcode").val("");
	var prd_loc = flow.hotLoc_no;
	var pc_no = flow.pc_no;
	var jinxiaocun = $("#jinxiaocun").val();
	var wh = flow.intoWh_no;
	if(jinxiaocun == 'T'){
		if(!wh || wh == ""){
			layer.msg('请选择仓库', {icon: 2});
			return false;
		}
	}
	if(!prd_loc || prd_loc == ""){
		layer.msg('请选择要盘点的货位');
		return false;
	}
	var stock = flow.stock;
	$.ajax({
		url:'?m=PT&c=Storage&a=prdBarcodeInCheck',
		dataType: 'json',
		type: "post",
		data:{
			barcode:prdBarcode,
			prd_loc:prd_loc,
            pc_no:pc_no,
			stock:stock,
		},
		success:function(data){
			if(data.code == 'ok'){
				layer.msg(data.msg);
				speckText(data.msg);
				loadTableList(prdBarcode);
			}else{
				layer.msg(data.msg);
				speckText(data.msg);
			}
		}
	})
}

//获取当前扫描数据
function loadTableList(prdBarcode){
	//当前唯一码详细信息
	nowPrdBarcodeData(prdBarcode);
	//右侧列表
	dataLoadOne.tableLoadTable();
}

var cols = [];
if($("#stock").val() == ""){
	cols = [[ 
		{type:'numbers', width:70, title: '序号'}
		,{field:'prd_nos', width:150, title: '商品编码'}
		,{field:'title', width:150, title: '商品名称'}
		,{field:'sku_names', width:150, title: '商品属性'}
		,{field:'name', width:70, title: '货位'}
		,{field:'num', width:90, title: '数量',edit: 'text'}
	]];
}else{
	cols = [[ 
		{type:'numbers', width:70, title: '序号'}
		,{field:'prd_nos', width:150, title: '商品编码'}
		,{field:'title', width:150, title: '商品名称'}
		,{field:'sku_names', width:150, title: '商品属性'}
		,{field:'name', width:70, title: '货位'}
		,{field:'num', width:90, title: '数量'}
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
				}else{
					dataListOne.data = [];
					dataLoadOne.tableObj.reload(dataListOne);
				}
			}
		})
	}
};

//当前唯一码详细信息
function nowPrdBarcodeData(barcode){
	$.ajax({
		url:'/?m=PT&c=locInventory&a=getProInventoryList',
		dataType: 'json',
		type: "post",
		data:{
			barcode:barcode,
		},
		success:function(data){
			if(data.code == 'ok'){
				flow.dataList = data.data;
			}
		}
	})
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


