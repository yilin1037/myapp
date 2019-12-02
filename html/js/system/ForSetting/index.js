var flow = new Vue({
	el: '#flow',
	data: {
		system:[],				//系统号
		express_arr:[],			//快递类型
		provinceList:[],		//省份列表
		dataTable:[],			//数据列表
		selectedTable:[]		//选中数据
	},
	mounted: function() {
		$.ajax({
			url:'/?m=system&c=ForSetting&a=getBasicSetUp',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				flow.provinceList = data['provinceList'];
				flow.system = data['system'];
				flow.express_arr = data['express_arr'];
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
			//初始化表格
			vueLoad.tableLoadTable();
			
			//保存提交
			form.on('submit(addAmong)', function(data){
				var system_id = $("#system_id").val();
				var express_type = $("#express_type").val();
				if(express_type == ""){
					layer.msg('请选择快递');
					return false;
				}
				var price = $("#price").val();
				if(price == ""){
					layer.msg('请填写单价');
					return false;
				}
				$.ajax({
					url:'/?m=system&c=ForSetting&a=addAmongList',
					dataType: 'json',
					type: "post",
					data:{
						data:data['field'],
						system_id:system_id,
						express_type:express_type,
						price:price,
					},
					success:function(data){
						if(data.code == 'ok'){
							vueLoad.tableLoadTable();
						}
						layer.msg(data.msg);
					}
				})
				return false;
			});
			
			//单个删除
			table.on('tool(dataListEvent)', function(obj){
				var data = obj.data;
				if(obj.event === 'del'){
					layer.confirm('确认删除？', {
						btn: ['确定','取消']
					}, function(){
						$.ajax({
							url:'/?m=system&c=ForSetting&a=delBasicSetUp',
							dataType: 'json',
							type: "post",
							data:{
								id:data.id,
							},
							success:function(data){
								if(data.code == "ok"){
									layer.msg('修改成功');
									vueLoad.tableLoadTable();
								}else{
									layer.msg('修改失败');
								}
							}
						})
					});
				}
			});
			
			$("#choooseAll").click(function(){
				$("#checkboxList")[0].reset();
				$("#provinceList input").attr("checked","checked");
				form.render('checkbox');
			});
			
			$("#chooseNot").click(function(){
				$("#checkboxList")[0].reset();
				$("#provinceList input").removeAttr("checked");
				form.render('checkbox');
			});
			
			//监听数据列表
			table.on('checkbox(dataListEvent)', function(obj){
				if(obj.type == "all" && obj.checked == true){
					flow.selectedTable = flow.dataTable;
				}
				if(obj.type == "all" && obj.checked == false){
					flow.selectedTable = [];
				}
				if(obj.type == "one"){
					if(obj.checked == true){
						var arrs = flow.selectedTable;
						arrs.push(obj.data);
						flow.selectedTable = arrs;
					}else{
						var arrs = flow.selectedTable;
						var indexs = 0;
						for(var i=0;i<arrs.length;i++){
							if(arrs[i].id == obj.data.id){
								indexs = i;
							}
						}
						arrs.splice(indexs,1);
						flow.selectedTable = arrs;
					}
				}
			});
			
			//批量删除
			$("#delBatch").click(function(){
				var selectedTable = flow.selectedTable;
				$.ajax({
					url:'/?m=system&c=ForSetting&a=selectedTable',
					dataType: 'json',
					type: "post",
					data:{
						selectedTable:selectedTable,
					},
					success:function(data){
						if(data.code == 'ok'){
							vueLoad.tableLoadTable();
						}
						layer.msg(data.msg);
					}
				})
			})
			setTimeout(function(){
				form.render('checkbox');
				form.render('select');
			},100)
		})
	}
})

var tableLoad = {
	elem: '#dataList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50
	,height: 'full-210'
	,cols: [[ 
		{type:'checkbox', width:50, align:'center'}
		,{type:'numbers', minWidth:100, title: '序号'}
		,{field:'system_name', minWidth:250, title: '系统号'}
		,{field:'province', minWidth:200, title: '省份'}
		,{field:'price', minWidth:200, title: '单价'}
		,{field:'type_name', minWidth:250, title: '单价'}
		,{fixed: 'right', width:200, align:'center', toolbar: '#barDemo', title: '操作'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
};

var vueLoad = {
	oldTree:false,
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		tableLoad['page'] = {
			curr: 1 
		};
		var system_id = $("#system_id").val();
		var province = $("#province").val();
		$.ajax({
			url:'/?m=system&c=ForSetting&a=getLoadTable',
			dataType: 'json',
			type: "post",
			data:{
				system_id:system_id,
				province:province,
			},
			success:function(data){
				flow.dataTable = data;
				if(!vueLoad.tableObj){
					for(var i=0;i<data.length;i++){
						tableLoad.data.push(data[i]);
					}
					vueLoad.tableObj = table.render(tableLoad);
				}else{
					tableLoad.data = [];
					for(var i=0;i<data.length;i++){
						tableLoad.data.push(data[i]);
					}
					vueLoad.tableObj.reload(tableLoad);
				}
			}
		})
	}
};
























