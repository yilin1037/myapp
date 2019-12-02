var flow = new Vue({
	el: '#flow',
	data: {
		dataList:[],
		proList:"",  //当前扫描的唯一码
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
		flow.hotLoc_no = datas.prd_loc;
		layer.closeAll();
		$("#hotLoc").val(datas.name);
        //右侧列表
        dataLoadOne.tableLoadTable();
	});
    //监听数量变更
	table.on('edit(dataListOnes)', function(obj){
	    var value = (obj.value); //得到修改后的值
        var data = (obj.data); //所在行的所有相关数据
        for(var j in dataListOne.data){
            if(typeof(dataListOne.data[j]) == 'object'){
                if(data['LAY_TABLE_INDEX'] == dataListOne.data[j]['LAY_TABLE_INDEX']){
                    dataListOne.data[j]['pd_num'] = value;
                }
            }
        }
    });
	//初始化右侧表格
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
		area: ['800px', '550px'],
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
function importSave(){
    var prd_loc = flow.hotLoc_no;
	if(!prd_loc || prd_loc == ""){
		layer.msg('请选择要盘点的货位');
		return false;
	}
    ;
    var prdData = JSON.stringify(dataListOne.data);
    var indexLoad = layer.load();
    $.ajax({
		url: "/?m=PT&c=locInventory&a=saveLocInventory",
		data: {
			prd_loc: prd_loc,
            prdData:prdData
		},
		dataType: "json",
		type: "POST",
		success: function (data) {
			if(data['code'] == 'ok'){
				layer.alert("保存成功",{closeBtn:0}, function(index){
					dataLoadOne.tableLoadTable();
                    layer.close(index);
				});
			}else{
				layer.msg(data['msg'],{
					icon: 2,
					time: 2000
				});
			}
            layer.close(indexLoad);
		},
		error: function(){
			layer.close(indexLoad);
		}
	});
}
function importPd(){
    $("#ImportExcelForm")[0].reset();
    var prd_loc = flow.hotLoc_no;
	if(!prd_loc || prd_loc == ""){
		layer.msg('请选择要盘点的货位');
		return false;
	}
    layer.open({																																											
		type: 1,																																											
		title: '导入',																																									
		skin: 'layui-layer-rim', //加上边框																																					
		area: ['400px', '250px'], //宽高																																					
		shade: 0.3,	
        resize: false,	
		content: $("#import-pages"),
        btn: ['确定', '取消'],
        yes: function(index, layero){
            var indexLoad = layer.load();
            $("#ImportExcelForm").ajaxSubmit({
        		type:'POST',
        		data:{},
        		dataType:"json",
        		success: function(data){
					if(Object.prototype.toString.call(data) === "[object String]"){
						var data = JSON.parse(data);
					}
                    if(data['code'] == 'ok'){
                        for(var i in data['data']){
                            if(typeof(data['data'][i]) == 'object'){
                                var isUpdate = false;
                                for(var j in dataListOne.data){
                                    if(typeof(dataListOne.data[j]) == 'object'){
                                        //更新
                                        if(data['data'][i]['prd_sku_id'] && dataListOne.data[j]['prd_sku_id'] && data['data'][i]['prd_sku_id'] == dataListOne.data[j]['prd_sku_id']){
                                            dataListOne.data[j]['pd_num'] = data['data'][i]['pd_num'];
                                            isUpdate = true;
                                        }else if(!data['data'][i]['prd_sku_id'] && !dataListOne.data[j]['prd_sku_id'] && data['data'][i]['prd_id'] == dataListOne.data[j]['prd_id']){
                                            dataListOne.data[j]['pd_num'] = data['data'][i]['pd_num'];
                                            isUpdate = true;
                                        }
                                    }
                                }
                                //插入
                                if(!isUpdate){
                                    dataListOne.data.push({
                                        'prd_id':data['data'][i]['prd_id'],
                                        'prd_sku_id':data['data'][i]['prd_sku_id'],
                                        'prd_nos':data['data'][i]['prd_no'],
                                        'title':data['data'][i]['title'],
                                        'sku_names':data['data'][i]['sku_name'],
                                        'name':$("#hotLoc").val(),
                                        'num':'',
                                        'pd_num':data['data'][i]['pd_num']
                                    });
                                }
                            }
                        }
						dataLoadOne.tableObj.reload(dataListOne);
						layer.msg('导入成功');
                    }else if(data['code'] == 'errorArr'){
                        logDataListOne.data = [];
                        logDataListOne.data = data['data'];
                        logDataLoadOne.tableLoadTable();
                        layer.open({
                			type: 1,
                			title: '导入错误',
                			skin: 'layui-layer-rim', 
                			area: ['800px', '420px'], 
                			shade: 0.3,	
                            resize: false,	
                			content: $("#log-pages")
                        });
                    }else{
						layer.msg(data['msg']);
                    }
                    layer.close(indexLoad);
					
        		},
        		error:function(xhr,status,err){
        			layer.close(indexLoad);
        		}
        	});
            layer.close(index);
        }
	});
}


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
		,{field:'prd_loc', width:140, title: '货位编号', event: 'setSign', style:'cursor: pointer;'}
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

var dataListOne = {
	elem: '#dataListOnes'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,where: {}
	,height: 'full-150'
	,cols: [[ 
		{type:'numbers', width:70, title: '序号'}
		,{field:'prd_nos', width:150, title: '商品编码'}
		,{field:'title', width:150, title: '商品名称'}
		,{field:'sku_names', width:150, title: '商品属性'}
		,{field:'name', width:70, title: '货位'}
		,{field:'num', width:90, title: '数量'}
        ,{field:'pd_num', width:90, title: '盘点数量', edit: 'text'}
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
				    if(!dataLoadOne.tableObj){
						dataLoadOne.tableObj = table.render(dataListOne);
					}else{
						dataListOne.data = [];
						dataLoadOne.tableObj.reload(dataListOne);
					}
				}
			}
		})
	}
};
var logDataListOne = {
	elem: '#log_items'
	,id:'log_items'
	,skin: 'row'
	,where: {}
	,cols: [[
        {field:'rowIndex', title: '序号', width:80}
        ,{field:'msg', title: '说明', width:600}
	]]
	,data:[]
	,even: true
    ,page: false
	,height: 330
    ,limits: [99999]
    ,limit: 99999 //每页默认显示的数量
};
var logDataLoadOne = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		dataListOne['page'] = {
			curr: 1 
		};
		if(!logDataLoadOne.tableObj){
			logDataLoadOne.tableObj = table.render(logDataListOne);
		}else{
			logDataLoadOne.tableObj.reload(logDataListOne);
		}
	}
};