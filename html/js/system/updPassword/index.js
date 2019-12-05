layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
	var layer = layui.layer
		,element = layui.element;
})

//发送验证码并倒计时30秒钟
var onOff = true;
$(".bottomBtn").click(function(){
	var username = $("#username").val();
	if(username == ''){
		$("#erroruser").html(' <p class="input_name"> <img  src="images/login/false.png"/> 请输入用户名或手机号</p>');
		return false;
	}
	var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
	if (!myreg.test(username)) {  
		$("#erroruser").html('<p class="input_name"> <img  src="images/login/false.png"/> 手机格式有误</p>');
		$("#erroruser").css('display','block');
		return false;  
	}
	$("#errorMsg").css('display','none');
		if(onOff){
		sendVerificationCode(username);
		$(".bottomBtn").html('获取验证码(30)');
		$(".bottomBtn").attr('disabled',true);
		var startTime = 30;
		var timer = setInterval(function(){
			startTime--;
			if(startTime == 0){
				$(".bottomBtn").html('获取验证码');
				$(".bottomBtn").attr('disabled',false);
				onOff = true;
				clearInterval(timer);
			}else{
				$(".bottomBtn").html('获取验证码('+startTime+')');
				$(".bottomBtn").attr('disabled',true);
				onOff = false;
			}
		},1000);
	}

})
function sendVerificationCode(username){
	$.ajax({
		url:'/?m=system&c=updPassWord&a=actionSendCode',
		dataType: 'json',
		type: "post",
		data:{
			TYPE:'login_code',
            mobile:username,
		},
		success:function(data){
			
		}
	})
}
//修改密码并登录
$(".loginBtn").click(function(){
	var username = $("#username").val();
	var verifyCode =  $("#verifyCode").val();
	if(username == ''){
		$("#erroruser").html('<p class="input_name"> <img  src="images/login/false.png"/> 请输入用户名或手机号</p>');
		$("#erroruser").css('display','block');
		return false;
	}
	var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
	if (!myreg.test(username)) {  
		$("#erroruser").html('<p class="input_name"> <img  src="images/login/false.png"/> 手机格式有误</p>');
		$("#erroruser").css('display','block');
		return false;  
	}
	$('#zhanghao').attr("src","images/login/logkai.png")
	$("#erroruser").css('display','none');
	var yanzhengma = $("#yanzhengma").val();
	if(yanzhengma == ''){
		$("#erroryan").html('<p class="input_name"> <img  src="images/login/false.png"/> 请输入验证码</p>');
		$("#erroryan").css('display','block');
		return false;
	}

	$('#yanzheng').attr("src","images/login/yanzheng.png")
	$("#erroryan").css('display','none');
	var password = $("#password").val();
	if(password == ''){
		$("#errorpass").html('<p class="input_name"> <img  src="images/login/false.png"/> 请输入新密码</p>' );
		$("#errorpass").css('display','block');
		return false;
	}

	if(password.length<6){
		$("#errorpass").html('<p class="input_name"> <img  src="images/login/false.png"/> 密码长度需大于五位</p>');
		$("#errorpass").css('display','block');
		return false;
	}

	$('#xinmima').attr("src","images/login/passtrue.png")
	$('#errorpass').css('display','none')
	var repeatPassword = $("#repeatPassword").val();
	if(repeatPassword == ''){
		$("#errorrepeat").html('<p class="input_name"> <img  src="images/login/false.png"/> 请重复输入新密码</p>');
		$("#errorrepeat").css('display','block');
		return false;
	}
	
	$('#repeatmima').attr("src","images/login/passtrue.png")
	if(password != repeatPassword){
		$("#errorrepeat").html('<p class="input_name"> <img  src="images/login/false.png"/> 两次密码输入不一致</p>');
		$("#errorrepeat").css('display','block');
		return false;
	}

	$("#errorMsg").css('display','none');
	$("#errorrepeat").css('display','none');
	$("#errorpass").css('display','none');
	$("#erroryan").css('display','none');
	$("#erroruser").css('display','none');
	password = md5(password);
	$.ajax({
		url:'/?m=system&c=updPassWord&a=updNewPassWord',
		dataType: 'json',
		type: "post",
		data:{
			username: username, 
            password: password,
            code: yanzhengma,
			verifyCode:verifyCode
		},
		success:function(data){
			if(data.code == 'ok'){
				layer.msg('<p class="input_name"> 修改密码成功，正在登录...</p>');
				if($("#save_user_id").prop("checked")){
					localStorage.setItem("user",userName);
				}else{
					localStorage.removeItem("user");
				}
				window.location.href = "/index.php?m=system&c=index&a=index";
			}else{
				$("#errorrepeat").show();
				$("#errorrepeat").html('<p class="input_name"> <img  src="images/login/false.png"/>'+data.msg+'</p>');
				$("#errorrepeat").css('display','block');
				console.log()	
			}
		}
	})
})
//更改imgurl
