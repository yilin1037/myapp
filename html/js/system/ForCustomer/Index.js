var vue = new Vue({
	el: '#vue',
	data: {
		systems_id:"",
		cost_list: []
	}
});

layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;
	tableLoad.tableLoadFunction();
	//监听工具条
	vue.cost_list = cost_list;
	setTimeout(function(){
		form.render('checkbox');
		form.render('select');
	},200)
	table.on('tool(dataList)', function(obj){
		var data = obj.data;
		//console.log(data);
		if(obj.event === 'add'){
			var systems_id = data['systems_id'];
			vue.systems_id = systems_id;
			auditTableLoad.tableLoadFunction( systems_id );
			layer.open({
				type: 1,
				title: '审核绑定',
				skin: 'layui-layer-rim',
				area: ['1100px', '650px'],
				shade: 0.3,
				resize: false,
				content: $("#audit"),
			});
		} else if(obj.event === 'del'){
			var systems_id = data['systems_id'];
			vue.systems_id = systems_id;
			delStatusLoad.tableLoadFunction( systems_id );
			layer.open({
				type: 1,
				title: '解除绑定',
				skin: 'layui-layer-rim',
				area: ['1100px', '650px'],
				shade: 0.3,
				content: $("#delStatus"),
			});
		} else if(obj.event === 'topUp'){
			$("#shopId").val(data['systems_id']);
			$("#shopName").val(data['systems_name']);
			$("#topUpMoney").val("");
			$("#topUpAnno").val("");
			layer.open({
				type: 1,
				title: '充值',
				skin: 'layui-layer-rim',
				area: ['550px', '400px'],
				shade: 0.3,
				content: $("#topUp"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var shopId = $("#shopId").val();
					var topUpMoney = $("#topUpMoney").val();
					if(topUpMoney == "" || topUpMoney == 0){
						layer.msg('请填写充值金额');
						return false;
					}
					var topUpAnno = $("#topUpAnno").val();
					$.ajax({
						url:'?m=system&c=ForCustomer&a=topUpMoney',
						dataType: 'json',
						type: "post",
						data:{
							shopId:shopId,
							topUpMoney:topUpMoney,
							topUpAnno:topUpAnno,
						},
						success:function(data){
							if(data.code == 'ok'){
								searchTable();
								layer.msg(data.msg);
								layer.close(index);
							}else{
								layer.msg(data.msg);
							}
						}
					})
				}
			})
		} else if(obj.event === 'edit'){
			var systems_id = data['systems_id'];
			vue.systems_id = systems_id;
			editPriceLoad.tableLoadFunction( systems_id );
			layer.open({
				type: 1,
				title: '修改单价',
				skin: 'layui-layer-rim',
				area: ['1200px', '600px'],
				shade: 0.3,
				content: $("#editPrice"),
			});
		} else if(obj.event === 'other'){
			var systems_id = data['systems_id'];
			vue.systems_id = systems_id;
			$("#checkboxList")[0].reset();
			
			$("#checkboxList input").each(function () {
			　　 for(var i=0; i<data['other_cost_no'].length; i++)
				{
					if(data['other_cost_no'][i] == $(this).attr("name"))	
					{
						$(this).attr("checked","checked");	
					}
				}
				form.render('checkbox');
			})

			layer.open({
				type: 1,
				title: '修改其他费用设置',
				skin: 'layui-layer-rim',
				area: ['400px', '300px'],
				shade: 0.3,
				content: $("#editOther"),
			});
		} else if(obj.event === 'sendNo'){
			var systems_id = data['systems_id'];
			vue.systems_id = systems_id;
			
			$.ajax({
				url:'/?m=system&c=ForCustomer&a=setAllowSend',
				dataType: 'json',
				type: "post",
				data:{
					system_id: systems_id,
					allowSend: '0',
				},
				success:function(data){
					searchTable();
				}
			})
		} else if(obj.event === 'sendOk'){
			var systems_id = data['systems_id'];
			vue.systems_id = systems_id;
			
			$.ajax({
				url:'/?m=system&c=ForCustomer&a=setAllowSend',
				dataType: 'json',
				type: "post",
				data:{
					system_id: systems_id,
					allowSend: '1',
				},
				success:function(data){
					searchTable();
				}
			})
		}else if(obj.event === 'sendPreNo'){
			var systems_id = data['systems_id'];
			vue.systems_id = systems_id;
			
			$.ajax({
				url:'/?m=system&c=ForCustomer&a=setAllowSendPre',
				dataType: 'json',
				type: "post",
				data:{
					system_id: systems_id,
					allowSend: '0',
				},
				success:function(data){
					searchTable();
				}
			})
		} else if(obj.event === 'sendPreOk'){
			var systems_id = data['systems_id'];
			vue.systems_id = systems_id;
			
			$.ajax({
				url:'/?m=system&c=ForCustomer&a=setAllowSendPre',
				dataType: 'json',
				type: "post",
				data:{
					system_id: systems_id,
					allowSend: '1',
				},
				success:function(data){
					searchTable();
				}
			})
		}else if(obj.event === 'level'){
			$("#level_shopId").val(data['systems_id']);
			$("#level_level").val(data['fx_level_value']);
			form.render();
			layer.open({
				type: 1,
				title: '修改分销商等级',
				skin: 'layui-layer-rim',
				area: ['550px', '400px'],
				shade: 0.3,
				content: $("#topLevel"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var shopId = $("#level_shopId").val();
					var level = $("#level_level").val();
					
					$.ajax({
						url:'?m=system&c=ForCustomer&a=fxLevelModify',
						dataType: 'json',
						type: "post",
						data:{
							shopId:shopId,
							level:level,
						},
						success:function(data){
							if(data.code == 'ok'){
								searchTable();
								layer.msg(data.msg);
								layer.close(index);
							}else{
								layer.msg(data.msg);
							}
						}
					});
				}
			})
		}else if(obj.event === 'returnCashOne'){
			var systems_id = data['systems_id'];
			var systems_name = data['systems_name'];
			vue.systems_id = systems_id;
			auditTableLoad.tableLoadFunction( systems_id );
			mini.open({
				url:"/?m=system&c=ForCustomer&a=popup&systemUser="+systems_id,
				title: '阶梯返现金额: '+systems_name, 
				width: 1200, 
				height: 600,
				onload: function () {
					var iframe = this.getIFrameEl();
					iframe.contentWindow.SetData(data);
				},
			});
		}
	});
	form.on('submit(submit)', function(data){
		$.ajax({
			url:'/?m=system&c=ForCustomer&a=saveOther',
			dataType: 'json',
			type: "post",
			data:{
				data:data['field'],
				system_id: vue.systems_id,
			},
			success:function(data){
				if(data.code == 'ok')
				{
					tableLoad.tableLoadFunction();
					layer.closeAll();	
				}
				else
				{
					layer.msg(data.msg);	
				}
			}
		})
		return false;
	});
	//审核绑定
	table.on('tool(auditList)', function(obj){
		var data = obj.data;
		//console.log(data);
		if(obj.event === 'adds'){
			layer.confirm('确定审核？', {
				btn: ['确认','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=ForCustomer&a=checkStatusAdd',
					dataType: 'json',
					type: "post",
					data:{
						data:data,
						price:data.price,
						systems_id:data.systems_id,
						systems_name:data.systems_name,
						express_type:data.express_type
					},
					success:function(data){
						if(data.code == 'ok'){
							var systems_id = vue.systems_id;
							auditTableLoad.tableLoadFunction( systems_id );
							searchTable();
							layer.msg(data.msg);
							layer.close(index);
						}else{
							layer.msg(data.msg);
						}
					}
				})
			}, function(){});
		}
	});
	
	//监听单价修改
	table.on('edit(editPriceTable)', function(obj){
		var value = obj.value //得到修改后的值
		,data = obj.data //得到所在行所有键值
		,field = obj.field; //得到字段
		var system_id = data['systems_id'];
		var express_type = data['express_type'];
		var newPrice = value;
		$.ajax({
			url:'?m=system&c=ForCustomer&a=editPrice',
			dataType: 'json',
			type: "post",
			data:{
				system_id:system_id,
				express_type:express_type,
				newPrice:newPrice
			},
			success:function(data){
				layer.msg(data.msg);
			}
		})
	});

	//监听客户修改
	table.on('edit(dataList)', function(obj){
		var value = obj.value //得到修改后的值
		,data = obj.data //得到所在行所有键值
		,field = obj.field; //得到字段
		var system_id = data['systems_id'];
		if(value == ''){
			layer.msg('客户名称不能为空');
			return;
		}
		$.ajax({
			url:'?m=system&c=ForCustomer&a=editSystemName',
			dataType: 'json',
			type: "post",
			data:{
				system_id:system_id,
				systems_name:value,
			},
			success:function(data){
				layer.msg(data.msg);
			}
		})
	});
	
	//监听省份价格修改
	table.on('edit(addressTable)', function(obj){
		
		$.ajax({
			url:'?m=system&c=ForCustomer&a=addAreaPrice',
			dataType: 'json',
			type: "post",
			data:{
				system_id:obj.data.system_id,
				express_type:obj.data.express_type,
				province:obj.data.province,
				price:obj.data.price
			},
			success:function(data){
				layer.msg(data.msg);
			}
		})
	});
	
	//解绑
	table.on('tool(delStatusTable)', function(obj){
		var data = obj.data;
		//console.log(data);
		if(obj.event === 'delno'){
			layer.confirm('确定解绑么？', {
				btn: ['确认','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=ForCustomer&a=checkStatusDel',
					dataType: 'json',
					type: "post",
					data:{
						express_id:data.express_id,
						systems_id:data.systems_id,
						systems_name:data.systems_name,
						express_type:data.express_type
					},
					success:function(data){
						if(data.code == 'ok'){
							var systems_id = vue.systems_id;
							delStatusLoad.tableLoadFunction( systems_id );
							searchTable();
							layer.msg(data.msg);
							layer.close(index);
						}else{
							layer.msg(data.msg);
						}
					}
				})
			}, function(){});
		}
	});
	
	//地址设置
	table.on('tool(editPriceTable)', function(obj){
		var data = obj.data;
		//console.log(data);
		if(obj.event === 'address'){
			
			var systems_id = data['systems_id'];
			vue.systems_id = systems_id;
			areaPriceLoad.tableLoadFunction( data );
			layer.open({
				type: 1,
				title: '地址设置',
				skin: 'layui-layer-rim',
				area: ['1100px', '550px'],
				shade: 0.3,
				content: $("#addSet"),
			});
		}
	});
	
});

