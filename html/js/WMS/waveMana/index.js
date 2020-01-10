var flow = new Vue({
	el: '#flow',
	data: {
		tableDataOne:[],  	//波次管理列表
		chooseOne:[],	   	//选择列表
		tableDataTwo:[],   	//波次管理详细列表
		chooseTwo:[],	   	//选择波次管理详细列表
		partGenerate:0,    	//监听波次列表详情的复选框
		partGenerateNo:1,  	//库存不足订单不生成波次
		reservoirArea:0,   	//待入库区
		layprint:"",		//打印机列表
		expressSort:[],		//打印数据类型列表（快递）
		printTplDzmd:[],
		layprintTplBq:[],
		searchData:[],		//new_tid列表
		defaultMsg:[],		//修改提示
	},
	mounted: function() {
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
			layer.load(2);
			table.render({
				elem: '#dataList'
				,data: []
				,url: '/?m=WMS&c=waveMana&a=getWaveOrders'
				,where: {}
				,height: '463'
				,data : flow.tableDataOne
				,cols: [[
					{type:'checkbox'}
					,{type:'numbers', width:100, title: '序号', event: 'setSign'}
					,{field:'state', width:200, title: '拣货状态', event: 'setSign'}
					,{field:'wave_no', width:300, title: '波次号', event: 'setSign'}
					,{field:'pick_usr', width:200, title: '拣货人', event: 'setSign'}
					,{field:'wh_name', width:200, title: '仓库', event: 'setSign'}
					,{field:'express_name', width:100, title: '物流', event: 'setSign'}
					,{field:'order_num', width:100, title: '订单数量', event: 'setSign'}
					,{field:'items_num', width:100, title: '商品数量', event: 'setSign'}
					,{field:'create_time', width:300, title: '生成时间', event: 'setSign'}
				]]
				,id: 'dataList'
				,skin: 'row' //表格风格
				,even: true
				,page: true //是否显示分页
				,limits: [10, 50, 100, 200]
				,limit: 10 //每页默认显示的数量
				,done: function(res, curr, count){
					layer.closeAll('loading');
				}
			});
			var $ = layui.$, active = {
				reload: function(){
					//执行重载
					layer.load(2);
					table.reload('dataList', {
						page: {
							curr: 1 //重新从第 1 页开始
						}
						,where: {
							tid: $("#barcodeTop").val(),
							wh:$("#wh_list").val(),
							express_type: $("#wl_list").val(),
							wave_no: $("#special").val(),
						}
					});
				}
			};
			
			$("#searchBtn").click(function(){
				flow.chooseOne = [];
				flow.chooseTwo = [];
				active['reload'] ? active['reload'].call(this) : '';
				detailLoad.tableLoadTable();
			});
			
			$("#special").keydown(function(event){
				if(event.keyCode == 13){
					flow.chooseOne = [];
					flow.chooseTwo = [];
					active['reload'] ? active['reload'].call(this) : '';
				}
			})
			$("#barcodeTop").keydown(function(event){
				if(event.keyCode == 13){
					flow.chooseOne = [];
					flow.chooseTwo = [];
					active['reload'] ? active['reload'].call(this) : '';
				}
			})
			
			//初始化仓库、物流、账套选择
			$.ajax({
				url:'/?m=WMS&c=waveMana&a=getWhList',
				dataType: 'json',
				type: "post",
				data:{},
				success:function(data){
					if(data){
						var ohtml = "<option value=''></option>";
						for(var i=0;i<data.length;i++){
							ohtml += "<option value='"+data[i].wh+"'>"+data[i].NAME+"</option>";
						}
						$("#wh_list").html(ohtml);
						$("#wh").html(ohtml);
						form.render('select');
					}
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
					formSelects.render({name:'shopChoose'});
				}
			})
			$.ajax({
				url:'/?m=system&c=delivery&a=getExpress',
				dataType: 'json',
				type: "post",
				data:{},
				success:function(data){
					if(data){
						var ohtml = "<option value=''></option>";
						for(var i=0;i<data.length;i++){
							ohtml += "<option value='"+data[i].no+"'>"+data[i].name+"</option>";
						}
						$("#wl_list").html(ohtml);
						form.render('select');
					}
				}
			})
			$.ajax({
				url:'/?m=WMS&c=waveMana&a=waveListChoose',
				dataType: 'json',
				type: "post",
				data:{},
				success:function(data){
					if(data){
						var ohtml = "";
						for(var i=0;i<data.length;i++){
							ohtml += "<option value='"+data[i].id+"' title='"+data[i].item_num+"'>"+data[i].NAME+"</option>";
						}
						$("#waveChoose").html(ohtml);
						form.render('select');
						if(data[0].item_num == 'one')
						{
							
							$('#modelNumberOne').attr("disabled",true); 	
							$('#modelNumberTwo').attr("disabled",true); 	
							$('#numberOne').attr("disabled",true); 	
							$('#numberTwo').attr("disabled",true); 	
							$('#modelNumberOne').val(""); 	
							$('#modelNumberTwo').val(""); 	
							$('#numberOne').val(""); 		
							$('#numberTwo').val(""); 	
							
							
						}
						else
						{
							$('#modelNumberOne').attr("disabled",false); 	
							$('#modelNumberTwo').attr("disabled",false); 	
							$('#numberOne').attr("disabled",false); 	
							$('#numberTwo').attr("disabled",false); 	
							$('#modelNumberOne').val(""); 	
							$('#modelNumberTwo').val(""); 	
							$('#numberOne').val(""); 		
							$('#numberTwo').val("");	
						}
					}
				}
			})
			//订单部分有货可生成波次reservoirArea
			form.on('switch(partGenerate)', function(data){
				//console.log(this.checked);
				if(this.checked == true){
					flow.partGenerate = 1;
				}else{
					flow.partGenerate = 0;
				}
			});
			form.on('select(waveChoose)', function(data){
			    var item_num = data.elem[data.elem.selectedIndex].title;
				if(item_num == 'one')
				{
					$('#modelNumberOne').attr("disabled",true); 	
					$('#modelNumberTwo').attr("disabled",true); 	
					$('#numberOne').attr("disabled",true); 	
					$('#numberTwo').attr("disabled",true); 	
					$('#modelNumberOne').val(""); 	
					$('#modelNumberTwo').val(""); 	
					$('#numberOne').val(""); 		
					$('#numberTwo').val(""); 	
				}
				else
				{
					$('#modelNumberOne').attr("disabled",false); 	
					$('#modelNumberTwo').attr("disabled",false); 	
					$('#numberOne').attr("disabled",false); 	
					$('#numberTwo').attr("disabled",false); 	
					$('#modelNumberOne').val(""); 	
					$('#modelNumberTwo').val(""); 	
					$('#numberOne').val(""); 		
					$('#numberTwo').val("");	
				}
			});  
			//订单部分有货可生成波次reservoirArea
			form.on('switch(partGenerateNo)', function(data){
				//console.log(this.checked);
				if(this.checked == true){
					flow.partGenerateNo = 1;
				}else{
					flow.partGenerateNo = 0;
				}
			});
			//待入库区
			form.on('switch(reservoirArea)', function(data){
				//console.log(this.checked);
				if(this.checked == true){
					flow.reservoirArea = 1;
				}else{
					flow.reservoirArea = 0;
				}
			});
			
			table.on('tool(dataListEvent)', function(obj){
				var data = obj.data;
				if(obj.event === 'setSign'){
					//console.log(data.wave_no);
					//将参数传到订单详情获取数据
					detailLoad.tableLoadTable(data.wave_no);
				}
			});
			//监听波次列表的复选框
			table.on('checkbox(dataListEvent)', function(obj){
				flow.tableDataOne = table.cache.dataList;
				//console.log(obj.checked); //当前是否选中状态
				//console.log(obj.data); //选中行的相关数据
				//console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
				if(obj.type == "all" && obj.checked == true){
					flow.chooseOne = table.cache.dataList;
				}
				if(obj.type == "all" && obj.checked == false){
					flow.chooseOne = [];
				}
				if(obj.type == "one"){
					if(obj.checked == true){
						var arrs = flow.chooseOne;
						arrs.push(obj.data);
						flow.chooseOne = arrs;
					}else{
						var arrs = flow.chooseOne;
						var indexs = 0;
						for(var i=0;i<arrs.length;i++){
							if(arrs[i].id == obj.data.id){
								indexs = i;
							}
						}
						arrs.splice(indexs,1);
						flow.chooseOne = arrs;
					}
				}
			});
			//监听波次列表详情的复选框
			table.on('checkbox(detailListEvent)', function(obj){
				//console.log(obj.checked); //当前是否选中状态
				//console.log(obj.data); //选中行的相关数据
				//console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
				if(obj.type == "all" && obj.checked == true){
					flow.chooseTwo = flow.tableDataTwo;
				}
				if(obj.type == "all" && obj.checked == false){
					flow.chooseTwo = [];
				}
				if(obj.type == "one"){
					if(obj.checked == true){
						var arrs = flow.chooseTwo;
						arrs.push(obj.data);
						flow.chooseTwo = arrs;
					}else{
						var arrs = flow.chooseTwo;
						var indexs = 0;
						for(var i=0;i<arrs.length;i++){
							if(arrs[i].id == obj.data.id){
								indexs = i;
							}
						}
						arrs.splice(indexs,1);
						flow.chooseTwo = arrs;
					}
				}
			});
			
			laydate.render({
				elem: '#payTimeStart'
				,type: 'datetime'
			});
			laydate.render({
				elem: '#payTimeEnd'
				,type: 'datetime'
				,done: function(value, date, endDate){
					//console.log(value);
					//console.log(date);
					var clickTime = $("#layui-laydate2").find(".layui-laydate-footer").find(".laydate-btns-time").html();
					//console.log(clickTime);
					if(clickTime == '选择时间'){
						if(date.hours == 0 && date.minutes == 0 && date.seconds ==0){
							var newMonth = date.month;
							if(newMonth<10){
								newMonth = "0" + newMonth;
							}
							var newDate = date.date;
							if(newDate<10){
								newDate = "0" + newDate;
							}
							var newTime = date.year+"-"+newMonth+"-"+newDate;
							setTimeout(function(){
								$("#payTimeEnd").val(newTime+" 23:59:59");
							},20)
						}
					}
				}
			});
			
			//初始化详细表格
			table.render(detailTable);
		})
	},
	methods: {
		print_now:function(type,index,show,send,alls){ //all为是否打印全部
			var self = this;	
			self.defaultMsg = [];
			var data =  self.searchData;
			var isrepeat = "";
			if($("#layprint" + index).val() != 0){
				var unprintname = $("#layprint" + index).val();
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return
			}
			if($("#layprintTplBq" + index).val() != 0){
				var unprintTplBq = $("#layprintTplBq" + index).val();
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return
			}
			
			if($("#printInput" + index).is(':checked')){
				isrepeat = "no";
			}else{
				isrepeat = "yes";
			}
			
			var a = $(event.target);
			a.prop("disabled",true);
			
			/*setTimeout(function(){
				a.prop("disabled",false);
			},1000);*/
			
			var send_show = show;
			var isWave = send;
			if(show == "F" && send == "F"){//只打单不发货
				send_show = "show";
				isWave = 'T';
			}
			if(show != "show")
			{
				$("#tr-facePop").show();
			}
			var printSoft = $('#printSoft').val();
			self.progress_print_now(0,"获取打印信息中……");
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=printNow",
				type: 'post',
				data: {
					data:data,
					isAll:'0',
					type:type,
					isrepeat:isrepeat,
					show:send_show,
					send:send,
					exception:'no',
					isWave:isWave,
					printSoft:printSoft,
				},
				dataType: 'json',
				success: function (data) {
					a.prop("disabled",false);
					if(data.dataCheck && data.numCheck > 0){
						self.defaultMsg = data.dataCheck;
						layer.open({
							type: 1,
							title: '打印详情',
							skin: 'layui-layer-rim',
							area: ['800px', '400px'],
							shade: 0.3,
							content: jQuery("#default"),	
						});
					}
					if(data.dates && data.dates.length > 0){
						var newData = [];						
						var percent = 0;											
						var num = 0;
						if(show == "F"){
							doGetPrinters(function(){
								newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');
								//订单数据,商品数据，订单详情数据, 预览
								if(unprintname){
									if(send == "T" || send_show == "show"){
										printTpl[unprintTplBq](unprintname,newData,false,true,self.progress_print_now);
										var expressSort = self.expressSort;
										if(alls == 'T'){
											expressSort.splice(0,1);
										}else{
											expressSort.splice(index,1);
										}
										self.expressSort = expressSort;
										if(data.dates && data.dates.length > 0){
											if(show == "F" && send == "F"){
												if(expressSort.length == 0){
													layer.closeAll();
												}
											}
										}
									}else{
										printTpl[unprintTplBq](unprintname,newData,false,true,self.progress_print_now);
									}
								}
								
							});
							var $ = layui.$, active = {
								reload: function(){
									//执行重载
									var table = layui.table;	
									table.reload('dataList', {
										page: {
											curr: 1 //重新从第 1 页开始
										}
										,where: {
											tid: $("#barcodeTop").val(),
											wh:$("#wh_list").val(),
											express_type: $("#wl_list").val(),
											wave_no: $("#special").val(),
										}
									});
								}
							};
							flow.chooseOne = [];
							flow.chooseTwo = [];
							active['reload'] ? active['reload'].call(this) : '';
							detailLoad.tableLoadTable();
						}else if(show == "show"){
							doGetPrinters(function(){
								newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'T');
								//订单数据,商品数据，订单详情数据,预览
								if(unprintname){
									printTpl[unprintTplBq](unprintname,newData,true);
								}else{
									layer.msg('打印机不存在,无法预览', {time: 2000, icon:2});
								}
							});
						}
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					a.prop("disabled",false);
				}
			});																					
		},
		progress_print_now:function(progress, title)
		{
			setTimeout(function(){
				layui.use('element', function(){
					var element = layui.element();
					element.init();			//进度条
					element.progress('facePop', progress+'%');
					$("#facePopStatus").html(title);					
				});
			},1)

		},
		print_all:function(WMS_MODEL){
			var self = this;
			$("#print_all").prop("disabled",true);
			for(var i = 0; i < self.expressSort.length; i++){
				if(WMS_MODEL == "PT"){
					self.print_now(self.expressSort[i].type,i,'F','F','T');
				}else{
					self.print_now(self.expressSort[i].type,i,'F','T','T');	
				}
			}
			setTimeout(function(){
				$("#print_all").prop("disabled",false);
			},1000)
		},
	}
})

