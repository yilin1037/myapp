var vueObj = new Vue({
    el: '#app',
    data: {
        expressItems: paramObject.expressObj,
        shopList: paramObject.shopList,
		create_time: paramObject.create_time,
		beginDate:'',
		stallArr:"",			//档口数据数组
		pageNo:"",				//档口弹窗内页数
		pageCount:"",   		//档口弹窗内总页数
		booth:"",				//档口弹窗内档口查询条件
		shopname:"",			//档口弹窗内店铺名称查询条件
		phone:"",				//档口弹窗内电话号码查询条件
		isShow:true,
		tab:"",
    },
    mounted: function () {
		var self = this;
        //layui 模块 入口
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  //时间选择器
				  laydate.render({
					elem: '#beginDate'
					,type: 'datetime'
					,done: function(value, date, endDate){
						self.beginDate = value;
					  }
				  });
				  laydate.render({
					elem: '#endDate'
					,type: 'datetime'
					,done: function(value, date, endDate){
						self.beginDate = value;
					  }
				  });
				  layer.load(2);
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=report&c=outOfStockReport&a=outOfStockReportList'
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'market', title: '供应商',"width":100,fixed: true}
					  ,{field:'prd_no', title: '商家编码',"width":200}
					  ,{field:'sku_name', title: '销售属性',"width":200}
					  ,{field:'total_num', title: '应到数量',"width":90}
					  ,{field:'last_price', title: '上次单价',"width":90}
					  ,{field:'take_price', title: '实到单价',"width":125, "templet": '#sexTpl'}
					  ,{field:'has_num', title: '实到数量',"width":125, "templet": '#sexTpl1'}
					  ,{field:'total_price', title: '实到金额',"width":90}
					  ,{field:'out_num', title: '缺货数量',"width":90}
					  ,{field:'refund_price', title: '退货单价',"width":90}
					  ,{field:'refund_num', title: '退货数量',"width":90}
					  ,{field:'refund_money', title: '退货金额',"width":90}
					  ,{field:'right', title: '操作',"width":200, align:'center', toolbar: '#barDemo'}
					]]
					,id: 'testReload'
					,page: true
					,where: {
						beginDate: getNowFormatDate()
					}
					,height: 'full-140'
					,done: function(res, curr, count){
						layer.closeAll('loading');
					}
				  });
				  //self.tab = tab;
				  table.on('edit(user)', function(obj){
					var value = obj.value //得到修改后的值
					,data = obj.data //得到所在行所有键值
					,field = obj.field; //得到字段
					
					if(data.take_no == "0"){
						layer.msg("未生成红单数据不能录入价格与数量，请在红单记录选择已生成记录",{
							icon: 0,
							time: 4000
						});
						return false;
					}
					if($("#manualType").is(':checked') != true && field == 'has_num'){
						layer.msg("手动录入到货信息的方式才能修改到货数量",{
							icon: 0,
							time: 4000
						});
						return false;
					}
					$.ajax({																				
						url: "/index.php?m=report&c=outOfStockReport&a=change",										
						type: 'post',																		
						data: {id:data.id,has_num:data.has_num,take_price:data.take_price},																	
						dataType: 'json',																	
						success: function (data) {															
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								self.tab.reload();
							}else{
								layer.msg(data.msg,{
									icon: 2,
									time: 2000
								});
							}																			
						}																					
					});
					
				  });
				  
				  table.on('tool(user)', function(obj){
					var data = obj.data;
					if(obj.event === 'detail1'){
					  if(data.take_no == "0"){
						layer.msg("未生成红单数据不能拆分档口，请在红单记录选择已生成记录",{
							icon: 0,
							time: 4000
						});
						return false;
					  }
					  layer.open({																																											
							type: 1,																																											
							title: '拆分档口',																																									
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['588px', '270px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#split"),	
							btn: [ '确定','取消']
							,yes: function(index, layero){
								//按钮【按钮一】的回调
								var actual = $("#actual").val();
								var cus_no = $("#cus_no").val();
								var actual_price = $("#actual_price").val();
								if(cus_no == ""){
									layer.msg("请填写供应商",{
										icon: 0,
										time: 2000
									});
									return false;
								}
								if(actual == ""){
									layer.msg("请填写实到数量",{
										icon: 0,
										time: 2000
									});
									return false;
								}
								if(actual > data.has_num){
									layer.msg("请填写正确的实到数量",{
										icon: 0,
										time: 2000
									});
									return false;
								}
								var actualType = "";
								if($("#checkType").is(':checked') == true){
									actualType = "checkType";
								}else if($("#sendType").is(':checked') == true){
									actualType = "sendType";
								}else if($("#manualType").is(':checked') == true){
									actualType = "manualType";
							  	}
								$.ajax({																				
									url: "/index.php?m=report&c=outOfStockReport&a=split_split",										
									type: 'post',																		
									data: {id:data.id,actual:actual,cus_no:cus_no,actual_price:actual_price,actualType:actualType},																	
									dataType: 'json',																	
									success: function (data) {															
										if(data.code == "ok"){
											layer.msg(data.msg,{
												icon: 1,
												time: 2000
											});
											layer.close(index);
											var type = "reload";
					
											active[type] ? active[type].call(this) : '';
										}																		
									}																					
								});	
								
								layer.close(index);
								
							},
							success:function(){
								$("#cus_no").val("");
								$("#actual").val("");
								$("#actual_price").val("");
							}
						});	
						
					} else if(obj.event === 'detail2'){
						var str = "【"+data.prd_no+"】";
					    layer.open({																																											
							type: 1,																																											
							title: str+'历史价格变动',																																									
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['988px', '610px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#statistics"),	
							btn: [ '关闭']
							,yes: function(index, layero){
								//按钮【按钮一】的回调
								layer.close(index);
							},
							success:function(){
								self.getData(data.market,data.prd_no,data.sku_name,'15');
							}
						});	
					} 
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
					  layer.load(2);
					  var actualType = "sendType";
						if($("#checkType").is(':checked') == true){
							actualType = "checkType";
						}else if($("#sendType").is(':checked') == true){
							actualType = "sendType";
						}else if($("#manualType").is(':checked') == true){
							actualType = "manualType";
					  }
					  var stockType = "-1";
						if($("#stockType1").is(':checked') == true){
							stockType = "-1";
						}else if($("#stockType2").is(':checked') == true){
							stockType = "0";
						}else if($("#stockType3").is(':checked') == true){
							stockType = "1";
					  }
					  tab.reload({
						
						where: {
							beginDate:$("#beginDate").val(),
							endDate:$("#endDate").val(),
							shop_id:$("#shop_id").val(),
							market:$("#market").val(),
							prd_no:$("#prd_no").val(),
							take_no:$("#create_time").val(),
							actualType:actualType,
							stockType:stockType,
						}
					  });
					}
				  };
				  self.tab = active;
				  $('.key_search').on('keydown', function(){
					  var e = event || window.event;
					  if(e.keyCode == 13){
						  var type = $(this).data('type');
					
						  active[type] ? active[type].call(this) : '';
					  }
					
				  });
			});
		});
    },
    methods: {
        resetNow:function(){
			var self = this;
			$("#express_sort").val("");
			$("#shop_id").val("");
			$("#market").val("");
			$("#prd_no").val("");
			$("#create_time").val("now");
			self.isShow = true;
			$('#beginDateDiv').show();
		},
		
		getData:function(market,prd_no,sku_name,date){
			var self = this;
			$.ajax({																																													
				url: "/index.php?m=report&c=outOfStockReport&a=getData",																																		
				type: 'post',																																											
				data: {market:market,prd_no:prd_no,sku_name:sku_name,date:date},																																												
				dataType: 'json',																																										
				success: function (data) {
					var myChart = echarts.init(document.getElementById('main'));
					var money = echarts.init(document.getElementById('money'));
					var data_arr = [];
					var series_arr = [];
					var money_arr = [];
					for(var i = 0; i < data.length; i++){
						data_arr.push(data[data.length-1-i].create_time);
						series_arr.push(data[data.length-1-i].actual_num);
						money_arr.push(data[data.length-1-i].now_price);
					}
					var option1 = {
						title: {
							text: '实到数量变动'
						},
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross'
							}
						},
						toolbox: {
							show: true,
							feature: {
								saveAsImage: {}
							}
						},
						xAxis:  {
							type: 'category',
							boundaryGap: false,
							data: data_arr
						},
						yAxis: {
							type: 'value',
							axisLabel: {
								formatter: '{value} '
							},
							axisPointer: {
								snap: true
							}
						},
						visualMap: {
							show: false,
							dimension: 0,
							pieces: [{
								lte: 6,
								color: 'green'
							}, {
								gt: 6,
								lte: 8,
								color: 'green'
							}, {
								gt: 8,
								lte: 14,
								color: 'green'
							}, {
								gt: 14,
								lte: 17,
								color: 'green'
							}, {
								gt: 17,
								color: 'green'
							}]
						},
						series: [
							{
								name:'数量',
								type:'line',
								smooth: true,
								data: series_arr
							}
						]
					};
					myChart.setOption(option1, true);
					
					var option2 = {
						title: {
							text: '历史价格变动'
						},
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross'
							}
						},
						toolbox: {
							show: true,
							feature: {
								saveAsImage: {}
							}
						},
						xAxis:  {
							type: 'category',
							boundaryGap: false,
							data: data_arr
						},
						yAxis: {
							type: 'value',
							axisLabel: {
								formatter: '{value} '
							},
							axisPointer: {
								snap: true
							}
						},
						visualMap: {
							show: false,
							dimension: 0,
							pieces: [{
								lte: 6,
								color: 'green'
							}, {
								gt: 6,
								lte: 8,
								color: 'green'
							}, {
								gt: 8,
								lte: 14,
								color: 'green'
							}, {
								gt: 14,
								lte: 17,
								color: 'green'
							}, {
								gt: 17,
								color: 'green'
							}]
						},
						series: [
							{
								name:'元',
								type:'line',
								smooth: true,
								data: money_arr
							}
						]
					};
					money.setOption(option2, true);
				}																																														
			});
		},
		
		chooseStall:function(){
			var self = this;
			layer.open({																																											
				type: 1,																																											
				title: '选择档口',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['1000px', '550px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#stalls"),																																							
				btn: ['关闭']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					
					layer.close(index);
				},
				cancel: function (index, layero) {																																					
																																																	
				},
				success: function(layero, index){
					self.nowIndex = index;
					self.getStall('','','',1);
				}		
			});
		},
		//导出
		ExcelReport:function()
		{
			var indexLoad = layer.load();
			var take_no = $("#create_time").val();
			var express_sort = $("#express_sort").val();
			var shop_id = $("#shop_id").val();
			var actualType = "";
			if($("#checkType").is(':checked') == true){
				actualType = "checkType";
			}else if($("#sendType").is(':checked') == true){
				actualType = "sendType";
			}else if($("#manualType").is(':checked') == true){
				actualType = "manualType";
			}
            execAjax({
                m:'report',
                c:'outOfStockReport',
                a:'exportTakeOutOfStockReportDetail',
                data:{
					take_no:take_no,
					express_sort:express_sort,
					shop_id:shop_id,
					actualType:actualType,
					beginDate:$("#beginDate").val(),
					endDate:$("#endDate").val(),
					prd_no:$("#prd_no").val(),
				},
                success:function(data){
                    layer.close(indexLoad);
                    $("#excelFileId").val(data['id']);
                    $("#excelForm").submit();
                }
            });	
		},
		SearchReport:function()
		{
			var self = this;
			self.tab.reload({
				where: {
					beginDate:$("#beginDate").val(),
					endDate:$("#endDate").val(),
				}
			  });
			//self.tab.reload()	
		},
		//----------------------------------------------------------生成红单-----------------------------------------------------------------
		checkHaveTodayReport:function(action)
		{
			var self = this;
			$.ajax({																				
				url: "/index.php?m=report&c=outOfStockReport&a=getHaveTodayReport",										
				type: 'post',																		
				async:false,																
				dataType: 'json',																	
				success: function (data) {
					if(data.code == 'ok')
					{
						self.setOutOfStockReportGroup(action);
					}
					else
					{
						layer.confirm('今日已经生成过红单，确定要继续生成吗？', function(index){
							self.setOutOfStockReportGroup(action);
							layer.close(index);
						}); 	
					}
				}
			})	
		},
		setOutOfStockReportGroup:function(action){
			var self = this;
			var indexLoad = layer.load();
			var take_no = $("#create_time").val();
			var prd_no = $("#prd_no").val();
			var beginDate = $("#beginDate").val();
			var endDate = $("#endDate").val();
			var stockType = "-1";
				if($("#stockType1").is(':checked') == true){
					stockType = "-1";
				}else if($("#stockType2").is(':checked') == true){
					stockType = "0";
				}else if($("#stockType3").is(':checked') == true){
					stockType = "1";
			}
			$.ajax({																				
				url: "/index.php?m=report&c=outOfStockReport&a=addTakeOutOfStockList",										
				type: 'post',																		
				data: {take_no:take_no,prd_no:prd_no,beginDate:beginDate,endDate:endDate,stockType:stockType},																	
				dataType: 'json',																	
				success: function (data) {															
					if(data.code == 'ok'){
						console.log(data);
						getRed(self,data.take_no);
						setTimeout(function(){
							timeChange('old');
							$("#create_time").val(data.take_no);
							setTimeout(function(){
								if(action == 'print')
								{
									self.printOutOfStockReportGroup();
								}
								else
								{
									self.exportOutOfStockReportGroup();
								}
								layui.use('table', function(){
									var table = layui.table;
									self.tab.reload();
								});
							},100);
						},300);
						
						layer.close(indexLoad);
					}else{
						layer.close(indexLoad);
						layer.msg(data.msg,{
							icon: 3,
							time: 3000
						});
					}																			
				},
				error: function(){
					layer.close(indexLoad);	
					layer.msg("请求失败，请稍后重试",{
						icon: 3,
						time: 3000
					});
				}																					
			});	
		},
		//=======================================================================================================================================
		//----------------------------------------------------------打印红单-----------------------------------------------------------------
		printOutOfStockReportGroup:function(){
			var take_no = $("#create_time").val();
			var actualType = "";
			if($("#checkType").is(':checked') == true){
				actualType = "checkType";
			}else if($("#sendType").is(':checked') == true){
				actualType = "sendType";
			}else if($("#manualType").is(':checked') == true){
				actualType = "manualType";
			}
			window.open("?m=report&c=outOfStockReport&a=printTakeOutOfStockGroup&take_no="+take_no+"&actualType="+actualType);
		},
		//=======================================================================================================================================
		//----------------------------------------------------------导出红单-----------------------------------------------------------------
		exportOutOfStockReportGroup:function(){
			var take_no = $("#create_time").val();
			var actualType = "";
			if($("#checkType").is(':checked') == true){
				actualType = "checkType";
			}else if($("#sendType").is(':checked') == true){
				actualType = "sendType";
			}else if($("#manualType").is(':checked') == true){
				actualType = "manualType";
			}
			window.open("?m=report&c=outOfStockReport&a=exportTakeOutOfStockGroup&take_no="+take_no+"&actualType="+actualType);
		},
		//=======================================================================================================================================
		//=================================================================================== 获取档口数据 =================================================================================================
		getStall:function(booth,shopname,phone,curr){
			var self = this;
			$.ajax({																				
				url: "/index.php?m=report&c=outOfStockReport&a=getStall",										
				type: 'post',																		
				data: {booth:booth,shopname:shopname,phone:phone,curr:curr},																	
				dataType: 'json',																	
				success: function (data) {															
					if(data.result != 0){
						self.stallArr = data.result;
						self.pageCount = Math.ceil(data.pageNum / 10);
						self.pageNo = curr;
					}else{
						layer.msg("没有查询到数据",{
							icon: 2,
							time: 2000
						});
						self.stallArr = "";
						self.pageCount = 0;
						self.pageNo = 0;
					}																			
				}																					
			});	
		},
		
		stallSearch:function(){
			var self = this;
			var booth = $("#booth").val();
			var shopname = $("#shopname").val();
			var phone = $("#phone").val();
			self.booth = booth;
			self.shopname = shopname;
			self.phone = phone;
			self.getStall(booth,shopname,phone,1);
		},
		//================================================================================= 获取档口数据结束 ===============================================================================================
		
		//================================================================================= 选择档口内input框回车事件 ======================================================================================
		downSearch:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				self.stallSearch();
			}
		},
		//=============================================================================== 选择档口内input框回车事件结束 ====================================================================================
		
		chooseThis:function(market,floor,booth){
			var self = this;
			$("#cus_no").val(market+' '+floor+' '+booth);
			
			layer.close(self.nowIndex);
			
		},
		//====================================================================== 选择档口弹窗内 选择该档口按钮事件结束 =====================================================================================
		
		//==================================================================================档口弹窗分页开始================================================================================================
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
				self.pageNo = self.pageCount;
			}else if(pager == "sure"){
				var num = $(".page_num").val();
				if(num > self.pageCount){
					layer.msg("请输入正确页数",{
						icon: 1,
						time: 2000
					});
					return false;
				}
				self.pageNo = num*1;
			}
			self.getStall(self.booth,self.shopname,self.phone,self.pageNo);
			
		},
		
		//=====================================================================================档口弹窗分页结束=============================================================================================
		
		resetStall:function(){
			$("#booth").val("");
			$("#shopname").val("");
			$("#phone").val("");
		}
    }
});

