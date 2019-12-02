var table;
var layer;
var zTreeObj;
var flow = new Vue({
	el: '#flow',
	data: {
		shopArr:[],
		expressArr:[],
		searchData:{},
		headerQuery:"",
		splitItemArr:[],
		defaultMsg:[],
		logArr:[],
		itemArr:[],
		ItemModify:[],
		memoryPrice:0,
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
			
			$.ajax({																																													//===========
				url: "/index.php?m=system&c=approval&a=getTreeInfo",																																		//===========
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
					,url: 'index.php?m=system&c=approval&a=getOrderTrade2'
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
						searchdata.headerQuery = self.headerQuery;
						
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
				
				$('.skin-minimal input').iCheck({
					checkboxClass: 'icheckbox_minimal',
					radioClass: 'iradio_minimal',
					increaseArea: '20%'
				});
				
				$('#more_1').on('ifChecked ifUnchecked', function(event){																																			//===========
					if (event.type == 'ifChecked') {																																								//===========
						$(".more input[name='order']").iCheck('check');																																			//===========
					} else {																																														//===========
						$(".more input[name='order']").iCheck('uncheck');																																			//===========
					}																																																//===========
				});	
				
				var form = layui.form;
				form.on('submit(doheaderQuery)', function(data){
					var elem = data.elem;
					var buttonID = elem.id;
					$("[name='headerQuery']").removeClass("layui-btn-primary").addClass("layui-btn-primary");
					$("#"+buttonID).removeClass("layui-btn-primary");
					self.headerQuery = buttonID;
					
					active.reload();
					return false;
				});
				
				table.on('tool(user)', function(obj){
					var data = obj.data;
					var tid = data.new_tid;
					
					if(obj.event === 'goodsinfo'){
						$(".more input").iCheck('uncheck');
						$("input[name='order']").iCheck('uncheck');
			
						layer.open({																																											//===========
							type: 1,																																											//===========
							title: '修改商品',																																									//===========
							skin: 'layui-layer-rim', //加上边框																																					//===========
							area: ['988px', '600px'], //宽高																																					//===========
							shade: 0.3,																																											//===========
							content: $("#edit-pages2"),	
							btn: ['添加商品','标记有货','取消']
							,yes: function(index, layero){
								self.addOrderItems(tid,index);
								return false;
							},
							btn2: function(index, layero){
								self.setStock(tid);
								return false;
							},
							btn3: function(index, layero){
								//按钮【按钮三】的回调
								
								//return false 开启该代码可禁止点击该按钮关闭
							},
							cancel: function (index, layero){																																					//===========
																																																				//===========
							}																																													//===========
						});	
						
						$.ajax({																																														
							url: "/index.php?m=system&c=delivery&a=getItemsInfo",																																		
							type: 'post',																																												
							data: {tid: tid},																																													
							dataType: 'json',																																											
							success: function (data) {
								if(data){
									self.itemArr = data;
									$(document).ready(function(){
										$('.skin1 input').iCheck({
											checkboxClass: 'icheckbox_minimal',
											radioClass: 'iradio_minimal',
											increaseArea: '20%'
										});
									});
								}
							}																																															
						});
					}else if(obj.event === 'detail'){
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
			
			layui.use('form', function(){
				var form = layui.form;
				
				form.on('switch(pages11-gift)', function(data){
					if(data.elem.checked == true){
						flow.memoryPrice = $("#pages11-price").val();
						$("#pages11-price").val(0);
						$("#pages11-price").attr("readonly","readonly");
					}else{
						$("#pages11-price").removeAttr("readonly");
						$("#pages11-price").val(flow.memoryPrice);
					}
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
		addOrders:function(new_tid){
            layer.open({
                title :'新增手工订单',
                type: 2,
                shade: 0.3,
                area: ['1000px', '500px'],
                maxmin: false,
                content: '?m=system&c=delivery&a=addOrders',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
                    iframeWin.vueObj.loadOrders('',{});
                }
            }); 
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
				url: "/index.php?m=system&c=approval&a=splitCheck",																																		
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
				url: "/index.php?m=system&c=approval&a=orderSplitCancel",																																		
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
				url: "/index.php?m=system&c=approval&a=orderMergeSplit",																																		
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
				url: "/index.php?m=system&c=approval&a=batchSaveExpress",																																		
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
				var url = "/index.php?m=system&c=approval&a=setTidLock";
			}else if(method == "UNLOCK"){
				var url = "/index.php?m=system&c=approval&a=setTidUnlock";
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
				url: "/index.php?m=system&c=approval&a=setCancelTid",																																		
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
		orderApproval:function(){
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
				url: "/index.php?m=system&c=approval&a=orderApproval",																																		
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
					url: "/index.php?m=system&c=approval&a=saveBaseInfo",																																		
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
		addOrderItems:function(tid,index){
			var self = this;
			
			$("#pages11-prd_id").val("");
			$("#pages11-prd_sku_id").val("");
			$("#pages11-prd_no").val("");
			$("#pages11-title").val("");
			$("#pages11-sku_name").val("");
			$("#pages11-num").val("");
			$("#pages11-price").val("");
			$("#pages11-gift").val("");
			//$("#pages11-gift").val("");
			//$("#pages11-gift").attr("checked",false);
			//$("#pages11-gift").removeAttr('checked');

			layer.open({																																											
				type: 1,																																											
				title: '添加商品',																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['500px', '380px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#edit-pages11"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					if($("#pages11-prd_no").val() == ""){
						layer.msg('请先选择一个商品',{
							icon: 0,
							time: 2000
						});
						return false;	
					}
					
					if($("#pages11-num").val() == "" || $("#pages11-num").val() == 0){
						layer.msg('请先填写商品的数量',{
							icon: 0,
							time: 2000
						});
						return false;	
					}
					
					var param = {
						prd_id: $("#pages11-prd_id").val(),
						prd_sku_id: $("#pages11-prd_sku_id").val(),
						prd_no: $("#pages11-prd_no").val(),
						title: $("#pages11-title").val(),
						sku_name: $("#pages11-sku_name").val(),
						num: $("#pages11-num").val(),
						price: $("#pages11-price").val(),
						gift: $("#pages11-gift").is(':checked')
					};
					
					self.orderItemsAdd(index,tid,param);
					return false;
				},
				cancel: function (index, layero) {																																					
					
				}																																													
			});
		},
		delOrderItems:function(new_tid,unique_code){
			var self = this;
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=delOrderItems",																																		
				type: 'post',																																												
				data: {unique_code: unique_code},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.msg('操作成功',{
							icon: 1,
							time: 2000
						});
						
						$.ajax({
							url: "/index.php?m=system&c=delivery&a=getItemsInfo",																																		
							type: 'post',																																												
							data: {tid: new_tid},																																													
							dataType: 'json',																																											
							success: function (data) {
								if(data){
									self.itemArr = data;
									self.tab.reload();
									$(document).ready(function(){
										$('.skin1 input').iCheck({
											checkboxClass: 'icheckbox_minimal',
											radioClass: 'iradio_minimal',
											increaseArea: '20%'
										});
									});
								}
							}																																															
						});
					}else if(data.code == "error"){
						layer.msg('操作失败'+data.msg,{
							icon: 2,
							time: 2000
						});
					}
				}																																															
			});
		},
		orderItemsAdd:function(index,tid,data){
			var self = this;
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=orderItemsAdd",																																		
				type: 'post',																																												
				data: {data: data, tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.msg('操作成功',{
							icon: 1,
							time: 2000
						});
						
						$.ajax({
							url: "/index.php?m=system&c=delivery&a=getItemsInfo",																																		
							type: 'post',																																												
							data: {tid: tid},																																													
							dataType: 'json',																																											
							success: function (data) {
								if(data){
									self.itemArr = data;
									self.tab.reload();
									$(document).ready(function(){
										$('.skin1 input').iCheck({
											checkboxClass: 'icheckbox_minimal',
											radioClass: 'iradio_minimal',
											increaseArea: '20%'
										});
									});
								}
							}																																															
						});
						layer.close(index);
					}else if(data.code == "error"){
						layer.msg('操作失败'+data.msg,{
							icon: 2,
							time: 2000
						});
					}
				}																																															
			});
		},
		changeMon:function(){
            layer.open({
                title :'选择商品',
                type: 2,
                shade: false,
                area: ['700px', '560px'],
                maxmin: false,
                content: '?m=widget&c=selectProduct&a=index&type=1&param=PRD1'
            }); 
		},
		changeMon2:function(){
			layer.open({
                title :'选择商品',
                type: 2,
                shade: false,
                area: ['700px', '560px'],
                maxmin: false,
                content: '?m=widget&c=selectProduct&a=index&type=1&param=PRD2'
            }); 
		},
		//=========标记有货============================
		setStock:function(tid){
			var self = this;		
			if($(".more input[name='order']").filter(':checked').length == 0){																															
				layer.msg('请选择至少一个货品',{
					icon: 0,
					time: 2000
				});																																												
				return false;																																										
			}
			
			var data = "";		
			$(".more input[name='order']:checkbox").each(function(){						//--------------------------																				
				if(true == $(this).is(':checked')){									//																											
					data += ($(this).val()+",");									//																											
				}																	//	拼接当前页的货品唯一码																					
			});																		//																							
			data = data.substring(0,data.length-1);
			
			execAjax({
                m:'system',
                c:'approval',
                a:'setStock',
                data:{data:data,tid:tid},
                success:function(data){
					if(data.code == "ok"){
						layer.msg('标记完成',{
							icon: 1,
							time: 2000
						});
						
						$.ajax({
							url: "/index.php?m=system&c=delivery&a=getItemsInfo",																																		
							type: 'post',																																												
							data: {tid: tid},																																													
							dataType: 'json',																																											
							success: function (data) {
								if(data){
									self.itemArr = data;
									$(document).ready(function(){
										$('.skin1 input').iCheck({
											checkboxClass: 'icheckbox_minimal',
											radioClass: 'iradio_minimal',
											increaseArea: '20%'
										});
									});
								}
							}																																															
						});	
					}else{
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
					}
                }
            });
		},
		saveItemSku:function(){
			var self = this;
			var skuObj = self.ItemModify.skuArray;
			var tid = $("#pages3-tid").val();
			var oid = $("#pages3-oid").val();
			var num = $("#pages3-num").val();
			var sku_id_old = $("#pages3-sku_id").val();
			var color = $("#pages3-color").val();
			var size = $("#pages3-size").val();
			var	properties_id = "";
			var	properties_name = "";
			var sku_outer_id = "";
			var sku_id = "";
			var prd_no = "";
            var title = "";
            var prd_id = "";
            var prd_sku_id = "";
            var isProduct = $("#pages3-isProduct").val();
            
			properties_name = $("#pages3-properties_name").val();
			prd_no = $("#pages3-prd_no").val();
			title = $("#pages3-title").val();
			prd_id = $("#pages3-prd_id").val();
			prd_sku_id = $("#pages3-prd_sku_id").val();
			sku_outer_id = $("#pages3-outer_sku_id").val();
			if(color != "" && color != null){
				properties_id += color;
			}
			if(size != "" && size != null){
				properties_id += ":" + size;
			}
			if(properties_id != ""){
				if(skuObj[properties_id]){
					properties_name = skuObj[properties_id].sku_properties_name;
					sku_id = skuObj[properties_id].sku_id;
				}
				
				sku_outer_id = $("#pages3-outer_sku_id").val();
			}
			
			execAjax({
                m:'system',
                c:'approval',
                a:'saveItemModify',
                data:{tid: tid, oid: oid, sku_id_old: sku_id_old, properties_name: properties_name, sku_outer_id: sku_outer_id, 
                sku_id: sku_id,
                isProduct: isProduct,
                prd_no: prd_no,
                title: title,
                prd_id: prd_id,
                prd_sku_id: prd_sku_id,
				num: num,
                },
                success:function(data){
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						self.tab.reload();					
					}else if(data.code == "error"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});	
					}
                }
            });
			
		},
		skuChange:function(){
			var self = this;
			var data = self.ItemModify;
			var properties_id = "";
			var outer_sku_id = "";
			var colorValue = $("#pages3-color").val();
			var sizeValue = $("#pages3-size").val();
			var outer_id = data.outer_id;
			
			if(colorValue != "" && colorValue != null){
				properties_id = colorValue;
			}
			if(sizeValue != "" && sizeValue != null){
				properties_id += ":" + sizeValue;
			}
			if(properties_id != ""){
				outer_sku_id = data['skuArray'][properties_id].outer_id;
			}
			if(outer_sku_id == ""){
				outer_sku_id = outer_id;
			}
			
			self.ItemModify.outer_sku_id = outer_sku_id;
		},
		key_upItem:function(value){
			var self = this;
			var a = $(event.target);
			var e = event || window.event;
			var itemNum = parseInt(a.val());
			if(isNaN(itemNum)){
				itemNum = 0;
			}
			if(a.val() > value){
				itemNum = value;
			}
			
			self.ItemModify.num = itemNum;
		},
		autoFocus:function(){
			var a = $(event.target);
			a.focus().select();
		},
		versonChange:function(){
			window.location.href = "/index.php?m=system&c=approval&a=approval";
		},
		columnSort:function(){
			layer.open({
                title :'调整列排序',
                type: 2,
                shade: false,
                area: ['300px', '500px'],
                maxmin: false,
                content: '/index.php?m=system&c=approval&a=columnSort'
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
				url: "/index.php?m=system&c=approval&a=orderSplitSave",																																		
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

function cbProductRows(data,type){
	if(type == "PRD1"){
		if(data[0]){
			flow.ItemModify['outer_sku_id'] = data[0]['prd_no'];
			flow.ItemModify['colorArray'] = [{id:'',name:data[0]['sku_name1']}];
			flow.ItemModify['sizeArray'] = [{id:'',name:data[0]['sku_name2']}];
			flow.ItemModify['isProduct'] = '1';
			flow.ItemModify['properties_name'] = data[0]['sku_name'];
			flow.ItemModify['prd_no'] = data[0]['prd_no'];
			flow.ItemModify['title'] = data[0]['title'];
			flow.ItemModify['prd_id'] = data[0]['prd_id'];
			flow.ItemModify['prd_sku_id'] = data[0]['prd_sku_id'];
		}
	}else if(type == "PRD2"){
		$("#pages11-prd_no").val(data[0]['prd_no']);
		$("#pages11-title").val(data[0]['title']);
		$("#pages11-sku_name").val(data[0]['sku_name']);
		$("#pages11-prd_id").val(data[0]['prd_id']);
		$("#pages11-prd_sku_id").val(data[0]['prd_sku_id']);
	}
}

function modifyMess(tid,oid,sku_id){
	layer.open({																																											//===========
		type: 1,																																											//===========
		title: '修改拿货信息',																																								//===========
		skin: 'layui-layer-rim', //加上边框																																					//===========
		area: ['968px', '400px'], //宽高																																					//===========
		shade: 0.3,																																											//===========
		content: $("#edit-pages3"),																																							//===========
		cancel: function (index, layero) {																																					//===========
																																															//===========
		}																																													//===========
	});	
	$("#pages3-isProduct").val('');
	execAjax({
		m:'system',
		c:'delivery',
		a:'getItemModifyMess',
		data:{tid: tid, oid: oid, sku_id: sku_id},
		success:function(data){
			if(data){
				flow.ItemModify = data;
				setTimeout(function(e){
					$("#pages3-color").val(data.colorValue);
					$("#pages3-size").val(data.sizeValue);
				},100);
			}
		}
	});
}

function smartApprovalConfig(){
	
}