//主列表
var dataList = {
	elem: '#dataList'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: 'full-85'
	,cols: [[ 
		{type:'numbers', width:60, title: '序号'}
		,{field:'systems_id', width:150, title: '客户电话'}
		,{field:'systems_name', minWidth:200, title: '客户名称', edit: 'text'}
		,{field:'balance', width:120, title: '余额'}
		,{field:'express_name', minWidth:150, title: '绑定快递类型'}
		,{field:'fx_level', width:150, title: '分销商等级', align: 'center'}
		,{field:'rebate', width:150, title: '返现规则', align: 'center'}
		,{field:'check_status', width:150, title: '审核状态', align: 'center', templet: '#barType'}
		,{fixed: 'right', width:600, title: '操作', align:'center', toolbar: '#barDemo'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
	,done:function(){
		if(DROP_SHIPPING_SYNC != 'T'){
			var tables = $("#dataList").next().find(".layui-table-box"); 
			tables.find("[data-field='fx_level']").css("display","none");
			 $(".layui-table-box>.layui-table-fixed").css("display","none")
			 $(".layui-table-box>.layui-table-header>table").css("width","100%")
			 $(".layui-table-box>.layui-table-body>table").css("width","100%")
		}
	}
};
var tableLoad = {
	tableObj:false,
	tableLoadFunction:function(){
		var table = layui.table;
		dataList['page'] = {
			curr: 1 
		};
		var usrCall = $('#usrCall').val();
		var usrName = $('#usrName').val();
		var auditState = $('#auditState').val();
		$.ajax({
			url:'/?m=system&c=ForCustomer&a=getData',
			dataType: 'json',
			type: "post",
			data:{
				usrCall: usrCall,
				usrName: usrName,
				auditState: auditState,
			},
			success:function(data){
				if(data){
					if(!tableLoad.tableObj){
						for(var i=0;i<data.length;i++){
							dataList.data.push(data[i]);
						}
						tableLoad.tableObj = table.render(dataList);
					}else{
						dataList.data = [];
						for(var i=0;i<data.length;i++){
							dataList.data.push(data[i]);
						}
						tableLoad.tableObj.reload(dataList);
					}
				}
			}
		})
	}
};
 
//回车搜索
function searchTable(){
	tableLoad.tableLoadFunction();
}

//审核列表
var auditList = {
	elem: '#auditList'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: '565'
	,cols: [[ 
		{type:'numbers', width:100, title: '序号'}
		,{field:'systems_id', width:150, title: '客户电话'}
		,{field:'systems_name', minWidth:200, title: '客户名称'}
		,{field:'express_name', width:100, title: '绑定快递类型'}
		,{field:'price', width:100, title: '面单价', edit: 'text' }
		,{field:'check_time', width:200, title: '绑定时间'}
		,{fixed: 'right', width:150, title: '操作', align:'center', toolbar: '#auditDemo'}
	]]
	,id: 'auditList'
	,data:[]
	,even: true
};
var auditTableLoad = {
	tableObj:false,
	tableLoadFunction:function( id ){
		var table = layui.table;
		auditList['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=system&c=ForCustomer&a=checkStatusAddList',
			dataType: 'json',
			type: "post",
			data:{
				system_id: id
			},
			success:function(data){
				//console.log(data);
				if(!auditTableLoad.tableObj){
					if(data){
						for(var i=0;i<data.length;i++){
							auditList.data.push(data[i]);
						}
						auditTableLoad.tableObj = table.render(auditList);
					}else{
						table.render(auditList);
					}
				}else{
					auditList.data = [];
					if(data){
						for(var i=0;i<data.length;i++){
							auditList.data.push(data[i]);
						}
					}
					auditTableLoad.tableObj.reload(auditList);
				}
			}
		})
	}
};

//修改价格
var editPriceTable = {
	elem: '#editPriceTable'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: '500'
	,cols: [[ 
		{type:'numbers', width:100, title: '序号'}
		,{field:'systems_id', width:150, title: '客户电话'}
		,{field:'systems_name', minWidth:200, title: '客户名称'}
		,{field:'express_name', width:150, title: '绑定快递类型'}
		,{field:'check_time', width:150, title: '绑定时间'}
		,{field:'price', width:150, title: '面单价', edit: 'text'}
		,{field:'address', width:200, title: '地址设置',align:'center', toolbar: '#address'}
	]]
	,id: 'editPriceTable'
	,data:[]
	,even: true
};
var editPriceLoad = {
	tableObj:false,
	tableLoadFunction:function( id ){
		var table = layui.table;
		editPriceTable['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=system&c=ForCustomer&a=editPriceList',
			dataType: 'json',
			type: "post",
			data:{
				system_id: id
			},
			success:function(data){
				//console.log(data);
				if(!editPriceLoad.tableObj){
					if(data){
						for(var i=0;i<data.length;i++){
							data[i]['address'] = '设置';
							editPriceTable.data.push(data[i]);
						}
						editPriceLoad.tableObj = table.render(editPriceTable);
					}else{
						table.render(editPriceTable);
					}
				}else{
					editPriceTable.data = [];
					if(data){
						for(var i=0;i<data.length;i++){
							editPriceTable.data.push(data[i]);
						}
					}
					editPriceLoad.tableObj.reload(editPriceTable);
				}
			}
		})
	}
};


//修改价格
var delStatusTable = {
	elem: '#delStatusTable'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: '500'
	,cols: [[ 
		{type:'numbers', width:100, title: '序号'}
		,{field:'systems_id', width:200, title: '客户电话'}
		,{field:'systems_name', minWidth:200, title: '客户名称'}
		,{field:'express_name', width:200, title: '绑定快递类型'}
		,{fixed: 'right', width:200, title: '操作', align:'center', toolbar: '#delDemo'}
	]]
	,id: 'delStatusTable'
	,data:[]
	,even: true
};
var delStatusLoad = {
	tableObj:false,
	tableLoadFunction:function( id ){
		var table = layui.table;
		delStatusTable['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=system&c=ForCustomer&a=delStatusList',
			dataType: 'json',
			type: "post",
			data:{
				system_id: id
			},
			success:function(data){
				if(!delStatusLoad.tableObj){
					if(data){
						for(var i=0;i<data.length;i++){
							delStatusTable.data.push(data[i]);
						}
						delStatusLoad.tableObj = table.render(delStatusTable);
					}else{
						table.render(delStatusTable);
					}
				}else{
					delStatusTable.data = [];
					if(data){
						for(var i=0;i<data.length;i++){
							delStatusTable.data.push(data[i]);
						}
					}
					delStatusLoad.tableObj.reload(delStatusTable);
				}
			}
		})
	}
};
//地址设置
var addressTable = {
	elem: '#addressTable'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: '500'
	,cols: [[ 
		{type:'checkbox', width:100, title: '序号'}
		,{field:'system_id', width:200, title: '所属客户'}
		,{field:'express_type', width:200, title: '快递类型'}
		,{field:'province', minWidth:200, title: '省份'}
		,{field:'price', width:200,edit: 'text', title: '价格'}
	]]
	,id: 'addressTable'
	,data:[]
	,even: true
};
var areaPriceLoad = {
	tableObj:false,
	tableLoadFunction:function( arr){
		var table = layui.table;
		//console.log(table);
		addressTable['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=system&c=ForCustomer&a=addressPriceList',
			dataType: 'json',
			type: "post",
			data:{
				system_id: arr['systems_id'],
				express_type: arr['express_type']
			},
			success:function(res){
				var data = res.data;
				$('#express_type').val(arr['express_type']);
				$('#system_id').val( arr['systems_id']);
				if(!areaPriceLoad.tableObj){
					//console.log(data);
					if(data){
						for(var i=0;i<data.length;i++){
							addressTable.data.push(data[i]);
						}
						areaPriceLoad.tableObj = table.render(addressTable);
					}else{
						table.render(addressTable);
					}
				}else{
					addressTable.data = [];
					if(data){
						for(var i=0;i<data.length;i++){
							addressTable.data.push(data[i]);
						}
					}
					areaPriceLoad.tableObj.reload(addressTable);
				}
			}
		})
	}
};

