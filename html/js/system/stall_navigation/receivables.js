var flow = new Vue({
	el: '#flow',
	data: {
		isShow:false,
		isShow1:false,
		customer:[],				//用户名称数据
		customer_index:"",			//点击选择用户时，记录此用户在数组内的index值
		customer_detailArr:[],      //用户消费记录数据
		show:true,
		payWay:"",				//支付方式  cash:现金    bank:银行卡     weixin:微信      zhifubao:支付宝    arrears:欠款    默认现金
		customer_show:false,		//判断是否选了客户
		src:"",						//支付方式对应的图片
		message:"",
		name:"",
		
	},
	mounted: function() {
		var self = this;
		
		$(document).ready(function(){
			layui.use(['element','layer','laydate'], function(){
				var $ = layui.jquery
				,element = layui.element,layer=layui.layer,laydate = layui.laydate; //Tab的切换功能，切换事件监听等，需要依赖element模块
				
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var day = date.getDate(); 
				
				var nowDate = year + "-" + month + "-" + day;          //当前日期
				self.payment_time = nowDate;						   //销售日期默认值为当前时间
				//限定可选日期
				var ins22 = laydate.render({
					elem: '#test-limit1'
					,max: nowDate
					,ready: function(){
						
					},
					value: nowDate
					,done: function(value, date){
						self.payment_time = value;
					}
				});
			  
			});
		});

	},
	methods: {
		
		//客户列表查询
		names_key:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode != 13){
				var value = $("#names").val();
				getCustomer(value);
			}
			
			
		},
		
		names_down:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				var cus_no = self.customer[0].cus_no;
				self.choose_customer('0',cus_no);
			}
			
		},
		
		//选择支付方式
		choose_way:function(way){
			var self = this;
			$(".choose_way").each(function(){
				$(this).css("borderColor","#dddddd");
			});
			
			$("."+way).css("borderColor","#ff6a3c");
			
			if(way != "cash"){
				self.show = false;
			}else{
				self.show = true;
			}
			
			self.payWay = way;
			
		},
		
		
		//选择客户
		choose_customer:function(index,cus_no){
			var self = this;
			
			self.customer_index = index;
			
			$("#names").attr("placeholder",self.customer[index].cus_name);
			$(".hideDiv1").css("display","none");
			
			self.name = self.customer[index].cus_name;
			
			self.getMessage(cus_no);
			
			self.isShow1 = false;
		},
		
		getMessage:function(cus_no){
			var self = this;
			$.ajax({
				url: "/index.php?m=system&c=stall_navigation&a=getMessage",
				data: {cus_no:cus_no},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data){
						data.money = Math.abs(data.arrears);
						self.message = data;
					}else{
						self.message = [];
					}
				}
			});
		},
		
		sure:function(){
			var self = this;
			var receve = $("#arrears").val();
			
			if(self.name == ""){
				layer.msg("请先选择客户",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			if(receve === "" || receve === 0){
				layer.msg("请输入收款金额",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			if(self.payWay == ""){
				layer.msg("请选择收款方式",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			/*if(self.message.arrears == 0){
				layer.confirm('当前客户欠款为0，确定收款么？', {
					btn: ['确定', '取消'] //可以无限个按钮
					,btn3: function(index, layero){
						//按钮【按钮三】的回调
					}
				}, function(index, layero){
					//按钮【按钮一】的回调
					
					$.ajax({
						url: "/index.php?m=system&c=stall_navigation&a=updateNow",
						data: {cus_no:self.customer[self.customer_index].cus_no,money:receve,payWay:self.payWay},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data){
								if(data.code == "ok"){
									layer.msg("操作成功",{
										icon: 1,
										time: 2000
									});
									self.getMessage(self.customer[self.customer_index].cus_no);
									$("#arrears").val("");
								}
							}else{
								layer.msg("操作失败",{
									icon: 2,
									time: 2000
								});
							}
						}
					});
					
				}, function(index){
					//按钮【按钮二】的回调
				});
			}else{*/
				$.ajax({
					url: "/index.php?m=system&c=stall_navigation&a=updateNow",
					data: {cus_no:self.customer[self.customer_index].cus_no,money:receve,payWay:self.payWay},
					dataType: "json",
					type: "POST",
					success: function (data) {
						if(data){
							if(data.code == "ok"){
								layer.msg("操作成功",{
									icon: 1,
									time: 2000
								});
								self.getMessage(self.customer[self.customer_index].cus_no);
								$("#arrears").val("");
							}
						}else{
							layer.msg("操作失败",{
								icon: 2,
								time: 2000
							});
						}
					}
				});
			//}
			
		}
		
	}
});

function names_focus(){
	
	getCustomer($("#names").val());
}

function names_blur(){
	if(!flow.isShow1){
		$(".hideDiv1").css("display","none");
	}
}

$(".hideDiv1").hover(
  function () {
    flow.isShow1 = true;
  },
  function () {
    flow.isShow1 = false;
  }
);

//获取客户列表
function getCustomer(value){
	$.ajax({
		url: "/index.php?m=system&c=stall_navigation&a=getCustomer",
		data: {value:value},
		dataType: "json",
		type: "POST",
		success: function (data) {
			if(data){
				flow.customer = data;
				$(".hideDiv1").css("display","block");
			}else{
				$(".hideDiv1").css("display","none");
			}
		}
	});
}

//重置
function reset_now(){
	$("#good_name").attr("placeholder","直接输入开始销售");
	$("#good_price").val("0.00");
	$("#good_num").val(1);
	$("#order_price_all").html("0.00");
	$("#good_fee").val("0.00");
	$("#discount").val(0);
	$("#remark").val("");
}
