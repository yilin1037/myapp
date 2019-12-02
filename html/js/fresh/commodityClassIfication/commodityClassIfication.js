var flow = new Vue({
	el: '#flow',
	data: {
		firstArr:[],
		childrenArr:[],
	},
	mounted: function() {
		var self = this;
        //var jqtb;
		self.get_first_class();
	
	},
	methods: {
		
		//新增主类
		new_add:function(){
			var self = this;
			layer.open({																																											
				type: 1,																																											
				title: '新增主类',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['648px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#add_new_first_class"),	
				btn: ['保存', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var value = $("#first_class_name").val();
					
					if(value === ""){
						layer.msg("请输入主类名称",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					
					$.ajax({
						url: "/index.php?m=fresh&c=commodityClassIfication&a=add_save",
						data: {value:value},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								
								layer.close(index);
								self.get_first_class();
							}else{
								layer.msg(data.msg,{
									icon: 0,
									time: 2000
								});
							}
						}
					});
					
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function (index, layero) {																																					
																																																	
				},
				success:function(){
					$("#first_class_name").val("");
				}
			});
		},
		
		//主类修改
		edit_parent:function(title,no){
			var self = this;
			
			var e = event || window.event;
			
			e.stopPropagation();
			
			layer.open({																																											
				type: 1,																																											
				title: '修改主类名称',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['648px', '300px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#add_new_first_class_edit"),	
				btn: ['保存', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var value = $("#first_class_name_edit").val();
					var order_value = $("#first_class_name_order").val();
					var recommend = $("#recommend").val();
					if(value === ""){
						layer.msg("请输入主类名称",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					
					$.ajax({
						url: "/index.php?m=fresh&c=commodityClassIfication&a=edit_parent",
						data: {value:value,no:no,order_value:order_value,recommend:recommend},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								self.get_first_class();
								layer.close(index);
							}else{
								layer.msg(data.msg,{
									icon: 0,
									time: 2000
								});
							}
						}
					});
					
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function (index, layero) {																																					
																																																	
				},
				success:function(){
					$("#first_class_name_edit").val(title);
					$.ajax({
						url: "/index.php?m=fresh&c=commodityClassIfication&a=get_edit_parent",
						data: {no:no},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data){
								$("#first_class_name_order").val(data.tag2);
								if(data.tag1 !== ""){
									$("#recommend").val(data.tag1);
								}else{
									$("#recommend").val(0);
								}
								
							}
						}
					});
					$("#first_class_name_order").val("");
				}
			});
			
		},
		
		//子类编辑
		edit_children:function(no,parent_no,title,first_no){
			var self = this;
			
			var e = event || window.event;
			
			e.stopPropagation();
			
			layer.open({																																											
				type: 1,																																											
				title: '编辑子类名称',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['648px', '250px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#add_new_children_class_edit"),	
				btn: ['保存', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var value = $("#children_class_name_edit").val();
					var order_value = $("#children_class_name_order").val();
					if(value === ""){
						layer.msg("请输入子类名称",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					
					$.ajax({
						url: "/index.php?m=fresh&c=commodityClassIfication&a=edit_children",
						data: {value:value,no:no,parent_no:parent_no,order_value:order_value},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								self.get_children_now(first_no);
								layer.close(index);
							}else{
								layer.msg(data.msg,{
									icon: 0,
									time: 2000
								});
							}
						}
					});
					
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function (index, layero) {																																					
																																																	
				},
				success:function(){
					$("#children_class_name_edit").val(title);
					$.ajax({
						url: "/index.php?m=fresh&c=commodityClassIfication&a=get_edit_children",
						data: {no:no,parent_no:parent_no},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data){
								$("#children_class_name_order").val(data.tag2);
							}else{
								$("#children_class_name_order").val("");
							}
						}
					});
				}
			});
			
		},
		
		//删除主类
		delete_parent:function(no){
			var self = this;
			
			var e = event || window.event;
			
			e.stopPropagation();
			
			layer.confirm('确定要删除么？', {
				btn: ['确定', '取消'] //可以无限个按钮
				,btn3: function(index, layero){
					//按钮【按钮三】的回调
				}
			}, function(index, layero){
				//按钮【按钮一】的回调
				
				$.ajax({
					url: "/index.php?m=fresh&c=commodityClassIfication&a=delete_parent",
					data: {no:no},
					dataType: "json",
					type: "POST",
					success: function (data) {
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							self.get_first_class();
							layer.close(index);
						}else{
							layer.msg(data.msg,{
								icon: 0,
								time: 2000
							});
						}
					}
				});
				
			}, function(index){
				//按钮【按钮二】的回调
			});
			
		},
		
		//删除子类
		delete_children:function(no,parent_no,first_no){
			var self = this;
			
			var e = event || window.event;
			
			e.stopPropagation();
			
			layer.confirm('确定要删除么？', {
				btn: ['确定', '取消'] //可以无限个按钮
				,btn3: function(index, layero){
					//按钮【按钮三】的回调
				}
			}, function(index, layero){
				//按钮【按钮一】的回调
				
				$.ajax({
					url: "/index.php?m=fresh&c=commodityClassIfication&a=delete_children",
					data: {no:no,parent_no:parent_no,},
					dataType: "json",
					type: "POST",
					success: function (data) {
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							self.get_children_now(first_no);
							layer.close(index);
						}else{
							layer.msg(data.msg,{
								icon: 0,
								time: 2000
							});
						}
					}
				});
				
			}, function(index){
				//按钮【按钮二】的回调
			});
			
		},
		
		//新增子类
		add_children:function(no){
			var self = this;
			var e = event || window.event;
			
			if($(event.target).parent().parent().parent().find(".layui-colla-content").prop("class") == 'layui-colla-content layui-show'){
				e.stopPropagation();
			}
			
			layer.open({																																											
				type: 1,																																											
				title: '新增子类',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['648px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#add_new_children_class"),	
				btn: ['保存', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var value = $("#children_class_name").val();
					
					if(value === ""){
						layer.msg("请输入子类名称",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					
					$.ajax({
						url: "/index.php?m=fresh&c=commodityClassIfication&a=add_children",
						data: {value:value,no:no},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								self.get_children_now(no);
								layer.close(index);
							}else{
								layer.msg(data.msg,{
									icon: 0,
									time: 2000
								});
							}
						}
					});
					
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function (index, layero) {																																					
																																																	
				},
				success:function(){
					$("#children_class_name").val("");
					
				}
			});
			
		},
		
		get_children:function(no){
			var self = this;
			
			self.get_children_now(no);
			
		},
		
		get_children_now:function(no){
			var self = this;
			
			$.ajax({
				url: "/index.php?m=fresh&c=commodityClassIfication&a=get_children_now",
				data: {no:no},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data){
						self.childrenArr = data;
						
					}else{
						self.childrenArr = [];
					}
				}
			});
			
		},
		
		//获取主类列表
		get_first_class:function(){
			var self = this;
			
			$.ajax({
				url: "/index.php?m=fresh&c=commodityClassIfication&a=get_first_class",
				data: {},
				dataType: "json",
				type: "POST",
				success: function (data) {
					if(data){
						self.firstArr = data;
						setTimeout(function(){
						layui.use(['element','layer'], function(){
							var element=layui.element;
							var layer = layui.layer;
							  
							element.init();
							
						});
						},100);
					}else{
						self.firstArr = [];
					}
				}
			});
			
		}
		
	}
});