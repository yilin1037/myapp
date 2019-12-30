var element;
var newAfter = '';//新旧版售后
var tableList = new Vue({
	el: '#tableList',
	data: {
		itemdata:[],
		itemhuandata:[],
		refundItems:[],
		refundTitleItems:[],
		focusEle:"unique_code",
		layprint: "",
		layprintTplBq: "",
		delPrinter: "",
		delList: "",
		delListBad: "",
		delListSelect: "",
		delListBar: "",
		nameList: "",
		nameListBad: "",
		nameListSelect:"" ,
		nameListBar:"" ,
		layprintTplBqBar: "",
		defaultMsg:[],
		locArr:"",			//货位数据数组
		pageLocCount:"",   		//货位弹窗内总页数
		pageLocNo:"",				//货位弹窗内页数
		locName:"",             //货位名称查询
		prd_id:"",				//记录当前点击的是哪个商品
		choose_prd_sku_id:"",   //单个商品套装编码 选择档口 传入的 prd_sku_id
		type:"",				//判断套装编码弹窗内选择档口点击还是最外层界面点击
		buttonObj:'',	//当前操作的对象
		tdIndex:0,
	},
	mounted: function() {
		var self = this;
		execAjax({
			m:'afterSale',
			c:'unpacking',
			a:'getRefundConfig',
			data:{list : 'T'},
			success:function(data){
				self.refundItems = data;
			}
		});
		
		execAjax({
			m:'afterSale',
			c:'unpacking',
			a:'getRefundTitleConfig',
			data:{list : 'T'},
			success:function(data){
				self.refundTitleItems = data;
			}
		});
		
		$.ajax({
			url: "/index.php?m=system&c=delivery&a=getPrinter",
			type: 'post',
			data: {},
			dataType: 'json',
			success: function (data) {
				if(data['result'].printer != "" && data['bq'].id != ""){
					$("#layprint").val(data['result'].printer);
					$("#layprintTplBq").val(data['bq'].id);
				}else if(data['result'].printer != "" && data['bq'].id == ""){
					printerPrompt("未设置默认打印模板","标签设计","index.php?m=print&c=bqDesign&a=index");
				}else if(data['result'].printer == "" && data['bq'].id != ""){
					printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
				}else{
					printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
				}
			}
		});
		
		//获取默认打印机模板
		$.ajax({
			url: "/index.php?m=afterSale&c=unpacking&a=getDefaultSetup",
			type: 'post',
			data: {},
			dataType: 'json',
			success: function (data) {
				tableList.layprintTplBq = data['tplList'];
				tableList.layprintTplBqBar = data['tplListKc'];
				tableList.nameList = data['goodlist'];
				tableList.nameListBad = data['badlist'];
				tableList.nameListBar = data['barlist'];
				tableList.nameListSelect = data['Selectlist'];
				if(data['defaultSetup']){
					tableList.delPrinter = data['defaultSetup'][0];
					tableList.delList = data['defaultSetup'][1];
					tableList.delListBad = data['defaultSetup'][2];
					tableList.delListBar = data['defaultSetup'][3];
					tableList.delListSelect = data['defaultSetup'][4];
				}
			}
		});
		
		//日期选择器
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {									
            var $ = layui.jquery,  layer = layui.layer ;
			element = layui.element;
		});
		
		var urlObj = GetRequest();
		if(urlObj){
			if(urlObj.newAfter){
				newAfter = urlObj.newAfter;		
			}
		}
		
		//此段代码请放到ajax请求数据成功后的回调函数内，checkbox样式才会有效
		$(document).ready(function(){
			$('.skin input').iCheck({
				checkboxClass: 'icheckbox_minimal',
				radioClass: 'iradio_minimal',
				increaseArea: '20%'
			});
			
			$("#prdLoc").click(function(){
				layer.open({
					title :'选择货位',
					type: 2,
					shade: false,
					area: ['880px', '620px'],
					maxmin: false,
					content: '?m=widget&c=selectPrdLoc&a=index&type=1'
				}); 
			})
		});	
		//此段代码请放到ajax请求数据成功后的回调函数内，checkbox样式才会有效
	},
	methods: {
		page:function(){
			layer.open({																																											
				type: 1,																																											
				title: '选择退货入库商品',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['900px', '500px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#page"),																																							
				btn: ['选择', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					
					//layer.close(index);
				}
				,btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {																																					
																																																	
				}																																													
			});	
		},
		getLoc:function(locName,curr){
			var self = this;
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=getLoc",										
				type: 'post',																		
				data: {locName:locName,curr:curr},																	
				dataType: 'json',																	
				success: function (data) {															
					if(data.result != 0){
						self.locArr = data.result;
						self.pageLocCount = Math.ceil(data.pageNum / 10);
						self.pageLocNo = curr;
					}else{
						layer.msg("没有查询到数据",{
							icon: 2,
							time: 2000
						});
						self.locArr = "";
						self.pageLocCount = 0;
						self.pageLocNo = 0;
					}																			
				}																					
			});	
		},
		chooseThisLoc2:function(id,prd_loc){
			var self = this;
			var type=$("refundSelect").val();
			if(type=='换货件'){
				self.itemhuandata[self.tdIndex]['x_prd_loc']=prd_loc;
				self.itemdata[self.tdIndex]['x_prd_loc']=prd_loc;
			}else{
				self.itemdata[self.tdIndex]['x_prd_loc']=prd_loc;
			}
			$("[name='"+self.buttonObj+"']").val(prd_loc);
			$("[name='"+self.buttonObj+"']").text(id);
			layer.close(self.nowIndex);
			
		},
		locSearch:function(){
			var self = this;
			var locName = $("#locName").val();
			self.locName = locName;
			self.getLoc(locName,1);
		},
		resetLoc:function(){
			$("#locName").val("");
		},
		downLocSearch:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				self.locSearch();
			}
		},
		locSearch:function(){
			var self = this;
			var locName = $("#locName").val();
			self.locName = locName;
			self.getLoc(locName,1);
		},
		chooseThisLoc:function(id,prd_loc){
			var self = this;
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=chooseThisLoc",										
				type: 'post',																		
				data: {id:id,prd_id:self.prd_id,prd_loc:prd_loc,prd_sku_id:self.choose_prd_sku_id,type:self.type},																	
				dataType: 'json',
				async:false, 				
				success: function (data) {															
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						
					}else{
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
					}																			
				}																					
			});
			// jqtb.ajax.reload("", false);
			// if(self.type == "suit"){
			// 	if(self.isGood != "good"){
			// 		suit(self.prd_id,'no',self.isGood,'yes');
			// 	}else{
			// 		suit(self.choose_prd_sku_id,'no',self.isGood,'yes');
			// 	}
				
			// }
			
			layer.close(self.nowIndex);
			
		},
		getTid:function(search_type){
			var self = this;
			self.focusEle = search_type;
			if(event.keyCode == 13){
				var unique_code = $('#unique_code').val();
				var tid = $('#tid').val();
				var sid = $('#sid').val();
				var buyer_nick = $('#buyer_nick').val();
				$.ajax({
					url: "/index.php?m=afterSale&c=unpacking&a=getOrder",
					type: 'post',
					data: {search_type: search_type, unique_code: unique_code, tid: tid, sid: sid, buyer_nick: buyer_nick},
					dataType: 'json',
					success: function (data) {
						if(data.code == 'ok'){
							tableList.getOrderInfo(data.new_tid,data.refund_id,data.company_name,data.company_sid);
						}else if(data.code == 'error'){
							layer.msg(data.msg,{
								icon: 0,
								time: 2000
							});
						}else{
							layer.msg("操作异常error",{
								icon: 2,
								time: 2000
							});
						}
						
						orderReset();
					}
				});
			}
		},
		getOrderInfo:function(new_tid,refund_id,company_name,sid){
			var self = this;
			$.ajax({
				url: "/index.php?m=afterSale&c=unpacking&a=getOrderInfo",
				type: 'post',
				data: {new_tid: new_tid, newAfter: newAfter},
				dataType: 'json',
				success: function (data) {
					$(".alww").hide();
					if(data.code == 'ok'){
						$('#express').val(company_name);
						$('#express_no').val(sid);
						$('#new_tid').val(new_tid);
						$('#shopinput').val(data.result_data.shopname);
						$('#nick').val(data.result_data.buyer_nick);
						$('#buyer_name').val(data.result_data.receiver_name);
						$('#mobilephone').val(data.result_data.receiver_mobile);
						$('#province').val(data.result_data.receiver_state);
						$('#city').val(data.result_data.receiver_city);
						$('#district').val(data.result_data.receiver_district);
						$('#telephone').val(data.result_data.receiver_telephone);
						$('#address').val(data.result_data.receiver_address);
						$('#seller_memo').val(data.result_data.seller_memo);
						$('#buyer_message').val(data.result_data.buyer_message);
						$('#selectTitle').val("");
						if(refund_id == ""){
							$("#refundHtml").html("");
						}else{
							$("#refundHtml").html("<a href='https://refund2.taobao.com/dispute/detail.htm?disputeId="+ refund_id +"' style='color:blue;' target='_blank'>进入退款后台</a>");
						}
						var result = $("#moreSetup").prop("checked");		
						if(result == true){
							for(var i in data.result_data.dataItem){
							　　data.result_data.dataItem[i].num =0;
							}
						}
						self.itemdata = data.result_data.dataItem;
						self.itemhuandata = [];
						if(data.result_data.dataItem == 0){
							layer.msg("订单商品已全部退货入库或此订单没有在系统内发货",{
								icon: 0,
								time: 2000
							});
						}
						var speakWay = $("#autoSpeckText").prop("checked");
						if(speakWay == true){
							if(data.result_data.seller_memo != ''){//语音读备注
								speckText(data.result_data.seller_memo);
							}
						}
						if(data.result_data.show === 1){
							var buyer_nick = data.result_data.buyer_nick;
							$("#nick_div").attr('style','float:left;width:180px');
							$("#nick").attr('style','width:180px');
							$(".alww").show();
							$("#alww-link").attr('href',"http://www.taobao.com/webww/ww.php?ver=3&touid="+buyer_nick+"&siteid=cntaobao&status=2&charset=utf-8");
							$("#alww-pic").attr('src',"http://amos.alicdn.com/online.aw?v=2&uid="+buyer_nick+"&site=cntaobao&s=2&charset=utf-8");
						}
					}else{
						layer.msg("操作异常error",{
							icon: 2,
							time: 2000
						});
					}
				}
			});
		},
		autoFocus:function(){
			var a = $(event.target);
			a.focus().select();
		},
		key_up:function(value,index){
			var self = this;
			var a = $(event.target);
			var e = event || window.event;
			var num_now = parseInt(a.val());
			if(isNaN(num_now)){
				num_now = 0;
			}
			if(num_now > value){
				num_now = value;
			}
			
			a.val(num_now);
			self.itemdata[index].num = num_now;
		},
		key_up2:function(index){
			var self = this;
			var a = $(event.target);
			var e = event || window.event;
			var payment = parseInt(a.val());
			if(isNaN(payment)){
				payment = 0;
			}
			a.val(payment);
			self.itemdata[index].payment = payment;
		},
		removeItem:function(index){
			var self = this;
			
			self.itemdata.splice(index,1);
		},
		key_up_huan:function(value,index){
			var self = this;
			var a = $(event.target);
			var e = event || window.event;
			var num_now = parseInt(a.val());
			if(isNaN(num_now)){
				num_now = 0;
			}
			if(num_now > value){
				num_now = value;
			}
			
			a.val(num_now);
			self.itemhuandata[index].num = num_now;
		},
		key_up2_huan:function(index){
			var self = this;
			var a = $(event.target);
			var e = event || window.event;
			var payment = parseInt(a.val());
			if(isNaN(payment)){
				payment = 0;
			}
			a.val(payment);
			self.itemhuandata[index].payment = payment;
		},
		removeItem_huan:function(index){
			var self = this;
			
			self.itemhuandata.splice(index,1);
		},
		printUniqueLabel:function(goods_type){
			var self = this;
			var new_tid = $('#new_tid').val();
			var prd_loc = $('#prdLoc').val();
			var itemdata = self.itemdata;
			
			var unprintTplBq = "";
			var unprintname = "";
			
			if(tableList.delPrinter){
				unprintname = tableList.delPrinter;
			}else{
				unprintname = $('#layprint').val();
				if(unprintname == ""){
					layer.msg('请先设置打印机',{
						icon: 0,
						time: 2000
					});
					return false;
				}else{
					layer.msg('未设置具体打印机，使用默认打印机',{
						icon: 1,
						time: 2000
					});
				}
			}
			
			if(goods_type == "good" && tableList.delList){
				unprintTplBq = tableList.delList;
			}else if(goods_type == "bad" && tableList.delList){
				unprintTplBq = tableList.delListBad;
			}else{
				unprintTplBq = $('#layprintTplBq').val();
				if(unprintTplBq == ""){
					layer.msg('请先设置标签打印模板',{
						icon: 0,
						time: 2000
					});
					return false;
				}else{
					layer.msg('未设置具体模板，使用默认模板',{
						icon: 0,
						time: 2000
					});
				}
			}
			
			if(new_tid == ""){
				layer.msg("请先录入拆包信息",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			if(itemdata.length < 1 || itemdata == 0){
				layer.msg("没有录入退回的商品",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			$.ajax({																																									
				url: "/index.php?m=afterSale&c=unpacking&a=getPrintData",																															
				type: 'post',																																										
				data: {new_tid: new_tid, newAfter: newAfter, goods_type: goods_type, itemdata: itemdata},																																									
				dataType: 'json',																																						
				success: function (data) {
					if(data.code == "ok"){
						for(var i = 0; i < data.printData[0].length; i++){
							printTpl[unprintTplBq](unprintname,data.printData[0][i]);	
						}
					}else{
						layer.msg("数据异常",{
							icon: 0,
							time: 2000
						});
					}
				}
			});
		},
		orderSubmit:function(WMS_TYPE){
			var self = this;
			var new_tid = $('#new_tid').val();
			var prdLoc = $('#prdLoc').val();
		
			var itemdata = self.itemdata;
			var itemhuandata = self.itemhuandata;
			var refund_type = $('#refund_type').val();

			if(refund_type != '无信息件' && new_tid == ""){
				layer.msg("请先录入拆包信息",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			if(refund_type != '无信息件' && (itemdata.length < 1 || itemdata == 0)){
				layer.msg("没有录入退回的商品",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			var result = $("#moreSetup").prop("checked");
			if(result == true){
				for(var i = 0; i < itemdata.length; i++){
					var num = itemdata[i].num;
					var number = itemdata[i].number;
					if(number !=num){
						if (!confirm('退货数量与应退数量不符，是否继续？')) return false;
					}
					if(num < 1){
						layer.msg("请输入正确的退货数量",{
							icon: 0,
							time: 2000
						});
						return false;
					}
				
				}
			}else{
				for(var i = 0; i < itemdata.length; i++){
					var num = itemdata[i].num;
					if(num < 1){
						layer.msg("请输入正确的退货数量",{
							icon: 0,
							time: 2000
						});
						return false;
					}
				}
			}
			
			if(refund_type == '换货件'){
				if(itemhuandata.length < 1 || itemhuandata == 0){
					layer.msg("没有录入换货的商品",{
						icon: 0,
						time: 2000
					});
					return false;
				}
				
				for(var i = 0; i < itemhuandata.length; i++){
					var num = itemhuandata[i].num;
					if(num < 1){
						layer.msg("请输入正确的换货数量",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					if(itemhuandata[i].x_prd_loc==''){
						layer.msg("必须选择货位",{
								icon: 0,
								time: 2000
							});
						return false;
					}
				}
			}else{
				for(var i=0;i<itemdata.length;i++){
					if(itemdata[i].x_prd_loc==''){
						layer.msg("必须选择货位",{
								icon: 0,
								time: 2000
							});
						return false;
					}
				}
			}
			
			
			var express = $('#express').val();
			var express_no = $('#express_no').val();
			var title = $('#title').val();
			var prd_loc = $('#prdLoc').val();
			var remark = $('#remark').val();
			var extra_amtn = $('#extra_amtn').val();
			extra_amtn = $.trim(extra_amtn);
			
			if(WMS_TYPE == 'PT'){//入库并打印条码
				// if(str_prd_loc == ''){
				// 	layer.msg("请先选择货位",{
				// 		icon: 0,
				// 		time: 2000
				// 	});
				// 	return false;
				// }
				
				var unprintname = "";
				if(tableList.delPrinter){
					unprintname = tableList.delPrinter;
				}else{
					unprintname = $('#layprint').val();
					if(unprintname == ""){
						layer.msg('请先设置打印机',{
							icon: 0,
							time: 2000
						});
						return false;
					}else{
						layer.msg('未设置具体打印机，使用默认打印机',{
							icon: 1,
							time: 2000
						});
					}
				}
				
				if(tableList.delListBar){
					var unprintTplBq = tableList.delListBar;
				}else{
					var unprintTplBq = $('#layprintTplBqBar').val();
					if(unprintTplBq == ""){
						layer.msg('请先设置条码打印模板',{
							icon: 0,
							time: 2000
						});
						return false;
					}	
				}
			}
			
			$.ajax({																																													//===========
				url: "/index.php?m=afterSale&c=unpacking&a=saveAfterSale",																																		//===========
				type: 'post',																																											//===========
				data: {new_tid: new_tid, newAfter: newAfter, express: express, prd_loc: prd_loc, remark: remark, express_no: express_no, title: title, extra_amtn: extra_amtn, refund_type: refund_type, itemdata: itemdata, itemhuandata: itemhuandata},
				dataType: 'json',																																										//===========
				success: function (data) {																																								//===========
					if(data.code == 'ok'){
						layer.msg("保存成功",{
							icon: 1,
							time: 2000
						});
						
						if(WMS_TYPE == 'PT'){//入库并打印条码
							if(data.barcodeList){
								for(var i = 0; i < data.barcodeList.length; i++){
									printTpl[unprintTplBq](unprintname,data.barcodeList[i]);
								}
							}
						}
						
						orderReset();
						
						self.itemdata = [];
						self.itemhuandata = [];
						
						$('#selectKey').focus();
						/*if(self.focusEle == "tid"){
							$('#tid').focus();
						}else{
							$('#unique_code').focus();
						}*/
					}else{
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});
					}
				}
			});
		},
		refundTypeAdd:function(){
			var self = this;
			
			layer.open({
                title :'添加退件类型',
                type: 2,
                shade: 0.3,
                area: ['350px', '450px'],
                maxmin: false,
                content: '?m=afterSale&c=unpacking&a=refundType'
            }); 
		},
		titleAdd:function(){
			var self = this;
			
			layer.open({
                title :'添加问题描述',
                type: 2,
                shade: 0.3,
                area: ['350px', '450px'],
                maxmin: false,
                content: '?m=afterSale&c=unpacking&a=refundTitle'
            }); 
		},
		setupTplPrinter:function(){
			//打印机
			doGetPrinters(function(data){
				tableList.layprint = data;
			});
			layer.open({
				title :'设置打印机、模板',
				type: 1,
				skin: 'layui-layer-rim', 
				area: ['650px', '400px'],
				content: $("#openTplPrinter"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var layprintList = $("#layprintList").val();
					var layprintTplBqShop = $("#layprintTplBqShop").val();
					var layprintTplBqShopBad = $("#layprintTplBqShopBad").val();
					var layprintTplBqSelect = $("#layprintTplBqSelect").val();
					var layprintTplBqBar = $("#layprintTplBqBar").val();
					console.log(layprintList+"==>"+layprintTplBqShop);
					$.ajax({
						url: "/index.php?m=afterSale&c=unpacking&a=setupDefault",
						type: 'post',
						data: {
							layprintList: layprintList, 
							layprintTplBqShop: layprintTplBqShop, 
							layprintTplBqShopBad: layprintTplBqShopBad,
							layprintTplBqSelect: layprintTplBqSelect,
							layprintTplBqBar: layprintTplBqBar,
						},
						dataType: 'json',
						success: function (data) {
							if(data.code == 'ok'){
								tableList.delPrinter = layprintList;
								tableList.delList = layprintTplBqShop;
								tableList.delListBad = layprintTplBqShopBad;
								tableList.delListSelect = layprintTplBqSelect;
								tableList.delListBar = layprintTplBqBar;
								layer.close(index);
							}
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
						}
					});
				}
			}); 
		},
		repeatSelect:function(){
			var self = this;
			var new_tid = $('#new_tid').val();
			var itemdata = self.itemdata;
			var unprintTplBq = "";
			var unprintname = "";
			
			if(tableList.delPrinter){
				unprintname = tableList.delPrinter;
			}else{
				unprintname = $('#layprint').val();
				if(unprintname == ""){
					layer.msg('请先设置打印机',{
						icon: 0,
						time: 2000
					});
					return false;
				}else{
					layer.msg('未设置具体打印机，使用默认打印机',{
						icon: 1,
						time: 2000
					});
				}
			}
			
			unprintTplBq = tableList.delListSelect;
			if(unprintTplBq == ""){
				layer.msg('请先设置可发货标签打印模板',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			if(new_tid == ""){
				layer.msg("请先录入拆包信息",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			if(itemdata.length < 1 || itemdata == 0){
				layer.msg("没有录入退回的商品",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			$.ajax({																																									
				url: "/index.php?m=afterSale&c=unpacking&a=getPrintDataSelectOrder",																															
				type: 'post',																																										
				data: {new_tid: new_tid, itemdata: itemdata},																																									
				dataType: 'json',																																						
				success: function (data) {
					if(data.code == "ok"){
						if(data.defaultMsg && data.defaultMsg.length > 0){
							self.defaultMsg = data.defaultMsg;
						
							layer.open({
								type: 1,																																											
								title: '查询结果',																																								
								skin: 'layui-layer-rim', //加上边框																																					
								area: ['800px', '400px'], //宽高																																					
								shade: 0.3,																																											
								content: $("#default")																																													
							});	
						}
							
						for(var i = 0; i < data.printData.length; i++){
							printTpl[unprintTplBq](unprintname,data.printData[i]);	
						}
					}else{
						layer.msg("数据异常",{
							icon: 0,
							time: 2000
						});
					}
				}
			});
		}
	},
});	
//选择货位
function chooseLoc(prd_id,type,index,prd_sku_id,e,index){
	var value = "";
	if($(event.target)[0].nodeName == "BUTTON"){
		value = $(event.target).val();
	}else{
		value = $(event.target).parent().val();
	}
	tableList.buttonObj = e.target.name;
	tableList.tdIndex = index;
	tableList.doWhat = "";
	
	tableList.locIndex = index;
	
	tableList.type = type;
	
	tableList.prd_id = prd_id;
	
	tableList.choose_prd_sku_id = prd_sku_id;
	
	layer.open({																																											
		type: 1,																																											
		title: '选择货位',																																									
		skin: 'layui-layer-rim', //加上边框																																					
		area: ['1400px', '650px'], //宽高																																					
		shade: 0.3,																																											
		content: $("#locs"),																																							
		btn: ['关闭']
		,yes: function(index, layero){
			//按钮【按钮一】的回调
			
			layer.close(index);
		},
		cancel: function (index, layero) {																																					
																																															
		},
		success: function(layero, index){
			tableList.nowIndex = index;
		}		
	});
    
	tableList.getLoc('',1);
}

$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});	

function changeF()  
{  
   document.getElementById('makeupCo').value=  
   document.getElementById('makeupCoSe').options[document.getElementById('makeupCoSe').selectedIndex].value;  
}  

function changeE()  
{  
   document.getElementById('makeupCo1').value=  
   document.getElementById('makeupCoSe1').options[document.getElementById('makeupCoSe1').selectedIndex].value;  
}  

/*
$(function () {

});
*/
layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;
	if(newAfter == 'T'){
		table.render({
			elem: '#dataList'
			,url:'/index.php?m=afterSale&c=unpacking&a=getBuyerNickr'
			,skin: 'row'
			,page: true 
			,limits: [10, 50, 100]
			,limit: 10 
			,cellMinWidth: 80
			,height: '365'
			,cols: [[ 
				{type:'numbers', width:80, title: '序号', event: 'setSign', style:'cursor: pointer;'}
				,{field:'shopname', width:100, title: '店铺', event: 'setSign', style:'cursor: pointer;'}
				,{field:'show_tid', width:180, title: '网店订单号', event: 'setSign', style:'cursor: pointer;'}
				,{field:'buyer_nick', width:100, title: '买家昵称', event: 'setSign', style:'cursor: pointer;'}
				,{field:'receiver_name', width:100, title: '收件人', event: 'setSign', style:'cursor: pointer;'}
				,{field:'buyer_call', width:100, title: '联系方式', event: 'setSign', style:'cursor: pointer;'}
				,{field:'title', width:180, title: '商品名称', event: 'setSign', style:'cursor: pointer;'}
				,{field:'payment_time', width:180, title: '付款时间', event: 'setSign', style:'cursor: pointer;'}
			]]
			,id: 'dataList'
			,data:[]
			,even: true
		});
	}else{
		table.render({
			elem: '#dataList'
			,url:'/index.php?m=afterSale&c=unpacking&a=getBuyerNickr'
			,skin: 'row'
			,page: true 
			,limits: [10, 50, 100]
			,limit: 10 
			,cellMinWidth: 80
			,height: '365'
			,cols: [[ 
				{type:'numbers', width:80, title: '序号', event: 'setSign', style:'cursor: pointer;'}
				,{field:'shopname', width:100, title: '店铺', event: 'setSign', style:'cursor: pointer;'}
				,{field:'new_tid', width:180, title: '订单号', event: 'setSign', style:'cursor: pointer;'}
				,{field:'show_tid', width:180, title: '网店订单号', event: 'setSign', style:'cursor: pointer;'}
				,{field:'buyer_nick', width:100, title: '买家昵称', event: 'setSign', style:'cursor: pointer;'}
				,{field:'receiver_name', width:100, title: '收件人', event: 'setSign', style:'cursor: pointer;'}
				,{field:'buyer_call', width:100, title: '联系方式', event: 'setSign', style:'cursor: pointer;'}
				,{field:'title', width:180, title: '商品名称', event: 'setSign', style:'cursor: pointer;'}
				,{field:'payment_time', width:180, title: '付款时间', event: 'setSign', style:'cursor: pointer;'}
			]]
			,id: 'dataList'
			,data:[]
			,even: true
		});
	}
	
	table.on('tool(dataList)', function(obj){
		var data = obj.data;
		if(newAfter == 'T'){
			var tid = data['show_tid'];
		}else{
			var tid = data['new_tid'];
		}
		$("#tid").val(tid);
		setTimeout(function(){
			layer.closeAll();
			var unique_code = $('#unique_code').val();
			var sid = $('#sid').val();
			var buyer_nick = $('#buyer_nick').val();
			$.ajax({
				url: "/index.php?m=afterSale&c=unpacking&a=getOrder",
				type: 'post',
				data: {
					search_type: 'tid', 
					unique_code: unique_code, 
					tid: tid, 
					sid: sid, 
					buyer_nick: buyer_nick,
					newAfter: newAfter,
				},
				dataType: 'json',
				success: function (data) {
					if(data.code == 'ok'){
						tableList.getOrderInfo(data.new_tid,data.refund_id);
						$('#buyer_nick').val("");
						$('#buyer_call').val("");
						$('#selectKey').val("");
						self.wms_type = data.wms_type;
					}else if(data.code == 'error'){
						layer.msg(data.msg,{
							icon: 0,
							time: 2000
						});
					}else{
						layer.msg("操作异常error",{
							icon: 2,
							time: 2000
						});
					}
					
					orderReset();
				}
			});
		},200);
	});
});
function getNick(){
	tableList.focusEle = 'buyer_nick';
	var table = layui.table;
	var $ = layui.$;
	var buyer_nick = $('#buyer_nick').val();
	if(buyer_nick == ""){
		layer.msg('请输入用户昵称');
		return false;
	}
	$('#buyer_nick').blur();
	var active = {
		reload: function(){
			table.reload('dataList', {
				page: {
					curr: 1
				}
				,where: {
					buyer_call: '',
					buyer_nick: buyer_nick
				}
			});
		}
	};
	active['reload'] ? active['reload'].call(this) : '';
	layer.open({
		type: 1,
		title: '退款订单列表',
		skin: 'layui-layer-rim',
		area: ['1050px', '450px'],
		shade: 0.3,
		content: $("#orderList"),
	});
	$(window).resize();
}							
function getCall(){
	tableList.focusEle = 'buyer_call';
	var table = layui.table;
	var $ = layui.$;
	var buyer_call = $('#buyer_call').val();
	if(buyer_call == ""){
		layer.msg('请输入用户电话');
		return false;
	}
	$('#buyer_call').blur();
	var active = {
		reload: function(){
			table.reload('dataList', {
				page: {
					curr: 1
				}
				,where: {
					buyer_call: buyer_call,
					buyer_nick: ''
				}
			});
		}
	};
	active['reload'] ? active['reload'].call(this) : '';
	layer.open({
		type: 1,
		title: '退款订单列表',
		skin: 'layui-layer-rim',
		area: ['1050px', '450px'],
		shade: 0.3,
		content: $("#orderList"),
	});
	$(window).resize();
}

function getSelect(){
	tableList.focusEle = 'selectKey';
	var table = layui.table;
	var $ = layui.$;
	var selectKey = $('#selectKey').val();
	if(selectKey == ""){
		layer.msg('请输入查询条件');
		return false;
	}
	$('#selectKey').blur();
	var active = {
		reload: function(){
			table.reload('dataList', {
				page: {
					curr: 1
				}
				,where: {
					selectKey: selectKey,
					newAfter: newAfter
				}
				,done: function(res, curr, count){
					if(res.count=='error_12'){
						layer.msg("此单没有退款申请，如需拆包登记，请关闭基础设置-拆包退货仅自动带出退款商品",{
							icon: 2,
							time: 4000
						});
					}
					if($("#orderList").css('display') == 'none'){
						if(count > 1){
							layer.open({
								type: 1,
								title: '退款订单列表',
								skin: 'layui-layer-rim',
								area: ['1050px', '450px'],
								shade: 0.3,
								content: $("#orderList"),
							});
							$(window).resize();
						}else if(count == 1){
							if(newAfter == 'T'){
								var tid = res.data[0]['show_tid'];
							}else{
								var tid = res.data[0]['new_tid'];
							}
							$.ajax({
								url: "/index.php?m=afterSale&c=unpacking&a=getOrder",
								type: 'post',
								data: {
									search_type: 'tid', 
									unique_code: '', 
									tid: tid,
									sid: '', 
									buyer_nick: ''
								},
								dataType: 'json',
								success: function (data) {
									if(data.code == 'ok'){
										if(newAfter == 'T'){
											tableList.getOrderInfo(data.show_tid,data.refund_id);
										}else{
											tableList.getOrderInfo(data.new_tid,data.refund_id);
										}
										
										$('#buyer_nick').val("");
										$('#buyer_call').val("");
										$('#selectKey').val("");
									}else if(data.code == 'error'){
										layer.msg(data.msg,{
											icon: 0,
											time: 2000
										});
									}else{
										layer.msg("操作异常error",{
											icon: 2,
											time: 2000
										});
									}
									orderReset();
								}
							});
						}else if(count == 0){
							layer.msg("未找到查询订单",{
								icon: 2,
								time: 2000
							});
							var alem= document.getElementById('selectKey');
							alem.focus();
						}	
					}
					
					$('#selectKey').val("");
				}
			});
		}
	};
	
	active['reload'] ? active['reload'].call(this) : '';
}

function selectProduct(){
	layer.open({
		title :'选择退货商品',
		type: 2,
		shade: false,
		area: ['880px', '620px'],
		maxmin: false,
		content: '?m=widget&c=selectProduct&a=index'
	}); 
}

function cbProductRows(data){
	var prd_no = data[0].prd_no;
	var prd_loc = data[0].prd_loc;
	if(prd_no){//商品弹出框
		var pushdata = tableList.itemdata;
		if(pushdata == 0){
			pushdata = [];
		}
		for(var i = 0; i < data.length; i++){
			pushdata.push({
				'oid': '',
				'pic_url': data[i]['image_url'],
				'title': data[i]['title'],
				'prd_no': data[i]['prd_no'],
				'sku_name': data[i]['sku_name'],
				'prd_id': data[i]['prd_id'],
				'num': 1,
				'num_max': 9999999,
				'payment': data[i]['sum_price'],
			});
		}
		
		tableList.itemdata = pushdata;
	}else if(prd_loc){//货位弹出框
		$('#prdLoc').val(prd_loc);	
	}
}

function refundTypeChange(e){
	document.getElementById('refund_type').value=e.value;
	if(e.value == '换货件'){
		$('#selectProduct').hide();
		$('#tab-huan').show();
		if(tableList.itemhuandata.length == 0){
			tableList.itemhuandata = tableList.itemdata;
		}
	}else if(e.value == '无信息件'){
		$('#selectProduct').show();
	}else{
		$('#selectProduct').hide();
		$('#tab-huan').hide();
		element.tabChange('tabs','tab-tui');
		tableList.itemhuandata = [];
	}
}

function orderReset(){
	$('input[name="reset"]').val('');
	$('input[name="base"]').val('');
	$("#refundSelect").val('退货件');
	$("#refund_type").val('退货件');
	$('#tab-huan').hide();
	tableList.itemhuandata = [];
	element.tabChange('tabs','tab-tui');
	$('#selectProduct').hide();
}
function moreSetupChange(){
	var result = $("#moreSetup").prop("checked");
	if(result == true){
		if(tableList.itemdata.length>0){
			for(var i in tableList.itemdata){
				tableList.itemdata[i].num =0;
			}
			$('.examine').show();
			$('.examine_goods').show();
		}else{
			$("#moreSetup").prop("checked",false);
			layer.msg("暂无信息,请查询后操作",{
				icon: 0,
				time: 2000
			});
			return false;
		}

	}else{
		$('.examine').hide();
		$('.examine_goods').hide();
	}
	
}

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