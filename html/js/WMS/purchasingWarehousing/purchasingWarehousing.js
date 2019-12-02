var flow = new Vue({
	el: '#flow',
	data: {
		user:"",
		userid:"",
	},
	mounted: function() {
		var self = this;
		
		//获取操作员
		$.ajax({																				
			url: "/index.php?m=WMS&c=purchasingWarehousing&a=getUser",										
			type: 'post',																		
			data: {},																	
			dataType: 'json',																	
			success: function (data) {			
				self.user = data.username;	
				self.userid = data.userid;
			}																					
		});	
            
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
                "order": [[7, "desc"]], //默认排序
                "fnServerParams": function (aoData) {
                    aoData.push(
                        {"name": "title", "value": $("#title").val()},
                        {"name": "art", "value": $("#art").val()},
						{"name": "prd_no", "value": $("#prd_no").val()}
                    );
                },
                //请求url
				//index.php?m=goods&c=association&a=getData
                "sAjaxSource": "index.php?m=WMS&c=purchasingWarehousing&a=getData",
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
								$('.skin input').iCheck({
									checkboxClass: 'icheckbox_minimal',
									radioClass: 'iradio_minimal',
									increaseArea: '20%'
								});
							});
							
							/*$('#checkAll').on('ifChecked ifUnchecked', function(event){
								if (event.type == 'ifChecked') {
									$("input[name='order']").iCheck('check');																																		
								} else {																																														
									$("input[name='order']").iCheck('uncheck');																																		
								}																																																
							});*/
                        }
                    });
                },
                // 初始化表格
                "info": true,                           // 控制是否显示表格左下角的信息
                "stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
                "columns": [ //定义列数据来源  id, userid,username,mobile,create_login_time,STATUS
                    {'title': "", 'data': "r",'width':"16px","defaultContent": "","render":function(data,type,row,meta){
						return "<div class='skin' style='padding-left:1px;'><input type='checkbox' name='order'></div>";
					},"width":40},
                    {'title': "序号", 'data': "sr",'width':"40px","defaultContent": ""},
					{'title': "图片", 'data': "pic_path","defaultContent": "","render":function(data){
						if(data != ""){
							return "<div class='isShow' style='width:65px;height:65px;text-align:center;line-height:65px;position:relative;'><img src=" + data + " style='width:55px;height:55px;'></div>";
						}
						
					},"width":"65px"},
					{'title': "商品名称", 'data': "title","defaultContent": ""},
                    {'title': "商品编号", 'data': "prd_no","defaultContent": ""},
					{'title': "sku编码", 'data': "prd_sku_no","defaultContent": ""},
					{'title': "属性1", 'data': "sku_name1","defaultContent": ""},
					{'title': "属性2", 'data': "sku_name2","defaultContent": ""},
					{'title': "成本", 'data': "cost_price","defaultContent": ""},
					{'title': "入库数量", 'data': "","defaultContent": "","render":function(data){
						
						return "<input type='text' style='width:100%;border:1px solid white;outline:none;' onfocus='focusNow()' onblur='blurNow()'>";
						
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
                    'targets': 8,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center'
                },
				{
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
				　　api.column(1).nodes().each(function(cell, i) {

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
			
		
		
	},
	methods: {
		
		down:function(){
			var e = event || window.event;
			if(e.keyCode == 13){
				jqtb.ajax.reload();
			}
		}
		
	}
	
		
});

function focusNow(){
	$(event.target).css("border","1px solid #1e9fff");
}

function blurNow(){
	$(event.target).css("border","1px solid white");
}





