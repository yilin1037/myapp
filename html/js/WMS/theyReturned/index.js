var jqtb;
var flow = new Vue({
	el: '#flow',
	data: {
		shopArr:[],
		isAll:0,
		now:false,
		allPage:false,
		count:0,
		tids:"",
	},
	mounted: function() {
		var self = this;
		
		$.ajax({																			
			url: "/index.php?m=system&c=labelPrinting&a=getShop",								
			type: 'post',																		
			data: {},																			
			dataType: 'json',																
			success: function (data) {											
				self.shopArr = data;													
			}																							
		});	
		
		var tempjson = new Array();
		
		layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
            var $ = layui.jquery
				,element = layui.element
				,layer = layui.layer;
            var form = layui.form()
				,layer = layui.layer
				,layedit = layui.layedit
				,laydate = layui.laydate;
            // 初始化表格
            jqtb = $('#dateTable').DataTable({  //dateTable 模块 入口
                "`dom": '<"top">rt<"bottom"flp><"clear">',
                "autoWidth": false,                     // 自适应宽度
                "paging": true,
                "lengthMenu": [50, 100, 200],
                "pagingType": "full_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
                "processing": true,
                "searching": false, //是否开启搜索
                "serverSide": true,//开启服务器获取数据
                "order": [[5, "desc"]], //默认排序
                "fnServerParams": function (aoData) {
                    aoData.push(
                        {"name": "buyer_nick", "value": $(".buyer_nick").val()},
						{"name": "unique_code", "value": $(".unique_code").val()},
						{"name": "show_tid", "value": $(".show_tid").val()},
						{"name": "prd_no", "value": $(".prd_no").val()},
						{"name": "shop", "value": $("#shop").val()},
						{"name": "exceedBegin", "value": $("#exceedBegin").val()},
						{"name": "exceedEnd", "value": $("#exceedEnd").val()},
                        {"name": "dateBegin", "value": $("#dateBegin").val()},
						{"name": "dateEnd", "value": $("#dateEnd").val()}
                    );
                },
                //请求url
                "sAjaxSource": "index.php?m=WMS&c=theyReturned&a=getData",
                //服务器端，数据回调处理
                "fnServerData": function (sSource, aDataSet, fnCallback) {
                    $.ajax({
                        "dataType": 'json',
                        "type": "post",
                        "url": sSource,
                        "data": aDataSet,
                        "success": function (resp) {
							fnCallback(resp);
							$(document).ready(function(){
								$('.skin-minimal input').iCheck({
									checkboxClass: 'icheckbox_minimal',
									radioClass: 'iradio_minimal',
									increaseArea: '20%'
								});
							});
							self.count = resp.recordsTotal;
							var tids = "";
                            for(var i = 0; i < resp.length; i++){
								tids += (resp[i].order.tid + ",");
							}
							self.tids = tids.substring(0,tids.length-1);
                        }
                    });
                },
                // 初始化表格
                "info": true,                           // 控制是否显示表格左下角的信息
                "stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
                "columns": [ //定义列数据来源  id, userid,username,mobile,create_login_time,STATUS
					{'title': "", 'data': "order.show_tid","render": function (data,type,row,meta) {
						if(data){
							return "<div class='skin-minimal' style='display:none;'><input type='checkbox' name='order' value="+data+"></div>";
						}
					},"width":"0px"},
                    {'title': "序号", 'data': "sn","render": function (data,type,row,meta) {
						  return "";
					},"width":"50px"},
                    {'title': "卖家备注", 'data': "order.seller_memo","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return "<div class='baby_title_1' title="+data+" style='width:100px;'>"+data+"</div>";
						}
					}},
                    {'title': "店铺名称", 'data': "order.shopname","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
						
					}},//隐藏
                    //{'title': "交易类型", 'data': ""},
                    {'title': "买家昵称", 'data': "order.buyer_nick","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
					}},// 自定义列
                    {'title': "订单号", 'data': "order.new_tid"}, // 自定义列
					{'title': "仓库", 'data': "order.wh_name"}, // 自定义列
					{'title': "群单码", 'data': "order.more_code"}, // 自定义列
					{'title': "下单时间", 'data': "order.create_time","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
					}}, // 自定义列
					{'title': "付款时间", 'data': "order.payment_time","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
					}}, // 自定义列
					{'title': "付款后距今", 'data': "order.exceed_day","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return (data+"天");
						}
					}}, // 自定义列
					{'title': "状态", 'data': "item","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							var table = "<table style='width:100%;'><thead></thead><tbody>";
							for(var i = 0; i < data.length; i++){
							table += "<tr><td  class='draw' style='color:#45A548;text-align:center;border'>挂单</td></tr>";
							}
							table += "</tbody></table>";
							return table;
						}
					}}, // 自定义列
					{'title': "数量", 'data': "order.count","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
					}}, // 自定义列
					{'title': "商品编号", 'data': "item","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							var table = "<table style='width:100%;'><thead></thead><tbody>";
							
							for(var i = 0; i < data.length; i++){
									table += ("<tr><td  class='draw' style='text-align:left;'><div class='baby_title_1' title="+data[i].prd_no+">"+data[i].prd_no+"</div></td></tr>");
							}
							table += "</tbody></table>";
							return table;
						}
					}}, // 自定义列
					{'title': "宝贝名称", 'data': "item","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							var table = "<table style='width:100%;'><thead></thead><tbody>";
							for(var i = 0; i < data.length; i++){
									table += ("<tr><td class='draw' style='text-align:left;'><div class='baby_title_1' title="+data[i].title+">"+data[i].title+"</div></td></tr>");
							}
							table += "</tbody></table>";
							return table;
						}
					}}, // 自定义列
					{'title': "销售属性", 'data': "item","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							var table = "<table style='width:100%;'><thead></thead><tbody>";
							for(var i = 0; i < data.length; i++){
									table += ("<tr><td  class='draw' style='text-align:left;'>"+data[i].sku_name+"</td></tr>");
							}
							table += "</tbody></table>";
							return table;
						}
					}}, // 自定义列
					{'title': "操作", 'data': "order.new_tid","render": function (data,type,row,meta) {
						return "<div class='delBtn' onclick=\"delBtnThey('"+data+"')\">删除</div>";
					}}
                ],
				'columnDefs': [{
                    'targets': 0,
                    'searchable': false,
                    'orderable': false,
                    'width': '0',
                    'className': 'displayNone',
                },{
                    'targets': 1,
                    'searchable': false,
                    'orderable': false,
                    'width': '5%',
                    'className': 'dt-body-center'
                },
				{
                    'targets': 2,
                    'searchable': false,
                    'orderable': false,
                    'width': '5%',
                    'className': 'dt-body-center'
                },
				{
                    'targets': 3,
                    'searchable': false,
                    'orderable': false,
                    'width': '5%',
                    'className': 'dt-body-center'
                },
				{
                    'targets': 4,
                    'searchable': false,
                    'orderable': false,
                    'width': '5%',
                    'className': 'dt-body-center'
                },
				{
                    'targets': 6,
                    'searchable': false,
                    'orderable': false,
                    'width': '5%',
                    'className': 'dt-body-center'
                },
				{
                    'targets': 7,
                    'searchable': false,
                    'orderable': false,
                    'width': '5%',
                    'className': 'dt-body-center'
                },
				{
                    'targets': 8,
                    'searchable': false,
                    'orderable': false,
                    'width': '5%',
                    'className': 'dt-body-center'
                },
				{
                    'targets': 11,
                    'searchable': false,
                    'orderable': false,
                    'width': '5%',
                    'className': 'dt-body-center'
                },
				{
                    'targets': 14,
                    'searchable': false,
                    'orderable': false,
                    'width': '5%',
                    'className': 'dt-body-center'
                },
				{
                    'targets': 15,
                    'searchable': false,
                    'orderable': false,
                    'width': '5%',
                    'className': 'dt-body-center'
                },
				{
                    'targets': 16,
                    'searchable': false,
                    'orderable': false,
                    'width': '5%',
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
					"sShowing": "当前显示",
					"sto": "到",
					"sof": "条，共 ",
					"sentries": "条记录",
					
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

				　　//此处 startIndex + i + 1;会出现翻页序号不连续， 主要是因为startIndex的原因,去掉即可。
				　　　　cell.innerHTML = startIndex + i + 1;
				　　　　//cell.innerHTML =  i + 1;
				　　}); 
				}
            });
            //查询
            $("#submitSearch").click(function () {
                jqtb.ajax.reload();
            });
			
			$("#refresh").click(function () {
                jqtb.ajax.reload();
            });
			
			$(".searchKey").keydown(function () {
				var e = event || window.event;
				if(e.keyCode == 13){
					jqtb.ajax.reload();
				}
            });
        });
	},
	methods: {
		reset:function(){
			$("#separator").val("");
			$("#dateBegin").val("");
			$("#dateEnd").val("");
		},
		turnTo:function(a,url){
			parent.addTab(a,url,a);
		},
		resetNow:function(){
			$(".searchKey").each(function(){
				$(this).val("");
			});
			$("#shop").val(0);
		},
		//当前页 全部页 按钮
		//在 data 内 有唯一一个变量 self.isAll 记录当前是 当前页 还是全部页 的状态
		nowPage:function(page){													
			var self = this;															
			if(page == "now"){
				//当前页											
				self.isAll = 0;	
				self.allPage = false;
				$("#currentAll1").prop("checked",false);
				if(self.now == false){
					$("#current1").prop("checked",true);
					$(".skin-minimal input[name='order']").iCheck('check');
					self.now = true;
				}else{
					$("#current1").prop("checked",false);
					$(".skin-minimal input[name='order']").iCheck('uncheck');
					self.now = false;
				}																					
			}else if(page == "all"){
				//全部页			
				self.now = false;
				$("#current1").prop("checked",false);														
				if(self.allPage == false){
					$("#currentAll1").prop("checked",true);
					$(".skin-minimal input[name='order']").iCheck('check');
					self.isAll = 1;
					self.allPage = true;
				}else{
					$("#currentAll1").prop("checked",false);
					$(".skin-minimal input[name='order']").iCheck('uncheck');
					self.isAll = 0;	
					self.allPage = false;
				}																						
			}																							
		},
		
		//发送待配货短信
		send:function(){
			var self = this;
			if($("input[name='order']").filter(':checked').length == 0){
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});																					
				return false;
			}
			
			var data = "";		
			if(self.isAll == 0){
				$("input[name='order']:checkbox").each(function(){	
					if(true == $(this).is(':checked')){				
						data += ($(this).val()+",");								
					}				
				});	
				data = data.substring(0,data.length-1);
			}else if(self.isAll == 1){
				data = self.tids;
			}
			
			$.ajax({
				url: '/index.php?m=system&c=notShipDeal&a=send',
				type: "POST",
				dataType:"json",
				data:{data:data},
				success:function(data){
						
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});	
					}else{
						layer.msg(data.msg,{
							icon: 0,
							time: 2000
						});	
					}
					
				}
			});
		},
	}
});
function delBtnThey(new_tid){
	$.ajax({
		url: '/index.php?m=WMS&c=theyReturned&a=delBtnThey',
		type: "POST",
		dataType:"json",
		data:{
			new_tid:new_tid
		},
		success:function(data){
			if(data.code == "ok"){
				layer.msg(data.msg,{
					icon: 1,
					time: 2000
				});
				jqtb.ajax.reload();
			}else{
				layer.msg(data.msg,{
					icon: 0,
					time: 2000
				});	
			}
		}
	});
}