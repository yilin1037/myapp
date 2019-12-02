var tableList = new Vue({
	el: '#tableList',
	data: {
		unique_code:"",
		order:"",
	},
	mounted: function() {
		var self = this;
		$("#unique_code").focus();
		layui.use(['tree', 'layer','element'], function(){
			var layer = layui.layer,element=layui.element
			,$ = layui.jquery; 
		  
		   
		});
	},
	methods: {
		getunique_code:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				var unique_code = $("#unique_code").val();
				self.unique_code = unique_code;
				$.ajax({																																														
					url: "/index.php?m=afterSale&c=returnOrder&a=getunique_code",																																		
					type: 'post',																																												
					data: {unique_code: unique_code},																																													
					dataType: 'json',																																											
					success: function (data) {
						if(data.code == "ok"){
							
							$(".showTable").css("display","block");
							self.order = data.result[0];
							speckText("通过");
							layer.msg("通过",{
								icon: 1,
								time: 2000
							});
							$("#unique_code").val("");
							$("#unique_code").focus();
						}else if(data.code == "repeat"){
							speckText("重复扫描");
							layer.msg("重复扫描",{
								icon: 0,
								time: 2000
							});
							self.order = data.result[0];
							$(".showTable").css("display","block");
							$("#unique_code").val("");
							$("#unique_code").focus();
						}else if(data.code == "error"){
							speckText("无效的唯一码");
							layer.msg("无效的唯一码",{
								icon: 0,
								time: 2000
							});
							$(".showTable").css("display","none");
							$("#unique_code").val("");
							$("#unique_code").focus();
						}
					}																																															
				});
			}
		},
		
		blurNow:function(){
			var self = this;
			var price = $(event.target).val();
			$.ajax({																																														
				url: "/index.php?m=afterSale&c=returnOrder&a=save_price",																																		
				type: 'post',																																												
				data: {price: price,unique_code:self.unique_code},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
					}
				}																																															
			});
		}
	},
		
																																																	
																																																	
});	


$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});																																																	
