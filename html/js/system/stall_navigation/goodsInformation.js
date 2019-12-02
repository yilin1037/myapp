var flow = new Vue({
	el: '#flow',
	data: {
		nowPage:false,			//当前页是否勾选
		allPage:false,			//全部页是否勾选
		isAll:false,			//判断目前是不是全部页
		classArr:"",   			//分类数组
		id:"all",				//记录目前选中的分类 id 值
		count:"",				//记录目前数据总数量（全部页旁的数量）
		shopArr:"",				//店铺数组
		stallArr:"",			//档口数据数组
		prd_id:"",				//记录当前点击的是哪个商品
		pageNo:"",				//档口弹窗内页数
		pageCount:"",   		//档口弹窗内总页数
		booth:"",				//档口弹窗内档口查询条件
		shopname:"",			//档口弹窗内店铺名称查询条件
		phone:"",				//档口弹窗内电话号码查询条件
		suitArr:[],				//档口弹窗数据
		nowIndex:"",			//档口弹窗index值
		type:"",				//判断套装编码弹窗内选择档口点击还是最外层界面点击
		stallIndex:"",  		//记录套装编码内选择档口按钮或修改按钮点击时为 suitArr 内的第几条数据
		doWhat:"",				//判断套装编码内 选择档口按钮点击还是修改按钮点击
		changeIndex:"", 		//修改按钮点击对应 suitArr 内的第几条数据
		suit_prd_id:"", 		//记录点击套装编码时对应数据的prd_id
		isGood:"",				//判断是否为 表身商品点击套装编码
		suit_prd_sku_id:"", 	//要存入数据库的主商品 prd_sku_id
		choose_prd_sku_id:"",   //单个商品套装编码 选择档口 传入的 prd_sku_id
		change_arr:[],
		timely_prd_id:"",		//点击谭庄定义按钮时记录此时传的prd_id，以便删除套装时刷新使用
		class_name:"",          //编辑分类时取的值
	
	},
	mounted: function() {
		var self = this;
		
		//------------起始默认选中全部分类，只将新增按钮=置为可编辑状态--------------
		//		|
		//		|
		//	  \ | /
		//	   \|/
		$(".shop_1").css("backgroundColor","#bedef3");
		$(".editBtn").removeClass("layui-btn-primary");
		$(".editBtn").addClass("layui-btn-disabled");
		$(".editBtn").prop("disabled",true);
		$(".btn_1").removeClass("layui-btn-disabled");
		$(".btn_1").addClass("layui-btn-primary");
		$(".btn_1").prop("disabled",false);
		//---------------------------------------------------------------------------
		
		
		
		this.getClass();   //--- 获取分类数组
		
		//----------------------------- 取店铺信息 ----------------------------------
		//		|
		//		|
		//	  \ | /
		//	   \|/
		$.ajax({																				
			url: "/index.php?m=goods&c=association&a=getShop",										
			type: 'post',																		
			data: {},																	
			dataType: 'json',																	
			success: function (data) {															
				self.shopArr = data;																			
			}																					
		});	
		//---------------------------------------------------------------------------
		
		//layui 模块 入口
        layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
            var $ = layui.jquery, element = layui.element, layer = layui.layer;
            var form = layui.form(), layer = layui.layer, layedit = layui.layedit, laydate = layui.laydate;
			var newData = "";
            // 初始化表格
            jqtb = $('#dateTable').DataTable({  //dateTable 模块 入口
                "`dom": '<"top">rt<"bottom"flp><"clear">',
                "autoWidth": false,                     // 自适应宽度
                "paging": true,
                "lengthMenu": [10, 20, 50],
                "pagingType": "full_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
                "processing": true,
                "searching": false, //是否开启搜索
                "serverSide": true,//开启服务器获取数据
                "order": [[6, "desc"]], //默认排序
                "fnServerParams": function (aoData) {
                    aoData.push(
                        {"name": "title", "value": $(".goodName").val()},
                        {"name": "sku_name", "value": $(".sku_name").val()},
						{"name": "prd_no", "value": $(".prd_no").val()},
						{"name": "category_id", "value": self.id}
                    );
                },
                //请求url
                "sAjaxSource": "index.php?m=goods&c=association&a=getData",
                //服务器端，数据回调处理
                "fnServerData": function (sSource, aDataSet, fnCallback) {
                    $.ajax({
                        "dataType": 'json',
                        "type": "post",
                        "url": sSource,
                        "data": aDataSet,
                        "success": function (resp) {
                            fnCallback(resp);
							self.count = resp.recordsTotal;
							$(document).ready(function(){
								$('.skin-minimal input').iCheck({
									checkboxClass: 'icheckbox_polaris',
									radioClass: 'iradio_polaris',
									increaseArea: '-10%'
								});
							});
							
							$(document).ready(function(){
								$('.skin input').iCheck({
									checkboxClass: 'icheckbox_minimal',
									radioClass: 'iradio_minimal',
									increaseArea: '20%'
								});
							});
							
							$('#checkAll').on('ifChecked ifUnchecked', function(event){
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
                    {'title': "<i class='layui-icon' style='font-size: 14px; color: black;'>&#xe62d;</i>", 'data': "id",'width':"16px","defaultContent": ""},
                    {'title': "", 'data': "sr",'width':"30px","defaultContent": "","render":function(data,type,row,meta){
						return "<div class='skin' style='padding-left:1px;'><input type='checkbox' name='order' value="+row.prd_id+"></div>";
					}},
                    {'title': "<i class='layui-icon' style='font-size: 14px; color: black;'>&#xe654;</i>", 'data': "num",'width':"22px","defaultContent": "","render":function(data,type,row,meta){
						if(data > 0){
							return "<i class='layui-icon dere' style='font-size: 14px; color: black;cursor:pointer;'>&#xe602;</i>";
						}
						
					}},
					{'title': "图片", 'data': "pic_path","defaultContent": "","render":function(data){
						if(data != ""){
							return "<div class='isShow' style='width:65px;height:65px;text-align:center;line-height:65px;position:relative;'><img src=" + data + " style='width:55px;height:55px;'></div>";
						}else{
							return "<div class='isShow' style='width:65px;height:65px;text-align:center;line-height:65px;position:relative;'><img src='images/noimg.png' style='width:55px;height:55px;'></div>";
						}
						
					},"width":"65px"},
                    //{'title': "关联店铺", 'data': "","defaultContent": ""},
					{'title': "商品名称/销售属性", 'data': "title","defaultContent": "","width":300},
					{'title': "简称", 'data': "sort_name","defaultContent": "","render":function(data,type,row,meta){
						return "<input type='text' name='sortname' value='"+data+"' style='border:1px solid white;outline:none;' onblur='blurSort(\""+row.prd_id+"\")' onfocus='focusNow()'>";
					}},
					{'title': "条码", 'data': "barcode","defaultContent": "","width":150,"render":function(data,type,row,meta){
						return "<input type='number' value="+data+" style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_sku(\""+row.prd_id+"\")'>";
					}},
					{'title': "商品编号", 'data': "prd_no","defaultContent": ""},
					/*{'title': "档口", 'data': "booth","defaultContent": ""},
					{'title': "款号", 'data': "style_no","defaultContent": ""},*/
					{'title': "客户类型价格", 'data': "type","defaultContent": ""},
					{'title': "操作", 'data': "prd_id","defaultContent": "","render":function(data,type,row,meta){
						return "<a style='cursor:pointer;font-size:12px;' onclick='new_add(\""+row.prd_id+"\")'>修改</a>";
					}}
                    // 自定义列
                ],
                'columnDefs': [{
                    'targets': 0,
                    'searchable': false,
                    'orderable': false,
                    'width': '64px',
                    'className': 'dt-body-center'
                },{
                    'targets': 1,
                    'searchable': false,
                    'orderable': false,
                    'width': '64px',
                    'className': 'dt-body-center'
                },{
                    'targets': 2,
                    'searchable': false,
                    'orderable': false,
                    'width': '64px',
                    'className': 'dt-body-center'
                },{
                    'targets': 3,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center'
                },{
                    'targets': 4,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center'
                },{
                    'targets': 5,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center'
                },{
                    'targets': 8,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center'
                },{
                    'targets': 9,
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
				　　api.column(0).nodes().each(function(cell, i) {

				　　　　//此处 startIndex + i + 1;会出现翻页序号不连续，主要是因为startIndex 的原因,去掉即可。
				　　　　cell.innerHTML = startIndex + i + 1;

				　　　　//cell.innerHTML =  i + 1;

				　　}); 
				}
            });
            //查询
            $("#submitSearch").click(function () {
                jqtb.ajax.reload();
            });
			
			///增加点击添加行
            $('#dateTable').on('click', '.dere', function () {
				var that = $(this);
				var dere = $(event.target).parent().parent();
                var data = jqtb.row( dere ).data();
                if($("."+data['prd_id']+data['id']).length>0 ){
                    $("."+data['prd_id']+data['id']).remove();
					that.html('&#xe602;');
                }else{
					that.html('&#xe61a;');
					var tr = "";
					$.ajax({																				
						url: "/index.php?m=goods&c=association&a=getSku",										
						type: 'post',																		
						data: {prd_id:data['prd_id']},																	
						dataType: 'json',																	
						success: function (result) {						
							if(result){
								
								for(var i = 0; i < result.length; i++){
									tr += "<tr class='"+data["prd_id"]+data["id"]+" dt-body-center newTr "+result[i]['prd_id']+"_"+result[i]['id']+"'><td width='16px' class=' dt-body-center'></td><td width='16px'></td>" +
										  "<td width='22px' class=' dt-body-center'></td>";
										  
									if(result[i].pic_path != ''){
										tr += "<td class=' dt-body-center'><div style='width:65px;height:65px;text-align:center;line-height:65px;'><img src=" + result[i].pic_path + " style='width:55px;height:55px;'></div></td>";
									}else{
										tr += "<td class=' dt-body-center'><div style='width:65px;height:65px;text-align:center;line-height:65px;'></div></td>";
									}
									
									tr += "<td class=' dt-body-center'>" + result[i].sku_name1 + "," + result[i].sku_name2 +"</td><td class=' dt-body-center'></td><td class=' dt-body-center'><input type='number' value=" + result[i].barcode +" style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_barcode(\"sku\",\""+result[i]['prd_id']+"\")'></td><td class=' dt-body-center'>" + result[i].prd_sku_no +"</td>" +
										  "<td class=' dt-body-center'></td>";
										tr += "<td class=' dt-body-center'><div><a style='cursor:pointer;font-size:12px;' onclick=change_message(\""+result[i].prd_sku_id+"\",\""+result[i]['prd_id']+"_"+result[i]['id']+"\")>修改</a></div></td></tr>";
								}
								$(dere).after(tr);
							}else{
								layer.msg('无货品',{
									icon: 2,
									time: 2000
								});
								that.html('&#xe602;');
							}																			
						}																					
					});	
                    
                }
            
            });
			
			
        });
		
		
	},
	methods: {
		//===================================================左边导航栏切换事件==========================================================
		//
		//		$(event.target)[0].nodeName  由于导航样式为div包裹span，所以要判断目前点击的是div还是span，将背景色置给div
		//		all    : 所有分类   按钮点击
		//		not    : 为分类商品 按钮点击
		//
		//		btn_1  : 新增分类按钮
		//		btn_2  : 编辑分类按钮
		//		btn_3  : 删除分类按钮
		//
		//		class名:  layui-btn-disabled  layui 按钮不可编辑样式
		//				  layui-btn-primary   layui 按钮可编辑样式
		//      
		//===============================================================================================================================
		//		|
		//		|
		//	  \ | /
		//	   \|/
		backChange:function(name){
			var self = this;
			self.class_name = name;
			self.resetNow();
			var value = "";
			$(".shop").each(function(){
				$(this).css("backgroundColor","white");
			});
			if($(event.target)[0].nodeName == "DIV"){
				$(event.target).css("backgroundColor","#bedef3");
				value = $(event.target).attr("value");
			}else if($(event.target)[0].nodeName == "SPAN"){
				$(event.target).parent().css("backgroundColor","#bedef3");
				value = $(event.target).parent().attr("value");
			}
			if(value == "all"){
				$(".editBtn").removeClass("layui-btn-primary");
				$(".editBtn").addClass("layui-btn-disabled");
				$(".editBtn").prop("disabled",true);
				$(".btn_1").removeClass("layui-btn-disabled");
				$(".btn_1").addClass("layui-btn-primary");
				$(".btn_1").prop("disabled",false);
				layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
					var $ = layui.jquery, element = layui.element, layer = layui.layer;
					var form = layui.form(), layer = layui.layer, layedit = layui.layedit, laydate = layui.laydate;
				});
				
			}else if(value == "not"){
				$(".editBtn").removeClass("layui-btn-primary");
				$(".editBtn").addClass("layui-btn-disabled");
				$(".editBtn").prop("disabled",true);
				layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
					var $ = layui.jquery, element = layui.element, layer = layui.layer;
					var form = layui.form(), layer = layui.layer, layedit = layui.layedit, laydate = layui.laydate;
					
				});
			}else{
				$(".editBtn").removeClass("layui-btn-disabled");
				$(".editBtn").addClass("layui-btn-primary");
				$(".editBtn").prop("disabled",false);
			}
			self.id = value;
			jqtb.ajax.reload();
			
		},
		
		//===================================================================================== 当前页 全部页 事件 ==============================================================================================
		//																																															
		//		点击时通过传过来的值判断是哪个按钮执行此方法																																		
		//																																											
		//		type          : 判断是当前页还是全部页	
		//		nowPage       : 判断当前页 i（.inputTe） 标签是否为勾选状态
		//		allPage       : 判断全部页 i（.inputTe） 标签是否为勾选状态
		//		isAll     	  : 记录目前为全部页还是当前页，用于传入后台做判断
		//		event.target  : 获取当前点击对象
		//
		//		为避免button 内的checkbox勾选无效，所以用 i（.inputTe） 标签画一个 虚拟 checkbox 每次点击切换背景颜色
		//																																															
		//=======================================================================================================================================================================================================
		//				|
		//				|	
		//			 	|  
		//			  \	| /
		//			   \|/
		selectAll:function(type){
			var self = this;
			if(type == "now"){
				$(".currentAll").find(".inputTe").each(function(){
					$(this).css("color","white");
				});
				self.isAll = false;
				self.allPage = false;
				if(self.nowPage == false){
					if($(event.target).attr('value') != "icon"){
						$(event.target).find(".inputTe").css("color","black");
					}else{
						$(event.target).css("color","black");
					}
					self.nowPage = true;
					$("input[name='order']").iCheck('check');
				}else if(self.nowPage == true){
					if($(event.target).attr('value') != "icon"){
						$(event.target).find(".inputTe").css("color","white");
					}else{
						$(event.target).css("color","white");
					}
					self.nowPage = false;
					$("input[name='order']").iCheck('uncheck');		
				}
			}else if(type == "all"){
				$(".current").find(".inputTe").each(function(){
					$(this).css("color","white");
				});
				self.nowPage = false;
				if(self.allPage == false){
					if($(event.target).attr('value') != "icon"){
						$(event.target).find(".inputTe").css("color","black");
					}else{
						$(event.target).css("color","black");
					}
					self.allPage = true;
					$("input[name='order']").iCheck('check');
					self.isAll = true;
				}else if(self.allPage == true){
					if($(event.target).attr('value') != "icon"){
						$(event.target).find(".inputTe").css("color","white");
					}else{
						$(event.target).css("color","white");
					}
					self.allPage = false;
					$("input[name='order']").iCheck('uncheck');	
					self.isAll = false;
				}
			}
			
		},
		
		//======================================================================================= 获取分类数组 =================================================================================================
		//																																															
		//		获取的数据赋值给 self.classArr
		//																																															
		//======================================================================================================================================================================================================
		//				|
		//				|	
		//			 	|  
		//			  \	| /
		//			   \|/
		getClass:function(){
			var self = this;
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=getClass",										
				type: 'post',																		
				data: {},																	
				dataType: 'json',																	
				success: function (data) {															
					self.classArr = data;																			
				}																					
			});	
		},
		
		//======================================================================================= 新增分类 =====================================================================================================
		add:function(){
			var self = this;
			
			if($(".btn_1").prop("disabled")){
				return false;
			}
			
			$("#className").val("");
			
			layer.open({																																											
				type: 1,																																											
				title: '新建【商品分类】',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['700px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#addClass"),																																							
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var name = $("#className").val();
					if(name == ""){
						layer.msg("请填写分类名称",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					$.ajax({																				
						url: "/index.php?m=goods&c=association&a=insertClass",										
						type: 'post',																		
						data: {name:name},																	
						dataType: 'json',																	
						success: function (data) {															
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								self.getClass();
								layer.close(index);
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
																																																	
				}																																													
			});	
		},
		
		//======================================================================================= 编辑分类 =====================================================================================================
		editName:function(){
			var self = this;
			
			if($(".btn_2").prop("disabled")){
				return false;
			}
			
			$("#editName").val(self.class_name);
			layer.open({																																											
				type: 1,																																											
				title: '编辑【商品分类】',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['700px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#editClass"),																																							
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var name = $("#editName").val();
					if(name == ""){
						layer.msg("请填写分类名称",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					$.ajax({																				
						url: "/index.php?m=goods&c=association&a=changeName",										
						type: 'post',																		
						data: {name:name,id:self.id},																	
						dataType: 'json',																	
						success: function (data) {															
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								self.getClass();
							}else{
								layer.msg(data.msg,{
									icon: 2,
									time: 2000
								});
							}																			
						}																					
					});	
					layer.close(index);
				}
				,btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {																																					
																																																	
				}																																													
			});	
		},
		
		//===================================================================================== 删除分类弹窗 ===================================================================================================
		deleteClass:function(){
			var self = this;
			
			if($(".btn_3").prop("disabled")){
				return false;
			}
			
			layer.confirm('确定删除此分类吗？删除后，此分类下的商品会变成[未分类商品]', {
				btn: ['确定', '取消'] //可以无限个按钮
				
			}, function(index, layero){
				//按钮【按钮一】的回调
				
				$.ajax({																				
					url: "/index.php?m=goods&c=association&a=deleteClass",										
					type: 'post',																		
					data: {id:self.id},																	
					dataType: 'json',																	
					success: function (data) {															
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							self.getClass();
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
		},
		
		//===================================================================================== 重置方法 ===================================================================================================
		resetNow:function(){
			var self = this;
			self.isAll = false;
			self.nowPage = false;
			self.allPage = false;
			$("input[name='order']").iCheck('uncheck');	
			$(".inputTe").css("color","white");
			$(".goodName").val("");
			$(".sku_name").val("");
			$(".concat").val("");
			$(".prd_no").val("");		
			
		},
		//=================================================================================== 重置方法结束 =================================================================================================
		
		//=================================================================================== 获取档口数据 =================================================================================================
		getStall:function(booth,shopname,phone,curr){
			var self = this;
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=getStall",										
				type: 'post',																		
				data: {booth:booth,shopname:shopname,phone:phone,curr:curr},																	
				dataType: 'json',																	
				success: function (data) {															
					if(data.result != 0){
						self.stallArr = data.result;
						self.pageCount = Math.ceil(data.pageNum / 10);
						self.pageNo = curr;
					}else{
						layer.msg("没有查询到数据",{
							icon: 2,
							time: 2000
						});
						self.stallArr = "";
						self.pageCount = 0;
						self.pageNo = 0;
					}																			
				}																					
			});	
		},
		//================================================================================= 获取档口数据结束 ===============================================================================================
		
		pageKeyDown:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				self.page('sure');
			}
		},
		
		//==================================================================================== 页面查询框回车事件 ==========================================================================================
		keyDown:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				jqtb.ajax.reload();
			}
		},
		//================================================================================== 页面查询框回车事件结束 ========================================================================================
		
		//=========================================================================================== 新增 =================================================================================================
		newAdd:function(type){
			
			var self = this;
			self.change_arr = [];
			if(type == "add"){
				$("#good_code").val("");
				$("#good_num").val("");
				$("#good_name").val("");
				$("#choose_class").val(0);
				$("#brand").val("");
				$("#bar_code").val("");
				$("#retail").val("");
				$("#good_cost").val("");
				$("#prd_id").val("");
				$("#sort_name").val("");
			}else{
				$.ajax({																				
					url: "/index.php?m=goods&c=association&a=get_data",										
					type: 'post',																		
					data: {prd_id:type},																	
					dataType: 'json',
					async:false, 				
					success: function (data) {
						$("#good_code").val(data.result.prd_no);
						$("#good_num").val(data.result.art_no);
						$("#good_name").val(data.result.title);
						$("#brand").val(data.result.brand);
						$("#bar_code").val(data.result.barcode);
						$("#choose_class").val(data.result.category_id);
						$("#retail").val(data.result.price);
						$("#good_cost").val(data.result.cost_price);
						$("#prd_id").val(data.result.prd_id);
						$("#sort_name").val(data.result.sort_name);
						setTimeout(function(){
							self.change_arr = data.row;
						},50);
						
					}																					
				});
			}
			
			layer.open({																																											
				type: 1,																																											
				title: '新增【商品信息】',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['1200px', '550px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#new_add"),																																							
				btn: ['保存','取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					self.editGood(index,type);
				},
				btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {																																					
																																																	
				}
			});
		},
		//========================================================================================= 新增结束 ===============================================================================================
		
		//=================================================================================== 新增弹窗内增加行事件 =========================================================================================
		//
		//		静态表格 点击增加行 直接在 tbody 画一个 tr 出来
		//		要求单元格可编辑 在 td 内嵌入 input
		//
		//==================================================================================================================================================================================================
		//				|
		//				|	
		//			 	|  
		//			  \	| /
		//			   \|/
		tableAdd:function(){
			var self = this;
			var json = {
				"cost_price":"",
				"prd_sku_no":"",
				"price":"",
				"sku_name1":"",
				"sku_name2":"",
				"status":"add"
			}
			self.change_arr.push(json);
		},
		
		//=================================================================================== 新增弹窗内保存按钮事件 =======================================================================================
		//
		//		good_code    : 商品编号
		//		good_num	 : 货号
		//		good_name    : 商品名称
		//		choose_class : 分类
		//		brand		 : 品牌
		//		bar_code	 : 条码
		//		retail		 : 零售价
		//		good_cost	 : 成本价
		//
		//		orderArr     : 表头数组
		//		detailArr    : 表身数组
		//		data         : 合并数组（传到后台的数据）
		//
		//==================================================================================================================================================================================================
		//				|
		//				|	
		//			 	|  
		//			  \	| /
		//			   \|/
		editGood:function(index,type){
			var self = this;
			
			var data = [];
			var orderArr = [];
			var detailArr = [];
			
			var good_code = $("#good_code").val();
			var good_num = $("#good_num").val();
			var good_name = $("#good_name").val();
			var choose_class = $("#choose_class").val();
			var brand = $("#brand").val();
			var bar_code = $("#bar_code").val();
			var retail = $("#retail").val();
			var good_cost = $("#good_cost").val();
			var prd_id = $("#prd_id").val();
			var sort_name = $("#sort_name").val();
			
			var newOrder = {
				"good_code":good_code,
				"good_num":good_num,
				"good_name":good_name,
				"choose_class":choose_class,
				"brand":brand,
				"bar_code":bar_code,
				"retail":retail,
				"good_cost":good_cost,
				"prd_id":prd_id,
				"sort_name":sort_name
			}
			orderArr.push(newOrder);
			
			if(good_code == ""){
				layer.msg("请填写商品编号",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			if(good_name == ""){
				layer.msg("请填写商品名称",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			$("#tbody_1 tr").each(function(){
				
				if($(this).find("td").find(".input_1").val() == ""){
					layer.msg("请填写sku编码",{
						icon: 0,
						time: 2000
					});
					return false;
				}
				
				/*var newData = {
					"prd_sku_no":$(this).find("td").find(".input_1").val(),
					"sku_name1":$(this).find("td").find(".input_2").val(),
					"sku_name2":$(this).find("td").find(".input_3").val(),
					"price":$(this).find("td").find(".input_4").val(),
					"cost_price":$(this).find("td").find(".input_5").val(),
					"status":"update"
				}
				detailArr.push(newData);*/
			});
			
			data.push(orderArr);
			data.push(self.change_arr);
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=newAdd",										
				type: 'post',																		
				data: {data:data,type:type},																	
				dataType: 'json',																	
				success: function (data) {															
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						jqtb.ajax.reload();
						layer.close(index);
						
					}else{
						layer.msg(data.msg,{
							icon: 0,
							time: 2000
						});
					}																			
				}																					
			});
			
		},
		
		//========================================================================================= 修改按钮 ===============================================================================================
		changeGood:function(index){
			var self= this;
			self.doWhat = "change";
			self.changeIndex = index;
			layer.open({
				title :'选择商品',
				type: 2,
				shade: false,
				area: ['700px', '560px'],
				maxmin: false,
				content: '?m=widget&c=selectProduct&a=index'
			}); 
		},
		//======================================================================================= 修改按钮结束 =============================================================================================
		
		//========================================================================================= 删除按钮 ===============================================================================================
		deleteGood:function(){
			var self = this;
			if($("input[name='order']").filter(':checked').length == 0){																							
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																												
				return false;																																										
			}
			
			var tip = "";
			
			if(self.isAll == false){
				tip = '删除商品将会清空对应库存（未处理完订单中的商品不能被删除）确定要删除这 '+$("input[name='order']").filter(':checked').length+' 个商品吗？';
			}else{
				tip = '删除商品将会清空对应库存（未处理完订单中的商品不能被删除）确定要删除全部商品吗？';
			}
			
			layer.open({																																											
				title: '提示',																																										
				content: tip,																																						
				btn: ['确定', '取消'],																																								
				yes:function(){		

					var data = "";
					
					$("input[name='order']:checkbox").each(function(){																																		
						if(true == $(this).is(':checked')){																																					
							data += ($(this).val()+",");																																					
						}																																													
					});	
					
					data = data.substr(0,data.length-1);
					
					var goodName = $(".goodName").val();
					var sku_name = $(".sku_name").val();
					var prd_no = $(".prd_no").val();
					var category_id = self.id;
					
					$.ajax({																				
						url: "/index.php?m=goods&c=association&a=deleteGoods",										
						type: 'post',																		
						data: {data:data,isAll:self.isAll,goodName:goodName,sku_name:sku_name,prd_no:prd_no,category_id:category_id},																	
						dataType: 'json',																	
						success: function (data) {															
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								jqtb.ajax.reload();
								self.isAll = false;
								self.nowPage = false;
								self.allPage = false;
								$("input[name='order']").iCheck('uncheck');	
								$(".inputTe").css("color","white");
							}else{
								layer.msg(data.msg,{
									icon: 2,
									time: 2000
								});	
							}
											
						}																					
					});																																								
				}																																													
			});
			
		},
		//======================================================================================= 删除按钮结束 =============================================================================================
		
		delete_tr:function(index,prd_sku_id){
			deleteTr(index,prd_sku_id);
		},
		
		//======================================================================================= 明细修改按钮 =============================================================================================
		change_message_1:function(prd_sku_id,cla){
			var self = this;
			
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=get_one_good",										
				type: 'post',																		
				data: {prd_sku_id:prd_sku_id},																	
				dataType: 'json',																	
				success: function (data) {															
					$("#detail_prd_sku_no").val(data.prd_sku_no);
					$("#detail_sku_name1").val(data.sku_name1);	
					$("#detail_sku_name2").val(data.sku_name2);
					$("#detail_price").val(data.price);
					$("#detail_cost_price").val(data.cost_price);
					$("#detail_cost_barcode").val(data.barcode);
				}																					
			});
			
			layer.open({																																											
				type: 1,																																											
				title: '编辑',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['500px', '420px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#mingxi_change"),																																							
				btn: ['保存','取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var prd_sku_no = $("#detail_prd_sku_no").val();
					var sku_name1 = $("#detail_sku_name1").val();
					var sku_name2 = $("#detail_sku_name2").val();
					var price = $("#detail_price").val();
					var cost_price = $("#detail_cost_price").val();
					var barcode = $("#detail_cost_barcode").val();
					if(prd_sku_no == ""){
						layer.msg("请填写sku编码",{
							icon: 0,
							time: 2000
						});
						return false;
					}
					
					$.ajax({																				
						url: "/index.php?m=goods&c=association&a=change_one_good",										
						type: 'post',																		
						data: {prd_sku_no:prd_sku_no,sku_name1:sku_name1,sku_name2:sku_name2,price:price,cost_price:cost_price,prd_sku_id:prd_sku_id,barcode:barcode},																	
						dataType: 'json',																	
						success: function (data) {															
							if(data){
								var tr = "";
									tr = "<td width='16px' class=' dt-body-center'></td><td width='16px'></td><td width='22px' class=' dt-body-center'></td>"; 
										 if(data.pic_path != ''){
											tr += "<td class=' dt-body-center'><div style='width:65px;height:65px;text-align:center;line-height:65px;'><img src=" + data.pic_path + " style='width:55px;height:55px;'></div></td>";
										 }else{
											tr += "<td class=' dt-body-center'><div style='width:65px;height:65px;text-align:center;line-height:65px;'></div></td>";
										 }
										 tr += "<td class=' dt-body-center'>" + data.sku_name1 + "," + data.sku_name2 +"</td><td class=' dt-body-center'></td><td class=' dt-body-center'>" + data.barcode +"</td><td class=' dt-body-center'>" + data.prd_sku_no +"</td>" +
										  "<td class=' dt-body-center'></td>" +
										  "<td class=' dt-body-center'><div><a style='font-size:12px;cursor:pointer;' onclick=change_message(\""+data.prd_sku_id+"\",\""+cla+"\")>修改</a></div></td></tr>";
										 
								$("."+cla).html(tr);
								layer.msg("修改成功",{
									icon: 1,
									time: 2000
								});
								layer.close(index);
							}else{
								layer.msg("修改成功",{
									icon: 1,
									time: 2000
								});
								layer.close(index);
							}
						}																					
					});
				},
				btn2: function(index, layero){
					
				},
				cancel: function (index, layero) {																																					
																																																	
				}																																													
			});
			
		},
		//===================================================================================== 明细修改按钮结束 ===========================================================================================
		
		blurNow_1:function(a,index){
			var self = this;
			var this_value = $(event.target);
			this_value.css("border","1px solid white");
			if(a == "prd_sku_no"){
				self.change_arr[index].prd_sku_no = this_value.val();
			}else if(a == "sku_name1"){
				self.change_arr[index].sku_name1 = this_value.val();
			}else if(a == "sku_name2"){
				self.change_arr[index].sku_name2 = this_value.val();
			}else if(a == "price"){
				self.change_arr[index].price = this_value.val();
			}else if(a == "cost_price"){
				self.change_arr[index].cost_price = this_value.val();
			}else if(a == "sort_sku"){
				self.change_arr[index].barcode = this_value.val();
			}
			
		}
	}
});

function change_message(prd_sku_id,cla){
	flow.change_message_1(prd_sku_id,cla);
}

//======================================================================================= 新增弹窗删除行 ===============================================================================================
//																																															
//		由于js生成的标签点击事件 不用 vue 的 render 组件渲染会导致 @click 点击事件失效，所以只能用 onclick
//		
//		name  : 当前点击对应 tr 的 class名
//																																															
//======================================================================================================================================================================================================
//				|
//				|	
//			 	|  
//			  \	| /
//			   \|/
function deleteTr(index,prd_sku_id){
	if(flow.change_arr[index].status == "add"){
		flow.change_arr.splice(index,1);
	}else{
		flow.change_arr[index].status = "delete";
		$("."+prd_sku_id).remove();
	}
}

function focusNow(){
	$(event.target).css("border","1px solid #1e9fff");
	$(event.target).select();
}

function blurNow(){
	$(event.target).css("border","1px solid white");
}

function blur_save(type,prd){
	var a = $(event.target);
	$(event.target).css("border","1px solid white");
	var value = a.val();
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=updateCostprice",										
		type: 'post',																		
		data: {type:type,prd:prd,value:value},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
			}else{
				layer.msg("修改失败",{
					icon: 2,
					time: 2000
				});
			}
							
		}																					
	});
}

