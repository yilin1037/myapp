   layui.use(['element','layer'], function(){
            var $ = layui.jquery,element = layui.element,layer = layui.layer;

            $(document).on('click','.layui-btn', function(){
                 var oldpass=$("#oldpass").val();
                 var newpass=$("#newpass").val();
				 var newpassAgain = $("#newpassAgain").val();
				 
				 if(oldpass == ""){
					$("#errorMsg").show();
                    $("#errorMsg").html("请填写原密码！！！");
                    return false;
				 }
				 
				  if(newpass == ""){
					$("#errorMsg").show();
                    $("#errorMsg").html("请填写新密码！！！");
                    return false;
				 }
				 
                if(parseInt(oldpass.length) < 6 || parseInt(oldpass.length)>16){
					
                    $("#errorMsg").show();
                    $("#errorMsg").html("原密码长度错误！！");
                    return false;
                }
                 if(parseInt(newpass.length) < 6 || parseInt(newpass.length)>16){

                     $("#errorMsg").show();
                     $("#errorMsg").html("新密码长度错误！！");
                     return false;
                 }
				 if(newpass != newpassAgain){
					 $("#errorMsg").show();
                     $("#errorMsg").html("两次输入密码不一致，请重新填写");
                     return false;
				 }

                $.ajax({
                    url: "/index.php?m=system&c=setup&a=setPass",
                    data: {oldpass: oldpass, newpass: newpass},
                    dataType: "json",
                    type: "POST",
                    success: function (data) {
                        if(data.code == 'ok')
                        {
                            $("#errorMsg").show();
                            $("#errorMsg").html(data.msg);
                            return false;
                            //layer.msg(title);
                           // window.location.href = "/index.php?m=system&c=setup&a=index";
                        }
                        else
                        {
                            $("#errorMsg").show();
                            $("#errorMsg").html(data.msg);
                            return false;
                        }
                    },
                    error: function()
                    {
                        $("#errorMsg").show();
                        $("#errorMsg").html("连接超时，请重新登录");
                    }
                })

            });




        });