layui.use(['form', 'layer', 'table'], function(){
	var layer = layui.layer,form = layui.form;
	var table = layui.table;
	
	$.ajax({
		url: "/index.php?m=system&c=setup&a=getMobileConfig",
		type: 'post',
		data: {},
		dataType: 'json',
		success: function (data) {
			$("#dataStatistics").prop("checked", data.dataStatistics);
			form.render();
		}
	});
		
	form.on('submit(formSubmit)', function(data){
		var obj = data.field;
		$.ajax({
			url: "/index.php?m=system&c=setup&a=saveMobileConfig",
			type: 'post',
			data: {data: obj},
			dataType: 'json',
			success: function (data) {
				if(data.code == 'ok'){
					layer.msg('保存成功',{
						icon: 1,
						time: 2000
					});
				}
				else{
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