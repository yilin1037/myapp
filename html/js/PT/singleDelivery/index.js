var tableList = new Vue({
	el: '#tableList',
	data: {
		onlySendWl:'no',
		onlySendShop:'no',
		//printCQLable:'no',
		show:false,
		show2:false,
		order:{},
		item:[],
		yes:"是",
		no:"否",
		buyer_message:"",
		seller_memo:"",
		unique_code:"",
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
			url: "/index.php?m=system&c=printShip&a=getShopList",
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
		
		/*$.ajax({																				
			url: "/index.php?m=system&c=printShip&a=getCQConfig",
			type: 'post',																			
			data: {},																				
			dataType: 'json',
			async:false,
			success: function (data) {
				if(data.configValue == "yes"){
					self.printCQLable = "yes";
					$("#printCQLable").iCheck('check');
				}
			}	
		});*/
		
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
				area: ['300px', '300px'], //宽高
				shade: 0.3,
				shade: 0,
				resize: false,
				content: $("#lookBigImg"),
				yes: function(index, layero){
					layer.close(index);
				}
			});
		},
		print1Judge:function(){
			var self = this;
			miandan(self,"false");
			$("#printJudge").attr("disabled",true);
			setTimeout(function() {
				$("#printJudge").attr("disabled",false);
			}, 2000);			
			$("#tid").focus();
		},
		//当前操作员打印机设置
		userPrinterSetup:function(){
			$("#layprintTplBq").val("");
			$("#layprint").val("");
			var self = this;
			//打印模板
			$.ajax({
				url:'/?m=system&c=printShip&a=getTemplate',
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
						url:'/?m=system&c=printShip&a=getTplBqLayprint',
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
				url:'/?m=system&c=printShip&a=getTemplateCheck',
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
						url:'/?m=system&c=printShip&a=checkTplBqLayprint',
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
		getTid:function(){
			var self = this;
			//打印机
			doGetPrinters(function(data){
				self.layprint = data;
			});
			if(event.keyCode == 13){
				$("#codeImg").css("display","block");
				if(tableList.successful == 0){
					tableList.item = [];
					tableList.successful = 1;
				}
				$("#tid").attr("disabled",true);
				setTimeout(function(){
					$("#tid").attr("disabled",false);
					$("#tid").focus();
				},2000);
				var gridItem = self.item;
                var unique_code = $("#tid").val();
				self.unique_code = unique_code;
				$("#tid").val("");
				var onlySendWlList = ',' + $("#onlySendWlList").attr("name") + ',';
				var onlySendWlListName = $("#onlySendWlList").val();
				var onlySendWl = self.onlySendWl;
				
				var onlyShopList = ',' + $("#onlyShopList").attr("name") + ',';
				var onlyShopListName = $("#onlyShopList").val();
				var onlySendShop = self.onlySendShop;
				self.order = [];
				$.ajax({	
					url: "/index.php?m=PT&c=singleDelivery&a=getData",		
					type: 'post',
					data: {unique_code: unique_code},
					dataType: 'json',
					success: function (data) {
						if(data.imgurl){
							$("#codeImg").attr("src",data.imgurl);
						}
						
						if(data && data.code == 'return'){
							layui.use('layer', function(){
							  var layer = layui.layer;
								layer.msg(data.msg,{
									icon: 0,
									time: 2000
								});
							});
							speckText(data.msg);
							return;
						}
						
						if(onlySendWl == 'yes' && onlySendWlList.indexOf(',' + data.order[0].express_type + ',') == -1){
							
							layui.use('layer', function(){
							  var layer = layui.layer;
								layer.msg("设置只发"+onlySendWlListName+"订单，此单为"+ data.order[0].express_name +"禁止发货",{
									icon: 0,
									time: 2000
								});
							});
							speckText("不是发货物流");
							return false;
						}
						
						if(onlySendShop == 'yes' && onlyShopList.indexOf(',' + data.order[0].shopname + ',') == -1){
							
							layui.use('layer', function(){
							  var layer = layui.layer;
								layer.msg("设置只发"+onlyShopListName+"订单，此单为"+ data.order[0].shopname +"禁止发货",{
									icon: 0,
									time: 2000
								});
							});
							speckText("不是发货店铺");
							return false;
						}
						
						if(data && data.code && (data.code == 'error' || data.code == 'sended'))
						{
						
							layui.use('layer', function(){
							  var layer = layui.layer;
								layer.msg(data.msg,{
									icon: 0,
									time: 2000
								});
							});	
							self.item = [];
							
							speckText(data.msg);
							
							if(data.code == 'error')
							{
								tableList.resetAll();	
								return
							}
							
						}
						if(data.order != 0){
							var a = 0;
							self.express_type =  data.order[0].express_type;
							self.express_name =  data.order[0].express_name;
							$.ajax({								
								url: "/index.php?m=system&c=printShip&a=getDef",
								type: 'post',							
								data: {express_type: self.express_type},
								async:false,
								dataType: 'json',				
								success: function (data) {
									//console.log(data);
									if(data.print == "" || data.print == null){
										a = 1;
									}
									if(data.id =="" || data.id == null){
										a = 2;
									}
									self.unprintTplBq = data.id;
									self.unprintname = data.print;
									var layprintList = tableList.layprint;
									var layOnOff = 0;
									for(var i=0;i<layprintList.length;i++){
										if(layprintList[i]['name'] == data.print){
											$("#layprint").val(data.print);
											layOnOff = 1;
										}
									}
									if(layOnOff == 0){
										alert('当前快递单打印机不存在');
									}
								}													
							});
							
							if(a == 1){
								printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
								return false;
							}else if(a == 2){
								printerPrompt("未设置默认打印模板","电子面单设计","index.php?m=print&c=dzmdDesign&a=index");
								return false;
							}
							
							self.itemLength = data.item.length;
							var j = 0;
							self.j = j;
							var tid = data.order[0].new_tid;
							var send_status = data.order[0].send_status;
							
							var refund_status = "";
							for(var i = 0; i<data.item.length; i++){
								if(data.item[i]['unique_code'] == unique_code){
									refund_status = data.item[i]['refund_status'];
								}
							}
							
							self.order = data.order[0];
							
							self.buyer_message = data.order[0].buyer_message;
							self.seller_memo = data.order[0].seller_memo;
							self.express_type =  data.order[0].express_type;
							self.express_name =  data.order[0].express_name;
							
							if(self.itemLength == 1 && send_status != "WAIT_SENDED"){
								sound_play('danjian');
							}

							var item = data.item;
							
							self.item = item;
							self.tid = tid;
							$("#tid").val('');
							if(data && data.code && data.code == 'error')
							{
								return;
							}
							if(refund_status == "WAIT_SELLER_AGREE" && send_status != "WAIT_SENDED"){
								speckText("此订单申请退款");
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
								}else{
									tableList.sendOrder(tid,'normal');
									
									layui.use('layer', function(){
									  var layer = layui.layer;
										layer.msg("通过",{
											icon: 1,
											time: 2000
										});
									});
								}
							}
						}else{
							if(data.code != 'error')
							{
								layui.use('layer', function(){
								  var layer = layui.layer;
									layer.msg("无效的条码",{
										icon: 0,
										time: 2000
									});
								});

								speckText("无效的条码");
							}
							
							tableList.resetAll();	
							self.item = [];
							$("#tid").val("");
						}
					}						
				});
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
		},
		//-----------重置开始------------//
		/*CQlabelFill:function(){
			var self = this;
			var unique_code = self.unique_code;
			if(unique_code == ""){
				layer.msg("请先扫描一个唯一码",{
					icon: 1,
					time: 2000
				});

				return false;
			}
			
			printCQlabel(unique_code);//打印质检标签
		},*/
		//-----------发货开始------------//
		sendOrder:function(tid,type){
			
			var self = this;
			var onlySendWlList = ',' + $("#onlySendWlList").attr("name") + ',';
			var onlySendWlListName = $("#onlySendWlList").val();
			var onlySendWl = self.onlySendWl;
			var express_type = self.express_type;
			var express_name = self.express_name;
			
			if(onlySendWl == 'yes' && onlySendWlList.indexOf(',' + express_type + ',') == -1){
				
				layui.use('layer', function(){
				  var layer = layui.layer;
					layer.msg("设置只发"+onlySendWlListName+"订单，此单为"+ express_name +"禁止发货",{
						icon: 0,
						time: 2000
					});
				});
				speckText("不是发货物流");
				return false;
			}
			
			$.ajax({																			
				url: "/index.php?m=PT&c=singleDelivery&a=sendOrder",	
				type: 'post',
				data: {tid: tid, type: type},
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
	
								speckText("请打包" + self.buyer_message + self.seller_memo);
								
								miandan(self,"false");
								
							}else if(data.code == "error"){
								layui.use('layer', function(){
								  var layer = layui.layer;
									layer.msg("发货失败【" + data.msg + "】",{
										icon: 2,
										time: 2000
									});
								}); 
								
								$.ajax({							
									url: "/index.php?m=PT&c=singleDelivery&a=changeMark",
									type: 'post',
									data: {tid: tid},
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
	}																			
});


$(document).ready(function(){
	$(document).keydown(function(event){
		if(event.keyCode == 120){
			tableList.resetAll();
		}
	})
})

function miandan(self,force){
	//console.log(self.unprintTplBq);
	$.ajax({														
		url: "/index.php?m=system&c=printShip&a=printNow",			
		type: 'post',															
		data: {data: self.tid, type: self.express_type, force: force},
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
	
	/*$('#printCQLable').on('ifChecked ifUnchecked', function(event){
		if (event.type == 'ifChecked') {
			tableList.printCQLable = "yes";								
		} else {																				
			tableList.printCQLable = "no";
		}

		$.ajax({																			
			url: "/index.php?m=system&c=printShip&a=setPrintCQLable",
			type: 'post',
			data: {printCQLable: tableList.printCQLable},
			dataType: 'json',
			success: function (data) {
				
			}																							
		});
	});	*/
});


//监听打印机
function layprintTplBqChoose(){
	var layprintTplBq = $("#layprintTplBq").val();
	//console.log(layprintTplBq);
	$.ajax({
		url:'/?m=system&c=printShip&a=getLayprintChoose',
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

/*//质检标签模板监听
function layprintTplBqCheckChoose(){
	var layprintTplBq = $("#layprintTplBqCheck").val();
	//console.log(layprintTplBq);
	$.ajax({
		url:'/?m=system&c=printShip&a=getLayprintCheckChoose',
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
}

function printCQlabel(unique_code){
	var printCQLable = tableList.printCQLable;
	var a = 0;
	if(printCQLable == "yes"){
		$.ajax({								
			url: "/index.php?m=system&c=printShip&a=getDefCQlable",
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
						url: "/index.php?m=system&c=printShip&a=getPrintDataCQ",
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