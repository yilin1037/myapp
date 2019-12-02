var behalf = new Vue({
	el: '#behalf',
	data: {
		
	},
	mounted: function() {
		var self = this;
		
		//日期选择器=======================================================================================================
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {								//=========
            var $ = layui.jquery, element = layui.element, layer = layui.layer ;								//=========
            var form = layui.form(),layer = layui.layer,layedit = layui.layedit,laydate = layui.laydate;		//=========
            // 初始化表格																						//=========
            var jqtb = $('#dateTable').DataTable({																//=========
                "`dom": '<"top">rt<"bottom"flp><"clear">',														//=========
                "autoWidth": false,                     // 自适应宽度											//=========
                "paging": true,																					//=========
                "pagingType": "full_numbers",																	//=========
                "processing": true,																				//=========
                "serverSide": true,//开启服务器获取数据															//=========
                "fnServerParams": function (aoData) {															//=========
                },																								//=========
                //请求url																						//=========
                "sAjaxSource": "index.php?m=system&c=message&a=getChildAccount",								//=========
                // 初始化表格																					//=========
            });																									//=========
																												//=========
        });																										//=========
		//日期选择器结束===================================================================================================
		
		$.ajax({
			url: "/index.php?m=system&c=setUp&a=getLabel",
			type: 'post',
			data: {},
			dataType: 'json',
			success: function (data) {
				
			}
		});
		
	},
	methods: {
		show:function(){
			var self = this;
			layer.open({
				type: 1,
				title: '选择默认发货地址',
				skin: 'layui-layer-rim', //加上边框
				area: ['700px', '550px'], //宽高
				shade: 0.3,
				content: $("#edit-pages"),
				cancel: function (index, layero) {
					
				}
			});
		},
		
		cancel:function(){
			layer.closeAll();
			
		}
	}
});