var message = new Vue({
	el: '#message',
	data: {
		arr:[]
	},
	mounted: function() {
		var self = this;
		
		$.ajax({
			url: "/index.php?m=system&c=message&a=searchShopid",
			type: 'post',
			data: {},
			dataType: 'json',
			success: function (data) {
				if(data){
					self.arr = data;
					setTimeout(function(){
						sear("sendGoods","combo","msgContent","Preview","textNum","EFF_ID","payment_begin","payment_end","sendTimeStart","sendTimeEnd", "seller_flag", "F", "F");
					},100);
				}
			}
		});
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {
            var $ = layui.jquery, element = layui.element, layer = layui.layer ;
            var form = layui.form(),layer = layui.layer,layedit = layui.layedit,laydate = layui.laydate;
            // 初始化表格
            var jqtb = $('#dateTable').DataTable({
                "`dom": '<"top">rt<"bottom"flp><"clear">',
                "autoWidth": false,                     // 自适应宽度
                "paging": true,
                "pagingType": "full_numbers",
                "lengthMenu": [5, 10, 25, 50],
                "processing": true,
                "searching": false, //是否开启搜索
                "serverSide": true,//开启服务器获取数据
                "order": [[1, "desc"]], //默认排序
                "fnServerParams": function (aoData) {
                    aoData.push(
                        {"name": "keyword", "value": $(".layui-input").val()},
                        {"name": "keyword2", "value": $(".layui-input").val()}
                    );
                },
                //请求url
                "sAjaxSource": "index.php?m=system&c=message&a=getChildAccount",
                //服务器端，数据回调处理
                "fnServerData": function (sSource, aDataSet, fnCallback) {

                    $.ajax({
                        "dataType": 'json',
                        "type": "post",
                        "url": sSource,
                        "data": aDataSet,
                        "success": function (resp) {
                            fnCallback(resp);
                        }
                    });
                },
                // 初始化表格
                "searching": false,                     // 本地搜索
                "info": true,                           // 控制是否显示表格左下角的信息
                "stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
                "columns": [ //定义列数据来源  id, userid,username,mobile,create_login_time,STATUS
                    {'title': "", 'data': "id"},
					{'title': "订单号", 'data': "tid"},
                    {'title': "发送时间", 'data': "create_datetime"},
                    {'title': "手机号码", 'data': "phone"},//隐藏
                    {'title': "发送状态", 'data': "status"},
                    {'title': "短信字数", 'data': "len"},
                    {'title': "短信数量", 'data': "sms_num"}, // 自定义列
                    {'title': "短信内容（每70字按一条计费）", 'data': "message"} // 自定义列
                ],
                'columnDefs': [{
                    'targets': 0,
                    'searchable': false,
                    'orderable': false,
                    'width': '3%',
                    'className': 'dt-body-center',
                    'render': function (data, type, full, meta) {
                    return '<input type="checkbox" id="' + data + '" class="my-checkbox">';
                    }
                }],
                "pagingType": "full_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
                "language": {                           // 国际化
                    "sProcessing": "",
                    "sLengthMenu": "每页显示 _MENU_ 条记录",
                    "sZeroRecords": "对不起，查询不到相关数据！",
                    "sEmptyTable": "表中无数据存在！",
                    "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
                    "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
                    "sSearch": "搜索",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "上一页",
                        "sNext": "下一页",
                        "sLast": "末页"
                    }
                }
            });
            // 例:获取ids
            $("#submitSearch").click(function () {
                jqtb.ajax.reload();
            });

            //安全验证
			$.ajax({
				url: "/index.php?m=system&c=message&a=getSmsSafeInfo",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					if(data['order_type'] == 'true'){
						$("#order_type").prop('checked',true);
					}
					$("#orderPhone").attr('value',data['orderPhone']);
				}
			});

        });
	},
	methods: {
		change:function(a){
			//页面初始化
			//发货提醒界面
			if(a == "first"){
				sear("sendGoods","combo","msgContent","Preview","textNum","EFF_ID","payment_begin","payment_end","sendTimeStart","sendTimeEnd", "seller_flag", "F", "F");
				$(".ddp1").css({
					"color":"orange",
					"borderColor":"orange"
				});
				$(".ddp2").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp3").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp4").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp5").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp6").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp7").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp1>i").css("backgroundImage","url('images/remind2.png')");
				$(".ddp2>i").css("backgroundImage","url('images/remind4.png')");
				$(".ddp3>i").css("backgroundImage","url('images/return1.png')");
				$(".ddp4>i").css("backgroundImage","url('images/cui1.png')");
				$(".ddp5>i").css("backgroundImage","url('images/ping1.png')");
				$(".ddp6>i").css("backgroundImage","url('images/safe1.png')");
				$(".ddp7>i").css("backgroundImage","url('images/shortage1.png')");
				$(".page1").css("display","block");
				$(".page2").css("display","none");
				$(".page3").css("display","none");
				$(".page4").css("display","none");
				$(".page5").css("display","none");
				$(".page6").css("display","none");
				$(".page7").css("display","none");
				$(".le").html("发货提醒");
				$(".le").addClass("act");
				$(".ri").removeClass("act");
				$(".changeLeft").css("display","block");
				$(".changeRight").css("display","none");
			}
			//发货提醒界面结束 
			//延迟发货提醒界面
			else if(a == "second"){
				sear("delay","combo1","msgContent1","Preview1","textNum1","EFF_ID1","payment_begin1","payment_end1","sendTimeStart1","sendTimeEnd1", "seller_flag1", "F", "F");																											
				$(".ddp1").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp2").css({
					"color":"orange",
					"borderColor":"orange"
				});
				$(".ddp3").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp4").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp5").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp6").css({
					"color":"black",
				});
				$(".ddp7").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp1>i").css("backgroundImage","url('images/remind1.png')");
				$(".ddp2>i").css("backgroundImage","url('images/remind3.png')");
				$(".ddp3>i").css("backgroundImage","url('images/return1.png')");
				$(".ddp4>i").css("backgroundImage","url('images/cui1.png')");
				$(".ddp5>i").css("backgroundImage","url('images/ping1.png')");
				$(".ddp6>i").css("backgroundImage","url('images/safe1.png')");
				$(".ddp7>i").css("backgroundImage","url('images/shortage1.png')");
				$(".page1").css("display","none");
				$(".page2").css("display","block");
				$(".page3").css("display","none");
				$(".page4").css("display","none");
				$(".page5").css("display","none");
				$(".page6").css("display","none");
				$(".page7").css("display","none");
				$(".le").html("延迟发货提醒");
				$(".le").addClass("act");
				$(".ri").removeClass("act");
				$(".changeLeft").css("display","block");
				$(".changeRight").css("display","none");
			}
			//延迟发货提醒界面结束 
			//延迟发货提醒界面
			else if(a == "third"){
				sear("splitSend","combo2","msgContent2","Preview2","textNum2","EFF_ID2","payment_begin2","payment_end2","sendTimeStart2","sendTimeEnd2", "seller_flag2", "F", "F");										
				$(".ddp1").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp2").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp3").css({
					"color":"orange",
					"borderColor":"orange"
				});
				$(".ddp4").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp5").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp6").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp7").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp1>i").css("backgroundImage","url('images/remind1.png')");
				$(".ddp2>i").css("backgroundImage","url('images/remind4.png')");
				$(".ddp3>i").css("backgroundImage","url('images/return2.png')");
				$(".ddp4>i").css("backgroundImage","url('images/cui1.png')");
				$(".ddp5>i").css("backgroundImage","url('images/ping1.png')");
				$(".ddp6>i").css("backgroundImage","url('images/safe1.png')");
				$(".ddp7>i").css("backgroundImage","url('images/shortage1.png')");
				$(".page1").css("display","none");
				$(".page2").css("display","none");
				$(".page3").css("display","block");
				$(".page4").css("display","none");
				$(".page5").css("display","none");
				$(".page6").css("display","none");
				$(".page7").css("display","none");
				$(".le").html("拆单发货提醒");
				$(".le").addClass("act");
				$(".ri").removeClass("act");
				$(".changeLeft").css("display","block");
				$(".changeRight").css("display","none");
			}
			//延迟发货提醒界面结束
			//催付提醒界面
			else if(a == "forth"){
				sear("reminder","combo3","msgContent3","Preview3","textNum3","EFF_ID3","","","","", "", "timeNum", "F");
				$(".ddp1").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp2").css({
					"color":"black",
					"borderColor":"#ddd"
				});	
				$(".ddp3").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp4").css({
					"color":"orange",
					"borderColor":"orange"
				});	
				$(".ddp5").css({
					"color":"black",
					"borderColor":"#ddd"
				});	
				$(".ddp6").css({
					"color":"black",
					"borderColor":"#ddd"
				});	
				$(".ddp7").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp1>i").css("backgroundImage","url('images/remind1.png')");
				$(".ddp2>i").css("backgroundImage","url('images/remind4.png')");
				$(".ddp3>i").css("backgroundImage","url('images/return1.png')");
				$(".ddp4>i").css("backgroundImage","url('images/cui2.png')");	
				$(".ddp5>i").css("backgroundImage","url('images/ping1.png')");	
				$(".ddp6>i").css("backgroundImage","url('images/safe1.png')");	
				$(".ddp7>i").css("backgroundImage","url('images/shortage1.png')");
				$(".page1").css("display","none");	
				$(".page2").css("display","none");	
				$(".page3").css("display","none");	
				$(".page4").css("display","block");	
				$(".page5").css("display","none");	
				$(".page6").css("display","none");
				$(".page7").css("display","none");
				$(".le").html("催付提醒");	
				$(".le").addClass("act");	
				$(".ri").removeClass("act");
				$(".changeLeft").css("display","block");
				$(".changeRight").css("display","none");
			}
			//催付提醒界面结束
			
			//催付提醒界面
			else if(a == "five"){
				sear("evaluation","combo4","msgContent4","Preview4","textNum4","EFF_ID4","","","","", "", "timeNum1", "timeType");
				$(".ddp1").css({	
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp2").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp3").css({
					"color":"black",
					"borderColor":"#ddd"
				});	
				$(".ddp4").css({
					"color":"black",
					"borderColor":"#ddd"
				});	
				$(".ddp5").css({	
					"color":"orange",
					"borderColor":"orange"
				});	
				$(".ddp6").css({	
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp7").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp1>i").css("backgroundImage","url('images/remind1.png')");
				$(".ddp2>i").css("backgroundImage","url('images/remind4.png')");
				$(".ddp3>i").css("backgroundImage","url('images/return1.png')");
				$(".ddp4>i").css("backgroundImage","url('images/cui1.png')");	
				$(".ddp5>i").css("backgroundImage","url('images/ping2.png')");	
				$(".ddp6>i").css("backgroundImage","url('images/safe1.png')");	
				$(".ddp7>i").css("backgroundImage","url('images/shortage1.png')");
				$(".page1").css("display","none");
				$(".page2").css("display","none");
				$(".page3").css("display","none");
				$(".page4").css("display","none");
				$(".page5").css("display","block");
				$(".page6").css("display","none");	
				$(".page7").css("display","none");
				$(".le").html("评价提醒");
				$(".le").addClass("act");
				$(".ri").removeClass("act");
				$(".changeLeft").css("display","block");
				$(".changeRight").css("display","none");
			}											
			// 催付提醒界面结束 
			
			// 安全认证界面
			else if(a == "six"){
				
				$(".ddp1").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp2").css({
					"color":"black",
					"borderColor":"#ddd"
				});	
				$(".ddp3").css({	
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp4").css({
					"color":"black",
					"borderColor":"#ddd"
				});	
				$(".ddp5").css({
					"color":"black",
					"borderColor":"#ddd"
				});	
				$(".ddp6").css({
					"color":"orange",
					"borderColor":"orange"
				});	
				$(".ddp7").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp1>i").css("backgroundImage","url('images/remind1.png')");
				$(".ddp2>i").css("backgroundImage","url('images/remind4.png')");
				$(".ddp3>i").css("backgroundImage","url('images/return1.png')");
				$(".ddp4>i").css("backgroundImage","url('images/cui1.png')");	
				$(".ddp5>i").css("backgroundImage","url('images/ping1.png')");	
				$(".ddp6>i").css("backgroundImage","url('images/safe2.png')");
				$(".ddp7>i").css("backgroundImage","url('images/shortage1.png')");
				$(".page1").css("display","none");	
				$(".page2").css("display","none");	
				$(".page3").css("display","none");	
				$(".page4").css("display","none");	
				$(".page5").css("display","none");	
				$(".page6").css("display","block");	
				$(".page7").css("display","none");	
				$(".le").html("安全认证");
				$(".le").addClass("act");
				$(".ri").removeClass("act");
				$(".changeLeft").css("display","block");
				$(".changeRight").css("display","none");
			}
			// 安全认证界面结束 
			// 缺货提醒界面
			else if(a == "seven"){							
				sear("soldOut","combo5","msgContent5","Preview5","textNum5","EFF_ID5","payment_begin5","payment_end5","sendTimeStart5","sendTimeEnd5", "seller_flag5", "F", "F");	
				$(".ddp1").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp2").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp3").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp4").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp5").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp6").css({
					"color":"black",
					"borderColor":"#ddd"
				});
				$(".ddp7").css({
					"color":"orange",
					"borderColor":"orange"
				});
				$(".ddp1>i").css("backgroundImage","url('images/remind1.png')");
				$(".ddp2>i").css("backgroundImage","url('images/remind4.png')");
				$(".ddp3>i").css("backgroundImage","url('images/return1.png')");
				$(".ddp4>i").css("backgroundImage","url('images/cui1.png')");	
				$(".ddp5>i").css("backgroundImage","url('images/ping1.png')");	
				$(".ddp6>i").css("backgroundImage","url('images/safe2.png')");
				$(".ddp7>i").css("backgroundImage","url('images/shortage2.png')");
				$(".page1").css("display","none");	
				$(".page2").css("display","none");	
				$(".page3").css("display","none");	
				$(".page4").css("display","none");	
				$(".page5").css("display","none");	
				$(".page6").css("display","none");	
				$(".page7").css("display","block");
				$(".le").html("缺货提醒");
				$(".le").addClass("act");
				$(".ri").removeClass("act");
				$(".changeLeft").css("display","block");
				$(".changeRight").css("display","none");
			}
			//缺货提醒界面结束
			//页面初始化结束
		},
		// 短信模板点击同步预览
		radioClick:function(a){	
			var toggle = event.currentTarget.value;	
			if(a == "first"){
				$(".msgContent").val(toggle);
				strReplace(toggle, "Preview", "textNum");
			}else if(a == "second"){
				$(".msgContent1").val(toggle);
				strReplace(toggle, "Preview1", "textNum1");
			}else if(a == "third"){
				$(".msgContent2").val(toggle);
				strReplace(toggle, "Preview2", "textNum2");
			}else if(a == "forth"){	
				$(".msgContent3").val(toggle);
				strReplace(toggle, "Preview3", "textNum3");
			}else if(a == "five"){
				$(".msgContent4").val(toggle);
				strReplace(toggle, "Preview4", "textNum4");
			}else if(a == "seven"){
				$(".msgContent5").val(toggle);
				strReplace(toggle, "Preview5", "textNum5");
			}
		},
		// 短信模板点击同步预览结束 
		
		// 插入标签点击同步预览
		inTopClick:function(a){
			var toggle = event.currentTarget.value;
			if(a == "first"){	
				$(".msgContent").insertAtCaret(toggle);
				var str = $(".msgContent").val();
				strReplace(str, "Preview", "textNum");
			}else if(a == "second"){
				$(".msgContent1").insertAtCaret(toggle);
				var str = $(".msgContent1").val();
				strReplace(str, "Preview1", "textNum1");
			}else if(a == "third"){
				$(".msgContent2").insertAtCaret(toggle);
				var str = $(".msgContent2").val();
				strReplace(str, "Preview2", "textNum2");
			}else if(a == "forth"){
				$(".msgContent3").insertAtCaret(toggle);
				var str = $(".msgContent3").val();	
				strReplace(str, "Preview3", "textNum3");
			}else if(a == "five"){
				$(".msgContent4").insertAtCaret(toggle);
				var str = $(".msgContent4").val();
				strReplace(str, "Preview4", "textNum4");
			}else if(a == "seven"){
				$(".msgContent5").insertAtCaret(toggle);
				var str = $(".msgContent5").val();
				strReplace(str, "Preview5", "textNum5");
			}
		},
		//插入标签点击同步预览结束
		
		//保存点击事件
		save:function(a){
			if(a == "first"){
				saveAll("sendGoods","combo","payment_begin","payment_end","sendTimeStart","sendTimeEnd","EFF_ID","textNum","msgContent","seller_flag","F","F");
			}else if(a == "second"){
				saveAll("delay","combo1","payment_begin1","payment_end1","sendTimeStart1","sendTimeEnd1","EFF_ID1","textNum1","msgContent1","seller_flag1","F","F");
			}else if(a == "third"){
				saveAll("splitSend","combo2","payment_begin2","payment_end2","sendTimeStart2","sendTimeEnd2","EFF_ID2","textNum2","msgContent2","seller_flag2","F","F");
			}else if(a == "forth"){
				var remindTime = $("#timeNum").val();
				saveAll("reminder","combo3","","","","","EFF_ID3","textNum3","msgContent3","",remindTime,"F");
			}else if(a == "five"){
				var remindTime = $("#timeNum1").val();
				var timeType = $("#timeType").val();
				saveAll("evaluation","combo4","","","","","EFF_ID4","textNum4","msgContent4","",remindTime,timeType);
			}else if(a == "seven"){
				saveAll("soldOut","combo5","payment_begin5","payment_end5","sendTimeStart5","sendTimeEnd5","EFF_ID5","textNum5","msgContent5","seller_flag5","F","F");
			}else if(a == "six") {
				var order_type = $("#order_type").prop('checked');
				var orderPhone = $("#orderPhone").val();
				console.log(order_type);
				console.log(orderPhone);
				data = {
					"order_type":order_type,
					"orderPhone":orderPhone
				}

				$.ajax({
					url: "/index.php?m=system&c=message&a=saveSmsSafe",
					type: 'post',
					data: data,
					dataType: 'json',
					success: function (data) {
						if(data['code'] == 'ok'){
							success();
						}
						else
						{
							faild();
						}
					}
				});
			}
		},
		// 保存点击事件结束
		
		btnTime:function(){
			var toggle = event.currentTarget.value;
			$("#timeNum").val(toggle);
		},
		switchDiv:function(a){
			if(a == "left"){
				$(".changeLeft").css("display","block");
				$(".changeRight").css("display","none");
				$(".le").addClass("act");
				$(".ri").removeClass("act");
			}else if(a == "right"){
				$(".changeLeft").css("display","none");
				$(".changeRight").css("display","block");
				$(".le").removeClass("act");
				$(".ri").addClass("act");
			}
		}
	}
});

