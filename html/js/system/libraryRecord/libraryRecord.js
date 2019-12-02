var flow = new Vue({
	el: '#flow',
	data: {
		wh_data:[],
		wh:"",
		tab:"",
	},
	mounted: function() {
		var self = this;
		
		
		//获取操作员信息
		$.ajax({																																														
			url: "/index.php?m=system&c=jurisdiction&a=getUser",																																		
			type: 'post',																																												
			data: {},																																													
			dataType: 'json',
			async:false,
			success: function (data) {
				if(data){
					self.user_data = data;
				}
			}																																															
		});
		
		//获取仓库信息
		$.ajax({																																														
			url: "/index.php?m=system&c=jurisdiction&a=getWh",																																		
			type: 'post',																																												
			data: {},																																													
			dataType: 'json',
			async:false,
			success: function (data) {
				
				if(data){
					self.wh_data = data;
					
				}
				
			}																																															
		});
		
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
					,url: 'index.php?m=system&c=libraryRecord&a=getData'
					,cols: [[
					   {field:'effect_date', title: '时间',"width":120,"fixed":true}
					   ,{field:'prd_no', title: '商品编号',"width":160,"fixed":true}
					   ,{field:'prd_sku_name', title: '销售属性',"width":160,"fixed":true}
					  ,{field:'prd_name', title: '商品名称',"width":240}
					  ,{field:'name', title: '仓库',"width":140}
					  ,{field:'in_price', title: '入库单价',"width":100}
					  ,{field:'in_qty', title: '入库数量',"width":100}
					  ,{field:'in_total_fee', title: '入库金额',"width":120}
					  ,{field:'out_price', title: '出库单价',"width":100}
					  ,{field:'out_qty', title: '出库数量',"width":100}
					  ,{field:'out_total_fee', title: '出库金额',"width":120}
					  //,{field:'in_total_fee', title: '库存',"width":120}
					  ,{field:'username', title: '操作员',"width":120}
					  ,{field:'memo', title: '备注',"width":220}
					  ,{field:'djtype', title: '类型',"width":120, "toolbar": '#barDemo1'}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-90'
				  });
				 
				  var $ = layui.$, active = {
					reload: function(){
					  
					  tab.reload({
						
						where: {
							prd_name:$(".names").val(),
							dateBegin:$("#dateBegin").val(),
							dateEnd:$("#dateEnd").val(),
							wh:self.wh
						}
					  });
					}
				  };
				  
				  self.tab = active;
				  
				  $('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					
					active[type] ? active[type].call(this) : '';
				  });
				  
				  $('.key_down').on('keydown', function(){
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
			$("#dateBegin").val("");
			$("#dateEnd").val("");
			$(".names").val("");
		}
	}
});

function whChange(value){
	flow.wh = value;
	flow.tab.reload();
}

