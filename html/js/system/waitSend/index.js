var table;
var layer;
var zTreeObj;
var flow = new Vue({
	el: '#flow',
	data: {
		shopArr:[],
		expressArr:[],
		searchData:{},
		splitItemArr:[],
		defaultMsg:[],
		logArr:[],
		printType:"",
		layprintTplBq:[],
		layprintTplDSOS:[],
		layprintTplYd:[],
		isFirst:true,
		layprint:[],
		preDeliveryMsg:[],
		expressSort:[],
		printTplDzmd:{},
	},
	mounted: function() {
		var self = this;
		
		$(document).ready(function(){
			$(".left").hide();
			$("#rightView").css('padding-left','0px');
				
			$.ajax({																																													//===========
				url: "/index.php?m=system&c=delivery&a=getShop",																																		//===========
				type: 'post',																																											//===========
				data: {},																																												//===========
				dataType: 'json',																																										//===========
				success: function (data) {																																								//===========
					self.shopArr = data;																																								//===========
				}																																														//===========
			});
			
			$.ajax({																																													//===========
				url: "/index.php?m=system&c=delivery&a=getExpress",																																		//===========
				type: 'post',																																											//===========
				data: {},																																												//===========
				dataType: 'json',																																										//===========
				success: function (data) {																																								//===========
					self.expressArr = data;																																								//===========
				}																																														//===========
			});

			$.ajax({																																													
				url: "/index.php?m=system&c=delivery&a=consignor",																																		
				type: 'post',																																											
				data: {},																																												
				dataType: 'json',																																										
				success: function (data) {		
					if(data.code == "error"){
						layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {
							var $ = layui.jquery, element = layui.element, layer = layui.layer ;
							layer.open({																																											
								title: '提示',																																										
								content: '您还未设置发货人信息',																																						
								btn: ['去设置', '取消'],																																								
								yes:function(index){																																										
									parent.parent.addTab("物流公司设置","index.php?m=system&c=setup&a=wuliuSetup","物流公司设置");
									layer.close(index);
								}																																													
							});
						});
					}																																								
				}																																														
			});			
			
			var setting = {
				view: {
					showIcon: false,
					showLine: false,
					nameIsHTML: true
				},
				check: {
					enable: true
				},
				data: {
					simpleData: {
						enable: true
					}
				}
			};
			
			$('.skin-minimal input').iCheck({
				checkboxClass: 'icheckbox_minimal',
				radioClass: 'iradio_minimal',
				increaseArea: '20%'
			});
			
			$.ajax({																																													//===========
				url: "/index.php?m=system&c=waitSend&a=getTreeInfo",																																		//===========
				type: 'post',																																											//===========
				data: {},																																												//===========
				dataType: 'json',																																										//===========
				success: function (data) {																																								//===========
					zTreeObj = $.fn.zTree.init($("#statusTree"), setting, data);
				}																																														//===========
			});
			
			layui.use(['table','element','layer','form','laydate'], function(){
				table = layui.table;
				layer = layui.layer;
				var element=layui.element,form = layui.form;
				var laydate = layui.laydate;

				var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=system&c=waitSend&a=getOrderTrade'
					,cols: [[
						{field:'LAY_TABLE_INDEX', width:30, title: '' , templet: '#indexTpl', align: 'center', unresize: true}
						,{checkbox: true}
						,{field:'right', title: '',"width":60 ,toolbar: '#barTpl', align: 'center', unresize: true}
						,{field:'new_tid', title: '订单号/付款时间',"width":180,  templet: '#new_tidTpl', align: 'center', sort: true}
						,{field:'goods_imgs', title: '商品(点击修改)',"width":120, align: 'left',  templet: '#goods_imgsTpl'}
						,{field:'shopid', title: '卖家/买家昵称',"width":120, templet: '#shopidTpl', align: 'center'}
						,{field:'express_name', title: '发货快递',"width":90, align: 'center'}
						,{field:'payment', title: '实付/运费',"width":90, templet: '#paymentTpl', align: 'right'}
						,{field:'status', title: '线下/线上状态',"width":120, templet: '#statusTpl', align: 'center'}
						,{field:'buyer_message', title: '买家留言',"width":150, align: 'left'}
						,{field:'seller_memo', title: '卖家备注',"width":150 , align: 'left'}
						,{field:'remark', title: '线下备注',"width":100, align: 'left'}
						,{field:'seller_flag', title: '备注旗帜',"width":90, align: 'center', templet: '#flagTpl'}
						,{field:'address', title: '收货地址',"width": 220, templet: '#addressTpl', align: 'left'}
					]]
					,id: 'datagrid'
					,page: true
					,height: 'full-145'
					,limit: 50
				});
				 
				var $ = layui.$, active = {
					reload: function(){
						var searchdata = self.searchData;
						searchdata.orderSelect = "all";
						searchdata.shopId = $("#shopid").val();
						searchdata.show_tid = $("#show_tid").val();
						searchdata.express = $("#express").val();
						searchdata.buyer_nick = $("#buyer_nick").val();
						searchdata.orderStatus = $("#send_status").val();
						searchdata.webStatus = $("#web_status").val();
						searchdata.banner = $("#seller_flag").val();
						
						self.searchData = searchdata;

						tab.reload({
							where: {
								data: searchdata
							}
						});
					},
				};
				
				self.tab = active;
				
				$('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					
					active[type] ? active[type].call(this) : '';
				});
				
				table.on('tool(user)', function(obj){
					var data = obj.data;
					var tid = data.new_tid;
					
					if(obj.event === 'detail'){
						layer.open({																																											
							type: 1,																																											
							title: '订单详细信息',																																								
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['850px', '600px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#edit-pages1"),																																							
							cancel: function (index, layero) {																																					
																																																				
							}																																													
						});
						
						$("#pages1-express").attr('disabled',false);
						
						$.ajax({																																														
							url: "/index.php?m=system&c=delivery&a=getOrderInfo",																																		
							type: 'post',																																												
							data: {tid: tid},																																													
							dataType: 'json',																																											
							success: function (data) {
								
								$("#pages1-tid").val(tid);
								$("#pages1-modified").val(data.modified_time);
								$("#pages1-express").val(data.express_type);
								$("#pages1-receiver_state").val(data.receiver_state);
								$("#pages1-receiver_state").trigger("change");
								$("#pages1-receiver_city").val(data.receiver_city);
								$("#pages1-receiver_city").trigger("change");
								$("#pages1-receiver_district").val(data.receiver_district);
								if($("#pages1-receiver_district").val() == null){
									$("#pages1-receiver_district").append('<option value="' + data.receiver_district + '" name="' + data.receiver_district + '" data-code="999999">' + data.receiver_district + '</option>');
									$("#pages1-receiver_district").val(data.receiver_district);
								}
								
								$("#pages1-receiver_address").val(data.receiver_address);
								$("#pages1-receiver_name").val(data.receiver_name);
								$("#pages1-mobile").val(data.receiver_mobile);
								$("#pages1-telephone").val(data.receiver_telephone);
								$("#pages1-seller_memo").val(data.seller_memo);
								$("#pages1-remark").val(data.remark);
							}																																															
						});
						
						$.ajax({																																														
							url: "/index.php?m=system&c=delivery&a=getLog",																																		
							type: 'post',																																												
							data: {tid: tid},																																													
							dataType: 'json',																																											
							success: function (data) {
								self.logArr = data;
							}																																															
						});
					}
				});
				
				table.on('sort(user)', function(obj){
					var sortdata = self.searchData;
					
					if(obj.field == "new_tid" && obj.type == "asc"){
						sortdata.order = "PaymentUp";
					}else if(obj.field == "new_tid" && obj.type == "desc"){
						sortdata.order = "PaymentDown";
					}
					
					self.searchData = sortdata;
					
					tab.reload({
						where: {
							data: sortdata
						}
					});
				});
			});
		});

	},
	methods: {
		reset:function(){
			var self = this;
			
			$("#shopid").val("");
			$("#show_tid").val("");
			$("#express").val("");
			$("#buyer_nick").val("");
			$("#send_status").val("");
			$("#web_status").val("");
			$("#seller_flag").val("");
			
			var searchdata = self.searchData;
			searchdata.orderSelect = "all";
			searchdata.shopId = $("#shopid").val();
			searchdata.show_tid = $("#show_tid").val();
			searchdata.express = $("#express").val();
			searchdata.buyer_nick = $("#buyer_nick").val();
			searchdata.orderStatus = $("#send_status").val();
			searchdata.webStatus = $("#web_status").val();
			searchdata.banner = $("#seller_flag").val();
			
			self.searchData = searchdata;
		},
		showSearch:function(){
			if($(".left").is(":hidden")){
				$(".left").show();
				$("#rightView").css('padding-left','175px');
			}else{
				$(".left").hide();
				$("#rightView").css('padding-left','0px');
			}
		},
		orderSplit:function(){
			var self = this;
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}else if(checkdata.length > 1){
				layer.msg('一次只能选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;	
			}

			var tid = checkdata[0].new_tid;
			
			$.ajax({
				url: "/index.php?m=system&c=waitSend&a=splitCheck",																																		
				type: 'post',																																												
				data: {tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == 'ok'){
						self.splitItemArr = data.dataItem;
						orderSplitWindow(tid,self);
					}else if(data.code == 'error'){
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});																																											
						return false;
					}
				}																																															
			});
		},
		key_up:function(value,index){
			var self = this;
			var a = $(event.target);
			var e = event || window.event;
			var splitNum = parseInt(a.val());
			if(isNaN(splitNum)){
				splitNum = 0;
			}
			if(a.val() > value){
				layer.msg('输入数量不能大于订单数量',{
					icon: 0,
					time: 2000
				});
				splitNum = value;
			}
			
			var numLeft = value - splitNum;
			self.splitItemArr[index].num_split = splitNum;
			self.splitItemArr[index].num_left = numLeft;
		},
		autoFocus:function(){
			var a = $(event.target);
			a.focus().select();
		},
		orderSplitCancel:function(){
			var self = this;
			
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}else if(checkdata.length > 1){
				layer.msg('一次只能选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;	
			}

			var tid = checkdata[0].new_tid;
			
			$.ajax({																																														
				url: "/index.php?m=system&c=waitSend&a=orderSplitCancel",																																		
				type: 'post',																																												
				data: {tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == 'ok'){
						layer.msg("撤销拆分成功",{
							icon: 1,
							time: 2000
						});
						self.tab.reload();
					}else if(data.code == 'error'){
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});																																											
					}
				}																																															
			});
		},
		orderMergeSplit:function(){
			var self = this;
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}else if(checkdata.length > 1){
				layer.msg('一次只能选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;	
			}

			var tid = checkdata[0].new_tid;
			
			$.ajax({																																														
				url: "/index.php?m=system&c=waitSend&a=orderMergeSplit",																																		
				type: 'post',																																												
				data: {tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == 'ok'){
						layer.msg("撤销合并成功",{
							icon: 1,
							time: 2000
						});
						self.tab.reload();
					}else if(data.code == 'error'){
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});																																											
						return false;
					}
				}																																															
			});
		},
		changeExpress:function(){
			var self = this;																																										//===========
			$('#batchExpress').val(0);
			
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			//===========
			layer.open({																																											//===========
				type: 1,																																											//===========
				title: '改快递',																																									//===========
				skin: 'layui-layer-rim', //加上边框																																					//===========
				area: ['700px', '300px'], //宽高																																					//===========
				shade: 0.3,																																											//===========
				content: $("#edit-pages5"),																																							//===========
				cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																																													//===========
			});	
		},
		batchSaveExpress:function(){
			var self = this;
			
			var batchExpress = $('#batchExpress').val();
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			if(batchExpress == "" || batchExpress == "0"){
				layer.msg('请选择快递类型',{
					icon: 2,
					time: 2000
				});
				return false;
			}
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			$.ajax({																																														
				url: "/index.php?m=system&c=waitSend&a=batchSaveExpress",																																		
				type: 'post',																																												
				data: {data: data, isAll: 0, batchExpress: batchExpress},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.closeAll();
						layer.msg('操作成功',{
							icon: 1,
							time: 2000
						});
					}else if(data.code == "error"){
						layer.closeAll();
						layer.msg('操作失败',{
							icon: 2,
							time: 2000
						});
					}
					
					self.tab.reload();
				}																																															
			});
		},
		orderLockPage:function(type){
			var self = this;
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			$("#lockMsg").val("");
			
			//===========
			layer.open({																																											//===========
				type: 1,																																											//===========
				title: '锁定订单',																																									//===========
				skin: 'layui-layer-rim', //加上边框																																					//===========
				area: ['700px', '200px'], //宽高																																					//===========
				shade: 0.3,																																											//===========
				content: $("#edit-pages7"),																																							//===========
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					self.orderLock('LOCK',type);
				}
				,btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																																													//===========
			});	
		},
		orderLock:function(method,type){
			var self = this;
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			var lockMsg = $("#lockMsg").val();
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			if(method == "LOCK"){
				var url = "/index.php?m=system&c=waitSend&a=setTidLock";
			}else if(method == "UNLOCK"){
				var url = "/index.php?m=system&c=waitSend&a=setTidUnlock";
			}
			
			$.ajax({																																														
				url: url,																																		
				type: 'post',																																												
				data: {data: data, isAll: 0, lockMsg: lockMsg},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.closeAll();
						layer.msg('操作成功',{
							icon: 1,
							time: 2000
						});
					}else if(data.code == "error"){
						layer.closeAll();
						layer.msg('操作失败',{
							icon: 2,
							time: 2000
						});
					}
					
					self.tab.reload();
				}																																															
			});
		},
		orderCancel:function(type){
			var self = this;
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			$("#cancelMsg").val("");
			
			//===========
			layer.open({																																											//===========
				type: 1,																																											//===========
				title: '作废订单',																																									//===========
				skin: 'layui-layer-rim', //加上边框																																					//===========
				area: ['700px', '200px'], //宽高																																					//===========
				shade: 0.3,																																											//===========
				content: $("#edit-pages6"),																																							//===========
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					self.saveOrderCancel(type);
				}
				,btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																																													//===========
			});	
		},
		saveOrderCancel:function(type){
			var self = this;
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			var cancelMsg = $('#cancelMsg').val();
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			$.ajax({																																														
				url: "/index.php?m=system&c=waitSend&a=setCancelTid",																																		
				type: 'post',																																												
				data: {data: data, isAll: 0, cancelMsg: cancelMsg},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.closeAll();
						layer.msg('操作成功',{
							icon: 1,
							time: 2000
						});
					}else if(data.code == "error"){
						layer.closeAll();
						layer.msg('操作失败',{
							icon: 2,
							time: 2000
						});
					}
					
					self.tab.reload();
				}																																															
			});
		},
		orderReApproval:function(){
			var self = this;
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			$.ajax({																																														
				url: "/index.php?m=system&c=waitSend&a=orderReApproval",																																		
				type: 'post',																																												
				data: {data: data, isAll: 0},
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.msg("操作成功",{
							icon: 1,
							time: 2000
						});
					}else if(data.code == "error"){
						self.defaultMsg = data.msgList;
						
						layer.open({
							type: 1,																																											
							title: '失败详情',																																								
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['800px', '400px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#default")																																													
						});
					}
					
					self.tab.reload();
				}																																															
			});
		},
		saveBaseInfo:function(){
			var self = this;	
			var tid = $("#pages1-tid").val();
			if(tid != ""){
				var modified_time = $("#pages1-modified").val();
				var express_type = $("#pages1-express").val();
				var receiver_state = $("#pages1-receiver_state").val();
				var receiver_city = $("#pages1-receiver_city").val();
				var receiver_district = $("#pages1-receiver_district").val();
				var receiver_address = $("#pages1-receiver_address").val();
				var receiver_name = $("#pages1-receiver_name").val();
				var receiver_mobile =  $("#pages1-mobile").val();
				var receiver_telephone =  $("#pages1-telephone").val();
				var seller_memo = $("#pages1-seller_memo").val();
				var remark = $("#pages1-remark").val();
				
				if(receiver_state == ""){
					layer.msg('请选择省',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				
				if(receiver_city == ""){
					layer.msg('请选择市',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				
				if(receiver_address == ""){
					layer.msg('街道地址不能为空',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				
				if(receiver_name == ""){
					layer.msg('请填写收货人信息',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				
				if(receiver_mobile == ""){
					if(receiver_telephone == ""){
						layer.msg('请填写收货人手机或电话',{
						icon: 0,
						time: 2000
						});
						return false;
					}
				}
				
				if(receiver_telephone == ""){
					if(receiver_mobile == ""){
						layer.msg('请填写收货人手机或电话',{
						icon: 0,
						time: 2000
						});
						return false;
					}
				}
				
				var data = {
					modified_time: modified_time,
					express_type: express_type,
					receiver_state: receiver_state,
					receiver_city: receiver_city,
					receiver_district: receiver_district,
					receiver_address: receiver_address,
					receiver_name: receiver_name,
					receiver_mobile: receiver_mobile,
					receiver_telephone: receiver_telephone,
					seller_memo: seller_memo,
					remark: remark
				};
				
				$.ajax({																																														
					url: "/index.php?m=system&c=waitSend&a=saveBaseInfo",																																		
					type: 'post',																																												
					data: {data: data, tid: tid},																																													
					dataType: 'json',																																											
					success: function (data) {
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							
							$("#pages1-modified").val(data.modified_time);
							self.tab.reload();
						}else if(data.code == "error"){
							layer.msg(data.msg,{
								icon: 2,
								time: 2000
							});
						}
					}																																															
				});	
			}else{
				layer.msg('数据异常',{
					icon: 2,
					time: 2000
				});
			}
		},
		autoFocus:function(){
			var a = $(event.target);
			a.focus().select();
		},
		columnSort:function(){
			layer.open({
                title :'调整列排序',
                type: 2,
                shade: false,
                area: ['300px', '500px'],
                maxmin: false,
                content: '/index.php?m=system&c=waitSend&a=columnSort'
            }); 
		},
		printLabel:function(){
			var self = this;
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请先选择订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			layer.open({																																											//===========
				type: 1,																																											//===========
				title: '打印标签',																																									//===========
				skin: 'layui-layer-rim', //加上边框																																					//===========
				area: ['700px', '400px'], //宽高																																					//===========
				shade: 0.3,																																											//===========
				content: $("#edit-pages4"),																																							//===========
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					
					self.doPrintLabel();
					layer.close(index);
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																																													//===========
			});
		},
		doPrintLabel:function(){
			var self = this;																																										
			
			if(self.printType == ""){
				layer.msg('请选择打印类型',{
					icon: 2,
					time: 2000
				});
				return false;
			}

			doGetPrinters(function(data){																																							
				self.layprint =  data;																																								
			});																																														

			$("#layprint").val(0);											//-----初始化选择框																										
			$("#layprintTplBq").val(0);										//-----初始化选择框																										

			self.layprintTplBq = printTplBq;

			layer.open({																																											
				type: 1,																																											
				title: '打印标签',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['700px', '400px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#table-print"),		
				btn: ['确定打印']
				,yes: function(index, layero){
					if(self.isFirst == true){
						self.labelPrint();
						self.isFirst = false;
					}
					setTimeout(function(){
						self.isFirst = true;
					},200);
					layer.close(index);
				},
				cancel: function (index, layero) {																																					
																																																
				},
				success:function(){
					$.ajax({																																														
						url: "/index.php?m=system&c=delivery&a=getPrinter",																																		
						type: 'post',																																												
						data: {},																																													
						dataType: 'json',																																											
						success: function (data) {
							if(data['result'].printer != "" && data['bq'].id != ""){
								$("#layprint").val(data['result'].printer);
								$("#layprintTplBq").val(data['bq'].id);
							}else if(data['result'].printer != "" && data['bq'].id == ""){
								$("#layprint").val(data['result'].printer);
								$("#layprintTplBq").val(0);
								printerPrompt("未设置默认打印模板","标签设计","index.php?m=print&c=bqDesign&a=index");
							}else if(data['result'].printer == "" && data['bq'].id != ""){
								$("#layprint").val(0);
								$("#layprintTplBq").val(data['bq'].id);
								printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
							}else{
								$("#layprint").val(0);
								$("#layprintTplBq").val(0);
								printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
							}
						}																																															
					});
				}
			});
		},
		labelPrint:function(){
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
			
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请先选择订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			$.ajax({																																									
				url: "/index.php?m=system&c=waitSend&a=printData",																															
				type: 'post',																																										
				data: {data:data, printType:self.printType, isAll: 0},																																									
				dataType: 'json',																																						
				success: function (data) {
					var error = data.error_array;						
					var data = 	data.dates;
					
					if(data[0] != ""){																																					
						var percent = 0;											//-----进度条初始化																					
						layer.closeAll();																																				
						$(".sche").css("display","block");							//-----进度条窗口显示																				
																																																
						var i = 0;																																						
						countSecond(i,data);																																							
						function countSecond(i,data){
							if(i < data.length){																																			
								layui.use('element', function(){					//----------																					
									var element = layui.element;					//																							
									element.init();									//	进度条																					
									percent += Math.ceil(100 / data.length);		//																									
									element.progress('demo', percent + '%');		//																								
								});													//----------																				

								printTpl[unprintTplBq](unprintname,data[i]);																											
								i = i+1;																																		
								setTimeout(function(){																																	
									countSecond(i,data);																																
								}, 1000)																																		
							}else{
								$(".sche").css("display","none");
								self.tab.reload();
								layer.msg('打印完成',{
									icon: 1,
									time: 2000
								});																								
								return																																					
							}
						}
					}else{
						layer.msg(error[0].error_msg,{
							icon: 2,
							time: 2000
						});
					}																																									
				}																																									
			});
			
			
			self.tab.reload();
		},
		printDSOS:function(){
			var self = this;																																										
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请先选择订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			doGetPrinters(function(data){																																							
				self.layprint = data;																																								
			});																																														
																																																	
			$("#layprintDSOS").val(0);											//-----初始化选择框																										
			$("#layprintTplDSOS").val(0);										//-----初始化选择框																																																																				
			self.layprintTplDSOS = printLodopTplList['DSOS'];

			layer.open({																																											
				type: 1,																																											
				title: '打印发货清单',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['700px', '400px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#table-printDSOS"),		
				btn: ['确定打印']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					if(self.isFirst == true){
						self.doPrintDSOS();
						self.isFirst = false;
					}
					setTimeout(function(){
						self.isFirst = true;
					},200);
					layer.close(index);
				},
				cancel: function (index, layero) {																																					
																																																
				},
				success:function(){
					$.ajax({																																														
						url: "/index.php?m=system&c=delivery&a=getPrinterDSOS",																																		
						type: 'post',																																												
						data: {},																																													
						dataType: 'json',																																											
						success: function (data) {
							if(data['result'].printer != "" && data['DSOS'].id != ""){
								$("#layprintDSOS").val(data['result'].printer);
								$("#layprintTplDSOS").val(data['DSOS'].id);
							}else if(data['result'].printer != "" && data['DSOS'].id == ""){
								$("#layprintDSOS").val(data['result'].printer);
								$("#layprintTplDSOS").val(0);
								printerPrompt("未设置默认打印模板","发货清单设计","index.php?m=print&c=lodopDesign&a=index");
							}else if(data['result'].printer == "" && data['DSOS'].id != ""){
								$("#layprintDSOS").val(0);
								$("#layprintTplDSOS").val(data['DSOS'].id);
								printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
							}else{
								$("#layprintDSOS").val(0);
								$("#layprintTplDSOS").val(0);
								printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
							}
						}																																															
					});
				}
			});		
		},
		doPrintDSOS:function(){
			var self = this;																																										
			var data = "";																																											
			if($("#layprintDSOS").val() != 0){																																							
				var unprintname = $("#layprintDSOS").val();																																				
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}																																														
			if($("#layprintTplDSOS").val() != 0){																																						
				var unprintTplDSOS = $("#layprintTplDSOS").val();																																		
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}
			
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请先选择订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			$.ajax({																																									
				url: "/index.php?m=system&c=waitSend&a=printDataDSOS",																															
				type: 'post',																																										
				data: {data:data,isAll: 0},																																									
				dataType: 'json',																																						
				success: function (data) {																																																																												
					if(data){																																					
						var percent = 0;											//-----进度条初始化																					
						layer.closeAll();																																				
						$(".sche").css("display","block");							//-----进度条窗口显示																				
																																																
						var i = 0;																																						
						countSecond(i,data);																																							
						function countSecond(i,data)																																	
						{ 																																																																									
							if(i<data.length){																																			
								layui.use('element', function(){					//----------																					
									var element = layui.element;					//																							
									element.init();									//	进度条																					
									percent += Math.ceil(100 / data.length);		//																									
									element.progress('demo', percent + '%');		//																								
								});
								var printData = [];
								printData.push(data[i]);						//----------																																																						
								printLodopTpl[unprintTplDSOS](unprintname,printData);																											
								i = i+1;																																		
								setTimeout(function(){																																	
									countSecond(i,data);																																
								}, 1000)																																		
							}else{																																				
								$(".sche").css("display","none");					//-----进度条窗口关闭																				
								self.tab.reload();
								layer.msg('打印完成',{
									icon: 1,
									time: 2000
								});																							
								return																																					
							}																																						
						}																																						
					}
					
					self.tab.reload();
				}																																									
			});
		},
		preDelivery:function(actionType){
			var self = this;	
			self.preDeliveryMsg = [];
			layui.use('element', function(){					//----------																					
				var element = layui.element;					//																							
				element.init();									//	进度条																					
				element.progress('delivery', '0%');	//	
				$("#pages8-title").html("");					
			});
						
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请先选择订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			layer.open({																																											//===========
				type: 1,																																											//===========
				title: '预发货',																																									//===========
				skin: 'layui-layer-rim', //加上边框																																					//===========
				area: ['700px', '500px'], //宽高																																					//===========
				shade: 0.3,																																											//===========
				content: $("#edit-pages8"),																																							//===========
				cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																																													//===========
			});	
			
			$("#progress-delivery").css("display","block");
			
			var time = new Date().getTime();
			
			$.ajax({																																														
				url: "/index.php?m=system&c=waitSend&a=preDelivery",																																		
				type: 'post',																																												
				data: {data: data, isAll: 0,time: time},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "error"){
						self.preDeliveryMsg = data.error_msg;
					}else if(data.code == "ok"){
						layer.closeAll();
						layer.msg('预发货成功',{
							icon: 1,
							time: 2000
						});
						if(actionType == "send"){
							self.faceAlone();
						}else{
							self.tab.reload();
						}
					}
				}
			})
			
			var Interval = setInterval(function(){
				$.ajax({																																														
					url: "/index.php?m=system&c=delivery&a=getDeliveryPer",																																		
					type: 'post',																																												
					data: {time: time},																																													
					dataType: 'json',																																											
					success: function (data) {
						layui.use('element', function(){					//----------																					
							var element = layui.element;					//																							
							element.init();									//	进度条																					
							element.progress('delivery', data.per + '%');	//	
							$("#pages8-title").html(data.msg);					
						});
							
						if(data.code == "end"){
							clearInterval(Interval);
							
						}
					},error: function(){
						clearInterval(Interval);
					}
				});
			},1000);
		},
		faceAlone:function(type){
			var self = this;
			self.defaultMsg = [];
			var data = "";
			
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请先选择订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			$("#layprint1").val(0);											//-----初始化选择框																										
			$("#layprintTplBq1").val(0);										//-----初始化选择框
			
			var checkPrintFace = 'T';
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=checkPrintFace",																																		
				type: 'post',																																												
				data: {data: data, isAll: 0},
				async:false,
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "error"){
						checkPrintFace = 'F';
						self.defaultMsg = data.msgList;
						
						layer.open({
							type: 1,																																											
							title: '失败详情',																																								
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['800px', '400px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#default")																																													
						});	
					}
				}																																															
			});
			
			if(checkPrintFace == "T"){
				$.ajax({																																														
					url: "/index.php?m=system&c=delivery&a=printFace",																																		
					type: 'post',																																												
					data: {data: data, isAll: 0},																																													
					dataType: 'json',																																											
					success: function (data) {
						if(data){
							self.expressSort = data;
							self.printTplDzmd = printTplDzmd;
							doGetPrinters(function(data){																																							
								self.layprint =  data;																																								
							});																																														
																																																					
							$("#layprint1").val(0);											//-----初始化选择框																										
							$("#layprintTplBq1").val(0);									//-----初始化选择框																										
																																																					
							self.layprintTplBq = printTplBq;	
							
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
							
						}
					}																																															
				});
				
				if(self.sysPlan == "send"){//已发货页面不发货
					var layerTitle = "打面单";
				}else{
					var layerTitle = "打面单并发货";
				}
			
				layer.open({																																											
					type: 1,																																											
					title: layerTitle,																																									
					skin: 'layui-layer-rim', //加上边框																																					
					area: ['1200px', '400px'], //宽高																																					
					shade: 0.3,		
					
					content: $("#facePop"),
					cancel: function(index, layero){
						if(type == "page"){
							self.tab.reload();
						}
					}
				});
			}
		},
		print_now:function(type,index,show,send){
			var self = this;	
			self.defaultMsg = [];
			
			var data = "";
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

			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请先选择订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			if($("#printInput" + index).is(':checked')){
				isrepeat = "no";
			}else{
				isrepeat = "yes";
			}
			
			var a = $(event.target);
			a.prop("disabled",true);
			
			setTimeout(function(){
				a.prop("disabled",false);
			},1000);
			$.ajax({																																									
				url: "/index.php?m=system&c=waitSend&a=printNow",																															
				type: 'post',																																								
				data: {data:data,isAll:0,type:type,isrepeat:isrepeat,show:show,send:send,exception:'no'},																																									
				dataType: 'json',																																						
				success: function (data) {
					if(data.dataCheck && data.numCheck > 0){
						self.defaultMsg = data.dataCheck;
						
						layer.open({
							type: 1,																																											
							title: '打印详情',																																								
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['800px', '400px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#default")																																													
						});	
					}
					if(data.dates && data.dates.length > 0){
						var newData = [];
						//console.log(newData);	
					
						var percent = 0;											
						var num = 0;
						if(show == "F"){
							doGetPrinters(function(){
								newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
								
								if(unprintname){
									if(send == "T"){
										printTpl[unprintTplBq](unprintname,newData,false,true);//第四个参数暂时没有用
										
										var expressSort = self.expressSort;
										expressSort.splice(index,1);
										self.expressSort = expressSort;
									}else{
										printTpl[unprintTplBq](unprintname,newData);
									}
								}
							});
						}else if(show == "show"){
							doGetPrinters(function(){
								newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'T');//订单数据,商品数据，订单详情数据,预览
								//console.log(newData);
								if(unprintname){
									printTpl[unprintTplBq](unprintname,newData,true);
								}else{
									layer.msg('打印机不存在,无法预览', {time: 2000, icon:2});
								}
							});
						}
					}																																		
				}																																								
			});																					
		},
		//============================================================================面单打印 预览 按钮结束=============================================================================================
		
		//=====================================================================面单打印所有=========================================================================================
		print_all:function(){
			var self = this;
			$("#print_all").prop("disabled",true);
			setTimeout(function(){
				$("#print_all").prop("disabled",false);
			},1000)
			for(var i = 0; i < self.expressSort.length; i++){
				self.print_now(self.expressSort[i].type,i,'F','T');
			}
		},
		printYd:function(){
			var self = this;
            
            var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请先选择订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			doGetPrinters(function(data){																																							
				self.layprint =  data;																																								
			});																																														

			$("#layprintYd").val(0);											//-----初始化选择框																										
			$("#layprintTplYd").val(0);										//-----初始化选择框																										
																																																	
			self.layprintTplYd = printTplYd;	
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=getExpresss",																																		
				type: 'post',																																												
				data: {},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.printer != ""){
						$("#layprintYd").val(data.printer);
					}else{
						$("#layprintYd").val(0);
						printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
					}
					
					if(data.yd != ""){
						$("#layprintTplYd").val(data.yd);
					}else{
						$("#layprintTplYd").val(0);
						printerPrompt("未设置默认打印模板","运单设计","index.php?m=print&c=ydDesign&a=index");
					}
				}																																															
			});
			
			layer.open({																																											
				type: 1,																																											
				title: '打印标签',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['700px', '400px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#table-printYd"),																																							
				cancel: function (index, layero) {																																					
																																																	
				}																																													
			});
		},
		doPrintYd:function(){																																										
			var self = this;																																										
			var data = "";																																											
			if($("#layprintYd").val() != 0){																																							
				var unprintname = $("#layprintYd").val();																																				
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}																																														
			if($("#layprintTplYd").val() != 0){																																						
				var unprintTplYd = $("#layprintTplYd").val();																																		
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}
																																																	
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请先选择订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			$.ajax({																																									
				url: "/index.php?m=system&c=waitSend&a=printDataYd",																															
				type: 'post',																																										
				data: {data: data, isAll: 0},																																									
				dataType: 'json',																																						
				success: function (data) {																																						
					if(data){																																					
						var percent = 0;											//-----进度条初始化																					
						layer.closeAll();																																				
						$(".sche").css("display","block");							//-----进度条窗口显示																				
																																																
						var i = 0;																																						
						countSecond(i,data);																																							
						function countSecond(i,data)																																	
						{ 																																						
							if(i<data.length){																																			
								layui.use('element', function(){					//----------																					
									var element = layui.element;					//																							
									element.init();									//	进度条																					
									percent += Math.ceil(100 / data.length);		//																									
									element.progress('demo', percent + '%');		//																								
								});													//----------																				
																																														
								printTpl[unprintTplYd](unprintname,data[i]);																											
								i = i+1;																																		
								setTimeout(function(){
									countSecond(i,data);																																
								}, 1000)																																		
							}else{																																				
								$(".sche").css("display","none");					//-----进度条窗口关闭																				
								searchALLNow(self,'page');																																		
								layer.msg('打印完成',{
									icon: 1,
									time: 2000
								});
								return																																					
							}
						}																																						
					}
					self.tab.reload();
				}																																									
			});																																											
		},
		exportTakeGoods:function(){
			var self = this;
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请先选择订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			var indexLoad = layer.load();
            execAjax({
                m:'system',
                c:'waitSend',
                a:'exportTakeGoods',
                data:{
                    data:data, isAll:0
                },
                success:function(data){
                    layer.close(indexLoad);
                    $("#excelFileId").val(data['id']);
                    $("#excelForm").submit();
                }
            });
		},
		preDeliveryForce:function(){
			var self = this;
			var data = "";
			
			var checkStatus = table.checkStatus('datagrid');
			var checkdata = checkStatus.data;
			
			if(checkdata.length == 0){	
				layer.msg('请先选择订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			var data = "";
			for(var i = 0; i < checkdata.length; i++){
				data += checkdata[i].new_tid;
			}
			
			if($("#preDeliveryForce").hasClass("layui-btn-disabled")){
				return false;
			}
			$("#preDeliveryForce").addClass("layui-btn-disabled");
			
			$.ajax({																																														
				url: "/index.php?m=system&c=waitSend&a=preDeliveryForce",																																	
				type: 'post',																																												
				data: {data: data, isAll: 0},																																													
				dataType: 'json',																																											
				success: function (data) {
					$("#preDeliveryForce").removeClass("layui-btn-disabled");
					if(data.code == "ok"){
						layer.msg('操作成功',{
							icon: 1,
							time: 2000
						});
					}else if(data.code == "error"){
						self.defaultMsg = data.msgList;
						
						layer.open({
							type: 1,																																											
							title: '失败详情',																																								
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['800px', '400px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#default")																																													
						});
					}
					
					self.tab.reload();
				}																																															
			});	
		},
		cancel: function () {																																					//===========
			layer.closeAll();
		}
	}
});

