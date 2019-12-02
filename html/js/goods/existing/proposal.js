var table;
var layer;
var custLoad;
var custTableLoad;
var whLoad;
var whTableLoad
var flow = new Vue({
	el: '#flow',
	data: {
		data:[],
		cus_no:'',
	},
	mounted: function() {
		layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
			var laydate = layui.laydate 		//日期
				,laypage = layui.laypage 		//分页
				,form = layui.form 				//表单
				,element = layui.element; 		//元素操作
			table = layui.table;			//表格操作
			layer = layui.layer; 			//弹层
			var $ = layui.$;
			//表格初始化
			layer.load(2);
			table.render({
				elem: '#dataList'
				,url:'?m=goods&c=existing&a=getPrdProposalList'
				,skin: 'row'
				,page: true 
				,limits: [20, 50, 100]
				,limit: 50 
				,height: 'full-60'
				,cols: [[ 
					{checkbox:true, fixed:'left'}
					,{type:'numbers', width:50, title: '序号'}
					,{field:'pic_path', width:80, title: '图片', templet: '#path_pic'}
					,{field:'prd_no', minWidth:100, title: '商品编码'}
					,{field:'title', minWidth:200, title: '商品名称'}
					,{field:'sku_name', minWidth:150, title: '商品属性'}
					,{field:'qty', width:100, title: '现存量'}
					,{field:'qty_use', width:100, title: '可用量'}
					,{field:'qty_min', width:100, title: '库存下限'}
					,{field:'qty_bh', width:100, title: '备货量'}
					,{field:'qty_cg', width:100, title: '建议采购数'}
				]]
				,id: 'dataList'
				,even: true
				,where:{
					prd_no:$("#prd_no").val(),
					day_buy:$("#day_buy").val(),
					day_sale:$("#day_sale").val(),
				}
				,done: function(res, curr, count){
					layer.closeAll('loading');
				}
			});
			
			custLoad = {
				elem: '#treeCustList'
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
					,{field:'cus_no', width:250, title: '供应商编号', event: 'setSign', style:'cursor: pointer;'}
					,{field:'cus_name', width:443, title: '供应商名称', event: 'setSign', style:'cursor: pointer;'}
				]]
				,id: 'treeWhList'
				,data:[]
				,even: true
			};
			
			custTableLoad = {
				tableObj:false,
				tableLoadTable:function(){
					var table = layui.table;
					custLoad['page'] = {
						curr: 1 
					};
					var custName = $("#custName").val();
					
					$.ajax({
						url:'/?m=PT&c=purchase&a=getCustTable',
						dataType: 'json',
						type: "post",
						data:{
							custName:custName
						},
						success:function(data){
							if(!custTableLoad.tableObj){
								for(var i=0;i<data.length;i++){
									custLoad.data.push(data[i]);
								}
								custTableLoad.tableObj = table.render(custLoad);
							}else{
								custLoad.data = [];
								for(var i=0;i<data.length;i++){
									custLoad.data.push(data[i]);
								}
								custTableLoad.tableObj.reload(custLoad);
							}
						}
					})
				}
			};
			
			whLoad = {
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
			
			whTableLoad = {
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
			

			var active = {
				reload: function(){
					layer.load(2);
					table.reload('dataList', {
						page: {
							curr: 1
						}
						,where: {
							prd_no:$("#prd_no").val(),
							day_buy:$("#day_buy").val(),
							day_sale:$("#day_sale").val(),
						}
					});
				}
			}
			
			$("#searchBtn").click(function(){
				active['reload'] ? active['reload'].call(this) : '';
			})
			
			$("#purchaseOrder").click(function(){
				flow.purchaseOrder();
			})
			
			$("#outList").click(function(){
				flow.outList();
			})
			
			$("#prd_no").keydown(function( event ){
				if(event.keyCode == 13){
					active['reload'] ? active['reload'].call(this) : '';
					return false;
				}
			})
			
			table.on('tool(treeCustList)', function(obj){
				var data = obj.data;
				var cus_no = data.cus_no;
				flow.cus_no = cus_no;
				
				$("#whName").val("");
				layer.closeAll();
				whTableLoad.tableLoadTable();
				layer.open({
					type: 1,
					title: '选择仓库',
					skin: 'layui-layer-rim', //加上边框
					area: ['800px', '550px'], //宽高
					shade: 0.3,
					content: $("#whSetChoose"),
				});
			});
			
			table.on('tool(treeWhList)', function(obj){
				var data = obj.data;
				var wh = data.wh;
				var cus_no = flow.cus_no;

				var checkStatus = table.checkStatus('dataList')
				var data = checkStatus.data;
				if(data.length == 0){
					layer.alert("请先选择一条数据！");
					return false;
				}
				layer.closeAll();
				var loadIndex = layer.load()
				
				$.ajax({
					url:'?m=goods&c=existing&a=purchaseOrder',
					dataType: 'json',
					type: "post",
					data:{
						wh: wh,
						cus_no: cus_no,
						data: data,
					},
					success:function(data){
						table.reload('dataList');
						layer.closeAll('loading');
						if(data.code == 'ok'){
							layer.alert("生成成功！");
						}else{
							layer.alert(data.msg);
						}
					}
				});
			});
		})
	},
	methods: {
		purchaseOrder:function(){	
			var self = this;
			
			var checkStatus = table.checkStatus('dataList')
			var data = checkStatus.data;
			
			if(data.length == 0){
				layer.alert("请先选择一条数据！");
				return false;
			}
			
			custTableLoad.tableLoadTable();
			layer.open({
				type: 1,
				title: '选择供应商',
				skin: 'layui-layer-rim', //加上边框
				area: ['800px', '550px'], //宽高
				shade: 0.3,
				content: $("#custSetChoose"),
				cancel: function(index, layero){ 
					$("#custName").val("");
				}
			});
			
		},
		outList:function(){
			var prd_no = $('#prd_no').val();
			var day_buy = $('#day_buy').val();
			var day_sale = $('#day_sale').val();
			var url = "?m=goods&c=existing&a=outputExcel&prd_no="+prd_no+"&day_buy="+day_buy+"&day_sale="+day_sale;
			$("#ifile").attr('src',url);
		},
		
	}
})

function custSetBtn(){
	custTableLoad.tableLoadTable();
}

function whSetBtn(){
	whTableLoad.tableLoadTable();
}