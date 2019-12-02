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
		if($.trim(data[i]['keyword']) == '' && $.trim(data[i]['flag_sellers']) == ''){
			layer.msg("卖家备注关键词与卖家旗帜不可都为空",{
				icon: 2,
				time: 2000
			});
			return false;
		}else{
			data[i]['keyword'] = $.trim(data[i]['keyword']);
		}
		
		if($.trim(data[i]['replace_title']) == ''){
			layer.msg("替换商品编码不能为空！",{
				icon: 2,
				time: 2000
			});
			return false;
		}else{
			data[i]['replace_title'] = $.trim(data[i]['replace_title']);
		}
		
		if($.trim(data[i]['replace_prd_no']) == ''){
			layer.msg("替换商品名称不能为空！",{
				icon: 2,
				time: 2000
			});
			return false;
		}else{
			data[i]['replace_prd_no'] = $.trim(data[i]['replace_prd_no']);
		}
	}
	var json = mini.encode(data);

	$.ajax({
		url: "/index.php?m=goods&c=brushOrder&a=groupBrushSave",
		type: "post",
		dataType: "json",
		data: { submitData: json },
		success: function (data) {
			if(data['code'] == 'ok'){
				grid.load();
			}
			layer.msg(data['msg'],{
				icon: 1,
				time: 2000
			});
			
		}
	});
}

//搜索
function search(){
	var shopname = mini.get('keywordFilterOne').value;
	var replace_prd_no = mini.get('keywordFilterTwo').value;
	var replace_title = mini.get('keywordFilterThree').value;
	var replace_key = mini.get('keywordFilterFour').value;
	grid.load({shopname: shopname,replace_prd_no: replace_prd_no,replace_title: replace_title,replace_key:replace_key});
}

