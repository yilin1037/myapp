var flow = new Vue({
	el: '#flow',
	data: {
		dateTime:[],    //本月，本周，本日的开始结束时间 
		diffChoose:'M',	//选项卡切换，M是按月，D是按日
		shopList:[],	//店铺列表
		toTalData:[],	//汇总数据
		expressList:[],
		DROP_SHIPPING:"F",
		shippingId:"",
		expressArr:[],	
	},
	mounted: function() {
		//初始化页面大小
		$(document).ready(function(){
			var rWidth = $(window).width()-250;
			$(".rightMain").css({'width':rWidth+'px','position':'absolute','top':'0px','left':'250px'});
		});
		var self=this;
		self.getSignStatus();
		//获取本月，本周，本日的开始结束时间
		$.ajax({
			url:'/?m=financial&c=analysis&a=dateTime',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				flow.dateTime = data;
				$("#startTime").val(data['startMonth']);
				$("#endTime").val(data['endMonth']);
			}
		})
		
		//获取店铺列表
		$.ajax({
			url:'/?m=financial&c=analysis&a=getshop',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				console.log(data);
				flow.shopList = data;
			}
		})
		
		$.ajax({
			url:'/?m=financial&c=analysis&a=getexpress',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				flow.expressList = data;
			}
		})
		
		//汇总信息
		returnData();
		
		//layui框架初始化加载
		layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
			var laydate = layui.laydate //日期
				,laypage = layui.laypage //分页
				layer = layui.layer //弹层
				,upload = layui.upload //上传
				,form = layui.form //表单
				,element = layui.element; //元素操作
			var table = layui.table;	

			laydate.render({
				elem: '#startTime'
			});
			laydate.render({
				elem: '#endTime'
			});
			laydate.render({
				elem: '#monthChoose'
				,type: 'month'
				,value: flow['dateTime']['month']
				,done: function(value, date, endDate){
					//console.log(value); //得到日期生成的值，如：2017-08-18
					if(flow.diffChoose == 'M'){
						costSetupLoad.tableLoadTable('M',value);
					}else if(flow.diffChoose == 'D'){
						costSetupLoad.tableLoadTable('D',value);
					}
				}
			});
			laydate.render({
				elem: '#dayChoose'
				,value: flow['dateTime']['today']
				,done: function(value, date, endDate){
					//console.log(value); //得到日期生成的值，如：2017-08-18
					if(flow.diffChoose == 'M'){
						costSetupLoad.tableLoadTable('M',value);
					}else if(flow.diffChoose == 'D'){
						costSetupLoad.tableLoadTable('D',value);
					}
				}
			});
			var $ = layui.$;
			//利润报表列表
			layer.load(2);
			table.render({
				elem: '#dataList'
				,url: '/?m=financial&c=analysis&a=getData'
				,height: 'full-170'
				,cols: [[ //标题栏
					{type:'numbers', width:50}
					,{field:'shoptype', minWidth:150, title: '平台'}
					,{field:'shopname', minWidth:150, title: '店铺'}
					,{field:'new_tid', minWidth:150, title: '订单号'}
					,{field:'statusName', minWidth:150, title: '标记状态'}
					,{field:'buyer_nick', minWidth:150, title: '买家昵称'}
					,{field:'payment_time', minWidth:150, title: '付款日期'}
					,{field:'send_status', width:90, title: '订单状态'}
					,{field:'items_num', width:90, title: '商品总数'}
					,{field:'payment', width:90, title: '销售金额'}
					,{field:'take_price', width:90, title: '商品成本'}
					,{field:'express_fee', width:90, title: '运费成本'}
					,{field:'profits', width:90, title: '订单利润'}
					,{field:'profitMargin', width:90, title: '利润率'}
				]]
				,id: 'dataList'
				,skin: 'row' //表格风格
				,even: true
				,page: true //是否显示分页
				,limits: [50, 100, 200]
				,limit: 50 //每页默认显示的数量
				,where: {
					payState: $("#payState").val(),
					startTime: $("#startTime").val(),
					endTime: $("#endTime").val(),
					shopName: $("#shopName").val(),
					expressName: $("#expressName").val(),
					tid: $("#tid").val(),
					distribution: $("#distribution").val(),
				}
				,done: function(res, curr, count){
					layer.closeAll('loading');
				}
			});
			
			form.on('select(chooseTime)', function(data){
				switch(data.value){
					case '0':
						var startTime = flow.dateTime['startMonth'];
						var endTime = flow.dateTime['endMonth'];
						$("#startTime").val(startTime);
						$("#endTime").val(endTime);
						break;
					case '1':
						var startTime = flow.dateTime['startWeek'];
						var endTime = flow.dateTime['endWeek'];
						$("#startTime").val(startTime);
						$("#endTime").val(endTime);
						break;
					case '2':
						var startTime = flow.dateTime['today'];
						var endTime = flow.dateTime['today'];
						$("#startTime").val(startTime);
						$("#endTime").val(endTime);
						break;
				}
			});
			
			//监听选项卡切换
			element.on('tab(diffChoose)', function(elem){
				if(elem['index'] == 0){
					flow.diffChoose = 'M';
					costSetupLoad.tableLoadTable('M','');
				}else if(elem['index'] == 1){
					flow.diffChoose = 'D';
					costSetupLoad.tableLoadTable('D','');
				}
			});
			
			
			var active = {
				reload: function(){
					layer.load(2);
					var payState = $("#payState").val();
					var startTime = $("#startTime").val();
					var endTime = $("#endTime").val();
					var shopName = $("#shopName").val();
					var expressName = $("#expressName").val();
					var tid = $("#tid").val();
					var distribution = $("#distribution").val();
					//执行重载
					table.reload('dataList', {
						page: {
							curr: 1 //重新从第 1 页开始
						}
						,where: {
							payState: payState,
							startTime: startTime,
							endTime: endTime,
							shopName: shopName,
							expressName: expressName,
							tid: tid,
							distribution: distribution,
						}
					});
				}
			};
			//搜索重置表格
			$("#btnSearch").click(function(){
				active['reload'] ? active['reload'].call(this) : '';
				returnData();
			});
			
			//重新加载多选下拉
			form.render('select');
		})
	},
	methods:{
		getSignStatus:function(){
			var self =this;
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getSignStatus",
				type: 'post',
				data: {DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
				dataType: 'json',
				success: function (data) {
					console.log(data);
					self.expressArr = data;	
					// var dsosHtml = '<div style="float:left;"><select class="sign_status form-control separator" style="background: url(\'images/down.png\') no-repeat scroll 90% center transparent;background-size:17px 15px;border:solid 1px #ccc;width:204px;">';
					// dsosHtml += '<option value=""></option><option value="0">无标记状态</option>';
					// if(data){
					// 	for(var i = 0; i < data.length; i++){
					// 		dsosHtml += '<option value="' + data[i]['id'] + '">' + data[i]['statusName'] + '</option>';
					// 	}
					// 	dsosHtml += '</select>';
					// }
					// dsosHtml += '</select></div><div style="margin-left:10px;float:left;"><button id="signStatusManage" class="btn" style="width:120px;" onclick="signStatusManage()">添加标记状态</button></div>';
					// $("#changeDiv1").html(dsosHtml);
				}
			});
		}
	}
})