var detailTable = {
	elem: '#detailList'
	,skin: 'row'
	,page: true 
	,limits: [10, 20, 50, 100]
	,limit: 10 
	,where: {}
	,height: 270
	,cols: [[ 
		{type:'checkbox'}
		,{type:'numbers', width:100, title: '序号'}
		,{field:'refund_status', width:150, title: '退款状态', templet: function(d){
			return '<span style="color: #FF0000;">'+ d.refund_status +'</span>'
		}}
		,{field:'print_kd_num', width:150, title: '打印状态', templet: function(d){
			return '<span style="color: #FF0000;">'+ d.print_kd_num +'</span>'
		}}
		,{field:'wh_name', width:200, title: '仓库'}
		,{field:'express_name', width:150, title: '物流'}
		,{field:'new_tid', width:200, title: '订单号'}
		,{field:'express_no', width:200, title: '快递单号'}
		,{field:'buyer_nick', width:100, title: '买家昵称'}
		,{field:'receiver_name', width:100, title: '收货人'}
		,{field:'receiver_address', width:360, title: '详细地址'}
	]]
	,id: 'detailList'
	,data:[]
	,even: true
};

var detailLoad = {
	oldTree:false,
	tableObj:false,
	tableLoadTable:function(wave_no){
		var table = layui.table;
		detailTable['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=WMS&c=waveMana&a=getWaveList',
			dataType: 'json',
			type: "post",
			data:{wave_no:wave_no},
			success:function(data){
				flow.tableDataTwo = data;
				if(!detailLoad.tableObj){
					for(var i=0;i<data.length;i++){
						detailTable.data.push(data[i]);
					}
					detailLoad.tableObj = table.render(detailTable);
				}else{
					detailTable.data = [];
					for(var i=0;i<data.length;i++){
						detailTable.data.push(data[i]);
					}
					detailLoad.tableObj.reload(detailTable);
				}
			}
		})
	}
};

