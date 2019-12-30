var flow = new Vue({
	el: '#flow',
	data: {
			
		shopArr:[],
		expressArr:[],
		shopid:"",
		express_type:"",
		autoMerge:0,
		uploadInst:"",
		error:[],
	},
	mounted: function() {
		var self = this;
		
		$.ajax({																																													
			url: "/index.php?m=system&c=orderImport&a=getShop",																																		
			type: 'post',																																											
			data: {},																																												
			dataType: 'json',																																										
			success: function (data) {																																								
				self.shopArr = data;																																								
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

	},
	methods: {
		jage: function () {
			var self = this;
			event.stopPropagation();
			var shopid = $("#shop").val();
			var express_type = $("#express").val();
			var autoMerge = $("#autoMerge").val();

			layui.use(['element', 'layer', 'laydate', 'upload'], function () {
				var $ = layui.jquery, element = layui.element, layer = layui.layer, laydate = layui.laydate,
					upload = layui.upload;

				if (shopid == "") {
					layer.msg("请选择店铺", {
						icon: 0,
						time: 2000
					});
					return
				}

				if (express_type == "") {
					layer.msg("请选择快递", {
						icon: 0,
						time: 2000
					});
					return
				}

			});

		}
	}
});

var uploadInst;
function expressChange(value){
	flow.express_type = value;
	var shopid = $("#shop").val();
	var express_type = $("#express").val();
	
	if(typeof(uploadInst) == 'undefined'){
		$("#upload_up").css("display","none");


		layui.use(['element','layer','laydate','upload'], function(){


			var time = new Date().getTime();


			var $ = layui.jquery,element = layui.element,layer=layui.layer,laydate = layui.laydate,upload = layui.upload;



			uploadInst = upload.render({
					elem: '#upload' //绑定元素
					,url: '/index.php?m=system&c=delivery&a=orderExcelInput' //上传接口
					,accept: 'file'
					,exts: 'xls|xlsx'
					,data:{shopid: flow.shopid, express_type: flow.express_type, autoMerge: flow.autoMerge}
					,before: function(obj){
						uploadInst.config.data.shopid= flow.shopid;
						uploadInst.config.data.express_type= flow.express_type;
						uploadInst.config.data.autoMerge= flow.autoMerge;

					$("#upload_progress").show();

					var Interval = setInterval(function(){
						$.ajax({
							url: "/index.php?m=system&c=delivery&a=getOrderImportPer",
							type: 'post',
							data: {time: time},
							dataType: 'json',
							success: function (data) {
								if(data){
									layui.use('element', function(){
										element.progress('orderImport', data.per + '%');
										$("#progress-title").html(data.msg);
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
					}
					,done: function(res){
						$("#upload_progress").hide();
						//上传完毕回调
						flow.error = res.errorList;
						if(res.errorList){
							layer.open({																																											
								type: 1,																																											
								title: '失败订单',																																									
								skin: 'layui-layer-rim', //加上边框																																					
								area: ['800px', '500px'], //宽高																																					
								shade: 0.3,																																											
								content: $("#edit-pages2"),	
								btn: [ '关闭']
								,yes: function(index, layero){
									location.reload();
								},
								success:function(){
								}
							});
							
							layer.confirm('是否下载本地导入异常订单?', {
								btn: ['确认','取消'] //按钮
							}, function(index){
								var url = "/xls/" + res.fileName;
								$("#ifile").attr('src',url);
								layer.close(index);
							});
							
						}else{
							if(res.code && res.code == 'error')
							{
								layer.msg(res.msg,{
									icon: 2,
									time: 2000
								});	
							}
							else
							{
								layer.msg("导入成功",{
									icon: 1,
									time: 2000
								});
								
								setTimeout(function(){
									location.reload();
								},2000)	
							}
						}	
					}
				});
		});
	}
}

function shopChange(value){
	flow.shopid = value;
}

function autoMergeChange(value){
	flow.autoMerge = value;
}
