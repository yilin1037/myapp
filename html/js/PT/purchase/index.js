var flow = new Vue({
	el: '#flow',
	data: {
		intoWh:"",    //仓库序号id
		intoWh_no:"", //仓库编号
		intoCus:"",
		intoCus_no:"",
		hotLoc:"",	  //货位序号id
		hotLoc_no:"", //货位编号
		datas:[],	  //列表所有数据
		saveDate:[],  //修改数量的列表数据
		dayin:"",	  //入库成功勾返回的订单号
		isFirst:true,
		layprintTplBq:[],  //打印模板数据
		layprint:[],  //打印机数据
		delData:[],   //列表选中数据 
	}, 
    methods: {
		setyesorder:function(){	
			var self = this;																
			var data = "";																
			if($("#layprint").val() != 0){									
				var unprintname = $("#layprint").val();													
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return																			
			}																							
			if($("#layprintTplBq").val() != 0){						
				var unprintTplBq = $("#layprintTplBq").val();	
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return																				
			}
			pc_no = self.dayin;
			$.ajax({																	
				url: '/index.php?m=PT&c=Storage&a=getPrintLabelPcNo',							
				type: 'post',																		
				data: {pc_no:pc_no},
				dataType: 'json',														
				success: function (data) {
					if(data.code == "ok"){													
						var percent = 0;											//-----进度条初始化		
						layer.closeAll();														
						countSecond(data['data'],unprintname,unprintTplBq);
					}	
				}																				
			});														
		},
	}
});
function countSecond(data,unprintname,unprintTplBq){
	for(var i in data){
		printTpl[unprintTplBq](unprintname,data[i]);
	}
	layer.msg('打印完成',{
		icon: 1,
		time: 2000
	});											
}
layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,upload = layui.upload //上传
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;
	var url_name = GetRequest();
    if(url_name.cus_no){
        flow.intoCust = decodeURIComponent(url_name.cus_name);
		flow.intoCus_no = url_name.cus_no;
		$("#intoCust").val(decodeURIComponent(url_name.cus_name));
    }
    //打印模板
	$.ajax({
		url:'/?m=PT&c=purchase&a=getTemplate',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			if(data){
				flow.layprintTplBq = data;
				var ohtml = "";
				for(var i=0;i<data.length;i++){
					ohtml += "<option value='"+data[i].id+"'>"+data[i].tpl_name+"</option>";
				}
				$("#layprintTplBq").html(ohtml);
				form.render('select');
			}
		}
	})
	//打印机
	doGetPrinters(function(data){	
		flow.layprint = data;
		var ohtml = "";
		for(var i=0;i<data.length;i++){
			ohtml += "<option value='"+data[i].name+"'>"+data[i].name+"</option>";
		}
		$("#layprint").html(ohtml);
		form.render('select');
	});
	//初始化可编辑表格
	dataLoadOne.tableLoadTable();
	
	//监听数据列表
	table.on('checkbox(dataListOnes)', function(obj){
		//console.log(obj.checked); //当前是否选中状态
		//console.log(obj.data); //选中行的相关数据
		//console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
		if(obj.type == "all" && obj.checked == true){
			flow.delData = eval("("+JSON.stringify(flow.datas)+")");
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
	//监听供应商选择
	table.on('tool(treeCustList)', function(obj){
		var data = obj.data;
		flow.intoCust = data.cus_name;
		flow.intoCus_no = data.cus_no;
		layer.closeAll();
		$("#intoCust").val(data.cus_name);
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
		var nowData = layui.table.checkStatus('dataListOnes').data;
        var datas = flow.datas;      
		for(var i=0;i<nowData.length;i++){
			for(var j=0;j<datas.length;j++){
				if(nowData[i]['numIndex'] == datas[j]['numIndex']){
					flow.datas[j].prd_loc = data.prd_loc;
                    flow.datas[j].prd_loc_name = data.name;
				}
			}
		}
        table.render(dataListOne);
        layer.closeAll();
	});
	
	//获取表格修改信息
	table.on('edit(dataListOnes)', function(obj){
		var value = obj.value //得到修改后的值
		,data = obj.data //得到所在行所有键值
		,field = obj.field; //得到字段
		//layer.msg('[ID: '+ data.change +'] ' + field + ' 字段更改为：'+ value);
		var index = data.index;
        if(field == 'cost_price'){
            if(value){
    			isNumber(value);
    			flow.datas[index].cost_price = value;
    			flow.datas[index].change = 1;
    		}else{
    			flow.datas[index].cost_price = 0;
    		}
        }else{
            if(value){
    			isNumber(value);
    			flow.datas[index].num = value;
    			flow.datas[index].change = 1;
    		}else{
    			flow.datas[index].num = 0;
    		}
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
		,{type:'numbers', width:80, title: '序号'}
		,{field:'pic_path', width:130, title: '图片'}
		,{field:'prd_no', minWidth:100, title: '商品编码'}
		,{field:'prd_sku_no', minWidth:100, title: 'SKU编码'}
		,{field:'sku_name', minWidth:100, title: '属性'}
		,{field:'title', minWidth:100, title: '商品名称'}
        ,{field:'prd_loc_name', minWidth:100, title: '货位'}
        ,{field:'cost_price', width:100, title: '单价', edit: 'text'}
		,{field:'num', width:100, title: '入库数量', edit: 'text'}
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
		var goodsNum = $("#goodsNum").val();
        var goodsSkuNum = $("#goodsSkuNum").val();
		var goodsName = $("#goodsName").val();
		$.ajax({
			url:'?m=PT&c=Storage&a=getPrdList',
			dataType: 'json',
			type: "post",
			data:{
				prd_no:goodsNum,
                prd_sku_no:goodsSkuNum,
				prd_name:goodsName,
			},
			success:function(data){
				if(data.data){
					//console.log(data.data);
					flow.datas = data.data;
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
				}
			}
		})
	}
};

//保存入库
$("#saveInto").click(function(){
	var onOff = $("#saveInto").hasClass('layui-btn-disabled');
	$("#saveIntobtn").css("display","none");
	if(!onOff){
		var datas = flow.datas;
        var cus_no = flow.intoCus_no;
        if(cus_no == ""){
            layer.msg('请选择供应商');
			return false;
        }
		if(res){
			var wh = res;
		}else{
			var wh = flow.intoWh_no;
		}
		if(wh == ""){
			layer.msg('请选择仓库');
			return false;
		}
		var save = new Array();
		var total_fee = 0;
		for(var i=0;i<datas.length;i++){
			if(datas[i].num && datas[i].num>0){
				if(datas[i].prd_loc == ''){
				    layer.msg('请输入入库货位');
                    return false;
								    
				}
				datas[i].count = datas[i].num * datas[i].cost_price;
				total_fee += datas[i].num * datas[i].cost_price;
				save.push(datas[i]);
			}
		}
		if(save == ""){
			layer.msg('请输入入库数量，并且大于0');
			return false;
		}
		$.ajax({
			url:'?m=PT&c=Storage&a=setInPurchase',
			dataType: 'json',
			type: "post",
			data:{
                cus_no:cus_no,
				wh:wh,
				data:save,
			},
			success:function(data){
				if(data.code == "ok"){
				    flow.dayin = data.pc_no;
				    if(flow.isFirst == true){
						flow.setyesorder();
						flow.isFirst = false;
					}
					setTimeout(function(){
						flow.isFirst = true;
					},200);
					$("#tableOne").css("display","none");
					$("#tableTwo").css("display","block");
                    $("#batchSetLocs").removeClass('layui-btn-normal');
					$("#batchSetLocs").addClass('layui-btn-disabled');
					$("#batchSetNums").removeClass('layui-btn-normal');
					$("#batchSetNums").addClass('layui-btn-disabled');
					$("#saveInto").removeClass('layui-btn-normal');
					$("#saveInto").addClass('layui-btn-disabled');
                    $("#saveInto2").removeClass('layui-btn-normal');
					$("#saveInto2").addClass('layui-btn-disabled');
					$("#retypeLogo").removeClass('layui-btn-disabled');
					$("#retypeLogo").addClass('layui-btn-normal');
					$("#total_fee").html(total_fee);
					flow.saveDate = save;
					dataLoadTwo.tableLoadTable();
				}else{
					layer.msg(data.msg);
				}
			}
		})
	}
});
$("#saveInto2").click(function(){
	var onOff = $("#saveInto2").hasClass('layui-btn-disabled');
	$("#saveInto2btn").css("display","none");
	if(!onOff){
		var datas = flow.datas;
        var cus_no = flow.intoCus_no;
        if(cus_no == ""){
            layer.msg('请选择供应商');
			return false;
        }
       // var wh = flow.intoWh_no;
		if(res){
			var wh = res;
		}else{
			var wh = flow.intoWh_no;
		}
		if(wh == ""){
			layer.msg('请选择仓库');
			return false;
		}
		var save = new Array();
		var total_fee = 0;
		for(var i=0;i<datas.length;i++){
			if(datas[i].num && datas[i].num>0){
				if(datas[i].prd_loc == ''){
				    layer.msg('请输入入库货位');
                    return false;

				}
				datas[i].count = datas[i].num * datas[i].cost_price;
				total_fee += datas[i].num * datas[i].cost_price;
				save.push(datas[i]);
			}
		}
		if(save == ""){
			layer.msg('请输入入库数量，并且大于0');
			return false;
		}
		$.ajax({
			url:'?m=PT&c=Storage&a=setInPurchase',
			dataType: 'json',
			type: "post",
			data:{
                cus_no:cus_no,
				wh:wh,
				data:save,
			},
			success:function(data){
				if(data.code == "ok"){
					$("#tableOne").css("display","none");
					$("#tableTwo").css("display","block");
                    $("#batchSetLocs").removeClass('layui-btn-normal');
					$("#batchSetLocs").addClass('layui-btn-disabled');
					$("#batchSetNums").removeClass('layui-btn-normal');
					$("#batchSetNums").addClass('layui-btn-disabled');
					$("#saveInto").removeClass('layui-btn-normal');
					$("#saveInto").addClass('layui-btn-disabled');
                    $("#saveInto2").removeClass('layui-btn-normal');
					$("#saveInto2").addClass('layui-btn-disabled');
					$("#retypeLogo").removeClass('layui-btn-disabled');
					$("#retypeLogo").addClass('layui-btn-normal');
					$("#total_fee").html(total_fee);
					flow.saveDate = save;
					dataLoadTwo.tableLoadTable();
				}else{
					layer.msg(data.msg);
				}
			}
		})
	}
});
//重新打印
$("#retypeLogo").click(function(){
	var onOff = $("#retypeLogo").hasClass('layui-btn-disabled');
	if(!onOff){
		if(flow.isFirst == true){
			flow.setyesorder();
			flow.isFirst = false;
		}
		setTimeout(function(){
			flow.isFirst = true;
		},3000);
	}
});

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
		,{field:'prd_no', width:200, title: '商品编码'}
		,{field:'prd_sku_no', width:200, title: 'SKU编码'}
		,{field:'sku_name', width:200, title: '属性'}
		,{field:'title', width:200, title: '商品名称'}
        ,{field:'prd_loc_name', width:200, title: '货位'}
        ,{field:'cost_price', width:200, title: '单价'}
		,{field:'num', width:200, title: '入库数量'}
		,{field:'count', width:200, title: '合计'}
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
	$("#saveIntobtn").css("display","");
	$("#saveInto2btn").css("display","");
	$("#batchSetNums").removeClass('layui-btn-disabled');
	$("#batchSetNums").addClass('layui-btn-normal');
    $("#batchSetLocs").removeClass('layui-btn-disabled');
	$("#batchSetLocs").addClass('layui-btn-normal');    
	$("#saveInto").removeClass('layui-btn-disabled');
	$("#saveInto").addClass('layui-btn-normal');
    $("#saveInto2").removeClass('layui-btn-disabled');
	$("#saveInto2").addClass('layui-btn-normal');
	$("#retypeLogo").removeClass('layui-btn-normal');
	$("#retypeLogo").addClass('layui-btn-disabled');
	dataLoadOne.tableLoadTable();
}

//清除
$("#searchReload").click(function(){
	$("#goodsNum").val("");
    $("#goodsSkuNum").val("");
	$("#goodsName").val("");
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
function custSetBtn(){
	custTableLoad.tableLoadTable();
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
		var id = flow.intoWh_no;
		var locName = $("#locName").val();
		$.ajax({
			url:'/?m=PT&c=purchase&a=getLocTable',
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
//批量设置
function batchSetLoc(){
    var nowData = flow.delData;
	if(nowData.length == 0){
		layer.msg('请选择修改货位的货品');
		return false;
	}
	if(res){
		var wh = res;
	}else{
		var wh = flow.intoWh;
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
    
}
//批量设置数量
function batchSetNum(){
	$("#inputNum").val("");
	var onOff = $("#batchSetNums").hasClass('layui-btn-disabled');
	if(!onOff){
		//var nowData = flow.delData;
		var nowData = layui.table.checkStatus('dataListOnes').data; 
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
				var datas = flow.datas;
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