var vue = new Vue({
	el: '#vue',
	data: {
		dataList:"",
	},
	mounted: function() {
		$.ajax({
			url:'?m=system&c=InsteadAudit&a=getData',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				vue.dataList = data;
			}
		})
		layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
			var laydate = layui.laydate //日期
				,laypage = layui.laypage //分页
				layer = layui.layer //弹层
				,form = layui.form //表单
				,element = layui.element; //元素操作
			var table = layui.table;
			
			form.on('submit(formDemo)', function(data){
				var dataList = data.field;
				$.ajax({
					url:'?m=system&c=InsteadAudit&a=setSyncInstead',
					dataType: 'json',
					type: "post",
					data:{
						data:dataList,
					},
					success:function(data){
						if(data.code == 'ok'){
							layer.msg(data['msg'], {
								icon: 1,
								time: 2000
							});
						}else{
							layer.msg(data['msg'], {
								icon: 2,
								time: 2000
							});
						}
					}
				})
				return false;
			});
			
		});
	},
	methods: {
		
		
		
		
		
		
		
		
		
		
	}
	
});