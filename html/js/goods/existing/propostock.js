var flow = new Vue({
	el: '#flow',
	data: {
		data:[],
	},
	mounted: function() {
		layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
			var laydate = layui.laydate 		//日期
				,laypage = layui.laypage 		//分页
				,layer = layui.layer 			//弹层
				,form = layui.form 				//表单
				,element = layui.element; 		//元素操作
			var table = layui.table;			//表格操作
			var $ = layui.$;
			
			//表格初始化
			layer.load(2);
			table.render({
				elem: '#dataList'
				,url:'?m=goods&c=existing&a=getPrdPropoStockList'
				,skin: 'row'
				,page: true 
				,limits: [20, 50, 100]
				,limit: 50 
				,height: 'full-60'
				,cols: [[ 
					{type:'numbers', width:50, title: '序号'}
					,{field:'pic_path', width:80, title: '图片', templet: '#path_pic'}
					,{field:'prd_no', minWidth:100, title: '商品编码'}
					,{field:'title', minWidth:200, title: '商品名称'}
					,{field:'sku_name', minWidth:150, title: '商品属性'}
					,{field:'qty', width:100, title: '现存量'}
					,{field:'qty_safe', width:100, title: '安全库存量'}
					,{field:'qty_ce', width:100, title: '库存差额'}
				]]
				,id: 'dataList'
				,even: true
				,done: function(res, curr, count){
					layer.closeAll('loading');
				}
			});
			var active = {
				reload: function(){
					layer.load(2);
					table.reload('dataList', {
						page: {
							curr: 1
						}
						,where: {
							prd_no:$("#prd_no").val(),
						}
					});
				}
			}
			
			$("#searchBtn").click(function(){
				active['reload'] ? active['reload'].call(this) : '';
			})
			
			$("#prd_no").keydown(function( event ){
				if(event.keyCode == 13){
					active['reload'] ? active['reload'].call(this) : '';
					return false;
				}
			})
		})
	},
	methods: {
		setyesorder:function(){	
			var self = this;
		},
	}
})