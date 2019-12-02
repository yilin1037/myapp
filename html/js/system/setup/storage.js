layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
	var $ = layui.jquery, element = layui.element, layer = layui.layer;
	var form = layui.form(), layer = layui.layer, layedit = layui.layedit, laydate = layui.laydate;
	
	$.ajax({
		url: "/index.php?m=system&c=setup&a=getStorageType",
		type: 'post',
		data: {},
		dataType: 'json',
		success: function (data) {
			if(data){
				$("input[name='storage_type'][value="+data.storage_type+"]").prop("checked","checked");
				form.render();
			}
		}
	});
	
	form.on('submit(saveconfig)', function (data) {
		var storage_type = data.field.storage_type;
		
		$.ajax({
			url: "/index.php?m=system&c=setup&a=saveStorageType",
			type: 'post',
			data: {storage_type: storage_type},
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


