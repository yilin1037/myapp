mini.parse();
function addRow(){
	mini.open({
		title:"新增标记",
		width:200,
		allowResize:false,
		showMaxButton:true,
		height:120,
		url:"/index.php?m=aftersale&c=aftersaleNew&a=addMark",
		loadOnRefresh: true,
		ondestroy: function (action) {
			if(action == 'ok'){
				history.go(0);
			}
		}
		
	});
	
}
function SetData(data){
	if(data.rowData){
		mini.get('sh_no').setValue(data.rowData);
	}
}
function onCancel(){
	CloseWindow("cancel");
}
function CloseWindow(action) {
	if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
	else window.close();            
}
function onOk(){
	var mark = mini.get('combo1').getValue();
	var sh_no = mini.get('sh_no').value;

	$.ajax({
		url: "/index.php?m=aftersale&c=aftersaleNew&a=setStatusMark",
		type: 'post',
		data: {sh_no: sh_no, mark: mark},
		dataType: 'json',
		success: function (data) {
			if(data.code == "error"){
				mini.showTips({
					content: "【" + data.msg + "】",
					state: 'danger',
					x: 'center',
					y: 'center',
					timeout: 3000
				});
			}else{
				CloseWindow("ok");
			}
		}
	});
	function CloseWindow(action) {
		if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
		else window.close();            
	}
}