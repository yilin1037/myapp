var active =  {};
var flow = new Vue({
	el: '#flow',
	data: {
		treeLoc:"",  //货位
		treeWh:"",   //仓库
		id:"",
		par:"",
	},
	mounted: function() {
		var winWidth = $(window).width();
		$(".rightTable").css('width',(winWidth-200)+'px');
			$.ajax({
			url:'/?m=WMS&c=viewSerialNo&a=getLeftTree',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				var zNodes = data;
				$.fn.zTree.init($("#treeDemo"), setting, zNodes);
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
			//vueLoad.tableLoadTable("","");
			
			var url_name = GetRequest();
			var type = 'WMS';
			if(url_name.type){
				type = url_name.type;
			}
			var template = [];
			if(type == 'PT'){
				template.push([ //标题栏
					//{type:'numbers', width:80, title: '序号', templet: '#inventoryNum'}
					{field:'numbers', width:80, title: '序号'}
					,{field:'pic_path', width:80, title: '图片', templet: '#path_pic'}
					,{field:'prd_no_sku_no', minWidth:150, title: '商品编号'}
					,{field:'title', minWidth:150, title: '商品名称'}
					,{field:'prd_loc', minWidth:150, title: '货位'}
					,{field:'cost_price', width:150, title: '金额', templet: '#inventoryPrice'}
					,{field:'sku_name', minWidth:150, title: '属性'}
					,{field:'prd_sku_no', minWidth:150, title: 'SKU编码'}
					,{field:'qty', width:200, title: '库存', templet: '#inventoryPT'}
					,{field:'barcode_sku', width:200, title: 'SKU条码'}
				]);
			}else if(type == 'WMS'){
				template.push([ //标题栏
					{field:'numbers', width:80, title: '序号'}
					,{field:'pic_path', width:80, title: '图片', templet: '#path_pic'}
					,{field:'prd_no_sku_no', minWidth:150, title: '商品编号'}
					,{field:'title', minWidth:150, title: '商品名称'}
					,{field:'prd_loc', minWidth:150, title: '货位'}
					,{field:'cost_price', width:150, title: '金额', templet: '#inventoryPrice'}
					,{field:'sku_name', minWidth:150, title: '属性'}
					,{field:'prd_sku_no', minWidth:150, title: 'SKU编码'}
					,{field:'qty', width:200, title: '库存', templet: '#inventoryWMS'}
				]);
			}
			//加载数据表格
			layer.load(2);
			table.render({
				elem: '#dataList'
				,url: '/?m=WMS&c=viewSerialNo&a=getLeftTable'
				,height: 'full-100'
				,cols: template
				,id: 'dataList'
				,skin: 'row'
				,even: true
				,page: true
				,limits: [50, 100, 200]
				,limit: 50
				,done: function(res, curr, count){
					layer.closeAll('loading');
				}
			});
			
			var $ = layui.$; 
			active = {
				reload: function( id,par ){
					layer.load(2);
					flow.id = id;
					flow.par = par;
					var table = layui.table;
					var shopNums = $("#shopNums").val();
					var shopSkuNums = $("#shopSkuNums").val();
					var proData = $("#proData").val();
					var subData = $("#subData").val();
					var numTop = $("#numTop").val();
					var numBottom = $("#numBottom").val();
					var barcodeSku = $("#barcodeSku").val();
					table.reload('dataList', {
						page: {
							curr: 1
						}
						,where: {
							id: id,
							par: par,
							shopNums:shopNums,
							shopSkuNums:shopSkuNums,
							proData:proData,
							subData:subData,
							numTop:numTop,
							numBottom:numBottom,
							barcodeSku:barcodeSku
						}
					});
				}
			};
		})
	}
})

//导出
$("#getExcel").click(function(){
	var id = flow.id ? flow.id : "";
	var par = flow.par ? flow.par : "";
	var table = layui.table;
	var shopNums = $("#shopNums").val();
	var shopSkuNums = $("#shopSkuNums").val();
	var proData = $("#proData").val();
	var subData = $("#subData").val();
	var numTop = $("#numTop").val();
	var numBottom = $("#numBottom").val();
	var url = "?m=WMS&c=viewSerialNo&a=getExcel&id="+id+"&par="+par+"&shopNums="+shopNums+"&shopSkuNums="+shopSkuNums+"&proData="+proData+"&subData="+subData+"&numTop="+numTop+"&numBottom="+numBottom+"&page=1&numBottom=99999";
	$("#ifile").attr('src',url);
})

