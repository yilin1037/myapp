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
		canEnter:true,
		mobile:"",					//消费记录电话
		consumption_consume:"",		//消费记录累计消费
		payment:"",					//消费记录累计付款
		arrears_now:"",				//消费记录累计欠款
		credit_pay:"",				//消费记录信用额度
		consumption_cus_no:"",		//消费记录cus_no
		consumption_title:"",		//消费记录弹窗标题
		now_num:"",
		begin_enter:true,
		do_guadan:false,
		wh:[],
		dupVal:[],                   //判断列表重复值
	},
	mounted: function() {
		var self = this;
		
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
		
		choose_good:function(prd_id){
			var self = this;
			
			$(".hideDiv").css("display","none");
			
			self.isShow = false;
			
			getItem(prd_id);
		},
		
		//商品名称列表查询  
		name_key:function(){
			var self = this;
			var value = $("#good_name").val();
			getData(value);
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
				$("#good_name").attr("placeholder","选择商品编号开始查找");
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
		
		//商品数量修改回车事件
		good_num_down:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				good_num_blur();
				$("#remark").focus();
			}
			//self.canEnter = false;
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
				$("#remark").blur();
			}
			//self.canEnter = false;
		},
		
		cancel_show:function(){
			var self = this;
			self.customer_index = "";
			$(".search_input").css("display","block");
			$(".customer_detail").css("display","none");
		},
		
		//保存
		check_out:function(type){
			$("button").blur();
			var self = this;
			
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
				area: ['800px', '200px'], //宽高																																					
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
				},
				end:function(){
					self.open_check = false;			
				}
			});
		},
		
		//选择支付方式
		/*choose_way:function(way){
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
			
		},*/
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
	flow.canEnter = false;
}

function name_blur(){
	if(!flow.isShow){
		$(".hideDiv").css("display","none");
	}
	flow.canEnter = true;
}

function names_focus(){
	getCustomer('');
	flow.canEnter = false;
}

function names_blur(){
	if(!flow.isShow1){
		$(".hideDiv1").css("display","none");
	}
	flow.canEnter = true;
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
					
					$("#remark").val("");
					
					flow.dupVal.push(data.result[0].prd_id);
				}
				
				
			}else{																//如果商品有sku属性，需选择属性
				$(".good_sku").css("display","block");
				$("#sku_name").val("");
				flow.skuArr = data.result;
			}
		}
	});
}

//商品属性改变方法(选择sku商品)
function skuChange(value){
	$.ajax({
		url: "/index.php?m=system&c=sellOut&a=getSkuItem",
		data: {prd_sku_id:value,wh:$("#wh").val()},
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
					$("#remark").val("");
					flow.dupVal.push(data.prd_sku_id);
				}
				
			}
		}
	});
}

//商品数量获得焦点
function good_num_focu(){
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
		
		flow.canEnter = true;
		
		calculate();
	}
	
}

function good_fee_blur(){
	
	flow.canEnter = true;
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
			discount_price += flow.items[i].discount*1;						//计算优惠价格
		}
	}
	flow.good_allnum = good_allnum;
	flow.price_num = price_num;
	flow.discount_price = discount_price;
}

//重置
function reset_now(){
	$("#good_name").attr("placeholder","直接输入商品编号开始查找");
	$("#good_price").val("0.00");
	$("#good_num").val(1);
	$("#order_price_all").html("0.00");
	$("#good_fee").val("0.00");
	$("#discount").val(0);
	$("#remark").val("");
	$(".prdt").html("");
	//if($("#wh option").length > 1){
		//$("#wh").val("");
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
	
	flow.canEnter = true;
}

//确认结帐
function settlement_sure(type){
	
	var data = [];
	var newData = {};
	
	newData.wh = $("#wh").val();																		//仓库
	
	newData.guadan_name = $("#guadan_name").val();
	
	newData.payment_time = flow.payment_time;															//盘出日期(付款日期)
	
	newData.data = flow.items;																			//获取明细数据
	
	//newData.pay_way = flow.payWay;																		//支付方式
	
	data.push(newData);
	
	$.ajax({
		url: "/index.php?m=system&c=theDisc&a=setData",
		data: {data:data,type:type,sa_no:flow.sa_no},
		dataType: "json",
		type: "POST",
		success: function (data) {
			layer.close(flow.settlement_index);         //先关闭结帐弹窗
			if(data.code == "ok"){
				flow.dupVal = [];
				flow.items = [];
				reset_now();
				flow.begin_enter = true;
				flow.sa_no = "";
				flow.do_guadan = false;
				flow.cancel_show();
				layer.msg("保存成功",{
					icon: 1,
					time: 2000
				});
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
		if(flow.begin_enter == true){
			if(flow.open_check == true){
				settlement_sure('no');
				return false;
			}else if(flow.open_check == false){
				
				if(flow.canEnter){
					flow.check_out('');
				}
				
			}
		}else{
			return false;
		}
		
		
	}else if(e.keyCode == 120){
		if(flow.open_check){
			flow.makeChange();
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
//回车获取数据
$("#good_names").keypress(function(e){
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