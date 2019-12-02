var flow = new Vue({
	el: '#flow',
	data: {
		tab:"",
		cus_no:"",
		cus_detail:"",
		payment_time:"",
		return_arr:[],
		arrears_arr:[],
	},
	mounted: function() {
		var self = this;
        //var jqtb;
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=system&c=stall_navigation&a=getSupplier'
					
					,cols: [[
					   {checkbox: true, fixed: true}
					  //,{field:'right', title: '操作',"width":70 ,toolbar: '#barDemo'}
					  ,{field:'right', title: '操作',"width":120,toolbar: '#barDemo'}
					  ,{field:'cus_no', title: '供应商编码',"width":220}
					  ,{field:'cus_name', title: '供应商名称',"width":220}
					  ,{field:'linkman', title: '联系人',"width":180}
					  ,{field:'wangwang', title: '旺旺',"width":180, "templet": '#sexTpl1', "edit": 'text'}
					  ,{field:'weixin', title: '微信',"width":180, "edit": 'text'}
					  ,{field:'mobile', title: '供应商电话',"width":140, "edit": 'text'}
					  ,{field:'arrears', title: '欠款金额',"width":120, "templet": '#sexTpl'}
					  
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-103'
				  });
				  
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var day = date.getDate(); 
				
				var nowDate = year + "-" + month + "-" + day;          //当前日期
				self.payment_time = nowDate;						   //销售日期默认值为当前时间
				//限定可选日期
				var ins22 = laydate.render({
					elem: '#test-limit1'
					,max: nowDate
					,ready: function(){
						
					},
					value: nowDate
					,done: function(value, date){
						self.payment_time = value;
					}
				});
				 
				  var $ = layui.$, active = {
						reload: function(){
					  
							tab.reload({
								where: {
									cus_name:$("#cusName").val(),
									mobile:$("#cusPhone").val()
								}
							});
						},
						
						getCheckData: function(){
							var checkStatus = table.checkStatus('testReload')
							,data = checkStatus.data;
							if(data.length == 0){
								layer.msg("请至少选择一条数据",{
									icon: 0,
									time: 2000
								});
								return false;
							}
							
							layer.confirm('含有采购信息的供应商将无法删除！确定删除选中数据么？', {
							  btn: ['确定', '取消'] //可以无限个按钮
							  ,btn3: function(index, layero){
								//按钮【按钮三】的回调
							  }
							}, function(index, layero){
								//按钮【按钮一】的回调
								var cus_no = "";
								for(var i = 0; i < data.length; i++){
									cus_no += (data[i].cus_no+",");
								}
								
								$.ajax({
									url: "/index.php?m=system&c=stall_navigation&a=delete_spp",
									data: {cus_no:cus_no},
									dataType: "json",
									type: "POST",
									success: function (data) {
										if(data.code == "ok"){
											layer.msg("操作成功",{
												icon: 1,
												time: 2000
											});
											$(".layui-laypage-btn").click();
										}else{
											layer.msg("含有采购信息的供应商无法删除",{
												icon: 0,
												time: 2000
											});
										}
									}
								});
								
							}, function(index){
							  //按钮【按钮二】的回调
							});
						},
				  };
				  self.tab = active;
				  
				  table.on('tool(user)', function(obj){
						var data = obj.data;
						self.id = data.id;
						if(obj.event === 'charge_detail'){
							$(".isShow1").addClass("layui-show");
							$(".isShow2").removeClass("layui-show");
							$(".this1").addClass("layui-this");
							$(".this2").removeClass("layui-this");
							$(".this3").removeClass("layui-this");
							$.ajax({
								url: "/index.php?m=system&c=stall_navigation&a=get_cus_no",
								data: {cus_no:data.cus_no},
								dataType: "json",
								type: "POST",
								success: function (data) {
									if(data.detail){
										self.cus_no = data.detail.cus_no;
										var detail = data.detail;
										self.cus_detail = data.row;
										self.get_return();
										layer.open({																																											
											type: 1,																																											
											title: false,																																									
											skin: 'layui-layer-rim', //加上边框																																					
											area: ['600px', '100%'], //宽高		
											anim: 2,
											shade: 0.3,
											shadeClose:true,
											offset: 'rt',
											content: $("#detail"),
											cancel: function (index, layero) {																																					
												
											},
											success:function(layero,index){
												
												$("#edit_name").val(detail.cus_name);
												$("#edit_mobile").val(detail.mobile);
												$("#edit_linkman").val(detail.linkman);
												$("#edit_weixin").val(detail.weixin);
												$("#edit_wangwang").val(detail.wangwang);
												
											},
											end:function(){							//窗口销毁后重置页面数据
												
											}
										});
										
									}else{
										layer.msg(data.msg,{
											icon: 0,
											time: 2000
										});
									}
								}
							});
						} else if(obj.event === 'rece'){
							$(".isShow1").removeClass("layui-show");
							$(".isShow2").addClass("layui-show");
							$(".this1").removeClass("layui-this");
							$(".this2").addClass("layui-this");
							$(".this3").addClass("layui-this");
							$.ajax({
								url: "/index.php?m=system&c=stall_navigation&a=get_cus_no",
								data: {cus_no:data.cus_no},
								dataType: "json",
								type: "POST",
								success: function (data) {
									if(data.detail){
										self.cus_no = data.detail.cus_no;
										var detail = data.detail;
										self.cus_detail = data.row;
										self.get_return();
										layer.open({																																											
											type: 1,																																											
											title: false,																																									
											skin: 'layui-layer-rim', //加上边框																																					
											area: ['600px', '100%'], //宽高		
											anim: 2,
											shade: 0.3,
											shadeClose:true,
											offset: 'rt',
											content: $("#detail"),
											cancel: function (index, layero) {																																					
												
											},
											success:function(layero,index){
												
												$("#edit_name").val(detail.cus_name);
												$("#edit_mobile").val(detail.mobile);
												$("#edit_linkman").val(detail.linkman);
												$("#edit_weixin").val(detail.weixin);
												$("#edit_wangwang").val(detail.wangwang);
												
											},
											end:function(){							//窗口销毁后重置页面数据
												
											}
										});
										
									}else{
										layer.msg(data.msg,{
											icon: 0,
											time: 2000
										});
									}
								}
							});
						}else if(obj.event === 'buy'){
							var url = "/index.php?m=PT&c=purchase&a&a=index&cus_no="+data.cus_no+"&cus_name="+encodeURIComponent(data.cus_name);
							parent.parent.addTab("采购",url,"采购");
						}else if(obj.event === 'pay_back'){
							self.cus_no = data.cus_no;
							self.return_supplier();
						}
				  });
				  
				  //监听单元格编辑
				  table.on('edit(user)', function(obj){
					var value = obj.value //得到修改后的值
					,data = obj.data //得到所在行所有键值
					,field = obj.field; //得到字段
					
					$.ajax({
							url: "/index.php?m=system&c=stall_navigation&a=change_text",
							data: {data:data},
							dataType: "json",
							type: "POST",
							success: function (data) {
								if(data.code == "ok"){
									layer.msg(data.msg,{
										icon: 1,
										time: 2000
									});
									$(".layui-laypage-btn").click();
								}else{
									layer.msg(data.msg,{
										icon: 0,
										time: 2000
									});
								}
							}
						});
					
				  });
				  
				  
				 //监听折叠
				  element.on('collapse(test)', function(data){
					if(data.show){
						self.get_return();
					}
				  });
				  
				  $('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					active[type] ? active[type].call(this) : '';
				  });
				  
				  $('.layui-btn').on('click', function(){
					var type = $(this).data('type');
					active[type] ? active[type].call(this) : '';
				  });
				  
				 $(".key_down").on("keydown",function(){
					  var e = event || window.event;
					  if(e.keyCode == 13){
						var type = $(this).data('type');
						active[type] ? active[type].call(this) : '';
					  }
					  
				  });
				
			});
		});

	},
	methods: {
		reset_now:function(){
			$("#cusName").val("");
			$("#cusPhone").val("");
		},
		
		
		//新增供应商弹窗
		newAdd:function(){
			var self = this;
			layer.open({																																											
				type: 1,																																											
				title: '新增供应商',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['748px', '420px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#addSupplier"),	
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var cus_no = $("#add_no").val();
					var cus_name = $("#add_name").val();
					var mobile = $("#add_mobile").val();
					var linkman = $("#add_linkman").val();
					var wangwang = $("#add_wangwang").val();
					var qq = $("#add_qq").val();
					var weixin = $("#add_weixin").val();
					
					if(cus_name == ""){
						layer.msg('请输入供应商名称',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}
					
					if(mobile == ""){
						layer.msg('请输入供应商电话',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}
					
					$.ajax({
						url: "/index.php?m=system&c=stall_navigation&a=save_new",
						data: {cus_no:cus_no,cus_name:cus_name,linkman:linkman,qq:qq,wangwang:wangwang,weixin:weixin,mobile:mobile},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								layui.use(['table','element','layer','form','laydate'], function(){
								  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
								  var laydate = layui.laydate;
								  self.tab.reload();
								});
								layer.close(index);
							}else{
								layer.msg(data.msg,{
									icon: 0,
									time: 2000
								});
							}
						}
					});
					
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function (index, layero) {																																					
																																																	
				},
				success:function(){
					$("#add_no").val("");
					$("#add_name").val("");
					$("#add_no").focus();
					$("#add_mobile").val("");
					$("#add_linkman").val("");
					$("#add_qq").val("");
					$("#add_weixin").val("");
					$("#add_wangwang").val("");
				}				
			});
		},
		
		edit_save:function(){
			var self = this;
			var cus_name = $("#edit_name").val();
			var mobile = $("#edit_mobile").val();
			var linkman = $("#edit_linkman").val();
			var wangwang = $("#edit_wangwang").val();
			var qq = $("#edit_qq").val();
			var weixin = $("#edit_weixin").val();
			if(cus_name == ""){
    			layer.msg('请输入供应商名称',{
    				icon: 0,
    				time: 2000
    			});																																													
    			return false;
    		}
    		
    		if(mobile == ""){
    			layer.msg('请输入供应商电话',{
    				icon: 0,
    				time: 2000
    			});																																													
    			return false;
    		}
			$.ajax({
				url: "/index.php?m=system&c=stall_navigation&a=edit_save",
				data: {cus_name:cus_name,linkman:linkman,qq:qq,wangwang:wangwang,weixin:weixin,mobile:mobile,cus_no:self.cus_no,id:self.id},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						$(".layui-laypage-btn").click();
						layer.closeAll();
					}else{
						layer.msg(data.msg,{
							icon: 0,
							time: 2000
						});
					}
				}
			});
			
		},
		
		cancel:function(){
			layer.closeAll();
		},
		
		//还款
		return_supplier:function(){
			var self = this;
			layer.open({																																											
				type: 1,																																											
				title: '还款',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['400px', '360px'], //宽高
				shade: 0.3,
				shadeClose:true,
				content: $("#return_supplier"),
				btn:['确定还款','取消'],
				yes:function(index){
					
					var return_payment = $("#return_payment").val();
					var return_mark = $("#return_mark").val();
					var time = self.payment_time;
					var arrears = $("#return_arrears").val();
					
					if(return_payment*1 > arrears*1){
						layer.msg("还款金额大于欠款金额，请重新输入",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					
					if(return_payment === "" || return_payment === 0){
						layer.msg("请输入还款金额",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					
					if(return_payment <= 0){
						layer.msg("请输入正确的还款金额",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					
					$.ajax({
						url: "/index.php?m=system&c=stall_navigation&a=return_payment",
						data: {return_payment:return_payment,return_mark:return_mark,time:time,cus_no:self.cus_no},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								
								layer.close(index);
							
								$.ajax({
									url: "/index.php?m=system&c=stall_navigation&a=get_cus_no",
									data: {cus_no:self.cus_no},
									dataType: "json",
									type: "POST",
									success: function (data) {
										self.cus_detail = data.row;
										self.get_return();
									}
								});
								layui.use(['table','element','layer','form','laydate'], function(){
								  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
								  var laydate = layui.laydate;
								  self.tab.reload();
								});
							}else{
								layer.msg(data.msg,{
									icon: 0,
									time: 2000
								});
							}
						}
					});
					
				},
				cancel: function (index, layero) {																																					
					
				},
				success:function(layero,index){
					var date = new Date();
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var day = date.getDate();
					var nowDate = year + "-" + month + "-" + day;          //当前日期
					$("#test-limit1").val(nowDate);
					$("#return_payment").val('');
					$("#return_mark").val('');
					
					$.ajax({
						url: "/index.php?m=system&c=stall_navigation&a=get_cus_no_arrears",
						data: {cus_no:self.cus_no},
						dataType: "json",
						type: "POST",
						success: function (data) {
							$("#return_arrears").val(data.arrears);
						}
					});
					
				},
				end:function(){							//窗口销毁后重置页面数据
					
				}
			});
		},
		
		tab2:function(){
			var self = this;
			
			$.ajax({
				url: "/index.php?m=system&c=stall_navigation&a=get_cus_no",
				data: {cus_no:self.cus_no},
				dataType: "json",
				type: "POST",
				success: function (data) {
					self.cus_detail = data.row;
					self.get_return();
				}
			});
		},
		tab3:function(){
			var self = this;
			
			layui.use(['table'], function(){
				var table = layui.table;
				table.render({
					elem: '#LAY_table_user2'
					,url: 'index.php?m=system&c=stall_navigation&a=get_arrears'

					,cols: [[
						{field:'effect_date', title: '日期',"width":220}
						,{field:'total_fee', title: '欠款金额',"width":180}
					]]
					,id: 'testReload2'
					,page: true
					,height: '500px'
					,method: 'post'
					,where: {
						cus_no: self.cus_no,
					}
				});
			});
		},
		//获取还款信息明细
		get_return:function(){
			var self = this;
			
			$.ajax({
				url: "/index.php?m=system&c=stall_navigation&a=get_return",
				data: {cus_no:self.cus_no},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data){
						self.return_arr = data;
					}else{
						self.return_arr = [];
					}
					
				}
			});
			
		}
	}
});