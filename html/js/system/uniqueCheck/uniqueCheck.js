var unique = new Vue({
	el: '#container',
	data: {
		checkOnOff:0,
		checkPrdtOnOff:0,
		uniqueCode:"",
		getPrintTpl:[],
		separator :[],
		pagenow: 1,
		printer:[],
		sortField:'',
		sortType:'desc',
		nowNum:100,
		nowTotal:0,
		nowPrice:0,
	},
	mounted: function() {
		layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
			var laydate = layui.laydate //日期
				,laypage = layui.laypage //分页
				layer = layui.layer //弹层
				,upload = layui.upload //上传
				,form = layui.form //表单
				,element = layui.element; //元素操作
			var table = layui.table;
			
			laydate.render({
				elem: '#last_time'
				,type: 'datetime'
				,value: getNowFormatDate()
				,done: function(value, date){
					//查询当前页有多少条
					var nowNum = $(".layui-laypage-limits").find('select').val();
					unique.nowNum = nowNum;
					
					vueLoad.tableLoadTable(value);
				}
			});
			
			laydate.render({
				elem: '#end_time'
				,type: 'datetime'
				
				,done: function(value, date){
					vueLoad.tableLoadTable('', value);
				}
			});
			//监听指定开关
			form.on('switch(switchOnOff)', function(data){
				if(this.checked){
					unique.checkOnOff = 1;
				}else{
					unique.checkOnOff = 0;
				}
			});
			
			form.on('switch(checkPrdtOnOff)', function(data){
				if(this.checked){
					unique.checkPrdtOnOff = 1;
				}else{
					unique.checkPrdtOnOff = 0;
				}
			});
			
			//修改单价
			table.on('edit(dataListEvent)', function(obj){
				//查询当前页有多少条
				var nowNum = $(".layui-laypage-limits").find('select').val();
				unique.nowNum = nowNum;
				
				var value = obj.value    //得到修改后的值
				,data = obj.data         //得到所在行所有键值
				,field = obj.field;      //得到字段
				var prd_no = data.prd_no;
				var lastTime = $("#last_time").val();
				var endTime = $("#end_time").val();
				$.ajax({
					url:'/?m=system&c=uniqueCheck&a=getChangeIndex',
					dataType: 'json',
					type: "post",
					data:{
						prd_no:prd_no,
						value:value,
						lastTime:lastTime,
						endTime:endTime
					},
					success:function(data){
						if(data.code == "ok"){
							layer.msg('修改成功');
							vueLoad.tableLoadTable();
						}else{
							layer.msg('修改失败');
						}
					}
				})
			});
			
			table.on('sort(dataListEvent)', function(obj){
				unique.sortField = obj.field;
				unique.sortType = obj.type;
				vueLoad.tableLoadTable();
			});

			//获取模板
			$.ajax({
				url:'/?m=system&c=uniqueCheck&a=getPrintTpl',
				dataType: 'json',
				type: "post",
				data:{},
				success:function(data){
					var oHtml = "";
					if(data.code == "ok"){
						for(var i=0;i<data.data.length;i++){
							oHtml += "<option value='"+data.data[i].id+"'>"+data.data[i].tpl_name+"</option>";
						}
						//console.log(oHtml);
						$("#report_DSOS").html(oHtml);
						form.render('select'); 
					}
				}
			});
			
			//获取质检签模板
			$.ajax({
				url:'/?m=system&c=printShip&a=getTemplateCheck',
				dataType: 'json',
				type: "post",
				data:{},
				success:function(data){
					var oHtml = "";
					for(var i=0;i<data.length;i++){
						oHtml += "<option value='"+data[i].id+"'>"+data[i].tpl_name+"</option>";
					}
					//console.log(oHtml);
					$("#report_PRDT").html(oHtml);
					form.render('select'); 
				}
			});
			
			
			$.ajax({																			
				url: "/index.php?m=system&c=labelPrinting&a=getLabelNow",							
				type: 'post',																		
				data: {},																			
				dataType: 'json',																
				success: function (data) {
					if(data['result'].printer != ""){
						$("#layprint").val(data['result'].printer);
					}else if(data['result'].printer == ""){
						printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
					}
				}																						
			});
			$.ajax({																			
				url: "/index.php?m=system&c=uniqueCheck&a=getseparator",							
				type: 'post',																		
				data: {},																			
				dataType: 'json',																
				success: function (data) {
					unique.separator = data;
				}																						
			});
			form.on('select(numType)', function(data){
				//查询当前页有多少条
				var nowNum = $(".layui-laypage-limits").find('select').val();
				unique.nowNum = nowNum;
				vueLoad.tableLoadTable();
			});
			//操作员切换
			form.on('select(userName)', function(data){
				var nowNum = $(".layui-laypage-limits").find('select').val();
				unique.nowNum = nowNum;
				vueLoad.tableLoadTable();
			});
			
			form.on('select(customerDF)', function(data){
				//查询当前页有多少条
				var nowNum = $(".layui-laypage-limits").find('select').val();
				unique.nowNum = nowNum;
				vueLoad.tableLoadTable();
			});
			
			//代发客户选择
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getShippingClient",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					if(data){
						var oHtml = '<option value=""></option>';
						for(var i=0;i<data.length;i++){
							oHtml += '<option value="'+data[i]['no']+'">'+data[i]['name']+'</option>';
						}
						$("#customerDF").html(oHtml);
						form.render('select');
					}
				}
			});
			
			//代拿客户选择
			$.ajax({
				url: "/index.php?m=system&c=TakeCustomer&a=getData",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					if(data){
						var oHtml = '<option value=""></option>';
						oHtml += '<option value="1">非代拿订单</option>';
						oHtml += '<option value="2">代拿订单</option>';
						for(var i=0;i<data.length;i++){
							oHtml += '<option value="'+data[i]['system_id']+'">'+data[i]['system_name']+'</option>';
						}
						$("#customerDN").html(oHtml);
						form.render('select');
					}
				}
			});
			
			//监听排序事件 
			table.on('sort(test)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
				//查询当前页有多少条
				var nowNum = $(".layui-laypage-limits").find('select').val();
				unique.nowNum = nowNum;
			
				console.log(obj.field); //当前排序的字段名
				console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
				console.log(this); //当前排序的 th 对象
			  
			});
			
			//代拿客户选择
			form.on('select(customerDN)', function(data){
				//查询当前页有多少条
				var nowNum = $(".layui-laypage-limits").find('select').val();
				unique.nowNum = nowNum;
				vueLoad.tableLoadTable();
			});
			
			doGetPrinters(function(data){
				unique.printer = data;
			});
		})
	}
})

