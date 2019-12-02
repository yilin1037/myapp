var vue = new Vue({
	el: '#vue',
	data: {
		dateTime:[],      //本月，本周，本日的开始结束时间
		goodsClassId:'',  //商品类型选择的ID
		hui :false,																																								
		red :false,																																								
		green :false,																																							
		yellow :false,																																							
		blue :false,																																								
		pink :false,
		banner:'',
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
		url:'/?m=soldOut&c=soldTable&a=dateTime',
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
		url:'/?m=soldOut&c=soldTable&a=getLeftTree',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			var zNodes = data;
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
		}
	})
})

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
		,formSelects = layui.formSelects
		,element = layui.element; //元素操作
	var table = layui.table;	
	formSelects.render();
	
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
	
	//利润报表列表
	layer.load(2);
	var timeType = jQuery("#timeType").val();
	table.render({
		elem: '#dataList'
		,data: []
		,url: '/?m=soldOut&c=soldTable&a=getLoadTable'
		,where: { 
			timeType:timeType,
			stockType: jQuery("#stockType").val(),
			start:vue.dateTime['startMonth'],
			end:vue.dateTime['endMonth'],
			pay_type: jQuery("#pay_type").val(),
			is_split: jQuery("#is_split").val(),
		}
		,height: 'full-75'
		,cols: [[ //标题栏
			{type:'numbers', width:50}
			,{field:'seller_flag_pic', width:50}
			,{field:'shopname', width:100, title: '店铺'}
			,{field:'send_man', width:100, title: '发货人'}
			,{field:'tid', width:200, title: '订单号'}
			,{field:'manual', width:60, title: '类型'}
			,{field:'payment_time', width:170, title: '付款日期'}
			,{field:'pay_type', width:100, title: '付款方式'}
			,{field:'send_time', width:170, title: '发货时间'}
			,{field:'buyer_nick', width:150, title: '买家昵称'}
			,{field:'prd_no', width:150, title: '商品编号'}
			,{field:'title', width:150, title: '商品名称'}
			,{field:'onlinetitle', width:100, title: '线上货品'}
			,{field:'sku_name', width:200, title: '属性'}
			//,{field:'wave_no', width:100, title: '批号'}
			,{field:'nums', width:100, title: '数量'}
			//,{field:'price', width:100, title: '单价'}
			,{field:'up_cst', width:100, title: '拿货价'}
			,{field:'cst', width:100, title: '拿货金额'}
			,{field:'payment', width:100, title: '销售金额'}
			//,{field:'gross_profit', width:100, title: '标准毛利'}  //销售金额-拿货金额
			//,{field:'assist_print', width:100, title: '运费收入'}
			,{field:'whname', width:100, title: '仓库'}
			,{field:'prd_loc', width:100, title: '货位'}
			,{field:'type_name', width:100, title: '物流公司'}
			,{field:'express_no', width:150, title: '物流单号'}
			,{field:'buyer_message', width:100, title: '买家备注'}
			,{field:'seller_memo', width:100, title: '卖家备注'}
			,{field:'remark', width:100, title: '备注'}
			,{field:'send_name', width:100, title: '联系人'}
			,{field:'send_mobile', width:100, title: '电话'}
			,{field:'send_province', width:100, title: '省'}
			,{field:'send_city', width:100, title: '市'}
			,{field:'send_district', width:100, title: '区'}
			,{field:'send_address', width:100, title: '地址'}
			,{field:'web_status', width:100, title: '线上状态'}
			,{field:'split_status', width:100, title: '是否为拆分单'}
			,{field:'paytime', width:100, title: '滞发天数'}
			,{field:'outer_sku_id', width:100, title: '线上sku编码'}
		]]
		,id: 'dataList'
		,skin: 'row' //表格风格
		,even: true
		,page: true //是否显示分页
		,limits: [50, 100, 200]
		,limit: 50 //每页默认显示的数量
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
			var pay_type = $("#pay_type").val();
			var startDate = $("#startDate").val();
			var startTime = $("#startTime").val();
			var start = startDate +" "+startTime;
			var endDate = $("#endDate").val(); 
			var endTime = $("#endTime").val();
			var end = endDate +" "+ endTime;
			var orderNum = $("#orderNum").val();
			var shopChoose = formSelects.value('select1', 'valStr');
			var sendUser = $("#sendUser").val();
			var goodsName = $("#goodsChoose").val();
			var goodsNo = $("#goodsNoChoose").val();
			var whChoose = $("#whChoose").val();
			var skuChoose = $("#skuChoose").val();
			var is_split = $("#is_split").val();
			table.reload('dataList', {
				page: {
					curr: 1
				}
				,where: {
					timeType:timeType,
					stockType:stockType,
					pay_type:pay_type,
					start:start,
					end:end,
					orderNum:orderNum,
					shopChoose:formSelects.value('select1', 'valStr'),
					sendUser:sendUser,
					goodsName:goodsName,
					goodsNo:goodsNo,
					whChoose:whChoose,
					skuChoose:skuChoose,
					banner:vue.banner,
					is_split:is_split,
				}
			});
		}
	};
	$("#search").click(function(){
		active['reload'] ? active['reload'].call(this) : '';
	})
	
	//获取操作员列表
	$.ajax({
		url:'/?m=soldOut&c=soldTable&a=getUserList',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			var ohtml = "<option value=''>请选择发货操作员</option>";
			for(var i=0;i<data.length;i++){
				ohtml += "<option value='"+data[i]['userid']+"'>"+data[i]['username']+"</option>";
			}
			$("#sendUser").html(ohtml);
			//form.render('select');
			formSelects.render({name:'sendUser'});
		}
	})
	
	//获取店铺列表
	$.ajax({
		url:'/?m=soldOut&c=soldTable&a=getShopList',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			var ohtml = "<option value=''>请选择店铺</option>";
			for(var i=0;i<data.length;i++){
				ohtml += "<option value='"+data[i]['shopid']+"'>"+data[i]['shopname']+"</option>";
			}
			$("#shopChoose").html(ohtml);
			//form.render('select');
			formSelects.render({name:'shopChoose'});
		}
	})
	//获取仓库列表
	$.ajax({
		url:'/?m=soldOut&c=soldTable&a=getWhList',
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
		}
	});

	//监听店铺选择情况
	table.on('tool(goodsChooseTable)', function(obj){
		var data = obj.data;
		$("#goodsChoose").val(data.title);
		layer.closeAll();
	});
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

