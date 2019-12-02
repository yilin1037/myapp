var flow = new Vue({
	el: '#flow',
	data: {
		
	},
	mounted: function() {
		var self = this;
		
		layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
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
                "order": [[1, "desc"]], //默认排序
                "fnServerParams": function (aoData) {
                    aoData.push(
                        {"name": "separator", "value": $(".form-control").val()},
                        {"name": "dateBegin", "value": $(".form-control").val()},
						{"name": "dateEnd", "value": $(".form-control").val()}
                    );
                },
                //请求url
                "sAjaxSource": "index.php?m=system&c=setup&a=getChildAccount",
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
                    {'title': "序号", 'data': "id"},
                    {'title': "到账金额（元）", 'data': ""},
                    {'title': "手续费（元）", 'data': ""},//隐藏
                    {'title': "状态", 'data': ""},
                    {'title': "收款支付宝", 'data': ""},// 自定义列
                    {'title': "操作说明", 'data': ""}, // 自定义列
					{'title': "申请时间", 'data': ""}, // 自定义列
					{'title': "完成时间", 'data': ""}
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
                }
            });
            //查询
            $("#submitSearch").click(function () {
                jqtb.ajax.reload();
            });
          
        });
		
		$.ajax({
			url: "",
			type: 'post',
			data: {},
			dataType: 'json',
			success: function (data) {
				
			}
		});
		
	},
	methods: {
		draw:function(){
			layer.open({
				type: 1,
				title: '我要提现',
				skin: 'layui-layer-rim', //加上边框
				area: ['850px', '400px'], //宽高
				shade: 0.3,
				content: $("#edit-pages"),
				cancel: function (index, layero) {
					//if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
					//layer.close(index)
					//$("#edit-pages").hide();
					// }
					//return false;
				}
			});
		},
		cancel:function(){
			layer.closeAll();
			$("#drawMoney").val("");
			$("#account").val("");
			$("#accountUser").val("");
			$("#verification").val("");
		}
	}
});