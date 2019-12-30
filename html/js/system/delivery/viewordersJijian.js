
var flow = new Vue({
	el: '#flow',
	data: {
		state:"1",                                                //状态
		tid:"", 
        buyer_nick:"", 
        receiver_name:"", 
        receiver_mobile:"", 
        express_no:"", 
        receiver_address:"", 
		provinceArr:[],	
		isShow:false,
		isShowM:0,											
		gridArr:[],												 //表格数据
		numdataArr:[],											 //按钮显示订单数量
		pageCount:0,											 //总页数
		pageNo:1,												 //页数				
		pageSize:20, 											 //页码
		result_total:0,											 //全部订单数量
		printType:"",
		layprint:[],
		layprintTplBq:[],
		isAll:0,
		nowPage:false,
		allPage:false,
		searchData:{},
		logArr:[],
		defaultMsg:[],
		expressSort:[],
		printTplDzmd:{},
		shippingClientArr:[],
		shopArr:[],
		DROP_SHIPPING:"F",
		shippingId:"",
		shopId:"",
		isCancel:'F',
		banner:"",                                               //旗帜数组
		hui:false,												 //判断灰旗是否勾选
		red:false,                                               //判断红旗是否勾选
		yellow:false,                                            //判断黄旗是否勾选
		green:false,											 //判断绿旗是否勾选
		blue:false,                                              //判断蓝旗是否勾选
		pink:false,                                              //判断粉旗是否勾选
	},
	mounted: function() {
		var self = this;
		
		//======================================================================================日期选择器=======================================================================================================
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {																													//===========
            var $ = layui.jquery, element = layui.element, layer = layui.layer ;																													//===========
            var form = layui.form(),layer = layui.layer,layedit = layui.layedit,laydate = layui.laydate;																							//===========
            // 初始化表格																																											//===========
            var jqtb = $('#dateTable').DataTable({																																					//===========
                "`dom": '<"top">rt<"bottom"flp><"clear">',																																			//===========
                "autoWidth": false,                     // 自适应宽度																																//===========
                "paging": true,																																										//===========
                "pagingType": "full_numbers",																																						//===========
                "processing": true,																																									//===========
                "serverSide": true,//开启服务器获取数据																																				//===========
                "fnServerParams": function (aoData) {																																				//===========
                },																																													//===========
                //请求url																																											//===========
                "sAjaxSource": "index.php?m=system&c=message&a=getChildAccount",																													//===========
                // 初始化表格																																										//===========
            });																																														//===========
																																																	//===========
        });	

		var urlObj = GetRequest();
		var sysPlan = "";
		if(urlObj){
			if(urlObj.sysPlan){
				sysPlan = urlObj.sysPlan;		
			}
			if(urlObj.DROP_SHIPPING && urlObj.DROP_SHIPPING == "T"){
				self.DROP_SHIPPING = "T";//代发
				$(".shoppingGroup").show();
				$(".Options").hide();
			}
		}
		
		$.ajax({
			url: "/index.php?m=system&c=delivery&a=getShippingClient",
			type: 'post',
			data: {},
			dataType: 'json',
			success: function (data) {
				self.shippingClientArr = data;
			}
		});
		
		if(self.DROP_SHIPPING == "T"){
			self.shopArr = {};
		}else{
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getShop",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					self.shopArr = data;
				}
			});	
		}
		
		//======================================================================================日期选择器结束===================================================================================================
		this.searchALL();	
	},
	methods: {
		
		//===================================================================================== 查询模块标签点击事件 ============================================================================================
		//																																															//===========
		//		点击时通过传过来的值判断是哪个标签执行此方法																																		//===========
		//																																															//===========
		//		$(".labelGroup div").each(function(){																																				//===========
		//			$(".labelGroup .ic").remove();																																					//===========
		//			$(this).css("borderColor","#c2c2c2");																																			//===========
		//		});																																													//===========
		//																																															//===========
		//		类似此类代码均为做每个组内的初始化操作																																				//===========
		//																																															//===========
		//=======================================================================================================================================================================================================
		//				|
		//				|
		//				|	
		//			 	|  
		//			  \	| /
		//			   \|/
		searchAdd:function(group,who){
			var self = this;
			var toggle = event.currentTarget;
			if(group == "stateGroup"){																																							
				$(".stateGroup div").each(function(){																																					
					$(".stateGroup .ic").remove();																																					
					$(this).removeClass("border");																																			
				});																																													
				$(toggle).append("<i class='ic'></i>");																															
				$(toggle).addClass("border");																																				
				if(who == "1"){																																								
					self.state = "1";																																							
					$("#searchArr .deli").remove();																																					
					$("#searchArr").append("<span class='add deli rem'>近3个月<i class='dele' id='stateGroup' onclick='closeNow(\"stateGroup\")'></i></span>");											
				}else if(who == "2"){																																							
					self.state = "2";																																							
					$("#searchArr .deli").remove();																																					
					$("#searchArr").append("<span class='add deli rem'>待发货<i class='dele' id='stateGroup' onclick='closeNow(\"stateGroup\")'></i></span>");											
				}else if(who == "3"){																																							
					self.state = "3";																																							
					$("#searchArr .deli").remove();																																					
					$("#searchArr").append("<span class='add deli rem'>已发货<i class='dele' id='stateGroup' onclick='closeNow(\"stateGroup\")'></i></span>");											
				}else if(who == "4"){																																							
					self.state = "4";																																							
					$("#searchArr .deli").remove();																																					
					$("#searchArr").append("<span class='add deli rem'>已成功<i class='dele' id='stateGroup' onclick='closeNow(\"stateGroup\")'></i></span>");											
				}else if(who == "5"){																																						
					self.state = "5";																																							
					$("#searchArr .deli").remove();																																					
					$("#searchArr").append("<span class='add deli rem'>已关闭<i class='dele' id='stateGroup' onclick='closeNow(\"stateGroup\")'></i></span>");											
				}else if(who == "6"){																																							
					self.state = "6";																																							
					$("#searchArr .deli").remove();																																					
					$("#searchArr").append("<span class='add deli rem'>3个月前<i class='dele' id='stateGroup' onclick='closeNow(\"stateGroup\")'></i></span>");											
				}else if(who == "7"){																																						
					self.state = "7";																																							
					$("#searchArr .deli").remove();																																					
					$("#searchArr").append("<span class='add deli rem'>锁定<i class='dele' id='stateGroup' onclick='closeNow(\"stateGroup\")'></i></span>");											
				}else if(who == "all"){																																								
					self.state = "";																																							
					$("#searchArr .deli").remove();																																					
				}																																													
			}else if(group == "bannerArr") {
				// $(toggle).append("<i class='ic'></i>");
				$(toggle).addClass("border");
				$(".bannerArr .all .ic").remove();
				$(".bannerArr .all").removeClass("border");
				if (who == "hui") {
					if (self.hui == false) {
						$("#searchArr .ban").append("<span class='bannerA hui rem' style='background-image:url(\"images/hui.png\");background-size:100% 100%;'></span>");
						self.hui = true;
					} else if (self.hui == true) {
						$("#searchArr .ban .hui").remove();
						self.hui = false;
						$(toggle).removeClass("border");
						$(".bannerArr .banner_1 .ic").remove();
					}
				} else if (who == "red") {
					if (self.red == false) {
						$("#searchArr .ban").append("<span class='bannerA red rem' style='background-image:url(\"images/red.png\");background-size:100% 100%;'></span>");
						self.red = true;
					} else if (self.red == true) {
						$("#searchArr .ban .red").remove();
						self.red = false;
						$(toggle).removeClass("border");
						$(".bannerArr .banner_2 .ic").remove();
					}
				} else if (who == "yellow") {
					if (self.yellow == false) {
						$("#searchArr .ban").append("<span class='bannerA yellow rem' style='background-image:url(\"images/yellow.png\");background-size:100% 100%;'></span>");
						self.yellow = true;
					} else if (self.yellow == true) {
						$("#searchArr .ban .yellow").remove();
						self.yellow = false;
						$(toggle).removeClass("border");
						$(".bannerArr .banner_3 .ic").remove();
					}
				} else if (who == "green") {
					if (self.green == false) {
						$("#searchArr .ban").append("<span class='bannerA green rem' style='background-image:url(\"images/green.png\");background-size:100% 100%;'></span>");
						self.green = true;
					} else if (self.green == true) {
						$("#searchArr .ban .green").remove();
						self.green = false;
						$(toggle).removeClass("border");
						$(".bannerArr .banner_4 .ic").remove();
					}
				} else if (who == "blue") {
					if (self.blue == false) {
						$("#searchArr .ban").append("<span class='bannerA blue rem' style='background-image:url(\"images/blue.png\");background-size:100% 100%;'></span>");
						self.blue = true;
					} else if (self.blue == true) {
						$("#searchArr .ban .blue").remove();
						self.blue = false;
						$(toggle).removeClass("border");
						$(".bannerArr .banner_5 .ic").remove();
					}
				} else if (who == "pink") {
					if (self.pink == false) {
						$("#searchArr .ban").append("<span class='bannerA pink rem' style='background-image:url(\"images/fen.png\");background-size:100% 100%;'></span>");
						self.pink = true;
					} else if (self.pink == true) {
						$("#searchArr .ban .pink").remove();
						self.pink = false;
						$(toggle).removeClass("border");
						$(".bannerArr .banner_6 .ic").remove();
					}
				} else if (who == "all") {
					$("#searchArr .ban span").remove();

					$(".bannerArr div").each(function () {
						$(".bannerArr .ic").remove();
						$(this).removeClass("border");
					});

					// $(toggle).append("<i class='ic'></i>");
					$(toggle).addClass("border");

					self.hui = false;
					self.red = false;
					self.green = false;
					self.yellow = false;
					self.blue = false;
					self.pink = false;
				}
			}
			//searchALLNow(self,'F');																																										
		},																																															
		//================================================================================================特殊订单组选择标签结束=================================================================================
		selectAll:function(type){
			var self = this;
			if(type == "now"){
				$(".currentAll").find(".inputTe").each(function(){
					$(this).css("color","white");
				});
				self.isAll = 0;
				self.allPage = false;
				if(self.nowPage == false){
					if($(event.target).attr('value') != "icon"){
						$(event.target).find(".inputTe").css("color","black");
					}else{
						$(event.target).css("color","black");
					}
					self.nowPage = true;
					$(".skin input[name='order']").iCheck('check');	
				}else if(self.nowPage == true){
					if($(event.target).attr('value') != "icon"){
						$(event.target).find(".inputTe").css("color","white");
					}else{
						$(event.target).css("color","white");
					}
					self.nowPage = false;
					$(".skin input[name='order']").iCheck('uncheck');	
				}
			}
		},
		copyOrders:function(new_tid){
            layer.open({
                title :'复制订单',
                type: 2,
                shade: false,
                area: ['1100px', '700px'],
                maxmin: false,
                content: '?m=system&c=delivery&a=addOrders',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
                    iframeWin.vueObj.loadOrders(new_tid,{action: 'copy'});
                }
            }); 
        },
		//====================================================================================================重置按钮===========================================================================================
		//作废开始
		orderCancel:function(type){
			//var lock = false;
			var self = this;
			self.defaultMsg = [];
			var data = "";
			var nowIsAll = self.isAll;
			if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
			
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				return false;																																										//===========
			}
			$("#cancelMsg").val("");
			/*data = "";																						
			$("input[name='order']:checkbox").each(function(){						
				if(true == $(this).is(':checked')){									
				data += ($(this).val()+",");									
			}
			//	拼接当前页的货品唯一码
			});																		
			data = data.substring(0,data.length-1);		
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=get_status",																																		
				type: 'post',																																												
				data: {data: data},
				async:false,
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "error"){
						layer.msg('所选订单存在已发货订单，不允许作废',{
						   icon: 2,
						   time: 2000
						});
						lock = true;
					}
				}																																															
			});*/
		//if(lock == false){
				//lock =false;
				layer.open({
					type: 1,
					title: '作废订单',
					skin: 'layui-layer-rim', 
					area: ['700px', '200px'], 
					shade: 0.3,
					content: $("#edit-pages6"),
					btn: ['确定', '取消']
					,yes: function(index, layero){
						//按钮【按钮一】的回调
						self.saveOrderCancel(type);
					}
					,btn2: function(index, layero){
						
					},
					cancel: function (index, layero) {
					}
				});	
			//}
		},
		saveOrderCancel:function(type){
			var self = this;
			var nowIsAll = self.isAll;
			var data = "";	
			var cancelMsg = $('#cancelMsg').val();
			if(cancelMsg == "" || cancelMsg == "0"){
				layer.msg('请填写作废原因',{
					icon: 2,
					time: 2000
				});
				return false;
			}
			
				if(type == "page"){
					data = self.searchData;
					if(self.isAll == 0){//-----如果是当前页	
						data = "";																						
						$("input[name='order']:checkbox").each(function(){						
							if(true == $(this).is(':checked')){									
								data += ($(this).val()+",");									
							}
							//	拼接当前页的货品唯一码
						});																		
						data = data.substring(0,data.length-1);									
					}
				}else{
					data = type;
					self.isAll = 0;
				}

			$.ajax({
				url: "/index.php?m=system&c=delivery&a=setCancelTid",
				type: 'post',
				data: {data: data, isAll: self.isAll, cancelMsg: cancelMsg},
				dataType: 'json',
				success: function (data) {
					if(data.code == "ok"){
						layer.closeAll();
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						$("input[name='order']").iCheck('uncheck');
						$(".inputTe").css("color","white");
						self.isAll = 0;
						self.nowPage = false;
						self.allPage = false;
					}else if(data.code == "error"){
						layer.closeAll();
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});
					}
					searchALLNow(self,'page');
				}
			});
			self.isAll = nowIsAll;
		},
		orderRecovery:function(){
			var self = this;
			self.defaultMsg = [];
			var data = "";
			var nowIsAll = self.isAll;
			
			if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
			
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				return false;																																										//===========
			}	
			
			//data = self.searchData;
			data = "";	
			if(self.isAll == 0){//-----如果是当前页	
				//data = "";																						
				$("#bottomDiv input[name='order']:checkbox").each(function(){						//--------------------------																				
					if(true == $(this).is(':checked')){									//																											
						data += ($(this).val()+",");									//																											
					}																	//	拼接当前页的货品唯一码																					
				});																		//																							
				data = data.substring(0,data.length-1);									//--------------------------																														
			}
			
			$.ajax({																																														
				url: '/index.php?m=system&c=delivery&a=orderRecovery',																																		
				type: 'post',																																												
				data: {data: data},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.msg('操作成功',{
							icon: 1,
							time: 2000
						});
					}else if(data.code == "error"){
						self.defaultMsg = data.msgList;
						layer.open({
							type: 1,																																											
							title: '失败详情',																																								
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['800px', '400px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#default")																																													
						});
					}
					
					searchALLNow(self,'page');
				}																																															
			});
		},
		orderOutput:function(){
			var self = this;
			var data = self.searchData;
			var result_total = self.result_total;
			
			if(result_total > 100000){
				layer.msg('数据量超过100000，无法导出，请先缩小查询范围',{
					icon: 0,
					time: 2000
				});																																											//===========
				return false;																																										//===========
			}
			
			var indexLoad = layer.load();
			execAjax({
                m:'system',
                c:'delivery',
                a:'exportOrderGridView',
                data:{
                    data:data,isAll: '1'
                },
                success:function(data){
                    layer.close(indexLoad);
                    $("#excelFileId").val(data['id']);
                    $("#excelForm").submit();
					$("input[name='order']").iCheck('uncheck');
					$(".inputTe").css("color","white");
					self.isAll = 0;
					self.nowPage = false;
					self.allPage = false;
                }
            });
		},
		print_all:function(){
			var self = this;
			$("#print_all").prop("disabled",true);
			setTimeout(function(){
				$("#print_all").prop("disabled",false);
			},1000)
			for(var i = 0; i < self.expressSort.length; i++){
				self.print_now(self.expressSort[i].type,i,'F','T');
			}
		},
		faceAlone:function(type, isCancel){
			var self = this;
			self.defaultMsg = [];
			self.isCancel = isCancel;
			var data = "";
			var nowIsAll = self.isAll;
			if(type == "page"){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){	
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});																																											//===========
					return false;																																										//===========
				}

				if(self.isAll == 0){														//-----如果是当前页																							
					$("#bottomDiv input[name='order']:checkbox").each(function(){						//--------------------------																				
						if(true == $(this).is(':checked')){									//																											
							data += ($(this).val()+",");									//																											
						}																	//	拼接当前页的货品唯一码																					
					});																		//																							
					data = data.substring(0,data.length-1);									//--------------------------																														
				}else if(self.isAll != 0){
					data = self.searchData;
				}
			}else{
				data = type;
				self.isAll = 0;
			}
			//self.face = param;
			
			$("#layprint1").val(0);											//-----初始化选择框																										
			$("#layprintTplBq1").val(0);										//-----初始化选择框
			
			var checkPrintFace = 'T';
			if(isCancel != 'T')
			{
				$.ajax({																																														
					url: "/index.php?m=system&c=delivery&a=checkPrintFace",																																		
					type: 'post',																																												
					data: {data: data, isAll: self.isAll, viewOrders: 'T', isCancel: self.isCancel},
					async:false,
					dataType: 'json',																																											
					success: function (data) {
						if(data.code == "error"){
							checkPrintFace = 'F';
							self.defaultMsg = data.msgList;
							
							layer.open({
								type: 1,																																											
								title: '失败详情',																																								
								skin: 'layui-layer-rim', //加上边框																																					
								area: ['800px', '400px'], //宽高																																					
								shade: 0.3,																																											
								content: $("#default")																																													
							});	
						}
					}																																															
				});
			}
			if(checkPrintFace == "T"){
				$.ajax({																																														
					url: "/index.php?m=system&c=delivery&a=printFace",																																		
					type: 'post',																																												
					data: {data: data, isAll: self.isAll},																																													
					dataType: 'json',																																											
					success: function (data) {
						if(data){
							self.expressSort = data;
							self.printTplDzmd = printTplDzmd;
							doGetPrinters(function(data){																																							
								self.layprint =  data;																																								
							});																																														
																																																					
							$("#layprint1").val(0);											//-----初始化选择框																										
							$("#layprintTplBq1").val(0);									//-----初始化选择框																										
																																																					
							self.layprintTplBq = printTplBq;	
							
							$(document).ready(function(){
								$('#prin input').iCheck({
									checkboxClass: 'icheckbox_minimal',
									radioClass: 'iradio_minimal',
									increaseArea: '20%'
								});
							});
							
							$.ajax({																																														
								url: "/index.php?m=system&c=delivery&a=getMianDan",																																		
								type: 'post',																																												
								data: {},																																													
								dataType: 'json',																																											
								success: function (data) {
									if(data.printer != ""){
										$("#printer select").val(data.printer);
									}else{
										$("#printer select").val(0);
										printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
									}
								}																																															
							});
						}
					}																																															
				});
				
				var layerTitle = "打面单";
			
				layer.open({																																											
					type: 1,																																											
					title: layerTitle,																																									
					skin: 'layui-layer-rim', //加上边框																																					
					area: ['1200px', '400px'], //宽高																																					
					shade: 0.3,		
					
					content: $("#facePop"),
					cancel: function(index, layero){
						if(type == "page"){
							searchALLNow(self,'page');
							$("input[name='order']").iCheck('uncheck');	
							$(".inputTe").css("color","white");
							self.isAll = 0;
							self.nowPage = false;
							self.allPage = false;
						}
					}
				});
				
				self.isAll = nowIsAll;	
			}
		},
		print_now:function(type,index,show,send){
			var self = this;	
			self.defaultMsg = [];
			send = "F";
			
			var data = "";
			var isrepeat = "";
			if($("#layprint" + index).val() != 0){																																							
				var unprintname = $("#layprint" + index).val();																																				
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}																																														
			if($("#layprintTplBq" + index).val() != 0){																																						
				var unprintTplBq = $("#layprintTplBq" + index).val();																																		
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}
																																																	
			if(self.isAll == 0){														//-----如果是当前页																							
				$("input[name='order']:checkbox").each(function(){						//--------------------------																				
					if(true == $(this).is(':checked')){									//																											
						data += ($(this).val()+",");									//																											
					}																	//	拼接当前页的货品唯一码																					
				});																		//																							
				data = data.substring(0,data.length-1);								//--------------------------																														
				if(data == ''){
					layer.msg('请选择打印的订单！',{
						icon: 2,
						time: 2000
					});
					return	
				}
			}else if(self.isAll != 0){
				data = self.searchData;
			}
			
			if($("#printInput" + index).is(':checked')){
				isrepeat = "no";
			}else{
				isrepeat = "yes";
			}
			
			var a = $(event.target);
			a.prop("disabled",true);
			
			setTimeout(function(){
				a.prop("disabled",false);
			},1000);
			$.ajax({																																									
				url: "/index.php?m=system&c=delivery&a=printNow",																															
				type: 'post',																																								
				data: {data:data,isAll:self.isAll,type:type,isrepeat:isrepeat,show:show,send:send,exception:self.exception, printTpl: unprintTplBq,isCancel:self.isCancel},																																									
				dataType: 'json',																																						
				success: function (data) {
					if(data.dataCheck && data.numCheck > 0){
						self.defaultMsg = data.dataCheck;
						
						layer.open({
							type: 1,																																											
							title: '打印详情',																																								
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['800px', '400px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#default")																																													
						});	
					}
					if(data.dates && data.dates.length > 0){
						var newData = [];						
						var percent = 0;											
						var num = 0;
						if(show == "F"){
							doGetPrinters(function(){
								newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
								if(unprintname){
									printTpl[unprintTplBq](unprintname,newData);
								}
							});
						}else if(show == "show"){
							doGetPrinters(function(){
								newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'T');//订单数据,商品数据，订单详情数据,预览
								if(unprintname){
									printTpl[unprintTplBq](unprintname,newData,true);
								}else{
									layer.msg('打印机不存在,无法预览', {time: 2000, icon:2});
								}
							});
						}
					}																																		
				}
			});																					
		},
		resetNow:function(){
			var self = this;
			resetF(self,'F');
		},
		searchALL:function(){
			var self = this;
			searchALLNow(self,'F');
			
			/*layer.load(2);
			$("#searchALL").addClass("layui-btn-disabled");
			$("#searchALL").removeClass("btn");
			$("#searchALL").addClass("btnOnlyStyle");
			searchALLNow(self,'F',function(){
				layer.closeAll('loading');
				$("#searchALL").removeClass("layui-btn-disabled");
				$("#searchALL").addClass("btn");
				$("#searchALL").removeClass("btnOnlyStyle");
			});*/
		},
		//=============查询方法结束==============
		orderLockPage:function(type){
			var self = this;
			if(type == "page"){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
					
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}		
			}
			$("#lockMsg").val("");
			layer.open({
				type: 1,
				title: '锁定订单',
				skin: 'layui-layer-rim', 
				area: ['700px', '200px'], 
				shade: 0.3,
				content: $("#edit-pages7"),
				btn: ['确定', '取消']
				,yes: function(index, layero){
					self.orderLock('LOCK',type);
				}
				,btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {
				}
			});	
		},
		orderLock:function(method,type){
			var self = this;
			var data = "";
			var nowIsAll = self.isAll;
			var lockMsg = $("#lockMsg").val();
			if(type == "page"){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
				
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}	
				
				data = self.searchData;
				if(self.isAll == 0){//-----如果是当前页	
					data = "";																						
					$("#bottomDiv input[name='order']:checkbox").each(function(){						
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");									
						}
					});																		
					data = data.substring(0,data.length-1);									
				}
			}else{
				data = type;
				self.isAll = 0;
			}
			
			
			if(method == "LOCK"){
				var url = "/index.php?m=system&c=delivery&a=setTidLock";
			}else if(method == "UNLOCK"){
				var url = "/index.php?m=system&c=delivery&a=setTidUnlock";
			}
			
			$.ajax({																																														
				url: url,																																		
				type: 'post',																																												
				data: {data: data, isAll: self.isAll, lockMsg: lockMsg},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.closeAll();
						layer.msg('操作成功，已发货或取消的订单无法锁定、解锁',{
							icon: 1,
							time: 2000
						});
					}else if(data.code == "error"){
						layer.closeAll();
						layer.msg('操作失败',{
							icon: 2,
							time: 2000
						});
					}
					
					searchALLNow(self,'page');
				}																																															
			});	
			self.isAll =  nowIsAll;
		},
		//=============================================分页开始============================//
		page: function(pager){
			var self = this;			
			if(pager == "first"){
				self.pageNo = 1;
			}else if(pager == "prev"){
				if(self.pageNo == 1){
					return false;
				}
				self.pageNo = self.pageNo - 1;
			}else if(pager == "next"){
				if(self.pageNo == self.pageCount){
					return false;
				}
				self.pageNo = self.pageNo + 1;
			}else if(pager == "last"){
				self.pageNo = "last";
			}
	
			searchALLNow(self,'page');
		},
		//=============================================分页结束============================//
		
		log:function(tid){
			var self = this;
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=getLog",																																		
				type: 'post',																																												
				data: {tid:tid,"DROP_SHIPPING": self.DROP_SHIPPING,"shippingId": self.shippingId},																																													
				dataType: 'json',																																											
				success: function (data) {
					self.logArr = data;
				}																																															
			});
			
			layer.open({																																											
				type: 1,																																											
				title: '操作日志',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['1200px', '400px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#log")																																													
			});
		},
	}
	
});
//=============================================================================================================选择标签删除方法==================================================================================
function closeNow(group){																																											
	if(group == "stateGroup"){																																									
		$("#searchArr .deli").remove();
		flow.state = "1";
		$(".stateGroup div").each(function(){
			$(".stateGroup .ic").remove();
			$(this).removeClass("border");
		});
		
		$(".stateGroup .reset").append("<i class='ic'></i>");
		$(".stateGroup .reset").addClass("border");
	}else if(group == "time"){
		$(".time").remove();
		$("#dateBegin").val("");
		$("#dateEnd").val("");	
	}else if(group == "tid1"){
		$(".tid1").remove();
		$(".tid").val("");
	}else if(group == "buyer_nick1"){
		$(".buyer_nick1").remove();
		$(".buyer_nick").val("");
	}else if(group == "receiver_name1"){
		$(".receiver_name1").remove();
		$(".receiver_name").val("");
	}else if(group == "order_sign1"){
		$(".order_sign1").remove();
		$(".order_sign").val("");
	}else if(group == "receiver_mobile1"){
		$(".receiver_mobile1").remove();
		$(".receiver_mobile").val("");
	}else if(group == "express_no1"){
		$(".express_no1").remove();
		$(".express_no").val("");
	}else if(group == "receiver_address1"){
		$(".receiver_address1").remove();
		$(".receiver_address").val("");
	}else if(group == "unique_code1"){
		$(".unique_code1").remove();
		$(".unique_code").val("");
	}else if(group == "orderStatus1"){
		$(".orderStatus1").remove();
		$("#orderStatus").val("");
	}else if(group == "shop"){
		$("#searchArr .shop").remove();
		$("#shop").val(0);
		flow.shopId = "";
	}																																																	
																																																	
	//searchALLNow(flow,'F');																																													
}																																																	
//===========================================================================================================选择标签删除方法结束================================================================================