//生成波次
$("#addWave").click(function(){
	//初始化弹框
	flow.partGenerate=0;
	flow.partGenerateNo=1;
	flow.reservoirArea=0; 
	$('#addWaveList')[0].reset();
	layer.open({
		type: 1,
		title: '生成波次',
		skin: 'layui-layer-rim', //加上边框
		area: ['1000px', '600px'], //宽高
		shade: 0.3,
		content: $("#edit-pages"),
		btn: ['确定', '清空'],
		yes: function(index, layero){
			var indexLoad = layer.load();
			
			var wave_id = $("#waveChoose").val();		
			var check_wait_storage = flow.reservoirArea;
			var check_stock = flow.partGenerateNo;
			var check_stock_split = flow.partGenerate;
			var paymentTimeBegin = $("#payTimeStart").val();
			var paymentTimeEnd = $("#payTimeEnd").val();
			var wh = $("#wh").val();		
			var send_status	= $("#state").val();
			var sign_status	= $("#sign_status").val();
			var goodsSkuNumBegin = $("#modelNumberOne").val();
			var goodsSkuNumEnd = $("#modelNumberTwo").val();
			var goodsItemsNumBegin = $("#numberOne").val();	
			var goodsItemsNumEnd = $("#numberTwo").val();
			var select_type = $("#select_type").val();
			var prd_no = $("#prd_no").val();	
			$.ajax({				
				url: '/?m=WMS&c=waveMana&a=createWaveOrder', 
				type: 'post',				
				data: {
					wave_id:wave_id,
					check_wait_storage:check_wait_storage,
					check_stock:check_stock,
					check_stock_split:check_stock_split,
					paymentTimeBegin:paymentTimeBegin,
					paymentTimeEnd:paymentTimeEnd,
					wh:wh,
					send_status:send_status,
					sign_status:sign_status,
					goodsSkuNumBegin:goodsSkuNumBegin,
					goodsSkuNumEnd:goodsSkuNumEnd,
					goodsItemsNumBegin:goodsItemsNumBegin,
					goodsItemsNumEnd:goodsItemsNumEnd,
					prd_no:prd_no,
					shopid:formSelects.value('select1', 'valStr'),
					select_type:select_type
				},					
				dataType: 'json',	
				success: function (data) {
					if(data.code == "ok"){
						layui.table.reload("dataList");
						detailLoad.tableLoadTable();
						layer.close(index);
						flow.chooseOne = [];
						flow.chooseTwo = [];
					}
					layer.msg(data.msg);
					layer.close(indexLoad);
				}									
			});
		},
		btn2 :function(){
			$("#addWaveList")[0].reset();
			flow.partGenerate=0;
			flow.partGenerateNo=1;
			flow.reservoirArea=0;
			return false;
		}
	});
})

