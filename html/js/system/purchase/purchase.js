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
		payWay:"cash",				//支付方式  cash:现金    bank:银行卡     weixin:微信      zhifubao:支付宝    默认现金
		settlement_index:"",		//记录结帐弹窗index
		customer_show:false,		//判断是否选了客户
		pay_customer:"",
		have_customer:false,
		no_customer:true,
		discount_price:"",			//优惠价格
		payment_time:"",
		src:"",						//支付方式对应的图片
		mobile:"",					//消费记录电话
		consumption_consume:"",		//消费记录累计消费
		payment:"",					//消费记录累计付款
		arrears_now:"",				//消费记录累计欠款
		credit_pay:"",				//消费记录信用额度
		consumption_cus_no:"",		//消费记录cus_no
		consumption_title:"",		//消费记录弹窗标题
		now_num:"",
		good_now_price:"",
		can:true,
		wh:[],
		
		choose_index:0,				//商品编号框内用于上下键操作的值
		choose_cus_index:0,
		dupVal:[],                   //判断列表重复值
	},
	mounted: function() {
		var self = this;
		
		$("#names").focus();
		
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
		names_down:function(){
			var self = this;
			var e= event || window.event;
		
			if(e.keyCode == 38){
				if(self.choose_cus_index > 1){
					self.choose_cus_index--;
					$(".hideDiv1 li").css("backgroundColor","white");
					$("#cus"+self.choose_cus_index).css("backgroundColor","#dddddd");
					
				}
			}else if(e.keyCode == 40){
				if(self.choose_cus_index < self.customer.length){
					self.choose_cus_index++;
					$(".hideDiv1 li").css("backgroundColor","white");
					$("#cus"+self.choose_cus_index).css("backgroundColor","#dddddd");
				}
				
			}else if(e.keyCode == 121){
				
				if(self.choose_cus_index == 0){
					self.choose_customer(0);
				}else{
					self.choose_customer(self.choose_cus_index-1);
				}
				self.choose_cus_index = 0;
				$(".hideDiv1 li").css("backgroundColor","white");
				$("#names").blur();
				$("#wh").focus();
			}
		},
		
		//商品编号框回车默认选第一个货品
		prd_no_down:function(){
			var self = this;
			var e= event || window.event;
		
			if(e.keyCode == 38){
				if(self.choose_index > 1){
					self.choose_index--;
					$(".hideDiv li").css("backgroundColor","white");
					$("#prd_noo"+self.choose_index).css("backgroundColor","#dddddd");
					
				}
			}else if(e.keyCode == 40){
				if(self.choose_index < self.orders.length){
					self.choose_index++;
					$(".hideDiv li").css("backgroundColor","white");
					$("#prd_noo"+self.choose_index).css("backgroundColor","#dddddd");
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
			parent.addTab("客户","index.php?m=system&c=customer&a=customer","客户");
		},
		
		//选择商品
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
			}
			
		},
		
		//供应商列表查询
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
			//arr[index].subtotal = arr[index].booth_price*increase_num;
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
				$(".prdt").html("");
				$("#discount").val(0);
				$("#remark").val("");
			}
			calculate();
		},
		
		//商品数量修改回车事件
		good_num_down:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				
				$("#good_num").blur();
				$("#good_fee").focus();
			
			}
		},
		
		reset_now:function(){
			var self = this;
			reset_now();
		},
		
		//备注回车事件
		remark_down:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				remark_blur();
			}
		},
		
		//选择供应商
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
		},
		
		//查看供应商详情
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
						url: "/index.php?m=system&c=purchase&a=getDetail",
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
		
		//付款
		check_out:function(type){
			$("button").blur();
			var self = this;
			
			$("input").blur();
			
			if(self.items.length == 0){
				layer.msg("您还没有选择任何货品",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			if(self.customer_index === ""){
				layer.msg("请选择供应商",{
					icon: 0,
					time: 2000
				});
				return false;
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
					
					$("#memo").val("");
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
			$(".zhaoling").html(react - money);
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
		
		//实收金额回车事件
		good_fee_down:function(){
			var e = event || window.event;
			if(e.keyCode == 13){
				$("#good_fee").blur();
				$("#remark").focus();
			}
		}
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

//获取供应商列表
function getCustomer(value){
	$.ajax({
		url: "/index.php?m=system&c=purchase&a=getCustomer",
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
	$.ajax({
		url: "/index.php?m=system&c=sellOut&a=getItem",
		data: {prd_id:prd_id,wh:$("#wh").val()},
		dataType: "json",
		type: "POST",
		success: function (data) {
			$(".good_sku").css("display","none");
			
			if(data.code == "no_sku"){											//如果选择的商品没有sku属性，直接赋值给  flow.items
				$("#good_name").val("");
				$("#good_name").attr("placeholder",data.result[0].prd_no);
			
				var newData = {
					"discount":"无",
					"booth_price":data.result[0].cost_price,
					"num":1,
					"subtotal":data.result[0].cost_price,
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
				
				$("#good_price").val(data.result[0].cost_price);
				$("#good_num").val(1);
				$("#order_price_all").html(data.result[0].cost_price);
				$("#good_fee").val(data.result[0].cost_price);
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
					
					$("#remark").val("");
					
					$("#good_num").focus();
					
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
	
	$.ajax({
		url: "/index.php?m=system&c=purchase&a=getSkuItem", 
		data: {prd_sku_id:value,wh:$("#wh").val()},
		dataType: "json",
		type: "POST",
		success: function (data) {
			if(data){
				$("#good_name").val("");
				$("#good_name").attr("placeholder",data.prd_no);
				var newData = {
					"discount":"无",
					"booth_price":data.cost_price,
					"num":1,
					"subtotal":data.cost_price,
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
					
					$("#good_price").val(data.cost_price);
					$("#good_num").val(1);
					$("#order_price_all").html(data.cost_price);
					$("#good_fee").val(data.cost_price);
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

//实收金额获取焦点
function good_fee_focus(){
	var num = $("#good_num").val();
	flow.now_num = num;
	event.currentTarget.select();
}

function remark_focus(){
	event.currentTarget.select();
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
	
	if(flow.now_num != num){
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

//实付金额键盘抬起事件
function good_fee_up(){
	
	var arr = flow.items;
	
	var price = $("#good_fee").val();
	
	if(price < 0){
		layer.msg("请输入正确金额",{
			icon: 0,
			time: 2000
		});
		return false;
	}
	
	arr[flow.index].subtotal = price;										//改变小计价格
	var nn = accSub($("#order_price_all").html() * 1,price);
	$("#discount").val(nn);	
	arr[flow.index].discount = nn;	//将折扣赋值给原始数据
	if(nn == 0){
		arr[flow.index].discount = "无";
	}
	
	flow.items = [];		//必须先将数组制空，再进行复制，页面数据才会实时变化
	flow.items = arr;
	
	calculate();
}

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
			discount_price = addNum(discount_price,flow.items[i].discount*1);;						//计算优惠价格
			
		}
	}
	flow.good_allnum = good_allnum;
	flow.price_num = price_num;
	flow.discount_price = discount_price;
}

//重置
function reset_now(){
	$("#good_name").attr("placeholder","直接输入开始采购");
	$("#good_name").val("");
	$("#good_price").val("0.00");
	$("#good_num").val(1);
	$("#order_price_all").html("0.00");
	$("#good_fee").val("0.00");
	$("#discount").val(0);
	$("#remark").val("");
	$(".prdt").html("");
	//if($("#wh option").length > 1){
	//	$("#wh").val("");
	//}
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
	
	flow.items[flow.index].remark = value;
	
}

//确认结帐
function settlement_sure(type){
	
	var data = [];
	var newData = {};
	
	newData.wh = $("#wh").val();																		//仓库
	
	newData.cus_no = flow.customer[flow.customer_index].cus_no;											//客户编号
	
	newData.memo = $("#memo").val();																	//备注
	
	newData.discount = (flow.discount_price*1 + (flow.price_num*1 - $("#check_good_fee").val()*1));   	//优惠金额

	newData.totalPrice = flow.price_num;															 	//应付金额
	
	newData.consume = $("#check_good_fee").val();														//实付金额
	
	newData.payment_time = flow.payment_time;															//销售日期(付款日期)
	
	newData.data = flow.items;																			//获取明细数据
	
	newData.pay_way = flow.payWay;																		//支付方式
	
	data.push(newData);
	
	$.ajax({
		url: "/index.php?m=system&c=purchase&a=setData",
		data: {data:data,type:type},
		dataType: "json",
		type: "POST",
		success: function (data) {
			if(data.code == "ok"){
				flow.dupVal = [];
				layer.close(flow.settlement_index);         //先关闭结帐弹窗
				/*layer.open({																																											
					type: 1,																																											
					title: "付款成功",																																									
					skin: 'layui-layer-rim', //加上边框																																					
					area: ['560px', '300px'], //宽高																																					
					shade: 0.3,																																											
					content: $("#sale_sure"),
					btn:['关闭'],
					cancel: function (index, layero) {																																					
					
					},
					success:function(){
						if(flow.customer_index !== ""){		//窗口打开成功后先判断有没有选择客户
							flow.customer_show = true;
							flow.pay_customer = flow.customer[flow.customer_index].cus_name;   // 获取当前选择的客户名
							flow.have_customer = true;		//显示入账成功
							flow.no_customer = false;		//隐藏录入客户
						}
						
						if(flow.payWay == "cash"){
							$(".pay_way_1").html("现金支付");
							flow.src = "/images/xianjin.png";
						}else if(flow.payWay == "bank"){
							$(".pay_way_1").html("银行卡支付");
							flow.src = "/images/yinhangka.png";
						}else if(flow.payWay == "weixin"){
							$(".pay_way_1").html("微信支付");
							flow.src = "/images/weixin.png";
						}else if(flow.payWay == "zhifubao"){
							$(".pay_way_1").html("支付宝支付");
							flow.src = "/images/zhifubao.png";
						}else if(flow.payWay == "arrears"){
							$(".pay_way_1").html("欠款");
							flow.src = "/images/qiankuan.png";
						}
						
						$(".react_money").html($("#check_good_fee").val());
						flow.can = false;
						
					},
					end:function(){							//窗口销毁后重置页面数据
						flow.customer_show = false;
						flow.have_customer = false;
						flow.no_customer = true;
						flow.items = [];
						reset_now();
						flow.can = true;
					}
				});*/
				layer.msg("付款成功",{
					icon: 1,
					time: 2000
				});
				flow.items = [];
				reset_now();
				flow.cancel_show();
				$("#names").focus();
			}else{
				layer.msg(data.msg,{
					icon: 0,
					time: 2000
				});
			}
		}
	});
}

document.body.onkeyup = function(){
	var e = event || window.event;
	if(e.keyCode == 119){
		reset_now();
	}else if(e.keyCode == 121){
		
		if(flow.open_check == true){
			settlement_sure('no');
			return false;
		}else if(flow.open_check == false){
		
			flow.check_out('');
			
		}
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
		
		arr[flow.index].subtotal = (arr[flow.index].booth_price*arr[flow.index].num).toFixed(2);
		
		arr[flow.index].discount = "无";
		
		$("#order_price_all").html(arr[flow.index].subtotal);
		$("#good_fee").val(arr[flow.index].subtotal);
		$("#discount").val("0");
		
		
		
		flow.items = [];
		flow.items = arr;
		calculate();
	}
	
	
	
	
	
	//$("#order_price_all").html(price);
	//$("#good_fee").val(price);
}

function whChange(value){
	if(value !== ""){
		$("#good_name").focus();
	}
}


//回车获取数据
$("#good_names").keydown(function(e){
	if(e.keyCode == '13'){
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