var vue = new Vue({
	el: '#vueHtml',
	data: {
		smsContent:'',
		chooseTime:'',
		qianming:'',
		strNumber:'',
		strNum:0,
		rightNumber:'',
		rightCount:0,
		wrongNumber:'',
		wrongCount:0,
		colorOrange: {
			color: '#FF7700',
		},
		borderOrange: {
			border: '1px solid #FF7700',
		},
		displayNone: {
			display: 'none',
		},
		saveSecret: 0,
		saveMarketing: 0,
		saveBlessing: 0,
		agreeTerms:false,
		smsCollection:false,
	},
	mounted:function(){
		var oWindow = $(window).height();
	
		var oHeight = oWindow-115;

		$("#massSendPage").css("height",oHeight+"px");
		
		layui.use(['laydate', 'form', 'layer', 'element', 'table'], function(){
			var laydate = layui.laydate 	//日期
				,layer = layui.layer 		//弹层
				,form = layui.form 			//表单
				,element = layui.element 	//元素操作
				,table = layui.table		//表格
				,$ = layui.$;
				
			//日期时间范围
			laydate.render({
				elem: '#timeScope'
				,type: 'time'
				,range: true
			});
			//日期时间范围
			laydate.render({
				elem: '#dateScope'
				,type: 'datetime'
				,range: true
			});
			
			//时间选择器
			  laydate.render({
				elem: '#chooseTime'
				,type: 'time'
			  });
			
			//弹出批量增加电话号码
			$("#callBtn").click(function(){
				layer.open({
					type: 1,
					title: '临时号码添加',
					skin: 'layui-layer-rim',
					area: ['850px', '450px'],
					shade: 0.3,
					content: $("#addShortCall"),
					btn: ['确定', '取消'],
					yes: function(index, layero){
						filterAnoymousNum(event);		
						var inputValidArray = document.querySelector('.rightTextarea').value.split('\n');
						var sum = 0;
						var inputValid = '';
						if(inputValidArray)
						{
							for(var i=0;i<inputValidArray.length;i++){
								if(inputValidArray[i]){
									sum = sum+1;
									if(inputValid==''){
										inputValid = inputValidArray[i];
									}else{
										inputValid = inputValid +','+ inputValidArray[i];
									}
								}
							}
						}
						vue.strNumber = inputValid;
						for(var i = 0 ;i<inputValidArray.length;i++)
						{
							if(inputValidArray[i] == "" || typeof(inputValidArray[i]) == "undefined")
							{
								inputValidArray.splice(i,1);
								i= i-1;
                  
							}
						}
						vue.strNum = inputValidArray.length;
						var rightNumber = vue.rightNumber;
						var numArr = rightNumber.split(/[(\r\n)\r\n]+/);
						var phoneReg = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;
						var newRight = "";
						var newnumArr=numArr.sort();
						for(var i=0;i<numArr.length;i++){
						if(numArr[i] != ''){
							if(phoneReg.test(numArr[i])){
									vue.rightNumber = newRight;
									$("#danger1").html((0));
									layer.close(index);
								}
							}
						}
								
					
					
		
					}
				});
			})
			function filterAnoymousNum(event){
			   document.querySelector('#danger1').innerHTML = 0;
			   var invalidArray = document.querySelector('.wrongTextarea').value.split('\n');
			   var inputInvalid = document.querySelector('.wrongTextarea');
			   var inputValid = document.querySelector('.rightTextarea');
			  // alert(inputValid);
			   var invalidNum = document.querySelector('#danger2');
			   var validNum = document.querySelector('#danger1');
			   function onlyUnique(value, index, self) {
				return self.indexOf(value) === index;
			   }
			   inputValid.value = inputValid.value.split(' ').join('\n').split('\n').filter(onlyUnique).join('\n');
			   var value = inputValid.value;
			   var phoneNums = value.split('\n');
			   function filterNum(num) {
					function deleteNumFromInput () {
						var newInputValidArray = inputValid.value.split('\n')
						var index = newInputValidArray.indexOf(num)
						var copyPhoneNums = JSON.parse(JSON.stringify(newInputValidArray))
						copyPhoneNums.splice(index, 1)
						inputValid.value = copyPhoneNums.join('\n')
					}
					if (!/(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/.test(num)) {
						if (num.length > 0) {
							var invalidNumArray = inputInvalid.value.split('\n')
							if (invalidNumArray.indexOf(num) < 0) {
								invalidNum.innerHTML = Number(invalidNum.innerHTML) + 1;
								inputInvalid.value = inputInvalid.value + num + '\n';
								deleteNumFromInput()
							}else{
								if (invalidArray.filter(function (a) {
									return a.indexOf(num) >= 0;
								  }).length > 0 && invalidArray.filter(function (a) {
									return a === num;
								  }).length == 0) {
									invalidNum.innerHTML = Number(invalidNum.innerHTML) + 1;
									inputInvalid.value = inputInvalid.value + num + '\n';
									deleteNumFromInput()
								  } else {
									deleteNumFromInput()
								  }	
								  
							}
						}
					}else{
						if (inputValid.value.indexOf(num) >= 0) {
							validNum.innerHTML = Number(validNum.innerHTML) + 1;
						}
					}
			   }
			   phoneNums.forEach(function (num) {
				filterNum(num.trim());
			  });
			}
			$.ajax({
				url:'/?m=SMS&c=massSend&a=getShopList',
				dataType: 'json',
				type: "post",
				data:{},
				success:function(data){
					if(data){
						var oHtml = "<option value=''></option>";
						for(var i=0;i<data.length;i++){
							oHtml += "<option value='"+data[i]['shopid']+"'>"+data[i]['shopname']+"</option>";
						}
						$("#shopList").html(oHtml);
						form.render('select');
					}
					
				}
			})
			
			form.on('select(shopList)', function(data){

				var dataTxt = $("#shopList").find("option:selected").text();;
				vue.qianming = "【"+dataTxt+"】";
			});
			
			element.on('tab(ExclusiveSecret)', function(data){
				console.log(this); //当前Tab标题所在的原始DOM元素
				console.log(data.index); //得到当前Tab的所在下标
				console.log(data.elem); //得到当前的Tab大容器
				vue.saveSecret = data.index;
			});
			element.on('tab(marketingTpl)', function(data){
				console.log(this); //当前Tab标题所在的原始DOM元素
				console.log(data.index); //得到当前Tab的所在下标
				console.log(data.elem); //得到当前的Tab大容器
				vue.saveMarketing = data.index;
			});
			element.on('tab(blessingTpl)', function(data){
				console.log(this); //当前Tab标题所在的原始DOM元素
				console.log(data.index); //得到当前Tab的所在下标
				console.log(data.elem); //得到当前的Tab大容器
				vue.saveBlessing = data.index;
			});
			form.on('switch(agreeTerms)', function(data){
				console.log(data.elem); //得到checkbox原始DOM对象
				console.log(data.elem.checked); //开关是否开启，true或者false
				console.log(data.value); //开关value值，也可以通过data.elem.value得到
				console.log(data.othis); //得到美化后的DOM对象
				vue.agreeTerms = data.elem.checked;
			}); 
			form.on('switch(smsCollection)', function(data){
				console.log(data.elem); //得到checkbox原始DOM对象
				console.log(data.elem.checked); //开关是否开启，true或者false
				console.log(data.value); //开关value值，也可以通过data.elem.value得到
				console.log(data.othis); //得到美化后的DOM对象
				vue.smsCollection = data.elem.checked;
			});
			//监听行单击事件（单击事件为：rowDouble）
			table.on('tool(contentTable)', function(obj){
				var res = obj.data;
				if(obj.event==='del'){
				layer.confirm('删除收藏', {icon: 1, title:'提示'}, function(index){
					layer.close(index);
						$.ajax({
							url:'/?m=SMS&c=massSend&a=deletesc',
							data: {
								data: res['configValue']
							},
							type: "post",
							success: function (data) {
								tableLoad.tableLoadFunction();
								layer.msg('成功',{'icon':1});
							}
						});
					});
				}
				var combo1=vue.qianming;
				var smsMaxLength = 70;
				var oSmsText = $("#desc");
				oSmsText.val(res['configValue']);
				var smsContent = res['configValue']
				var smsLen = smsContent.length;
				var smsSign = combo1.length;

					//退订提示
				var unsubscribe = " 退订回T";

				var finalLen = smsLen + smsSign + unsubscribe.length;
				if (finalLen > smsMaxLength && finalLen <= 140) {
				$("#smsWordCount").html("2").css("color", "red").parent().attr("rel", "超出长度按<span style='color:red'> 2 </span>条计费，但接收方手机中显示为<span style='color:red'> 1 </span>条");
				$("#smsWordNum").html((140 - finalLen)).css("color", "red");
				}
				if (finalLen <= smsMaxLength) {
				$("#smsWordCount").html("1").css("color", "#0088cc").parent().attr("rel", "当前短信长度按1条计费");
				$("#smsWordNum").html((smsMaxLength - finalLen)).css("color", "#333");
				}
				if (finalLen > 140) {
					smsContent = smsContent.substr(0, 140 - smsSign - unsubscribe.length);
					oSmsText.val(smsContent);
				}
					//添加退订提示
				if (smsContent != "") {
					var preSms = combo1;
					var normalSmsText = preSms + smsContent + unsubscribe;
					var firstOfAllSmsText = preSms + smsContent.substr(0, smsMaxLength - preSms.length - unsubscribe.length);
					var secondOfAllSmsText = smsContent.substr(smsMaxLength - preSms.length - unsubscribe.length, smsMaxLength) + unsubscribe;

				if (normalSmsText.length > smsMaxLength) {
					//总长度大于单条最大长度

					// 第一条
					$("#preViewSms").html(firstOfAllSmsText).show();

					// 第二条
					$("#preViewSms-2").html(secondOfAllSmsText).show();
				} else {
					//总长度小于单条最大长度

					// 单条
					$("#preViewSms").html(normalSmsText).show();

					// 隐藏第二条
					$("#preViewSms-2").html("").hide();
				}
				} else {
					$("#preViewSms").html("").hide();
					$("#preViewSms-2").html("").hide();
				}
				//layer.closeAll();
			});
			
			table.render({
				elem: '#dataListLog'
				,url: '/?m=SMS&c=massSend&a=sendSMSList'
				,cols: [[
				   {field:'index', title: '序号',"width":60 ,fixed: true}
				  ,{field:'send_time', title: '订单号',"width":170}
				  ,{field:'shopname', title: '发送时间',"width":120}
				  ,{field:'new_tid', title: '手机号',"width":180}
				  ,{field:'show_tid', title: '发送状态',"width":100}
				  ,{field:'buyer_nick', title: '短信数字',"width":120}
				  ,{field:'express_name', title: '短信数量',"width":150}
				  ,{field:'express_no', title: '短信内容（每70字按一条计费）',"minWidth":130}
				]]
				,id: 'dataListLog'
				,page: true
				,height: 'full-300'
				,limit: 50
			});
			
			table.render({
				elem: '#dataListSettimeLog'
				,url: '/?m=SMS&c=massSend&a=sendSMSsettimeout'
				,cols: [[
				   {field:'index', title: '序号',"width":60 ,fixed: true}
				  ,{field:'send_time', title: '订单号',"width":170}
				  ,{field:'shopname', title: '发送时间',"width":120}
				  ,{field:'new_tid', title: '手机号',"width":180}
				  ,{field:'show_tid', title: '发送状态',"width":180}
				  ,{field:'buyer_nick', title: '短信数字',"width":120}
				  ,{field:'express_name', title: '短信数量',"width":80}
				  ,{field:'express_no', title: '短信内容（每70字按一条计费）',"minWidth":130}
				]]
				,id: 'dataListSettimeLog'
				,page: true
				,height: 'full-300'
				,limit: 50
			});
		})
	},
	computed: { 
		smsNum: function () { 
			var nowCont = this.smsContent.length+this.qianming.length+4;
			var numAfter = Math.ceil(nowCont/70);
			return numAfter;
		} 
	},
	methods: {
		ExclusiveSecret:function(){
			layer.open({
				type: 1,
				title: '独家短息秘籍',
				skin: 'layui-layer-rim',
				area: ['850px', '500px'],
				shade: 0.3,
				content: $("#ExclusiveSecret"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var oIndex = vue.saveSecret;
					var dataTxt = $("input[name='ExclusiveSecret"+oIndex+"']:checked").val();
					var combo1=vue.qianming;
					var smsMaxLength = 70;
					var oSmsText = $("#desc");
					oSmsText.val(dataTxt);
					var smsContent = dataTxt;
					var smsLen = smsContent.length;
					var smsSign = combo1.length;

					//退订提示
					var unsubscribe = " 退订回T";

					var finalLen = smsLen + smsSign + unsubscribe.length;
					if (finalLen > smsMaxLength && finalLen <= 140) {
						$("#smsWordCount").html("2").css("color", "red").parent().attr("rel", "超出长度按<span style='color:red'> 2 </span>条计费，但接收方手机中显示为<span style='color:red'> 1 </span>条");
						$("#smsWordNum").html((140 - finalLen)).css("color", "red");
					}
					if (finalLen <= smsMaxLength) {
						$("#smsWordCount").html("1").css("color", "#0088cc").parent().attr("rel", "当前短信长度按1条计费");
						$("#smsWordNum").html((smsMaxLength - finalLen)).css("color", "#333");
					}
					if (finalLen > 140) {
						smsContent = smsContent.substr(0, 140 - smsSign - unsubscribe.length);
						oSmsText.val(smsContent);
					}
					//添加退订提示
				if (smsContent != "") {
					var preSms = combo1;
					var normalSmsText = preSms + smsContent + unsubscribe;
					var firstOfAllSmsText = preSms + smsContent.substr(0, smsMaxLength - preSms.length - unsubscribe.length);
					var secondOfAllSmsText = smsContent.substr(smsMaxLength - preSms.length - unsubscribe.length, smsMaxLength) + unsubscribe;

					if (normalSmsText.length > smsMaxLength) {
						//总长度大于单条最大长度

						// 第一条
						$("#preViewSms").html(firstOfAllSmsText).show();

						// 第二条
						$("#preViewSms-2").html(secondOfAllSmsText).show();
					} else {
						//总长度小于单条最大长度

						// 单条
						$("#preViewSms").html(normalSmsText).show();

						// 隐藏第二条
						$("#preViewSms-2").html("").hide();
					}
				} else {
					$("#preViewSms").html("").hide();
					$("#preViewSms-2").html("").hide();
				}
				layer.close(index);
				}
			});
		},
		marketingTpl:function(){
			layer.open({
				type: 1,
				title: '营销短信模板',
				skin: 'layui-layer-rim',
				area: ['850px', '500px'],
				shade: 0.3,
				content: $("#marketingTpl"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var oIndex = vue.saveMarketing;
					var dataTxt = $("input[name='marketingTpl"+oIndex+"']:checked").val();
					var combo1=vue.qianming;
					var smsMaxLength = 70;
					var oSmsText = $("#desc");
					oSmsText.val(dataTxt);
					var smsContent = dataTxt;
					var smsLen = smsContent.length;
					var smsSign = combo1.length;

					//退订提示
					var unsubscribe = " 退订回T";

					var finalLen = smsLen + smsSign + unsubscribe.length;
					if (finalLen > smsMaxLength && finalLen <= 140) {
						$("#smsWordCount").html("2").css("color", "red").parent().attr("rel", "超出长度按<span style='color:red'> 2 </span>条计费，但接收方手机中显示为<span style='color:red'> 1 </span>条");
						$("#smsWordNum").html((140 - finalLen)).css("color", "red");
					}
					if (finalLen <= smsMaxLength) {
						$("#smsWordCount").html("1").css("color", "#0088cc").parent().attr("rel", "当前短信长度按1条计费");
						$("#smsWordNum").html((smsMaxLength - finalLen)).css("color", "#333");
					}
					if (finalLen > 140) {
						smsContent = smsContent.substr(0, 140 - smsSign - unsubscribe.length);
						oSmsText.val(smsContent);
					}
					//添加退订提示
				if (smsContent != "") {
					var preSms = combo1;
					var normalSmsText = preSms + smsContent + unsubscribe;
					var firstOfAllSmsText = preSms + smsContent.substr(0, smsMaxLength - preSms.length - unsubscribe.length);
					var secondOfAllSmsText = smsContent.substr(smsMaxLength - preSms.length - unsubscribe.length, smsMaxLength) + unsubscribe;

					if (normalSmsText.length > smsMaxLength) {
						//总长度大于单条最大长度

						// 第一条
						$("#preViewSms").html(firstOfAllSmsText).show();

						// 第二条
						$("#preViewSms-2").html(secondOfAllSmsText).show();
					} else {
						//总长度小于单条最大长度

						// 单条
						$("#preViewSms").html(normalSmsText).show();

						// 隐藏第二条
						$("#preViewSms-2").html("").hide();
					}
				} else {
					$("#preViewSms").html("").hide();
					$("#preViewSms-2").html("").hide();
				}
				layer.close(index);
				}
				
			});
		},
		blessingTpl:function(){
			layer.open({
				type: 1,
				title: '祝福短信模板',
				skin: 'layui-layer-rim',
				area: ['850px', '500px'],
				shade: 0.3,
				content: $("#blessingTpl"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var oIndex = vue.saveBlessing;
					var dataTxt = $("input[name='blessingTpl"+oIndex+"']:checked").val();
					var combo1=vue.qianming;
					var smsMaxLength = 70;
					var oSmsText = $("#desc");
					oSmsText.val(dataTxt);
					var smsContent = dataTxt;
					var smsLen = smsContent.length;
					var smsSign = combo1.length;

					//退订提示
					var unsubscribe = " 退订回T";

					var finalLen = smsLen + smsSign + unsubscribe.length;
					if (finalLen > smsMaxLength && finalLen <= 140) {
						$("#smsWordCount").html("2").css("color", "red").parent().attr("rel", "超出长度按<span style='color:red'> 2 </span>条计费，但接收方手机中显示为<span style='color:red'> 1 </span>条");
						$("#smsWordNum").html((140 - finalLen)).css("color", "red");
					}
					if (finalLen <= smsMaxLength) {
						$("#smsWordCount").html("1").css("color", "#0088cc").parent().attr("rel", "当前短信长度按1条计费");
						$("#smsWordNum").html((smsMaxLength - finalLen)).css("color", "#333");
					}
					if (finalLen > 140) {
						smsContent = smsContent.substr(0, 140 - smsSign - unsubscribe.length);
						oSmsText.val(smsContent);
					}
					//添加退订提示
					if (smsContent != "") {
						var preSms = combo1;
						var normalSmsText = preSms + smsContent + unsubscribe;
						var firstOfAllSmsText = preSms + smsContent.substr(0, smsMaxLength - preSms.length - unsubscribe.length);
						var secondOfAllSmsText = smsContent.substr(smsMaxLength - preSms.length - unsubscribe.length, smsMaxLength) + unsubscribe;

						if (normalSmsText.length > smsMaxLength) {
							//总长度大于单条最大长度

							// 第一条
							$("#preViewSms").html(firstOfAllSmsText).show();

							// 第二条
							$("#preViewSms-2").html(secondOfAllSmsText).show();
						} else {
							//总长度小于单条最大长度

							// 单条
							$("#preViewSms").html(normalSmsText).show();

							// 隐藏第二条
							$("#preViewSms-2").html("").hide();
						}
						} else {
						$("#preViewSms").html("").hide();
						$("#preViewSms-2").html("").hide();
						}
						layer.close(index);
				}
			});
		},
		sendSms:function(){
			var self = this;
			if(vue.agreeTerms == 1){
				var phoneNums = self.strNumber;
				if(phoneNums == ""){
					layer.msg('发送对象不能为空',{'icon':0});
					return
				}
			
				var oSmsText = $("#desc");
				var smsContent = oSmsText.val();
				//alert(smsContent);
				if(smsContent==""){
					layer.msg('发送内容不能为空！',{'icon':0});
					return
				}
				//var shopid = $("#shopList").val();
				var shopid=vue.qianming;

				if(shopid==""){
					layer.msg('短信签名不能为空！',{'icon':0});
					return
				}
				var shopname = $("#sel option:selected").text();
				var smsCollection = vue.smsCollection;
				var chooseTime = $("#chooseTime").val();
				$.ajax({
					url:'/?m=SMS&c=massSend&a=sendSms',
					dataType: 'json',
					type: "post",
					data:{
						phoneNums:phoneNums,
						smsContent:smsContent,
						shopid:shopid,
						shopname:shopname,
						smsCollection:smsCollection,
						chooseTime:chooseTime,
					},
					success:function(data){
						if(data['code'] == '0000'){
							layer.msg(data['msg'],{'icon':1});
                        }else{
                            layer.msg(data['msg'],{'icon':0});
            			}
						
					}
				})
			}else{
				layer.msg('请同意短信发送条款',{'icon':0});
			}
		},
		sendSmsSettime:function(){
			var date=new Date();     //1. js获取当前时间
			var min=date.getMinutes();  //2. 获取当前分钟
			date.setMinutes(min+10);  //3. 设置当前时间+10分钟：把当前分钟数+10后的值重新设置为date对象的分钟数
			var y = date.getFullYear();
			var m = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
			var d = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
			var h = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
			var f = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
			var s = date.getSeconds() < 10 ? ('0' + date.getseconds()) : date.getSeconds()
			var formatdate =h + ":" + f + ":" + s;
			var self = this;
			if(vue.agreeTerms == 1){
				var phoneNums = self.strNumber;
				var time2 = new Date().Format("hh:mm:ss");
				layer.open({
					type: 1,
					title: '定时发送短信',
					skin: 'layui-layer-rim',
					area: ['500px', '200px'],
					shade: 0.3,
					content: $("#sendSmsSettimeSetting"),
					btn: ['确定', '取消'],
					yes: function(index, layero){
						var chooseTime = $("#chooseTime").val();
						vue.chooseTime=chooseTime;
						if(chooseTime < formatdate){
							layer.msg('定时时间需要大于当前10分钟',{'icon':0});
							return false;
						}
						var shopname = $("#sel option:selected").text();
						var smsCollection = vue.smsCollection;
						layer.close(index);
						$("#btnTiming").hide();
						$("#btnTimingout").show();
						$("#btnSmsSend").html('定时发送');
					}
				});
			}else{
				layer.msg('请同意短信发送条款',{'icon':0});
			}
		},
		clearTime:function(){
			$("#chooseTime").val('');
			$("#btnTiming").show();
			$("#btnTimingout").hide();
			$("#btnSmsSend").html('发送');
		},
		haveCollection:function(){
			tableLoad.tableLoadFunction();
			layer.open({
				type: 1,
				title: '收藏短信',
				skin: 'layui-layer-rim',
				area: ['850px', '500px'],
				shade: 0.3,
				content: $("#contentList"),
				btn: ['取消']
			});
		}
	}
})
	Date.prototype.Format = function (fmt) { // author: meizz
		var o = {
			"M+": this.getMonth() + 1, // 月份
			"d+": this.getDate(), // 日
			"h+": this.getHours(), // 小时
			"m+": this.getMinutes(), // 分
			"s+": this.getSeconds(), // 秒
			"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
			"S": this.getMilliseconds() // 毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				return fmt;
	}

	function smsLength() {
				var combo1=vue.qianming;
				var smsMaxLength = 70;
				var oSmsText = $("#desc");
				var smsContent = oSmsText.val();
				var smsLen = smsContent.length;
				var smsSign = combo1.length;

				//退订提示
				var unsubscribe = " 退订回T";

				var finalLen = smsLen + smsSign + unsubscribe.length;
				if (finalLen > smsMaxLength && finalLen <= 140) {
					$("#smsWordCount").html("2").css("color", "red").parent().attr("rel", "超出长度按<span style='color:red'> 2 </span>条计费，但接收方手机中显示为<span style='color:red'> 1 </span>条");
					$("#smsWordNum").html((140 - finalLen)).css("color", "red");
				}
				if (finalLen <= smsMaxLength) {
					$("#smsWordCount").html("1").css("color", "#0088cc").parent().attr("rel", "当前短信长度按1条计费");
					$("#smsWordNum").html((smsMaxLength - finalLen)).css("color", "#333");
				}
				if (finalLen > 140) {
					smsContent = smsContent.substr(0, 140 - smsSign - unsubscribe.length);
					oSmsText.val(smsContent);
				}

				//添加退订提示
				if (smsContent != "") {
					var preSms = combo1;
					var normalSmsText = preSms + smsContent + unsubscribe;
					var firstOfAllSmsText = preSms + smsContent.substr(0, smsMaxLength - preSms.length - unsubscribe.length);
					var secondOfAllSmsText = smsContent.substr(smsMaxLength - preSms.length - unsubscribe.length, smsMaxLength) + unsubscribe;

					if (normalSmsText.length > smsMaxLength) {
						//总长度大于单条最大长度

						// 第一条
						$("#preViewSms").html(firstOfAllSmsText).show();

						// 第二条
						$("#preViewSms-2").html(secondOfAllSmsText).show();
					} else {
						//总长度小于单条最大长度

						// 单条
						$("#preViewSms").html(normalSmsText).show();

						// 隐藏第二条
						$("#preViewSms-2").html("").hide();
					}
				} else {
					$("#preViewSms").html("").hide();
					$("#preViewSms-2").html("").hide();

				}
}
function verifyNumber(){
	if(event.keyCode == 13){
		var rightNumber = vue.rightNumber;
		
		var numArr = rightNumber.split(/[(\r\n)\r\n]+/);
		var phoneReg = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;
		var newRight = "";
		var rightCount = 1;
		var newWrong = vue.wrongNumber;
		var wrongCount = vue.wrongCount;
		var newnumArr=numArr.sort(); 
		for(var i=0;i<numArr.length;i++){
			if (newnumArr[i]==newnumArr[i+1]){
					newnumArr[i]="";
				}
			if(numArr[i] != ''){
				if(phoneReg.test(numArr[i])){
					$("#danger1").html((rightCount));
					rightCount = rightCount + 1;
					newRight = newRight + numArr[i] + "\n";
				}else{
					wrongCount = wrongCount +1;
					newWrong = newWrong + numArr[i] + "\n";
				}
			}
		}
		vue.rightNumber = newRight;
		//vue.rightCount = rightCount;
		vue.wrongNumber = newWrong;
		vue.wrongCount = wrongCount;
	}
}

var contentTable = {
	elem: '#contentTable'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: '360'
	,cols: [[ 
		{type:'numbers', width:100, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'configValue', minWidth:200, title: '短信内容', event: 'setSign', style:'cursor: pointer;'}
		,{minWidth:100, title: '操作', align:'center',toolbar: '#barDemo'}
	]]
	,id: 'contentTable'
	,data:[]
	,even: true
};

	
	
var tableLoad = {
	tableObj:false,
	tableLoadFunction:function(){
		var table = layui.table;
		contentTable['page'] = {
			curr: 1 
		};
		var queryCond = $("#queryCond").val();
		$.ajax({
			url:'?m=SMS&c=massSend&a=getContentList',
			dataType: 'json',
			type: "post",
			data:{
				queryCond:queryCond,
			},
			success:function(data){
				vue.getData = data;
				if(data){
					if(!tableLoad.tableObj){
						for(var i=0;i<data.length;i++){
							contentTable.data.push(data[i]);
						}
			
						tableLoad.tableObj = table.render(contentTable);
					}else{
						contentTable.data = [];
						for(var i=0;i<data.length;i++){
							contentTable.data.push(data[i]);
						}
				
						tableLoad.tableObj.reload(contentTable);
					}
				}else{
					table.render(contentTable);
					tableLoad.tableObj.reload();
				}
			}
		})
	}
};
















  










































