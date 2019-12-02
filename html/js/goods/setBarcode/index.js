var flow = new Vue({
	el: '#flow',
	data: {
		//zeroSet:0,
		tableData:[],
		delData:[],
		chooseLoc:""
	}
})

var locAlert = ""; //定义全局货位弹出框对象

layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,upload = layui.upload //上传
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;
	//初始化表格
	vueLoad.tableLoadTable();

	//日期时间选择器
	laydate.render({
		elem: '#startTime'
		,type: 'datetime'
	});
	//日期时间选择器
	laydate.render({
		elem: '#endTime'
		,type: 'datetime'
	});
	
	//店铺 多选下拉赋值
	var ohtml = '<option value="0">店铺1</option>'; 
	ohtml += '<option value="1">店铺2</option>'; 
	$("#shopName").html(ohtml);
	form.render();
	
	/**
	空货位
	form.on('switch(zeroSet)', function(data){
		if(data.elem.checked){
			flow.zeroSet = 1;
		}else{
			flow.zeroSet = 0;
		}
	}); 
	*/


	activeInfo = {
		dataListReload:function () {
			var state = $("#state").val();                  //状态
			var special = $("#special").val();              //特征
			var barcodeTop = $("#barcodeTop").val();        //条码上
			var barcodeBottom = $("#barcodeBottom").val();	//条码下
			var goodsNum = $("#goodsNum").val();			//商品编码
			var goodsLocation = $("#goodsLocation").val();	//货位
			var startTime = $("#startTime").val();	//货位
			var endTime = $("#endTime").val();	//货位
			//var zeroSet = flow.zeroSet;   				//空货位

			table.reload('dataList', {
				page: {
					curr: 1
				}
				,where: {
					state:state,
					special:special,
					barcodeTop:barcodeTop,
					barcodeBottom:barcodeBottom,
					goodsNum:goodsNum,
					goodsLocation:goodsLocation,
					startTime:startTime,
					endTime:endTime,
					//zeroSet:zeroSet
				}
			});
		}
	};

	table.render({
		elem: '#dataList'
		,url: '/?m=goods&c=setBarcode&a=getLoadTable'
		,skin: 'row'
		,page: true
		,limits: [50, 100, 200]
		,limit: 50
		,where: {}
		,height: 'full-100'
		,cols: [[
			{type:'checkbox'}
			,{type:'numbers', width:60, title: '序号'}
			,{field:'addtime', width:170, title: '入库时间'}
			,{field:'urlPic', width:130, title: '图片', templet: '#urlPic'}
			,{field:'prd_no', minWidth:200, title: '商品编码/属性', templet: '#prdNoSkuName'}
			,{field:'name', minWidth:150, title: '货位'}
			,{field:'serial_no', minWidth:150, title: '条码/订单号', templet: '#newTidSerialNo'}
			,{field:'send_type', width:100, title: '状态'}
		]]
		,id: 'dataList'
		,data:[]
		,even: true
		,done: function(res, curr, count){
			layer.closeAll('loading');
		}
	});
	
	//初始化表格
	// layer.load(2);
	// vueLoad.tableLoadTable();
	
	//监听复选框
	table.on('checkbox(dataListEvent)', function(obj){
		//console.log(obj.checked); //当前是否选中状态
		//console.log(obj.data); //选中行的相关数据
		//console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
		if(obj.type == "all" && obj.checked == true){
			flow.delData = flow.tableData;
		}
		if(obj.type == "all" && obj.checked == false){
			flow.delData = [];
		}
		if(obj.type == "one"){
			if(obj.checked == true){
				var arrs = flow.delData;
				arrs.push(obj.data);
				flow.delData = arrs;
			}else{
				var arrs = flow.delData;
				var indexs = 0;
				for(var i=0;i<arrs.length;i++){
					if(arrs[i].id == obj.data.id){
						indexs = i;
					}
				}
				arrs.splice(indexs,1);
				flow.delData = arrs;
			}
		}
	});
	
	//监听复选框
	table.on('checkbox(treeLocListEvent)', function(obj){
		//console.log(obj.data); //选中行的相关数据
		$("#alertTable tbody .layui-form-checkbox").removeClass("layui-form-checked");
		$(this).addClass("layui-form-checked");
		flow.chooseLoc = obj.data;
		$("#specialAfter").val(obj.data.name);
	});
	
	//监听货位选择
	table.on('tool(treeLocListEvent)', function(obj){
		var data = obj.data;
		$("#locNow").val(data.name);
		layer.close(locAlert);
	});
})


