
var flow = new Vue({
	el: '#flow',
	data: {
		remark:"",												 //是否有备注
		singleStatus:4,                                          //配货状态
		banner:"",                                               //旗帜数组
		babyNum:"",                                              //宝贝数量
		hui:false,												 //判断灰旗是否勾选
		red:false,                                               //判断红旗是否勾选
		yellow:false,                                            //判断黄旗是否勾选
		green:false,											 //判断绿旗是否勾选
		blue:false,                                              //判断蓝旗是否勾选
		pink:false,                                              //判断粉旗是否勾选
		special:"",                                              //特殊订单记录状态
		province:"",                                             //选择省份
		provinceStatus:"T",                                      //判断省份是包含还是排除状态
		shopId:"",                                               //店铺
		express:"",                                              //快递
		orderStatus:"",                                          //订单状态
		order:"PaymentDown",                                      //排序规则
		coding:true,											 //------------------
		orderAmount:false,										 //-----
		babyNum:false,											 //-----
		noRemark:false,											 //-----
		haveRemark:false,										 //-----
		isSingle:false,											 //-----
		multiple:false,											 //-----
		variety:false,											 //----- 
		equipped:false,											 //-----均为状态值判断
		picking:false,											 //-----
		stock:false,											 //-----
		allocated:false,										 //-----
		refunds:false,											 //-----
		ship:false,												 //-----
		merge:false,											 //-----
		contain:"y",											 //-----
		banShow:false,											 //-----
		index:"F",												 //------------------
		provinceArr:[],	
		isShow:false,
		isShowM:0,
		shopArr:[],
		expressArr:[],											
		gridArr:[],												 //表格数据
		numdataArr:[],											 //按钮显示订单数量
		itemArr:[],
		pageCount:0,											 //总页数
		pageNo:1,												 //页数				
		pageSize:20, 											 //页码
		result_total:0,											 //全部订单数量
		printType:"",
		isAll:0,
		searchData:{},
		face:"",
		logArr:[],
		ItemModify:[],
		defaultMsg:[],
		actiontd:true,
		nowPage:false,
		allPage:false,
		isFirst:true,
		exception:"no",
		splitItemArr:[],
		payway:"",												 //支付方式
		webStatus:"",											 //线上状态
	},
	mounted: function() {
		var self = this;
		
		//======================================================================================日期选择器=======================================================================================================
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {																													
            var $ = layui.jquery, element = layui.element, layer = layui.layer ;																													
            var form = layui.form(),layer = layui.layer,layedit = layui.layedit,laydate = layui.laydate;																							
            // 初始化表格																																											
            var jqtb = $('#dateTable').DataTable({																																					
                "`dom": '<"top">rt<"bottom"flp><"clear">',																																			
                "autoWidth": false,                     // 自适应宽度																																
                "paging": true,																																										
                "pagingType": "full_numbers",																																						
                "processing": true,																																									
                "serverSide": true,//开启服务器获取数据																																				
                "fnServerParams": function (aoData) {																																				
                },																																													
                //请求url																																											
                "sAjaxSource": "index.php?m=system&c=message&a=getChildAccount",																													
                // 初始化表格																																										
            });																																														
																																																	
        });	
																																														
		//======================================================================================日期选择器结束===================================================================================================
		
			$.ajax({																																													
				url: "/index.php?m=system&c=delivery&a=consignor",																																		
				type: 'post',																																											
				data: {},																																												
				dataType: 'json',																																										
				success: function (data) {		
					if(data.code == "error"){
						layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {
							 var $ = layui.jquery, element = layui.element, layer = layui.layer ;
							layer.open({																																											
								title: '提示',																																										
								content: '您还未设置发货人信息',																																						
								btn: ['去设置', '取消'],																																								
								yes:function(index){																																										
									parent.parent.addTab("物流公司设置","index.php?m=system&c=setup&a=wuliuSetup","物流公司设置");
									layer.close(index);
								}																																													
							});
						});
					}																																								
				}																																														
			});
		
		var urlObj = GetRequest();
		//==================================================================================== 省市区选择处理 =================================================================================================== 
		//========================================================================================获取店铺=======================================================================================================
		$.ajax({																																													//===========
			url: "/index.php?m=system&c=delivery&a=getShop",																																		//===========
			type: 'post',																																											//===========
			data: {},																																												//===========
			dataType: 'json',																																										//===========
			success: function (data) {																																								//===========
				self.shopArr = data;																																								//===========
			}																																														//===========
		});																																															//===========
		//=======================================================================================获取店铺结束====================================================================================================
		
		
		//========================================================================================获取快递=======================================================================================================
		$.ajax({																																													//===========
			url: "/index.php?m=system&c=delivery&a=getExpress",																																		//===========
			type: 'post',																																											//===========
			data: {},																																												//===========
			dataType: 'json',																																										//===========
			success: function (data) {																																								//===========
				self.expressArr = data;																																								//===========
			}																																														//===========
		});																																															//===========
		//=======================================================================================获取快递结束====================================================================================================
		
		if(localStorage.getItem("placeArr")){
			self.provinceArr = JSON.parse(localStorage.getItem("placeArr"));
		}
		
		searchALLNow(self,'page');
		this.refreshTotal();
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
			
			if(group == "conditionGroup"){																																						
				$(".conditionGroup div").each(function(){																																				
					$(".conditionGroup .ic").remove();																																					
					$(this).removeClass("border");																																			
				});																																												
				$(toggle).append("<i class='ic'></i>");																															
				$(toggle).addClass("border");																																				
				if(who == "haveRemark"){																																							
					if(self.haveRemark == false){																																					
						self.remark = "1";																																							
						$("#searchArr .remar").remove();																																			
						$("#searchArr").append("<span class='add remar rem'>有留言或备注<i class='dele' id='conditionGroup' onclick='closeNow(\"conditionGroup\")'></i></span>");					
						self.haveRemark = true;																																						
						self.noRemark = false;																																						
					}else if(self.haveRemark == true){																																				
						self.remark = "";																																							
						$("#searchArr .remar").remove();																																			
						self.haveRemark = false;																																					
						$(".conditionGroup .ic").remove();																																			
						$(toggle).removeClass("border");																																	
					}																																												
				}else if(who == "noRemark"){																																						
					if(self.noRemark == false){																																						
						self.remark = "2";																																							
						$("#searchArr .remar").remove();																																			
						$("#searchArr").append("<span class='add remar rem'>无留言且无备注<i class='dele' id='conditionGroup' onclick='closeNow(\"conditionGroup\")'></i></span>");					
						self.noRemark = true;																																						
						self.haveRemark = false;																																					
					}else if(self.noRemark == true){																																				
						self.remark = "";																																							
						$("#searchArr .remar").remove();																																			
						self.noRemark = false;																																						
						$(".conditionGroup .ic").remove();																																			
						$(toggle).removeClass("border");																																		
					}																																												
				}																																													
			}																																														
			//=====================================================================================条件筛选组选择标签结束========================================================================================
			
			//=======================================================================================宝贝数量组选择标签==========================================================================================
			//																																														=============
			//		此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.babyNum 查询时直接拿此变量值即可																					=============
			//		此组无全部按钮，所以第二次点击相同标签，需取消选中状态，同时 self.babyNum 恢复为默认值，所以要多做一层判断																		=============
			//      判断方法：通过在 data 内给定每个标签一个对应的变量 记录此时是否为选中状态																										=============
			//					self.isSingle   --------  单款单件 标签是否选中																														=============
			//					self.multiple   --------  单款多件 标签是否选中																														=============
			//					self.variety	--------  多款多件 标签是否选中																														=============
			//																																														=============
			//===================================================================================================================================================================================================
			else if(group == "babyGroup"){																																							
				$(".babyGroup div").each(function(){																																				
					$(".babyGroup .ic").remove();																																					
					$(this).removeClass("border");																																			
				});																																												
				$(toggle).append("<i class='ic'></i>");																															
				$(toggle).addClass("border");																																				
				if(who == "single"){																																								
					if(self.isSingle == false){																																						
						self.babyNum = 1;																																							
						$("#searchArr .sin").remove();																																				
						$("#searchArr").append("<span class='add sin rem'>单款单件<i class='dele' id='babyGroup' onclick='closeNow(\"babyGroup\")'></i></span>");									
						self.isSingle = true;																																						
						self.multiple = false;																																						
						self.variety = false;																																						
					}else if(self.isSingle == true){																																				
						self.babyNum = "";																																							
						$("#searchArr .sin").remove();																																				
						self.isSingle = false;																																						
						$(".babyGroup .ic").remove();																																				
						$(toggle).removeClass("border");																																		
					}																																												
				}else if(who == "multiple"){																																						
					if(self.multiple == false){																																						
						self.babyNum = 2;																																							
						$("#searchArr .sin").remove();																																				
						$("#searchArr").append("<span class='add sin rem'>单款多件<i class='dele' id='babyGroup' onclick='closeNow(\"babyGroup\")'></i></span>");									
						self.multiple = true;																																						
						self.isSingle = false;																																						
						self.variety = false;																																						
					}else if(self.multiple == true){																																				
						self.babyNum = "";																																							
						$("#searchArr .sin").remove();																																				
						self.multiple = false;																																						
						$(".babyGroup .ic").remove();																																				
						$(toggle).removeClass("border");																																	
					}																																												
				}else if(who == "variety"){																																							
					if(self.variety == false){																																						
						self.babyNum = 3;																																							
						$("#searchArr .sin").remove();																																				
						$("#searchArr").append("<span class='add sin rem'>多款多件<i class='dele' id='babyGroup' onclick='closeNow(\"babyGroup\")'></i></span>");									
						self.variety = true;																																						
						self.isSingle = false;																																						
						self.multiple = false;																																						
					}else if(self.variety == true){																																					
						self.babyNum = "";																																							
						$("#searchArr .sin").remove();																																				
						self.variety = false;																																						
						$(".babyGroup .ic").remove();																																				
						$(toggle).removeClass("border");																																	
					}																																												
				}																																													
			}																																														
			//=====================================================================================宝贝数量组选择标签接结束======================================================================================
			
			//========================================================================================配货状态组选择标签=========================================================================================
			//																																														=============
			//		此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.singleStatus 查询时直接拿此变量值即可																				=============
			//		此组无全部按钮，所以第二次点击相同标签，需取消选中状态，同时 self.singleStatus 恢复为默认值，所以要多做一层判断																	=============
			//      判断方法：通过在 data 内给定每个标签一个对应的变量 记录此时是否为选中状态																										=============
			//					self.equipped   --------  未配   标签是否选中																														=============
			//					self.picking    --------  配货中 标签是否选中																														=============
			//					self.stock   	--------  缺货   标签是否选中																														=============
			//					self.allocated  --------  已配   标签是否选中																														=============
			//																																														=============
			//===================================================================================================================================================================================================
			else if(group == "statusGroup"){																																						
				$(".statusGroup div").each(function(){																																				
					$(".statusGroup .ic").remove();																																					
					$(this).removeClass("border");																																			
				});																																												
				$(toggle).append("<i class='ic'></i>");																															
				$(toggle).addClass("border");																																				
				if(who == "equipped"){																																								
					if(self.equipped == false){																																						
						self.singleStatus = 0;																																						
						$("#searchArr .equip").remove();																																			
						$("#searchArr").append("<span class='add equip rem'>未配<i class='dele' id='statusGroup' onclick='closeNow(\"statusGroup\")'></i></span>");									
						self.equipped = true;																																						
						self.picking = false;																																						
						self.stock = false;																																							
						self.allocated = false;																																						
					}else if(self.equipped == true){																																				
						self.singleStatus = "";																																						
						$("#searchArr .equip").remove();																																			
						self.equipped = false;																																						
						$(".statusGroup .ic").remove();																																				
						$(toggle).removeClass("border");																																		
					}																																												
				}else if(who == "picking"){																																							
					if(self.picking == false){																																						
						self.singleStatus = 1;																																						
						$("#searchArr .equip").remove();																																			
						$("#searchArr").append("<span class='add equip rem'>配货中<i class='dele' id='statusGroup' onclick='closeNow(\"statusGroup\")'></i></span>");								
						self.picking = true;																																						
						self.equipped = false;																																						
						self.allocated = false;																																						
						self.stock = false;																																							
					}else if(self.picking == true){																																					
						self.singleStatus = "";																																						
						$("#searchArr .equip").remove();																																			
						self.picking = false;																																						
						$(".statusGroup .ic").remove();																																				
						$(toggle).removeClass("border");																																	
					}																																												
				}else if(who == "stock"){																																							
					if(self.stock == false){																																						
						self.singleStatus = 2;																																						
						$("#searchArr .equip").remove();																																			
						$("#searchArr").append("<span class='add equip rem'>缺货<i class='dele' id='statusGroup' onclick='closeNow(\"statusGroup\")'></i></span>");									
						self.stock = true;																																							
						self.picking = false;																																						
						self.equipped = false;																																						
						self.allocated = false;																																						
					}else if(self.stock == true){																																					
						self.singleStatus = "";																																						
						$("#searchArr .equip").remove();																																			
						self.stock = false;																																							
						$(".statusGroup .ic").remove();																																				
						$(toggle).removeClass("border");																																	
					}																																												
				}else if(who == "allocated"){																																						
					if(self.allocated == false){																																					
						self.singleStatus = 3;																																						
						$("#searchArr .equip").remove();																																			
						$("#searchArr").append("<span class='add equip rem'>已配<i class='dele' id='statusGroup' onclick='closeNow(\"statusGroup\")'></i></span>");									
						self.allocated = true;																																						
						self.picking = false;																																						
						self.stock = false;																																							
						self.equipped = false;																																						
					}else if(self.allocated == true){																																				
						self.singleStatus = "";																																						
						$("#searchArr .equip").remove();																																			
						self.allocated = false;																																						
						$(".statusGroup .ic").remove();																																				
						$(toggle).removeClass("border");																																		
					}																																												
				}																																													
																																																	
			}																																														
			//======================================================================================配货状态组选择标签结束=======================================================================================
			
			//===========================================================================================旗帜组选择标签==========================================================================================
			//																																														=============
			//		此模块为多选标签，可同时选中多个，并且第二次点击后需要取消选中，每个旗帜在 data 内都有对应是否选中状态记录值																	=============
			//		点击全部则取消所有此组内选中的标签																																				=============
			//      判断方法：通过在 data 内给定每个标签一个对应的变量 记录此时是否为选中状态																										=============
			//					状态值在 data 内有注释标明																																			=============
			//																																														=============
			//===================================================================================================================================================================================================
			else if(group == "bannerArr"){																																							
				$(toggle).append("<i class='ic'></i>");																															
				$(toggle).addClass("border");																																				
				$(".bannerArr .all .ic").remove();																																					
				$(".bannerArr .all").removeClass("border");																																	
				if(who == "hui"){																																									
					if(self.hui == false){																																							
						$("#searchArr .ban").append("<span class='bannerA hui rem' style='background-image:url(\"images/hui.png\");background-size:100% 100%;'></span>");							
						self.hui = true;																																							
					}else if(self.hui == true){																																						
						$("#searchArr .ban .hui").remove();																																			
						self.hui = false;																																							
						$(toggle).removeClass("border");																																	
						$(".bannerArr .banner_1 .ic").remove();																																		
					}																																												
				}else if(who == "red"){																																								
					if(self.red == false){																																							
						$("#searchArr .ban").append("<span class='bannerA red rem' style='background-image:url(\"images/red.png\");background-size:100% 100%;'></span>");							
						self.red = true;																																							
					}else if(self.red == true){																																						
						$("#searchArr .ban .red").remove();																																			
						self.red = false;																																							
						$(toggle).removeClass("border");																																		
						$(".bannerArr .banner_2 .ic").remove();																																		
					}																																												
				}else if(who == "yellow"){																																							
					if(self.yellow == false){																																						
						$("#searchArr .ban").append("<span class='bannerA yellow rem' style='background-image:url(\"images/yellow.png\");background-size:100% 100%;'></span>");						
						self.yellow = true;																																							
					}else if(self.yellow == true){																																					
						$("#searchArr .ban .yellow").remove();																																		
						self.yellow = false;																																						
						$(toggle).removeClass("border");																																	
						$(".bannerArr .banner_3 .ic").remove();																																		
					}																																												
				}else if(who == "green"){																																							
					if(self.green == false){																																						
						$("#searchArr .ban").append("<span class='bannerA green rem' style='background-image:url(\"images/green.png\");background-size:100% 100%;'></span>");						
						self.green = true;																																							
					}else if(self.green == true){																																					
						$("#searchArr .ban .green").remove();																																		
						self.green = false;																																							
						$(toggle).removeClass("border");																																	
						$(".bannerArr .banner_4 .ic").remove();																																		
					}																																												
				}else if(who == "blue"){																																							
					if(self.blue == false){																																							
						$("#searchArr .ban").append("<span class='bannerA blue rem' style='background-image:url(\"images/blue.png\");background-size:100% 100%;'></span>");							
						self.blue = true;																																							
					}else if(self.blue == true){																																					
						$("#searchArr .ban .blue").remove();																																		
						self.blue = false;																																							
						$(toggle).removeClass("border");																																
						$(".bannerArr .banner_5 .ic").remove();																																		
					}																																												
				}else if(who == "pink"){																																							
					if(self.pink == false){																																							
						$("#searchArr .ban").append("<span class='bannerA pink rem' style='background-image:url(\"images/fen.png\");background-size:100% 100%;'></span>");							
						self.pink = true;																																							
					}else if(self.pink == true){																																					
						$("#searchArr .ban .pink").remove();																																		
						self.pink = false;																																							
						$(toggle).removeClass("border");							
						$(".bannerArr .banner_6 .ic").remove();																																		
					}																																												
				}else if(who == "all"){																																								
					$("#searchArr .ban span").remove();																																				
																																																	
					$(".bannerArr div").each(function(){																																			
						$(".bannerArr .ic").remove();																																				
						$(this).removeClass("border");																																		
					});																																												
																																																	
					$(toggle).append("<i class='ic'></i>");																														
					$(toggle).addClass("border");																																			
																																																	
					self.hui = false;																																								
					self.red = false;																																								
					self.green = false;																																								
					self.yellow = false;																																							
					self.blue = false;																																								
					self.pink = false;																																								
				}																																													
																																																	
			}																																														
		//===========================================================================================旗帜组选择标签结束==========================================================================================	
		
		//===========================================================================================特殊订单组选择标签==========================================================================================	
		//																																															=============
		//		此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.special 查询时直接拿此变量值即可																						=============
		//		此组无全部按钮，所以第二次点击相同标签，需取消选中状态，同时 self.special 恢复为默认值，所以要多做一层判断																			=============
		//      判断方法：通过在 data 内给定每个标签一个对应的变量 记录此时是否为选中状态																											=============
		//					self.refunds   --------  申请退款   标签是否选中																														=============
		//					self.ship      --------  拆包发货   标签是否选中																														=============
		//					self.merge     --------  合并发货   标签是否选中																														=============
		//		特殊订单组 选择时 其余条件全部重置																																					=============
		//																																															=============
		//=======================================================================================================================================================================================================
			else if(group == "specialGroup"){																																						//===========
																																																	//===========
				//-------------------------------------重置------------------------------------------																								//===========
				resetF(self,'special');																																								//===========
				//-----------------------------------重置结束----------------------------------------																								//===========
																																																	//===========
				$(".specialGroup div").each(function(){																																				//===========
					$(".specialGroup .ic").remove();																																				//===========
					$(this).removeClass("border");																																			//===========
				});																																													//===========
				$(toggle).append("<i class='ic'><i class='ri'></i></i>");																															//===========
				$(toggle).addClass("border");																																				//===========
																																																	//===========
				if(who == "refunds"){																																								//===========
					if(self.refunds == false){																																						//===========
						self.special = "tuikuan";																																					//===========
						$("#searchArr .refu").remove();																																				//===========
						$("#searchArr").append("<span class='add refu rem'>申请退款<i class='dele' id='specialGroup' onclick='closeNow(\"specialGroup\")'></i></span>");							//===========
						self.refunds = true;																																						//===========
						self.ship = false;																																							//===========
						self.merge = false;																																							//===========
					}else if(self.refunds == true){																																					//===========
						self.refunds = false;																																						//===========
						self.special = "";																																							//===========
						$("#searchArr .refu").remove();																																				//===========
						$(".specialGroup .ic").remove();																																			//===========
						$(toggle).removeClass("border");																																		//===========
					}																																												//===========
				}else if(who == "split"){																																							//===========
					if(self.ship == false){																																							//===========
						self.special = "chaibao";																																					//===========
						$("#searchArr .refu").remove();																																				//===========
						$("#searchArr").append("<span class='add refu rem'>拆包发货<i class='dele' id='specialGroup' onclick='closeNow(\"specialGroup\")'></i></span>");							//===========
						self.ship = true;																																							//===========
						self.refunds = false;																																						//===========
						self.merge = false;																																							//===========
					}else if(self.ship == true){																																					//===========
						self.ship = false;																																							//===========
						self.special = "";																																							//===========
						$("#searchArr .refu").remove();																																				//===========
						$(".specialGroup .ic").remove();																																			//===========
						$(toggle).removeClass("border");																																		//===========
					}																																												//===========
				}else if(who == "merge"){																																							//===========
					if(self.merge == false){																																						//===========
						self.special = "hebing";																																					//===========
						$("#searchArr .refu").remove();																																				//===========
						$("#searchArr").append("<span class='add refu rem'>合并发货<i class='dele' id='specialGroup' onclick='closeNow(\"specialGroup\")'></i></span>");							//===========
						self.merge = true;																																							//===========
						self.refunds = false;																																						//===========
						self.ship = false;																																							//===========
					}else if(self.merge == true){																																					//===========
						self.merge = false;																																							//===========
						self.special = "";																																							//===========
						$("#searchArr .refu").remove();																																				//===========
						$(".specialGroup .ic").remove();																																			//===========
						$(toggle).removeClass("border");																																		//===========
					}																																												//===========
				}																																													//===========
			}																																														//===========																																								
			searchALLNow(self,'F');																																										
		},																																															//===========
		//================================================================================================特殊订单组选择标签结束=================================================================================
		
		//====================================================================================================重置按钮===========================================================================================
		resetNow:function(){																																										//===========
			var self = this;																																										//===========
			resetF(self,'F');																																										//===========
		},																																															//===========
		//====================================================================================================重置结束===========================================================================================
		
		//================刷新统计开始
		refreshTotal:function(){
			var self = this;
			$.ajax({																																														
				url: "/index.php?m=system&c=approval&a=refreshTotal",																																		
				type: 'post',																																												
				data: {},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data){
						self.numdataArr = data;
					}
				}																																															
			});
		},
		//================刷新统计结束
		//====================================================================================================查询方法===========================================================================================
		searchALL:function(){																																										//===========
			var self = this;																																										//===========
			searchALLNow(self,'F');																																									//===========
		},																																															//===========
		//==================================================================================================查询方法结束=========================================================================================
		
		//===========================================================================================选择省份弹窗================================================================================================
		choosePlace:function(){																																										//===========
			var self = this;
			$("input:checkbox").iCheck('uncheck');																																					//===========
			self.contain = "y";																																										//===========
			self.index = "F";
																																																	//===========
			$(".contain").css({							//------------------------------																											//===========
				zIndex:10,								//																																			//===========
				borderColor:"#1E9FFF",					//	每次打开默认选中包含条件按钮																											//===========
				color:"#1E9FFF"							//																																			//===========
			});											//------------------------------																											//===========
																																																	//===========
			$(".exclude").css({							//------------------------------																											//===========
				zIndex:0,								//																																			//===========
				borderColor:"#dddddd",					//	每次打开默认不选中排除按钮																												//===========
				color:"black"							//																																			//===========
			});											//------------------------------																											//===========
																																																	//===========
			$(".placeInput").val("");					//-----每次打开将弹窗内input初始化																											//===========
																																																	//===========
			$(".searchBtn").css("display","inline");	//-----显示直接搜索按钮																														//===========
																																																	//===========
			layer.open({																																											//===========
				type: 1,																																											//===========
				title: '设置地区筛选条件',																																							//===========
				skin: 'layui-layer-rim', //加上边框																																					//===========
				area: ['734px', '522px'], //宽高																																					//===========
				shade: 0.3,																																											//===========
				content: $("#edit-pages"),																																							//===========
				cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																																													//===========
			});																																														//===========
			$(".placeHide").css("display","none");																																					//===========
		},																																															//===========
		//==========================================================================================选择省份弹窗结束=============================================================================================
		
		//=========================================================================================省份选择包含按钮 或 排除按钮 点击事件=========================================================================
		//																																															=============
		//		包含按钮 与 排除按钮 切换时 在 data 内用 self.contain 记录此时的状态（"T" 为包含，"F" 为排除）																						=============																						
		//																																															=============
		//=======================================================================================================================================================================================================
		isContain:function(a){																																										//===========
			var self = this;																																										//===========
			if(a == "y"){																																											//===========
				self.contain = "y";																																									//===========
			//--------------切换选中效果---------------------																																		//===========
				$(".contain").css({					//-------																																		//===========
					zIndex:10,						//-------																																		//===========
					borderColor:"#1E9FFF",			//-------																																		//===========
					color:"#1E9FFF"					//-------																																		//===========
				});									//-------																																		//===========
													//-------																																		//===========
				$(".exclude").css({					//-------																																		//===========
					zIndex:0,						//-------																																		//===========
					borderColor:"#dddddd",			//-------																																		//===========
					color:"black"					//-------																																		//===========
				});									//-------																																		//===========
			//-----------------------------------------------																																		//===========
				$(".searchText").html("<span>地区关键字：</span> <span><input type='text' class='placeInput' placeholder='输入地区关键词，如辽宁，吉林，多个关键词请用逗号隔开'></span>");			//===========
			}else if(a == "n"){																																										//===========
				self.contain = "n";																																									//===========
			//--------------切换选中效果---------------------																																		//===========
				$(".contain").css({					//-------																																		//===========
					zIndex:0,						//-------																																		//===========
					borderColor:"#dddddd",			//-------																																		//===========
					color:"black"					//-------																																		//===========
				});									//-------																																		//===========
													//-------																																		//===========
				$(".exclude").css({					//-------																																		//===========
					zIndex:10,						//-------																																		//===========
					borderColor:"#1E9FFF",			//-------																																		//===========
					color:"#1E9FFF"					//-------																																		//===========
				});									//-------																																		//===========
			//-----------------------------------------------																																		//===========
				$(".searchText").html("<span>地区关键字：</span> <span><input type='text' class='placeInput' placeholder='将排除所有地址中包含该关键词的订单，多个关键词逗号隔开'></span>");		//===========
			}																																														//===========
		},																																															//===========
		//======================================================================================省份选择是否包含按钮点击事件结束=================================================================================
		
		//=================================================================================保存筛选条件按钮点击事件==============================================================================================
		//																																															//===========
		//		保存成功后将数组以 JSON 形式存入localStrorage																																		//===========
		//																																															//===========
		//=======================================================================================================================================================================================================
		saveCon:function(){																																											//===========
			var self = this;																																										//===========
			var data = "";																																											//===========
																																																	//===========
			if($("input[name='places']").filter(':checked').length == 0 && $(".placeInput").val() == ""){																							//===========
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																												//===========
				return false;																																										//===========
			}																																														//===========
																																																	//===========
			$("input[name='places']:checkbox").each(function(){																																		//===========
				if(true == $(this).is(':checked')){																																					//===========
					data += ($(this).val()+",");																																					//===========
				}																																													//===========
			});																																														//===========
																																																	//===========
			data = data.substr(0,data.length-1);																																					//===========
																																																	//===========
			if($(".placeInput").val() != "" && data != ""){							//------------------------------																				//===========
				data += ("," + $(".placeInput").val());								//																												//===========
			}else if($(".placeInput").val() != "" && data == ""){					//	与input框内输入的值进行拼接																					//===========
				data = $(".placeInput").val();										//																												//===========
			}																		//------------------------------																				//===========
																																																	//===========
																																																	//===========
			if(self.index == "F"){																																									//===========
																																																	//===========
				if(self.contain == "y"){																																							//===========
					self.provinceArr.push(data);																																					//===========
																																																	//===========
				}else if(self.contain == "n"){																																						//===========
					self.provinceArr.push("<span style='color:red' class='others'>排除：</span>" + data);																							//===========
				}																																													//===========
			}else{																																													//===========
				if(self.contain == "y"){																																							//===========
					self.provinceArr[self.index * 1] = data;																																		//===========
				}else if(self.contain == "n"){																																						//===========
					self.provinceArr[self.index * 1] = ("<span style='color:red' class='others'>排除：</span>" + data);																				//===========
				}																																													//===========
			}																																														//===========
			localStorage.setItem("placeArr",JSON.stringify(self.provinceArr));																														//===========
			self.index = "F";																																										//===========
			self.provinceArr = JSON.parse(localStorage.getItem("placeArr"));																														//===========	
			layer.closeAll();																																										//===========
		},																																															//===========
		//=======================================================================================保存筛选条件按钮点击事件结束====================================================================================
		
		//=============================================================================================删除省份模板按钮==========================================================================================
		deletePlace:function(index){																																								//===========
			event.stopPropagation();																																								//===========
			var self = this;																																										//===========
			layer.open({																																											//===========
				title: '提示',																																										//===========
				content: '确定删除此数据么？',																																						//===========
				btn: ['确定', '取消'],																																								//===========
				yes:function(){																																										//===========
					self.provinceArr.splice(index,1);																																				//===========
					localStorage.setItem("placeArr",JSON.stringify(self.provinceArr));																												//===========
					layer.closeAll();																																								//===========
				}																																													//===========
			}); 																																													//===========
		},																																															//===========
		//===========================================================================================删除省份模板按钮结束========================================================================================
		
		//==============================================================================================省份模板编辑按钮=========================================================================================
		//																																															//===========
		//		index  ----- 数组内对应的下脚值  item  -----  文本内容																																//===========
		//		self.contain 记录此时是排除 还是 包含按钮																																			//===========
		//																																															//===========
		//=======================================================================================================================================================================================================
		edit:function(index,item){																																									//===========
			event.stopPropagation();																																								//===========
			var self = this;																																										//===========
																																																	//===========
			self.index = index;																																										//===========
																																																	//===========
			$(".searchBtn").css("display","none");									//-----隐藏直接搜索按钮																							//===========
																																																	//===========
			$("input:checkbox").iCheck('uncheck');									//-----先初始化所有复选框																						//===========
			layer.open({																																											//===========
				type: 1,																																											//===========
				title: '设置地区筛选条件',																																							//===========
				skin: 'layui-layer-rim', //加上边框																																					//===========
				area: ['734px', '522px'], //宽高																																					//===========
				shade: 0.3,																																											//===========
				content: $("#edit-pages"),																																							//===========
				cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																																													//===========
			});																																														//===========
																																																	//===========
			if(item.substring(0,49) != "<span style='color:red' class='others'>排除：</span>"){			//-----不为排除省份时																		//===========
				self.contain = "y";																																									//===========
																																																//===========
				$(".contain").css({																																									//===========
					zIndex:10,																																										//===========
					borderColor:"#1E9FFF",																																							//===========
					color:"#1E9FFF"																																									//===========
				});																																													//===========
																																																	//===========
				$(".exclude").css({																																									//===========
					zIndex:0,																																										//===========
					borderColor:"#dddddd",																																							//===========
					color:"black"																																									//===========
				});																																													//===========
																																																	//===========
				var arr = item.split(",");																																							//===========
																																																	//===========
				for(var i = 0; i < arr.length; i++){																																				//===========
					$("input[value='" + arr[i] + "']").iCheck('check');																																//===========
				}																																													//===========
			}else if(item.substring(0,49) == "<span style='color:red' class='others'>排除：</span>"){																								//===========
				self.contain = "n";																																									//===========
																																																	//===========
				$(".contain").css({																																									//===========
					zIndex:0,																																										//===========
					borderColor:"#dddddd",																																							//===========
					color:"black"																																									//===========
				});																																													//===========
																																																	//===========
				$(".exclude").css({																																									//===========
					zIndex:10,																																										//===========
					borderColor:"#1E9FFF",																																							//===========
					color:"#1E9FFF"																																									//===========
				});																																													//===========
																																																	//===========
				var newStr = item.substring(49);																																					//===========
				var arr = newStr.split(",");																																						//===========
																																																	//===========
				for(var i = 0; i < arr.length; i++){																																				//===========
					$("input[value='" + arr[i] + "']").iCheck('check');																																//===========
				}																																													//===========
																																																	//===========
			}																																														//===========
		},																																															//===========
		//============================================================================================省份模板编辑按钮结束=======================================================================================
		
		//===============================================================================================选择省份模板事件========================================================================================
		chooseProvince:function(isAll){																																								//===========
			var self = this;																																										//===========
			var toggle = event.currentTarget;																																						//===========
			event.stopPropagation();																																								//===========
			var newStr = $(toggle).text();																																							//===========
			if(isAll == "some"){													//-----点击保存的省份模板按钮																					//===========
				var str = newStr.substring(0,newStr.length-2);																																		//===========
																																																	//===========
				if(str.substring(0,2) == "排除"){									//------------------------------																				//===========
					self.provinceStatus = "F";										//																												//===========
					self.province = str.substring(3);								//																												//===========
				}else{																//	判断是排除省份还是包含省份																					//===========
					self.provinceStatus = "T";										//																												//===========
					self.province = str;											//																												//===========
				}																	//------------------------------																				//===========
																																																	//===========
				$(".placeBtn").css({												//------------------------------																				//===========
					color:"black",													//																												//===========
					borderColor:"#dddddd",											//	改变所有省份按钮样式																						//===========
					backgroundColor:"white"											//																												//===========
				});																	//------------------------------																				//===========
																																																	//===========
				$(".placeAdd").each(function(){										//------------------------------																				//===========
					$(this).css({													//																												//===========
						color:"black",												//																												//===========
						borderColor:"#dddddd",										//																												//===========
						backgroundColor:"white"										//																												//===========
					});																//	初始化按钮样式																								//===========
					$(this).find(".positionSpan").css({								//																												//===========
						backgroundColor:"white"										//																												//===========
					});																//																												//===========
					$(this).find(".layui-icon").css("color","#1E9FFF");				//																												//===========
					$(this).find(".others").css("color","red");						//																												//===========
				});																	//------------------------------																				//===========
																																																	//===========
				$(toggle).css({														//------------------------------																				//===========
					color:"white",													//																												//===========
					borderColor:"#1E9FFF",											//	将当前选择的省份按钮变为高亮																				//===========
					backgroundColor:"#1E9FFF"										//																												//===========
				});																	//------------------------------																				//===========
																																																	//===========
				$(toggle).find(".positionSpan").css({																																				//===========
					backgroundColor:"#1E9FFF",																																						//===========
				});																																													//===========
																																																	//===========
				$(toggle).find(".layui-icon").css("color","white");																																	//===========
																																																	//===========
				$(toggle).find(".others").css("color","white");																																		//===========
																																																	//===========
				$(".changeProvince").html(str);																																						//===========
																																																	//===========
				$("#searchArr .pro").remove();																																						//===========
																																																	//===========
				$("#searchArr").append("<span class='add pro rem'><span class='maxw'>" + str + "</span><i class='dele' id='specialGroup' onclick='closeNow(\"province\")'></i></span>");			//===========
																																																	//===========
			}else if(isAll == "all"){																																								//===========
				self.province = "";													//-----点击所有省份按钮																							//===========
																																																	//===========
				$(".placeAdd").each(function(){										//------------------------------																				//===========
					$(this).css({													//																												//===========
						color:"black",												//																												//===========
						borderColor:"#dddddd",										//																												//===========
						backgroundColor:"white"										//																												//===========
					});																//	初始化按钮样式																								//===========
					$(this).find(".positionSpan").css({								//																												//===========
						backgroundColor:"white"										//																												//===========
					});																//																												//===========
					$(this).find(".layui-icon").css("color","#1E9FFF");				//																												//===========
					$(this).find(".others").css("color","red");						//																												//===========
				});																	//------------------------------																				//===========
																																																	//===========
				$(".placeBtn").css({												//------------------------------																				//===========
					color:"white",													//																												//===========
					borderColor:"#1E9FFF",											//	将所有省份按钮变为高亮																						//===========
					backgroundColor:"#1E9FFF"										//																												//===========
				});																	//------------------------------																				//===========
																																																	//===========
				$(".changeProvince").html("所有省份");																																				//===========
				$("#searchArr .pro").remove();																																						//===========
			}																																														//===========
			$(".placeHide").css("display","none");																																					//===========
			searchALLNow(self,'F');																																									//===========
		},																																															//===========
		//=========================================================================================省份模板选择结束==============================================================================================
		
		searchPlaceNow:function(){
			var self = this;
			var data = "";
			if($("input[name='places']").filter(':checked').length == 0 && $(".placeInput").val() == ""){																							//===========
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																												//===========
				return false;																																										//===========
			}																																														//===========
																																																	//===========
			$("input[name='places']:checkbox").each(function(){																																		//===========
				if(true == $(this).is(':checked')){																																					//===========
					data += ($(this).val()+",");																																					//===========
				}																																													//===========
			});																																														//===========
																																																	//===========
			data = data.substr(0,data.length-1);																																					//===========
																																																	//===========
			if($(".placeInput").val() != "" && data != ""){							//------------------------------																				//===========
				data += ("," + $(".placeInput").val());								//																												//===========
			}else if($(".placeInput").val() != "" && data == ""){					//	与input框内输入的值进行拼接																					//===========
				data = $(".placeInput").val();										//																												//===========
			}																		//------------------------------																				//===========
			
			self.province = data;
			
			if(self.contain == "y"){
				self.provinceStatus = "T";
				$("#searchArr .pro").remove();
				$("#searchArr").append("<span class='add pro rem'><span class='maxw'>" + data + "</span><i class='dele' id='specialGroup' onclick='closeNow(\"province\")'></i></span>");
			}else if(self.contain == "n"){
				self.provinceStatus = "F";
				$("#searchArr .pro").remove();
				$("#searchArr").append("<span class='add pro rem'><span class='maxw'><span style='color:red;'>排除：</span>" + data + "</span><i class='dele' id='specialGroup' onclick='closeNow(\"province\")'></i></span>");
			}
			
			
			searchALLNow(self,'F');
			
			self.contain == "y";
			self.provinceStatus = "T";
			layer.closeAll();
			
		},
		
		//============================================================================================排序选择按钮===============================================================================================
		//																																															=============
		//		点击排序按钮 将 self.order 改变，用来记录此刻根据什么要求排序																														=============
		//		因为每次点击需要切换状态以及箭头方向（正序或者倒序），所以每个按钮都在 data 内有唯一对应的变量记录此时的状态																		=============
		//		并且每次点击一个按钮时，其他按钮对应的状态值都要做初始化（false）																													=============
		//				self.coding         -----         商家编码排序按钮 对应状态值  （true，false）																								=============
		//				self.orderAmount    -----  		  订单金额排序按钮 对应状态值  （true，false）																								=============
		//				self.babyNum        -----		  宝贝数量排序按钮 对应状态值  （true，false）																								=============
		//				下拉选项按钮不需要记录此刻的状态，只需要将上述三个按钮状态值初始化为 false 即可，然后改变 self.order 值即可																	=============
		//																																															=============
		//=======================================================================================================================================================================================================
		orderBy:function(type){																																										//===========
			var toggle = event.currentTarget;						//-----获取点击元素本身																											//===========
			var self = this;																																										//===========
																																																	//===========
			$(".orderByDiv").removeClass("must");					//------------------------------------------------------------------															//===========
			$(".orderByDiv").css("zIndex",0);						//							初始化																								//===========
			$(".orderD .orderImg").remove();						//	每次点击排序按钮时都将样式恢复原始状态 再根据下面判断做样式修改																//===========
			$(".orderD").find(".orderText").css("top","0");			//------------------------------------------------------------------															//===========
																																																	//===========
			if(type == "coding"){									//-----商家编码排序按钮																											//===========
				self.orderAmount = false;																																							//===========
				self.babyNum = false;																																								//===========
																																																	//===========
				$(toggle).find(".orderText").css("top","-7px");		//--------------																												//===========
				$(toggle).addClass("must");							//	做样式修改																													//===========
				$(toggle).css("zIndex",10);							//--------------																												//===========
				if(self.coding == true){																																							//===========
					self.order = "codingUp";																																						//===========
					$(toggle).append("<span class='orderImg' style='background-image:url(\"images/toUp.png\");background-size:100% 100%;'></span>");												//===========
					self.coding = false;																																							//===========
				}else if(self.coding == false){																																						//===========
					self.order = "codingDown";																																						//===========
					$(toggle).append("<span class='orderImg' style='background-image:url(\"images/toDown.png\");background-size:100% 100%;'></span>");												//===========
					self.coding = true;																																								//===========
				}																																													//===========
			}else if(type == "orderAmount"){						//-----订单金额排序按钮																											//===========
				self.babyNum = false;																																								//===========
				self.coding = false;																																								//===========
																																																	//===========
				$(toggle).find(".orderText").css("top","-7px");		//--------------																												//===========
				$(toggle).addClass("must");							//	做样式修改																													//===========
				$(toggle).css("zIndex",10);							//--------------																												//===========
				if(self.orderAmount == false){																																						//===========
					self.order = "orderAmountDown";																																					//===========
					$(toggle).append("<span class='orderImg' style='background-image:url(\"images/toDown.png\");background-size:100% 100%;'></span>");												//===========
					self.orderAmount = true;																																						//===========
				}else if(self.orderAmount == true){																																					//===========
					self.order = "orderAmountUp";																																					//===========
					$(toggle).append("<span class='orderImg' style='background-image:url(\"images/toUp.png\");background-size:100% 100%;'></span>");												//===========
					self.orderAmount = false;																																						//===========
				}																																													//===========
			}else if(type == "babyNum"){							//-----宝贝数量排序按钮																											//===========
				self.orderAmount = false;																																							//===========
				self.coding = false;																																								//===========
																																																	//===========
				$(toggle).find(".orderText").css("top","-7px");		//--------------																												//===========
				$(toggle).addClass("must");							//	做样式修改																													//===========
				$(toggle).css("zIndex",10);							//--------------																												//===========
																																																	//===========
				if(self.babyNum == false){																																							//===========
					self.order = "babyNumDown";																																						//===========
					$(toggle).append("<span class='orderImg' style='background-image:url(\"images/toDown.png\");background-size:100% 100%;'></span>");												//===========
					self.babyNum = true;																																							//===========
				}else if(self.babyNum == true){																																						//===========
					self.order = "babyNumUp";																																						//===========
					$(toggle).append("<span class='orderImg' style='background-image:url(\"images/toUp.png\");background-size:100% 100%;'></span>");												//===========
					self.babyNum = false;																																							//===========
				}																																													//===========
			}else if(type == "PaymentDown"){						//-----付款时间从近到远																											//===========
				$(".timePay").css("zIndex",10);																																						//===========
				$(".timePay").addClass("must");																																						//===========
																																																	//===========
				self.order = "PaymentDown";																																							//===========
				self.babyNum = false;																																								//===========
				self.coding = false;																																								//===========
				self.orderAmount = false;																																							//===========
																																																	//===========
				$(".photo").html($(toggle).html());																																					//===========
			}else if(type == "PaymentUp"){							//-----付款时间从远到近																											//===========
				$(".timePay").css("zIndex",10);																																						//===========
				$(".timePay").addClass("must");																																						//===========
																																																	//===========
				self.order = "PaymentUp";																																							//===========
				self.babyNum = false;																																								//===========
				self.coding = false;																																								//===========
				self.orderAmount = false;																																							//===========
																																																	//===========
				$(".photo").html($(toggle).html());																																					//===========
			}else if(type == "timeDown"){							//-----拍下时间从近到远																											//===========
				$(".timePay").css("zIndex",10);																																						//===========
				$(".timePay").addClass("must");																																						//===========
																																																	//===========
				self.order = "timeDown";																																							//===========
				self.babyNum = false;																																								//===========
				self.coding = false;																																								//===========
				self.orderAmount = false;																																							//===========
																																																	//===========
				$(".photo").html($(toggle).html());																																					//===========
			}else if(type == "timeUp"){								//-----拍下时间从远到近																											//===========
				$(".timePay").css("zIndex",10);																																						//===========
				$(".timePay").addClass("must");																																						//===========
																																																	//===========
				self.order = "timeUp";																																								//===========
				self.babyNum = false;																																								//===========
				self.coding = false;																																								//===========
				self.orderAmount = false;																																							//===========
																																																	//===========
				$(".photo").html($(toggle).html());																																					//===========
			}																																														//===========
			$(".orderHide").css("display","none");																																					//===========
																																																	//===========
			searchALLNow(self,'F');																																										//===========
																																																	//===========
		},																																															//===========
		//================================================================================排序选择按钮结束=======================================================================================================
		
		//=================================================================================改旗帜点击事件========================================================================================================
		//																																															=============																													
		//		self.banShow 用来判断目前 改旗帜 按钮的下拉框是否显示  每次点击切换显示隐藏状态																										=============
		//																																															=============
		//=======================================================================================================================================================================================================
		bannerShow:function(){																																										//===========
			var self = this;																																										//===========
			if(self.banShow == false){																																								//===========
				$(".bannerUl").css("display","block");																																				//===========
				self.banShow = true;																																								//===========
			}else if(self.banShow == true){																																							//===========
				$(".bannerUl").css("display","none");																																				//===========
				self.banShow = false;																																								//===========
			}																																														//===========
		},																																															//===========
		//===============================================================================改旗帜点击事件结束======================================================================================================
		//===============================================================================改旗帜开始======================================================================================================
		changebanner:function(seller_flag){																																										//===========
			var self = this;																																										//===========
			$(".bannerUl").css("display","none");
			if($("input[name='order']").filter(':checked').length == 0){																															//===========
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																												//===========
				return false;																																										//===========
			}	
			self.banShow = false;																																														//===========
			
			var data = self.searchData;
			if(self.isAll == 0){//-----如果是当前页	
				var data = "";																						
				$("input[name='order']:checkbox").each(function(){						//--------------------------																				
					if(true == $(this).is(':checked')){									//																											
						data += ($(this).val()+",");									//																											
					}																	//	拼接当前页的货品唯一码																					
				});																		//																							
				data = data.substring(0,data.length-1);									//--------------------------																														
			}
			
			$.ajax({																																														
				url: "/index.php?m=system&c=approval&a=setSellerFlag",																																		
				type: 'post',																																												
				data: {data: data, isAll: self.isAll, seller_flag: seller_flag},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.closeAll();
						layer.msg("操作成功",{
							icon: 1,
							time: 2000
						});
					}else if(data.code == "error"){
						layer.closeAll();
						layer.msg("操作失败",{
							icon: 2,
							time: 2000
						});
					}
					
					searchALLNow(self,'F');
				}																																															
			});	
		},
		versonChange:function(){
			window.location.href = "/index.php?m=system&c=approval&a=approval2";
		},
		orderApproval:function(){
			var self = this;
			if($("input[name='order']").filter(':checked').length == 0){																															//===========
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																												//===========
				return false;																																										//===========
			}
			
			var data = self.searchData;
			if(self.isAll == 0){//-----如果是当前页	
				var data = "";																						
				$("input[name='order']:checkbox").each(function(){						//--------------------------																				
					if(true == $(this).is(':checked')){									//																											
						data += ($(this).val()+",");									//																											
					}																	//	拼接当前页的货品唯一码																					
				});																		//																							
				data = data.substring(0,data.length-1);									//--------------------------																														
			}
			
			$.ajax({																																														
				url: "/index.php?m=system&c=approval&a=orderApproval",																																		
				type: 'post',																																												
				data: {data: data, isAll: self.isAll},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.msg("操作成功",{
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
					
					searchALLNow(self,'F');
				}																																															
			});
		},
		//===============================================================================改旗帜结束======================================================================================================
		//====================================================================================修改按钮 弹窗======================================================================================================
		modify:function(order_index){
			var self = this;		
			var data = self.gridArr[order_index];
			var tid = data.new_tid;
			layer.open({																																											
				type: 1,																																											
				title: '修改收货地址',																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['800px', '580px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#edit-pages1"),																																							
				cancel: function (index, layero) {																																					
																																																	
				}																																													
			});
			
			$("#pages1-express").attr('disabled',false);
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=getOrderInfo",																																		
				type: 'post',																																												
				data: {tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					//if(data.send_status != 'WAIT_ASSIGN'){
						//$("#pages1-express").attr('disabled',true);
					//}
					
					$("#pages1-tid").val(tid);
					$("#pages1-modified").val(data.modified_time);
					$("#pages1-index").val(order_index);
					$("#pages1-express").val(data.express_type);
					$("#pages1-receiver_state").val(data.receiver_state);
					$("#pages1-receiver_state").trigger("change");
					$("#pages1-receiver_city").val(data.receiver_city);
					$("#pages1-receiver_city").trigger("change");
					$("#pages1-receiver_district").val(data.receiver_district);
					if($("#pages1-receiver_district").val() == null){
						$("#pages1-receiver_district").append('<option value="' + data.receiver_district + '" name="' + data.receiver_district + '" data-code="999999">' + data.receiver_district + '</option>');
						$("#pages1-receiver_district").val(data.receiver_district);
					}
					
					$("#pages1-receiver_address").val(data.receiver_address);
					$("#pages1-receiver_name").val(data.receiver_name);
					$("#pages1-mobile").val(data.receiver_mobile);
					$("#pages1-telephone").val(data.receiver_telephone);
					$("#pages1-seller_memo").val(data.seller_memo);
					$("#pages1-remark").val(data.remark);
				}																																															
			});
			
			/**********修改框赋值**********/
			/**********修改框赋值**********/
		},
		//=================================================================================修改按钮 弹窗 结束====================================================================================================
		
		//=================================================================================修改按钮 保存 开始======================================================================================================
		saveBaseInfo:function(){
			var self = this;	
			var tid = $("#pages1-tid").val();
			if(tid != ""){
				var order_index = $("#pages1-index").val();
				var modified_time = $("#pages1-modified").val();
				var express_type = $("#pages1-express").val();
				var receiver_state = $("#pages1-receiver_state").val();
				var receiver_city = $("#pages1-receiver_city").val();
				var receiver_district = $("#pages1-receiver_district").val();
				var receiver_address = $("#pages1-receiver_address").val();
				var receiver_name = $("#pages1-receiver_name").val();
				var receiver_mobile =  $("#pages1-mobile").val();
				var receiver_telephone =  $("#pages1-telephone").val();
				var seller_memo = $("#pages1-seller_memo").val();
				var remark = $("#pages1-remark").val();
				
				if(receiver_state == ""){
					layer.msg('请选择省',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				
				if(receiver_city == ""){
					layer.msg('请选择市',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				
				if(receiver_address == ""){
					layer.msg('街道地址不能为空',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				
				if(receiver_name == ""){
					layer.msg('请填写收货人信息',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				
				if(receiver_mobile == ""){
					if(receiver_telephone == ""){
						layer.msg('请填写收货人手机或电话',{
						icon: 0,
						time: 2000
						});
						return false;
					}
				}
				
				if(receiver_telephone == ""){
					if(receiver_mobile == ""){
						layer.msg('请填写收货人手机或电话',{
						icon: 0,
						time: 2000
						});
						return false;
					}
				}
				
				
				
				var data = {
					modified_time: modified_time,
					express_type: express_type,
					receiver_state: receiver_state,
					receiver_city: receiver_city,
					receiver_district: receiver_district,
					receiver_address: receiver_address,
					receiver_name: receiver_name,
					receiver_mobile: receiver_mobile,
					receiver_telephone: receiver_telephone,
					seller_memo: seller_memo,
					remark: remark
				};
				
				$.ajax({																																														
					url: "/index.php?m=system&c=approval&a=saveBaseInfo",																																		
					type: 'post',																																												
					data: {data: data, tid: tid},																																													
					dataType: 'json',																																											
					success: function (data) {
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							
							$("#pages1-modified").val(data.modified_time);
							reloadRow(self,order_index);
						}else if(data.code == "error"){
							layer.msg(data.msg,{
								icon: 2,
								time: 2000
							});
						}
					}																																															
				});	
			}else{
				layer.msg('数据异常',{
					icon: 2,
					time: 2000
				});
			}
		},
		//=================================================================================修改按钮 保存 结束====================================================================================================
		
		//======================================================================================弹窗取消按钮=====================================================================================================
		cancel:function(){
			layer.closeAll();
		},
		//====================================================================================弹窗取消按钮结束===================================================================================================
		
		//====================================================================================更多操作 弹窗======================================================================================================
		doMore:function(tid,order_index){
			var self = this;																																										//===========
			$(".more input").iCheck('uncheck');
			$("input[name='order']").iCheck('uncheck');
			$("input[value='" + tid + "']").iCheck('check');
			layer.open({																																											//===========
				type: 1,																																											//===========
				title: '更多操作',																																									//===========
				skin: 'layui-layer-rim', //加上边框																																					//===========
				area: ['988px', '600px'], //宽高																																					//===========
				shade: 0.3,																																											//===========
				content: $("#edit-pages2"),	
				btn: ['锁单','作废','标记有货','添加商品','取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					self.orderLockPage(tid);
					return false;
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					self.orderCancel(tid);
					return false;
					//return false 开启该代码可禁止点击该按钮关闭
				}
				,btn3: function(index, layero){
					//按钮【按钮三】的回调
					self.setStock(tid,order_index);
					return false;
					//return false 开启该代码可禁止点击该按钮关闭
				}
				,btn4: function(index, layero){
					self.addOrderItems(tid,index);
					return false;
				}
				,btn5: function(index, layero){
					
				}
				,cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																																													//===========
			});	
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=getItemsInfo",																																		
				type: 'post',																																												
				data: {tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data){
						self.itemArr = data;
						$(document).ready(function(){
							$('.skin1 input').iCheck({
								checkboxClass: 'icheckbox_minimal',
								radioClass: 'iradio_minimal',
								increaseArea: '20%'
							});
						});
					}
				}																																															
			});
		},
		//=================================================================================更多操作 弹窗 结束====================================================================================================
		
		//==================================================================================修改拿货信息 弹窗====================================================================================================
		modifyMess:function(tid,oid,sku_id,index){
			var self = this;																																										//===========
			self.isShow = false;
			self.isShowM = 0;
			layer.open({																																											//===========
				type: 1,																																											//===========
				title: '修改拿货信息',																																								//===========
				skin: 'layui-layer-rim', //加上边框																																					//===========
				area: ['968px', '400px'], //宽高																																					//===========
				shade: 0.3,																																											//===========
				content: $("#edit-pages3"),																																							//===========
				cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																																													//===========
			});	
			$("#pages3-index").val(index);
			$("#pages3-isProduct").val('');
			execAjax({
                m:'system',
                c:'delivery',
                a:'getItemModifyMess',
                data:{tid: tid, oid: oid, sku_id: sku_id},
                success:function(data){
					if(data){
						self.ItemModify = data;
						setTimeout(function(e){
							$("#pages3-color").val(data.colorValue);
							$("#pages3-size").val(data.sizeValue);
						},100);
					}
                }
            });
			searchALLNow(self,'page');
		},
		saveItemSku:function(){
			var self = this;
			var skuObj = self.ItemModify.skuArray;
			var order_index = $("#pages3-index").val();
			var tid = $("#pages3-tid").val();
			var oid = $("#pages3-oid").val();
			var num = $("#pages3-num").val();
			var sku_id_old = $("#pages3-sku_id").val();
			var color = $("#pages3-color").val();
			var size = $("#pages3-size").val();
			var	properties_id = "";
			var	properties_name = "";
			var sku_outer_id = "";
			var sku_id = "";
			var prd_no = "";
            var title = "";
            var prd_id = "";
            var prd_sku_id = "";
            var isProduct = $("#pages3-isProduct").val();
            
			properties_name = $("#pages3-properties_name").val();
			prd_no = $("#pages3-prd_no").val();
			title = $("#pages3-title").val();
			prd_id = $("#pages3-prd_id").val();
			prd_sku_id = $("#pages3-prd_sku_id").val();
			sku_outer_id = $("#pages3-outer_sku_id").val();
			if(color != "" && color != null){
				properties_id += color;
			}
			if(size != "" && size != null){
				properties_id += ":" + size;
			}
			if(properties_id != ""){
				if(skuObj[properties_id]){
					properties_name = skuObj[properties_id].sku_properties_name;
					sku_id = skuObj[properties_id].sku_id;
				}
				
				sku_outer_id = $("#pages3-outer_sku_id").val();
			}
			
			execAjax({
                m:'system',
                c:'approval',
                a:'saveItemModify',
                data:{tid: tid, oid: oid, sku_id_old: sku_id_old, properties_name: properties_name, sku_outer_id: sku_outer_id, 
                sku_id: sku_id,
                isProduct: isProduct,
                prd_no: prd_no,
                title: title,
                prd_id: prd_id,
                prd_sku_id: prd_sku_id,
				num: num,
                },
                success:function(data){
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						reloadRow(self,order_index);						
					}else if(data.code == "error"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});	
					}
                }
            });
			
		},
		skuChange:function(){
			var self = this;
			var data = self.ItemModify;
			var properties_id = "";
			var outer_sku_id = "";
			var colorValue = $("#pages3-color").val();
			var sizeValue = $("#pages3-size").val();
			var outer_id = data.outer_id;
			
			if(colorValue != "" && colorValue != null){
				properties_id = colorValue;
			}
			if(sizeValue != "" && sizeValue != null){
				properties_id += ":" + sizeValue;
			}
			if(properties_id != ""){
				outer_sku_id = data['skuArray'][properties_id].outer_id;
			}
			if(outer_sku_id == ""){
				outer_sku_id = outer_id;
			}
			
			self.ItemModify.outer_sku_id = outer_sku_id;
		},
		//================================================================================修改拿货信息 弹窗 结束=================================================================================================
		
		//======================================================================================换款按钮=========================================================================================================
		changeMon:function(){																																										//===========
			/*var self = this;																																										//===========
			self.isShow = true;																																										//===========
			self.isShowM++;																																											//===========
			if(self.isShowM >= 2){									//-----第一次点击只显示搜索框，第二次点击才走查询代码																			//===========
				if($(".sectionNumber").val() == ""){
					layer.msg('请输入款号',{
						icon: 2,
						time: 2000
					});
					return false;
				}
			}*/
            layer.open({
                title :'选择商品',
                type: 2,
                shade: false,
                area: ['700px', '560px'],
                maxmin: false,
                content: '?m=widget&c=selectProduct&a=index&type=1&param=PRD1'
            }); 
		},
		changeMon2:function(){
			layer.open({
                title :'选择商品',
                type: 2,
                shade: false,
                area: ['700px', '560px'],
                maxmin: false,
                content: '?m=widget&c=selectProduct&a=index&type=1&param=PRD2'
            }); 
		},
		//=========标记有货============================
		setStock:function(tid,order_index){
			var self = this;		
			if($(".more input[name='order']").filter(':checked').length == 0){																															
				layer.msg('请选择至少一个货品',{
					icon: 0,
					time: 2000
				});																																												
				return false;																																										
			}
			
			var data = "";		
			$(".more input[name='order']:checkbox").each(function(){						//--------------------------																				
				if(true == $(this).is(':checked')){									//																											
					data += ($(this).val()+",");									//																											
				}																	//	拼接当前页的货品唯一码																					
			});																		//																							
			data = data.substring(0,data.length-1);
			
			execAjax({
                m:'system',
                c:'approval',
                a:'setStock',
                data:{data:data,tid:tid},
                success:function(data){
					if(data.code == "ok"){
						layer.msg('标记完成',{
							icon: 1,
							time: 2000
						});
						reloadRow(self,order_index);
						$.ajax({
							url: "/index.php?m=system&c=delivery&a=getItemsInfo",																																		
							type: 'post',																																												
							data: {tid: tid},																																													
							dataType: 'json',																																											
							success: function (data) {
								if(data){
									self.itemArr = data;
									$(document).ready(function(){
										$('.skin1 input').iCheck({
											checkboxClass: 'icheckbox_minimal',
											radioClass: 'iradio_minimal',
											increaseArea: '20%'
										});
									});
								}
							}																																															
						});	
					}else{
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
					}
                }
            });
		},
        addOrderItems:function(tid,index){
			var self = this;
			
			$("#pages11-prd_id").val("");
			$("#pages11-prd_sku_id").val("");
			$("#pages11-prd_no").val("");
			$("#pages11-title").val("");
			$("#pages11-sku_name").val("");
			$("#pages11-num").val("");
			$("#pages11-price").val("");
			$("#pages11-gift").val("");
			//$("#pages11-gift").val("");
			//$("#pages11-gift").attr("checked",false);
			//$("#pages11-gift").removeAttr('checked');

			layer.open({																																											
				type: 1,																																											
				title: '添加商品',																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['500px', '380px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#edit-pages11"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					if($("#pages11-prd_no").val() == ""){
						layer.msg('请先选择一个商品',{
							icon: 0,
							time: 2000
						});
						return false;	
					}
					
					if($("#pages11-num").val() == "" || $("#pages11-num").val() == 0){
						layer.msg('请先填写商品的数量',{
							icon: 0,
							time: 2000
						});
						return false;	
					}
					
					var param = {
						prd_id: $("#pages11-prd_id").val(),
						prd_sku_id: $("#pages11-prd_sku_id").val(),
						prd_no: $("#pages11-prd_no").val(),
						title: $("#pages11-title").val(),
						sku_name: $("#pages11-sku_name").val(),
						num: $("#pages11-num").val(),
						price: $("#pages11-price").val(),
						gift: $("#pages11-gift").is(':checked')
					};
					
					self.orderItemsAdd(index,tid,param);
					return false;
				},
				cancel: function (index, layero) {																																					
					
				}																																													
			});
		},
		delOrderItems:function(new_tid,unique_code){
			var self = this;
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=delOrderItems",																																		
				type: 'post',																																												
				data: {unique_code: unique_code},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.msg('操作成功',{
							icon: 1,
							time: 2000
						});
						
						$.ajax({
							url: "/index.php?m=system&c=delivery&a=getItemsInfo",																																		
							type: 'post',																																												
							data: {tid: new_tid},																																													
							dataType: 'json',																																											
							success: function (data) {
								if(data){
									self.itemArr = data;
									searchALLNow(self,'page');
									$(document).ready(function(){
										$('.skin1 input').iCheck({
											checkboxClass: 'icheckbox_minimal',
											radioClass: 'iradio_minimal',
											increaseArea: '20%'
										});
									});
								}
							}																																															
						});
					}else if(data.code == "error"){
						layer.msg('操作失败'+data.msg,{
							icon: 2,
							time: 2000
						});
					}
				}																																															
			});
		},
		//===========================锁单弹出框结束=============
		orderItemsAdd:function(index,tid,data){
			var self = this;
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=orderItemsAdd",																																		
				type: 'post',																																												
				data: {data: data, tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.msg('操作成功',{
							icon: 1,
							time: 2000
						});
						
						$.ajax({
							url: "/index.php?m=system&c=delivery&a=getItemsInfo",																																		
							type: 'post',																																												
							data: {tid: tid},																																													
							dataType: 'json',																																											
							success: function (data) {
								if(data){
									self.itemArr = data;
									searchALLNow(self,'page');
									$(document).ready(function(){
										$('.skin1 input').iCheck({
											checkboxClass: 'icheckbox_minimal',
											radioClass: 'iradio_minimal',
											increaseArea: '20%'
										});
									});
								}
							}																																															
						});
						layer.close(index);
					}else if(data.code == "error"){
						layer.msg('操作失败'+data.msg,{
							icon: 2,
							time: 2000
						});
					}
				}																																															
			});
		},
		//====================================================================================改快递按钮=========================================================================================================
		changeExpress:function(){
			var self = this;																																										//===========
			$('#batchExpress').val(0);
			if($("input[name='order']").filter(':checked').length == 0){																															//===========
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																												//===========
				return false;																																										//===========
			}		
			//===========
			layer.open({																																											//===========
				type: 1,																																											//===========
				title: '改快递',																																									//===========
				skin: 'layui-layer-rim', //加上边框																																					//===========
				area: ['700px', '300px'], //宽高																																					//===========
				shade: 0.3,																																											//===========
				content: $("#edit-pages5"),																																							//===========
				cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																																													//===========
			});	
		},
		//==================================================================================改快递按钮结束=======================================================================================================
		//====================================================================================改快递方法按钮=========================================================================================================
		batchSaveExpress:function(){
			var self = this;
			
			var batchExpress = $('#batchExpress').val();
			if(batchExpress == "" || batchExpress == "0"){
				layer.msg('请选择快递类型',{
					icon: 2,
					time: 2000
				});
				return false;
			}
			
			
			var data = self.searchData;
			if(self.isAll == 0){														//-----如果是当前页	
				var data = "";																						
				$("input[name='order']:checkbox").each(function(){						//--------------------------																				
					if(true == $(this).is(':checked')){									//																											
						data += ($(this).val()+",");									//																											
					}																	//	拼接当前页的货品唯一码																					
				});																		//																							
				data = data.substring(0,data.length-1);									//--------------------------																														
			}
			
			$.ajax({																																														
				url: "/index.php?m=system&c=approval&a=batchSaveExpress",																																		
				type: 'post',																																												
				data: {data: data, isAll: self.isAll, batchExpress: batchExpress},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.closeAll();
						layer.msg('操作成功',{
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
		},
		//=======================================================================================================================================================================================================
		
		//===================================================================================== 当前页 全部页 事件 ==============================================================================================
		//																																															
		//		点击时通过传过来的值判断是哪个按钮执行此方法																																		
		//																																											
		//		type          : 判断是当前页还是全部页	
		//		nowPage       : 判断当前页 i（.inputTe） 标签是否为勾选状态
		//		allPage       : 判断全部页 i（.inputTe） 标签是否为勾选状态
		//		isAll     	  : 记录目前为全部页还是当前页，用于传入后台做判断
		//		event.target  : 获取当前点击对象
		//
		//		为避免button 内的checkbox勾选无效，所以用 i（.inputTe） 标签画一个 虚拟 checkbox 每次点击切换背景颜色
		//																																															
		//=======================================================================================================================================================================================================
		//				|
		//				|	
		//			 	|  
		//			  \	| /
		//			   \|/
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
			}else if(type == "all"){
				$(".current").find(".inputTe").each(function(){
					$(this).css("color","white");
				});
				self.nowPage = false;
				if(self.allPage == false){
					if($(event.target).attr('value') != "icon"){
						$(event.target).find(".inputTe").css("color","black");
					}else{
						$(event.target).css("color","black");
					}
					self.allPage = true;
					$(".skin input[name='order']").iCheck('check');	
					self.isAll = 1;
				}else if(self.allPage == true){
					if($(event.target).attr('value') != "icon"){
						$(event.target).find(".inputTe").css("color","white");
					}else{
						$(event.target).css("color","white");
					}
					self.allPage = false;
					$(".skin input[name='order']").iCheck('uncheck');	
					self.isAll = 0;
				}
			}
			
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
			
			$("input[name='order']").iCheck('uncheck');
			$(".inputTe").css("color","white");
			self.isAll = 0;
			self.nowPage = false;
			self.allPage = false;
		},
		
		//=============================================分页结束============================//
		
		
		//===========================锁单弹出框开始=============
		orderLockPage:function(type){
			var self = this;
			if(type == "page"){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
					
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;																																										//===========
				}		
			}
			$("#lockMsg").val("");
			
			//===========
			layer.open({																																											//===========
				type: 1,																																											//===========
				title: '锁定订单',																																									//===========
				skin: 'layui-layer-rim', //加上边框																																					//===========
				area: ['700px', '200px'], //宽高																																					//===========
				shade: 0.3,																																											//===========
				content: $("#edit-pages7"),																																							//===========
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					self.orderLock('LOCK',type);
				}
				,btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																																													//===========
			});	
		},
		
		//===========================锁单弹出框结束=============
		
		//====================================================================================锁订单按钮=========================================================================================================
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
					return false;																																										//===========
				}	
				
				data = self.searchData;
				if(self.isAll == 0){//-----如果是当前页	
					data = "";																						
					$("#bottomDiv input[name='order']:checkbox").each(function(){						//--------------------------																				
						if(true == $(this).is(':checked')){									//																											
							data += ($(this).val()+",");									//																											
						}																	//	拼接当前页的货品唯一码																					
					});																		//																							
					data = data.substring(0,data.length-1);									//--------------------------																														
				}
			}else{
				data = type;
				self.isAll = 0;
			}
			
			
			if(method == "LOCK"){
				var url = "/index.php?m=system&c=approval&a=setTidLock";
			}else if(method == "UNLOCK"){
				var url = "/index.php?m=system&c=approval&a=setTidUnlock";
			}
			
			$.ajax({																																														
				url: url,																																		
				type: 'post',																																												
				data: {data: data, isAll: self.isAll, lockMsg: lockMsg},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.closeAll();
						layer.msg('操作成功',{
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
		//===============================================================================作废开始======================================================================================================
		orderCancel:function(type){
			var self = this;
			if(type == "page"){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){																															//===========
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});																																												//===========
					return false;																																										//===========
				}		
			}
			$("#cancelMsg").val("");
			
			//===========
			layer.open({																																											//===========
				type: 1,																																											//===========
				title: '作废订单',																																									//===========
				skin: 'layui-layer-rim', //加上边框																																					//===========
				area: ['700px', '200px'], //宽高																																					//===========
				shade: 0.3,																																											//===========
				content: $("#edit-pages6"),																																							//===========
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					self.saveOrderCancel(type);
				}
				,btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																																													//===========
			});	
		},
		saveOrderCancel:function(type){
			var self = this;																																										//===========
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
					$("input[name='order']:checkbox").each(function(){						//--------------------------																				
						if(true == $(this).is(':checked')){									//																											
							data += ($(this).val()+",");									//																											
						}																	//	拼接当前页的货品唯一码																					
					});																		//																							
					data = data.substring(0,data.length-1);									//--------------------------																														
				}
			}else{
				data = type;
				self.isAll = 0;
			}
			
			
			
			$.ajax({																																														
				url: "/index.php?m=system&c=approval&a=setCancelTid",																																		
				type: 'post',																																												
				data: {data: data, isAll: self.isAll, cancelMsg: cancelMsg},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.closeAll();
						layer.msg('操作成功',{
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
						layer.msg('操作失败',{
							icon: 2,
							time: 2000
						});
					}
					
					searchALLNow(self,'page');
				}																																															
			});
			self.isAll = nowIsAll;
		},
		//===============================================================================作废结束===================================================================================
		//=========================================================================日志弹窗=========================================================================================
		log:function(tid){
			var self = this;
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=getLog",																																		
				type: 'post',																																												
				data: {tid:tid},																																													
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
		//=========================================================================日志弹窗结束=========================================================================================
		
		//=========================================================================查看详情按钮=========================================================================================
		seeDetails:function(type){
			var self = this;
			resetF(self,'F');
			
			$("#searchArr .rem").remove();
			if(type == "exception"){
				if(self.exception = "no"){
					$("#searchArr").append("<span class='add exce rem'>线上订单状态异常<i class='dele' id='exce' onclick='closeNow(\"exception\")'></i></span>");
					self.exception = "have";
				}
				
			}
			
			searchALLNow(self,"page");
		},
		
		//=======================================================================查看详情按钮结束=======================================================================================
        //手工订单
        addOrders:function(new_tid){
            layer.open({
                title :'新增手工订单',
                type: 2,
                shade: 0.3,
                area: ['1000px', '500px'],
                maxmin: false,
                content: '?m=system&c=delivery&a=addOrders',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
                    iframeWin.vueObj.loadOrders('',{});
                }
            }); 
        },
		//手工订单结束
		orderSplit:function(){
			var self = this;
			
			if($("#bottomDiv input[name='order']").filter(':checked').length == 0){	
				layer.msg('请选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}else if($("#bottomDiv input[name='order']").filter(':checked').length > 1){
				layer.msg('一次只能选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;	
			}
			var tid = "";																																		
			$("#bottomDiv input[name='order']:checkbox").each(function(){																										
				if(true == $(this).is(':checked')){																																				
					tid += ($(this).val()+",");																																				
				}																																							
			});																																									
			tid = tid.substring(0,tid.length-1);
			
			$.ajax({																																														
				url: "/index.php?m=system&c=approval&a=splitCheck",																																		
				type: 'post',																																												
				data: {tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == 'ok'){
						self.splitItemArr = data.dataItem;
						orderSplitWindow(tid,self);
					}else if(data.code == 'error'){
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});																																											
						return false;
					}
				}																																															
			});
		},
		orderMergeSplit:function(){
			var self = this;
			
			if($("#bottomDiv input[name='order']").filter(':checked').length == 0){	
				layer.msg('请选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}else if($("#bottomDiv input[name='order']").filter(':checked').length > 1){
				layer.msg('一次只能选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;	
			}
			var tid = "";																																		
			$("#bottomDiv input[name='order']:checkbox").each(function(){																										
				if(true == $(this).is(':checked')){																																				
					tid += ($(this).val()+",");																																				
				}																																							
			});																																									
			tid = tid.substring(0,tid.length-1);
			
			$.ajax({																																														
				url: "/index.php?m=system&c=approval&a=orderMergeSplit",																																		
				type: 'post',																																												
				data: {tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == 'ok'){
						layer.msg("撤销合并成功",{
							icon: 1,
							time: 2000
						});
						searchALLNow(self,'page');
					}else if(data.code == 'error'){
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});																																											
						return false;
					}
				}																																															
			});
		},
		key_up:function(value,index){
			var self = this;
			var a = $(event.target);
			var e = event || window.event;
			var splitNum = parseInt(a.val());
			if(isNaN(splitNum)){
				splitNum = 0;
			}
			if(a.val() > value){
				layer.msg('输入数量不能大于订单数量',{
					icon: 0,
					time: 2000
				});
				splitNum = value;
			}
			
			var numLeft = value - splitNum;
			self.splitItemArr[index].num_split = splitNum;
			self.splitItemArr[index].num_left = numLeft;
		},
		key_upItem:function(value){
			var self = this;
			var a = $(event.target);
			var e = event || window.event;
			var itemNum = parseInt(a.val());
			if(isNaN(itemNum)){
				itemNum = 0;
			}
			if(a.val() > value){
				itemNum = value;
			}
			
			self.ItemModify.num = itemNum;
		},
		autoFocus:function(){
			var a = $(event.target);
			a.focus().select();
		},
		orderSplitCancel:function(){
			var self = this;
			
			if($("#bottomDiv input[name='order']").filter(':checked').length == 0){	
				layer.msg('请选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}else if($("#bottomDiv input[name='order']").filter(':checked').length > 1){
				layer.msg('一次只能选择一个订单',{
					icon: 0,
					time: 2000
				});																																											
				return false;	
			}
			var tid = "";																																		
			$("#bottomDiv input[name='order']:checkbox").each(function(){																										
				if(true == $(this).is(':checked')){																																				
					tid += ($(this).val()+",");																																				
				}																																							
			});																																									
			tid = tid.substring(0,tid.length-1);
			
			$.ajax({																																														
				url: "/index.php?m=system&c=approval&a=orderSplitCancel",																																		
				type: 'post',																																												
				data: {tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == 'ok'){
						layer.msg("撤销拆分成功",{
							icon: 1,
							time: 2000
						});
						searchALLNow(self,'page');
					}else if(data.code == 'error'){
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});																																											
					}
				}																																															
			});
		},
		//提交配货
		submitDistribution:function(){
			var self = this;
			if($("#bottomDiv input[name='order']").filter(':checked').length == 0){	
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}
			var data = "";																																		
			$("#bottomDiv input[name='order']:checkbox").each(function(){																										
				if(true == $(this).is(':checked')){																																				
					data += ($(this).val()+",");																																				
				}																																							
			});																																									
			data = data.substring(0,data.length-1);	
			
			$.ajax({																																														
				url: "/index.php?m=system&c=approval&a=submitDistribution",																																		
				type: 'post',																																												
				data: {data:self.searchData,new_tid:data,isAll:self.isAll},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						layer.msg('操作成功',{
							icon: 1,
							time: 2000
						});	
					}
				}																																															
			});
			
		},
    }
	
});

