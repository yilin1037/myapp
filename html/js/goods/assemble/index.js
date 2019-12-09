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
function click_file(){
	$("#file_excel").click();
}
function ajax_file(){
	var $file1 = $("input[name='file_excel']").val();//用户文件内容(文件)
	// 判断文件是否为空 
	if ($file1 == "") {
		layer.msg("请选择上传的目标文件",{
			icon: 2,
			time: 2000
		});	
		$("input[name='file_excel']").val('');
		return false;
	}
	//判断文件类型,我这里根据业务需求判断的是Excel文件
	var fileName1 = $file1.substring($file1.lastIndexOf(".") + 1).toLowerCase();
	if(fileName1 != "xls"){
		layer.msg("请选择xls文件",{
			icon: 2,
			time: 2000
		});	
		$("input[name='file_excel']").val('');
		return false;
	}
	//判断文件大小
	var size1 = $("input[name='file_excel']")[0].files[0].size;
	if (size1>104857600) {
		layer.msg("上传文件不能大于100M",{
			icon: 2,
			time: 2000
		});	
		$("input[name='file_excel']").val('');
		return false;				
	}
	
	var type = "file";
	var formData = new FormData();//这里需要实例化一个FormData来进行文件上传 
	formData.append(type,$("#file_excel")[0].files[0]);

    $.ajax({
        url: "/index.php?m=goods&c=assemble&a=file_excel",
        dataType:'json',
        type:'POST',
        async: false,
        data: formData,
        processData : false, // 使数据不做处理
        contentType : false, // 不要设置Content-Type请求头
        success: function(data){
        	if(data.code=='ok'){
	            layer.msg(data.msg,{
					icon: 1,
					time: 2000
				});	
        	}else{
        		layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});	
        	}
			$("input[name='file_excel']").val('');
        	grid.load();

        },
        error:function(response){
            layer.msg("网络错误,请重试",{
				icon: 2,
				time: 2000
			});	
        }
    });

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