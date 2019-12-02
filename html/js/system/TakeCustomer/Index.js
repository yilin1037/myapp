var vue = new Vue({
	el: '#vue',
	data: {
		system_id:"",
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
	
	//监听单元格编辑
	table.on('edit(dataList)', function(obj){
		var value = obj.value //得到修改后的值
		,data = obj.data //得到所在行所有键值
		,field = obj.field; //得到字段
		if(data['status'] == '1'){
			$.ajax({
				url:'/?m=system&c=TakeCustomer&a=updatePriceLine',
				dataType: 'json',
				type: "post",
				data:{
					value: value,
					field: field,
					id: data['id'],
				},
				success:function(data){
					if(data['code'] == 'error'){
						tableLoad.tableLoadFunction();
					}
					layer.msg(data.msg);
				}
			})
		}else{
			layer.msg("请先确认绑定，之后在修改价格");
			tableLoad.tableLoadFunction();
		}
	});
	
	//审核绑定
	table.on('tool(dataList)', function(obj){
		var data = obj.data;
		console.log(data);
		if(obj.event === 'adds'){
			layer.confirm('确定绑定？', {
				btn: ['绑定','拒绑','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=TakeCustomer&a=checkStatusBand',
					dataType: 'json',
					type: "post",
					data:{
						id:data['id'],
						state:'T',
					},
					success:function(data){
						if(data['code'] == 'ok'){
							tableLoad.tableLoadFunction();
						}
						layer.msg(data.msg);
					}
				})
			}, function(){
				$.ajax({
					url:'?m=system&c=TakeCustomer&a=checkStatusBand',
					dataType: 'json',
					type: "post",
					data:{
						id:data['id'],
						state:'F',
						system_id:data['system_id'],
					},
					success:function(data){
						if(data['code'] == 'ok'){
							tableLoad.tableLoadFunction();
						}
						layer.msg(data.msg);
					}
				})
			});
		}else if(obj.event === 'dels'){
			layer.confirm('确定解绑？', {
				btn: ['解绑','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=TakeCustomer&a=removeStatusBand',
					dataType: 'json',
					type: "post",
					data:{
						id:data['id'],
						data:data,
					},
					success:function(data){
						if(data['code'] == 'ok'){
							tableLoad.tableLoadFunction();
						}
						layer.msg(data.msg);
					}
				})
			}, function(){});
		}else if(obj.event === 'topUp'){
			$("#shopId").val(data['system_id']);
			$("#shopName").val(data['system_name']);
			$("#topUpMoney").val("");
			$("#topUpAnno").val("");
			layer.open({
				type: 1,
				title: '充值',
				skin: 'layui-layer-rim',
				area: ['550px', '420px'],
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
		} else if(obj.event === 'other'){
			var system_id = data['system_id'];
			vue.system_id = system_id;
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
		}else if(obj.event === 'setPrepaid'){
			layer.confirm('确定设为预付？', {
				btn: ['确定','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=TakeCustomer&a=setPay_type',
					dataType: 'json',
					type: "post",
					data:{
						id:data['id'],
						data:data,
					},
					success:function(data){
						if(data['code'] == 'ok'){
							tableLoad.tableLoadFunction();
						}
						layer.msg(data.msg);
					}
				})
			}, function(){});
		}else if(obj.event === 'setAccPeriod'){
			layer.confirm('确定设为账期？', {
				btn: ['确定','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=TakeCustomer&a=setPay_type',
					dataType: 'json',
					type: "post",
					data:{
						id:data['id'],
						data:data,
					},
					success:function(data){
						if(data['code'] == 'ok'){
							tableLoad.tableLoadFunction();
						}
						layer.msg(data.msg);
					}
				})
			}, function(){});
		}
	});
	form.on('submit(submit)', function(data){
		
		$.ajax({
			url:'/?m=system&c=TakeCustomer&a=saveOther',
			dataType: 'json',
			type: "post",
			data:{
				data:data['field'],
				system_id: vue.system_id,
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
		{type:'numbers', width:100, title: '序号'}
		,{field:'system_id', width:150, title: '系统号'}
		,{field:'system_name', width:150, title: '客户名称'}
		,{field:'pay_type_name', width:100, title: '付费类型'}
		,{field:'sort_name', width:100, title: '简称', edit: 'text'}
		,{field:'balance', width:100, title: '账户余额'}
		,{field:'credit_money', width:100, title: '信用额度', edit: 'text'}
		,{field:'price', width:100, title: '代拿费用', edit: 'text'}
		,{field:'take_price', width:100, title: '基础拿货价', edit: 'text'}
		,{field:'linkman', width:150, title: '联系人', edit: 'text'}
		,{field:'phone', width:200, title: '联系人电话', edit: 'text'}
		,{field:'address', minWidth:200, title: '送货地址', edit: 'text'}
		,{fixed: 'right', width:350, title: '操作', align:'center', toolbar: '#barDemo'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
};
var tableLoad = {
	tableObj:false,
	tableLoadFunction:function(){
		var table = layui.table;
		dataList['page'] = {
			curr: 1 
		};
		var system_id = $('#system_id').val();
		var system_name = $('#system_name').val();
		var linkman = $('#linkman').val();
		var phone = $('#phone').val();
		$.ajax({
			url:'/?m=system&c=TakeCustomer&a=getData',
			dataType: 'json',
			type: "post",
			data:{
				system_id: system_id,
				system_name: system_name,
				linkman: linkman,
				phone: phone,
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