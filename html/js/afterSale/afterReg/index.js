var vue = new Vue({
	el: '#vue',
	data: {
		switchRemark:false,
		dataNum:0,
	},
	mounted: function() {
		layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
			var laydate = layui.laydate 	//日期
				,laypage = layui.laypage 	//分页
				,layer = layui.layer 		//弹层
				,form = layui.form 			//表单
				,element = layui.element 	//元素操作
				,table = layui.table;		//表格	
			
			//监听指定开关
			form.on('switch(switchRemark)', function(data){
				vue.switchRemark = this.checked;
				if(this.checked){
					$(".disPlayNone").slideDown();
				}else{
					$(".disPlayNone").slideUp();
				}
			});
			
			//时间选择器
			laydate.render({
				elem: '#create_time'
				,type: 'datetime'
			});
			laydate.render({
				elem: '#end_time'
				,type: 'datetime'
			});
			
			//初始化快递列表
			$.ajax({
				url:'/?m=afterSale&c=afterReg&a=getExpressType',
				dataType: 'json',
				type: "post",
				data:{},
				success:function(data){
					var oHtml = '<option value="">请选择物流公司</option>';
					if(data){
						for(var i=0;i<data.length;i++){
							oHtml += '<option value="'+data[i]['express_id']+'">'+data[i]['type_name']+'</option>';
						}
						$("#express_type_add").html(oHtml);
						$("#express_type_search").html(oHtml);
						form.render('select');
					}
				}
			})
			//监听单元格编辑
			table.on('edit(dataList)', function(obj){
				var value = obj.value //得到修改后的值
				,data = obj.data //得到所在行所有键值
				,field = obj.field; //得到字段
				$.ajax({
					url:'/?m=afterSale&c=afterReg&a=updateExpressLine',
					dataType: 'json',
					type: "post",
					data:{
						value: value,
						field: field,
						id: data['id'],
					},
					success:function(data){
	
						layer.msg(data.msg);
					}
				})
			});
			//删除
			table.on('tool(dataList)', function(obj){
				var data = obj.data;
				var dataArr = dataList.data;
				if(obj.event === 'detail'){
					for(var i=0;i<dataArr.length;i++){
						if(dataArr[i]['express_no'] == data['express_no']){
							//delete dataList.data[i];
							dataList.data.splice(i, 1);
						}
					}
					tableLoad.tableObj = table.render(dataList);
				}
			});
			
			//初始化列表
			tableLoad.tableLoadFunction();
			$("#express_no").focus();
		})
	},
	methods:{
		//物流记录查询
		searchResult:function(){
			var self = this;
			self.searchTpl();
			tableLoad.tableLoadFunction("search");
		},
		//输入物流单号回车
		express_no_input:function(){
			var self = this;
			var express_no = $("#express_no").val();
			if(express_no == ''){
				layer.msg('请扫描物流单号',{icon: 2});
				return false;
			}
			if(self.switchRemark){
				$("#remark").focus();
			}else{
				self.addExpressReg(express_no,'');
				$("#express_no").val("");
			}
		},
		//备注回车
		remark_input: function(){
			var self = this;
			var express_no = $("#express_no").val();
			if(express_no == ''){
				$("#express_no").focus();
				layer.msg('请扫描物流单号',{icon: 2});
				return false;
			}
			var remark = $("#remark").val();
			self.addExpressReg(express_no,remark);
			$("#express_no").focus();
			$("#express_no").val("");
			$("#remark").val("");
		},
		//增加一行物流登记单
		addExpressReg:function( express_no,remark ){
			var self = this;
			//获取原有列表数据，看是否是查询的数据
			var dataArr = dataList.data;
			if(dataArr && dataArr[0] && dataArr[0]['type'] == 'search'){
				layer.msg('请先清除查询结果',{icon: 2});
				return false;
			}
			var express_type_add = $("#express_type_add").val();
			var package_add = $("#package_add").val();
			//查询当前列表是否存在当前的物流单号
			var express_on_off = false;
			for(var i=0; i<dataArr.length; i++){
				if(dataArr[i]['express_no'] == express_no){
					express_on_off = true;
				}
			}
			if(express_on_off){
				layer.msg('当前列表中已存在当前的物流单号',{icon: 2});
				return false;
			}
			//查询物流单号
			self.addTpl();
			$.ajax({
				url:'/?m=afterSale&c=afterReg&a=getExpressAdd',
				dataType: 'json',
				type: "post",
				data:{
					express_no: express_no,
					remark: remark,
					express_type_add: express_type_add,
					package_add: package_add,
				},
				success:function(data){
					if(data['code'] == "error"){
						layer.msg('已存在的物流单号',{icon: 2});
					}else{
						var table = layui.table;
						dataList.data.unshift(data);
						self.dataNum = dataList.data.length;
						tableLoad.tableObj = table.render(dataList);
						self.addExpressSave();
					}
				}
			})
		},
		//保存售后物流登记
		addExpressSave:function(){
			var self = this;
			var dataArr = dataList.data;
			if(dataArr && dataArr[0] && dataArr[0]['type'] == 'search'){
				layer.msg('请先清除查询结果',{icon: 2});
				return false;
			}
			if(dataArr && dataArr[0] && dataArr[0]['type'] == 'add'){
				var express_type_add = $("#express_type_add").val();
				/*if(express_type_add == ""){
					layer.msg('请选择快递类型',{icon: 2});
					return false;
				}*/
				var package_add = $("#package_add").val();
				/*if(package_add == ""){
					layer.msg('请输入包裹号',{icon: 2});
					return false;
				}*/
				$.ajax({
					url:'/?m=afterSale&c=afterReg&a=getExpressSave',
					dataType: 'json',
					type: "post",
					data:{
						data: dataArr,
						express_type_add:express_type_add,
						package_add:package_add,
					},
					success:function(data){
						if(data['code'] == "error"){
							layer.msg(data['msg'],{icon: 2});
						}else{
							layer.msg(data['msg'],{icon: 1});
							//dataList.data = [];
							//tableLoad.tableObj.reload(dataList);
							//self.dataNum++;
							//$("#express_type_add").val("");
							//$("#package_add").val("");
							var form = layui.form;
							form.render('select');
						}
					}
				})
			}
		},
		//到处查询
		searchExcel:function(){
			var create_time = $("#create_time").val();
			var end_time = $("#end_time").val();
			var express_type = $("#express_type_search").val();
			var package = $("#package_search").val();
			var express_no_search = $("#express_no_search").val();
			var url = "/?m=afterSale&c=afterReg&a=toExcel&create_time="+create_time+"&end_time="+end_time+"&express_type="+express_type+"&package="+package+"&express_no_search="+express_no_search;
			$("#ifile").attr('src',url);
			return false;
			
			$.ajax({
				url: "/?m=afterSale&c=afterReg&a=toExcel&loginact=file",
				type: 'post',
				data: {
					create_time: create_time,
					end_time: end_time,
					express_type: express_type,
					package: package,
					express_no_search:express_no_search,
				},
				dataType: 'text',
				success: function (text){
					if(text){
						layer.msg('已挂单或下架货品不能导出汇总',{
							icon: 0,
							time: 2000
						});
					}else{
						var url = "/xls/WaitSendorders"+time+".xls?loginact=file";
						$("#ifile").attr('src',url);
					}
				},error: function (jqXHR, textStatus, errorThrown) {
					layer.msg('jqXHR.responseText',{
						icon: 0,
						time: 2000
					});
				}
			});
			
		},
		//清除查询结果
		clearSearch:function(){
			dataList.data = [];
			tableLoad.tableObj.reload(dataList);
		},
		//查询模板
		searchTpl:function(){
			dataList.cols = [[ 
				{type:'numbers', fixed: 'left', width:80, title: '序号'}
				,{field:'express_no', width:200, title: '物流单号'}
				,{field:'create_time', width:200, title: '记录日期'}
				,{field:'express_type', width:200, title: '快递公司', edit: 'text'}
				,{field:'package', width:200, title: '包裹号', edit: 'text'}
				,{field:'remark', minWidth:200, title: '备注', edit: 'text'}
			]];
		},
		//提交模板
		addTpl:function(){
			dataList.cols = [[ 
				{type:'numbers', fixed: 'left', width:80, title: '序号'}
				,{fixed: 'left', width:150, align:'center', toolbar: '#barDemo', title: '操作'}
				,{field:'express_no', width:200, title: '物流单号'}
				,{field:'create_time', width:200, title: '记录日期'}
				,{field:'express_type', width:200, title: '快递公司'}
				,{field:'package', width:200, title: '包裹号'}
				,{field:'remark', minWidth:200, title: '备注'}
			]];
		}
	}
})

