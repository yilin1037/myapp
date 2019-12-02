var active = {};
var activeInfo = {};
var flow = new Vue({
	el: '#flow',
	data: {
		data:[],
		wh:"",
		prd_no:"",
		title:"",
	},
	mounted: function() {
		layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
			var laydate = layui.laydate 		//日期
				,laypage = layui.laypage 		//分页
				,layer = layui.layer 			//弹层
				,form = layui.form 				//表单
				,element = layui.element; 		//元素操作
			var table = layui.table;			//表格操作
			
			//表格初始化
			layer.load(2);
			table.render({
				elem: '#dataList'
				,url:'?m=goods&c=existing&a=getPrdList'
				,skin: 'row'
				,page: true 
				,limits: [20, 50, 100]
				,limit: 50 
				,height: 'full-60'
				,cols: [[ 
					{type:'numbers', width:50, title: '序号'}
					,{field:'pic_path', width:80, title: '图片', templet: '#path_pic'}
					,{field:'name', width:150, title: '仓库'}
					,{field:'prd_no', minWidth:100, title: '商品编码'}
					,{field:'title', minWidth:200, title: '商品名称'}
					,{field:'sku_name', minWidth:150, title: '商品属性'}
					,{field:'qty', width:100, title: '现存量',sort: true,}
					,{field:'nums', width:100, title: '使用量'}
					,{field:'able', width:100, title: '可用量'}
					,{field:'qty_pc', width:100, title: '在途', templet: '#bar',sort: true,}
					,{field:'have', width:100, title: '有无库存', templet: '#have_no'}
				]]
				,id: 'dataList'
				,even: true
				,done: function(res, curr, count){
					layer.closeAll('loading');
				}
			});
			table.render({
				 elem: '#LAY_table_user'
				,url: '?m=goods&c=existing&a=getQtyList'
				,cols: [[
				   {field:'djtype', title: '单据类型',"width":120 ,fixed: true}
				  ,{field:'effect_date', title: '创建时间',"width":120}
				  ,{field:'pc_no', title: '单据编号',"width":150}
				  ,{field:'name', title: '仓库',"width":120}
				  ,{field:'cus_name', title: '供应商',"width":140}
				  ,{field:'prd_no', title: '商品编码',"width":120}
				  ,{field:'prd_name', title: '商品名称',"width":300}
				  ,{field:'prd_sku_name', title: '商品属性',"width":120}
				  ,{field:'price', title: '单价',"width":120}
				  ,{field:'qty', title: '在途数量',"width":120}
				  ,{field:'total_fee', title: '总价',"width":120}
				]]
				,id: 'LAY_table_user'
				,page: true
				,height: 'full-245'
				,done: function(res, curr, count){
					layer.closeAll('loading');
				}
			});
			var $ = layui.$;
			active = {
				reload: function(){
					layer.load(2);
					var wh = $('#wh').val();
					var prd_no = $("#prd_no").val();
					var title = $("#title").val();
					self.prd_no = prd_no;
					self.wh = wh;
					self.title = title;
					table.reload('dataList', {
						page: {
							curr: 1
						}
						,where: {
							wh: wh,
							prd_no:prd_no,
							title:title,
						}
					});
				}
			}
			activeInfo = {
				reload: function(wh, prd_id, prd_sku_id){
					layer.load(2);
					table.reload('LAY_table_user', {
						page: {
							curr: 1
						}
						,where: {
							wh: wh,
							prd_id:prd_id,
							prd_sku_id:prd_sku_id,
						}
					});
				}
			}
			
			$("#searchBtn").click(function(){
				active['reload'] ? active['reload'].call(this) : '';
			})
			
			$("#prd_no").keydown(function( event ){
				console.log(event);
				console.log(event.keyCode);
				if(event.keyCode == 13){
					active['reload'] ? active['reload'].call(this) : '';
				}
			})
			
			$("#wh").keydown(function( event ){
				if(event.keyCode == 13){
					active['reload'] ? active['reload'].call(this) : '';
				}
			})
			
			$("#title").keydown(function( event ){
				if(event.keyCode == 13){
					active['reload'] ? active['reload'].call(this) : '';
				}
			})
			
			//监听仓库选择
			table.on('tool(treeWhList)', function(obj){
				var data = obj.data;
				layer.closeAll();
				$("#wh").val(data.name);
			});
		})
	},
	methods: {
		setyesorder:function(){	
			var self = this;
		},
	}
})

function chooseWh(){
	whTableLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '选择仓库',
		skin: 'layui-layer-rim',
		area: ['800px', '550px'],
		shade: 0.3,
		content: $("#whSetChoose"),
		cancel: function(index, layero){ 
			
		}
	});
}

function qtys(wh, prd_id, prd_sku_id){
	
	activeInfo['reload'] ? activeInfo['reload'].call(this, wh, prd_id, prd_sku_id) : '';
	layer.open({			
		type: 1,		
		page: true, 
		title: '在途明细',
		skin: 'layui-layer-rim', 
		area: ['1650px', '800px'], 
		shade: 0.3,	
		content: $("#openLoc"),
		btn: ['关闭']
	});

}

function whSetBtn(){
	whTableLoad.tableLoadTable();
}

var whLoad = {
	elem: '#treeWhList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: '400'
	,cols: [[ 
		{type:'numbers', width:80, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'wh', width:250, title: '仓库编号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'name', width:443, title: '仓库名称', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'treeWhList'
	,data:[]
	,even: true
};

var whTableLoad = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		whLoad['page'] = {
			curr: 1 
		};
		var whName = $("#whName").val();
		
		$.ajax({
			url:'/?m=goods&c=otherOut&a=getWhTable',
			dataType: 'json',
			type: "post",
			data:{
				whName:whName
			},
			success:function(data){
				if(!whTableLoad.tableObj){
					for(var i=0;i<data.length;i++){
						whLoad.data.push(data[i]);
					}
					whTableLoad.tableObj = table.render(whLoad);
				}else{
					whLoad.data = [];
					for(var i=0;i<data.length;i++){
						whLoad.data.push(data[i]);
					}
					whTableLoad.tableObj.reload(whLoad);
				}
			}
		})
	}
};

//导出查询结果
$("#toExcel").click(function(){
	var time = new Date().getTime();
	var prd_no = self.prd_no;
	var wh = self.wh;
	var title = self.title;
	$.ajax({
		url: "/index.php?m=goods&c=existing&a=toExcel&loginact=file",
		type: 'post',
		data: {time: time,wh: wh,prd_no: prd_no,title: title},
		dataType: 'text',
		success: function (text){
			if(!text){
				var url = "/xls/QtyInfo"+time+".xls?loginact=file";
				$("#ifile").attr('src',url);
			}
		},error: function (jqXHR, textStatus, errorThrown) {
			layer.msg('没有可导出数据',{
				icon: 0,
				time: 2000
			});
		}
	});
});
