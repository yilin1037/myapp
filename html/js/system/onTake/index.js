var onTake = new Vue({
	el: '#onTake',
	data: {                             
		dataArr:[],												//外层交一批次、指派日期...的 数组
		tableArr:[],											//具体内容 数组
		bool:[],												//用来判断外层概括模块点击后内容是否展开或闭合和的 数组
		m:0,													//分页值
		pageNum:0,												//计算总共分几页
		pageArr:[],												//页数赋值 数组
		numArr:{},												//导航菜单内数量 数组
		page:"page1",											//每次点击导航都将值赋给此变量，以便查询按钮获取此变量的值
		status:"WAIT_ASSIGN",									//每次点击导航都将值赋给此变量，以便查询按钮获取此变量的值
		business:[],											//代拿供应商列表 数组
		ispage:"T",												//判断分页按钮点击时是否未代指派模块
		stalls:"",												//档口/代拿商家查询条件
		summary:"",												//代拿批次查询条件
		dateBegin:"",											//开始日期查询条件
		dateEnd:"",												//结束日期查询条件
		isAll:false												//判断是否为选中全部
	},
	mounted: function() {
		var self = this;
		
		//日期选择器=======================================================================================================
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {								//=========
            var $ = layui.jquery, element = layui.element, layer = layui.layer ;								//=========
            var form = layui.form(),layer = layui.layer,layedit = layui.layedit,laydate = layui.laydate;		//=========
            // 初始化表格																						//=========
            var jqtb = $('#dateTable').DataTable({																//=========
                "`dom": '<"top">rt<"bottom"flp><"clear">',														//=========
                "autoWidth": false,                     // 自适应宽度											//=========
                "paging": true,																					//=========
                "pagingType": "full_numbers",																	//=========
                "processing": true,																				//=========
                "serverSide": true,//开启服务器获取数据															//=========
                "fnServerParams": function (aoData) {															//=========
                },																								//=========
                //请求url																						//=========
                "sAjaxSource": "index.php?m=system&c=message&a=getChildAccount",								//=========
                // 初始化表格																					//=========
            });																									//=========
																												//=========
        });																										//=========
		//日期选择器结束===================================================================================================
		
		
		//获取导航菜单数量值==================================================
		$.ajax({
			url: "/index.php?m=system&c=onTake&a=searchNum",
			type: 'post',
			data: {},
			dataType: 'json',
			success: function (data) {
				if(data){
					self.numArr = data;
				}
			}
		});
		//获取导航菜单数量值结束==============================================
		
		//======================================== 加载代指派模块数据 =================================================
		$.ajax({																						//=============
			url: "/index.php?m=system&c=onTake&a=searchWait",											//=============
			type: 'post',																				//=============
			data: {},																					//=============
			dataType: 'json',																			//=============
			success: function (data) {																	//=============
				if(data){																				//=============
					//  self.pageNum  总共分多少页变量，向上取整										//=============
					self.pageNum = Math.ceil(data[0].pageNum / 10);										//=============
																										//=============
					//添加页码值   1,2,3,4......														//=============
					for(var j = 0; j <  Math.ceil(data[0].pageNum / 10); j++){							//=============
						self.pageArr.push(j+1);															//=============
					}																					//=============
					self.tableArr = data;																//=============
				}else{																					//=============
					self.pageNum = 0;																	//=============
					self.pageArr = [];																	//=============
					self.tableArr = [];																	//=============
					$(".pagemsg").css("display","block");
				}																						//=============
			}																							//=============
		});																								//=============
		//====================================== 加载代指派模块数据结束 ===============================================
	},
	methods: {
		//=============================================== 点击展开具体内容事件 ========================================
		//
		//      a  		=>     每个菜单对应下面隐藏的具体内容菜单的  id  名
		//		index   =>     数组内的下角标值，结合  self.bool   内的数组布尔值来操作具体内容标签的显示和隐藏
		//		tab     =>     为防止隐藏标签重名增加的变量
		//		wave    =>     要查询数据的状态值
		//
		//=============================================================================================================
		flod:function(a,index,tab,wave){
			var self = this;
			var toggle = event.currentTarget;
			//================================== 每次点击都将箭头初始化为初始状态 =====================================
			$("." + tab + " .tableOut").find("i").each(function(){										//=============
				$(this).html("&#xe602;");																//=============
			});																							//=============
			//=========================================================================================================
		
			//========================================== 箭头改变方向 =================================================
			if(self.bool[index] == false){																//=============
				$(toggle).find("i").html("&#xe61a;");													//=============
				self.bool[index] = true;															   	//=============
			}else if(self.bool[index] == true){															//=============
				$("#" + a).css("display","none");													 	//=============
				$(toggle).find("i").html("&#xe602;");													//=============
				self.bool[index] = false;																//=============
			}																						 	//=============
			//========================================= 箭头改变方向结束 ==============================================
			
			if(self.bool[index] == true){
			//============================================= 请求数据 ==================================================
				$.ajax({																				//=============
					url: "/index.php?m=system&c=onTake&a=getTable",										//=============
					type: 'post',																		//=============
					data: {data:wave},																	//=============
					dataType: 'json',																	//=============
					success: function (data) {															//=============
						if(data){																		//=============
							$("." + tab + " .tableIn").each(function(){									//=============
								$(this).css("display","none");											//=============
							});																			//=============
																										//=============
							//每次点击将bool内的值都初始化为false										//=============
							for(var i = 0; i < self.bool.length; i++){									//=============
								self.bool[i] = false;													//=============
							}																			//=============
																										//=============
							self.bool[index] = true;													//=============
																										//=============
							self.tableArr = data;														//=============
							$("#" + a).css("display","block");											//=============
						}																				//=============
					}																					//=============
				});																						//=============
			//============================================ 请求数据结束 ===============================================	
			}
		},
		
		//===================================== 导航按钮、查询按钮、分页按钮点击事件 ==================================
		//																								//=============
		//		a   	=>    为 F 时为 分页按钮 点击；为 page(1,2,3...)时为 导航按钮 或 查询按钮 点击；//=============
		//		sta    	=>    要查询的数据对应的 状态值													//=============
		//		page    =>    第几页																	//=============
		//		isPage1 =>    判断是否为代指派页面分页													//=============
		//																		 						//=============
		//=============================================================================================================
		choose:function(a,sta,page,isPage1){
			var self = this;
			self.page = a;
			self.status = sta;
			self.isPage = isPage1;
			
			//重置查询框内容
			if(page != "search"){
				$("#stalls").val("");				
				$("#summary").val("");				
				$("#dateBegin").val("");			
				$("#dateEnd").val("");
			}
			
			var stalls = "";
			var summary = "";
			var dateBegin = "";
			var dateEnd = "";
			
			//每次点击将具体内容模块都隐藏=========================================
			$(".tableIn").each(function(){								//=========			
				$(this).css("display","none");							//=========		
			});															//=========
			//=====================================================================
			
			//每次点击都将箭头初始化为初始状态 ====================================
			$(".tableOut").find("i").each(function(){					//=========
				$(this).html("&#xe602;");								//=========
			});															//=========
			//=====================================================================
			
			//如果为查询按钮=======================================================
			if(page == "search"){										//=========
				if($("#stalls").val() != ""){							//=========
					stalls = $("#stalls").val();						//=========
					self.stalls = stalls;								//=========
				}														//=========
				if($("#summary").val() != ""){							//=========
					summary = $("#summary").val();						//=========
					self.summary = summary;								//=========
				}														//=========
				if($("#dateBegin").val() != ""){						//=========
					dateBegin = $("#dateBegin").val();					//=========
					self.dateBegin = dateBegin;							//=========
				}														//=========
				if($("#dateEnd").val() != ""){							//=========
					dateEnd = $("#dateEnd").val();						//=========
					self.dateEnd = dateEnd;								//=========
				}														//=========
																		//=========
			}															//=========
			//=====================================================================
			
			self.bool = [];
			$("input[name='EFF_ID']").each(function(){
				$(this).prop("checked",false);
			});
			
			$("input[name='current']").each(function(){
				$(this).prop("checked",false);
			});
			
			//==================================================== 分页功能判断点击的是哪个按钮 ===========================================================
			//																																//=============
			//     first       =>       首页按钮																							//=============
			//     previous    =>       上一页按钮																							//=============
			//     next   	   =>       下一页按钮																							//=============
			//     last    	   =>       末页按钮																							//=============
			//																																//=============
			//=============================================================================================================================================
			if(page == "first"){																											//=============
				self.m = 0;																													//=============
			}else if(page == "previous" && self.m > 0){																						//=============
				self.m--;																													//=============
			}else if(page == "next" && self.m <= (self.pageNum - 2)){																		//=============
				self.m++;																													//=============
			}else if(page == "last"){																										//=============
				self.m = self.pageNum - 1;																									//=============
			}else if(page != "first" && page != "previous" && page != "next" && page != "last"){											//=============
				self.m = (page - 1);																										//=============
			}																																//=============
			//================================================== 分页功能判断点击的是哪个按钮结束 =========================================================
			
			//================================================== 导航按钮点击切换模板 =====================================================================
			//																																//=============
			//		a 等于 F 时为分页按钮点击更新数据，不让走此段代码																		//=============
			//																																//=============
			//=============================================================================================================================================
			if(a != "F"){																													//=============
				var toggle = event.currentTarget;																							//=============
				$(".UL li").each(function(){																								//=============
					$(this).css("borderBottom","none");																						//=============
				});																															//=============
																																			//=============
				if(page != "search"){																										//=============
					toggle.style.borderBottom = "3px solid #5FB878";																		//=============
				}																															//=============
																																			//=============
				$(".page").each(function(){																									//=============
					$(this).css("display","none");																							//=============
				});																															//=============
																																			//=============
				$("." + a).css("display","block");																							//=============
			}																																//=============
			//================================================ 导航按钮点击切换模板结束 ===================================================================
			if(isPage1 == "F"){
			if(a != "page1"){
			
			//=================================================== 除待指派模块外的模块 请求数据 ===========================================================	
				$.ajax({																													//=============
					url: "/index.php?m=system&c=onTake&a=getData",																			//=============
					type: 'post',																											//=============
					data: {data:sta, num:self.m, stalls:stalls, summary:summary, dateBegin:dateBegin, dateEnd:dateEnd},						//=============
					dataType: 'json',																										//=============
					success: function (data) {																								//=============
						if(data != 0){																										//=============
																																			//=============
							$(".pagemsg").css("display","none");																			//=============
							//每次请求新的数据都初始化分页数组																				//=============
							self.pageArr = [];																								//=============
																																			//=============
							self.dataArr = data;																							//=============
																																			//=============
							//  self.pageNum  总共分多少页变量，向上取整																	//=============
							self.pageNum = Math.ceil(data[0].pageNum / 10);																	//=============
																																			//=============
							//添加页码值   1,2,3,4......																					//=============
							for(var j = 0; j <  Math.ceil(data[0].pageNum / 10); j++){														//=============
								self.pageArr.push(j+1);																						//=============
							}																												//=============
																																			//=============
							self.bool = [];																									//=============
																																			//=============
							for(var i = 0; i < data.length; i++){																			//=============
								self.bool.push(false);																						//=============
							}																												//=============
																																			//=============
						}else if(data == 0){																								//=============
																																			//=============
							$(".pagemsg").css("display","block");																			//=============
							//若无数据，则全部制空																							//=============
							self.pageArr = [];																								//=============
							self.pageNum = 0;																								//=============
							self.dataArr = [];																								//=============
							self.bool = [];																									//=============
																																			//=============
						}																													//=============
					}																														//=============
				});																															//=============
																																			//=============
			//============================================= 除待指派模块外的模块 请求数据 请求数据结束 ====================================================
			}
			}else if(isPage1 == "T"){
			//========================================================= 待指派模块 请求数据 ===============================================================
				$.ajax({																													//=============
					url: "/index.php?m=system&c=onTake&a=searchWait",																		//=============
					type: 'post',																											//=============
					data: {num:self.m, stalls:stalls, summary:summary, dateBegin:dateBegin, dateEnd:dateEnd},								//=============
					dataType: 'json',																										//=============
					success: function (data) {																								//=============
						if(data){																											//=============
																																			//=============
							$(".pagemsg").css("display","none");																			//=============																												//=============
							self.pageArr = [];																								//=============
																																			//=============
							//  self.pageNum  总共分多少页变量，向上取整																	//=============
							self.pageNum = Math.ceil(data[0].pageNum / 10);																	//=============
																																			//=============
							//添加页码值   1,2,3,4......																					//=============
							for(var j = 0; j <  Math.ceil(data[0].pageNum / 10); j++){														//=============
								self.pageArr.push(j+1);																						//=============
							}																												//=============
							self.tableArr = data;																							//=============
						}else{																												//=============
							$(".pagemsg").css("display","block");																			//=============
							self.pageNum = 0;																								//=============
							self.pageArr = [];																								//=============
							self.tableArr = [];																								//=============
						}																													//=============
					}																														//=============
				});																															//=============
			//======================================================= 待指派模块 请求数据结束 =============================================================	
			}
		},
		selectAll:function(a,tab,isNow){
		//============================================== 当前页全选/全部选 || 全部选中/全部不选 ===========================================================
		//		
			var self = this;
			if(isNow == "now"){
				self.isAll = false;
				if ($("#" + a).prop("checked") == false) { 
				$("#" + a).prop("checked",true);
				$("." + tab + " input[name='EFF_ID']").each(function(){
					$(this).prop("checked", true);
				});  
			} else {  
				$("#" + a).prop("checked",false);
				$("." + tab + " input[name='EFF_ID']").each(function(){
					$(this).prop("checked", false);
				});
			} 
			}else if(isNow == "all"){
				self.isAll = true;
				if ($("#" + a).prop("checked") == false) { 
					$("#" + a).prop("checked",true);
					$("." + tab + " input[name='EFF_ID']").each(function(){
						$(this).prop("checked", true);
					});  
				} else {  
					$("#" + a).prop("checked",false);
					$("." + tab + " input[name='EFF_ID']").each(function(){
						$(this).prop("checked", false);
					});
					self.isAll = false;
				} 
			}
			
			
			
		},
		
		//重置按钮点击事件==============================
		reset1:function(){						//======
			$("#stalls").val("");				//======
			$("#summary").val("");				//======
			$("#dateBegin").val("");			//======
			$("#dateEnd").val("");				//======
		},										//======
		//==============================================
		
		//设定代拿商家点击事件===========================
		setUp:function(){
			var self = this;
			
			if($(".tab input[name='EFF_ID']:checked").length == 0){
				layer.msg('请选择至少一条数据！',{
						icon: 0,
						time: 2000
					});  
				return false;
			}
			
			layer.open({
				type: 1,
				title: '设定代拿商家',
				skin: 'layui-layer-rim', //加上边框
				area: ['30%', '30%'], //宽高
				shade: 0.3,
				content: $("#edit-pages"),
				cancel: function (index, layero) {
					//if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
					//layer.close(index)
					//$("#edit-pages").hide();
					// }
					//return false;
				}
			});
			//取代拿供应商数据
			$.ajax({
				url: "/index.php?m=system&c=onTake&a=getBusiness",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					if(data){
						self.business = data;
					}
				}
			});
		},
		
		//代拿商家查询=============================================================================================================================================================================================================================
		searchBusiness:function(){
			var data = $("#summary1").val();
			
		},
			
		//============================ 设置代拿商家弹窗 确定 按钮点击事件================================
		sure:function(){
			var self = this;
			
			var data = "";
			
			var supply_no = $("#businessmen").val();
			
			$(".tab input[name='EFF_ID']:checked").each(function(){
				data += ($(this).val() + ",");
			});
			
			//==================== 确定后将数据对应代拿商家更改为 选择的 代拿商家编号 =========================
			$.ajax({
				url: "/index.php?m=system&c=onTake&a=setSupplyNo",
				type: 'post',
				data: {data:data, isAll:self.isAll, supply_no:supply_no},
				dataType: 'json',
				success: function (data) {
					if(data.code == "ok"){
						layer.msg('执行成功',{
							icon: 1,
							time: 2000
						});
						//加载代指派模块数据
						
						//关闭弹窗
						layer.closeAll();
						getWait(self,self.numArr,self.pageNum,self.pageArr,self.tableArr);
						
					}else{
						layer.msg('执行失败',{
							icon: 2,
							time: 2000
						});
					}
				}
			});
			//====================================================================================================
			
		},
		
		//取消指派===========================================================================
		//																			//=======
		//		此事件只取消单个商品编号的数据，即商品明细内的取消指派按钮事件		//=======
		//		a   =>     要取消的商品编号											//=======
		//																			//=======
		//===================================================================================
		cancelAssigned:function(a,wave,sku_id){										
			var self = this;														
			if(confirm("确认执行此操作么？")){										
																					
			}else{																	
				return false;														
			}																		
			$.ajax({																
				url: "/index.php?m=system&c=onTake&a=cancelAssigned",				
				type: 'post',														
				data: {data:a,sku_id:sku_id},										
				dataType: 'json',													
				success: function (data) {											
					if(data.code == "ok"){											
						layer.msg('执行成功',{
							icon: 1,
							time: 2000
						});
																					
						getTable(self,wave,self.tableArr);							
																					
					}else{															
						layer.msg('执行失败',{
							icon: 2,
							time: 2000
						});
					}																
				}																	
			});																		
		},																			
		//===================================================================================
		
		//取消指派==============================================================
		//
		//		此事件为取消 一个或多个 批次的数据
		//		tab   =>     此变量为表明目前选择的是哪个模块内的数据
		//
		//======================================================================
		cancelAssigns:function(tab,sta){
			var self = this;
			var data = "";
			if($("." + tab + " input[name='EFF_ID']:checked").length == 0){
				layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});  
				return false;
			}
			
			var a = 0;
			if(sta == 'F'){
				$("." + tab + " input[name='EFF_ID']:checked").each(function(){
					
					if($(this).attr("sta") != "不接单" && $(this).attr("sta") != "待确认价格"){
						layer.msg('只能取消指派不接单或待确认价格的订单',{
							icon: 0,
							time: 2000
						});
						a = 1;
						return false;
					}
				});
			}
			if(a != 0){
				return false;
			}
			
			if(confirm("确认执行此操作么？")){
				
				$("." + tab + " input[name='EFF_ID']:checked").each(function(){
					data += ($(this).val() + ",");
				});
				
			}else{
				return false;
			}
			$.ajax({
				url: "/index.php?m=system&c=onTake&a=cancelAssigns",
				type: 'post',
				data: {data:data, sta:sta, isAll:self.isAll, stalls:self.stalls, summary:self.summary, dateBegin:self.dateBegin, dateEnd:self.dateEnd},
				dataType: 'json',
				success: function (data) {
					if(data.code == "ok"){
						layer.msg('执行成功',{
							icon: 1,
							time: 2000
						});
						//每次点击将具体内容模块都隐藏=========================================
						$(".tableIn").each(function(){								//=========			
							$(this).css("display","none");							//=========		
						});															//=========
						//=====================================================================
						
						//每次点击都将箭头初始化为初始状态 ====================================
						$(".tableOut").find("i").each(function(){					//=========
							$(this).html("&#xe602;");								//=========
						});															//=========
						//=====================================================================
						
						getData(self,sta,0,"","","","",self.numArr,self.pageArr,self.dataArr,self.pageNum,self.bool);
						
					}else{
						layer.msg('执行失败',{
							icon: 2,
							time: 2000
						});
					}
				}
			});
		},
		
		//指派订单
		assigned:function(){
			var self = this;
			
			if($(".tab input[name='EFF_ID']:checked").length == 0){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			if(confirm("确定执行此操作么？")){
				
			}else{
				return false;
			}
			
			var prd_noStr = "";
			var sku_id = "";
			
			var data = [];
			
			//================================ 整合数据 ====================================
			$(".tab input[name='EFF_ID']:checked").each(function(){				//==========
				var index = $(this).attr("index");								//==========
				prd_noStr = ($(this).val() + ",");								//==========
				sku_id = ($(this).attr("sku_id") + ",");
				var newData = {													//==========
					"prd_no":$(this).val(),										//==========
					"take_price":$(this).attr("take_price"),					//==========
					"prd_num":$(this).attr("prd_num"),							//==========
					"title":$(this).attr("title"),								//==========
					"lump":$(this).attr("lump"),								//==========
					"supply_num":$("#assign" + index).val(),					//==========
					"assist_supply_no":$(this).attr("assist_supply_no")			//==========
				};																//==========
				data.push(newData);												//==========
				if(newData.supply_num > newData.prd_num){						//==========
					layer.msg('代拿数量不能大于商品数量，请重新填写',{
						icon: 0,
						time: 2000
					});
					return false;												//==========
				}																//==========
																				//==========
				if(newData.assist_supply_no == ""){								//==========
					layer.msg('含有未选择代拿商家货品',{
						icon: 0,
						time: 2000
					});
					return false;												//==========
				}																//==========
			});																	//==========
			//============================== 整合数据结束 ==================================
			
			$.ajax({																						
				url: "/index.php?m=system&c=onTake&a=assigned",												
				type: 'post',																				
				data: {data:data,isAll:self.isAll,prd_noStr:prd_noStr,sku_id:sku_id},															
				dataType: 'json',																			
				success: function (data) {																	
					if(data.code == "ok"){						
						layer.msg('指派成功',{
							icon: 1,
							time: 2000
						});

						getWait(self,self.numArr,self.pageNum,self.pageArr,self.tableArr);
						
					}else{
						layer.msg('指派失败',{
							icon: 2,
							time: 2000
						});
					}																						
				}																							
			});			
			
		},
		
		//同意调价按钮================================================================================================
		//																								//============
		//		unique_code		=>		货品唯一码														//============
		//		new_price		=>		新价格															//============
		//		wave			=>		批次号															//============
		//																								//============
		//============================================================================================================
		agree:function(unique_code,new_price,wave){														//============
			var self = this;																			//============
			if(confirm("确定同意么？")){																//============
				$.ajax({																				//============
					url: "/index.php?m=system&c=onTake&a=agree",										//============
					type: 'post',																		//============
					data: {unique_code:unique_code,new_price:new_price},								//============
					dataType: 'json',																	//============
					success: function (data) {															//============
						if(data.code = "ok"){															//============
							layer.msg('修改成功',{
								icon: 1,
								time: 2000
							});
																										//============
							getTable(self,wave,self.tableArr);											//============
																										//============
						}else{																			//============
							layer.msg('修改失败',{
								icon: 2,
								time: 2000
							});
						}																				//============
					}																					//============
				});																						//============
			}else{																						//============
				return false;																			//============
			}																							//============
		},																								//============
		//============================================================================================================
		
		//同意价格
		agreePrice:function(){
			var self = this;
			var wave = "";
			if(confirm("确定执行此操作么？")){
				
				$(".tab3 input[name='EFF_ID']:checked").each(function(){
					wave += ($(this).val() +",");
				});
				
				$.ajax({
					url: "/index.php?m=system&c=onTake&a=agreePrice",
					type: 'post',
					data: {data:wave,isAll:self.isAll,stalls:self.stalls, summary:self.summary, dateBegin:self.dateBegin, dateEnd:self.dateEnd},
					dataType: 'json',
					success: function (data) {
						if(data.code == "ok"){
							layer.msg('修改成功',{
								icon: 1,
								time: 2000
							});
							
							getData(self,"WAIT_CONFIRM_PRICE",0,self.stalls,self.summary,self.dateBegin,self.dateEnd,self.numArr,self.pageArr,self.dataArr,self.pageNum,self.bool);
					
						}else{
							layer.msg('修改失败',{
								icon: 2,
								time: 2000
							});
						}
					}
				});
				
			}else{
				return false;
			}
		},
		
		//催单功能
		reminder:function(tab){
			/*var self = this;
			var data = "";
			
			if($("." + tab + "input[name='EFF_ID']:checked").length == 0){
				alert("请选择至少一条数据！");
				return false;
			}
			
			if(confirm("确定执行此操作么？")){
				$("." + tab + "input[name='EFF_ID']:checked").each(function(){
					data = ($(this).val() + ",");
				});
			}else{
				return false;
			}*/
			
		}

	},
});

