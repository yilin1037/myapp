mini.parse();

var layer;
layui.use(['layer'], function () {
    layer = layui.layer ;									
});

var grid = mini.get('grid1');
grid.load();

//增加
function addRow(){
	grid.addRow({}, 0);
}
//删除
function removeRow(){
	var rows = grid.getSelecteds();
	if (rows.length > 0) {
		grid.removeRows(rows, true);
	}
}

//提交保存
function saveData(){
	grid.validate();
	if (grid.isValid() == false) {
		var error = grid.getCellErrors()[0];
		grid.beginEditCell(error.record, error.column);
		return;
	}
	var data = grid.getChanges();
	console.log(data);
	for(var i=0;i<data.length;i++){
		if($.trim(data[i]['prd_lable']) == ''){
			layer.msg("商品标签不能为空！",{
				icon: 2,
				time: 2000
			});
			return false;
		}else{
			data[i]['prd_lable'] = $.trim(data[i]['prd_lable']);
		}
	}
	var json = mini.encode(data);

	$.ajax({
		url: "/index.php?m=goods&c=association&a=savePrdLable",
		type: "post",
		dataType: "json",
		data: { submitData: json },
		success: function (data) {
			if(data['code'] == 'ok'){
				layer.msg(data['msg'],{
					icon: 1,
					time: 2000
				});
			}else if(data['code'] == 'error'){
				layer.msg(data['msg'],{
					icon: 2,
					time: 2000
				});
			}
		}
	});
}


