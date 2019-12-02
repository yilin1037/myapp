mini.parse();

var layer;
layui.use(['layer'], function () {
    layer = layui.layer ;																													
});

var grid = mini.get('grid1');
grid.load();

function download(){
	$.ajax({
		url: "/index.php?m=system&c=setup&a=downloadUserOnline",
		type: "post",
		dataType: "json",
		success: function (json) {
			grid.load();
		}
	});
}

function removeRow(){
	var rows = grid.getSelecteds();
	if (rows.length > 0) {
		grid.removeRows(rows, true);
	}
}

function saveData(){
	grid.validate();
	if (grid.isValid() == false) {
		//alert("请校验输入单元格内容");
		var error = grid.getCellErrors()[0];
		grid.beginEditCell(error.record, error.column);
		return;
	}

	var data = grid.getChanges();
	var json = mini.encode(data);

	$.ajax({
		url: "/index.php?m=system&c=setup&a=saveUserOnline",
		type: "post",
		dataType: "json",
		data: { submitData: json },
		success: function (json) {
			layer.msg("提交成功！",{
				icon: 1,
				time: 2000
			});
			grid.load();
		}
	});
}