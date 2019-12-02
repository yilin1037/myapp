var tableList = new Vue({
	el: '#tableList',
	data: {
		show:false,
		isEmpty:"no",
		num:0,
		data:"",
	},
	mounted: function() {
		var self = this;
		
		
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {																													
            var $ = layui.jquery, element = layui.element, layer = layui.layer ;																														
			 // 初始化表格
			jqtb = $('#dateTable').DataTable({  //dateTable 模块 入口
				"`dom": '<"top">rt<"bottom"flp><"clear">',
				"autoWidth": false,                     // 自适应宽度
				"paging": true,
				"lengthMenu": [10,20, 50],
				"pagingType": "full_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
				"processing": true,
				"searching": false, //是否开启搜索
				"serverSide": true,//开启服务器获取数据
				"order": [[2, "desc"]], //默认排序
				"fnServerParams": function (aoData) {
					aoData.push(
						{"name": "status", "value": $("#status_name").attr("name")},
						{"name": "sku_name", "value": $("#sku_name").val()},
						{"name": "begin_number", "value": $("#begin_number").val()},
						{"name": "end_number", "value": $("#end_number").val()},
						{"name": "prd_no", "value": $("#prd_no").val()},
						{"name": "prd_loc", "value": $("#prd_loc").val()},
						{"name": "empty_prd_loc", "value": self.isEmpty}
					);
				},
				//请求url
				
				"sAjaxSource": "index.php?m=WMS&c=barcodeDetails&a=getData",
				//服务器端，数据回调处理
				"fnServerData": function (sSource, aDataSet, fnCallback) {
					$.ajax({
						"dataType": 'json',
						"type": "post",
						"url": sSource,
						"data": aDataSet,
						"success": function (resp) {
							fnCallback(resp);
							self.num++;
							$(document).ready(function(){
								$('.skin input').iCheck({
									checkboxClass: 'icheckbox_minimal',
									radioClass: 'iradio_minimal',
									increaseArea: '20%'
								});
							});
							
							if(self.num == 1){
								$(document).ready(function(){
									$('.skin-minimal input').iCheck({
										checkboxClass: 'icheckbox_minimal',
										radioClass: 'iradio_minimal',
										increaseArea: '20%'
									});
								});
							}
							
							
							$('#selectAll').on('ifChecked ifUnchecked', function(event){
								if (event.type == 'ifChecked') {
									$("input[name='order']").iCheck('check');																																		
								} else {																																														
									$("input[name='order']").iCheck('uncheck');																																		
								}																																																
							});
						}
					});
				},
				// 初始化表格
				"info": true,                           // 控制是否显示表格左下角的信息
				"stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
				"columns": [ //定义列数据来源  id, userid,username,mobile,create_login_time,STATUS
					{'title': "<div class='skin-minimal'><input type='checkbox' id='selectAll'></div>", 'data': "serial_no","defaultContent": "","width":30,"render":function(data,type,row,meta){
						return "<div class='skin'><input type='checkbox' name='order' value="+data+"></div>";
					}},
					{'title': "序号", 'data': "","defaultContent": "","width":50},
					{'title': "入库时间", 'data': "addtime","defaultContent": ""},
					{'title': "图片", 'data': "pic_path","defaultContent": "","width":68,"render":function(data,type,row,meta){
						return "<div><img src="+data+" style='width:60px;height:60px;'></div>";
					}},
					{'title': "商品编号", 'data': "prd_no","defaultContent": ""},
					{'title': "特征", 'data': "sku_name1","defaultContent": ""},
					{'title': "规格", 'data': "sku_name2","defaultContent": ""},
					{'title': "货位", 'data': "name","defaultContent": ""},
					{'title': "条码", 'data': "barcode","defaultContent": ""},
					{'title': "订单号", 'data': "tid","defaultContent": ""},
					{'title': "状态", 'data': "send_type","defaultContent": "","render":function(data,type,row,meta){
						if(data == "作废" || data == "盘点作废" || data == "锁定"){
							return "<span style='color:red'>"+data+"</sapn>";
						}else{
							return data;
						}
					}}
				],
				'columnDefs': [{
					'targets': 0,
					'searchable': false,
					'orderable': false,
					'className': 'dt-body-center'
				},{
					'targets': 1,
					'searchable': false,
					'orderable': false,
					'className': 'dt-body-center'
				},{
					'targets': 3,
					'searchable': false,
					'orderable': false,
					'className': 'dt-body-center'
				},{
					'targets': 5,
					'searchable': false,
					'orderable': false,
					'className': 'dt-body-center'
				},{
					'targets': 6,
					'searchable': false,
					'orderable': false,
					'className': 'dt-body-center'
				},{
					'targets': 7,
					'searchable': false,
					'orderable': false,
					'className': 'dt-body-center'
				},{
					'targets': 10,
					'searchable': false,
					'orderable': false,
					'className': 'dt-body-center'
				}],
				"language": {                           // 国际化
					"sProcessing": "正在加载中......",
					"sLengthMenu": "每页显示 _MENU_ 条记录",
					"sZeroRecords": "对不起，查询不到相关数据！",
					"sEmptyTable": "表中无数据存在！",
					"sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
					"sInfoFiltered": "数据表中共为 _MAX_ 条记录",
					"sSearch": "搜索",
					"oPaginate": {
						"sFirst": "首页",
						"sPrevious": "上一页",
						"sNext": "下一页",
						"sLast": "末页"
					}
				},
				"fnDrawCallback": function(){
				　　var api = this.api();
				　　var startIndex= api.context[0]._iDisplayStart;//获取到本页开始的条数
				　　api.column(1).nodes().each(function(cell, i) {

				　　　　//此处 startIndex + i + 1;会出现翻页序号不连续，主要是因为startIndex 的原因,去掉即可。
				　　　　cell.innerHTML = startIndex + i + 1;

				　　　　//cell.innerHTML =  i + 1;

				　　}); 
				}
				
				
			});
			
			$("#submitSearch").click(function () {
				jqtb.ajax.reload();
			});
			
		});											

		
	},
	methods: {
		//店铺查询条件
		shopHide:function(){
			var self = this;
			self.show = !self.show;
			
			if(self.show){
				$('input[name="status"]').each(function(){
					$(this).iCheck('uncheck');
				});
			}
			
			var arr = [];
			var name = [];
			
			$('input[name="status"]').each(function(){
				$(this).on('ifChecked ifUnchecked', function(event){																																			
					var newArr = [];
					var nameArr = [];
					if (event.type == 'ifChecked') {
						//console.log($("label").attr("for"))
						
						$('input[name="status"]').each(function(){
							if(true == $(this).is(':checked')){
								newArr.push($(this).prop("class"));
								nameArr.push($(this).val());
							}
							
						});
						arr = newArr;
						name = nameArr;
						//$(".southwest input[name='places']").iCheck('check');																																		
					} else {																																														
						//$(".southwest input[name='places']").iCheck('uncheck');
						$('input[name="status"]').each(function(){
							if(true == $(this).is(':checked')){
								newArr.push($(this).prop("class"));
								nameArr.push($(this).val());
							}
						});
						arr = newArr;
						name = nameArr;
					}
					var a = "";
					var b = "";
					for(var i = 0; i < arr.length; i++){
						a += (arr[i] + ",");
						b += (name[i] + ",");
					}
					a = a.substring(0,a.length-1);
					b = b.substring(0,b.length-1);
					$("#status_name").val(a);
					$("#status_name").attr("name",b);
				});
			});
		},
		
		
		clearValue:function(){
			$("#status_name").val("");
			$("#status_name").attr("name","");
		},
		
		reset_now:function(){
			var self = this;
			$("input[name='reset']").val("");
			$("#status_name").val("");
			$("#status_name").attr("name","");
			$("#empty").iCheck('uncheck');	
			self.isEmpty="no";
		},
		
		keyDownNow:function(){
			var e = event || window.event;
			if(e.keyCode == 13){
				jqtb.ajax.reload();
			}
		},
		
		//批量操作
		do_now:function(type){
			if($("input[name='order']").filter(':checked').length == 0){																															
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}		
			
			var data = "";																						
			$("input[name='order']:checkbox").each(function(){																							
				if(true == $(this).is(':checked')){																																				
					data += ($(this).val()+",");																													
				}																																				
			});																																						
			data = data.substring(0,data.length-1);	
			layer.confirm('确定执行此操作么？', {
				btn: ['确定', '取消'] //可以无限个按钮
			}, function(index, layero){
				//按钮【按钮一】的回调
				var indexLoad = layer.load();
			
				$.ajax({
					url: "/index.php?m=WMS&c=barcodeDetails&a=batch_void",
					type: "POST",
					dataType:"json",
					data:{data:data,type:type},
					success:function(data){
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							jqtb.ajax.reload();
							$("#selectAll").iCheck('uncheck');
							layer.close(indexLoad);
								
						}else{
							layer.close(indexLoad);
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
						}
					}
				});
			}, function(index){
				//按钮【按钮二】的回调
			});
			
		},
		
		//批量设置货位
		set_prd_loc:function(){
			var self = this;
			if($("input[name='order']").filter(':checked').length == 0){																															
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																											
				return false;																																										
			}	
			
			var data = "";																						
			$("input[name='order']:checkbox").each(function(){																							
				if(true == $(this).is(':checked')){																																				
					data += ($(this).val()+",");																													
				}																																				
			});	
			
			data = data.substring(0,data.length-1);	
			self.data = data;
			
			layer.open({
				title :'选择商品',
				type: 2,
				shade: false,
				area: ['700px', '600px'],
				maxmin: false,
				content: '?m=widget&c=selectPrdLoc&a=index'
			}); 
		}
	},
																																																	
});	


$('#empty').on('ifChecked ifUnchecked', function(event){																																			
																																																	
	if (event.type == 'ifChecked') {																																								
		tableList.isEmpty = "yes";																															
	} else {																																														
		tableList.isEmpty = "no";
	}																																																
});	

function cbProductRows(result){
    var indexLoad = layer.load();
	var loc = result[0].prd_loc;
	$.ajax({
		url: "/index.php?m=WMS&c=barcodeDetails&a=setLoc",
		type: "POST",
		dataType:"json",
		data:{data:tableList.data,loc:loc},
		success:function(data){
			if(data > 0){
				layer.msg("操作成功",{
					icon: 1,
					time: 2000
				});
				jqtb.ajax.reload();
				$("#selectAll").iCheck('uncheck');
				layer.close(indexLoad);
					
			}else{
				layer.close(indexLoad);
				layer.msg("操作失败",{
					icon: 1,
					time: 2000
				});
			}
		}
	});
}




		






																																																