//到货点货
function uniqueCheck(){
	//查询当前页有多少条
	var nowNum = $(".layui-laypage-limits").find('select').val();
	unique.nowNum = nowNum;
	var UniqueCode = $('#UniqueCode').val();
	var subpackage = $("#subpackage").val();
	var unprintTplBq = $("#report_DSOS").val();
	var unprintname = $("#layprint").val();
	var unprintTplPrdt = $("#report_PRDT").val();
	var unprintzjname = $("#layprintZJ").val();
	var lastTime = $("#last_time").val();
	var endTime = $("#end_time").val();
	if(unique.checkOnOff == 1 && unprintTplBq == ""){
		layer.msg('请选择标签打印模板',{
			icon: 0,
			time: 2000
		});	
		return false;
	}else if(unique.checkOnOff == 1 && (unprintname == "" || !unprintname)){
		layer.msg('请先设置默认打印机1',{
			icon: 0,
			time: 2000
		});
		return false;
	}
	if(unique.checkPrdtOnOff == 1 && unprintTplPrdt == ""){
		layer.msg('请选择质检签打印模板',{
			icon: 0,
			time: 2000
		});	
		return false;
	}else if(unique.checkPrdtOnOff == 1 && (unprintzjname == "" || !unprintzjname)){
		layer.msg('请先设置质检签默认打印机',{
			icon: 0,
			time: 2000
		});
		return false;
	}
	//获取打印机
	if(unique.checkOnOff == 1){
		var onOff = 1;
		var printer = unique.printer;
		for(var i=0;i<printer.length;i++){
			if(printer[i]['name'] == unprintname){
				onOff = 0;
			}
		}
		if(onOff == 1){
			layer.msg('请先设置标签打印机',{
				icon: 0,
				time: 2000
			});
			$('#UniqueCode').val("");
			return false;
		}
	}
	if(unique.checkPrdtOnOff == 1){
		var onOff = 1;
		var printer = unique.printer;
		for(var i=0;i<printer.length;i++){
			if(printer[i]['name'] == unprintzjname){
				onOff = 0;
			}
		}
		if(onOff == 1){
			layer.msg('请先设置质检签打印机',{
				icon: 0,
				time: 2000
			});
			$('#UniqueCode').val("");
			return false;
		}
	}
	
	$('#UniqueCode').val("");
	$(".productInfor li").html("");
	$("#arrival_cost").val("");
	$("#pic_url").attr("src", "");
	if($.trim(UniqueCode) == ""){
		return false;
	}
	
	$.ajax({
		type: 'POST',
		url: "?m=system&c=uniqueCheck&a=getUnique_code",
		data: {
			unique_code: UniqueCode, 
			subpackage: subpackage,
			checkOnOff: unique.checkOnOff,
		},
		success: function (msg) {
			var msg = JSON.parse(msg);
			if (msg.code == 'ok') {
				unique.uniqueCode = msg.data['unique_code'];
				if(msg.isRefund == 'T'){
					layer.msg(msg.msg + "此标签商品已退款");
					speckText(msg.msg + "此标签商品已退款");
				}else{
					layer.msg(msg.msg);
					if(msg['data']['more_code'] != ""){
						var more_code = msg['data']['more_code'];
						var speak = more_code.replace("-","杠");
						speckText("已点货"+speak);
					}else{
						speckText('通过');
					}
				}
				
				$("#costGoods").css("display","block");
				$("#costList").css("display","block");
				
				$(".productInfor li").eq(0).html("商品编号："+msg.data['prd_no']);
				if(msg.data['sku_name']){
					$(".productInfor li").eq(1).html("销售属性："+msg.data['sku_name']);
				}else{
					$(".productInfor li").eq(1).html("销售属性：");
				}
				$(".productInfor li").eq(2).html("订单号："+msg.data['tid']);
				if(msg.data['price']){
					$("#arrival_cost").val(msg.data['price']);
				}else{
					$("#arrival_cost").val(0);
				}
				$("#pic_url").attr("src", msg.data['pic_url']);
				
				if(unique.checkOnOff == 1){
					printTpl[unprintTplBq](unprintname,msg.printLabel[0]);
				}
				if(unique.checkPrdtOnOff == 1){
					$.ajax({								
						url: "/index.php?m=system&c=printShip&a=getPrintDataCQ",
						type: 'post',							
						data: {unique_code: UniqueCode},
						async:false,
						dataType: 'json',				
						success: function (data) {
							printTpl[unprintTplPrdt](unprintzjname,data);	
						}
					});
				}
			} else {
				layer.msg(msg.msg);
				speckText(msg.msg);
			}
			vueLoad.tableLoadTable( lastTime);
		}
	});
}

