mini.parse();
function onOk(){
	var mark = $('#mark').val();
	if(mark ==""){
		mini.showTips({
			content: "标记不能为空",
			state: 'danger',
			x: 'center',
			y: 'center',
			timeout: 3000
		});	
		return false;
	}
	$.ajax({
		url: "/index.php?m=aftersale&c=aftersaleNew&a=saveMark",
		type: 'post',
		data: {mark: mark},
		dataType: 'json',
		success: function (data) {
			if(data.code =='ok'){
				
				CloseWindow("ok");
			}else{
				mini.showTips({
					content: "标记已存在",
					state: 'danger',
					x: 'center',
					y: 'center',
					timeout: 3000
				});		
			}
		}
	});
}
function CloseWindow(action) {
	if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
	else window.close();            
}

	