$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});

//=================================================================================== 省份iCheck点击选中事件 ====================================================================================================
//																																																	=============
//		iCheck 为引入的复选框样式插件																																								=============
//		事件与正常js事件有差别， ifChecked 如果选中事件   ifUnchecked 如果取消选中事件																												=============
//																																																	=============
//===============================================================================================================================================================================================================
$('#minimal-checkbox-1').on('ifChecked ifUnchecked', function(event){																																//===========
	if (event.type == 'ifChecked') {																																								//===========
		$(".northwest input[name='places']").iCheck('check');																																		//===========
	} else {																																														//===========
		$(".northwest input[name='places']").iCheck('uncheck');																																		//===========
	}																																																//===========
});																																																	//===========
																																																	//===========
$('#more_1').on('ifChecked ifUnchecked', function(event){																																			//===========
																																																	//===========
	if (event.type == 'ifChecked') {																																								//===========
		$(".more input[name='order']").iCheck('check');																																			//===========
	} else {																																														//===========
		$(".more input[name='order']").iCheck('uncheck');																																			//===========
	}																																																//===========
});																																																	//===========
																																																	//===========
$('#minimal1').on('ifChecked ifUnchecked', function(event){																																			//===========
																																																	//===========
	if (event.type == 'ifChecked') {																																								//===========
		$(".southwest input[name='places']").iCheck('check');																																		//===========
	} else {																																														//===========
		$(".southwest input[name='places']").iCheck('uncheck');																																		//===========
	}																																																//===========
});																																																	//===========
																																																	//===========
