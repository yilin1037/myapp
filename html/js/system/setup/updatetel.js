   layui.use(['element','layer'], function(){
            var $ = layui.jquery,element = layui.element,layer = layui.layer;

            // 初始化表格
            $('#dateTable').DataTable({
                "dom": '<"top">rt<"bottom"flp><"clear">',
                "autoWidth": false,                     // 自适应宽度
                "stateSave": true,                      // 刷新后保存页数
                "order": [[ 1, "desc" ]],               // 排序
                "searching": false,                     // 本地搜索
                "info": true,                           // 控制是否显示表格左下角的信息
                "stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
                "aoColumnDefs": [{                      // 指定列不参与排序
                    "orderable": false,
                    "aTargets": [0,6]                   // 对应你的表格的列数
                }],
                "pagingType": "simple_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
                "language": {                           // 国际化
                    "url":'language.json'
                }
            });

            // 例:获取ids
            $(document).on('click','#getBtn', function(){
                var phone = $("#phone").val();
				if(!(/^1[34578]\d{9}$/.test(phone))){ 
					layer.msg('请输入有效手机号',{
						icon: 2,
						time: 2000
					});  
					return false; 
				}
				$.ajax({
					url: "/index.php?m=system&c=setup&a=getPhone",
					type: 'post',
					data: {phone:phone},
					dataType: 'json',
					success: function (data) {
						if(data.code == "0000"){
							layer.msg('发送成功',{
								icon: 1,
								time: 2000
							});
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
							layer.msg(data.msg,{
								icon: 2,
								time: 2000
							});
						}
					}
				});
				
            });
			
			$(document).on('click','#change', function(){
				var phone = $("#phone").val();
				var newPhone = $("#newPhone").val();
				var phoneRes = $("#phoneRes").val();
				if(phone == ""){
					layer.msg("请填写原手机号",{
						icon: 2,
						time: 2000
					});
					return false; 
				}
				
				if(!(/^1[34578]\d{9}$/.test(phone))){ 
					layer.msg('请输入有效的原手机号',{
						icon: 2,
						time: 2000
					});  
					return false; 
				}
				
				if(phoneRes == ""){
					layer.msg("请填写验证码",{
						icon: 2,
						time: 2000
					});
					return false; 
				}
				
				if(newPhone == ""){
					layer.msg("请填写新手机号",{
						icon: 2,
						time: 2000
					});
					return false; 
				}
				
				if(newPhone == phone){
					layer.msg("新手机号不能与原手机号相同",{
						icon: 2,
						time: 2000
					});
					return false; 
				}
				
				if(!(/^1[34578]\d{9}$/.test(newPhone))){ 
					layer.msg('请输入有效的新手机号',{
						icon: 2,
						time: 2000
					});  
					return false; 
				}
				
				$.ajax({
					url: "/index.php?m=system&c=setup&a=resetPhone",
					type: 'post',
					data: {phoneRes:phoneRes,newPhone:newPhone,phone:phone},
					dataType: 'json',
					success: function (data) {
						
						if(data.code == "success"){
							layer.msg("修改成功",{
								icon: 1,
								time: 2000
							});
						}else{
							layer.msg(data.msg,{
								icon: 2,
								time: 2000
							});
						}
					}
				});
				
				
			});
            // you code ...


        });