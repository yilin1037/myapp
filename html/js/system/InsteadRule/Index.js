var vue = new Vue({
	el: '#vue',
	data: {
		systems_id:"",
		system_id: '',
		bat_no: '',
		assist_cust: '',
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
	table.on('tool(dataList)', function(obj){
		var data = obj.data;
		//console.log(data);
		if(obj.event === 'looks'){  //查看波次订单
			var system_id = data['system_id'];
			var bat_no = data['bat_no'];
			view_system_id = data['system_id'];
			view_bat_no = data['bat_no'];
			waveOrderView.tableLoadFunction( system_id,bat_no );
			layer.open({
					type: 1,
					title: '查看波次订单',
					skin: 'layui-layer-rim',
					area: ['1250px', '710px'],
					shade: 0.3,
					resize: false,
					content: $("#cat_tid_items"),
				});
			
		}else if(obj.event === 'looksPrd'){  //查看波次订单
			var system_id = data['system_id'];
			var bat_no = data['bat_no'];
			vue.system_id = system_id;
			vue.bat_no = bat_no;
			view_system_id = data['system_id'];
			view_bat_no = data['bat_no'];
			wavePrdtView.tableLoadFunction( system_id,bat_no );
			layer.open({
				type: 1,
				title: '查看波次商品汇总',
				skin: 'layui-layer-rim',
				area: ['1350px', '700px'],
				shade: 0.3,
				resize: false,
				content: $("#cat_prd_items"),
			});
		} else if(obj.event === 'pays'){  //付款
			var system_id = data['system_id'];
			var bat_no = data['bat_no'];
			$("#payUrlText").html("请选择文件");
			$("#filePayPic").val("");
			$("#pay_num").val("");
			layer.open({
				type: 1,
				title: '付款',
				skin: 'layui-layer-rim',
				area: ['700px', '420px'],
				shade: 0.3,
				resize: false,
				content: $("#payment"),
				btn: ['确认付款', '取消'],
				yes: function(index, layero){
					var formData = new FormData();
					formData.append("system_id", system_id);
					formData.append("bat_no", bat_no);
					var pay_num = $("#pay_num").val();
					formData.append("pay_num", pay_num);
					var memo = $("#memo").val();
					formData.append("memo", memo);
					var pay_img = $("#filePayPic")[0].files[0];
					if(pay_img){
						formData.append("file", pay_img);
					}
					$.ajax({
						url:'/?m=system&c=InsteadRule&a=paymentCard',
						type: "post",
						data: formData,
						processData: false,
						contentType: false,
						success:function(data){
							var data = JSON.parse(data);
							if(data['code'] == "ok"){
								layer.close(index);
								layer.msg(data['msg'], {
									icon: 1,
									time: 2000
								});
							}else{
								layer.msg(data['msg'], {
									icon: 2,
									time: 2000
								});
							}
						}	
					})	
				}
			});
		} else if(obj.event === 'payList'){  //查看付款记录
			var system_id = data['system_id'];
			var bat_no = data['bat_no'];
			paymentDataListLoad.tableLoadFunction( system_id,bat_no );
			$("#payBigImg").html("");
			layer.open({
				type: 1,
				title: '付款列表',
				skin: 'layui-layer-rim',
				area: ['1200px', '650px'],
				shade: 0.3,
				resize: false,
				content: $("#paymentList"),
			});
		} else if(obj.event === 'cancel'){  //取消审核
			var system_id = data['system_id'];
			var bat_no = data['bat_no'];
			layer.confirm('确定取消审核吗？', {
				btn: ['确认','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=InsteadRule&a=cancelAdd',
					dataType: 'json',
					type: "post",
					data:{
						system_id:system_id,
						bat_no:bat_no,
					},
					success:function(data){
						if(data.code == 'ok'){
							layer.close(index);
							tableLoad.tableLoadFunction();
							layer.msg(data['msg'], {
								icon: 1,
								time: 2000
							});
						}else{
							layer.msg(data['msg'], {
								icon: 2,
								time: 2000
							});
						}
					}
				})
			}, function(){});
		} else if(obj.event === 'adds'){  //审核波次
			var system_id = data['system_id'];
			var bat_no = data['bat_no'];
			layer.confirm('确定审核', {
				btn: ['确认','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=InsteadRule&a=throughAdd',
					dataType: 'json',
					type: "post",
					data:{
						system_id:system_id,
						bat_no:bat_no,
					},
					success:function(data){
						if(data.code == 'ok'){
							layer.close(index);
							tableLoad.tableLoadFunction();
							layer.msg(data['msg'], {
								icon: 1,
								time: 2000
							});
						}else{
							layer.msg(data['msg'], {
								icon: 2,
								time: 2000
							});
						}
					}
				})
			}, function(){});
		} else if(obj.event === 'dels'){  //删除波次
			var system_id = data['system_id'];
			var bat_no = data['bat_no'];
			layer.confirm('确定删除吗？', {
				btn: ['确认','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=InsteadRule&a=throughDelete',
					dataType: 'json',
					type: "post",
					data:{
						system_id:system_id,
						bat_no:bat_no,
					},
					success:function(data){
						if(data.code == 'ok'){
							layer.close(index);
							tableLoad.tableLoadFunction();
							layer.msg(data['msg'], {
								icon: 1,
								time: 2000
							});
						}else{
							layer.msg(data['msg'], {
								icon: 2,
								time: 2000
							});
						}
					}
				})
			}, function(){});
		} else if(obj.event === 'ends'){  //完结
			var system_id = data['system_id'];
			var bat_no = data['bat_no'];
			layer.confirm('确定此波茨完结吗？', {
				btn: ['确认','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=InsteadRule&a=throughEnds',
					dataType: 'json',
					type: "post",
					data:{
						system_id:system_id,
						bat_no:bat_no,
					},
					success:function(data){
						if(data.code == 'ok'){
							layer.close(index);
							tableLoad.tableLoadFunction();
							layer.msg(data['msg'], {
								icon: 1,
								time: 2000
							});
						}else{
							layer.msg(data['msg'], {
								icon: 2,
								time: 2000
							});
						}
					}
				})
			}, function(){});
		} else if(obj.event === 'sure'){//确认送达
			var system_id = data['system_id'];
			var bat_no = data['bat_no'];
			layer.confirm('确定已到货吗？', {
				btn: ['确认','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=InsteadRule&a=setWaveArrive',
					dataType: 'json',
					type: "post",
					data:{
						system_id:system_id,
						bat_no:bat_no,
					},
					success:function(data){
						if(data.code == 'ok'){
							layer.close(index);
							tableLoad.tableLoadFunction();
							layer.msg(data['msg'], {
								icon: 1,
								time: 2000
							});
						}else{
							layer.msg(data['msg'], {
								icon: 2,
								time: 2000
							});
						}
					}
				})
			}, function(){});
		}
	});
	
	table.on('tool(paymentDataList)', function(obj){
		var data = obj.data;
		if(obj.event === 'setSign'){
			console.log(data['pic_url']);
			$("#payBigImg").html("<img src='http://"+data['pic_url']+"' style='width: 80%; margin-left: 10%; margin-top: 10px;'>");
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
	,height: 'full-90'
	,cols: [[ 
		{type:'numbers', width:100, title: '序号'}
		,{field:'system_id', width:150, title: '代拿客户系统号'}
		,{field:'system_name', width:120, title: '代拿客户名称'}
		,{field:'bat_no', minWidth:140, title: '波次号'}
		,{field:'create_time', width:160, title: '创建时间'}
		,{field:'total_fee', width:120, title: '应到金额'}
		,{field:'take_fee', width:120, title: '到货金额'}
		,{field:'take_tid_fee', width:120, title: '代拿费用'}
		,{field:'payment', width:120, title: '已付款金额'}
		,{field:'payment_time', width:160, title: '付款时间'}
		,{field:'status_now', width:100, title: '当前状态'}
		,{field:'status', width:350, title: '操作', align:'center', toolbar: '#barDemo'}
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
		var bat_no = $('#bat_no').val();
		$.ajax({
			url:'/?m=system&c=InsteadRule&a=getData',
			dataType: 'json',
			type: "post",
			data:{
				system_id: system_id,
				bat_no: bat_no,
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
var view_system_id = '';
var view_bat_no = '';
function searchInfo(){
	waveOrderView.tableLoadFunction(view_system_id,view_bat_no);
}
//波次订单查看列表
var tidItemsList = {
	elem: '#tidItemsList'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: '560'
	,done: function (d) {
		if(d.data[0].assist_cust != 'T'){
			$("[data-field='system_name']").css('display','none');
			$("[data-field='username']").css('display','none');
		}
	}
	,cols: [[ 
		{type:'numbers', width:50}
		,{field:'show_tid', minWidth:120, title: '订单号'}
		,{field:'unique_code', width:120, title: '唯一码'}
		,{field:'title', minWidth:120, title: '商品名称'}
		,{field:'sku_name', minWidth:120, title: '商品属性'}
		,{field:'prd_no', minWidth:120, title: '商品编码'}
		,{field:'take_status', minWidth:100, title: '拿货状态'}
		,{field:'take_price', minWidth:100, title: '拿货单价'}
		,{field:'price', minWidth:100, title: '代拿费用'}
		,{field:'system_name', width:120, title: '代拿客户名称'}
		,{field:'username', width:100, title: '拿货人员'}
		,{field:'print_type', width:100, title: '打印状态'}
		,{field:'is_refund', width:100, title: '是否退款'}
		,{field:'ishave', width:100, title: '是否取货'}
	]]
	,id: 'tidItemsList'
	,data:[]
	,even: true
};

//波次订单查看列表
var tidPrdList = {
	elem: '#tidPrdList'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: '560'
	,cols: [[ 
		{type:'numbers', width:50}
		,{field:'title', minWidth:120, title: '商品名称'}
		,{field:'sku_name', minWidth:120, title: '商品属性'}
		,{field:'prd_no', minWidth:120, title: '商品编码'}
		,{field:'take_price', minWidth:100, title: '拿货单价'}
		,{field:'price', minWidth:100, title: '代拿费用'}
		,{field:'num', minWidth:100, title: '应到数量'}
		,{field:'take_num', minWidth:100, title: '实到数量'}
		,{field:'take_fee', minWidth:100, title: '实到金额'}
	]]
	,id: 'tidPrdList'
	,data:[]
	,even: true
};

var waveOrderView = {
	tableObj:false,
	tableLoadFunction:function(system_id,bat_no){
		var table = layui.table;
		tidItemsList['page'] = {
			curr: 1 
		};
		var prd_no = $('#prd_no').val();
		var take_status = $('#take_status').val();
		$.ajax({
			url:'/?m=system&c=InsteadRule&a=waveOrderView',
			dataType: 'json',
			type: "post",
			data:{
				system_id: system_id,
				bat_no: bat_no,
				prd_no: prd_no,
				take_status: take_status,
			},
			success:function(data){
				if(data){
					if(!waveOrderView.tableObj){
						for(var i=0;i<data.length;i++){
							tidItemsList.data.push(data[i]);
						}
						waveOrderView.tableObj = table.render(tidItemsList);
					}else{
						tidItemsList.data = [];
						for(var i=0;i<data.length;i++){
							tidItemsList.data.push(data[i]);
						}
						waveOrderView.tableObj.reload(tidItemsList);
					}
				}	
			}
		})
	}
};

var wavePrdtView = {
	tableObj:false,
	tableLoadFunction:function(system_id,bat_no){
		var table = layui.table;
		tidItemsList['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=system&c=InsteadRule&a=wavePrdtView',
			dataType: 'json',
			type: "post",
			data:{
				system_id: system_id,
				bat_no: bat_no,
			},
			success:function(data){
				if(data){
					if(!wavePrdtView.tableObj){
						for(var i=0;i<data.length;i++){
							tidPrdList.data.push(data[i]);
						}
						wavePrdtView.tableObj = table.render(tidPrdList);
					}else{
						tidPrdList.data = [];
						for(var i=0;i<data.length;i++){
							tidPrdList.data.push(data[i]);
						}
						wavePrdtView.tableObj.reload(tidPrdList);
					}
				}
			}
		})
	}
};

//监听上传文件路径
$("#filePayPic").on("change",function(){
	var fileName = $(this).val();
	if(fileName == ""){
		$("#payUrlText").html("请选择文件");
	}else{
		$("#payUrlText").html(fileName);
	}
})

//付款列表
var paymentDataList = {
	elem: '#paymentDataList'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: '560'
	,cols: [[ 
		{type:'numbers', width:50}
		,{field:'bat_no', width:250, title: '波次', event: 'setSign', style:'cursor: pointer;'}
		,{field:'system_name', width:120, title: '商品名称', event: 'setSign', style:'cursor: pointer;'}
		,{field:'payment', width:120, title: '付款金额', event: 'setSign', style:'cursor: pointer;'}
		,{field:'memo', minWidth:150, title: '备注', event: 'setSign', style:'cursor: pointer;'}
		,{field:'payment_time', width:170, title: '付款时间', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'paymentDataList'
	,data:[]
	,even: true
};
var paymentDataListLoad = {
	tableObj:false,
	tableLoadFunction:function(system_id,bat_no){
		var table = layui.table;
		paymentDataList['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=system&c=InsteadRule&a=paymentDataListLoad',
			dataType: 'json',
			type: "post",
			data:{
				system_id: system_id,
				bat_no: bat_no,
			},
			success:function(data){
				if(data){
					if(!paymentDataListLoad.tableObj){
						for(var i=0;i<data.length;i++){
							paymentDataList.data.push(data[i]);
						}
						paymentDataListLoad.tableObj = table.render(paymentDataList);
					}else{
						paymentDataList.data = [];
						for(var i=0;i<data.length;i++){
							paymentDataList.data.push(data[i]);
						}
						paymentDataListLoad.tableObj.reload(paymentDataList);
					}
				}
			}
		})
	}
};

function tidPrdListExport(){
	var system_id = vue.system_id;
	var bat_no = vue.bat_no;
	
	var url = "?m=system&c=InsteadRule&a=outputExcel&system_id="+system_id+"&bat_no="+bat_no;
	$("#ifile").attr('src',url);

}

