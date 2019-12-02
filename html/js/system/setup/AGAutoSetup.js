mini.parse();

var isAGData = [{ id: '0', text: '关闭' }, { id: '1', text: '开启'}];

var layer;
layui.use(['layer','form'], function () {
	var form = layui.form();
    layer = layui.layer;
	
	$.ajax({
		url: "/index.php?m=system&c=setup&a=getAGConfig",
		type: 'post',
		data: {},
		dataType: 'json',
		success: function (data) {
			$("#unshipped").prop("checked", data.unshipped);
			$("#shipped").prop("checked", data.shipped);
			form.render();
		}
	});
});

var grid = mini.get('grid1');
grid.load();


//提交保存
function saveData(){
	grid.validate();
	var unshipped = $('#unshipped').prop('checked');
	var shipped = $('#shipped').prop('checked');
	
	var data = grid.getData();
	var json = mini.encode(data);
	
	$.ajax({
		url: "/index.php?m=system&c=setup&a=setAGConfig",
		type: "post",
		dataType: "json",
		data: { unshipped: unshipped, shipped: shipped, submitData: json },
		success: function (data) {
			if(data['code'] == 'ok'){
				grid.load();
				
				layer.msg('设置成功！',{
					icon: 1,
					time: 2000
				});
			}else{
				layer.msg(data['msg'],{
					icon: 0,
					time: 2000
				});
			}
		}
	});
}