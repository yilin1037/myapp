mini.parse();

var layer;
layui.use(['layer'], function () {
    layer = layui.layer ;
});

var grid = mini.get('grid1');
var type = [{ id: 'outer_id', text: '一级商家编码'},{ id: 'sku_outer_id', text: '二级商家编码'}];
grid.load();
var grid2 = mini.get('grid2');


function addRow(){
	grid.addRow({type: 'sku_outer_id'}, 0);
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
		url: "/index.php?m=goods&c=association&a=groupFormulaSave",
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

function search(){
	var keyword = mini.get('keywordFilter').value;
	var Formula = mini.get('FormulaFilter').value;
	grid.load({keyword: keyword,Formula: Formula});
}

function ExcelInput(){
	mini.open({
		title:"EXCEL导入",
		width:400,
		allowResize:false,
		showMaxButton:false,
		height:150,
		url:"/index.php?m=goods&c=association&a=excelIndex"
	});
}

function notParse(){
	var win = mini.get("notParseList");
    win.showAtPos();
	$("#notParseList .mini-textbox-input").val("");
	grid2.load();
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
function saveParseData(){
	grid2.validate();
	if (grid2.isValid() == false) {
		var error = grid2.getCellErrors()[0];
		grid2.beginEditCell(error.record, error.column);
		return;
	}

	var data = grid2.getChanges();
	var json = mini.encode(data);
	$.ajax({
		url: "/index.php?m=goods&c=association&a=saveForBomExtra",
		type: "post",
		dataType: "json",
		data: { submitData: json },
		success: function (data) {
			if(data.code == 'ok'){
				layer.msg(data.msg,{
					icon: 1,
					time: 2000
				});
				grid2.load();
			}else{
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}
		}
	});
}

function search2(){
	var num_iid = mini.get('numiidFilter').value;
	grid2.load({num_iid: num_iid});
}





