//主列表
var dataList = {
	elem: '#dataList'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: 'full-315'
	,cols: [[ 
		{type:'numbers', fixed: 'left', width:80, title: '序号'}
		,{fixed: 'left', width:150, align:'center', toolbar: '#barDemo', title: '操作'}
		,{field:'express_no', width:200, title: '物流单号'}
		,{field:'create_time', width:200, title: '记录日期'}
		,{field:'express_type', width:200, title: '快递公司'}
		,{field:'package', width:200, title: '包裹号'}
		,{field:'remark', minWidth:200, title: '备注'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
	,done:function(){}
};
var tableLoad = {
	tableObj:false,
	tableLoadFunction:function( type ){
		var table = layui.table;
		dataList['page'] = {
			curr: 1 
		};
		if(type == "search"){
			var create_time = $("#create_time").val();
			var end_time = $("#end_time").val();
			var express_type = $("#express_type_search").val();
			var package = $("#package_search").val();
			var express_no_search = $("#express_no_search").val();
			var data = {
				create_time: create_time,
				end_time: end_time,
				express_type: express_type,
				package: package,
				express_no_search:express_no_search,
			};
		}else if(type == "add"){
			var data = {};
		}else{
			dataList.data = [];
			tableLoad.tableObj = table.render(dataList)
			return false;
		}
		$.ajax({
			url:'/?m=afterSale&c=afterReg&a=getData',
			dataType: 'json',
			type: "post",
			data:data,
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