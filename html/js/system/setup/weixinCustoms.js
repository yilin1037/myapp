mini.parse();

var layer;
layui.use(['layer'], function () {
    layer = layui.layer ;									
});

var grid = mini.get('grid1');
grid.load();


//提交保存
function saveData(){
	/*grid.validate();
	if (grid.isValid() == false) {
		var error = grid.getCellErrors()[0];
		grid.beginEditCell(error.record, error.column);
		return;
	}*/
	var data = grid.getChanges();
	console.log(data);
	var json = mini.encode(data);

	$.ajax({
		url: "/index.php?m=system&c=setup&a=saveWeixinCustoms",
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
/*function search(){
	var shopname = mini.get('keywordFilterOne').value;
	var replace_prd_no = mini.get('keywordFilterTwo').value;
	var replace_title = mini.get('keywordFilterThree').value;
	var replace_key = mini.get('keywordFilterFour').value;
	grid.load({shopname: shopname,replace_prd_no: replace_prd_no,replace_title: replace_title,replace_key:replace_key});
}*/

