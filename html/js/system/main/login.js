
if(localStorage.getItem("user")){
	var user = localStorage.getItem("user");
	$("#username").val(user);
	$("#save_user_id").prop("checked",true);
}
$(function(){
	$(".loginBtn").click(function(){
		Login();
	});	
})

function LoginNow(event){
	var e = event || window.event
	if(e.keyCode == 13){
		Login();
	}
}

$('.user #username').mouseout(function(){
	console.log("username")
	$('#zhanghao').attr("src","images/login/logkai.png")
})
$(".user #password").mouseout(function(){
	console.log("password")
	$('#mima').attr("src","images/login/passtrue.png")
})
function Login(){
	var userName = $("#username").val();
	var password = $("#password").val();
	var verifyCode = "";
	if(userName.length>20 || userName.length<3){
		$("#username").focus();
		$("#errorMsg").show();
		$("#errorName").html('<p class="input_name"> <img  src="images/login/false.png"/> 请输入正确手机号</p>');
		return false;
	}
		$("#errorName").html('<img  style="transform: translateY(180%);"src="images/login/true.png"/>');

	if(password.length<6||password.length>16){
		$("#errorMsg").focus();
		$("#errorMsg").show();
		$("#errorMsg").html('<p class="input_name"> <img  src="images/login/false.png"/> 请输入正确密码</p>');
		return false;
	}
	$("#yanzhima").css('display','block');
		if($("#checkcodeBox").is(":visible") != false){
			var verifyCode = $("#verifyCode").val();
			if(verifyCode == ""){
				$("#verifyCode").focus();
				$("#errorMsg").show();
				$("#errorMsg").html('<p class="input_name"> <img  src="images/login/false.png"/> 请填写正确的验证码！</p>');
				return false;
			}
		}
		$('#yanzhi').attr("src","images/login/yanzheng.png")
	$("#errorbox").show();
	$("#errorMsg").html('<p class="input_denglu">登录中... </p>');
	$("#errorName").html('<p></p>');
	password = md5(password);
	$.ajax({
		url: "/index.php?m=system&c=main&a=setLogin",
		data: {username: userName, password: password, verifyCode: verifyCode},
		dataType: "json",
		type: "POST",
		success: function (data) {
			if(data.code == 'ok')
			{
				if($("#save_user_id").prop("checked")){
					localStorage.setItem("user",userName);
				}else{
					localStorage.removeItem("user");
				}
				window.location.href = "/index.php?m=system&c=index&a=index";
			}
			else if(data.code == 'warning')//御城河风险登录
			{
				window.location.href = "/index.php?m=system&c=index&a=verify";
				console.log("aa")
			}
			else
			{
				if(data.msg == "登录失败次数过多!"){
					$("#errorMsg").show();
					$("#errorMsg").html('<p class="input_name">  登录失败次数过多</p>');
					$("#checkcodeBox").show();
					var path = 'verifyCode.php?' + Math.random();
					$(".checkcode").attr('src', path);
				}else{
					$("#errorMsg").show();
					$("#errorMsg").html('<p class="input_name"> <img  src="images/login/false.png"/> 用户名或密码错误</p>');
				}
			}
		},
		error: function()
		{
			$("#errorMsg").show();
			$("#errorMsg").html( '<p class="input_name"> <img  src="images/login/false.png"/> 连接超时，请重新登录</p>');	
		}
	})
}

$('.refreshVerify').bind({
	click: function() {
		var path = 'verifyCode.php?' + Math.random();
		$(".checkcode").attr('src', path);
	}
});