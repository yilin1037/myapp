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
				  var laydate = layui.laydate;
				  layer.load(2);

				//日期时间选择器
				laydate.render({
					elem: '#startTime'
					,type: 'datetime'
				});
				//日期时间选择器
				laydate.render({
					elem: '#endTime'
					,type: 'datetime'
				});

				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=report&c=prdtSerialNoLog&a=prdtSerialNoLogList'
					
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'serial_no', title: '唯一码',"width":120}
					  ,{field:'userid', title: '操作员',"width":150}
					  ,{field:'action_ip', title: 'IP',"width":200}
					  ,{field:'action_time', title: '操作时间',"width":200}
					  ,{field:'action_device', title: '设备',"width":130}
					  ,{field:'prd_loc', title: '货位',"width":130}
					  ,{field:'action_type', title: '类型',"width":120}
					  ,{field:'rem', title: '备注',"width":300}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-65'
					,done: function(res, curr, count){
						layer.closeAll('loading');
					}
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
					  layer.load(2);
					  tab.reload({
						
						where: {
							serial_no:$("#serial_no").val(),
							prd_loc:$("#prd_loc").val(),
							startTime : $("#startTime").val(),
						    endTime : $("#endTime").val(),
							action_type : $("#action_type option:selected").val(),
						}
					  });
					},

					  ExportExcel: function(){
						  var items = {};
						  items.serial_no=$("#serial_no").val();
						  items.prd_loc=$("#prd_loc").val();
						  items.startTime = $("#startTime").val();
						  items.endTime = $("#endTime").val();
						  items.action_type = $("#action_type option:selected").val();

						  var exportExcelUrl = "?m=report&c=prdtSerialNoLog&a=exportExcel";
						  let opt = $.param(items);
						  console.log(opt);
						  window.location.href = exportExcelUrl+"&"+opt;
					  },


				  };


				$("#searchExportExcel").click(function(){
					active['ExportExcel'] ? active['ExportExcel'].call(this) : '';
				})
				  
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
            $("#serial_no").val("");
			$("#prd_loc").val("");
			$("#startTime").val("");
			$("#endTime").val("");
			$("#action_type").val("");
		}
    }
});