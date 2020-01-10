var vue = new Vue({
	el: '#vue',
	data: {
		shippingCusArr: paramObject.shippingCusObj,
		undertakesCompany:1,   //判断是否是代发公司  0不是代发，1是代发 
		system_id:"",
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
	

	//年月范围
	laydate.render({
		elem: '#yearMonth'
		,type: 'month'
		,range: true
	});
	
	cols = [[ 
		{field:'system_name', minWidth:200, title: '客户名称'}
		,{field:'num_res_go', minWidth:200, title: '发货单数'}
		,{field:'num_res_out', minWidth:200, title: '回收单数'}
		,{field:'num', minWidth:200, title: '返点单数'}
		,{field:'rebate', width:200, title: '每单返点'}
		,{field:'money', width:150, title: '返点金额'}
	]];

	
	table.render({
		elem: '#dataList'
		,url: '/?m=system&c=returnMoney&a=getData'
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
			url:'/?m=system&c=returnMoney&a=getCustomer',
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