//===========================================================================================重置方法封装========================================================================================================
function resetF(self,special){	
	$("#dateBegin").val("");
    $("#dateEnd").val("");
    $(".tid").val("");
    $(".buyer_nick").val("");
    $(".receiver_name").val("");
	$(".order_sign").val("");
    $(".receiver_mobile").val("");
    $(".express_no").val("");
    $(".receiver_address").val("");	
	$(".unique_code").val("");
	$(".rem").remove();
	$("#orderStatus").val("");
	$("#shop").val(0);

	//旗帜
	$(".bannerArr div").each(function(){																																							//===========
		$(".bannerArr .ic").remove();																																								//===========
		$(this).removeClass("border");																																						//===========
	});
	//旗帜 全部  选中 样式
	$(".bannerArr .all").append("<i class='ic'><i class='ri'></i></i>");																															//===========
	$(".bannerArr .all").addClass("border");																																				//===========

	self.hui = false;																																												//===========
	self.red = false;																																												//===========
	self.green = false;																																												//===========
	self.yellow = false;																																											//===========
	self.blue = false;																																												//===========
	self.pink = false;
	self.banner = "";


	self.state = "1";	
    self.tid = "";
    self.buyer_nick = "";
    self.receiver_name = "";
	self.order_sign = "";
    self.receiver_mobile = "";
    self.express_no = "";
    self.receiver_address = "";		
	flow.shopId	= "";
	
	$("#shipping").val('0');
	shippingChange('');
	
	closeNow('stateGroup');
	
}																																																	
//=========================================================================================重置方法封装结束======================================================================================================

