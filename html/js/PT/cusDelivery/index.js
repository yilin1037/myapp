var flow = new Vue({
	el: '#flow',
	data: {
		dataList:[],
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
	
	//开始时间
	laydate.render({
		elem: '#start_time'
	});
	//结束时间
	laydate.render({
		elem: '#end_time'
	});
	
	table.render({
		elem: '#dataList'
		,url:'?m=PT&c=cusDelivery&a=getData'
		,skin: 'row'
		,page: true 
		,limits: [50, 100, 200]
		,limit: 50 
		,cellMinWidth: 80
		,height: 'full-100'
		,cols: [[
			{type:'numbers', width:50}
			,{field:'pc_no', width:150, title: '销售单号'}
			,{field:'cus_no', width:150, title: '客户编号'}
			,{field:'prd_no', width:150, title: '商品编码'}
			,{field:'prd_sku_no', width:150, title: '商品SKU编码'}
			,{field:'prd_name', minWidth:150, title: '商品名称'}
			,{field:'prd_sku_name', width:150, title: '商品属性'}
			,{field:'create_time', width:150, title: '出库时间'}
			,{field:'qty', width:100, title: '数量'}
			,{field:'price', width:100, title: '单价'}
			,{field:'total_fee', width:100, title: '总额'}
			,{field:'prd_loc', width:100, title: '货位'}
			,{field:'up_cst', width:100, title: '成本'}
		]]
		,id: 'dataList'
		,even: true
	});
})

//回车搜索
function searchTable(){
	var table = layui.table;
	var $ = layui.$; 
	var active = {
		reload: function(){
			var pc_no = $('#pc_no').val();
			var prd_no = $('#prd_no').val();
			var start_time = $('#start_time').val();
			var end_time = $('#end_time').val();
			table.reload('dataList', {
				page: {
					curr: 1
				}
				,where: {
					pc_no: pc_no,
					prd_no: prd_no,
					start_time: start_time,
					end_time: end_time,
				}
			});
		}
	};
	active['reload'] ? active['reload'].call(this) : '';
}

function searchReset(){
	$("#pc_no").val("");
	$("#prd_no").val("");
	var start_time = $("#start_time_hidden").val();
	$("#start_time").val(start_time);
	var end_time = $("#end_time_hidden").val();
	$("#end_time").val(end_time);
}












