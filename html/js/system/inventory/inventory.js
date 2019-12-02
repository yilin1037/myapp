var flow = new Vue({
	el: '#flow',
	data: {
		tab:"",
		wh:[],
		search_wh:"",
		look_detail:[],
		prd_no:"",
		hide:1,
		day:"",
	},
	mounted: function() {
		var self = this;
		
		$.ajax({
			url: "/index.php?m=system&c=sellOut&a=get_wh",
			data: {},
			dataType: "json",
			type: "POST",
			success: function (data) {
				if(data){
					self.wh = data;
				}else{
					self.wh = [];
				}
			}
		});

	},
	methods: {
		//获取数量
		getOrder:function(){
			var self = this;
			
			$.ajax({
				url: "/index.php?m=system&c=inventory&a=getOrder",
				data: {},
				dataType: "json",
				type: "POST",
				success: function (data) {
					
				}
			});
			
		},
		
		//商品名称搜索回车
		name_down:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				var name = $("#good_name").val();
				self.prd_no = name;
				if(self.tab == ""){
					layui.use('layer', function(){
						var layer = layui.layer;
						layer.msg('请先进行盘点', {icon: 0}); 
					}); 
					return false;
				}
				
				self.tab.reload();
			}
			
			
		},
		
		//开时盘点按钮
		begin:function(){
			var self = this;
			
			var search_wh = $("#wh").val();
			self.search_wh = search_wh;
			if(search_wh == ""){
				layui.use('layer', function(){
					var layer = layui.layer;
					layer.msg('请先选择仓库', {icon: 0}); 
				}); 
				return false;
			}
			
			$(".isShow").css("display","block");
			$(".begin_pan").css("display","none");
			
			if(self.tab == ""){
				layui.use(['table','element','layer','form','laydate'], function(){
					  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
					  var laydate = layui.laydate;
					  
					  var tab = table.render({
						elem: '#LAY_table_user'
						,url: 'index.php?m=system&c=inventory&a=getData&wh='+search_wh
						,cols: [[
						   {field:'inventory_check', title: '操作',"width":250, "templet": '#sexTpl',"fixed":true}
						  ,{field:'prd_no', title: '商品编号',"width":240 ,"fixed":true}
						  ,{field:'title', title: '商品名称',"width":240}
						  ,{field:'name', title: '仓库',"width":120}
						  ,{field:'sku_name', title: '销售属性',"width":240}
						  ,{field:'qty', title: '库存',"width":180, "templet": '#sexTpl1'}
						  ,{field:'inventory_check_time', title: '上次盘点时间',"width":160}
						  
						]]
						,id: 'testReload'
						,page: true
						,height: 'full-100'
					  });
					 
					  var $ = layui.$, active = {
						reload: function(){
						  
						  tab.reload({
							
							where: {
								wh:self.search_wh,
								prd_no:self.prd_no,
								hide:self.hide,
								day:self.day
							}
						  });
						},
						getCheckData: function(){ //获取选中数据
						  var checkStatus = table.checkStatus('testReload')
						  ,data = checkStatus.data;
						  
						  
						},
					  };
					  
					  self.tab = active;
					  
					  //监听单元格编辑
					  table.on('edit(user)', function(obj){
						var value = obj.value //得到修改后的值
						,data = obj.data //得到所在行所有键值
						,field = obj.field; //得到字段
						
						
					  });
					  
					   //监听工具条
					  table.on('tool(user)', function(obj){
						var data = obj.data;
						if(obj.event === 'change'){				//收款
							layer.open({																																											
								type: 1,																																											
								title: '库存调整',																																									
								skin: 'layui-layer-rim', //加上边框																																					
								area: ['350px', '350px'], //宽高																																					
								shade: 0.3,																																											
								content: $("#change"),	
								btn: ['确定', '取消']
								,yes: function(index, layero){
									var change_number = $("#change_number_end").val();
									if(change_number === ""){
										layui.use('layer', function(){
											var layer = layui.layer;
											layer.msg('请输入修改数量', {icon: 0}); 
										}); 
										return false;
									}
									
									$.ajax({
										url: "/index.php?m=system&c=inventory&a=change_number",
										data: {id:data.id,prd_id:data.prd_id,prd_sku_id:data.prd_sku_id,change_number:change_number,old_number:data.qty,wh:data.wh},
										dataType: "json",
										type: "POST",
										success: function (data) {
											$(".layui-laypage-btn").click(); 
											layer.close(index);
											//self.tab.reload();
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
									$("#change_good_name").val(data.title);
									$("#change_sku_name").val(data.sku_name);
									$("#change_number_begin").val(data.qty);
									$("#change_number_end").val("");
								}
							});
						}else if(obj.event === 'sure'){				//开单
							$.ajax({
								url: "/index.php?m=system&c=inventory&a=sure_number",
								data: {id:data.id,prd_id:data.prd_id,prd_sku_id:data.prd_sku_id,wh:data.wh},
								dataType: "json",
								type: "POST",
								success: function (data) {
									if(data.code == "ok"){
										$(".layui-laypage-btn").click(); 
									}
								}
							});
						}else if(obj.event === 'back_change'){				//开单
							$.ajax({
								url: "/index.php?m=system&c=inventory&a=back_change",
								data: {id:data.id},
								dataType: "json",
								type: "POST",
								success: function (data) {
									if(data.code == "ok"){
										$(".layui-laypage-btn").click(); 
									}
								}
							});
						}else if(obj.event === 'look'){				//开单
							layer.open({																																											
								type: 1,																																											
								title: '查看详情',																																									
								skin: 'layui-layer-rim', //加上边框																																					
								area: ['800px', '500px'], //宽高																																					
								shade: 0.3,																																											
								content: $("#look"),	
								btn: ['关闭']
								,yes: function(index, layero){
									layer.close(index);
									
								},
								cancel: function (index, layero) {																																					
																																																					
								},
								success:function(){
									$.ajax({
										url: "/index.php?m=system&c=inventory&a=search_look",
										data: {prd_id:data.prd_id,prd_sku_id:data.prd_sku_id,wh:data.wh},
										dataType: "json",
										type: "POST",
										success: function (data) {
											if(data){
												self.look_detail = data;
											}else{
												self.look_detail = [];
											}
										}
									});
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
			}else{
				self.tab.reload();
			}
			
		},
	}
});

$('#hid').on('ifChecked ifUnchecked', function(event){
	if (event.type == 'ifChecked') {																																								
		flow.hide = 0;																																		
	} else {																																														
		flow.hide = 1;																																			
	}
	flow.tab.reload();	
});

$('#hid2').on('ifChecked ifUnchecked', function(event){
	if (event.type == 'ifChecked') {																																								
		var day = $("#day").val();
		flow.day = day;
	} else {																																														
		flow.day = "";																																			
	}
	flow.tab.reload();	
});	

$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});



