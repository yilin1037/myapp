var flow = new Vue({
	el: '#flow',
	data: {
		
	},
	mounted: function() {
		var self = this;
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=system&c=customer&a=getData'
					,cols: [[
					   {field:'right', title: '姓名',"width":160 ,"fixed":true}
					  ,{field:'cus_no', title: '电话',"width":160}
					  ,{field:'cus_name', title: '详细地址',"width":300}
					  ,{field:'wangwang', title: '优势品类',"width":160, "templet": '#sexTpl1', "edit": 'text'}
					  ,{field:'weixin', title: '操作',"width":160,toolbar: '#barDemo'}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-133'
				  });
				  
				  var supplier = table.render({
					elem: '#supplier_table'
					,url: 'index.php?m=system&c=customer&a=getData'
					,cols: [[
					   {field:'right', title: '供应商名称',"width":160 ,"fixed":true}
					  ,{field:'cus_no', title: '订单号',"width":160}
					  ,{field:'cus_name', title: '商品名',"width":300}
					  ,{field:'wangwang', title: '店铺名',"width":160}
					  ,{field:'12', title: '单位',"width":120}
					  ,{field:'2', title: '预订数量',"width":120}
					  ,{field:'43', title: '实际数量',"width":120}
					  ,{field:'4', title: '审核状态',"width":120}
					  ,{field:'right', title: '操作',"width":160,toolbar: '#barDemo'}
					]]
					,id: 'supplier'
					,page: true
					,height: 'full-133'
				  });
				 
				 laydate.render({
					elem: '#test1'
				  });
				 
				  var $ = layui.$, active = {
					reload: function(){
					  
					  tab.reload({
						
						where: {
							supplier_name:$("#supplier_name").val(),
							supplier_mobile:$("#supplier_mobile").val()
						}
					  });
					},
					getCheckData: function(){ //获取选中数据
					  var checkStatus = table.checkStatus('testReload')
					  ,data = checkStatus.data;
					  var cus_no = "";
					 
					},
					
					remove: function(){//删除客户
						var checkStatus = table.checkStatus('testReload')
						,data = checkStatus.data;
					
						
						
					}
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
					if(obj.event === 'rece'){				//收款
						
					}else if(obj.event === 'kaidan'){				//开单
						
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
		
		
	}
});