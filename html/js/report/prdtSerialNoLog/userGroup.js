var vueObj = new Vue({
    el: '#app',
    data: {
        action_date:''
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
					elem: '#action_date'
					,type: 'date'
					,done: function(value, date, endDate){
						self.action_date = value;
					  }
				  });
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=report&c=prdtSerialNoLog&a=prdtSerialNoLogGroupList'
					
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
                      ,{field:'action_date', title: '操作时间',"width":200}
					  ,{field:'userid', title: '操作员',"width":150}
                      ,{field:'prd_loc', title: '货位',"width":120}
                      ,{field:'action_type', title: '类型',"width":120}                      
					  ,{field:'action_count', title: '数量',"width":120}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-65'
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
					   if(self.action_date == ''){
					       layer.alert('请选择日期');
					       return;
					   }
					  tab.reload({
						
						where: {
                            action_date:self.action_date,
							userid:$("#userid").val()
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
            $("#action_date").val("");
            $("#userid").val("");
            self.action_date = '';
		}
    }
});