$('#mini1').on('ifChecked ifUnchecked', function(event){																																			//===========
																																																	//===========
	if (event.type == 'ifChecked') {																																								//===========
		$(".eastChina input[name='places']").iCheck('check');																																		//===========
	} else {																																														//===========
		$(".eastChina input[name='places']").iCheck('uncheck');																																		//===========
	}																																																//===========
});																																																	//===========
																																																	//===========
$('#mini7').on('ifChecked ifUnchecked', function(event){																																			//===========
																																																	//===========
	if (event.type == 'ifChecked') {																																								//===========
		$(".northChina input[name='places']").iCheck('check');																																		//===========
	} else {																																														//===========
		$(".northChina input[name='places']").iCheck('uncheck');																																	//===========
	}																																																//===========
});																																																	//===========
																																																	//===========
$('#mini14').on('ifChecked ifUnchecked', function(event){																																			//===========
																																																	//===========
	if (event.type == 'ifChecked') {																																								//===========
		$(".southChina input[name='places']").iCheck('check');																																		//===========
	} else {																																														//===========
		$(".southChina input[name='places']").iCheck('uncheck');																																	//===========
	}																																																//===========
});																																																	//===========
																																																	//===========
$('#mini19').on('ifChecked ifUnchecked', function(event){																																			//===========
																																																	//===========
	if (event.type == 'ifChecked') {																																								//===========
		$(".centralChina input[name='places']").iCheck('check');																																	//===========
	} else {																																														//===========
		$(".centralChina input[name='places']").iCheck('uncheck');																																	//===========
	}																																																//===========
});																																																	//===========
																																																	//===========
