var tableList = new Vue({
	el: '#tableList',
	data: {
		data:[],
	},
	mounted: function() {
		var self = this;
		
		//======================================================================================日期选择器=======================================================================================================
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {																													//===========
            var $ = layui.jquery, element = layui.element, layer = layui.layer ;																														//===========
           //触发事件
		  
																																														//===========
																																																	//===========
        });	
																																														//===========
		//======================================================================================日期选择器结束===================================================================================================
		
		//=====================这段代码要放到页面表格数据请求（ajax）成功的回调函数里，页面的复选框样式才会生效==================================
		$(document).ready(function(){
			$('.skin input').iCheck({
				checkboxClass: 'icheckbox_minimal',
				radioClass: 'iradio_minimal',
				increaseArea: '20%'
			});
		});	
		//========================================================================================================================================
	},
	methods: {
		
		edit_1:function(){
			layer.open({																																											
				type: 1,																																											
				title: '商品改码上架',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['900px', '500px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#page1"),																																							
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					
					//layer.close(index);
				}
				,btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {																																					
																																																	
				}																																													
			});
		}
	},
																																																	
});	


$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});	

																																																