//js获取yyyy-mm-dd hh:ii:ss格式时间
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
			+ " " + date.getHours() + seperator2 + date.getMinutes()
			+ seperator2 + date.getSeconds();
	return currentdate;
}

//导出
$("#outputExcel").click(function(){
	var lastTime = $("#last_time").val();
	var endTime = $("#end_time").val();
	var num_iid_type = $("#num_iid_type").val();
	var operator = $("#operator").val();
	var customerDN = $("#customerDN").val();
	var customerDF = "";
	if($("#customerDF").val() || $("#customerDF").val()!=undefined){
		customerDF = $("#customerDF").val();
		var url = "?m=system&c=uniqueCheck&a=outputExcel&lastTime="+lastTime+"&endTime="+endTime+"&num_iid_type="+num_iid_type+"&system_id="+customerDF+"&customerDN="+customerDN+"&operator="+operator;
	}else{
		var url = "?m=system&c=uniqueCheck&a=outputExcel&lastTime="+lastTime+"&endTime="+endTime+"&num_iid_type="+num_iid_type+"&customerDN="+customerDN+"&operator="+operator;
	}
	$("#ifile").attr('src',url);
})

var tableLoad = {
	elem: '#uniqueTable'
	,skin: 'row'
	,page: true 
	,limits: [10, 50, 100, 200, 500]
	,limit: unique.nowNum 
	,height: 'full-50'
	,autoSort: false
	,cols: [[ 
		{type:'numbers', width:80, title: '序号'}
		,{field:'cus_no', width:140, title: '供应商'}
		,{field:'prd_no', width:140, title: '商品编码'}
		,{field:'money', width:100, title: '单价', edit: 'text', sort: true}
		,{field:'num', width:80, title: '件数'}
		,{field:'count', width:100, title: '金额'}
		,{field:'subpackage', width:100, title: '分包码'}
	]]
	,id: 'uniqueTable'
	,data:[]
	,even: true
	,done: function(res, curr, count){
		//如果是异步请求数据方式，res即为你接口返回的信息。
		//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
		console.log(res);
		//得到当前页码
		console.log(curr); 
		//得到数据总量
		console.log(count);
		unique.pagenow = curr;
	}
};

