var tableList = new Vue({
	el: '#tableList',
	data: {
		order:[],
	},
	mounted: function() {
		var self = this;
		
		//获取导航数据
		$.ajax({																				
			url: "/index.php?m=WMS&c=inventoryDetails&a=getInventory",										
			type: 'post',																		
			data: {},
			async: false,			
			dataType: 'json',																	
			success: function (data) {			
				self.order = data;
			}																					
		});

		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate','tree'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  
				  layui.tree({
					elem: '#demo1' //指定元素
					,target: '_blank' //是否新选项卡打开（比如节点返回href才有效）
					,click: function(item){ //点击节点回调
						console.log(item);
					}
					,nodes: self.order
				});
				  
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
				  
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: ''
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'', title: '商品编号',"width":200}
					  ,{field:'', title: '商品名称',"width":200}
					  ,{field:'', title: '货位',"width":100}
					  ,{field:'', title: '特征',"width":160}
					  ,{field:'', title: '批号',"width":100}
					  ,{field:'', title: 'SKU编码',"width":120}
					  ,{field:'', title: '规格',"width":100}
					  ,{field:'', title: '库存',"width":100}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-85'
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
					  
					  tab.reload({
						
						where: {
							prd_no:$("#prd_no").val(),
							prd_loc:$("#prd_loc").val(),
							sku_name:$("#sku_name").val(),
							begin_number:$("#begin_number").val(),
							end_number:$("#end_number").val()
						}
					  });
					}
				  };
				  
				  $('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					
					active[type] ? active[type].call(this) : '';
				  });
				  
				  $('.key_search').on('keydown', function(){
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
		//重置按钮
		reset_now:function(){
			$("input[name='reset']").val("");
		}
	},
																																																	
});	




		






																																																
