var flow = new Vue({
	el: '#flow',
	data: {
		isShow:false,
		isShow1:false,
		open_check:false,			//判断结帐弹窗是否打开
		orders:[],
		items:[],					//右边明细数据
		skuArr:[],    				//有商品属性的 属性数组
		good_allnum:0,				//商品总数量
		price_num:0,  				//商品总价格
		guadan_good_allnum:0,		//挂单弹窗内商品总数量
		guadan_price_num:0,			//挂单弹窗内商品总金额
		index:0,					//记录对货品明细操作时数据对应在数组内的下角标值
		customer:[],				//用户名称数据
		customer_index:"",			//点击选择用户时，记录此用户在数组内的index值
		customer_detailArr:[],      //用户消费记录数据
		amount_index:"",			//找零弹窗index
		show:true,
		payWay:"cash",				//支付方式  cash:现金    bank:银行卡     weixin:微信      zhifubao:支付宝    arrears:欠款    默认现金
		settlement_index:"",		//记录结帐弹窗index
		customer_show:false,		//判断是否选了客户
		pay_customer:"",
		have_customer:false,
		no_customer:true,
		discount_price:"",			//优惠价格
		payment_time:"",
		src:"",						//支付方式对应的图片
		
		sa_no:"",					//在挂单弹窗内点击修改或付款时，记录当前单子的sa_no
		guaDanArr:[],				//挂单表头数组
		guadan_item:[],				//挂单明细数组
		gua_total_price:0,			//挂单总金额
		guadan_name_index:"",		//挂单名称弹窗index
		guadan_index:"",			//挂单弹窗内目前选中的数据在数组中的下角标值
		mobile:"",					//消费记录电话
		consumption_consume:"",		//消费记录累计消费
		payment:"",					//消费记录累计付款
		arrears_now:"",				//消费记录累计欠款
		credit_pay:"",				//消费记录信用额度
		consumption_cus_no:"",		//消费记录cus_no
		consumption_title:"",		//消费记录弹窗标题
		guadan_win_index:"",		//挂单弹窗index值
		now_num:"",
		begin_enter:true,
		do_guadan:false,
		good_now_price:"",
		wh:[],						//仓库列表

		choose_index:0,				//商品编号框内用于上下键操作的值
		success_index:"",
		dupVal:[],                   //判断列表重复值
	},
	mounted: function() {
		var self = this;
		
		self.getGuadan();
		
		$("#wh").focus();
		
		$.ajax({
			url: "/index.php?m=system&c=sellOut&a=get_wh",
			data: {},
			dataType: "json",
			type: "POST",
			success: function (data) {
				if(data){
					self.wh = data;
				}else{
					self.wh = [];
				}
			}
		});
		$(document).ready(function(){
			var url_name = GetRequest();
			
			if(url_name.cus_no){
				getCustomer(url_name.mobile);
				setTimeout(function(){
					self.choose_customer(0);
				},200);
				
			}else if(url_name.prd_id){
			
				getItem(url_name.prd_id);
				setTimeout(function(){
					$("#wh").val(url_name.wh);
				},200);
				if(url_name.prd_sku_id != ""){
					setTimeout(function(){
						skuChange(url_name.prd_sku_id);
					},200);
				}
			}
		});
		$(document).ready(function(){
			layui.use(['element','layer','laydate'], function(){
				var $ = layui.jquery
				,element = layui.element,layer=layui.layer,laydate = layui.laydate; //Tab的切换功能，切换事件监听等，需要依赖element模块
				
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var day = date.getDate(); 
				var hour = date.getHours();       //获取当前小时数(0-23)
				var minute = date.getMinutes();     //获取当前分钟数(0-59)
				var second = date.getSeconds();
				
				var nowDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;          //当前日期
				
				self.payment_time = nowDate;						   //销售日期默认值为当前时间
				
				//限定可选日期
				var ins22 = laydate.render({
					elem: '#test-limit1'
					,max: nowDate
					,type: 'datetime'
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
		//商品编号框回车默认选第一个货品
		prd_no_down:function(){
			var self = this;
			var e= event || window.event;
			
			if(e.keyCode == 38){
				if(self.choose_index > 1){
					self.choose_index--;
					$(".hideDiv li").css("backgroundColor","white");
					$("#prd_no"+self.choose_index).css("backgroundColor","#dddddd");
				}
			}else if(e.keyCode == 40){
				if(self.choose_index < self.orders.length){
					self.choose_index++;
					$(".hideDiv li").css("backgroundColor","white");
					$("#prd_no"+self.choose_index).css("backgroundColor","#dddddd");
				}
				
			}else if(e.keyCode == 13){
				
				if(self.choose_index == 0){
					self.choose_good(self.orders[self.choose_index].prd_id);
				}else{
					self.choose_good(self.orders[self.choose_index-1].prd_id);
				}
				self.choose_index = 0;
				$(".hideDiv li").css("backgroundColor","white");
				$("#good_name").blur();
			}
		},
		
		turnTo:function(){
			parent.parent.addTab("客户","index.php?m=system&c=customer&a=customer","客户");
		},
		
		choose_good:function(prd_id){
			var self = this;
			
			$(".hideDiv").css("display","none");
			
			self.isShow = false;
			
			getItem(prd_id);
		},
		
		//商品名称列表查询  
		name_key:function(){
			var self = this;
			var e = event || window.event;
			var value = $("#good_name").val();
			if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 121){
				self.choose_index = 0;
				$(".hideDiv li").css("backgroundColor","white");
				getData(value);
			}else{
				
			}
				
			
		},
		
		//客户列表查询
		names_key:function(){
			var self = this;
			var value = $("#names").val();
			getCustomer(value);
			
		},
		
		//货品明细增加数量按钮
		increase:function(index){
			var self = this;
			self.index = index;
			var arr = self.items;
			var increase_num = arr[index].num;
			
			increase_num++;
			 
			arr[index].num = increase_num;
			arr[index].subtotal = accMul(arr[index].booth_price,increase_num);
			arr[index].discount = "无";
			//if(arr[index].prd_sku_no == ""){
				$("#good_name").attr("placeholder",arr[index].prd_no);
				$("#good_names").attr("placeholder",'请扫描货品条码');
			//}else{
				//$("#good_name").attr("placeholder",arr[index].prd_sku_no);
			//}
			
			$("#good_price").val(arr[index].booth_price);
			$("#good_num").val(increase_num);
			$("#order_price_all").html(arr[index].subtotal);
			$("#good_fee").val(arr[index].subtotal);
			$("#discount").val(0);
			$("#remark").val(arr[index].remark);
			
			self.items = [];								//对行进行操作时必须先将数组置空在进行复制，页面数据才会变化
			self.items = arr;
			
			calculate();									//计算方法
		},
		
		//货品明细减少数量按钮
		reduce:function(index){
			var self = this;
			
			self.index = index;
			
			var arr = self.items;
			var increase_num = arr[index].num;
			
			if(increase_num > 1){
				
				increase_num--;
				
				arr[index].num = increase_num;
				arr[index].subtotal = accMul(arr[index].booth_price,increase_num);
				arr[index].discount = "无";
				
				//if(arr[index].prd_sku_no == ""){
					$("#good_name").attr("placeholder",arr[index].prd_no);
					$("#good_names").attr("placeholder",'请扫描货品条码');
				//}else{
				//	$("#good_name").attr("placeholder",arr[index].prd_sku_no);
				//}
				
				$("#good_price").val(arr[index].booth_price);
				$("#good_num").val(increase_num);
				$("#order_price_all").html(arr[index].subtotal);
				$("#good_fee").val(arr[index].subtotal);
				$("#discount").val(0);
				$("#remark").val(arr[index].remark);
				
				self.items = [];
				self.items = arr;
				
				calculate();
			}
			
			
		},
		
		//货品明细删除按钮
		delete_now:function(index){
			var self = this;
			self.dupVal.splice(index,1);
			
			self.items.splice(index,1);
			
			if(self.items.length != 0){										//执行删除操作后，表身默认显示第一条明细的数据
				
				//if(self.items[0].prd_sku_no == ""){
					$("#good_name").attr("placeholder",self.items[0].prd_no);
					$("#good_names").attr("placeholder",'请扫描货品条码');
				//}else{
				//	$("#good_name").attr("placeholder",self.items[0].prd_sku_no);
				//}
				
				$("#good_price").val(self.items[0].booth_price);
				$("#good_num").val(self.items[0].num);
				$("#order_price_all").html(self.items[0].subtotal);
				$("#good_fee").val(self.items[0].subtotal);
				$(".prdt").html(self.items[0].qty);
				
				if(self.items[0].discount == "无"){
					$("#discount").val(0);
				}else{
					$("#discount").val(self.items[0].discount);
				}
				
				$("#remark").val(self.items[0].remark);
				
				self.index = 0;
				
			}else{															//如果明细数据为空，重置表身数据
				$("#good_name").attr("placeholder","选择商品编号开始销售");
				$("#good_names").attr("placeholder",'请扫描货品条码');
				$("#good_price").val("0.00");
				$("#good_num").val(1);
				$("#order_price_all").html("0.00");
				$("#good_fee").val("0.00");
				$("#discount").val(0);
				$("#remark").val("");
				$(".prdt").html("");
			}
			calculate();
		},
		
		//动态修改单价
		//price_change:function(index){
			//console.log(index);
		//},
		
		
		//商品数量修改回车事件
		good_num_down:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				//good_num_blur();
				$("#good_num").blur();
				$("#good_fee").focus();
			}
		},
		
		reset_now:function(){
			var self = this;
			$("input").blur();
			reset_now();
			$("#good_name").focus();
			
		},
		
		//备注回车事件
		remark_down:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				$("#remark").blur();
			}
		},
		
		//选择客户
		choose_customer:function(index){
			var self = this;
			
			self.customer_index = index;
			
			$(".cus_name_btn").html(self.customer[index].cus_name);
			$(".search_input").css("display","none");
			$(".customer_detail").css("display","block");
			$(".hideDiv1").css("display","none");
			
			//将客户信息记录在data里
			//原因：挂单弹窗内会进行同样操作，但数据不再同一数组内，所以要把数据记录在data内，方便调用同一方法
			self.mobile = self.customer[self.customer_index].mobile;
			self.consumption_consume = self.customer[self.customer_index].consume;
			self.payment = self.customer[self.customer_index].payment;
			self.credit_pay = self.customer[self.customer_index].credit_pay;
			self.consumption_cus_no = self.customer[self.customer_index].cus_no;
			self.consumption_title = self.customer[self.customer_index].cus_name;
			self.arrears_now = self.customer[self.customer_index].arrears;
			
			self.isShow1 = false;
		},
		
		cancel_show:function(){
			var self = this;
			self.customer_index = "";
			$(".search_input").css("display","block");
			$(".customer_detail").css("display","none");
			$("#names").val("");
		},
		
		//查看用户详情
		look_detail:function(){
			var self = this;
			
			layer.open({																																											
				type: 1,																																											
				title: "【"+self.consumption_title+"】"+'的详细信息('+self.mobile+")",																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['800px', '600px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#customer_message"),
				cancel: function (index, layero) {																																					
				
				},
				success:function(){
					//$("#message_phone").html(self.mobile);
					$("#arrears_now").html(self.arrears_now);
					$("#message_consume").html(self.consumption_consume);
					$("#message_payment").html(self.payment);
					$("#message_credit").html(self.credit_pay);
					
					//获取消费记录信息
					$.ajax({
						url: "/index.php?m=system&c=sellOut&a=getDetail",
						data: {cus_no:self.consumption_cus_no},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data){
								self.customer_detailArr = data;
							}else{
								self.customer_detailArr = [];
							}
						}
					});
					
				}
			});
			
		},
		
		//结帐
		check_out:function(type){
			$("button").blur();
			var self = this;
			$("input").blur();
			if(type != "guadan"){						//如果为挂单弹窗内点击，代表必定有数据，所以不用走此判断
				if(self.items.length == 0){
					layer.msg("您还没有选择任何货品",{
						icon: 0,
						time: 2000
					});
					return false;
				}
			}
			
			var value = $("#remark").val();
	
			if(value.length > 100){
				layer.msg("备注字数超过限制",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			if($("#wh").val() == ""){
				layer.msg("请选择仓库",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			layer.open({																																											
				type: 1,																																											
				title: self.items.length + " 种商品 共 "+self.good_allnum+" 件",																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['800px', '400px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#check_out"),
				btn:['确定(F10)','取消'],
				yes:function(index, layero){
					
					settlement_sure('no');				//执行结帐方法
					
				},
				cancel: function (index, layero) {																																					
				
				},
				success:function(layero, index){
					//初始化弹窗内样式----------------
					$(".check_amount").html("(F9)");
					self.show = true;
					$(".choose_way").each(function(){
						$(this).css("borderColor","#dddddd");
					});
					
					$(".cash").css("borderColor","#ff6a3c");
					
					self.open_check = true;
					
					self.settlement_index = index;
					
					layui.use(['element','layer','laydate'], function(){
						var $ = layui.jquery
						,element = layui.element,layer=layui.layer,laydate = layui.laydate; //Tab的切换功能，切换事件监听等，需要依赖element模块
						
						var date = new Date();
						var year = date.getFullYear();
						var month = date.getMonth() + 1;
						var day = date.getDate(); 
						var hour = date.getHours();       //获取当前小时数(0-23)
						var minute = date.getMinutes();     //获取当前分钟数(0-59)
						var second = date.getSeconds();
						
						var nowDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;          //当前日期
						self.payment_time = nowDate;						   //销售日期默认值为当前时间
						//限定可选日期
						var ins22 = laydate.render({
							elem: '#test-limit1'
							,max: nowDate
							,type: 'datetime'
							,ready: function(){
								
							},
							value: nowDate
							,done: function(value, date){
								self.payment_time = value;
							}
						});
					  
					});
					
					$.ajax({
						url: "/index.php?m=system&c=sellOut&a=is_print",
						data: {},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								$("#print").iCheck('check');
							}
						}
					});
					
				},
				end:function(){
					self.open_check = false;			
				}
			});
		},
		
		//找零弹窗内收款金额键盘抬起事件
		amount:function(){
			var self = this;
			var money = $("#check_good_fee").val();
			var react = $("#amount").val();
			var nn = accSub(react * 1,money * 1);
			$(".zhaoling").html(nn);
		},
		
		//找零按钮
		makeChange:function(){
			var self = this;
			layer.open({																																											
				type: 1,																																											
				title: "找零",																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['350px', '250px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#makeChange"),
				btn:['确定','取消'],
				yes:function(index){
					var zhao_ling = $(".zhaoling").html();
					if(zhao_ling*1 < 0){
						layer.msg("请输入正确收款金额",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					$(".check_amount").html("￥"+zhao_ling);
			
					layer.close(index);
				},
				cancel: function (index, layero) {																																					
				
				},
				success:function(layero, index){
					
					self.amount_index = index;
					
					$("#amount").val("0.00");
					$(".zhaoling").html("0.00");
					
					
				}
			});
		},
		
		//找零回车事件
		amount_keydown:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				var zhao_ling = $(".zhaoling").html();
					
				$(".check_amount").html("￥"+zhao_ling);
				layer.close(self.amount_index);
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
		
		//挂单弹窗
		showGuadan:function(){
			var self = this;
			
			if(self.guaDanArr.length == 0){
				layer.msg("暂无挂单记录",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			layer.open({																																											
				type: 1,																																											
				title: '当前'+self.guaDanArr.length+'单未结算，总金额：'+self.gua_total_price+"元",																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['577px', '100%'], //宽高		
				anim: 2,
				shade: 0.3,
				shadeClose:true,
				offset: 'rt',
				content: $("#gua_dan"),
				btn:['修改挂单','去结帐'],
				yes:function(index){
					
					edit_item(self);
					
					calculate();
					
					self.do_guadan = true;
					
					layer.close(index);
					
				},
				btn2:function(index){
					
					edit_item(self);
					
					calculate();
					
					self.do_guadan = true;
					
					self.check_out('guadan');
					
				},
				cancel: function (index, layero) {																																					
					
				},
				success:function(layero,index){
					
					self.sa_no = self.guaDanArr[0].sa_no;
					self.guadan_item1(self.guaDanArr[0].sa_no,"0");
					self.guadan_index = 0;
					self.guadan_win_index = index;
					
				},
				end:function(){							//窗口销毁后重置页面数据
					
					if(self.do_guadan == false){
						self.sa_no = "";
					}
					
				}
			});
			
		},
		
		//获取挂单
		getGuadan:function(){
			var self = this;
			
			$.ajax({
				url: "/index.php?m=system&c=sellOut&a=getGuadan",
				data: {},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data){
						self.guaDanArr = data;
						var gua_total_price = 0;
						for(var i = 0 ; i < data.length; i++){    //计算挂单总金额
							gua_total_price = addNum(gua_total_price,data[i].total_fee*1).toFixed(2);
							
						}
						self.gua_total_price = gua_total_price;
						
						layui.use('element', function(){
							var element = layui.element;
							element.init();
						});
					}else{
						self.guaDanArr = [];
						if(self.guadan_win_index != ""){
							layer.close(self.guadan_win_index);
						}
						
					}
				}
			});
			
		},
		
		//挂单名称
		guadan_name:function(){
			var self = this;
			layer.open({																																											
				type: 1,																																											
				title: "挂单名称",																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['500px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#gua_dan_name"),
				btn:['确定','取消'],
				yes:function(index){
					settlement_sure('guadan');
					self.sa_no = "",
					self.do_guadan = false;
					self.customer_show = false;
					self.have_customer = false;
					self.no_customer = true;
					self.items = [];
					self.sa_no = "";
					self.getGuadan();
					self.cancel_show();
					reset_now();
					layer.close(index);
				},
				cancel: function (index, layero) {																																					
				
				},
				success:function(layero,index){
					$("#guadan_name").val("");
					self.guadan_name_index = index;
				},
				end:function(){	
				}
			});
		},
		
		//挂单名称回车事件
		guadan_name_down:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				settlement_sure('guadan');
				layer.close(self.guadan_name_index);
			}
			
		},
		
		//获取挂单明细数据
		guadan_item1:function(sa_no,index){
			var self = this;
			
			self.sa_no = sa_no;							//记录选中数据的sa_no，用来做编辑名称和删除操作
			self.guadan_index = index;					//记录目前选中的数据在数组中的下角标值，以便点击修改挂单和结帐时获取准确数据
			
			$(".left_color").each(function(){													
				$(this).css("display","none");
			});
			
			$(".do").css("display","none");
			
			$("#guadan"+index).find(".left_color").css("display","block");
			$("#guadan"+index).find(".do").css("display","block");
			
			$.ajax({
				url: "/index.php?m=system&c=sellOut&a=guadan_item",
				data: {sa_no:sa_no},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data){
						
						var arr = [];
						for(var i = 0; i < data.length; i++){
							var a = accSub(accMul(data[i].qty,data[i].price), data[i].total_fee * 1);
							if(a == 0){
								a = "无";
							}
							var newData = {
								"discount":a,
								"booth_price":data[i].price,
								"num":data[i].qty,
								"subtotal":data[i].total_fee,
								"react_title":data[i].prd_name,
								"sku_name":data[i].prd_sku_name,
								"remark":data[i].memo,
								"prd_sku_no":data[i].prd_sku_no,
								"prd_id":data[i].prd_id,
								"prd_sku_id":data[i].prd_sku_id,
								"prd_no":data[i].prd_no,
								"qty":data[i].wh_qty,
								"title":data[i].prd_name+"_"+data[i].prd_sku_name,
								"pic_path":data[i].pic_path,
								"wh":data[i].wh
							};
							arr.push(newData);
						}
						
						self.guadan_item = arr;
						calculate_gua();
						
					}else{
						
					}
				}
			});
		},
		
		//挂单名称编辑
		edit_name:function(sa_no){
			var self = this;
			
			layer.open({																																											
				type: 1,																																											
				title: "挂单名称",																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['500px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#gua_dan_edit"),
				btn:['确定','取消'],
				yes:function(index){
					var name = $("#guadan_name_edit").val();
					$.ajax({
						url: "/index.php?m=system&c=sellOut&a=edit_name",
						data: {sa_no:sa_no,name:name},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								layer.msg("修改成功",{
									icon: 1,
									time: 2000
								});
								layer.close(index);
								self.getGuadan();
							}
						}
					});
					
				},
				success:function(layero,index){
					$("#guadan_name_edit").val("");
					self.edit_name_index = index;
				},
				end:function(){
					
				}
			});
			
		},
		
		guadan_name_edit_down:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 121){
				var name = $("#guadan_name_edit").val();
				$.ajax({
					url: "/index.php?m=system&c=sellOut&a=edit_name",
					data: {sa_no:self.sa_no,name:name},
					dataType: "json",
					type: "POST",
					success: function (data) {
						if(data.code == "ok"){
							layer.msg("修改成功",{
								icon: 1,
								time: 2000
							});
							layer.close(self.edit_name_index);
							self.getGuadan();
						}
					}
				});
			}
		},
		
		//删除挂单
		delete_gua:function(sa_no){
			var self = this;
			layer.confirm('确定删除此单么？', {
			  btn: ['确定', '取消'] //可以无限个按钮
			  ,btn3: function(index, layero){
				//按钮【按钮三】的回调
			  }
			}, function(index, layero){
			  //按钮【按钮一】的回调
			  
			  $.ajax({
					url: "/index.php?m=system&c=sellOut&a=delete_gua",
					data: {sa_no:sa_no},
					dataType: "json",
					type: "POST",
					success: function (data) {
						if(data.code == "ok"){
							layer.msg("删除成功",{
								icon: 1,
								time: 2000
							});
							layer.close(index);
							
							self.getGuadan();
							
							self.guadan_item = [];
							
							$(".left_color").each(function(){
								$(this).css("display","none");
							});
							
							$(".do").css("display","none");
							
						}else{
							layer.msg("删除失败",{
								icon: 1,
								time: 2000
							});
							layer.close(index);
						}
					}
				});
			  
			}, function(index){
			  //按钮【按钮二】的回调
			  
			});
		},
		
		//修改挂单操作
		modify:function(){
			var self = this;
			
		},
		
		//实收金额回车事件
		good_fee_down:function(){
			var e = event || window.event;
			if(e.keyCode == 13){
				$("#good_fee").blur();
				$("#remark").focus();
			}
		}
		
		//换款操作
		/*pay_back:function(){
			
		}*/
		
	}
});

