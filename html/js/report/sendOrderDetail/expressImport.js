var flow = new Vue({
	el: '#flow',
	data: {
		uploadInst:"",
		error:[],
	},
	mounted: function() {
		var self = this;
		
		setTimeout(function(){
			shopChange();
		},1000)
	},
	methods: {
		jage:function(){
			var self = this;
			event.stopPropagation();
		}
	}
});

function shopChange(){
	$("#upload_up").css("display","none");
	layui.use(['element','layer','laydate','upload'], function(){
		var $ = layui.jquery,element = layui.element,layer=layui.layer,laydate = layui.laydate,upload = layui.upload;
		var uploadInst = upload.render({
				elem: '#upload' //绑定元素
				,url: '/index.php?m=system&c=delivery&a=reconExcelInput'//上传接口
				,accept: 'file'
				,exts: 'xls|xlsx'
				,done: function(res){
					//上传完毕回调
					layer.msg("导入成功",{
						icon: 1,
						time: 2000
					});
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
					}else{
						setTimeout(function(){
							location.reload();
						},1000)
					}
					
				}
			});
	});
}


layui.use(['element','layer','laydate','upload'], function(){
	var $ = layui.jquery,element = layui.element,layer=layui.layer,laydate = layui.laydate,upload = layui.upload;
	//单号回收
	upload.render({
		elem: '#numberRecoveryUpload' //绑定元素
		,url: '/index.php?m=system&c=delivery&a=numberRecoveryExcelInput'//上传接口
		,accept: 'file'
		,exts: 'xls|xlsx'
		,done: function(res){
			//上传完毕回调
			console.log(res);
			layer.msg("导入成功",{
				icon: 1,
				time: 2000
			});
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
			}else{
				setTimeout(function(){
					location.reload();
				},1000)
			}

		}
	});

});

