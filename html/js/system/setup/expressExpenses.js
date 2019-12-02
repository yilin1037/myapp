mini.parse();

var layer;
layui.use(['layer'], function () {
    layer = layui.layer ;
});

mini.parse();
var grid = mini.get('grid1');
var grid2 = mini.get('grid2');
var round_way = [{ id: 0, text: '不取整' }, { id: 1, text: '向上取整'},{ id: 2, text: '向下取整'}];
grid.load();
        
function add(){
    mini.open({
		title:"区域设置",
		width:400,
		allowResize:true,
		showMaxButton:true,
		height:550,
        bodyStyle: "padding:5px;",
		url:"?m=system&c=setup&a=expressExpensesAreaNew",
        ondestroy: function (action) {
            grid.reload();
        }
    });    
}

function edit(id){
    mini.open({
		title:"区域设置",
		width:800,
		allowResize:true,
		showMaxButton:true,
		height:500,
        bodyStyle: "padding:5px;",
		url:"?m=system&c=setup&a=expressExpensesAreaEdit",
		onload: function () {
			var iframe = this.getIFrameEl();
			iframe.contentWindow.SetData(id);
		},
        ondestroy: function (action) {
            grid.reload();
        }
    });        
}

function remove(){
    var rows = grid.getSelecteds();
    if (rows.length > 0) {
        mini.confirm("确定删除选中记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    var ids = [];
                    for (var i = 0, l = rows.length; i < l; i++) {
                        var r = rows[i];
                        ids.push(r.id);
                    }
                    var id = ids.join(',');
                    grid.loading("操作中，请稍后......");
                    
                    $.ajax({
                        url: "?m=system&c=setup&a=areaDel&id="+id,
                        type: "post",
                        async:false,
                        success: function (text) {
                            mini.alert("删除成功");
                            grid.reload();
                        }
                    });
                }
            }
        );
    } else {
        mini.alert("请选中一条记录");
    }
}

function look(id){
    $.ajax({
		url: "?m=system&c=setup&a=areaLook&id="+id,
		type: "post",
		dataType: 'json',
		success: function (data) {
			mini.open({
				title:"区域查看",
				width:300,
				allowResize:true,
				showMaxButton:true,
				height:400,
				bodyStyle: "padding:5px;",
				url:"?m=system&c=setup&a=areaTree",
				onload: function () {
					var iframe = this.getIFrameEl();
					iframe.contentWindow.SetLook(data.AreaScope);
				},
			}); 
		}
	});
}

function onSelectionChanged(){
    var record = grid.getSelected();
    
    if (record) {
        editRow(record._uid);
    }
}

function editRow(row_uid) {
    var row = grid.getRowByUID(row_uid);
    if (row) {
    	grid2.load({ Area_id: row.id });
    }
}

function newRow() {
    var record = grid.getSelected();
    if(record){
        var row = {};
        grid2.addRow(row, 0);
        grid2.cancelEdit();
    }else{
        mini.alert("请先选择一个区域！！");
    }
    
}

function updategrid() {
    var record = grid.getSelected();
	grid2.commitEdit();
    
	grid2.validate();
	if (grid2.isValid() == false) {
		var error = grid2.getCellErrors()[0];
		grid2.beginEditCell(error.record, error.column);
		return;
	}

	var rowData = grid2.getChanges();
		
    grid2.loading("保存中，请稍后......");
	var json = mini.decode(rowData);
    
    if(record.id){
    	$.ajax({
    		url: "?m=system&c=setup&a=expensesUpdate",
            type: "post",
    		data: { Area_id: record.id, data: json },
    		success: function (text) {
    			grid2.reload();
    		}
    	});
    }
}

function cancelRow(){
    grid2.reload();
}

function removeRow(){
    var rows = grid2.getSelecteds();
    if (rows.length > 0) {
        grid2.removeRows(rows, true);
    }
}