function addAreaPrice(){
	
	var province = $('#province').val();
	var price = $('#price').val();
	var system_id = $('#system_id').val();
	var express_type = $('#express_type').val();
	if(!province){
		
		layer.msg('省份不能为空');
		return;
	}
	if(!price){
		
		layer.msg('价格不能为空');
		return;
	}
	$.ajax({
		url:'/?m=system&c=ForCustomer&a=addAreaPrice',
		dataType: 'json',
		type: "post",
		data:{
			system_id: system_id,
			express_type: express_type,
			province: province,
			price: price
		},
		success:function(res){
			if(res.code == 'ok'){
					
				areaPriceLoad.tableLoadFunction( {systems_id: system_id,express_type: express_type} );
			}
			layer.msg(res.msg);
		}
	})
}

function setReturnCash(){
	// layer.open({
	// 	type: 1,
	// 	title: '默认阶梯返现金额',
	// 	skin: 'layui-layer-rim',
	// 	area: ['1200px', '600px'],
	// 	shade: 0.3,
	// 	content: $("#editReturnCash"),
	// });
	mini.open({
		// url: "../system/view/ForCustomer/popup.php",
		url:"/?m=system&c=ForCustomer&a=popup",
		title: "阶梯返现", width: 1200, height: 600,
		onload: function () {
			var iframe = this.getIFrameEl();
			iframe.contentWindow.SetData(data);
		},
	});
}