//波次作废
$("#delWave").click(function(){
	layer.confirm('确认作废？', {
		btn: ['确认','取消']
	}, function(index, layero){
		var datas = flow.chooseOne;
		if(datas.length == 0){
			layer.msg("请选择具体波次");
			return false;
		}
		$.ajax({				
			url: '/?m=WMS&c=waveMana&a=delWaveListOrder',
			type: 'post',				
			data: {
				datas:datas,
			},					
			dataType: 'json',	
			success: function (data) {
				if(data.code == "ok"){
					layui.table.reload("dataList");
					detailLoad.tableLoadTable();
					layer.close(index);	
					flow.chooseOne = [];
					flow.chooseTwo = [];
				}
				layer.msg(data.msg);
			}									
		});
	}, function(){});
})


//订单详情删除
$("#delBtn").click(function(){
	layer.confirm('确认删除？', {
		btn: ['确认','取消']
	}, function(index, layero){
		var datas = flow.chooseTwo;
		if(datas.length == 0){
			layer.msg("请选择具体订单");
			return false;
		}
		$.ajax({				
			url: '/?m=WMS&c=waveMana&a=delWaveOrder',
			type: 'post',				
			data: {
				datas:datas,
			},					
			dataType: 'json',	
			success: function (data) {
				if(data.code == "ok"){
					detailLoad.tableLoadTable();
					layer.close(index);	
					flow.chooseTwo = [];
				}
				layer.msg(data.msg);
			}									
		});
	}, function(){});
})

