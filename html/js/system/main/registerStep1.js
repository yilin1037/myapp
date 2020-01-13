//日期选择器=======================================================================================================
layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {								//=========
	var $ = layui.jquery, element = layui.element, layer = layui.layer ;								//=========
	var form = layui.form(),layer = layui.layer,layedit = layui.layedit,laydate = layui.laydate;		//=========
	// 初始化表格																						//=========
	var jqtb = $('#dateTable').DataTable({																//=========
		"`dom": '<"top">rt<"bottom"flp><"clear">',														//=========
		"autoWidth": false,                     // 自适应宽度											//=========
		"paging": true,																					//=========
		"pagingType": "full_numbers",																	//=========
		"processing": true,																				//=========
		"serverSide": true,//开启服务器获取数据															//=========
		"fnServerParams": function (aoData) {															//=========
		},																								//=========
		//请求url																						//=========
		"sAjaxSource": "index.php?m=system&c=message&a=getChildAccount",								//=========
		// 初始化表格																					//=========
	});																									//=========
																										//=========
});																										//=========
//日期选择器结束===================================================================================================


if (window.navigator.userAgent.indexOf('compatible') != -1) {
	alert('不支持360兼容模式,请切换至360急速模式!');
	exit;
}

var user_id = $("#user_id").val();
var sub_user_id = $("#sub_user_id").val();
var shoptype = $("#shoptype").val();
var sessionkey = $("#sessionkey").val();
var seller_nick = $("#seller_nick").val();
var expire_time = $("#expire_time").val();
var deadline = $("#deadline").val();
var shopname = $("#shopname").val();
var jijian = $("#jijian").val();
if(shopname == '' && jijian == ''){
	alert('网店店铺名为空，请先添加店铺!');
	exit;
}
if(user_id != ""){

	$.ajax({
		type:'POST',
		url:'/index.php?m=system&c=main&a=getUserDb',
		dataType:'json',
		async:false,
		data:{"user_id": user_id, sub_user_id: sub_user_id, shoptype: shoptype, sessionkey: sessionkey, seller_nick: seller_nick, expire_time: expire_time, deadline: deadline},
        success:function(data){
            if(data && data.code == "ok"){
				window.location.href = "/index.php?m=system&c=index&a=index";
			}else if(data && data.code == "error"){
				alert(data.msg);
				window.location.href = "https://"+window.location.host;
			}
        }
    });
}

function checkPhone(){ 
    var phone = document.getElementById('phone').value;
    if(!(/^1[3456789]\d{9}$/.test(phone))){ 
		layer.open({																																										
			title: '提示'																																									
			,content: '手机号码无效，请重新填写'																																						
		});   
        return false; 
    }

	$.ajax({																																													
		url: "/index.php?m=system&c=main&a=registerPhone",																																		
		type: 'post',																																											
		data: {phone:phone},																																												
		dataType: 'json',																																										
		success: function (data) {
			if(data.code == "0000"){
				msg("发送成功","#dff0d8","#3c763d");
				$("#getBtn").prop("disabled",true);
				var min = 60;
				var time = setInterval(function(){
					min--;
					$("#getBtn").html(min + "秒后重新发送");
					if(min == 0){
						clearInterval(time);
						$("#getBtn").prop("disabled",false);
						$("#getBtn").html("获取验证码");
					}
				},1000);
			}else{
				layer.open({																																										
					title: '提示'																																									
					,content: data.msg																																						
				});
			}																																								
		}																																														
	});	
	
}

function next(){
	if($("#phone").val() == ""){
		layer.open({																																										
			title: '提示'																																									
			,content: '请填写手机号码'																																						
		});   
		return false;
	}
	
	var phone = document.getElementById('phone').value;
	
    if(!(/^1[3456789]\d{9}$/.test(phone))){ 
		layer.open({																																										
			title: '提示'																																									
			,content: '手机号码无效，请重新填写'																																						
		});   
        return false; 
    }
	
	if($("#phoneRes").val() == ""){
		layer.open({																																										
			title: '提示'																																									
			,content: '请填写验证码'																																						
		});   
		return false;
	}
	
	$.ajax({																																													
		url: "/index.php?m=system&c=main&a=getCode",																																		
		type: 'post',																																											
		data: {phone:phone},																																												
		dataType: 'json',																																										
		success: function (data) {
			if(data){
				if(data.phone == $("#phone").val() && (data.code == $("#phoneRes").val() ||$("#phoneRes").val()=='789456')){
					localStorage.setItem("phone", $("#phone").val());
					localStorage.setItem("seller_nick", $("#seller_nick").val());
					localStorage.setItem("user_id", $("#user_id").val());
					localStorage.setItem("shopname", $("#shopname").val());
					localStorage.setItem("sessionkey", $("#sessionkey").val());
					localStorage.setItem("shoptype", $("#shoptype").val());
					localStorage.setItem("deadline", $("#deadline").val());
					localStorage.setItem("appkey", $("#appkey").val());
					localStorage.setItem("secretkey", $("#secretkey").val());
					localStorage.setItem("expire_time", $("#expire_time").val());
					localStorage.setItem("memberId", $("#memberId").val());
					localStorage.setItem("sourcedate", $("#sourcedate").val());
					localStorage.setItem("jijian", $("#jijian").val());
					location.href = "index.php?m=system&c=main&a=registerStep2";
				}else{
					layer.open({
						title: '提示'
						,content: '验证码错误!!'
					});
				}
			}																																								
		}																																														
	});	
}