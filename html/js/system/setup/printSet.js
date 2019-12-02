var code = new Vue({
	el: '#code',
	data: {
		shopkeeper:"",
		shipper:"",
	},
	mounted: function() {
		var self = this;
		
		$.ajax({
			url: "/index.php?m=system&c=setup&a=getPrint",
			type: 'post',
			data: {},
			dataType: 'json',
			success: function (data) {
				
				if(data){
					self.shopkeeper = data.shopkeeper;
					self.shipper = data.shipper;
				}

			}
		});
		layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
				var $ = layui.jquery, element = layui.element, layer = layui.layer;
				var form = layui.form(), layer = layui.layer, layedit = layui.layedit, laydate = layui.laydate;
				
		})
	},
	methods: {
		change:function(){
			var shopkeeper = $("#shopkeeper").val();
			var shipper = $("#shipper").val();

			$.ajax({
				url: "/index.php?m=system&c=setup&a=savePrint",
				type: 'post',
				data: {shopkeeper:shopkeeper,shipper:shipper},
				dataType: 'json',
				success: function (data) {
					if(data.code == 'ok'){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});	

					}
					/*else
					{
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});	
						return false;						
					}*/
					
				}
			});
		}
	},
});




