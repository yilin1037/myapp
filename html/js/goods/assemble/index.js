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
		url: "/index.php?m=goods&c=assemble&a=saveAssembleList",
		type: "post",
		dataType: "json",
		data: { submitData: json },
		success: function (a) {
			if(a.code == 'ok')
			{
				layer.msg("提交成功！",{
					icon: 1,
					time: 2000
				});	
			}
			else
			{
				layer.msg(a.msg,{
					icon: 2,
					time: 2000
				});		
			}
			grid.load();
		}
	});
}

function search(){
	var prd_no = mini.get('prd_no_filter').value;
	var sku_name = mini.get('sku_name_filter').value;
	grid.load({prd_no: prd_no, sku_name: sku_name});
}

function addParseRow(){
	grid2.addRow({type: 'id'}, 0);
}
function removeParseRow(){
	var rows = grid2.getSelecteds();
	if (rows.length > 0) {
		grid2.removeRows(rows, true);
	}
}