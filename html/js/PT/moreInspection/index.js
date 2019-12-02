var flow = new Vue({
	el: '#flow',
	data: {
		data:[],    	//第一条数据
		datas:[], 		//全部数据
		express_no:""	//物流单号
	},
	mounted: function() {
		var oWidth = $(window).width();
		$(".rightTable").css('width',(oWidth-300)+'px');
		layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
			var laydate = layui.laydate 	//日期
				,laypage = layui.laypage 	//分页
				,layer = layui.layer 		//弹层
				,upload = layui.upload 		//上传
				,form = layui.form 			//表单
				,element = layui.element; 	//元素操作
			var table = layui.table;
			
			//初始化表格样式
			table.render(dataList);
			
			//监听单元格变动
			table.on('edit(dataList)', function(obj){
				var value = obj.value 	//得到修改后的值
				,data = obj.data 		//得到所在行所有键值
				,field = obj.field; 	//得到字段
				flow.datas = dataList.data;
				insState();
			});
		})
		
		$("#reset").click(function(){
			$("#logisticsSingle").val("");
			$("#goodsCodesInput").val("");
			$("#orderWeight").val("");
			$("#goodsCodesInput").attr("readonly",false);
			dataList.data = [];
			tableLoad.tableObj.reload(dataList);
		})
	}
});

//扫描物流单号
function logSingle(){
	$("#logisticsSingle").val();
	var express_no = $("#logisticsSingle").val();
	$("#logisticsSingle").val("");
	flow.express_no = express_no;
	if(express_no == ""){
		layer.msg('请输入快递单号',{
			icon: 0,
			time: 2000
		});
		return false;
	}
	tableLoad.tableLoadFunction();
}

//扫描商品编号
function goodsCodes(){
	$("#goodsCodesInput").attr("readonly",true);
	var goodsCodes = $("#goodsCodesInput").val();
	var datas = flow.datas;
	$.ajax({
		url:'?m=PT&c=moreInspection&a=goodsInspection',
		dataType: 'json',
		type: "post",
		data:{
			goodsCodes:goodsCodes,
			datas:datas,
		},
		success:function(data){
			if(data['code'] == 'ok'){
				flow.datas = data['data'];
				dataList.data = [];
				for(var i=0;i<data['data'].length;i++){
					dataList.data.push(data['data'][i]);
				}
				tableLoad.tableObj.reload(dataList);
				insState();
				if(data['onOff'] == 1){
					//全部商品匹配完毕，发货
					timingDelivery();
				}else{
					speckText(data['msg']);
					layer.msg(data['msg'],{
						icon: 1,
						time: 2000
					});
					$("#goodsCodesInput").val("");
					$("#goodsCodesInput").attr("readonly",false);
					$("#goodsCodesInput").focus();
				}
			}else{
				speckText(data['msg']);
				layer.msg(data['msg'],{
					icon: 2,
					time: 2000
				});
				$("#goodsCodesInput").val("");
				$("#goodsCodesInput").attr("readonly",false);
			}
		}
	})
}

//扫描发货
function timingDelivery(){
	var datas = flow.datas;
	var orderWeight = $("#orderWeight").val();
	$.ajax({
		url:'?m=PT&c=moreInspection&a=timingDelivery',
		dataType: 'json',
		type: "post",
		data:{
			datas:datas,orderWeight:orderWeight,
		},
		success:function(data){
			if(data['code'] == 'ok'){
				speckText('发货成功');
				layer.msg('发货成功',{
					icon: 1,
					time: 2000
				});
				$("#logisticsSingle").focus();
				$("#logisticsSingle").val("");
			}else if(data['code'] == 'error1'){
				speckText(data['msg']);
				layer.msg(data['msg'],{
					icon: 2,
					time: 2000
				});
				$("#goodsCodesInput").focus();
			}else{
				speckText(data['msg']);
				layer.msg(data['msg'],{
					icon: 2,
					time: 2000
				});
				$("#logisticsSingle").focus();
				$("#logisticsSingle").val("");
			}
		}
	})
	$("#goodsCodesInput").val("");
	$("#orderWeight").val("");
	$("#goodsCodesInput").attr("readonly",false);
}