$('#mini23').on('ifChecked ifUnchecked', function(event){																																			//===========
																																																	//===========
	if (event.type == 'ifChecked') {																																								//===========
		$(".northeast input[name='places']").iCheck('check');																																		//===========
	} else {																																														//===========
		$(".northeast input[name='places']").iCheck('uncheck');																																		//===========
	}																																																//===========
});																																																	//===========
																																																	//===========
$('#mini27').on('ifChecked ifUnchecked', function(event){																																			//===========
																																																	//===========
	if (event.type == 'ifChecked') {																																								//===========
		$(".hongkang input[name='places']").iCheck('check');																																		//===========
	} else {																																														//===========
		$(".hongkang input[name='places']").iCheck('uncheck');																																		//===========
	}																																																//===========
});																																																	//===========
//=========================================================================================== 省份iCheck点击选中事件结束=========================================================================================

//选中改变颜色
$(document).ready(function(){
	$('.changeColor').on('ifChecked ifUnchecked', function(event){																																			
																																										
		if (event.type == 'ifChecked') {			
			$(event.target).parent().parent().parent().css("backgroundColor","#f8f8c7");
		} else {																																														
			$(event.target).parent().parent().parent().css("backgroundColor","rgb(249, 249, 249)");																																	
		}																																																
	});
});

