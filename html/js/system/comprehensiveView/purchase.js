var flow = new Vue({
	el: '#flow',
	data: {
		tab:"",
		djtype:0,
		order:"",
		item:[],
	},
	mounted: function() {
		var self = this;
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  
				  laydate.render({
					elem: '#dateBegin'
					,format: 'yyyy-MM-dd'
				  });
				  
				  laydate.render({
					elem: '#dateEnd'
					,format: 'yyyy-MM-dd'
				  });
				  
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=system&c=comprehensiveView&a=purchase_getData'
					,cols: [[
					   {field:'right', title: '操作',"width":100, "toolbar": '#barDemo',"fixed":true}
					  ,{field:'prd_no', title: '商品编号',"width":240 ,"fixed":true}
					  ,{field:'prd_name', title: '商品名称',"width":240}
					  ,{field:'prd_sku_name', title: '销售属性',"width":120}
					  ,{field:'cus_name', title: '供应商',"width":120}
					  ,{field:'create_time', title: '创建时间',"width":160}
					  ,{field:'name', title: '仓库',"width":160}
					  ,{field:'qty', title: '数量',"width":80}
					  ,{field:'price', title: '单价',"width":120}
					  ,{field:'total_fee', title: '金额',"width":160}
					  ,{field:'memo', title: '备注',"width":200}
					  ,{field:'username', title: '操作员',"width":110}
					 
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-140'
				  });
				 
				  var $ = layui.$, active = {
					reload: function(){
					  
					  tab.reload({
						
						where: {
							prd_no:$("#good_name").val(),
							dateBegin:$("#dateBegin").val(),
							dateEnd:$("#dateEnd").val(),
							djtype:self.djtype
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
					if(obj.event === 'detail'){				//收款
						layer.open({																																											
							type: 1,																																											
							title: '订单详情',																																									
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['1000px', '500px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#detail"),	
							cancel: function (index, layero) {																																					
																																																				
							},
							success:function(){
								$.ajax({
									url: "/index.php?m=system&c=comprehensiveView&a=purshase_getOrder",
									data: {pc_no:data.pc_no},
									dataType: "json",
									type: "POST",
									success: function (data) {
										self.order = data.order;
										self.item = data.item;
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
		});
	},
	methods: {
		change:function(type){
			var self = this;
			if(type == "buy"){
				self.djtype = 0;
			}else if(type == "back"){
				self.djtype = 1;
			}
			
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  
				  self.tab.reload();
				  
			});
			
		},
		
		reset:function(){
			var self = this;
			
			$("#good_name").val("");
			$("#dateBegin").val("");
			$("#dateEnd").val("");
		}
	}
});

$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});



