var flow = new Vue({
	el: '#flow',
	data: {
		price:0,
	},
	mounted: function() {
		var self = this;
		
		$.ajax({
			url: "/index.php?m=system&c=finance&a=balance",
			data: {},
			dataType: "json",
			type: "POST",
			success: function (data) {
				self.price = data[0].price;
			}
		})
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  //时间选择器
				  laydate.render({
					elem: '#dateBegin'
					,type: 'datetime'
					,done: function(value, date, endDate){
						self.dateBegin = value;
					  }
				  });
				  
				  laydate.render({
					elem: '#dateEnd'
					,type: 'datetime'
					,done: function(value, date, endDate){
						self.dateEnd = value;
					}
				  });
				  
				  layer.load(2);
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=system&c=finance&a=getwaterDetail'
					
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'create_date', title: '日期',"width":240}
					  ,{field:'type', title: '类型',"width":180}
					  ,{field:'money', title: '金额（元）',"width":180}
					  ,{field:'gift_tid', title: '面单数',"width":180}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-245'
					,done: function(res, curr, count){
						layer.closeAll('loading');
					}
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
					  layer.load(2);
					  tab.reload({
						
						where: {
							separator:$("#separator").val(),
							dateBegin:self.dateBegin,
							dateEnd:self.dateEnd
						}
					  });
					}
				  };
				  
				  $('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					
					active[type] ? active[type].call(this) : '';
				  });
				  
				
			});
		});
		
		/*layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
            var $ = layui.jquery, element = layui.element, layer = layui.layer;
            var form = layui.form(), layer = layui.layer, layedit = layui.layedit, laydate = layui.laydate;
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
                "order": [[2, "desc"]], //默认排序
                "fnServerParams": function (aoData) {
                    aoData.push(
                         {"name": "separator", "value": $("#separator").val()},
                        {"name": "dateBegin", "value": $("#dateBegin").val()},
						{"name": "dateEnd", "value": $("#dateEnd").val()}
                    );
                },
                //请求url
                "sAjaxSource": "index.php?m=system&c=finance&a=getwaterDetail",
                //服务器端，数据回调处理
                "fnServerData": function (sSource, aDataSet, fnCallback) {
                    $.ajax({
                        "dataType": 'json',
                        "type": "post",
                        "url": sSource,
                        "data": aDataSet,
                        "success": function (resp) {
                            fnCallback(resp);
                        }
                    });
                },
                // 初始化表格
                "info": true,                           // 控制是否显示表格左下角的信息
                "stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
                "columns": [ //定义列数据来源  id, userid,username,mobile,create_login_time,STATUS
                    {'title': "序号", 'data': "sn","render": function (data,type,row,meta) {
						  return "";
					}},
                    {'title': "日期", 'data': "create_date"},
                    {'title': "类型", 'data': "type"},//隐藏
                    //{'title': "交易类型", 'data': ""},
                    {'title': "金额（元）", 'data': "money"},// 自定义列
                    {'title': "面单数", 'data': "sn","render": function (data,type,row,meta) {
						  return "";
					}} // 自定义列
                ],
                'columnDefs': [{
                    'targets': 0,
                    'searchable': false,
                    'orderable': false,
                    'width': '4%',
                    'className': 'dt-body-center',
                    'render': function (data, type, full, meta) {
                        return '<input type="checkbox" name="my-checkbox" id="' + data + '" class="my-checkbox">';
                    }
                },{
                    'targets': 4,
                    'searchable': false,
                    'orderable': false,
                    'width': '5%',
                    'className': 'dt-body-center',
                    'render': function (data, type, full, meta) {
                        
                    }
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
          
        });*/
		
		
	},
	methods: {
		reset:function(){
            var self = this; 
			$("#separator").val("");
			$("#dateBegin").html("");
			$("#dateEnd").html("");
			self.dateBegin = "";
			self.dateEnd = "";
		},
		turnTo:function(a,url){
			parent.addTab(a,url,a);
		}
	}
});