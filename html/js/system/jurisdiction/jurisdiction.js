var flow = new Vue({
	el: '#flow',
	data: {
		wh_data:[],
		user_data:[],
		layprint:[],
		isPrint:"",
	},
	mounted: function() {
		var self = this;
		$(document).ready(function(){
			doGetPrinters(function(data){
				
				self.layprint =  data;
				setTimeout(function(){
					$('.skin input').iCheck({
						checkboxClass: 'icheckbox_minimal',
						radioClass: 'iradio_minimal',
						increaseArea: '20%'
					});
					$.ajax({																																														
						url: "/index.php?m=system&c=jurisdiction&a=getMoban",																																		
						type: 'post',																																												
						data: {},																																													
						dataType: 'json',
						async:false,                           
						success: function (data) {
							if(data.smallTicket){
								$(".mo input[value='" + data.smallTicket + "']").iCheck('check');
							}
							
							if(data.smallTicketPrint){
								$(".pr input[value='" + data.smallTicketPrint + "']").iCheck('check');
							}
							
							if(data.isPrintTicket){
								$(".is input[value='" + data.isPrintTicket + "']").iCheck('check');
							}
							
							if(data.shopname){
								$("#shopname").val(data.shopname);
							}
						}																																															
					});
				},200);
			});
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
		
		//获取打印机
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

	},
	methods: {
		save:function(){
			var self = this;
			
			var out_data = "";
			var userid = $("#userid").val();
			
			if(userid == ""){
				layui.use('layer', function(){
					var layer = layui.layer;
					layer.msg("请选择操作员",{
						icon: 0,
						time: 2000
					});
				});
				return false;
			}
			
			$("input[name='out_wh']:checkbox").each(function(){																																		
				if(true == $(this).is(':checked')){																																					
					out_data += ($(this).val()+",");																																					
				}																																													
			});
			
			if(out_data == ""){
				layui.use('layer', function(){
					var layer = layui.layer;
					layer.msg("请选择仓库",{
						icon: 0,
						time: 2000
					});
				});
				return false;
			}
			
			$.ajax({																																														
				url: "/index.php?m=system&c=jurisdiction&a=setIn",																																		
				type: 'post',																																												
				data: {userid:userid,out_data:out_data},																																													
				dataType: 'json',
				async:false,
				success: function (data) {
					if(data.code == "ok"){
						layui.use('layer', function(){
							var layer = layui.layer;
							layer.msg("操作成功",{
								icon: 1,
								time: 2000
							});
						});
					}
				}																																															
			});
			
		},
		
		save_moban:function(){
			var self = this;
			var moban = "";
			var print = "";
			var shopname = $("#shopname").val();
			$("input[name='moban']:radio").each(function(){																																		
				if(true == $(this).is(':checked')){																																					
					moban = $(this).val();																																					
				}																																													
			});
			
			$("input[name='express']:radio").each(function(){																																		
				if(true == $(this).is(':checked')){																																					
					print = $(this).val();																																					
				}																																													
			});
			
			if(moban == ""){
				layui.use('layer', function(){
					var layer = layui.layer;
					layer.msg("请选择销售小票打印模板",{
						icon: 0,
						time: 2000
					});
				});
				return false;
			}
			
			if(print == ""){
				layui.use('layer', function(){
					var layer = layui.layer;
					layer.msg("请选择销售小票默认打印机",{
						icon: 0,
						time: 2000
					});
				});
				return false;
			}
			
			$.ajax({																																														
				url: "/index.php?m=system&c=jurisdiction&a=setMoban",																																		
				type: 'post',																																												
				data: {print:print,moban:moban,isPrint:self.isPrint,shopname:shopname},																																													
				dataType: 'json',
				async:false,
				success: function (data) {
					if(data.code == "ok"){
						layui.use('layer', function(){
							var layer = layui.layer;
							layer.msg("操作成功",{
								icon: 1,
								time: 2000
							});
						});
					}
				}																																															
			});
		}
	}
});

$(document).ready(function(){
	$('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
	});
})

$('#yes').on('ifChecked ifUnchecked', function(event){
	if (event.type == 'ifChecked') {																																								
		flow.isPrint = 1;																																		
	}
});

$('#no').on('ifChecked ifUnchecked', function(event){
	if (event.type == 'ifChecked') {																																								
		flow.isPrint = 0;																																		
	}
});

function userChange(value){
	//$(".order input[name='in_wh']").iCheck('uncheck');
	$(".item input[name='out_wh']").iCheck('uncheck');
	$.ajax({																																														
		url: "/index.php?m=system&c=jurisdiction&a=getIn",																																		
		type: 'post',																																												
		data: {value:value},																																													
		dataType: 'json',
		async:false,
		success: function (data) {
			/*if(data.order){
				var arr = data.order.split(",");
				
				for(var i = 0; i < arr.length; i++){																																				
					$(".order input[value='" + arr[i] + "']").iCheck('check');																																
				}
				
			}else{
				$(".order input[name='in_wh']").iCheck('uncheck');
			}*/
			
			if(data.item){
				var brr = data.item.split(",");
				
				for(var i = 0; i < brr.length; i++){																																				
					$(".item input[value='" + brr[i] + "']").iCheck('check');																																
				}
			}else{
				$(".item input[name='out_wh']").iCheck('uncheck');
			}
		}																																															
	});
}
