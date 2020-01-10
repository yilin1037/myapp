var vue = new Vue({
	el: '#vue',
	data: {
		shippingCusArr: paramObject.shippingCusObj,
		undertakesCompany:1,   //判断是否是代发公司  0不是代发，1是代发 
	},
	mounted: function(){
		$.ajax({
			url:'/?m=system&c=ForSummary&a=getUnCompany',
			dataType: 'json',
			type: "post",
			success:function(data){
				if(data == 'T'){
					vue.undertakesCompany = 1;
				}else{
					vue.undertakesCompany = 0;
				}
			}
		})
	}
});

layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;
	
	if(vue.undertakesCompany == 1){
		table.render(tableLoadOne);
	}else{
		table.render(tableLoadTwo);
	}
	vueLoad.tableLoadTable();
	laydate.render({
		elem: '#timeStart'
	});
	laydate.render({
		elem: '#timeEnd'
	});
	
	table.on('tool(customerList)', function(obj){
		var data = obj.data;
		console.log(data);
		$("#khName").val(data.name);
		layer.closeAll();
	});

	//监听工具条
	table.on('tool(dataList)', function(obj){
		var data = obj.data;
		if(obj.event === 'view'){
			otherMoneyLoad.tableLoadTable(data);
			layer.open({
				type: 1,
				title: '费用详情',
				skin: 'layui-layer-rim', //加上边框
				area: ['400px', '300px'], //宽高
				shade: 0.3,
				content: $("#openOtherInfo"),
				cancel: function(index, layero){ 
					
				}   
			});	
		} 
	});
});

