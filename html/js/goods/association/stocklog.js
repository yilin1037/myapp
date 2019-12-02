var vueObj = new Vue({
    el: '#app',
    data: {
        shopItems: paramObject.shopObj,
		dateBegin: startFormTime,
		dateEnd:endFormTime,
    },
    mounted: function () {
		var self = this;
        var tempjson = new Array();
        var jqtb;
        //layui 模块 入口
		
		$(document).ready(function(){
			$("#dateBegin").html(startFormTime);
			$("#dateEnd").html(endFormTime);
			
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  var $ = layui.$;
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
				  
				  layer.load(2);	
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=goods&c=association&a=stockLogList'
					
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'now_time', title: '库存同步时间',"width":170}
					  ,{field:'action_time', title: '任务创建时间',"width":170}
					  ,{field:'shoptype', title: '平台',"width":100}
					  ,{field:'shopname', title: '店铺',"width":150}
					  ,{field:'prd_no', title: '商品编码',"width":150}
					  ,{field:'qty_now', title: '实际库存量',"width":100}
					  ,{field:'qty', title: '库存同步量',"width":100}
					  ,{field:'upload_type', title: '类型',"width":80}
					  ,{field:'upload_ratio', title: '比例(%)',"width":80}
					  ,{field:'upload_beyond', title: '增减量',"width":80}
					  ,{field:'manual', title: '',"width":60}
					  ,{field:'is_success', title: '',"width":60}
					  ,{field:'result', title: '同步结果',"width":300}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-145'
					,where: {
						"prd_no":$("#prd_no").val(),
						"dateBegin":self.dateBegin,
						"dateEnd":self.dateEnd,
						"is_success":$("#is_success").val(),
						"shop_id":$("#shop_id").val()
					}
					,done: function(res, curr, count){
						layer.closeAll('loading');
					}
				  });
				  
				  var active = {
					reload: function(){
					  layer.load(2);	
					  tab.reload({
						
						where: {
							prd_no:$("#prd_no").val(),
							dateBegin:self.dateBegin,
							dateEnd:self.dateEnd,
							is_success:$("#is_success").val(),
							shop_id:$("#shop_id").val()
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
			$("#dateBegin").html(startFormTime);
			$("#dateEnd").html(endFormTime);
			$("#prd_no").val("");
			$("#is_success").val("");
            $("#shop_id").val("");
			vueObj.dateBegin = startFormTime;
			vueObj.dateEnd = endFormTime;
		}
    }
});