function returnData(){
	$.ajax({
		url:'/?m=financial&c=analysis&a=getToTalData',
		dataType: 'json',
		type: "post",
		data:{
			payState: $("#payState").val(),
			startTime: $("#startTime").val(),
			endTime: $("#endTime").val(),
			shopName: $("#shopName").val(),
			distribution: $("#distribution").val(),
			expressName: $("#expressName").val(),
			changeDiv1:$("#changeDiv1").val(),
			tid: $("#tid").val(),
		},
		success:function(data){
			flow.toTalData = data;
		}
	})
}

//查看系统明细报表
var returnGoods = {
	elem: '#returnGoods'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100, 200]
	,limit: 50 
	,height: '450'
	,cols: [[ 
		{type:'numbers', width:50}
		,{field:'new_tid', minWidth:100, title: '订单编号'}
		,{field:'prd_no', minWidth:100, title: '商品编码'}
		,{field:'num', width:80, title: '数量'}
		,{field:'shopid', width:120, title: '店铺'}
		,{field:'take_price', width:100, title: '退款成本'}
		,{field:'price', width:100, title: '退款金额'}
	]]
	,id: 'returnGoods'
	,data:[]
	,even: true
};

var returnGoodsLoad = {
	tableObj:false,
	tableLoadTable:function(wave_no){
		var table = layui.table;
		returnGoods['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=financial&c=analysis&a=getReturnToTalData',
			dataType: 'json',
			type: "post",
			data:{
				payState: $("#payState").val(),
				startTime: $("#startTime").val(),
				endTime: $("#endTime").val(),
				shopName: $("#shopName").val(),
				distribution: $("#distribution").val(),
				tid: $("#tid").val(),
				expressName: $("#expressName").val(),
			},
			success:function(data){
				if(!returnGoodsLoad.tableObj){
					for(var i=0;i<data.length;i++){
						returnGoods.data.push(data[i]);
					}
					returnGoodsLoad.tableObj = table.render(returnGoods);
				}else{
					returnGoods.data = [];
					for(var i=0;i<data.length;i++){
						returnGoods.data.push(data[i]);
					}
					returnGoodsLoad.tableObj.reload(returnGoods);
				}
			}
		})
	}
};