function name_focus(){
	if($("#wh").val() === ""){
		layer.msg("请先选择仓库",{
			icon: 0,
			time: 2000
		});
		return false;
	}
	getData('');
}

function name_blur(){
	if(!flow.isShow){
		$(".hideDiv").css("display","none");
	}
}

function names_focus(){
	getCustomer('');
}

function names_blur(){
	if(!flow.isShow1){
		$(".hideDiv1").css("display","none");
	}
}

$(".hideDiv").hover(
  function () {
    flow.isShow = true;
  },
  function () {
    flow.isShow = false;
  }
);

$(".hideDiv1").hover(
  function () {
    flow.isShow1 = true;
  },
  function () {
    flow.isShow1 = false;
  }
);

//获取商品名称
function getData(value){
	$.ajax({
		url: "/index.php?m=system&c=sellOut&a=getData",
		data: {value:value},
		dataType: "json",
		type: "POST",
		success: function (data) {
			if(data){
				flow.orders = data;
				$(".hideDiv").css("display","block");
			}else{
				$(".hideDiv").css("display","none");
			}
		}
	});
}

//获取客户列表
function getCustomer(value){
	$.ajax({
		url: "/index.php?m=system&c=sellOut&a=getCustomer",
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

//获取表身数据
function getItem(prd_id){
	var cus_no = "";
	
	if(flow.customer_index !== ""){
		cus_no = flow.customer[flow.customer_index].cus_no;
	}
	$.ajax({
		url: "/index.php?m=system&c=sellOut&a=getItem",
		data: {prd_id:prd_id,wh:$("#wh").val(),cus_no:cus_no},
		dataType: "json",
		type: "POST",
		success: function (data) {
			$(".good_sku").css("display","none");
			
			if(data.code == "no_sku"){											//如果选择的商品没有sku属性，直接赋值给  flow.items
				$("#good_name").val("");
				$("#good_name").attr("placeholder",data.result[0].prd_no);
			
				var newData = {
					"discount":"无",
					"booth_price":data.result[0].booth_price,
					"num":1,
					"subtotal":data.result[0].booth_price,
					"react_title":data.result[0].title,
					"sku_name":"",
					"remark":"",
					"prd_sku_no":"",
					"prd_id":data.result[0].prd_id,
					"prd_sku_id":"",
					"prd_no":data.result[0].prd_no,
					"qty":data.result[0].qty,
					"title":data.result[0].title,
					"pic_path":data.result[0].pic_path
				};
				
				$("#good_price").val(data.result[0].booth_price);
				$("#good_num").val(1);
				$("#order_price_all").html(data.result[0].booth_price);
				$("#good_fee").val(data.result[0].booth_price);
				$(".prdt").html(data.result[0].qty);
				
				var onOff = false;
				var onKeyOff = "";
				//console.log(flow.dupVal);
				for(var i=0;i<flow.dupVal.length;i++){
					if(flow.dupVal[i] == data.result[0].prd_id){
						onOff = true;
						onKeyOff = i;
					}
				}
				if(onOff){
					flow.increase(onKeyOff);
				}else{
					flow.items.push(newData);
				
					flow.index = flow.items.length - 1;
					
					calculate();
					
					$("#good_num").focus();
					
					$("#remark").val("");
					
					flow.dupVal.push(data.result[0].prd_id);
				}
			}else{																//如果商品有sku属性，需选择属性
				$(".good_sku").css("display","block");
				$("#sku_name").val("");
				flow.skuArr = data.result;
				$("#sku_name").focus();
				
			}
		}
	});
}

//商品属性改变方法(选择sku商品)
function skuChange(value){
	var cus_no = "";
	if(flow.customer_index !== ""){
		cus_no = flow.customer[flow.customer_index].cus_no;
	}
	$.ajax({
		url: "/index.php?m=system&c=sellOut&a=getSkuItem",
		data: {prd_sku_id:value,wh:$("#wh").val(),cus_no:cus_no},
		dataType: "json",
		type: "POST",
		success: function (data) {
			if(data){
				$("#good_name").val("");
				$("#good_name").attr("placeholder",data.prd_no);
				var newData = {
					"discount":"无",
					"booth_price":data.booth_price,
					"num":1,
					"subtotal":data.booth_price,
					"react_title":data.title,
					"sku_name":data.sku_name1+((data.sku_name1 && data.sku_name2) ? ";" : '')+data.sku_name2,
					"remark":"",
					"prd_sku_no":data.prd_sku_no,
					"prd_id":data.prd_id,
					"prd_sku_id":data.prd_sku_id,
					"prd_no":data.prd_no,
					"qty":data.qty,
					"title":data.title+"_"+data.sku_name1+((data.sku_name1 && data.sku_name2) ? ";" : '')+data.sku_name2,
					"pic_path":data.pic_path
				};
				
				var onOff = false;
				var onKeyOff = "";
				//console.log(flow.dupVal);
				for(var i=0;i<flow.dupVal.length;i++){
					if(flow.dupVal[i] == data.prd_sku_id){
						onOff = true;
						onKeyOff = i;
					}
				}
				if(onOff){
					flow.increase(onKeyOff);
				}else{
					flow.items.push(newData);
				
					calculate();
					
					$("#good_price").val(data.booth_price);
					$("#good_num").val(1);
					$("#order_price_all").html(data.booth_price);
					$("#good_fee").val(data.booth_price);
					$(".prdt").html(data.qty);
				
					flow.index = flow.items.length - 1;
					
					$(".good_sku").css("display","none");
					$("#good_num").focus();
					$("#remark").val("");
					flow.dupVal.push(data.prd_sku_id);
				}
			}
		}
	});
}

//商品数量获得焦点
function good_num_focu(){
	event.currentTarget.select();
	var num = $("#good_num").val();
	flow.now_num = num;
}

//商品数量失去焦点
function good_num_blur(){
	var num = $("#good_num").val();
	if(num <= 0 || num == ""){
		layui.use('layer', function(){
			layer.msg("请输入商品数量",{
				icon: 0,
				time: 2000
			});
		});
		return false;
		
	}
	
	if(flow.items.length == 0){
		return false;
	}
	
	if(num != flow.now_num){
		var arr = flow.items;

		arr[flow.index].num = num;											//将填写的数量赋值给原始数据
		//arr[flow.index].subtotal = arr[flow.index].booth_price*num;			//重新计算原始数据的小计价格
		arr[flow.index].subtotal = accMul(arr[flow.index].booth_price,num);
		arr[flow.index].discount = "无";									//将折扣清空
		
		$("#order_price_all").html(arr[flow.index].subtotal);
		$("#good_fee").val(arr[flow.index].subtotal);
		
		flow.items = [];		//必须先将数组制空，再进行复制，页面数据才会实时变化
		flow.items = arr;
		
		$("#discount").val(0);
		
		calculate();
		
	}
	
	
	
}

//实收金额键盘抬起事件
function good_fee_up(){
	
	var arr = flow.items;
	
	var price = $("#good_fee").val();
	
	if(price < 0){
		layer.msg("请输入正确的实收金额",{
			icon: 0,
			time: 2000
		});
		return false;
	}
	
	arr[flow.index].subtotal = price;										//改变小计价格
	
	var nn = accSub($("#order_price_all").html() * 1,price);
	$("#discount").val(nn);			//计算折扣
	arr[flow.index].discount = nn;	//将折扣赋值给原始数据
	if(nn == 0){
		arr[flow.index].discount = "无";
	}
	
	flow.items = [];		//必须先将数组制空，再进行复制，页面数据才会实时变化
	flow.items = arr;
	
	calculate();
}

//实收金额获取焦点
function good_fee_focus(){
	var num = $("#good_num").val();
	flow.now_num = num;
	event.currentTarget.select();
}

//实收金额失去焦点
/*function good_fee_blur(){
	
	
	
}*/

//计算明细商品数量及总金额
function calculate(){
	var good_allnum = 0;
	var price_num = 0;
	var discount_price = 0;
	for(var i = 0; i < flow.items.length; i++){
		good_allnum += flow.items[i].num*1;									//计算商品总数量
		price_num = addNum(price_num,flow.items[i].subtotal*1);
		
		//price_num += flow.items[i].subtotal*1;								//计算商品总价格（小计价格的总和）
		if(flow.items[i].discount != "无"){
			discount_price = addNum(discount_price,flow.items[i].discount*1);						//计算优惠价格
		}
	}
	flow.good_allnum = good_allnum;
	flow.price_num = price_num;
	flow.discount_price = discount_price;
}

//计算挂单明细商品数量及总金额
function calculate_gua(){
	var good_allnum = 0;
	var price_num = 0;
	var discount_price = 0;
	for(var i = 0; i < flow.guadan_item.length; i++){
		good_allnum = addNum(good_allnum,flow.guadan_item[i].num*1);									//计算商品总数量
		price_num = addNum(price_num,flow.guadan_item[i].subtotal*1);
		//price_num += flow.guadan_item[i].subtotal*1;								//计算商品总价格（小计价格的总和）
		if(flow.guadan_item[i].discount != "无"){
			discount_price = addNum(discount_price,flow.guadan_item[i].discount*1);						//计算优惠价格
		}
	}
	flow.guadan_good_allnum = good_allnum;
	flow.guadan_price_num = price_num;
	flow.guadan_discount_price = discount_price;
}

//重置
function reset_now(){
	$("#good_name").attr("placeholder","直接输入开始销售");
	$("#good_name").val("");
	$("#good_price").val("0.00");
	$("#good_num").val(1);
	$("#order_price_all").html("0.00");
	$("#good_fee").val("0.00");
	$("#discount").val(0);
	$("#remark").val("");
	$(".prdt").html("");
}

function remark_focus(){
	event.currentTarget.select();
}

//备注失去焦点
function remark_blur(){
	var value = $("#remark").val();
	
	if(value.length > 100){
		layer.msg("字数超过限制",{
			icon: 0,
			time: 2000
		});
	}

	if(flow.index !== ""){
		flow.items[flow.index].remark = value;
	}
	
}

//确认结帐
function settlement_sure(type){
	
	var data = [];
	var newData = {};
	
	if(flow.customer_index !== ""){
		newData.cus_no = flow.customer[flow.customer_index].cus_no;										//客户编号
	}else if(flow.customer_index === ""){
		newData.cus_no = "";
	}
	
	if($("#check_good_fee").val() === "" || $("#check_good_fee").val() === 0){
		layer.msg("请输入实收金额",{
			icon: 0,
			time: 2000
		});
		return false;
	}
	
	newData.wh = $("#wh").val();																		//仓库
	
	newData.guadan_name = $("#guadan_name").val();
	
	newData.discount = (flow.discount_price*1 + (flow.price_num*1 - $("#check_good_fee").val()*1));   	//优惠金额

	newData.totalPrice = flow.price_num;															 	//应收金额
	
	newData.consume = $("#check_good_fee").val();														//实付金额
	
	newData.payment_time = flow.payment_time;															//销售日期(付款日期)
	
	newData.data = flow.items;																			//获取明细数据
	
	newData.pay_way = flow.payWay;																		//支付方式
	
	data.push(newData);
	
	$.ajax({
		url: "/index.php?m=system&c=sellOut&a=setData",
		data: {data:data,type:type,sa_no:flow.sa_no},
		dataType: "json",
		type: "POST",
		success: function (data) {
			
			if(data.code == "ok"){
				layer.close(flow.settlement_index);         //先关闭结帐弹窗
				layer.msg("收款成功",{
					icon: 1,
					time: 2000
				});
				
				
				if(data.sa_no && $("#print").is(':checked') == true){
					//window.open("/index.php?m=system&c=sellOut&a=printSellOut&sa_no="+data.sa_no);
					var url = "/index.php?m=system&c=sellOut&a=printSellOut&sa_no="+data.sa_no;																																	//===========
					$("#ifile").attr('src',url);
	
				}
				
				
				flow.dupVal = [];
				flow.items = [];
				reset_now();
				//begin_enter = true;
				
				
				flow.sa_no = "";
				flow.do_guadan = false;
				flow.getGuadan();
				flow.cancel_show();
				$("#good_name").focus();
			}else if(data.code == "guadan"){
				layer.msg(data.msg,{
					icon: 1,
					time: 2000
				});
				setTimeout(function(){
					flow.getGuadan();
				},200)
				$("#good_name").focus();
				
			}else{
				layer.msg(data.msg,{
					icon: 0,
					time: 2000
				});
			}
		}
	});
}

//修改挂单数据赋值方法
function edit_item(self){
	if(self.guaDanArr[self.guadan_index].cus_no != "TOURIST"){
		
		getCustomer(self.guaDanArr[self.guadan_index].mobile);
		setTimeout(function(){
			self.choose_customer(0);
		},200);
		
		//$(".cus_name_btn").html(self.guaDanArr[self.guadan_index].cus_name);
		//$(".search_input").css("display","none");
		//$(".customer_detail").css("display","block");
		
		//self.mobile = self.guaDanArr[self.guadan_index].mobile;
		//self.consumption_consume = self.guaDanArr[self.guadan_index].consume;
		//self.payment = self.guaDanArr[self.guadan_index].payment;
		//self.credit_pay = self.guaDanArr[self.guadan_index].credit_pay;
		//self.consumption_cus_no = self.guaDanArr[self.guadan_index].cus_no;
		//self.consumption_title = self.guaDanArr[self.guadan_index].cus_name;
		//self.arrears_now = self.guaDanArr[self.guadan_index].arrears;
	}else{
		self.customer_index = "";
		$(".search_input").css("display","block");
		$(".customer_detail").css("display","none");
	}

	self.items = self.guadan_item;
	
	//if(self.items[0].prd_sku_no == ""){
		$("#good_name").attr("placeholder",self.items[0].prd_no);
	//}else{
		//$("#good_name").attr("placeholder",self.items[0].prd_sku_no);
	//}
	$("#wh").val(self.items[0].wh);
	$("#good_price").val(self.items[0].booth_price);
	$("#good_num").val(self.items[0].num);
	$("#order_price_all").html(self.items[0].subtotal);
	$("#good_fee").val(self.items[0].subtotal);
	$(".prdt").html(self.items[0].qty);
	
	if(self.items[0].discount == "无"){
		$("#discount").val(0);
	}else{
		$("#discount").val(self.items[0].discount);
	}
	
	$("#remark").val(self.items[0].remark);
}



document.body.onkeyup = function(){
	var e = event || window.event;

	if(e.keyCode == 119){
		flow.reset_now();
	}else if(e.keyCode == 121){
		//if(flow.begin_enter == true){
			
			if(flow.open_check == true){
				settlement_sure('no');
				flow.begin_enter = false;
				return false
			}else if(flow.open_check == false){
				
				flow.check_out('');
				
			}
		//}else{
		//	return false;
		//}
		
		
	}else if(e.keyCode == 120){
		if(flow.open_check){
			flow.makeChange();
		}
		
	}else if(e.keyCode == 18){
		if(flow.success_index != ""){
			layer.close(flow.success_index);
		}
		flow.success_index = "";
	}
}

$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});

function GetRequest() {
	var url = location.search;
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

function good_price_focus(){
	flow.good_now_price = $("#good_price").val();
}

//商品单价键盘抬起事件
function good_price_up(){
	var price = $("#good_price").val();
	if(price < 0){
		layer.msg("请输入正确的商品单价",{
			icon: 0,
			time: 2000
		});
		return false;
	}
	if(price != flow.good_now_price){
		var arr = flow.items;
		arr[flow.index].booth_price = price;
		arr[flow.index].subtotal =  (arr[flow.index].booth_price*arr[flow.index].num).toFixed(2);
		arr[flow.index].discount = "无";
		
		$("#order_price_all").html(arr[flow.index].subtotal);
		$("#good_fee").val(arr[flow.index].subtotal);
		$("#discount").val("0");
		flow.items = [];
		flow.items = arr;
		calculate();
	}
}
//商品列表单价键盘抬起事件
function goods_price_up(index,event){
	flow.index = index;
	var price = event['srcElement'].value;
	if(price < 0){
		layer.msg("请输入正确的商品单价",{
			icon: 0,
			time: 2000
		});
		return false;
	}
	if(price != flow.good_now_price){
		var arr = flow.items;
		arr[index].booth_price = price;
		arr[index].subtotal =  (arr[index].booth_price*arr[index].num).toFixed(2);
		arr[index].discount = "无";
		
		$("#good_num").val(arr[index].num);
		$("#good_name").attr("placeholder",arr[index].prd_no);
		$("#good_names").attr("placeholder",'请扫描货品条码');
		$("#remark").val(arr[index].remark);
		$("#good_price").val(price);
		$("#order_price_all").html(arr[index].subtotal);
		$("#good_fee").val(arr[index].subtotal);
		$("#discount").val("0");
		flow.items = [];
		flow.items = arr;
		calculate();
	}
}

function goods_price_focus(obj){
	flow.good_now_price = $(obj).val();
	$(obj).css("border","1px solid");
}
function goods_price_blur(obj){
	$(obj).css("border","0px solid");
}

function whChange(value){
	if(value !== ""){
		$("#good_name").focus();
	}
}


//回车获取数据
$("#good_names").keydown(function(e){
	if(e.keyCode == 13){
		if($("#wh").val() == ""){
			return false;
		}
		var values = $(this).val();
		$.ajax({
			url: "/index.php?m=system&c=sellOut&a=getGoodBack",
			data: {barcode:values},
			dataType: "json",
			type: "POST",
			success: function (data) {
				if(data.code == 'ok'){
					$(this).val(data.msg[0]['prd_no']);
					getItems(data.msg[0]['prd_id']);
				}else if(data.code == 'no'){
					$(this).val(data.msg[0]['prd_sku_no']);
					skuChanges(data.msg[0]['prd_sku_id']);
				}else {
					layer.msg(data.msg,{
						icon: 1,
						time: 2000
					});
					$("#good_names").val("");
					$("#good_name").val("");
					speckText(data.msg);
				}
			}
		});
	}
});

//获取表身数据
function getItems(prd_id){
	var cus_no = "";
	
	if(flow.customer_index !== ""){
		cus_no = flow.customer[flow.customer_index].cus_no;
	}
	$.ajax({
		url: "/index.php?m=system&c=sellOut&a=getItem",
		data: {prd_id:prd_id,wh:$("#wh").val(),cus_no:cus_no},
		dataType: "json",
		type: "POST",
		success: function (data) {
			$(".good_sku").css("display","none");
			
			if(data.code == "no_sku"){											//如果选择的商品没有sku属性，直接赋值给  flow.items
				$("#good_names").val("");
				$("#good_names").attr("placeholder",'请扫描货品条码');
			
				var newData = {
					"discount":"无",
					"booth_price":data.result[0].booth_price,
					"num":1,
					"subtotal":data.result[0].booth_price,
					"react_title":data.result[0].title,
					"sku_name":"",
					"remark":"",
					"prd_sku_no":"",
					"prd_id":data.result[0].prd_id,
					"prd_sku_id":"",
					"prd_no":data.result[0].prd_no,
					"qty":data.result[0].qty,
					"title":data.result[0].title,
					"pic_path":data.result[0].pic_path
				};
				
				$("#good_price").val(data.result[0].booth_price);
				$("#good_num").val(1);
				$("#order_price_all").html(data.result[0].booth_price);
				$("#good_fee").val(data.result[0].booth_price);
				$(".prdt").html(data.result[0].qty);
				
				var onOff = false;
				var onKeyOff = "";
				//console.log(flow.dupVal);
				for(var i=0;i<flow.dupVal.length;i++){
					if(flow.dupVal[i] == data.result[0].prd_id){
						onOff = true;
						onKeyOff = i;
					}
				}
				if(onOff){
					flow.increase(onKeyOff);
				}else{
					flow.items.push(newData);
				
					flow.index = flow.items.length - 1;
					
					calculate();
					
					$("#good_names").focus();
					
					$("#remark").val("");
					
					flow.dupVal.push(data.result[0].prd_id);
				}
			}else{																//如果商品有sku属性，需选择属性
				$(".good_sku").css("display","block");
				$("#sku_name").val("");
				flow.skuArr = data.result;
				$("#good_names").focus();
				
			}
		}
	});
}

//商品属性改变方法(选择sku商品)
function skuChanges(value){
	var cus_no = "";
	if(flow.customer_index !== ""){
		cus_no = flow.customer[flow.customer_index].cus_no;
	}
	$.ajax({
		url: "/index.php?m=system&c=sellOut&a=getSkuItem",
		data: {prd_sku_id:value,wh:$("#wh").val(),cus_no:cus_no},
		dataType: "json",
		type: "POST",
		success: function (data) {
			if(data){
				$("#good_names").val("");
				$("#good_names").attr("placeholder",'请扫描货品条码');
				var newData = {
					"discount":"无",
					"booth_price":data.booth_price,
					"num":1,
					"subtotal":data.booth_price,
					"react_title":data.title,
					"sku_name":data.sku_name1+((data.sku_name1 && data.sku_name2) ? ";" : '')+data.sku_name2,
					"remark":"",
					"prd_sku_no":data.prd_sku_no,
					"prd_id":data.prd_id,
					"prd_sku_id":data.prd_sku_id,
					"prd_no":data.prd_no,
					"qty":data.qty,
					"title":data.title+"_"+data.sku_name1+((data.sku_name1 && data.sku_name2) ? ";" : '')+data.sku_name2,
					"pic_path":data.pic_path
				};
				
				var onOff = false;
				var onKeyOff = "";
				//console.log(flow.dupVal);
				for(var i=0;i<flow.dupVal.length;i++){
					if(flow.dupVal[i] == data.prd_sku_id){
						onOff = true;
						onKeyOff = i;
					}
				}
				if(onOff){
					flow.increase(onKeyOff);
				}else{
					flow.items.push(newData);
				
					calculate();
					
					$("#good_price").val(data.booth_price);
					$("#good_num").val(1);
					$("#order_price_all").html(data.booth_price);
					$("#good_fee").val(data.booth_price);
					$(".prdt").html(data.qty);
				
					flow.index = flow.items.length - 1;
					
					$(".good_sku").css("display","none");
					$("#remark").val("");
					flow.dupVal.push(data.prd_sku_id);
				}
			}
		}
	});
}