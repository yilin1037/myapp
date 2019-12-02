var tab;
var table;
var tableList = new Vue({
	el: '#tableList',
	data: {
		shopArr:[],
		show:false,
		searchData:{},
		refundItems:[],
	},
	mounted: function() {
		var self = this;
		
		//获取网店
		$.ajax({
			url: "/index.php?m=afterSale&c=aftersaleManage&a=getShop",										
			type: 'post',																		
			data: {},																	
			dataType: 'json',																	
			success: function (data) {			
				self.shopArr = data;
				$(document).ready(function(){
					$('.skin-minimal input').iCheck({
						checkboxClass: 'icheckbox_minimal',
						radioClass: 'iradio_minimal',
						increaseArea: '20%'
					});
				});	
			}																					
		});
		
		execAjax({
			m:'afterSale',
			c:'unpacking',
			a:'getRefundConfig',
			data:{list : 'T'},
			success:function(data){
				self.refundItems = data;
			}
		});
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate','tree'], function(){
				var element=layui.element,layer=layui.layer,form = layui.form;
				var laydate = layui.laydate;
				table = layui.table;
				
				//时间选择器
				laydate.render({
					elem: '#dateBegin'
					,type: 'datetime'
					,done: function(value, date, endDate){
						self.dateBegin = value;
					}
				});

				laydate.render({
					elem: '#dateEnd'
					,type: 'datetime'
					,done: function(value, date, endDate){
						self.dateEnd = value;
					}
				});
				  
				tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=afterSale&c=aftersaleManage&a=getData'
					,cols: [[
					   {checkbox: true ,fixed: true}
					  ,{field:'LAY_TABLE_INDEX', width:40, title: '' , templet: '#indexTpl', align: 'center', unresize: true ,fixed: true, event: 'rowClick'}
					  ,{field:'', title: '处理',"width":160 ,fixed: true, templet: '#actionTpl', event: 'rowClick', align: 'center'}
					  ,{field:'sh_no', title: '售后单号',"width":120,fixed: true, event: 'rowClick'}
					  ,{field:'sh_type_name', title: '售后类型',"width":90}
					  ,{field:'shopname', title: '来源店铺',"width":100, event: 'rowClick'}
					  ,{field:'new_tid', title: '订单号',"width":150, event: 'rowClick'}
					  ,{field:'buyer_nick', title: '买家昵称',"width":100, templet: '#buyer_nickTpl', event: 'rowClick'}
					  ,{field:'refund_type', title: '退件类型',"width":90, event: 'rowClick'}
					  ,{field:'title', title: '问题原因',"width":150, event: 'rowClick'}
					  ,{field:'express', title: '退货快递',"width":90, event: 'rowClick'}
					  ,{field:'express_no', title: '退货快递单号',"width":120, event: 'rowClick'}
					  ,{field:'extra_amtn', title: '额外退款金额',"width":120, event: 'rowClick'}
					  ,{field:'alipay_no', title: '退款支付宝账号',"width":120, event: 'rowClick'}
					  ,{field:'usrname', title: '制单人',"width":100, event: 'rowClick'}
					  ,{field:'create_time', title: '创建时间',"width":170, event: 'rowClick'}
					]]
					,id: 'testReload'
					,page: true
					,height: '440'
					,limit: 20
					,where:{
						data: {
							dateBegin: layui.$("#dateBegin").val(),
							dateEnd: layui.$("#dateEnd").val(),
						}
					}
				});
				  
				var $ = layui.$, active = {
					reload: function(){
						var searchdata = self.searchData;
						searchdata.sh_type = $("#aftersale_type").val();
						searchdata.shopid = $("#shopname").attr("name");
						searchdata.sh_no = $("#aftersale_sh_no").val();
						searchdata.express = $("#aftersale_express").val();
						searchdata.express_no = $("#aftersale_express_no").val();
						searchdata.refund_type = $("#aftersale_refund_type").val();
						searchdata.sh_type = $("#aftersale_sh_type").val();
						searchdata.tid = $("#aftersale_tid").val();
						searchdata.buyer_nick = $("#aftersale_buyer_nick").val();
						searchdata.dateBegin = $("#dateBegin").val();
						searchdata.dateEnd = $("#dateEnd").val();
						
						self.searchData = searchdata;
						
						tab.reload({
							where: {
								data: searchdata
							}
					  });
					}
				};
				  
				$('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					
					active[type] ? active[type].call(this) : '';
				});
				
				table.on('tool(user)', function(obj){
					var data = obj.data;
					var sh_no = data.sh_no;
					var new_tid = data.new_tid;
					
					if(obj.event === 'rowClick'){
						$.ajax({
							url: "/index.php?m=afterSale&c=aftersaleManage&a=getAfterSaleDetail",										
							type: 'post',																		
							data: {sh_no: sh_no},																	
							dataType: 'json',																	
							success: function (data) {			
								$("#receiver_name").val(data.receiver.receiver_name);
								$("#receiver_mobile").val(data.receiver.receiver_mobile);
								$("#receiver_telephone").val(data.receiver.receiver_telephone);
								$("#receiver_state").val(data.receiver.receiver_state);
								$("#receiver_city").val(data.receiver.receiver_city);
								$("#receiver_district").val(data.receiver.receiver_district);
								$("#receiver_address").val(data.receiver.receiver_address);
								
								table.render({
									elem: '#tui_detail'
									,url: ''
									,cols: [[
									   {field:'LAY_TABLE_INDEX', title: '序号',"width":60 ,fixed: true, templet: '#indexTpl'}
									  ,{field:'prd_no', title: '商品编号',"width":180}
									  ,{field:'title', title: '商品名称',"width":280}
									  ,{field:'sku_name', title: '商品属性',"width":150}
									  ,{field:'num', title: '数量',"width":100}
									]]
									,id: 'tui'
									,page: false
									,height: '190'
									,data: data.returnList
								});
								
								table.render({
									elem: '#huan_detail'
									,url: ''
									,cols: [[
									   {field:'LAY_TABLE_INDEX', title: '序号',"width":60 ,fixed: true, templet: '#indexTpl'}
									  ,{field:'prd_no', title: '商品编号',"width":180}
									  ,{field:'title', title: '商品名称',"width":280}
									  ,{field:'sku_name', title: '商品属性',"width":150}
									  ,{field:'num', title: '数量',"width":100}
									  ,{field:'price', title: '单价',"width":100}
									  ,{field:'total_fee', title: '金额',"width":100}
									]]
									,id: 'tui'
									,page: false
									,height: '190'
									,data: data.exchangeList
								});
							}																					
						});
					}else if(obj.event === 'actionComplete'){
						$("#edit-pages1-remark").val("");
						layer.open({																																											
							type: 1,																																											
							title: '处理完成',																																								
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['470px', '300px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#edit-pages1"),
							btn: ['确定', '取消'],
							yes: function(index, layero){
								var remark = $("#edit-pages1-remark").val();
								
								self.actionComplete(index,sh_no,remark);
								return false;
							},
							cancel: function (index, layero) {																																					
								
							}																																													
						});
					}else if(obj.event === 'actionExchange'){
						$.ajax({
							url: "/index.php?m=afterSale&c=aftersaleManage&a=actionExchangeCheck",										
							type: 'post',																		
							data: {sh_no: sh_no},																	
							dataType: 'json',																	
							success: function (data) {
								if(data.code == "ok"){
									layer.open({
										title :'换货开单',
										type: 2,
										shade: 0.3,
										area: ['1000px', '650px'],
										maxmin: false,
										content: '?m=system&c=delivery&a=addOrders',
										success: function(layero, index){
											var body = layer.getChildFrame('body', index);
											var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
											iframeWin.vueObj.loadOrders(new_tid,{'action': 'huanhuo', 'sh_no': sh_no, 'new_tid': new_tid});
										}
									});
								}else{
									layer.msg(data.msg,{
										icon: 2,
										time: 2000
									});	
								}
							}																					
						});
						
					}
				});
				
				//退回商品明细表
				table.render({
					elem: '#tui_detail'
					,url: ''
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'', title: '商品编号',"width":180}
					  ,{field:'', title: '商品名称',"width":180}
					  ,{field:'', title: '商品属性',"width":150}
					  ,{field:'', title: '数量',"width":100}
					]]
					,id: 'tui'
					,page: false
					,height: '190'
				});
				  
				  //换出商品明细表
				table.render({
					elem: '#huan_detail'
					,url: ''
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'', title: '商品编号',"width":180}
					  ,{field:'', title: '商品名称',"width":180}
					  ,{field:'', title: '商品属性',"width":150}
					  ,{field:'', title: '数量',"width":100}
					  ,{field:'', title: '单价',"width":100}
					]]
					,id: 'huan'
					,page: false
					,height: '190'
				});
				  
				  //历史操作表
				/*table.render({
					elem: '#history_now'
					,url: 'index.php?m=report&c=sendOrderDetail&a=sendOrderDetailList'
					,cols: [[
					   {field:'index', title: '操作动作',"width":220}
					  ,{field:'', title: '操作员',"width":220}
					  ,{field:'payment_time', title: '操作时间',"width":180}
					  ,{field:'', title: '操作详情',"width":400}
					]]
					,id: 'history'
					,page: false
					,height: '190'
				});*/
			});
		});
	},
	methods: {
		//店铺查询条件
		shopHide:function(){
			var self = this;
			self.show = !self.show;
			
			/*if(self.show){
				$('input[name="shop"]').each(function(){
					$(this).iCheck('uncheck');
				});
			}*/
			
			var arr = [];
			var name = [];
			
			$('input[name="shop"]').each(function(){
				$(this).on('ifChecked ifUnchecked', function(event){																																			
					var newArr = [];
					var nameArr = [];
					if (event.type == 'ifChecked') {
						console.log($("label").attr("for"))
						
						$('input[name="shop"]').each(function(){
							if(true == $(this).is(':checked')){
								newArr.push($(this).prop("class"));
								nameArr.push($(this).val());
							}
							
						});
						arr = newArr;
						name = nameArr;
						//$(".southwest input[name='places']").iCheck('check');																																		
					} else {																																														
						//$(".southwest input[name='places']").iCheck('uncheck');
						$('input[name="shop"]').each(function(){
							if(true == $(this).is(':checked')){
								newArr.push($(this).prop("class"));
								nameArr.push($(this).val());
							}
						});
						arr = newArr;
						name = nameArr;
					}
					var a = "";
					var b = "";
					for(var i = 0; i < arr.length; i++){
						a += (arr[i] + ",");
						b += (name[i] + ",");
					}
					a = a.substring(0,a.length-1);
					b = b.substring(0,b.length-1);
					$("#shopname").val(a);
					$("#shopname").attr("name",b);
				});
			});
		},
		//店铺查询条件清空按钮事件
		clearValue:function(){
			$("#shopname").val("");
			$("#shopname").attr("name","");
		},
		//选项卡切换事件
		change:function(type){
			var self = this;
			if(type == "examine"){
				$("#aftersale_type").val("0");
				self.searchData.sh_type = "0";
			}else if(type == "Exchange"){
				$("#aftersale_type").val("1");
				self.searchData.sh_type = "1";
			}else if(type == "Reissue"){
				$("#aftersale_type").val("2");
				self.searchData.sh_type = "2";
			}else if(type == "refund"){
				$("#aftersale_type").val("3");
				self.searchData.sh_type = "3";
			}
			
			tab.reload({
				where: {
					data: self.searchData
				}
			});
		},
		//重置按钮
		reset_now:function(){
			$("input[name='reset']").val("");
			$("select").val("");
			$("#circle_time").val("week");
			$("#shopname").val("");
			$("#shopname").attr("name","");
			$("#dateBegin").val(nowDateWeek);
			$("#dateEnd").val(nowDate);
		},
		//处理完成
		actionComplete: function(index,sh_no,remark){
			var self = this;
			
			$.ajax({																																														
				url: "/index.php?m=afterSale&c=afterSaleManage&a=actionComplete",																																		
				type: 'post',																																												
				data: {sh_no: sh_no, remark: remark},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.msg('操作成功',{
							icon: 1,
							time: 2000
						});
						
						layer.close(index);
						tab.reload({
							where: {
								data: self.searchData
							}
						});
					}else if(data.code == "error"){
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});
					}
				}																																															
			});
		},
		actionCompleteBatch:function(){
			var self = this;
			
			$("#edit-pages1-remark").val("");
			layer.open({																																											
				type: 1,																																											
				title: '处理完成',																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['470px', '300px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#edit-pages1"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var remark = $("#edit-pages1-remark").val();
					var checkStatus = table.checkStatus('testReload');
					if(checkStatus.data.length > 0){
						var sh_nos = '';
						for(var i = 0; i < checkStatus.data.length; i++){
							sh_nos += checkStatus.data[i]['sh_no']+',';
						}
						
						$.ajax({
							url: "/index.php?m=afterSale&c=afterSaleManage&a=actionCompleteBatch",																																		
							type: 'post',																																												
							data: {sh_nos: sh_nos, remark: remark},																																													
							dataType: 'json',																																											
							success: function (data) {
								if(data.code == "ok"){
									layer.msg('操作成功',{
										icon: 1,
										time: 2000
									});
									
									layer.close(index);
									tab.reload({
										where: {
											data: self.searchData
										}
									});
								}else if(data.code == "error"){
									layer.msg(data.msg,{
										icon: 2,
										time: 2000
									});
								}
							}																																															
						});
					}
					
					return false;
				},
				cancel: function (index, layero) {																																					
					
				}																																													
			});
		},
		addAfterSale:function(plan){
			var self = this;
			
			$("#edit-pages2-tid").val("");
			$("#edit-pages3-extra_amtn").val("");
			$("#edit-pages3-alipay_no").val("");
			
			if(plan == "bf"){
				var title = "售后补发";
			}else if(plan == "tk"){
				var title = "售后退款";
			}
			
			layer.open({
				type: 1,																																											
				title: title,																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['370px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#edit-pages2"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var tid = $("#edit-pages2-tid").val();
					
					$.ajax({																																														
						url: "/index.php?m=afterSale&c=afterSaleManage&a=addAfterSaleCheck",																																		
						type: 'post',																																												
						data: {tid: tid},																																													
						dataType: 'json',																																											
						success: function (data) {
							if(data.code == "ok"){
								if(data.has == "yes"){//已存在售后
									layer.confirm('订单已存在售后单，继续?', {icon: 3, title:'提示'}, function(index2){
										layer.close(index);
										layer.close(index2);
										if(plan == "bf"){//补发
											layer.open({
												title :'补发开单',
												type: 2,
												shade: 0.3,
												area: ['1000px', '500px'],
												maxmin: false,
												content: '?m=system&c=delivery&a=addOrders',
												success: function(layero, index){
													var body = layer.getChildFrame('body', index);
													var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
													iframeWin.vueObj.loadOrders(tid,{'action': 'bufa', 'new_tid': tid});
												}
											});
										}else if(plan == "tk"){//退款
											layer.open({																																											
												type: 1,																																											
												title: '退款信息录入',																																								
												skin: 'layui-layer-rim', //加上边框																																					
												area: ['470px', '300px'], //宽高																																					
												shade: 0.3,																																											
												content: $("#edit-pages3"),
												btn: ['确定', '取消'],
												yes: function(index, layero){
													layer.close(index);
													var extra_amtn = $("#edit-pages3-extra_amtn").val();
													var alipay_no = $("#edit-pages3-alipay_no").val();
													
													self.afterSaleRefund(tid,extra_amtn,alipay_no);
													return false;
												},
												cancel: function (index, layero) {																																					
													
												}																																													
											});
										}
									},
									function(index2){
										layer.close(index);
									});
								}else if(data.has == "no"){
									layer.close(index);
									if(plan == "bf"){//补发
										layer.open({
											title :'补发开单',
											type: 2,
											shade: 0.3,
											area: ['1000px', '500px'],
											maxmin: false,
											content: '?m=system&c=delivery&a=addOrders',
											success: function(layero, index){
												var body = layer.getChildFrame('body', index);
												var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
												iframeWin.vueObj.loadOrders(tid,{'action': 'bufa', 'new_tid': tid});
											}
										});
									}else if(plan == "tk"){//退款
										layer.open({																																											
											type: 1,																																											
											title: '退款信息录入',																																								
											skin: 'layui-layer-rim', //加上边框																																					
											area: ['470px', '300px'], //宽高																																					
											shade: 0.3,																																											
											content: $("#edit-pages3"),
											btn: ['确定', '取消'],
											yes: function(index, layero){
												layer.close(index);
												var extra_amtn = $("#edit-pages3-extra_amtn").val();
												var alipay_no = $("#edit-pages3-alipay_no").val();
												
												self.afterSaleRefund(tid,extra_amtn,alipay_no);
												return false;
											},
											cancel: function (index, layero) {																																					
												
											}																																													
										});
									}
								}
							}else if(data.code == "error"){
								layer.msg(data.msg,{
									icon: 2,
									time: 2000
								});
							}
						}																																															
					});
					
					return false;
				},
				cancel: function (index, layero) {																																					
					
				}																																													
			});
		},
		afterSaleRefund: function(tid,extra_amtn,alipay_no){
			var self = this;
			$.ajax({																																														
				url: "/index.php?m=afterSale&c=afterSaleManage&a=afterSaleRefund",																																		
				type: 'post',																																												
				data: {tid: tid, extra_amtn: extra_amtn, alipay_no: alipay_no},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.msg('操作成功',{
							icon: 1,
							time: 2000
						});
						
						tab.reload({
							where: {
								data: self.searchData
							}
						});
					}else if(data.code == "error"){
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});
					}
				}																																															
			});

		}
	},
});	

$('.dropdown-toggle').dropdown();

function timeChange(value){
	if(value == "taday"){
		$("#dateBegin").val(nowDateDay);
		$("#dateEnd").val(nowDate);
	}else if(value == "week"){
		$("#dateBegin").val(nowDateWeek);
		$("#dateEnd").val(nowDate);
	}else if(value == "month"){
		$("#dateBegin").val(nowDateMonth);
		$("#dateEnd").val(nowDate);
	}else if(value == "three_month"){
		$("#dateBegin").val(nowDate3Month);
		$("#dateEnd").val(nowDate);
	}
}

function tableReload(){
	tab.reload({
		where: {
			data: tableList.searchData
		}
	});
}