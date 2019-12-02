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
	tableLoad.tableLoadFunction();
	
	table.on('tool(dataList)', function(obj){
		var data = obj.data;
		var id = data['id'];
		var system_id = data['system_id'];
		if(obj.event === 'setup'){
			layer.confirm('确认绑定？', {
				btn: ['确定','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=TakeBusinessman&a=addCourier',
					dataType: 'json',
					type: "post",
					data:{
						id : id,
						system_id:system_id,
						data:data,
					},
					success:function(data){
						if(data.code == 'ok'){
							layer.close(index);
							//绑定后更新绑定商家显示
							tableLoad.tableLoadFunction();
						}
						layer.msg(data.msg);
					}
				})
			}, function(){});
		} else if(obj.event === 'remove'){
			var string = "<strong>温馨提示：</strpng></br>解绑后，将清除账户余额，如有误操作，请联系代发商家处理。是否确认解绑";
			layer.confirm(string, {
				btn: ['确定','取消']
			}, function(index, layero){
				$.ajax({
					url:'?m=system&c=TakeBusinessman&a=delCourier',
					dataType: 'json',
					type: "post",
					data:{
						id : id,
						system_id:system_id,
						data:data,
					},
					success:function(data){
						if(data.code == 'ok'){
							layer.close(index);
							//解绑后更新绑定商家显示
							tableLoad.tableLoadFunction();
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
	,height: 'full-220'
	,cols: [[ 
		{type:'numbers', width:100, title: '序号'}
		,{field:'system_id', width:150, title: '系统号'}
		,{field:'name', minWidth:200, title: '代拿名称'}
		,{field:'address', minWidth:200, title: '代拿地址'}
		,{field:'price', width:150, title: '单价'}
		,{field:'linkman', width:150, title: '联系人'}
		,{field:'phone', width:150, title: '联系电话'}
		,{fixed: 'right', width:150, title: '操作', align:'center', toolbar: '#barDemo'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
};
var tableLoad = {
	tableObj:false,
	tableLoadFunction:function(){
		var table = layui.table;
		var system_id = $("#system_id").val();
		dataList['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'?m=system&c=TakeBusinessman&a=getData',
			dataType: 'json',
			type: "post",
			data:{
				system_id:system_id,
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

$("#searchOrder").click(function(){
	tableLoad.tableLoadFunction();
})