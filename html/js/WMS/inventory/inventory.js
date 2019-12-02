var flow = new Vue({
	el: '#flow',
	data: {
		dataList:[], //当前扫描的成功返回的数据
	}
})

layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,upload = layui.upload //上传
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;
})

//扫描商品条码
function scanProInventory(){
	var prdBarcode = $("#prdBarcode").val();
	$(".geNum").css("display","block");
	$(".flowLeft").css("display","block");
	$.ajax({
		url:'?m=WMS&c=Storage&a=prdSerialTwoCheck',
		dataType: 'json',
		type: "post",
		data:{
			serial_no:prdBarcode
		},
		success:function(data){
			if(data.code == 'ok'){
				$("#prdBarcode").val("");
				flow.dataList = data.data;
				layer.msg(data.msg);
				if(flow.dataList.itm){
					speckText("格"+flow.dataList.itm);
				}else{
					speckText("格空");
				}
			}else{
				layer.msg(data.msg);
				speckText(data.msg);
			}
		}
	})
}