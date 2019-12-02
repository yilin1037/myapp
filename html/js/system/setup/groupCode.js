var code = new Vue({
	el: '#code',
	data: {
		dataArr:[],
		library_number:'',
		num_library:'',
		item_library:'',
		item_num_sort:''
	},
	mounted: function() {
		var self = this;
		layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
				var $ = layui.jquery, element = layui.element, layer = layui.layer;
				var form = layui.form(), layer = layui.layer, layedit = layui.layedit, laydate = layui.laydate;
				
					$.ajax({
						url: "/index.php?m=system&c=setup&a=getgroupcode",
						type: 'post',
						data: {},
						dataType: 'json',
						success: function (data) {
							if(data){
								self.dataArr = data.groupcode;
								self.library_number = data.library_number;
								self.num_library = data.num_library;
								self.item_library = data.item_library;
								self.item_num_sort = data.item_num_sort;
								$("#item_num_sort").prop("checked", data.item_num_sort);
							}
							form.render();
						}
					});
					
					form.on('submit(saveconfig)', function (data) {
						console.log(data);
						for(var key in data.field)
						{
							if(key == 'library_number')
							{
								if(data.field.library_number === ""){
									layer.msg("请填写库位数",{
										icon: 0,
										time: 2000
									});
									return false;
								}	
							}
							else if(key == 'num_library')
							{
								if(data.field.num_library === ""){
									layer.msg("请填写库位订单数",{
										icon: 0,
										time: 2000
									});
									return false;
								}
							}
							else if(key == 'item_library')
							{
								if(data.field.item_library === ""){
									layer.msg("请填写库位商品最大件数",{
										icon: 0,
										time: 2000
									});
									return false;
								}
							}
							else if(key == 'item_num_sort')
							{

							}
							else
							{
								if(data.field[key] == ""){
									layer.msg("请填写所有快递的货架简码",{
										icon: 0,
										time: 2000
									});
									return false;
								}	
							}
						}
						$.ajax({
							url: "/index.php?m=system&c=setup&a=savegroupcode",
							type: 'post',
							data: {savedata:data.field},
							dataType: 'json',
							success: function (data) {
								if(data.code == 'ok'){
									layer.msg('保存成功',{
										icon: 1,
										time: 2000
									});	
								}
								else
								{
									layer.msg(data.msg,{
										icon: 2,
										time: 2000
									});		
								}
							}
						});
						
						return false;
					});
		})
	},
	methods: {
		flod:function(a,index,tab,wave){
			
		}
	},
});


function onUniqueCode(e){
	
	
}


