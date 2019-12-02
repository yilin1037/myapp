var vueObj = new Vue({
    el: '#app',
    data: {
       
    },
    mounted: function () {
		var self = this;
        var tempjson = new Array();
        var jqtb;
        //layui 模块 入口
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;

				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=report&c=stockDetail&a=stockDetailList'
					
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'storage_name', title: '仓库',"width":200}
					  ,{field:'prd_no', title: '商品编码',"width":150}
					  ,{field:'sku_name1', title: '属性1',"width":120}
					  ,{field:'sku_name2', title: '属性2',"width":120}
					  ,{field:'qty_end', title: '库存量',"width":130}
					  ,{field:'up_cst', title: '单位成本',"width":120}
					  ,{field:'cst_end', title: '总成本',"width":120}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-145'
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
					  
					  tab.reload({
						
						where: {
							send_status:$("#send_status").val(),
							dateBegin:self.dateBegin,
							dateEnd:self.dateEnd,
							express_type:$("#express_type").val(),
							express_no:$("#express_no").val(),
							shop_id:$("#shop_id").val(),
							tid:$("#tid").val()
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
			$("#dateEnd").html("");
			$("#send_status").val("1");
			$("#express_type").val("");
			$("#express_no").val("");
            $("#shop_id").val("");
            $("#tid").val("");
			self.dateBegin = "";
			self.dateEnd = "";
		}
    }
});