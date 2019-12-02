mini.parse();

var isAGData = [{ id: '0', text: '关闭' }, { id: '1', text: '开启'}];

var layer;
layui.use(['layer','form'], function () {
	var form = layui.form();
    layer = layui.layer;
	
	$.ajax({
		url: "/index.php?m=system&c=setup&a=getBaseConfig",
		type: 'post',
		data: {},
		dataType: 'json',
		success: function (data) {
			$("input[name='autoPreDelivery'][value="+data.autoPreDelivery+"]").prop("checked","checked");
			$("#autoPreDeliTime").val(data.autoPreDeliTime);
			$("#autoPreTimeStr").val(data.autoPreTimeStr);
			$("#autoPreTimeEnd").val(data.autoPreTimeEnd);
			
			form.render();
		}
	});
	
	
	form.on('submit(formSubmit)', function(data){
		var obj = data.field;
		var data = grid.getData();
		var json = mini.encode(data);
	
		$.ajax({
			url: "/index.php?m=system&c=setup&a=savePreDeliveryConfig",
			type: 'post',
			data: {data: obj, submitData: json},
			dataType: 'json',
			success: function (data) {
				if(data.code == 'ok'){
					grid.load();
					
					layer.msg('保存成功',{
						icon: 1,
						time: 2000
					});
				}
				else
				{
					parent.layer.msg(data.msg,{
						icon: 2,
						time: 2000
					});		
				}
			}
		});

		return false;
	});
});

var grid = mini.get('grid1');
grid.load();
