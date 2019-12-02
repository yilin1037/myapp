var flow = new Vue({
	el: '#flow',
	data: {
		price:0,
		dateBegin:"",
		dateEnd:"",
		isShow:false,
		isShow1:false,
		isShow2:false,
		isShow3:false,
		group:[],
		cus_no:"",
		tab:"",
		label:[],
		phone:"",
		payWay:"",
		page1Arr:[],
		page2Arr:[],
		search_grade:"",
		search_group:"",
		search_label:"",
		classArr:[],
	},
	mounted: function() {
		var self = this;
        //var jqtb;
		
		self.get_group_now();
		self.get_label_now();
		self.get_class_now();
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=system&c=customer&a=getData'
					,cols: [[
					   {checkbox: true, fixed: true}
					  ,{field:'right', title: '操作',"width":120 ,toolbar: '#barDemo1',"fixed":true}
					  //,{field:'cus_no', title: '编号',"width":180}
					  ,{field:'cus_name', title: '名称',"width":180}
					  ,{field:'wangwang', title: '旺旺',"width":120, "templet": '#sexTpl1', "edit": 'text'}
					  ,{field:'weixin', title: '微信',"width":120, "edit": 'text'}
					  ,{field:'label', title: '标签',"width":120}
					  ,{field:'mobile', title: '电话',"width":120, "edit": 'text'}
					  ,{field:'type', title: '分组',"width":120}
					  ,{field:'level', title: '类型',"width":100}
					  ,{field:'consume', title: '累计消费',"width":160,"templet":"<div><span>{{ d.consume }}</span><a class='look_detail' onclick='look_page1(\"{{d.cus_no}}\")'>查看详情</a></div>"}
					  ,{field:'payment', title: '累计付款',"width":160,"templet":"<div><span>{{ d.payment }}</span><a class='look_detail' onclick='look_page2(\"{{d.cus_no}}\")'>查看详情</a></div>"}
					  ,{field:'arrears', title: '当前欠款',"width":100, "templet": '#sexTpl'}
					  ,{field:'credit_pay', title: '信用额度',"width":100, "edit": 'text'}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-133'
				  });
				 
				  var $ = layui.$, active = {
					reload: function(){
					  
					  tab.reload({
						
						where: {
							names:$(".names").val(),
							group:self.search_group,
							label:self.search_label,
							grade:self.search_grade,
							con_begin:$(".con_begin").val(),
							con_end:$(".con_end").val(),
							ear_begin:$(".ear_begin").val(),
							ear_end:$(".ear_end").val()
						}
					  });
					},
					getCheckData: function(){ //获取选中数据
					  var checkStatus = table.checkStatus('testReload')
					  ,data = checkStatus.data;
					  var cus_no = "";
					  for(var i = 0; i < data.length; i++){
						  cus_no += (data[i].cus_no + ",");
					  }
					  self.cus_no = cus_no;
					},
					sendMessage: function(){ //获取选中数据
					  var checkStatus = table.checkStatus('testReload')
					  ,data = checkStatus.data;
					  var phone = "";
					  for(var i = 0; i < data.length; i++){
						 phone += (data[i].mobile + ",");
					  }
					  
						$.ajax({
							url: "/index.php?m=system&c=customer&a=sendMessage",
							data: {phone:phone},
							dataType: "json",
							type: "POST",
							success: function (data) {
								if(data.code == "ok"){
									layer.msg(data.msg,{
										icon: 1,
										time: 2000
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
					
					remove: function(){//删除客户
						var checkStatus = table.checkStatus('testReload')
						,data = checkStatus.data;
					
						var new_data = "";
						for(var i = 0; i < data.length; i++){
							new_data += (data[i].cus_no + ",");
						}
						
						if(new_data == ""){
							layer.msg("请选择至少一条数据",{
								icon: 0,
								time: 2000
							});
							return false;
						}
						
						layer.confirm('被删除的用户欠款等信息将被彻底清除，该客户的以往消费记录将变为普通零售', {
							title:"提示",
							btn: ['确定', '取消'] //可以无限个按钮
							,btn3: function(index, layero){
								//按钮【按钮三】的回调
							}
						}, function(index, layero){
							//按钮【按钮一】的回调
							
							$.ajax({
								url: "/index.php?m=system&c=customer&a=remove",
								data: {cus_no:new_data},
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
							
						}, function(index){
							//按钮【按钮二】的回调
						});
						
					}
				  };
				  
				  self.tab = active;
				  
				  //监听单元格编辑
				  table.on('edit(user)', function(obj){
					var value = obj.value //得到修改后的值
					,data = obj.data //得到所在行所有键值
					,field = obj.field; //得到字段
					
					$.ajax({
							url: "/index.php?m=system&c=customer&a=change_text",
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
				  
				   //监听工具条
				  table.on('tool(user)', function(obj){
					var data = obj.data;
					if(obj.event === 'rece'){				//收款
						layer.open({																																											
							type: 1,																																											
							title: '收款',																																									
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['548px', '450px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#return_receivables"),	
							btn: ['收款', '取消']
							,yes: function(index, layero){
								//按钮【按钮一】的回调
								var receve = $("#arrears").val();
								var money = $(".cus_arrears").html()*1;
								
								if(receve === "" || receve === 0){
									layer.msg("请输入收款金额",{
										icon: 0,
										time: 2000
									});
									return false;
								}
								
								/*if(receve > money){
									layer.msg("收款金额不能大于欠款金额，请重新输入",{
										icon: 0,
										time: 2000
									});
									return false;
								}*/
								
								if(self.payWay == ""){
									layer.msg("请选择收款方式",{
										icon: 0,
										time: 2000
									});
									return false;
								}
								
								$.ajax({
									url: "/index.php?m=system&c=stall_navigation&a=updateNow",
									data: {cus_no:data.cus_no,money:receve,payWay:self.payWay},
									dataType: "json",
									type: "POST",
									success: function (data) {
										if(data){
											if(data.code == "ok"){
												layer.msg("操作成功",{
													icon: 1,
													time: 2000
												});
												$(".layui-laypage-btn").click();
												layer.close(index);
											}
										}else{
											layer.msg("操作失败",{
												icon: 2,
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
								$("#arrears").val("");
								self.payWay = "";
								$(".choose_way").each(function(){
									$(this).css("borderColor","#dddddd");
								});
								$(".cus_name").html(data.cus_name);
								$(".cus_mobile").html(data.mobile);
								$(".cus_consume").html(data.consume);
								$(".cus_payment").html(data.payment);
								$(".cus_arrears").html(data.arrears);
								
							}
						});
					}else if(obj.event === 'kaidan'){				//开单
						var url = "/index.php?m=system&c=sellOut&a=sellOut&cus_no="+data.cus_no+"&mobile="+data.mobile;
						parent.parent.addTab("开单",url,"开单");
					}else if(obj.event === 'timer'){				//修改
						console.log(data);
						layer.open({
							type: 1,
							title: '修改客户',
							skin: 'layui-layer-rim', 
							area: ['748px', '450px'], 
							shade: 0.3,
							content: $("#addClass"),	
							btn: ['保存', '取消']
							,yes: function(index, layero){
								//按钮【按钮一】的回调
								var cus_name = $("#add_name").val();
								var type = $("#add_group").val();
								var level = $("#add_grade").val();
								var label = $("#add_label").val();
								var wangwang = $("#add_wangwang").val();
								var weixin = $("#add_wx").val();
								var mobile = $("#add_phone").val();
								var credit_pay = $("#add_credit").val();
								if(cus_name == ""){
									layer.msg('请输入名称',{
										icon: 0,
										time: 2000
									});
									return false;
								}
								if(mobile == ""){
									layer.msg('请输入手机号',{
										icon: 0,
										time: 2000
									});
									return false;
								}
								
								$.ajax({
									url: "/index.php?m=system&c=customer&a=update_new",
									data: {cus_name:cus_name,type:type,level:level,wangwang:wangwang,weixin:weixin,mobile:mobile,credit_pay:credit_pay,label:label,cus_no:data['cus_no'],},
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
								
							},
							success:function(){
								$("#add_name").val(data['cus_name']);
								$("#add_name").focus();
								$("#add_group").val(data['type_id']);
								$("#add_grade").val(data['level_id']);
								$("#add_label").val(data['label_id']);
								$("#add_wangwang").val(data['wangwang']);
								$("#add_wx").val(data['weixin']);
								$("#add_phone").val(data['mobile']);
							}				
						});
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
		reset:function(){
			var self = this;
			$(".names").val("");
			$("#group").val("");
			$("#label").val("");
			$("#grade").val("");
			$(".con_begin").val("");
			$(".con_end").val("");
			$(".ear_begin").val("");
			$(".ear_end").val("");
			self.search_group = "";
			self.search_label = "";
			self.search_grade = "";
		},
		
		//选择支付方式
		choose_way:function(way){
			var self = this;
			$(".choose_way").each(function(){
				$(this).css("borderColor","#dddddd");
			});
			
			$("."+way).css("borderColor","#ff6a3c");
			
			if(way != "cash"){
				self.show = false;
			}else{
				self.show = true;
			}
			
			self.payWay = way;
			
		},
		
		turnTo:function(a,url){
			parent.addTab(a,url,a);
		},
		div_show:function(){
			var self = this;
			var e = event || window.event;
			e.stopPropagation();
			if(self.isShow == false){
				if(self.isShow1 == true){
					$(".hide_div1").css("display","none");
					self.isShow1 = false;
				}
				
				if(self.isShow2 == true){
					$(".hide_div2").css("display","none");
					self.isShow2 = false;
				}
				
				self.get_group_now();
				$(".hide_div").css("display","block");
				$("#group_name").val("");
				self.isShow = true;
			}else if(self.isShow == true){
				$(".hide_div").css("display","none");
				self.isShow = false;
			}
			
		},
		
		//新增客户弹窗
		newAdd:function(){
			var self = this;
			layer.open({																																											
				type: 1,																																											
				title: '新增客户',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['748px', '450px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#addClass"),	
				btn: ['保存', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var cus_name = $("#add_name").val();
					var type = $("#add_group").val();
					var level = $("#add_grade").val();
					var label = $("#add_label").val();
					var wangwang = $("#add_wangwang").val();
					var weixin = $("#add_wx").val();
					var mobile = $("#add_phone").val();
					var credit_pay = $("#add_credit").val();
					
					if(cus_name == ""){
						layer.msg('请输入名称',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}
					
					/*if(level == ""){
						layer.msg('请选择等级',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}*/
					
					if(mobile == ""){
						layer.msg('请输入手机号',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}
					
					$.ajax({
						url: "/index.php?m=system&c=customer&a=save_new",
						data: {cus_name:cus_name,type:type,level:level,wangwang:wangwang,weixin:weixin,mobile:mobile,credit_pay:credit_pay,label:label},
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
					
					$("#add_name").val("");
					$("#add_name").focus();
					$("#add_group").val("");
					$("#add_grade").val("");
					$("#add_wangwang").val("");
					$("#add_wx").val("");
					$("#add_phone").val("");
					$("#add_credit").val("");
				}				
			});
		},
		
		//新增分组
		add_group:function(){
			var self = this;
			layer.open({																																											
				type: 1,																																											
				title: '新增分组',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['748px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#add_new_group"),	
				btn: ['保存', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var name = $("#group_new_name").val();
					if(name == ""){
						layer.msg('请输入分组名称',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}
					
					$.ajax({
						url: "/index.php?m=system&c=customer&a=save_new_group",
						data: {name:name},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								layer.msg('操作成功',{
									icon: 1,
									time: 2000
								});
								
								layer.close(index);
							}else{
								layer.msg(data.msg,{
									icon: 2,
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
					$(".hide_div2").css("display","none");
					self.isShow3 = false;
					$("#class_new_name").val("");
					$("#class_new_name").focus();
				}
			});
		},
		
		//快速查询分组
		search_group:function(){
			var self = this;
			var name = $("#group_name").val();
			var e = event || window.event;
			if(e.keyCode == 13){
				$.ajax({
					url: "/index.php?m=system&c=customer&a=getGroup",
					data: {name:name},
					dataType: "json",
					type: "POST",
					success: function (data) {
						
						self.group = data;
						
						
					}
				});
			}
			
		},
		
		//快速查询标签
		search_label:function(){
			var self = this;
			var name = $("#label_name").val();
			var e = event || window.event;
			if(e.keyCode == 13){
				$.ajax({
					url: "/index.php?m=system&c=customer&a=getLabel",
					data: {name:name},
					dataType: "json",
					type: "POST",
					success: function (data) {
						
						self.label = data;
						
						
					}
				});
			}
			
		},
		
		//快速查询类型
		search_class:function(){
			var self = this;
			var name = $("#class_name").val();
			var e = event || window.event;
			if(e.keyCode == 13){
				$.ajax({
					url: "/index.php?m=system&c=customer&a=getClass",
					data: {name:name},
					dataType: "json",
					type: "POST",
					success: function (data) {
						
						self.classArr = data;
						
						
					}
				});
			}
			
		},
		
		//快速查询标签
		search_Class:function(){
			var self = this;
			var name = $("#class_name").val();
			var e = event || window.event;
			if(e.keyCode == 13){
				$.ajax({
					url: "/index.php?m=system&c=customer&a=getClass",
					data: {name:name},
					dataType: "json",
					type: "POST",
					success: function (data) {
						
						self.classArr = data;
						
						
					}
				});
			}
			
		},
		
		//移动分组选择分组
		choose_group:function(value){
			var self = this;
			if(self.cus_no == ""){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				$(".hide_div").css("display","none");
				self.isShow = false;
				return false;
			}else{
				$.ajax({
					url: "/index.php?m=system&c=customer&a=choose_group",
					data: {cus_no:self.cus_no,value:value},
					dataType: "json",
					type: "POST",
					success: function (data) {
						
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							$(".layui-laypage-btn").click();
							$(".hide_div").css("display","none");
							self.isShow = false;
						}else{
							layer.msg("操作成功",{
								icon: 1,
								time: 2000
							});
							$(".layui-laypage-btn").click();
							$(".hide_div").css("display","none");
							self.isShow = false;
						}
						
					}
				});
			}
		},
		
		div1_show:function(){
			var self = this;
			if(self.isShow1 == false){
				if(self.isShow == true){
					$(".hide_div").css("display","none");
					self.isShow = false;
				}
				
				if(self.isShow2 == true){
					$(".hide_div2").css("display","none");
					self.isShow2 = false;
				}
				
				self.get_label_now();
				
				$(".hide_div1").css("display","block");
				$("#label_name").val("");
				self.isShow1 = true;
			}else if(self.isShow1 == true){
				$(".hide_div1").css("display","none");
				self.isShow1 = false;
			}
		},
		
		div2_show:function(){
			var self = this;
			if(self.isShow3 == false){
				if(self.isShow == true){
					$(".hide_div").css("display","none");
					self.isShow = false;
				}
				
				if(self.isShow1 == true){
					$(".hide_div1").css("display","none");
					self.isShow1 = false;
				}
				
				if(self.isShow2 == true){
					$(".hide_div2").css("display","none");
					self.isShow2 = false;
				}
				
				self.get_label_now();
				
				$(".hide_div2").css("display","block");
				$("#class_name").val("");
				self.isShow3 = true;
			}else if(self.isShow3 == true){
				$(".hide_div2").css("display","none");
				self.isShow3 = false;
			}
		},
		
		
		//新增标签
		add_label:function(){
			var self = this;
			layer.open({																																											
				type: 1,																																											
				title: '新增标签',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['748px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#add_new_label"),	
				btn: ['保存', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var name = $("#label_new_name").val();
					if(name == ""){
						layer.msg('请输入标签名称',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}
					
					$.ajax({
						url: "/index.php?m=system&c=customer&a=save_new_label",
						data: {name:name},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								layer.msg('操作成功',{
									icon: 1,
									time: 2000
								});
								
								layer.close(index);
							}else{
								layer.msg(data.msg,{
									icon: 2,
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
					$(".hide_div1").css("display","none");
					self.isShow1 = false;
					$("#label_new_name").val("");
					$("#label_new_name").focus();
				}
			});
		},
		
		//新增类型
		add_class:function(){
			var self = this;
			$("#class_new_name").val("");
			layer.open({																																											
				type: 1,																																											
				title: '新增类型',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['748px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#add_new_class"),	
				btn: ['保存', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var name = $("#class_new_name").val();
					if(name == ""){
						layer.msg('请输入类型名称',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}
					
					$.ajax({
						url: "/index.php?m=system&c=customer&a=save_new_class",
						data: {name:name},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								layer.msg('操作成功',{
									icon: 1,
									time: 2000
								});
								
								layer.close(index);
							}else{
								layer.msg(data.msg,{
									icon: 2,
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
					$(".hide_div2").css("display","none");
					self.isShow2 = false;
					$("#label_new_name").val("");
					$("#label_new_name").focus();
				}
			});
		},
		
		//标记标签选择标签
		choose_label:function(value){
			var self = this;
			if(self.cus_no == ""){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				$(".hide_div1").css("display","none");
				self.isShow1 = false;
				return false;
			}else{
				$.ajax({
					url: "/index.php?m=system&c=customer&a=choose_label",
					data: {cus_no:self.cus_no,value:value},
					dataType: "json",
					type: "POST",
					success: function (data) {
						
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							$(".layui-laypage-btn").click();
							$(".hide_div1").css("display","none");
							self.isShow1 = false;
						}else{
							layer.msg("操作成功",{
								icon: 1,
								time: 2000
							});
							$(".layui-laypage-btn").click();
							$(".hide_div1").css("display","none");
							self.isShow1 = false;
						}
						
					}
				});
			}
		},
		
		//获取分组
		get_group_now:function(){
			var self = this;
			$.ajax({
				url: "/index.php?m=system&c=customer&a=getGroup",
				data: {},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data){
						self.group = data;
					}
					
				}
			});
		},
		
		get_label_now:function(){
			var self = this;
			$.ajax({
				url: "/index.php?m=system&c=customer&a=getLabel",
				data: {},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data){
						self.label = data;
					}
					
				}
			});
		},
		
		get_class_now:function(){
			var self = this;
			$.ajax({
				url: "/index.php?m=system&c=customer&a=getClass",
				data: {},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data){
						self.classArr = data;
					}
					
				}
			});
		},
		
		//选择等级弹窗
		choose_grade:function(){
			var self = this;
			if(self.isShow2 == false){
				if(self.isShow == true){
					$(".hide_div").css("display","none");
					self.isShow = false;
				}
				
				if(self.isShow1 == true){
					$(".hide_div1").css("display","none");
					self.isShow1 = false;
				}
				
				$(".hide_div2").css("display","block");
				self.isShow2 = true;
				self.get_class_now();
			}else if(self.isShow2 == true){
				$(".hide_div2").css("display","none");
				self.isShow2 = false;
			}
			
		},
		
		choose_class:function(value){
			var self = this;
			
			if(self.cus_no == ""){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				$(".hide_div2").css("display","none");
				self.isShow2 = false;
				return false;
			}else{
				$.ajax({
					url: "/index.php?m=system&c=customer&a=choose_class",
					data: {cus_no:self.cus_no,value:value},
					dataType: "json",
					type: "POST",
					success: function (data) {
						
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							$(".layui-laypage-btn").click();
							$(".hide_div2").css("display","none");
							self.isShow2 = false;
						}else{
							layer.msg("操作成功",{
								icon: 1,
								time: 2000
							});
							$(".layui-laypage-btn").click();
							$(".hide_div2").css("display","none");
							self.isShow2 = false;
						}
						
					}
				});
			}
		},
		
		//选择类型
		/*choose_grade_now:function(value){
			var self = this;
		
			if(self.cus_no == ""){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				$(".hide_div2").css("display","none");
				self.isShow2 = false;
				return false;
			}else{
				$.ajax({
					url: "/index.php?m=system&c=customer&a=choose_grade",
					data: {cus_no:self.cus_no,value:value},
					dataType: "json",
					type: "POST",
					success: function (data) {
						
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							$(".layui-laypage-btn").click();
							$(".hide_div2").css("display","none");
							self.isShow1 = false;
						}else{
							layer.msg("操作成功",{
								icon: 1,
								time: 2000
							});
							$(".layui-laypage-btn").click();
							$(".hide_div2").css("display","none");
							self.isShow1 = false;
						}
						
					}
				});
			}
		},*/
		
		//编辑以及删除 分组 标签
		edit_group:function(cla,configKey,type){
			var self = this;
			
			if(type == "customer_group"){
				var title = "编辑分组";
				var content = $("#edit_group");
			}else if(type == "customer_label"){
				var title = "编辑标签";
				var content = $("#edit_label");
			}else if(type == "customer_type"){
				var title = "编辑类型";
				var content = $("#edit_class");
			}
			
			if(cla == "edit"){
				layer.open({																																											
					type: 1,																																											
					title: title,																																									
					skin: 'layui-layer-rim', //加上边框																																					
					area: ['748px', '200px'], //宽高																																					
					shade: 0.3,																																											
					content: content,
					btn:['保存','取消'],
					yes:function(index){
						if(type == "customer_group"){
							var name = $("#edit_new_name").val();
						}else if(type == "customer_label"){
							var name = $("#edit_label_name").val();
						}else if(type == "customer_type"){
							var name = $("#edit_class_name").val();
						}
						
						if(name === ""){
							layer.msg("请输入名称",{
								icon: 0,
								time: 2000
							});
							return false;
						}
						
						$.ajax({
							url: "/index.php?m=system&c=customer&a=edit_group",
							data: {configKey:configKey,name:name,type:type},
							dataType: "json",
							type: "POST",
							success: function (data) {
								if(data.code == "ok"){
									layer.msg(data.msg,{
										icon: 1,
										time: 2000
									});
									self.get_group_now();
									self.get_label_now();
									self.get_class_now();
									$(".layui-laypage-btn").click();
									layer.close(index);
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
					success:function(){
						$("#edit_new_name").val("");
						$("#edit_label_name").val("");
						$("#edit_class_name").val("");
					}
				});
			}else if(cla == 'delete'){
				layer.confirm('确定删除么？', {
				  btn: ['确定', '取消'] //可以无限个按钮
				  ,btn3: function(index, layero){
					//按钮【按钮三】的回调
				  }
				}, function(index, layero){
					//按钮【按钮一】的回调
					
					$.ajax({
						url: "/index.php?m=system&c=customer&a=group_delete",
						data: {configKey:configKey,type:type},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								self.get_group_now();
								self.get_label_now();
								self.get_class_now();
								$(".layui-laypage-btn").click();
								layer.close(index);
							}
							
						}
					});
					
				}, function(index){
					//按钮【按钮二】的回调
				});
			}
			
			
		}
		
	}
});

function look_page1(cus_no){
	
	layer.open({																																											
		type: 1,																																											
		title: '累计消费详情',																																									
		skin: 'layui-layer-rim', //加上边框																																					
		area: ['748px', '500px'], //宽高																																					
		shade: 0.3,																																											
		content: $("#page1"),
		btn:['关闭'],
		cancel: function (index, layero) {																																					
																																															
		},
		success:function(){
			$.ajax({
				url: "/index.php?m=system&c=customer&a=getPage1",
				data: {cus_no:cus_no},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data){
						flow.page1Arr = data;
						//$("#page1_sa_no").val(data.sa_no);
						//$("#page1_effect_date").val(data.effect_date);
						//$("#page1_create_time").val(data.create_time);
						//$("#page1_total_fee").val(data.total_fee);
						//$("#page1_consume").val(data.consume);
						//$("#page1_discount").val(data.discount);
					}
				}
			});
		}
	});
}

function look_page2(cus_no){
	
	layer.open({																																											
		type: 1,																																											
		title: '累计付款详情',																																									
		skin: 'layui-layer-rim', //加上边框																																					
		area: ['748px', '400px'], //宽高																																					
		shade: 0.3,																																											
		content: $("#page2"),
		btn:['关闭'],
		cancel: function (index, layero) {																																					
																																															
		},
		success:function(){
			$.ajax({
				url: "/index.php?m=system&c=customer&a=getPage2",
				data: {cus_no:cus_no},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data){
						flow.page2Arr = data;
						//$("#page2_pay_no").val(data.pay_no);
						//$("#page2_payment").val(data.payment);
						//$("#page2_payment_time").val(data.payment_time);
						//$("#page2_payment_type").val(data.payment_type);
					}
				}
			});
		}
	});
}

function groupChange(value){
	flow.search_group = value;
	flow.tab.reload();
}

function labelChange(value){
	flow.search_label = value;
	flow.tab.reload();
}

function classChange(value){
	flow.search_grade = value;
	flow.tab.reload();
}