// $("#searchReload").click(function(){
// alert('订单');
// 	flow.zeroSet = 0;
// })


var tableLoad = {
	elem: '#dataList'
	,skin: 'row'
	,page: true
	,limits: [50, 100, 200]
	,limit: 50
	,where: {
		id:''
	}
	,height: 'full-100'
	,cols: [[
		{type:'checkbox'}
		,{type:'numbers', width:60, title: '序号'}
		,{field:'addtime', width:170, title: '入库时间'}
		,{field:'urlPic', width:130, title: '图片', templet: '#urlPic'}
		,{field:'prd_no', minWidth:200, title: '商品编码/属性', templet: '#prdNoSkuName'}
		,{field:'name', minWidth:150, title: '货位'}
		,{field:'serial_no', minWidth:150, title: '条码/订单号', templet: '#newTidSerialNo'}
		,{field:'send_type', width:100, title: '状态'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
	,done: function(res, curr, count){
		layer.closeAll('loading');
	}
};

var vueLoad = {
	oldTree:false,
	tableObj:false,
	tableLoadTable:function(){
		layer.load(2);
		var table = layui.table;
		tableLoad['page'] = {
			curr: 1
		};
		var state = $("#state").val();                  //状态
		var special = $("#special").val();              //特征
		var barcodeTop = $("#barcodeTop").val();        //条码上
		var barcodeBottom = $("#barcodeBottom").val();	//条码下
		var goodsNum = $("#goodsNum").val();			//商品编码
		var goodsLocation = $("#goodsLocation").val();	//货位
		var startTime = $("#startTime").val();	//货位
		var endTime = $("#endTime").val();	//货位
		//var zeroSet = flow.zeroSet;   				//空货位

		$.ajax({
			url:'/?m=goods&c=setBarcode&a=getLoadTable',
			dataType: 'json',
			type: "post",
			data:{
				state:state,
				special:special,
				barcodeTop:barcodeTop,
				barcodeBottom:barcodeBottom,
				goodsNum:goodsNum,
				goodsLocation:goodsLocation,
				startTime:startTime,
				endTime:endTime,
				//zeroSet:zeroSet
			},
			success:function(data){
				if(data.code == "ok"){
					flow.tableData = data.data;
					if(!vueLoad.tableObj){
						for(var i=0;i<data.data.length;i++){
							tableLoad.data.push(data.data[i]);
						}
						vueLoad.tableObj = table.render(tableLoad);
					}else{
						tableLoad.data = [];
						for(var i=0;i<data.data.length;i++){
							tableLoad.data.push(data.data[i]);
						}
						vueLoad.tableObj.reload(tableLoad);
					}
				}else{
					tableLoad.data = [];
					table.render(tableLoad);
				}
			}
		})
	}
};

//重新加载数据
function searchBtn(){
	flow.delData = [];
	vueLoad.tableLoadTable();
	activeInfo['dataListReload'].call(this);
}

//批量激活
$("#batchActivation").click(function(){
	var chooseDate = flow.delData;
	//console.log(chooseDate);
	if(chooseDate.length == 0){
		layer.msg('请选择商品');
		return false;
	}
	$.ajax({
		url:'/?m=goods&c=setBarcode&a=batchActivation',
		dataType: 'json',
		type: "post",
		data:{
			chooseDate:chooseDate
		},
		success:function(data){
			if(data.code == 'ok'){
				flow.delData = [];
				layer.msg(data.msg);
				vueLoad.tableLoadTable();
				activeInfo['dataListReload'].call(this);
			}else{
				layer.msg(data.msg);
			}
		}
	})
})
//批量作废
$("#batchInvalid").click(function(){
	var chooseDate = flow.delData;
	if(chooseDate.length == 0){
		layer.msg('请选择商品');
		return false;
	}
	$.ajax({
		url:'/?m=goods&c=setBarcode&a=batchInvalid',
		dataType: 'json',
		type: "post",
		data:{
			chooseDate:chooseDate
		},
		success:function(data){
			if(data.code == 'ok'){
				flow.delData = [];
				layer.msg(data.msg);
				vueLoad.tableLoadTable();
				activeInfo['dataListReload'].call(this);
			}else{
				layer.msg(data.msg);
			}
		}
	})
})
//批量锁定
$("#batchLock").click(function(){
	var chooseDate = flow.delData;
	if(chooseDate.length == 0){
		layer.msg('请选择商品');
		return false;
	}
	$.ajax({
		url:'/?m=goods&c=setBarcode&a=batchLock',
		dataType: 'json',
		type: "post",
		data:{
			chooseDate:chooseDate
		},
		success:function(data){
			if(data.code == 'ok'){
				flow.delData = [];
				layer.msg(data.msg);
				vueLoad.tableLoadTable();
				activeInfo['dataListReload'].call(this);
			}else{
				layer.msg(data.msg);
			}
		}
	})
})
//批量出库
$("#batchOut").click(function(){
	var chooseDate = flow.delData;
	if(chooseDate.length == 0){
		layer.msg('请选择商品');
		return false;
	}
	$.ajax({
		url:'/?m=goods&c=setBarcode&a=batchOut',
		dataType: 'json',
		type: "post",
		data:{
			chooseDate:chooseDate
		},
		success:function(data){
			if(data.code == 'ok'){
				flow.delData = [];
				layer.msg(data.msg);
				vueLoad.tableLoadTable();
				activeInfo['dataListReload'].call(this);
			}else{
				layer.msg(data.msg);
			}
		}
	})
})
//批量设置货位
$("#batchSet").click(function(){
	$("#locNow").val("");
	var chooseDate = flow.delData;
	if(chooseDate.length == 0){
		layer.msg('请选择商品');
		return false;
	}
	layer.open({
		type: 1,
		title: '选择货位',
		skin: 'layui-layer-rim', //加上边框
		area: ['450px', '220px'], //宽高
		shade: 0.3,
		content: $("#locSetChoose"),
		btn: ['确定', '取消'],
		yes: function(index, layero){
			var treeId = $("#locNow").val();
			var arrs = flow.delData;
			if(arrs.length == 0){
				layer.msg('请选择具体商品');
				return false;
			}
			$.ajax({
				url:'/?m=goods&c=setBarcode&a=batchSet',
				dataType: 'json',
				type: "post",
				data:{
					arrs:arrs,
					treeId:treeId
				},
				success:function(data){
					if(data.code == "ok"){
						flow.delData = [];
						layer.msg(data.msg);
						layer.close(index);
						vueLoad.tableLoadTable();
						activeInfo['dataListReload'].call(this);
					}else{
						layer.msg(data.msg);
					}	
				}
			})	
		}
	});
})

$("#locSet").click(function(){
	$("#locNow").val("");
	$("#locName").val("");
	treeLoad.tableLoadTable();
	locAlert = layer.open({
		type: 1,
		title: '选择货位',
		skin: 'layui-layer-rim', //加上边框
		area: ['800px', '550px'], //宽高
		shade: 0.3,
		content: $("#locTreeList"),
		cancel: function(index, layero){ 
			flow.hotLoc = "";
			flow.hotLoc_no = "";
			$("#hotLoc").val("");
		}
	});
})

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
		url:'/?m=goods&c=setBarcode&a=getLocLeftTree',
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
	treeLoad.tableLoadTable(treeNode.id);
}

var TreeListLoad = {
	elem: '#treeLocList'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: '400'
	,cols: [[
		{type:'numbers', width:80, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'name', width:200, title: '货位', event: 'setSign', style:'cursor: pointer;'}
		,{field:'wh', width:200, title: '仓库', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'treeLocList'
	,data:[]
	,even: false
};

var treeLoad = {
	oldTree:false,
	tableObj:false,
	tableLoadTable:function(id){
		var table = layui.table;
		TreeListLoad['page'] = {
			curr: 1 
		};
		var locName = $("#locName").val();
		$.ajax({
			url:'/?m=goods&c=setBarcode&a=getLocLeftTable',
			dataType: 'json',
			type: "post",
			data:{
				id: id,
				locName: locName
			},
			success:function(data){
				if(!treeLoad.tableObj){
					for(var i=0;i<data.length;i++){
						TreeListLoad.data.push(data[i]);
					}
					treeLoad.tableObj = table.render(TreeListLoad);
				}else{
					TreeListLoad.data = [];
					for(var i=0;i<data.length;i++){
						TreeListLoad.data.push(data[i]);
					}
					treeLoad.tableObj.reload(TreeListLoad);
				}
			}
		})
	}
};

$("#locSetBtn").click(function(){
	treeLoad.tableLoadTable();
})