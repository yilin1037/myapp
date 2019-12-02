var flow = new Vue({
	el: '#flow',
	data: {
		intoWh:"",    //仓库序号id
		intoWh_no:"", //仓库编号
        intoCust:"",//供应商序号id
		intoCus_no:"",//供应商序号id
	},
    methods: {
		setyesorder:function(){	
			var self = this;																
																
		},
	},
	mounted: function () {
		$("#toExcel").click(function () {
            var djtype = $("#djtype").val();	
			var intoCust = flow.intoCus_no;	
			var intoWh = flow.intoWh_no;
			var goodsNo = $("#goodsNo").val();
			var time = new Date().getTime();
			if(djtype != "4"){
				layer.msg('只能导出盘出数据',{
						icon: 0,
						time: 2000
					});
					return false;
			}
			$.ajax({
				url: "/?m=PT&c=statistics&a=toExcelFunction&loginact=file",
				type: 'post',
				data: {djtype: djtype,cus_no: intoCust,wh: intoWh,goodsNo: goodsNo, time: time},
				dataType: 'text',
				success: function (text){
					$("input[name='order']").iCheck('uncheck');
					$(".inputTe").css("color","white");
					self.isAll = 0;
					self.nowPage = false;
					self.allPage = false;
					
					if(!text){
						var url = "/xls/InventoryExport"+time+".xls?loginact=file";
						$("#ifile").attr('src',url);
					}
				},error: function (jqXHR, textStatus, errorThrown) {
					layer.msg('没有可导出数据',{
						icon: 0,
						time: 2000
					});
				}
			});
        });
	}
});
function loadGrid(){
    var grid1 = mini.get("grid1");
    var djtype = $("#djtype").val();	
    var intoCust = flow.intoCus_no;	
    var intoWh = flow.intoWh_no;
	var goodsNo = $("#goodsNo").val();	
    grid1.load({
        djtype:djtype,
        cus_no:intoCust,
        wh:intoWh,
		goodsNo:goodsNo
    });
}
function onActionRenderer(e) {
    var grid = e.sender;
    var record = e.record;
    var uid = record._uid;
    var rowIndex = e.rowIndex;
    var djtype = $("#djtype").val();
    var s = '';
    s += ' <a class="Look_Button" href="javascript:lookRow(\'' + uid + '\')" >查看</a>';
	if(djtype == '-1' && record.cls_id == ''){
        s += ' <a class="Over_Button" href="javascript:overRow(\'' + uid + '\')" >结案</a>';
    }
    if((djtype == '0' || djtype == '1' || djtype == '2')){
        s += ' <a class="Edit_Button" href="javascript:editRow(\'' + uid + '\')" >编辑</a>';
		if(WMS_MODEL != 'T')
		{
        	s += ' <a class="Delete_Button" href="javascript:delRow(\'' + uid + '\')">删除</a>';
		}
    }
    return s;
}
function lookRow(row_uid){
    var grid = mini.get("grid1");
    var row = grid.getRowByUID(row_uid);
    if (row) {
        var djtype = $("#djtype").val();
        if(djtype == '-1'){
            layer.open({
                title :'查看采购订单',
                type: 2,
                shade: 0.3,
                area: ['1200px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit&djtype=-1',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype,'look');
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
        }else if(djtype == '0'){
            layer.open({
                title :'查看采购入库',
                type: 2,
                shade: 0.3,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype,'look');
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
        }else if(djtype == '1'){
            layer.open({
                title :'查看采购退回',
                type: 2,
                shade: 0.3,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype,'look');
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
        }else if(djtype == '-2'){
            layer.open({
                title :'查看普通出库',
                type: 2,
                shade: 0.3,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype,'look');
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
        }else if(djtype == '2'){
            layer.open({
                title :'查看普通入库',
                type: 2,
                shade: 0.3,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype,'look');
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
        }else if(djtype == '3'){
            layer.open({
                title :'查看库存调整',
                type: 2,
                shade: 0.3,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype,'look');
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
        }else if(djtype == '4'){
            layer.open({
                title :'查看盘入盘出',
                type: 2,
                shade: 0.3,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype,'look');
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
		}else if(djtype == '6'){
            layer.open({
                title :'销售退回',
                type: 2,
                shade: 0.3,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype,'look');
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
        }else if(djtype == '7'){
            layer.open({
                title :'条码出库',
                type: 2,
                shade: 0.3,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype,'look');
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
        }else if(djtype == '8'){
            layer.open({
                title :'查看拆包退回',
                type: 2,
                shade: 0.3,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype,'look');
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
        }else if(djtype == 'TID'){
            layer.open({
                title :'查看电商出库',
                type: 2,
                shade: 0.3,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype,'look');
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
        }
    }
}
function editRow(row_uid) {
    var grid = mini.get("grid1");
    var row = grid.getRowByUID(row_uid);
    if (row) {
        var djtype = $("#djtype").val();
        if(djtype == '0'){
            layer.open({
                title :'编辑采购入库',
                type: 2,
                shade: 0.3,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype);
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
        }else if(djtype == '1'){
            layer.open({
                title :'编辑采购退回',
                type: 2,
                shade: 0.3,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype);
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
        }else if(djtype == '2'){
            layer.open({
                title :'编辑普通入库',
                type: 2,
                shade: 0.3,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=PT&c=statistics&a=purchaseEdit',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.flow.loadOrders(row,djtype);
                },
                cancel:function(index, layero){
                    grid.reload();
                    layer.close(index);
                    return false; 
                }
            }); 
        }
    }
}
function delRow(row_uid) {
    var grid = mini.get("grid1");
    var row = grid.getRowByUID(row_uid);
    if (row) {
        layer.confirm('确定删除', {icon: 3, title:'提示'}, function(index){
            var djtype = $("#djtype").val();
            var url = '?m=PT&c=Storage&a=delInPurchase';//采购入库
            if(djtype == "1"){
                url = '?m=PT&c=Storage&a=delInpurchaseReturn';//采购退回
            }else if(djtype == "2"){
                url = '?m=PT&c=Storage&a=delInOrdinary';//普通入库
            }
            $.ajax({
        		url:url,
        		dataType: 'json',
        		type: "post",
        		data:{
                    pc_no:row['pc_no'],
                    djtype:djtype,
                    isDel:'1'
        		},
        		success:function(data){
        			if(data.code == "ok"){
                        grid.reload();
        				layer.close(index);
        			}else{
        				layer.msg(data.msg);
        			}
        		}
        	});
            
        });
    }
}
function overRow(row_uid) {
    var grid = mini.get("grid1");
    var row = grid.getRowByUID(row_uid);
    if (row) {
        layer.confirm('确定结案？', {icon: 3, title:'提示'}, function(index){
            var url = '?m=PT&c=statistics&a=setOverPurchase';//采购订单结案
            $.ajax({
        		url:url,
        		dataType: 'json',
        		type: "post",
        		data:{
                    pc_no:row['pc_no'],
        		},
        		success:function(data){
        			if(data.code == "ok"){
                        grid.reload();
        				layer.close(index);
        			}else{
        				layer.msg(data.msg);
        			}
        		}
        	});
        });
    }
}
var form;
layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,upload = layui.upload //上传
		,form = layui.form //表单
		,element = layui.element; //元素操作
    var table = layui.table;
    loadGrid();
    form.on('select(djtype)', function(data){
		$('#goodsNo').val('');
		if(data.value != 'TID')
		{
			$('#goodsNo').parent().parent().show();
		}
		else
		{
			$('#goodsNo').parent().parent().hide();	
		}
        loadGrid();
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
		layer.closeAll();
		$("#intoWh").val(data.name);
		$("#hotLoc").val("");
	});
    
})
//搜索
function searchBtn(){
	loadGrid();
}

//清除
$("#searchReload").click(function(){
	$("#djtype").val("0");
	$("#intoCust").val("");
    $("#intoWh").val("");
    flow.intoCust = "";
	flow.intoCus_no = "";
    flow.intoWh = "";
	flow.intoWh_no = "";
	form.render();
        
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