function getValue(){
	sear("sendGoods","combo","msgContent","Preview","textNum","EFF_ID","payment_begin","payment_end","sendTimeStart","sendTimeEnd", "seller_flag", "F", "F");
}

function getValue1(){
	sear("delay","combo1","msgContent1","Preview1","textNum1","EFF_ID1","payment_begin1","payment_end1","sendTimeStart1","sendTimeEnd1", "seller_flag1", "F", "F");
}

function getValue2(){
	sear("splitSend","combo2","msgContent2","Preview2","textNum2","EFF_ID2","payment_begin2","payment_end2","sendTimeStart2","sendTimeEnd2", "seller_flag2", "F", "F");
}

function getValue3(){
	sear("reminder","combo3","msgContent3","Preview3","textNum3","EFF_ID3","","","","", "", "timeNum", "F");
}

function getValue4(){
	sear("evaluation","combo4","msgContent4","Preview4","textNum4","EFF_ID4","","","","", "", "timeNum1", "timeType");	
}
function getValue5(){
	sear("soldOut","combo5","msgContent5","Preview5","textNum5","EFF_ID5","payment_begin5","payment_end5","sendTimeStart5","sendTimeEnd5", "seller_flag5", "F", "F");	
}

//字符窜替换
function strReplace(str, Preview, textNum){
	var str = str.replace(/【物流公司】/g, '佳庆快递');
	var str = str.replace(/【店铺名称】/g, '佳庆旗舰店');
	var str = str.replace(/【买家昵称】/g, '会飞的猪');
	var str = str.replace(/【物流单号】/g, '1234567890123');
	var str = str.replace(/【收件人姓名】/g, '李丽丽');
	var str = str.replace(/【买家姓名】/g, '李丽丽');
	str += "【短信签名】";
	$("." + Preview).html(str);
	$("." +　textNum).html(str.length);
}
//文字同步
function strReplaceSync(str, Preview, textNum){
	
	str += "【短信签名】";
	$("." + Preview).html(str);
	$("." +　textNum).html(str.length);
}

