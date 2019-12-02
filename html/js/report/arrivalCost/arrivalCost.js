var tableList = new Vue({
	el: '#tableList',
	data: {
		data:[],
	},
	mounted: function() {
		var self = this;
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=system&c=finance&a=getflowSummary'
					
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'create_date', title: '供应商',"width":240}
					  ,{field:'type', title: '商品编号',"width":180}
					  ,{field:'money', title: '数量',"width":180}
					  ,{field:'', title: '成本价',"width":180}
					  ,{field:'', title: '实际成本价',"width":180}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-90'
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
					  
					  tab.reload({
						
						where: {
							separator:$("#separator").val(),
							dateBegin:self.dateBegin,
							dateEnd:self.dateEnd
						}
					  });
					}
				  };
				  
				  $('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					
					active[type] ? active[type].call(this) : '';
				  });
				  
				  
				
			});
		});
	
		
	},
	methods: {
		
	},
																																																	
});	


$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});	

																																																
