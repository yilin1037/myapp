var tableList = new Vue({
	el: '#tableList',
	data: {
		shopArr:[],
		empty_prd_no: 'F',
		have_concat: 'F',
		no_concat: 'F',
		empty_prd_no_offline: 'F',
		no_shop: 'F',
	},
	mounted: function() {
		var self = this;
		
		//获取网店
		$.ajax({																				
			url: "/index.php?m=system&c=downloadBinding&a=getShop",										
			type: 'post',																		
			data: {},																	
			dataType: 'json',																	
			success: function (data) {			
				self.shopArr = data;
			}																					
		});	
		$(document).ready(function(){
		layui.use(['table','element','layer','form'], function(){
			  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
			  
			  //方法级渲染
			  var online = table.render({
				elem: '#LAY_table_user'
				,url: '/index.php?m=system&c=downloadBinding&a=getDataOnline'
				
				,cols: [[
				  {checkbox: true, fixed: true}
				  ,{field:'shopname', title: '网店名称',"width":120}
				  ,{field:'num_iid', title: '商品链接编号',"width":120}
				  ,{field:'title', title: '网店商品名称',"width":120}
				  ,{field:'outer_iid', title: '主商家编码',"width":120}
				  ,{field:'outer_sku_id', title: '二级商家编码',"width":120}
				  ,{field:'sku_properties_name', title: '销售属性',"width":120}
				]]
				,id: 'testReload'
				,page: true
				,height: 'full-162'
			  });
			  
			   var offline = table.render({
				elem: '#table_user'
				,url: '/index.php?m=system&c=downloadBinding&a=getDataOffline'
				,cols: [[
				   {field:'input', title: '',"width":48}
				  ,{field:'prd_no', title: '本地商品编号',"width":160}
				  ,{field:'title', title: '商品名称',"width":120}
				  ,{field:'sku_name', title: '商品属性',"width":120}
				]]
				,id: 'testReload1'
				,page: true
				,height: 'full-130'
				,done: function(res, curr, count){
					//如果是异步请求数据方式，res即为你接口返回的信息。
					//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
					$('.skin input').iCheck({
						checkboxClass: 'icheckbox_minimal',
						radioClass: 'iradio_minimal-green',
						increaseArea: '20%'
					});
				}
			  });
			  
			  var $ = layui.$, active = {
				reload: function(){
				  
				  online.reload({
					
					where: {
						shopid:$("#shopname_left").val(),
						title:$("#title").val(),
						prd_no:$("#prd_no_left").val(),
						empty_prd_no: self.empty_prd_no,
						have_concat:self.have_concat,
						no_concat:self.no_concat
					}
				  });
				},
				reloadoff: function(){
				  
				  offline.reload({
					
					where: {
						search_quck:$("#search_quck").val(),
						search_title:$("#search_title").val(),
						empty_prd_no:self.empty_prd_no_offline,
						no_shop: self.no_shop,
						shopid:$("#shopnameOffine").val()
					}
				  });
				},
				getCheckData: function(){ //获取选中数据
					var checkStatus = table.checkStatus('testReload')
					,data = checkStatus.data;
					
					var offlineKey = '';
					$("input[name='offlineKey']:radio").each(function(){																										
						if(true == $(this).is(':checked')){																																				
							offlineKey = $(this).val();																																				
						}																																							
					});
					if(data.length == 0){
						layer.msg("请选择网店商品",{
							icon: 2,
							time: 2000
						});
						return false;
					}
					
					if(offlineKey == ''){
						layer.msg("请选择本地商品",{
							icon: 2,
							time: 2000
						});
						return false;
					}
					var onlineKey = '';
					for(var j = 0; j < data.length; j++){
						onlineKey += (data[j].key_id+",");
					}
					
					$.ajax({																																														
						url: "/index.php?m=system&c=downloadBinding&a=banding",																																		
						type: 'post',																																												
						data: {onlineKey: onlineKey, offlineKey: offlineKey},																																													
						dataType: 'json',																																											
						success: function (data) {
							layer.msg("绑定完成",{
								icon: 1,
								time: 2000
							});
						}																																															
					});
					
				}
			  };
			  
			  $('.search1').on('click', function(){
				var type = $(this).data('type');
				
				active[type] ? active[type].call(this) : '';
			  });
			  
			  $("#title").on('keydown',function(){
				  var e = event || window.event;
				  if(e.keyCode == 13){
					  var type = $(this).data('type');
				
						active[type] ? active[type].call(this) : '';
				  }
			  })
			  
			  $("#prd_no_left").on('keydown',function(){
				  var e = event || window.event;
				  if(e.keyCode == 13){
					  var type = $(this).data('type');
				
						active[type] ? active[type].call(this) : '';
				  }
			  })
			  
			   $("#search_title").on('keydown',function(){
				  var e = event || window.event;
				  if(e.keyCode == 13){
					  var type = $(this).data('type');
				
						active[type] ? active[type].call(this) : '';
				  }
			  })
			  
			});
		});
	},
	methods: {
		/*banding:function(){
			var onlineKey = '';
			$("input[name='onlineKey']:checkbox").each(function(){						//--------------------------																				
				if(true == $(this).is(':checked')){									//																											
					onlineKey += ($(this).val()+",");									//																											
				}																	//	拼接当前页的货品唯一码																					
			});
			
			var offlineKey = '';
			$("input[name='offlineKey']:radio").each(function(){						//--------------------------																				
				if(true == $(this).is(':checked')){									//																											
					offlineKey = $(this).val();									//																											
				}																	//	拼接当前页的货品唯一码																					
			});
			
			if(onlineKey == '' || onlineKey == ','){
				layer.msg("请选择网店商品",{
					icon: 2,
					time: 2000
				});
				return false;
			}
			
			if(offlineKey == ''){
				layer.msg("请选择本地商品",{
					icon: 2,
					time: 2000
				});
				return false;
			}
			
			$.ajax({																																														
				url: "/index.php?m=system&c=downloadBinding&a=banding",																																		
				type: 'post',																																												
				data: {onlineKey: onlineKey, offlineKey: offlineKey},																																													
				dataType: 'json',																																											
				success: function (data) {
					layer.msg("绑定完成",{
						icon: 1,
						time: 2000
					});
				}																																															
			});
		},*/
		removeNoBanding:function(){
			layer.confirm('确认删除未绑定数据?', function(index){
				$.ajax({																																														
					url: "/index.php?m=system&c=downloadBinding&a=removeNoBanding",																																		
					type: 'post',																																												
					data: {onlineKey: onlineKey, offlineKey: offlineKey},																																													
					dataType: 'json',																																											
					success: function (data) {
						layer.msg("删除完成",{
							icon: 1,
							time: 2000
						});
						layer.close(index);
					}																																															
				});
			});     
		},
		removeNullOuter:function(){
			layer.confirm('确认删除空编码数据?', function(index){
				$.ajax({																																														
					url: "/index.php?m=system&c=downloadBinding&a=removeNullOuter",																																		
					type: 'post',																																												
					data: {onlineKey: onlineKey, offlineKey: offlineKey},																																													
					dataType: 'json',																																											
					success: function (data) {
						layer.msg("删除完成",{
							icon: 1,
							time: 2000
						});
						layer.close(index);
					}																																															
				});
			});  
		},
		turnTo:function(a,url){
			parent.addTab(a,url,a);
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

$('#prd_no_isnull').on('ifChecked ifUnchecked', function(event){																																			//===========
	if (event.type == 'ifChecked') {																																								//===========
		tableList.empty_prd_no = 'T';
	} else {																																														//===========
		tableList.empty_prd_no = 'F';
	}																																																//===========
});

$('#concat').on('ifChecked ifUnchecked', function(event){																																			//===========
	if (event.type == 'ifChecked') {																																								//===========
		tableList.have_concat = 'T';
	} else {																																														//===========
		tableList.have_concat = 'F';
	}																																																//===========
});

$('#no_concat').on('ifChecked ifUnchecked', function(event){																																			//===========
	if (event.type == 'ifChecked') {																																								//===========
		tableList.no_concat = 'T';
	} else {																																														//===========
		tableList.no_concat = 'F';
	}																																																//===========
});

$('#no_prd_no').on('ifChecked ifUnchecked', function(event){																																			//===========
	if (event.type == 'ifChecked') {																																								//===========
		tableList.empty_prd_no_offline = 'T';
	} else {																																														//===========
		tableList.empty_prd_no_offline = 'F';
	}																																																//===========
});

$('#no_shopname').on('ifChecked ifUnchecked', function(event){																																			//===========
	if (event.type == 'ifChecked') {																																								//===========
		tableList.no_shop = 'T';
	} else {																																														//===========
		tableList.no_shop = 'F';
	}																																																//===========
});
