var tableList = new Vue({
	el: '#tableList',
	data: {
		data:[],
	},
	mounted: function() {
		var self = this;
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate','tree'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  
				  
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
					,url: 'index.php?m=report&c=sendOrderDetail&a=sendOrderDetailList'
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'', title: '店铺',"width":150 ,fixed: true}
					  ,{field:'', title: '快递',"width":120}
					  ,{field:'', title: '发出快递单号',"width":180}
					  ,{field:'', title: '快递状态',"width":120}
					  ,{field:'payment_time', title: '状态更新时间',"width":160}
					  ,{field:'', title: '拒收退回快递单号',"width":180}
					  ,{field:'', title: '退回快递状态',"width":120}
					  ,{field:'', title: '退回状态更新时间',"width":160}
					  ,{field:'', title: '物流详情',"width":200}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-95'
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
					  
					  tab.reload({
						
						where: {
							shopid:$("#shopname").val(),
							express_no:$("#express_no").val(),
							express_status:$("#express_status").val(),
							back_express_status:$("#back_express_status").val()
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
		
	},
																																																	
});	




																																																