var dataList = {
	elem: '#dataList'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: 'full-80'
	,cols: [[
		{type:'numbers', width:100, title: '序号'}
		,{field:'pic_url', width:60, title: '图片'}
		,{field:'prd_no', minWidth:200, title: '编号'}
		,{field:'title', minWidth:200, title: '宝贝'}
		,{field:'sku_name', minWidth:200, title: '属性'}
		,{field:'nums', width:100, title: '数量'}
		,{field:'ins_nums', width:100, title: '验货数量', edit: 'text'}
		,{field:'ins_state', width:100, title: '验货状态', templet: '#ins_state'}
		,{field:'refund_status', width:100, title: '退货状态', templet: '#refund_state'}
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
		var express_no = flow.express_no;
		$.ajax({
			url:'?m=PT&c=moreInspection&a=getDeliveryList',
			dataType: 'json',
			type: "post",
			data:{
				express_no:express_no,
			},
			success:function(data){
				if(data && data != ''){
					flow.data = data[0];
					for(var i=0;i<data.length;i++){
						if(data[i]['send_status'] == 'WAIT_SENDED'){  //已发货
							speckText('此单已发货');
							layer.msg('此单已发货',{
								icon: 0,
								time: 2000
							});
							$("#logisticsSingle").val("");
							return false;
						}else if(data[i]['send_status'] == 'WAIT_FAULT'){  //已取消
							speckText('此单已取消');
							layer.msg('此单已取消',{
								icon: 0,
								time: 2000
							});
							$("#logisticsSingle").val("");
							return false;
						}else if(data[i]['send_status'] == 'LOCK'){  //已锁定
							speckText('此单已锁定');
							layer.msg('此单已锁定',{
								icon: 0,
								time: 2000
							});
							$("#logisticsSingle").val("");
							return false;
						}else if(data[i]['refund'] == 'refund_status'){
							speckText('此单已退款');
							layer.msg('此单已退款',{
								icon: 0,
								time: 2000
							});
							deliveryOnoff = 0;
							$("#logisticsSingle").val("");
							$("#goodsCodesInput").focus();
						}else if(data[i]['refund'] == 'WAIT_SELLER_AGREE'){
							speckText('此单申请退款');
							layer.msg('此单申请退款',{
								icon: 0,
								time: 2000
							});
							deliveryOnoff = 0;
							$("#logisticsSingle").val("");
							$("#goodsCodesInput").focus();
						}else if(data[i]['mark_status'] == 'LOCK'){
							speckText('此单已锁定');
							layer.msg('此单已锁定',{
								icon: 0,
								time: 2000
							});
							deliveryOnoff = 0;
							$("#logisticsSingle").val("");
							$("#logisticsSingle").focus();
						}
					}
					flow.datas = data;
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
					$("#goodsCodesInput").focus();
				}else{
					speckText('无效的物流单号');
					layer.msg('无效的物流单号',{
						icon: 0,
						time: 2000
					});
					table.render(dataList);
					$("#logisticsSingle").val("");
				}
			}
		})
	}
};

function insState(){
	var datas = flow.datas;
	for(var i in datas){
		if(datas[i]['refund'] == 'SUCCESS'){
			datas[i]['ins_nums'] = 0;
		}else{
			if(datas[i]['ins_nums'] == datas[i]['nums']){
				datas[i]['ins_state'] = '通过';
			}else{
				datas[i]['ins_state'] = '未通过';
			}
		}
	}
	dataList.data = [];
	for(var i=0;i<datas.length;i++){
		dataList.data.push(datas[i]);
	}
	tableLoad.tableObj.reload(dataList);
	flow.datas = datas;
}