var flow = new Vue({
	el: '#flow',
	data: {
		tableData:[],
		chooseDate:[]
	}
})

layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,upload = layui.upload //上传
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;	

	laydate.render({
		elem: '#startTime'
		,type: 'datetime'
	});
	laydate.render({
		elem: '#endTime'
		,type: 'datetime'
	});
	
	leftTableLoad.tableLoadTable();
	rightTableLoad.tableLoadTable();
	detailTableLoad.tableLoadTable();
})

var leftTable = {
	elem: '#leftTableList'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100, 200]
	,limit: 50 
	,height: 'full-150'
	,cols: [[ 
		{type:'checkbox'}
		,{type:'numbers', width:70, title: '序号'}
		,{field:'', width:100, title: '店铺'}
		,{field:'', width:100, title: '订单编号'}
		,{field:'', width:80, title: '收入金额'}
		,{field:'', width:80, title: '支出金额'}
		,{field:'', width:90, title: '费用项目'}
		,{field:'', width:100, title: '订单批次号'}
		,{field:'', width:100, title: '订单旗帜'}
	]]
	,id: 'leftTableList'
	,data:[]
	,even: true
};

var leftTableLoad = {
	tableObj:false,
	tableLoadTable:function(wave_no){
		var table = layui.table;
		leftTable['page'] = {
			curr: 1 
		};
		table.render(leftTable);
		/**
		$.ajax({
			url:'',
			dataType: 'json',
			type: "post",
			data:{wave_no:wave_no},
			success:function(data){
				if(!leftTableLoad.tableObj){
					for(var i=0;i<data.length;i++){
						leftTable.data.push(data[i]);
					}
					leftTableLoad.tableObj = table.render(leftTable);
				}else{
					leftTable.data = [];
					for(var i=0;i<data.length;i++){
						leftTable.data.push(data[i]);
					}
					leftTableLoad.tableObj.reload(leftTable);
				}
			}
		})
		*/
	}
};

var rightTable = {
	elem: '#rightTableList'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100, 200]
	,limit: 50 
	,height: 'full-450'
	,cols: [[ 
		{type:'checkbox'}
		,{type:'numbers', width:70, title: '序号'}
		,{field:'', width:150, title: '立账单号'}
		,{field:'', width:150, title: '订单编号'}
		,{field:'', width:100, title: '业务单号'}
		,{field:'', width:100, title: '立账时间'}
		,{field:'', width:80, title: '实付金额'}
		,{field:'', width:80, title: '未充金额'}
		,{field:'', width:100, title: '业务类型'}
		,{field:'', width:100, title: '客户'}
		,{field:'', width:100, title: '收款账号'}
		,{field:'', width:150, title: '买家昵称'}
		,{field:'', width:100, title: '订单新增时间'}
		,{field:'', width:100, title: '订单分配时间'}
	]]
	,id: 'rightTableList'
	,data:[]
	,even: true
};

var rightTableLoad = {
	tableObj:false,
	tableLoadTable:function(wave_no){
		var table = layui.table;
		rightTable['page'] = {
			curr: 1 
		};
		table.render(rightTable);
		/**
		$.ajax({
			url:'',
			dataType: 'json',
			type: "post",
			data:{wave_no:wave_no},
			success:function(data){
				if(!rightTableLoad.tableObj){
					for(var i=0;i<data.length;i++){
						rightTable.data.push(data[i]);
					}
					rightTableLoad.tableObj = table.render(rightTable);
				}else{
					rightTable.data = [];
					for(var i=0;i<data.length;i++){
						rightTable.data.push(data[i]);
					}
					rightTableLoad.tableObj.reload(rightTable);
				}
			}
		})
		*/
	}
};
var detailTable = {
	elem: '#detailTableList'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100, 200]
	,limit: 50 
	,height: '290'
	,cols: [[ 
		{type:'checkbox'}
		,{type:'numbers', width:100, title: '序号'}
		,{field:'', width:150, title: '预收款单号'}
		,{field:'', width:100, title: '收款日期'}
		,{field:'', width:150, title: '往来单位'}
		,{field:'', width:100, title: '可冲金额'}
		,{field:'', width:150, title: '备注'}
	]]
	,id: 'detailTableList'
	,data:[]
	,even: true
};

var detailTableLoad = {
	tableObj:false,
	tableLoadTable:function(wave_no){
		var table = layui.table;
		detailTable['page'] = {
			curr: 1 
		};
		table.render(detailTable);
		/**
		$.ajax({
			url:'',
			dataType: 'json',
			type: "post",
			data:{wave_no:wave_no},
			success:function(data){
				if(!detailTableLoad.tableObj){
					for(var i=0;i<data.length;i++){
						detailTable.data.push(data[i]);
					}
					detailTableLoad.tableObj = table.render(detailTable);
				}else{
					detailTable.data = [];
					for(var i=0;i<data.length;i++){
						detailTable.data.push(data[i]);
					}
					detailTableLoad.tableObj.reload(detailTable);
				}
			}
		})
		*/
	}
};

function leftSearch(){
	$("#leftShopName").val();
	$("#leftOrderNum").val();
	$("#leftOrderPrice").val();
	$("#leftOrderBatch").val();
}
function leftClear(){
	$("#leftShopName").val("");
	$("#leftOrderNum").val("");
	$("#leftOrderPrice").val("");
	$("#leftOrderBatch").val("");
}
function rightSearch(){
	$("#rightOrderNum").val();
	$("#rightShopName").val();
	$("#rightCollection").val();
	$("#rightNickName").val();
}
function rightClear(){
	$("#rightOrderNum").val("");
	$("#rightShopName").val("");
	$("#rightCollection").val("");
	$("#rightNickName").val("");
}