$('#radio_1').on('ifChecked', function(event){																																			
																																																	
	flow.printType = "noRepeat";																																									
																																																
});	

$('#radio_2').on('ifChecked', function(event){																																			
																																																	
	flow.printType = "Repeat";																																										
																																																
});		

$('#radio_3').on('ifChecked', function(event){																																			
																																																
	flow.printType = "Refunds";																																										
																																																
});																																																

function keyDownSearch(){
	if(event.keyCode==13){
		searchALLNow(flow,'F');
	}
}

//========================================================================================================选择店铺===============================================================================================
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
	searchALLNow(flow,'page');																																										//===========
}																																																	//===========
//======================================================================================================选择店铺结束=============================================================================================

//======================================================================================================选择发货快递=============================================================================================
function expressChange(a){																																											//===========
	var toggle = event.currentTarget;																																								//===========
	if(toggle.value != "0"){																																										//===========
		flow.express = toggle.value;																																								//===========
		$("#searchArr .express").remove();																																							//===========
		$("#searchArr").append("<span class='add express rem'>" + a + "<i class='dele' id='specialGroup' onclick='closeNow(\"express\")'></i></span>");												//===========
	}else if(toggle.value == "0"){																																									//===========
		flow.express = "";																																											//===========
		$("#searchArr .express").remove();																																							//===========
	}																																																//===========
	searchALLNow(flow,'page');																																										//===========
}																																																	//===========
//====================================================================================================选择发货快递结束===========================================================================================