//打单汇总选择
$("#summary").hover(function(){
	$("#sumList").stop().animate({"top":"45px","opacity":"1"},300);
},function(){
	$("#sumList").stop().animate({"top":"60px","opacity":"0"},300);
})
$("#chooseLogo").hover(function(){
	$("#logoList").stop().animate({"opacity":"1"},300);
},function(){
	$("#logoList").stop().animate({"opacity":"0"},300);
})
//打单明细选择
$("#summarys").hover(function(){
	$("#sumLists").stop().animate({"top":"45px","opacity":"1"},300);
},function(){
	$("#sumLists").stop().animate({"top":"60px","opacity":"0"},300);
})
$("#chooseLogos").hover(function(){
	$("#logoLists").stop().animate({"opacity":"1"},300);
},function(){
	$("#logoLists").stop().animate({"opacity":"0"},300);
})

//跳转波次设置
function goToSetWave(){
	window.parent.addTab('bcclsz','?m=WMS&c=waveTime&a=index','波次策略设置');
}

//打单并发货
$("#singleOrDelivery").click(function(){
	var datas = flow.chooseOne;
	if(datas.length == 0){
		layer.msg("请选择具体波次");
		return false;
	}
	$.ajax({				
		url: '/?m=WMS&c=waveMana&a=singleOrDelivery',
		type: 'post',				
		data: {
			datas:datas,
		},					
		dataType: 'json',	
		success: function (data) {
			if(data['code'] == 'ok'){
				flow.searchData = data['tids'];
				printFace(data['tids'], 'send');
			}else{
				layer.msg(data['msg'],{
					icon: 2,
					time: 2000
				});
			}
		}									
	});
})

