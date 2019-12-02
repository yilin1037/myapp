var jqtb;
var flow = new Vue({
	el: '#flow',
	data: {
		shop_list: param_object.shop_list,
		this_shop_info: [{shop_type:'',shop_id:'',shop_name:''}],
		time_format: param_object.time_format,
		goods_list: [],
		goods_info:[],
		supplierArr:[],
		nowIndex:'',
		on_id:'',
		sku_id:'',
		num_iid:'',
		prd_id:'',
		prd_no:'',
		title:'',
		unit:'',
		good_change_num_iid:'',
		good_change_sku_id:'',
		elementId:'',
		logArr:[],
	},
	mounted: function() {
		var self = this;
		
		//==日期选择器==
		//layui 模块 入口
        layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
            var $ = layui.jquery, element = layui.element, layer = layui.layer;
            var form = layui.form(), layer = layui.layer, layedit = layui.layedit, laydate = layui.laydate;
            // 初始化表格
			
            jqtb = $('#dateTable').DataTable({  //dateTable 模块 入口
                "`dom": '<"top">rt<"bottom"flp><"clear">',
                "autoWidth": false,                     // 自适应宽度
                "paging": true,
                "lengthMenu": [20, 100],
                "pagingType": "full_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
                "processing": true,
                "searching": false, //是否开启搜索
                "serverSide": true,//开启服务器获取数据
                //"order": [[7, "desc"]], //默认排序
                "fnServerParams": function (aoData) {
                    aoData.push(
                        {"name": "online_goods_keywords", "value": $("#online_goods_keywords").val()},
                        {"name": "system_goods_keywords", "value": ""},
						{"name": "online_goods_customcode", "value": $("#online_goods_customcode").val()},
						{"name": "online_goods_customcode2", "value": $("#online_goods_customcode2").val()},
						{"name": "replace_goods_customcode", "value": $("#replace_goods_customcode").val()},
						{"name": "replace_goods_customcode2", "value": $("#replace_goods_customcode2").val()},
						{"name": "cid_name", "value": $("#cid_name").val()},
						{"name": "shop_type", "value": flow.this_shop_info[0].shop_type},
						{"name": "shop_id", "value":  flow.this_shop_info[0].shop_id}
                    );
                },
                //请求url
                "sAjaxSource": "/index.php?m=goods&c=association&a=get_goods",
                //服务器端，数据回调处理
                "fnServerData": function (sSource, aDataSet, fnCallback) {
                    $.ajax({
                        "dataType": 'json',
                        "type": "post",
                        "url": sSource,
                        "data": aDataSet,
                        "success": function (resp) {
							if(flow.this_shop_info[0].shop_type == 'TB'){
								$('#outerUploadAll').show();
							}else{
								$('#outerUploadAll').hide();
							}
							
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
					{'title': "<input type='checkbox' name='checkLists'>",'data': "have_sku",'width':"20px","defaultContent": "","render":function(data,type,row,meta){
						if(data && data != ""){
							return "<input type='checkbox' name='checkList' value='"+row.on_num_iid+"'>";
						}
					}},
                    {'title': "<i class='layui-icon' style='font-size: 14px; color: black;'>&#xe654;</i>", 'data': "have_sku",'width':"22px","defaultContent": "","render":function(data){
						if(data == "1"){
							return "<i class='layui-icon dere' style='font-size: 14px; color: black;cursor:pointer;'>&#xe602;</i>";	
						}
					}},
                    //{'title': "<i class='layui-icon' style='font-size: 14px; color: #4b6fa7;'>&#xe60b;</i>", 'data': "sr",'width':"24px","defaultContent": ""},
					{'title': "图", 'data': "on_pic","defaultContent": "","render":function(data){
						if(data && data != ""){
							return "<div class='isShow' style='width:65px;height:65px;text-align:center;line-height:65px;position:relative;'><img src=" + data + " style='width:55px;height:55px;'></div>";
						}
						
					},"width":"65px"},
                    {'title': "线上商家编码", 'data': "on_outer_id","width":160,"defaultContent": "","render":function(data,type,row,meta){
							if(row.shoptype == 'TB'){
								return "<input type='text' id='outer_id_"+ row.on_id +"' name='online_id' value='"+ row.on_outer_id +"' style='width:130px;' >" + '<a class="change btn_1" style="background-color:#1E9FFF;" title="回传商家后台" onclick="outerUpload(\''+ row.shoptype +'\',\'outer_id_'+ row.on_id +'\')">传</a>';
							}else{
								return row.on_outer_id;
							}
						}
					},
					{'title': "替换商品编码", 'data': "","defaultContent": "","width":160,"render":function(data,type,row,meta){
							if(row.shoptype == 'JP'){
								return "";
							}else{
								return "<input type='text' id='prd_"+ row.on_id +"' name='replace_prd_no' value='"+ row.replace_prd_no +"' style='width:130px;' >" + '<a class="change btn_1" onclick="change(\'prd_'+ row.on_id +'\')">选</a>';	
							}
						}
					},
					{'title': "供应商", 'data': "cus_name","defaultContent": "","width":100,"render":function(data,type,row,meta){
						if(data != "" && data!=null){
							
							return "<div><button style='font-size: 12px' class='layui-btn layui-btn-primary' value='"+data+"' onclick='supplier(\""+row.on_id+"\",\"stall\",\"\",\"\",\"\")'>" + data +"</button></div><i class='aui_close' onclick='clear_this(\""+row.on_id+"\")'>ဆ</i>";
						}else{
							return "<div><button style='font-size: 12px' class='layui-btn layui-btn-small layui-btn-danger' value='' onclick='supplier(\""+row.on_id+"\",\"stall\",\"\",\"\",\"\")'>选择供应商</button></div>";
						}
					}},
					{'title': "代拿", 'data': "assist_prd","defaultContent": "",'sClass':'center',"width":100,"render":function(data,type,row,meta){
						return "<input type='checkbox' "+(data == 1 ? 'checked' : '')+" onclick='updateAssistPrd(\""+row.num_iid+"\",this.checked)'>";
					}},
					{'title': "线上商品名称/销售属性", 'data': "on_title","width":400,"defaultContent": ""},
					{'title': "类目", 'data': "cid_name","defaultContent": "", "width":60 ,"render":function(data,type,row,meta){
							if(row.shoptype == 'TB' || row.shoptype == 'JD'){
								return row.cid_name;
							}else{
								return "<input type='text' id='cid_name_"+ row.on_id +"' name='cid_name' value='"+ row.cid_name +"' style='width:100%;' >";
							}
						}
					},
					{'title': "质检-货号", 'data': "goods_no","defaultContent": "", "width":80 ,"render":function(data,type,row,meta){
							if(row.shoptype == 'TB' || row.shoptype == 'JD'){
								return row.goods_no;
							}else{
								return "<input type='text' id='goods_no_"+ row.on_id +"' name='goods_no' value='"+ row.goods_no +"' style='width:100%;' >";
							}
						}
					},
					{'title': "质检-品牌", 'data': "brand","defaultContent": "", "width":80 ,"render":function(data,type,row,meta){
							if(row.shoptype == 'TB' || row.shoptype == 'JD'){
								return row.brand;
							}else{
								return "<input type='text' id='brand_"+ row.on_id +"' name='brand' value='"+ row.brand +"' style='width:100%;' >";
							}
						}
					},
					{'title': "质检-材质成分", 'data': "material","defaultContent": "", "width":80 ,"render":function(data,type,row,meta){
							if(row.shoptype == 'TB'){
								return row.material;
							}else{
								return "<input type='text' id='material_"+ row.on_id +"' name='material' value='"+ row.material +"' style='width:100%;' >";
							}
						}
					},
					{'title': "质检-内里材质", 'data': "material_in","defaultContent": "", "width":80 ,"render":function(data,type,row,meta){
							return "<input type='text' id='material_in_"+ row.on_id +"' name='material_in' value='"+ row.material_in +"' style='width:100%;' >";
						}
					},
					{'title': "质检-执行标准", 'data': "standard","defaultContent": "", "width":80 ,"render":function(data,type,row,meta){
							return "<input type='text' id='standard_"+ row.on_id +"' name='standard' value='"+ row.standard +"' style='width:100%;' >";
						}
					},
					{'title': "质检-安全级别", 'data': "security","defaultContent": "", "width":80 ,"render":function(data,type,row,meta){
							return "<input type='text' id='security_"+ row.on_id +"' name='security' value='"+ row.security +"' style='width:100%;' >";
						}
					},
					{'title': "质检-零售价", 'data': "retailPrice","defaultContent": "", "width":60 ,"render":function(data,type,row,meta){
							if(row.shoptype == 'TB' || row.shoptype == 'JD'){
								return row.retailPrice;
							}else{
								return "<input type='text' id='retailPrice_"+ row.on_id +"' name='retailPrice' value='"+ row.retailPrice +"' style='width:100%;' >";
							}
						}
					},
					{'title': "质检-销售属性", 'data': "zj_sku_name","defaultContent": "", "width":80 ,"render":function(data,type,row,meta){
							return "";
						}
					},
					{'title': "是否绑定", 'data': "binding","defaultContent": "", "width":80 ,"render":function(data,type,row,meta){
							if(row.binding =='未绑定'){
									if(row.replace_prd_no!='' || row.outer_iid!=''){
										return row.binding+'<a class="change btn_1" style="background-color:#1E9FFF;" onclick="Product(\''+ row.on_id +'\')">生成</a>';
									}else{
										return row.binding;
									}
							}else{
								return "<span style='color:red;'>库存:</span>"+row.qty+'<a class="change btn_1" style="background-color:#1E9FFF;" onclick="Stock(\''+ row.on_outer_id +'\')">入库</a>';
							}
		
						}
					},
					{'title': "新增时间", 'data': "addtime","defaultContent": "", "width":80 ,"render":function(data,type,row,meta){
						return row.addtime + '<br/><a class="change btn_1" onclick="log(\'prd_'+ row.on_id +'\')">日志</a>';
					}},
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
                    'className': 'dt-body-center',
					'visible': (daina_system_id ? true : false)
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
                },{
                    'targets': 10,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center'
                },{
                    'targets': 11,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center'
                },{
                    'targets': 12,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center'
                },{
                    'targets': 13,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center'
                },{
                    'targets': 14,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center'
                },{
                    'targets': 15,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center'
                },{
                    'targets': 16,
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
			jqtb.on( 'init.dt', function () { 
				$('#dateTable').colResizable();         
			})
            //查询
            $("#submitSearch").click(function () {
                jqtb.ajax.reload();
            });
			
			///增加点击添加行
            $('#dateTable').on('click', '.dere', function () {
				var that = $(this);
				var dere = $(event.target).parent().parent();
                var data = jqtb.row( dere ).data();

                if($(".prd_sku"+data['on_id']).length>0 ){
                    $(".prd_sku"+data['on_id']).remove();
					that.html('&#xe602;');
                }else{
					that.html('&#xe61a;');
					var tr = "";
					$.ajax({																				
						url: "/index.php?m=goods&c=association&a=get_goods_sku",										
						type: 'post',																		
						data: {num_iid: data['on_num_iid'],shoptype: data['shoptype']},																	
						dataType: 'json',																	
						success: function (result) {						
							if(result){
								
								for(var i = 0; i < result.length; i++){
									tr += "<tr class='prd_sku"+data["on_id"]+" dt-body-center newTr' style='background-color:#FFFFE6;'><td width='16px' class=' dt-body-center'></td><td width='20px'><input type='checkbox' name='checkList' value='"+result[i].num_iid+","+result[i].sku_id+"'></td><td width='16px'></td>";
										  
									if(result[i].on_sku_pic && result[i].on_sku_pic != ''){
										tr += "<td class=' dt-body-center'><div style='width:65px;height:65px;text-align:center;line-height:65px;'><img src=" + result[i].on_sku_pic + " style='width:55px;height:55px;'></div></td>";
									}else{
										tr += "<td class=' dt-body-center'><div style='width:65px;height:65px;text-align:center;line-height:65px;'></div></td>";
									}
									if(!result[i].bom_id)
									{
										if(data['shoptype'] == 'TB'){
											tr += "<td class='dt-body-center' "+(result[i].bom_num ? "rowspan="+result[i].bom_num : '')+"><input type='text' id='outer_sku_id_"+ result[i].on_id +"' name='online_id' style='width:130px;' value='"+ result[i].outer_sku_id +"'>" + '<a class="change btn_1" style="background-color:#1E9FFF;" title="回传商家后台" onclick="outerUpload(\''+ data['shoptype'] +'\',\'outer_sku_id_'+ result[i].on_id +'\')">传</a>' + "<div><button style='font-size: 12px' class='layui-btn layui-btn-mini  layui-btn-success' value='' onclick='supplier(\""+result[i].on_id+"\",\"stall\",\"\",\""+result[i].sku_id+"\",\""+result[i].num_iid+"\")'>设置套装</button></div></td>";
										}else{
											tr += "<td class='dt-body-center' "+(result[i].bom_num ? "rowspan="+result[i].bom_num : '')+">" + result[i].outer_sku_id + "<div><button style='font-size: 12px' class='layui-btn layui-btn-mini  layui-btn-success' value='' onclick='supplier(\""+result[i].on_id+"\",\"stall\",\"\",\""+result[i].sku_id+"\",\""+result[i].num_iid+"\")'>设置套装</button></div></td>";
										}
									}
									if(data['shoptype'] == 'JP'){
										tr += "<td class=' dt-body-center'></td>";
									}else{
										tr += "<td class=' dt-body-center' style='width:160px;'> <input type='text' id='sku_"+ result[i].on_id +"' name='replace_prd_no' style='width:130px;' value='"+ result[i].replace_prd_no +"'>" + '<a class="change btn_1" onclick="change(\'sku_'+ result[i].on_id +'\')">选</a>' + "</td>";
									}
								
									if(result[i]['cus_name'] !="" && result[i]['cus_name'] !=null){
											tr += "<td class=' dt-body-center'><div><button style='font-size: 12px' class='layui-btn layui-btn-primary' value='"+result[i].cus_name+"' onclick='supplier(\""+result[i].on_id+"\",\"stall\",\"\",\""+result[i].sku_id+"\",\""+result[i].num_iid+"\")'>" + result[i].cus_name +"</button></div><i class='aui_close' onclick='clear_child(\""+result[i].on_id+"\",\""+result[i].sku_id+"\")'>ဆ</i></td>";
							
										}else{
					
											tr += "<td class=' dt-body-center'><div><button style='font-size: 12px' class='layui-btn layui-btn-small layui-btn-danger' value='' onclick='supplier(\""+result[i].on_id+"\",\"stall\",\"\",\""+result[i].sku_id+"\",\""+result[i].num_iid+"\")'>选择供应商</button></div></td>";
										}
									
									if(result[i].binding == '未绑定'){
			
										  if(result[i].bom_id)
										  {
											  tr +=  "<td class=' dt-body-center'>线上属性：" + result[i].sku_properties_name + "</br>套装属性：<input type='text' id='bom_sku_name_"+ result[i].on_id +"' name='bom_sku_name' style='width:130px;' value='"+ result[i].bom_sku_name +"'></td>";
										  }
										  else
										  {
										  	  tr +=  "<td class=' dt-body-center'>" + result[i].sku_properties_name+"</td>";
										  }
										  tr += "<td class=' dt-body-center'></td>" + 
										  "<td class=' dt-body-center'></td>" + 
										  "<td class=' dt-body-center'></td>" + 
										  "<td class=' dt-body-center'></td>" + 
										  "<td class=' dt-body-center'></td>" +
										  "<td class=' dt-body-center'></td>" +
										  "<td class=' dt-body-center'></td>" +
										  "<td class=' dt-body-center'></td>" +
										  "<td class=' dt-body-center' style='width:160px;'> <input type='text' id='zj_sku_name_"+ result[i].on_id +"' name='zj_sku_name' style='width:130px;' value='"+ result[i].zj_sku_name +"'>" +
										  "<td class=' dt-body-center'>"+ result[i].binding +"</td>" +
										  "<td class=' dt-body-center'>" + result[i].addtime + '<br/><a class="change btn_1" onclick="log(\'sku_'+ result[i].on_id +'\')">日志</a>' + "</td>";
										
									}else{
				
										  if(result[i].bom_id)
										  {
											  tr +=  "<td class=' dt-body-center'>线上属性：" + result[i].sku_properties_name + "</br>套装属性：<input type='text' id='bom_sku_name_"+ result[i].on_id +"' name='bom_sku_name' style='width:130px;' value='"+ result[i].bom_sku_name +"'></td>";
										  }
										  else
										  {
										  	  tr +=  "<td class=' dt-body-center'>" + result[i].sku_properties_name+"</td>";
										  }
										  tr += "<td class=' dt-body-center'></td>" + 
										  "<td class=' dt-body-center'></td>" + 
										  "<td class=' dt-body-center'></td>" + 
										  "<td class=' dt-body-center'></td>" + 
										  "<td class=' dt-body-center'></td>" +
										  "<td class=' dt-body-center'></td>" +
										  "<td class=' dt-body-center'></td>" +
										  "<td class=' dt-body-center'></td>" +
										  "<td class=' dt-body-center' style='width:160px;'> <input type='text' id='zj_sku_name_"+ result[i].on_id +"' name='zj_sku_name' style='width:130px;' value='"+ result[i].zj_sku_name +"'>" +
										  "<td class=' dt-body-center'><span style ='color:red;'>库存:</span>"+ result[i].qty +'<a class="change btn_1" style="background-color:#1E9FFF;" onclick="Stock(\''+ result[i].outer_sku_id +'\')">入库</a>'+"</td>" +
										  "<td class=' dt-body-center'>" + result[i].addtime + '<br/><a class="change btn_1" onclick="log(\'sku_'+ result[i].on_id +'\')">日志</a>' + "</td>";
									}  
									tr += "</tr>";
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
			
			$('#dateTable').on('change', "input[name=checkLists]", function () {
				if($(this).is(':checked')){
					$("input[name=checkList]").attr('checked', true);
				}else{
					$("input[name=checkList]").attr('checked', false);
				}
			});
        });
	},
	methods: {
		//搜索
		backChange:function(){
			var self = this;
			var value = "";
			$(".shop").each(function(){
				$(this).css("backgroundColor","white");
			});
			if($(event.target)[0].nodeName == "DIV"){
				$(event.target).css("backgroundColor","#bedef3");
				shop_type = $(event.target).attr("shop_type");
				shop_id = $(event.target).attr("shop_id");
				shop_name = $(event.target).attr("shop_name");
			}else if($(event.target)[0].nodeName == "SPAN"){
				$(event.target).parent().css("backgroundColor","#bedef3");
				shop_type = $(event.target).parent().attr("shop_type");
				shop_id = $(event.target).parent().attr("shop_id");
				shop_name = $(event.target).parent().attr("shop_name");
			}
			
			flow.this_shop_info[0].shop_type = shop_type;
			flow.this_shop_info[0].shop_id = shop_id;
			flow.this_shop_info[0].shop_name = shop_name;
			jqtb.ajax.reload();
		},
		//==更新宝贝弹窗==
		setSkuReplace:function(){
			layer.confirm('确定要生成二级替换编码？选中商品后仅生成选中项，不选中则全店生成，生成规则为(主替换编码或线上主编码)+SKU属性，已有二级替换编码的不会生成', {
				btn: ['确认','取消'] //按钮
			}, function(){
				var checkList = $('input:checkbox[name=checkList]:checked');
				var resules = [];
				for(var i=0;i<checkList.length;i++){
					//console.log(checkList.eq(i).val());
					var values = checkList.eq(i).val();
					if(values.indexOf(",") > 0 ){
						strs = values.split(",");
						resules.push(strs);
					}else{
						resules.push(new Array(values));
					}
				}
				
				$.ajax({
					url: "/index.php?m=goods&c=association&a=setSkuReplace",									
					type: 'post',
					data: {data: resules, shopid: flow.this_shop_info[0].shop_id},
					dataType: 'json',
					success: function(result){
						if(result.code == 'ok'){
							layer.msg("生成成功");
							jqtb.ajax.reload("", false);
						}else{
							layer.msg(result.msg);
						}
						
					}
				});
			});	
		},
		//新增供应商弹窗
		AddSupp:function(){
			var self = this;
			layer.open({																																											
				type: 1,																																											
				title: '新增供应商',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['748px', '420px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#addSupplier"),	
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var cus_no = $("#add_no").val();
					var cus_name = $("#add_name").val();
					var mobile = $("#add_mobile").val();
					var linkman = $("#add_linkman").val();
					var wangwang = $("#add_wangwang").val();
					var qq = $("#add_qq").val();
					var weixin = $("#add_weixin").val();
					
					if(cus_name == ""){
						layer.msg('请输入供应商名称',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}
					
					if(mobile == ""){
						layer.msg('请输入供应商电话',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}
					
					$.ajax({
						url: "/index.php?m=system&c=stall_navigation&a=save_new",
						data: {cus_no:cus_no,cus_name:cus_name,linkman:linkman,qq:qq,wangwang:wangwang,weixin:weixin,mobile:mobile},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								layui.use(['table','element','layer','form','laydate'], function(){
								  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
								  var laydate = layui.laydate;
								  self.tab.reload();
								});
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
					$("#add_no").val("");
					$("#add_name").val("");
					$("#add_no").focus();
					$("#add_mobile").val("");
					$("#add_linkman").val("");
					$("#add_qq").val("");
					$("#add_weixin").val("");
					$("#add_wangwang").val("");
				}				
			});
		},
		 getCustTable:function(curr){
			var self = this;
			var custName = $("#custName").val();
			
			$.ajax({
				url:'/index.php?m=goods&c=association&a=getCustTable',
				dataType: 'json',
				type: "post",
				data:{
					custName:custName
				},
				success:function(data){
					if(data!= 0){
						self.supplierArr = data;
					}else{
						layer.msg("没有查询到数据",{

						});
						self.supplierArr = "";
					}
				}
			})
			
		},
		chooseThis:function(id){
			var self = this;
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=Setsupplier",										
				type: 'post',																		
				data: {id:id,on_id:self.on_id,sku_id:self.sku_id,num_iid:self.num_iid},																	
				dataType: 'json',
				async:false, 				
				success: function (data) {															
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						layer.close(self.nowIndex);
						jqtb.ajax.reload("", false);
					}else{
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
					}																			
				}																					
			});
		
		},
		setSkuReplaceSupply:function(){
			layer.confirm('确定要生成二级替换编码？此功能仅会将二级编码为空的商品生成二级替换编码，生成规则为(主替换编码或线上主编码)+SKU属性，已有二级替换编码的不会生成', {
				btn: ['确认','取消'] //按钮
			}, function(){
				$.ajax({
					url: "/index.php?m=goods&c=association&a=setSkuReplaceSupply",									
					type: 'post',
					data: {shopid: flow.this_shop_info[0].shop_id},
					dataType: 'json',
					success: function(result){
						if(result.code == 'ok'){
							layer.msg("生成成功");
							jqtb.ajax.reload("", false);
						}else{
							layer.msg(result.msg);
						}
						
					}
				});
			});	
		},
		log:function(elementId){
			var self = this;
			
			$.ajax({																																														
				url: "/index.php?m=goods&c=association&a=getLog",																																		
				type: 'post',																																												
				data: {elementId: elementId},																																													
				dataType: 'json',																																											
				success: function (data) {
					self.logArr = data;
				}																																															
			});
			
			layer.open({																																											
				type: 1,																																											
				title: '操作日志',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['1200px', '400px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#log")																																													
			});
		},
		Stock:function(elementId){
			var html = "<div id='choose_stock'>" +  					
						   "<button class='layui-btn layui-btn-normal' onclick=\"gethotLoc('"+elementId+"')\" style='margin-top:15%;margin-left:3%;'>爆款入库</button>" +
						   "<button class='layui-btn layui-btn-normal' onclick=\"getotherOut('"+elementId+"')\" style='margin-top:15%;'>普通入库</button>" +
						   "<button class='layui-btn layui-btn-normal' onclick=\"getpurchase('"+elementId+"')\" style='margin-top:15%;'>采购入库</button>" +
					  "</div>"

			layer.open({																																											
				type: 1,																																											
				title: '选择入库',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['310px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: html																																												
			});
		},
		Product:function(elementId){
			$.ajax({
				url: "/index.php?m=goods&c=association&a=product_goods",									
				type: 'post',
				data:{data: elementId},
				dataType: 'json',
				success: function(result){
					layer.msg(result.msg);
					jqtb.ajax.reload("", false);
				},
				error:function(a,b,c){
					setTimeout(function(){
						clearInterval(Interval);
					},1000);
								
					layer.close(index);
						layer.msg("下载异常");
					}
			});
			
		},
		updateGoods:function(){
			$("#htmlInfo").val('');
			
			layer.open({
				type: 1,
				title: '从店铺下载商品信息!',
				skin: 'layui-layer-rim', //加上边框
				area: ['660px', '500px'], //宽高
				shade: 0.3,
				content: $("#edit-pages1"),
				btn: ['仅更新', '更新并生成商品'],
				success: function() {
					$(".good_id").val("");
					$("#show_name").val(flow.this_shop_info[0].shop_name);
					
					$("input[name='day']").on('ifChecked ifUnchecked', function(event){
						if ($(this).val() == "today") {
							$("#dateBegin").val(flow.time_format.today.start_time);
							$("#dateEnd").val(flow.time_format.today.end_time);
						} else if($(this).val() == "thirth") {
							$("#dateBegin").val(flow.time_format.thirth.start_time);
							$("#dateEnd").val(flow.time_format.thirth.end_time);
						}
					});
					$("input[name='day']").eq(0).iCheck('check');
					$("input[name='day']").eq(1).iCheck('check');
				},
				yes: function(index, layero){
					//按钮【按钮一】的回调
					var Interval = setInterval(function(){
						$.ajax({																																														
							url: "/index.php?m=goods&c=association&a=getOrderProgress",																																		
							type: 'post',																																																																																								
							dataType: 'text',																																											
							success: function (text) {
								$("#htmlInfo").val(text);
							},error: function(){
								clearInterval(Interval);
							}
						});
					},1000);
					
					var data = $("#update_goods_form").serializeArray();
						data.push({name:'shop_type',value:flow.this_shop_info[0].shop_type});
						data.push({name:'shop_id',value:flow.this_shop_info[0].shop_id});
					var index = layer.load(0, {shade: false});
					$.ajax({
						url: "/index.php?m=goods&c=association&a=update_goods",									
						type: 'post',
						data: data,
						dataType: 'json',
						success: function(result){
							setTimeout(function(){
								clearInterval(Interval);
							},1000);
							
							layer.close(index);
							if(result.status == 1){
								//$("#update_goods_form").reset();
								jqtb.ajax.reload("", false);
								//searchAll();
								layer.msg(result.msg);
							}else{
								layer.msg(result.msg);
							}
						},
						error:function(a,b,c){
							setTimeout(function(){
								clearInterval(Interval);
							},1000);
							
							layer.close(index);
							layer.msg("下载异常");
						}
					});
				},btn2: function(index, layero){
					//按钮【按钮二】的回调
					var Interval = setInterval(function(){
						$.ajax({																																														
							url: "/index.php?m=goods&c=association&a=getOrderProgress",																																		
							type: 'post',																																																																																								
							dataType: 'text',																																											
							success: function (text) {
								$("#htmlInfo").val(text);
							},error: function(){
								clearInterval(Interval);
							}
						});
					},1000);
					
					var data = $("#update_goods_form").serializeArray();
						data.push({name:'shop_type',value:flow.this_shop_info[0].shop_type});
						data.push({name:'shop_id',value:flow.this_shop_info[0].shop_id});
						data.push({name:'create_goods',value:'T'});
					var index = layer.load(0, {shade: false});
					$.ajax({
						url: "/index.php?m=goods&c=association&a=update_goods",									
						type: 'post',
						data: data,
						dataType: 'json',
						success: function(result){
							setTimeout(function(){
								clearInterval(Interval);
							},1000);
							
							layer.close(index);
							if(result.status == 1){
								//$("#update_goods_form").reset();
								jqtb.ajax.reload("", false);
								layer.msg(result.msg);
							}else{
								layer.msg(result.msg);
							}
						},
						error:function(a,b,c){
							setTimeout(function(){
								clearInterval(Interval);
							},1000);
							
							layer.close(index);
							layer.msg("下载异常");
						}
					});
					return false; //开启该代码可禁止点击该按钮关闭
				},
				/*btn3: function(index, layero){
					//按钮【按钮二】的回调
					var data = $("#update_goods_form").serializeArray();
						data.push({name:'shop_type',value:flow.this_shop_info[0].shop_type});
						data.push({name:'shop_id',value:flow.this_shop_info[0].shop_id});
						data.push({name:'cannot_rela',value:'T'});
						data.push({name:'create_goods',value:'T'});
					var index = layer.load(0, {shade: false});
					$.ajax({
						url: "/index.php?m=goods&c=association&a=update_goods",									
						type: 'post',
						data: data,
						dataType: 'json',
						success: function(result){
							layer.close(index);
							if(result.status == 1){
								//$("#update_goods_form").reset();
								jqtb.ajax.reload();
								layer.msg(result.msg);
							}else{
								layer.msg(result.msg);
							}
						}
					});
					return false; //开启该代码可禁止点击该按钮关闭
				},*/
				cancel: function (index, layero) {
					
				}
			});
		},
		//==更新宝贝弹窗结束==
		
		//==批量解绑==
		deleteList:function(){
			layer.confirm('确定删除选中？', {
				btn: ['确认','取消'] //按钮
			}, function(){
				var checkList = $('input:checkbox[name=checkList]:checked');
				var resules = [];
				for(var i=0;i<checkList.length;i++){
					
					var values = checkList.eq(i).val();
		
					if(values.indexOf(",") > 0 ){
						strs = values.split(",");
						resules.push(strs);
					}else{
						resules.push(new Array(values));
					}
				}
	
				if(resules.length == 0){
					layer.msg("请选择删除数据");
					return false;
				}

				$.ajax({
					url: "/index.php?m=goods&c=association&a=deleteSkus",									
					type: 'post',
					data: {data: resules},
					dataType: 'json',
					success: function(result){
						//console.log(result);
						if(result.code == 'ok'){
							layer.msg(result.msg);
							jqtb.ajax.reload("", false);
						}else{
							layer.msg(result.msg);
						}
						
					}
				});
			});
		},
		deleteListAll:function(){
			layer.confirm('此操作会删除此店铺下载全店所有绑定数据，确定删除全店绑定关系？', {
				btn: ['确认','取消'] //按钮
			}, function(){
				var shopid = flow.this_shop_info[0].shop_id;

				$.ajax({
					url: "/index.php?m=goods&c=association&a=deleteSkusAll",									
					type: 'post',
					data: {shopid: shopid},
					dataType: 'json',
					success: function(result){
						//console.log(result);
						if(result.code == 'ok'){
							layer.msg(result.msg);
							jqtb.ajax.reload("", false);
						}else{
							layer.msg(result.msg);
						}
						
					}
				});
			});
		},
		//批量设置质检信息
		setInsList:function(){
			$("#setInsListForm")[0].reset();
			var self = this;
			layer.open({
				type: 1,
				title: '批量设置质检信息',
				skin: 'layui-layer-rim',
				area: ['550px', '350px'],
				shade: 0.3,
				content: $("#setInsListBox"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var checkList = $('input:checkbox[name=checkList]:checked');
					//console.log(checkList);
					var resules = [];
					for(var i=0;i<checkList.length;i++){
						
						var values = checkList.eq(i).val();
						if(values.indexOf(",") > 0 ){
							strs = values.split(",");
							resules.push(strs);
						}else{
							resules.push(new Array(values));
						}
					}
					//console.log(resules);
					if(resules.length == 0){
						layer.msg("请选择修改数据", {icon: 2});
						return false;
					}
					var allSetKey = $("#allSetKey").val();
					if(allSetKey == ""){
						layer.msg("请选择修改数据", {icon: 2});
						return false;
					}
					var allSetValue = $("#allSetValue").val();
					if(allSetValue == ""){
						layer.msg("请选择修改数据", {icon: 2});
						return false;
					}
					self.setAllInsInfor(resules,'isPage',allSetKey,allSetValue);
					layer.close(index);
				}
			});
		},
		//设置全部质检信息
		setInsListAll:function(){
			$("#setInsListForm")[0].reset();
			var self = this;
			layer.open({
				type: 1,
				title: '设置全部质检信息',
				skin: 'layui-layer-rim',
				area: ['550px', '350px'],
				shade: 0.3,
				content: $("#setInsListBox"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var shopid = flow.this_shop_info[0].shop_id;
					var allSetKey = $("#allSetKey").val();
					if(allSetKey == ""){
						layer.msg("请选择修改数据", {icon: 2});
						return false;
					}
					var allSetValue = $("#allSetValue").val();
					if(allSetValue == ""){
						layer.msg("请选择修改数据", {icon: 2});
						return false;
					}
					self.setAllInsInfor(shopid,'isAll',allSetKey,allSetValue);
					layer.close(index);
				}
			});
		},
		//批量设置代拿商品
		setBatchDaiNa:function(dataType){
			var self = this;		
			//确认提示
			var oHtml = "";
			if(dataType == "true"){
				oHtml = '您确认将选择商品设为代拿？';
			}else{
				oHtml = '您确认将选择商品取消代拿？';
			}
			
			layer.confirm(oHtml, {
				btn: ['确认','取消'] //按钮
			}, function(index, layero){
			var checkList = $('input:checkbox[name=checkList]:checked');
				var resules = [];
				for(var i=0;i<checkList.length;i++){
					var values = checkList.eq(i).val();
					if(values.indexOf(",") > 0 ){
						strs = values.split(",");
						resules.push(strs);
					}else{
						resules.push(new Array(values));
					}
				}
	
				if(resules.length == 0){
					layer.msg("请选择删除数据");
					return false;
				}
				resules = resules.join(",");
				$.ajax({
					url: "/index.php?m=goods&c=association&a=updateAgent",
					type: 'post',
					data: {num_iid:resules, assist_prd:dataType, isAll:self.isAll},
					dataType: 'json',
					success: function (result) {
						if(result.code == 'ok'){
							layer.msg("修改成功",{
								icon: 1,
								time: 2000
							});
							jqtb.ajax.reload("", false);
						}else{
							layer.msg("修改失败",{
								icon: 2,
								time: 2000
							});
						}
					}	
				});
				layer.close(index);
			}, function(){});
		},
		setAllInsInfor:function(data,type,key,value){
			//this_shop_info: [{shop_type:'',shop_id:'',shop_name:''}],
			var shop_info = flow.this_shop_info;
			$.ajax({
				url: "/index.php?m=goods&c=association&a=setAllInsInfor",									
				type: 'post',
				data: {
					data:data,
					type:type,
					key:key,
					value:value,
					shop_info:shop_info,
				},
				dataType: 'json',
				success: function(result){
					if(result['code'] == 'ok'){
						jqtb.ajax.reload("", false);
					}
					layer.msg(result['msg']);
				}
			});
		},
		toExcel:function(){
			var self = this;
			var checkList = $('input:checkbox[name=checkList]:checked');
			var resules = [];
			for(var i=0;i<checkList.length;i++){
				
				var values = checkList.eq(i).val();
				if(values.indexOf(",") > 0 ){
					strs = values.split(",");
					resules.push(strs);
				}else{
					resules.push(new Array(values));
				}
			}
			if(resules.length == 0){
				layer.msg("请选择导出数据");
				return false;
			}
			self.toExcelFunction(resules,'isPage');
			
		},
		toExcelAll:function(){
			var self = this;
			var shopid = flow.this_shop_info[0].shop_id;
			self.toExcelFunction(shopid,'isAll');
		},
		toExcelFunction:function(data,type){
			var time = new Date().getTime();
			$.ajax({
				url: "/index.php?m=goods&c=association&a=toExcelFunction&loginact=file",									
				type: 'post',
				data: {
					data:data,
					type:type,
					time:time,
				},
				dataType: 'text',
				success: function(result){
					//console.log(result);
					if(result){
						layer.msg('导出失败',{
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
		checkLists:function(){
			layer.confirm('确定解绑选中商品？', {
				btn: ['确认','取消'] //按钮
			}, function(){
				var checkList = $('input:checkbox[name=checkList]:checked');
				var resules = [];
				for(var i=0;i<checkList.length;i++){
					//console.log(checkList.eq(i).val());
					var values = checkList.eq(i).val();
					if(values.indexOf(",") > 0 ){
						strs = values.split(",");
						resules.push(strs);
					}else{
						resules.push(new Array(values));
					}
				}
				if(resules.length == 0){
					layer.msg("请选择解绑物品");
					return false;
				}
				$.ajax({
					url: "/index.php?m=goods&c=association&a=relieveSkus",									
					type: 'post',
					data: {data: resules},
					dataType: 'json',
					success: function(result){
						//console.log(result);
						if(result.code == 'ok'){
							layer.msg(result.msg);
							jqtb.ajax.reload("", false);
						}else{
							layer.msg(result.msg);
						}
						
					}
				});
			});
		},
		checkListsAll:function(){
			layer.confirm('确定解绑全店商品？', {
				btn: ['确认','取消'] //按钮
			}, function(){
				var shop_id = flow.this_shop_info[0].shop_id;
				
				$.ajax({
					url: "/index.php?m=goods&c=association&a=relieveSkusAll",									
					type: 'post',
					data: {shop_id: shop_id},
					dataType: 'json',
					success: function(result){
						if(result.code == 'ok'){
							layer.msg(result.msg);
							jqtb.ajax.reload("", false);
						}else{
							layer.msg(result.msg);
						}
						
					}
				});
			});
		},
		saveGrid:function(){
			var requestData = [];
			$("input[name='replace_prd_no']").each(function(){
				var on_id = $(this)[0]['id'].slice(4);
				requestData.push({id: $(this)[0]['id'], 
								  val: $(this).val(), 
								  goods_no: $("#goods_no_" + on_id).val(),
								  brand: $("#brand_" + on_id).val(),
								  material: $("#material_" + on_id).val(),
								  material_in: $("#material_in_" + on_id).val(),
								  standard: $("#standard_" + on_id).val(),
								  security: $("#security_" + on_id).val(),
								  cid_name: $("#cid_name_" + on_id).val(),
								  retailPrice: $("#retailPrice_" + on_id).val(),
								  zj_sku_name: $("#zj_sku_name_" + on_id).val(),
								});
			});
			
			execAjax({
                m:'goods',
                c:'association',
                a:'saveReplacePrd',
                data:{data: requestData},
                success:function(data){
					if(data){
						layer.msg("保存成功");
						//jqtb.ajax.reload();
					}
                }
            });
		},
		//==更改信息弹窗==
		change:function(elementId){
			var self = this;
			self.elementId = elementId;
			//self.goods_info = [];
			
			layer.open({
                title :'选择商品',
                type: 2,
                shade: false,
                area: ['700px', '560px'],
                maxmin: false,
                content: '?m=widget&c=selectLocalProduct&a=index&type=1&param=PRD2'
            }); 
			
			/*execAjax({
                m:'goods',
                c:'association',
                a:'getgoodsInfo',
                data:{prd_id: prd_id},
                success:function(data){
					if(data){
						self.goods_info = data.skuInfo;
						self.prd_id = data.prdInfo.prd_id;
						self.prd_no = data.prdInfo.prd_no;
						self.title = data.prdInfo.title;
						self.unit = data.prdInfo.unit;
					}
                }
            });
			
			layer.open({
				type: 1,
				title: '修改系统商品',
				skin: 'layui-layer-rim', //加上边框																		
				area: ['800px', '660px'], //宽高																		
				shade: 0.3,
				content: $("#edit-pages2"),
				btn: ['保存', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var data = [];
					var prd_id = self.prd_id;
					var prd_no = $("#prd_no").val();
					var title = $("#title").val();
					var unit = $("#unit").val();
					var newJson = {
						"prd_id":prd_id,
						"prd_no":prd_no,
						"title":title,
						"unit":unit
					};
					data.push(newJson);
					var newData = [];
					$(".change_body tr").each(function(){
						var new_json = {
							"prd_sku_id":$(this).find(".prd_sku_id").val(),
							"prd_sku_no":$(this).find(".prd_sku_no").val(),
							"sku_name1":$(this).find(".sku_name1").val(),
							"sku_name2":$(this).find(".sku_name2").val(),
							"barcode":$(this).find(".bar_code").val()
						};
						newData.push(new_json);
					});
					data.push(newData);
					
					$.ajax({
						url: "/index.php?m=goods&c=association&a=change",									
						type: 'post',
						data: {data:data},
						dataType: 'json',
						success: function(result){
							
							if(result.code == "ok"){
								jqtb.ajax.reload();
								layer.close(index);
								layer.msg(result.msg);
							}else{
								layer.msg(result.msg);
							}
						}
					});
					
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					//return false;
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function (index, layero) {
				
				}
			});*/
		},
		//==更改信息弹窗
		
		//=====================================================解除绑定=========================================================================
		relieve:function(num_iid){
			var self = this;
	
			$.ajax({
				url: "/index.php?m=goods&c=association&a=relieve",									
				type: 'post',
				data: {num_iid: num_iid},
				dataType: 'json',
				success: function(result){
					jqtb.ajax.reload("", false);
				}
			});
		},
		relieveSku:function(num_iid,sku_id){
			var self = this;
	
			$.ajax({
				url: "/index.php?m=goods&c=association&a=relieveSku",									
				type: 'post',
				data: {num_iid: num_iid, sku_id: sku_id},
				dataType: 'json',
				success: function(result){
					jqtb.ajax.reload("", false);
				}
			});
		},
		//===================================================解除绑定结束=======================================================================
		
		//=====================================================换款开始=========================================================================
		good_change:function(num_iid,sku_id){
			var self = this;
			self.good_change_num_iid = num_iid;
			self.good_change_sku_id = sku_id;
			layer.open({
				title :'选择商品',
				type: 2,
				shade: false,
				area: ['700px', '560px'],
				maxmin: false,
				content: '?m=widget&c=selectProduct&a=index&type=1'
				
			});
		},
		//=====================================================换款结束=========================================================================
	}
});

$(".stop").click(function(){
	event.stopPropagation();
});

$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});

$(".shop-list").eq(0).click();

function change(prd_id){
	flow.change(prd_id);
}

function log(prd_id){
	flow.log(prd_id);
}

function Stock(id){
	flow.Stock(id);
}
function Product(id){
	flow.Product(id);
}
function getCustSearch(){
	flow.getCustTable("","",1);
}
function Add_supp(prd_id){
	flow.AddSupp(prd_id);
}
function good_change(num_iid,sku_id){
	flow.good_change(num_iid,sku_id);
}
function gethotLoc(elementId){
	console.log(elementId);
	layer.open({
		title :'爆款入库',
		type: 2,
		shade: 0.3,
		area: ['1300px', '750px'],
		maxmin: false,
		content: '?m=goods&c=hotLoc&a=index',
		success: function(layero, index){
                var body = layer.getChildFrame('body', index);
				var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
				body.find('#goodsNum').val(elementId);
              }
				
	});
}
function updateAssistPrd(num_iid, data)
{
	$.ajax({
		url: "/index.php?m=goods&c=association&a=updateAgent",
		type: 'post',
		data: {num_iid:num_iid, assist_prd:data},
		dataType: 'json',
		success: function (result) {
			if(result.code == 'ok'){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
			}else{
				layer.msg(result.msg,{
					icon: 2,
					time: 2000
				});
			}
		}	
	});
}
function getotherOut(elementId){
	
	layer.open({
		title :'普通入库',
		type: 2,
		shade: false,
		area: ['1300px', '750px'],
		maxmin: false,
		content: '?m=goods&c=otherOut&a=index',
		success: function(layero, index){
                var body = layer.getChildFrame('body', index);
				var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
				body.find('#goodsNum').val(elementId);
              }
				
	});
}
function getpurchase(elementId){
	
	layer.open({
		title :'采购入库',
		type: 2,
		shade: false,
		area: ['1300px', '750px'],
		maxmin: false,
		content: '?m=goods&c=otherOut&a=index&act=purchase',
		success: function(layero, index){
                var body = layer.getChildFrame('body', index);
				var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
				body.find('#goodsNum').val(elementId);
              }
				
	});
}
function relieve(num_iid){
	layer.confirm('确定解除该商品和线上宝贝的关系？', function(index){
		flow.relieve(num_iid);
		layer.close(index);
	}); 
}

function relieveSku(num_iid,sku_id){
	layer.confirm('确定解除该属性和线上属性的关系？', function(index){
		flow.relieveSku(num_iid,sku_id);
		layer.close(index);
	}); 
}


function focusNow(){
	$(event.target).css("border","1px solid #1e9fff");
}

function blurNow(){
	$(event.target).css("border","1px solid white");
}
//$("#searchAll").click();

/*function cbProductRows(data){
	//console.log(data);
	$.ajax({
		url: "/index.php?m=goods&c=association&a=good_change",									
		type: 'post',
		data: {data:data,num_iid:flow.good_change_num_iid,sku_id:flow.good_change_sku_id},
		dataType: 'json',
		success: function(result){
			
		}
	});
}*/

function cbProductRows(data,type){
	if(type == "PRD2"){
		var elementId = flow.elementId;
		$("#"+elementId).val(data[0]['prd_no']);
	}
}

function outerUpload(shoptype,elementId){
	var online_type = "";
	if(elementId.substring(0,8) == "outer_id"){
		var online_id = elementId.substring(9,elementId.length);
		var online_type = "outer_id";
	}else if(elementId.substring(0,12) == "outer_sku_id"){
		var online_id = elementId.substring(13,elementId.length);
		var online_type = "outer_sku_id";
	}
	
	var outer_id = $("#" + elementId).val();

	$.ajax({
		url: "/index.php?m=goods&c=association&a=uploadOuterId",									
		type: 'post',
		data: {online_type: online_type, online_id: online_id, outer_id: outer_id},
		dataType: 'json',
		success: function(data){
			if(data.code == "ok"){
				layer.msg('修改成功',{
					icon: 1,
					time: 2000
				});
			}else if(data.code == "error"){
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}else if(data.code == "none"){
				layer.msg("编码没有变更，修改失败",{
					icon: 2,
					time: 2000
				});
			}
		}
	});
	
}

//选择供应商
function supplier(on_id,type,index,sku_id,num_iid){
	flow.on_id = on_id;
	flow.sku_id = sku_id;
	flow.num_iid = num_iid;
	layer.open({			
		type: 1,			
		title: '选择供应商',
		skin: 'layui-layer-rim', 
		area: ['1000px', '650px'], 
		shade: 0.3,	
		content: $("#custSetChoose"),
		btn: ['关闭']
		,yes: function(index, layero){
			//按钮【按钮一】的回调
			layer.close(index);
		},
		cancel: function (index, layero) {
			
		},
		success: function(layero, index){
			flow.nowIndex = index;
		}		
	});
	flow.getCustTable("","",1);
}

//设置套装
function setBom(on_id,type,sku_id,num_iid){
	flow.on_id = on_id;
	flow.sku_id = sku_id;
	flow.num_iid = num_iid;
	layer.open({			
		type: 1,			
		title: '设置套装',
		skin: 'layui-layer-rim', 
		area: ['1000px', '650px'], 
		shade: 0.3,	
		content: $("#custSetChoose"),
		btn: ['关闭']
		,yes: function(index, layero){
			//按钮【按钮一】的回调
			layer.close(index);
		},
		cancel: function (index, layero) {
			
		},
		success: function(layero, index){
			flow.nowIndex = index;
		}		
	});
	flow.getCustTable("","",1);
}

//清空供应商单元格
function clear_this(on_id){
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=clear_supplier",	
		type: 'post',																		
		data: {on_id:on_id},																				
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
				layer.close(self.nowIndex);
				jqtb.ajax.reload("", false);
			}else if(data.code == "error"){
				layer.msg("修改失败",{
					icon: 1,
					time: 2000
				});
			}
		}																					
	});
}

//清空子单元格
function clear_child(on_id,sku_id){
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=clear_supplier_child",	
		type: 'post',																		
		data: {on_id:on_id,sku_id:sku_id},																				
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
				layer.close(self.nowIndex);
				jqtb.ajax.reload("", false);
			}else if(data.code == "error"){
				layer.msg("修改失败",{
					icon: 1,
					time: 2000
				});
			}
		}																					
	});

}

function outerUploadAll(){
	layer.confirm('确定将商品的二级替换编码一键同步更新到淘宝平台对应商品的空二级编码中？', function(index){
		var shopid = flow.this_shop_info[0].shop_id;
		var index2 = layer.load();
		$.ajax({
			url: "/index.php?m=goods&c=association&a=outerUploadAll",									
			type: 'post',
			data: {shopid: shopid},
			dataType: 'json',
			success: function(result){
				layer.close(index2);
				//console.log(result);
				if(result.code == 'ok'){
					layer.msg(result.msg);
					jqtb.ajax.reload("", false);
				}else{
					layer.msg(result.msg);
				}
				
			}
		});
		
		layer.close(index);
	});
}