function searchUserTypebtn(){
	flow.treeLoc = "";
	flow.treeWh = "";
	active['reload'] ? active['reload'].call(this) : '';
}
/**
var tableLoad = {
	elem: '#dataList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: 'full-50'
	,cols: [[ 
		{type:'numbers', width:105, title: '序号'}
		,{field:'prd_no_sku_no', width:200, title: '商品编号'}
		,{field:'title', width:250, title: '商品名称'}
		,{field:'loc_name', width:200, title: '货位'}
		,{field:'cost_price', width:100, title: '单价'}
		,{field:'sku_name', width:250, title: '属性'}
		,{field:'prd_sku_no', width:250, title: 'SKU编码'}
		,{field:'qty', width:200, title: '库存'}
	]]
	,id: 'pickReload'
	,data:[]
	,even: true
};

var vueLoad = {
	oldTree:false,
	tableObj:false,
	tableLoadTable:function(id,par){
		var table = layui.table;
		var shopNums = $("#shopNums").val();
        var shopSkuNums = $("#shopSkuNums").val();
		var proData = $("#proData").val();
		var subData = $("#subData").val();
		var numTop = $("#numTop").val();
		var numBottom = $("#numBottom").val();
		tableLoad['page'] = {
			curr: 1 
		};
        var url_name = GetRequest();
        var type = 'WMS';
        if(url_name.type){
            type = url_name.type;
        }
		$.ajax({
			url:'/?m=WMS&c=viewSerialNo&a=getLeftTable',
			dataType: 'json',
			type: "post",
			data:{
				id: id,
				par: par,
				shopNums:shopNums,
                shopSkuNums:shopSkuNums,
				proData:proData,
				subData:subData,
				numTop:numTop,
				numBottom:numBottom
			},
			success:function(data){
				if(!vueLoad.tableObj){
					for(var i=0;i<data.data.length;i++){
                        if(type == 'PT'){
                            data.data[i].qty = "<div onclick=\"qtyChange('"+data.data[i].title+"','"+data.data[i].prd_loc+"','"+data.data[i].wh+"','"+data.data[i].prd_no_sku_no+"','"+data.data[i].prd_sku_no+"','"+data.data[i].prd_id+"','"+data.data[i].prd_sku_id+"','"+data.data[i].sku_name+"')\" style='cursor:pointer;'><span style='width:40px;display:inline-block;'>"+data.data[i].qty+"</span><span style='color:blue;'>调整库存</span></div>";
                        }else if(data.data[i].is_explosion == 'T'){
							data.data[i].qty = "<div onclick=\"qtyChange('"+data.data[i].title+"','"+data.data[i].prd_loc+"','"+data.data[i].wh+"','"+data.data[i].prd_no_sku_no+"','"+data.data[i].prd_sku_no+"','"+data.data[i].prd_id+"','"+data.data[i].prd_sku_id+"','"+data.data[i].sku_name+"')\" style='cursor:pointer;'><span style='width:40px;display:inline-block;'>"+data.data[i].qty+"</span><span style='color:blue;'>调整库存</span></div>";
						}else if(data.data[i].is_explosion == 'F'){
							if(data.data[i].qty == data.data[i].qtys){
								data.data[i].qty = "<div onclick=\"qtys('"+data.data[i].prd_loc+"','"+data.data[i].wh+"','"+data.data[i].prd_no_sku_no+"','"+data.data[i].prd_id+"','"+data.data[i].prd_sku_id+"','"+data.data[i].sku_name+"')\" style='cursor:pointer;'><span style='width:40px;display:inline-block;'>"+data.data[i].qty+"</span><span style='color:green;'>正常</span></div>";
							}else{
								data.data[i].qty = "<div onclick=\"qtys('"+data.data[i].prd_loc+"','"+data.data[i].wh+"','"+data.data[i].prd_no_sku_no+"','"+data.data[i].prd_id+"','"+data.data[i].prd_sku_id+"','"+data.data[i].sku_name+"')\" style='cursor:pointer;'><span style='width:40px;display:inline-block;'>"+data.data[i].qty+"</span><span style='color:red;'>异常</span></div>";
							}
						}
						tableLoad.data.push(data.data[i]);
					}
					vueLoad.tableObj = table.render(tableLoad);
				}else{
					tableLoad.data = [];
					for(var i=0;i<data.data.length;i++){
                        if(type == 'PT'){
                            data.data[i].qty = "<div onclick=\"qtyChange('"+data.data[i].title+"','"+data.data[i].prd_loc+"','"+data.data[i].wh+"','"+data.data[i].prd_no_sku_no+"','"+data.data[i].prd_sku_no+"','"+data.data[i].prd_id+"','"+data.data[i].prd_sku_id+"','"+data.data[i].sku_name+"')\" style='cursor:pointer;'><span style='width:40px;display:inline-block;'>"+data.data[i].qty+"</span><span style='color:blue;'>调整库存</span></div>";
                        }else if(data.data[i].is_explosion == 'T'){
							data.data[i].qty = "<div onclick=\"qtyChange('"+data.data[i].title+"','"+data.data[i].prd_loc+"','"+data.data[i].wh+"','"+data.data[i].prd_no_sku_no+"','"+data.data[i].prd_sku_no+"','"+data.data[i].prd_id+"','"+data.data[i].prd_sku_id+"','"+data.data[i].sku_name+"')\" style='cursor:pointer;'><span style='width:40px;display:inline-block;'>"+data.data[i].qty+"</span><span style='color:blue;'>调整库存</span></div>";
						}else if(data.data[i].is_explosion == 'F'){
							if(data.data[i].qty == data.data[i].qtys){
								data.data[i].qty = "<div onclick=\"qtys('"+data.data[i].prd_loc+"','"+data.data[i].wh+"','"+data.data[i].prd_no_sku_no+"','"+data.data[i].prd_id+"','"+data.data[i].prd_sku_id+"','"+data.data[i].sku_name+"')\" style='cursor:pointer;'><span style='width:40px;display:inline-block;'>"+data.data[i].qty+"</span><span style='color:green;'>正常</span></div>";
							}else{
								data.data[i].qty = "<div onclick=\"qtys('"+data.data[i].prd_loc+"','"+data.data[i].wh+"','"+data.data[i].prd_no_sku_no+"','"+data.data[i].prd_id+"','"+data.data[i].prd_sku_id+"','"+data.data[i].sku_name+"')\" style='cursor:pointer;'><span style='width:40px;display:inline-block;'>"+data.data[i].qty+"</span><span style='color:red;'>异常</span></div>";
							}
						}
						tableLoad.data.push(data.data[i]);
					}
					vueLoad.tableObj.reload(tableLoad);
				}
			}
		})
	}
};
*/
var setting = {
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		onClick: onClick
	}
}

