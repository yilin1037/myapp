var tableList = new Vue({
	el: '#tableList',
	data: {
		order:[],
		refundTitleItems:[],
	},
	mounted: function() {
		var self = this;
		$("#unique_code").focus();
		execAjax({
			m:'system',
			c:'pendingOrder',
			a:'getRefundTitleConfig',
			data:{list : 'T'},
			success:function(data){
				self.refundTitleItems = data;
			}
		});
	},
	methods: {
		getTid:function(){
			var self = this;
			if(event.keyCode==13){
				var isPending = "T";
				if($("#pending").is(':checked') == true){
					isPending = "T";
				}else if($("#cancelPending").is(':checked') == true){
					isPending = "F";
				}else if($("#soldOut").is(':checked') == true){
					isPending = "soldOut";
				}
				var note=$('#note').val();
                var unique_code = $("#unique_code").val();
				$.ajax({
					url: "/index.php?m=system&c=pendingOrder&a=getData",
					type: 'post',
					data: {unique_code:unique_code,isPending:isPending,note:note},
					dataType: 'json',
					success: function (data) {
						$("#unique_code").val("");
						if(data.result == "send"){
							layui.use('layer', function(){
							    var layer = layui.layer;
								layer.msg("此订单已发货",{
									icon: 0,
									time: 2000
								});
							});
							speckText("此订单已发货");
						}else if(data.result == '0'){
							layui.use('layer', function(){
							    var layer = layui.layer;
								layer.msg("无此订单",{
									icon: 0,
									time: 2000
								});
							});
							speckText("未通过");
						}else{
							//如果data['reMsg']存在 证明有退款
							var oFound = "";
							if(data['reMsg']){
								oFound = data['reMsg']+" ";
							}
							if(isPending == "T"){
								layui.use('layer', function(){
									var layer = layui.layer;
									if(data.result.length == 0){
										layer.msg((oFound!=''?oFound:data['msg']),{
											icon: 1,
											time: 2000
										});
									}else{
										layer.msg((oFound!=''?oFound:"挂单成功"),{
											icon: 1,
											time: 2000
										});
									}
								});
								if(data.num == "0"){
									if(data.number == 0){
										speckText(oFound!=''?oFound:"通过此单可发货");
									}else{
										speckText(oFound!=''?oFound:"通过此单可发货有赠品");
									}
								}else{
									if(data.result.length == 0){
										speckText(oFound!=''?oFound:data['msg']);
									}else{
										var mode_code = data.result[0]['more_code'];
										if(mode_code.length > 1){
											//var speak = mode_code.replace(/[^0-9-]+/g, '');
											var speak = mode_code.replace("-","杠");
											//var tes = mode_code.substring(mode_code.length-4);
											speckText(oFound!=''?oFound:"通过"+speak+"");
										}else{
											speckText(oFound!=''?oFound:"通过"+mode_code+"");
										}
									}
								}
								
							}else if(isPending == "F"){
								layui.use('layer', function(){
									var layer = layui.layer;
									if(data.result.length == 0){
										layer.msg((oFound!=''?oFound:data['msg']),{
											icon: 1,
											time: 2000
										});
									}else{
										layer.msg(oFound!=''?oFound:"取消挂单成功",{
											icon: 1,
											time: 2000
										});
									}
								});
								if(data.result.length == 0){
									speckText(oFound!=''?oFound:data['msg']);
								}else{
									speckText(oFound!=''?oFound:"取消挂单成功");
								}
							}else if(isPending == "soldOut"){
								layui.use('layer', function(){
								  var layer = layui.layer;
									if(data.result.length == 0){
										layer.msg(oFound!=''?oFound:data['msg'],{
											icon: 1,
											time: 2000
										});
									}else{
										layer.msg(oFound!=''?oFound:"下架成功",{
											icon: 1,
											time: 2000
										});
									}
								});
								if(data.result.length == 0){
									speckText(oFound!=''?oFound:data['msg']);
								}else{
									speckText(oFound!=''?oFound:"通过");
								}
							}
							
							self.order = data.result[0];
							$(".showTable").css("display","block");
						}
					}
				});
            }
		},
		titleAdd:function(){
			layui.use('layer', function(){
			 var layer = layui.layer;
			 var self = this;
			layer.open({
                title :'添加问题描述',
                type: 2,
                shade: 0.3,
                area: ['350px', '450px'],
                maxmin: false,
                content: '?m=system&c=pendingOrder&a=refundTitle'
            }); 
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
	$('#pending').on('ifChecked', function(event){
		$("#layprintTplBqShopDiv").hide();
	});
	$('#cancelPending').on('ifChecked', function(event){
		$("#layprintTplBqShopDiv").hide();
	});	
	$('#soldOut').on('ifChecked', function(event){
		$("#layprintTplBqShopDiv").show();
	});	
});