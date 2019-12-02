mini.parse();

var layer;
layui.use(['layer'], function () {
    layer = layui.layer ;																													
});

var grid = mini.get('grid1');
var type = [{ id: 'seller', text: '卖家备注'},{ id: 'buyer', text: '买家留言'}];
grid.load();

function addRow(){
	grid.addRow({type: 'seller'}, 0);
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
	
	for(var i=0;i<data.length;i++){
		if($.trim(data[i]['min_money']) == ''){
			layer.msg("最小金额不能为空！",{
				icon: 2,
				time: 2000
			});
			return false;
		}
		
		if($.trim(data[i]['max_money']) == ''){
			layer.msg("最大金额不能为空！",{
				icon: 2,
				time: 2000
			});
			return false;
		}
	}
	var json = mini.encode(data);
	$.ajax({
		url: "/index.php?m=system&c=setup&a=saveWuliuPayment",
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