function onClick(event, treeId, treeNode, clickFlag) {
	console.log(treeNode.pro_no+"==>"+treeNode.wh);
	if(treeNode.pId){
		flow.treeLoc = treeNode.pro_no;
		flow.treeWh = treeNode.wh;
		active['reload'] ? active['reload'].call(this,treeNode.pro_no,treeNode.wh) : '';
	}else{
		flow.treeLoc = treeNode.pro_no;
		flow.treeWh = "";
		active['reload'] ? active['reload'].call(this,treeNode.pro_no,"") : '';
	}
	
}	

function qtys(prd_loc,wh,prd_no,prd_id,prd_sku_id,sku_name){
	locLoad.tableLoadTable(prd_loc,wh,prd_no,prd_id,prd_sku_id,sku_name);
	layer.open({
		type: 1,
		skin: 'layui-layer-rim', //加上边框
		area: ['840px', '580px'], //宽高
		content: $("#openLoc")
	});
}

var dataLoc = {
	elem: '#dataLoc'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: 490
	,cols: [[ 
		{type:'numbers', width:100, title: '序号'}
		,{field:'serial_no', width:200, title: '条码'}
		,{field:'addtime', width:300, title: '入库时间'}
		,{field:'send_type', width:210, title: '状态'}
	]]
	,id: 'dataLoc'
	,data:[]
	,even: true
};

var locLoad = {
	tableObj:false,
	tableLoadTable:function(prd_loc,wh,prd_no,prd_id,prd_sku_id,sku_name){
		var table = layui.table;
		locLoad['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=WMS&c=viewSerialNo&a=getLocLoad',
			dataType: 'json',
			type: "post",
			data:{
				prd_loc: prd_loc,
				wh: wh,
				prd_no: prd_no,
				prd_id:prd_id,
				prd_sku_id:prd_sku_id,
				sku_name:sku_name,
			},
			success:function(data){
				if(!locLoad.tableObj){
					for(var i=0;i<data.length;i++){
						dataLoc.data.push(data[i]);
					}
					locLoad.tableObj = table.render(dataLoc);
				}else{
					dataLoc.data = [];
					for(var i=0;i<data.length;i++){
						dataLoc.data.push(data[i]);
					}
					locLoad.tableObj.reload(dataLoc);
				}
			}
		})
	}
};

$("#reset").click(function(){
	$("#shopNums").val("");
    $("#shopSkuNums").val("");
	$("#proData").val("");
	$("#subData").val("");
	$("#numTop").val("");
	$("#numBottom").val("");
	$("#barcodeSku").val("");

	flow.id = "";
	flow.par = "";
})

function qtyChange(title,prd_loc,wh,prd_no,prd_sku_no,prd_id,prd_sku_id,sku_name){
	$("#inputNum").val("");
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
			$.ajax({
				url:'/?m=WMS&c=viewSerialNo&a=upHotlocNum',
				dataType: 'json',
				type: "post",
				data:{
					inputNum:inputNum,
					prd_loc: prd_loc,
					wh: wh,
                    title: title,
					prd_no: prd_no,
                    prd_sku_no: prd_sku_no,
					prd_id:prd_id,
					prd_sku_id:prd_sku_id,
					sku_name:sku_name,
				},
				success:function(data){
					if(data.code == 'ok'){
						if(flow.treeWh){
							active['reload'] ? active['reload'].call(this,flow.treeLoc,flow.treeWh) : '';
						}else{
							active['reload'] ? active['reload'].call(this,flow.treeLoc,"") : '';
						}
						layer.msg(data.msg);
						layer.close(index);
					}else{
						layer.msg(data.msg);
					}
					
				}
			})
		}
	});
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










