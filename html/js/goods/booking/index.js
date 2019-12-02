mini.parse();

var layer;
layui.use(['layer'], function () {
    layer = layui.layer ;
});

var grid = mini.get('grid1');
grid.load();


function addRow(){
	grid.addRow({}, 0);
}

function removeRow(){
	var rows = grid.getSelecteds();
	if (rows.length > 0) {
		for($i=0;$i<rows.length;$i++){
			rows[$i]['_state']='removed';
		}
		var data1 =mini.encode(rows);
		$.ajax({
			url: "/index.php?m=goods&c=booking&a=groupFormulaSave",
			type: "post",
			dataType: "json",
			data: { data: data1},
			success: function (json) {
				if(json['code'] == "ok"){
					grid.removeRows(rows, true);
				}
			}
		});
		//grid.removeRows(rows, true);
	}
}

function saveData(){
	grid.validate();
	if (grid.isValid() == false) {
		var error = grid.getCellErrors()[0];
		grid.beginEditCell(error.record, error.column);
		return;
	}
	var data = grid.getChanges();
	var json = mini.encode(data);

	$.ajax({
		url: "/index.php?m=goods&c=booking&a=groupFormulaSave",
		type: "post",
		dataType: "json",
		data: { data: json },
		success: function (json) {
			if(json['code'] == "ok"){
				layer.msg("提交成功！",{
					icon: 1,
					time: 2000
				});
				grid.load();
			}else{
				layer.msg(json['msg'],{
					icon: 2,
					time: 2000
				});
			}
		}
	});
}

function search(){
	var prd_no = mini.get('prd_no_search').value;
	grid.load({prd_no: prd_no});
}