function delAreaPrice(){
	
	var data = layui.table.checkStatus('addressTable').data;
	$.ajax({
		url:'/?m=system&c=ForCustomer&a=delAreaPrice',
		dataType: 'json',
		type: "post",
		data:{data:data},
		success:function(res){
			areaPriceLoad.tableLoadFunction( {systems_id: data[0]['system_id'],express_type: data[0]['express_type']} );
			layer.msg(res.msg);
		}
	})
}



mini.parse();
var grid = mini.get("datagrid1");
grid.load();
var menu = new ColumnsMenu(grid);
function onKeyEnter(e) {
	search();
}
function addRow() {          
	var newRow = { name: "New Row" };
	grid.addRow(newRow, 0);

	grid.beginEditCell(newRow, "LoginName");
}
function removeRow() {
	var rows = grid.getSelecteds();
	if (rows.length > 0) {
		grid.removeRows(rows, true);                
	}
}
function saveData() {
	grid.commitEdit();
	var SynChange = grid.getChanges();
	var data = mini.decode(SynChange);
	$.ajax({
		url:'/?m=system&c=ForCustomer&a=editRetrunCatchM',
		dataType: 'json',
		type: "post",
		data:{
			data: data
		},
		success:function(res){
			layer.msg(res.msg);
		}
	})
}

