var flow = new Vue({
	el: '#flow',
	data: {
		warehouse:[],
		tab:"",
	},
	mounted: function() {
		var self = this;
        //var jqtb;
		
		self.getWarehouse();
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=system&c=analysis&a=getData'
					,cols: [[
					   {field:'right', title: '操作',"width":320,toolbar: '#barDemo',fixed:true}
					  ,{field:'prd_no', title: '商品编号',"width":140,fixed:true}
					  ,{field:'title', title: '商品名称',"width":280}
					  ,{field:'sku_name', title: '销售属性',"width":140}
					  ,{field:'name', title: '仓库',"width":180}
					  ,{field:'qty', title: '库存',"width":120, templet: '#sexTpl'}
					  
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-133'
				  });
				 
				  var $ = layui.$, active = {
					reload: function(){
					  
					  tab.reload({
						
						where: {
							prd_no:$(".names").val(),
							wh:$("#group").val()
						}
					  });
					},
					getCheckData: function(){ //获取选中数据
					  var checkStatus = table.checkStatus('testReload')
					  ,data = checkStatus.data;
					 
					},
				  };
				  
				  self.tab = active;
				  
				  //监听单元格编辑
				  table.on('edit(user)', function(obj){
					var value = obj.value //得到修改后的值
					,data = obj.data //得到所在行所有键值
					,field = obj.field; //得到字段
				  });
				  
				   //监听工具条
				  table.on('tool(user)', function(obj){
					var data = obj.data;
					if(obj.event === 'sale_in'){				
						parent.parent.addTab("采购入库","index.php?m=system&c=purchase&a=purchase&prd_id="+data.prd_id+"&prd_sku_id="+data.prd_sku_id+"&wh="+data.wh,"采购入库");
					}else if(obj.event === 'else_in'){			
						parent.parent.addTab("其它入库","index.php?m=system&c=diskInto&a=diskInto&prd_id="+data.prd_id+"&prd_sku_id="+data.prd_sku_id+"&wh="+data.wh,"其它入库");
					}else if(obj.event === 'sale_out'){			
						parent.parent.addTab("销售出库","index.php?m=system&c=sellOut&a=sellOut&prd_id="+data.prd_id+"&prd_sku_id="+data.prd_sku_id+"&wh="+data.wh,"销售出库");
					}else if(obj.event === 'else_out'){			
						parent.parent.addTab("其他出库","index.php?m=system&c=theDisc&a=theDisc&prd_id="+data.prd_id+"&prd_sku_id="+data.prd_sku_id+"&wh="+data.wh,"其他出库");
					}
				  });
				  
				  $('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					
					active[type] ? active[type].call(this) : '';
				  });
				  
				  $('.layui-btn').on('click', function(){
					var type = $(this).data('type');
					active[type] ? active[type].call(this) : '';
				  });
				  
				  $(".key_down").on("keydown",function(){
					  var e = event || window.event;
					  if(e.keyCode == 13){
						var type = $(this).data('type');
						active[type] ? active[type].call(this) : '';
					  }
					  
				  });
				
			});
		});

	},
	methods: {
		reset:function(){
			var self = this;
			$(".names").val("");
			$("#group").val("");
		},
		
		turnTo:function(a,url){
			parent.addTab(a,url,a);
		},
		
		getWarehouse:function(){
			var self = this;
			$.ajax({
				url: "/index.php?m=system&c=analysis&a=getWarehouse",
				data: {},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data){
						self.warehouse = data;
					}else{
						self.warehouse = [];
					}
				}
			});
		},
		
	}
});
