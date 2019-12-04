var flow = new Vue({
	el: '#flow',
	data: {

		money:0,
		id: '',
		recharge_data : [],
		zftype: '',
//        zfb: '',
//        wx: '',
//        send_tel: '',
//         ratio: '',
//         title: '',
// 		DXSUM: '',
// 		DXNAME: '',
		buttonname:'提交'
	},
	mounted: function() {
		var self = this;

		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {
            var $ = layui.jquery;
			var element = layui.element;
			var layer = layui.layer ;
            var form = layui.form();
			var layer = layui.layer;
			var layedit = layui.layedit;
			var laydate = layui.laydate;


			//获取充值数据
			$.ajax({
				url: "/index.php?m=system&c=finance&a=getRechargeData",
				type: "POST",
				dataType:"json",
				data:{},
				success:function(data){
					self.recharge_data = data;
				}
			});

            //点击立即充值
			form.on('submit(RechargeButton)', function (data) {
				// console.log(data.elem);
				// console.log();
				self.zftype = 'zfb';
				self.money = data.elem.getAttribute('data-recharge_amount');
				self.id = data.elem.getAttribute('data-recharge_id');
				$("#zfb").prop("checked", true);
				$("#wx").prop("checked", false);
				layer.open({
					type: 1,
					title: '请选择充值方式',
					skin: 'layui-layer-rim', //加上边框
					area: ['60%', '75%'], //宽高
					shade: 0.3,
					content: $("#edit-pages"),
					cancel: function (index, layero) {
						//if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
						//layer.close(index)
						//$("#edit-pages").hide();
						// }
						// return false;
					}
				});
				form.render('checkbox');
				return false;
			});

			//选择完支付方式的提交按钮
			form.on('submit(childAccount_addedit)', function (data) {
				$.ajax({
					url: "/index.php?m=system&c=message&a=savedxadd",
					type: "POST",
					dataType:"json",
					data:{chongprice:'chong',type:self.zftype,price:self.money,id:self.id},
					beforeSend:function(){
						layer.load(2);
						$("#sub").addClass("layui-btn-disabled");
						$("#sub").removeClass("btn");
						$("#sub").addClass("btnOnlyStyle");
					},
					success:function(data){

						layer.closeAll();
						var typeStr = '支付宝';
						if(data['zftype']=='wx'){
							typeStr = '微信'
						}
						$('#imgpach').attr('src',"images/"+data['imageUrl']);
						//console.log(data);
						layer.open({
							type: 1,
							title: '请用'+typeStr+'扫描二维码支付',
							skin: 'layui-layer-rim', //加上边框
							area: ['60%', '75%'], //宽高
							shade: 0.3,
							content: $("#add-price"),
							cancel: function (index, layero) {

							}
						});
						$("#sub").removeClass("layui-btn-disabled");
						$("#sub").addClass("btn");
						$("#sub").removeClass("btnOnlyStyle");
					}
				});
				return false;

			});


			form.on('switch(switchszfb)', function(data){
				console.log(data);
				$("#wx").prop("checked", !data.elem.checked)
				if(data.elem.checked){
					flow.zftype = 'zfb';
				}else{
					flow.zftype = 'wx';
				}
				form.render('checkbox');
			});
			form.on('switch(switchwx)', function(data){
				console.log(data);

				$("#zfb").prop("checked", !data.elem.checked)
				if(data.elem.checked){
					flow.zftype = 'wx';
				}else{
					flow.zftype = 'zfb';
				}
				form.render('checkbox');
			});
			form.on('submit(pricesearch)', function (data) {
				layer.closeAll();
				layer.alert('支付完成后，请刷新页面查看[账户余额]');
				return false;
			});


		});
		
		
	},
	methods: {
		sub:function(){
			
			var money = $("#money").val();
			console.log("111");
			var r = /^\+?[1-9][0-9]*$/;　　//正整数
			var flag=r.test(money);
			
			if(money == "" || flag == false || money == 0){
				$("#hide").css("display","block");
				return false;
			}else{
				$("#hide").css("display","none");
			
			
				flow.zftype = 'zfb';
				flow.money = money;
				$("#zfb").prop("checked", true)
				$("#wx").prop("checked", false)
				 layer.open({
						type: 1,
						title: '请选择充值方式',
						skin: 'layui-layer-rim', //加上边框
						area: ['60%', '75%'], //宽高
						shade: 0.3,
						content: $("#edit-pages"),
						cancel: function (index, layero) {
							//if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
							//layer.close(index)
							//$("#edit-pages").hide();
							// }
							// return false;
						}
					});
				form.render('checkbox');
				return false;	
			}

		},
		RechargeClick:function () {
			alert("ches ");
		}

	}
});