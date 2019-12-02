
var vueObj = new Vue({
    el: '#app',
    data: {
        refundItems:[],
    },
    mounted: function () {
        layui.use(['form', 'layedit', 'laydate', 'element'], function(){
            var element = layui.element();
			var form = layui.form();
            loadRefundConfig();
        });
    },
    methods: {
        addRefundType:function(){
			$("#pages1-refundType").val("");
			
            layer.open({																																											
				type: 1,																																											
				title: '添加问题描述',																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['200px', '180px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#edit-pages1"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var refundType = $("#pages1-refundType").val();
					if(refundType == ""){
						layer.msg("请输入问题描述",{
							icon: 2,
							time: 1000
						});
						return false;
					}
					execAjax({
						m:'afterSale',
						c:'unpacking',
						a:'addRefundTitle',
						data:{refundType: refundType},
						success:function(data){
							if(data.code == 'ok'){
								loadRefundConfig();
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
		delRefundType:function(refundType){
			execAjax({
				m:'afterSale',
				c:'unpacking',
				a:'delRefundTitle',
				data:{refundType: refundType},
				success:function(data){
					loadRefundConfig();
				}
			});
		},
    }
});

function loadRefundConfig(){
    execAjax({
        m:'afterSale',
        c:'unpacking',
        a:'getRefundTitleConfig',
        data:{},
        success:function(data){
            vueObj.refundItems = data;
        }
    });
}