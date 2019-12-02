var flow = new Vue({
	el: '#flow',
	data: {
		intoWh:"",    //仓库序号id
		intoWh_no:"", //仓库编号
        intoCust:"",//供应商序号id
		intoCus_no:"",//供应商序号id
        rowData:{},
        djtype:"",
        billType:"",
		pc_no:''
	},
    methods: {
		setyesorder:function(){	
			var self = this;																
																
		},
        loadOrders:function(param,djtype,billType){
            flow.rowData = param;
            flow.djtype = djtype;
            flow.billType = (billType||'');
            if(flow.billType == 'look'){
                $("#batchSetLocs").hide();
                $("#batchSetNums").hide();
                $("#saveInto2").hide();
				if(djtype != '-1')
				{
					$("#overPurchase").hide();	
				}
                var grid = mini.get("grid1");
                grid.setAllowCellEdit(false);
                grid.hideColumn(grid.getColumn("index"));
                grid.hideColumn(grid.getColumn("action"));
            }
            if(djtype == '2'){
                $("#intoCustDiv").hide();
            }

            var pc_no = param['pc_no'];
			flow.pc_no = param['pc_no'];
            $.ajax({
    			url:'/?m=PT&c=statistics&a=getPurchaseInfo',
    			dataType: 'json',
    			type: "post",
    			data:{
    				pc_no:pc_no,
                    djtype:flow.djtype
    			},
                success:function(data){
                    flow.intoCust = data['orders']['RE_cus_no'];
                    flow.intoWh = data['orders']['RE_wh'];
                    flow.intoCus_no = data['orders']['cus_no'];
                    flow.intoWh_no = data['orders']['wh'];
                    $("#intoWh").val(flow.intoWh);
                    $("#intoCust").val(flow.intoCust);
                    var grid = mini.get("grid1");
					var countPrice = data['countPrice'];
					var countNum = data['countNum'];
					$("#countNum").html(countNum);
					$("#countPrice").html(countPrice);
                    grid.setData(data['items']);
                }
            });
        }
	}
});

function onActionRenderer(e) {
    var grid = e.sender;
    var record = e.record;
    var uid = record._uid;
    var rowIndex = e.rowIndex;

    var s = '<a class="Delete_Button" href="javascript:delRow(\'' + uid + '\')">删除</a>';
    return s;
}
function delRow(row_uid) {
    if(flow.billType == 'look'){
        return;
    }
    var grid = mini.get("grid1");
    var row = grid.getRowByUID(row_uid);
    if (row) {
        layer.confirm('确定删除', {icon: 3, title:'提示'}, function(index){
            grid.removeRow(row);
            layer.close(index);
        });
    }
}

function overOrder()
{
	layer.confirm('确定结案？', {icon: 3, title:'提示'}, function(index){
		var url = '?m=PT&c=statistics&a=setOverPurchase';//采购订单结案
		$.ajax({
			url:url,
			dataType: 'json',
			type: "post",
			data:{
				pc_no:flow.pc_no,
			},
			success:function(data){
				if(data.code == "ok"){
					layer.close(index);
					$("#overPurchase").hide();	
					layer.msg("操作成功");
				}else{
					layer.msg(data.msg);
				}
			}
		});
	});	
}
//批量设置
function batchSetLoc(){
    var grid = mini.get("grid1");
    var nowData = grid.getSelecteds();
	if(nowData.length == 0){
		layer.msg('请选择修改货位的货品');
		return false;
	}
    if(flow.intoWh == ""){
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
	var grid = mini.get("grid1");
    var nowData = grid.getSelecteds();
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
			var inputNum = $("#inputNum").val();
			for(var i in nowData){
                if(typeof(nowData[i]) == 'object'){
                    grid.updateRow(nowData[i],{num:inputNum});
                }
			}
			layer.close(index);
		}
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
		layer.closeAll();
		$("#intoWh").val(data.name);
		$("#hotLoc").val("");
	});
    //监听货位选择
	table.on('tool(locTableList)', function(obj){
		var data = obj.data;
        var grid = mini.get("grid1");
        var nowData = grid.getSelecteds();
        for(var i in nowData){
            if(typeof(nowData[i]) == 'object'){
                grid.updateRow(nowData[i],{
                    prd_loc:data.prd_loc,
                    prd_loc_name:data.name
                });
            }
		}
        layer.closeAll();
	});
})
$("#saveInto2").click(function(){
    var grid = mini.get("grid1");
    var datas = grid.getData();
    var cus_no = flow.intoCus_no;
    if(cus_no == "" && djtype != '2'){
        layer.msg('请选择供应商');
		return false;
    }
    var wh = flow.intoWh_no;
	if(wh == ""){
		layer.msg('请选择仓库');
		return false;
	}
    if(datas.length == 0){
        layer.msg('明细不能为空');
		return false;
    }
	var save = new Array();
	for(var i=0;i<datas.length;i++){
		if(!datas[i].num || datas[i].num==0 || datas[i].num<0){
            layer.msg('请输入入库数量');
            return false;
        }
		if(datas[i].prd_loc == ''){
		    layer.msg('请输入入库货位');
            return false;
						    
		}
		save.push(datas[i]);
        
	}
	if(save == ""){
		layer.msg('请输入入库数量');
		return false;
	}
    var url = '?m=PT&c=Storage&a=setInPurchase';//采购入库
    if(flow.djtype == "1"){
        url = '?m=PT&c=Storage&a=setInpurchaseReturn';//采购退回
    }else if(flow.djtype == "2"){
        url = '?m=PT&c=Storage&a=setInOrdinary';//普通入库
    }
	$.ajax({
		url:url,
		dataType: 'json',
		type: "post",
		data:{
            pc_no:flow.rowData['pc_no'],
            cus_no:cus_no,
			wh:wh,
			data:save,
		},
		success:function(data){
			if(data.code == "ok"){
				layer.msg("修改成功");
			}else{
				layer.msg(data.msg);
			}
		}
	})
});
//供应商
$("#intoCust").click(function(){
    if(flow.billType == 'look'){
        return;
    }
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
    if(flow.billType == 'look'){
        return;
    }
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