
var vueObj = new Vue({
    el: '#app',
    data: {
        statusItems:[],
    },
    mounted: function () {
        layui.use(['form', 'layedit', 'laydate', 'element'], function(){
            var element = layui.element();
			var form = layui.form();
            loadStatusConfig();
        });
    },
    methods: {
        addSignStatus:function(){
			$("#pages1-statusName").val("");
			
            layer.open({
				type: 1,																																											
				title: '添加标记状态',																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['200px', '180px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#edit-pages1"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var statusName = $("#pages1-statusName").val();
					if(statusName == ""){
						layer.msg("请输入标记状态",{
							icon: 2,
							time: 1000
						});
						return false;
					}
					execAjax({
						m:'system',
						c:'delivery',
						a:'addSignStatus',
						data:{statusName: statusName},
						success:function(data){
							if(data.code == 'ok'){
								loadStatusConfig();
								layer.close(index);
							}else{
								layer.msg(data.msg,{
									icon: 2,
									time: 1000
								});
							}
						}
					});
				},
				btn2: function(index, layero){
					
				}																																													
			});
        },
		delSignStatus:function(id){
			execAjax({
				m:'system',
				c:'delivery',
				a:'delSignStatus',
				data:{id: id},
				success:function(data){
					if(data.code == 'ok'){
						loadStatusConfig();
					}else{
						layer.msg(data.msg,{
							icon: 2,
							time: 1000
						});
					}
				}
			});
		},
    }
});

function loadStatusConfig(){
    execAjax({
        m:'system',
        c:'delivery',
        a:'getSignStatus',
        data:{},
        success:function(data){
            vueObj.statusItems = data;
        }
    });
}