if(WMS_MODEL == "T" || WMS_MODEL == "PT"){
	var colVisible = true;
}else{
	var colVisible = false;
}
var $,layer;
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
		supplierArr:"",			//供应商
        locArr:"",			//货位数据数组
		prd_id:"",				//记录当前点击的是哪个商品
		pageNo:"",				//档口弹窗内页数
		pageCount:"",   		//档口弹窗内总页数
		CustCount:"",			//供销商页数
		CustNo:"",				//供销商总页数
		booth:"",				//档口弹窗内档口查询条件
		shopname:"",			//档口弹窗内店铺名称查询条件
		phone:"",				//档口弹窗内电话号码查询条件
		suitArr:[],				//档口弹窗数据
		cusArr:[],				//供应商数据
		distArr:[],
		nowIndex:"",			//档口弹窗index值
		type:"",				//判断套装编码弹窗内选择档口点击还是最外层界面点击
		stallIndex:"",  		//记录套装编码内选择档口按钮或修改按钮点击时为 suitArr 内的第几条数据
		doWhat:"",				//判断套装编码内 选择档口按钮点击还是修改按钮点击
		changeIndex:"", 		//修改按钮点击对应 suitArr 内的第几条数据
		suit_prd_id:"", 		//记录点击套装编码时对应数据的prd_id
		isGood:"",				//判断是否为 表身商品点击套装编码
		suit_prd_sku_id:"", 	//要存入数据库的主商品 prd_sku_id
		choose_prd_sku_id:"",   //单个商品套装编码 选择档口 传入的 prd_sku_id
		choose_sku_id:"",   //单个商品套装编码 选择档口 传入的 prd_sku_id
		change_arr:[],
		timely_prd_id:"",		//点击谭庄定义按钮时记录此时传的prd_id，以便删除套装时刷新使用
		class_name:"",          //编辑分类时取的值
        locName:"",             //货位名称查询
        pageLocNo:"",				//货位弹窗内页数
		pageLocCount:"",   		//货位弹窗内总页数
		DistPrdNo:"",             //分销商商品编码
		DistPrdTitle:"",             //分销商商品标题
		pageDistNo:"",				//货位弹窗内页数
		pageDistCount:"",   		//货位弹窗内总页数
		result:[],
		logArr:[],
		title:"",
		sku_name:"",
		prd_no:"",
		prd_no_sku:"",
		shopid:"",
		stock_type:"",
		upload_stock:"",
		assist_prd:"",
		dateBegin:"",
		dateEnd:"",
		unSetSupplier:"",
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
		self.cusArr = fx_cus_list;
		//---------------------------------------------------------------------------
		
		//layui 模块 入口
        layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
            $ = layui.jquery, element = layui.element, layer = layui.layer;
            var form = layui.form(), layer = layui.layer, layedit = layui.layedit, laydate = layui.laydate;
            // 初始化表格
            jqtb = $('#dateTable').DataTable({  //dateTable 模块 入口
                "`dom": '<"top">rt<"bottom"flp><"clear">',
                "autoWidth": false,                     // 自适应宽度
                "paging": true,
                "lengthMenu": [50],
                "pagingType": "full_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
                "processing": true,
                "searching": false, //是否开启搜索
                "serverSide": true,//开启服务器获取数据
                "order": [[8, "desc"]], //默认排序
                "fnServerParams": function (aoData) {
                    aoData.push(
                        {"name": "title", "value": $(".goodName").val()},
                        {"name": "sku_name", "value": $(".sku_name").val()},
						{"name": "prd_no", "value": $(".prd_no").val()},
						{"name": "prd_no_sku", "value": $(".prd_no_sku").val()},
						{"name": "shopid", "value": $("#shopid").val()},
						{"name": "category_id", "value": self.id},
						{"name": "stock_type", "value": $("#stock_type").val()},
						{"name": "upload_stock", "value": $("#upload_stock").val()},
						{"name": "assist_prd", "value": $("#assist_prd").val()},
						{"name": "dateBegin", "value": $("#dateBegin").val()},
						{"name": "dateEnd", "value": $("#dateEnd").val()},
						{"name": "unSetSupplier", "value": $("#unSetSupplier").val()}
                    );
					self.title = $(".goodName").val();
					self.sku_name = $(".sku_name").val();
					self.prd_no = $(".prd_no").val();
					self.prd_no_sku = $(".prd_no_sku").val();
					self.shopid = $(".shopid").val();
					self.stock_type = $(".stock_type").val();
					self.upload_stock = $(".upload_stock").val();
					self.assist_prd = $(".assist_prd").val();
					self.dateBegin = $(".dateBegin").val();
					self.dateEnd = $(".dateEnd").val();
					self.unSetSupplier = $(".unSetSupplier").val();
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
							self.result = resp.data;
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
                    //{'title': "操作", 'data': "st","defaultContent": "","render":function(){
						//return "<a>修改</a> <a>复制</a>";
					//}},//隐藏
                    {'title': "<i class='layui-icon' style='font-size: 14px; color: black;'>&#xe654;</i>", 'data': "num",'width':"22px","defaultContent": "","render":function(data,type,row,meta){
						if(data > 0){
							return "<i class='layui-icon dere' style='font-size: 14px; color: black;cursor:pointer;'>&#xe602;</i>";
						}
						
					}},
					{'title': "图片", 'data': "pic_path","defaultContent": "","render":function(data){
						if(data != ""){
							return "<div class='isShow' style='width:90px;height:90px;text-align:center;line-height:65px;position:relative;'><img class='img_pic_url' src=" + data + " style='width:80px;height:80px;'></div>";
						}else{
							return "<div class='isShow' style='width:90px;height:90px;text-align:center;line-height:65px;position:relative;'><img class='img_pic_url' src='images/noimg.png' style='width:80px;height:80px;'></div>";
						}
						
					},"width":"65px"},
                    //{'title': "关联店铺", 'data': "","defaultContent": ""},
					{'title': "库存类型", 'data': "stock_type","defaultContent": "","width":150},
					{'title': "同步类型", 'data': "upload_stock","defaultContent": "","width":200},
					{'title': "商品名称/销售属性", 'data': "title","defaultContent": "","width":500},
					{'title': "简称", 'data': "sort_name","defaultContent": "","width":200,"render":function(data,type,row,meta){
						return "<input style='width:100%' type='text' name='sortname' value='"+data+"' style='border:1px solid white;outline:none;' onblur='blurSort(\""+row.prd_id+"\")' onfocus='focusNow()'>";
					}},
					{'title': "条码", 'data': "barcode","defaultContent": "","width":200,"render":function(data,type,row,meta){
						return "<input style='width:100%' type='number' value="+data+" style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_sku(\""+row.prd_id+"\")'>";
					}},
					{'title': "商品编号", 'data': "prd_no","defaultContent": "","width":100},
					/*{'title': "款号", 'data': "style_no","defaultContent": ""},
					{'title': "档口价", 'data': "booth_price","defaultContent": "","width":100},*/
					{'title': "配货供应商", 'data': "cus_name","defaultContent": "","width":100,"render":function(data,type,row,meta){
						if(data != "" && data!=null){
							
							return "<div><button style='font-size: 12px' class='layui-btn layui-btn-primary' value='"+data+"' onclick='supplier(\""+row.prd_id+"\",\"stall\",\"\",\"\",\"\")'>" + data +"</button></div><i class='aui_close' onclick='clear_this(\""+row.prd_id+"\")'>ဆ</i>";
						}else{
							return "<div><button style='font-size: 12px' class='layui-btn layui-btn-small layui-btn-danger' value='' onclick='supplier(\""+row.prd_id+"\",\"stall\",\"\",\"\",\"\")'>选择供应商</button></div>";
						}
					}},
					{'title': "代拿", 'data': "assist_prd","defaultContent": "",'sClass':'center',"width":100,"render":function(data,type,row,meta){
						return "<input type='checkbox' "+(data == 1 ? 'checked' : '')+" onclick='updateAssistPrd(\""+row.prd_id+"\",this.checked)'>";
						//return "<input type='checkbox' "+(data == 1 ? 'checked' : '')+" onclick='updateAssistPrd(\""+row.prd_id+"\",this.checked)' "+(row.cus_no == '' ? 'disabled' : '')+" >";
					}},
					{'title': "代发商品", 'data': "dist_system_id","defaultContent": "",'sClass':'center',"width":100,"render":function(data,type,row,meta){
						if(row.num == 0){
							if(data != ""){	
								return "<div><button style='font-size: 12px' class='layui-btn layui-btn-primary' value='"+data+"' onclick='deleteDistCus(\""+row.prd_id+"\",\"\",\"\")'>" + row.dist_prd_no +"</button></div>";
							}else{
								return "<div><button style='font-size: 12px' class='layui-btn layui-btn-small layui-btn-danger' value='' onclick='setDistCus(\""+row.prd_id+"\",\"\",\"\")'>选择代发商品</button></div>";
							}	
						}
					}},
                    {'title': "货位", 'data': "prd_loc","defaultContent": "","width":50,"render":function(data,type,row,meta){
						
						if(data != ""){
							
							return "<div><button style='font-size: 12px' class='layui-btn layui-btn-primary' value='"+data+"' onclick='chooseLoc(\""+row.prd_id+"\",\"loc\",\"\",\"\")'>" + row.prd_loc_name +"</button></div><i class='aui_close' onclick='clear_prd_loc(\""+row.prd_id+"\")'>ဆ</i>";
						}else{
							return "<div><button style='font-size: 12px' class='layui-btn layui-btn-small layui-btn-danger' value='' onclick='chooseLoc(\""+row.prd_id+"\",\"loc\",\"\",\"\")'>选择货位</button></div>";
						}
					}},
					{'title': "拿货价", 'data': "cost_price","defaultContent": "","width":200,"render":function(data,type,row,meta){
						return "<input type='number' value="+data+" style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_save(\"order\",\""+row.prd_id+"\")'>";
					}},
					{'title': "找款", 'data': "","defaultContent": "","width":150,"render":function(data,type,row,meta){
						return "<a style='cursor:pointer;font-size:12px;' onclick='look(\""+row.cus_no+"\")'>找款</a>";
						//return "<div><button class='layui-btn layui-btn-primary' onclick='look(\""+row.cus_no+"\")'>找款</button></div>";
					}},
					{'title': "关联店铺", 'data': "relaShop","defaultContent": "","width":400},
					{'title': "套装定义", 'data': "br","defaultContent": "","width":250,"render":function(data,type,row,meta){
						if(row.num > 0 ){
							return "";
						}else{
							if(row.bom_num > 0){
								
								return "<div class='color_a'><a style='cursor:pointer;font-size:12px;' onclick='suit(\""+row.prd_id+"\",\"yes\",\"suit\",\"yes\")'>套装编码</a><span style='color:white;font-size:12px;display:inline;padding:3px;background-color:green;margin-left:3px;border-radius:3px;'>套</span></div>";
							}else{
								return "<div class='color_a'><a style='cursor:pointer;font-size:12px;' onclick='suit(\""+row.prd_id+"\",\"yes\",\"suit\",\"yes\")'>套装编码</a></div>";
							}
							
						}
						
						//return "<div><button class='layui-btn layui-btn-primary' onclick=suit(\""+row.prd_id+"\",\"yes\",\"suit\")><i class='layui-icon' style='font-size: 12px; color: black;'>&#xe630;</i>套装编码</button></div>";
					}},
					{'title': "实际库存", 'data': "qty_now","defaultContent": "","width":180},
					{'title': "增减量", 'data': "","defaultContent": "","width":180},
					{'title': "新增时间", 'data': "addtime","defaultContent": "","width":200},
					//{'title': "可用库存", 'data': "qty","defaultContent": "","width":180},
					{'title': "操作", 'data': "prd_id","defaultContent": "","width":220,"render":function(data,type,row,meta){
						return "<a style='cursor:pointer;font-size:12px;' onclick='new_add(\""+row.prd_id+"\")'>修改</a>&nbsp;&nbsp;<a style='cursor:pointer;font-size:12px;' onclick='operationLog(\""+row.prd_id+"\")'>操作日志</a>";
						//return "<div><button class='layui-btn layui-btn-primary' onclick=new_add(\""+row.prd_id+"\")><i class='layui-icon' style='font-size: 12px; color: black;'>&#xe642;</i>修改</button></div>";
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
                    'className': 'dt-body-center',
					'visible': colVisible
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
                    'className': 'dt-body-center',
                },{
                    'targets': 11,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center',
					'visible': false
                },{
                    'targets': 12,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center',
					'visible': (fx_cus_list ? true : false)
                },{
                    'targets': 13,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center'
                },{
                    'targets': 15,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center',
                },{
                    'targets': 16,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center'
                },{
                    'targets': 17,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center',
                },{
                    'targets': 18,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center',
					'visible': colVisible
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
				var self = this;
				$("#currentAll").css("color","white"); 
				self.allPage = false;
				$("input[name='order']").iCheck('uncheck');	
				self.isAll = false;
                jqtb.ajax.reload();
            });
			
			///增加点击添加行
            $('#dateTable').on('click', '.dere', function () {
				var that = $(this);
				var dere = $(event.target).parent().parent();
                var data = jqtb.row( dere ).data();
				var upload_stock = data.upload_stock_value;
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
										tr += "<td class=' dt-body-center'><div style='width:90px;height:90px;text-align:center;line-height:65px;'><img src=" + result[i].pic_path + " style='width:80px;height:80px;'></div></td>";
									}else{
										tr += "<td class=' dt-body-center'><div style='width:90px;height:90px;text-align:center;line-height:65px;'></div></td>";
									}
									
									if(!colVisible){
										tr += "<td class=' dt-body-center'></td><td class=' dt-body-center'>" + result[i].sku_name1 + "," + result[i].sku_name2 +"</td><td class=' dt-body-center'><input type='text' value='" + result[i].sort_name_sku +"' style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_savesort(\"sku\",\""+result[i]['prd_sku_id']+"\")'></td><td class=' dt-body-center'><input type='text' value='" + result[i].barcode +"' style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_barcode(\"sku\",\""+result[i]['prd_sku_id']+"\")'></td><td class=' dt-body-center'>" + result[i].prd_sku_no +"</td>";
									}else{
										if(result[i].upload_stock_value == '0'){
											tr += "<td class=' dt-body-center'><div></div></td><td class=' dt-body-left'>" + result[i].upload_stock + "</br><a style='cursor:pointer;font-size:12px;' onclick='uploadStockChange(\""+result[i].prd_id+"\",\""+result[i].prd_sku_id+"\",\""+result[i].id+"\",\"no\")'><u>设为不同步库存</u><a>" +"</td><td class=' dt-body-center'>" + result[i].sku_name1 + "," + result[i].sku_name2 +"</td><td class=' dt-body-center'><input type='text' value='" + result[i].sort_name_sku +"' style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_savesort(\"sku\",\""+result[i]['prd_sku_id']+"\")'></td><td class=' dt-body-center'><input type='text' value='" + result[i].barcode +"' style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_barcode(\"sku\",\""+result[i]['prd_sku_id']+"\")'></td><td class=' dt-body-center'>" + result[i].prd_sku_no +"</td>";	
										}else if(result[i].upload_stock_value == '1'){
											tr += "<td class=' dt-body-center'><div></div></td><td class=' dt-body-left'>" + result[i].upload_stock + "</br><a style='cursor:pointer;font-size:12px;' onclick='uploadStockChange(\""+result[i].prd_id+"\",\""+result[i].prd_sku_id+"\",\""+result[i].id+"\",\"yes\")'><u>设为同步库存</u><a>" +"</td><td class=' dt-body-center'>" + result[i].sku_name1 + "," + result[i].sku_name2 +"</td><td class=' dt-body-center'><input type='text' value='" + result[i].sort_name_sku +"' style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_savesort(\"sku\",\""+result[i]['prd_sku_id']+"\")'></td><td class=' dt-body-center'><input type='text' value='" + result[i].barcode +"' style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_barcode(\"sku\",\""+result[i]['prd_sku_id']+"\")'></td><td class=' dt-body-center'>" + result[i].prd_sku_no +"</td>";
										}
									}
									
									if(result[i].cus_no != ""){
										tr += "<td class=' dt-body-center'><div><button style='font-size: 12px' class='layui-btn layui-btn-primary' value='"+result[i].cus_name+"' onclick='supplier(\""+result[i].prd_id+"\",\"stall\",\"\",\""+result[i].prd_sku_id+"\",\""+result[i].id+"\")'>" + result[i].cus_name +"</button></div><i class='aui_close' onclick='clear_child(\""+result[i].prd_id+"\",\""+result[i].prd_sku_id+"\")'>ဆ</i></td>";
										//return "<div><button style='font-size: 12px' class='layui-btn layui-btn-primary' value='"+data+"' onclick='chooseStall(\""+row.prd_id+"\",\"stall\",\"\",\"\")'>" + data +"</button></div>";
									}else{
										tr += "<td class=' dt-body-center'><div><button style='font-size: 12px' class='layui-btn layui-btn-small layui-btn-danger' value='' onclick='supplier(\""+result[i].prd_id+"\",\"stall\",\"\",\""+result[i].prd_sku_id+"\",\""+result[i].id+"\")'>选择供应商</button></div></td>";
										
										//return "<div><button style='font-size: 12px' class='layui-btn layui-btn-small layui-btn-danger' value='' onclick='chooseStall(\""+row.prd_id+"\",\"stall\",\"\",\"\")'>选择档口</button></div>";
									}
									
									if(daina_system_id)
									{
										tr += "<td class=' dt-body-center'></td>";	
									}
									if(fx_cus_list)
									{
										if(result[i].dist_system_id != ''){
											tr += "<td class=' dt-body-center'><div><button style='font-size: 12px' class='layui-btn layui-btn-primary' value='"+result[i].dist_system_id+"' onclick='deleteDistCus(\""+result[i].prd_id+"\",\""+result[i].prd_sku_id+"\",\""+result[i].id+"\")'>" + result[i].dist_prd_no +"</button></div></td>";		
										}else{
											tr += "<td class=' dt-body-center'><div><button style='font-size: 12px' class='layui-btn layui-btn-small layui-btn-danger' value='' onclick='setDistCus(\""+result[i].prd_id+"\",\""+result[i].prd_sku_id+"\",\""+result[i].id+"\")'>选择代发商品</button></div></td>";	
										}
									}
									 //"<td class=' dt-body-center'>" + result[i].cus_no + "</td>" +
									  //"<td class=' dt-body-center'>" + result[i].booth_price + "</td><td class=' dt-body-center'>" + result[i].cus_no + "</td>" +
									tr +=  "<td class=' dt-body-center'><div></div></td>"+
									  "<td class=' dt-body-center'><input type='number' value="+result[i].cost_price+" style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_save(\"sku\",\""+result[i].prd_sku_id+"\")'></td>" +
									  "<td class=' dt-body-center'><div></div></td>"+
									  "<td class=' dt-body-center'>" + result[i].relaShop + "</td>";
										  
									if(colVisible){
										tr += "<td class=' dt-body-center'>" + result[i].qty_now + "</td>";
									}
										  //"<td class=' dt-body-center'>" + result[i].qty + "</td>";
									/*if(result[i].num > 0){
										tr += "<td class=' dt-body-center'><div><a style='cursor:pointer;font-size:12px;' onclick=suit(\""+result[i].prd_sku_id+"\",\"yes\",\"good\",\"yes\")>套装编码</a><span style='color:white;font-size:12px;display:inline;padding:3px;background-color:green;margin-left:3px;border-radius:3px;'>套</span></div></td>";
									}else{
										tr += "<td class=' dt-body-center'><div><a style='cursor:pointer;font-size:12px;' onclick=suit(\""+result[i].prd_sku_id+"\",\"yes\",\"good\",\"yes\")>套装编码</a></div></td>";
									}*/
										tr += "<td class=' dt-body-center'><input type='number' value="+result[i].nimble_nums+" style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='nimble_save(\""+result[i].prd_sku_id+"\")'></td><td></td>";
									
										tr += "<td class=' dt-body-center'><div><a style='cursor:pointer;font-size:12px;' onclick=change_message(\""+result[i].prd_sku_id+"\",\""+result[i]['prd_id']+"_"+result[i]['id']+"\")>修改</a>";
										//if(upload_stock == '0'){
											tr += "&nbsp;&nbsp;<a style='cursor:pointer;font-size:12px;' onclick=skuStockUpload(\""+result[i].prd_sku_id+"\")>同步库存</a>";
											tr += "&nbsp;&nbsp;<a style='cursor:pointer;font-size:12px;' onclick=skuStockUploadSoldOut(\""+result[i].prd_sku_id+"\")>同步库存并档口下架</a>";
											tr += "&nbsp;&nbsp;<a style='cursor:pointer;font-size:12px;' onclick=operationLog(\""+result[i].prd_sku_id+"\")>操作日志</a>";
										//}
										tr += "</div></td></tr>";
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
			
			//查询当前拥有档口列表
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=getMarketList",										
				type: 'post',																		
				data: {},																	
				dataType: 'json',																	
				success: function (data) {															
					if(data){
						var oHtml = '<option value="">请选择市场</option>';
						for(var i=0;i<data.length;i++){
							oHtml += '<option value="'+data[i]['market']+'">'+data[i]['market']+'</option>';
						}
						$("#marketSelect").html(oHtml);
						form.render('select');
					}
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
			jqtb.ajax.reload("", false);
			
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
				area: ['700px', '200px'],  //宽高																																					
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
			$(".prd_no_sku").val("");
			$("#dateBegin").val("");
			$("#dateEnd").val("");
		},
		//=================================================================================== 重置方法结束 =================================================================================================
		
		//=============================================================================== 选择档口弹窗重置方法 =============================================================================================
		resetStall:function(){
			$("#booth").val("");
			var form = layui.form();
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=getMarketList",										
				type: 'post',																		
				data: {},																	
				dataType: 'json',																	
				success: function (data) {															
					if(data){
						var oHtml = '<option value="">请选择市场</option>';
						for(var i=0;i<data.length;i++){
							oHtml += '<option value="'+data[i]['market']+'">'+data[i]['market']+'</option>';
						}
						$("#marketSelect").html(oHtml);
						form.render('select');
					}
				}																					
			});
		},
		resetLoc:function(){
			$("#locName").val("");
		},
		//=================================================================================== 获取档口数据 =================================================================================================
		getStall:function(marketSelect,booth,curr){
			var self = this;
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=getStall",										
				type: 'post',																		
				data: {marketSelect:marketSelect,booth:booth,curr:curr},																	
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
		//================================================================================= 获取供应商 ===============================================================================================
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
						self.CustCount = 0;
						self.CustNo = 0;
					}
				}
			})
			
		},
		//================================================================================= 获取供应商结束 ===============================================================================================
        //=================================================================================== 获取货位数据 =================================================================================================
		getLoc:function(locName,curr){
			var self = this;
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=getLoc",										
				type: 'post',																		
				data: {locName:locName,curr:curr},																	
				dataType: 'json',																	
				success: function (data) {															
					if(data.result != 0){
						self.locArr = data.result;
						self.pageLocCount = Math.ceil(data.pageNum / 10);
						self.pageLocNo = curr;
					}else{
						layer.msg("没有查询到数据",{
							icon: 2,
							time: 2000
						});
						self.locArr = "";
						self.pageLocCount = 0;
						self.pageLocNo = 0;
					}																			
				}																					
			});	
		},
		getDist:function(curr){
			var self = this;
			var dist_system_id = $("#dist_system_id").val();
			var DistPrdNo = self.DistPrdNo;
			var DistPrdTitle = self.DistPrdTitle;
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=getDistPrd",										
				type: 'post',																		
				data: {DistPrdNo: DistPrdNo, DistPrdTitle: DistPrdTitle, dist_system_id: dist_system_id, curr: curr},																	
				dataType: 'json',																	
				success: function (data) {															
					if(data.result != 0){
						self.distArr = data.result;
						self.pageDistCount = Math.ceil(data.pageNum / 10);
						self.pageDistNo = curr;
					}else{
						layer.msg("没有查询到数据",{
							icon: 2,
							time: 2000
						});
						self.distArr = "";
						self.pageDistCount = 0;
						self.pageDistNo = 0;
					}																			
				}																					
			});	
		},
		//================================================================================= 获取货位数据结束 ===============================================================================================
		
        
		//==================================================================================档口弹窗分页开始================================================================================================
		page: function(pager){
			var self = this;			
			if(pager == "first"){
				self.pageNo = 1;
			}else if(pager == "prev"){
				if(self.pageNo == 1){
					return false;
				}
				self.pageNo = self.pageNo - 1;
			}else if(pager == "next"){
				if(self.pageNo == self.pageCount){
					return false;
				}
				self.pageNo = self.pageNo + 1;
			}else if(pager == "last"){
				self.pageNo = self.pageCount;
			}else if(pager == "sure"){
				var num = $(".page_num").val();
				if(num > self.pageCount){
					layer.msg("请输入正确页数",{
						icon: 1,
						time: 2000
					});
					return false;
				}
				self.pageNo = num*1;
			}
			self.getStall(self.marketSelect,self.booth,self.pageNo);
			
		},
		
		//=====================================================================================档口弹窗分页结束=============================================================================================
		pageLoc: function(pager){
			var self = this;			
			if(pager == "first"){
				self.pageLocNo = 1;
			}else if(pager == "prev"){
				if(self.pageLocNo == 1){
					return false;
				}
				self.pageLocNo = self.pageLocNo - 1;
			}else if(pager == "next"){
				if(self.pageLocNo == self.pageLocCount){
					return false;
				}
				self.pageLocNo = self.pageLocNo + 1;
			}else if(pager == "last"){
				self.pageLocNo = self.pageLocCount;
			}else if(pager == "sure"){
				var num = $(".page_loc_num").val();
				if(num > self.pageLocCount){
					layer.msg("请输入正确页数",{
						icon: 1,
						time: 2000
					});
					return false;
				}
				self.pageLocNo = num*1;
			}
			self.getLoc(self.locName,self.pageLocNo);
			
		},
		pageKeyDown:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				self.page('sure');
			}
		},
		pageLocKeyDown:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				self.pageLoc('sure');
			}
		},
		pageDistKeyDown:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				self.pageDist('sure');
			}
		},
		pageDist: function(pager){
			var self = this;			
			if(pager == "first"){
				self.pageDistNo = 1;
			}else if(pager == "prev"){
				if(self.pageDistNo == 1){
					return false;
				}
				self.pageDistNo = self.pageDistNo - 1;
			}else if(pager == "next"){
				if(self.pageDistNo == self.pageDistCount){
					return false;
				}
				self.pageDistNo = self.pageDistNo + 1;
			}else if(pager == "last"){
				self.pageDistNo = self.pageDistCount;
			}else if(pager == "sure"){
				var num = $(".page_dist_num").val();
				if(num > self.pageDistCount){
					layer.msg("请输入正确页数",{
						icon: 1,
						time: 2000
					});
					return false;
				}
				self.pageDistNo = num*1;
			}
			self.getDist(self.pageDistNo);
		},
		//===============================================================供应商弹窗查询==================
		choose:function(id,name){
			var self = this;
		$.ajax({																				
				url: "/index.php?m=goods&c=association&a=choose",										
				type: 'post',																		
				data: {id:id,prd_id:self.prd_id,name:name},																	
				dataType: 'json',
				async:false, 				
				success: function (data) {															
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						
					}else{
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
					}																			
				}																					
			});
			layer.close(self.nowIndex);
		},	
		
		//================================================================================= 档口弹窗查询按钮 ===============================================================================================
		stallSearch:function(){
			var self = this;
			var marketSelect = $("#marketSelect").val();
			var booth = $("#booth").val();
			self.marketSelect = marketSelect;
			self.booth = booth;
			self.getStall(marketSelect,booth,1);
		},
        locSearch:function(){
			var self = this;
			var locName = $("#locName").val();
			self.locName = locName;
			self.getLoc(locName,1);
		},
		distSearch:function(){
			var self = this;
			var DistPrdNo = $("#DistPrdNo").val();
			var DistPrdTitle = $("#DistPrdTitle").val();
			self.DistPrdNo = DistPrdNo;
			self.DistPrdTitle = DistPrdTitle;
			self.getDist(1);
		},
		resetDist:function(){
			$("#DistPrdNo").val("");
			$("#DistPrdTitle").val("");
		},
		//=============================================================================== 档口弹窗查询按钮结束 =============================================================================================
		
		//======================================================================== 选择档口弹窗内 选择该档口按钮事件 =======================================================================================
		//
		//		id     : 档口对应表内的id值
		//		market : 档口对应的市场
		//
		//==================================================================================================================================================================================================
		//				|
		//				|	
		//			 	|  
		//			  \	| /
		//			   \|/
		chooseThis:function(id,market){
			var self = this;
			var data = "";
			if(self.isAll){
				$("input[name='order']:checkbox").each(function(){
				if(true != $(this).is(':checked')){
					data += ($(this).val()+",");
				}
			});	
			}else{
				$("input[name='order']:checkbox").each(function(){
					if(true == $(this).is(':checked')){
						data += ($(this).val()+",");
					}
				});	
			}
			data = data.substr(0,data.length-1);	
			var category_id = self.id;
			var goodName = self.goodName;
			var sku_name = self.sku_name;
			var prd_no = self.prd_no;
			var stock_type = self.stock_type;
			var upload_stock = self.upload_stock;
			var assist_prd = self.assist_prd;
			var dateBegin = self.dateBegin;
			var dateEnd = self.dateEnd;			
			var iDisplayLength = 5000;
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=chooseThis",										
				type: 'post',																		
				data: {id:id,prd_id:self.prd_id,market:market,prd_sku_id:self.choose_prd_sku_id,type:self.type,data:data,data:data,isAll:self.isAll,goodName:goodName, sku_name:sku_name, prd_no:prd_no, category_id:category_id, stock_type:stock_type, upload_stock:upload_stock, assist_prd:assist_prd, dateBegin:dateBegin, dateEnd:dateEnd,iDisplayLength:iDisplayLength},															
				dataType: 'json',
				async:false, 				
				success: function (data) {															
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						if(data == '' && self.isAll === 'false'){
							if(self.choose_prd_sku_id == ''){
								jqtb.draw(false);
							}else{
								getSkuRowHtml(self.prd_id,self.choose_prd_sku_id,self.prd_id+'_'+self.choose_sku_id);
							}
						}else{
							jqtb.draw(false);
						}
						if(self.type == "suit"){
							if(self.isGood != "good"){
								suit(self.prd_id,'no',self.isGood,'yes');
							}else{
								suit(self.choose_prd_sku_id,'no',self.isGood,'yes');
							}
						}
					}else{
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
					}																			
				}																					
			});
			
			
			
			layer.close(self.nowIndex);
			
		},
		//====================================================================== 选择档口弹窗内 选择该档口按钮事件结束 =====================================================================================
		//选择货位
        chooseThisLoc:function(id,prd_loc){
			var self = this;
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=chooseThisLoc",										
				type: 'post',																		
				data: {id:id,prd_id:self.prd_id,prd_loc:prd_loc,prd_sku_id:self.choose_prd_sku_id,type:self.type},																	
				dataType: 'json',
				async:false, 				
				success: function (data) {															
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						
					}else{
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
					}																			
				}																					
			});
			jqtb.ajax.reload("", false);
			if(self.type == "suit"){
				if(self.isGood != "good"){
					suit(self.prd_id,'no',self.isGood,'yes');
				}else{
					suit(self.choose_prd_sku_id,'no',self.isGood,'yes');
				}
				
			}
			
			layer.close(self.nowIndex);
			
		},
		//选择代发
        chooseThisCus:function(system_id,prd_id,prd_sku_id,prd_no){
			var self = this;
			var choose_prd_id = self.prd_id;
			var choose_prd_sku_id = self.choose_prd_sku_id;
			var choose_sku_id = self.choose_sku_id;
			
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=chooseThisCus",										
				type: 'post',																		
				data: {prd_id: prd_id, prd_sku_id: prd_sku_id, prd_no: prd_no, choose_prd_id: choose_prd_id, choose_prd_sku_id: choose_prd_sku_id, system_id: system_id},																	
				dataType: 'json',				
				success: function (data) {
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						
					}else{
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
					}
					
					if(choose_prd_sku_id == ''){
						jqtb.draw(false);
					}else{
						getSkuRowHtml(choose_prd_id,choose_prd_sku_id,choose_prd_id+'_'+choose_sku_id);
					}
					
					layer.close(self.nowIndex);
				}																					
			});
		},
		//================================================================================= 选择档口内input框回车事件 ======================================================================================
		downSearch:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				self.stallSearch();
			}
		},
		//=============================================================================== 选择档口内input框回车事件结束 ====================================================================================
		downLocSearch:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				self.locSearch();
			}
		},
		downDistSearch:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				self.distSearch();
			}
		},
		//==================================================================================== 页面查询框回车事件 ==========================================================================================
		keyDown:function(){
			var self = this;
			var e = event || window.event;
			if(e.keyCode == 13){
				jqtb.ajax.reload("", false);
			}
		},
		//================================================================================== 页面查询框回车事件结束 ========================================================================================
		
		//=========================================================================================== 新增 =================================================================================================
		newAdd:function(type){
			var self = this;
			self.change_arr = [];
			$("#form98")[0].reset();
			$("#form99")[0].reset();
			$("#pic_name").val("");
			$("#manypic_val").val("");
			var timestamp = Date.parse(new Date());
			$("#newtimestramp").val(timestamp);
			if(type == "add"){
				$("#good_code").val("");
				$("#good_num").val("");
				$("#good_name").val("");
				$("#qty_safe").val("");
				$("#choose_class").val(0);
				$("#brand").val("");
				$("#bar_code").val("");
				$("#retail").val("");
				$("#good_cost").val("");
				$("#qty_min").val("");
				$("#prd_id").val("");
				$("#sort_name").val("");
				$("#stockType").val(0);
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
						$("#qty_safe").val(data.result.qty_safe);
						$("#brand").val(data.result.brand);
						$("#bar_code").val(data.result.barcode);
						$("#choose_class").val(data.result.category_id);
						$("#retail").val(data.result.price);
						$("#good_cost").val(data.result.cost_price);
						$("#qty_min").val(data.result.qty_min);
						$("#prd_id").val(data.result.prd_id);
						$("#sort_name").val(data.result.sort_name);
						$("#stockType").val(data.result.stock_type);
						$("#weight").val(data.result.weight);
						
						setTimeout(function(){
							self.change_arr = data.row;
							setTimeout(function(){
								mini.parse();
							},500);
						},50);
					}																					
				});
			}
			
			layer.open({																																											
				type: 1,																																											
				title: '新增【商品信息】',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['1400px', '650px'], //宽高																																					
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
		//========================================================================================= 新增供应商 =============================================================================================
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
		
		//========================================================================================= 新增供应商结束 =========================================================================================
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
			if(!self.change_arr){
				self.change_arr = [];
			}
			self.change_arr.push(json);
			
			setTimeout(function(){
				mini.parse();
			},200);
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
			var qty_safe = $("#qty_safe").val();
			var choose_class = $("#choose_class").val();
			var brand = $("#brand").val();
			var bar_code = $("#bar_code").val();
			var retail = $("#retail").val();
			var good_cost = $("#good_cost").val();
			var qty_min = $("#qty_min").val();
			var prd_id = $("#prd_id").val();
			var sort_name = $("#sort_name").val();
			var stock_type = $("#stockType").val();
			var pic_name = $("#pic_name").val();
			var manypic_val = $("#manypic_val").val();
			var weight = $("#weight").val();
			
			var newOrder = {
				"good_code":good_code,
				"good_num":good_num,
				"good_name":good_name,
				"qty_safe":qty_safe,
				"choose_class":choose_class,
				"brand":brand,
				"bar_code":bar_code,
				"retail":retail,
				"good_cost":good_cost,
				"qty_min":qty_min,
				"prd_id":prd_id,
				"sort_name":sort_name,
				"stock_type":stock_type,
				"pic_name":pic_name,
				"manypic_val":manypic_val,
				"weight":weight,
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
			
			data = JSON.stringify(data);
			data = encodeURI(data);
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
						jqtb.ajax.reload("", false);
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
		
		//========================================================================================= 套装新增 ===============================================================================================
		suitAdd:function(){
			var self = this;
			layer.open({
				title :'选择商品',
				type: 2,
				shade: false,
				area: ['900px', '600px'],
				maxmin: false,
				content: '?m=widget&c=selectProduct&a=index'
				
			});
		},
		//======================================================================================= 套装新增结束 =============================================================================================
		
		//========================================================================================= 修改按钮 ===============================================================================================
		changeGood:function(index){
			var self= this;
			self.doWhat = "change";
			self.changeIndex = index;
			layer.open({
				title :'选择商品',
				type: 2,
				shade: false,
				area: ['900px', '600px'],
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
					
					var category_id = self.id;
					var goodName = self.goodName;
					var sku_name = self.sku_name;
					var prd_no = self.prd_no;
					
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
								jqtb.ajax.reload("", false);
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
			})
		},
		setStockType:function(stockTypes){
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
				tip = '确定要更改这 '+$("input[name='order']").filter(':checked').length+' 个商品库存类型吗？';
			}else{
				tip = '确定要更改全部商品库存类型吗？';
			}
			layer.open({
				title: '提示',
				content: tip,
				btn: ['确定', '取消'],
				yes:function(){
					var data = "";
					if(self.isAll){
						$("input[name='order']:checkbox").each(function(){
							if(true != $(this).is(':checked')){
								data += ($(this).val()+",");
							}
						});	
					}else{
						$("input[name='order']:checkbox").each(function(){
							if(true == $(this).is(':checked')){
								data += ($(this).val()+",");
							}
						});	
					}
					data = data.substr(0,data.length-1);
					var goodName = self.goodName;
					var sku_name = self.sku_name;
					var prd_no = self.prd_no;	
					var category_id = self.id;
					var stock_type = self.stock_type;
					var upload_stock = self.upload_stock;			
					var assist_prd = self.assist_prd;
					var dateBegin = self.dateBegin;
					var dateEnd = self.dateEnd;
					var iDisplayLength = 5000;

					$.ajax({																				
						url: "/index.php?m=goods&c=association&a=setStockType",
						type: 'post',																		
						data: {data:data,stockTypes:stockTypes,isAll:self.isAll,goodName:goodName,sku_name:sku_name,prd_no:prd_no,category_id:category_id,upload_stock:upload_stock,assist_prd:assist_prd,dateBegin:dateBegin,dateEnd:dateEnd,iDisplayLength:iDisplayLength,stock_type:stock_type},					
						dataType: 'json',																	
						success: function (data) {															
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								jqtb.ajax.reload("", false);
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
		stockConfig:function(){//设置自动同步库存
			mini.open({
				url: "/index.php?m=goods&c=association&a=stockConfig",
				title: "库存同步设置",
				width: 700,
				height: 400,
				allowResize: false,
				allowDrag: false,
				showMaxButton: false
			});
		},
		//设自动同步
		setUploadStock:function(uploadStock){
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
				tip = '确定要更改这 '+$("input[name='order']").filter(':checked').length+' 个商品同步库存吗？';
			}else{
				tip = '确定要更改全部商品同步库存吗？';
			}
			layer.open({
				title: '提示',
				content: tip,
				btn: ['确定', '取消'],
				yes:function(){
					
					var data = "";
					if(self.isAll){
						$("input[name='order']:checkbox").each(function(){
							if(true != $(this).is(':checked')){
								data += ($(this).val()+",");
							}
						});	
					}else{
						$("input[name='order']:checkbox").each(function(){
							if(true == $(this).is(':checked')){
								data += ($(this).val()+",");
							}
						});	
					}
					data = data.substr(0,data.length-1);
					var goodName = self.goodName;
					var sku_name = self.sku_name;
					var prd_no = self.prd_no;	
					var category_id = self.id;
					var stock_type = self.stock_type;
					var upload_stock = self.upload_stock;			
					var assist_prd = self.assist_prd;
					var dateBegin = self.dateBegin;
					var dateEnd = self.dateEnd;
					var iDisplayLength = 5000;
					$.ajax({																				
						url: "/index.php?m=goods&c=association&a=setUploadStock",
						type: 'post',																		
						data: {data:data,uploadStock:uploadStock,isAll:self.isAll,goodName:goodName,sku_name:sku_name,prd_no:prd_no,category_id:category_id,stock_type:stock_type,upload_stock:upload_stock,assist_prd:assist_prd,dateBegin:dateBegin,dateEnd:dateEnd,iDisplayLength:iDisplayLength},					
						dataType: 'json',																	
						success: function (data) {
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								jqtb.ajax.reload("", false);
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
		calSoftStock:function(){
			var self = this;
			
			mini.open({
				title:"计算安全库存",
				width:800,
				allowResize:false,
				showMaxButton:true,
				height:470,	
				url:"/index.php?m=goods&c=association&a=calSoftStock",
			});
		},
		cqshopupload:function(){//超群商城商品上传 
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
				tip = '确定要上传这 '+$("input[name='order']").filter(':checked').length+' 个商品到超群商城吗？';
			}else{
				tip = '确定要上传全部商品到超群商城吗？';
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
					var category_id = self.id;
					var goodName = self.goodName;
					var sku_name = self.sku_name;
					var prd_no = self.prd_no;
					
					$.ajax({																				
						url: "/index.php?m=goods&c=association&a=cqshopupload",
						type: 'post',																		
						data: {data:data,isAll:self.isAll,goodName:goodName,sku_name:sku_name,prd_no:prd_no,category_id:category_id},					
						dataType: 'json',																	
						success: function (data) {
							if(data.code == "ok"){
								layer.msg('上传完成',{
									icon: 1,
									time: 2000
								});
								jqtb.ajax.reload("", false);
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
		//批量设置分类
		Batch_class:function(){
			var self = this;
			if($("input[name='order']").filter(':checked').length == 0){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			layer.open({			
				type: 1,			
				title: '批量设置分类',
				skin: 'layui-layer-rim', 
				area: ['350px', '400px'], 
				shade: 0.3,	
				content: $("#Batchclass"),
				btn: ['保存', '取消'],
				yes: function(index, layero){
					var data = "";
					if(self.isAll){
						$("input[name='order']:checkbox").each(function(){
						if(true != $(this).is(':checked')){
							data += ($(this).val()+",");
						}
					});	
					}else{
						$("input[name='order']:checkbox").each(function(){
							if(true == $(this).is(':checked')){
								data += ($(this).val()+",");
							}
						});	
					}
					data = data.substr(0,data.length-1);
					var selection_sort = $("#selection_sort").val();	
					var category_id = self.id;
					var goodName = self.goodName;
					var sku_name = self.sku_name;
					var prd_no = self.prd_no;
					var stock_type = self.stock_type;
					var upload_stock = self.upload_stock;
					var assist_prd = self.assist_prd;
					var dateBegin = self.dateBegin;
					var dateEnd = self.dateEnd;
					var iDisplayLength = 5000;					
					$.ajax({
						url: "/index.php?m=goods&c=association&a=updateclassify",
						type: 'post',
						data: {prd_id:data, selection_sort:selection_sort, isAll:self.isAll ,goodName:goodName, sku_name:sku_name, prd_no:prd_no, category_id:category_id, stock_type:stock_type, upload_stock:upload_stock, assist_prd:assist_prd, dateBegin:dateBegin, dateEnd:dateEnd, iDisplayLength:iDisplayLength},
						dataType: 'json',
						success: function (result) {
							if(result.code == 'ok'){
							layer.msg("修改成功",{
								icon: 1,
								time: 2000
							});
							jqtb.ajax.reload("", false);
							self.isAll = false;
							self.nowPage = false;
							self.allPage = false;
							$("input[name='order']").iCheck('uncheck');	
							$(".inputTe").css("color","white");
							}else{
								layer.msg("修改失败",{
									icon: 2,
									time: 2000
								});
							}
						}	
					});
					layer.close(index);
				},
				cancel: function (index, layero) {
					
				},
				success: function(layero, index){
					flow.nowIndex = index;
				}		
		});
			
		},
		setPrdLable:function(){//设置自动同步库存
			mini.open({
				url: "/index.php?m=goods&c=association&a=setPrdLable",
				title: "商品标签管理",
				width: 800,
				height: 750,
				allowResize: false,
				allowDrag: false,
				showMaxButton: false
			});
		},
		setQtyMin:function(){
			var self = this;
			if($("input[name='order']").filter(':checked').length == 0){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			layer.open({			
				type: 1,			
				title: '设置库存下限',
				skin: 'layui-layer-rim', 
				area: ['400px', '150px'], 
				shade: 0.3,	
				content: $("#set_qty_min"),
				btn: ['确定']
				,yes: function(index, layero){
					var data = "";
					if(self.isAll){
						$("input[name='order']:checkbox").each(function(){
						if(true != $(this).is(':checked')){
							data += ("'"+$(this).val()+"'"+",");
						}
					});	
					}else{
						$("input[name='order']:checkbox").each(function(){
							if(true == $(this).is(':checked')){
								data += ("'"+$(this).val()+"'"+",");
							}
						});	
					}
					data = data.substr(0,data.length-1);
					var selection_sort = $("#selection_sort").val();
					var category_id = self.id;
					var goodName = self.goodName;
					var sku_name = self.sku_name;
					var prd_no = self.prd_no;
					var stock_type = self.stock_type;
					var upload_stock = self.upload_stock;
					var assist_prd = self.assist_prd;
					var dateBegin = self.dateBegin;
					var dateEnd = self.dateEnd;	
					var qty_min_val = $("#qty_min_val").val();
					var iDisplayLength = 5000;					
					$.ajax({
						url: "/index.php?m=goods&c=association&a=setQtyMin",
						type: 'post',
						data: {prd_id:data, selection_sort:selection_sort, isAll:self.isAll ,goodName:goodName, sku_name:sku_name, prd_no:prd_no, category_id:category_id, stock_type:stock_type, upload_stock:upload_stock, assist_prd:assist_prd, dateBegin:dateBegin, dateEnd:dateEnd, iDisplayLength:iDisplayLength, qty_min_val:qty_min_val},
						dataType: 'json',
						success: function (result) {
							if(result.code == 'ok'){
							layer.msg("修改成功",{
								icon: 1,
								time: 2000
							});
							/*jqtb.ajax.reload("", false);
							self.isAll = false;
							self.nowPage = false;
							self.allPage = false;
							$("input[name='order']").iCheck('uncheck');	
							$(".inputTe").css("color","white");*/
							$("#qty_min_val").val('');
							}else{
								layer.msg("修改失败",{
									icon: 2,
									time: 2000
								});
							}
						}	
					});
					layer.close(index);
				},
				cancel: function (index, layero) {
					
				},
				success: function(layero, index){
					flow.nowIndex = index;
				}		
			});
			flow.getCustTable("","",1);
		},
		Batch_Supplier:function(){
			var self = this;
			if($("input[name='order']").filter(':checked').length == 0){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				return false;
			}
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
			
			/*layer.open({			
				type: 1,			
				title: '批量设置分类',
				skin: 'layui-layer-rim', 
				area: ['350px', '400px'], 
				shade: 0.3,	
				content: $("#custSetChoose"),
				btn: ['保存', '取消'],
				yes: function(index, layero){
					var data = "";
					if(self.isAll){
						$("input[name='order']:checkbox").each(function(){
						if(true != $(this).is(':checked')){
							data += ($(this).val()+",");
						}
					});	
					}else{
						$("input[name='order']:checkbox").each(function(){
							if(true == $(this).is(':checked')){
								data += ($(this).val()+",");
							}
						});	
					}
					data = data.substr(0,data.length-1);
					var selection_sort = $("#selection_sort").val();
					var goodName = $(".goodName").val();
					var sku_name = $(".sku_name").val();
					var prd_no = $(".prd_no").val();	
					var category_id = self.id;
					var stock_type = $("#stock_type").val();
					var upload_stock = $("#upload_stock").val();			
					var assist_prd = $("#assist_prd").val();
					var dateBegin = $("#dateBegin").val();
					var dateEnd = $("#dateEnd").val();
					var iDisplayLength = 5000;					
					$.ajax({
						url: "/index.php?m=goods&c=association&a=updateclassify",
						type: 'post',
						data: {prd_id:data, selection_sort:selection_sort, isAll:self.isAll ,goodName:goodName, sku_name:sku_name, prd_no:prd_no, category_id:category_id, stock_type:stock_type, upload_stock:upload_stock, assist_prd:assist_prd, dateBegin:dateBegin, dateEnd:dateEnd, iDisplayLength:iDisplayLength},
						dataType: 'json',
						success: function (result) {
							if(result.code == 'ok'){
							layer.msg("修改成功",{
								icon: 1,
								time: 2000
							});
							jqtb.ajax.reload("", false);
							self.isAll = false;
							self.nowPage = false;
							self.allPage = false;
							$("input[name='order']").iCheck('uncheck');	
							$(".inputTe").css("color","white");
							}else{
								layer.msg("修改失败",{
									icon: 2,
									time: 2000
								});
							}
						}	
					});
					layer.close(index);
				},
				cancel: function (index, layero) {
					
				},
				success: function(layero, index){
					flow.nowIndex = index;
				}		
		});*/
			
		},

		//批量设置代拿商品
		setBatchDaiNa:function(dataType){
			var self = this;
			if($("input[name='order']").filter(':checked').length == 0){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
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
				var data = "";
				if(self.isAll){
					$("input[name='order']:checkbox").each(function(){
					if(true != $(this).is(':checked')){
						data += ($(this).val()+",");
					}
				});	
				}else{
					$("input[name='order']:checkbox").each(function(){
						if(true == $(this).is(':checked')){
							data += ($(this).val()+",");
						}
					});	
				}
				data = data.substr(0,data.length-1);
	
				$.ajax({
					url: "/index.php?m=goods&c=association&a=updateAssistPrd",
					type: 'post',
					data: {prd_id:data, assist_prd:dataType, isAll:self.isAll},
					dataType: 'json',
					success: function (result) {
						if(result.code == 'ok'){
							layer.msg("修改成功",{
								icon: 1,
								time: 2000
							});
							jqtb.ajax.reload("", false);
							self.isAll = false;
							self.nowPage = false;
							self.allPage = false;
							$("input[name='order']").iCheck('uncheck');	
							$(".inputTe").css("color","white");
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
		printBarCode:function(){
			var self = this;
			if($("input[name='order']").filter(':checked').length == 0){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			if(self.isAll == true){
				layer.msg('条码打印无法使用全部页，请选择当前页',{
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
			data = data.substr(0,data.length-1);
			
			mini.open({
				title:"条码打印",
				width:800,
				allowResize:false,
				showMaxButton:true,
				height:500,	
				url:"/index.php?m=goods&c=association&a=printBarCodeWindow",
				onload: function () {
					var iframe = this.getIFrameEl();
					iframe.contentWindow.SetData(data);
				},
			});
		},
		stockUpload:function(){
			var self = this;
			if($("input[name='order']").filter(':checked').length == 0){																							
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																												
				return false;																																										
			}
			
			if(self.isAll == true){
				layer.msg('手工同步库存无法使用全部页，请选择当前页',{
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
			data = data.substr(0,data.length-1);
			
			mini.open({
				url: "/index.php?m=goods&c=association&a=stockConfig&manual=T",
				title: "库存同步",
				width: 600,
				height: 400,
				allowResize: false,
				allowDrag: false,
				showMaxButton: false,
				ondestroy: function (action) {  //弹出页面关闭前
					if (action == "ok") {       //如果点击“确定”
						var iframe = this.getIFrameEl();
						
						var config_data = iframe.contentWindow.GetData();
						config_data = mini.clone(config_data);
						
						$.ajax({																				
							url: "/index.php?m=goods&c=association&a=stockUpload",										
							type: 'post',																		
							data: {data: data, config_data: config_data},
							dataType: 'json',																	
							success: function (data) {
								//，具体请查看库存同步日志
								if(data.code == "ok"){
									layer.msg("同步完成",{
										icon: 1,
										time: 2000
									});	
								}else{
									layer.msg(data.msg,{
										icon: 2,
										time: 2000
									});	
								}
							}																					
						});
					}                        
				}
			});
		},
		stockUploadSoldOut:function(){
			var self = this;
			if($("input[name='order']").filter(':checked').length == 0){																							
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																												
				return false;																																										
			}
			
			if(self.isAll == true){
				layer.msg('手工同步库存无法使用全部页，请选择当前页',{
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
			data = data.substr(0,data.length-1);
			
			mini.open({
				url: "/index.php?m=goods&c=association&a=stockConfig&manual=T",
				title: "库存同步",
				width: 600,
				height: 400,
				allowResize: false,
				allowDrag: false,
				showMaxButton: false,
				ondestroy: function (action) {  //弹出页面关闭前
					if (action == "ok") {       //如果点击“确定”
						var iframe = this.getIFrameEl();
						
						var config_data = iframe.contentWindow.GetData();
						config_data = mini.clone(config_data);
						
						$.ajax({																				
							url: "/index.php?m=goods&c=association&a=stockUpload&soldOut=T",										
							type: 'post',																		
							data: {data: data, config_data: config_data},
							dataType: 'json',																	
							success: function (data) {
								//，具体请查看库存同步日志
								if(data.code == "ok"){
									layer.msg("同步完成",{
										icon: 1,
										time: 2000
									});	
								}else{
									layer.msg(data.msg,{
										icon: 2,
										time: 2000
									});	
								}
							}																					
						});
					}                        
				}
			});
		},
		delete_tr:function(index,prd_sku_id){
			deleteTr(index,prd_sku_id);
		},
		batchBarCodeMode:function(){
			layer.confirm('确定生成所有商品的条形码？', {
				btn: ['确定', '取消'] //可以无限个按钮
				
			}, function(index, layero){
				//按钮【按钮一】的回调
				
				$.ajax({																				
					url: "/index.php?m=goods&c=association&a=batchSkuBarCodeCreate",										
					type: 'post',																		
					data: {},																	
					dataType: 'json',																	
					success: function (data) {															
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							jqtb.ajax.reload("", false);
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
		//======================================================================================= 明细修改按钮 =============================================================================================
		skuStockUpload:function(prd_sku_id){
			mini.open({
				url: "/index.php?m=goods&c=association&a=stockConfig&manual=T",
				title: "库存同步",
				width: 600,
				height: 400,
				allowResize: false,
				allowDrag: false,
				showMaxButton: false,
				ondestroy: function (action) {  //弹出页面关闭前
					if (action == "ok") {       //如果点击“确定”
						var iframe = this.getIFrameEl();
						
						var config_data = iframe.contentWindow.GetData();
						config_data = mini.clone(config_data);
						
						$.ajax({																				
							url: "/index.php?m=goods&c=association&a=stockUpload",										
							type: 'post',																		
							data: {prd_sku_id: prd_sku_id, config_data: config_data},
							dataType: 'json',																	
							success: function (data) {
								//，具体请查看库存同步日志
								if(data.code == "ok"){
									layer.msg("同步完成",{
										icon: 1,
										time: 2000
									});	
								}else{
									layer.msg(data.msg,{
										icon: 2,
										time: 2000
									});	
								}
							}																					
						});
					}                        
				}
			});
		},
		
		operationLog:function(prd_id){
			var self = this;
			$.ajax({																																														
				url: "/index.php?m=goods&c=association&a=getOperationLog",																																		
				type: 'post',																																												
				data: {prd_id: prd_id},																																													
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
		skuStockUploadSold:function(prd_sku_id){
			mini.open({
				url: "/index.php?m=goods&c=association&a=stockConfig&manual=T",
				title: "库存同步",
				width: 600,
				height: 400,
				allowResize: false,
				allowDrag: false,
				showMaxButton: false,
				ondestroy: function (action) {  //弹出页面关闭前
					if (action == "ok") {       //如果点击“确定”
						var iframe = this.getIFrameEl();
						
						var config_data = iframe.contentWindow.GetData();
						config_data = mini.clone(config_data);
						
						$.ajax({																				
							url: "/index.php?m=goods&c=association&a=stockUpload&soldOut=T",										
							type: 'post',																		
							data: {prd_sku_id: prd_sku_id, config_data: config_data},
							dataType: 'json',																	
							success: function (data) {
								//，具体请查看库存同步日志
								if(data.code == "ok"){
									layer.msg("同步完成",{
										icon: 1,
										time: 2000
									});	
								}else{
									layer.msg(data.msg,{
										icon: 2,
										time: 2000
									});	
								}
							}																					
						});
					}                        
				}
			});
		},
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
								if(data.error){
									layer.msg(data.error,{
										icon: 0,
										time: 2000
									});
									return false;
								}
								
								getSkuRowHtml(data.prd_id,data.prd_sku_id,cla);
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
		
		//=====================================================================================套装定义内删除按钮===========================================================================================
		delete_suit:function(index){
			var self = this;
			if($("input[name='suit_good']").filter(':checked').length == 0){	
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																																											//===========
				return false;																																										//===========
			}
			
			$("input[name='suit_good']:checkbox").each(function(){																								
				if(true == $(this).is(':checked')){																																				
					self.suitArr.splice(index, 1);
				}																																			
			});	
			$("input[name='suit_good']").iCheck('uncheck');
			
		},
		
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
			}else if(a == "qty_min"){
				self.change_arr[index].qty_min = this_value.val();
			}else if(a == "qty_safe"){
				self.change_arr[index].qty_safe = this_value.val();
			}
			
		}
	}
});

function change_message(prd_sku_id,cla){
	flow.change_message_1(prd_sku_id,cla);
}

function skuStockUpload(prd_sku_id){
	flow.skuStockUpload(prd_sku_id);
}

//======================================================================================= 选择档口弹窗 =================================================================================================
//																																															
//		由于js生成的标签点击事件 不用 vue 的 render 组件渲染会导致 @click 点击事件失效，所以只能用 onclick
//		$(event.target) 判断用户点击的是 button 还是 button 内的 i 标签
//		value  : 获取点击按钮的value值，赋值给弹窗内的搜索框 $("#stallSearch")
//
//		prd_id     : 当前点击 对应数据的 prd_id}
//		type       : 判断套装编码弹窗内选择档口点击还是最外层界面点击
//		index      : 记录套装编码内选择档口按钮或修改按钮点击时为 suitArr 内的第几条数据
//		prd_sku_id : 套装弹窗内点击选择档口时记录对应数据的prd_sku_id
//																																															
//======================================================================================================================================================================================================
//				|
//				|	
//			 	|  
//			  \	| /
//			   \|/
function chooseStall(prd_id,type,index,prd_sku_id,choose_sku_id){
	var value = "";
	
	if($(event.target)[0].nodeName == "BUTTON"){
		value = $(event.target).val();
	}else{
		value = $(event.target).parent().val();
	}
	flow.doWhat = "";
	flow.stallIndex = index;
	flow.type = type;
	flow.prd_id = prd_id;
	flow.choose_prd_sku_id = prd_sku_id;
	flow.choose_sku_id = choose_sku_id;
	//$("#booth").val(value);
	
	layer.open({			
		type: 1,			
		title: '选择档口',
		skin: 'layui-layer-rim', 
		area: ['1400px', '700px'], 
		shade: 0.3,	
		content: $("#stalls"),
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

	//var boothArr = value.split(" ");
	//$("#marketSelect").val(boothArr[0]);
	flow.getStall("","",1);
}
//清空货位单元格
function clear_prd_loc(prd_id){
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=clear_prd_loc",	
		type: 'post',																		
		data: {prd_id:prd_id,prd_sku_id:self.choose_prd_sku_id,type:self.type},																				
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
			}else if(data.code == "error"){
				layer.msg("修改失败",{
					icon: 1,
					time: 2000
				});
			}
		}																					
	});
	jqtb.draw(false);
}
//清空配货供应商单元格
function clear_this(prd_id){
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=clear_this",	
		type: 'post',																		
		data: {prd_id:prd_id,prd_sku_id:self.choose_prd_sku_id,type:self.type},																				
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
			}else if(data.code == "error"){
				layer.msg("修改失败",{
					icon: 1,
					time: 2000
				});
			}
		}																					
	});
	jqtb.draw(false);
}
//清空子单元格
function clear_child(prd_id,prd_sku_id){
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=clear_child",	
		type: 'post',																		
		data: {prd_id:prd_id,prd_sku_id:prd_sku_id,type:self.type},																				
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
			}else if(data.code == "error"){
				layer.msg("修改失败",{
					icon: 1,
					time: 2000
				});
			}
		}																					
	});
		jqtb.draw(false);

}
//选择供应商
function supplier(prd_id,type,index,prd_sku_id,choose_sku_id){
	var value = "";
	
	if($(event.target)[0].nodeName == "BUTTON"){
		value = $(event.target).val();
	}else{
		value = $(event.target).parent().val();
	}
	flow.doWhat = "";
	flow.stallIndex = index;
	flow.type = type;
	flow.prd_id = prd_id;
	flow.choose_prd_sku_id = prd_sku_id;
	flow.choose_sku_id = choose_sku_id;
	//$("#booth").val(value);
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
//选择货位
function chooseLoc(prd_id,type,index,prd_sku_id){
	var value = "";
	
	if($(event.target)[0].nodeName == "BUTTON"){
		value = $(event.target).val();
	}else{
		value = $(event.target).parent().val();
	}
	
	flow.doWhat = "";
	
	flow.locIndex = index;
	
	flow.type = type;
	
	flow.prd_id = prd_id;
	
	flow.choose_prd_sku_id = prd_sku_id;
	
	layer.open({																																											
		type: 1,																																											
		title: '选择货位',																																									
		skin: 'layui-layer-rim', //加上边框																																					
		area: ['1400px', '650px'], //宽高																																					
		shade: 0.3,																																											
		content: $("#locs"),																																							
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
    
	flow.getLoc('',1);
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
			}else if(data.code == "error"){
				layer.msg("修改失败",{
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
			}else if(data.code == "no"){
				return false;
			}else{
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}				
		}																					
	});	
}

function blur_barcode(a,prd_sku_id){
	$(event.target).css("border","1px solid white");
	var barcode = $(event.target).val();
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=updateSkuBarcode",										
		type: 'post',																		
		data: {prd_sku_id:prd_sku_id,barcode:barcode},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
			}else if(data.code == "no"){
				return false;
			}else{
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}				
		}																					
	});	
}

function blur_savesort(a,prd_sku_id){
	$(event.target).css("border","1px solid white");
	var sort_name_sku = $(event.target).val();
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=updateSkuSortName",										
		type: 'post',																		
		data: {prd_sku_id:prd_sku_id,sort_name_sku:sort_name_sku},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
			}else if(data.code == "no"){
				return false;
			}else{
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}				
		}																					
	});	
}

function nimble_save(prd_sku_id){
	$(event.target).css("border","1px solid white");
	var nimble = $(event.target).val();
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=updateSkuNimble",										
		type: 'post',																		
		data: {prd_sku_id:prd_sku_id,nimble:nimble},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
			}else if(data.code == "noupd"){
				return false;
			}else{
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}				
		}																					
	});	
}


//======================================================================================= 找款按钮功能 =================================================================================================
//																																															
//		由于js生成的标签点击事件 不用 vue 的 render 组件渲染会导致 @click 点击事件失效，所以只能用 onclick
//		
//		name  : 当前点击按钮对应的配货档口
//																																															
//======================================================================================================================================================================================================
//				|
//				|	
//			 	|  
//			  \	| /
//			   \|/
function look(name){
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=look",										
		type: 'post',																		
		data: {data:name},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data){
				window.open(data.shop_url);
			}else{
				layer.msg("请先选择档口",{
					icon: 0,
					time: 2000
				});
			}																			
		}																					
	});
}

//======================================================================================= 套装编码功能 =================================================================================================
//																																															
//		由于js生成的标签点击事件 不用 vue 的 render 组件渲染会导致 @click 点击事件失效，所以只能用 onclick
//		
//		type   : "yes" 为套装编码按钮点击  "no" 为选择档口后调用
//		good   : 判断是否为表身商品 
//																																															
//======================================================================================================================================================================================================
//				|
//				|	
//			 	|  
//			  \	| /
//			   \|/
function suit(prd_id,type,good,isOpen){
	flow.isGood = good;
	flow.timely_prd_id = prd_id;
	$(".color_a a").each(function(){
		$(this).css("color","#428bca");
	});
	
	$(event.target).css("color","red");
	
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=getSuit",										
		type: 'post',																		
		data: {data:prd_id,good:good},																	
		dataType: 'json',																	
		success: function (data) {	
			
			if(data){
				if(type=="yes"){
					flow.suit_prd_id = data.result[0].prd_id;
					flow.suit_prd_sku_id = data.result[0].prd_sku_id;
					flow.suitArr = [];
					if(data.result[0].prd_sku_id == undefined){
						flow.suit_prd_sku_id = "";
					}
					if(data.row == 0){
						data.row = [];
					}
					flow.suitArr = data.row;
					if(isOpen == "yes"){
						layer.open({																																											
							type: 1,																																											
							title: '套装编码',																																									
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['1400px', '650px'], //宽高																																					
							shade: 0.3,																																											
							content: $("#suit"),																																							
							btn: ['保存','关闭']
							,yes: function(index, layero){
								//按钮【按钮一】的回调
								var data = [];
								
								$(".suitBody tr").each(function(){
									
									var newData = {
										"prd_id":flow.suit_prd_id,
										"prd_sku_id":flow.suit_prd_sku_id,
										"bom_prd_id":$(this).find(".suit_td").find(".bom_prd_id").attr("value"),
										"bom_prd_sku_id":$(this).find(".suit_td").find(".bom_prd_sku_id").attr("value"),
										"num":$(this).find(".suit_td").find(".stall_num").val()
									}
									
									data.push(newData);
								});
								
								$.ajax({																				
									url: "/index.php?m=goods&c=association&a=suitInsert",										
									type: 'post',																		
									data: {data:data,prd_id:prd_id,good:good},																	
									dataType: 'json',																	
									success: function (data) {															
										if(data.code == "ok"){
											layer.msg(data.msg,{
												icon: 1,
												time: 2000
											});
											layer.close(index);
										}else{
											layer.msg(data.msg,{
												icon: 2,
												time: 2000
											});
										}																			
									}																					
								});
								
								//layer.close(index);
							},
							btn2: function(index, layero){
								
							},
							cancel: function (index, layero) {																																					
																																																				
							}																																													
						});
					}
				}else{
					var newArr = flow.suitArr;
					newArr[flow.stallIndex].cus_name = data.result[0].cus_name;
					
					flow.suitArr = "";
					flow.suitArr = newArr;
				}
				
				setTimeout(function(){
					$('.skin-mini input').iCheck({
						checkboxClass: 'icheckbox_minimal',
						radioClass: 'iradio_minimal',
						increaseArea: '20%'
					});
				},200);
				
			}else{
				flow.suitArr = "";
				layer.msg("未查找到相关数据",{
					icon: 2,
					time: 2000
				});
			}
			
		}	
		
	});
	
	
}

function cbProductRows(data){
	var str = "";
	var a = 0;
	for(var i = 0; i < data.length; i++){
		if(data[i].prd_sku_id != null){
			str += (data[i].prd_sku_id + ",");
		}else{
			str += (data[i].prd_id + ",");
		}
		
	}
	str = str.substr(0,str.length-1);
	
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=isRepeat",										
		type: 'post',																		
		data: {data:str},																	
		dataType: 'json',
		async:false,
		success: function (result) {															
			if(result > 0){
				layer.msg("含有已生成套装商品，请重新选择",{
					icon: 0,
					time: 2000
				});
				a = 1;
			}else{
				a = 0;
			}																		
		}																					
	});
	
	if(a > 0){
		return false;
	}
	
	if(flow.doWhat == ""){
		if(flow.isGood != "good"){
			for(var i = 0; i < data.length; i++){
				if(data[i].prd_id == flow.suit_prd_id){
					layer.msg("不能选择与套装主商品相同的货品，请重新选择",{
						icon: 2,
						time: 2000
					});
					
					return false;
				}
			}
			for(var i = 0; i < data.length; i++){
				flow.suitArr.push(data[i]);
			}
		}else{
			for(var i = 0; i < data.length; i++){
				if(data[i].prd_sku_id == flow.suit_prd_sku_id){
					layer.msg("不能选择与套装主商品相同的货品，请重新选择",{
						icon: 2,
						time: 2000
					});
					return false;
				}
				
			}
			
			/*str = str.substr(0,str.length-1);
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=isRepeat",										
				type: 'post',																		
				data: {data:str},																	
				dataType: 'json',
				async:false,
				success: function (result) {															
					if(result > 0){
						layer.msg("含有已生成套装商品，请重新选择",{
							icon: 0,
							time: 2000
						});
						a = 1;
					}else{
						a = 0;
					}																		
				}																					
			});
			
			if(a > 0){
				return false;
			}*/
			
			for(var i = 0; i < data.length; i++){
				flow.suitArr.push(data[i]); 
			}
		}
		
	}else if(flow.doWhat == "change"){
		if(flow.isGood != "good"){
			if(data[0].prd_id == flow.suit_prd_id){
				layer.msg("不能选择与套装主商品相同的货品，请重新选择",{
					icon: 2,
					time: 2000
				});
				
				return false;
			}
			var newArr = flow.suitArr;
			newArr[flow.changeIndex] = data[0];
			flow.suitArr = "";
			flow.suitArr = newArr;
		}else{
			if(data[0].prd_sku_id == flow.suit_prd_sku_id){
				layer.msg("不能选择与套装主商品相同的货品，请重新选择",{
					icon: 2,
					time: 2000
				});
				return false;
			}
			var newArr = flow.suitArr;
			newArr[flow.changeIndex] = data[0];
			flow.suitArr = "";
			flow.suitArr = newArr;
		}
		
	}
	
	setTimeout(function(){
		$('.skin-mini input').iCheck({
			checkboxClass: 'icheckbox_minimal',
			radioClass: 'iradio_minimal',
			increaseArea: '20%'
		});
	},50);
	
	
}

function new_add(prd_id){
	flow.newAdd(prd_id);
}

function operationLog(prd_id){
	flow.operationLog(prd_id);
}


function Add_supp(prd_id){
	flow.AddSupp(prd_id);
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

function startUpload(){
	$("#form98").ajaxSubmit({
		type:'POST',
		dataType:"json",
		success: function(data){
			var	serverObj = mini.decode(data);
			if(serverObj.code == "error"){
				layer.msg(serverObj.msg,{
					icon: 2,
					time: 2000
				});
			}else{
				$('#pic_name').val(serverObj.pic_name);
				$('#manypic_val').val(serverObj.manypic_val);
				layer.msg('上传成功',{
					icon: 1,
					time: 2000
				});
			}
		}
	});
}

function manypic(){
	$("#form99").ajaxSubmit({
		type:'POST',
		dataType:"json",
		success: function(data){
			var	serverObj = mini.decode(data);
			if(serverObj.code == "error"){
				layer.msg(serverObj.msg,{
					icon: 2,
					time: 2000
				});
			}else{
				$('#pic_name').val(serverObj.pic_name);
				$('#manypic_val').val(serverObj.manypic_val);
				layer.msg('上传成功',{
					icon: 1,
					time: 2000
				});
			}
		}
	});
}

function startUploadSku(index){
	var newtimestramp = $('#newtimestramp').val();
	$("#form" + index).ajaxSubmit({
		type:'POST',
		dataType:"json",
		data: {prd_index: index, newtimestramp: newtimestramp},
		success: function(data){
			var	serverObj = mini.decode(data);
			if(serverObj.code == "error"){
				layer.msg(serverObj.msg,{
					icon: 2,
					time: 2000
				});
			}else{
				flow.change_arr[index].pic_name = serverObj.pic_name;
				layer.msg('上传成功',{
					icon: 1,
					time: 2000
				});
			}
		}
	});
}

function updateAssistPrd(prd_id, data)
{
	$.ajax({
		url: "/index.php?m=goods&c=association&a=updateAssistPrd",
		type: 'post',
		data: {prd_id:prd_id, assist_prd:data},
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

//选择代发商
function setDistCus(prd_id,prd_sku_id,choose_sku_id){
	flow.prd_id = prd_id;
	flow.choose_prd_sku_id = prd_sku_id;
	flow.choose_sku_id = choose_sku_id;
	
	layer.open({
		type: 1,																																											
		title: '选择供应商商品',																																									
		skin: 'layui-layer-rim', //加上边框																																					
		area: ['800px', '620px'], //宽高																																					
		shade: 0.3,																																											
		content: $("#cus"),																																							
		btn: ['关闭']
		,yes: function(index, layero){
			layer.close(index);
		},
		cancel: function (index, layero) {																																					
																																															
		},
		success: function(layero, index){
			
			flow.nowIndex = index;
			flow.getDist(1);
		}		
	});
}

//选择供应商
function manypicPop(prd_id,type,index,prd_sku_id,choose_sku_id){
	var value = "";
	
	if($(event.target)[0].nodeName == "BUTTON"){
		value = $(event.target).val();
	}else{
		value = $(event.target).parent().val();
	}
	flow.doWhat = "";
	flow.stallIndex = index;
	flow.type = type;
	flow.prd_id = prd_id;
	flow.choose_prd_sku_id = prd_sku_id;
	flow.choose_sku_id = choose_sku_id;
	//$("#booth").val(value);
	layer.open({			
		type: 1,			
		title: '多图上传',
		skin: 'layui-layer-rim', 
		area: ['500px', '300px'], 
		shade: 0.3,	
		content: $("#uploadManyPic"),
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

function uploadStockChange(prd_id, prd_sku_id, choose_sku_id, status){
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=uploadStockChange",										
		type: 'post',																		
		data: {prd_id: prd_id, prd_sku_id: prd_sku_id, status: status},
		dataType: 'json',				
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg(data.msg,{
					icon: 1,
					time: 2000
				});
				
			}else{
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}

			if(prd_sku_id == ''){
				jqtb.draw(false);
			}else{
				getSkuRowHtml(prd_id,prd_sku_id,prd_id+'_'+choose_sku_id);
			}
		}																					
	});
}

function deleteDistCus(prd_id,prd_sku_id,choose_sku_id){
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=deleteDistCus",										
		type: 'post',																		
		data: {prd_id: prd_id, prd_sku_id: prd_sku_id},
		dataType: 'json',				
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg(data.msg,{
					icon: 1,
					time: 2000
				});
				
			}else{
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}

			if(prd_sku_id == ''){
				jqtb.draw(false);
			}else{
				getSkuRowHtml(prd_id,prd_sku_id,prd_id+'_'+choose_sku_id);
			}
		}																					
	});
}
function getCustSearch(){
	flow.getCustTable("","",1);
}
function distSystemSelect(value){
	flow.getDist(1);
}

function getSkuRowHtml(prd_id,prd_sku_id,cla){
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=getSku",										
		type: 'post',																		
		data: {prd_id: prd_id, prd_sku_id: prd_sku_id},																	
		dataType: 'json',																	
		success: function (data) {
			var tr = "<td width='16px' class=' dt-body-center'></td><td width='16px'></td>";
			tr += "<td width='22px' class=' dt-body-center'></td>";
				  
			if(data[0].pic_path != ''){
				tr += "<td class=' dt-body-center'><div style='width:90px;height:90px;text-align:center;line-height:65px;'><img src=" + data[0].pic_path + " style='width:55px;height:55px;'></div></td>";
			}else{
				tr += "<td class=' dt-body-center'><div style='width:90px;height:90px;text-align:center;line-height:65px;'></div></td>";
			}

			if(!colVisible){
				tr += "<td class=' dt-body-center'></td><td class=' dt-body-center'>" + data[0].sku_name1 + "," + data[0].sku_name2 +"</td><td class=' dt-body-center'><input type='text' value='" + data[0].sort_name_sku +"' style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_savesort(\"sku\",\""+data[0].prd_sku_id+"\")'></td><td class=' dt-body-center'><input type='text' value='" + data[0].barcode +"' style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_barcode(\"sku\",\""+data[0].prd_sku_id+"\")'></td><td class=' dt-body-center'>" + data[0].prd_sku_no +"</td>";
			}else{
				if(data[0].upload_stock_value == '0'){
					tr += "<td class=' dt-body-center'><div></div></td><td class=' dt-body-center'>" + data[0].upload_stock + "</br><a style='cursor:pointer;font-size:12px;' onclick='uploadStockChange(\""+data[0].prd_id+"\",\""+data[0].prd_sku_id+"\",\""+data[0].id+"\",\"no\")'><u>设为不同步库存</u><a>" + "</td><td class=' dt-body-center'>" + data[0].sku_name1 + "," + data[0].sku_name2 +"</td><td class=' dt-body-center'><input type='text' value='" + data[0].sort_name_sku +"' style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_savesort(\"sku\",\""+data[0].prd_sku_id+"\")'></td><td class=' dt-body-center'><input type='text' value='" + data[0].barcode +"' style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_barcode(\"sku\",\""+data[0].prd_sku_id+"\")'></td><td class=' dt-body-center'>" + data[0].prd_sku_no +"</td>";
				}else if(data[0].upload_stock_value == '1'){
					tr += "<td class=' dt-body-center'><div></div></td><td class=' dt-body-center'>" + data[0].upload_stock + "</br><a style='cursor:pointer;font-size:12px;' onclick='uploadStockChange(\""+data[0].prd_id+"\",\""+data[0].prd_sku_id+"\",\""+data[0].id+"\",\"yes\")'><u>设为同步库存</u><a>" + "</td><td class=' dt-body-center'>" + data[0].sku_name1 + "," + data[0].sku_name2 +"</td><td class=' dt-body-center'><input type='text' value='" + data[0].sort_name_sku +"' style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_savesort(\"sku\",\""+data[0].prd_sku_id+"\")'></td><td class=' dt-body-center'><input type='text' value='" + data[0].barcode +"' style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_barcode(\"sku\",\""+data[0].prd_sku_id+"\")'></td><td class=' dt-body-center'>" + data[0].prd_sku_no +"</td>";
				}
			}
			
			if(data[0].cus_no != ""){
				tr += "<td class=' dt-body-center'><div><button style='font-size: 12px' class='layui-btn layui-btn-primary' value='"+data[0].cus_name+"' onclick='supplier(\""+data[0].prd_id+"\",\"stall\",\"\",\""+data[0].prd_sku_id+"\",\""+data[0].id+"\")'>" + data[0].cus_name +"</button></div><i class='aui_close' onclick='clear_child(\""+data[0].prd_id+"\")'>ဆ</i></td>";
				//return "<div><button style='font-size: 12px' class='layui-btn layui-btn-primary' value='"+data+"' onclick='chooseStall(\""+row.prd_id+"\",\"stall\",\"\",\"\")'>" + data +"</button></div>";
			}else{
				tr += "<td class=' dt-body-center'><div><button style='font-size: 12px' class='layui-btn layui-btn-small layui-btn-danger' value='' onclick='supplier(\""+data[0].prd_id+"\",\"stall\",\"\",\""+data[0].prd_sku_id+"\",\""+data[0].id+"\")'>选择供应商</button></div></td>";
				
				//return "<div><button style='font-size: 12px' class='layui-btn layui-btn-small layui-btn-danger' value='' onclick='chooseStall(\""+row.prd_id+"\",\"stall\",\"\",\"\")'>选择档口</button></div>";
			}

			if(daina_system_id)
			{
				tr += "<td class=' dt-body-center'></td>";	
			}
			if(fx_cus_list)
			{
				if(data[0].dist_system_id != ''){
					tr += "<td class=' dt-body-center'><div><button style='font-size: 12px' class='layui-btn layui-btn-primary' value='"+data[0].dist_system_id+"' onclick='deleteDistCus(\""+data[0].prd_id+"\",\""+data[0].prd_sku_id+"\",\""+data[0].id+"\")'>" + data[0].dist_prd_no +"</button></div></td>";		
				}else{
					tr += "<td class=' dt-body-center'><div><button style='font-size: 12px' class='layui-btn layui-btn-small layui-btn-danger' value='' onclick='setDistCus(\""+data[0].prd_id+"\",\""+data[0].prd_sku_id+"\",\""+data[0].id+"\")'>选择代发商品</button></div></td>";	
				}
			}
			 
			tr +=  "<td class=' dt-body-center'><div></div></td>"+
			  "<td class=' dt-body-center'><input type='number' value="+data[0].cost_price+" style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='blur_save(\"sku\",\""+data[0].prd_sku_id+"\")'></td>" +
			  "<td class=' dt-body-center'><div></div></td>"+
			  "<td class=' dt-body-center'>" + data[0].relaShop + "</td>";
				  
			if(colVisible){
				tr += "<td class=' dt-body-center'>" + data[0].qty_now + "</td>";
			}
			tr += "<td class=' dt-body-center'><input type='number' value="+data[0].nimble_nums+" style='width:100%;' class='tr_input' onfocus='focusNow()' onblur='nimble_save(\""+data[0].prd_sku_id+"\")'></td>";
			tr += "<td class=' dt-body-center'></td>";
			tr += "<td class=' dt-body-center'><div><a style='cursor:pointer;font-size:12px;' onclick=change_message(\""+data[0].prd_sku_id+"\",\""+data[0].prd_id+"_"+data[0].id+"\")>修改</a>";
			//if(data[0].upload_stock == '0'){
				tr += "&nbsp;&nbsp;<a style='cursor:pointer;font-size:12px;' onclick=skuStockUpload(\""+data[0].prd_sku_id+"\")>同步库存</a>";
				tr += "&nbsp;&nbsp;<a style='cursor:pointer;font-size:12px;' onclick=skuStockUploadSoldOut(\""+data[0].prd_sku_id+"\")>同步库存并档口下架</a>";
				tr += "&nbsp;&nbsp;<a style='cursor:pointer;font-size:12px;' onclick=operationLog(\""+data[0].prd_sku_id+"\")>操作日志</a>";
			//}


			tr += "</div></td>";
			
			$("."+cla).html(tr);
		}
	});
	
}