function blurSort(prd_id){
	$(event.target).css("border","1px solid white");
	var sort_name = $(event.target).val();
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=updateSort",										
		type: 'post',																		
		data: {prd_id:prd_id,sort_name:sort_name},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
			}
							
		}																					
	});	
}


function blur_sku(prd_id){
	$(event.target).css("border","1px solid white");
	var barcode = $(event.target).val();
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=updateSkuprice",										
		type: 'post',																		
		data: {prd_id:prd_id,barcode:barcode},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
			}else{
				layer.msg("修改失败",{
					icon: 2,
					time: 2000
				});
			}				
		}																					
	});	
}

function blur_barcode(a,prd_id){
	$(event.target).css("border","1px solid white");
	var barcode = $(event.target).val();
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=updateSkuBarcode",										
		type: 'post',																		
		data: {prd_id:prd_id,barcode:barcode},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
			}else{
				layer.msg("修改失败",{
					icon: 2,
					time: 2000
				});
			}				
		}																					
	});	
}



function new_add(prd_id){
	flow.newAdd(prd_id);
}


$('#checkAll_good').on('ifChecked ifUnchecked', function(event){
	if (event.type == 'ifChecked') {
		$("input[name='suit_good']").iCheck('check');																																		
	} else {																																														
		$("input[name='suit_good']").iCheck('uncheck');																																		
	}																																																
});

$('.skin-mini_1 input').iCheck({
	checkboxClass: 'icheckbox_minimal',
	radioClass: 'iradio_minimal',
	increaseArea: '20%'
});

function row_price_blur(prd_id,configKey){
	var price = $(event.target).val();
	$.ajax({																				
		url: "/index.php?m=system&c=stall_navigation&a=updatePrice",										
		type: 'post',																		
		data: {prd_id:prd_id,configKey:configKey,price:price},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
			}
							
		}																					
	});	
}