var tableLoadOne = {
	elem: '#dataList'
	,url:''
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: 'full-85'
	,cols: [[
		{type:'numbers', width:100, title: '序号'}
		,{field:'tid', width:150, title: '订单号'}
		,{field:'strpos', width:150, title: '订单类型'}
		,{field:'addtime', width:200, title: '时间'}
		,{field:'system_name', width:150, title: '客户'}
		,{field:'system_id', width:150, title: '客户电话'}
		,{field:'deposit_money', width:120, title: '充值(元)'}
		,{field:'express_money', width:130, title: '扣快递费(元)'}
		,{field:'take_price', width:130, title: '扣代拿费(元)'}
		,{field:'other_money', width:130, title: '扣其他费(元)', templet: '#other_money_list'}
		,{field:'prd_money', width:140, title: '扣货品费用(元)'}
		,{field:'balance', width:100, title: '余额(元)'}
		,{field:'remark', minWidth:200, title: '备注'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
};

var tableLoadTwo = {
	elem: '#dataList'
	,url:''
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: 'full-85'
	,cols: [[
		{type:'numbers', width:100, title: '序号'}
		,{field:'tid', width:200, title: '订单号'}
		,{field:'strpos', width:200, title: '订单类型'}
		,{field:'addtime', width:200, title: '时间'}
		,{field:'deposit_money', width:120, title: '充值(元)'}
		,{field:'express_money', width:130, title: '扣快递费(元)'}
		,{field:'other_money', width:130, title: '扣其他费(元)', templet: '#other_money_list'}
		,{field:'prd_money', width:140, title: '扣货品费用(元)'}
		,{field:'balance', width:150, title: '余额(元)'}
		,{field:'remark', minWidth:200, title: '备注'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
};

var vueLoad = {
	tableOneObj:false,
	tableTwoObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		tableLoadOne['page'] = {
			curr: 1 
		};
		tableLoadTwo['page'] = {
			curr: 1 
		};
		var timeStart = $("#timeStart").val();
		var timeEnd = $("#timeEnd").val();
		var khName = $("#khName").val();
		var auditState = $("#auditState").val();
		if(timeStart == "" ){
			layer.msg('请填写查询开始时间');
			return false;
		}
		if(timeEnd == ""){
			layer.msg('请填写查询结束时间');
			return false;
		}
		if(khName == ""){
			layer.msg('请填写查询客户名称');
			return false;
		}
		$.ajax({
			url:'/?m=system&c=ForDetail&a=getData',
			dataType: 'json',
			type: "post",
			data:{
				timeStart:timeStart,
				timeEnd:timeEnd,
				khName:khName,
				auditState:auditState,
				shopId:$("#shipping").val(),
			},
			success:function(data){
				if(vue.undertakesCompany == 1){
					if(!vueLoad.tableOneObj){
						for(var i=0;i<data.length;i++){
							tableLoadOne.data.push(data[i]);
						}
						vueLoad.tableOneObj = table.render(tableLoadOne);
					}else{
						tableLoadOne.data = [];
						for(var i=0;i<data.length;i++){
							tableLoadOne.data.push(data[i]);
						}
						vueLoad.tableOneObj.reload(tableLoadOne);
					}	
				}else{
					if(!vueLoad.tableTwoObj){
						for(var i=0;i<data.length;i++){
							tableLoadTwo.data.push(data[i]);
						}
						vueLoad.tableTwoObj = table.render(tableLoadTwo);
					}else{
						tableLoadTwo.data = [];
						for(var i=0;i<data.length;i++){
							tableLoadTwo.data.push(data[i]);
						}
						vueLoad.tableTwoObj.reload(tableLoadTwo);
					}
				}
			}
		})
	}
};

function userNameSearch(){
	custLoad.tableLoadTable();
}
 
//选择客户
function waveName(){
	$("#userName").val("");
	custLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '选择客户',
		skin: 'layui-layer-rim', //加上边框
		area: ['500px', '400px'], //宽高
		shade: 0.3,
		content: $("#customerChoose"),
		cancel: function(index, layero){ 
			$("#khName").val("");
		}   
	});	
}

var customerList = {
	elem: '#customerList'
	,skin: 'row'
	,page: true 
	,limits: [5, 20, 50, 100]
	,limit: 5 
	,height: '260'
	,cols: [[ 
		{type:'numbers', width:100, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'name', minWidth:300, title: '客户名称', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'customerList'
	,data:[]
	,even: true
};
var custLoad = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		customerList['page'] = {
			curr: 1 
		};
		var userName = $("#userName").val();
		$.ajax({
			url:'/?m=system&c=ForSummary&a=getCustomer',
			dataType: 'json',
			type: "post",
			data:{
				userName:userName,
			},
			success:function(data){
				if(data){
					if(!custLoad.tableObj){
						for(var i=0;i<data.length;i++){
							customerList.data.push(data[i]);
						}
						custLoad.tableObj = table.render(customerList);
					}else{
						customerList.data = [];
						for(var i=0;i<data.length;i++){
							customerList.data.push(data[i]);
						}
						custLoad.tableObj.reload(customerList);
					}
				}else{
					customerList.data = [];
					custLoad.tableObj.reload(customerList);
				}
			}
		})
	}
};

//顶部搜索重铸表格
function searchTable(){
	vueLoad.tableLoadTable();
}
$("#reset").click(function(){
	$("#userName").val("");
})

var otherInfo = {
	elem: '#otherInfo'
	,skin: 'row'
	,page: false 
	,where: {
		id:''
	}
	,height: 200
	,cols: [[ 
		{field:'cost_name', width:200, title: '费用名称'}
		,{field:'price', width:150, title: '费用'}
	]]
	,id: 'otherInfo'
	,data:[]
	,even: true
};


var otherMoneyLoad = {
	tableObj:false,
	tableLoadTable:function(data){
		var table = layui.table;
		if(!otherMoneyLoad.tableObj)
		{
			otherInfo.data = data.other_money_list;
			otherMoneyLoad.tableObj = table.render(otherInfo);
		}else{
			otherInfo.data = data.other_money_list;
			otherMoneyLoad.tableObj.reload(otherInfo);
		}
	}
};




