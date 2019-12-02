mini.parse();
var datagrid1 = mini.get('datagrid1');

function SetData(data){
	var sh_no = data.sh_no;
	var type = data.type;
	mini.get('sh_no').setValue(sh_no);
	mini.get('type').setValue(type);
	
	datagrid1.load({sh_no: sh_no});
}

function onCancel(){
	CloseWindow("cancel");
}

function onOk(){
	var selectData = datagrid1.getSelecteds();
	var sh_no = mini.get('sh_no').value;
	var type = mini.get('type').value;
	if(selectData.length == 0){
		mini.showTips({
            content: "请先选择一个商品",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
	}
	
	data = JSON.stringify(selectData);
	data = encodeURI(data);
	
	$.ajax({
		url: "/index.php?m=aftersale&c=aftersaleNew&a=addRefundItems",
		type: 'post',
		data: {sh_no: sh_no, type: type, data: data},
		dataType: 'json',
		success: function (data) {
			if(data.code == "error"){
				mini.showTips({
					content: "添加失败【" + data.msg + "】",
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
}

function CloseWindow(action) {
	if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
	else window.close();            
}