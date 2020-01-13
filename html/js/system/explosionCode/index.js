var tableList = new Vue({
	el: '#tableList',
	data: {
		onlySendWl:'no',
		onlySendShop:'no',
		printCQLable:'no',
		printDsosLable:'no',
		scanMessageSingle:'no',
		show:false,
		show2:false,
		order:{},
		item:[],
		yes:"是",
		no:"否",
		buyer_message:"",
		seller_memo:"",
		payment_time:"",
		unique_code:"",
		ONE_BOM:'',
		j:0,
		tid:"",
		express_type:"",
		express_name:"",
		unprintTplBq:"",  //已选择的电子面单模板id
		unprintname:"",   //已选择的打印机
		itemLength:0,
		first1:true,
		first2:true,
		expressArr:[],
		shopArrList:[],		//店铺列表
		picurl:'',
		successful:0,
		getTemplate:[],  //电子面单模板
		layprint:[],     //当前操作员打印机
		getTemplateCheck:[],  //质检标签模板
		getTemplateDsos: [],
		system_id:"",
		audioObj:[],		//语音播报对象
		verifyObj:[]		//已扫描的唯一码
	},
	mounted: function() {
		var self = this;
		$("#tid").focus();
		
		$.ajax({																				
			url: "/index.php?m=system&c=delivery&a=getExpress",
			type: 'post',																			
			data: {},																				
			dataType: 'json',
			async:false,
			success: function (data) {
				self.expressArr = data;
				$('.skin-minimal input').iCheck({
					checkboxClass: 'icheckbox_minimal',
					radioClass: 'iradio_minimal',
					increaseArea: '20%'
				});
			}	
		});
		
		//获取店铺
		$.ajax({																				
			url: "/index.php?m=system&c=labelPrinting&a=getShop",
			type: 'post',																			
			dataType: 'json',
			async:false,
			success: function (data) {
				self.shopArrList = data;
				$('.skin-minimal-shop input').iCheck({
					checkboxClass: 'icheckbox_minimal',
					radioClass: 'iradio_minimal',
					increaseArea: '20%'
				});
			}	
		});
		
		$.ajax({																				
			url: "/index.php?m=system&c=explosionCode&a=getCQConfig",
			type: 'post',																			
			data: {},																				
			dataType: 'json',
			async:false,
			success: function (data) {
				if(data.configValue == "yes"){
					self.printCQLable = "yes";
					$("#printCQLable").iCheck('check');
				}
				if(data.scanMessageSingle == "yes"){
					self.scanMessageSingle = "yes";
					$("#scanMessageSingle").iCheck('check');
				}
			}	
		});

		$.ajax({
			url: "/index.php?m=system&c=explosionCode&a=getDsosConfig",
			type: 'post',
			data: {},
			dataType: 'json',
			async:false,
			success: function (data) {
				if(data.configValue == "yes"){
					self.printDsosLable = "yes";
					$("#printDsosLable").iCheck('check');
				}
				if(data.scanMessageSingle == "yes"){
					self.scanMessageSingle = "yes";
					$("#scanMessageSingle").iCheck('check');
				}
			}
		});
		
		//日期选择器
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {
            var $ = layui.jquery, 
					element = layui.element, 
					layer = layui.layer ;
            var form = 	layui.form(),
						layer = layui.layer,
						layedit = layui.layedit,
						laydate = layui.laydate;
        });
	},
	methods: {
		shopHide:function(){
			var self = this;
			self.show = !self.show;
			var arr = [];
			var name = [];
			
			$('input[name="WlList"]').each(function(){
				$(this).on('ifChecked ifUnchecked', function(event){
					var newArr = [];
					var nameArr = [];
					if (event.type == 'ifChecked') {
						//console.log($("label").attr("for"))
						
						$('input[name="WlList"]').each(function(){
							if(true == $(this).is(':checked')){
								newArr.push($(this).prop("class"));
								nameArr.push($(this).val());
							}
							
						});
						arr = newArr;
						name = nameArr;		
					} else {
						$('input[name="WlList"]').each(function(){
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
					$("#onlySendWlList").val(a);
					$("#onlySendWlList").attr("name",b);
				});
			});
		},
		//店铺下拉
		shopOnly:function(){
			var self = this;
			self.show2 = !self.show2;
			var arr = [];
			var name = [];
			
			$('input[name="shopList"]').each(function(){
				$(this).on('ifChecked ifUnchecked', function(event){
					var newArr = [];
					var nameArr = [];
					if (event.type == 'ifChecked') {
						//console.log($("label").attr("for"))
						
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
					$("#onlyShopList").val(a);
					$("#onlyShopList").attr("name",b);
				});
			});
		},
		//查看大图
		lookBigImg:function(){
			layer.open({
				type: 1,
				title: '查看大图',
				skin: 'layui-layer-rim', //加上边框
				area: ['300px', '330px'], //宽高
				shade: 0.3,
				shade: 0,
				resize: false,
				content: $("#lookBigImg"),
				yes: function(index, layero){
					layer.close(index);
				}
			});
		},
		//当前操作员打印机设置
		userPrinterSetup:function(){
			$("#layprintTplBq").val("");
			$("#layprint").val("");
			var self = this;
			//打印模板
			$.ajax({
				url:'/?m=system&c=explosionCode&a=getTemplate',
				dataType: 'json',
				type: "post",
				data:{},
				success:function(data){
					self.getTemplate = data;
				}
			})
			//打印机
			doGetPrinters(function(data){
				self.layprint = data;
			});
			
			layer.open({
				type: 1,
				title: '当前操作员打印机设置',
				skin: 'layui-layer-rim', 
				area: ['500px', '300px'], 
				shade: 0.3,
				shade: 0,
				content: $("#userPrinterSetup"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var layprintTplBq = $("#layprintTplBq").val();
					//console.log(layprintTplBq);
					var layprint = $("#layprint").val();
					$.ajax({
						url:'/?m=system&c=explosionCode&a=getTplBqLayprint',
						dataType: 'json',
						type: "post",
						data:{
							layprintTplBq:layprintTplBq,
							layprint:layprint,
						},
						success:function(data){
							if(data.code == 'error'){
								layer.msg(data.msg);
							}else{
								layer.msg('绑定成功');
							}
						}
					});
				}
			});
		},
		/*checkPrinterSetup:function(){
			//质检标签打印模板
			var self = this;
			$.ajax({
				url:'/?m=system&c=explosionCode&a=getTemplateCheck',
				dataType: 'json',
				type: "post",
				data:{},
				success:function(data){
					self.getTemplateCheck = data;
				}
			})
			//打印机
			doGetPrinters(function(data){
				self.layprint = data;
			});
			
			layer.open({
				type: 1,
				title: '质检标签打印机设置',
				skin: 'layui-layer-rim', 
				area: ['500px', '300px'], 
				shade: 0.3,
				shade: 0,
				content: $("#checkPrinterSetup"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var layprintTplBq = $("#layprintTplBqCheck").val();
					//console.log(layprintTplBq);
					var layprint = $("#layprintCheck").val();
					$.ajax({
						url:'/?m=system&c=explosionCode&a=checkTplBqLayprint',
						dataType: 'json',
						type: "post",
						data:{
							layprintTplBq:layprintTplBq,
							layprint:layprint,
						},
						success:function(data){
							if(data.code == 'error'){
								layer.msg(data.msg);
							}else{
								layer.msg('绑定成功');
							}
						}
					});
				}
			});
		},*/

		dsosPrinterSetup:function(){
			//发货清单打印模板
			var self = this;
			$.ajax({
				url:'/?m=system&c=explosionCode&a=getTemplateDsos',
				dataType: 'json',
				type: "post",
				data:{},
				success:function(data){
					self.getTemplateDsos = data;
				}
			})
			//打印机
			doGetPrinters(function(data){
				self.layprint = data;
			});
			layer.open({
				type: 1,
				title: '发货清单打印机设置',
				skin: 'layui-layer-rim',
				area: ['500px', '300px'],
				shade: 0.3,
				shade: 0,
				content: $("#dsosPrinterSetup"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var layprintTplBq = $("#layprintTplBqDsos").val();
					//console.log(layprintTplBq);
					var layprint = $("#layprintDsos").val();
					$.ajax({
						url:'/?m=system&c=explosionCode&a=dsosTplBqLayprint',
						dataType: 'json',
						type: "post",
						data:{
							layprintTplBq:layprintTplBq,
							layprint:layprint,
						},
						success:function(data){
							if(data.code == 'error'){
								layer.msg(data.msg);
							}else{
								layer.msg('发货清单打印机绑定成功');
								layer.close(index);
							}
						}
					});
				}
			});
		},
		clearValue:function(){
			var self = this;
			var e = event || window.event;
			e.stopPropagation();
			self.show = false;
			$('input[name="WlList"]').each(function(){
				$(this).iCheck('uncheck');
			});
			$("#onlySendWlList").val("");
			$("#onlySendWlList").attr("name","");
		},
		clearShopValue:function(){
			var self = this;
			var e = event || window.event;
			e.stopPropagation();
			self.show2 = false;
			$('input[name="shopList"]').each(function(){
				$(this).iCheck('uncheck');
			});
			$("#onlyShopList").val("");
			$("#onlyShopList").attr("name","");
		},
		//-----------唯一码查询订单开始------------//
		getTid:function(index){
			var self = this;
			
			//打印机
			doGetPrinters(function(data){
				self.layprint = data;
			});
			
			if(event.keyCode == 13){
				//if(index == '1'){
					var unique_code = $("#tid").val();
					$("#tid").attr("disabled",true);
					var res = 0;
					$.ajax({
						url:'/?m=system&c=explosionCode&a=getTidInfo',
						dataType: 'json',
						async:false,
						type: "post",
						data:{
							prd_no:unique_code,
						},
						success:function(data){
							if(data.code == 'ok'){
								unique_code = data.unique_code;
							}
						}
					});
					/**仓库唯一码start*/
					/*$.ajax({
						url:'/?m=system&c=explosionCode&a=getSerialNo',
						dataType: 'json',
						async:false,
						type: "post",
						data:{
							unique_code:unique_code,
						},
						success:function(data){
							if(data.code == 'y'){
								$.ajax({
									url:'/?m=system&c=explosionCode&a=getSerialNoPrdSkuId',
									dataType: 'json',
									async:false,
									type: "post",
									data:{
										serial_no:unique_code,
									},
									success:function(data){
										if(data.code == 'ok'){
											$.ajax({
												url:'/?m=system&c=explosionCode&a=getNewTid',
												dataType: 'json',
												async:false,
												type: "post",
												data:{
													prd_sku_id:data.prd_sku_id,
												},
												success:function(data){
													if(data.code == 'ok'){
														unique_code = data.unique_code;
													}
												}
											});
										}
									}
								});
							}
						}
					});*/
					/**仓库唯一码end*/
				/*}else{
					var unique_code = '';
					var prd_no = $("#prd_no").val();
					var res = 0;
					$.ajax({
						url:'/?m=system&c=explosionCode&a=getTidInfo',
						dataType: 'json',
						async:false,
						type: "post",
						data:{
							prd_no:prd_no,
						},
						success:function(data){
							if(data.code == 'ok'){
								unique_code = data.unique_code;
								$("#prd_no").attr("disabled",true);
							}else{
								res = 1;
							}
						}
					});
				}*/
				/*if(res == 1){
					layer.msg('未找到订单',{
						icon: 0,
						time: 2000
					});
					$("#prd_no").focus();
					$("#prd_no").val('');
					var concatText = '未找到订单';
					tableList.audioObj = speckText(concatText);
					return false;
				}*/
				if(tableList.audioObj != ""){
					tableList.audioObj.pause();
				}
				$("#codeImg").css("display","block");
				$("#codeImgHtml").html("");
				if(tableList.successful == 0){
					tableList.item = [];
					tableList.successful = 1;
				}
				
				var gridItem = self.item;
				self.unique_code = unique_code;
				$("#tid").val("");
				var onlySendWlList = ',' + $("#onlySendWlList").attr("name") + ',';
				var onlySendWlListName = $("#onlySendWlList").val();
				var onlySendWl = self.onlySendWl;
				
				var onlyShopList = ',' + $("#onlyShopList").attr("name") + ',';
				var onlyShopListName = $("#onlyShopList").val();
				var onlySendShop = self.onlySendShop;
				
				if($("#refundCheck").is(":checked")){
					var refundCheck = 'T';
				}else{
					var refundCheck = '';
				}
				
				//if(gridItem.length == 0){
					self.order = [];
					$.ajax({	
						url: "/index.php?m=system&c=explosionCode&a=getData",		
						type: 'post',
						data: {unique_code: unique_code, refundCheck: refundCheck},
						dataType: 'json',
						success: function (data) {
							//if(index == 1){
								$("#tid").attr("disabled",false);
								$("#tid").focus();
							/*}else{
								$("#prd_no").attr("disabled",false);
								$("#prd_no").focus();
							}*/
							
							if(data.code == 'error'){
								var layer = layui.layer;
								layer.msg(data.msg,{
									icon: 0,
									time: 2000
								});
								var errorMsg = data.msg;
								tableList.audioObj = speckText(errorMsg);
								return;
							}
							if(data.order[0].items_num != '1'){
								var layer = layui.layer;
									layer.msg('订单不是单款单件',{
										icon: 0,
										time: 2000
									});
								return;
							}
							if(data.imgurl){
								$("#codeImg").attr("src",data.imgurl);
								$("#codeImgHtml").html(data.imgInfo);
							}
							if(data.system_id){
								self.system_id = data.system_id;
							}
							self.ONE_BOM = data.ONE_BOM;

							if(data && data.code == 'return'){
								layui.use('layer', function(){
								  var layer = layui.layer;
									layer.msg(data.msg,{
										icon: 0,
										time: 2000
									});
								});
								tableList.audioObj = speckText(data.msg);
								return;
							}
							
							if(onlySendWl == 'yes' && onlySendWlList.indexOf(',' + data.order[0].type.replace('DF_','')+ '|' + data.order[0].express_form + ',') == -1){
								if(data.order[0] && data.order[0].new_tid){
									uniqueLog(data.order[0].new_tid,unique_code,'onlySendWl',prd_no);
								}
								
								layui.use('layer', function(){
								  var layer = layui.layer;
									layer.msg("设置只发"+onlySendWlListName+"订单，此单为"+ data.order[0].express_name +"禁止发货",{
										icon: 0,
										time: 2000
									});
								});
								tableList.audioObj = speckText("不是发货物流");
								return false;
							}
							
							console.log(onlyShopList);
							if(onlySendShop == 'yes' && onlyShopList.indexOf(',' + data.order[0].shopid + ',') == -1){
								if(data.order[0] && data.order[0].new_tid){
									uniqueLog(data.order[0].new_tid,unique_code,'onlySendShop',prd_no);
								}
								layui.use('layer', function(){
								  var layer = layui.layer;
									layer.msg("设置只发"+onlyShopListName+"订单，此单为"+ data.order[0].shopname +"禁止发货",{
										icon: 0,
										time: 2000
									});
								});
								tableList.audioObj = speckText("不是发货店铺");
								return false;
							}
							
							if(data && data.code && (data.code == 'error' || data.code == 'sended'))
							{
								if(data.order[0] && data.order[0].new_tid){
									uniqueLog(data.order[0].new_tid,unique_code,'error',prd_no);
								}
								
								layui.use('layer', function(){
								  var layer = layui.layer;
									layer.msg(data.msg,{
										icon: 0,
										time: 2000
									});
								});	
								self.item = [];
								
								tableList.audioObj = speckText(data.msg);
								if(data.code == 'error')
								{
									tableList.resetAll();	
									return
								}
							}
							if(data.order != 0){
								var a = 0;
								var layOnOff = 0;
								self.express_type =  data.order[0].express_type;
								self.express_name =  data.order[0].express_name;
								$.ajax({								
									url: "/index.php?m=system&c=explosionCode&a=getDef",
									type: 'post',							
									data: {express_type: (self.express_type).replace('DF_','')},
									async:false,
									dataType: 'json',				
									success: function (data) {
										if(data.print == "" || data.print == null){
											a = 1;
										}
										if(data.id =="" || data.id == null){
											a = 2;
										}
										self.unprintTplBq = data.id;
										self.unprintname = data.print;
										var layprintList = tableList.layprint;
										
										for(var i=0;i<layprintList.length;i++){
											if(layprintList[i]['name'] == data.print){
												$("#layprint").val(data.print);
												layOnOff = 1;
											}
										}
									}													
								});
								
								if(layOnOff == 0){
									alert('当前快递单打印机不存在');
									return false;
								}
								
								if(a == 1){
									printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
									return false;
								}else if(a == 2){
									printerPrompt("未设置默认打印模板","电子面单设计","index.php?m=print&c=dzmdDesign&a=index");
									return false;
								}
								
								self.itemLength = data.item.length;
								if(data.item.length == 0){
									$("#btn2").addClass("layui-btn-disabled");
									$("#btn3").addClass("layui-btn-disabled");
								}else{
									$("#btn2").removeClass("layui-btn-disabled");
									$("#btn3").removeClass("layui-btn-disabled");
								}
								
								var j = 0;
								self.j = j;
								var tid = data.order[0].new_tid;
								var send_status = data.order[0].send_status;
								
								var refund_status = "";
								for(var i = 0; i<data.item.length; i++){
									if(data.item[i]['unique_code'] == unique_code || data.item[i]['serial_no'] == unique_code){
										refund_status = data.item[i]['refund_status'];
									}
								}
								
								self.order = data.order[0];
								
								self.buyer_message = data.order[0].buyer_message;
								self.seller_memo = data.order[0].seller_memo;
								self.express_type =  data.order[0].express_type;
								self.express_name =  data.order[0].express_name;
								self.payment_time = data.order[0].payment_time;
								
								if(self.itemLength == 1 && send_status != "WAIT_SENDED"){
									sound_play('danjian');
								}

								var item = data.item;
								/*if(self.scanMessageSingle == 'yes' && self.itemLength == 1 && send_status != "WAIT_SENDED" || scanSendSingleCheck == "on")//单品验货开启 或单件有备注验货 先读备注
								{
									if($("#readNote").is(":checked")){
										if($("#readNoteBig").is(":checked")){
											tableList.audioObj = speckText(numReplaceSound(self.buyer_message + self.seller_memo));	
										}else{
											tableList.audioObj = speckText(self.buyer_message + self.seller_memo);
										}
									}else{
										tableList.audioObj = speckText("有备注 请确认");
									}
								}*/
								var sendMark = "T";
								/*alert(scanSendSingleCheck);
								if(scanSendSingleCheck == "on"){//单品验货
									sendMark = "F";
								}else if(self.scanMessageSingle == 'yes' && self.itemLength == 1 && (self.seller_memo != '' || self.buyer_message != '')){
									sendMark = "F";	
								}
								else if(refund_status != "WAIT_SELLER_AGREE"){*/
									for(var i = 0; i<item.length; i++){
										if(item[i]['unique_code'] == unique_code || item[i]['serial_no'] == unique_code){
											if(item[i]['serial_no'])//库存唯一码扫描校验
											{
												$.ajax({			
													url: "/index.php?m=system&c=explosionCode&a=setSerialNoCheckOut",	
													type: 'post',
													data: {new_tid: tid,serial_no:unique_code,items_id:item[i].items_id},
													dataType: 'json',
													async: false,
													success: function (data) {	
														if(data.code != 'ok')
														{
															uniqueMark = 'F';	
															layui.use('layer', function(){
															  var layer = layui.layer;
																layer.msg(data.msg,{
																	icon: 0,
																	time: 2000
																});
															});
															tableList.audioObj = speckText(data.msg);	
														}
														else
														{
															uniqueMark = 'T';
															if(item[i]['scanStatus'] == "未扫描"){
																//printCQlabel(unique_code);//打印质检标签
															}
															item[i]['scanStatus'] = "已扫描";
														}
													},
													error:function(){
														layui.use('layer', function(){
															  var layer = layui.layer;
																layer.msg('未通过，请重新扫描',{
																	icon: 0,
																	time: 2000
																});
															});
															tableList.audioObj = speckText('未通过，请重新扫描');	
													}
												})
											}
											else
											{
												if(item[i]['scanStatus'] == "未扫描"){
													//printCQlabel(unique_code);//打印质检标签
												}
												item[i]['scanStatus'] = "已扫描";	
											}
										}
										/*if(item[i]['scanStatus'] == "未扫描"){
											alert(7979797977);
											sendMark = "F";
											j++;
											self.j = j;
										}*/
									}
								//}
								
								self.item = item;
								self.tid = tid;
								$("#tid").val('');
								if(data && data.code && data.code == 'error')
								{
									return;
								}
								
								if(refund_status == "WAIT_SELLER_AGREE" && send_status != "WAIT_SENDED"){
									tableList.audioObj = speckText("申请退款货品");
									uniqueLog(tid,unique_code,'refund',prd_no);
								}else{
									if(send_status == "WAIT_SENDED"){
										layui.use('layer', function(){
										  var layer = layui.layer;
											layer.msg("订单已发货",{
												icon: 0,
												time: 2000
											});
										}); 
										self.express_type =  data.order[0].express_type;
										self.express_name =  data.order[0].express_name;
										
										$("#btn2").addClass("layui-btn-disabled");
										$("#btn3").addClass("layui-btn-disabled");
									}else{
										if(sendMark == "T"){
											tableList.sendOrder(tid,'normal');
										}
										uniqueLog(tid,unique_code,'success',prd_no);
										layui.use('layer', function(){
										  var layer = layui.layer;
											layer.msg("通过",{
												icon: 1,
												time: 2000
											});
										}); 
										
										/*if(j != 0){
											var concatText = '';
									
											if($("#readNote").is(":checked")){
												if($("#readNoteBig").is(":checked")){
													concatText = numReplaceSound(self.buyer_message + self.seller_memo);	
												}else{
													concatText = self.buyer_message + self.seller_memo;
												}
											}else{
												concatText = "有备注 请确认";
											}
											concatText = "通过"+concatText+"剩余" + j + "货品未扫描";
											tableList.audioObj = speckText(concatText);
										}*/	
									}
								}
							}else{
								if(data.code != 'error')
								{
									layui.use('layer', function(){
									  var layer = layui.layer;
										layer.msg("查找不到订单",{
											icon: 0,
											time: 2000
										});
									});

									tableList.audioObj = speckText("查找不到订单");
									$("#btn2").addClass("layui-btn-disabled");
									$("#btn3").addClass("layui-btn-disabled");
								}else{
									if(sendMark == "T"){
										tableList.sendOrder(tid,'normal');
									}
									layui.use('layer', function(){
									  var layer = layui.layer;
										layer.msg("通过",{
											icon: 1,
											time: 2000
										});
									}); 
									
									
									/*if(j != 0){
										var concatText = '';
									
										if($("#readNote").is(":checked")){
											if($("#readNoteBig").is(":checked")){
												concatText = numReplaceSound(self.buyer_message + self.seller_memo);	
											}else{
												concatText = self.buyer_message + self.seller_memo;
											}
										}else{
											concatText = "有备注 请确认";
										}
										concatText = "通过"+concatText+"剩余" + j + "货品未扫描";
										tableList.audioObj = speckText(concatText);
									}*/
										
									tableList.audioObj = speckText("查找不到订单");

								}
								tableList.resetAll();	
								self.item = [];
								$("#tid").val("");
							}
						},error: function (jqXHR, textStatus, errorThrown) {
							//if(index == 1){
								$("#tid").attr("disabled",false);
								$("#tid").focus();
							/*}else{
								$("#prd_no").attr("disabled",false);
								$("#prd_no").focus();
							}*/
						}
					});
				/*}else{
					var uniqueMark = 'F';
					var sendMark = 'T';
					var refundMark = 'F';
					var j = 0;
					self.j = j;
					var prd_sku_id = '';
					if(self.ONE_BOM == 'T')//一单一套装
					{
						$.ajax({																			
							url: "/index.php?m=system&c=explosionCode&a=getSerialNoPrdSkuId",	
							type: 'post',
							data: {serial_no:unique_code},
							dataType: 'json',
							async: false,
							success: function (data) {	
								if(data.code != 'ok')
								{
									uniqueMark = 'F';	
									layui.use('layer', function(){
									  var layer = layui.layer;
										layer.msg(data.msg,{
											icon: 0,
											time: 2000
										});
									});
									tableList.audioObj = speckText(data.msg);	
								}
								else
								{
									prd_sku_id = data.prd_sku_id;
								}
							},
							error: function()
							{
								return;
							}
						})	
					}
					for(var i in gridItem){
						if(gridItem[i]['unique_code'] == unique_code || gridItem[i]['serial_no'] == unique_code || self.ONE_BOM == 'T'){
							if(gridItem[i]['refund_status'] == 'WAIT_SELLER_AGREE'){
								refundMark = 'T';
								sendMark = 'F';
							}else{
								if(gridItem[i]['serial_no'] || self.ONE_BOM == 'T')//库存唯一码扫描校验
								{
									if(self.ONE_BOM == 'T')//一单一套装
									{
										
										if(gridItem[i]['prd_sku_id'] == prd_sku_id && gridItem[i]['scanStatus'] == "未扫描")
										{
											gridItem[i]['serial_no'] = unique_code;
										}
										else if(gridItem[i]['serial_no'] && gridItem[i]['serial_no'] == unique_code)
										{
											uniqueMark = 'F';
											if(index == 1){
												$("#tid").attr("disabled",false);
												$("#tid").focus();
											}else{
												$("#prd_no").attr("disabled",false);
												$("#prd_no").focus();
											}
											layui.use('layer', function(){
											var layer = layui.layer;
												layer.msg("通过",{
													icon: 1,
													time: 2000
												});
											}); 
											speckText("通过");
											return false;
										}
										else
										{
											uniqueMark = 'F';
											continue;
										}
									}

									$.ajax({																			
										url: "/index.php?m=system&c=explosionCode&a=setSerialNoCheckOut",	
										type: 'post',
										data: {new_tid: self.tid,serial_no:unique_code,items_id:gridItem[i].items_id},
										dataType: 'json',
										async: false,
										success: function (data) {	
											if(data.code != 'ok')
											{
												uniqueMark = 'F';	
												layui.use('layer', function(){
												  var layer = layui.layer;
													layer.msg(data.msg,{
														icon: 0,
														time: 2000
													});
												});
												tableList.audioObj = speckText(data.msg);	
											}
											else
											{
												uniqueMark = 'T';
												if(gridItem[i]['scanStatus'] == "未扫描"){
													//printCQlabel(unique_code);//打印质检标签
												}
												gridItem[i]['scanStatus'] = "已扫描";	
											}
										}
									})
									if(uniqueMark != 'T')
									{
										if(index == 1){
											$("#tid").attr("disabled",false);
											$("#tid").focus();
										}else{
											$("#prd_no").attr("disabled",false);
											$("#prd_no").focus();
										}
										return false;
									}
								}
								else
								{
									if(gridItem[i]['scanStatus'] == "未扫描"){
										//printCQlabel(unique_code);//打印质检标签
									}
									gridItem[i]['scanStatus'] = "已扫描";
								}
							}
							uniqueMark = 'T';
						}
						if(gridItem[i]['scanStatus'] == "未扫描"){
							sendMark = 'F';
							j++;
							self.j = j;
						}
					}
					
					if(index == 1){
						$("#tid").attr("disabled",false);
						$("#tid").focus();
					}else{
						$("#prd_no").attr("disabled",false);
						$("#prd_no").focus();
					}
					if(uniqueMark == 'F'){
						
						layui.use('layer', function(){
						  var layer = layui.layer;
							layer.msg("此货品不在订单范围之内，请重新扫描货品",{
								icon: 0,
								time: 2000
							});
						});
						tableList.audioObj = speckText("此货品不在订单范围之内，请重新扫描货品");
						uniqueLog(self.tid,unique_code,'error',prd_no);
						return false;
					}
					
					self.item = gridItem;
					
					if(sendMark == "T"){
						tableList.sendOrder(self.tid,'normal');
					}
					
					if(refundMark == 'T'){
						tableList.audioObj = speckText("申请退款货品");
						uniqueLog(self.tid,unique_code,'refund',prd_no);
						}else{
						uniqueLog(self.tid,unique_code,'success',prd_no);
						
						layui.use('layer', function(){
						  var layer = layui.layer;
							layer.msg("通过",{
								icon: 1,
								time: 2000
							});
						}); 
						
						
						if(j != 0){
							speckText("通过");
							setTimeout(function(){
								tableList.audioObj = speckText("剩余" + j + "货品未扫描");
							},1000);
						}
					}
				}*/
            }
		},
		//-----------唯一码查询订单结束------------//
		
		//-----------重置开始------------//
		resetAll:function(){
			var self = this;
			self.order = [];
			self.item = [];
			self.buyer_message = '';
			self.seller_memo = '';
			$("#tid").val('');
			self.unique_code = "";
			self.system_id = "";
		},
		//-----------重置开始------------//
		CQlabelFill:function(){
			var self = this;
			var unique_code = self.unique_code;
			if(unique_code == ""){
				layer.msg("请先扫描一个唯一码",{
					icon: 1,
					time: 2000
				});

				return false;
			}
			
			//printCQlabel(unique_code);//打印质检标签
		},
		//-----------发货开始------------//
		sendOrder:function(tid,type){
			var self = this;
			var onlySendWlList = ',' + $("#onlySendWlList").attr("name") + ',';
			var onlySendWlListName = $("#onlySendWlList").val();
			var onlySendWl = self.onlySendWl;
			var express_type = self.express_type;
			var express_name = self.express_name;
			var unique_codes = self.unique_codes;
			
			$.ajax({																			
				url: "/index.php?m=system&c=explosionCode&a=sendOrder",	
				type: 'post',
				data: {tid: tid, type: type, system_id: self.system_id},
				dataType: 'json',
				success: function (data) {
						if(data){
							if(data.code == "ok"){
								layui.use('layer', function(){
								  var layer = layui.layer;
									layer.msg(data.msg,{
										icon: 1,
										time: 2000
									});
								});
								
								layui.use('layer', function(){
								var layer = layui.layer;
									layer.msg("发货成功",{
										icon: 1,
										time: 2000
									});
								}); 
								/*if(self.itemLength == 1){
									sound_play('danjian');
									setTimeout(function(){
										speckText("请打包" + self.buyer_message + self.seller_memo);
									},500)
								}else{
									speckText("请打包" + self.buyer_message + self.seller_memo);
								}*/
								
								/*if($("#readNote").is(":checked")){
									if($("#readNoteBig").is(":checked")){
										tableList.audioObj = speckText("请打包" + numReplaceSound(self.buyer_message + self.seller_memo));
									}else{
										tableList.audioObj = speckText("请打包" + self.buyer_message + self.seller_memo);
									}
								}else{
									tableList.audioObj = speckText("请打包 有备注");
								}*/
								
								$("#btn2").addClass("layui-btn-disabled");
								$("#btn3").addClass("layui-btn-disabled");
								miandan(self,"false");

								var printDsosLable = tableList.printDsosLable;
								if(printDsosLable == "yes") {
									autoPrintDataDSOS(self, "1");
								}
								
							}else if(data.code == "error"){
								layui.use('layer', function(){
								  var layer = layui.layer;
									layer.msg("发货失败【" + data.msg + "】",{
										icon: 2,
										time: 2000
									});
								}); 
								
								$.ajax({							
									url: "/index.php?m=system&c=explosionCode&a=changeMark",
									type: 'post',
									data: {unique_code: self.unique_code, system_id: self.system_id},
									dataType: 'json',
									success: function (data) {
										
									}												
								});
								speckText("发货失败");
							}
							
							self.unique_code = "";
						}
					}				
				});
		},
		
		//-----------拆单发货------------//
		splitOrder:function(){
			var btnClass = $("#btn3").attr('class');
			if(btnClass.indexOf('layui-btn-disabled') != -1){//按钮只读
				return false;
			}
			
			$("#btn3").attr("disabled",true);
			$("#btn3").addClass("layui-btn-disabled");
			/*setTimeout(function(){
				$("#btn3").attr("disabled",false);
			},1000);*/
			
			var self = this;
			var onlySendWlList = ',' + $("#onlySendWlList").attr("name") + ',';
			var onlySendWlListName = $("#onlySendWlList").val();
			var onlySendWl = self.onlySendWl;
			var express_type = self.express_type;
			var express_name = self.express_name;
			
			if(onlySendWl == 'yes' && onlySendWlList.indexOf(',' + self.order.type.replace('DF_','')+ '|' + self.order.express_form  + ',') == -1){
				
				layui.use('layer', function(){
				  var layer = layui.layer;
					layer.msg("设置只发"+onlySendWlListName+"订单，此单为"+ express_name +"禁止发货",{
						icon: 0,
						time: 2000
					});
				});
				tableList.audioObj = speckText("不是发货物流");
				$("#btn3").attr("disabled",false);
				$("#btn3").removeClass("layui-btn-disabled");
				return false;
			}
			
			
			var tid = self.tid;
			var item = self.item;
			if(self.itemLength == 0){
				layui.use('layer', function(){
				    var layer = layui.layer;
					layer.msg("没有可以拆分的货品",{
						icon: 2,
						time: 2000
					});
				});
				$("#btn3").attr("disabled",false);
				$("#btn3").removeClass("layui-btn-disabled");
				return false;
			}
			
			var unique_codes = '';
			var isSplit1 = 'F';
			var isSplit2 = 'F';
			for(var i in item){
				var unique_code = item[i].unique_code;
				var scanStatus = item[i].scanStatus;
				if(scanStatus == "未扫描"){
					isSplit1 = 'T';
					unique_codes += unique_code + ',';
				}else if(scanStatus == "已扫描"){
					isSplit2 = 'T';
				}
			}
			
			if(isSplit1 == "T" && isSplit2 == "T"){
				execAjax({
					m:'system',
					c:'explosionCode',
					a:'splitOrder',
					data:{unique_codes: unique_codes, tid: tid, system_id: self.system_id},
					success:function(data){
						$("#btn3").attr("disabled",false);
						$("#btn3").removeClass("layui-btn-disabled");
						if(data.code == "ok"){
							tableList.sendOrder(tid,'split');
							
							var new_item = [];
							for(var i in item){
								var scanStatus = item[i].scanStatus;
								if(scanStatus == "已扫描"){
									new_item.push(item[i]);
								}
							}
							
							self.item = new_item;
						}else if(data.code == "error"){
							layui.use('layer', function(){
								var layer = layui.layer;
								layer.msg("拆分失败：" + data.msg,{
									icon: 2,
									time: 2000
								});
							});
						}
					}
				});
			}else{
				layui.use('layer', function(){
				    var layer = layui.layer;
					layer.msg("没有可以拆分的货品",{
						icon: 2,
						time: 2000
					});
				});
				$("#btn3").attr("disabled",false);
				$("#btn3").removeClass("layui-btn-disabled");
				return false;
			}
			
		},
		//-----------发货结束------------//
		//强制补打快递单-------------------------------------------
		print1Judge:function(){
			var self = this;
			miandan(self,"false");
			$("#btn1").attr("disabled",true);
			setTimeout(function() {
				$("#btn1").attr("disabled",false);
			}, 2000);			
			$("#tid").focus();
		},
		print1:function(){
			$("#btn1").attr("disabled",true);
			setTimeout(function(){
				$("#btn1").attr("disabled",false);
			},1000);
			var self = this;
			var onlySendWlList = ',' + $("#onlySendWlList").attr("name") + ',';
			var onlySendWlListName = $("#onlySendWlList").val();
			var onlySendWl = self.onlySendWl;
			var express_type = self.express_type;
			var express_name = self.express_name;
			
			var btnClass = $("#btn1").attr('class');
			if(btnClass.indexOf('layui-btn-disabled') != -1){//按钮只读
				return false;
			}
			
			if(onlySendWl == 'yes' && onlySendWlList.indexOf(',' + self.order.type.replace('DF_','')+ '|' + self.order.express_form + ',') == -1){
				
				layui.use('layer', function(){
				  var layer = layui.layer;
					layer.msg("设置只发"+onlySendWlListName+"订单，此单为"+ express_name +"禁止发货",{
						icon: 0,
						time: 2000
					});
				});
				tableList.audioObj = speckText("不是发货物流");
				return false;
			}
			
			if(self.tid == ""){
				layui.use('layer', function(){
				    var layer = layui.layer;
					layer.msg("请先扫描一个订单",{
						icon: 2,
						time: 2000
					});
				});
				return false;
			}
			
			if(self.itemLength != 0 && typeof(self.itemLength) != "undefined"){
				layui.use('layer', function(){
				    var layer = layui.layer;
					layer.msg("只有已发货订单才可执行此操作",{
						icon: 2,
						time: 2000
					});
				});
				return false;
			}
			miandan(self,"true");
		},
		print2:function(){
			$("#btn2").attr("disabled",true);
			setTimeout(function(){
				$("#btn2").attr("disabled",false);
			},1000);
			
			var self = this;
			var onlySendWlList = ',' + $("#onlySendWlList").attr("name") + ',';
			var onlySendWlListName = $("#onlySendWlList").val();
			var onlySendWl = self.onlySendWl;
			var express_type = self.express_type;
			var express_name = self.express_name;
			
			if(onlySendWl == 'yes' && onlySendWlList.indexOf(',' + self.order.type.replace('DF_','')+ '|' + self.order.express_form + ',') == -1){
				
				layui.use('layer', function(){
				  var layer = layui.layer;
					layer.msg("设置只发"+onlySendWlListName+"订单，此单为"+ express_name +"禁止发货",{
						icon: 0,
						time: 2000
					});
				});
				tableList.audioObj = speckText("不是发货物流");
				return false;
			}
			
			var btnClass = $("#btn2").attr('class');
			if(btnClass.indexOf('layui-btn-disabled') != -1){//按钮只读
				return false;
			}
			
			if(self.itemLength != 0){
				tableList.sendOrder(self.tid,'force');
			}else if(self.itemLength == 0){
				layui.use('layer', function(){
				    var layer = layui.layer;
					layer.msg("已发货订单无法执行此操作",{
						icon: 2,
						time: 2000
					});
				});
				return false;
			}
			
		},
		imgSmall:function( data ){
			$('.'+data).parent().find(".imgBig").css("display","block");
		},
		imgBig:function(){
			$(".imgBig").css("display","none");
		}
	}																			
});

$(document).ready(function(){
	$(document).keydown(function(event){
		if(event.keyCode == 120){
			tableList.resetAll();
		}else if(event.keyCode == 119){
			if(tableList.first1 == true){
				tableList.splitOrder();
				tableList.first1 = false;
			}
			setTimeout(function(){
				tableList.first1 = true;
			},1000);
			
		}else if(event.keyCode == 121){
			if(tableList.first2 == true){
				tableList.print1();
				tableList.first2 = false;
			}
			setTimeout(function(){
				tableList.first2 = true;
			},1000);
			
		}else if(event.keyCode==13){
			var id=$("input:focus").attr("id"); 
			if(id == undefined || (id != 'tid'))
			{
				setTimeout(function(){
					var id=$("input:focus").attr("id");
					if(id == undefined || (id != 'tid'))
					{
						//$('#tid').focus();	
					}
				},1000);
			}
		}
	})
})

function autoPrintDataDSOS(self, printInputDSOS) {
	// 获取打印需要的模板ID,以及模板名字
	$.ajax({
		url: "/index.php?m=system&c=explosionCode&a=getUserSavedDsosTemplate",
		type: 'get',
		data: {},
		dataType: 'json',
		success: function (data) {
			if(data){
				console.log(data);
				printDataDSOS(self, printInputDSOS,data.id,data.tpl_name);

			}
		}
	});
}
function printDataDSOS(self, printInputDSOS,unprintTplDSOS,unprintname) {
	var data ={data: self.tid, printInputDSOS: "1", isAll: 0, DROP_SHIPPING: "F", shippingId: ""}
	$.ajax({
		url: "/index.php?m=system&c=delivery&a=printDataDSOS",
		type: 'post',
		data: data,
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

						console.log("777777777777777777");
						console.log(unprintTplDSOS);
						console.log(unprintname);
						console.log(printData);
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
}
function miandan(self,force){
	//console.log(self.unprintTplBq);
	$.ajax({														
		url: "/index.php?m=system&c=explosionCode&a=printNow",			
		type: 'post',															
		data: {data: self.tid, type: self.express_type, force: force, system_id: self.system_id, printTpl: self.unprintTplBq},
		dataType: 'json',
		success: function (data) {
			if(data.dates && data.dates[0] != ""){
				var newData = [];												
				var num = 0;
				doGetPrinters(function(){
					newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
					printTpl[self.unprintTplBq](self.unprintname,newData);
				});
				tableList.successful = 0;
			}else{
				if(data.code == "error"){
					layer.msg(data.msg,{
						icon: 2,
						time: 2000
					});
				}else{
					layer.msg('订单已打印',{
						icon: 2,
						time: 2000
					});
				}
			}
		}																
	});		
}

function sound_play(names){    
    soundList = names.split(',');
	nowSoundIndex = 0;
	sound_play_do(soundList[nowSoundIndex]);
}
function sound_play_do(name)
{
	if(name.indexOf('http') != -1)
	{
		$("#sound").html("<audio id='audio' autoplay='autoplay'><source src="+name+"><source src="+name+" type='audio/mpeg' ></audio>");	
	}
	else
	{
		$("#sound").html("<audio id='audio' autoplay='autoplay'><source src='sound/"+name+".wav' type='audio/wav' ><source src='sound/"+name+".mp3' type='audio/mpeg' ></audio>");	
	}
	
	var audio = document.getElementById("audio"); 
	audio.loop = false;
	audio.addEventListener('ended', function () {
		nowSoundIndex++;  
		if(nowSoundIndex<soundList.length)
		{
			sound_play_do(soundList[nowSoundIndex]);
		}
	}, false);	
}

function uniqueLog(tid,code,status,prd_no){
	var system_id = tableList.system_id;
	$.ajax({																			
		url: "/index.php?m=system&c=explosionCode&a=checkItemsLog",
		type: 'post',
		data: {tid: tid, code: code, status: status, system_id: system_id, prd_no: prd_no},
		dataType: 'json',
		success: function (data) {
			if(data.imgurl){
				$("#codeImg").attr("src",data.imgurl);
				$("#codeImgHtml").html(data.imgInfo);
			}
		}																							
	});
}

$(document).ready(function(){
	$('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
	});
	$('.skin-minimal-shop input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
	});
	
	$('#onlySendWl').on('ifChecked ifUnchecked', function(event){
		if (event.type == 'ifChecked') {
			tableList.onlySendWl = "yes";								
		} else {																				
			tableList.onlySendWl = "no";
		}	
	});	
	
	$('#onlySendShop').on('ifChecked ifUnchecked', function(event){
		if (event.type == 'ifChecked') {
			tableList.onlySendShop = "yes";								
		} else {																				
			tableList.onlySendShop = "no";
		}	
	});	
	
	$('#printCQLable').on('ifChecked ifUnchecked', function(event){
		if (event.type == 'ifChecked') {
			tableList.printCQLable = "yes";								
		} else {																				
			tableList.printCQLable = "no";
		}

		$.ajax({																			
			url: "/index.php?m=system&c=explosionCode&a=setPrintCQLable",
			type: 'post',
			data: {printCQLable: tableList.printCQLable},
			dataType: 'json',
			success: function (data) {
				
			}																							
		});
	});
	// 打印发货清单checkbox
	$('#printDsosLable').on('ifChecked ifUnchecked', function(event){
		if (event.type == 'ifChecked') {
			tableList.printDsosLable = "yes";
		} else {
			tableList.printDsosLable = "no";
		}

		$.ajax({
			url: "/index.php?m=system&c=explosionCode&a=setPrintDsosLable",
			type: 'post',
			data: {printDsosLable: tableList.printDsosLable},
			dataType: 'json',
			success: function (data) {

			}
		});
	});

	$('#scanMessageSingle').on('ifChecked ifUnchecked', function(event){
		if (event.type == 'ifChecked') {
			tableList.scanMessageSingle = "yes";								
		} else {																				
			tableList.scanMessageSingle = "no";
		}

		$.ajax({																			
			url: "/index.php?m=system&c=explosionCode&a=setScanMessageSingle",
			type: 'post',
			data: {scanMessageSingle: tableList.scanMessageSingle},
			dataType: 'json',
			success: function (data) {
				
			}																							
		});
	});	
});

//监听打印机
function layprintTplBqChoose(){
	var layprintTplBq = $("#layprintTplBq").val();
	//console.log(layprintTplBq);
	$.ajax({
		url:'/?m=system&c=explosionCode&a=getLayprintChoose',
		dataType: 'json',
		type: "post",
		data:{
			layprintTplBq:layprintTplBq
		},
		success:function(data){
			if(data.code == 'ok'){
				var layprintList = tableList.layprint;
				var layOnOff = 0;
				var values = data.msg;
				for(var i=0;i<layprintList.length;i++){
					if(layprintList[i]['name'] == values){
						$("#layprint").val(values);
						layOnOff = 1;
					}
				}
				if(layOnOff == 0){
					$("#layprint").append('<option style="display:none;" value="'+values+'">'+values+'</option>');
					layer.msg('不存在当前名称的打印机');
					$("#layprint").val(values);
				}
			}else{
				$("#layprint").val("");
			}
		}
	})
}
//质检标签模板监听
/*function layprintTplBqCheckChoose(){
	var layprintTplBq = $("#layprintTplBqCheck").val();
	//console.log(layprintTplBq);
	$.ajax({
		url:'/?m=system&c=explosionCode&a=getLayprintCheckChoose',
		dataType: 'json',
		type: "post",
		data:{
			layprintTplBq:layprintTplBq
		},
		success:function(data){
			if(data.code == 'ok'){
				var layprintList = tableList.layprint;
				var layOnOff = 0;
				var values = data.msg;
				for(var i=0;i<layprintList.length;i++){
					if(layprintList[i]['name'] == values){
						$("#layprintCheck").val(values);
						layOnOff = 1;
					}
				}
				if(layOnOff == 0){
					$("#layprintCheck").append('<option style="display:none;" value="'+values+'">'+values+'</option>');
					layer.msg('不存在当前名称的打印机');
					$("#layprintCheck").val(values);
				}
			}else{
				$("#layprintCheck").val("");
			}
		}
	})
}*/


//发货清单模板监听
function layprintTplBqDsosChoose(){
	var layprintTplBq = $("#layprintTplBqDsos").val();
	//console.log(layprintTplBq);
	$.ajax({
		url:'/?m=system&c=explosionCode&a=getLayprintDsosChoose',
		dataType: 'json',
		type: "post",
		data:{
			layprintTplBq:layprintTplBq
		},
		success:function(data){
			if(data.code == 'ok'){
				var layprintList = tableList.layprint;
				var layOnOff = 0;
				var values = data.msg;
				for(var i=0;i<layprintList.length;i++){
					if(layprintList[i]['name'] == values){
						$("#layprintDsos").val(values);
						layOnOff = 1;
					}
				}
				if(layOnOff == 0){
					$("#layprintDsos").append('<option style="display:none;" value="'+values+'">'+values+'</option>');
					layer.msg('不存在当前名称的打印机');
					$("#layprintDsos").val(values);
				}
			}else{
				$("#layprintDsos").val("");
			}
		}
	})
}

/*function printCQlabel(unique_code){
	var printCQLable = tableList.printCQLable;
	var a = 0;
	if(printCQLable == "yes"){
		$.ajax({								
			url: "/index.php?m=system&c=explosionCode&a=getDefCQlable",
			type: 'post',							
			data: {},
			async:false,
			dataType: 'json',				
			success: function (data) {
				var print = data.print;
				var printTplModule = data.printTplModule;
				
				if(print == "" || print == null){
					a = 1;
				}
				if(printTplModule =="" || printTplModule == null){
					a = 2;
				}
				
				var layprintList = tableList.layprint;
				var layOnOff = 0;
				for(var i=0;i<layprintList.length;i++){
					if(layprintList[i]['name'] == print){
						layOnOff = 1;
					}
				}
				if(layOnOff == 0){
					layer.msg('当前质检标签打印机不存在');
				}else if(a == 1){
					layer.msg('请先设置质检标签打印机');
				}else if(a == 2){
					layer.msg('请先设置质检标签打印模板');
				}else{
					$.ajax({								
						url: "/index.php?m=system&c=explosionCode&a=getPrintDataCQ",
						type: 'post',							
						data: {unique_code: unique_code},
						async:false,
						dataType: 'json',				
						success: function (data) {
							printTpl[printTplModule](print,data);	
						}
					});
				}
			}													
		});
	}
}*/

function numReplaceSound(str){
	str = str.replace(/0/g,'零');
	str = str.replace(/1/g,'一');
	str = str.replace(/2/g,'二');
	str = str.replace(/3/g,'三');
	str = str.replace(/4/g,'四');
	str = str.replace(/5/g,'五');
	str = str.replace(/6/g,'六');
	str = str.replace(/7/g,'七');
	str = str.replace(/8/g,'八');
	str = str.replace(/9/g,'九');
	
	return str;
}