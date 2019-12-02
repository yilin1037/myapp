mini.parse();
$(window).data("addRow",'false');
var grid = mini.get('grid1');
layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
			var laydate = layui.laydate //日期
				,laypage = layui.laypage //分页
				layer = layui.layer //弹层
				,form = layui.form //表单
				,element = layui.element; //元素操作
			var table = layui.table;
		});
grid.load();

function save(){
    grid.commitEdit();
	
	var rowNull = grid.findRow(function(row){
		if($.trim(row.prd_no) == "" || $.trim(row.num) == "")  return true;
	});
	
	if(rowNull){
		mini.alert("请先填写线上主编码/SKU编码或累计数量");
		return false;
	}
	
    var SynChange = grid.getChanges();
    var data = mini.encode(SynChange);
    $.ajax({
		type:'POST',
		url: "/index.php?m=system&c=labelPrinting&a=explosionPrdtSave",
		dataType:'json',
		data:{ data:data},
        success:function(data){
            grid.load();
        }
    });
}

function addRow(){
    grid.addRow({}, 0);
}

function removeRow(){
    var rows = grid.getSelecteds();
    if (rows.length > 0) {
        grid.removeRows(rows, true);
    }
}



