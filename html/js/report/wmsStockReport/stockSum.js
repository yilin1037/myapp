var vueObj = new Vue({
    el: '#app',
    data: {
		dateBegin:'',
    },
    mounted: function () {
		var self = this;
        var tempjson = new Array();
        var jqtb;
        //layui 模块 入口
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
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

				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=report&c=wmsStockReport&a=stockSumList'
					
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'cus_no', title: '档口',"width":200}
					  ,{field:'prd_loc', title: '货位',"width":150}
					  ,{field:'prd_no', title: '商品编号',"width":200}
					  ,{field:'sku_name', title: '销售属性',"width":200}
					  ,{field:'qty', title: '库存量',"width":100}
					  ,{field:'qty_sub', title: '订单使用量',"width":100}
					  ,{field:'qty_use', title: '可用量',"width":100}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-145'
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
					  
					  tab.reload({
						
						where: {
							dateBegin:self.dateBegin,
							cus_no:$("#cus_no").val(),
							prd_loc:$("#prd_loc").val(),
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
        resetNow:function(){
			$("#dateBegin").html("");
			$("#cus_no").val("");
			$("#prd_loc").val("");
			self.dateBegin = "";
		}
    }
});