/* ######################################################################################################### 以下为方法封装 ################################################################################################################################### */

//============================================ 除 待指派 模块外的模块获取数据方法封装 =========================================================
function getData(self,sta,num,stalls,summary,dateBegin,dateEnd,numArr,pageArr,dataArr,pageNum,bool){							//=============
	$.ajax({																													//=============
		url: "/index.php?m=system&c=onTake&a=getData",																			//=============
		type: 'post',																											//=============
		data: {data:"WAIT_CONFIRM_PRICE", num:num, stalls:stalls, summary:summary, dateBegin:dateBegin, dateEnd:dateEnd},		//=============
		dataType: 'json',																										//=============
		success: function (data) {																								//=============
			if(data != 0){																										//=============
				$(".pagemsg").css("display","none");																			//=============
																																//=============
				//获取导航菜单数量值==================================================											//=============
				$.ajax({																										//=============
					url: "/index.php?m=system&c=onTake&a=searchNum",															//=============
					type: 'post',																								//=============
					data: {},																									//=============	
					dataType: 'json',																							//=============
					success: function (data) {																					//=============
						if(data){																								//=============
							self.numArr = data;																					//=============
						}																										//=============
					}																											//=============
				});																												//=============
				//获取导航菜单数量值结束==============================================											//=============
																																//=============
				//每次请求新的数据都初始化分页数组																				//=============
				self.pageArr = [];																								//=============
																																//=============
				self.dataArr = data;																							//=============
																																//=============
				//  self.pageNum  总共分多少页变量，向上取整																	//=============
				self.pageNum = Math.ceil(data[0].pageNum / 10);																	//=============
																																//=============
				//添加页码值   1,2,3,4......																					//=============
				for(var j = 0; j <  Math.ceil(data[0].pageNum / 10); j++){														//=============
					self.pageArr.push(j+1);																						//=============
				}																												//=============
																																//=============
				self.bool = [];																									//=============
																																//=============
				for(var i = 0; i < data.length; i++){																			//=============
					self.bool.push(false);																						//=============
				}																												//=============
																																//=============
				}else if(data == 0){																							//=============
					$(".pagemsg").css("display","block");																		//=============
																																//=============
					//获取导航菜单数量值==================================================										//=============
					$.ajax({																									//=============
						url: "/index.php?m=system&c=onTake&a=searchNum",														//=============
						type: 'post',																							//=============
						data: {},																								//=============
						dataType: 'json',																						//=============
						success: function (data) {																				//=============
							if(data){																							//=============
								self.numArr = data;																				//=============
							}																									//=============
						}																										//=============
					});																											//=============
					//获取导航菜单数量值结束==============================================										//=============
																																//=============
					//若无数据，则全部制空																						//=============
					self.pageArr = [];																							//=============
					self.pageNum = 0;																							//=============
					self.dataArr = [];																							//=============
					self.bool = [];																								//=============
																																//=============
				}																												//=============
			}																													//=============
		});																														//=============
}																																//=============
//=============================================================================================================================================