//======================================================================================================选择支付方式=============================================================================================
function paywayChange(a){
	var toggle = event.currentTarget;
	if(toggle.value != "0"){																																										
		flow.payway = toggle.value;																																								
		$("#searchArr .payway").remove();																																							
		$("#searchArr").append("<span class='add payway rem'>" + a + "<i class='dele' id='payway_1' onclick='closeNow(\"payway\")'></i></span>");												
	}else if(toggle.value == "0"){																																									
		flow.payway = "";																																											
		$("#searchArr .payway").remove();																																							
	}																																																
	searchALLNow(flow,'page');
}
//====================================================================================================选择支付方式结束===========================================================================================

//======================================================================================================线上状态=============================================================================================
function webStatusChange(a){
	var toggle = event.currentTarget;
	if(toggle.value != "0"){																																										
		flow.webStatus = toggle.value;																																								
		$("#searchArr .webStatus").remove();																																							
		$("#searchArr").append("<span class='add webStatus rem'>" + a + "<i class='dele' id='webStatus_1' onclick='closeNow(\"webStatus\")'></i></span>");												
	}else if(toggle.value == "0"){																																									
		flow.webStatus = "";																																											
		$("#searchArr .webStatus").remove();																																							
	}																																																
	searchALLNow(flow,'page');
}
//====================================================================================================线上状态结束===========================================================================================

