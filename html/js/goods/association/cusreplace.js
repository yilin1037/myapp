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
		if($.trim(row.cus_no) == "" || $.trim(row.new_cus_no) == "")  return true;
	});
	
	if(rowNull){
		mini.alert("请先填写档口编号或排序编号");
		return false;
	}
	
    var SynChange = grid.getChanges();
    var data = mini.encode(SynChange);
	var takeSort = mini.get('takeSort').getValue();
    $.ajax({
		type:'POST',
		url: "/index.php?m=goods&c=association&a=cusreplaceSave",
		dataType:'json',
		data:{takeSort:takeSort, "data":data},
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

function ruleExcelInput(){
	$("#fileName").val("");
	$("#fileExcel").val("");
	layer.open({
		type: 1,
		title: '档口排序规则设置',
		skin: 'layui-layer-rim',
		area: ['490px', '250px'],
		shade: 0.3,
		content: $("#importExcel"),
		btn: ['确定', '取消'],
		yes: function(index, layero){
			//采用FormData上传文件
			var fileExcel = $("#fileExcel")[0].files[0];
			if(!fileExcel){
				layer.msg('请选择上传文件', {icon: 2});
				return false;
			}
			var formData = new FormData();
			formData.append("file",fileExcel );
			$.ajax({
				url:'/?m=goods&c=association&a=saveImportExcel',
				type: "post",
				data: formData,
				processData: false,
				contentType: false,
				success:function(data){
					if (typeof data == 'string') {
						var data = JSON.parse(data);
					}
					if(data['code'] == 'ok'){
						layer.close(index);
						layer.msg(data['msg'], {icon: 1});
					} else {
						layer.msg(data.msg, {icon: 2});
					}
					grid.load();
				}
			});	
		}
	});
}

function ruleExcelOutput(){
	var time = new Date().getTime();
	
	$.ajax({
		url: "/?m=goods&c=association&a=ruleExcelOutput&loginact=file",
		type: 'post',
		data: {time: time},
		dataType: 'text',
		success: function (text){
			if(!text){
				var url = "/xls/stalls"+time+".xls?loginact=file";
				$("#ifile").attr('src',url);
			}
		},error: function (jqXHR, textStatus, errorThrown) {
			layer.msg('没有可导出数据',{
				icon: 0,
				time: 2000
			});
		}
	});
	
}