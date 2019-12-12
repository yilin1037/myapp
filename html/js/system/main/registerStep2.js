
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

//============================ 省市区选择处理 =================================== 
var phone = localStorage.getItem("phone");
var seller_nick = localStorage.getItem("seller_nick");
var user_id = localStorage.getItem("user_id");
var shopname = localStorage.getItem("shopname");
var sessionkey = localStorage.getItem("sessionkey");
var shoptype = localStorage.getItem("shoptype");
var appkey = localStorage.getItem("appkey");
var secretkey = localStorage.getItem("secretkey");
var deadline = localStorage.getItem("deadline");
var expire_time = localStorage.getItem("expire_time");
var memberId = localStorage.getItem("memberId");
var jijian = localStorage.getItem("jijian");
if(user_id != "" ){
	$.ajax({
		type:'POST',
		url:'/index.php?m=system&c=main&a=getUserInfo',
		dataType:'json',
		async:false,
		data:{phone: phone, seller_nick: seller_nick, user_id: user_id, shopname: shopname, sessionkey: sessionkey, shoptype: shoptype, appkey: appkey, secretkey: secretkey, deadline: deadline, expire_time: expire_time, memberId: memberId},
        success:function(data){
            if(data && data.code == "ok"){
				window.location.href = "/index.php?m=system&c=index&a=index";
			}else if(data && data.code == "error"){
				alert(data.msg);
				document.body.innerHTML="";
			}
        }
    });
}

//============================ 省市区选择处理结束 =================================== 

function next(){
	var company = $("#company").val();
	var province = $("#province2").val();
	var city = $("#city2").val();
	var district = $("#district2").val();
	var concact = $("#concact").val();
	var adminPass = $("#adminPass").val();
	var adminPassAgain = $("#adminPassAgain").val();
	var invite = $("#invite").val();
	if(company == ""){
		$(".companyTrue").css("display","block");
		return false;
	}else{
		$(".companyTrue").css("display","none");
	}
	
	if(province == ""){
		$(".placeTrue").css("display","block");
		return false;
	}else{
		$(".placeTrue").css("display","none");
	}
	
	if(concact == ""){
		$(".tipCon").html("请填写联系人");
		$(".concactTrue").css("display","block");
		return false;
	}else{
		$(".concactTrue").css("display","none");
	}
	
	var reg = /^[\u4E00-\u9FA5]{2,4}$/;
 
	if(!reg.test(concact)){
		$(".tipCon").html("请输入合法联系人姓名");
	    $(".concactTrue").css("display","block");
		return false;
	}else{
		$(".concactTrue").css("display","none");
	}
	
	if(adminPass == ""){
		$(".tipPa").html("请输入密码");
		$(".adminPassTrue").css("display","block");
		return false;
	}else{
		$(".adminPassTrue").css("display","none");
	}
	
	var regExp=/^[0-9A-Za-z]{6,20}$/;
	if(!regExp.test(adminPass)){
		$(".tipPa").html("长度不合法，请重新输入");
		$(".adminPassTrue").css("display","block");
		return false;
	}else{
		$(".adminPassTrue").css("display","none");
	}
	
	if(adminPassAgain == ""){
		$(".tips").html("请填写确认密码");
		$(".adminPassAgainTrue").css("display","block");
		return false;
	}else{
		$(".adminPassAgainTrue").css("display","none");
	}
	
	if(adminPassAgain != adminPass){
		$(".tips").html("两次填写密码不一致，请重新填写！");
		$(".adminPassAgainTrue").css("display","block");
		return false;
	}else{
		$(".adminPassAgainTrue").css("display","none");
	}
	
	var phone = localStorage.getItem("phone");
	var seller_nick = localStorage.getItem("seller_nick");
	var user_id = localStorage.getItem("user_id");
	var shopname = localStorage.getItem("shopname");
	var sessionkey = localStorage.getItem("sessionkey");
	var shoptype = localStorage.getItem("shoptype");
	var appkey = localStorage.getItem("appkey");
	var secretkey = localStorage.getItem("secretkey");
	var deadline = localStorage.getItem("deadline");
	var expire_time = localStorage.getItem("expire_time");
	var memberId = localStorage.getItem("memberId");
	var jijian = localStorage.getItem("jijian");
	var newData = {
		"company":company,
		"province":province,
		"address":$('#province2 option:selected').text() + $('#city2 option:selected').text() + $('#district2 option:selected').text(),
		"city":city,
		"district":district,
		"concact":concact,
		"adminPass":adminPass,
		"invite":invite,
		"phone": phone,
		"seller_nick": seller_nick,
		"user_id": user_id,
		"shopname": shopname,
		"sessionkey": sessionkey,
		"shoptype": shoptype,
		"deadline": deadline,
		"expire_time": expire_time,
		"appkey": appkey,
		"secretkey": secretkey,
		"memberId": memberId,
		"jijian": jijian,
	};
	
	$.ajax({
		type:'POST',
		url:'/index.php?m=system&c=main&a=registerNow',
		dataType:'json',
		async:false,
		data:{"data": newData},
        success:function(data){
            if(data.code == "0000"){
				location.href = "/index.php?m=system&c=main&a=registerStep3";
			}else if(data.code != "0000"){
				layer.open({																																										
					title: '提示'																																									
					,content: data.msg																																						
				});
			}
		   
        }
    });
	
}