//打单
$("#singlePrintNow").click(function(){
	var datas = flow.chooseOne;
	if(datas.length == 0){
		layer.msg("请选择具体波次");
		return false;
	}
	$.ajax({				
		url: '/?m=WMS&c=waveMana&a=singleOrDelivery',
		type: 'post',				
		data: {
			datas:datas,
		},					
		dataType: 'json',	
		success: function (data) {
			if(data['code'] == 'ok'){
				flow.searchData = data['tids'];
				printFace(data['tids'], '');
			}else{
				layer.msg(data['msg'],{
					icon: 2,
					time: 2000
				});
			}
		}									
	});
})

function printFace(data, send){
	$.ajax({
		url: "/index.php?m=system&c=delivery&a=printFace",
		type: 'post',
		data: {
			data: data, 
			isAll: '0',
		},
		dataType: 'json',
		success: function (data) {
			if(data){
				flow.expressSort = data;
				flow.printTplDzmd = printTplDzmd;
				doGetPrinters(function(data){
					flow.layprint =  data;
				});
				$("#layprint1").val(0);											
				$("#layprintTplBq1").val(0);			//-----初始化选择框
				flow.layprintTplBq = printTplBq;
				
				$(document).ready(function(){
					$('#prin input').iCheck({
						checkboxClass: 'icheckbox_minimal',
						radioClass: 'iradio_minimal',
						increaseArea: '20%'
					});
				});
				
				$.ajax({
					url: "/index.php?m=system&c=delivery&a=getMianDan",
					type: 'post',
					data: {},
					dataType: 'json',	
					success: function (data) {
						if(data.printer != ""){
							$("#printer select").val(data.printer);
						}else{
							$("#printer select").val(0);
							printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
						}
					}
				});
				
				if(send == "T"){
					var title = "打面单并发货";
				}else{
					var title = "打面单";
				}
				$("#tr-facePop").hide();
				flow.progress_print_now(0,"获取打印信息中……");
				layer.open({
					type: 1,
					title: title,
					skin: 'layui-layer-rim',
					area: ['1200px', '400px'],
					shade: 0.3,
					content: $("#facePop"),
					cancel: function(index, layero){
						$("input[name='order']").iCheck('uncheck');	
						$(".inputTe").css("color","white");
					}	
				});
			}
		}
	});
}

function cbPrintView(data){
    var double_row = $("input[name='double_row']").parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
    var width = $("input[name='width']").val() * 8;
    var height = $("input[name='height']").val() * 8;
    if(double_row){
        width = width * 2;
    }
    layer.open({
        type: 1
        ,title: false //不显示标题栏
        ,closeBtn: false
        ,area: ['400px','650px']
        ,shade: 0.8
		,shadeClose:true
        ,id: 'previewImage' //设定一个id，防止重复弹出
        ,btn: ['关闭']
        ,moveType: 1 //拖拽模式，0或者1
        ,content: '<div style="width:'+width+'px;height:'+height+'px;"><img style="width:350px;height:580px;" src="'+data['previewImage'][0]+'" /></div>'
    });
}