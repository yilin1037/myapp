var flow = new Vue({
	el: '#flow',
	data: {
		intoWh:"",    //仓库序号id
		intoWh_no:"", //仓库编号
		hotLoc:"",	  //货位序号id
		hotLoc_no:"", //货位编号
		intoCust:"",  //供应商id
		intoCus_no:"",//供应商编号
		intoOsno:"",
		datas:[],	  //列表所有数据
		saveDate:[],  //修改数量的列表数据
		dayin:"",	  //入库成功勾返回的订单号
		isFirst:true,
		layprintTplBq:[],  //打印模板数据
		layprint:[],  //打印机数据
		delData:[],   //列表选中数据 
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
	
	//初始化可编辑表格
	dataLoadOne.tableLoadTable();
	
	//监听数据列表
	table.on('checkbox(dataListOnes)', function(obj){
		//console.log(obj.checked); //当前是否选中状态
		//console.log(obj.data); //选中行的相关数据
		//console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
		var datas = flow.datas;
		console.log(flow.datas);
		if(obj.type == "all" && obj.checked == true){
			flow.delData = eval("("+JSON.stringify(datas)+")");
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
					if(arrs[i].numIndex == obj.data.numIndex){
						indexs = i;
					}
				}
				arrs.splice(indexs,1);
				flow.delData = arrs;
			}
		}
		console.log(flow.delData);
	});
	//监听供应商选择
	table.on('tool(treeCustList)', function(obj){
		var data = obj.data;
		flow.intoCust = data.cus_name;
		flow.intoCus_no = data.cus_no;
		layer.closeAll();
		$("#intoCust").val(data.cus_name);
		searchBtn();
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
	//监听货位选择
	table.on('tool(locTableList)', function(obj){
		var data = obj.data;
		flow.hotLoc = data.name;
		flow.hotLoc_no = data.prd_loc;
		layer.closeAll();
		$("#hotLoc").val(data.name);
	});
	//监听采购订单选择
	table.on('tool(osnoTableList)', function(obj){
		var data = obj.data;
		layer.closeAll();
		flow.intoOsno = data.pc_no;
		$("#intoOsno").val(data.pc_no);
		flow.intoCust = data.cus_name;
		flow.intoCus_no = data.cus_no;
		$("#intoCust").val(data.cus_name);
		searchBtn();
	});
	//获取表格修改信息
	table.on('edit(dataListOnes)', function(obj){
		var value = obj.value //得到修改后的值
		,data = obj.data //得到所在行所有键值
		,field = obj.field; //得到字段
		//layer.msg('[ID: '+ data.change +'] ' + field + ' 字段更改为：'+ value);
		var index = data.index;
		if(value){
			isNumber(value);
			flow.datas[index].num = value;
			flow.datas[index].change = 1;
		}else{
			flow.datas[index].num = 0;
		}
	});
})

//正则验证是否为大于0整数
function isNumber(value) {
	var parnt = /^[1-9]\d*(\.\d+)?$/;
	if(!parnt.exec(value)){
		layer.msg('请输入大于零的数字，否则无法入库');
		return false;    
	}
}

var dataListOne = {
	elem: '#dataListOnes'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,where: {}
	,height: 'full-150'
	,cols: [[ 
		{type:'checkbox'}
		,{type:'numbers', width:150, title: '序号'}
		,{field:'pic_path', width:200, title: '图片'}
		,{field:'prd_no', minWidth:100, title: '商品编码'}
		,{field:'prd_sku_no', minWidth:100, title: 'SKU编码'}
		,{field:'sku_name', minWidth:100, title: '属性'}
		,{field:'title', minWidth:150, title: '商品名称'}
		,{field:'num', width:150, title: '入库数量', edit: 'text'}
		,{field:'cost_price', width:150, title: '拿货价', edit: 'text'}
	]]
	,id: 'dataListOnes'
	,data:[]
	,even: true
	,done: function(res, curr, count){
		layer.closeAll('loading');
	}
};

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
		,{field:'cus_name', width:443, title: '供应商名称', event: 'setSign', style:'cursor: pointer;'}
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
			url:'/?m=PT&c=purchase&a=getCustTable',
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
//采购订单列表
var osnoLoad = {
	elem: '#osnoTableList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: '400'
	,cols: [[ 
		{type:'numbers', width:50, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'cus_name', width:170, title: '供应商', event: 'setSign', style:'cursor: pointer;'}
		,{field:'pc_no', width:140, title: '采购单号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'prd_no', width:140, title: '货号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'qty', width:80, title: '订购数量', event: 'setSign', style:'cursor: pointer;'}
		,{field:'qty_rk', width:100, title: '已到货数量', event: 'setSign', style:'cursor: pointer;'}
		,{field:'effect_date', width:140, title: '采购日期', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'osnoTableList'
	,data:[]
	,even: true
};

var osnoTableLoad = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		osnoLoad['page'] = {
			curr: 1 
		};
		var cus_name = $("#cus_name").val();
		var merchant_code = $("#merchant_code").val();
		$.ajax({
			url:'/?m=PT&c=statistics&a=getPurchaseOrder',
			dataType: 'json',
			type: "post",
			data:{
				cus_name:cus_name,
				merchant_code:merchant_code,
			},
			success:function(data){
				if(!osnoTableLoad.tableObj){
					for(var i=0;i<data.length;i++){
						osnoLoad.data.push(data[i]);
					}
					osnoTableLoad.tableObj = table.render(osnoLoad);
				}else{
					osnoLoad.data = [];
					for(var i=0;i<data.length;i++){
						osnoLoad.data.push(data[i]);
					}
					osnoTableLoad.tableObj.reload(osnoLoad);
				}
			}
		})
	}
};
//搜索采购订单
function osnoSetSearch(){
	osnoTableLoad.tableLoadTable();
}
var dataLoadOne = {
	tableObj:false,
	tableLoadTable:function(){
		layer.load(2);
		var table = layui.table;
		dataListOne['page'] = {
			curr: 1 
		};
		var goodsNum = $("#goodsNum").val();
		var goodsName = $("#goodsName").val();
		var intoOsno = flow.intoOsno;
		$.ajax({
			url:'?m=WMS&c=Storage&a=getPrdList',
			dataType: 'json',
			type: "post",
			data:{
				prd_no:goodsNum,
				prd_name:goodsName,
				intoOsno:intoOsno,
			},
			success:function(data){
				if(data.wms_model == 'PT'){
					$("#intoOn").hide();
				}
				if(data.data){
					if(!dataLoadOne.tableObj){
						for(var i=0;i<data.data.length;i++){
							data.data[i].change = 0;
							data.data[i].numIndex = i;
							data.data[i].pic_path = "<img src="+data.data[i].pic_path+">";
							dataListOne.data.push(data.data[i]);
						}
						dataLoadOne.tableObj = table.render(dataListOne);
					}else{
						dataListOne.data = [];
						for(var i=0;i<data.data.length;i++){
							data.data[i].change = 0;
							data.data[i].index = i;
							data.data[i].numIndex = i;
							data.data[i].pic_path = "<img src="+data.data[i].pic_path+">";
							dataListOne.data.push(data.data[i]);
						}
						dataLoadOne.tableObj.reload(dataListOne);
					}
					flow.datas = dataListOne.data;
					console.log(flow.datas);
				}
			}
		})
	}
};

//保存入库
$("#saveInto").click(function(){
	var onOff = $("#saveInto").hasClass('layui-btn-disabled');
	if(!onOff){
		layer.load(2);
		var datas = flow.datas;
		var cus_no= flow.intoCus_no;
		var os_no = flow.intoOsno;
		/*if(cus_no == ""){
			layer.msg('请选择供应商');
			return false;
		}*/
		if(res){
			var wh = res;
		}else{
			var wh = flow.intoWh_no;
		}	
		if(wh == ""){
			layer.msg('请选择仓库');
			layer.closeAll('loading');
			return false;
		}
		var prd_loc = flow.hotLoc_no;
		if(prd_loc == ""){
			layer.msg('请选择货位');
			layer.closeAll('loading');
			return false;
		}
		var save = new Array();
		for(var i=0;i<datas.length;i++){
			if(datas[i].num && datas[i].num>0){
				datas[i].prd_loc = flow.hotLoc_no;
				save.push(datas[i]);
			}
		}
		if(save == ""){
			layer.msg('请输入入库数量，并且大于0');
			layer.closeAll('loading');
			return false;
		}
		$.ajax({
			url:'?m=WMS&c=Storage&a=setInStockExplosion',
			dataType: 'json',
			type: "post",
			data:{
				cus_no:cus_no,
				wh:wh,
				prd_loc:prd_loc,
				os_no:os_no,
				data:save,
			},
			success:function(data){
				layer.closeAll('loading');
				if(data.code == "ok"){
					$("#tableOne").css("display","none");
					$("#tableTwo").css("display","block");
					$("#batchSetNums").removeClass('layui-btn-normal');
					$("#batchSetNums").addClass('layui-btn-disabled');
					$("#saveInto").removeClass('layui-btn-normal');
					$("#saveInto").addClass('layui-btn-disabled');
					
					flow.saveDate = save;
					dataLoadTwo.tableLoadTable();
				}else{
					layer.msg(data.msg);
				}
			}
		})
	}
})

var dataListTwo = {
	elem: '#dataListTwo'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,where: {}
	,height: 'full-150'
	,cols: [[ 
		{type:'numbers', width:150, title: '序号'}
		,{field:'pic_path', width:200, title: '图片'}
		,{field:'prd_no', minWidth:100, title: '商品编码'}
		,{field:'prd_sku_no', minWidth:100, title: 'SKU编码'}
		,{field:'sku_name', minWidth:100, title: '属性'}
		,{field:'title', minWidth:150, title: '商品名称'}
		,{field:'num', width:150, title: '入库数量'}
		,{field:'cost_price', width:150, title: '拿货价', edit: 'text'}
	]]
	,id: 'dataListTwo'
	,data:[]
	,even: true
};

var dataLoadTwo = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		dataListTwo['page'] = {
			curr: 1 
		};
		var data = flow.saveDate;
		if(!dataLoadTwo.tableObj){
			for(var i=0;i<data.length;i++){
				dataListTwo.data.push(data[i]);
			}
			dataLoadTwo.tableObj = table.render(dataListTwo);
		}else{
			dataListTwo.data = [];
			for(var i=0;i<data.length;i++){
				dataListTwo.data.push(data[i]);
			}
			dataLoadTwo.tableObj.reload(dataListTwo);
		}
	}
};

