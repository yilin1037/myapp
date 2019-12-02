var flow = new Vue({
	el: '#flow',
	data: {
		dataList:[],
		proList:"",  		//当前扫描的唯一码
		is_explosion:"",	//判断当前是否是
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
	
	//监听货位选择
	table.on('tool(locTableList)', function(obj){
		var datas = obj.data;
		layer.confirm('盘点货位将删除当前货位全部货品，确定？', {
			btn: ['确定','取消'] //按钮
		}, function(){
			if(datas['is_explosion'] == 'T'){
				flow.is_explosion = 'T';
				dataListOne.cols = [[ 
					{type:'numbers', width:90, title: '序号'}
					,{field:'prd_nos', width:150, title: '商品编码'}
					,{field:'title', width:150, title: '商品名称'}
					,{field:'sku_names', width:100, title: '商品属性'}
					,{field:'name', width:100, title: '货位'}
					,{field:'num', width:90, title: '数量', edit: 'text'}
				]];
			}else if(datas['is_explosion'] == 'F'){
				flow.is_explosion = 'F';
				dataListOne.cols = [[ 
					{type:'numbers', width:90, title: '序号'}
					,{field:'prd_nos', width:150, title: '商品编码'}
					,{field:'title', width:150, title: '商品名称'}
					,{field:'sku_names', width:100, title: '商品属性'}
					,{field:'name', width:100, title: '货位'}
					,{field:'num', width:90, title: '数量'}
				]];
			}
			$.ajax({
				url:'/?m=WMS&c=Storage&a=clearStorageQty',
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
	
	//监听单元格编辑
	table.on('edit(dataListOnes)', function(obj){
		var value = obj.value //得到修改后的值
		,data = obj.data //得到所在行所有键值
		,field = obj.field; //得到字段
		$.ajax({
			url:'/?m=WMS&c=viewSerialNo&a=upPrdlocNum',
			dataType: 'json',
			type: "post",
			data:{
				inputNum:value,
				prd_loc: data['prd_loc'],
				wh: data['wh'],
				title: data['title'],
				prd_no: data['prd_no'],
				prd_sku_no: data['prd_sku_no'],
				prd_id:data['prd_id'],
				prd_sku_id:data['prd_sku_id'],
				sku_name:data['sku_names'],
			},
			success:function(data){
				layer.msg(data.msg);
			}
		})
	});
	
	//初始化右侧表格
	dataListOne.cols = [[ 
		{type:'numbers', width:90, title: '序号'}
		,{field:'prd_nos', width:150, title: '商品编码'}
		,{field:'title', width:150, title: '商品名称'}
		,{field:'sku_names', width:100, title: '商品属性'}
		,{field:'name', width:100, title: '货位'}
		,{field:'num', width:90, title: '数量',}
	]];
	table.render(dataListOne);
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
		url:'/?m=WMS&c=locInventory&a=getWhTable',
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
		{type:'numbers', width:50, event: 'setSign', style:'cursor: pointer;'}
		,{field:'prd_loc', width:100, title: '货位编号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'name', width:100, title: '货位名称', event: 'setSign', style:'cursor: pointer;'}
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
			url:'/?m=WMS&c=locInventory&a=getLocTable',
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
	var prdBarcode = $("#prdBarcode").val();
	$("#prdBarcode").val("");
	var prd_loc = flow.hotLoc_no;
	if(!prd_loc || prd_loc == ""){
		layer.msg('请选择要盘点的货位');
		return false;
	}
	$.ajax({
		url:'?m=WMS&c=Storage&a=prdSerialNoInCheck',
		dataType: 'json',
		type: "post",
		data:{
			serial_no:prdBarcode,
			prd_loc:prd_loc,
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

var dataListOne = {
	elem: '#dataListOnes'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,where: {}
	,height: 'full-150'
	,cols: []
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
			url:'/?m=WMS&c=locInventory&a=getLocProList',
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

//当前唯一码详细信息
function nowPrdBarcodeData(serial_no){
	$.ajax({
		url:'/?m=WMS&c=locInventory&a=getProInventoryList',
		dataType: 'json',
		type: "post",
		data:{
			serial_no:serial_no,
		},
		success:function(data){
			if(data.code == 'ok'){
				flow.dataList = data.data;
			}
		}
	})
}


