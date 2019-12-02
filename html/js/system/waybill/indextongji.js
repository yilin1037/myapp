var pages = new Vue({ //vue 模块入口
    el: '#app',
    data: {
        id: '',
        title1: '',
        price2: '',
        price3: '',
        price4: '',
        price5: '',
        price: ''
    },
    mounted: function () {
        var tempjson = new Array();
        var jqtb;
        //layui 模块 入口
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
                "order": [[3, "desc"]], //默认排序
                "fnServerParams": function (aoData) {
                    aoData.push(
                        {"name": "date1", "value": $(".date1").val()},
                        {"name": "date2", "value": $(".date2").val()}
                    );
                },
                //请求url
                "sAjaxSource": "index.php?m=system&c=goodslist&a=getgoodslist",
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
                    {'title': "日期", 'data': "title"},
                    {'title': "代发客户", 'data': "prd_no",'width':'100px'},
                    {'title': "昵称", 'data': "num_iid",'width':'100px'},
                    {'title': "快递", 'data': "title",'width':'100px'},
                    {'title': "发货类型", 'data': "title",'width':'100px'},
                    {'title': "发货网点", 'data': "title",'width':'100px'},
                    {'title': "代发商家", 'data': "title",'width':'100px'},
                    {'title': "昵称", 'data': "num_iid",'width':'100px'},
                    {'title': "面单数量", 'data': "title",'width':'100px'},
                    {'title': "单价（元）", 'data': "title",'width':'100px'},
                    {'title': "小计（元）", 'data': "title",'width':'100px'},
                ],
                'columnDefs': [
				
				],
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
                }
            });
            //查询
            $("#submitSearch").click(function () {
                jqtb.ajax.reload();
            });
            //checkbox全选
            $(".my-checkbox").click(function () {
                var check = $(this).prop("checked");
                $(".my-checkbox").prop("checked", check);
            });
            //自定义验证规则
            form.verify({
                userid: function (value) {
                    if (value.length < 5) {
                        return '子账号ID至少得5个字符啊';
                    }
                },
                username: function (value) {
                    if (value.length < 5) {
                        return '子账号名称至少得5个字符啊';
                    }
                },
                mobile: function (value) {
                    if (value.length < 5) {
                        return '电话号码至少得5个字符啊';
                    }
                }
            });
            //监听提交 添加修改
            form.on('submit(childAccount_addedit)', function (data) {
               
						$.ajax({
							url: "/index.php?m=system&c=goodslist&a=editgoods",
							data: {'data': data.field},
							dataType: "json",
							type: "POST",
							success: function (data) {
								if(data.code=='ok'){
									msg(data.msg,'#dff0d8','#3c763d');
									jqtb.ajax.reload();
									layer.closeAll();
									return false;
								}else{
									msg(data.msg,'#dff0d8','#3c763d');
									return false;
								}
							},
							error: function () {
							}
						})
					return false;
            });
            form.on('submit(childAccount_cancel)', function (data) {
						jqtb.ajax.reload();
                        layer.closeAll();
						return false;
            });
            //删除
            $(document).on('click', '#batdel', function () {
                var r = confirm("确定删除吗？")
                if (r == true) {
                    var idstr = '';
                    $("input:checkbox[name='my-checkbox']:checked").each(function () {
                        idstr = idstr + $(this).attr("id") + ',';
                    });
                    idstr = (idstr.substring(idstr.length - 1) == ',') ? idstr.substring(0, idstr.length - 1) : idstr;
                    
					 $.ajax({
						url: "/index.php?m=system&c=goodslist&a=delgoods",
						data: {'ids': idstr},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code=='ok'){
								msg(data.msg,'#dff0d8','#3c763d');
							}else{
								msg(data.msg,'#dff0d8','#3c763d');
							}
							jqtb.ajax.reload();
							return false;
						},
						error: function () {
						}
					})
                } else {
                    return false;
                }
            })
			$(document).on('click', '#gettbgoods', function () {
					 $.ajax({
						url: "/index.php?m=system&c=goodslist&a=gettbgoods",
						data: {},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code=='ok'){
								msg(data.msg,'#dff0d8','#3c763d');
							}else{
								msg(data.msg,'#dff0d8','#3c763d');
							}
							jqtb.ajax.reload();
							return false;
						},
						error: function () {
						}
					})
                return false;
            })
            
            //open修改
            $(document).on('click', '.edit-page', function () {
                
                var id = $(this).attr("id");
                pages.id = id;
                pages.title = tempjson[id].title;
                pages.price = tempjson[id].price;
                pages.price1 = tempjson[id].price1;
                pages.price2 = tempjson[id].price2;
                pages.price3 = tempjson[id].price3;
                pages.price4 = tempjson[id].price4;
                pages.price5 = tempjson[id].price5;
                layer.open({
                    type: 1,
                    title: '修改货品',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['500px', '500px'], //宽高
                    shade: 0.3,
                    content: $("#edit-pages"),
                    cancel: function (index, layero) {
                        
                    }
                });
                form.render('checkbox');
            });
        });
    },
    methods: {
        //通用ajax
        jqajax: function (url, data) {
            $.ajax({
                url: url,
                data: data,
                dataType: "json",
                type: "POST",
                success: function (data) {
                        return data;
                },
                error: function () {
                    return "连接超时，请重新登录";
                }
            })
        }
    },
    watch: {
        //双向绑定
        userid: function (curVal, oldVal) {
            //alert(curVal)
            //alert(oldVal)
        },
        STATUS: function (curVal, oldVal) {
            // alert(curVal)
            //alert(oldVal)
        }
    }
})