//============================================================================================查询方法封装=======================================================================================================
function searchALLNow(self,page,callback){
	layer.load(2);
	$("#searchALL").addClass("layui-btn-disabled");
	$("#searchALL").removeClass("btn");
	$("#searchALL").addClass("btnOnlyStyle");
			
	var dateBegin = $("#dateBegin").val();
	var dateEnd = $("#dateEnd").val();	
    var tid = $(".tid").val();
    var buyer_nick = $(".buyer_nick").val();
    var unique_code = $(".unique_code").val();
    var receiver_name = $(".receiver_name").val();
    var receiver_mobile = $(".receiver_mobile").val();
	var order_sign = $(".order_sign").val();
    var express_no = $(".express_no").val();
    var receiver_address = $(".receiver_address").val();
	var orderStatus = $("#orderStatus").val();
	var orderStatus_text = $("#orderStatus").find("option:selected").text();


	var now = new Date();
	var Year = now.getFullYear();//获取当前年
	var Month =  now.getMonth()+1;
	var Day =  now.getDate();
	var temp = "";

	if(Month == 11 && 11<=Day<=14 ){
		if( dateBegin != '' && dateEnd != ''){
			var day = DateDiff(dateBegin,dateEnd);
			//已发货, 查询开始结束期间不能超过7天
			if(day > 6){
				temp = true;
			}
		}else if(dateBegin != '' && dateEnd == ''){
			var day = DateDiff(dateBegin,Year+"-"+Month+"-"+Day+" 00:00:01");
			if(day > 6){
				temp = true;
			}
		}else if((dateBegin == '' && dateEnd != '') || (dateBegin == '' && dateEnd == '')){
			temp = true;
		}
	}
	if(temp){
		layer.closeAll('loading');
		$("#searchALL").removeClass("layui-btn-disabled");
		$("#searchALL").addClass("btn");
		$("#searchALL").removeClass("btnOnlyStyle");
		alert("11月11日0点-11月14日23点59分，在此期间订单查询和已发货查询，查询开始结束期间不能超过7天。");
		return false;
	}


	if(page == 'F'){
		self.pageNo = 1;
	}
	//↓↓↓↓↓↓↓↓↓↓↓旗帜↓↓↓↓↓↓↓↓↓↓
	self.banner = "";
	if(self.hui){
		self.banner += (0 + ",");
	}
	if(self.red){
		self.banner += (1 + ",");
	}
	if(self.yellow){
		self.banner += (2 + ",");
	}
	if(self.green){
		self.banner += (3 + ",");
	}
	if(self.blue){
		self.banner += (4 + ",");
	}
	if(self.pink){
		self.banner += (5 + ",");
	}
	if(self.banner != ""){
		self.banner = self.banner.substring(0,self.banner.length-1);
	}
	//↑↑↑↑↑↑↑↑↑↑↑旗帜↑↑↑↑↑↑↑↑↑↑
	
	$(".time").remove();
	$(".tid1").remove();
	$(".buyer_nick1").remove();
	$(".unique_code1").remove();
	$(".receiver_name1").remove();
	$(".order_sign1").remove();
	$(".receiver_mobile1").remove();
	$(".express_no1").remove();
	$(".receiver_address1").remove();
	$(".orderStatus1").remove();
	
	if(dateBegin != ""){
		if(dateEnd != ""){
			$("#searchArr").append("<span class='add time rem'>"+dateBegin+"至"+dateEnd+"<i class='dele' id='time' onclick='closeNow(\"time\")'></i></span>");
		}else{
			$("#searchArr").append("<span class='add time rem'>"+dateBegin+"至<i class='dele' id='time' onclick='closeNow(\"time\")'></i></span>");
		}
	}else if(dateEnd != ""){
		$("#searchArr").append("<span class='add time rem'> 至"+dateEnd+"<i class='dele' id='time' onclick='closeNow(\"time\")'></i></span>");
	}
	
	if(tid != ""){
		$("#searchArr").append("<span class='add tid1 rem' style='max-width:400px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; top: 5px;'>订单编号:"+tid+"<i class='dele' id='tid1' onclick='closeNow(\"tid1\")'></i></span>");
	}
	
	if(buyer_nick != ""){
		$("#searchArr").append("<span class='add buyer_nick1 rem' style='max-width:400px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; top: 5px;'>买家昵称:"+buyer_nick+"<i class='dele' id='buyer_nick1' onclick='closeNow(\"buyer_nick1\")'></i></span>");
	}
	
	if(unique_code != "" && typeof(unique_code)!="undefined"){
		$("#searchArr").append("<span class='add unique_code1 rem' style='max-width:400px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; top: 5px;'>唯一码|爆款码:"+unique_code+"<i class='dele' id='unique_code1' onclick='closeNow(\"unique_code1\")'></i></span>");
	}
	
	if(receiver_name != ""){
		$("#searchArr").append("<span class='add receiver_name1 rem' style='max-width:400px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; top: 5px;'>收件人姓名:"+receiver_name+"<i class='dele' id='receiver_name1' onclick='closeNow(\"receiver_name1\")'></i></span>");
	}
	
	if(order_sign != ""){
		$("#searchArr").append("<span class='add order_sign1 rem' style='max-width:400px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; top: 5px;'>订单标识:"+order_sign+"<i class='dele' id='order_sign1' onclick='closeNow(\"order_sign1\")'></i></span>");
	}
	
	if(receiver_mobile != ""){
		$("#searchArr").append("<span class='add receiver_mobile1 rem' style='max-width:400px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; top: 5px;'>收件人电话:"+receiver_mobile+"<i class='dele' id='receiver_mobile1' onclick='closeNow(\"receiver_mobile1\")'></i></span>");
	}
	
	if(express_no != ""){
		$("#searchArr").append("<span class='add express_no1 rem' style='max-width:400px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; top: 5px;'>运单号:"+express_no+"<i class='dele' id='express_no1' onclick='closeNow(\"express_no1\")'></i></span>");
	}
	
	if(receiver_address != ""){
		$("#searchArr").append("<span class='add receiver_address1 rem' style='max-width:400px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; top: 5px;'>地址关键字:"+receiver_address+"<i class='dele' id='receiver_address1' onclick='closeNow(\"receiver_address1\")'></i></span>");
	}
	
	if(orderStatus != ""){
		$("#searchArr").append("<span class='add orderStatus1 rem'>订单状态:"+orderStatus_text+"<i class='dele' id='orderStatus1' onclick='closeNow(\"orderStatus1\")'></i></span>");
	}
	
	var data = {
		"pageSize":self.pageSize,
        "pageNo":self.pageNo,
        "state":self.state,
		"shopId":self.shopId,
		"dateBegin":$.trim(dateBegin),
		"dateEnd":$.trim(dateEnd),
        "tid":$.trim(tid),
        "buyer_nick": $.trim(buyer_nick),
        "unique_code": $.trim(unique_code),
        "receiver_name":$.trim(receiver_name),
		"order_sign":$.trim(order_sign),
        "receiver_mobile":$.trim(receiver_mobile),		
        "express_no":$.trim(express_no),	
        "receiver_address":$.trim(receiver_address),	
		"orderStatus":$.trim(orderStatus),
		"DROP_SHIPPING": self.DROP_SHIPPING,
		"shippingId": self.shippingId,
		"banner":self.banner,
	};	
	
	self.searchData = data;
	$.ajax({
		url: "/index.php?m=system&c=delivery&a=getOrderTradeView",
		type: 'post',
		data: {data: data},
		dataType: 'json',
		success: function (data) {
			var gridData = data.data;
			var pageCount = data.pageCount;
			var pageNo = data.pageNo;
			var pageSize = data.pageSize;
			var result_total = data.result_total;
			
			self.gridArr = gridData;
			self.pageCount = pageCount;
			self.pageNo = pageNo;
			self.pageSize = pageSize;
			self.result_total = result_total;
			
			if(data.system_id){//反查出来system_id
				$("#shipping").val(data.system_id);
				shippingChange(data.system_id);
			}
			
			$(document).ready(function(){
				$('.skin input').iCheck({
					checkboxClass: 'icheckbox_minimal',
					radioClass: 'iradio_minimal',
					increaseArea: '20%'
				});
			});
			setTimeout(function(){
				$('.changeColor').on('ifChecked ifUnchecked', function(event){
					if (event.type == 'ifChecked') {			
						$(event.target).parent().parent().parent().css("backgroundColor","#f8f8c7");
					} else {
						$(event.target).parent().parent().parent().css("backgroundColor","rgb(249, 249, 249)");
					}
				});	
			},200);
			$("input[name='order']").iCheck('uncheck');
			$(".inputTe").css("color","white");
			
			layer.closeAll('loading');
			$("#searchALL").removeClass("layui-btn-disabled");
			$("#searchALL").addClass("btn");
			$("#searchALL").removeClass("btnOnlyStyle");
			
			if(callback && typeof(callback) == "function"){
				callback();
			}
		}
	});
}

