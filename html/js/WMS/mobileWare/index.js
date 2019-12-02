var flow = new Vue({
	el: '#flow',
	data: {
		index:'storage',
		filter: '-1',
		checkBox:[]
	}
})
var active = {};
layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,upload = layui.upload //上传
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;	
	
	table.render({
		elem: '#dataList'
		,url: '/?m=WMS&c=mobileWare&a=getMatchInventory'
		,height: 'full-70'
		,cols: [[ //标题栏
			{type:'numbers', width:100, title: '序号'}
			,{field:'show_tid', width:200, title: '订单号'}
			,{field:'prd_no', minWidth:200, title: '商品编码'}
			,{field:'sku_name', minWidth:200, title: '商品属性'}
			,{field:'more_code', width:200, title: '群单码'}
			,{field:'remark', minWidth:200, title: '备注'}
			,{field:'nums', width:100, title: '数量'}
		]]
		,id: 'dataList'
		,skin: 'row' //表格风格
		,even: true
		,page: true //是否显示分页
		,limits: [50, 100, 200]
		,limit: 50 //每页默认显示的数量
	});
	
	var $ = layui.$; 
	active = {
		reload: function(){
			var tid = $('#tid').val();
			var prd_no = $('#prd_no').val();
			var more_code = $('#more_code').val();
			table.reload('dataList', {
				page: {
					curr: 1 //重新从第 1 页开始
				}
				,where: {
					tid: tid,
					prd_no: prd_no,
					more_code: more_code,
				}
			});
		}
	};
})

function searchBtn(){
    active['reload'] ? active['reload'].call(this) : '';
}

$("#reset").click(function(){
	$("#tid").val("");
	$("#prd_no").val("");
	$("#more_code").val("");
})