//======================================================================================================选择订单状态=============================================================================================
function orderChange(a){																																											//===========
	var toggle = event.currentTarget;																																								//===========
	if(toggle.value != "0"){																																										//===========
		flow.orderStatus = toggle.value;																																							//===========
		$("#searchArr .orderStatus").remove();																																						//===========
		$("#searchArr").append("<span class='add orderStatus rem'>" + a + "<i class='dele' id='specialGroup' onclick='closeNow(\"orderStatus\")'></i></span>");										//===========
	}else if(toggle.value == "0"){																																									//===========
		flow.orderStatus = "";																																										//===========
		$("#searchArr .orderStatus").remove();																																						//===========
	}																																																//===========
	searchALLNow(flow,'page');																																											//===========
}																																																	//===========
//====================================================================================================选择订单状态结束===========================================================================================

function focu(a){
	$("." + a).css("height","100px");
	$("." + a).prop("placeholder","");
}

function blu(a){
	$("." + a).css("height","26px");
	$("." + a).prop("placeholder","多个逗号隔开");
}

//=============================================================================================================选择标签删除方法==================================================================================
function closeNow(group){																																											//===========
	if(group == "bannerArr"){																																									//===========
		$("#searchArr .ban span").remove();																																							//===========
																																																	//===========
		flow.banner = "";																																											//===========
																																																	//===========
		$(".bannerArr div").each(function(){																																						//===========
			$(".bannerArr .ic").remove();																																							//===========
			$(this).removeClass("border");																																					//===========
		});																																															//===========
																																																	//===========
		$(".bannerArr .all").append("<i class='ic'></i>");																														//===========
		$(".bannerArr .all").addClass("border");																																		//===========
																																																	//===========
		flow.hui = false;																																											//===========
		flow.red = false;																																											//===========
		flow.green = false;																																											//===========
		flow.yellow = false;																																										//===========
		flow.blue = false;																																											//===========
		flow.pink = false;																																											//===========
	}else if(group == "conditionGroup"){																																							//===========
		$("#searchArr .remar").remove();																																							//===========
																																																	//===========
		$(".conditionGroup div").each(function(){																																					//===========
			$(".conditionGroup .ic").remove();																																						//===========
			$(this).removeClass("border");																																					//===========
		});																																															//===========
																																																	//===========
		flow.remark = "";																																											//===========											
		flow.noRemark = false;																																										//===========
		flow.haveRemark = false;																																									//===========
																																																	//===========
	}else if(group == "babyGroup"){																																									//===========
		$("#searchArr .sin").remove();																																								//===========
																																																	//===========
		$(".babyGroup div").each(function(){																																						//===========
			$(".babyGroup .ic").remove();																																							//===========
			$(this).removeClass("border");																																					//===========
		});																																															//===========
																																																	//===========
		flow.babyNum = "";																																											//===========
		flow.variety = false;																																										//===========
		flow.isSingle = false;																																										//===========
		flow.multiple = false;																																										//===========
	}else if(group == "statusGroup"){																																								//===========
		$("#searchArr .equip").remove();																																							//===========
																																																	//===========
		$(".statusGroup div").each(function(){																																						//===========
			$(".statusGroup .ic").remove();																																							//===========
			$(this).removeClass("border");																																					//===========
		});																																															//===========
																																																	//===========
		flow.singleStatus = 4;																																										//===========
		flow.equipped = false;																																										//===========
		flow.picking = false;																																										//===========
		flow.stock = false;																																											//===========
		flow.allocated = false;																																										//===========
	}else if(group == "specialGroup"){																																								//===========
		$("#searchArr .refu").remove();																																								//===========
																																																	//===========
		$(".specialGroup div").each(function(){																																						//===========
			$(".specialGroup .ic").remove();																																						//===========
			$(this).removeClass("border");																																					//===========
		});																																															//===========
																																																	//===========
		flow.special = "";																																											//===========
		flow.ship = false;																																											//===========
		flow.refunds = false;																																										//===========
		flow.merge = false;																																											//===========
																																																	//===========
	}else if(group == "province"){																																									//===========
		flow.province = "";																																											//===========
																																																	//===========
		$(".placeAdd").each(function(){																																								//===========
			$(this).css({																																											//===========
				color:"black",																																										//===========
				borderColor:"#dddddd",																																								//===========
				backgroundColor:"white"																																								//===========
			});																																														//===========
			$(this).find(".positionSpan").css({																																						//===========
				backgroundColor:"white"																																								//===========
			});																																														//===========
			$(this).find(".layui-icon").css("color","#1E9FFF");																																		//===========
			$(this).find(".others").css("color","red");																																				//===========
		});																																															//===========
																																																	//===========
		$(".placeBtn").css({																																										//===========
			color:"white",																																											//===========
			borderColor:"#1E9FFF",																																									//===========
			backgroundColor:"#1E9FFF"																																								//===========
		});																																															//===========
																																																	//===========
		$(".changeProvince").html("所有省份");																																						//===========
		$("#searchArr .pro").remove();																																								//===========
	}else if(group == "shop"){																																										//===========
		$("#searchArr .shop").remove();																																								//===========
		$("#shop").val(0);																																											//===========
		flow.shopId = "";																																											//===========
	}else if(group == "express"){																																									//===========
		$("#searchArr .express").remove();																																							//===========
		$("#express").val(0);																																										//===========
		flow.express = "";																																											//===========
	}else if(group == "orderStatus"){																																								//===========
		flow.orderStatus = "";																																										//===========
		$("#searchArr .orderStatus").remove();																																						//===========
		$("#orderStatus").val(0);																																									//===========
	}else if(group == "exception"){																																									//===========
		flow.exception = "no";																																										
		$("#searchArr .exce").remove();																																								
	}else if(group == "sear_left"){																																								
		$("#searchArr .sear_left").remove();
		$("#separator1").val("show_tid");																																								
		$(".changeDiv").html("<input class='show_tid inp' placeholder='多个逗号隔开' onkeydown='keyDownSearch()' name='reset'>");
	}else if(group == "sear_right"){
		$("#searchArr .sear_right").remove();
		$("#separator2").val("title");																																									//===========
		$(".changeDiv1").html("<input type='text' class='title inp' placeholder='宝贝标题' name='reset' onkeydown='keyDownSearch()'>");	
	}else if(group == "time"){
		$("#searchArr .time").remove();
		$("#dateBegin").val("");
		$("#dateEnd").val("");
	}else if(group == "payway"){
		$("#searchArr .payway").remove();
		$("#payway").val(0);
		flow.payway = "";
	}else if(group == "webStatus"){
		$("#searchArr .webStatus").remove();
		$("#webStatus").val(0);
		flow.webStatus = "";
	}																																																	
																																																	
	searchALLNow(flow,'F');																																												
}																																																	
//===========================================================================================================选择标签删除方法结束================================================================================

//===========================================================================================重置方法封装========================================================================================================
function resetF(self,special){																																										//===========
	$("input[name='reset']").val("");																																								//===========
	$("textarea").val("");																																											//===========
	$("#shop").val(0);																																												//===========
	$("#express").val(0);																																											//===========
	$("#orderStatus").val(0);																																										//===========
	$("#separator1").val("show_tid");																																								//===========
	$(".changeDiv").html("<input class='show_tid inp' placeholder='多个逗号隔开' onkeydown='keyDownSearch()' name='reset'>");																		//===========
	$("#separator2").val("title");																																									//===========
	$(".changeDiv1").html("<input type='text' class='title inp' placeholder='宝贝标题' name='reset' onkeydown='keyDownSearch()'>");																	//===========
	
	$("#payway").val(0);
	flow.payway = "";
	
	$("#webStatus").val(0);
	flow.webStatus = "";

	$(".specialGroup div").each(function(){	
		$(".specialGroup .ic").remove();
		$(this).removeClass("border");																																								//===========
	});																																																																																		//===========
																																																	//===========
	$(".bannerArr div").each(function(){																																							//===========
		$(".bannerArr .ic").remove();																																								//===========
		$(this).removeClass("border");																																						//===========
	});																																																//===========
																																																	//===========
	$(".bannerArr .all").append("<i class='ic'><i class='ri'></i></i>");																															//===========
	$(".bannerArr .all").addClass("border");																																				//===========
																																																	//===========
	$(".conditionGroup div").each(function(){																																						//===========
		$(".conditionGroup .ic").remove();																																							//===========
		$(this).removeClass("border");																																						//===========
	});																																																//===========
																																																	//===========
	$(".babyGroup div").each(function(){																																							//===========
		$(".babyGroup .ic").remove();																																								//===========
		$(this).removeClass("border");																																						//===========
	});																																																//===========
																																																	//===========
	$(".statusGroup div").each(function(){																																							//===========
		$(".statusGroup .ic").remove();																																								//===========
		$(this).removeClass("border");																																						//===========
	});																																																//===========
																																																	//===========
	$("#searchArr .rem").remove();																																									//===========
																																																	//===========
	$("#searchArr .refu").remove();																																									//===========
																																																	//===========
	$(".specialGroup div").each(function(){																																							//===========
		$(".specialGroup .ic").remove();																																							//===========
		$(this).removeClass("border");																																						//===========
	});																																																//===========
																		
																																																	//===========
	$(".placeAdd").each(function(){										//------------------------------																				//===========
		$(this).css({													//																												//===========
			color:"black",												//																												//===========
			borderColor:"#dddddd",										//																												//===========
			backgroundColor:"white"										//																												//===========
		});																//	初始化按钮样式																								//===========
		$(this).find(".positionSpan").css({								//																												//===========
			backgroundColor:"white"										//																												//===========
		});																//																												//===========
		$(this).find(".layui-icon").css("color","#1E9FFF");				//																												//===========
		$(this).find(".others").css("color","red");						//																												//===========
	});																	//------------------------------																				//===========
																																														//===========
	$(".placeBtn").css({												//------------------------------																				//===========
		color:"white",													//																												//===========
		borderColor:"#1E9FFF",											//	将所有省份按钮变为高亮																						//===========
		backgroundColor:"#1E9FFF"										//																												//===========
	});																	//------------------------------																				//===========
																																														//===========
	$(".changeProvince").html("所有省份");
	
																																																	//===========
																																																	//===========
																																																	//===========
	self.hui = false;																																												//===========
	self.red = false;																																												//===========
	self.green = false;																																												//===========
	self.yellow = false;																																											//===========
	self.blue = false;																																												//===========
	self.pink = false;																																												//===========
	self.noRemark = false;																																											//===========
	self.haveRemark = false;																																										//===========
	self.isSingle = false;																																											//===========
	self.multiple = false;																																											//===========
	self.variety = false;																																											//===========
	self.equipped = false;																																											//===========
	self.picking = false;																																											//===========
	self.stock = false;																																												//===========
	self.allocated = false;																																											//===========
																																																	//===========
	if(special != "special"){								//--------------------------------------																								//===========
		self.ship = false;									//																																		//===========
		self.refunds = false;								//	若为特殊订单按钮点击则不初始化这三项																								//===========
		self.merge = false;									//																																		//===========
	}														//--------------------------------------																								//===========																																																	//===========    																																										//===========                                         
	self.remark = "";																																												//===========												 
	self.babyNum = "";																																												//===========
	self.singleStatus = 4;  																																										//===========                                       
	self.banner = ""; 																																												//===========
	self.special = "";																																												//===========
	self.express = "";																																												//===========
	self.shopId = "";																																												//===========
	self.orderStatus = "";																																											//===========
	self.province = "";
	self.provinceStatus = "T";
	$(".inputTe").css("color","white");
	$("input[name='order']").iCheck('uncheck');
	self.isAll = 0;
	self.nowPage = false;
	self.allPage = false;
	self.exception = "no";
	contain = "y";										 //-----
	index = "F";		
}																																																	//===========
//=========================================================================================重置方法封装结束======================================================================================================