//关闭搜索
function exitDisplay(){
	$(".leftSearch").css("display","none");
	$(".rightMain").css({"left":"0",'width':'100%'})
}
//打开搜索
function showDisplay(){
	var rWidth = $(window).width()-250;
	$(".rightMain").css({'width':rWidth+'px','position':'absolute','top':'0px','left':'250px'});
	$(".leftSearch").css("display","block");
}

//查看汇总信息
function viewProList(){
	returnGoodsLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '退款明细',
		skin: 'layui-layer-rim', //加上边框
		area: ['850px', '550px'], //宽高
		shade: 0.3,
		content: $("#returnGoodsList"),
	});
}

//费用设置
function costSetupList(){
	$(".diffChoose").find('li').removeClass('layui-this');
	$(".diffChoose").find('li').eq(0).addClass('layui-this');
	var monthChoose = $("#monthChoose").val();
	$(".diffChooseDate").find(".layui-tab-item").removeClass('layui-show');
	$(".diffChooseDate").find(".layui-tab-item").eq(0).addClass('layui-show');
	costSetupLoad.tableLoadTable('M',monthChoose);
	layer.open({
		type: 1,
		title: '费用设置',
		skin: 'layui-layer-rim', //加上边框
		area: ['700px', '570px'], //宽高
		shade: 0.3,
		content: $("#costSetupList"),
		btn: ['确定', '取消'],
		yes: function(index, layero){
			
			//区分获取时间，按月或者按日
			var type = flow.diffChoose;
			var time = "";
			if(type == 'M'){  //费用设置按月录入 
				time = $("#monthChoose").val();
			}else if(type == 'D'){  //费用设置按日录入 
				time = $("#dayChoose").val();
			}
			var data = costSetup.data;
			$.ajax({
				url:'/?m=financial&c=analysis&a=setCostDetail',
				dataType: 'json',
				type: "post",
				data:{
					type:type,
					time:time,
					data:data,
				},
				success:function(data){
					if(data.code == 'ok'){
						returnData();
					}
					layer.msg(data.msg);
				}
			})
			//layer.close(index);	
		}
	});
}

//费用设置列表(按月)
var costSetup = {
	elem: '#costSetup'
	,height: '350'
	,skin: 'row'
	,even: true
	,cols: [[ 
		{type:'numbers', width:100}
		,{field:'cost_name', width:300, title: '类型'}
		,{field:'cost_amount', width:260, title: '金额', edit: 'text'}
	]]
	,id: 'costSetup'
	,data:[]
};