grid.on("celleditenter", function (e) {
	var index = grid.indexOf(e.record);
	if (index == grid.getData().length - 1) {
		var row = {};
		grid.addRow(row);
	}
});

grid.on("beforeload", function (e) {
	if (grid.getChanges().length > 0) {
		if (confirm("有增删改的数据未保存，是否取消本次操作？")) {
			e.cancel = true;
		}
	}
});


// var grid2 = mini.get("datagrid2");
// var menu = new ColumnsMenu(grid2);
// function onKeyEnter(e) {
// 	search();
// }
// function addRowOne() {     
// 	var grid2 = mini.get("datagrid2");
// 	var newRow = { name: "New Row" };
// 	grid2.addRow(newRow, 0);
// 	grid2.beginEditCell(newRow, "LoginName");
// }
// function removeRowOne() {
// 	var grid2 = mini.get("datagrid2");
// 	var rows = grid2.getSelecteds();
// 	if (rows.length > 0) {
// 		grid2.removeRows(rows, true);                
// 	}
// }
// function saveDataOne() {
// 	var grid2 = mini.get("datagrid2");
// 	var systems_id = vue.systems_id;
// 	grid2.commitEdit();
// 	var SynChange = grid2.getChanges();
// 	var data = mini.decode(SynChange);
// 	$.ajax({
// 		url:'/?m=system&c=ForCustomer&a=editRetrunCatchUser',
// 		dataType: 'json',
// 		type: "post",
// 		data:{
// 			data: data,
// 			system_id: systems_id
// 		},
// 		success:function(res){
// 			layer.msg(res.msg);
// 		}
// 	})
// }

// grid2.on("celleditenter", function (e) {
// 	var index = grid2.indexOf(e.record);
// 	if (index == grid2.getData().length - 1) {
// 		var row = {};
// 		grid2.addRow(row);
// 	}
// });

// grid2.on("beforeload", function (e) {
// 	if (grid2.getChanges().length > 0) {
// 		if (confirm("有增删改的数据未保存，是否取消本次操作？")) {
// 			e.cancel = true;
// 		}
// 	}
// });

