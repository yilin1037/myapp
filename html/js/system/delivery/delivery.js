mini.parse();
var grid1 = mini.get('grid1');
grid1.load();

grid1.on("drawcell", function (e) {
	
});

grid1.on("select", function (e) {
	getSelectCount();
})
grid1.on("deselect", function (e) {
	getSelectCount();
});
var quickStrike = $("#quickStrike").val();
var layer;
var flow = new Vue({
	el: '#flow',
	data: {
		print:"0",                                               //标签打印组内是否打印标记
		facePrint:"0",											 //面单组内是否打印标记
		delivery:"0",                                             //配货方式
		stock_order:"",                                          //库存类型
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
		order:"PaymentDown",                                     //排序规则
		sysPlan:"",
		coding:true,											 //------------------
		orderAmount:false,										 //-----
		baby_Num:false,											 //-----
		noRemark:false,											 //-----
		haveRemark:false,										 //-----
		repeatOrder:false,										 //-----
		sameBuyer:false,										 //-----
		isSingle:false,											 //-----
		multiple:false,											 //-----
		variety:false,											 //----- 
		equipped:false,											 //-----均为状态值判断
		picking:false,											 //-----
		stock:false,											 //-----
		allocated:false,										 //-----
		refunds:false,											 //-----
		norefunds:false,
		ship:false,												 //-----
		merge:false,											 //-----
		contain:"y",											 //-----
		banShow:false,											 //-----
		index:"F",												 //------------------
		provinceArr:[],	
		isShow:false,
		isShowM:0,
		shopArr:[],
		shippingClientArr:[],
		expressArr:[],											
		storageArr:[],	
		gridArr:[],												 //表格数据
		numdataArr:[],											 //按钮显示订单数量
		itemArr:[],
		waybillMakeMsg:[],
		dsosMakeMsg:[],
		pageCount:0,											 //总页数
		pageNo:1,												 //页数				
		pageSize:100, 											 //页码
		result_total:0,											 //全部订单数量
		printType:"",
		sellerType:0,
		layprint:[],
		layprintTplBq:[],
		layprintTplDSOS:[],
		isAll:0,
		searchData:{},
		split_print_tid:'',
		face:"",
		expressSort:[],
		layprintTplYd:[],
		printTplDzmd:{},
		preDeliveryMsg:[],
		logArr:[],
		ItemModify:[],
		send_error:"no",
		defaultMsg:[],
		actiontd:true,
		nowPage:false,
		allPage:false,
		isFirst:true,
		exception:"no",
		splitItemArr:[],
		payway:"",												 //支付方式
		webStatus:"",											 //线上状态
		memoryPrice:0,
		changeMonAnno:0,
		isDF:'F',            //判断修改快递取消发货是否是代发快递
		DROP_SHIPPING:"F",
		shippingId:"",
		editData:[],
		deliDetailsed:"",										//已发货页面详情点击的订单信息
		signStatusArr:[],
		shopAuthArr:[],
		showshop:false,
		versionSwitch:true,	//列表模式
		fetchDetailArr:[],
		oid:"",
		accountPrivileges:false 							//false  子账号   true  主账号
	},
	mounted: function() {
		var self = this;
		if(quickStrike==1){
			self.babyNum = 3;																																							
			$("#searchArr .sin").remove();	
			$("#searchArr").append("<span class='add sin rem' style='border:1px solid #000;'>多款多件<i class='dele' style='display:block' id='babyGroup' onclick='closeNow(\"babyGroup\")'></i></span>");									
			self.variety = true;																																						
			self.isSingle = false;																																						
			self.multiple = false;		
		}
		//日期选择器
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {
			layer = layui.layer;
            var $ = layui.jquery, element = layui.element;											
            var form = layui.form(),layedit = layui.layedit,laydate = layui.laydate;
            // 初始化表格
            var jqtb = $('#dateTable').DataTable({
                "`dom": '<"top">rt<"bottom"flp><"clear">',
                "autoWidth": false,
                "paging": true,
                "pagingType": "full_numbers",
                "processing": true,
                "serverSide": true,
                "fnServerParams": function (aoData) {
                },
                "sAjaxSource": "index.php?m=system&c=message&a=getChildAccount",
            });
			form.on('switch(versionSwitch)', function(data){
				// console.log(data.elem); //得到checkbox原始DOM对象
				// console.log(data.elem.checked); //开关是否开启，true或者false
				// console.log(data.value); //开关value值，也可以通过data.elem.value得到
				// console.log(data.othis); //得到美化后的DOM对象
				if(data.elem.checked == false){
					$("#bottomDiv").css("display","none");
					$("#grid1").css("display","block");
					$("#biaotou").css("display","none");
				}else{
					$("#bottomDiv").css("display","block");
					$("#grid1").css("display","none");
					$("#biaotou").css("display","block");
				}
				flow.versionSwitch = data.elem.checked;
				searchALLNow(self,'F');
			}); 
        });	
		//日期选择器结束
		
		//返回顶部、操作航固定
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

		$.ajax({
			url: "/index.php?m=system&c=delivery&a=accountPrivileges",
			type: 'post',
			data: {},
			dataType: 'json',
			success: function (data) {	
				var self =this;
				self.accountPrivileges=data.data;
			}
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
			}
		}
		/*if(isexpress=='on'){
			$("#isexpress").show();
		}else{
			$("#isexpress").hide();
		}*/
		$("#isexpress").show();
		$("#faceWaybill").hide();
		$("#printWaybill").hide();
		$("#faceAlone").show();
		$("#exportTakeGoodsHtml").html("导出拿货单");
		$("#manualOrderdel").show();
		$("#orderApproval").hide();
		$("#orderReApproval").hide();
		$("#warningTime").hide();
		$("#warningText").hide();
		$("#falseSendText").hide();
		$("#falseTime").hide();
		$("#expressStatus").hide();
		if(IS_FETCH != 'T'){
			$("#printDSOSBtnFetch").hide();	
			$("#printCollectGoodsFetch").hide();	
		}
		
		if(sysPlan == "split"){//部分发货
			self.sysPlan = sysPlan;
			$("#orderMergeSplit").hide();
			$("#reOrderThink").hide();
			$("#manualOrderdel").hide();
			$("#directOrderSend").hide();
			$("#directOrderPreSend").hide();
			$("#printWaybillMake").hide();
			$("#printDSOSMake").hide();
			$("#batchRemarkUpload").hide();
			$("#batchSetRemark").hide();
			$("#mulitPackage").hide();
			$("#warningTime").hide();
			$("#warningText").hide();
			$("#setWholeStock").hide();
			$("#falseSendText").hide();
			$("#falseTime").hide();
			$("#expressStatus").hide();
			$("#printDSOSBtnFetch").hide();	
			$("#isexpress").hide();
			//$("#otherSplit").hide();

		}else if(sysPlan == "send"){//整单发货
			self.sysPlan = sysPlan;
			$("#orderMergeSplit").hide();
			//$("#exportTakeGoods").hide();
			$("#modifyExpressNo").hide();
			$("#printUnique").hide();
			$("#bannerBtn").hide();
			$("#createUnique").hide();
			$("#setWholeStock").hide();
			$("#close_label").hide();
			$("#mulitPackage").hide();
			/*if(isexpress=='on'){
			$("#isexpress").show();
			}else{
			$("#isexpress").hide();
			}*/
			$("#printWaybill").show();
			$("#faceAlone").hide();
			$("#changeExpress").hide();
			$("#changeStorage").hide();
			//$("#orderLockPage").hide();
			//$("#orderLock").hide();
			$("#preDelivery").hide();
			$("#expressGet").hide();
			$("#orderCancel").hide();
			//$(".fi.status").hide();
			$("#addOrdersbtn").hide();
			$("#modifyWl").show();
			$("#cancelSend").show();
			$("#orderSplit").hide();
			$("#orderMerge").hide();
			$("#orderSplitCancel").hide();
			$("#submitDistributionBtn").hide();
			$("#printYdBtn").hide();
			$("#preDeliveryForce").hide();
			//$("#expressCancel").hide();
			$(".chaifendan").hide();
			//$(".gaiqizhi").hide();
			$("#reOrderThink").hide();
			$("#printCollectGoods").hide();
			$("#vendorTep").hide();
			self.actiontd = false;
			$("#exportTakeGoodsHtml").html("导出发货汇总");
			$("#manualOrderdel").hide();
			$("#directOrderSend").hide();
			$("#directOrderPreSend").hide();
			$("#printWaybillMake").show();
			$("#printDSOSMake").hide();
			$("#batchRemarkUpload").hide();
			$("#batchSetRemark").hide();
			$("#warningTime").hide();
			$("#warningText").hide();
			$("#falseSendText").hide();
			$("#falseTime").hide();
			$("#expressStatus").hide();
			$("#orderStatus").html('<option value="0">选择订单状态</option><option value="LOCK">锁定</option>');
			$("#printDSOSBtnFetch").hide();	
			//$("#otherSplit").hide();
			$("#printCollectGoodsFetch").hide();	
			$("#isexpress").hide();
		}else if(sysPlan == "approval"){//审单页面
			self.sysPlan = sysPlan;
			$("#createUnique").hide();
			$("#setWholeStock").hide();
			$("#printUnique").hide();
			$("#preDelivery").hide();
			/*if(isexpress=='on'){
			$("#isexpress").show();
				}else{
			$("#isexpress").hide();
			}*/
			$("#faceWaybill").hide();
			$("#faceAlone").hide();
			$("#preDeliveryForce").hide();
			$(".exportPrint").hide();
			$("#close_label").hide();
			$("#modifyWl").hide();
			$("#cancelSend").hide();
			$("#expressGet").hide();
			$("#expressCancel").hide();
			$("#directOrderSend").hide();
			$("#directOrderPreSend").hide();
			$("#orderApproval").show();
			$("#orderReApproval").hide();
			$("#mulitPackage").hide();
			$("#warningTime").hide();
			$("#warningText").hide();
			$("#falseSendText").hide();
			$("#falseTime").hide();
			$("#expressStatus").hide();
			$("#isexpress").hide();
			$("#orderStatus").html('<option value="0">选择订单状态</option><option value="WAIT_ASSIGN">待审核</option><option value="LOCK">锁定</option><option value="UNLOCK">待审核未锁定</option><option value="UNLOCKN">未锁定</option>');
		}else if(sysPlan == "waitsend"){//待发货
			self.sysPlan = sysPlan;
			$("#addOrdersbtn").hide();
			$(".chaifendan").hide();
			$("#orderReApproval").show();
			$("#warningTime").hide();
			$("#warningText").hide();
			$("#falseSendText").hide();
			$("#falseTime").hide();
			$("#expressStatus").hide();
		}else if(sysPlan == "waitsendsplit"){//待发货部分发货
			self.sysPlan = sysPlan;
			$("#addOrdersbtn").hide();
			$(".chaifendan").hide();
			$("#orderReApproval").show();
			$("#warningTime").hide();
			$("#warningText").hide();
			$("#falseSendText").hide();
			$("#falseTime").hide();
			$("#expressStatus").hide();
			$("#printDSOSBtnFetch").hide();	
			$("#printCollectGoodsFetch").hide();	
			$("#isexpress").hide();
		}else if(sysPlan == "overTime"){
			self.sysPlan = sysPlan;
			$("#mulitPackage").hide();
			$("#warningTime").show();
			$("#warningText").show();
			$("#falseSendText").hide();
			$("#falseTime").hide();
			$("#expressStatus").hide();
			$("#printDSOSBtnFetch").hide();	
			$("#printCollectGoodsFetch").hide();	
			$("#isexpress").hide();
		}else if(sysPlan == "falseSend"){
			self.sysPlan = sysPlan;
			$("#mulitPackage").hide();
			$("#warningTime").hide();
			$("#warningText").hide();
			$("#falseSendText").show();
			$("#falseTime").show();
			$("#expressStatus").show();
			$("#printDSOSBtnFetch").hide();	
			$("#printCollectGoodsFetch").hide();	
			$("#isexpress").hide();
		}
		
		if(self.DROP_SHIPPING == "T"){//代发
			$("#addOrdersbtn").hide();
			$("#createUnique").hide();
			$("#setWholeStock").hide();
			$("#printUnique").hide();
			$("#changeExpress").hide();
			$(".btnGroupList").hide();
			$(".gaiqizhi").show();
			$(".actionlist").show();
			$(".exportPrint").show();
			$("#changeStorage").hide();
			$("#orderCancel").hide();
			$("#close_label").hide();
			$("#expressCancel").hide();
			$("#reOrderThink").hide();
			$("#manualOrderdel").hide();
			$("#directOrderSend").hide();
			//$("#expressGet").hide();
			//$("#printDSOSBtn").hide();
			$("#exportTakeGoods").hide();
			$("#vendorTep").hide();
			$("#printCollectGoods").hide();
			$("#printWaybill").hide();
			$("#orderOutputBtn").hide();
			$("#orderOutputBtn2").hide();
			$("#printDSOSMake").hide();
			$("#signStatusManage").hide();
			$("#replacePrd").hide();
			$("#batchRemarkUpload").hide();
			$("#batchSetRemark").hide();
			$("#warningTime").hide();
			$("#warningText").hide();
			$("#falseSendText").hide();
			$("#falseTime").hide();
			$("#expressStatus").hide();
			$("#printDSOSBtnFetch").hide();	
			$("#printCollectGoodsFetch").hide();	
			$("#isexpress").hide();
			if(sysPlan == "send"){//整单发货
				$("#faceWaybill").show();
				$("#printWaybillMake").show();
				$("#printYdBtn").show();
				$("#warningTime").hide();
				$("#warningText").hide();
				$("#falseSendText").hide();
				$("#falseTime").hide();
				$("#expressStatus").hide();
				//$(".exportPrint").hide();
				//$(".gaiqizhi").hide();				
			}
		}
		
		/*$.ajax({
			url: "/index.php?m=system&c=delivery&a=getFuncPrem",
			type: 'post',
			data: {},
			dataType: 'json',
			success: function (data) {		
				if(data.code == "error"){
				//	$("#preDelivery").hide();
					$("#faceAlone").hide();
					$("#faceWaybill").hide();
					$("#preDeliveryForce").hide();
					$("#directOrderSend").hide();
					$("#directOrderPreSend").hide();
				}
			}
		});*/
		
		reloadSearchPlan();//查询方案
		
		//获取店铺
		if(self.DROP_SHIPPING == "T"){
			self.shopArr = {};
			self.expressArr = {};
			self.storageArr = {};
			self.signStatusArr = {};
			self.shopAuthArr = {};
		}else{
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getShop",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					self.shopArr = data;
					$(document).ready(function(){
						$('.skin-minimal-shop input').iCheck({
							checkboxClass: 'icheckbox_minimal',
							radioClass: 'iradio_minimal',
							increaseArea: '20%'
						});
					});
				}
			});
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getExpress",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					self.expressArr = data;
				}
			});	

			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getStorage",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					self.storageArr = data;
				}
			});	
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getSignStatus",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					self.signStatusArr = data;
				}
			});	
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getfetchDetail",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					self.fetchDetailArr = data;
				}
			});	
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getAuthCheck",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					self.shopAuthArr = data;
					if(data.length > 0){
						layer.open({
							type: 1,																																											
							title: '授权过期店铺',																																								
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['450px', '350px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#edit-pages19"),																																							
							cancel: function (index, layero) {																																					

							}																																													
						});
					}
				}
			});
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
		
		if(localStorage.getItem("placeArr")){
			self.provinceArr = JSON.parse(localStorage.getItem("placeArr"));
		}
		
		searchALLNow(self,'page');

		if(sysPlan != 'send'){
			this.refreshTotal();
		}
		

	},
	methods: {
		
		//查询模块标签点击事件
		//点击时通过传过来的值判断是哪个标签执行此方法
		//$(".labelGroup div").each(function(){
		//	$(".labelGroup .ic").remove();
		//	$(this).css("borderColor","#c2c2c2");
		//});
		//		类似此类代码均为做每个组内的初始化操作
		//=============================
		//				|
		//				|
		//				|	
		//			 	|  
		//			  \	| /
		//			   \|/
		searchAdd:function(group,who){
			layer.load(2);
			var self = this;
			var toggle = event.currentTarget;
			//标签打印组选择标签
			//此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.print 查询时直接拿此变量值即可
			//点击全部时 self.print 恢复默认值
			if(group == "labelGroup"){																																								
				$(".labelGroup div").each(function(){																																				
					$(".labelGroup .ic").remove();																																					
					$(this).removeClass("border");																																			
				});																																													
				$(toggle).append("<i class='ic'></i>");																															
				$(toggle).addClass("border");																																				
				if(who == "donnot"){																																								
					self.print = "1";																																									
					$("#searchArr .lab").remove();																																					
					$("#searchArr").append("<span class='add lab rem'>标签未打印<i class='dele' id='labelGroup' onclick='closeNow(\"labelGroup\")'></i></span>");									
				}else if(who == "do"){																																								
					self.print = "2";																																									
					$("#searchArr .lab").remove();																																					
					$("#searchArr").append("<span class='add lab rem'>标签已打印<i class='dele' id='labelGroup' onclick='closeNow(\"labelGroup\")'></i></span>");									
				}else if(who == "all"){																																								
					self.print = "0";																																									
					$("#searchArr .lab").remove();																																					
				}																																													
			}																																														
			//================================================================================标签打印组选择标签结束=============================================================================================
			
			//====================================================================================面单打印组选择标签=============================================================================================
			//																																														=============
			//		此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.facePrint 查询时直接拿此变量值即可																					=============
			//		点击全部时 self.facePrint 恢复默认值																																			=============
			//																																														=============
			//===================================================================================================================================================================================================
			else if(group == "faceGroup"){																																							
				$(".faceGroup div").each(function(){																																				
					$(".faceGroup .ic").remove();																																					
					$(this).removeClass("border");																																			
				});																																												
				$(toggle).append("<i class='ic'></i>");																															
				$(toggle).addClass("border");																																			
				if(who == "faceDonnot"){																																							
					self.facePrint = "1";																																								
					$("#searchArr .face").remove();																																					
					$("#searchArr").append("<span class='add face rem'>面单未打印<i class='dele' id='faceGroup' onclick='closeNow(\"faceGroup\")'></i></span>");									
				}else if(who == "faceDo"){																																							
					self.facePrint = "2";																																								
					$("#searchArr .face").remove();																																					
					$("#searchArr").append("<span class='add face rem'>面单已打印<i class='dele' id='faceGroup' onclick='closeNow(\"faceGroup\")'></i></span>");									
				}else if(who == "faceMore"){																																						
					self.facePrint = "3";																																								
					$("#searchArr .face").remove();																																					
					$("#searchArr").append("<span class='add face rem'>面单多次打印<i class='dele' id='faceGroup' onclick='closeNow(\"faceGroup\")'></i></span>");									
				}else if(who == "all"){																																								
					self.facePrint = "0";																																								
					$("#searchArr .face").remove();																																					
				}																																													
			}																																														
			//==================================================================================标签打印组选择标签结束===========================================================================================
			
			//====================================================================================配货方式组选择标签=============================================================================================
			//																																														=============
			//		此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.delivery 查询时直接拿此变量值即可																					=============
			//		点击全部时 self.delivery 恢复默认值																																				=============
			//																																														=============
			//===================================================================================================================================================================================================
			else if(group == "picGroup"){																																							
				$(".picGroup div").each(function(){																																				
					$(".picGroup .ic").remove();																																					
					$(this).removeClass("border");																																			
				});																																												
				$(toggle).append("<i class='ic'></i>");																															
				$(toggle).addClass("border");																																				
				if(who == "shop"){																																								
					self.stock_order = "0";																																							
					$("#searchArr .deli").remove();																																					
					$("#searchArr").append("<span class='add deli rem'>市场货<i class='dele' id='picGroup' onclick='closeNow(\"picGroup\")'></i></span>");											
				}else if(who == "storage"){																																							
					self.stock_order = "1";																																							
					$("#searchArr .deli").remove();																																					
					$("#searchArr").append("<span class='add deli rem'>库存货<i class='dele' id='picGroup' onclick='closeNow(\"picGroup\")'></i></span>");											
				}else if(who == "all"){																																								
					self.stock_order = "";																																							
					$("#searchArr .deli").remove();																																					
				}																																													
			}																																														
			//====================================================================================标签打印组选择标签结束=========================================================================================
			
			//======================================================================================条件筛选组选择标签===========================================================================================
			//																																														=============
			//		此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.remark 查询时直接拿此变量值即可																						=============
			//		此组无全部按钮，所以第二次点击相同标签，需取消选中状态，同时 self.remark 恢复为默认值，所以要多做一层判断																		=============
			//      判断方法：通过在 data 内给定每个标签一个对应的变量 记录此时是否为选中状态																										=============
			//					self.haveRemark   --------  有留言或有备注 标签是否选中																												=============
			//					self.noRemark     --------  无留言且无备注 标签是否选中																												=============
			//																																														=============
			//===================================================================================================================================================================================================
			else if(group == "conditionGroup"){																																						
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
						self.repeatOrder = false;
						self.sameBuyer = false;						
					}else if(self.haveRemark == true){																																				
						self.remark = "";																																							
						$("#searchArr .remar").remove();																																			
						self.haveRemark = false;
						self.noRemark = false;
						self.repeatOrder = false;
						self.sameBuyer = false;							
						$(".conditionGroup .ic").remove();																																			
						$(toggle).removeClass("border");																																	
					}																																												
				}else if(who == "noRemark"){																																						
					if(self.noRemark == false){																																						
						self.remark = "2";																																							
						$("#searchArr .remar").remove();																																			
						$("#searchArr").append("<span class='add remar rem'>无留言无备注<i class='dele' id='conditionGroup' onclick='closeNow(\"conditionGroup\")'></i></span>");					
						self.noRemark = true;																																						
						self.haveRemark = false;
						self.repeatOrder = false;
						self.sameBuyer = false;
					}else if(self.noRemark == true){																																				
						self.remark = "";																																							
						$("#searchArr .remar").remove();																																			
						self.noRemark = false;
						self.haveRemark = false;
						self.repeatOrder = false;
						self.sameBuyer = false;						
						$(".conditionGroup .ic").remove();																																			
						$(toggle).removeClass("border");																																		
					}																																												
				}else if(who == "repeatOrder"){	
					self.remark = "";
					if(self.repeatOrder == false){																																																																												
						$("#searchArr .remar").remove();																																			
						$("#searchArr").append("<span class='add remar rem'>重复下单<i class='dele' id='conditionGroup' onclick='closeNow(\"conditionGroup\")'></i></span>");
						self.repeatOrder = true;																																						
						self.haveRemark = false;
						self.noRemark = false;
						self.sameBuyer = false;
					}else if(self.repeatOrder == true){
						$("#searchArr .remar").remove();																																			
						self.repeatOrder = false;
						self.haveRemark = false;
						self.noRemark = false;
						self.sameBuyer = false;
						$(".conditionGroup .ic").remove();																																			
						$(toggle).removeClass("border");																																		
					}
				}else if(who == "sameBuyer"){
					self.remark = "";
					if(self.sameBuyer == false){																																																																												
						$("#searchArr .remar").remove();																																			
						$("#searchArr").append("<span class='add remar rem'>相同买家<i class='dele' id='conditionGroup' onclick='closeNow(\"conditionGroup\")'></i></span>");
						self.sameBuyer = true;																																						
						self.haveRemark = false;
						self.noRemark = false;
						self.repeatOrder = false;
					}else if(self.sameBuyer == true){
						$("#searchArr .remar").remove();																																			
						self.sameBuyer = false;
						self.haveRemark = false;
						self.noRemark = false;
						self.repeatOrder = false;
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
			//					self.stock   	--------  待配货   标签是否选中																														=============
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
						$("#searchArr").append("<span class='add equip rem'>待配货<i class='dele' id='statusGroup' onclick='closeNow(\"statusGroup\")'></i></span>");									
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
						self.refunds = true;
						self.norefunds = false;
						self.ship = false;																																							//===========
						self.merge = false;																																							//===========
					}else if(self.refunds == true){																																					//===========
						self.refunds = false;																																						//===========
						self.special = "";																																							//===========
						$("#searchArr .refu").remove();																																				//===========
						$(".specialGroup .ic").remove();																																			//===========
						$(toggle).removeClass("border");																																		//===========
					}																																												//===========
				}else if(who == "norefunds"){
					if(self.norefunds == false){																																						//===========
						self.special = "notuikuan";																																					//===========
						$("#searchArr .refu").remove();																																				//===========
						$("#searchArr").append("<span class='add refu rem'>无申请退款<i class='dele' id='specialGroup' onclick='closeNow(\"specialGroup\")'></i></span>");							//===========
						self.norefunds = true;
						self.refunds = false;																																						//===========
						self.ship = false;																																							//===========
						self.merge = false;																																							//===========
					}else if(self.norefunds == true){																																					//===========
						self.norefunds = false;																																						//===========
						self.special = "";																																							//===========
						$("#searchArr .refu").remove();																																				//===========
						$(".specialGroup .ic").remove();																																			//===========
						$(toggle).removeClass("border");																																		//===========
					}			
				}else if(who == "split"){																																							//===========
					if(self.ship == false){																																							//===========
						self.special = "chaibao";																																					//===========
						$("#searchArr .refu").remove();																																				//===========
						$("#searchArr").append("<span class='add refu rem'>拆包发货<i class='dele' id='specialGroup' onclick='closeNow(\"specialGroup\")'></i></span>");							//===========
						self.ship = true;																																							//===========
						self.refunds = false;
						self.norefunds = false;
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
						self.refunds = false;
						self.norefunds = false;
						self.ship = false;																																							//===========
					}else if(self.merge == true){																																					//===========
						self.merge = false;																																							//===========
						self.special = "";																																							//===========
						$("#searchArr .refu").remove();																																				//===========
						$(".specialGroup .ic").remove();																																			//===========
						$(toggle).removeClass("border");																																		//===========
					}																																												//===========
				}																																													//===========
																																																	//===========
			}																																														//===========
			self.send_error = "no";																																										
			$("#searchArr .sendError").remove();																																														
			searchALLNow(self,'F');																																										
		},																																															//===========
		//特殊订单组选择标签结束
		
		//重置按钮
		resetNow:function(){
			var self = this;
			resetF(self,'F');
			$("#shipping").val('0');
			shippingChange('');
		},
		//=========重置结束=========
		
		//刷新统计开始
		refreshTotal:function(){
			if($("#refreshTotal").hasClass("btn") == false){
				return false;
			}
			$("#refreshTotal").html("刷新中...");
			$("#refreshTotal").addClass("layui-btn-disabled");
			$("#refreshTotal").removeClass("btn");
			$("#refreshTotal").addClass("btnOnlyStyle");
			var self = this;
			var sysPlan = self.sysPlan;
			var DROP_SHIPPING = self.DROP_SHIPPING;
			var shippingId = self.shippingId;

			var dateBegin = $('#dateBegin').val();
			dateBegin = Date.parse(new Date(dateBegin));
			dateBegin = dateBegin / 1000;

			var dateEnd = $('#dateEnd').val();
			if (dateEnd.length != 0 ) {
				dateEnd = Date.parse(new Date(dateEnd));
				dateEnd = dateEnd / 1000;
			} else {
				dateEnd = 0;
			}

			$.ajax({
				url: "/index.php?m=system&c=delivery&a=refreshTotal",
				type: 'post',
				data: {sysPlan: sysPlan, DROP_SHIPPING: DROP_SHIPPING, shippingId: shippingId, dateBegin: dateBegin, dateEnd: dateEnd},
				dataType: 'json',
				success: function (data) {
					$("#refreshTotal").html("刷新统计");
					$("#refreshTotal").removeClass("layui-btn-disabled");
					$("#refreshTotal").addClass("btn");
					$("#refreshTotal").removeClass("btnOnlyStyle");
					if(data){
						$(".refreshTotal").html("刷新统计");
						self.numdataArr = data;
					}
				}
			});
		},
		//================刷新统计结束
		//==========================查询方法=======================
		searchALL:function(){
			var self = this;
			layer.load(2);
			$("#searchALL").addClass("layui-btn-disabled");
			$("#searchALL").removeClass("btn");
			$("#searchALL").addClass("btnOnlyStyle");
			searchALLNow(self,'F',function(){
				layer.closeAll('loading');
				$("#searchALL").removeClass("layui-btn-disabled");
				$("#searchALL").addClass("btn");
				$("#searchALL").removeClass("btnOnlyStyle");
			});
		},
		//========================查询方法结束=====================
		
		//========================选择省份弹窗=====================
		choosePlace:function(){
			var self = this;
			$(".placesCheckBox").iCheck('uncheck');
			self.contain = "y";
			self.index = "F";
			$(".contain").css({		
				zIndex:10,					
				borderColor:"#1E9FFF",	//	每次打开默认选中包含条件按钮
				color:"#1E9FFF"	
			});
			$(".exclude").css({	
				zIndex:0,
				borderColor:"#dddddd",	//	每次打开默认不选中排除按钮
				color:"black"
			});
			$(".placeInput").val("");	//-----每次打开将弹窗内input初始化	
			$(".searchBtn").css("display","inline");	//-----显示直接搜索按钮	
			layer.open({
				type: 1,
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
		//========================选择省份弹窗结束==================
		
		//=============省份选择包含按钮 或 排除按钮 点击事件================
		//
		//包含按钮 与 排除按钮 切换时 在 data 内用 self.contain 记录此时的状态（"T" 为包含，"F" 为排除）
		
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
		//===============省份选择是否包含按钮点击事件结束============
		
		//==============保存筛选条件按钮点击事件=================
		//保存成功后将数组以 JSON 形式存入localStrorage
		saveCon:function(){
			var self = this;
			var data = "";
			if(self.versionSwitch==true){
				if($("input[name='places']").filter(':checked').length == 0 && $(".placeInput").val() == ""){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				$("input[name='places']:checkbox").each(function(){
					if(true == $(this).is(':checked')){
						data += ($(this).val()+",");
					}
				});
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				for(var i = 0; i < selectRows.length; i++){
					data += selectRows[i]['new_tid'] + ",";
				}
			}
			data = data.substr(0,data.length-1);
			if($(".placeInput").val() != "" && data != ""){
				data += ("," + $(".placeInput").val());
			}else if($(".placeInput").val() != "" && data == ""){
				//	与input框内输入的值进行拼接
				data = $(".placeInput").val();
			}
			if(self.index == "F"){
				if(self.contain == "y"){
					self.provinceArr.push(data);
				}else if(self.contain == "n"){
					self.provinceArr.push("<span style='color:red' class='others'>排除：</span>" + data);
				}
			}else{
				if(self.contain == "y"){
					self.provinceArr[self.index * 1] = data;
				}else if(self.contain == "n"){
					self.provinceArr[self.index * 1] = ("<span style='color:red' class='others'>排除：</span>" + data);
				}
			}
			localStorage.setItem("placeArr",JSON.stringify(self.provinceArr));
			self.index = "F";
			self.provinceArr = JSON.parse(localStorage.getItem("placeArr"));	
			layer.closeAll();
		},
		//==================保存筛选条件按钮点击事件结束===================
		
		//==================删除省份模板按钮======================
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
		//===============删除省份模板按钮结束================
		
		//===============省份模板编辑按钮====================
		//index  ----- 数组内对应的下脚值  item  -----  文本内容
		//self.contain 记录此时是排除 还是 包含按钮
		edit:function(index,item){																																									//===========
			event.stopPropagation();																																								//===========
			var self = this;																																										//===========
																																																	//===========
			self.index = index;																																										//===========
																																																	//===========
			$(".searchBtn").css("display","none");									//-----隐藏直接搜索按钮																							//===========
																																																	//===========
			//$("input:checkbox").iCheck('uncheck');									//-----先初始化所有复选框																						//===========
			$(".placesCheckBox").iCheck('uncheck');
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
		chooseProvince:function(isAll){		
		alert('dd');																																						//===========
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
			if(self.versionSwitch==true){
				if($("input[name='places']").filter(':checked').length == 0 && $(".placeInput").val() == ""){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				$("input[name='places']:checkbox").each(function(){
					if(true == $(this).is(':checked')){
						data += ($(this).val()+",");
					}
				});
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				for(var i = 0; i < selectRows.length; i++){
					data += selectRows[i]['new_tid'] + ",";
				}
			}
			data = data.substr(0,data.length-1);
			if($(".placeInput").val() != "" && data != ""){							
				data += ("," + $(".placeInput").val());								
			}else if($(".placeInput").val() != "" && data == ""){
				//与input框内输入的值进行拼接
				data = $(".placeInput").val();										
			}
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
			//self.contain == "y";
			//self.provinceStatus = "T";
			layer.closeAll();
		},//============================================================================================排序选择按钮===============================================================================================
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
				self.baby_Num = false;																																								//===========
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
				self.baby_Num = false;																																								//===========
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
				if(self.baby_Num == false){																																							//===========
					self.order = "babyNumDown";																																						//===========
					$(toggle).append("<span class='orderImg' style='background-image:url(\"images/toDown.png\");background-size:100% 100%;'></span>");												//===========
					self.baby_Num = true;																																							//===========
				}else if(self.baby_Num == true){																																						//===========
					self.order = "babyNumUp";																																						//===========
					$(toggle).append("<span class='orderImg' style='background-image:url(\"images/toUp.png\");background-size:100% 100%;'></span>");												//===========
					self.baby_Num = false;																																							//===========
				}																																													//===========
			}else if(type == "PaymentDown"){						//-----付款时间从近到远																											//===========
				$(".timePay").css("zIndex",10);																																						//===========
				$(".timePay").addClass("must");																																						//===========
																																																	//===========
				self.order = "PaymentDown";																																							//===========
				self.baby_Num = false;																																								//===========
				self.coding = false;																																								//===========
				self.orderAmount = false;																																							//===========
																																																	//===========
				$(".photo").html($(toggle).html());																																					//===========
			}else if(type == "PaymentUp"){							//-----付款时间从远到近																											//===========
				$(".timePay").css("zIndex",10);																																						//===========
				$(".timePay").addClass("must");																																						//===========
																																																	//===========
				self.order = "PaymentUp";																																							//===========
				self.baby_Num = false;																																								//===========
				self.coding = false;																																								//===========
				self.orderAmount = false;																																							//===========
																																																	//===========
				$(".photo").html($(toggle).html());																																					//===========
			}else if(type == "timeDown"){							//-----拍下时间从近到远																											//===========
				$(".timePay").css("zIndex",10);																																						//===========
				$(".timePay").addClass("must");																																						//===========
																																																	//===========
				self.order = "timeDown";																																							//===========
				self.baby_Num = false;																																								//===========
				self.coding = false;																																								//===========
				self.orderAmount = false;																																							//===========
																																																	//===========
				$(".photo").html($(toggle).html());																																					//===========
			}else if(type == "timeUp"){								//-----拍下时间从远到近																											//===========
				$(".timePay").css("zIndex",10);																																						//===========
				$(".timePay").addClass("must");																																						//===========
																																																	//===========
				self.order = "timeUp";																																								//===========
				self.baby_Num = false;																																								//===========
				self.coding = false;																																								//===========
				self.orderAmount = false;																																							//===========
																																																	//===========
				$(".photo").html($(toggle).html());																																					//===========
			}else if(type == "codingDown"){								//-----商家编码降序																										//===========
				$(".timePay").css("zIndex",10);																																						//===========
				$(".timePay").addClass("must");																																						//===========
																																																	//===========
				self.order = "codingDown";																																								//===========
				self.baby_Num = false;																																								//===========
				self.coding = false;																																								//===========
				self.orderAmount = false;																																							//===========
																																																	//===========
				$(".photo").html($(toggle).html());																																					//===========
			}else if(type == "codingUp"){								//-----商家编码升序																									//===========
				$(".timePay").css("zIndex",10);																																						//===========
				$(".timePay").addClass("must");																																						//===========
																																																	//===========
				self.order = "codingUp";																																								//===========
				self.baby_Num = false;																																								//===========
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
		changebanner:function(seller_flag){
			var self = this;	
			$(".bannerUl").css("display","none");
			var data = self.searchData;
			if(self.versionSwitch==true){
				if($("input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;	
				}
				if(self.isAll == 0){
					data = "";																						
					$("input[name='order']:checkbox").each(function(){						
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");									
						}
					});
					data = data.substring(0,data.length-1);																
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){
					data = "";	
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					console.log();
					data = data.substring(0,data.length-1);
				}
			}	
			self.banShow = false;
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=setSellerFlag",
				type: 'post',
				data: {data: data, isAll: self.isAll, seller_flag: seller_flag, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
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
					searchALLNow(self,'page');
				}
			});	
		},
		//===============================================================================改旗帜结束======================================================================================================
		//---------生成标签开始--------------
		createUnique:function(){
			var self = this;
			var data = "";
			if(self.versionSwitch==true){
				if($("input[name='order']").filter(':checked').length == 0 && $(".placeInput").val() == ""){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){
					//-----如果是当前页
					$("input[name='order']:checkbox").each(function(){						
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");									
						}
						//	拼接当前页的货品唯一码
					});																		
					data = data.substring(0,data.length-1);
				}else{
					data = self.searchData;
				}	
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);
				}else{
					data = self.searchData;
				}
			}
			var indexLoad = layer.load();
			execAjax({
                m:'WMS',
                c:'Storage',
                a:'setUniqueCodeStock',
                data:{
                    data:data,isAll:self.isAll
                },
                success:function(data){
                    layer.closeAll();
					layer.msg("操作成功",{
						icon: 1,
						time: 2000
					});
					self.isAll = 0;
					self.nowPage = false;
					self.allPage = false;
					searchALLNow(self,'page');
                }
            });
		},
		setWholeStock:function(){
			var self = this;
			var data = "";
			layer.confirm('重算将把库存优先匹配整单，当日已经打印标签的不会参与计算，确定要重算吗？', {
				btn: ['确认','取消'] //按钮
			}, function(index){
				var indexLoad = layer.load();
				execAjax({
					m:'wms',
					c:'storage',
					a:'setWholeStock',
					data:{
						filterPrint:'on'
					},
					success:function(data){
						layer.closeAll();
						layer.msg("操作成功",{
							icon: 1,
							time: 2000
						});
						self.isAll = 0;
						self.nowPage = false;
						self.allPage = false;
						searchALLNow(self,'page');
					},
					error:function(){
						layer.closeAll();
						layer.msg("操作失败，请稍候重试",{
							icon: 0,
							time: 2000
						});
					}
				});
			})
		},
		close_label:function(){
			var self = this;
			var data = "";
			if(self.versionSwitch==true){
				if($("input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){														
					$("input[name='order']:checkbox").each(function(){						
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");									
						}
					});																		
					data = data.substring(0,data.length-1);		
				}else{
					data = self.searchData;
				}	
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){														
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);		
				}else{
					data = self.searchData;
				}	
			}
			var indexLoad = layer.load();
			execAjax({
                m:'system',
                c:'delivery',
                a:'close_label',
                data:{
                    data:data,isAll:self.isAll
                },
                success:function(data){
                    layer.closeAll();
					layer.msg("操作成功",{
						icon: 1,
						time: 2000
					});
					self.isAll = 0;
					self.nowPage = false;
					self.allPage = false;
					searchALLNow(self,'page');
                }
            });
		},
		//========================生成标签结束==========================
		//====================================================================================修改按钮 弹窗======================================================================================================
		modify:function(order_index){
			var self = this;		
			var data = self.gridArr[order_index];
			var tid = data.new_tid;
			layer.open({																																											
				type: 1,																																											
				title: '修改订单信息',																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['700px', '680px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#edit-pages1"),																																							
				cancel: function (index, layero) {																																					
																																																	
				}																																													
			});
			
			$("#pages1-express").attr('disabled',false);
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=getOrderInfo",																																		
				type: 'post',																																												
				data: {tid: tid, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},																																													
				dataType: 'json',																																											
				success: function (data) {
					//if(data.send_status != 'WAIT_ASSIGN'){
						//$("#pages1-express").attr('disabled',true);
					//}
					self.editData = data;
					$("#pages1-tid").val(tid);
					$("#pages1-modified").val(data.modified_time);
					$("#pages1-index").val(order_index);
					$("#pages1-express").val(data.express_type);
					$("#pages1-storage").val(data.wh);
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
					$("#pages1-name_df").val(data.name_df);
					$("#pages1-mobile_df").val(data.mobile_df);
					$("#pages1-address_df").val(data.address_df);
					if(data.token_jd)
					{
						$.ajax({
							url: "http://116.196.114.192/hufu/getSensitiveData.php",
							type: 'get',				
							dataType: 'json',
							async:false,
							data:{token_tid: data.token_tid, token_jd: data.token_jd},
							success: function (data) {
								if(data.code == '0000'){
									var receiver_address = data.result.list[0].receiver_address;
									var receiver_mobile = data.result.list[0].receiver_mobile;
									var receiver_name = data.result.list[0].receiver_name;
									
									$("#pages1-receiver_name").val(receiver_name);
									$("#pages1-mobile").val(receiver_mobile);
									$("#pages1-receiver_address").val(receiver_address);
								}else{
									/*layer.msg(data.message,{
										icon: 2,
										time: 2000
									});	*/
								}
							},
							error: function(){
								layer.msg('接口异常，请稍后再试',{
									icon: 2,
									time: 2000
								});	
							}
						});
					}
				}																																															
			});
			
			/**********修改框赋值**********/
			/**********修改框赋值**********/
		},
		otherSplit:function(order){
			var self = this;
			var isAll = self.isAll;
			/*if(self.isAll == '1'){
				layer.msg('无法拆分全部页订单',{
						icon: 022,
						time: 2000
					});
					return false;
			}*/
			if(self.versionSwitch==true){
				if($("input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}		
				var data = self.searchData;
				if(self.isAll == 0){//-----如果是当前页	
					var data = "";																						
					$("input[name='order']:checkbox").each(function(){
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");
						}
						//拼接当前页的货品唯一码
					});
					data = data.substring(0,data.length-1);
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){//-----如果是当前页	
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);
				}
			}
			$("#splitWay1").iCheck('check');
			$("#lb-1").hide();
			$("#lb-2").hide();
			$("#package_num").val('');
			$("#prd_number").val('')
			$(document).ready(function(){
				$('#splitWay1').on('ifChecked', function(event){
				
					$("#lb-1").hide();
					$("#lb-2").hide();
				});	

				$('#splitWay2').on('ifChecked', function(event){
				
					$("#lb-1").hide();
					$("#lb-2").hide();
				});		

				$('#splitWay3').on('ifChecked', function(event){
					$("#lb-1").hide();
					$("#lb-2").hide();
				});
				
				$('#splitWay4').on('ifChecked', function(event){
					$("#lb-1").hide();
					$("#lb-2").show();
				});
				
				$('#splitWay5').on('ifChecked', function(event){
					$("#lb-1").hide();
					$("#lb-2").hide();
				});
				
				$('#splitWay6').on('ifChecked', function(event){
					$("#lb-1").show();
					$("#lb-2").hide();
				});
			});
			
			layer.open({
				type: 1,
				title: '拆单方式',
				skin: 'layui-layer-rim', 
				area: ['500px', '300px'], 
				shade: 0.3,
				content: $("#label-check"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					
					var indexLoad = layer.load();
					var radioValue2 = $('input:radio[name="splitWay"]:checked').val();
					var package_num = $("#package_num").val();
					var prd_number = $("#prd_number").val();
					if(radioValue2 == '6' && package_num == ''){
						layer.msg('请输入单包裹数量',{
							icon: 2,
							time: 2000
						});
						return false;
					}
					if(radioValue2 == '4' && prd_number == ''){
						layer.msg('请输入商品信息',{
							icon: 2,
							time: 2000
						});
						return false;
					}
					self.actionComplete(data,radioValue2,package_num,prd_number,indexLoad,isAll);
					return false;
				},
				cancel: function (index, layero) {
					
				}
			});
		},
		actionComplete: function(data,radioValue,package_num,prd_number,indexLoad,isAll){
			var self = this;
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=otherSplit",																																		
				type: 'post',																																												
				data: {param: data, radioValue: radioValue,package_num: package_num,prd_number: prd_number,isAll: isAll},																																													
				dataType: 'json',																																											
				success: function (data) {
					layer.close(indexLoad);
					if(data.code == "ok"){
						layer.msg("拆单成功",{
							icon: 1,
							time: 2000
						});
						searchALLNow(self,'page');
					}else{
						self.defaultMsg = data.msgList;
						
						layer.open({
							type: 1,																																											
							title: '失败详情',																																								
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['800px', '400px'], //宽高																																					
							shade: 0.3,																																											
							content: return_data.msg																																												
						});
					}
				}																																															
			});
		},
		freePrints:function(new_tid){
			var self = this;
			layer.open({																																											
				type: 1,																																											
				title: '自由打印',																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['700px', '430px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#edit-pages15"),																																							
				cancel: function (index, layero) {																																					
																																																	
				}
			});
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=getOrderInfo",																																		
				type: 'post',																																												
				data: {tid: new_tid, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},																																													
				dataType: 'json',																																											
				success: function (data) {
					$("#pages15-tid").val(new_tid);
					$("#pages15-express").val(data.express_type);
					$("#pages15-receiver_state").val(data.receiver_state);
					$("#pages15-receiver_state").trigger("change");
					$("#pages15-receiver_city").val(data.receiver_city);
					$("#pages15-receiver_city").trigger("change");
					$("#pages15-receiver_district").val(data.receiver_district);
					if($("#pages15-receiver_district").val() == null){
						$("#pages15-receiver_district").append('<option value="' + data.receiver_district + '" name="' + data.receiver_district + '" data-code="999999">' + data.receiver_district + '</option>');
						$("#pages15-receiver_district").val(data.receiver_district);
					}
					
					$("#pages15-receiver_address").val(data.receiver_address);
					$("#pages15-receiver_name").val(data.receiver_name);
					$("#pages15-mobile").val(data.receiver_mobile);
					$("#pages15-telephone").val(data.receiver_telephone);
				}																																															
			});
		},
		freeWaybill:function(){
			var self = this;
			var tid = $("#pages15-tid").val();
			if(tid != ""){
				var express_type = $("#pages15-express").val();
				var receiver_state = $("#pages15-receiver_state").val();
				var receiver_city = $("#pages15-receiver_city").val();
				var receiver_district = $("#pages15-receiver_district").val();
				var receiver_address = $("#pages15-receiver_address").val();
				var receiver_name = $("#pages15-receiver_name").val();
				var receiver_mobile =  $("#pages15-mobile").val();
				var receiver_telephone =  $("#pages15-telephone").val();
				
				if(express_type == "" || express_type == "0"){
					layer.msg('请选择一个快递',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				
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
					express_type: express_type,
					receiver_state: receiver_state,
					receiver_city: receiver_city,
					receiver_district: receiver_district,
					receiver_address: receiver_address,
					receiver_name: receiver_name,
					receiver_mobile: receiver_mobile,
					receiver_telephone: receiver_telephone,
					DROP_SHIPPING: self.DROP_SHIPPING, 
					shippingId: self.shippingId
				};
				
				$.ajax({
					url: "/index.php?m=system&c=delivery&a=freeWaybill",																																		
					type: 'post',																																												
					data: {data: data, tid: tid, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},																																													
					dataType: 'json',																																											
					success: function (data) {
						if(data.code == "ok"){
							self.expressSort = data.expressSort;
							self.printTplDzmd = printTplDzmd;
							doGetPrinters(function(data){																																							
								self.layprint = data;																																								
							});																																														

							$("#layprintFree").val(0);											//-----初始化选择框																										
							$("#layprintTplBqFree").val(0);									//-----初始化选择框																										
							
							$.ajax({																																														
								url: "/index.php?m=system&c=delivery&a=getMianDan",																																		
								type: 'post',																																												
								data: {},																																													
								dataType: 'json',																																											
								success: function (data) {
									if(data.printer != ""){
										$("#printerFree select").val(data.printer);
									}else{
										$("#printerFree select").val(0);
										printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
									}
								}																																															
							});
							
							layer.open({																																											
								type: 1,																																											
								title: "自由打印打面单",																																									
								skin: 'layui-layer-rim', //加上边框																																					
								area: ['1200px', '400px'], //宽高																																					
								shade: 0.3,		
								
								content: $("#facePopFree"),
								cancel: function(index, layero){
									
								}
							});
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
		modifySllerMemo:function(order_index){
			var self = this;		
			var data = self.gridArr[order_index];
			var tid = data.new_tid;
			layer.open({																																											
				type: 1,																																											
				title: '改备注',																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['700px', '300px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#edit-pages14"),																																							
				cancel: function (index, layero) {																																					
																																																	
				}																																													
			});
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=getOrderInfo",																																		
				type: 'post',																																												
				data: {tid: tid, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},																																													
				dataType: 'json',																																											
				success: function (data) {
					$("#pages14-tid").val(tid);
					$("#pages14-modified").val(data.modified_time);
					$("#pages14-index").val(order_index);
					$("#pages14-seller_memo").val(data.seller_memo);
					$("#pages14-remark").val(data.remark);
				}																																															
			});
		},
		//=================================================================================修改按钮 弹窗 结束====================================================================================================
		/*checkSaveBaseInfo:function(){
			var self = this;
			var tid = $("#pages1-tid").val();
			var express_type = $("#pages1-express").val();
			if(self.editData.order_type == 'WEIGONG')
			{
				if($("#pages1-name_df").val() != self.name_df || $("#pages1-mobile_df").val() != self.mobile_df || $("#pages1-address_df").val() != '')
				layer.confirm('您打印的面单信息与阿里巴巴平台保密代发要求不符，请您于买家妥善沟通后继续操作，如您擅自修改可能受到平台处罚!', {
					btn: ['确认','取消'] //按钮
				}, function(){
					$.ajax({																																														
						url: "/index.php?m=system&c=delivery&a=checkSaveBaseInfo",																																		
						type: 'post',																																												
						data: {tid: tid, express_type: express_type},
						dataType: 'json',																																											
						success: function (data) {
							if(data.code == "error"){
								layer.confirm('有已打印标签的订单，改快递将会重算群单码，确认修改快递？', {
									btn: ['确认','取消'] //按钮
								}, function(){
									self.saveBaseInfo();
								});	
							}else{
								self.saveBaseInfo();
							}
						}																																															
					});
				});		
			}
			else
			{
				$.ajax({																																														
					url: "/index.php?m=system&c=delivery&a=checkSaveBaseInfo",																																		
					type: 'post',																																												
					data: {tid: tid, express_type: express_type},
					dataType: 'json',																																											
					success: function (data) {
						if(data.code == "error"){
							layer.confirm('有已打印标签的订单，改快递将会重算群单码，确认修改快递？', {
								btn: ['确认','取消'] //按钮
							}, function(){
								self.saveBaseInfo();
							});	
						}else{
							self.saveBaseInfo();
						}
					}																																															
				});
			}
		},*/
		//=================================================================================修改按钮 保存 开始======================================================================================================
		saveBaseInfo:function(){
			var self = this;	
			var tid = $("#pages1-tid").val();
			if(tid != ""){
				var order_index = $("#pages1-index").val();
				var modified_time = $("#pages1-modified").val();
				var express_type = $("#pages1-express").val();
				var storage = $("#pages1-storage").val();
				var receiver_state = $("#pages1-receiver_state").val();
				var receiver_city = $("#pages1-receiver_city").val();
				var receiver_district = $("#pages1-receiver_district").val();
				var receiver_address = $("#pages1-receiver_address").val();
				var receiver_name = $("#pages1-receiver_name").val();
				var receiver_mobile =  $("#pages1-mobile").val();
				var receiver_telephone =  $("#pages1-telephone").val();
				var seller_memo = $("#pages1-seller_memo").val();
				var remark = $("#pages1-remark").val();
				var name_df = $("#pages1-name_df").val();
				var mobile_df = $("#pages1-mobile_df").val();
				var address_df = $("#pages1-address_df").val();
				
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
					remark: remark,
					storage: storage,
					name_df: name_df,
					mobile_df: mobile_df,
					address_df: address_df,
					DROP_SHIPPING: self.DROP_SHIPPING, 
					shippingId: self.shippingId
				};
				
				$.ajax({
					url: "/index.php?m=system&c=delivery&a=checkTidStatus",
					type: 'post',
					data: {tid: tid},
					dataType: 'json',
					success: function (res) {
						if(res.code == "ok"){
							$.ajax({								
								url: "/index.php?m=system&c=delivery&a=saveBaseInfo",								
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
						}else if(res.code == "error"){
							layer.confirm(res.msg, {
								btn: ['确认','取消'] //按钮
							}, function(){
								$.ajax({									
									url: "/index.php?m=system&c=delivery&a=saveBaseInfo",								
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
		saveSellerMemo:function(){
			var self = this;	
			var tid = $("#pages14-tid").val();
			if(tid != ""){
				var order_index = $("#pages14-index").val();
				var modified_time = $("#pages14-modified").val();
				var seller_memo = $("#pages14-seller_memo").val();
				var remark = $("#pages14-remark").val();
				
				var data = {
					modified_time: modified_time,
					seller_memo: seller_memo,
					remark: remark,
					DROP_SHIPPING: self.DROP_SHIPPING, 
					shippingId: self.shippingId
				};
				
				$.ajax({																																														
					url: "/index.php?m=system&c=delivery&a=saveSellerMemo",																																		
					type: 'post',																																												
					data: {data: data, tid: tid},																																													
					dataType: 'json',																																											
					success: function (data) {
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							
							$("#pages14-modified").val(data.modified_time);
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
		//======================================================================================弹窗取消按钮=====================================================================================================
		cancel:function(){
			layer.closeAll();
		},
		//====================================================================================弹窗取消按钮结束===================================================================================================
		
		//====================================================================================更多操作 弹窗======================================================================================================
		doMore:function(tid,order_index){
			var self = this;
			$(".more input").iCheck('uncheck');
			$("input[name='order']").iCheck('uncheck');
			$("input[value='" + tid + "']").iCheck('check');
			
			if(self.DROP_SHIPPING == "T"){
				layer.open({
					type: 1,
					title: '更多操作',
					skin: 'layui-layer-rim', //加上边框				
					area: ['1000px', '600px'],
					shade: 0.3,
					content: $("#edit-pages2")																																						//===========
				});
			}else if(self.sysPlan == "approval"){
				layer.open({
					type: 1,
					title: '更多操作',
					skin: 'layui-layer-rim', //加上边框				
					area: ['1000px', '600px'],
					shade: 0.3,
					content: $("#edit-pages2"),	
					btn: ['锁单','作废','标记挂单','标记待配货','添加商品','取消']
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
					},
					btn4: function(index, layero){
						self.setLack(tid,order_index);
						return false;
					},
					btn5: function(index, layero){
						//console.log(tid);
						//console.log(order_index);
						self.addOrderItems(tid);
						return false;
					},
					cancel: function (index, layero) {																																					//===========
																																																		//===========
					}																																													//===========
				});
			}else if(WMS_MODEL == "T" || WMS_MODEL == "PT"){
				layer.open({
					type: 1,
					title: '更多操作',
					skin: 'layui-layer-rim', //加上边框				
					area: ['1000px', '600px'],
					shade: 0.3,
					content: $("#edit-pages2"),	
					btn: ['打面单并发货', '锁单','作废','标记挂单','标记待配货','添加商品','取消']
					,yes: function(index, layero){
						//按钮【按钮一】的回调
						self.faceAlone(tid);
						return false;
					}
					,btn2: function(index, layero){
						//按钮【按钮二】的回调
						self.orderLockPage(tid);
						return false;
						//return false 开启该代码可禁止点击该按钮关闭
					}
					,btn3: function(index, layero){
						//按钮【按钮三】的回调
						self.orderCancel(tid);
						return false;
						//return false 开启该代码可禁止点击该按钮关闭
					},
					btn4: function(index, layero){
						self.setStock(tid,order_index);
						return false;
					},
					btn5: function(index, layero){
						//console.log(tid);
						//console.log(order_index);
						self.setLack(tid,order_index);
						return false;
					},
					btn6: function(index, layero){
						self.addOrderItems(tid);
						return false;
					},
					cancel: function (index, layero) {																																					//===========
																																																		//===========
					}																																													//===========
				});
			}else{
				layer.open({																																											//===========
					type: 1,																																											//===========
					title: '更多操作',																																									//===========
					skin: 'layui-layer-rim', //加上边框																																					//===========
					area: ['1000px', '600px'], //宽高																																					//===========
					shade: 0.3,																																											//===========
					content: $("#edit-pages2"),	
					btn: ['打标签', '打面单并发货', '锁单','作废','标记挂单','标记待配货','添加商品','取消']
					,yes: function(index, layero){
						//按钮【按钮一】的回调
						self.print1('more');
					}
					,btn2: function(index, layero){
						//按钮【按钮二】的回调
						self.faceAlone(tid);
						return false;
						//return false 开启该代码可禁止点击该按钮关闭
					}
					,btn3: function(index, layero){
						//按钮【按钮三】的回调
						self.orderLockPage(tid);
						return false;
						//return false 开启该代码可禁止点击该按钮关闭
					},
					btn4: function(index, layero){
						self.orderCancel(tid);
						return false;
					},
					btn5: function(index, layero){
						self.setStock(tid,order_index);
						return false;
					},
					btn6: function(index, layero){
						self.setLack(tid,order_index);
						return false;
					},
					btn7: function(index, layero){
						self.addOrderItems(tid);
						return false;
					},
					cancel: function (index, layero) {																																					//===========
																																																		//===========
					}																																													//===========
				});
			}
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=getItemsInfo",																																		
				type: 'post',																																												
				data: {tid: tid, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},																																													
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
		modifyMess:function(tid,oid,sku_id,index,refund_status,bom_id,prd_no,sku_name){
			var self = this;
			$("#pages3-color").attr("disabled",false);
			$("#pages3-size").attr("disabled",false);
			$("#pages3-outer_sku_id").removeAttr("readonly"); 
			$("#pages3-num").removeAttr("readonly"); 
			self.changeMonAnno = 0;
			if(refund_status == "SUCCESS"){
				self.changeMonAnno = 1;
				$("#pages3-color").attr("disabled",true);
				$("#pages3-size").attr("disabled",true);
				$("#pages3-outer_sku_id").attr("readonly","readonly");
				$("#pages3-num").attr("readonly","readonly");
			}else if(bom_id == "1"){
				$("#pages3-color").attr("disabled",true);
				$("#pages3-size").attr("disabled",true);
				$("#pages3-outer_sku_id").attr("readonly","readonly");
				//$("#pages3-num").attr("readonly","readonly");
			}
			
			if(tid.substring(0,3) == 'XX-' || bom_id == "1"){
				$('.pages3-properties_div_1').hide();
				$('.pages3-properties_div_2').show();
				$("#pages3-outer_sku_id").removeAttr("readonly");
			}else{
				$('.pages3-properties_div_1').show();
				$('.pages3-properties_div_2').hide();
			}
			self.oid = oid;
			self.isShow = false;
			self.isShowM = 0;
			layer.open({																																											//===========
				type: 1,																																											//===========
				title: '修改拿货信息',																																								//===========
				skin: 'layui-layer-rim', //加上边框																																					//===========
				area: ['968px', '500px'], //宽高																																					//===========
				shade: 0.3,																																											//===========
				content: $("#edit-pages3"),																																							//===========
				cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																																													//===========
			});	
			$("#pages3-index").val(index);
			$("#pages3-isProduct").val('');
			$("#pages3-item_prd_no").val('');
			$("#pages3-item_sku_name").val('');
			execAjax({
                m:'system',
                c:'delivery',
                a:'getItemModifyMess',
                data:{tid: tid, oid: oid, sku_id: sku_id, prd_no: prd_no, sku_name: sku_name},
                success:function(data){
					if(data){
						self.ItemModify = data;
						self.ItemModify.item_prd_no = prd_no;
						self.ItemModify.item_sku_name = sku_name;
						self.ItemModify.bom_id = bom_id;
						if(bom_id == '1'){
							self.ItemModify.isProduct = '';	
						}
						if((data.shoptype == 'TB' || data.shoptype == 'TM' || data.shoptype == 'JD') && data.manual == '0'){
							$('#replaceModifyDiv').show();
						}else{
							$('#replaceModifyDiv').hide();
						}
						
						setTimeout(function(e){
							$("#pages3-color").val(data.colorValue);
							$("#pages3-size").val(data.sizeValue);
						},100);
					}
                }
            });
			searchALLNow(self,'page');
		},
        //==================================================================================修改物流单号 弹窗====================================================================================================
        modifyExpressNo:function(order_index){
            var self = this;		
			var data = self.gridArr[order_index];
			var tid = data.new_tid;
			var express_type = data.express_type;
			var express_form = data.express_form;
			var express_no = data.express_no;
			if(express_type.indexOf("DF_") > -1){
				layer.msg('代发快递不允许手工录入快递单号',{
					icon: 2,
					time: 2000
				});	
                return;
			}
			
			layer.open({																																											
				type: 1,																																											
				title: '修改运单号',																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['700px', '300px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#edit-pages9"),																																							
				btn: ['确定', '取消']
				,yes: function(index, layero){
					self.saveExpressNo();
				},
				cancel: function (index, layero) {																																					//===========
																																																	//===========
				}																												
			});
			$("#pages9-index").val(order_index);
			$("#pages9-express_no").attr('disabled',false);
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=getOrderInfo",																																		
				type: 'post',																																												
				data: {tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.send_status != 'WAIT_ASSIGN'){
						$("#pages9-express_no").attr('disabled',true);
					}
					$("#pages9-express_no").val('');
					if((data.send_status == 'WAIT_ASSIGN' || data.send_status == 'WAIT_FINISH_ASSIGN' || data.send_status == 'WAIT_SENDED_ASSIGN') && express_form.indexOf("PT_") > -1){
						$("#pages9-express_no").attr('disabled',false);
						$("#pages9-express_no").val(express_no);
					}
					if(data.express_type == 'WXWL'){
						$("#pages9-express_no").attr('disabled',false);
					}
				}																																															
			});
        },
		expressTracking:function(order_index){
			var self = this;		
			var data = self.gridArr[order_index];
			var tid = data.new_tid;
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=expressTracking",																																		
				type: 'post',																																												
				data: {tid: tid, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data && data.express_name){
						layer.open({
							title :'快递追踪',
							type: 2,
							shade: 0.3,
							area: ['1100px', '580px'],
							maxmin: false,
							content: 'http://www.kuaidi100.com/chaxun?com='+data.express_name+"&nu="+data.express_no,
							success: function(layero, index){
								
							}
						});
					}
				}																																															
			});
		},
		sellerMark:function(order_index,action){
			var self = this;
			var data = self.gridArr[order_index];
			var tid = data.new_tid;
			if(tid == ''){
				layer.msg('数据异常',{
					icon: 2,
					time: 2000
				});	
                return;
			}else{
				execAjax({
					m:'system',
					c:'delivery',
					a:'sellerMark',
					data:{tid :tid, action: action},
					success:function(data){
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							reloadRow(self,order_index);						
						}else if(data.code == "error"){
							layer.msg(data.msg,{
								icon: 2,
								time: 2000
							});		
						}
					}
				});
			}
		},
		showSecret:function(order_index){
			var self = this;
			var data = self.gridArr[order_index];
			var token_tid = data.token_tid;
			var token_jd = data.token_jd;
			if(data.token_jd)
			{
				$.ajax({
					url: "http://116.196.114.192/hufu/getSensitiveData.php",
					type: 'get',				
					dataType: 'json',
					data:{token_tid: token_tid, token_jd: token_jd},
					success: function (data) {
						if(data.code == '0000'){
							var receiver_address = data.result.list[0].receiver_address;
							var receiver_mobile = data.result.list[0].receiver_mobile;
							var receiver_name = data.result.list[0].receiver_name;
							
							$('#receiver_name' + order_index).html(receiver_name);
							$('#receiver_mobile' + order_index).html(receiver_mobile);
							$('#receiver_address' + order_index).html(receiver_address);
						}else{
							
						}
					},
					error: function(){
						layer.msg('接口异常，请稍后再试',{
							icon: 2,
							time: 2000
						});	
					}
				});
			}
		},
        saveExpressNo:function(){
            var self = this;
			var order_index = $("#pages9-index").val();
            var express_no = $("#pages9-express_no").val();
            if(express_no == ''){
                layer.msg('请输入运单号',{
					icon: 2,
					time: 2000
				});	
                return;
            }
            var data = self.gridArr[order_index];
			var tid = data.new_tid;
            var indexLoad = layer.load();
            execAjax({
                m:'system',
                c:'delivery',
                a:'saveExpressNo',
                data:{tid:tid,express_no: express_no},
                success:function(data){
                    layer.close(indexLoad);
					if(data.code == "ok"){
                        layer.closeAll();
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						reloadRow(self,order_index);						
					}else if(data.code == "error"){
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});		
					}
                }
            });
        },
		replaceModify:function(){
			var self = this;
			var replace_prd_no = $("#pages3-replace_prd_no").val();
			var tid = $("#pages3-tid").val();
			var oid = $("#pages3-oid").val();
			var order_index = $("#pages3-index").val();
			
			execAjax({
                m:'system',
                c:'delivery',
                a:'replaceModify',
                data:{tid: tid, oid: oid, replace_prd_no: replace_prd_no},
                success:function(data){
					if(data.code == "ok"){
                        layer.closeAll();
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						reloadRow(self,order_index);						
					}else if(data.code == "error"){
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});		
					}
                }
            });
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
			var item_prd_no = $("#pages3-item_prd_no").val();
			var item_sku_name = $("#pages3-item_sku_name").val();
			var bom_id = $("#pages3-bom_id").val();
            
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
			
			if(tid.substring(0,3) == 'XX-' || bom_id == '1'){
				properties_name = $("#pages3-properties_name_offline").val();
			}
			
			execAjax({
                m:'system',
                c:'delivery',
                a:'saveItemModify',
                data:{tid: tid, oid: oid, sku_id_old: sku_id_old, properties_name: properties_name, sku_outer_id: sku_outer_id, 
                sku_id: sku_id,
                isProduct: isProduct,
                prd_no: prd_no,
                title: title,
                prd_id: prd_id,
                prd_sku_id: prd_sku_id,
				num: num,
				item_prd_no: item_prd_no, 
				item_sku_name: item_sku_name,
                },
                success:function(data){
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						
						layer.closeAll();
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
		changeMon:function(){
			var self = this;
			if(self.changeMonAnno == 1){
				return false;
			}	
				//===========
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
                area: ['900px', '570px'],
                maxmin: false,
                content: '?m=widget&c=selectProduct&a=index&type=1&param=PRD1'
            }); 
		},
		editPic:function(){
			var self = this;
			mini.get("fileuploa2").setText('');
			$("#pages98-pic_url").val('');
			$("#pages98-newtimestramp").val('');
            layer.open({
				type: 1,
				title: '修改图片',						
				skin: 'layui-layer-rim', 																		
				area: ['500px', '500px'], //宽高
				shade: 0.3,							
				content: $("#edit-pages98"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var pic_url = $("#pages98-pic_url").val();
					oid = self.oid;
					var asd = $("#pages98-newtimestramp").val();
					if(pic_url == ''){
						layer.msg('请先上传图片',{
							icon: 0,
							time: 2000
						});
						return false;
					}
					self.modificationPic(index,oid,pic_url);
					return false;
				},
				cancel: function (index, layero) {	
				}				
			});
			fastClear();
		},
		addItemsMon:function(){
			var self = this;
			var tid = $("#pages3-new_tid").val();
			self.addOrderItems(tid);
		},
		//====================================================================================换款按钮结束=======================================================================================================
		
		//====================================================================================打标签按钮=========================================================================================================
		print1:function(type){
			var self = this;
			if(type == "page"){
				if(self.versionSwitch==true){
					if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
						layer.msg('请选择至少一条数据',{
							icon: 0,
							time: 2000
						});								
						return false;
					}
				}else{
					var selectRows = grid1.getSelecteds();
					if(selectRows.length == 0){
						layer.msg('请选择至少一条数据',{
							icon: 0,
							time: 2000
						});
						return false;
					}
				}
			}else if(type == "more"){
				if($(".more input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一个货品',{
						icon: 0,
						time: 2000
					});
					return false;
				}
			}
			layer.open({
				type: 1,
				title: '打印标签',
				skin: 'layui-layer-rim',
				area: ['700px', '400px'],
				shade: 0.3,
				content: $("#edit-pages4"),
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					self.print2(type);
					layer.close(index);
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function (index, layero) {}
			});
		},
		
		printDSOS:function(type){
			var self = this;
			if(self.versionSwitch==true){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});								
					return false;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
			}
			doGetPrinters(function(data){
				self.layprint =  data;
			});
			$("#layprintDSOS").val(0);//-----初始化选择框
			$("#layprintTplDSOS").val(0);//-----初始化选择框
			self.layprintTplDSOS = printLodopTplList['DSOS'];
			layer.open({
				type: 1,
				title: '打印发货清单',
				skin: 'layui-layer-rim', //加上边框
				area: ['700px', '400px'], //宽高
				shade: 0.3,
				content: $("#table-printDSOS"),		
				btn: ['确定打印']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					if(self.isFirst == true){
						self.setyesorderDSOS(type);
						self.isFirst = false;
					}
					setTimeout(function(){
						self.isFirst = true;
					},200);
					layer.close(index);
				},
				cancel: function (index, layero) {},
				success:function(){
					$.ajax({
						url: "/index.php?m=system&c=delivery&a=getPrinterDSOS",
						type: 'post',
						data: {},
						dataType: 'json',
						success: function (data) {
							if(data['result'].printer != "" && data['DSOS'].id != ""){
								$("#layprintDSOS").val(data['result'].printer);
								$("#layprintTplDSOS").val(data['DSOS'].id);
							}else if(data['result'].printer != "" && data['DSOS'].id == ""){
								$("#layprintDSOS").val(data['result'].printer);
								$("#layprintTplDSOS").val(0);
								printerPrompt("未设置默认打印模板","发货清单设计","index.php?m=print&c=lodopDesign&a=index");
							}else if(data['result'].printer == "" && data['DSOS'].id != ""){
								$("#layprintDSOS").val(0);
								$("#layprintTplDSOS").val(data['DSOS'].id);
								printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
							}else{
								$("#layprintDSOS").val(0);
								$("#layprintTplDSOS").val(0);
								printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
							}
						}
					});
				}
			});		
		},
		printCollectGoods:function(){
			var LODOP=getLodop(); 
			if (!LODOP.VERSION) {
				layer.alert('当前无lodop插件，请下载插件使用', 
					{icon: 6
					,yes: function(index){
						window.location.href="http://www.lodop.net/download/Lodop6.226_Clodop3.080.zip";
						layer.close(index);
					}
				});
				return false;
			};
			var self = this;
			if(self.versionSwitch==true){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});								
					return false;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
			}
			doGetPrinters(function(data){
				self.layprint =  data;
			});
			//$("#layCollectGoods").val(0);//-----初始化选择框
			layer.open({
				type: 1,
				title: '打印拿货汇总',
				skin: 'layui-layer-rim', //加上边框
				area: ['700px', '400px'], //宽高
				shade: 0.3,
				content: $("#table-CollectGoods"),		
				btn: ['确定打印']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					if(self.isFirst == true){
						self.setCollectGoodsDSOS();
						self.isFirst = false;
					}
					setTimeout(function(){
						self.isFirst = true;
					},200);
					//layer.close(index);
				}
			});	
		},
		printCollectGoodsFetch:function(){
			var LODOP=getLodop(); 
			if (!LODOP.VERSION) {
				layer.alert('当前无lodop插件，请下载插件使用', 
					{icon: 6
					,yes: function(index){
						window.location.href="http://www.lodop.net/download/Lodop6.226_Clodop3.080.zip";
						layer.close(index);
					}
				});
				return false;
			};
			var self = this;
			if(self.versionSwitch==true){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});								
					return false;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
			}
			doGetPrinters(function(data){
				self.layprint =  data;
			});
			//$("#layCollectGoods").val(0);//-----初始化选择框
			layer.open({
				type: 1,
				title: '打印拿货汇总',
				skin: 'layui-layer-rim', //加上边框
				area: ['700px', '400px'], //宽高
				shade: 0.3,
				content: $("#table-CollectGoods"),		
				btn: ['确定打印']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					if(self.isFirst == true){
						self.setCollectGoodsDSOSFetch();
						self.isFirst = false;
					}
					setTimeout(function(){
						self.isFirst = true;
					},200);
					//layer.close(index);
				}
			});	
		},
		setCollectGoodsDSOS:function(){
			var self = this;
			var data = "";
			var printerList = self.layprintTplDSOS;
			if($("#layCollectGoods").val() != 0){
				var unprintname = $("#layCollectGoods").val();
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return
			}
			if(self.versionSwitch==true){
				if(self.isAll == 0){//-----如果是当前页
					$("input[name='order']:checkbox").each(function(){
						if(true == $(this).is(':checked')){
							data += ($(this).val()+",");
						}//拼接当前页的货品唯一码
					});
					data = data.substring(0,data.length-1);
				}else{
					data = self.searchData;
				}
				if(data == ""){
					layer.msg('请选择至少一条数据',{
						icon: 2,
						time: 2000
					});
					return false;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(self.isAll == 0){//-----如果是当前页
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);
				}
			}
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getCollectGoodsPrint",		
				type: 'post',
				data: {data:data,isAll:self.isAll},
				dataType: 'json',
				success: function (data) {
					if(data){
						var percent = 0;
						//-----进度条初始化
						layer.closeAll();
						$(".sche").css("display","block");
						//-----进度条窗口显示
						var i = 0;
						countSecond(i,data);
						function countSecond(i,data){
							console.log(i);
							if(i<data.length){
								layui.use('element', function(){
									var element = layui.element();
									element.init();//进度条
									percent += Math.ceil(100 / data.length);
									if(percent>100){
										percent = 100;
									}
									element.progress('demo', percent + '%');
								});
								var printData = [];
								printData.push(data[i]);
								//生成一个条形码
								$.ajax({
									url: "/index.php?m=system&c=delivery&a=saveCusCodePrint",
									type: 'post',				
									data: {
										data: data[i],
										index: (i+1),
									},					
									dataType: 'json',		
									success: function (good) {
										if(good.code == "ok"){
											var cusCode = good.msg;
											var cusList = good.datas;
											takeGoods(unprintname,cusList,cusCode,(i+1));
										}
										//无论成功与失败，都打印下一个拿货单，失败的仅不打印拿货单
										//增加拿货单条码 成功后打印下一个
										i = i+1;
										setTimeout(function(){
											countSecond(i,data);
										}, 1000)
									}											
								});
							}else{
								$(".sche").css("display","none");//-----进度条窗口关闭
								searchALLNow(self,'page');
								layer.msg('打印完成',{
									icon: 1,
									time: 2000
								});
								return
							}
						}
					}
					searchALLNow(self,'page');	
					$("input[name='order']").iCheck('uncheck');
					$(".inputTe").css("color","white");
					self.isAll = 0;
					self.nowPage = false;
					self.allPage = false;
				},
				error:function(){
					layer.msg('已挂单或缺货货品不能打印汇总',{
						icon: 2,
						time: 2000
					});
				}
			});
		},
		setCollectGoodsDSOSFetch:function(){
			var self = this;
			var data = "";
			var printerList = self.layprintTplDSOS;
			if($("#layCollectGoods").val() != 0){
				var unprintname = $("#layCollectGoods").val();
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return
			}
			if(self.versionSwitch==true){
				if(self.isAll == 0){//-----如果是当前页
					$("input[name='order']:checkbox").each(function(){
						if(true == $(this).is(':checked')){
							data += ($(this).val()+",");
						}//拼接当前页的货品唯一码
					});
					data = data.substring(0,data.length-1);
				}else{
					data = self.searchData;
				}
				if(data == ""){
					layer.msg('请选择至少一条数据',{
						icon: 2,
						time: 2000
					});
					return false;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(self.isAll == 0){//-----如果是当前页
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);
				}
			}
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getCollectGoodsPrintFetch",		
				type: 'post',
				data: {data:data,isAll:self.isAll},
				dataType: 'json',
				success: function (data) {
					if(data){
						var percent = 0;
						//-----进度条初始化
						layer.closeAll();
						$(".sche").css("display","block");
						//-----进度条窗口显示
						var i = 0;
						countSecond(i,data);
						function countSecond(i,data){
							if(i<data.length){
								layui.use('element', function(){
									var element = layui.element();
									element.init();//进度条
									percent += Math.ceil(100 / data.length);
									if(percent>100){
										percent = 100;
									}
									element.progress('demo', percent + '%');
								});
								
								takeGoodsFetch(unprintname,data[i],(i+1));
								i = i+1;
								setTimeout(function(){
									countSecond(i,data);
								}, 1000);
								
							}else{
								$(".sche").css("display","none");//-----进度条窗口关闭
								searchALLNow(self,'page');
								layer.msg('打印完成',{
									icon: 1,
									time: 2000
								});
								return
							}
						}
					}
					searchALLNow(self,'page');	
					$("input[name='order']").iCheck('uncheck');
					$(".inputTe").css("color","white");
					self.isAll = 0;
					self.nowPage = false;
					self.allPage = false;
				},
				error:function(){
					layer.msg('已挂单或缺货货品不能打印汇总',{
						icon: 2,
						time: 2000
					});
				}
			});
		},
		//=========标记挂单============================
		setStock:function(tid,order_index){
			var self = this;
			var data = "";
			if($("input[name='order']").filter(':checked').length == 0 && $(".placeInput").val() == ""){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			$("input[name='order']:checkbox").each(function(){
				if(true == $(this).is(':checked')){
					data += ($(this).val()+",");
				}
			});
			data = data.substring(0,data.length-1);
			execAjax({
                m:'system',
                c:'delivery',
                a:'setStock',
                data:{data:data,tid:tid},
                success:function(data){
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
                }
            });
		},
		setLack:function(tid,order_index){
			var self = this;	
			if($(".more input[name='order']").filter(':checked').length == 0){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});		
				return false;		
			}
			var data = "";		
			$(".more input[name='order']:checkbox").each(function(){		
				if(true == $(this).is(':checked')){
					data += ($(this).val()+",");
				}
				//拼接当前页的货品唯一码		
			});		
			data = data.substring(0,data.length-1);
			execAjax({
                m:'system',
                c:'delivery',
                a:'setLack',
                data:{data:data},
                success:function(data){
					if(data.code == 'error'){
						layer.msg('标记失败',{
							icon: 1,
							time: 2000
						});
						return false;
					}
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
                }
            });
		},
        //=====================导出拿货单按钮===================
		exportTakeGoods:function(){
			var self = this;
			var data = "";
			if(self.versionSwitch==true){
				if($("input[name='order']").filter(':checked').length == 0 && $(".placeInput").val() == ""){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){
				//-----如果是当前页
					$("input[name='order']:checkbox").each(function(){
						if(true == $(this).is(':checked')){	
							data += ($(this).val()+",");
						}
						//	拼接当前页的货品唯一码
					});
					data = data.substring(0,data.length-1);
				}else{
					data = self.searchData;
				}	
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);
				}else{
					data = self.searchData;
				}
			}
			var indexLoad = layer.load();
			var time = new Date().getTime();
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=exportTakeGoods&loginact=file",
				type: 'post',
				data: {
					data:data,
					isAll:self.isAll,
					time:time,
					sysPlan: self.sysPlan,
				},
				dataType: 'text',
				success: function (text){
					layer.close(indexLoad);
					$("input[name='order']").iCheck('uncheck');
					$(".inputTe").css("color","white");
					self.isAll = 0;
					self.nowPage = false;
					self.allPage = false;
					if(text){
						layer.msg('已挂单或缺货货品不能导出汇总',{
							icon: 0,
							time: 2000
						});
					}else{
						var url = "/xls/WaitSendorders"+time+".xls?loginact=file";
						$("#ifile").attr('src',url);
					}
				},error: function (jqXHR, textStatus, errorThrown) {
					layer.msg('jqXHR.responseText',{
						icon: 0,
						time: 2000
					});
				}
			});
			/**
            execAjax({
                m:'system',
                c:'delivery',
                a:'exportTakeGoods',
                data:{
                    data:data,isAll:self.isAll
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
			*/
		},
		//拿货汇总导出HTML
		/**
		printCollectHTML:function(){
			var self = this;
			var data = "";
			if($("input[name='order']").filter(':checked').length == 0){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				return false;
			}
            if(self.isAll == 0){
			//-----如果是当前页
				$("input[name='order']:checkbox").each(function(){
					if(true == $(this).is(':checked')){	
						data += ($(this).val()+",");
					}
					//	拼接当前页的货品唯一码
				});
				data = data.substring(0,data.length-1);
			}else{
				data = self.searchData;
			}			
			var indexLoad = layer.load();
			var time = new Date().getTime();
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=exportTakeHTML",
				type: 'post',
				data: {
					data:data,
					isAll:self.isAll,
					time:time,
					sysPlan: self.sysPlan,
				},
				dataType: 'text',
				success: function (htmlData){
					var htmlData = JSON.parse(htmlData);
					console.log(htmlData);
					layer.close(indexLoad);
					$("input[name='order']").iCheck('uncheck');
					$(".inputTe").css("color","white");
					self.isAll = 0;
					self.nowPage = false;
					self.allPage = false;
					if(htmlData['data']){
						var oHtml = "";
						//添加页面头部
						oHtml += '<!DOCTYPE html>';
						oHtml += '<html>';
						oHtml += '<head>';
						oHtml += '<meta charset="UTF-8">';
						oHtml += '<title>拿货汇总'+time+'</title>';
						oHtml += '<style type="text/css">';
						oHtml += '.table{text-align: center;border-collapse:collapse;}';
						oHtml += '.trHeader{padding:0px;font-family:宋体;font-weight: bold;height:35px; line-height:35px;}';
						oHtml += '.tdHeader{font-size:16px;background:#ffc;padding:0px 10px;}';
						oHtml += '.trBody{height:25px; line-height:25px;}';
						oHtml += '.tdBody{font-size:14px;height:25px;padding:2px 10px;}';
						oHtml += '.glassImgBig{position:absolute;top:0px;left:100px;display:none;background-repeat:no-repeat;}';
						oHtml += '</style>';
						oHtml += '<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>';
						oHtml += '</head>';
						oHtml += '<body>';
						oHtml += '<table class="table" border="1" cellpadding="0" cellspacing="0">';
						oHtml += '<tr class="trHeader">';
						var tplData = htmlData['tplData']['data'];
						var sortData = htmlData['data'];
						if(htmlData['way'] == '2'){
							for(var i=0;i<tplData.length;i++){
								if(tplData[i]['selected'] == '1'){
									oHtml += '<th class="tdHeader">'+tplData[i]['id']+'</th>';
								}
							}
							oHtml += '</tr>';
							for(var m=0;m<sortData.length;m++){
								oHtml += '<tr class="trBody">';
								for(var n=0;n<tplData.length;n++){
									switch(tplData[n]['val']){
										case 'cus_no':
											if(tplData[n]['selected'] == 1){
												var smallCount = 1;
												if(sortData[m]['cus_no_num']>1){
													oHtml += '<td class="tdBody" rowspan=\"'+sortData[m]["cus_no_num"]+'\">'+sortData[m]["cus_no"]+'</td>';
												}else if(sortData[m]['cus_no'] != '' ){
													oHtml += '<td class="tdBody">'+sortData[m]["cus_no"]+'</td>';
												}
											}
											break;
										case 'prd_loc':
											if(tplData[n]['selected'] == 1){
												if(sortData[m]['prd_loc_num']>1){
													oHtml += '<td class="tdBody" rowspan=\"'+sortData[m]["prd_loc_num"]+'\">'+sortData[m]['prd_loc']+'</td>';
												}else if(sortData[m]['prd_loc'] != '' ){
													if(smallCount == 1){
														if(sortData[m]['prd_loc'] == '总计'){
															oHtml += '<td class="tdBody">&nbsp;</td>';
														}else{
															oHtml += '<td class="tdBody">'+sortData[m]['prd_loc']+'</td>';
														}
													}else{
														oHtml += '<td class="tdBody">'+sortData[m]['prd_loc']+'</td>';
													}
													smallCount = 2;
												}
											}
											break;
										case 'prd_no':
											if(tplData[n]['selected'] == 1){
												if(sortData[m]['prd_no_num']>1){
													oHtml += '<td class="tdBody" rowspan=\"'+sortData[m]['prd_no_num']+'\">'+sortData[m]['prd_no']+'</td>';
												}else if(sortData[m]['prd_no'] != '' ){
													if(smallCount == 1 || smallCount == 2){
														if(sortData[m]['prd_no'] == '总计'){
															oHtml += '<td class="tdBody">&nbsp;</td>';
														}else{
															oHtml += '<td class="tdBody">'+sortData[m]['prd_no']+'</td>';
														}
													}else{
														oHtml += '<td class="tdBody">'+sortData[m]['prd_no']+'</td>';
													}
												}
											}
											break;
										case 'pic_url':
											if(tplData[n]['selected'] == 1){
												if(sortData[m]['pic_url_num']>1){
													oHtml += '<td class="tdBody" rowspan=\"'+sortData[m]['pic_url_num']+'\" style="position: relative;">';
													if(sortData[m]['url'] == '&nbsp;'){
														oHtml += '&nbsp;';
													}else{
														if(sortData[m]['url']){
															oHtml += '<img class="glassImgSmall" src="'+sortData[m]['url']+'" width="70" height="70">';
															oHtml += '<img class="glassImgBig" src="'+sortData[m]['url']+'" width="500" height="500">';
														}else{
															oHtml += '&nbsp;';
														}
													}
													oHtml += '</td>';
												}else if(sortData[m]['pic_url'] != '' ){
													oHtml += '<td class="tdBody" style="position: relative;">';
													if(sortData[m]['url'] == '&nbsp;'){
														oHtml += '&nbsp;';
													}else{
														if(sortData[m]['url']){
															oHtml += '<img class="glassImgSmall" src="'+sortData[m]['url']+'" width="70" height="70">';
															oHtml += '<img class="glassImgBig" src="'+sortData[m]['url']+'" width="500" height="500">';
														}else{
															oHtml += '&nbsp;';
														}
													}
													oHtml += '</td>';
												}
											}
											break;
										case 'sku_name1':
											if(tplData[n]['selected'] == 1){
												if(sortData[m]['sku_name1_num']>1){
													oHtml += '<td class="tdBody" rowspan=\"'+sortData[m]['sku_name1_num']+'\">'+sortData[m]['sku_name1']+'</td>';
												}else if(sortData[m]['sku_name1'] != ""){
													oHtml += '<td class="tdBody">'+sortData[m]['sku_name1']+'</td>';
												}
											}
											break;
										case 'sku_name2':
											if(tplData[n]['selected'] == 1){
												oHtml += '<td class="tdBody">'+sortData[m]['sku_name2']+'</td>';
											}
											break;
										case 'num':
											if(tplData[n]['selected'] == 1){
												oHtml += '<td class="tdBody">'+sortData[m]['num']+'</td>';
											}
											break;
										case 'nums':
											if(tplData[n]['selected'] == 1){
												if(sortData[m]['nums_num']>1){
													oHtml += '<td class="tdBody" rowspan=\"'+sortData[m]['nums_num']+'\">'+sortData[m]['nums']+'</td>';
												}else if(sortData[m]['nums'] != ""){
													oHtml += '<td class="tdBody">'+sortData[m]['nums']+'</td>';
												}
											}
											break;
										case 'price':
											if(tplData[n]['selected'] == 1){
												if(sortData[m]['price_num']>1){
													oHtml += '<td class="tdBody" rowspan=\"'+sortData[m]['price_num']+'\">'+sortData[m]['price']+'</td>';
												}else if(sortData[m]['price'] != ""){
													oHtml += '<td class="tdBody">'+sortData[m]['price']+'</td>';
												}
											}
											break;
										case 'prices':
											if(tplData[n]['selected'] == 1){
												if(sortData[m]['prices_num']>1){
													oHtml += '<td class="tdBody" rowspan=\"'+sortData[m]['prices_num']+'\">'+sortData[m]['prices']+'</td>';
												}else if(sortData[m]['price'] != ""){
													oHtml += '<td class="tdBody">'+sortData[m]['prices']+'</td>';
												}
											}
											break;
									}
								}
								oHtml += '</tr>';
							}
							oHtml += '</table>';
							oHtml += '</body>';
							oHtml += '<script type="text/javascript">';
							oHtml += '$(".glassImgSmall").hover(function(){ $(this).parent().find(".glassImgBig").css("display","block");},function(){$(".glassImgBig").css("display","none");})';
							oHtml += '</script>';
						}else if(htmlData['way'] == '1'){
							var dataLen = sortData.length - 1;
							oHtml += '<tr>';
							oHtml += '	<td class="tdHeader">档口</td>';
							oHtml += '	<td class="tdHeader">货位</td>';
							oHtml += '	<td class="tdHeader">商品编码</td>';
							oHtml += '	<td class="tdHeader">图片</td>';
							oHtml += '	<td class="tdHeader">商品参数</td>';
							oHtml += '</tr>';
							
							var oldSkuId = "";
							var countNum = 0;
							var content = "";
							var oldCusNo = "";
							var oldPrdNo = "";
							var oldPrdLoc = "";
							var oldPicUrl = "";
							
							for(var i=0;i<sortData.length;i++){
								if((sortData[i]['prd_no'] != oldSkuId || sortData[i]['cus_no'] != oldCusNo || sortData[i]['prd_loc'] != oldPrdLoc) && i!=0){
									oHtml += '<tr>';
									oHtml += '<td class="tdBody">'+oldCusNo+'</td>';
									oHtml += '<td class="tdBody">'+oldPrdLoc+'</td>';
									oHtml += '<td class="tdBody">'+oldPrdNo+'</td>';
									oHtml += '<td class="tdBody" style="position: relative;">';
									oHtml += '<img class="glassImgSmall" src="'+oldPicUrl+'" width="70" height="70">';
									oHtml += '<img class="glassImgBig" src="'+oldPicUrl+'" width="500" height="500">';
									oHtml += '</td>';
									oHtml += '<td class="tdBody">'+content+'</td>';
									oHtml += '</tr>';
									oldCusNo = sortData[i]['cus_no'];
									oldPrdLoc = sortData[i]['prd_loc']?sortData[i]['prd_loc']:"";
									oldPrdNo = sortData[i]['prd_no'];
									oldPicUrl = sortData[i]['pic_url'];
									if(sortData[i]['sku_name']){
										content = sortData[i]['sku_name']+'*'+sortData[i]['num']+'，';
									}else{
										content = sortData[i]['prd_no']+'*'+sortData[i]['num']+'，';
									}
								}else{
									oldCusNo = sortData[i]['cus_no'];
									oldPrdLoc = sortData[i]['prd_loc']?sortData[i]['prd_loc']:"";
									oldPrdNo = sortData[i]['prd_no'];
									oldPicUrl = sortData[i]['pic_url'];
									if(sortData[i]['sku_name']){
										content += sortData[i]['sku_name']+'*'+sortData[i]['num']+'，';
									}else{
										content += sortData[i]['prd_no']+'*'+sortData[i]['num']+'，';
									}
								}
								if(dataLen == i){
									oHtml += '<tr>';
									oHtml += '<td class="tdBody">'+oldCusNo+'</td>';
									oHtml += '<td class="tdBody">'+oldPrdLoc+'</td>';
									oHtml += '<td class="tdBody">'+oldPrdNo+'</td>';
									oHtml += '<td class="tdBody" style="position: relative;">';
									oHtml += '<img class="glassImgSmall" src="'+oldPicUrl+'" width="70" height="70">';
									oHtml += '<img class="glassImgBig" src="'+oldPicUrl+'" width="500" height="500">';
									oHtml += '</td>';
									oHtml += '<td class="tdBody">'+content+'</td>';
									oHtml += '</tr>';
								}
								countNum = countNum + parseInt(sortData[i]['num']);
								oldSkuId = sortData[i]['prd_no'];
							}
							oHtml += '<tr>';
							oHtml += '<td class="tdBody">总计</td>';
							oHtml += '<td class="tdBody">&nbsp;</td>';
							oHtml += '<td class="tdBody">&nbsp;</td>';
							oHtml += '<td class="tdBody">&nbsp;</td>';
							oHtml += '<td class="tdBody">'+countNum+'</td>';
							oHtml += '</tr>';
							oHtml += '</table>';
							oHtml += '</body>';
							oHtml += '<script type="text/javascript">';
							oHtml += '$(".glassImgSmall").hover(function(){ $(this).parent().find(".glassImgBig").css("display","block");},function(){$(".glassImgBig").css("display","none");})';
							oHtml += '</script>';
						}
						oHtml += '</html>';
						funDownload(oHtml, '拿货汇总'+time+'.html');
					}else{
						layer.msg('已挂单或下架货品不能导出汇总',{
							icon: 0,
							time: 2000
						});
					}
				},error: function (jqXHR, textStatus, errorThrown) {
					layer.msg('jqXHR.responseText',{
						icon: 0,
						time: 2000
					});
				}
			});
			
			//导出表格封装
			var funDownload = function(content, filename) {
				var eleLink = document.createElement('a');
				eleLink.download = filename;
				eleLink.style.display = 'none';
				// 字符内容转变成blob地址
				var blob = new Blob([content]);
				eleLink.href = URL.createObjectURL(blob);
				// 触发点击
				document.body.appendChild(eleLink);
				eleLink.click();
				// 然后移除
				document.body.removeChild(eleLink);
			};
		},
		**/
		orderOutput:function(plan){

			var self = this;
			var result_total = self.result_total;
			
			if(result_total > 100000){
				layer.msg('数据量超过100000，无法导出，请先缩小查询范围',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			var data_parameter = "";
			if(self.versionSwitch==true){
				if($("input[name='order']").filter(':checked').length == 0 && $(".placeInput").val() == ""){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){
				//-----如果是当前页
					$("input[name='order']:checkbox").each(function(){
						if(true == $(this).is(':checked')){
							data_parameter += ($(this).val()+",");
						}
						//	拼接当前页的货品唯一码
					});
					data_parameter = data_parameter.substring(0,data_parameter.length-1);
				}else{
					data_parameter = self.searchData;
				}	
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data_parameter = data_parameter.substring(0,data_parameter.length-1);
				}else{
					data_parameter = self.searchData;
				}
			}
			var indexLoad = layer.load();

			//子账号

			if(LOGIN_SYSTEM_ID != LOGIN_USER_ID && plan == 2){

				execAjax({
					m:'system',
					c:'message',
					a:'getSmsSafe',
					data:{},
					success:function(data){
						console.log(data);
						//判断是否开启了短信验证
						if(data.code == '0000'){
							var phone = data.phone;
							//需要短信验证
							layer.open({
								title: '请输入验证码'
								,content: '<input type="text" id="smscode" >',
								yes: function(index, layero){
									var smscode = $("#smscode").val();

									execAjax({
										m:'system',
										c:'main',
										a:'getCode',
										data:{phone:phone},
										success:function(data){
											if(data.phone == phone && data.code == smscode){
												//验证通过
												execAjax({
													m:'system',
													c:'delivery',
													a:'exportOrderGrid',
													data:{
														data:data_parameter,isAll:self.isAll,sysPlan: self.sysPlan,plan: plan
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
											}else{
												alert("验证码错误");
											}

										}
									});

									layer.close(index); //如果设定了yes回调，需进行手工关闭
								},
								cancel: function(index, layero){
									layer.close(indexLoad);
								}

							});
						}else{
							execAjax({
								m:'system',
								c:'delivery',
								a:'exportOrderGrid',
								data:{
									data:data_parameter,isAll:self.isAll,sysPlan: self.sysPlan,plan: plan
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
						}
					}
				});
				//子账号----
			}else{
				execAjax({
					m:'system',
					c:'delivery',
					a:'exportOrderGrid',
					data:{
						data:data_parameter,isAll:self.isAll,sysPlan: self.sysPlan,plan: plan
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

			}





		},
		vendorTep:function(){
			//var url = "?m=system&c=cusUniqueCheck&a=outputExcel";
			//$("#ifile").attr('src',url);
			var indexLoad = layer.load();
			var time = new Date().getTime();
			$.ajax({
				url: "/index.php?m=system&c=cusUniqueCheck&a=outputExcel&loginact=file",
				type: 'post',
				data: {
					time:time,
				},
				dataType: 'text',
				success: function (text){
					layer.close(indexLoad);
					$("input[name='order']").iCheck('uncheck');
					$(".inputTe").css("color","white");
					self.isAll = 0;
					self.nowPage = false;
					self.allPage = false;
					if(!text){
						var url = "/xls/WaitSendorders"+time+".xls?loginact=file";
						$("#ifile").attr('src',url);
					}
				},error: function (jqXHR, textStatus, errorThrown) {
					layer.msg('jqXHR.responseText',{
						icon: 0,
						time: 2000
					});
				}
			});
		},
		//=====================打运单按钮=========================
        printYd:function(){
			var self = this;
            if(self.versionSwitch==true){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});								
					return false;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
			}				
			doGetPrinters(function(data){
				self.layprint =  data;				
			});					
			$("#layprintYd").val(0);
			//-----初始化选择框
			$("#layprintTplYd").val(0);
			//-----初始化选择框
			self.layprintTplYd = printTplYd;	
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getExpresss",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					if(data.printer != ""){
						$("#layprintYd").val(data.printer);
					}else{
						$("#layprintYd").val(0);
						printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
					}
					
					if(data.yd != ""){
						$("#layprintTplYd").val(data.yd);
					}else{
						$("#layprintTplYd").val(0);
						printerPrompt("未设置默认打印模板","运单设计","index.php?m=print&c=ydDesign&a=index");
					}
					
				}
			});
			layer.open({
				type: 1,
				title: '打印标签',
				skin: 'layui-layer-rim', 
				area: ['700px', '400px'], 
				shade: 0.3,	
				content: $("#table-printYd"),
				cancel: function (index, layero) {
					
				}
			});
		},
		//====================================================================================改快递按钮=========================================================================================================
		changeExpress:function(){
			var self = this;
			$('#batchExpress').val(0);
			if(self.versionSwitch==true){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});								
					return false;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
			}		
			layer.open({
				type: 1,
				title: '改快递',
				skin: 'layui-layer-rim', 
				area: ['700px', '320px'], 
				shade: 0.3,
				content: $("#edit-pages5"),
				cancel: function (index, layero) {
				}
			});	
		},
		auth:function(shoptype){
			if(shoptype == "TB" || shoptype == "TM"){
				window.open("https://oauth.taobao.com/authorize?response_type=code&client_id=23058998&redirect_uri=https://erp.jetm3.com/index_onErp.php&state=2589005&view=web");
			}else if(shoptype == "JD"){
				window.open("https://oauth.jd.com/oauth/authorize?response_type=code&client_id=EB2715259E9EA6B8C1C3F5CF7353F390&redirect_uri=https://erp.jetm3.com/index_onErp_jd.php&state=2589005");
			}else if(shoptype == "ALBB"){
				window.open("https://auth.1688.com/auth/authorize.htm?site=china&client_id=7201479&redirect_uri=https://erp.jetm3.com/index_onErp_albb.php&state=2589005");
			}else if(shoptype == "MGJ"){
				window.open("https://oauth.mogujie.com/authorize?response_type=code&app_key=100629&redirect_uri=https://erp.jetm3.com/index_onErp_mgj2.php&state=JQ");
			}else if(shoptype == "PDD"){
				window.open("http://mms.pinduoduo.com/open.html?response_type=code&client_id=3cd6d1c964634a84a49818a966719705&redirect_uri=https://erp.jetm3.com/index_onErp_pdd.php&state=JQ");
			}
        },
		changeOrderSign:function(){
			var self = this;
			$('#batchSignStatus').val(0);
			if(self.versionSwitch==true){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});								
					return false;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
			}	
			layer.open({
				type: 1,
				title: '标记订单',
				skin: 'layui-layer-rim', 
				area: ['700px', '320px'], 
				shade: 0.3,
				content: $("#edit-pages16"),
				cancel: function (index, layero) {
				}
			});	
		},
		changeStorage:function(){
			var self = this;
			$('#batchStorage').val(0);
			if(self.versionSwitch==true){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});								
					return false;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
			}		
			layer.open({
				type: 1,
				title: '改仓库',
				skin: 'layui-layer-rim', 
				area: ['700px', '300px'], 
				shade: 0.3,
				content: $("#edit-pages13"),
				cancel: function (index, layero) {
				}
			});	
		},
		shopOnly:function(){
			var self = this;
			self.showshop = !self.showshop;
			var arr = [];
			var name = [];
			
			$('input[name="shopList"]').each(function(){
				$(this).on('ifChecked ifUnchecked', function(event){
					var newArr = [];
					var nameArr = [];
					if (event.type == 'ifChecked') {
						$('input[name="shopList"]').each(function(){
							if(true == $(this).is(':checked')){
								newArr.push($(this).prop("class"));
								nameArr.push($(this).val());
							}
						});
						
						arr = newArr;
						name = nameArr;		
					} else {
						$('input[name="shopList"]').each(function(){
							if(true == $(this).is(':checked')){
								newArr.push($(this).prop("class"));
								nameArr.push($(this).val());
							}
						});
						arr = newArr;
						name = nameArr;
					}
					var a = "";
					var b = "";
					for(var i = 0; i < arr.length; i++){
						a += (arr[i] + ",");
						b += (name[i] + ",");
					}
					a = a.substring(0,a.length-1);
					b = b.substring(0,b.length-1);
					
					$("#shop").val(a);
					$("#shop").attr("name",b);
					
					self.shopId = b;
				});
			});
		},
		batchRemarkUpload:function(){
			var self = this;
			$("#pages18-remark").val("");
			if(self.versionSwitch==true){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});								
					return false;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
			}
			layer.open({
				type: 1,
				title: '批量回传卖家备注',
				skin: 'layui-layer-rim', 
				area: ['700px', '400px'], 
				shade: 0.3,
				content: $("#edit-pages18"),
				cancel: function (index, layero) {
				
				}
			});	
		},
		batchSetRemark:function(){
			var self = this;
			$("#pages20-remark").val("");
			if(self.versionSwitch==true){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});								
					return false;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
			}
			layer.open({
				type: 1,
				title: '批量设置备注',
				skin: 'layui-layer-rim', 
				area: ['700px', '400px'], 
				shade: 0.3,
				content: $("#edit-pages20"),
				cancel: function (index, layero) {
				
				}
			});	
		},
		doBatchRemarkUpload:function(){
			var self = this;
			var remark = $("#pages18-remark").val();
			
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
				url: "/index.php?m=system&c=delivery&a=batchRemarkUpload",																																		
				type: 'post',																																												
				data: {data: data, isAll: self.isAll, sellerType: self.sellerType, remark: remark},																																													
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
		mulitPackageUpload:function(){
			var self = this;
			var packageval = $("#pages99-packageval").val();
			var data = self.searchData;
			if(self.isAll == 0){														//-----如果是当前页	
				var data = "";																						
				$("input[name='order']:checkbox").each(function(){						//--------------------------																				
					if(true == $(this).is(':checked')){									//																											
						data += ($(this).val()+",");									//																											
					}																	//	拼接当前页的货品唯一码																					
				});																		//																							
				data = data.substring(0,data.length-1);									//--------------------------																														
			}else{
				layer.msg("此操作不支持全部页",{
					icon: 0,
					time: 2000
				});
				
				return false;
			}
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=doMulitPackageUpload",
				type: 'post',
				data: {data: data, isAll: self.isAll, packageval: packageval, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
				dataType: 'json',
				success: function (data) {
					if(data.code == "ok"){
						layer.msg("设置成功",{
							icon: 1,
							time: 2000
						});
						searchALLNow(self,'page');
					}else{
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
		},
		replacePrd:function(){
			var self = this;
			$('#pages17-prd_no1').val('');
			$('#pages17-prd_no2').val('');
			if(self.versionSwitch==true){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});								
					return false;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
			}
			layer.open({
				type: 1,
				title: '替换商品编码',
				skin: 'layui-layer-rim', 
				area: ['700px', '300px'], 
				shade: 0.3,
				content: $("#edit-pages17"),
				cancel: function (index, layero) {
				}
			});
		},
		batchSaveStorage:function(){
			var self = this;
			var batchStorage = $('#batchStorage').val();
			if(batchStorage == "" || batchStorage == "0"){
				layer.msg('请选择仓库',{
					icon: 2,
					time: 2000
				});
				return false;
			}
			
			var data = self.searchData;
			if(self.isAll == 0){
				var data = "";																						
				$("input[name='order']:checkbox").each(function(){						
					if(true == $(this).is(':checked')){									
						data += ($(this).val()+",");									
					}
				});																		
				data = data.substring(0,data.length-1);
			}
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=batchSaveStorage",
				type: 'post',
				data: {data: data, isAll: self.isAll, batchStorage: batchStorage},
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
		doBatchReplacePrd:function(){
			var self = this;
			
			var prd_no1 = $('#pages17-prd_no1').val();
			var prd_no2 = $('#pages17-prd_no2').val();
			
			if($.trim(prd_no1) == ""){
				layer.msg('请输入替换前商品编码',{
					icon: 2,
					time: 2000
				});
				return false;
			}
			
			if($.trim(prd_no2) == ""){
				layer.msg('请输入替换后商品编码',{
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
				url: "/index.php?m=system&c=delivery&a=doBatchReplacePrd",																																		
				type: 'post',																																												
				data: {data: data, isAll: self.isAll, prd_no1: prd_no1, prd_no2: prd_no2},																																													
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
		directOrderSend:function(){//直接发货
			var self = this;
			if(self.versionSwitch==true){
				if($("input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				var data = self.searchData;
				if(self.isAll == 0){
					var data = "";																						
					$("input[name='order']:checkbox").each(function(){						
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");									
						}
					});																		
					data = data.substring(0,data.length-1);	
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){
					var data = "";																						
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}															
					data = data.substring(0,data.length-1);	
				}
			}
			
			layer.confirm('确认不打快递单直接发货？', {
				btn: ['确认','取消'] //按钮
			}, function(index){
				$.ajax({
					url: "/index.php?m=system&c=delivery&a=directOrderSend",
					type: 'post',
					data: {data: data, isAll: self.isAll},
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
								skin: 'layui-layer-rim', 
								area: ['800px', '400px'], 
								shade: 0.3,																				
								content: $("#default")
							});
						}
						searchALLNow(self,'page');
					}
				});
				layer.close(index);
			});			
		},
		mulitPackage:function(){
			var self = this;
			$("#pages99-packageval").val("1");
			if(self.versionSwitch==true){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});								
					return false;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
			}
			layer.open({
				type: 1,
				title: '设置额外包裹数量',
				skin: 'layui-layer-rim', 
				area: ['700px', '400px'], 
				shade: 0.3,
				content: $("#edit-pages99"),
				cancel: function (index, layero) {
				
				}
			});	
		},
		doBatchSetRemark:function(){
			var self = this;
			var remark = $("#pages20-remark").val();

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
			if(self.sellerType == 0){
				layer.msg('请选择一种添加方式',{
					icon: 2,
					time: 2000
				});
				return false;
			}
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=batchSetRemark",																																		
				type: 'post',																																												
				data: {data: data, isAll: self.isAll, sellerType: self.sellerType, remark: remark},																																													
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
		//==================================================================================改快递按钮结束=======================================================================================================
		//====================================================================================改快递方法按钮=========================================================================================================
		/*batchSaveExpress:function(){
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
				url: "/index.php?m=system&c=delivery&a=batchCheckMoreCode",																																		
				type: 'post',																																												
				data: {data: data, isAll: self.isAll},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "error"){
						layer.confirm('有已打印标签的订单，改快递将会重算群单码，确认修改快递？', {
							btn: ['确认','取消'] //按钮
						}, function(){
							self.doBatchSaveExpress();
						});	
					}else{
						self.doBatchSaveExpress();
					}
				}																																															
			});
		},*/
		doBatchSaveExpress:function(){
			var self = this;
			var batchExpress = $('#batchExpress').val();
			if(batchExpress == "" || batchExpress == "0"){
				layer.msg('请选择快递类型',{
					icon: 2,
					time: 2000
				});
				return false;
			}
			if(self.versionSwitch==true){
				var data = self.searchData;
				if(self.isAll == 0){
					var data = "";																						
					$("input[name='order']:checkbox").each(function(){						
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");									
						}																				
					});	
					data = data.substring(0,data.length-1);
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(self.isAll == 0){//-----如果是当前页	
					data = "";	
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}																	
					data = data.substring(0,data.length-1);									
				}
			}
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=batchSaveExpress",
				type: 'post',
				data: {data: data, isAll: self.isAll, batchExpress: batchExpress},
				dataType: 'json',
				success: function (data_ajax) {
					if(data_ajax.code == "ok"){
						layer.closeAll();
						layer.msg('操作成功',{
							icon: 1,
							time: 2000
						});

						if(self.isAll == 0 ){//当前页

							var checked_order_arr = data.split(",");
							$("span[name='express_name']").each(function(){

								if(checked_order_arr.indexOf($(this).attr('value')) != -1){
									$(this).html(data_ajax.express_name);
								}

							});

						}else{
							searchALLNow(self,'page');
						}


					}else if(data_ajax.code == "error"){
						layer.closeAll();
						layer.msg('操作失败，'+data_ajax.msg,{
							icon: 2,
							time: 2000
						});
						searchALLNow(self,'page');
					}

				}
			});	
		},
		doBatchSignOrders:function(){
			var self = this;
			
			var batchSignStatus = $('#batchSignStatus').val();
			if(batchSignStatus == ""){
				layer.msg('请选择标记状态',{
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
				url: "/index.php?m=system&c=delivery&a=batchSignOrders",																																		
				type: 'post',																																												
				data: {data: data, isAll: self.isAll, batchSignStatus: batchSignStatus, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},																																													
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
						layer.msg('操作失败，'+data.msg,{
							icon: 2,
							time: 2000
						});
					}
					
					searchALLNow(self,'page');
				}																																															
			});	
		},
		//==================================================================================改快递方法结束=======================================================================================================
		
		//======================================================================================打印弹窗=========================================================================================================
		print2:function(type){																																											
																																				
			var self = this;																																										
																																																	
			if(self.printType == ""){
				layer.msg('请选择打印类型',{
					icon: 2,
					time: 2000
				});
				return false;
			}else{
				//layer.closeAll();
			}
																																																	
			doGetPrinters(function(data){																																							
				self.layprint =  data;																																								
			});																																														
																																																	
			$("#layprint").val(0);											//-----初始化选择框																										
			$("#layprintTplBq").val(0);										//-----初始化选择框																										
																																																	
			self.layprintTplBq = printTplBq;
			
			layer.open({																																											
				type: 1,																																											
				title: '打印标签',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['700px', '400px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#table-print"),		
				btn: ['确定打印']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					if(self.isFirst == true){
						self.setyesorder(type);
						self.isFirst = false;
					}
					setTimeout(function(){
						self.isFirst = true;
					},200);
					layer.close(index);
				},
				cancel: function (index, layero) {																																					
																																																
				},
				success:function(){
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
								$("#layprint").val(data['result'].printer);
								$("#layprintTplBq").val(0);
								printerPrompt("未设置默认打印模板","标签设计","index.php?m=print&c=bqDesign&a=index");
							}else if(data['result'].printer == "" && data['bq'].id != ""){
								$("#layprint").val(0);
								$("#layprintTplBq").val(data['bq'].id);
								printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
							}else{
								$("#layprint").val(0);
								$("#layprintTplBq").val(0);
								printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
							}
						}																																															
					});
				}
			});
		},																																															
		//====================================================================================打印弹窗结束=======================================================================================================
		
		//======================================================================================确定打印=========================================================================================================
		setyesorder:function(type){	
			var self = this;																																										
			var data = "";																																											
			if($("#layprint").val() != 0){																																							
				var unprintname = $("#layprint").val();																																				
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}																																														
			if($("#layprintTplBq").val() != 0){																																						
				var unprintTplBq = $("#layprintTplBq").val();																																		
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}
			
			if(type == "page"){
				if(self.isAll == 0){														//-----如果是当前页																							
					$("#bottomDiv input[name='order']:checkbox").each(function(){						//--------------------------																				
						if(true == $(this).is(':checked')){									//																											
							data += ($(this).val()+",");									//																											
						}																	//	拼接当前页的货品唯一码																					
					});																		//																							
					data = data.substring(0,data.length-1);									//--------------------------																														
				}else{
					data = self.searchData;
				}
				
				$.ajax({																																									
					url: "/index.php?m=system&c=delivery&a=printData",																															
					type: 'post',																																										
					data: {data:data,printType:self.printType,isAll:self.isAll,exception:self.exception},																																									
					dataType: 'json',																																						
					success: function (data) {
						var error = data.error_array;						
						var data = 	data.dates;
						
						if(data[0] != ""){																																					
							var percent = 0;											//-----进度条初始化																					
							layer.closeAll();																																				
							$(".sche").css("display","block");							//-----进度条窗口显示																				
																																																	
							var i = 0;																																						
							countSecond(i,data);																																							
							function countSecond(i,data)																																	
							{ 																																						
																																												
								if(i<data.length){																																			
									layui.use('element', function(){					//----------																					
										var element = layui.element();					//																							
										element.init();									//	进度条																					
										percent += Math.ceil(100 / data.length);		//																									
										element.progress('demo', percent + '%');		//																								
									});													//----------																				
																																															
									printTpl[unprintTplBq](unprintname,data[i]);																											
									i = i+1;																																		
									setTimeout(function(){																																	
										countSecond(i,data);																																
									}, 1000)																																		
								}else{																																				
									$(".sche").css("display","none");					//-----进度条窗口关闭																				
									searchALLNow(self,'page');	
									layer.msg('打印完成',{
										icon: 1,
										time: 2000
									});																								
									return																																					
								}																																						
																																															
							}	
							$("input[name='order']").iCheck('uncheck');
							$(".inputTe").css("color","white");
							self.isAll = 0;
							self.nowPage = false;
							self.allPage = false;
						}else{
							layer.msg(error[0].error_msg,{
								icon: 2,
								time: 2000
							});
						}																																									
					}																																									
				});	
			}else{
				
				$(".more input[name='order']:checkbox").each(function(){						//--------------------------																				
					if(true == $(this).is(':checked')){									//																											
						data += ($(this).val()+",");									//																											
					}																	//	拼接当前页的货品唯一码																					
				});																		//																							
				data = data.substring(0,data.length-1);									//--------------------------																														
				
				$.ajax({																																									
					url: "/index.php?m=system&c=delivery&a=printDataOne",																															
					type: 'post',																																										
					data: {data:data,printType:self.printType,exception:self.exception},																																									
					dataType: 'json',																																						
					success: function (data) {
						var error = data.error_array;
						var data = 	data.dates;
																																														
						if(data[0] != ""){																																					
							var percent = 0;											//-----进度条初始化																					
							layer.closeAll();																																				
							$(".sche").css("display","block");							//-----进度条窗口显示																				
																																																	
							var i = 0;																																						
							countSecond(i,data);																																							
							function countSecond(i,data)																																	
							{ 																																						
																																												
								if(i<data.length){																																			
									layui.use('element', function(){					//----------																					
										var element = layui.element();					//																							
										element.init();									//	进度条																					
										percent += Math.ceil(100 / data.length);		//																									
										element.progress('demo', percent + '%');		//																								
									});													//----------																				
																																															
									printTpl[unprintTplBq](unprintname,data[i]);																											
									i = i+1;																																		
									setTimeout(function(){																																	
										countSecond(i,data);																																
									}, 1000)																																		
								}else{																																				
									$(".sche").css("display","none");					//-----进度条窗口关闭																				
									searchALLNow(self,'page');	
									layer.msg('打印完成',{
										icon: 1,
										time: 2000
									});
									$(".skin-minimal input[name='lab']").iCheck('uncheck');
									
									return																																					
								}																																						
																																															
							}																																						
						}else{
							layer.msg(error[0].error_msg,{
								icon: 2,
								time: 2000
							});
						}																																									
					}																																									
				});	
			}
			
			
			searchALLNow(self,'page');
			$(".inputTe").css("color","white");
			self.isAll = 0;
			self.nowPage = false;
			self.allPage = false;
																																													
		},
        //======================================================================================确定打印=========================================================================================================
		setyesorderYd:function(){
			var self = this;
			var data = "";
			var printInputYd = $("#printInputYd").val();
			
			if($("#layprintYd").val() != 0){
				var unprintname = $("#layprintYd").val();
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return
			}
			if($("#layprintTplYd").val() != 0){
				var unprintTplYd = $("#layprintTplYd").val();
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return
			}
			if(self.isAll == 0){
				//-----如果是当前页
				$("input[name='order']:checkbox").each(function(){	
					if(true == $(this).is(':checked')){			
						data += ($(this).val()+",");					
					}
					//	拼接当前页的货品唯一码					
				});
				data = data.substring(0,data.length-1);
			}else{
				data = self.searchData;
			}
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=printDataYd",
				type: 'post',
				data: {data:data, printInputYd: printInputYd, isAll:self.isAll, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},		
				dataType: 'json',
				success: function (data) {
					if(data){
						if(data[0].length == 0){
							layer.msg('没有打印的内容',{
								icon: 0,
								time: 2000
							});							
							return
						}
						var percent = 0;
						//-----进度条初始化
						layer.closeAll();
						$(".sche").css("display","block");
						//-----进度条窗口显示
						var i = 0;					
						countSecond(i,data);				
						function countSecond(i,data)
						{
							if(i<data.length){
								layui.use('element', function(){			
									var element = layui.element();
									element.init();
									//	进度条	
									percent += Math.ceil(100 / data.length);
									element.progress('demo', percent + '%');
								});
								printTpl[unprintTplYd](unprintname,data[i]);
								i = i+1;
								setTimeout(function(){
									countSecond(i,data);
								}, 1000)
							}else{							
								$(".sche").css("display","none");//-----进度条窗口关闭
								searchALLNow(self,'page');				
								layer.msg('打印完成',{
									icon: 1,
									time: 2000
								});							
								return
							}
						}
					}
					searchALLNow(self,'page');	
					$("input[name='order']").iCheck('uncheck');
					$(".inputTe").css("color","white");
					self.isAll = 0;
					self.nowPage = false;
					self.allPage = false;
				}
			});
		},	
		setyesorderDSOS:function(type){
			var self = this;
			var data = "";
			var printerList = self.layprintTplDSOS;
			var onOff = 1;
			var layprintDSOS = $("#layprintTplDSOS").val();
			var printInputDSOS = $("#printInputDSOS").val();
			for(var i=0; i<printerList.length; i++){
				if(printerList[i]['id'] == layprintDSOS){
					var onOff = 2;
				}
			}
			if(onOff == 1){
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return false;
			}
			if($("#layprintDSOS").val() != 0){
				var unprintname = $("#layprintDSOS").val();
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return
			}
			if($("#layprintTplDSOS").val() != 0){
				var unprintTplDSOS = $("#layprintTplDSOS").val();
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return
			}
			if(self.isAll == 0){//-----如果是当前页
				$("input[name='order']:checkbox").each(function(){
					if(true == $(this).is(':checked')){
						data += ($(this).val()+",");
					}//拼接当前页的货品唯一码
				});
				data = data.substring(0,data.length-1);
			}else{
				data = self.searchData;
			}
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=printDataDSOS",		
				type: 'post',
				data: {data:data,printInputDSOS:printInputDSOS,isAll:self.isAll, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId, printOrder: type},
				dataType: 'json',
				success: function (data) {
					if(data){
						var percent = 0;
						//-----进度条初始化
						layer.closeAll();
						$(".sche").css("display","block");
						//-----进度条窗口显示
						var i = 0;
						countSecond(i,data);
						function countSecond(i,data){
							if(i<data.length){
								layui.use('element', function(){
									var element = layui.element();
									element.init();//进度条
									percent += Math.ceil(100 / data.length);
									if(percent>100){
										percent = 100;
									}
									element.progress('demo', percent + '%');
								});
								var printData = [];
								printData.push(data[i]);
								printLodopTpl[unprintTplDSOS](unprintname,printData);
								i = i+1;
								setTimeout(function(){
									countSecond(i,data);
								}, 1000)
							}else{
								$(".sche").css("display","none");//-----进度条窗口关闭
								searchALLNow(self,'page');
								layer.msg('打印完成',{
									icon: 1,
									time: 2000
								});
								return
							}
						}
					}
					searchALLNow(self,'page');	
					$("input[name='order']").iCheck('uncheck');
					$(".inputTe").css("color","white");
					self.isAll = 0;
					self.nowPage = false;
					self.allPage = false;
				}
			});
		},//当前页 全部页 事件 
		setyesorderDSOSMake:function(PRINT_BAT_NO,print_index_start,print_index_end){
			var self = this;
			var data = "";
			var printerList = self.layprintTplDSOS;
			var onOff = 1;
			var layprintDSOS = $("#layprintTplDSOSMake").val();
			for(var i=0; i<printerList.length; i++){
				if(printerList[i]['id'] == layprintDSOS){
					var onOff = 2;
				}
			}
			if(onOff == 1){
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return false;
			}
			if($("#layprintDSOSMake").val() != 0){
				var unprintname = $("#layprintDSOSMake").val();
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return
			}
			if($("#layprintTplDSOSMake").val() != 0){
				var unprintTplDSOS = $("#layprintTplDSOSMake").val();
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return
			}
			if(self.isAll == 0){//-----如果是当前页
				$("input[name='order']:checkbox").each(function(){
					if(true == $(this).is(':checked')){
						data += ($(this).val()+",");
					}//拼接当前页的货品唯一码
				});
				data = data.substring(0,data.length-1);
			}else{
				data = self.searchData;
			}
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=printDataDSOSMake",		
				type: 'post',
				data: {PRINT_BAT_NO:PRINT_BAT_NO,print_index_start:print_index_start,print_index_end:print_index_end},
				dataType: 'json',
				success: function (data) {
					if(data){
						var percent = 0;
						//-----进度条初始化
						layer.closeAll();
						$(".sche").css("display","block");
						//-----进度条窗口显示
						var i = 0;
						countSecond(i,data);
						function countSecond(i,data){
							if(i<data.length){
								layui.use('element', function(){
									var element = layui.element();
									element.init();//进度条
									percent += Math.ceil(100 / data.length);
									if(percent>100){
										percent = 100;
									}
									element.progress('demo', percent + '%');
								});
								var printData = [];
								printData.push(data[i]);
								printLodopTpl[unprintTplDSOS](unprintname,printData);
								i = i+1;
								setTimeout(function(){
									countSecond(i,data);
								}, 1000)
							}else{
								$(".sche").css("display","none");//-----进度条窗口关闭
								searchALLNow(self,'page');
								layer.msg('打印完成',{
									icon: 1,
									time: 2000
								});
								return
							}
						}
					}
					searchALLNow(self,'page');	
					$("input[name='order']").iCheck('uncheck');
					$(".inputTe").css("color","white");
					self.isAll = 0;
					self.nowPage = false;
					self.allPage = false;
				}
			});
		},//当前页 全部页 事件 
		
		
		//点击时通过传过来的值判断是哪个按钮执行此方法
		//		type          : 判断是当前页还是全部页	
		//		nowPage       : 判断当前页 i（.inputTe） 标签是否为勾选状态
		//		allPage       : 判断全部页 i（.inputTe） 标签是否为勾选状态
		//		isAll     	  : 记录目前为全部页还是当前页，用于传入后台做判断
		//		event.target  : 获取当前点击对象
		//
		//		为避免button 内的checkbox勾选无效，所以用 i（.inputTe） 标签画一个 虚拟 checkbox 每次点击切换背景颜色
		//======================================================================
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
					grid1.selectAll();
					$(".skin input[name='order']").iCheck('check');	
				}else if(self.nowPage == true){
					if($(event.target).attr('value') != "icon"){
						$(event.target).find(".inputTe").css("color","white");
					}else{
						$(event.target).css("color","white");
					}
					self.nowPage = false;
					grid1.deselectAll();
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
					grid1.selectAll();
				}else if(self.allPage == true){
					if($(event.target).attr('value') != "icon"){
						$(event.target).find(".inputTe").css("color","white");
					}else{
						$(event.target).css("color","white");
					}
					self.allPage = false;
					$(".skin input[name='order']").iCheck('uncheck');	
					self.isAll = 0;
					grid1.deselectAll();
				}
			}
			
			if(self.isAll == 0){
				$('#selectOrderNum').html($("input[name='order']").filter(':checked').length);
			}else{
				$('#selectOrderNum').html(self.result_total);
			}
		},
		
		//=============================================分页开始============================//
		page: function(pager){
			var self = this;
			layer.load(2);			
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
			
			searchALLNow(self,'page',function(){
				layer.closeAll('loading');
			});
			
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
			if(self.versionSwitch==true){
				if(type == "page"){
					if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
						layer.msg('请选择至少一条数据',{
							icon: 0,
							time: 2000
						});
						return false;
					}		
				}
			}else{
				if(type == "page"){
					var selectRows = grid1.getSelecteds();
					if(selectRows.length == 0){
						layer.msg('请选择至少一条数据',{
							icon: 0,
							time: 2000
						});
						return false;
					}
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
					//按钮【按钮一】的回调
					self.orderLock('LOCK',type);
				}
				,btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {
				}
			});	
		},
		addOrderItems:function(tid){
			var self = this;
			var form = layui.form();
			
			if(WMS_MODEL != "T" && WMS_MODEL != "PT"){
				$("#pages11-prd_no").attr("readonly",false);
				$("#pages11-title").attr("readonly",false);
				$("#pages11-sku_name").attr("readonly",false);
			}
			
			$("#pages11-prd_id").val("");
			$("#pages11-prd_sku_id").val("");
			$("#pages11-prd_no").val("");
			$("#pages11-title").val("");
			$("#input-area").val('');
			$("#img").attr("src",'');
			$("#pages11-sku_name").val("");
			$("#pages11-num").val("");
			$("#pages11-price").val("");
			$("#pages11-take_price").val("");
			$("#pages11-pic_path").val("");
			
			$("#form2")[0].reset();
			var timestamp = Date.parse(new Date());
			$("#pages11-newtimestramp").val(timestamp);
			
			//$("#pages11-gift").val("");
			//$("#pages11-gift").checked = false;
			//$("#pages11-gift").attr("checked",false);
			//$("#pages11-gift").remove("checked");
			//$("#pages11-gift").removeAttr("checked");
			
			//$("#pages11-gift").attr("checked","checked");
			
			//form.render('checkbox','pages11-gift');
			
			layer.open({																																											
				type: 1,																																											
				title: '添加商品',																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['500px', '500px'], //宽高
				shade: 0.3,																																											
				content: $("#edit-pages11"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var indexLoad = layer.load();
					if($("#pages11-prd_no").val() == ""){
						layer.close(indexLoad);
						layer.msg('请先选择一个商品',{
							icon: 0,
							time: 2000
						});
						return false;	
					}
					
					if($("#pages11-num").val() == "" || $("#pages11-num").val() == 0){
						layer.close(indexLoad);
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
						take_price: $("#pages11-take_price").val(),
						pic_path: $("#pages11-pic_path").val(),
						gift: $("#pages11-gift").is(':checked')
					};
					
					self.orderItemsAdd(index,tid,param,indexLoad);
					return false;
				},
				cancel: function (index, layero) {																																					
					
				}																																													
			});
		},
		addOrderItems:function(tid){
			var self = this;
			var form = layui.form();
			
			if(WMS_MODEL != "T" && WMS_MODEL != "PT"){
				$("#pages11-prd_no").attr("readonly",false);
				$("#pages11-title").attr("readonly",false);
				$("#pages11-sku_name").attr("readonly",false);
			}
			
			$("#pages11-prd_id").val("");
			$("#pages11-prd_sku_id").val("");
			$("#pages11-prd_no").val("");
			$("#pages11-title").val("");
			$("#input-area").val('');
			$("#img").attr("src",'');
			$("#pages11-sku_name").val("");
			$("#pages11-num").val("");
			$("#pages11-price").val("");
			$("#pages11-take_price").val("");
			$("#pages11-pic_path").val("");
			
			$("#form2")[0].reset();
			var timestamp = Date.parse(new Date());
			$("#pages11-newtimestramp").val(timestamp);
			
			//$("#pages11-gift").val("");
			//$("#pages11-gift").checked = false;
			//$("#pages11-gift").attr("checked",false);
			//$("#pages11-gift").remove("checked");
			//$("#pages11-gift").removeAttr("checked");
			
			//$("#pages11-gift").attr("checked","checked");
			
			//form.render('checkbox','pages11-gift');
			
			layer.open({																																											
				type: 1,																																											
				title: '添加商品',																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['500px', '500px'], //宽高
				shade: 0.3,																																											
				content: $("#edit-pages11"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var indexLoad = layer.load();
					if($("#pages11-prd_no").val() == ""){
						layer.close(indexLoad);
						layer.msg('请先选择一个商品',{
							icon: 0,
							time: 2000
						});
						return false;	
					}
					
					if($("#pages11-num").val() == "" || $("#pages11-num").val() == 0){
						layer.close(indexLoad);
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
						take_price: $("#pages11-take_price").val(),
						pic_path: $("#pages11-pic_path").val(),
						gift: $("#pages11-gift").is(':checked')
					};
					
					self.orderItemsAdd(index,tid,param,indexLoad);
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
		orderItemsAdd:function(index,tid,data,indexLoad){
			var self = this;
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=orderItemsAdd",																																		
				type: 'post',																																												
				data: {data: data, tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					layer.close(indexLoad);
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
									$(document).ready(function(){
										$('.skin1 input').iCheck({
											checkboxClass: 'icheckbox_minimal',
											radioClass: 'iradio_minimal',
											increaseArea: '20%'
										});
									});
									searchALLNow(self,'page');
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
				},error: function(jqXHR, textStatus, errorThrown){
					layer.close(indexLoad);
					layer.msg('操作失败',{
							icon: 2,
							time: 2000
						});
				}
				
			});
		},
		
		modificationPic:function(index,oid,pic_url){
			var self = this;
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=editPic",							
				type: 'post',								
				data: {oid: oid,pic_url: pic_url},								
				dataType: 'json',									
				success: function (data) {
					if(data.code == "ok"){
						layer.msg('修改成功',{
							icon: 1,
							time: 2000
						});
						layer.close(index);
					}else if(data.code == "error"){
						layer.msg('修改失败',{
							icon: 2,
							time: 2000
						});
					}
				}							
			});
		},
		//====================================================================================锁订单按钮=========================================================================================================
		orderLock:function(method,type){
			var self = this;
			var data = "";
			var nowIsAll = self.isAll;
			var lockMsg = $("#lockMsg").val();
			if(self.versionSwitch==true){
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
			}else{
				if(type == "page"){
					var selectRows = grid1.getSelecteds();
					if(selectRows.length == 0){
						layer.msg('请选择至少一条数据',{
							icon: 0,
							time: 2000
						});
						return false;
					}
					if(self.isAll == 0){//-----如果是当前页	
						for(var i = 0; i < selectRows.length; i++){
							data += selectRows[i]['new_tid'] + ",";
						}
						data = data.substring(0,data.length-1);	
					}
				}else{
					data = type;
					self.isAll = 0;
				}
			}
			
			if(method == "LOCK"){
				var url = "/index.php?m=system&c=delivery&a=setTidLock";
			}else if(method == "UNLOCK"){
				var url = "/index.php?m=system&c=delivery&a=setTidUnlock";
			}
			$.ajax({									
				url: url,
				type: 'post',
				data: {data: data, isAll: self.isAll, lockMsg: lockMsg, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
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
		preDeliveryForce:function(){
			var self = this;
			var data = "";
			if(self.versionSwitch==true){
				var nowIsAll = self.isAll;
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
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){//-----如果是当前页	
					data = "";
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);	
				}
			}
			
			if($("#preDeliveryForce").hasClass("layui-btn-disabled")){
				return false;
			}
			$("#preDeliveryForce").addClass("layui-btn-disabled");
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=preDeliveryForce",																	
				type: 'post',
				data: {data: data, isAll: self.isAll, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
				dataType: 'json',
				success: function (data) {
					$("#preDeliveryForce").removeClass("layui-btn-disabled");
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
							skin: 'layui-layer-rim', 
							area: ['800px', '400px'], 
							shade: 0.3,
							content: $("#default")
						});
					}
					searchALLNow(self,'page');
				}
			});	
			self.isAll =  nowIsAll;
		},
		//==================================================================================锁订单结束=======================================================================================================
		//================预发货开始=============
		preDelivery:function(actionType){
            var self = this;

            layui.use('layer', function(){
                var layer = layui.layer;
                layer.confirm('确定预发货吗？', {icon: 3, title:'提示'}, function(index){
                    //do something

                    self.preDeliveryMsg = [];
                    layui.use('element', function(){
                        var element = layui.element();					//
                        element.init();	//	进度条
                        element.progress('delivery', '0%');	//11
                        $("#pages8-title").html("");
                    });

                    if(self.versionSwitch==true){
                        if($("input[name='order']").filter(':checked').length == 0){
                            layer.msg('请选择至少一条数据',{
                                icon: 0,
                                time: 2000
                            });
                            return false;
                        }
                        var data = self.searchData;
                        if(self.isAll == 0){
                            var data = "";
                            $("input[name='order']:checkbox").each(function(){
                                if(true == $(this).is(':checked')){
                                    data += ($(this).val()+",");
                                }
                            });
                            data = data.substring(0,data.length-1);
                        }
                    }else{
                        var selectRows = grid1.getSelecteds();
                        if(selectRows.length == 0){
                            layer.msg('请选择至少一条数据',{
                                icon: 0,
                                time: 2000
                            });
                            return false;
                        }
                        if(self.isAll == 0){
                            var data = "";
                            for(var i = 0; i < selectRows.length; i++){
                                data += selectRows[i]['new_tid'] + ",";
                            }
                            data = data.substring(0,data.length-1);
                        }
                    }

                    var preDeliveryIndex = layer.open({
                        type: 1,
                        title: '预发货',
                        skin: 'layui-layer-rim',
                        area: ['700px', '500px'],
                        shade: 0.3,
                        content: $("#edit-pages8"),
                        cancel: function (index, layero) {
                        }
                    });
                    $("#progress-delivery").css("display","block");
                    var time = new Date().getTime();
                    $.ajax({
                        url: "/index.php?m=system&c=delivery&a=preDelivery",
                        type: 'post',
                        data: {data: data, isAll: self.isAll,time: time, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
                        dataType: 'json',
                        success: function (data) {
                            if(data.code == "error"){
                                self.preDeliveryMsg = data.error_msg;
                                /*if(actionType == "print_all"){
                                    $("#print_all").prop("disabled",false);
                                }*/
                            }else if(data.code == "ok"){
                                layer.close(preDeliveryIndex);
                                layer.msg('预发货成功',{
                                    icon: 1,
                                    time: 2000
                                });
                                /*if(actionType == "send"){
                                    self.faceAlone("page");
                                }else if(actionType == "print_all"){
                                    self.doPrint_all();
                                }else */

                                if(actionType == "direct"){
                                    self.directOrderSend();
                                }else{
                                    searchALLNow(self,'page');
                                    $("input[name='order']").iCheck('uncheck');
                                    $(".inputTe").css("color","white");
                                    self.isAll = 0;
                                    self.nowPage = false;
                                    self.allPage = false;
                                }
                            }
                        },error: function(jqXHR, textStatus, errorThrown){
                            console.log(jqXHR);
                            console.log(textStatus);
                            console.log(errorThrown);
                        }
                    })

                    var Interval = setInterval(function(){
                        $.ajax({
                            url: "/index.php?m=system&c=delivery&a=getDeliveryPer",
                            type: 'post',
                            data: {time: time},
                            dataType: 'json',
                            success: function (data) {
                                if(data){
                                    layui.use('element', function(){
                                        var element = layui.element();
                                        element.init();			//进度条
                                        element.progress('delivery', data.per + '%');
                                        $("#pages8-title").html(data.msg);
                                    });

                                    if(data.code == "end"){
                                        clearInterval(Interval);
                                    }
                                }else{
                                    clearInterval(Interval);
                                }
                            },error: function(){
                                clearInterval(Interval);
                            }
                        });
                    },1000);

                    layer.close(index);
                });
            });
		},
		expressGet:function(){
			var self = this;	
			self.preDeliveryMsg = [];
			layui.use('element', function(){					
				var element = layui.element();					
				element.init();
				element.progress('delivery', '0%');
				$("#pages8-title").html("");					
			});
			
			if(self.versionSwitch==true){
				if($("input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}		
				
				var data = self.searchData;
				if(self.isAll == 0){//-----如果是当前页	
					var data = "";																						
					$("input[name='order']:checkbox").each(function(){
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");
						}
					});
					data = data.substring(0,data.length-1);
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){//-----如果是当前页	
					var data = "";	
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);
				}
			}
			
			var preDeliveryIndex = layer.open({
				type: 1,
				title: '预约电子面单',
				skin: 'layui-layer-rim', 
				area: ['700px', '500px'],
				shade: 0.3,
				content: $("#edit-pages8"),
				cancel: function (index, layero) {
				}
			});	
			$("#progress-delivery").css("display","block");
			var time = new Date().getTime();
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=preExpressGet",
				type: 'post',
				data: {data: data, isAll: self.isAll,time: time, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},	
				dataType: 'json',
				success: function (data) {
					if(data.code == "error"){
						self.preDeliveryMsg = data.error_msg;
					}else if(data.code == "ok"){
						layer.close(preDeliveryIndex);
						layer.msg('获取成功',{
							icon: 1,
							time: 2000
						});
						
						searchALLNow(self,'page');
						$("input[name='order']").iCheck('uncheck');
						$(".inputTe").css("color","white");
						self.isAll = 0;
						self.nowPage = false;
						self.allPage = false;	
						
					}
				}
			})
			
			var Interval = setInterval(function(){
				$.ajax({
					url: "/index.php?m=system&c=delivery&a=getExpressPer",
					type: 'post',
					data: {time: time},
					dataType: 'json',
					success: function (data) {
						if(data){
							layui.use('element', function(){
								var element = layui.element();
								element.init();			//进度条
								element.progress('delivery', data.per + '%');
								$("#pages8-title").html(data.msg);					
							});
								
							if(data.code == "end"){
								clearInterval(Interval);
							}
						}else{
							clearInterval(Interval);
						}
					},error: function(){
						clearInterval(Interval);
					}
				});
			},1000);
		},
		//================预发货结束=============
		//作废开始
		orderCancel:function(type){
			var self = this;
			if(self.versionSwitch==true){
				if(type == "page"){
					if($("#bottomDiv input[name='order']").filter(':checked').length == 0){
						layer.msg('请选择至少一条数据',{
							icon: 0,
							time: 2000
						});
						return false;
					}		
				}
			}else{
				if(type == "page"){
					var selectRows = grid1.getSelecteds();
					if(selectRows.length == 0){
						layer.msg('请选择至少一条数据',{
							icon: 0,
							time: 2000
						});
						return false;
					}
				}
			}
			$("#cancelMsg").val("");
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
		},			
		
		saveOrderCancel:function(type){
			var self = this;
			self.defaultMsg = [];
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
			
			if(self.versionSwitch==true){
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
			}else{
				var selectRows = grid1.getSelecteds();
				if(self.isAll == 0){//-----如果是当前页	
					data = "";	
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}																	
					data = data.substring(0,data.length-1);									
				}
			}
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=setCancelTid",
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
						
						self.defaultMsg = data.errorMsg;
						
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
			self.isAll = nowIsAll;
		},
		//===============================================================================作废结束======================================================================================================

		//================================================================================打面单弹窗=====================================================================================================
		faceAlone:function(type){
			var self = this;
			self.defaultMsg = [];
			var data = "";
			var nowIsAll = self.isAll;
			if(self.versionSwitch==true){
				if(type == "page"){
					if($("#bottomDiv input[name='order']").filter(':checked').length == 0){	
						layer.msg('请选择至少一条数据',{
							icon: 0,
							time: 2000
						});
						return false;
					}
					if(self.isAll == 0){														
						$("#bottomDiv input[name='order']:checkbox").each(function(){						
							if(true == $(this).is(':checked')){									
								data += ($(this).val()+",");									
							}																					
						});
						data = data.substring(0,data.length-1);									
					}else if(self.isAll != 0){
						data = self.searchData;
					}
					//self.sysPlan = "";
				}else if(type == "send"){
					if($("#bottomDiv input[name='order']").filter(':checked').length == 0){	
						layer.msg('请选择至少一条数据',{
							icon: 0,
							time: 2000
						});
						return false;
					}
					if(self.isAll == 0){														
						$("#bottomDiv input[name='order']:checkbox").each(function(){						
							if(true == $(this).is(':checked')){									
								data += ($(this).val()+",");									
							}																					
						});
						data = data.substring(0,data.length-1);									
					}else if(self.isAll != 0){
						data = self.searchData;
					}
					self.sysPlan = "send";
				}else{
					data = type;
					self.isAll = 0;
				}
			}else{
				if(type == "page"){
					var selectRows = grid1.getSelecteds();
					if(selectRows.length == 0){
						layer.msg('请选择至少一条数据',{
							icon: 0,
							time: 2000
						});
						return false;
					}
					if(self.isAll == 0){	
						for(var i = 0; i < selectRows.length; i++){
							data += selectRows[i]['new_tid'] + ",";
						}
						data = data.substring(0,data.length-1);									
					}else if(self.isAll != 0){
						data = self.searchData;
					}
				}else{
					data = type;
					self.isAll = 0;
				}
			}
			
			if(self.isAll != 0 && (data.orderStatus == 'WAIT_ASSIGN' || data.orderStatus == 'UNLOCK')){
				layer.msg('选择全部页打面单无法使用查询条件[订单状态-待发货][订单状态-待发货未锁定] ，请去掉此查询条件后再进行操作',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			//self.face = param;
			$("#layprint1").val(0);											
			$("#layprintTplBq1").val(0);
			//if(checkPrintFace == "T"){
				$.ajax({
					url: "/index.php?m=system&c=delivery&a=printFace",
					type: 'post',
					data: {data: data, isAll: self.isAll, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
					dataType: 'json',
					success: function (data) {
						if(data){
							self.expressSort = data;
							self.printTplDzmd = printTplDzmd;
							doGetPrinters(function(data){
								self.layprint =  data;
							});			
							$("#layprint1").val(0);
							//-----初始化选择框																										
							$("#layprintTplBq1").val(0);
							//-----初始化选择框
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
				if(self.sysPlan == "send"){//已发货页面不发货
					var layerTitle = "打面单";
				}else{
					var layerTitle = "打面单并发货";
				}
				$("#tr-facePop").hide();
				self.progress_print_now(0,"获取打印信息中……");
				layer.open({							
					type: 1,
					title: layerTitle,
					skin: 'layui-layer-rim', 
					area: ['1200px', '400px'], 
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
			//}
		},
		
		
		aloneFace:function(type){
			var self = this;
			self.defaultMsg = [];
			var data = "";
			var nowIsAll = self.isAll;
			if(self.versionSwitch==true){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){	
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){														
					$("#bottomDiv input[name='order']:checkbox").each(function(){						
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");									
						}																					
					});
					data = data.substring(0,data.length-1);									
				}else if(self.isAll != 0){
					data = self.searchData;
				}
				//self.sysPlan = "send";
				
			}else{
					data = type;
					self.isAll = 0;
			}
			
			if(self.isAll != 0 && (data.orderStatus == 'WAIT_ASSIGN' || data.orderStatus == 'UNLOCK')){
				layer.msg('选择全部页打面单无法使用查询条件[订单状态-待发货][订单状态-待发货未锁定] ，请去掉此查询条件后再进行操作',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			var tmp = '';
			//self.face = param;
			$("#layprint1").val(0);											
			//$("#layprintTplBq1").val(0);
			//if(checkPrintFace == "T"){
				$.ajax({
					url: "/index.php?m=system&c=delivery&a=printFace",
					type: 'post',
					data: {data: data, isAll: self.isAll, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
					dataType: 'json',
					success: function (data) {
						if(data){
							tmp = data;
							self.expressSort = data;
							self.printTplDzmd = printTplDzmd;
							doGetPrinters(function(data){
								self.layprint =  data;
							});			
							$("#layprint1").val(0);
							//-----初始化选择框																										
							//$("#layprintTplBq1").val(0);
							//-----初始化选择框
							self.layprintTplBq = printTplBq;	
							
							$(document).ready(function(){
								$('#prin input').iCheck({
									checkboxClass: 'icheckbox_minimal',
									radioClass: 'iradio_minimal',
									increaseArea: '20%'
								});
							});
							
							$.ajax({
								url: "/index.php?m=system&c=delivery&a=getWLMianDan",
								type: 'post',
								data: {data:tmp},
								dataType: 'json',							
								success: function (data) {
									for( var i=0; i<data.length; i++ ) {  
										if(data[i].printer != ""){
											
											$("#layprintBq" + i).val(data[i].printer);
											//$("#printer select").val(data[i].printer);
										}else{
											//$("#printer select").val(0);
											$("#layprintBq" + i).val(0);
											printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
										}
									}
								}																
							});
						}
					}												
				});
				var layerTitle = "打面单";
				$("#tr-aloneFace").hide();
				self.progress_print_now(0,"获取打印信息中……");
				layer.open({							
					type: 1,
					title: layerTitle,
					skin: 'layui-layer-rim', 
					area: ['1200px', '400px'], 
					shade: 0.3,		
					content: $("#aloneFace"),
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
			//}
		},
		//==============================================================================打面单弹窗结束===================================================================================================
		printWaybillMake:function(){
			var self = this;
			self.waybillMakeMsg = [];
			layer.open({
				type: 1,
				title: '面单补打',
				skin: 'layui-layer-rim', 
				area: ['800px', '600px'], 
				shade: 0.3,
				content: $("#waybillMakeWindow")
			});	
		},
		printDSOSMake:function(){
			var self = this;
			
			self.dsosMakeMsg = [];
			layer.open({
				type: 1,																																											
				title: '发货清单补打',
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['800px', '600px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#dsosMakeWindow")
			});	
		},
		saveSearchPlan:function(){
			var self = this;
			
			layer.prompt({
				formType: 0,
				value: '',
				title: '请输入查询方案名称',
			}, 
			function(value, index, elem){
				
				
				$.ajax({																																									
					url: "/index.php?m=system&c=delivery&a=saveSearchPlan",																															
					type: 'post',																																								
					data: {planName: value, searchData: self.searchData},
					dataType: 'json',																																						
					success: function (data) {
						if(data.code == 'ok'){
							layer.msg('保存成功',{
								icon: 1,
								time: 2000
							});
							
							reloadSearchPlan();
						}else{
							layer.msg('保存失败',{
								icon: 0,
								time: 2000
							});
						}
					}
				})
				
				layer.close(index);
			});
		},
		printSearch:function(){
			var self = this;
			
			var printdateBegin = $("#printdateBegin").val();																																							
			var printdateEnd = $("#printdateEnd").val();	
	
			$.ajax({																																									
				url: "/index.php?m=system&c=delivery&a=waybill_make",																															
				type: 'post',																																								
				data: {printdateBegin: printdateBegin, printdateEnd: printdateEnd, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
				dataType: 'json',																																						
				success: function (data) {
					if(data){
						self.waybillMakeMsg = data.data;
					}
				}
			})
		},
		printDsosSearch:function(){
			var self = this;
			
			var printdateBegin = $("#printdsosdateBegin").val();																																							
			var printdateEnd = $("#printdsosdateEnd").val();	
	
			$.ajax({																																									
				url: "/index.php?m=system&c=delivery&a=dsos_make",																															
				type: 'post',																																								
				data: {printdateBegin: printdateBegin, printdateEnd: printdateEnd, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
				dataType: 'json',																																						
				success: function (data) {
					if(data){
						self.dsosMakeMsg = data.data;
					}
				}
			})
		},
		key_upMake:function(value,index){
			var self = this;
			var a = $(event.target);
			var e = event || window.event;
			var av = a.val();
			if((av * 1) > (value * 1)){
				layer.msg('输入数量不能大于订单数量',{
					icon: 0,
					time: 2000
				});
				a.val(value);
			}else if(a.val() == "0"){
				layer.msg('请输入正确的订单数量',{
					icon: 0,
					time: 2000
				});
				a.val(value);
			}else{
				self.waybillMakeMsg[index].print_num_end = a.val();
			}
		},
		key_upDsosMake:function(value,index){
			var self = this;
			var a = $(event.target);
			var e = event || window.event;
			var av = a.val();
			if((av * 1) > (value * 1)){
				layer.msg('输入数量不能大于订单数量',{
					icon: 0,
					time: 2000
				});
				a.val(value);
			}else if(a.val() == "0"){
				layer.msg('请输入正确的订单数量',{
					icon: 0,
					time: 2000
				});
				a.val(value);
			}else{
				self.dsosMakeMsg[index].print_num_end = a.val();
			}
		},
		makeWaybill:function(PRINT_BAT_NO){
			var self = this;
			
			var print_index_start = $("." + md5(PRINT_BAT_NO + "_STAR")).val();
			var print_index_end = $("." + md5(PRINT_BAT_NO + "_END")).val();
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=makeWaybill",
				type: 'post',
				data: {PRINT_BAT_NO: PRINT_BAT_NO, print_index_start: print_index_start, print_index_end: print_index_end, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
				dataType: 'json',	
				success: function (data) {
					if(data.code == "ok"){
						self.expressSort = data.expressSort;
						self.printTplDzmd = printTplDzmd;
						doGetPrinters(function(data){																																							
							self.layprint = data;																																								
						});																																														

						$("#layprintMake").val(0);											//-----初始化选择框																										
						$("#layprintTplBqMake").val(0);									//-----初始化选择框																										
						
						$.ajax({																																														
							url: "/index.php?m=system&c=delivery&a=getMianDan",																																		
							type: 'post',																																												
							data: {},																																													
							dataType: 'json',																																											
							success: function (data) {
								if(data.printer != ""){
									$("#printerMake select").val(data.printer);
								}else{
									$("#printerMake select").val(0);
									printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
								}
							}																																															
						});
						
						layer.open({																																											
							type: 1,																																											
							title: "补打面单",																																									
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['700px', '400px'], //宽高																																					
							shade: 0.3,		
							content: $("#facePopMake"),
							cancel: function(index, layero){
								
							}
						});
					}else{
						layer.msg('数据异常',{
							icon: 0,
							time: 2000
						});													
						return;
					}
				}												
			});
		},
		makeDsos:function(PRINT_BAT_NO){
			var self = this;
			
			var print_index_start = $("." + md5(PRINT_BAT_NO + "_DSOS_STAR")).val();
			var print_index_end = $("." + md5(PRINT_BAT_NO + "_DSOS_END")).val();
			
			doGetPrinters(function(data){
				self.layprint =  data;
			});
			$("#layprintDSOS").val(0);//-----初始化选择框
			$("#layprintTplDSOS").val(0);//-----初始化选择框
			self.layprintTplDSOS = printLodopTplList['DSOS'];
			layer.open({
				type: 1,
				title: '补打发货清单',
				skin: 'layui-layer-rim', //加上边框
				area: ['700px', '400px'], //宽高
				shade: 0.3,
				content: $("#table-printDSOSMake"),		
				btn: ['确定打印']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					if(self.isFirst == true){
						self.setyesorderDSOSMake(PRINT_BAT_NO,print_index_start,print_index_end);
						self.isFirst = false;
					}
					setTimeout(function(){
						self.isFirst = true;
					},200);
					layer.close(index);
				},
				cancel: function (index, layero) {},
				success:function(){
					$.ajax({
						url: "/index.php?m=system&c=delivery&a=getPrinterDSOS",
						type: 'post',
						data: {},
						dataType: 'json',
						success: function (data) {
							if(data['result'].printer != "" && data['DSOS'].id != ""){
								$("#layprintDSOS").val(data['result'].printer);
								$("#layprintTplDSOS").val(data['DSOS'].id);
							}else if(data['result'].printer != "" && data['DSOS'].id == ""){
								$("#layprintDSOS").val(data['result'].printer);
								$("#layprintTplDSOS").val(0);
								printerPrompt("未设置默认打印模板","发货清单设计","index.php?m=print&c=lodopDesign&a=index");
							}else if(data['result'].printer == "" && data['DSOS'].id != ""){
								$("#layprintDSOS").val(0);
								$("#layprintTplDSOS").val(data['DSOS'].id);
								printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
							}else{
								$("#layprintDSOS").val(0);
								$("#layprintTplDSOS").val(0);
								printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
							}
						}
					});
				}
			});	
		},

		//==============================================================================面单打印 预览 按钮===============================================================================================
		print_now:function(type,index,show,send,batch){
			var self = this;	
			self.defaultMsg = [];
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
			if(self.versionSwitch==true){
				if(self.isAll == 5)
				{
					data = self.split_print_tid;
					if(data == ''){
						layer.msg('没有可以打印的订单！',{
							icon: 2,
							time: 2000
						});
						return	
					}
				}
				else if(self.isAll == 0){																				
					$("input[name='order']:checkbox").each(function(){						
						if(true == $(this).is(':checked')){	
							data += ($(this).val()+",");
						}																				
					});	
					data = data.substring(0,data.length-1);								
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
			}else{
				if(self.isAll == 5)
				{
					data = self.split_print_tid;
					if(data == ''){
						layer.msg('没有可以打印的订单！',{
							icon: 2,
							time: 2000
						});
						return	
					}
				}
				else if(self.isAll == 0){
					var selectRows = grid1.getSelecteds();
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);															
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
			}
			
			if($("#printInput" + index).is(':checked')){
				isrepeat = "no";
			}else{
				isrepeat = "yes";
			}
			
			var btnObj = $(event.target);
			btnObj.prop("disabled",true);
			
			/*setTimeout(function(){
				a.prop("disabled",false);
			},1000);*/
			
			if(self.sysPlan == "send"){//已发货页面只打面单不发货
				send = "F";
				self.do_print_now(data,type,isrepeat,show,'F',unprintTplBq,unprintname,batch,index,btnObj);//打印
				return false;
			}
			
			var preDeliveryIndex = layer.open({
				type: 1,
				title: '发货',
				skin: 'layui-layer-rim', 
				area: ['700px', '500px'],
				shade: 0.3,
				content: $("#edit-pages8"),
				cancel: function (index, layero) {
					
				}
			});
			$("#progress-delivery").css("display","block");
			var time = new Date().getTime();
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=preDelivery",
				type: 'post',
				data: {data: data, isAll: (self.isAll == 5 ? 0 : self.isAll), type:type, time: time, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},	
				dataType: 'json',
				success: function (return_data) {
					if(return_data.code == "error"){
						self.preDeliveryMsg = return_data.error_msg;
						btnObj.prop("disabled",false);
					}else if(return_data.code == "ok"){
						layer.close(preDeliveryIndex);
						layer.msg('发货成功5',{
							icon: 1,
							time: 2000
						});
					}
					
					if(return_data.countSuccess > 0){
						$.ajax({
							url: "/index.php?m=system&c=delivery&a=checkPrintFaceNew",
							type: 'post',
							data: {type:type, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
							dataType: 'json',
							success: function (return_data) {
								if(return_data.code == "error"){
									btnObj.prop("disabled",false);
									self.defaultMsg = return_data.msgList;
									
									layer.open({
										type: 1,
										title: '失败详情',
										skin: 'layui-layer-rim', 
										area: ['800px', '400px'], 
										shade: 0.3,
										content: return_data.msg
									});	
								}else{
									self.do_print_now(data,type,isrepeat,show,send,unprintTplBq,unprintname,batch,index,btnObj);//打印		
								}
							}
						});	
					}
				}
			})
			
			var Interval = setInterval(function(){
				$.ajax({
					url: "/index.php?m=system&c=delivery&a=getDeliveryPer",
					type: 'post',
					data: {time: time},
					dataType: 'json',
					success: function (data) {
						if(data){
							layui.use('element', function(){
								var element = layui.element();
								element.init();			//进度条
								element.progress('delivery', data.per + '%');
								$("#pages8-title").html(data.msg);					
							});
								
							if(data.code == "end"){
								clearInterval(Interval);
							}
						}else{
							clearInterval(Interval);
						}
					},error: function(){
						clearInterval(Interval);
					}
				});
			},1000);
		},
		
		print_face:function(type,index,show,send,batch){
			var self = this;	
			self.defaultMsg = [];
			var data = "";
			var isrepeat = "";
			if($("#layprintBq" + index).val() != 0){
				var unprintname = $("#layprintBq" + index).val();
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
			if(self.versionSwitch==true){
				if(self.isAll == 5)
				{
					data = self.split_print_tid;
					if(data == ''){
						layer.msg('没有可以打印的订单！',{
							icon: 2,
							time: 2000
						});
						return	
					}
				}
				else if(self.isAll == 0){																				
					$("input[name='order']:checkbox").each(function(){						
						if(true == $(this).is(':checked')){	
							data += ($(this).val()+",");
						}																				
					});	
					data = data.substring(0,data.length-1);								
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
			}else{
				if(self.isAll == 5)
				{
					data = self.split_print_tid;
					if(data == ''){
						layer.msg('没有可以打印的订单！',{
							icon: 2,
							time: 2000
						});
						return	
					}
				}
				else if(self.isAll == 0){
					var selectRows = grid1.getSelecteds();
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);															
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
			}
			
			if($("#printinput" + index).is(':checked')){
				isrepeat = "no";
			}else{
				isrepeat = "yes";
			}
			
			var btnObj = $(event.target);
			btnObj.prop("disabled",true);
			
			var attribute = "1";

			send = "F";
			self.do_print_now(data,type,isrepeat,show,'F',unprintTplBq,unprintname,batch,index,btnObj,attribute);//打印
			return false;
		},
		do_print_now:function(data,type,isrepeat,show,send,unprintTplBq,unprintname,batch,index,btnObj,attribute){
			var self = this;
			var printSoft = $('#printSoft').val();
			if(show != "show")
			{
				$("#tr-facePop").show();
			}
			self.progress_print_now(0,"获取打印信息中……");
			$.ajax({																																									
				url: "/index.php?m=system&c=delivery&a=printNow",																															
				type: 'post',																																								
				data: {data:data,isAll:(self.isAll == 5 ? 0 : self.isAll),type:type,isrepeat:isrepeat,show:show,send:send,exception:self.exception, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId, printTpl: unprintTplBq, printSoft: printSoft,attribute:attribute},																																									
				dataType: 'json',																																						
				success: function (data) {
					btnObj.prop("disabled",false);
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
									if(send == "T"){
										printTpl[unprintTplBq](unprintname,newData,false,true,self.progress_print_now);//第四个参数暂时没有用
										
										if(batch != 'batch'){
											var expressSort = self.expressSort;
											expressSort.splice(index,1);
											self.expressSort = expressSort;
										}										
									}else{
										printTpl[unprintTplBq](unprintname,newData,false,true,self.progress_print_now);
									}
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
				},
				error: function (jqXHR, textStatus, errorThrown) {
					btnObj.prop("disabled",false);
				}
			});
		},
		progress_print_now:function(progress, title)
		{
			setTimeout(function(){
				layui.use('element', function(){
					var element = layui.element();
					element.init();			//进度条
					element.progress('facePop', progress+'%');
					$("#facePopStatus").html(title);					
				});
			},1)
		},
		//============================================================================面单打印 预览 按钮结束=============================================================================================
		print_now_free:function(free_order_id,show){
			var self = this;
			self.defaultMsg = [];
			
			if($("#layprintFree").val() != 0){
				var unprintname = $("#layprintFree").val();																																				
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}																																														
			if($("#layprintTplBqFree").val() != 0){																																						
				var unprintTplBq = $("#layprintTplBqFree").val();																																		
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}

			var a = $(event.target);
			a.prop("disabled",true);
			
			$.ajax({
				url: "/index.php?m=system&c=freePrinting&a=printNowFree",																															
				type: 'post',																																								
				data: {free_order_id: free_order_id, printTpl: unprintTplBq, show: show},																																									
				dataType: 'json',																																						
				success: function (data) {
					a.prop("disabled",false);
					
					if(data.dates && data.dates.length > 0){
						var newData = [];						
						var percent = 0;											
						var num = 0;
						if(show == "F"){
							doGetPrinters(function(){
								newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
								if(unprintname){
									printTpl[unprintTplBq](unprintname,newData);
									self.expressSort = [];
									
									setTimeout(function(){
										layer.closeAll();
									},1000)
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
				},
				error: function (jqXHR, textStatus, errorThrown) {
					a.prop("disabled",false);
				}
			});
		},
		print_now_make:function(PRINT_BAT_NO,print_index_start,print_index_end,show){
			var self = this;
			self.defaultMsg = [];
			
			if($("#layprintMake").val() != 0){
				var unprintname = $("#layprintMake").val();																																				
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}																																														
			if($("#layprintTplBqMake").val() != 0){																																						
				var unprintTplBq = $("#layprintTplBqMake").val();																																		
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}

			var a = $(event.target);
			a.prop("disabled",true);
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=printNowMake",																															
				type: 'post',																																								
				data: {PRINT_BAT_NO: PRINT_BAT_NO, print_index_start: print_index_start, print_index_end: print_index_end, show: show, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId, printTpl: unprintTplBq},
				dataType: 'json',																																						
				success: function (data) {
					setTimeout(function(){
						a.prop("disabled",false);
					},3000);
					
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
				},
				error: function (jqXHR, textStatus, errorThrown) {
					a.prop("disabled",false);
				}
			});
		},
		//=====================================================================面单打印所有=========================================================================================
		/*print_all:function(){
			var self = this;
			$("#print_all").prop("disabled",true);
			
			self.preDelivery('print_all');
		},
		doPrint_all:function(){
			var self = this;
			self.defaultMsg = [];
			var data = "";
			
			if(self.versionSwitch==true){
				if($("#bottomDiv input[name='order']").filter(':checked').length == 0){	
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){														
					$("#bottomDiv input[name='order']:checkbox").each(function(){						
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");									
						}
						//拼接当前页的货品唯一码																					
					});																		
					data = data.substring(0,data.length-1);									
				}else if(self.isAll != 0){
					data = self.searchData;
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){	
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);									
				}else if(self.isAll != 0){
					data = self.searchData;
				}
			}
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=checkPrintFace",
				type: 'post',
				data: {data: data, isAll: self.isAll, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
				dataType: 'json',			
				success: function (data) {
					if(data.code == "error"){
						self.defaultMsg = data.msgList;
						layer.open({
							type: 1,									
							title: '失败详情',
							skin: 'layui-layer-rim', 
							area: ['800px', '400px'], 
							shade: 0.3,
							content: $("#default")
						});	
						$("#print_all").prop("disabled",false);
					}else{
						for(var i = 0; i < self.expressSort.length; i++){
							self.print_now(self.expressSort[i].type,i,'F','T','batch');
						}
						self.expressSort = [];
						setTimeout(function(){
							layer.closeAll();
							$("#print_all").prop("disabled",false);
						},1000);
					}
				}
			})
		},*/
		//===================================================================面单打印所有结束=======================================================================================
		
		//=========================================================================日志弹窗=========================================================================================
		log:function(tid){
			var self = this;
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=getLog",																																		
				type: 'post',																																												
				data: {tid: tid, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},																																													
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
			if(type == "faild"){
				if(self.send_error = "no"){
					$("#searchArr").append("<span class='add sendError rem'>发货失败<i class='dele' id='sendError' onclick='closeNow(\"sendError\")'></i></span>");
					self.send_error = "have";
				}
				
			}else if(type == "exception"){
				if(self.exception = "no"){
					$("#searchArr").append("<span class='add exce rem'>线上订单状态异常<i class='dele' id='exce' onclick='closeNow(\"exception\")'></i></span>");
					self.exception = "have";
				}
				
			}
			
			searchALLNow(self,"page");
		},
		
		//=======================================================================查看详情按钮结束=======================================================================================
        //手工订单
		addOrdersJudge:function(new_tid){
			var self = this;
			$.ajax({														
				url: "/index.php?m=system&c=delivery&a=addOrdersJudge",			
				type: 'post',															
				data: {},
				dataType: 'json',
				success: function (data) {
					if(data['code'] == "ok"){
						self.addOrders(new_tid);
					}else{
						layer.msg("您暂没有此功能权限！！",{
							icon: 2,
							time: 2000
						});
					}
				}																
			});
		},
        addOrders:function(new_tid){
            layer.open({
                title :'新增手工订单',
                type: 2,
                shade: 0.3,
                area: ['100%', '100%'],
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
				url: "/index.php?m=system&c=delivery&a=splitCheck",																																		
				type: 'post',																																												
				data: {tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == 'ok'){
						self.splitItemArr = data.dataItem;
						orderSplitWindow(tid,self);
					}else if(data.code == 'warning'){
						layer.confirm(data.msg, {
							btn: ['确认','取消'] //按钮
						}, function(index){
							self.splitItemArr = data.dataItem;
							orderSplitWindow(tid,self);
							layer.close(index);
						});
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
		orderSplitSingle:function(){
			var self = this;
			if(self.versionSwitch==true){
				if($("input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}		
				var data = self.searchData;
				if(self.isAll == 0){//-----如果是当前页	
					var data = "";																						
					$("input[name='order']:checkbox").each(function(){
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");
						}
						//拼接当前页的货品唯一码
					});
					data = data.substring(0,data.length-1);
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){//-----如果是当前页	
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);
				}
			}
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=orderSplitFast",
				type: 'post',
				data: {data: data, isAll: self.isAll, splitPlan: 'single'},	
				dataType: 'json',
				success: function (data) {
					if(data.code == 'ok'){
						layer.msg("拆分成功",{
							icon: 1,
							time: 2000
						});
						searchALLNow(self,'page');
					}else{
						layer.msg(data.msg,{
							icon: 0,
							time: 2000
						});
					}
				}
			});
		},
		itemSplitPrintSend:function()
		{
			var self = this;
			if(self.versionSwitch==true){
				if($("input[name='item_unique_code']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}		
				var data = "";																						
				$("input[name='item_unique_code']:checkbox").each(function(){
					if(true == $(this).is(':checked')){									
						data += ($(this).val()+",");
					}
					//拼接当前页的货品唯一码
				});
				data = data.substring(0,data.length-1);
			}
			layer.confirm('确定要拆分订单并打单发货吗？', {
				btn: ['确认','取消'] //按钮
			}, function(index){
				
				$.ajax({
					url: "/index.php?m=system&c=delivery&a=itemSplitPrintSend",
					type: 'post',
					data: {data: data},	
					dataType: 'json',
					success: function (data) {
						if(data.code == 'ok'){
							layer.msg("拆分成功",{
								icon: 1,
								time: 2000
							});
							$("#layprint1").val(0);											
							$("#layprintTplBq1").val(0);
							self.split_print_tid = data['tid'];
							$.ajax({
								url: "/index.php?m=system&c=delivery&a=printFace",
								type: 'post',
								data: {data: data['tid'], isAll: '0', DROP_SHIPPING: 'F', shippingId: ''},
								dataType: 'json',
								success: function (data) {
									if(data){
										self.expressSort = data;
										self.printTplDzmd = printTplDzmd;
										doGetPrinters(function(data){
											self.layprint =  data;
										});			
										$("#layprint1").val(0);
										//-----初始化选择框																										
										$("#layprintTplBq1").val(0);
										//-----初始化选择框
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
							if(self.sysPlan == "send"){//已发货页面不发货
								var layerTitle = "打面单";
							}else{
								var layerTitle = "打面单并发货";
							}
							self.isAll = 5;
							layer.open({							
								type: 1,
								title: layerTitle,
								skin: 'layui-layer-rim', 
								area: ['1200px', '400px'], 
								shade: 0.3,		
								content: $("#facePop"),
								cancel: function(index, layero){
									searchALLNow(self,'page');
									$("input[name='item_unique_code']").iCheck('uncheck');	
									$(".inputTe").css("color","white");
									$("input[name='order']").iCheck('uncheck');	
									$(".inputTe").css("color","white");
									self.isAll = 0;
									
									self.nowPage = false;
									self.allPage = false;
								}
							});
							
							
						}else{
							layer.msg(data.msg,{
								icon: 0,
								time: 2000
							});
						}
					}
				});
			})
		},
		orderSplitDaina:function(){
			var self = this;
			if(self.versionSwitch==true){
				if($("input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}		
				var data = self.searchData;
				if(self.isAll == 0){//-----如果是当前页	
					var data = "";																						
					$("input[name='order']:checkbox").each(function(){
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");
						}
						//拼接当前页的货品唯一码
					});
					data = data.substring(0,data.length-1);
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){//-----如果是当前页	
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);
				}
			}
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=orderSplitFast",
				type: 'post',
				data: {data: data, isAll: self.isAll, splitPlan: 'daina'},	
				dataType: 'json',
				success: function (data) {
					if(data.code == 'ok'){
						layer.msg("拆分成功",{
							icon: 1,
							time: 2000
						});
						searchALLNow(self,'page');
					}else{
						layer.msg(data.msg,{
							icon: 0,
							time: 2000
						});
					}
				}
			});
		},
		orderSplitFenxiao:function(){
			var self = this;
			if(self.versionSwitch==true){
				if($("input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}		
				var data = self.searchData;
				if(self.isAll == 0){//-----如果是当前页	
					var data = "";																						
					$("input[name='order']:checkbox").each(function(){
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");
						}
						//拼接当前页的货品唯一码
					});
					data = data.substring(0,data.length-1);
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){//-----如果是当前页	
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);
				}
			}
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=orderSplitFast",
				type: 'post',
				data: {data: data, isAll: self.isAll, splitPlan: 'fenxiao'},	
				dataType: 'json',
				success: function (data) {
					if(data.code == 'ok'){
						layer.msg("拆分成功",{
							icon: 1,
							time: 2000
						});
						searchALLNow(self,'page');
					}else{
						layer.msg(data.msg,{
							icon: 0,
							time: 2000
						});
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
			}
			var tid = "";																																		
			$("#bottomDiv input[name='order']:checkbox").each(function(){
				if(true == $(this).is(':checked')){
					tid += ($(this).val()+",");
				}
			});
			tid = tid.substring(0,tid.length-1);
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getOrdersSendStatus",
				type: 'post',
				data: {tid: tid},
				dataType: 'json',
				success: function (data) {
					if(data.send_status == 'WAIT_SENDED_ASSIGN'){
						layer.confirm('订单已预发货，确认要撤销合并？', {
							btn: ['确认','取消'] //按钮
						}, function(index){
							self.doOrderMergeSplit(self,tid);
							layer.close(index);
						});
					}else{
						self.doOrderMergeSplit(self,tid);
					}
				}
			});
		},
		doOrderMergeSplit:function(self,tid){
			layer.load();
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=orderMergeSplit",
				type: 'post',
				data: {tid: tid},						
				dataType: 'json',				
				success: function (data) {
					layer.closeAll();
					if(data.code == 'ok'){
						layer.msg("撤销合并成功",{
							icon: 1,
							time: 3000
						});
						searchALLNow(self,'page');
					}else if(data.code == 'error'){
						layer.msg(data.msg,{
							icon: 2,
							time: 3000
						});
						return false;
					}
				},
				error:function(){
					layer.closeAll();	
				}																																														
			});
		},
		orderMerge:function(){
			var self = this;
			
			if($("#bottomDiv input[name='order']").filter(':checked').length < 2){	
				layer.msg('请选择至少2个订单',{
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
				url: "/index.php?m=system&c=delivery&a=orderMerge",				
				type: 'post',
				data: {tid: tid},
				dataType: 'json',
				success: function (data) {
					if(data.code == 'ok'){
						layer.msg("合并成功",{
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
		orderApproval:function(){
			var self = this;
			if(self.versionSwitch==true){
				if($("input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				
				var data = self.searchData;
				if(self.isAll == 0){
					var data = "";																						
					$("input[name='order']:checkbox").each(function(){						
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");									
						}
						//拼接当前页的货品唯一码
					});																		
					data = data.substring(0,data.length-1);		
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){
					var data = "";			
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);
				}
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
							skin: 'layui-layer-rim', 
							area: ['800px', '400px'], 
							shade: 0.3,
							content: $("#default")
						});
					}
					searchALLNow(self,'F');
				}
			});
		},
		orderReApproval:function(){
			var self = this;
			if(self.versionSwitch==true){
				if($("input[name='order']").filter(':checked').length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				
				var data = self.searchData;
				if(self.isAll == 0){//-----如果是当前页	
					var data = "";																						
					$("input[name='order']:checkbox").each(function(){						
						if(true == $(this).is(':checked')){									
							data += ($(this).val()+",");
						}//	拼接当前页的货品唯一码
					});																		
					data = data.substring(0,data.length-1);									
				}
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				var data = self.searchData;
				if(self.isAll == 0){//-----如果是当前页	
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);									
				}
			}
			$.ajax({
				url: "/index.php?m=system&c=waitSend&a=orderReApproval",
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
							skin: 'layui-layer-rim', 
							area: ['800px', '400px'], 
							shade: 0.3,
							content: $("#default")
						});
					}
					searchALLNow(self,'F');
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
			if(a.val() * 1 > value * 1){
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
		copyOrdersJudge:function(new_tid){
			var self = this;
			$.ajax({														
				url: "/index.php?m=system&c=delivery&a=copyOrdersJudge",			
				type: 'post',															
				data: {},
				dataType: 'json',
				success: function (data) {
					if(data['code'] == "ok"){
						self.copyOrders(new_tid);
					}else{
						layer.msg("您暂没有此功能权限！！",{
							icon: 2,
							time: 2000
						});
					}
				}																
			});
		},
        copyOrders:function(new_tid){
            layer.open({
                title :'复制订单',
                type: 2,
                shade: false,
                area: ['1000px', '600px'],
                maxmin: false,
                content: '?m=system&c=delivery&a=addOrders',
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
                    iframeWin.vueObj.loadOrders(new_tid,{action: 'copy'});
                }
            }); 
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
				url: "/index.php?m=system&c=delivery&a=orderSplitCancel",																																		
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
			if(self.versionSwitch==true){
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
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				var data = "";
				for(var i = 0; i < selectRows.length; i++){
					data += selectRows[i]['new_tid'] + ",";
				}
				data = data.substring(0,data.length-1);	
			}
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=submitDistribution",			
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
		expressCancel:function(){
			var self = this;
			if(self.versionSwitch==true){
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
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}else if(selectRows.length > 1){
					layer.msg('一次只能选择一个订单',{
						icon: 0,
						time: 2000
					});								
					return false;	
				}
				var tid = "";	
				for(var i = 0; i < selectRows.length; i++){
					tid += selectRows[i]['new_tid'] + ",";
				}
				tid = tid.substring(0,tid.length-1);
			}
			layer.confirm('确认回收快递单号？', {
				btn: ['确认','取消'] //按钮
			}, function(index){
				layer.close(index);
				$.ajax({
					url: "/index.php?m=system&c=delivery&a=expressCancel",
					type: 'post',
					data: {tid: tid},
					dataType: 'json',
					success: function (data) {
						if(data.code == "ok"){
							layer.msg("回收成功",{
								icon: 1,
								time: 2000
							});
							searchALLNow(self,'page');
						}else if(data.code == "error"){
							layer.msg(data.msg,{
								icon: 2,
								time: 3000
							});
						}
					}
				});
			});
		},
		reOrderThink:function(){
			var self = this;
			
			if($("#bottomDiv input[name='order']").filter(':checked').length == 0){	
				layer.msg('请选择一个订单',{
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
				url: "/index.php?m=system&c=delivery&a=reOrderThink",																																		
				type: 'post',																																												
				data: {tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == 'ok'){
						layer.msg("重解析成功",{
							icon: 1,
							time: 2000
						});
						searchALLNow(self,'page');
					}else if(data.code == 'error'){
						self.defaultMsg = data.msgList;
						
						layer.open({
							type: 1,																																											
							title: '失败详情',																																								
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['800px', '400px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#default")																																													
						});						
						return false;
					}
				}																																															
			});
		},
		directOrderPreSend:function(){
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
				url: "/index.php?m=system&c=delivery&a=directOrderPreSend",																																		
				type: 'post',																																												
				data: {tid: tid},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == 'ok'){
						layer.msg("操作成功",{
							icon: 1,
							time: 2000
						});
						searchALLNow(self,'page');
					}else if(data.code == 'error'){
						layer.msg("操作失败！"+data.msg,{
							icon: 2,
							time: 2000
						});				
						return false;
					}
				}																																															
			});
		},
		manualOrderdel:function(){//删除手工订单
			var self = this;
			
			if($("#bottomDiv input[name='order']").filter(':checked').length == 0){	
				layer.msg('请选择一个订单',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			if(self.isAll == 0){
				var confirmText = '确认删除手工订单？';
			}else{
				var confirmText = '确认删除<span style="color:red;font-weight:bold;">[全部页]</span>手工订单？';
			}
			layer.confirm(confirmText, {
				btn: ['确认','取消'] //按钮
			}, function(index){
				self.doManualOrderdel();
				layer.close(index);
			});
		},
		doManualOrderdel:function(){
			var self = this;
			
			if(self.versionSwitch == true){
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
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if(self.isAll == 0){//-----如果是当前页	
					for(var i = 0; i < selectRows.length; i++){
						data += selectRows[i]['new_tid'] + ",";
					}
					data = data.substring(0,data.length-1);	
				}
			}
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=manualOrderdel",
				type: 'post',
				data: {data: data, isAll: self.isAll},
				dataType: 'json',
				success: function (data) {
					if(data.code == "ok"){
						layer.msg("删除成功",{
							icon: 1,
							time: 2000
						});
						searchALLNow(self,'page');
					}else{
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
		},
		cancelSend:function(){
			var self = this;
			if(self.versionSwitch==true){
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
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}else if(selectRows.length > 1){
					layer.msg('一次只能选择一个订单',{
						icon: 0,
						time: 2000
					});								
					return false;	
				}
				var tid = "";	
				for(var i = 0; i < selectRows.length; i++){
					tid += selectRows[i]['new_tid'] + ",";
				}
				tid = tid.substring(0,tid.length-1);
			}
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=cancelSend",
				type: 'post',
				data: {tid: tid, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
				dataType: 'json',
				success: function (data) {
					if(data.code == "ok"){
						layer.msg("取消发货成功",{
							icon: 1,
							time: 2000
						});
						searchALLNow(self,'page');
					}else{
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});
					}
				}
			});
		},
		modifyWl:function(){
			var self = this;
			if(self.versionSwitch==true){
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
			}else{
				var selectRows = grid1.getSelecteds();
				if(selectRows.length == 0){
					layer.msg('请选择至少一条数据',{
						icon: 0,
						time: 2000
					});
					return false;
				}else if(selectRows.length > 1){
					layer.msg('一次只能选择一个订单',{
						icon: 0,
						time: 2000
					});								
					return false;	
				}
				var tid = "";	
				for(var i = 0; i < selectRows.length; i++){
					tid += selectRows[i]['new_tid'] + ",";
				}
				tid = tid.substring(0,tid.length-1);
			}
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getOrderInfo",
				type: 'post',
				data: {tid: tid, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
				dataType: 'json',
				success: function (data) {
					
					$("#pages12-tid").val(tid);
					$("#pages12-express").val(data.express_type);
					$("#pages12-receiver_state").val(data.receiver_state);
					$("#pages12-receiver_state").trigger("change");
					$("#pages12-receiver_city").val(data.receiver_city);
					$("#pages12-receiver_city").trigger("change");
					$("#pages12-receiver_district").val(data.receiver_district);
					if($("#pages12-receiver_district").val() == null){
						$("#pages12-receiver_district").append('<option value="' + data.receiver_district + '" name="' + data.receiver_district + '" data-code="999999">' + data.receiver_district + '</option>');
						$("#pages12-receiver_district").val(data.receiver_district);
					}
					$("#pages12-receiver_address").val(data.receiver_address);
					$("#pages12-receiver_name").val(data.receiver_name);
					$("#pages12-mobile").val(data.receiver_mobile);
					$("#pages12-telephone").val(data.receiver_telephone);
					$("#pages12-express_no").val("");
					if(data.token_jd)
					{
						$.ajax({
							url: "http://116.196.114.192/hufu/getSensitiveData.php",
							type: 'get',				
							dataType: 'json',
							async:false,
							data:{token_tid: data.token_tid, token_jd: data.token_jd},
							success: function (data) {
								if(data.code == '0000'){
									var receiver_address = data.result.list[0].receiver_address;
									var receiver_mobile = data.result.list[0].receiver_mobile;
									var receiver_name = data.result.list[0].receiver_name;
									
									$("#pages12-receiver_name").val(receiver_name);
									$("#pages12-mobile").val(receiver_mobile);
									$("#pages12-receiver_address").val(receiver_address);
								}else{
									/*layer.msg(data.message,{
										icon: 2,
										time: 2000
									});	*/
								}
							},
							error: function(){
								layer.msg('接口异常，请稍后再试',{
									icon: 2,
									time: 2000
								});	
							}
						});
					}
					if(self.DROP_SHIPPING != 'T' && data.isDF == 'T'){
						layer.msg('代发快递不允许修改快递',{
							icon: 2,
							time: 2000
						});
						return false;
					}else{
						layer.open({
							type: 1,
							title: '修改物流信息',
							skin: 'layui-layer-rim', //加上边框
							area: ['800px', '620px'], //宽高
							shade: 0.3,				
							content: $("#edit-pages12"),
							cancel: function (index, layero) {}
						});
					}
					
				}
			});
		},
		reloadWaybill:function(){
			var self = this;	
			var tid = $("#pages12-tid").val();
			if(tid != ""){
				var express_type = $("#pages12-express").val();
				var receiver_state = $("#pages12-receiver_state").val();
				var receiver_city = $("#pages12-receiver_city").val();
				var receiver_district = $("#pages12-receiver_district").val();
				var receiver_address = $("#pages12-receiver_address").val();
				var receiver_name = $("#pages12-receiver_name").val();
				var receiver_mobile =  $("#pages12-mobile").val();
				var receiver_telephone =  $("#pages12-telephone").val();
				
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
					express_type: express_type,
					receiver_state: receiver_state,
					receiver_city: receiver_city,
					receiver_district: receiver_district,
					receiver_address: receiver_address,
					receiver_name: receiver_name,
					receiver_mobile: receiver_mobile,
					receiver_telephone: receiver_telephone
				};
				
				$.ajax({
					url: "/index.php?m=system&c=delivery&a=reloadWaybill",																																		
					type: 'post',																																												
					data: {data: data, tid: tid, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},																																													
					dataType: 'json',																																											
					success: function (data) {
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							
							$("#pages12-express_no").val(data.express_no);
						}else if(data.code == "error"){
							layer.msg(data.msg,{
								icon: 2,
								time: 3000
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
		updateLogistics:function(){
			var self = this;	
			var tid = $("#pages12-tid").val();
			if(tid != ""){
				var express_type = $("#pages12-express").val();
				var receiver_state = $("#pages12-receiver_state").val();
				var receiver_city = $("#pages12-receiver_city").val();
				var receiver_district = $("#pages12-receiver_district").val();
				var receiver_address = $("#pages12-receiver_address").val();
				var receiver_name = $("#pages12-receiver_name").val();
				var receiver_mobile =  $("#pages12-mobile").val();
				var receiver_telephone =  $("#pages12-telephone").val();
				var express_no =  $("#pages12-express_no").val();
				
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
				
				if(express_no == ""){
					layer.msg('请先预约物流单号',{
						icon: 0,
						time: 2000
					});
					return false;
				}

				$.ajax({
					url: "/index.php?m=system&c=delivery&a=updateLogistics",																																		
					type: 'post',																																												
					data: {tid: tid, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
					dataType: 'json',																																											
					success: function (data) {
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							
							layer.closeAll();
							searchALLNow(self,'page');
						}else if(data.code == "error"){
							layer.msg(data.msg,{
								icon: 2,
								time: 3000
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
		detailsTids:function(new_tid,order_index){
			var self = this;
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=deliDetailsedData",																				
				type: 'post',
				data: {new_tid: new_tid, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
				dataType: 'json',
				success: function (data) {
					if(data){
						self.deliDetailsed = data;
					}else{
						self.deliDetailsed = "";
					}
				}						
			});	
			
			layer.open({
				type: 1,
				title: '订单详情',
				skin: 'layui-layer-rim', //加上边框
				area: ['1000px', '600px'], //宽高
				shade: 0.3,	
				btn: ['关闭'],
				content: $("#delivered-details")
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

//选中改变颜色-
$(document).ready(function(){
	$('.changeColor').on('ifChecked ifUnchecked', function(event){																																			
																																										
		if (event.type == 'ifChecked') {
			$(event.target).parent().parent().parent().css("backgroundColor","#f8f8c7");
			
			if(self.isAll == 0){
				$('#selectOrderNum').html($("input[name='order']").filter(':checked').length);
			}else{
				$('#selectOrderNum').html(self.result_total);
			}
		} else {																																														
			$(event.target).parent().parent().parent().css("backgroundColor","rgb(249, 249, 249)");
			self.isAll = 0;
			self.allPage = false;
			$(".inputTe").css("color","white");
			
			if(self.isAll == 0){
				$('#selectOrderNum').html($("input[name='order']").filter(':checked').length);
			}else{
				$('#selectOrderNum').html(self.result_total);
			}
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

$('#pages18-seller_type_1').on('ifChecked', function(event){
	flow.sellerType = "1";
});

$('#pages18-seller_type_2').on('ifChecked', function(event){
	flow.sellerType = "2";
});

$('#pages18-seller_type_3').on('ifChecked', function(event){
	flow.sellerType = "3";
});

$('#pages20-seller_type_1').on('ifChecked', function(event){
	flow.sellerType = "1";
});

$('#pages20-seller_type_2').on('ifChecked', function(event){
	flow.sellerType = "2";
});

$('#pages20-seller_type_3').on('ifChecked', function(event){
	flow.sellerType = "3";
});


function keyDownSearch(){
	if(event.keyCode==13){
		searchALLNow(flow,'F');
	}
}



//========================================================================================================选择店铺===============================================================================================
/*function shopChange(a){																																												//===========
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
}*/																																																	//===========
//======================================================================================================选择店铺结束=============================================================================================

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
	

	searchALLNow(flow,'page');	
	flow.refreshTotal();
	
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
	
	$.ajax({																																													//===========
		url: "/index.php?m=system&c=delivery&a=getExpress",																																		//===========
		type: 'post',																																											//===========
		data: {DROP_SHIPPING: flow.DROP_SHIPPING, shippingId: flow.shippingId},																																												//===========
		dataType: 'json',																																										//===========
		success: function (data) {																																								//===========
			flow.expressArr = data;																																								//===========
		}																																														//===========
	});	

	$.ajax({																																													//===========
		url: "/index.php?m=system&c=delivery&a=getStorage",																																		//===========
		type: 'post',																																											//===========
		data: {DROP_SHIPPING: flow.DROP_SHIPPING, shippingId: flow.shippingId},																																												//===========
		dataType: 'json',																																										//===========
		success: function (data) {																																								//===========
			flow.storageArr = data;																																								//===========
		}																																														//===========
	});
	
	var orderSelect = $("#separator1").val();
	if(orderSelect == 'print_dsos_bat_no'){
		$.ajax({
			url: "/index.php?m=system&c=delivery&a=getPrintDsosBatNo",
			type: 'post',
			data: {DROP_SHIPPING: flow.DROP_SHIPPING, shippingId: flow.shippingId},
			dataType: 'json',
			success: function (data) {
				var dsosHtml = '<select class="print_dsos_bat_no form-control separator" style="background: url(\'images/down.png\') no-repeat scroll 90% center transparent;background-size:17px 15px;border:solid 1px #ccc;">';
				dsosHtml += '<option value=""></option>';
				if(data){
					for(var i = 0; i < data.length; i++){
						dsosHtml += '<option value="' + data[i]['print_dsos_bat_no'] + '">' + data[i]['print_dsos_bat_no'] + '</option>';
					}
					dsosHtml += '</select>';
				}
				dsosHtml += '</select>';
				$(".changeDiv").html(dsosHtml);
			}
		});
	}else if(orderSelect == 'print_waybill_bat_no'){
		$.ajax({
			url: "/index.php?m=system&c=delivery&a=getPrintWayBillBatNo",
			type: 'post',
			data: {DROP_SHIPPING: flow.DROP_SHIPPING, shippingId: flow.shippingId},
			dataType: 'json',
			success: function (data) {
				var dsosHtml = '<select class="print_waybill_bat_no form-control separator" style="background: url(\'images/down.png\') no-repeat scroll 90% center transparent;background-size:17px 15px;border:solid 1px #ccc;">';
				dsosHtml += '<option value=""></option>';
				if(data){
					for(var i = 0; i < data.length; i++){
						dsosHtml += '<option value="' + data[i]['bat_no'] + '">' + data[i]['print_time'] + '</option>';
					}
					dsosHtml += '</select>';
				}
				dsosHtml += '</select>';
				$(".changeDiv").html(dsosHtml);
			}
		});
	}
	
	
	var orderSelect2 = $("#separator").val();
	if(orderSelect2 == "sign_status"){
		$.ajax({
			url: "/index.php?m=system&c=delivery&a=getSignStatus",
			type: 'post',
			data: {DROP_SHIPPING: flow.DROP_SHIPPING, shippingId: flow.shippingId},
			dataType: 'json',
			success: function (data) {
				flow.signStatusArr = data;
				
				var dsosHtml = '<div style="float:left;"><select class="' + a + ' form-control separator" style="background: url(\'images/down.png\') no-repeat scroll 90% center transparent;background-size:17px 15px;border:solid 1px #ccc;width:204px;">';
				dsosHtml += '<option value=""></option><option value="0">无标记状态</option>';
				if(data){
					for(var i = 0; i < data.length; i++){
						dsosHtml += '<option value="' + data[i]['id'] + '">' + data[i]['statusName'] + '</option>';
					}
					dsosHtml += '</select>';
				}
				dsosHtml += '</select></div><div style="margin-left:10px;float:left;"><button id="signStatusManage" class="btn" style="width:120px;" onclick="signStatusManage()">添加标记状态</button></div>';
				$(".changeDiv1").html(dsosHtml);
			}
		});
	}/*else if(orderSelect2 == "fetch_detail"){
		$.ajax({
			url: "/index.php?m=system&c=delivery&a=getfetchDetail",
			type: 'post',
			data: {DROP_SHIPPING: flow.DROP_SHIPPING, shippingId: flow.shippingId},
			dataType: 'json',
			success: function (data) {
				flow.fetchDetailArr = data;
				
				var dsosHtml = '<div style="float:left;"><select class="' + a + ' form-control separator" style="background: url(\'images/down.png\') no-repeat scroll 90% center transparent;background-size:17px 15px;border:solid 1px #ccc;width:204px;">';
				dsosHtml += '<option value=""></option><option value="0">无自提点</option>';
				if(data){
					for(var i = 0; i < data.length; i++){
						dsosHtml += '<option value="' + data[i]['configKey'] + '">' + data[i]['configKey'] + '</option>';
					}
					dsosHtml += '</select>';
				}
				$(".changeDiv1").html(dsosHtml);
			}
		});
	}*/
}

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
function distributionChange(a){	
	searchALLNow(flow,'page');	
}

function focu(a){
	$("." + a).css("height","100px");
	$("." + a).prop("placeholder","");
}

function blu(a){
	$("." + a).css("height","26px");
	$("." + a).prop("placeholder","多个逗号隔开");
}

function reloadSearchPlan(){
	$('#searchPlan .add').remove();
	
	$.ajax({
		url: "/index.php?m=system&c=delivery&a=reloadSearchPlan",																																		
		type: 'post',																																												
		data: {},
		dataType: 'json',																																											
		success: function (data) {
			if(data.code == "ok"){
				$('#searchPlan .add').remove();
				for(var i = 0; i < data.list.length; i++){
					$("#searchPlan").append("<span class='add searchAdd' onclick='searchAllPlan(\""+ data.list[i]['id'] +"\")' >" + data.list[i]['planName'] + "<i class='dele' id='specialGroup' onclick='closeSearchPlan(\""+ data.list[i]['id'] +"\")'></i></span>");
				}
			}
		}																																															
	});	
}

function closeSearchPlan(id){
	$.ajax({																																									
		url: "/index.php?m=system&c=delivery&a=closeSearchPlan",																															
		type: 'post',																																								
		data: {id: id},
		dataType: 'json',																																						
		success: function (data) {
			reloadSearchPlan();
		}
	})
}

function searchAllPlan(id){
	//alert(flow.pageSize)
	$.ajax({																																									
		url: "/index.php?m=system&c=delivery&a=getSearchPlan",																															
		type: 'post',																																								
		data: {id: id},
		dataType: 'json',																																						
		success: function (data) {
			if(data.code == 'ok'){
				var searchJson = data.searchJson;
				
				var searchData = {
					"pageSize":flow.pageSize,
					"pageNo":1,
					"print":searchJson.print,																																											
					"facePrint":searchJson.facePrint,																																									
					"special":searchJson.special,																																										
					"shopId":searchJson.shopId,																																										
					"remark":searchJson.remark,																																										
					"delivery":searchJson.delivery,
					"stock_order":searchJson.stock_order,
					"babyNum":searchJson.babyNum,						
					"express":searchJson.express,																																										
					"banner":searchJson.banner,																																										
					"singleStatus":searchJson.singleStatus,																																							
					"province":searchJson.province,																																									
					"provinceStatus":searchJson.provinceStatus,																																						
					"orderStatus":searchJson.orderStatus,	
					"dateSelect": searchJson.dateSelect,
					"dateBegin":searchJson.dateBegin,																																										
					"dateEnd":searchJson.dateEnd,																																											
					"order":searchJson.order,
					"orderSelect": searchJson.orderSelect,
					"show_tid":searchJson.show_tid,
					"buyer_nick":searchJson.buyer_nick,
					"receiver_name":searchJson.receiver_name,
					"receiver_mobile":searchJson.receiver_mobile,
					"receiver_address":searchJson.receiver_address,
					"seller_memo":searchJson.seller_memo,
					"buyer_message":searchJson.buyer_message,
					"payment1":searchJson.payment1,
					"payment2":searchJson.payment2,
					"items_num1":searchJson.items_num1,
					"items_num2":searchJson.items_num2,
					"prd_loc1":searchJson.prd_loc1,
					"prd_loc2":searchJson.prd_loc2,
					"sku_num1":searchJson.sku_num1,
					"sku_num2":searchJson.sku_num2,
					"express_no":searchJson.express_no,
					"waybill_dates":searchJson.waybill_dates,
					"diff_paytime":searchJson.diff_paytime,
					"order_sign":searchJson.order_sign,
					"not_order_sign":searchJson.not_order_sign,
					"prd_loc_str":searchJson.prd_loc_str,
					"more_code":searchJson.more_code,
					"sign_status":searchJson.sign_status,
					"fetch_detail":searchJson.fetch_detail,
					"lable_status":searchJson.lable_status,
					"is_fetch":searchJson.is_fetch,
					"dsos_print_status":searchJson.dsos_print_status,
					"express_status":searchJson.express_status,
					"prd_no_sku_name1":searchJson.prd_no_sku_name1,
					"prd_no_sku_name2":searchJson.prd_no_sku_name2,
					"prd_no_sku_name3":searchJson.prd_no_sku_name3,
					"not_prd_no_sku_name1":searchJson.not_prd_no_sku_name1,
					"not_prd_no_sku_name2":searchJson.not_prd_no_sku_name2,
					"print_dsos_bat_no":searchJson.print_dsos_bat_no,
					"print_waybill_bat_no":searchJson.print_waybill_bat_no,
					"distribution":searchJson.distribution,
					"itemSelect":searchJson.itemSelect,
					"title":searchJson.title,
					"sku_name":searchJson.sku_name,
					"not_sku_name":searchJson.not_sku_name,
					"outer_id":searchJson.outer_id,
					"outer_sku_id":searchJson.outer_sku_id,
					"send_error":searchJson.send_error,
					"sysPlan":searchJson.sysPlan,
					"unique_code":searchJson.unique_code,
					"prd_no":searchJson.prd_no,
					"not_prd_no":searchJson.not_prd_no,
					"num_iid":searchJson.num_iid,
					"exception":searchJson.exception,
					"payway":searchJson.payway,
					"webStatus":searchJson.webStatus,
					"repeatOrder":searchJson.repeatOrder,
					"sameBuyer":searchJson.sameBuyer,
					"DROP_SHIPPING": flow.DROP_SHIPPING,
					"shippingId": flow.shippingId,
				};	
				
				flow.searchData = searchData;
				
				$.ajax({
					url: "/index.php?m=system&c=delivery&a=getOrderTrade",
					type: 'post',
					data: {data: searchData},
					dataType: 'json',
					success: function (data) {
						var gridData = data.data;
						var pageCount = data.pageCount;
						var pageNo = data.pageNo;
						var pageSize = data.pageSize;
						var result_total = data.result_total;
						
						flow.gridArr = gridData;
						flow.pageCount = pageCount;
						flow.pageNo = pageNo;
						flow.pageSize = pageSize;
						flow.result_total = result_total;			
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
									
									if(self.isAll == 0){
										$('#selectOrderNum').html($("input[name='order']").filter(':checked').length);
									}else{
										$('#selectOrderNum').html(self.result_total);
									}
								} else {																																														
									$(event.target).parent().parent().parent().css("backgroundColor","rgb(249, 249, 249)");
									flow.isAll = 0;
									flow.allPage = false;
									$(".inputTe").css("color","white");
									
									if(self.isAll == 0){
										$('#selectOrderNum').html($("input[name='order']").filter(':checked').length);
									}else{
										$('#selectOrderNum').html(self.result_total);
									}
								}																																																
							});	
						},200);
						$("input[name='order']").iCheck('uncheck');
						$(".inputTe").css("color","white");
						flow.isAll = 0;
						flow.nowPage = false;
						flow.allPage = false;
					}
				});
			}else{
				reloadSearchPlan();
			}
		}
	})
}

//=============================================================================================================选择标签删除方法==================================================================================
function closeNow(group){																																											//===========
	if(group == "labelGroup"){																																										//===========
		$("#searchArr .lab").remove();																																								//===========
																																																	//===========
		flow.print = "0";																																											//===========
																																																	//===========
		$(".labelGroup div").each(function(){																																						//===========
			$(".labelGroup .ic").remove();																																							//===========
			$(this).removeClass("border");																																					//===========
		});																																															//===========
																																																	//===========
		$(".labelGroup .all").append("<i class='ic'></i>");																														
		$(".labelGroup .all").addClass("border");																																			
	}else if(group == "faceGroup"){																																									//===========
		$("#searchArr .face").remove();																																								//===========
																																																	//===========
		flow.facePrint = "0";																																										//===========
																																																	//===========
		$(".faceGroup div").each(function(){																																						//===========
			$(".faceGroup .ic").remove();																																							//===========
			$(this).removeClass("border");																																					//===========
		});																																															//===========
																																																	//===========
		$(".faceGroup .all").append("<i class='ic'></i>");																														//===========
		$(".faceGroup .all").addClass("border");																																		//===========
	}else if(group == "picGroup"){																																									//===========
		$("#searchArr .deli").remove();																																								//===========
																																																	//===========
		flow.stock_order = "";																																											//===========
																																																	//===========
		$(".picGroup div").each(function(){																																							//===========
			$(".picGroup .ic").remove();																																							//===========
			$(this).removeClass("border");																																					//===========
		});																																															//===========
																																																	//===========
		$(".picGroup .all").append("<i class='ic'></i>");																															//===========
		$(".picGroup .all").addClass("border");																																			//===========
	}else if(group == "bannerArr"){																																									//===========
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
		flow.norefunds = false;
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
		$("#shop").val("");																																											//===========
		flow.showshop = false;
		$('input[name="shopList"]').each(function(){
			$(this).iCheck('uncheck');
		});
		flow.shopId = "";																																											//===========
	}else if(group == "express"){																																									//===========
		$("#searchArr .express").remove();																																							//===========
		$("#express").val(0);																																										//===========
		flow.express = "";																																											//===========
	}else if(group == "orderStatus"){																																								//===========
		flow.orderStatus = "";																																										//===========
		$("#searchArr .orderStatus").remove();																																						//===========
		$("#orderStatus").val(0);																																									//===========
	}else if(group == "sendError"){																																									//===========
		flow.send_error = "no";																																										//===========
		$("#searchArr .sendError").remove();																																						//===========
	}else if(group == "exception"){																																									//===========
		flow.exception = "no";																																										
		$("#searchArr .exce").remove();																																								
	}else if(group == "sear_left"){																																								
		$("#searchArr .sear_left").remove();
		$("#separator1").val("show_tid");																																								
		$(".changeDiv").html("<input class='show_tid inp' placeholder='多个逗号隔开' onkeydown='keyDownSearch()' name='reset'>");
	}else if(group == "sear_right"){
		$("#searchArr .sear_right").remove();
		$("#separator2").val("prd_no");																																									//===========
		$(".changeDiv1").html("<input type='text' class='prd_no inp' placeholder='商品编号' name='reset' onkeydown='keyDownSearch()'>");	
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
	$("#shop").val("");																																												//===========
	$("#express").val(0);																																											//===========
	$("#orderStatus").val(0);																																										//===========
	$("#separator1").val("show_tid");	
	$("#separator3").val("select_payment_time");
	$(".changeDiv").html("<input class='show_tid inp' placeholder='多个逗号隔开' onkeydown='keyDownSearch()' name='reset'>");																		//===========
	$("#separator2").val("prd_no");																																									//===========
	$(".changeDiv1").html("<input type='text' class='prd_no inp' placeholder='商品编号' name='reset' onkeydown='keyDownSearch()'>");																	//===========
	//===========
	$(".labelGroup div").each(function(){																																							//===========
		$(".labelGroup .ic").remove();																																								//===========
		$(this).removeClass("border");																																								//===========
	});	
	
	$("#payway").val(0);
	flow.payway = "";
	
	$("#webStatus").val(0);
	flow.webStatus = "";

	$(".specialGroup div").each(function(){																																							//===========
		$(".labelGroup .ic").remove();																																								//===========
		$(this).removeClass("border");																																								//===========
	});		
																																																	//===========
	$(".labelGroup .all").append("<i class='ic'></i>");																																				//===========
	$(".labelGroup .all").addClass("border");																																						//===========
																																																	//===========
	$(".faceGroup div").each(function(){																																							//===========
		$(".faceGroup .ic").remove();																																								//===========
		$(this).removeClass("border");																																								//===========
	});																																																//===========
																																																	//===========
	$(".faceGroup .all").append("<i class='ic'></i>");																																				//===========
	$(".faceGroup .all").addClass("border");																																						//===========
																																																	//===========
	$(".picGroup div").each(function(){																																								//===========
		$(".picGroup .ic").remove();																																								//===========
		$(this).removeClass("border");																																								//===========
	});																																																//===========
																																																	//===========
	$(".picGroup .all").append("<i class='ic'><i class='ri'></i></i>");																																//===========
	$(".picGroup .all").addClass("border");																																				//===========
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
	
	self.showshop = false;
	$('input[name="shopList"]').each(function(){
		$(this).iCheck('uncheck');
	});																																																//===========
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
		self.norefunds = false;
		self.merge = false;									//																																		//===========
	}														//--------------------------------------																								//===========
																																																	//===========
	self.print = "0";       																																										//===========                                         
	self.facePrint = "0";																																											//===========									 
	self.delivery = "0";
	self.stock_order = "";
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
	self.send_error = "no";
	self.repeatOrder = false;
	self.sameBuyer = false;
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
		$(".changeDiv").html("<input class='" + a + " inp'  placeholder='唯一码|爆款码' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "buyer_nick"){
		$(".changeDiv").html("<input class='" + a + " inp'  placeholder='多个逗号隔开' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "receiver_name"){
		$(".changeDiv").html("<input type='text' class='" + a + " inp' placeholder='收件人姓名' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "receiver_mobile"){
		$(".changeDiv").html("<input type='number' class='" + a + " inp' placeholder='手机号码' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "receiver_address"){
		$(".changeDiv").html("<input type='text' class='" + a + " inp' placeholder='收件人地址' onkeydown='keyDownSearch()' name='reset'>");
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
	}else if(a == "express_no"){
		$(".changeDiv").html("<input type='text' class='" + a + " inp' placeholder='运单号' style='border:1px solid #c2c2c2;' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "waybill_dates"){
		$(".changeDiv").html("<input type='text' class='" + a + " inp' placeholder='天数以前，如填写：10，即为查询10天前，请填写整数' style='border:1px solid #c2c2c2;' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "diff_paytime"){
		$(".changeDiv").html("<input type='text' class='" + a + " inp' placeholder='间隔秒数：如填写：3，即为查询3秒前，请填写整数' style='border:1px solid #c2c2c2;' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "order_sign"){
		$(".changeDiv").html("<input type='text' class='" + a + " inp' placeholder='请填写订单标识，如：黑（黑名单），多个用英文逗号分隔' style='border:1px solid #c2c2c2;' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "not_order_sign"){
		$(".changeDiv").html("<input type='text' class='" + a + " inp' placeholder='请填写订单标识，如：黑（黑名单），多个用英文逗号分隔' style='border:1px solid #c2c2c2;' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "prd_loc"){
		$(".changeDiv").html("<input type='text' class='" + a + "1 inp' placeholder='起始货位' style='width:153.5px;border:1px solid #c2c2c2;' onkeydown='keyDownSearch()' name='reset'> - <input type='text' class='" + a + "2 inp' placeholder='结束货位' style='width:153.5px;border:1px solid #c2c2c2;' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "more_code"){
		$(".changeDiv").html("<input type='text' class='" + a + " inp' placeholder='群单码' style='border:1px solid #c2c2c2;' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "print_dsos_bat_no"){
		$.ajax({
			url: "/index.php?m=system&c=delivery&a=getPrintDsosBatNo",
			type: 'post',
			data: {DROP_SHIPPING: flow.DROP_SHIPPING, shippingId: flow.shippingId},
			dataType: 'json',
			success: function (data) {
				var dsosHtml = '<select class="' + a + ' form-control separator" style="background: url(\'images/down.png\') no-repeat scroll 90% center transparent;background-size:17px 15px;border:solid 1px #ccc;">';
				dsosHtml += '<option value=""></option>';
				if(data){
					for(var i = 0; i < data.length; i++){
						dsosHtml += '<option value="' + data[i]['print_dsos_bat_no'] + '">' + data[i]['print_dsos_bat_no'] + '</option>';
					}
					dsosHtml += '</select>';
				}
				dsosHtml += '</select>';
				$(".changeDiv").html(dsosHtml);
			}
		});
	}else if(a == "print_waybill_bat_no"){
		$.ajax({
			url: "/index.php?m=system&c=delivery&a=getPrintWayBillBatNo",
			type: 'post',
			data: {DROP_SHIPPING: flow.DROP_SHIPPING, shippingId: flow.shippingId},
			dataType: 'json',
			success: function (data) {
				var dsosHtml = '<select class="' + a + ' form-control separator" style="background: url(\'images/down.png\') no-repeat scroll 90% center transparent;background-size:17px 15px;border:solid 1px #ccc;">';
				dsosHtml += '<option value=""></option>';
				if(data){
					for(var i = 0; i < data.length; i++){
						dsosHtml += '<option value="' + data[i]['bat_no'] + '">' + data[i]['print_time'] + '</option>';
					}
					dsosHtml += '</select>';
				}
				dsosHtml += '</select>';
				$(".changeDiv").html(dsosHtml);
			}
		});
	}else if(a == "dsos_print_status"){
		$(".changeDiv").html("<input type='text' class='" + a + " inp' placeholder='已打印|未打印' onkeydown='keyDownSearch()' name='reset'> ");
	}else if(a == "express_status"){
		$(".changeDiv").html("<input type='text' class='" + a + " inp' placeholder='已推送|推送失败' onkeydown='keyDownSearch()' name='reset'> ");
	}
}

function itemChange(a){
	if(a == "prd_no"){
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='商品编号' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "not_prd_no"){
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='(不含)商品编号' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "num_iid"){
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='网店商品ID' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "title"){
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='宝贝标题' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "sku_name"){
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='宝贝属性' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "not_sku_name"){
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='(不含)宝贝属性' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "outer_id"){
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='主商家编码' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "outer_sku_id"){
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='SKU商家编码' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "prd_loc_str"){
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='货位，多个用英文逗号分隔' onkeydown='keyDownSearch()' name='reset'> ");
	}else if(a == "prd_no_sku_name"){
		$(".changeDiv1").html("<input type='text' class='" + a + "1 inp' style='width:113px;border:1px solid #c2c2c2;' placeholder='商品编号' onkeydown='keyDownSearch()' name='reset'> <input type='text' class='" + a + "2 inp' style='width:106px;border:1px solid #c2c2c2;' placeholder='宝贝属性(精确)' onkeydown='keyDownSearch()' name='reset'>  <input type='text' class='" + a + "3 inp' style='width:106px;border:1px solid #c2c2c2;' placeholder='宝贝属性(模糊)' onkeydown='keyDownSearch()' name='reset'>");
	}else if(a == "not_prd_no_sku_name"){
		$(".changeDiv1").html("<input type='text' class='" + a + "1 inp' style='width:116px;border:1px solid #c2c2c2;' placeholder='(不含)商品编号' onkeydown='keyDownSearch()' name='reset'> <input type='text' class='" + a + "2 inp' style='width:115px;border:1px solid #c2c2c2;' placeholder='(不含)宝贝属性' onkeydown='keyDownSearch()' name='reset'> ");
	}else if(a == "lable_status"){
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='生成|关闭' onkeydown='keyDownSearch()' name='reset'> ");
	}else if(a == "is_fetch"){
		var dsosHtml = '<div style="float:left;"><select class="' + a + ' form-control separator" style="background: url(\'images/down.png\') no-repeat scroll 90% center transparent;background-size:17px 15px;border:solid 1px #ccc;width:204px;">';
		dsosHtml += '<option value=""></option><option value="1">是</option><option value="2">否</option>';
		dsosHtml += '</select>';
		$(".changeDiv1").html(dsosHtml);
		/*$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='是|否' onkeydown='keyDownSearch()' name='reset'> ");*/
	}else if(a == "sign_status"){
		$.ajax({
			url: "/index.php?m=system&c=delivery&a=getSignStatus",
			type: 'post',
			data: {DROP_SHIPPING: flow.DROP_SHIPPING, shippingId: flow.shippingId},
			dataType: 'json',
			success: function (data) {
				flow.expressArr = data;	
				var dsosHtml = '<div style="float:left;"><select class="' + a + ' form-control separator" style="background: url(\'images/down.png\') no-repeat scroll 90% center transparent;background-size:17px 15px;border:solid 1px #ccc;width:204px;">';
				dsosHtml += '<option value=""></option><option value="0">无标记状态</option>';
				if(data){
					for(var i = 0; i < data.length; i++){
						dsosHtml += '<option value="' + data[i]['id'] + '">' + data[i]['statusName'] + '</option>';
					}
					dsosHtml += '</select>';
				}
				dsosHtml += '</select></div><div style="margin-left:10px;float:left;"><button id="signStatusManage" class="btn" style="width:120px;" onclick="signStatusManage()">添加标记状态</button></div>';
				$(".changeDiv1").html(dsosHtml);
			}
		});
	}else if(a == "check_stock_status"){
		var dsosHtml = '<div style="float:left;"><select class="' + a + ' form-control separator" style="background: url(\'images/down.png\') no-repeat scroll 90% center transparent;background-size:17px 15px;border:solid 1px #ccc;width:204px;">';
		dsosHtml += '<option value=""></option><option value="1">挂单</option><option value="2">缺货</option><option value="3">下架</option>';
		dsosHtml += '</select>';
		$(".changeDiv1").html(dsosHtml);
	}else if(a == "fetch_detail"){
		$(".changeDiv1").html("<input type='text' class='" + a + " inp' placeholder='自提点' onkeydown='keyDownSearch()' name='reset'> ");
		/*$.ajax({
			url: "/index.php?m=system&c=delivery&a=getfetchDetail",
			type: 'post',
			data: {DROP_SHIPPING: flow.DROP_SHIPPING, shippingId: flow.shippingId},
			dataType: 'json',
			success: function (data) {
				flow.fetchDetailArr = data;	
				var dsosHtml = '<div style="float:left;"><select class="' + a + ' form-control separator" style="background: url(\'images/down.png\') no-repeat scroll 90% center transparent;background-size:17px 15px;border:solid 1px #ccc;width:204px;">';
				dsosHtml += '<option value=""></option><option value="0">无自提点</option>';
				if(data){
					for(var i = 0; i < data.length; i++){
						dsosHtml += '<option value="' + data[i]['configKey'] + '">' + data[i]['configKey'] + '</option>';
					}
					dsosHtml += '</select>';
				}
				$(".changeDiv1").html(dsosHtml);
			}
		});*/
	}
}

//============================================================================================查询方法封装=======================================================================================================
function searchALLNow(self,page,callback){
	var dateSelect = $("#separator3").val();
	var dateBegin = $("#dateBegin").val();																																							
	var dateEnd = $("#dateEnd").val();	
	/***********/
	var orderSelect = $("#separator1").val();
	var show_tid = $('.show_tid').val();
	var unique_code = $(".unique_code").val();
	var buyer_nick = $('.buyer_nick').val();
	var receiver_name = $('.receiver_name').val();
	var receiver_mobile = $('.receiver_mobile').val();
	var receiver_address = $('.receiver_address').val();
	var seller_memo = $('.seller_memo').val();
	var buyer_message = $('.buyer_message').val();
	var payment1 = $('.payment1').val();
	var payment2 = $('.payment2').val();
	var items_num1 = $('.items_num1').val();
	var items_num2 = $('.items_num2').val();
	var sku_num1 = $('.sku_num1').val();
	var sku_num2 = $('.sku_num2').val();
	var express_no = $('.express_no').val();
	var waybill_dates = $('.waybill_dates').val();
	var diff_paytime = $('.diff_paytime').val();
	var order_sign = $('.order_sign').val();
	var not_order_sign = $('.not_order_sign').val();
	var prd_loc1 = $('.prd_loc1').val();
	var prd_loc2 = $('.prd_loc2').val();
	var prd_loc_str = $('.prd_loc_str').val();
	var more_code = $('.more_code').val();
	var sign_status = $('.sign_status').val();
	var sign_status_text = $(".sign_status option:selected").text();
	var fetch_detail = $('.fetch_detail').val();
	var lable_status = $('.lable_status').val();
	var is_fetch = $('.is_fetch').val();
	var dsos_print_status = $('.dsos_print_status').val();
	var express_status = $('.express_status').val();
	var prd_no_sku_name1 = $('.prd_no_sku_name1').val();
	var prd_no_sku_name2 = $('.prd_no_sku_name2').val();
	var prd_no_sku_name3 = $('.prd_no_sku_name3').val();
	var not_prd_no_sku_name1 = $('.not_prd_no_sku_name1').val();
	var not_prd_no_sku_name2 = $('.not_prd_no_sku_name2').val();
	var print_dsos_bat_no = $('.print_dsos_bat_no').val();
	var print_waybill_bat_no = $('.print_waybill_bat_no').val();
	var print_waybill_bat_no_text = $(".print_waybill_bat_no option:selected").text();
	var distribution = $('#distribution').val();
	var check_stock_status = $('.check_stock_status').val();
	var check_stock_status_text = $(".check_stock_status option:selected").text();
	/***********/
	/***********/
	var itemSelect = $("#separator2").val();
	var prd_no = $('.prd_no').val();
	var not_prd_no = $('.not_prd_no').val();
	var num_iid = $('.num_iid').val();
	var title = $('.title').val();
	var sku_name = $('.sku_name').val();
	var not_sku_name = $('.not_sku_name').val();
	var outer_id = $('.outer_id').val();
	var outer_sku_id = $('.outer_sku_id').val();
	/***********/


	var now = new Date();
	var Year = now.getFullYear();//获取当前年
	var Month =  now.getMonth()+1;
	var Day =  now.getDate();
	var temp = "";

	if(self.sysPlan == 'send' && Month == 11 && 11<=Day<=14 ){
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
	}else if(not_prd_no != undefined && not_prd_no != ""){
		$("#searchArr").append("<span class='add sear_right rem'>(不含)商品编号:"+not_prd_no+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}else if(num_iid != undefined && num_iid != ""){
		$("#searchArr").append("<span class='add sear_right rem'>网店商品ID:"+num_iid+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}else if(title != undefined && title != ""){
		$("#searchArr").append("<span class='add sear_right rem'>宝贝标题:"+title+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}else if(sku_name != undefined && sku_name != ""){
		$("#searchArr").append("<span class='add sear_right rem'>宝贝属性:"+sku_name+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}else if(not_sku_name != undefined && not_sku_name != ""){
		$("#searchArr").append("<span class='add sear_right rem'>(不含)宝贝属性:"+not_sku_name+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}else if(outer_id != undefined && outer_id != ""){
		$("#searchArr").append("<span class='add sear_right rem'>线上主商家编码:"+outer_id+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}else if(outer_sku_id != undefined && outer_sku_id != ""){
		$("#searchArr").append("<span class='add sear_right rem'>线上sku商家编码:"+outer_sku_id+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}else if((prd_no_sku_name1 != undefined && prd_no_sku_name1 != "") || (prd_no_sku_name2 != undefined && prd_no_sku_name2 != "") || (prd_no_sku_name3 != undefined && prd_no_sku_name3 != "")){
		var prd_no_sku_name_html = "<span class='add sear_right rem'>";
		if(prd_no_sku_name1 != undefined && prd_no_sku_name1 != ""){
			prd_no_sku_name_html += "商品编号:"+prd_no_sku_name1+"&nbsp";
		}
		if(prd_no_sku_name2 != undefined && prd_no_sku_name2 != ""){
			prd_no_sku_name_html += "宝贝属性(精确):"+prd_no_sku_name2+"&nbsp";
		}
		if(prd_no_sku_name3 != undefined && prd_no_sku_name3 != ""){
			prd_no_sku_name_html += "宝贝属性(模糊):"+prd_no_sku_name3+"&nbsp";
		}
		prd_no_sku_name_html += "<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>";
		$("#searchArr").append(prd_no_sku_name_html);
	}else if(not_prd_no_sku_name1 != undefined && not_prd_no_sku_name1 != "" && not_prd_no_sku_name2 != undefined && not_prd_no_sku_name2 != ""){
		$("#searchArr").append("<span class='add sear_right rem'>(不含)商品编号:"+not_prd_no_sku_name1+"(不含)宝贝属性:"+not_prd_no_sku_name2+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}else if(not_prd_no_sku_name1 != undefined && not_prd_no_sku_name1 != ""){
		$("#searchArr").append("<span class='add sear_right rem'>(不含)商品编号:"+not_prd_no_sku_name1+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}else if(not_prd_no_sku_name2 != undefined && not_prd_no_sku_name2 != ""){
		$("#searchArr").append("<span class='add sear_right rem'>(不含)宝贝属性:"+not_prd_no_sku_name2+"<i class='dele' id='sear_right' onclick='closeNow(\"sear_right\")'></i></span>");
	}
	
	
	if(show_tid != undefined && show_tid != ""){
		$("#searchArr").append("<span class='add sear_left rem'>订单编号:"+show_tid+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(unique_code != undefined && unique_code != ""){
		$("#searchArr").append("<span class='add sear_left rem'>唯一码|爆款码:"+unique_code+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(buyer_nick != undefined && buyer_nick != ""){
		$("#searchArr").append("<span class='add sear_left rem'>买家昵称:"+buyer_nick+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(receiver_name != undefined && receiver_name != ""){
		$("#searchArr").append("<span class='add sear_left rem'>收件人姓名:"+receiver_name+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(receiver_address != undefined && receiver_address != ""){
		$("#searchArr").append("<span class='add sear_left rem'>收件人地址:"+receiver_address+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
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
		
	}else if(express_no != undefined && express_no != ""){
		$("#searchArr").append("<span class='add sear_left rem'>运单号:"+express_no+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(waybill_dates != undefined && waybill_dates != ""){
		$("#searchArr").append("<span class='add sear_left rem'>预约电子面单天数:"+waybill_dates+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(more_code != undefined && more_code != ""){
		$("#searchArr").append("<span class='add sear_left rem'>群单码:"+more_code+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(diff_paytime != undefined && diff_paytime != ""){
		$("#searchArr").append("<span class='add sear_left rem'>下单与付款间隔秒数小于:"+diff_paytime+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(order_sign != undefined && order_sign != ""){
		$("#searchArr").append("<span class='add sear_left rem'>订单标识:"+order_sign+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(not_order_sign != undefined && not_order_sign != ""){
		$("#searchArr").append("<span class='add sear_left rem'>不含订单标识:"+not_order_sign+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(prd_loc1 != undefined && prd_loc1 != ""){
		if(prd_loc2 != undefined && prd_loc2 != ""){
			$("#searchArr").append("<span class='add sear_left rem'>起始货位:"+prd_loc1+"-"+prd_loc2+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
		}else{
			$("#searchArr").append("<span class='add sear_left rem'>结束货位:"+prd_loc1+"-<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
		}
	}else if(prd_loc_str != undefined && prd_loc_str != ""){
		$("#searchArr").append("<span class='add sear_left rem'>货位:"+prd_loc_str+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(lable_status != undefined && lable_status != ""){
		$("#searchArr").append("<span class='add sear_left rem'>标签状态:"+lable_status+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(is_fetch != undefined && is_fetch != ""){
		$("#searchArr").append("<span class='add sear_left rem'>自提订单:"+is_fetch+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(dsos_print_status != undefined && dsos_print_status != ""){
		$("#searchArr").append("<span class='add sear_left rem'>发货清单打印状态:"+dsos_print_status+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(express_status != undefined && express_status != ""){
		$("#searchArr").append("<span class='add sear_left rem'>物流轨迹推送状态:"+express_status+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(print_dsos_bat_no != undefined && print_dsos_bat_no != ""){
		$("#searchArr").append("<span class='add sear_left rem'>发货清单批次号:"+print_dsos_bat_no+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(print_waybill_bat_no != undefined && print_waybill_bat_no != ""){
		$("#searchArr").append("<span class='add sear_left rem'>快递单打印批次:"+print_waybill_bat_no_text+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(sign_status != undefined && sign_status != ""){
		$("#searchArr").append("<span class='add sear_left rem'>标记状态:"+sign_status_text+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(check_stock_status != undefined && check_stock_status != ""){
		$("#searchArr").append("<span class='add sear_left rem'>挂单状态:"+check_stock_status_text+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}else if(fetch_detail != undefined && fetch_detail != ""){
		$("#searchArr").append("<span class='add sear_left rem'>自提点:"+fetch_detail+"<i class='dele' id='sear_left' onclick='closeNow(\"sear_left\")'></i></span>");
	}
	
	if(self.shopId != ''){
		$("#searchArr .shop").remove();																																								//===========
		$("#searchArr").append("<span class='add shop rem'>" + $("#shop").val() + "<i class='dele' id='specialGroup' onclick='closeNow(\"shop\")'></i></span>");
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
		"print":self.print,																																											
		"facePrint":self.facePrint,																																									
		"special":self.special,																																										
		"shopId":self.shopId,																																										
		"remark":self.remark,																																										
		"delivery":self.delivery,
		"stock_order":self.stock_order,
		"babyNum":self.babyNum,																																										
		"express":self.express,																																										
		"banner":self.banner,																																										
		"singleStatus":self.singleStatus,																																							
		"province":self.province,																																									
		"provinceStatus":self.provinceStatus,																																						
		"orderStatus":self.orderStatus,	
		"dateSelect": dateSelect,
		"dateBegin":dateBegin,																																										
		"dateEnd":dateEnd,																																											
		"order":self.order,
		"orderSelect": orderSelect,
		"show_tid":$.trim(show_tid),
		"buyer_nick":$.trim(buyer_nick),
		"receiver_name":$.trim(receiver_name),
		"receiver_mobile":$.trim(receiver_mobile),
		"receiver_address":$.trim(receiver_address),
		"seller_memo":$.trim(seller_memo),
		"buyer_message":$.trim(buyer_message),
		"payment1":$.trim(payment1),
		"payment2":$.trim(payment2),
		"items_num1":$.trim(items_num1),
		"items_num2":$.trim(items_num2),
		"prd_loc1":$.trim(prd_loc1),
		"prd_loc2":$.trim(prd_loc2),
		"sku_num1":$.trim(sku_num1),
		"sku_num2":$.trim(sku_num2),
		"express_no":$.trim(express_no),
		"waybill_dates":$.trim(waybill_dates),
		"diff_paytime":$.trim(diff_paytime),
		"order_sign":$.trim(order_sign),
		"not_order_sign":$.trim(not_order_sign),
		"prd_loc_str":$.trim(prd_loc_str),
		"more_code":$.trim(more_code),
		"sign_status":$.trim(sign_status),
		"fetch_detail":$.trim(fetch_detail),
		"lable_status":$.trim(lable_status),
		"is_fetch":$.trim(is_fetch),
		"dsos_print_status":$.trim(dsos_print_status),
		"express_status":$.trim(express_status),
		"prd_no_sku_name1":$.trim(prd_no_sku_name1),
		"prd_no_sku_name2":$.trim(prd_no_sku_name2),
		"prd_no_sku_name3":$.trim(prd_no_sku_name3),
		"not_prd_no_sku_name1":$.trim(not_prd_no_sku_name1),
		"not_prd_no_sku_name2":$.trim(not_prd_no_sku_name2),
		"print_dsos_bat_no":$.trim(print_dsos_bat_no),
		"print_waybill_bat_no":$.trim(print_waybill_bat_no),
		"distribution":$.trim(distribution),
		"itemSelect":itemSelect,
		"title":title,
		"sku_name":sku_name,
		"not_sku_name":not_sku_name,
		"outer_id":outer_id,
		"outer_sku_id":outer_sku_id,
		"send_error":self.send_error,
		"sysPlan":self.sysPlan,
		"unique_code":$.trim(unique_code),
		"prd_no":prd_no,
		"not_prd_no":not_prd_no,
		"num_iid":num_iid,
		"exception":self.exception,
		"payway":self.payway,
		"webStatus":self.webStatus,
		"repeatOrder":self.repeatOrder,
		"sameBuyer":self.sameBuyer,
		"DROP_SHIPPING": self.DROP_SHIPPING,
		"shippingId": self.shippingId,
		'check_stock_status': check_stock_status,
	};	
	self.searchData = data;
	
	$.ajax({
		url: "/index.php?m=system&c=delivery&a=getOrderTrade",
		type: 'post',
		data: {data: data},
		dataType: 'json',
		success: function (data) {
			if(layer){
				layer.closeAll('loading');
			}
			var miniDatas = data.data;
			var miniData = formattingCode(miniDatas);
			grid1.setData(miniData);
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
						
						if(self.isAll == 0){
							$('#selectOrderNum').html($("input[name='order']").filter(':checked').length);
						}else{
							$('#selectOrderNum').html(self.result_total);
						}
					} else {																																														
						$(event.target).parent().parent().parent().css("backgroundColor","rgb(249, 249, 249)");
						self.isAll = 0;
						self.allPage = false;
						$(".inputTe").css("color","white");
						
						if(self.isAll == 0){
							//console.log($("input[name='order']").filter(':checked').length);
							$('#selectOrderNum').html($("input[name='order']").filter(':checked').length);
						}else{
							$('#selectOrderNum').html(self.result_total);
						}
					}																																																
				});	
			},200);
			$("input[name='order']").iCheck('uncheck');
			$(".inputTe").css("color","white");
			self.isAll = 0;
			self.nowPage = false;
			self.allPage = false;
			if(data.system_id){//反查出来system_id
				$("#shipping").val(data.system_id);
				shippingChange(data.system_id);
			}
			
			//添加回调函数
			if(callback && typeof(callback) == "function"){
				callback();
			}
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
	var searchData = {tid: tid, sysPlan:self.sysPlan, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId};
	$.ajax({
		url: "/index.php?m=system&c=delivery&a=getOrderTrade",
		type: 'post',
		data: {data: searchData},
		dataType: 'json',
		async:false,
		success: function (data) {
			if(data){
				tid = " "+tid;
				var gridData = data.data;
				var rowData = gridData[tid];
				
				if(rowData){
					self.gridArr[order_index] = rowData;
					var dataClone = self.gridArr;
					self.gridArr = [];
					self.gridArr = dataClone;
				}
				var oIndex = 0;
				var oData = self.gridArr;
				for(var i in oData){
					if(i == order_index){
						break;
					}else{
						oIndex++;
					}
				}
				var new_gridArr = {};
				new_gridArr[0] = self.gridArr[order_index];
				var miniData = formattingCode(new_gridArr);
				var row = grid1.getRow(oIndex);
				grid1.updateRow(row,miniData[0]);
			}
		}
	});
}
//=========================行刷新===========

function cbPrintView(data){
    var double_row = $("input[name='double_row']").parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
    var width = $("input[name='width']").val() * 8;
    var height = $("input[name='height']").val() * 8;
    if(double_row){
        width = width * 2;
    }
    layer.open({
        type: 1
        ,title: false //不显示标题栏
        ,closeBtn: false
        ,area: ['400px','650px']
        ,shade: 0.8
		,shadeClose:true
        ,id: 'previewImage' //设定一个id，防止重复弹出
        ,btn: ['关闭']
        ,moveType: 1 //拖拽模式，0或者1
        ,content: '<div style="width:'+width+'px;height:'+height+'px;"><img style="width:350px;height:580px;" src="'+data['previewImage'][0]+'" /></div>'
    });
}

function cbPrintSend(self){//打印并发货
	//var taskID = data.taskID;
	//if(taskID.substring(0,5) == "send@"){
		//var strObj = taskID.split('@');
		//var tid = strObj[1];
		//if(tid != ""){
		var data = "";
		if(self.isAll == 0){														//-----如果是当前页																							
			$("input[name='order']:checkbox").each(function(){						//--------------------------																				
				if(true == $(this).is(':checked')){									//																											
					data += ($(this).val()+",");									//																											
				}																	//	拼接当前页的货品唯一码																					
			});																		//																							
			data = data.substring(0,data.length-1);									//--------------------------																														
		}else if(self.isAll != 0){
			data = self.searchData;
		}
		
		$.ajax({																																														
			url: "/index.php?m=system&c=delivery&a=printOrderSend",																																		
			type: 'post',																																												
			data: {data:data,isAll:self.isAll},																																													
			dataType: 'json',
			async:false,
			success: function (data) {
				layer.msg("打印成功",{
					icon: 1,
					time: 2000
				});
			}																																															
		});
		//}
	//}
}

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
	}else if(type == "PRD3"){
		$("#prd_number").val(data[0]['prd_no']);
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
			data = JSON.stringify(data);
			data = encodeURI(data);
			
			$.ajax({																																														
				url: "/index.php?m=system&c=delivery&a=orderSplitSave",																																		
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
			
		}
	});	
}

function signStatusManage(){
	layer.open({
		title :'添加标记状态',
		type: 2,
		shade: 0.3,
		area: ['350px', '450px'],
		maxmin: false,
		content: '?m=system&c=delivery&a=signStatusManage'
	}); 
}

layui.use('form', function(){
	var form = layui.form();
	
	form.on('switch(pages11-gift)', function(data){
		if(data.elem.checked == true){
			flow.memoryPrice = $("#pages11-price").val();
			$("#pages11-price").val(0);
			$("#pages11-price").attr("readonly","readonly");
		}else{
			$("#pages11-price").removeAttr("readonly");
			$("#pages11-price").val(flow.memoryPrice);
		}
	});      
});


function log(tid){
	flow.log(tid);
}
function modify(tid){
	flow.modify(tid);
}
function modifySllerMemo(tid){
	flow.modifySllerMemo(tid);
}
function copyOrdersJudge(tid){
	flow.copyOrdersJudge(tid);
}
function doMore(tid,order_index){
	flow.doMore(tid,order_index);
}
function freePrints(tid){
	flow.freePrints(tid);
}
function modifyMess(tid,oid,sku_id,order_index,refund_status,bom_id,prd_no,sku_name){
	flow.modifyMess(tid,oid,sku_id,order_index,refund_status,bom_id,prd_no,sku_name);
}
function modifyExpressNo(order_index){
	flow.modifyExpressNo(order_index);
}
mini.get('grid1').on("cellendedit", function (e) {
	flow.modifyExpressNo(e['row']['new_tid']);
});

function formattingCode(miniDatas){
	var miniData = [];
	var miniIndex = 0;
	for(var t in miniDatas){
		var oPrdNoListArray = "";
		if(miniDatas[t]['itemInfo']){
			for(var u=0;u<miniDatas[t]['itemInfo'].length;u++){
				oPrdNoListArray = oPrdNoListArray + "<div style='padding:2px;display:inline-block;width:30px;height:30px;position:relative;' title='"+miniDatas[t]['itemInfo'][u]['title_naked']+"\n"+miniDatas[t]['itemInfo'][u]['prd_no']+"\n"+miniDatas[t]['itemInfo'][u]['sku_name']+"' onclick='modifyMess(\""+miniDatas[t]['itemInfo'][u].tid+"\", \""+miniDatas[t]['itemInfo'][u].oid+"\", \""+miniDatas[t]['itemInfo'][u].sku_id+"\", \""+t+"\", \""+miniDatas[t]['itemInfo'][u].refund_status+"\",\""+miniDatas[t]['itemInfo'][u].bom_id+"\",\""+miniDatas[t]['itemInfo'][u].prd_no+"\",\""+miniDatas[t]['itemInfo'][u].sku_name+"\")'><img id='img_pic_url_big' src='"+miniDatas[t]['itemInfo'][u]['pic_url']+"' style='width:30px;height:30px;'><div style='position: absolute; top: -5px;right: -5px;height: 10px;background: #FFFFFF; border: 1px solid #b0b0b0;line-height: 10px;font-size: 12px;border-radius: 2px;float:left;min-width:10px;'>"+miniDatas[t]['itemInfo'][u]['num']+"</div></div>";
			}
		}
		miniDatas[t]['oPrdNoListArray'] = oPrdNoListArray;
		var oPrdNoListState = "";
		if(miniDatas[t].close_unique_code == 1 && miniDatas[t].stock_order == 0){
			var oPrdNoListStateNum = "";
			if(miniDatas[t].print_unique_num > 0){
				oPrdNoListStateNum = '<span class="logoNum">'+miniDatas[t].print_unique_num+'</span>';
			}
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:grey;margin: 1px;" title="标签已打印'+miniDatas[t].print_unique_num+'次">签'+oPrdNoListStateNum+'</span>';
		}
		if(miniDatas[t].close_unique_code == 0 && miniDatas[t].stock_order == 0){
			var oPrdNoListStateNum = "";
			if(miniDatas[t].print_unique_num > 0){
				oPrdNoListStateNum = '<span class="logoNum">'+miniDatas[t].print_unique_num+'</span>';
			}
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:green;margin: 1px;" title="标签已打印'+miniDatas[t].print_unique_num+'次">签'+oPrdNoListStateNum+'</span>';
		}
		if(miniDatas[t].close_unique_code == 1 && miniDatas[t].stock_order == 1){
			var oPrdNoListStateNum = "";
			if(miniDatas[t].print_unique_num > 0){
				oPrdNoListStateNum = '<span class="logoNum" >'+miniDatas[t].print_unique_num+'</span>';
			}
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:grey;margin: 1px;" title="标签已打印'+miniDatas[t].print_unique_num+'次">库'+oPrdNoListStateNum+'</span>';
		}
		if(miniDatas[t].close_unique_code == 0 && miniDatas[t].stock_order == 1){
			var oPrdNoListStateNum = "";
			if(miniDatas[t].print_unique_num > 0){
				oPrdNoListStateNum = '<span class="logoNum" >'+miniDatas[t].print_unique_num+'</span>';
			}
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#1E9FFF;margin: 1px;" title="标签已打印'+miniDatas[t].print_unique_num+'次">库'+oPrdNoListStateNum+'</span>';
		}
		if(miniDatas[t].print_kd_num == 0){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:grey;margin: 1px;" title="面单已打印'+miniDatas[t].print_kd_num+'次">递</span>';
		}
		if(miniDatas[t].print_kd_num == 1){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:green;margin: 1px;" title="面单已打印'+miniDatas[t].print_kd_num+'次">递</span>';
		}
		if(miniDatas[t].print_kd_num > 1){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:green;margin: 1px;" title="面单已打印'+miniDatas[t].print_kd_num+'次">递</span>';
		}
		if(miniDatas[t].orderSign){
			if(miniDatas[t].orderSign.indexOf('shua,') > -1){
				oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#EEA236;margin: 1px;" title="刷单订单">刷</span>';
			}
			if(miniDatas[t].orderSign.indexOf('hei,') > -1){
				oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#000;margin: 1px;" title="黑名单订单">黑</span>';
			}
			if(miniDatas[t].orderSign.indexOf('hui,') > -1){
				oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#BEb256;margin: 1px;" title="下过单的回头客订单(手机号)">回</span>';
			}
		}
		if(miniDatas[t].manual == '1'){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#EEA236;margin: 1px;" title="手工订单">手</span>';
		}
		if(miniDatas[t].order_type == 'DAIFA'){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#FE7A54;margin: 1px;" title="分销订单">销</span>';
		}
		if(miniDatas[t].name_df != '' && miniDatas[t].order_type != 'DAIFA'){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#EE7A54;margin: 1px;" title="代发订单">代</span>';
		}
		if(miniDatas[t].order_type == 'WEIGONG'){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#A27A54;margin: 1px;" title="微供订单">微供</span>';
		}
		if(miniDatas[t].order_type == 'HUANHUO'){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#A27A54;margin: 1px;" title="换货订单">换货</span>';
		}
		if(miniDatas[t].order_type == 'BUFA'){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#A27A54;margin: 1px;" title="补发订单">补发</span>';
		}
		if(miniDatas[t].three_pl_timing == '1'){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#00BB88;margin: 1px;" title="天猫直送">3PL</span>';
		}
		if(miniDatas[t].three_pl_cnService == '80'){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#00BB88;margin: 1px;" title="当日达">当日达</span>';
		}
		if(miniDatas[t].three_pl_cnService == '81'){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#00BB88;margin: 1px;" title="次日达">次日达</span>';
		}
		if(miniDatas[t].three_pl_cnService == '84'){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#00BB88;margin: 1px;" title="多日达">多日达</span>';
		}
		if(miniDatas[t].pay_type == 'COD'){
			oPrdNoListState = oPrdNoListState + '<span class="smallLogo" style="background-color:#E703EC;margin: 1px;" title="货到付款订单">到付</span>';
		}
		miniDatas[t]['oPrdNoListState'] = oPrdNoListState;
		var oPrdNoMoreState = '<div class="btn_info" style="font-size:13px;cursor:pointer;line-height: 20px;color:#4F9FFF;cursor:pointer;" onClick="log(\''+miniDatas[t].new_tid+'\')"><i class="layui-icon" style="font-size:14px;">&#xe627;</i>操作日志</div>';
		if(flow.sysPlan != 'send' && flow.actiontd == true){
			oPrdNoMoreState = oPrdNoMoreState + '<div class="btn_info" style="font-size:13px;cursor:pointer;line-height: 20px;color:#4F9FFF;cursor:pointer;" onClick="modify(\''+t+'\')"><i class="layui-icon">&#xe642;</i>修改</div>';
		}
		if(flow.sysPlan == 'send'){
			oPrdNoMoreState = oPrdNoMoreState + '<div><a style="font-size:13px;cursor:pointer;line-height: 20px;color:#4F9FFF;cursor:pointer;" onClick="modifySllerMemo(\''+t+'\')"><i class="layui-icon">&#xe642;</i>改备注</a></div>';
		}
		if(miniDatas[t].order_type != 'DAIFA' && miniDatas[t].DROP_SHIPPING != 'T'){
			oPrdNoMoreState = oPrdNoMoreState + '<div class="btn_info" style="font-size:13px;cursor:pointer;line-height: 20px;color:#4F9FFF;cursor:pointer;" onClick="copyOrdersJudge(\''+miniDatas[t].new_tid+'\')"><i class="layui-icon">&#xe63c;</i>复制</div>';
		}
		if(flow.actiontd == true){
			oPrdNoMoreState = oPrdNoMoreState + '<div class="btn_info" style="font-size:13px;cursor:pointer;line-height: 20px;color:#4F9FFF;cursor:pointer;" onClick="doMore(\''+miniDatas[t].new_tid+'\',\''+t+'\')"><i class="layui-icon" style="font-size:14px;">&#xe63c;</i>更多操作</div>';
		}
		if(miniDatas[t].freePrints == 'T'){
			oPrdNoMoreState = oPrdNoMoreState + '<div class="btn_info" style="font-size:13px;cursor:pointer;line-height: 20px;color:#4F9FFF;cursor:pointer;" onClick="freePrints(\''+miniDatas[t].new_tid+'\')"><i class="layui-icon-warning" style="color: #1E9FFF;">&#xe617;</i>自由打印</div>';
		}
		if(flow.sysPlan == 'send'){
			oPrdNoMoreState = oPrdNoMoreState + '<div><a style="font-size:13px;cursor:pointer;line-height: 20px;color:#4F9FFF;cursor:pointer;" @click="detailsTids(\''+miniDatas[t].new_tid+'\',\''+t+'\')"><i class="layui-icon" style="font-size:12px;">&#xe647;</i>详情</a></div>';
		}
		miniDatas[t]['oPrdNoMoreState'] = oPrdNoMoreState;
		
		//地址
		var receiver_address_all = miniDatas[t].receiver_state +' '+ miniDatas[t].receiver_city +' '+ miniDatas[t].receiver_address;
		miniDatas[t]['receiver_address_all'] = receiver_address_all;
		
		//订单状态
		var refund_status_name = "<div style='font-size:12px;'>"+miniDatas[t]['send_status_name']+"</div>";
		if(miniDatas[t]['itemInfo']){
			for(var u=0;u<miniDatas[t]['itemInfo'].length;u++){
				if(miniDatas[t]['itemInfo'][u]['refund_status'] == "WAIT_SELLER_AGREE" || miniDatas[t]['itemInfo'][u]['refund_status'] == "SUCCESS"){
					refund_status_name = "<div style='color:red;font-size:12px;'>"+miniDatas[t]['itemInfo'][u]['refund_status_name']+"</div>";
				}
			}
		}
		var mark_status = "";
		if(miniDatas[t]['itemInfo']){
			for(var u=0;u<miniDatas[t]['itemInfo'].length;u++){
				if(miniDatas[t].mark_status == "LOCK"){
					mark_status = "<div style='color:red;font-size:12px;'>已锁定</div>";
				}
			}
		}
		miniDatas[t]['order_status_all'] = refund_status_name+"</br>"+mark_status;
		
		//买家联系人
		var receiver_name_all = "<a target='_blank' href='http://www.taobao.com/webww/ww.php?ver=3&touid="+miniDatas[t].buyer_nick+"&siteid=cntaobao&status=2&charset=utf-8' style='background: url(\"http://amos.alicdn.com/online.aw?v=2&uid="+miniDatas[t].buyer_nick+"&site=cntaobao&s=2&charset=utf-8\"); background-size: contain; background-repeat:no-repeat ;padding-left:16px;'><span>"+miniDatas[t].buyer_nick+"</span></a><br/>"+miniDatas[t].receiver_name +"<br/>"+miniDatas[t].receiver_mobile;
		miniDatas[t]['receiver_name_all'] = receiver_name_all;
		
		//仓库  发货时间
		var toTime_all = miniDatas[t].toTime +'</br>'+ miniDatas[t].wh_name;
		miniDatas[t]['toTime_all'] = toTime_all;
		
		//卖家
		var shopname_all = miniDatas[t].shopname +'</br>'+ miniDatas[t].seller_memo;
		miniDatas[t]['shopname_all'] = shopname_all;
		
		//状态
		var web_status_name_all = miniDatas[t].web_status_name +'</br><img src="'+miniDatas[t].seller_flag_pic+'" style="width:14px;height:14px;">';
		miniDatas[t]['web_status_name_all'] = web_status_name_all;
		
		//数量金额
		var payment_all = miniDatas[t].payment +'</br>'+ miniDatas[t].itemNum;
		miniDatas[t]['payment_all'] = payment_all;
		
		//物流
		var btnNameSpan = miniDatas[t].express_no?"修改":"录入"
		var express_no_all = miniDatas[t].express_no+"<a style='font-size:12px;cursor:pointer;' onclick='modifyExpressNo(\""+t+"\")'><i class='layui-icon'>&#xe642;</i><span>"+btnNameSpan+"</span></a>";
		miniDatas[t]['express_no_all'] = express_no_all;
		
		
		miniData[miniIndex] = miniDatas[t];
		miniIndex++;
	}
	return miniData;
}
/*function checkSelect(){
	if($("#layCollectGoods").val() != 0){
		var print_name = $("#layCollectGoods").val();
		$.ajax({
			url:'/?m=goods&c=otherOut&a=memory',
			dataType: 'json',
			type: "post",
			data:{
				print_name:print_name
			},
			success:function(data){
				
			}
		})
	}
}*/

function changeMon2(){
	layer.open({
		title :'选择商品',
		type: 2,
		shade: false,
		area: ['900px', '570px'],
		maxmin: false,
		content: '?m=widget&c=selectProduct&a=index&type=1&param=PRD2'
	}); 
}

function changeMon3(){
	layer.open({
		title :'选择商品',
		type: 2,
		shade: false,
		area: ['900px', '570px'],
		maxmin: false,
		content: '?m=widget&c=selectProduct&a=index&type=1&param=PRD3'
	}); 
}

function getSelectCount(){
	if(flow.isAll == 0){
		var tidCount = 0;
		var rows = grid1.getSelecteds();	
		for(var i=0;i<rows.length;i++)
		{
			tidCount++;	
		}
	
		$('#selectOrderNum').html(tidCount);
	}else{
		$('#selectOrderNum').html(flow.result_total);
	}
}

function startUpload(){
	$("#form2").ajaxSubmit({
		type:'POST',
		dataType:"json",
		success: function(data){
			var	serverObj = mini.decode(data);
			if(serverObj.code == "error"){
				layer.msg(serverObj.msg,{
					icon: 2,
					time: 2000
				});
			}else{
				$('#pages11-pic_path').val(serverObj.pic_name);
				layer.msg('上传成功',{
					icon: 1,
					time: 2000
				});
			}
		}
	});
}

function editUpload(){
	$("#form3").ajaxSubmit({
		type:'POST',
		dataType:"json",
		success: function(data){
			var	serverObj = mini.decode(data);
			if(serverObj.code == "error"){
				layer.msg(serverObj.msg,{
					icon: 2,
					time: 2000
				});
			}else{
				$('#pages98-pic_url').val(serverObj.pic_name);
				layer.msg('上传成功',{
					icon: 1,
					time: 2000
				});
			}
		}
	});
}

function setTime(){
	var time = $("#time").val();
	$.ajax({																				
		url: "/index.php?m=system&c=delivery&a=saveSetTime",										
		type: 'post',																		
		data: {time:time},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("设置成功",{
					icon: 1,
					time: 2000
				});
			}else{
				layer.msg("设置失败",{
					icon: 1,
					time: 2000
				});
			}			
		}																					
	});	
}

function setFalseSendTime(){
	var time = $("#setfalsetime").val();
	$.ajax({																				
		url: "/index.php?m=system&c=delivery&a=saveFalseSendTime",										
		type: 'post',																		
		data: {time:time},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("设置成功",{
					icon: 1,
					time: 2000
				});
				
			}else{
				layer.msg("设置失败",{
					icon: 1,
					time: 2000
				});
			}		
		}																					
	});	
}

function fastClear() {
    $("#form3")[0].reset();
    var timestamp = Date.parse(new Date());
    $("#pages98-newtimestramp").val(timestamp);
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