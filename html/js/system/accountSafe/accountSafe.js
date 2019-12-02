mini.parse();
	
var datagrid = mini.get("datagrid");
datagrid.load();

function addAccMobile(){
	var windowAdd = mini.get("windowAdd");
	windowAdd.setTitle("添加验证手机");
	
	mini.get('addnewMobile').show();
	mini.get('unbundMobile').hide();
	mini.get('mobileInput').show();
	mini.get('mobileInput').setEnabled(true);
	mini.get('sendVerifyCode').setEnabled(true);
	mini.get('mobileInput').setValue("");
	mini.get('verifyCode').setValue("");
	mini.get('sendVerifyCode').show();
	mini.get('sendUnbundVerifyCode').hide();
	
	windowAdd.showAtPos("center", "middle");
}

function unbundAccount(id){
	var windowAdd = mini.get("windowAdd");
	windowAdd.setTitle("解绑验证手机");
	
	mini.get('addnewMobile').hide();
	mini.get('unbundMobile').show();
	mini.get('mobileInput').hide();
	mini.get('mobileInput').setEnabled(true);
	mini.get('sendVerifyCode').setEnabled(true);
	mini.get('mobileInput').setValue(id);
	mini.get('verifyCode').setValue("");
	mini.get('sendVerifyCode').hide();
	mini.get('sendUnbundVerifyCode').show();
	
	windowAdd.showAtPos("center", "middle");
}

function sendVerifyCode(i){
	var mobile = mini.get('mobileInput').value;
	
	if(mobile && mobile.length == 11){
		mini.get('sendVerifyCode').setEnabled(false);
		
		if(i == 60){
			$.ajax({
				url: "?m=system&c=accountSafe&a=account_check",
				type: "post",
				data: {mobile: mobile},
				dataType: "json",
				success: function (data) {
					if(data.code == "ok" || data.code == "0000"){
						mini.get('mobileInput').setEnabled(false);
						mini.get('sendVerifyCode').setEnabled(false);
						mini.get('sendVerifyCode').setText("验证码已发送，"+i+"秒后可重新发送");
						
						if(i > 0){
							i--;
							setTimeout(function () {
								sendVerifyCode(i);
							}, 1000);
						}else if(i == 0){
							mini.get('sendVerifyCode').setEnabled(true);
							mini.get('sendVerifyCode').setText("发送验证码");
						}
					}else{
						mini.alert("验证码发送失败！【" + data.msg + "】");
						mini.get('mobileInput').setEnabled(true);
						mini.get('sendVerifyCode').setEnabled(true);
						mini.get('sendVerifyCode').setText("发送验证码");
					}
				}
			});
		}else{
			mini.get('sendVerifyCode').setText("验证码已发送，"+i+"秒后可重新发送");
		}
	}else{
		mini.showTips({
			content: "请输入一个正确的手机号",
			state: 'danger',
			x: 'center',
			y: 'top',
			timeout: 3000
		});
	}
}

function sendUnbundVerifyCode(i){
	var mobile = mini.get('mobileInput').value;
	
	if(i == 60){
		$.ajax({
			url: "?m=system&c=accountSafe&a=account_check",
			type: "post",
			data: {id: mobile},
			dataType: "json",
			success: function (data) {
				if(data.code == "ok" || data.code == "0000"){
					mini.get('mobileInput').setEnabled(false);
					mini.get('sendUnbundVerifyCode').setEnabled(false);
					mini.get('sendUnbundVerifyCode').setText("验证码已发送，"+i+"秒后可重新发送");
					
					if(i > 0){
						i--;
						setTimeout(function () {
							sendUnbundVerifyCode(i);
						}, 1000);
					}else if(i == 0){
						mini.get('sendUnbundVerifyCode').setEnabled(true);
						mini.get('sendUnbundVerifyCode').setText("发送验证码");
					}
				}else{
					mini.alert("验证码发送失败！【" + data.msg + "】");
					mini.get('mobileInput').setEnabled(true);
					mini.get('sendUnbundVerifyCode').setEnabled(true);
					mini.get('sendUnbundVerifyCode').setText("发送验证码");
				}
			}
		});
	}else{
		mini.get('sendUnbundVerifyCode').setText("验证码已发送，"+i+"秒后可重新发送");
	}
}

function addnewMobile(){
	var windowAdd = mini.get("windowAdd");
	var mobile = mini.get('mobileInput').value;
	var verifyCode = mini.get('verifyCode').value;
	
	if(mobile == ""){
		mini.showTips({
			content: "请输入一个正确的手机号",
			state: 'danger',
			x: 'center',
			y: 'top',
			timeout: 3000
		});
		return false;
	}else if(verifyCode == ""){
		mini.showTips({
			content: "请输入验证码",
			state: 'danger',
			x: 'center',
			y: 'top',
			timeout: 3000
		});
		return false;
	}
	
	$.ajax({
		url: "?m=system&c=accountSafe&a=verifyCode_check",
		type: "post",
		data: {mobile: mobile, verifyCode: verifyCode},
		dataType: "json",
		success: function (data) {
			if(data.code == "ok"){
				mini.alert("添加成功");
				
				windowAdd.hide();
				datagrid.reload();
			}else{
				mini.alert(data.msg);
			}
		}
	})
}

function unbundMobile(){
	var windowAdd = mini.get("windowAdd");
	var mobile = mini.get('mobileInput').value;
	var verifyCode = mini.get('verifyCode').value;
	
	if(mobile == ""){
		mini.showTips({
			content: "非法解绑",
			state: 'danger',
			x: 'center',
			y: 'top',
			timeout: 3000
		});
		return false;
	}else if(verifyCode == ""){
		mini.showTips({
			content: "请输入验证码",
			state: 'danger',
			x: 'center',
			y: 'top',
			timeout: 3000
		});
		return false;
	}
	
	$.ajax({
		url: "?m=system&c=accountSafe&a=unbundVerifyCode_check",
		type: "post",
		data: {mobile: mobile, verifyCode: verifyCode},
		dataType: "json",
		success: function (data) {
			if(data.code == "ok"){
				mini.alert("解绑成功");
				
				windowAdd.hide();
				datagrid.reload();
			}else{
				mini.alert(data.msg);
			}
		}
	})
}