//======================================================== 获取数据明细方法封装 ===============================================================
function getTable(self,wave,tableArr){																							//=============
	$.ajax({																													//=============		
		url: "/index.php?m=system&c=onTake&a=getTable",																			//=============		
		type: 'post',																											//=============		
		data: {data:wave},																										//=============		
		dataType: 'json',																										//=============		
		success: function (data) {																								//=============		
			if(data){																											//=============
																																//=============
				self.tableArr = data;																							//=============		
			}																													//=============		
		}																														//=============		
	});																															//=============
}																																//=============
//=============================================================================================================================================

//================================================= 获取导航菜单数据数量方法封装 ==============================================================
function getNum(self,numArr){																									//=============
	//获取导航菜单数量值==================================================														//=============
	$.ajax({																													//=============
		url: "/index.php?m=system&c=onTake&a=searchNum",																		//=============
		type: 'post',																											//=============
		data: {},																												//=============
		dataType: 'json',																										//=============
		success: function (data) {																								//=============
			if(data){																											//=============
				self.numArr = data;																								//=============
			}																													//=============
		}																														//=============
	});																															//=============
	//获取导航菜单数量值结束==============================================														//=============
}																																//=============
//=============================================================================================================================================

//============================================================ 加载代指派模块数据 =============================================================
function getWait(self,numArr,pageNum,pageArr,tableArr){																			//=============
																																//=============
	$.ajax({																													//=============
		url: "/index.php?m=system&c=onTake&a=searchWait",																		//=============
		type: 'post',																											//=============
		data: {},																												//=============
		dataType: 'json',																										//=============
		success: function (data) {																								//=============
			if(data != 0){																										//=============
				$(".pagemsg").css("display","none");																			//=============
				//获取导航菜单数量值==================================================											//=============
				$.ajax({																										//=============
					url: "/index.php?m=system&c=onTake&a=searchNum",															//=============
					type: 'post',																								//=============
					data: {},																									//=============
					dataType: 'json',																							//=============
					success: function (data) {																					//=============
						if(data){																								//=============
							self.numArr = data;																					//=============
						}																										//=============
					}																											//=============
				});																												//=============
				//获取导航菜单数量值结束==============================================											//=============
																																//=============
				//  self.pageNum  总共分多少页变量，向上取整																	//=============
				self.pageNum = Math.ceil(data[0].pageNum / 10);																	//=============
																																//=============
				//添加页码值   1,2,3,4......																					//=============
				for(var j = 0; j <  Math.ceil(data[0].pageNum / 10); j++){														//=============
					self.pageArr.push(j+1);																						//=============
				}																												//=============
				self.tableArr = data;																							//=============
			}else{																												//=============
				//获取导航菜单数量值==================================================											//=============
				$.ajax({																										//=============
					url: "/index.php?m=system&c=onTake&a=searchNum",															//=============
					type: 'post',																								//=============
					data: {},																									//=============
					dataType: 'json',																							//=============
					success: function (data) {																					//=============
						if(data){																								//=============
							self.numArr = data;																					//=============
						}																										//=============
					}																											//=============
				});																												//=============
				//获取导航菜单数量值结束==============================================											//=============
				$(".pagemsg").css("display","block");																			//=============
				self.pageNum = 0;																								//=============
				self.pageArr = [];																								//=============
				self.tableArr = [];																								//=============
			}																													//=============
		}																														//=============
	});																															//=============
}																																//=============
//=============================================================================================================================================


