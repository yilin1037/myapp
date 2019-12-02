mini.parse();

mini.get('mobile').setData(mobileObj);

function send(i){
	var mobile = mini.get('mobile').value;
	if(mobile == ""){
		mini.alert("请先选择一个验证手机");
		return false;
	}
	
	mini.get('send').setEnabled(false);
	mini.get('send').setText("验证码已发送，"+i+"秒后可重新发送");
	
	if(i == 60){
		$.ajax({
			url:"?m=system&c=accountSafe&a=sendVerifyCode",
			type:"POST",
			data:{system_id: system_id, user_id: user_id, sessionId: sessionId, mobileId: mobile},
			dataType:"json",
			success:function(data){
				if(data.code == "error"){
					mini.alert(data.msg);
				}else{
					mini.get('VerifyToken').setValue(data.token);
				}
			}
		})
	}
	
	if(i > 0){
		i--;
		setTimeout(function () {
			send(i);
		}, 1000);
	}else if(i == 0){
		mini.get('send').setEnabled(true);
		mini.get('send').setText("发送验证码");
	}
}

function VerifyCheck(){
	var VerifyCode = mini.get('VerifyCode').value;
	var VerifyToken = mini.get('VerifyToken').value;
	if(VerifyCode == ""){
		mini.alert("请填写验证码");
		return false;
	}
	if(VerifyToken == ""){
		mini.alert("非法请求");
		return false;
	}
	
	$.ajax({
		url:"m=system&c=accountSafe&a=checkVerifyCode",
		type:"POST",
		data:{VerifyCode: VerifyCode, VerifyToken: VerifyToken},
		dataType:"json",
		success:function(data){
			if(data.verifyResult == "success"){
				mini.alert("账户验证成功！请重新登录！","",function(e){
					window.location.href = "/index.php?m=system&c=index&a=index";
				});
			}else{
				mini.alert("验证码错误："+data.errMsg);
			}
		}
	})
}