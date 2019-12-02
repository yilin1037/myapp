var vueObj = new Vue({
    el: '#app',
    data: {
        id:0,
        expense:expense,
        zftype:zftype,
        type:'',
        serviceItems: paramObject.serviceObj,
        chargingItems: paramObject.chargingObj,
        payPackageItems: paramObject.payPackage
    },
    mounted: function () {
        $('.product-box').hover(function (){  
            $(this).addClass('product-box-action');
        },function (){  
            $(this).removeClass('product-box-action');
        });
        layui.use(['layer', 'form'], function(){
            var $ = layui.jquery, layer = layui.layer;
            var form = layui.form();
            $(document).on('click', '.btn-trial', function () {
                var loadIndex = layer.load();
                $.ajax({
					url: "/index.php?m=payment&c=buy&a=trialService",
					type: "POST",
					dataType:"json",
					data:{
					   id:$(this).attr('data-id'),
                       type:$(this).attr('data-type')
					},
					success:function(data){
					   if(data['code'] == 'ok'){
					       parent.layer.alert(data['msg']); 
					   }else{
					       parent.layer.alert(data['msg']);
					   }
				    }	   
				});
            });
            $(document).on('click', '.btn-buy', function () {
                vueObj.zftype = 'zfb';
				vueObj.id = $(this).attr('data-id');
				vueObj.expense = $(this).attr('data-expense');
                vueObj.type = $(this).attr('data-type');
                $("#zfb").prop("checked", true)
				$("#wx").prop("checked", false)
                layer.open({
                    type: 1,
                    title: '请选择充值方式',
                    offset: '100px',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['60%', '75%'], //宽高
                    shade: 0.3,
                    content: $("#payment-pages"),
                    cancel: function (index, layero) {
                        
                    }
                });
                form.render('checkbox');
            });
            //监听提交 生成二维码
            form.on('submit(childAccount_addedit)', function (data) {
                var loadIndex = layer.load();
                $.ajax({
					url: "/index.php?m=payment&c=buy&a=createPayment",
					type: "POST",
					dataType:"json",
					data:data.field,
					success:function(data){
						layer.closeAll();
						var zftypeStr = '支付宝';
						if(data['zftype']=='wx'){
							zftypeStr = '微信'
						}
						$('#imgpach').attr('src',"images/"+data['imageUrl']+"?"+getTimeStamp(true));
						layer.open({
							type: 1,
							title: '请用'+zftypeStr+'扫描二维码支付',
							skin: 'layui-layer-rim', //加上边框
                            offset: '100px',
							area: ['60%', '75%'], //宽高
							shade: 0.3,
							content: $("#payment-pages-code"),
							cancel: function (index, layero) {
								
							}
						});
                        layer.close(loadIndex); 
					}
				});
				return false;
            });
            form.on('submit(pricesearch)', function (data) {
				layer.closeAll();
				return false;
            });
            form.on('switch(switchszfb)', function(data){
                $("#wx").prop("checked", !data.elem.checked);
                if(data.elem.checked){
                    vueObj.zftype = 'zfb'; 
                }else{
                    vueObj.zftype = 'wx';   
                }
                form.render('checkbox');
            });
            form.on('switch(switchwx)', function(data){
                $("#zfb").prop("checked", !data.elem.checked);
                if(data.elem.checked){
                    vueObj.zftype = 'wx'; 
                }else{
                    vueObj.zftype = 'zfb';   
                }
                form.render('checkbox');
            });
            form.on('switch(switchPay_continue)', function(data){
                var data_id = $(data.elem).attr('data-id');
                var data_type = $(data.elem).attr('data-type');
                var pay_continue = data.elem.checked?'T':'F';
                $.ajax({
					url: "/index.php?m=payment&c=buy&a=savePayContinue",
					type: "POST",
					dataType:"json",
					data:{
					   id:data_id,
                       type:data_type,
                       pay_continue:pay_continue,
					},
					success:function(data){
                        
					}
                });
            }); 
        });
    }
});