var vueLoad = {
	oldTree:false,
	tableObj:false,
	tableLoadTable:function( timer, endTimer ){
		var lastTime = "";
		if(timer){
			lastTime = timer;
		}else{
			var lastTime = $("#last_time").val();
		}
		var endTime = '';
		if(endTimer){
			endTime = endTimer;
		}else{
			endTime = $("#end_time").val();
		}
		var num_iid_type = $("#num_iid_type").val();
		//var operator = $('#operator input[name="operator"]:checked ').val();
		var operator = $("#operator").val();;
		var customerDN = $("#customerDN").val();
		var table = layui.table;
		var customerDF = "";
		if($("#customerDF").val() || $("#customerDF").val()!=undefined){
			customerDF = $("#customerDF").val();
		}
		tableLoad['page'] = {
			curr: unique.pagenow,
			limit: unique.nowNum,
		};
		$.ajax({
			url:'/?m=system&c=uniqueCheck&a=getTodayGoodsTable',
			dataType: 'json',
			type: "post",
			data:{
				lastTime:lastTime,
				num_iid_type:num_iid_type,
				system_id:customerDF,
				endTime:endTime,
				sortField:unique.sortField,
				sortType: unique.sortType,
				operator: operator,
				customerDN: customerDN,
			},
			success:function(data){
				//console.log(data);
				if(data.code == 'ok'){
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
					unique.nowTotal = data.total;
					unique.nowPrice = data.price;
				}else{
					tableLoad.data = [];
					table.render(tableLoad);
					unique.nowTotal = 0;
					unique.nowPrice = 0;
				}
			}
		})
	}
};

//修改价格
function submitCost(){
	//查询当前页有多少条
	var nowNum = $(".layui-laypage-limits").find('select').val();
	unique.nowNum = nowNum;
	
	var arrival_cost = $("#arrival_cost").val();
	var uniqueCode = unique.uniqueCode;
	$.ajax({
		url:'/?m=system&c=uniqueCheck&a=inserTprdtUp',
		dataType: 'json',
		type: "post",
		data:{
			arrival_cost:arrival_cost,
			uniqueCode:uniqueCode,
		},
		success:function(data){
			if(data.code == "ok"){
				layer.msg('修改成功');
				$("#UniqueCode").focus();
				vueLoad.tableLoadTable();
			}else{
				layer.msg('修改失败');
			}
		}
	})
}
function setStock( uniqueCode ){
	$.ajax({
		url:'/?m=system&c=uniqueCheck&a=setInStock',
		dataType: 'json',
		type: "post",
		data:{
			uniqueCode:uniqueCode,
		},
		success:function(data){}
	})
}
