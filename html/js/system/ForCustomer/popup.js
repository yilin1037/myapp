layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;
	tableLoad.tableLoadFunction();
	
});


//回车搜索
function searchTable(){
	tableLoad.tableLoadFunction();
}



mini.parse();
var grid = mini.get("datagrid1");
var system_id = ''
grid.load();
var menu = new ColumnsMenu(grid);
function onKeyEnter(e) {
	search();
}
function addRow() {          
	var newRow = { name: "New Row" };
	grid.addRow(newRow, 0);

	grid.beginEditCell(newRow, "LoginName");
}
function removeRow() {
	var rows = grid.getSelecteds();
	if (rows.length > 0) {
		grid.removeRows(rows, true);                
	}
}
function SetData(data) {
	this.system_id= data['systems_id']
	
}

function saveData() {
	grid.commitEdit();
	var SynChange = grid.getChanges();
	var data = mini.decode(SynChange);
	var systems_id = this.system_id;
	console.log(systems_id)
	$.ajax({
		url:'/?m=system&c=ForCustomer&a=editRetrunCatchM',
		dataType: 'json',
		type: "post",
		data:{
			data: data,
			system_id: systems_id
		},
		success:function(res){
			layer.msg(res.msg);
		}
	})
}

grid.on("celleditenter", function (e) {
	var index = grid.indexOf(e.record);
	if (index == grid.getData().length - 1) {
		var row = {};
		grid.addRow(row);
	}
});

grid.on("beforeload", function (e) {
	if (grid.getChanges().length > 0) {
		if (confirm("有增删改的数据未保存，是否取消本次操作？")) {
			e.cancel = true;
		}
	}
});


var grid2 = mini.get("datagrid2");
var menu = new ColumnsMenu(grid2);
function onKeyEnter(e) {
	search();
}
function addRowOne() {     
	var grid2 = mini.get("datagrid2");
	var newRow = { name: "New Row" };
	grid2.addRow(newRow, 0);
	grid2.beginEditCell(newRow, "LoginName");
}
function removeRowOne() {
	var grid2 = mini.get("datagrid2");
	var rows = grid2.getSelecteds();
	if (rows.length > 0) {
		grid2.removeRows(rows, true);                
	}
}
function saveDataOne() {
	var grid2 = mini.get("datagrid2");
	var systems_id = vue.systems_id;
	grid2.commitEdit();
	var SynChange = grid2.getChanges();
	var data = mini.decode(SynChange);
	$.ajax({
		url:'/?m=system&c=ForCustomer&a=User',
		dataType: 'json',
		type: "post",
		data:{
			data: data,
			system_id: systems_id
		},
		success:function(res){
			layer.msg(res.msg);
		}
	})
}

grid2.on("celleditenter", function (e) {
	var index = grid2.indexOf(e.record);
	if (index == grid2.getData().length - 1) {
		var row = {};
		grid2.addRow(row);
	}
});

grid2.on("beforeload", function (e) {
	if (grid2.getChanges().length > 0) {
		if (confirm("有增删改的数据未保存，是否取消本次操作？")) {
			e.cancel = true;
		}
	}
});