//保存方法封装
function saveAll(type, combo, payment_begin, payment_end, sendTimeStart, sendTimeEnd, EFF_ID, textNum, msgContent, seller_flag, reminderTime, timeType){
	var data = [];
	if(type != "reminder" && type != "evaluation"){
		var sellerFlag = "";
		var payment_begin = $("#" + payment_begin).val();
		var payment_end = $("#" +　payment_end).val();
		var sendTimeStart = $("#" + sendTimeStart).val();
		var sendTimeEnd = $("#" + sendTimeEnd).val();
		$('.' + seller_flag + ' input[name="my-checkbox"]:checked').each(function(){
			sellerFlag += ($(this).val() + ",");
		});
	}
	var EFF_ID = $("#" + EFF_ID).prop("checked");              		//是否启用																				
	var textNum = $("." + textNum).html();
	var shopid = $("#" + combo).val();
	if(EFF_ID){
		EFF_ID = 1;
	}else{
		EFF_ID = 0;
	}
	var tpl_str = $("." + msgContent).val();
	if(type != "reminder" && type != "evaluation"){
		if(sendTimeStart == "" || sendTimeStart == undefined){
			alert("请填写发送时间段");
			return false;
		}
		if(sendTimeEnd == "" || sendTimeEnd == undefined){
			alert("请填写发送时间段");
			return false;
		}
	}
	if(type == "reminder" || type == "evaluation"){
		if(reminderTime == "" || reminderTime == 0){
			alert("请选择时长");
			return false;
		}
	}
	if(tpl_str == ""){
		alert("请填写短信内容");
		return false;
	}
	if(EFF_ID == 0){
		if(confirm("目前为未启用状态，是否继续？")){
		}else{
			return false;
		}
	}
	if(textNum * 1 > 500){
		alert("短信内容请输入小于500个字");
		return false;
	}
	var newData = {
		"tpl_str":tpl_str,
		"shopid": shopid,
		"type":type,
		"payment_begin":payment_begin,
		"payment_end":payment_end,
		"time_begin":sendTimeStart,
		"time_end":sendTimeEnd,
		"status":EFF_ID,
		"sellerFlag":sellerFlag,
		"reminderTime":reminderTime,
		"timeType":timeType
	}
	data.push(newData);
	$.ajax({
		url: "/index.php?m=system&c=message&a=saveRemind",
		type: 'post',
		data: {"data": data},
		dataType: 'json',
		success: function (data) {
			if(data['code'] == 'ok'){
				success();
			}
			else
			{
				faild();
			}
		}
	});
}
// 保存方法封装结束
function sear(type,combo,msgContent,Preview,textNum,EFF_ID,payment_begin,payment_end,sendTimeStart,sendTimeEnd, sellerFlag, timeNum, timeType){
	var shopid = $("#" + combo).val();
	$.ajax({
		url: "/index.php?m=system&c=message&a=searchStr",
		type: 'post',
		data: {data: type, shopid: shopid},
		dataType: 'json',
		success: function (data) {
				if(data){
					if(data.status == "1"){
						$("#" + EFF_ID).prop("checked", true);
					}else{
						$("#" + EFF_ID).prop("checked", false);
					}
					if(type != "reminder" && type != "evaluation"){
						$("#" + payment_begin).val(data.payment_begin);
						$("#" + payment_end).val(data.payment_end);
						$("#" + sendTimeStart).val(data.time_begin);
						$("#" + sendTimeEnd).val(data.time_end);
						if(data.seller_flag != "" && data.seller_flag != undefined){
							var sellerArr = data.seller_flag.split(",");
							for(var i = 0; i < sellerArr.length; i++){
								$('.' + sellerFlag + ' input[value=' + sellerArr[i] + ']').prop("checked", true);
							}
						}
					}
					if(type == "reminder"){
						$("#" + timeNum).val(data.reminder_time);
					}
					
					if(type == "evaluation"){
						$("#" + timeNum).val(data.reminder_time);
						$("#" + timeType + " option").val(data.time_type*1);
					}
					
					
					$("." + msgContent).val(data.tpl_str);
					
					strReplace(data.tpl_str, Preview, textNum);
				}else{
					if(data.status == "1"){
						$("#" + EFF_ID).prop("checked", true);
					}else{
						$("#" + EFF_ID).prop("checked", false);
					}
					if(type != "reminder" && type != "evaluation"){
						$("#" + payment_begin).val(data.payment_begin);
						$("#" + payment_end).val(data.payment_end);
						$("#" + sendTimeStart).val(data.time_begin);
						$("#" + sendTimeEnd).val(data.time_end);
						$('.' + sellerFlag + ' input[name="my-checkbox"]').each(function(){
							$(this).prop("checked", false);																
						});	
					}
					if(type == "reminder"){
						$("#" + timeNum).val(data.reminder_time);
					}
					
					if(type == "evaluation"){
						$("#" + timeNum).val(data.reminder_time);
						$("#" + timeType + " option").val(1);
					}
					
					$("." +msgContent).val(data.tpl_str);
					if(data.tpl_str != undefined){
						strReplace(data.tpl_str, Preview, textNum);
					}else if(data.tpl_str == undefined){
						$("." + Preview).html("【短信签名】");
						$("." + textNum).html(0);
					}
				}
		}
	});
}

