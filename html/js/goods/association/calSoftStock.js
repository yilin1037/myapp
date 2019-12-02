mini.parse();

$(document).ready(function(){
	layui.use(['form'], function () {
		var form = layui.form();
		loadUploadConfig(form);
		
		form.on('switch(allprd)', function(data){
			var check = data.elem.checked;
			if(check == true){
				$("#top_sale").attr('disabled',true);
				$("#num_sale").attr('disabled',true);
				$("#top_sale").val("");
				$("#num_sale").val("");
			}else{
				$("#top_sale").attr('disabled',false);
				$("#num_sale").attr('disabled',false);
			}
		});
	});
});

//提交保存
function oncellendedit(e){
	var day_sale = $("#day_sale").val();
	var day_stock = $("#day_stock").val();
	var allprd = $("#allprd").prop("checked");
	var top_sale = $("#top_sale").val();
	var num_sale = $("#num_sale").val();

	$.ajax({
		url: "/index.php?m=goods&c=association&a=softStockSave",
		type: "post",
		dataType: "json",
		data: { day_sale: day_sale, day_stock: day_stock, allprd: allprd, top_sale: top_sale, num_sale: num_sale},
		success: function (data) {
			CloseWindow("ok");
		}
	});
}

function loadUploadConfig(form){
	$.ajax({
		url: "/index.php?m=goods&c=association&a=getStockConfig",
		type: "post",
		dataType: "json",
		data: {},
		success: function (data) {
			if(data.allprd == 'true'){
				$("#allprd").attr("checked",true);
				form.render('checkbox','allprd');
			}
			
			$("#day_sale").val(data.day_sale);
			$("#day_stock").val(data.day_stock);
			$("#top_sale").val(data.top_sale);
			$("#num_sale").val(data.num_sale);
		}
	});
}

function onCancel(){
	CloseWindow("cancel");
}

function CloseWindow(action) {
	if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
	else window.close();
}