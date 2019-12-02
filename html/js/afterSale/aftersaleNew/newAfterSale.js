mini.parse();
mini.get('queryKey').focus();
var datagrid1 = mini.get('datagrid1');

function searchOrder(){
	var queryKey = mini.get('queryKey').value;
	var send_date1 = mini.get('send_date1').getFormValue();
	var send_date2 = mini.get('send_date2').getFormValue();
	
	datagrid1.load({queryKey: queryKey, send_date1: send_date1, send_date2: send_date2});
}

function SetData(data){
	if(data.sh_no){
		mini.get('sh_no').setValue(data.sh_no);
	}
	
	if(data.special){
		mini.get('special').setValue(data.special);	
		
		if(data.special == 'wuxinxijian'){
			$('#toolbar1').hide();
			$('#datagrid1').hide();
			$('#table1').css('width','100%');
		}else if(data.special == 'bangding'){
			$('#table1').hide();
		}
	}
	
}

function onCancel(){
	CloseWindow("cancel");
}

function onOk(){
	var special = mini.get('special').value;
	var selectData = datagrid1.getSelected();
	if(!selectData && special != 'wuxinxijian'){
		mini.showTips({
            content: "请先选择一个订单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		
		return false;
	}
	
	if(selectData){
		var new_tid = selectData.new_tid;
	}else{
		var new_tid = "无信息件";
	}
	
	var express = mini.get('express').value;
	var express_no = mini.get('express_no').value;
	var remark = mini.get('remark').value;
	var title = mini.get('title').value;
	var sh_type = mini.get('sh_type').value;
	var sh_no = mini.get('sh_no').value;
	
	$.ajax({
		url: "/index.php?m=aftersale&c=aftersaleNew&a=newAfterSaleSave",
		type: 'post',
		data: {new_tid: new_tid, express: express, express_no: express_no, remark: remark, title: title, sh_type: sh_type, special: special, sh_no: sh_no},
		dataType: 'json',
		success: function (data) {
			if(data.code == "error"){
				mini.showTips({
					content: "新增失败【" + data.msg + "】",
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