//搜索
function searchBtn(){
	$("#tableOne").css("display","block");
	$("#tableTwo").css("display","none");
	$("#batchSetNums").removeClass('layui-btn-disabled');
	$("#batchSetNums").addClass('layui-btn-normal');
	$("#saveInto").removeClass('layui-btn-disabled');
	$("#saveInto").addClass('layui-btn-normal');
	$("#retypeLogo").removeClass('layui-btn-normal');
	$("#retypeLogo").addClass('layui-btn-disabled');
	dataLoadOne.tableLoadTable();
	flow.datas = [];
	flow.delData = [];
}

//清除
$("#searchReload").click(function(){
	$("#goodsNum").val("");
	$("#goodsName").val("");
	$("#intoOsno").val("");
	flow.intoOsno = '';
})
//供应商
$("#intoCust").click(function(){
    custTableLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '选择供应商',
		skin: 'layui-layer-rim', //加上边框
		area: ['800px', '550px'], //宽高
		shade: 0.3,
		content: $("#custSetChoose"),
		cancel: function(index, layero){ 
			flow.intoCust = "";
			flow.intoCus_no= "";
			$("#intoCust").val("");
		}
	});
});
//采购订单
$("#intoOsno").click(function(){
	$("#intoOsno").val("");
	osnoTableLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '选择采购订单',
		skin: 'layui-layer-rim', 
		area: ['1000px', '550px'],
		shade: 0.3,
		content: $("#osnoTreeList"),
		cancel: function(index, layero){ 
			$("#intoOsno").val("");
		}
	});
})
function custSetBtn(){
	custTableLoad.tableLoadTable();
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
var whTableLoad = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		whLoad['page'] = {
			curr: 1 
		};
		var whName = $("#whName").val();
		
		$.ajax({
			url:'/?m=goods&c=hotLoc&a=getWhTable',
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

//货位
$("#hotLoc").click(function(){
	if(res){
		var wh = res;
	}else{
		var wh = flow.intoWh_no;
	}	
	if(wh == ""){
		layer.msg("请先选择仓库");
		return false;
	}
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
			flow.hotLoc = "";
			flow.hotLoc_no = "";
			$("#hotLoc").val("");
		}
	});
})

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
	,height: '400'
	,cols: [[ 
		{type:'numbers', width:145, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'prd_loc', width:200, title: '货位编号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'name', width:200, title: '货位名称', event: 'setSign', style:'cursor: pointer;'}
		,{field:'wh', width:200, title: '所属仓库', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'locTableList'
	,data:[]
	,even: true
};

var locTableLoad = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		locLoad['page'] = {
			curr: 1 
		};
		if(res){
			var id = res;
		}else{
			var id = flow.intoWh_no;
		}	
		console.log(id);
		var locName = $("#locName").val();
		$.ajax({
			url:'/?m=goods&c=hotLoc&a=getLocTable',
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
//搜索货位
function locSetSearch(){
	locTableLoad.tableLoadTable();
}

//批量设置数量
function batchSetNum(){
	$("#inputNum").val("");
	var onOff = $("#batchSetNums").hasClass('layui-btn-disabled');
	if(!onOff){
		var nowData = flow.delData;
		var datas = flow.datas;
		if(nowData.length == 0){
			layer.msg('请选择修改数量的货品');
			return false;
		}
		layer.open({
			type: 1,
			title: '输入数量',
			skin: 'layui-layer-rim', //加上边框
			area: ['450px', '220px'], //宽高
			shade: 0.3,
			content: $("#saveNum"),
			btn: ['确定', '取消'],
			yes: function(index, layero){
				var table = layui.table;
				var inputNum = $("#inputNum").val();
				for(var i=0;i<nowData.length;i++){
					for(var j=0;j<datas.length;j++){
						if(nowData[i]['numIndex'] == datas[j]['numIndex']){
							flow.datas[j].num = inputNum;
						}
					}
				}
				table.render(dataListOne);
				layer.close(index);
			}
		});
	}
}