//重置按钮
$(".resetBtn").click(function(){
	$(".searchList")[0].reset();
	var startDate = vue.dateTime['startMonth'];
	var endDate = vue.dateTime['endMonth'];
	$("#startDate").val(startDate);
	$("#endDate").val(endDate);
	$("#pay_type").val(-1);
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
			url:'/?m=soldOut&c=soldTable&a=getGoodsList',
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
	var pay_type = $("#pay_type").val();
	var startDate = $("#startDate").val();
	var startTime = $("#startTime").val();
	var start = startDate +" "+startTime;
	var endDate = $("#endDate").val(); 
	var endTime = $("#endTime").val();
	var end = endDate +" "+ endTime;
	var orderNum = $("#orderNum").val();
	//var shopChoose = $("#shopChoose").val();
	var shopChoose = formSelects.value('select1', 'valStr');
	var sendUser = $("#sendUser").val();
	var goodsName = $("#goodsChoose").val();
	var goodsNo = $("#goodsNoChoose").val();
	var whChoose = $("#whChoose").val();
	var skuChoose = $("#skuChoose").val();
	var is_split = $("#is_split").val();
	var banner=vue.banner;
	var url = "?m=soldOut&c=soldTable&a=outputExcel&timeType="+timeType+"&sendUser="+sendUser+"&stockType="+stockType+"&start="+start+"&end="+end+"&orderNum="+orderNum+"&shopChoose="+shopChoose+"&goodsName="+goodsName+"&goodsNo="+goodsNo+"&whChoose="+whChoose+"&skuChoose="+skuChoose+"&pay_type="+pay_type+"&banner="+banner+"&is_split="+is_split;
	$("#selected").attr('src',url);
});
function searchAdd(group,who){
	//var self = this;
	var toggle = event.currentTarget;

	$(toggle).append("<i class='ic'></i>");																															
	$(toggle).addClass("border");																																				
	$(".bannerArr .all .ic").remove();																																					
	$(".bannerArr .all").removeClass("border");
	if(who == "hui"){	
		if(vue.hui == false){																																							
			$("#searchArr .ban").append("<span class='bannerA hui rem' style='background-image:url(\"images/hui.png\");background-size:100% 100%;'></span>");							
			vue.hui = true;																																							
		}else if(vue.hui == true){																																						
			$("#searchArr .ban .hui").remove();																																			
			vue.hui = false;																																							
			$(toggle).removeClass("border");																																	
			$(".bannerArr .banner_1 .ic").remove();			
		}	
	}else if(who == "red"){																																								
		if(vue.red == false){																																							
			$("#searchArr .ban").append("<span class='bannerA red rem' style='background-image:url(\"images/red.png\");background-size:100% 100%;'></span>");							
			vue.red = true;																																							
		}else if(vue.red == true){																																						
			$("#searchArr .ban .red").remove();																																			
			vue.red = false;																																							
			$(toggle).removeClass("border");																																		
			$(".bannerArr .banner_2 .ic").remove();																																		
		}																																												
	}else if(who == "yellow"){																																							
		if(vue.yellow == false){																																						
			$("#searchArr .ban").append("<span class='bannerA yellow rem' style='background-image:url(\"images/yellow.png\");background-size:100% 100%;'></span>");						
			vue.yellow = true;																																							
		}else if(vue.yellow == true){																																					
			$("#searchArr .ban .yellow").remove();																																		
			vue.yellow = false;																																						
			$(toggle).removeClass("border");																																	
			$(".bannerArr .banner_3 .ic").remove();																																		
		}																																												
	}else if(who == "green"){																																							
		if(vue.green == false){																																						
			$("#searchArr .ban").append("<span class='bannerA green rem' style='background-image:url(\"images/green.png\");background-size:100% 100%;'></span>");						
			vue.green = true;																																							
		}else if(vue.green == true){																																					
			$("#searchArr .ban .green").remove();																																		
			vue.green = false;																																							
			$(toggle).removeClass("border");																																	
			$(".bannerArr .banner_4 .ic").remove();																																		
		}																																												
	}else if(who == "blue"){																																							
		if(vue.blue == false){																																							
			$("#searchArr .ban").append("<span class='bannerA blue rem' style='background-image:url(\"images/blue.png\");background-size:100% 100%;'></span>");							
			vue.blue = true;																																							
		}else if(vue.blue == true){																																					
			$("#searchArr .ban .blue").remove();																																		
			vue.blue = false;																																							
			$(toggle).removeClass("border");																																
			$(".bannerArr .banner_5 .ic").remove();																																		
		}																																												
	}else if(who == "pink"){																																							
		if(vue.pink == false){																																							
			$("#searchArr .ban").append("<span class='bannerA pink rem' style='background-image:url(\"images/fen.png\");background-size:100% 100%;'></span>");							
			vue.pink = true;																																							
		}else if(vue.pink == true){																																					
			$("#searchArr .ban .pink").remove();																																		
			vue.pink = false;																																							
			$(toggle).removeClass("border");							
			$(".bannerArr .banner_6 .ic").remove();																																		
		}																																												
	}else if(who == "all"){																																								
		$("#searchArr .ban span").remove();																																				
																																																	
		$(".bannerArr div").each(function(){																																			
			$(".bannerArr .ic").remove();																																				
			$(this).removeClass("border");																																		
		});																																												
																																																	
		$(toggle).append("<i class='ic'></i>");																														
		$(toggle).addClass("border");																																																																																		
		vue.hui = false;																																								
		vue.red = false;																																								
		vue.green = false;																																								
		vue.yellow = false;																																							
		vue.blue = false;																																								
		vue.pink = false;		
	}
	vue.banner = "";
	if(vue.hui){
		vue.banner += (0 + ",");
	}
	if(vue.red){
		vue.banner += (1 + ",");
	}
	if(vue.yellow){
		vue.banner += (2 + ",");
	}
	if(vue.green){
		vue.banner += (3 + ",");
	}
	if(vue.blue){
		vue.banner += (4 + ",");
	}
	if(vue.pink){
		vue.banner += (5 + ",");
	}
	if(vue.banner != ""){
		vue.banner = vue.banner.substring(0,vue.banner.length-1);
	}
}

// 重置旗帜
$("#reset").click(function(){
	var formSelects = layui.formSelects;
	formSelects.value('select1', []);
	formSelects.value('select2', []);
	$("#bannerAll").click();

});