function timeChange(value){
	if(value == "now"){
		vueObj.isShow = true;
		$('#beginDateDiv').show();
	}else{
		vueObj.isShow = false;
		$('#beginDateDiv').hide();
	}
	layui.use('table', function(){
		var table = layui.table,laydate = layui.laydate;
		vueObj.tab.reload();
	});
}

function getRed(self){
	$.ajax({																				
		url: "/index.php?m=report&c=outOfStockReport&a=getRed",										
		type: 'post',																		
		data: {},																	
		dataType: 'json',																	
		success: function (data) {															
			self.create_time = data;
						
		}																					
	});	
}

function take_price_focus(){
	$(event.target).select();
}

function take_price_blur(){
	var take_no = $(event.target).attr("take_no");
	var has_num = $(event.target).attr("has_num");
	var id = $(event.target).prop("class");
	var take_price = $(event.target).val();

	if(take_no == "0"){
		layer.msg("未生成红单数据不能录入价格与数量，请在红单记录选择已生成记录",{
			icon: 0,
			time: 4000
		});
		return false;
	}
	
	$.ajax({																				
		url: "/index.php?m=report&c=outOfStockReport&a=change",										
		type: 'post',																		
		data: {id:id,has_num:has_num,take_price:take_price},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg(data.msg,{
					icon: 1,
					time: 2000
				});
				$(".layui-laypage-btn").click();
			}else{
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}																			
		}																					
	});
	
	
}

function has_num_focus(){
	$(event.target).select();
}

function has_num_blur(){
	
	var take_no = $(event.target).attr("take_no");
	var has_num = $(event.target).val();
	var id = $(event.target).prop("class");
	var take_price = $(event.target).attr("take_price");
	
	if(take_no == "0"){
		layer.msg("未生成红单数据不能录入价格与数量，请在红单记录选择已生成记录",{
			icon: 0,
			time: 4000
		});
		return false;
	}
	if($("#manualType").is(':checked') != true){
		layer.msg("手动录入到货信息的方式才能修改到货数量",{
			icon: 0,
			time: 4000
		});
		return false;
	}
	
	$.ajax({																				
		url: "/index.php?m=report&c=outOfStockReport&a=change",										
		type: 'post',																		
		data: {id:id,has_num:has_num,take_price:take_price},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg(data.msg,{
					icon: 1,
					time: 2000
				});
				$(".layui-laypage-btn").click();
			}else{
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}																			
		}																					
	});
}

function searchData()
{
	vueObj.tab.reload();
}
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}