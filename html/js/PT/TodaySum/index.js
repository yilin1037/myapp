var flow = new Vue({
	el: '#flow',
	data: {
		dataList:[],
	}
})
layui.use(['laydate', 'table'], function(){
	var laydate = layui.laydate; //日期
	var table = layui.table;
	
	//开始时间
	laydate.render({
		elem: '#start_time'
	});
	
	layer.load(2);
	table.render({
		elem: '#dataList'
		,url:'?m=PT&c=TodaySum&a=getData'
		,skin: 'row'
		,page: true 
		,limits: [50, 100, 200]
		,limit: 50 
		,cellMinWidth: 80
		,height: 'full-70'
		,cols: [[
			{type:'numbers', width:50}
			,{field:'prd_no', width:200, title: '商品编码'}
			,{field:'sku_name', width:300, title: '商品属性'}
			,{field:'title', minWidth:150, title: '商品名称'}
			,{field:'nums', width:100, title: '数量'}
		]]
		,id: 'dataList'
		,even: true
		,done: function(res, curr, count){
			layer.closeAll('loading');
		}
	});
})

//回车搜索
function searchTable(){
	layer.load(2);
	var table = layui.table;
	var $ = layui.$; 
	var active = {
		reload: function(){
			var prd_no = $('#prd_no').val();
			var start_time = $('#start_time').val();
			table.reload('dataList', {
				page: {
					curr: 1
				}
				,where: {
					prd_no: prd_no,
					start_time: start_time,
				}
			});
		}
	};
	active['reload'] ? active['reload'].call(this) : '';
}











