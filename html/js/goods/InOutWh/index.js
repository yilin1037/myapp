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
			var urlObj = GetRequest();
			var loss = "";
			if(urlObj){
				if(urlObj.loss){
					loss = urlObj.loss;		
				}
			}

			
			laydate.render({
				elem: '#timeState'
			});
			laydate.render({
				elem: '#timeEnd'
			});
			
			if(loss == 'T'){
				//表格初始化
				layer.load(2);
				table.render({
					elem: '#dataList'
					,url:'?m=goods&c=InOutWh&a=getPrdList'
					,skin: 'row'
					,page: true 
					,limits: [20, 50, 100]
					,limit: 50 
					,height: 'full-60'
					,cols: [[ 
						{type:'numbers', width:50, title: '序号'}
						,{field:'prd_no', minWidth:200, title: '商品编码'}
						,{field:'prd_name', minWidth:200, title: '商品名称'}
						,{field:'prd_sku_name', minWidth:200, title: '商品属性'}
						,{field:'djtype', width:100, title: '单据类型'}
						,{field:'create_time', minWidth:200, title: '日期'}
						//,{field:'cus_no', width:100, title: '供应商'}
						,{field:'name', width:100, title: '仓库'}
						,{field:'prd_loc', width:100, title: '货位'}
						,{field:'out_nums', width:90, title: '出库数量'}
						//,{field:'return_nums', width:90, title: '退回数量'}
						//,{field:'del_nums', width:90, title: '作废数量'}
						,{field:'price', width:90, title: '价格'}
						,{field:'total', width:90, title: '金额'}
					]]
					,id: 'dataList'
					,data:[]
					,even: true
					,where: {
						timeState: $('#timeState').val(),
						timeEnd: $('#timeEnd').val(),
						docState: $('#docState').val(),
						cus_no: $('#cus_no').val(),
						wh: $('#wh').val(),
						prd_no: $("#prd_no").val(),
						prd_loc: $("#prd_loc").val(),
						loss: loss,
					}
					,done: function(res, curr, count){
						layer.closeAll('loading');
					}
				});	
			}else{
				//表格初始化
				layer.load(2);
				table.render({
					elem: '#dataList'
					,url:'?m=goods&c=InOutWh&a=getPrdList'
					,skin: 'row'
					,page: true 
					,limits: [20, 50, 100]
					,limit: 50 
					,height: 'full-60'
					,cols: [[ 
						{type:'numbers', width:50, title: '序号'}
						,{field:'prd_no', minWidth:200, title: '商品编码'}
						,{field:'prd_name', minWidth:200, title: '商品名称'}
						,{field:'prd_sku_name', minWidth:200, title: '商品属性'}
						,{field:'djtype', width:100, title: '单据类型'}
						,{field:'create_time', minWidth:200, title: '日期'}
						//,{field:'cus_no', width:100, title: '供应商'}
						,{field:'name', width:100, title: '仓库'}
						,{field:'prd_loc', width:100, title: '货位'}
						,{field:'in_nums', width:90, title: '入库数量'}
						,{field:'out_nums', width:90, title: '出库数量'}
						//,{field:'return_nums', width:90, title: '退回数量'}
						//,{field:'del_nums', width:90, title: '作废数量'}
						,{field:'price', width:90, title: '价格'}
						,{field:'total', width:90, title: '金额'}
					]]
					,id: 'dataList'
					,data:[]
					,even: true
					,where: {
						timeState: $('#timeState').val(),
						timeEnd: $('#timeEnd').val(),
						docState: $('#docState').val(),
						cus_no: $('#cus_no').val(),
						wh: $('#wh').val(),
						prd_no: $("#prd_no").val(),
						prd_loc: $("#prd_loc").val(),
						loss: loss,
					}
					,done: function(res, curr, count){
						layer.closeAll('loading');
					}
				});	
			}
		
			var active = {
				reload: function(){
					layer.load(2);
					var timeState = $('#timeState').val();
					var timeEnd = $('#timeEnd').val();
					var docState = $('#docState').val();
					var cus_no = $('#cus_no').val();
					var wh = $('#wh').val();
					var prd_no = $("#prd_no").val();
					var prd_loc = $("#prd_loc").val();
					table.reload('dataList', {
						page: {
							curr: 1
						}
						,where: {
							timeState: timeState,
							timeEnd: timeEnd,
							docState: docState,
							cus_no: cus_no,
							wh: wh,
							prd_no:prd_no,
							prd_loc: prd_loc,
							loss: loss,
						}
					});
				},
				ExportExcel: function(){
					var items = {};
					items.timeState = $('#timeState').val();
					items.timeEnd = $('#timeEnd').val();
					items.docState = $('#docState').val();
					items.cus_no = $('#cus_no').val();
					items.wh = $('#wh').val();
					items.prd_no = $("#prd_no").val();
					items.prd_loc = $("#prd_loc").val();

					var exportExcelUrl = "?m=goods&c=InOutWh&a=exportExcel";
					let opt = $.param(items);
					console.log(opt);
					window.location.href = exportExcelUrl+"&"+opt;
				},
			}


			$("#searchExportExcel").click(function(){
				active['ExportExcel'] ? active['ExportExcel'].call(this) : '';
			})

			
			$("#searchBtn").click(function(){
				active['reload'] ? active['reload'].call(this) : '';
			})
			
			$("#prd_no").keydown(function( event ){
				if(event.keyCode == 13){
					active['reload'] ? active['reload'].call(this) : '';
				}
			})
			$("#cus_no").keydown(function( event ){
				if(event.keyCode == 13){
					active['reload'] ? active['reload'].call(this) : '';
				}
			})
			$("#wh").keydown(function( event ){
				if(event.keyCode == 13){
					active['reload'] ? active['reload'].call(this) : '';
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

function custSetBtn(){
	
}

function GetRequest() {
	var url = location.search;
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}