var labelDiv = new Vue({
	el: '#labelDiv',
	data: {
		layprint:[],
	},
	mounted: function() {
		var self = this;
		setTimeout(function(){
            doGetPrinters(function(data){																																							
                self.layprint =  data;	
				
				$(document).ready(function(){
					$('.skin input').iCheck({
						checkboxClass: 'icheckbox_minimal',
						radioClass: 'iradio_minimal',
						increaseArea: '20%'
					});
				});	
				
				$.ajax({
					url: "/index.php?m=system&c=printer&a=getPrinter",
					type: 'post',
					data: {},
					dataType: 'json',
					success: function (data) {
						if(data){
							for(var i = 0; i < data.length; i++){
								$("#" + data[i].type + " input[value='" + data[i].printer + "']").iCheck('check');
							}
						}
					}
				});
				
            });
			
			
		},500);
		
		
	},
	methods: {
		
		labelSure:function(type,name){
			var self = this;
			var data = "";
			
			if($("input[name=" + name + "]:radio").length == 0){
				layui.use('layer', function(){
				    var layer = layui.layer;
				  
				    layer.msg('请选择打印机', {time: 2000, icon:0});
				});
				return false;
			}
			
			$("input[name=" + name + "]:radio").each(function(){						//--------------------------																				
				if(true == $(this).is(':checked')){									//																											
					data = $(this).val();									//																											
				}																	//	拼接当前页的货品唯一码																					
			});	
			
			$.ajax({
				url: "/index.php?m=system&c=printer&a=changeLabel",
				type: 'post',
				data: {data:data,type:type},
				dataType: 'json',
				success: function (data) {
					if(data.cede = "ok"){
						layui.use('layer', function(){
							var layer = layui.layer;
						  
							layer.msg('修改成功', {time: 2000, icon:1});
						});
					}else{
						layui.use('layer', function(){
							var layer = layui.layer;
						  
							layer.msg('修改失败', {time: 2000, icon:2});
						});
					}
				}
			});
			
		}

	},
});

																																												
																																																	