$(".rule").mouseenter(function(){
	$(".hideDiv").css("display","block");
});

$(".rule").mouseleave(function(){
	$(".hideDiv").css("display","none");
});

function faild(){
	var div = document.createElement(div);
	div.className = "alert alert-danger";
	div.roleName = "alert";
	div.innerHTML = "保存失败";
	div.style.position = "fixed";
	div.style.left = "50%";
	div.style.top = "50%";
	div.style.marginLeft = "-44px";
	div.style.marginTop = "-26px";
	div.style.zIndex = "1000";
	document.body.appendChild(div);
	setTimeout(function(){
		document.body.removeChild(div);
	},1000);
}

function success(){
	var div = document.createElement(div);
	div.className = "alert alert-success";
	div.roleName = "alert";
	div.innerHTML = "保存成功";
	div.style.position = "fixed";
	div.style.left = "50%";
	div.style.top = "50%";
	div.style.marginLeft = "-44px";
	div.style.marginTop = "-26px";
	div.style.zIndex = "1000";
	document.body.appendChild(div);
	setTimeout(function(){
		document.body.removeChild(div);
	},1000);
}

function reloadnow(self, arr){
	$.ajax({
		url: '/index.php?m=system&c=taobaoAddress&a=search',
		type: "POST",
		dataType:"json",
		data:{},
		success:function(data){
			self.arr = data;
		}
	});
}

