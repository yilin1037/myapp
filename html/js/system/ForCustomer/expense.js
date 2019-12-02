
online = {
	elem: '#LAY_table_user'
	,url: '/index.php?m=system&c=ForCustomer&a=getexpense'
	
	,cols: [[
	  {field:'index', title: '序号',"width":60}
	  ,{field:'id', title: '操作',"width":200,"toolbar": '#barDemo'}
	  ,{field:'cost_no', title: '费用项目编号',"width":240}
	  ,{field:'cost_name', title: '费用项目名称',"width":240}
	  ,{field:'price', title: '费用',"width":160}
	  ,{field:'cost_type_name', title: '扣费方式',"width":160}
	  ,{field:'cost_doc_name', title: '扣费单据',"width":160}
	]]
	,id: 'testReload'
	,page: true
	,height: 'full-106'
	,limits: [20,50,80,100]
	,limit: 50
	,loading: true
  };

var tableList = new Vue({
	el: '#tableList',
	data: {
		data:[],
		tableObj:false,
		a_table:"",
	},
	mounted: function() {
		var self = this;
		
		$(document).ready(function(){
		layui.use(['table','element','layer','form'], function(){
			  var table = layui.table,element=layui.element,layer=layui.layer;
			  var a_table = table.render(online);
			  var form = layui.form;
			  self.a_table = a_table;
			  setTimeout(function(){
				   form.render('select');
			  },200)
			  //方法级渲染
			  var $ = layui.$, active = {
				reload: function(){
				  
				  a_table.reload({
					
					where: {
						old_prd_no:$("#old_prd_no").val(),
						new_prd_no:$("#new_prd_no").val()
					}
				  });
				},
				getCheckData: function(){ //获取选中数据
					var checkStatus = table.checkStatus('testReload')
					,data = checkStatus.data;
					layer.confirm("确定关闭么？", {
						btn: ['确定', '取消'] //可以无限个按钮
						,btn3: function(index, layero){
						//按钮【按钮三】的回调
						}
					}, function(index, layero){
						//按钮【按钮一】的回调
						var str = "";
						for(var i = 0; i < data.length; i++){
							str += (data[i].prd_no + ",");
						}
						$.ajax({																																													
							url: "/index.php?m=afterSale&c=goodOffAdministration&a=deleteNow",																																		
							type: 'post',																																											
							data: {prd_no:str},																																												
							dataType: 'json',																																										
							success: function (data) {																																								
								if(data.code == "ok"){
									layer.msg(data.msg,{
										icon: 1,
										time: 2000
									});	
									
									self.a_table.reload();
									layer.close(index);
									
								}else{
									layer.msg(data.msg,{
										icon: 2,
										time: 2000
									});	
								}																																								
							}																																														
						});
						
					}, function(index){
						//按钮【按钮二】的回调
					});
				}
			  };
			  
			  $('.search1').on('click', function(){
				var type = $(this).data('type');
				active[type] ? active[type].call(this) : '';
			  });
			  
			  $('.old').on('keydown',function(){
				    var e = event || window.event;
					if(e.keyCode == 13){
						var type = $(this).data('type');
						active[type] ? active[type].call(this) : '';
					}
					
			  });
			  
			  $('.new').on('keydown',function(){
				    var e = event || window.event;
					if(e.keyCode == 13){
						var type = $(this).data('type');
						active[type] ? active[type].call(this) : '';
					}
					
			  });
			  
			  //监听工具条
			  table.on('tool(user)', function(obj){
					var data = obj.data;
					if(obj.event === 'detail'){
						self.newAdd(data.id,data.cost_no,data.cost_name,data.price,data.cost_type,data.cost_doc);
					}
					if(obj.event === 'delete'){
						self.deletes(data.id);
					}
				  });	
			});
		});
		
		//=====================这段代码要放到页面表格数据请求（ajax）成功的回调函数里，页面的复选框样式才会生效==================================
		$(document).ready(function(){
			$('.skin input').iCheck({
				checkboxClass: 'icheckbox_minimal',
				radioClass: 'iradio_minimal',
				increaseArea: '20%'
			});
		});	
		//========================================================================================================================================
	},
	methods: {
		deletes :function(id){
			$.ajax({																																													
				url: "/index.php?m=system&c=ForCustomer&a=delexpense",																																		
				type: 'post',																																											
				data: {id:id},																																												
				dataType: 'json',																																										
				success: function (data) {	
				if(data.code == 'ok'){
					layer.msg(data.msg,{
						icon: 1,
						time: 5000
					});
					   location.reload();
					}else{
					  layer.msg(data.msg,{
						icon: 2,
						time: 2000
					});
						}
				}																																														
			});
		},
		newAdd:function(id,cost_no,cost_name,price,cost_type,cost_doc){
			var self = this; 
			var title = "";
			var type = "";
			if(cost_no == ""){
				title = "新增项目及费用";
				type = 'insert';
				id = '';
				$("#cost_no").attr("disabled", false);
			}else{
				title = "修改";
				type = 'update';
				$("#cost_no").attr("disabled", true);
			}
			layer.open({																																											
				type: 1,																																											
				title: title,																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['500px', '550px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#page"),																																							
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var cost_no = $("#cost_no").val();
					var cost_name = $("#cost_name").val();
					var price = $("#price").val();
					var cost_type = $("#cost_type").val();
					var cost_doc = $("#cost_doc").val();
					if(cost_no == '')
					{
						layer.msg('项目编号不能为空',{
							icon: 2,
							time: 3000
						});	
						return;	
					}
					if(cost_name == '')
					{
						layer.msg('项目名称不能为空',{
							icon: 2,
							time: 3000
						});	
						return;	
					}
					if(price == '')
					{
						layer.msg('费用不能为空',{
							icon: 2,
							time: 3000
						});	
						return;	
					}
					if(cost_type == '')
					{
						layer.msg('请选择扣费方式',{
							icon: 2,
							time: 3000
						});	
						return;	
					}
					if(cost_doc == '')
					{
						layer.msg('请选择扣费单据',{
							icon: 2,
							time: 3000
						});	
						return;	
					}
					$.ajax({																																													
						url: "/index.php?m=system&c=ForCustomer&a=addexpense",																																		
						type: 'post',																																											
						data: {id:id,cost_no:cost_no,cost_name:cost_name,price:price,type:type,cost_type:cost_type,cost_doc:cost_doc},																																												
						dataType: 'json',																																										
						success: function (data) {	
							if(data.code == 'ok'){
								layer.msg(data.msg,{
										icon: 1,
										time: 5000
								});
								layer.close(index);
								location.reload();
							}else{
								layer.msg(data.msg,{
										icon: 2,
										time: 2000
								});
							}
						}																																														
					});		
					
					
				}
				,btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {																																					
																																																	
				},
				success:function(){
					$("#cost_no").val(cost_no);
					$("#cost_name").val(cost_name);
					$("#price").val(price);
					$("#cost_type").val(cost_type);
					$("#cost_doc").val(cost_doc);
					layui.form.render('select');
				}
			});
		},
		
		reset_now:function(){
			$(".old").val("");
			$(".new").val("");
		}
	},
																																																	
});	


$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});	

																																																
