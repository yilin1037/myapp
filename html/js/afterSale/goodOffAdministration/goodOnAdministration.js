
online = {
	elem: '#LAY_table_user'
	,url: '/index.php?m=afterSale&c=goodOffAdministration&a=getData'
	
	,cols: [[
	  {checkbox: true, fixed: true}
	  ,{field:'index', title: '序号',"width":60}
	  ,{field:'right', title: '操作',"width":80,"toolbar": '#barDemo'}
	  ,{field:'modified_time', title: '改码替换时间',"width":240}
	  ,{field:'prd_no', title: '原商品编号',"width":240}
	  ,{field:'new_prd_no', title: '新商品编号',"width":240}
	  ,{field:'username', title: '操作员',"width":160}
	]]
	,id: 'testReload'
	,page: true
	,height: 'full-106'
	,limits: [20,50,80,100]
	,limit: 50
	,loading: true
  };

var tableList = new Vue({
	el: '#tableList',
	data: {
		data:[],
		tableObj:false,
		a_table:"",
	},
	mounted: function() {
		var self = this;
		
		$(document).ready(function(){
		layui.use(['table','element','layer'], function(){
			  var table = layui.table,element=layui.element,layer=layui.layer;
			  var a_table = table.render(online);
			  self.a_table = a_table;
			  //方法级渲染
			  var $ = layui.$, active = {
				reload: function(){
				  
				  a_table.reload({
					
					where: {
						old_prd_no:$("#old_prd_no").val(),
						new_prd_no:$("#new_prd_no").val()
					}
				  });
				},
				getCheckData: function(){ //获取选中数据
					var checkStatus = table.checkStatus('testReload')
					,data = checkStatus.data;
					layer.confirm("确定关闭么？", {
						btn: ['确定', '取消'] //可以无限个按钮
						,btn3: function(index, layero){
						//按钮【按钮三】的回调
						}
					}, function(index, layero){
						//按钮【按钮一】的回调
						var str = "";
						for(var i = 0; i < data.length; i++){
							str += (data[i].prd_no + ",");
						}
						$.ajax({																																													
							url: "/index.php?m=afterSale&c=goodOffAdministration&a=deleteNow",																																		
							type: 'post',																																											
							data: {prd_no:str},																																												
							dataType: 'json',																																										
							success: function (data) {																																								
								if(data.code == "ok"){
									layer.msg(data.msg,{
										icon: 1,
										time: 2000
									});	
									
									self.a_table.reload();
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
			  };
			  
			  $('.search1').on('click', function(){
				var type = $(this).data('type');
				active[type] ? active[type].call(this) : '';
			  });
			  
			  $('.old').on('keydown',function(){
				    var e = event || window.event;
					if(e.keyCode == 13){
						var type = $(this).data('type');
						active[type] ? active[type].call(this) : '';
					}
					
			  });
			  
			  $('.new').on('keydown',function(){
				    var e = event || window.event;
					if(e.keyCode == 13){
						var type = $(this).data('type');
						active[type] ? active[type].call(this) : '';
					}
					
			  });
			  
			  //监听工具条
			  table.on('tool(user)', function(obj){
					var data = obj.data;
					if(obj.event === 'detail'){
						self.newAdd(data.prd_no,data.new_prd_no,data.id);
					}
				  });	
			});
		});
		
		//=====================这段代码要放到页面表格数据请求（ajax）成功的回调函数里，页面的复选框样式才会生效==================================
		$(document).ready(function(){
			$('.skin input').iCheck({
				checkboxClass: 'icheckbox_minimal',
				radioClass: 'iradio_minimal',
				increaseArea: '20%'
			});
		});	
		//========================================================================================================================================
	},
	methods: {
		
		newAdd:function(prd_no,new_prd_no,type){
			var self = this; 
			var title = "";
			if(prd_no == ""){
				title = "新增商品改码上架";
			}else{
				title = "修改";
			}
			layer.open({																																											
				type: 1,																																											
				title: title,																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['900px', '500px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#page"),																																							
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var prd_no = $("#old_prd_no_1").val();
					var new_prd_no = $("#new_prd_no_1").val();
					if(prd_no == '' || new_prd_no == '')
					{
						layer.msg('原编码与新编码不能为空',{
							icon: 2,
							time: 3000
						});	
						return;	
					}
					if(prd_no == new_prd_no)
					{
						layer.msg('原编码与新编码不能相同',{
							icon: 2,
							time: 3000
						});	
						return;	
					}
					$.ajax({																																													
						url: "/index.php?m=afterSale&c=goodOffAdministration&a=addOrchange",																																		
						type: 'post',																																											
						data: {prd_no:prd_no,new_prd_no:new_prd_no,type:type},																																												
						dataType: 'json',																																										
						success: function (data) {																																								
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});	
								layer.close(index);
								
								layui.use(['table','element','layer'], function(){
									var table = layui.table,element=layui.element,layer=layui.layer;
									//table.render(online);
									self.a_table.reload();
								});
								
							}else{
								if(data.type)
								{
									layer.confirm(data.msg, {
										btn: ['确定', '取消'] //可以无限个按钮
										,btn3: function(index, layero){
										//按钮【按钮三】的回调
										}
									}, function(index, layero){
										//按钮【按钮一】的回调
										$.ajax({																																													
											url: "/index.php?m=afterSale&c=goodOffAdministration&a=sure",																																		
											type: 'post',																																											
											data: {prd_no:prd_no,new_prd_no:new_prd_no,type:data.type},																																												
											dataType: 'json',																																										
											success: function (data) {																																								
												if(data.code == "ok"){
													layer.msg(data.msg,{
														icon: 1,
														time: 2000
													});	
													layer.closeAll();
													layui.use(['table','element','layer'], function(){
														var table = layui.table,element=layui.element,layer=layui.layer;
														self.a_table.reload();
													});
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
								else
								{
									layer.msg(data.msg,{
										icon: 2,
										time: 2000
									});		
								}
							}																																								
						}																																														
					});		
					
					
				}
				,btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {																																					
																																																	
				},
				success:function(){
					$("#old_prd_no_1").val(prd_no);
					$("#new_prd_no_1").val(new_prd_no);
					if(type != "add"){
						$("#old_prd_no_1").prop("disabled",true);
					}else{
						$("#old_prd_no_1").prop("disabled",false);
					}
				}
			});
		},
		
		reset_now:function(){
			$(".old").val("");
			$(".new").val("");
		}
	},
																																																	
});	


$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});	

																																																
