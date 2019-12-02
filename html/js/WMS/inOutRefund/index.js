var flow = new Vue({
	el: '#tableList',
	data: {
		hotLoc:"",     //货位编号
		hotLocName:"", //货位名称
		way:1,         //方式  0=>盘出  1=>盘入
		nowData:[]     //操作的数据
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
	
	//初始化显示table表格框架
	table.render(detailTable);

	table.on('tool(locTableList)', function(obj){
		var data = obj.data;
		$("#hotLoc").val(data.name);
		flow.hotLoc = data.prd_loc;
		flow.hotLocName = data.name;
		layer.closeAll();
	});
	
	form.on('radio(way)', function(data){
		$("#hotLoc").val("");
		flow.hotLoc = "";
		flow.hotLocName = "";
		if(data.value == 1){
			flow.way = 1;
			$("#hotShow").css("display","inline-block");
		}else if(data.value == 0){
			flow.way = 0;
			$("#hotShow").css("display","none");
		}else if(data.value == 2){
			flow.way = 2;
			$("#hotShow").css("display","none");
		}
	});  
})

var detailTable = {
	elem: '#detailList'
	,skin: 'row'
	,page: true 
	,limits: [10, 20, 50, 100]
	,limit: 20 
	,where: {}
	,height: 'full-150'
	,cols: [[ 
		{type:'checkbox'}
		,{type:'numbers', width:100, title: '序号'}
		,{field:'pic_img', width:150, title: '图片'}
		,{field:'pro_no', width:150, title: '商品编码'}
		,{field:'pro_sku_no', width:150, title: 'SKU编码'}
		,{field:'attr', width:150, title: '属性'}
		,{field:'pro_name', width:150, title: '商品名称'}
		,{field:'barcode', width:150, title: '条码'}
		,{field:'type', width:150, title: '操作类型'}
	]]
	,id: 'detailList'
	,data:[]
	,even: true
};

var detailLoad = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		var nowData = flow.nowData;
		detailTable['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=WMS&c=inOutRefund&a=getListTable',
			dataType: 'json',
			type: "post",
			data:{
				nowData: nowData,
			},
			success:function(data){
				if(!detailLoad.tableObj){
					for(var i=0;i<data.length;i++){
						detailTable.data.push(data[i]);
					}
					detailLoad.tableObj = table.render(detailTable);
				}else{
					detailTable.data = [];
					for(var i=0;i<data.length;i++){
						detailTable.data.push(data[i]);
					}
					detailLoad.tableObj.reload(detailTable);
				}
				$("#barcodeVal").val("");
			}
		})
	}
};

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
			$("#hotLoc").val("");
			flow.hotLoc = "";
			flow.hotLocName = "";
		}
	});
})
function locSetSearch(){
	locTableLoad.tableLoadTable();
}

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
		url:'/?m=WMS&c=inOutRefund&a=getWhTable',
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
	,height: '330'
	,cols: [[ 
		{type:'numbers', width:95, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'prd_loc', width:130, title: '货位编号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'name', width:130, title: '货位名称', event: 'setSign', style:'cursor: pointer;'}
		,{field:'wh', width:130, title: '所属仓库', event: 'setSign', style:'cursor: pointer;'}
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
			url:'/?m=WMS&c=inOutRefund&a=getLocTable',
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

function barcode(){
	var barcodeVal = $("#barcodeVal").val();
	if(barcodeVal == ''){
		layer.msg('请输入商品条码');
		return false;
	}
	$("#barcodeVal").val("");
	var way = flow.way;
	if(way == 0){
		$.ajax({
			url:'?m=WMS&c=Storage&a=prdSerialNoOutCheck',
			dataType: 'json',
			type: "post",
			data:{
				serial_no:barcodeVal,
			},
			success:function(data){
				if(data.code == 'ok'){
					layer.msg('通过');
					speckText('通过');
					var param = {};
					param['serial_no'] = barcodeVal;
					param['prd_loc'] = "";
					param['way'] = way;
					flow.nowData.push(param);
					detailLoad.tableLoadTable();
				}else{
					layer.msg(data.msg);
					speckText(data.msg);
				}
			}
		})
	}else if(way == 1){
		var prd_loc = flow.hotLoc;
		if(prd_loc == ""){
			layer.msg('请选择盘入仓库');
			return false;
		}
		$.ajax({
			url:'?m=WMS&c=Storage&a=prdSerialNoInCheck',
			dataType: 'json',
			type: "post",
			data:{
				serial_no:barcodeVal,
				prd_loc:prd_loc,
			},
			success:function(data){
				if(data.code == 'ok'){
					layer.msg('通过');
					speckText('通过');
					var param = {};
					param['serial_no'] = barcodeVal;
					param['prd_loc'] = prd_loc;
					param['way'] = way;
					flow.nowData.push(param);
					detailLoad.tableLoadTable();
				}else{
					layer.msg(data.msg);
					speckText(data.msg);
				}
			}
		})	
	}else if(way == 2){
		$.ajax({
			url:'?m=WMS&c=Storage&a=prdSerialNoOutCheck',
			dataType: 'json',
			type: "post",
			data:{
				serial_no:barcodeVal,
				type:'cancel',
			},
			success:function(data){
				if(data.code == 'ok'){
					layer.msg('通过');
					speckText('通过');
					var param = {};
					param['serial_no'] = barcodeVal;
					param['prd_loc'] = "";
					param['way'] = way;
					flow.nowData.push(param);
					detailLoad.tableLoadTable();
				}else{
					layer.msg(data.msg);
					speckText(data.msg);
				}
			}
		})
	}
}