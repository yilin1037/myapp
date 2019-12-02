var vue = new Vue({
	el: '#vue',
	data: {
		shippingCusArr: paramObject.shippingCusObj,
		undertakesCompany:1,   //判断是否是代发公司  0不是代发，1是代发 
		system_id:"",
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
var active = {};
layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;
	
	//初始化表格
	/**
	if(vue.undertakesCompany == 1){
		table.render(tableLoadOne);
	}else{
		table.render(tableLoadTwo);
	}
	vueLoad.tableLoadTable();
	*/
	
	//年月范围
	laydate.render({
		elem: '#yearMonth'
		,type: 'month'
		,range: true
	});
	
	var cols = [];
	if(vue.undertakesCompany == 1){
		cols = [[ 
			{type:'numbers', width:100, title: '序号'}
			,{field:'ADDDATE', minWidth:200, title: '日期'}
			,{field:'system_name', minWidth:200, title: '客户'}
			,{field:'nums', width:200, title: '订单量'}
			,{field:'total_deposit', width:150, title: '充值（元）'}
			,{field:'total_express', width:150, title: '快递费（元）'}
			,{field:'take_money', width:150, title: '代拿费（元）'}
			,{field:'other_money', width:150, title: '其他费用（元）'}
			,{field:'prd_express', width:150, title: '货品费用（元）'}
			,{field:'balance', width:200, title: '当天余额（元）'}
		]];
	}else{
		cols = [[ 
			{type:'numbers', width:100, title: '序号'}
			,{field:'ADDDATE', minWidth:200, title: '日期'}
			,{field:'nums', width:200, title: '订单量'}
			,{field:'total_deposit', width:150, title: '充值（元）'}
			,{field:'total_express', width:150, title: '快递费（元）'}
			,{field:'take_money', width:150, title: '代拿费（元）'}
			,{field:'other_money', width:150, title: '其他费用（元）'}
			,{field:'prd_express', width:150, title: '货品费用（元）'}
			,{field:'balance', width:200, title: '当天余额（元）'}
		]];
	}
	
	table.render({
		elem: '#dataList'
		,url: '/?m=system&c=ForSummary&a=getData'
		,cols: cols
		,id: 'dataList'
		,skin: 'row'
		,page: true 
		,limits: [50, 100, 200]
		,limit: 50 
		,height: 'full-85'
		,even: true
	});
	
	table.on('tool(customerList)', function(obj){
		var data = obj.data;
		$("#khName").val(data.name);
		vue.system_id = data.system_id;
		layer.closeAll();
	});
	
	//重新加载
	var $ = layui.$;
	active = {
		reload: function(){
			var undertakesCompany = vue.undertakesCompany;
			var yearMonth = $("#yearMonth").val();
			if(yearMonth == ""){
				layer.msg('请选择日期');
				return false;
			}
			var khName = $("#khName").val();
			if(khName == ""){
				layer.msg('请选择客户');
				return false;
			}
			var system_id = vue.system_id;
			table.reload('dataList', {
				page: {
					curr: 1 //重新从第 1 页开始
				}
				,where: {
					yearMonth:yearMonth,
					khName:khName,
					system_id:system_id,
					shopId:$("#shipping").val(),
				}
			});
		}
	};
});
/**
var tableLoadOne = {
	elem: '#dataList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,height: 'full-85'
	,cols: [[ 
		{type:'numbers', width:100, title: '序号'}
		,{field:'ADDDATE', minWidth:200, title: '日期'}
		,{field:'system_name', minWidth:200, title: '客户'}
		,{field:'nums', width:200, title: '订单量'}
		,{field:'total_deposit', width:150, title: '充值（元）'}
		,{field:'total_express', width:150, title: '快递费（元）'}
		,{field:'prd_express', width:150, title: '货品费用（元）'}
		,{field:'balance', width:200, title: '当天余额（元）'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
};
var tableLoadTwo = {
	elem: '#dataList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,height: 'full-85'
	,cols: [[ 
		{type:'numbers', width:100, title: '序号'}
			,{field:'ADDDATE', minWidth:200, title: '日期'}
			,{field:'nums', width:200, title: '订单量'}
			,{field:'total_deposit', width:150, title: '充值（元）'}
			,{field:'total_express', width:150, title: '快递费（元）'}
			,{field:'prd_express', width:150, title: '货品费用（元）'}
			,{field:'balance', width:200, title: '当天余额（元）'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
};

var vueLoad = {
	tableOneObj:false,
	tableTwoObj:false,
	tableLoadTable:function(){
		var undertakesCompany = vue.undertakesCompany;
		var table = layui.table;
		tableLoadOne['page'] = {
			curr: 1 
		};
		tableLoadTwo['page'] = {
			curr: 1 
		};
		var yearMonth = $("#yearMonth").val();
		if(yearMonth == ""){
			layer.msg('请选择日期');
			return false;
		}
		var khName = $("#khName").val();
		if(khName == ""){
			layer.msg('请选择客户');
			return false;
		}
		var system_id = vue.system_id;
		$.ajax({
			url:'/?m=system&c=ForSummary&a=getData',
			dataType: 'json',
			type: "post",
			data:{
				yearMonth:yearMonth,
				khName:khName,
				system_id:system_id,
			},
			success:function(data){
				if(data){
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
			}
		})
	}
};
*/

//回车搜索
function searchTable(){
	//vueLoad.tableLoadTable();
	active['reload'] ? active['reload'].call(this) : '';
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

function userNameSearch(){
	custLoad.tableLoadTable();
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

$("#reset").click(function(){
	$("#userName").val("");
})
