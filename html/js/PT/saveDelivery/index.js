var flow = new Vue({
	el: '#flow',
	data: {
		data:[],
	},
	mounted: function() {
		var oHeight = $(window).height();
		$("#tabList").css('height',(oHeight-50)+'px');
		$(window).ready(function(){
			$("#iframeOne").html('<iframe src="?m=PT&c=singleDelivery&a=index" style="width: 100%; height: 100%; border: 0px solid;"></iframe>');
		})
		layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
			var laydate = layui.laydate //日期
				,laypage = layui.laypage //分页
				layer = layui.layer //弹层
				,upload = layui.upload //上传
				,form = layui.form //表单
				,element = layui.element; //元素操作
			var table = layui.table;
			
			element.on('tab(iframeTableChange)', function(){
				var layId = this.getAttribute('lay-id');
				switch( layId ){
					case 'iframeOne':
						$("#iframeOne").html('<iframe src="?m=PT&c=singleDelivery&a=index" style="width: 100%; height: 100%; border: 0px solid;"></iframe>');
						break;
					case 'iframeTwo':
						$("#iframeTwo").html('<iframe src="?m=PT&c=moreDelivery&a=index" style="width: 100%; height: 100%; border: 0px solid;"></iframe>');
						break;
					case 'iframeThree':
						$("#iframeThree").html('<iframe src="?m=PT&c=moreInspection&a=index" style="width: 100%; height: 100%; border: 0px solid;"></iframe>');
						break;
				}
			})
			
		})
	}
});
