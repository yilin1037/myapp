var vueObj = new Vue({
    el: '#app',
    data: {
        expressItems: paramObject.expressObj,
        shopItems: paramObject.shopObj,
		dateBegin:'',
		dateEnd:'',
    },
    mounted: function () {
		var self = this;
        var tempjson = new Array();
        var jqtb;
        //layui 模块 入口
		var toDayWeek = $("#toDayWeek").val();
		self.dateBegin = toDayWeek;
		var toDayTime = $("#toDayTime").val();
		self.dateEnd = toDayTime;
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate
					  ,formSelects = layui.formSelects;
				  formSelects.render();
				  //时间选择器
				  laydate.render({
					elem: '#dateBegin'
					,type: 'datetime'
					,value: toDayWeek
					,done: function(value, date, endDate){
						self.dateBegin = value;
					  }
				  });

				  laydate.render({
					elem: '#dateEnd'
					,type: 'datetime'
					,value:toDayTime
					,done: function(value, date, endDate){
						self.dateEnd = value;
					}
				  });
				  layer.load(2);
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=report&c=sendOrderDetail&a=sendOrderDetailList'
					,where:  {
						dateBegin: jQuery("#toDayWeek").val(),
						dateEnd: jQuery("#toDayTime").val(),
					}
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'payment_time', title: '付款时间',"width":200}
					  ,{field:'new_tid', title: '订单号',"width":200}
					  ,{field:'buyer_nick', title: '买家昵称',"width":100}
					  ,{field:'express_name', title: '快递',"width":100}
					  ,{field:'express_no', title: '运单号',"width":100}
					  ,{field:'shopname', title: '店铺',"width":100}
					  ,{field:'send_status_name', title: '状态',"width":100}
					  ,{field:'web_status_name', title: '线上状态',"width":100}
					  ,{field:'payment', title: '实付金额',"width":100}
					  ,{field:'cost', title: '拿货金额',"width":100}
					  ,{field:'express_fee', title: '运费成本',"width":100}
					  ,{field:'profit', title: '利润',"width":100}
					  ,{field:'profit_rto', title: '利润率',"width":80}
					  ,{field:'fee', title: '扣费',"width":80}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-145'
					,done: function(res, curr, count){
						layer.closeAll('loading');
					}
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
					  layer.load(2);
					  tab.reload({
						
						where: {
							send_status:$("#send_status").val(),
							dateBegin:self.dateBegin,
							dateEnd:self.dateEnd,
							express_type:$("#express_type").val(),
							express_no:$("#express_no").val(),
							//shop_id:$("#shop_id").val(),
							shop_id:formSelects.value('select1', 'valStr'),
							tid:$("#tid").val()
						}
					  });
					}
				  };
				  
				  $('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					
					active[type] ? active[type].call(this) : '';
				  });
				  
				  $('.key_search').on('keydown', function(){
					  var e = event || window.event;
					  if(e.keyCode == 13){
						  var type = $(this).data('type');
					
						  active[type] ? active[type].call(this) : '';
					  }
					
				  });
				  
				  
				
			});
		});
		
        /*layui.use(['element', 'layer', 'form', 'laydate'], function () {
            var $ = layui.jquery, element = layui.element, layer = layui.layer;
            var form = layui.form(), layer = layui.layer, layedit = layui.layedit, laydate = layui.laydate;
            // 初始化表格
            jqtb = $('#dateTable').DataTable({  //dateTable 模块 入口
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
                        {"name": "send_status", "value": $("#send_status").val()},
                        {"name": "dateBegin", "value": $("#dateBegin").val()},
                        {"name": "dateEnd", "value": $("#dateEnd").val()},
                        {"name": "express_type", "value": $("#express_type").val()},
                        {"name": "express_no", "value": $("#express_no").val()},
                        {"name": "shop_id", "value": $("#shop_id").val()},
                        {"name": "tid", "value": $("#tid").val()}
                    );
                },
                //请求url
                "sAjaxSource": "index.php?m=report&c=sendOrderDetail&a=sendOrderDetailList",
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
                "columns": [ //定义列数据来源  
                    {'title': "序号", 'data': "index"},
                    {'title': "付款时间", 'data': "payment_time"},
                    {'title': "订单号", 'data': "new_tid", "render":function (data, type, row, meta) {
                        return row.new_tid;
                    }},
                    {'title': "买家昵称", 'data': "buyer_nick"},
                    {'title': "快递", 'data': "express_type", "render":function (data, type, row, meta) {
                        return row['express_name'];
                    }},
                    {'title': "运单号", 'data': "express_no"},
                    {'title': "店铺", 'data': "shopid", "render":function (data, type, row, meta) {
                        return row['shopname'];
                    }} ,
                    {'title': "状态", 'data': "send_status", "render":function (data, type, row, meta) {
                        return row['send_status_name'];
                    }},
                    {'title': "线上状态", 'data': "web_status", "render":function (data, type, row, meta) {
                        return row['web_status_name'];
                    }},
                    {'title': "扣费", 'data': "fee"}
                ],
                'columnDefs': [{
                    "width": "5%", "targets": 0 ,
                    'searchable': false,
                    'orderable': false
                },     
                {
                    'targets': 8,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center',
                    'render': function (data, type, full, meta) {
                        ///修改和查看数据源
                        tempjson[full['id']] = full;
                        ///修改和查看数据源
                        if(full['gift_tid'] == '1'){
                            return '赠送';
                        }else{
                            return data;
                        }
                    }
                },
				{
                    'targets': 9,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center',
                    'render': function (data, type, full, meta) {
                        if(data == ""){
							return 0;
						}else{
							return data;
						}
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
        });
        //查询
        $("#submitSearch").click(function () {
            jqtb.ajax.reload();
        });*/
        //导出
        $("#submitExcel").click(function () {
            var indexLoad = layer.load();
			layer.load(2);
            execAjax({
                m:'report',
                c:'sendOrderDetail',
                a:'exportTakeSendOrderDetail',
                data:{},
                success:function(data){
                    layer.close(indexLoad);
                    if(data['code'] == 'ok'){
                        $("#excelFileId").val(data['id']);
                        $("#excelForm").submit();
                    }else{
                        layer.msg(data['msg'],{
        					icon: 2,
        					time: 2000
        				});	
                    }
					layer.closeAll('loading');
                }
            });
        });
    },
    methods: {
        resetNow:function(){
			$("#dateBegin").html("");
			$("#dateEnd").html("");
			$("#send_status").val("1");
			$("#express_type").val("");
			$("#express_no").val("");
			$("#tid").val("");
			self.dateBegin = "";
			self.dateEnd = "";
			layui.use(['table','element','layer','form','laydate'], function(){
				  var laydate = layui.laydate
					  ,formSelects = layui.formSelects;
				  formSelects.render();
				  });
		}
    }
});