function orderSelect(a){
	if(a == "show_tid"){
		$(".changeDiv").html("<input class='" + a + " inp'  placeholder='多个逗号隔开' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "unique_code"){
		$(".changeDiv").html("<input class='" + a + " inp'  placeholder='唯一码' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "buyer_nick"){
		$(".changeDiv").html("<input class='" + a + " inp'  placeholder='多个逗号隔开' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "receiver_name"){
		$(".changeDiv").html("<input type='text' class='" + a + " inp' placeholder='收件人姓名' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "receiver_mobile"){
		$(".changeDiv").html("<input type='number' class='" + a + " inp' placeholder='手机号码' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "seller_memo"){
		$(".changeDiv").html("<input type='text' class='" + a + " inp' placeholder='卖家备注' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "buyer_message"){
		$(".changeDiv").html("<input type='text' class='" + a + " inp' placeholder='买家备注' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "payment"){
		$(".changeDiv").html("<input type='text' class='" + a + "1 inp' style='width:153.5px;background-image:url(images/mon.png);background-size:8px 10px;background-repeat:no-repeat;background-position:3px center;border:1px solid #c2c2c2;padding-left:14px;' onkeydown='keyDownSearch()' name='reset'> - <input type='text' class='" + a + "2 inp' style='width:153.5px;background-image:url(images/mon.png);background-size:8px 10px;background-repeat:no-repeat;background-position:3px center;border:1px solid #c2c2c2;padding-left:14px;' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "items_num"){
		$(".changeDiv").html("<input type='text' class='" + a + "1 inp' style='width:153.5px;border:1px solid #c2c2c2;' onkeydown='keyDownSearch()' name='reset'> - <input type='text' class='" + a + "2 inp' style='width:153.5px;border:1px solid #c2c2c2;' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "sku_num"){
		$(".changeDiv").html("<input type='text' class='" + a + "1 inp' style='width:153.5px;border:1px solid #c2c2c2;' onkeydown='keyDownSearch()' name='reset'> - <input type='text' class='" + a + "2 inp' style='width:153.5px;border:1px solid #c2c2c2;' onkeydown='keyDownSearch()' name='reset'>");
	}
}

function itemChange(a){
	if(a == "prd_no"){
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='商品编号' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "title"){
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='宝贝标题' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "sku_name"){
		
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='宝贝属性' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "outer_id"){
	
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='主商家编码' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "outer_sku_id"){
	
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='SKU商家编码' onkeydown='keyDownSearch()' name='reset'>");
	}
}

//============================================================================================查询方法封装=======================================================================================================
function searchALLNow(self,page){																																										
	var dateBegin = $("#dateBegin").val();																																							
	var dateEnd = $("#dateEnd").val();	
	/***********/
	var orderSelect = $("#separator1").val();
	var show_tid = $('.show_tid').val();
	var unique_code = $(".unique_code").val();
	var buyer_nick = $('.buyer_nick').val();
	var receiver_name = $('.receiver_name').val();
	var receiver_mobile = $('.receiver_mobile').val();
	var seller_memo = $('.seller_memo').val();
	var buyer_message = $('.buyer_message').val();
	var payment1 = $('.payment1').val();
	var payment2 = $('.payment2').val();
	var items_num1 = $('.items_num1').val();
	var items_num2 = $('.items_num2').val();
	var sku_num1 = $('.sku_num1').val();
	var sku_num2 = $('.sku_num2').val();
	/***********/
	/***********/
	var itemSelect = $("#separator2").val();
	var prd_no = $('.prd_no').val();
	var title = $('.title').val();
	var sku_name = $('.sku_name').val();
	var outer_id = $('.outer_id').val();
	var outer_sku_id = $('.outer_sku_id').val();
	/***********/
	$(".sear_left").remove();
	$(".time").remove();
	$(".sear_right").remove();
	
	if(dateBegin != ""){
		if(dateEnd != ""){
			$("#searchArr").append("<span class='add time rem'>"+dateBegin+"至"+dateEnd+"<i class='dele' id='time' onclick='closeNow(\"time\")'></i></span>");
		}else{
			$("#searchArr").append("<span class='add time rem'>"+dateBegin+"至<i class='dele' id='time' onclick='closeNow(\"time\")'></i></span>");
		}
	}else if(dateEnd != ""){
		$("#searchArr").append("<span class='add time rem'> 至"+dateEnd+"<i class='dele' id='time' onclick='closeNow(\"time\")'></i></span>");
	}
	
	if(prd_no != undefined && prd_no != ""){
		$("#searchArr").append("<span class='add sear_right rem'>商品编号:"+prd_no+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}else if(title != undefined && title != ""){
		$("#searchArr").append("<span class='add sear_right rem'>宝贝标题:"+title+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}else if(sku_name != undefined && sku_name != ""){
		$("#searchArr").append("<span class='add sear_right rem'>宝贝属性:"+sku_name+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}else if(outer_id != undefined && outer_id != ""){
		$("#searchArr").append("<span class='add sear_right rem'>线上主商家编码:"+outer_id+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}else if(outer_sku_id != undefined && outer_sku_id != ""){
		$("#searchArr").append("<span class='add sear_right rem'>线上sku商家编码:"+outer_sku_id+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}
	
	
	if(show_tid != undefined && show_tid != ""){
		$("#searchArr").append("<span class='add sear_left rem'>订单编号:"+show_tid+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(unique_code != undefined && unique_code != ""){
		$("#searchArr").append("<span class='add sear_left rem'>唯一码:"+unique_code+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(buyer_nick != undefined && buyer_nick != ""){
		$("#searchArr").append("<span class='add sear_left rem'>买家昵称:"+buyer_nick+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(receiver_name != undefined && receiver_name != ""){
		$("#searchArr").append("<span class='add sear_left rem'>收件人姓名:"+receiver_name+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(receiver_mobile != undefined && receiver_mobile != ""){
		$("#searchArr").append("<span class='add sear_left rem'>手机号码:"+receiver_mobile+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(seller_memo != undefined && seller_memo != ""){
		$("#searchArr").append("<span class='add sear_left rem'>卖家备注:"+seller_memo+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(buyer_message != undefined && buyer_message != ""){
		$("#searchArr").append("<span class='add sear_left rem'>买家备注:"+buyer_message+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(payment1 != undefined && payment1 != ""){
		if(payment2 != undefined && payment2 != ""){
			$("#searchArr").append("<span class='add sear_left rem'>订单金额:"+payment1+"-"+payment2+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
		}else{
			$("#searchArr").append("<span class='add sear_left rem'>订单金额:"+payment1+"-<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
		}
	}else if(payment2 != undefined && payment2 != ""){
		$("#searchArr").append("<span class='add sear_left rem'>订单金额: -"+payment2+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
		
	}else if(items_num1 != undefined && items_num1 != ""){
		if(items_num2 != undefined && items_num2 != ""){
			$("#searchArr").append("<span class='add sear_left rem'>商品件数:"+items_num1+"-"+items_num2+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
		}else{
			$("#searchArr").append("<span class='add sear_left rem'>商品件数:"+items_num1+"-<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
		}
	}else if(items_num2 != undefined && items_num2 != ""){
		$("#searchArr").append("<span class='add sear_left rem'>商品件数: -"+items_num2+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
		
	}else if(sku_num1 != undefined && sku_num1 != ""){
		if(sku_num2 != undefined && sku_num2 != ""){
			$("#searchArr").append("<span class='add sear_left rem'>商品款数:"+sku_num1+"-"+sku_num2+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
		}else{
			$("#searchArr").append("<span class='add sear_left rem'>商品款数:"+sku_num1+"-<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
		}
	}else if(sku_num2 != undefined && sku_num2 != ""){
		$("#searchArr").append("<span class='add sear_left rem'>商品款数: -"+sku_num2+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
		
	}
	
	if(page == "F"){
		self.pageNo = 1;
	}
	
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
																																																	
	var data = {
		"pageSize":self.pageSize,
		"pageNo":self.pageNo,																																										
		"special":self.special,																																										
		"shopId":self.shopId,																																										
		"remark":self.remark,																																																																																			
		"babyNum":self.babyNum,																																										
		"express":self.express,																																										
		"banner":self.banner,																																										
		"singleStatus":self.singleStatus,																																							
		"province":self.province,																																									
		"provinceStatus":self.provinceStatus,																																						
		"orderStatus":self.orderStatus,																																								
		"dateBegin":dateBegin,																																										
		"dateEnd":dateEnd,																																											
		"order":self.order,
		"orderSelect": orderSelect,
		"show_tid":show_tid,
		"buyer_nick":buyer_nick,
		"receiver_name":receiver_name,
		"receiver_mobile":receiver_mobile,
		"seller_memo":seller_memo,
		"buyer_message":buyer_message,
		"payment1":payment1,
		"payment2":payment2,
		"items_num1":items_num1,
		"items_num2":items_num2,
		"sku_num1":sku_num1,
		"sku_num2":sku_num2,
		"itemSelect":itemSelect,
		"title":title,
		"sku_name":sku_name,
		"outer_id":outer_id,
		"outer_sku_id":outer_sku_id,
		"unique_code":unique_code,
		"prd_no":prd_no,
		"exception":self.exception,
		"payway":self.payway,
		"webStatus":self.webStatus
	};	
	
	self.searchData = data;
	
	$.ajax({																																														
		url: "/index.php?m=system&c=approval&a=getOrderTrade",																																		
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
			self.isAll = 0;
			self.nowPage = false;
			self.allPage = false;
			
		}																																															
	});																																																
}																																																	
//==========================================================================================查询方法封装结束=====================================================================================================

$(".timePay").hover(
  function () {
    $(".orderHide").css("display","block");
  },
  function () {
    $(".orderHide").css("display","none");
  }
);

$(".province").hover(
  function () {
    $(".placeHide").css("display","block");
  },
  function () {
    $(".placeHide").css("display","none");
  }
);

$(".banner_li").hover(
  function () {
	 event.stopPropagation();
    $(this).css("backgroundColor","#e8e8e8");
  },
  function () {
	event.stopPropagation();
    $(this).css("backgroundColor","white");
  }
);

var sta = 1;

//=========================================================================================有订单发货失败 闪烁 图片==============================================================================================
																																														//===========
//=========================================================================================有订单发货失败 闪烁 图片==============================================================================================

//=========================行刷新===========
function reloadRow(self,order_index){
	var data = self.gridArr[order_index];
	var tid = data.new_tid;
	var searchData = {tid: tid};
	
	$.ajax({																																														
		url: "/index.php?m=system&c=approval&a=getOrderTrade",																																		
		type: 'post',																																												
		data: {data: searchData},																																													
		dataType: 'json',
		async:false,
		success: function (data) {
			if(data){
				var gridData = data.data;
				var rowData = gridData[tid];
				
				if(rowData){
					self.gridArr[order_index] = rowData;
					var dataClone = self.gridArr;
					self.gridArr = [];
					self.gridArr = dataClone;
				}
			}
		}																																															
	});
}
//=========================行刷新===========

$("#logIn").scroll(function(e) {
	var e = event || window.event;
	e.stopPropagation();
});

function cbProductRows(data,type){
	if(type == "PRD1"){
		if(data[0]){
			flow.ItemModify['outer_sku_id'] = data[0]['prd_no'];
			flow.ItemModify['colorArray'] = [{id:'',name:data[0]['sku_name1']}];
			flow.ItemModify['sizeArray'] = [{id:'',name:data[0]['sku_name2']}];
			flow.ItemModify['isProduct'] = '1';
			flow.ItemModify['properties_name'] = data[0]['sku_name'];
			flow.ItemModify['prd_no'] = data[0]['prd_no'];
			flow.ItemModify['title'] = data[0]['title'];
			flow.ItemModify['prd_id'] = data[0]['prd_id'];
			flow.ItemModify['prd_sku_id'] = data[0]['prd_sku_id'];
		}
	}else if(type == "PRD2"){
		$("#pages11-prd_no").val(data[0]['prd_no']);
		$("#pages11-title").val(data[0]['title']);
		$("#pages11-sku_name").val(data[0]['sku_name']);
		$("#pages11-prd_id").val(data[0]['prd_id']);
		$("#pages11-prd_sku_id").val(data[0]['prd_sku_id']);
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

function orderSplitWindow(tid,self){
	layer.open({																																											//===========
		type: 1,																																											//===========
		title: '订单拆分',																																									//===========
		skin: 'layui-layer-rim', //加上边框																																					//===========
		area: ['988px', '600px'], //宽高																																					//===========
		shade: 0.3,																																											//===========
		content: $("#edit-pages10"),	
		btn: [ '保存拆分', '取消']
		,yes: function(index, layero){
			data = self.splitItemArr;
			$.ajax({																																														
				url: "/index.php?m=system&c=approval&a=orderSplitSave",																																		
				type: 'post',																																												
				data: {tid: tid, data: data},																																													
				dataType: 'json',
				async:false,
				success: function (data) {
					if(data.code == 'ok'){
						layer.msg("拆分成功,拆出订单号["+ data.new_tid +"]",{
							icon: 1,
							time: 2000
						});
						layer.close(index);
						searchALLNow(self,'page');
					}else if(data.code == 'error'){
						layer.msg(data.msg,{
							icon: 0,
							time: 2000
						});
						return false;// 开启该代码可禁止点击该按钮关闭
					}else{
						layer.msg("拆分异常error",{
							icon: 2,
							time: 2000
						});
						return false;// 开启该代码可禁止点击该按钮关闭
					}
				}																																															
			});
		},
		cancel: function (index, layero) {																																					//===========
			
		}																																													//===========
	});	
}

//=========================================================================================返回顶部、操作航固定==============================================================================================
clearfixFixTop();
function clearfixFixTop(){
	var clearfixClientTop = $("#btnGroupFixed").offset().top;
	var windowScrollTop = 0;
	var scrollReturnTop = $('<div>',{'class':'scrollReturnTop'}); 
	$("#btnGroupFixed").append(scrollReturnTop);
	$("body").on("click",".scrollReturnTop",function(){
		$("body,html").stop().animate({scrollTop:0},500);
	});
	$(window).scroll(function(){
		windowScrollTop = $(window).scrollTop();
		if(windowScrollTop>clearfixClientTop-10){
			$("#changeFixed").css("display","block");
			$("#btnGroupFixed").addClass("btnArrFixed");
			$("#btnGroupPageFixed").addClass("btnPageFixed");
		}else if(windowScrollTop<clearfixClientTop){
			$("#changeFixed").css("display","none");
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