var costSetupLoad = {
	tableObj:false,
	tableLoadTable:function( type,data ){
		var table = layui.table;
		var monthChoose = $("#monthChoose").val();
		var dayChoose = $("#dayChoose").val();
		var time = "";
		if(flow.diffChoose == 'M'){
			time = monthChoose;
		}else if(flow.diffChoose == 'D'){
			time = dayChoose;
		}
		if(data != ''){
			time = data;
		}
		$.ajax({
			url:'/?m=financial&c=analysis&a=getCostDetail',
			dataType: 'json',
			type: "post",
			data:{
				type:type,
				time:time,
			},
			success:function(data){
				if(data != ""){
					if(!costSetupLoad.tableObj){
						costSetup.data = [];
						for(var i=0;i<data.length;i++){
							costSetup.data.push(data[i]);
						}
						costSetupLoad.tableObj = table.render(costSetup);
					}else{
						costSetup.data = [];
						for(var i=0;i<data.length;i++){
							costSetup.data.push(data[i]);
						}
						costSetupLoad.tableObj.reload(costSetup);
					}
				}else{
					//静态数据
					costSetup.data = [{
						  "cost_name": "人工费用"
						  ,"cost_amount": "0.00"
						}, {
						  "cost_name": "推广费用"
						  ,"cost_amount": "0.00"
						}, {
						  "cost_name": "售后费用"
						  ,"cost_amount": "0.00"
						}, {
						  "cost_name": "财务费用"
						  ,"cost_amount": "0.00"
						}, {
						  "cost_name": "水电房租"
						  ,"cost_amount": "0.00"
						}, {
						  "cost_name": "税务"
						  ,"cost_amount": "0.00"
						}, {
						  "cost_name": "其他费用1"
						  ,"cost_amount": "0.00"
						}, {
						  "cost_name": "其他费用2"
						  ,"cost_amount": "0.00"
						}];
					table.render(costSetup);
				}
				
			}
		})
	}
};

//导出
$("#outputExcel").click(function(){
	var payState = $("#payState").val();
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	var shopName = $("#shopName").val();
	var distribution = $("#distribution").val();
	var expressName = $("#expressName").val();
	var tid = $("#tid").val();
	var page = 1;
    var limit = 99999;
	var url = "?m=financial&c=analysis&a=outputExcel&payState="+payState+"&startTime="+startTime+"&endTime="+endTime+"&shopName="+shopName+"&distribution="+distribution+"&tid="+tid+"&expressName="+expressName+"&page="+page+"&limit="+limit;
	$("#ifile").attr('src',url);
})

$("#btnReset").click(function(){
	$("#payState").val(1);
	$("#shopName").val("");
	$("#expressName").val("");
	$("#distribution").val("");
	$("#tid").val("");
	$("#chooseTime").val(0);
	var startTime = flow.dateTime['startMonth'];
	var endTime = flow.dateTime['endMonth'];
	$("#startTime").val(startTime);
	$("#endTime").val(endTime);
	form.render('select');
})

/**
//扣点率设置
function discountSetupList(){
	discountSetupLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '费用设置',
		skin: 'layui-layer-rim', //加上边框
		area: ['850px', '600px'], //宽高
		shade: 0.3,
		content: $("#discountSetupList"),
		btn: ['确定', '取消'],
		yes: function(index, layero){
			layer.close(index);	
		}
	});
}
//扣点率设置列表
var discountSetup = {
	elem: '#discountSetup'
	,skin: 'row'
	,even: true
	,page: true 
	,limits: [20, 50, 100, 200]
	,limit: 50 
	,height: '400'
	,cols: [[ 
		{type:'numbers', width:100}
		,{field:'plat', width:210, title: '平台'}
		,{field:'shop', width:210, title: '店铺'}
		,{field:'fold', width:300, title: '扣点率(%)', edit: 'text'}
	]]
	,id: 'discountSetup'
	,data:[]
	,even: true
};

var discountSetupLoad = {
	tableObj:false,
	tableLoadTable:function(wave_no){
		var table = layui.table;
		discountSetup['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=financial&c=analysis&a=discountSetup',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				if(!discountSetupLoad.tableObj){
					for(var i=0;i<data.length;i++){
						discountSetup.data.push(data[i]);
					}
					discountSetupLoad.tableObj = table.render(discountSetup);
				}else{
					discountSetup.data = [];
					for(var i=0;i<data.length;i++){
						discountSetup.data.push(data[i]);
					}
					discountSetupLoad.tableObj.reload(discountSetup);
				}
			}
		})
	}
};
*/









