function orderSplitWindow(tid,self){
	layer.open({																																											//===========
		type: 1,																																											//===========
		title: '订单拆分',																																									//===========
		skin: 'layui-layer-rim', //加上边框																																					//===========
		area: ['988px', '600px'], //宽高																																					//===========
		shade: 0.3,																																											//===========
		content: $("#edit-pages10"),	
		btn: [ '保存拆分', '取消']
		,yes: function(index, layero){
			data = self.splitItemArr;
			$.ajax({																																														
				url: "/index.php?m=system&c=waitSend&a=orderSplitSave",																																		
				type: 'post',																																												
				data: {tid: tid, data: data},																																													
				dataType: 'json',
				async:false,
				success: function (data) {
					if(data.code == 'ok'){
						layer.msg("拆分成功,拆出订单号["+ data.new_tid +"]",{
							icon: 1,
							time: 2000
						});
						layer.close(index);
						self.tab.reload();
					}else if(data.code == 'error'){
						layer.msg(data.msg,{
							icon: 0,
							time: 2000
						});
						return false;// 开启该代码可禁止点击该按钮关闭
					}else{
						layer.msg("拆分异常error",{
							icon: 2,
							time: 2000
						});
						return false;// 开启该代码可禁止点击该按钮关闭
					}
				}																																															
			});
		},
		cancel: function (index, layero) {																																					//===========
			
		}																																													//===========
	});	
}

$('#radio_1').on('ifChecked', function(event){
	flow.printType = "noRepeat";
});

$('#radio_2').on('ifChecked', function(event){
	flow.printType = "Repeat";
});		

$('#radio_3').on('ifChecked', function(event){
	flow.printType = "Refunds";
});	