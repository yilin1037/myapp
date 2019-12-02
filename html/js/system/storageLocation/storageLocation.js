var flow = new Vue({
	el: '#flow',
	data: {
		WhArr:[],			//仓库数组
		locArr:"",			//表数据数组
		wh:"",				//仓库编号
		layprint:[],        //打印机数组
	},
	mounted: function() {
		var self = this;
		
		$(".editBtn").removeClass("layui-btn-primary");
		$(".editBtn").addClass("layui-btn-disabled");
		$(".editBtn").prop("disabled",true);
		$(".btn_1").removeClass("layui-btn-disabled");
		$(".btn_1").addClass("layui-btn-primary");
		$(".btn_1").prop("disabled",false);
		$(".shop_1").css("backgroundColor","#bedef3");
		//======================================================================================日期选择器=======================================================================================================
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {																													
            var $ = layui.jquery, element = layui.element, layer = layui.layer ;																													
            var form = layui.form(),layer = layui.layer,layedit = layui.layedit,laydate = layui.laydate;																							
            // 初始化表格																																											
            var jqtb = $('#dateTable').DataTable({																																					
                "`dom": '<"top">rt<"bottom"flp><"clear">',																																			
                "autoWidth": false,                     // 自适应宽度																																
                "paging": true,																																										
                "pagingType": "full_numbers",																																						
                "processing": true,																																									
                "serverSide": true,//开启服务器获取数据																																				
                "fnServerParams": function (aoData) {																																				
                },																																													
                //请求url																																											
                "sAjaxSource": "index.php?m=system&c=message&a=getChildAccount",																													
                // 初始化表格																																										
            });																																														
																																																	
        });	
																																														
		//======================================================================================日期选择器结束===================================================================================================
		
		//this.getClass();   //--- 获取分类数组
		
		self.getWh();
		self.getLoc();
		
		
	},
	methods: {
		//===================================================左边导航栏切换事件==========================================================
		//
		//		$(event.target)[0].nodeName  由于导航样式为div包裹span，所以要判断目前点击的是div还是span，将背景色置给div
		//		all    : 所有分类   按钮点击
		//		not    : 为分类商品 按钮点击
		//
		//		btn_1  : 新增分类按钮
		//		btn_2  : 编辑分类按钮
		//		btn_3  : 删除分类按钮
		//
		//		class名:  layui-btn-disabled  layui 按钮不可编辑样式
		//				  layui-btn-primary   layui 按钮可编辑样式
		//      
		//===============================================================================================================================
		//		|
		//		|
		//	  \ | /
		//	   \|/
		backChange:function(type){
			var self = this;
			var value = "";
			$(".shop").each(function(){
				$(this).css("backgroundColor","white");
			});
			if($(event.target)[0].nodeName == "DIV"){
				$(event.target).css("backgroundColor","#bedef3");
				value = $(event.target).attr("value");
			}else if($(event.target)[0].nodeName == "SPAN"){
				$(event.target).parent().css("backgroundColor","#bedef3");
				value = $(event.target).parent().attr("value");
			}
			if(value == "all"){
				$(".editBtn").removeClass("layui-btn-primary");
				$(".editBtn").addClass("layui-btn-disabled");
				$(".editBtn").prop("disabled",true);
				$(".btn_1").removeClass("layui-btn-disabled");
				$(".btn_1").addClass("layui-btn-primary");
				$(".btn_1").prop("disabled",false);
				layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
					var $ = layui.jquery, element = layui.element, layer = layui.layer;
					var form = layui.form(), layer = layui.layer, layedit = layui.layedit, laydate = layui.laydate;
				});
				value = "";
			}else{
				$(".editBtn").removeClass("layui-btn-disabled");
				$(".editBtn").addClass("layui-btn-primary");
				$(".editBtn").prop("disabled",false);
			}
			
			
			self.wh = value;
			self.getLoc();
		},
		
		getLoc:function(){
			var self = this;
			//----------------------------- 表数据信息 ----------------------------------
			//		|
			//		|
			//	  \ | /
			//	   \|/
			$.ajax({																				
				url: "/index.php?m=system&c=storageLocation&a=getLoc",										
				type: 'post',																		
				data: {wh:self.wh},																	
				dataType: 'json',																	
				success: function (data) {															
					self.locArr = data;	
					$(document).ready(function(){
						$('.skin input').iCheck({
							checkboxClass: 'icheckbox_minimal',
							radioClass: 'iradio_minimal',
							increaseArea: '20%'
						});
					});					
				}																					
			});	
			//---------------------------------------------------------------------------
		},
	
		//===================================================================删除方法================================================================================
		deleteNow:function(){
			var self = this;
			var data = "";
			if($("input[name='order']").filter(':checked').length == 0){	
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			$("input[name='order']:checkbox").each(function(){																																		
				if(true == $(this).is(':checked')){																																					
					data += ($(this).val()+",");																																					
				}																																													
			});	
			
			data = data.substr(0,data.length-1);
			
			layer.open({																																											
				title: '提示',																																										
				content: '删除后，数据将无法恢复！确定删除么？',																																						
				btn: ['确定', '取消'],																																								
				yes:function(){																																										
					$.ajax({																				
						url: "/index.php?m=system&c=storageLocation&a=deleteLoc",										
						type: 'post',																		
						data: {data:data},																	
						dataType: 'json',																	
						success: function (data) {															
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});	
								self.getLoc();
								$("input[name='order']:checkbox").each(function(){																																		
									$("input[name='order']").iCheck('uncheck');																																														
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
			
			
			
		},
		//=================================================================删除方法结束==============================================================================
		
		//===================================================================新增货位================================================================================
		add_loc:function(){
			var self = this;
			if(self.wh == ""){
				layer.msg("请先选择仓库",{
					icon: 0,
					time: 2000
				});	
				return false;
			}
			$(".loc_body").html("");
			$("#is_loc").iCheck('uncheck');
			$(".isShow").css("display","none");
			layer.open({																																											
				type: 1,																																											
				title: '添加货位',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['700px', '500px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#loc_add"),																																							
				btn: ['生成']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var data = [];
					$(".loc_body tr").each(function(){
						data.push($(this).find(".loc_names").html());
					});
					
					$.ajax({																				
						url: "/index.php?m=system&c=storageLocation&a=insertLoc",										
						type: 'post',																		
						data: {data:data,wh:self.wh},																	
						dataType: 'json',																	
						success: function (data) {															
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								self.getLoc();
							}else{
								layer.msg(data.msg,{
									icon: 2,
									time: 2000
								});
							}																			
						}																					
					});	
					layer.close(index);
				},
				cancel: function (index, layero) {																																					
																																																	
				}																																													
			});
			
		},
		//=================================================================新增货位结束==============================================================================
		
		//===================================================================新增仓库================================================================================
		add_wh:function(){
			var self = this;
			
			if($(".btn_1").prop("disabled")){
				return false;
			}
			
			$("#wh_name").val("");
			layer.open({																																											
				type: 1,																																											
				title: '新建仓库',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['700px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#add_wh"),																																							
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var name = $("#wh_name").val();
					if(name == ""){
						layer.msg("请填写仓库名称",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					$.ajax({																				
						url: "/index.php?m=system&c=storageLocation&a=insertWh",										
						type: 'post',																		
						data: {name:name},																	
						dataType: 'json',																	
						success: function (data) {															
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								self.getWh();
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
					
				},
				cancel: function (index, layero) {																																					
																																																	
				}																																													
			});	
		},
		//=================================================================新增仓库结束==============================================================================
		
		getWh:function(){
			var self = this;
			//----------------------------- 取仓库信息 ----------------------------------
			//		|
			//		|
			//	  \ | /
			//	   \|/
			$.ajax({																				
				url: "/index.php?m=system&c=storageLocation&a=getWh",										
				type: 'post',																		
				data: {},																	
				dataType: 'json',																	
				success: function (data) {															
					self.WhArr = data;																			
				}																					
			});	
			//---------------------------------------------------------------------------
		},
	
		edit_name:function(){
			var self = this;
			
			if($(".btn_2").prop("disabled")){
				return false;
			}
			
			if(self.wh == ""){
				layer.msg("请先选择仓库",{
					icon: 0,
					time: 2000
				});	
				return false;
			}
			
			$("#edit_name").val("");
			layer.open({																																											
				type: 1,																																											
				title: '编辑【仓库名称】',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['700px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#edit_wh"),																																							
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var name = $("#edit_name").val();
					if(name == ""){
						layer.msg("请填写分类名称",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					$.ajax({																				
						url: "/index.php?m=system&c=storageLocation&a=changeName",										
						type: 'post',																		
						data: {name:name,wh:self.wh},																	
						dataType: 'json',																	
						success: function (data) {															
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								self.getWh();
							}else{
								layer.msg(data.msg,{
									icon: 2,
									time: 2000
								});
							}																			
						}																					
					});	
					layer.close(index);
				}
				,btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {																																					
																																																	
				}																																													
			});	
		},
		
		delete_wh:function(){
			var self = this;
			
			if($(".btn_3").prop("disabled")){
				return false;
			}
			
			layer.open({																																											
				title: '提示',																																										
				content: '确定删除么？',																																						
				btn: ['确定', '取消'],																																								
				yes:function(){																																										
					$.ajax({																				
						url: "/index.php?m=system&c=storageLocation&a=deleteWh",										
						type: 'post',																		
						data: {wh:self.wh},																	
						dataType: 'json',																	
						success: function (data) {															
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});	
								self.getWh();
								self.wh = "";
								$(".shop").css("backgroundColor","white");
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
		},
		
		inp:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				
				if($(".add_loc_num").val() == ""){
					var name = $("#add_loc_name").val();
					if(name == ""){
						return false;
					}
					var tr = "";
					tr = "<tr><td style='text-align:center;'><a style='color:black;cursor:pointer;' onclick='deleteTd()'>删除</a></td><td style='text-align:center;' class='loc_names'>"+name+"</td></tr>";
					$(".loc_body").append(tr);
					$("#add_loc_name").val("");
				}else if($(".add_loc_num").val() != ""){
					self.inp_more_now();
				}
				
				
			}
		},
		
		inp_more:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				self.inp_more_now();
			}
		},
		
		inp_more_now:function(){
			var name = $("#add_loc_name").val();
			var num = $("#loc_num").val();
			if(name == ""){
				return false;
			}
			
			$.ajax({																				
				url: "/index.php?m=system&c=storageLocation&a=get_loc_add",										
				type: 'post',																		
				data: {name:name,num:num},																	
				dataType: 'json',																	
				success: function (data) {	
					if(data){
						for(var j = 0; j < data.length; j++){
							var tr = "";
							tr = "<tr><td style='text-align:center;'><a style='color:black;cursor:pointer;' onclick='deleteTd()'>删除</a></td><td style='text-align:center;' class='loc_names'>"+data[j].name+"</td></tr>";
							$(".loc_body").append(tr);
						}
						
					}
					$("#add_loc_name").val("");
					$("#loc_num").val("");
				}																					
			});
		
		},
		
		//==============================================================打印一栏===================================================================================
		printOne:function(type){
			var self = this;
			
			if($("input[name='order']").filter(':checked').length == 0){	
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			
			doGetPrinters(function(data){																																							
				self.layprint =  data;																																								
			});	
			
			$.ajax({																																														
				url: "/index.php?m=system&c=storageLocation&a=getPrinter",																																		
				type: 'post',																																												
				data: {},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data['result'] != 0 && data['bq'] != 0){
						$("#layprint").val(data['result'].printer);
					}else if(data['result'] != 0 && data['bq'] == 0){
						$("#layprint").val(data['result'].printer);
					}else if(data['result'] == 0 && data['bq'] != 0){
						$("#layprint").val(0);
					}else{
						$("#layprint").val(0);
					}
				}																																															
			});
			
			layer.open({																																											
				type: 1,																																											
				title: '打印条码',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['600px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#table-print"),																																							
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var data= "";
					
					$("input[name='order']:checkbox").each(function(){																																		
						if(true == $(this).is(':checked')){																																					
							data += ($(this).val()+",");																																					
						}																																													
					});	
					
					data = data.substr(0,data.length-1);
					
					$.ajax({																				
						url: "/index.php?m=system&c=storageLocation&a=printNow",										
						type: 'post',																		
						data: {data:data},																	
						dataType: 'json',																	
						success: function (data) {															
							if(data){
								var layprint = $("#layprint").val();
								
								if(type == "one"){
									printTpl['DAN'](layprint,data,false);
								}else if(type == "two"){
									printTpl['SHUANG'](layprint,data,false);
								}
								
							}else{
								layer.msg("打印失败",{
									icon: 2,
									time: 2000
								});
							}																			
						}																					
					});
					
					layer.close(index);
				}
				,btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {																																					
																																																	
				}																																													
			}); 
		},
		//============================================================打印一栏结束=================================================================================
		
	}
	
		
});

$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});

$('#selectAll').on('ifChecked ifUnchecked', function(event){																																			
																																																	
	if (event.type == 'ifChecked') {																																								
		$("input[name='order']").iCheck('check');																																		
	} else {																																														
		$("input[name='order']").iCheck('uncheck');																																		
	}																																																
});	

$('#is_loc').on('ifChecked ifUnchecked', function(event){																																			
																																																	
	if (event.type == 'ifChecked') {																																								
		$(".isShow").css("display","inline");
		$(".isShow").val("");		
	} else {																																														
		$(".isShow").css("display","none");		
		$(".isShow").val("");
	}																																																
});	

function deleteTd(){
	$(event.target).parent().parent().remove();
}




