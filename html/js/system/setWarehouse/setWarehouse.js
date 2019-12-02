var flow = new Vue({
	el: '#flow',
	data: {
		warehouse:[],
		tab:"",
		add_index:"",
		edit_index:"",
		no_sku1:0,
		no_sku2:0,
		edit_no_sku1:0,
		edit_no_sku2:0,
	},
	mounted: function() {
		var self = this;
        //var jqtb;
		
		self.getWarehouse();
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				
			});
		});

	},
	methods: {
		
		getWarehouse:function(){
			var self = this;
			$.ajax({
				url: "/index.php?m=system&c=analysis&a=getWarehouse",
				data: {},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data){
						self.warehouse = data;
						setTimeout(function(){
							$('.skin-minimal input').iCheck({
								checkboxClass: 'icheckbox_minimal',
								radioClass: 'iradio_minimal',
								increaseArea: '20%'
							});
						},100)
						

					}else{
						self.warehouse = [];
					}
				}
			});
		},
		
		add_keydown:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				self.save_add();
			}
		},
		
		newAdd:function(){
			var self = this;
			layer.open({																																											
				type: 1,																																											
				title: '新增仓库',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['730px', '250px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#add"),	
				btn: ['保存', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					
					self.save_add();
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function (index, layero) {																																					
																																																	
				},
				success:function(layero,index){
					$("#add_name").val("");
					$("#add_name").focus();
					self.add_index = index;
					$("input[name='no_sku']").iCheck('uncheck');
					self.no_sku1 = 0;
					self.no_sku2 = 0;
					
				}
			});
		},
		
		//新增保存方法
		save_add:function(){
			var self = this;
			var name = $("#add_name").val();
			if(name == ""){
				layer.msg('请输入仓库名称',{
					icon: 0,
					time: 2000
				});																																													
				return false;
			}
			
			$.ajax({
				url: "/index.php?m=system&c=setWarehouse&a=add_new",
				data: {name:name,no_sku1:self.no_sku1,no_sku2:self.no_sku2},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						self.getWarehouse();
						layer.close(self.add_index);
					}else{
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});
					}
				}
			});
		},
		
		edit_keydown:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				self.edit_save();
			}
		},
			
		//编辑
		edit:function(){
			var self = this;
			if($("input[name='wh']").filter(':checked').length == 0){																															
				layer.msg('请选择一条数据',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}	
			
			if($("input[name='wh']").filter(':checked').length > 1){																															
				layer.msg('只能选择一条数据',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}

			var click_index = "";
			
			$("input[name='wh']:checkbox").each(function(){																										
				if(true == $(this).is(':checked')){																																				
					click_index = $(this).attr("index");																																				
				}																																							
			});

			layer.open({																																											
				type: 1,																																											
				title: '编辑仓库',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['730px', '250px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#edit"),	
				btn: ['保存', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					self.edit_save();
					
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function (index, layero) {																																					
																																																	
				},
				success:function(layero,index){
					$("#edit_name").val(self.warehouse[click_index].name);
					
					if(self.warehouse[click_index].not_sku1 == "1"){
						$("#edit_no_sku1").iCheck('check');
					}else{
						$("#edit_no_sku1").iCheck('uncheck');
					}
					
					if(self.warehouse[click_index].not_sku2 == "1"){
						$("#edit_no_sku2").iCheck('check');
					}else{
						$("#edit_no_sku2").iCheck('uncheck');
					}
					
					$("#edit_name").focus();
					self.edit_index = index;
					
				}
			});
			
		},
		
		edit_save:function(){
			var self = this;
			var wh = "";
			var id = "";
			
			$("input[name='wh']:checkbox").each(function(){																										
				if(true == $(this).is(':checked')){																																				
					wh = $(this).val();	
					id= $(this).prop("id");	
				}																																							
			});
			var name = $("#edit_name").val();
			if(name == ""){
				layer.msg('请输入仓库名称',{
					icon: 0,
					time: 2000
				});																																													
				return false;
			}
			
			$.ajax({
				url: "/index.php?m=system&c=setWarehouse&a=edit",
				data: {name:name,wh:wh,edit_no_sku1:self.edit_no_sku1,edit_no_sku2:self.edit_no_sku2,id:id},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						self.getWarehouse();
						$("input[name='wh']").iCheck('uncheck');
						layer.close(self.edit_index);
					}else{
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});
					}
				}
			});
		},
		
		//删除 
		delete_now:function(){
			var self = this;
			
			if($("input[name='wh']").filter(':checked').length == 0){																															
				layer.msg('请选择一条数据',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}	
			
			layer.confirm('确定删除么？', {
				btn: ['确定', '取消'] //可以无限个按钮
					,btn3: function(index, layero){
						//按钮【按钮三】的回调
					}
				}, function(index, layero){
					//按钮【按钮一】的回调
					
					var wh = "";
			
					$("input[name='wh']:checkbox").each(function(){																										
						if(true == $(this).is(':checked')){																																				
							wh += ($(this).val()+",");																																				
						}																																							
					});
					
					$.ajax({
						url: "/index.php?m=system&c=setWarehouse&a=delete_now",
						data: {name:name,wh:wh},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								if(data.msg == ""){
									layer.msg("删除成功",{
										icon: 1,
										time: 2000
									});
								}else{
									layer.msg("("+data.msg+")仓库含有库存，无法删除",{
										icon: 0,
										time: 2000
									});
								}
								
								self.getWarehouse();
								$("input").iCheck('uncheck');
								layer.close(index);
							}else{
								layer.msg(data.msg,{
									icon: 2,
									time: 2000
								});
							}
						}
					});
					
				}, function(index){
					//按钮【按钮二】的回调
			});
			
			
			
		}
		
	}
});

$('#all').on('ifChecked ifUnchecked', function(event){																																			
																																																	
	if (event.type == 'ifChecked') {																																								
		$("input[name='wh']").iCheck('check');																																		
	} else {																																														
		$("input[name='wh']").iCheck('uncheck');																																	
	}																																																
});	

$('#no_sku1').on('ifChecked ifUnchecked', function(event){																																			
																																																	
	if (event.type == 'ifChecked') {																																								
		flow.no_sku1 = 1;																																		
	} else {																																														
		flow.no_sku1 = 0;																																
	}																																																
});	

$('#no_sku2').on('ifChecked ifUnchecked', function(event){																																			
																																																	
	if (event.type == 'ifChecked') {																																								
		flow.no_sku2 = 1;																																		
	} else {																																														
		flow.no_sku2 = 0;																																
	}																																																
});	

$('#edit_no_sku1').on('ifChecked ifUnchecked', function(event){																																			
																																																	
	if (event.type == 'ifChecked') {																																								
		flow.edit_no_sku1 = 1;																																		
	} else {																																														
		flow.edit_no_sku1 = 0;																																
	}																																																
});

$('#edit_no_sku2').on('ifChecked ifUnchecked', function(event){																																			
																																																	
	if (event.type == 'ifChecked') {																																								
		flow.edit_no_sku2 = 1;																																		
	} else {																																														
		flow.edit_no_sku2 = 0;																																
	}																																																
});	

$(document).ready(function(){
	$('.skin input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
	});
});