function keyDown(e){
	e= event || window.event;
	if(e.keyCode == 13){
		searchALLNow(flow,'F');
	}
}

//========================================================================================返回顶部、操作航固定==============================================================================================
clearfixFixTop();
function clearfixFixTop(){
	var clearfixClientTop = $("#btnGroupFixed").offset().top;
	var scrollReturnTop = $('<div>',{'class':'scrollReturnTop'}); 
	$("#btnGroupFixed").append(scrollReturnTop);
	$("body").on("click",".scrollReturnTop",function(){
		$("body,html").stop().animate({scrollTop:0},500);
	});
	$(window).scroll(function(){
		var windowScrollTop = $(window).scrollTop();
		if(windowScrollTop>clearfixClientTop+35){
			$("#btnGroupFixed").addClass("btnArrFixed");
			$("#btnGroupPageFixed").addClass("btnPageFixed");
		}else if(windowScrollTop<clearfixClientTop){
			$("#btnGroupFixed").removeClass("btnArrFixed");
			$("#btnGroupPageFixed").removeClass("btnPageFixed");
		}
		if(windowScrollTop>0){
			$(".scrollReturnTop").css("display","block");
		}else{
			$(".scrollReturnTop").css("display","none");
		}
	});
}
function cbPrintView(data){
    var pageWidth = 100 * 3;
    var pageHeight = 180 * 3;
    
    layer.open({
        type: 1
        ,title: false //不显示标题栏
        ,closeBtn: false
        ,area: pageWidth+'px;'
        ,shade: 0.8
        ,id: 'previewImage' //设定一个id，防止重复弹出
        ,btn: ['关闭']
        ,moveType: 1 //拖拽模式，0或者1
        ,content: '<div style="width:'+pageWidth+'px;height:'+pageHeight+'px;"><img style="width:100%;height:100%;" src="'+data['previewImage'][0]+'" /></div>'
    });
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

function shippingChange(system_id){
	if(system_id == ''){
		var toggle = event.currentTarget;																																								//===========
		if(toggle.value != "0"){																																										//===========
			flow.shippingId = toggle.value;																																									//===========
		}else if(toggle.value == "0"){																																									//===========
			flow.shippingId = "";																																											//===========
		}
	}else{
		flow.shippingId = system_id;
	}
	

	//searchALLNow(flow,'page');
	
	$.ajax({																																													//===========
		url: "/index.php?m=system&c=delivery&a=getShop",																																		//===========
		type: 'post',																																											//===========
		data: {DROP_SHIPPING: flow.DROP_SHIPPING, shippingId: flow.shippingId},																																												//===========
		dataType: 'json',																																										//===========
		success: function (data) {																																								//===========
			flow.shopArr = data;
			$(document).ready(function(){
				$('.skin-minimal-shop input').iCheck({
					checkboxClass: 'icheckbox_minimal',
					radioClass: 'iradio_minimal',
					increaseArea: '20%'
				});
			});
		}																																														//===========
	});
}

function shopChange(a){																																												//===========
	var toggle = event.currentTarget;																																								//===========
	if(toggle.value != "0"){																																										//===========
		flow.shopId = toggle.value;																																									//===========
		$("#searchArr .shop").remove();																																								//===========
		$("#searchArr").append("<span class='add shop rem'>" + a + "<i class='dele' id='specialGroup' onclick='closeNow(\"shop\")'></i></span>");													//===========
	}else if(toggle.value == "0"){																																									//===========
		flow.shopId = "";																																											//===========
		$("#searchArr .shop").remove();																																								//===========
	}																																																//===========
	//searchALLNow(flow,'page');																																										//===========
}

//返回 2个日期之间差几天
function DateDiff(sDate1, sDate2) {  //sDate1和sDate2是yyyy-MM-dd H:i:s格式
	sDate1 = sDate1.split(" ")[0];
	sDate2 = sDate2.split(" ")[0];
	var aDate, oDate1, oDate2, iDays;
	aDate = sDate1.split("-");
	oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);  //转换为yyyy-MM-dd格式
	aDate = sDate2.split("-");
	oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
	iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数

	return iDays;  //返回相差天数
}