//光标处插入文本方法
jQuery.extend({     
/**    
 * 清除当前选择内容    
 */    
unselectContents: function(){     
	if(window.getSelection)     
		window.getSelection().removeAllRanges();     
	else if(document.selection)     
		document.selection.empty();     
}     
});     

jQuery.fn.extend({     
/**    
 * 选中内容    
 */    
selectContents: function(){     
	$(this).each(function(i){     
		var node = this;     
		var selection, range, doc, win;     
		if ((doc = node.ownerDocument) &&     
			(win = doc.defaultView) &&     
			typeof win.getSelection != 'undefined' &&     
			typeof doc.createRange != 'undefined' &&     
			(selection = window.getSelection()) &&     
			typeof selection.removeAllRanges != 'undefined')     
		{     
			range = doc.createRange();     
			range.selectNode(node);     
			if(i == 0){     
				selection.removeAllRanges();     
			}     
			selection.addRange(range);     
		}     
		else if (document.body &&     
				 typeof document.body.createTextRange != 'undefined' &&     
				 (range = document.body.createTextRange()))     
		{     
			range.moveToElementText(node);     
			range.select();     
		}     
	});     
},     
/**    
 * 初始化对象以支持光标处插入内容    
 */    
setCaret: function(){     
	if(!$.browser.msie) return;     
	var initSetCaret = function(){     
		var textObj = $(this).get(0);     
		textObj.caretPos = document.selection.createRange().duplicate();     
	};     
	$(this)     
	.click(initSetCaret)     
	.select(initSetCaret)     
	.keyup(initSetCaret);     
},     
/**    
 * 在当前对象光标处插入指定的内容    
 */    
insertAtCaret: function(textFeildValue){     
   var textObj = $(this).get(0);     
   if(document.all && textObj.createTextRange && textObj.caretPos){     
	   var caretPos=textObj.caretPos;     
	   caretPos.text = caretPos.text.charAt(caretPos.text.length-1) == '' ?     
						   textFeildValue+'' : textFeildValue;     
   }     
   else if(textObj.setSelectionRange){     
	   var rangeStart=textObj.selectionStart;     
	   var rangeEnd=textObj.selectionEnd;     
	   var tempStr1=textObj.value.substring(0,rangeStart);     
	   var tempStr2=textObj.value.substring(rangeEnd);     
	   textObj.value=tempStr1+textFeildValue+tempStr2;     
	   textObj.focus();     
	   var len=textFeildValue.length;     
	   textObj.setSelectionRange(rangeStart+len,rangeStart+len);     
	   textObj.blur();     
   }     
   else {     
	   textObj.value+=textFeildValue;     
   }     
}     
}); 
//光标处插入文本方法结束

$('.msgContent').keyup(function(e) {
	var oHtml = $(this).val();
	console.log(oHtml);
	$(".Preview").html(oHtml+"【短信签名】");
	$(".textNum").html((oHtml+"【短信签名】").length);
});
$('.msgContent1').keyup(function(e) {
	var oHtml = $(this).val();
	console.log(oHtml);
	$(".Preview1").html(oHtml+"【短信签名】");
	$(".textNum1").html((oHtml+"【短信签名】").length);
});
$('.msgContent2').keyup(function(e) {
	var oHtml = $(this).val();
	console.log(oHtml);
	$(".Preview2").html(oHtml+"【短信签名】");
	$(".textNum2").html((oHtml+"【短信签名】").length);
});
$('.msgContent3').keyup(function(e) {
	var oHtml = $(this).val();
	console.log(oHtml);
	$(".Preview3").html(oHtml+"【短信签名】");
	$(".textNum3").html((oHtml+"【短信签名】").length);
});
$('.msgContent4').keyup(function(e) {
	var oHtml = $(this).val();
	console.log(oHtml);
	$(".Preview4").html(oHtml+"【短信签名】");
	$(".textNum4").html((oHtml+"【短信签名】").length);
});





























