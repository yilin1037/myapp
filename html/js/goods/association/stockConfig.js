mini.parse();

$(document).ready(function(){
	layui.use(['form'], function () {
		var form = layui.form();
		loadUploadConfig(form);
		form.on('switch(manualUpload)', function(data){
			var check = data.elem.checked;
			saveUploadConfig('manual',form,check);
		});
		
		form.on('switch(autoUpload)', function(data){
			var check = data.elem.checked;
			saveUploadConfig('auto',form,check);
		});
	});
});


var upload_type = [{ id: 1, text: '实际库存' }, { id: 2, text: '可用库存'}];
var grid = mini.get('grid1');
grid.load();

//提交保存
function oncellendedit(e){
	var data = grid.getChanges();
	var json = mini.encode(data);

	$.ajax({
		url: "/index.php?m=goods&c=association&a=stockConfigSave",
		type: "post",
		dataType: "json",
		data: { submitData: json },
		success: function (data) {
			grid.load();
		}
	});
}

function saveUploadConfig(type,form,check){
	$.ajax({
		url: "/index.php?m=goods&c=association&a=saveUploadConfig",
		type: "post",
		dataType: "json",
		data: { type: type, check: check},
		success: function (data) {
			
		}
	});
}

function loadUploadConfig(form){
	$.ajax({
		url: "/index.php?m=goods&c=association&a=loadUploadConfig",
		type: "post",
		dataType: "json",
		data: {},
		success: function (data) {
			if(data.manualUpload == 'true'){
				$("#manualUpload").attr("checked",true);
				form.render('checkbox','manualUpload');
			}else if(data.manualUpload == 'false'){
				$("#manualUpload").attr("checked",false);
				form.render('checkbox','manualUpload');
			}
			
			if(data.autoUpload == 'true'){
				$("#autoUpload").attr("checked",true);
				form.render('checkbox','autoUpload');
			}else if(data.autoUpload == 'false'){
				$("#autoUpload").attr("checked",false);
				form.render('checkbox','autoUpload');
			}
			
			mini.get('outsideStorage').setValue(data.storage);
		}
	});
}

function onOk(){
	CloseWindow("ok");
}

function onCancel(){
	CloseWindow("cancel");
}

function GetData(){
	var data = grid.getData();
	var json = mini.encode(data);
    return json;
}

function CloseWindow(action) {
	if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
	else window.close();
}

var comboxClick = 0;
function onValuechanged(e){
	var value = e.value;
	comboxClick = 1;
	
	setTimeout(function(){
		comboxClick = 0;
	},2000);
	
	
	setTimeout(function(){
		if(comboxClick == 0){
			$.ajax({
				url: "/index.php?m=goods&c=association&a=stockConfigStorageSave",
				type: "post",
				dataType: "json",
				data: {storage: value},
				success: function (data) {
					
				}
			});	
		}
	},2000);
}