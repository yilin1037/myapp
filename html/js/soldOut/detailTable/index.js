var vue = new Vue({
	el: '#vue',
	data: {
		dateTime:[],      //本月，本周，本日的开始结束时间
		goodsClassId:'',  //商品类型选择的ID
	}
})

//商品类型树形图配置
var setting = {
	data: {
		key: {title:"t"},
		simpleData: {enable: true}
	},
	callback: {
		onClick: onClick
	}
};

$(window).ready(function(){
	var rightHeight = $(document).width()-260;
	$(".rightMain").css("width",rightHeight+"px");
	
	//获取本月，本周，本日的开始结束时间
	$.ajax({
		url:'/?m=soldOut&c=detailTable&a=dateTime',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			vue.dateTime = data;
		}
	})
	
	//等多筛选条件
	var ifOnOff = true;
	$(".moreIf").click(function(){
		if(ifOnOff){
			$(".moreConditions").css("display","block");
			$(".moreIf").find(".layui-icon").html("&#xe61a;");
			ifOnOff = false;
		}else{
			$(".moreConditions").css("display","none");
			$(".moreIf").find(".layui-icon").html("&#xe619;");
			ifOnOff = true;
		}
	})
	
	//获取商品类型数据
	$.ajax({
		url:'/?m=soldOut&c=detailTable&a=getLeftTree',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			var zNodes = data;
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
		}
	})
})

//货品选择
function waveName(){
	goodsChooseTableLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '货品选择',
		skin: 'layui-layer-rim', //加上边框
		area: ['850px', '600px'], //宽高
		shade: 0.3,
		content: $("#goodsChooseAlert"),
	});
}

//商品类型属性图点击毁回调
function onClick(event, treeId, treeNode, clickFlag) {
	//console.log(treeNode);
	vue.goodsClassId = treeNode.id;
	goodsChooseTableLoad.tableLoadTable();
}

layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,upload = layui.upload //上传
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;	
	
	//开始时间
	laydate.render({
		elem: '#startDate'
	});
	laydate.render({
		elem: '#startTime'
		,type: 'time'
	});
	//结束时间
	laydate.render({
		elem: '#endDate'
	});
	laydate.render({
		elem: '#endTime'
		,type: 'time'
	});
	
	var $ = layui.$;
	
	//利润报表列表
	layer.load(2);
	var timeType = jQuery("#timeType").val();
	table.render({
		elem: '#dataList'
		,url: '/?m=soldOut&c=detailTable&a=getLoadTable'
		,height: 'full-85'
		,cols: [[ //标题栏
			{type:'numbers', width:80, title: '序号'}
			,{field:'prd_no', minWidth:200, title: '商品编号'}
			,{field:'title', minWidth:250, title: '商品名称'}
			,{field:'sku_name', minWidth:150, title: '属性'}
			,{field:'nums', width:100, title: '数量'}
			//,{field:'up_cst', width:100, title: '拿货价'}
			,{field:'cst', width:100, title: '拿货金额'}
			//,{field:'sumprice', width:100, title: '金额'}
			,{field:'pic_url', width:100, title: '图片'}
			,{field:'onlinetitle', minWidth:200, title: '线上货品'}
			,{field:'outer_sku_id', minWidth:150, title: '线上SKU编码'}
		]]
		,id: 'dataList'
		,skin: 'row' //表格风格
		,even: true
		,page: true //是否显示分页
		,limits: [50, 100, 200]
		,limit: 50 //每页默认显示的数量
		,where: {
			timeType: $("#timeType").val(),
			stockType: $("#stockType").val(),
			start: $("#startDate").val() + " " + $("#startTime").val(),
			end: $("#endDate").val() + " " + $("#endTime").val(),
		}
		,done: function(res, curr, count){
			layer.closeAll('loading');
		}
	});
	
	//利润报表列表重载
	var $ = layui.$, active = {
		reload: function(){
			layer.load(2);
			var timeType = $("#timeType").val();
			var stockType = $("#stockType").val();
			var startDate = $("#startDate").val();
			var startTime = $("#startTime").val();
			var start = startDate +" "+startTime;
			var endDate = $("#endDate").val(); 
			var endTime = $("#endTime").val();
			var end = endDate +" "+ endTime;
			var orderNum = $("#orderNum").val();
			var shopChoose = $("#shopChoose").val();
			var goodsName = $("#goodsChoose").val();
			var goodsNo = $("#goodsNoChoose").val();
			var whChoose = $("#whChoose").val();
			var skuChoose = $("#skuChoose").val();
			table.reload('dataList', {
				page: {
					curr: 1
				}
				,where: {
					timeType:timeType,
					stockType: stockType,
					start:start,
					end:end,
					orderNum:orderNum,
					shopChoose:shopChoose,
					goodsName:goodsName,
					goodsNo:goodsNo,
					whChoose:whChoose,
					skuChoose:skuChoose,
				}
			});
		}
	};
	$("#search").click(function(){
		active['reload'] ? active['reload'].call(this) : '';
	})
	$("#goodsChoose").keydown(function(event){
		if(event.keyCode ==13){
			active['reload'] ? active['reload'].call(this) : '';
		}
	});
	$("#skuChoose").keydown(function(event){
		if(event.keyCode ==13){
			active['reload'] ? active['reload'].call(this) : '';
		}
	});
	
	
	//获取店铺列表
	$.ajax({
		url:'/?m=soldOut&c=detailTable&a=getShopList',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			var ohtml = "<option value=''>请选择店铺</option>";
			for(var i=0;i<data.length;i++){
				ohtml += "<option value='"+data[i]['shopid']+"'>"+data[i]['shopname']+"</option>";
			}
			$("#shopChoose").html(ohtml);
			form.render('select');
		}
	})
	
	//获取仓库列表
	$.ajax({
		url:'/?m=soldOut&c=detailTable&a=getWhList',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			var ohtml = "<option value=''>请选择仓库</option>";
			for(var i=0;i<data.length;i++){
				ohtml += "<option value='"+data[i]['wh']+"'>"+data[i]['NAME']+"</option>";
			}
			$("#whChoose").html(ohtml);
			form.render('select');
		}
	})
	
	//监听时间变化当月、当周、当日
	form.on('select(chooseTime)', function(data){
		switch(data.value){
			case '0':
				var startDate = vue.dateTime['startMonth'];
				var endDate = vue.dateTime['endMonth'];
				$("#startDate").val(startDate);
				$("#endDate").val(endDate);
				break;
			case '1':
				var startDate = vue.dateTime['startWeek'];
				var endDate = vue.dateTime['endWeek'];
				$("#startDate").val(startDate);
				$("#endDate").val(endDate);
				break;
			case '2':
				var startDate = vue.dateTime['today'];
				var endDate = vue.dateTime['today'];
				$("#startDate").val(startDate);
				$("#endDate").val(endDate);
				break;
			case '3':
				var startDate = vue.dateTime['yesterday'];
				var endDate = vue.dateTime['yesterday'];
				$("#startDate").val(startDate);
				$("#endDate").val(endDate);
				break;
		}
	});

	//监听店铺选择情况
	table.on('tool(goodsChooseTable)', function(obj){
		var data = obj.data;
		$("#goodsChoose").val(data.title);
		layer.closeAll();
	});
})

