var vue = new Vue({
	el: '#vue',
	data: {
		getData:[],    //列表数据
		setupData:[],  //单选快递按钮列表
		no:"",         //修改的物流信息编号
		isBinding:'',  //已绑定商家
	}
});

layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,upload = layui.upload //上传
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;
	
	//初始化列表
	getBinding();
	
	table.on('tool(dataList)', function(obj){
		var data = obj.data;
		if(obj.event === 'setup'){
			var id = data['id'];
			layer.confirm('确认绑定？', {
				btn: ['确定','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=ForBusinessman&a=addCourier',
					dataType: 'json',
					type: "post",
					data:{
						id : id,
						data:data,
					},
					success:function(data){
						if(data.code == 'ok'){
							layer.close(index);
							//绑定后更新绑定商家显示
							getBinding();
						}
						layer.msg(data.msg);
					}
				})
			}, function(){});
		} else if(obj.event === 'edit'){
			$.ajax({
				url:'?m=system&c=ForBusinessman&a=getCourier',
				dataType: 'json',
				type: "post",
				data:{
					data : data,
				},
				success:function(data){
					if(data['code'] == "error"){
						layer.msg(data.msg);
						return false;
					}
					vue.no = data['no'];
					$("#pages1-receiver_state").val(data['print_province']);
					$("#pages1-receiver_state").trigger("change");
					$("#pages1-receiver_city").val(data['print_city']);
					$("#pages1-receiver_city").trigger("change");
					$("#pages1-receiver_district").val(data['print_district']);
					$("#send_detail").val(data['print_detail']);
					$("#send_username").val(data['send_username']);
					$("#send_tel").val(data['send_tel']);
					layer.open({
						type: 1,
						title: '修改绑定',
						skin: 'layui-layer-rim',
						area: ['850px', '450px'],
						shade: 0.3,
						content: $("#editSetup"),
						btn: ['确定', '取消'],
						yes: function(index, layero){
							var courier = $("input[name=courier]:checked").val();
							var send_username = $("#send_username").val();
							var send_tel = $("#send_tel").val();
							var print_province = $("#pages1-receiver_state").val();
							var print_city = $("#pages1-receiver_city").val();
							var print_district = $("#pages1-receiver_district").val();
							var print_detail = $("#send_detail").val();
							$.ajax({
								url:'?m=system&c=ForBusinessman&a=updCourier',
								dataType: 'json',
								type: "post",
								data:{
									no:vue.no,
									courier : courier,
									send_username : send_username,
									send_tel : send_tel,
									print_province : print_province,
									print_city : print_city,
									print_district : print_district,
									print_detail : print_detail,
								},
								success:function(data){
									if(data.code == 'ok'){
										layer.close(index);
										getBinding();
									}
									layer.msg(data.msg);
								}
							})
						}
					});
				}
			})
		} else if(obj.event === 'remove'){
			var shopid = data['shopid'];
			var type = data['type'];
			var express_type = data['express_type'];
			var drop_shipping_id = data['drop_shipping_id'];
			//判断是否是最后一个解绑
			var getData = vue.getData;
			var nums = 0;
			for(var i=0;i<getData.length;i++){
				if(getData[i]['title'] == '1'){
					nums++;
				}
			}
			if(nums == 1){
				$string = "<strong>温馨提示：</strpng></br>解绑全部快递后，将清除账户余额，如有误操作，请联系代发商家处理。是否确认解绑";
			}else{
				$string = "确认解绑？";
			}
			layer.confirm($string, {
				btn: ['确定','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=ForBusinessman&a=delCourier',
					dataType: 'json',
					type: "post",
					data:{
						shopid:shopid,
						type:type,
						drop_shipping_id:drop_shipping_id,
						express_type:express_type,
					},
					success:function(data){
						if(data.code == 'ok'){
							layer.close(index);
							//解绑后更新绑定商家显示
							getBinding();
						}
						layer.msg(data.msg);
					}
				})
			}, function(){});
		}else if(obj.event === 'cancelAudit'){
			var system_id = data['system_id'];
			var shopid = data['shopid'];
			var name = data['name'];
			var type = data['type'];
			var express_type = data['express_type'];
			var drop_shipping_id = data['drop_shipping_id'];
			var id = data['id'];
			layer.confirm('确认取消？', {
				btn: ['确定','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=ForBusinessman&a=cancelAudit',
					dataType: 'json',
					type: "post",
					data:{
						id:id,
						system_id:system_id,
						shopid:shopid,
						name:name,
						type:type,
						express_type:express_type,
						drop_shipping_id:drop_shipping_id,
					},
					success:function(data){
						if(data.code == 'ok'){
							layer.close(index);
							//取消绑定后更新绑定商家显示
							getBinding();
						}
						layer.msg(data.msg);
					}
				})
			}, function(){});
		}
	});
});

var dataList = {
	elem: '#dataList'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: 'full-250'
	,cols: [[ 
		{field:'numbers', width:100, title: '序号'}
		,{field:'name', minWidth:200, title: '代发商家名称'}
		,{field:'express_type', width:200, title: '物流'}
		,{field:'address', minWidth:200, title: '代发点地址'}
		,{field:'price', width:200, title: '面单价'}
		,{fixed: 'right', width:200, title: '操作', align:'center', toolbar: '#barDemo'}
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
		var searchId = $("#searchId").val();
		$.ajax({
			url:'?m=system&c=ForBusinessman&a=getData',
			dataType: 'json',
			type: "post",
			data:{
				searchId:searchId,
			},
			success:function(data){
				vue.getData = data;
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
				}else{
					table.render(dataList);
				}
			}
		})
	}
};

function getBinding(){
	//获取已绑定商家
	$.ajax({
		url:'?m=system&c=ForBusinessman&a=getBinding',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			if(data){
				vue.isBinding = data;
			}else{
				vue.isBinding = "";
			}
			tableLoad.tableLoadFunction();
		}
	})
}

$("#showTable").click(function(){
	tableLoad.tableLoadFunction();
})