//重置按钮
$(".searchReset").click(function(){
	$(".searchList")[0].reset();
	var startDate = vue.dateTime['startMonth'];
	var endDate = vue.dateTime['endMonth'];
	$("#startDate").val(startDate);
	$("#endDate").val(endDate);
})

//商品安名称搜索
function goodsNameSearch(){
	goodsChooseTableLoad.tableLoadTable();
}

//店铺选择弹出列表
var goodsChooseTable = {
	elem: '#goodsChooseTable'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100, 200]
	,limit: 50 
	,height: '450'
	,cols: [[ 
		{type:'numbers', width:50, event: 'setSign', style:'cursor: pointer;'}
		,{field:'prd_no', width:175, title: '商品编号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'title', width:200, title: '商品名称', event: 'setSign', style:'cursor: pointer;'}
		,{field:'category_name', width:180, title: '商品类别', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'goodsChooseTable'
	,data:[]
	,even: true
};
var goodsChooseTableLoad = {
	tableObj:false,
	tableLoadTable:function(wave_no){
		var table = layui.table;
		goodsChooseTable['page'] = {
			curr: 1 
		};
		var goodsClassId = vue.goodsClassId;
		var goodsName = $("#goodsName").val();
		$.ajax({
			url:'/?m=soldOut&c=detailTable&a=getGoodsList',
			dataType: 'json',
			type: "post",
			data:{
				goodsClassId:goodsClassId,
				goodsName:goodsName,
			},
			success:function(data){
				if(!goodsChooseTableLoad.tableObj){
					for(var i=0;i<data.length;i++){
						goodsChooseTable.data.push(data[i]);
					}
					goodsChooseTableLoad.tableObj = table.render(goodsChooseTable);
				}else{
					goodsChooseTable.data = [];
					for(var i=0;i<data.length;i++){
						goodsChooseTable.data.push(data[i]);
					}
					goodsChooseTableLoad.tableObj.reload(goodsChooseTable);
				}
			}
		})
	}
};

//导出查询结果
$("#outputExcel").click(function(){
	var timeType = $("#timeType").val();
	var stockType = $("#stockType").val();
	var startDate = $("#startDate").val();
	var startTime = $("#startTime").val();
	var start = startDate +" "+startTime;
	var endDate = $("#endDate").val(); 
	var endTime = $("#endTime").val();
	var end = endDate +" "+ endTime;
	var orderNum = $("#orderNum").val();
	var shopChoose = $("#shopChoose").val();
	var goodsName = $("#goodsChoose").val();
	var goodsNo = $("#goodsNoChoose").val();
	var whChoose = $("#whChoose").val();
	var skuChoose = $("#skuChoose").val();
	//console.log("?m=soldOut&c=detailTable&a=outputExcel&timeType="+timeType+"&stockType="+stockType+"&start="+start+"&end="+end+"&orderNum="+orderNum+"&shopChoose="+shopChoose+"&goodsName="+goodsName+"&goodsNo="+goodsNo+"&whChoose="+whChoose+"&skuChoose="+skuChoose);
	var url = "?m=soldOut&c=detailTable&a=outputExcel&timeType="+timeType+"&stockType="+stockType+"&start="+start+"&end="+end+"&orderNum="+orderNum+"&shopChoose="+shopChoose+"&goodsName="+goodsName+"&goodsNo="+goodsNo+"&whChoose="+whChoose+"&skuChoose="+skuChoose;
	$("#selected").attr('src',url);
});