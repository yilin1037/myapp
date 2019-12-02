var pages = new Vue({ //vue 模块入口
    el: '#app',
    data: {
        id: '',
        username: '',
        userid: '',
        mobile: '',
        STATUS: '',
        title: '',
        buttonname: '',
		dateBegin:"",
		dateEnd:"",
    },
    mounted: function () {
		var self = this;
        var tempjson = new Array();
        var jqtb;
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  //时间选择器
				  laydate.render({
					elem: '#dateBegin'
					,type: 'date'
					,done: function(value, date, endDate){
						self.dateBegin = value;
					  }
				  });

				  laydate.render({
					elem: '#dateEnd'
					,type: 'date'
					,done: function(value, date, endDate){
						self.dateEnd = value;
					}
				  });
				  
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=system&c=message&a=getdxaddlist'
					
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'no', title: '编号',"width":300}
					  ,{field:'payment', title: '充值金额',"width":200}
					  ,{field:'pay_count', title: '短信数量',"width":200}
					  ,{field:'create_time', title: '充值时间',"width":200}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-75'
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
					  
					  tab.reload({
						
						where: {
							date1:self.dateBegin,
							date2:self.dateEnd
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
		
		
        //layui 模块 入口
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
                "order": [[4, "desc"]], //默认排序
                "fnServerParams": function (aoData) {
                    aoData.push(
                        {"name": "date1", "value": $(".date1").val()},
                        {"name": "date2", "value": $(".date2").val()}
                    );
                },
                //请求url
                "sAjaxSource": "index.php?m=system&c=message&a=getdxaddlist",
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
                    {'title': "序号", 'data': "id",'width':'50px'},
                    {'title': "编号", 'data': "no",'width':'30%'},
                    {'title': "充值金额", 'data': "payment",'width':'15%',"render": function (data,type,row,meta) {
                          return  data+' 元' ;
                    }},//隐藏
                    {'title': "短信数量", 'data': "pay_count",'width':'15%',"render": function (data,type,row,meta) {
                          return  data+' 条' ;
                    }},
                    {'title': "充值时间", 'data': "create_time","render": function (data,type,row,meta) {
                          return new Date(parseInt(data) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
                    }}
                ],
                'columnDefs': [],
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
                if (data.field.id == 0) {
                    var r = confirm("确定添加吗？")
                    if (r == true) {
                        var re = pages.jqajax("/index.php?m=system&c=setup&a=addChildAccount", data.field);
                        jqtb.ajax.reload();
                        layer.closeAll();
                        return false;
                    }
                    else {
                        return false;
                    }
                } else {
                    var r = confirm("确定修改吗？")
                    if (r == true) {
                        var re = pages.jqajax("/index.php?m=system&c=setup&a=editChildAccount", data.field);
                        jqtb.ajax.reload();
                        layer.closeAll();
                        return false;
                    } else {
                        return false;
                    }
                }
            });
            ///删除子账号
            $(document).on('click', '#batdel', function () {
                var r = confirm("确定删除吗？")
                if (r == true) {
                    var idstr = '';
                    $("input:checkbox[name='my-checkbox']:checked").each(function () {
                        idstr = idstr + $(this).attr("id") + ',';
                    });
                    idstr = (idstr.substring(idstr.length - 1) == ',') ? idstr.substring(0, idstr.length - 1) : idstr;
                    var re = pages.jqajax("/index.php?m=system&c=setup&a=delChildAccount", {'ids': idstr});
                    layer.alert("删除成功！")
                    jqtb.ajax.reload();
                    return false;
                } else {
                    return false;
                }
            })
            ///open添加子账号
            $(document).on('click', '.table-pages', function () {
                // layer.open({
                //     type: 2,
                //     title: '添加子账号',
                //     shadeClose: true,
                //     shade: 0.8,
                //     area: ['100%', '100%'],
                //     content: 'index.php?m=system&c=setup&a=updatepassword' //iframe的url
                // });
                pages.username = '';
                pages.userid = '';
                pages.mobile = '';
                pages.STATUS = true;
                pages.id = 0;
                pages.title = "添加子账号";
                pages.buttonname = "确定添加";
                $("#userid").prop("readonly", false);  //用户id 修改只读
                layer.open({
                    type: 1,
                    title: '添加子账号',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['60%', '75%'], //宽高
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
                ////很重要 不然vue付不了控件值
                form.render('checkbox');
            });
            ///open修改子账号
            $(document).on('click', '.edit-page', function () {
                // layer.open({
                //     type: 2,
                //     title: '修改子账号',
                //     shadeClose: true,
                //     shade: 0.8,
                //     area: ['100%', '100%'],
                //     content: 'index.php?m=system&c=setup&a=updatepassword' //iframe的url
                // });
                var id = $(this).attr("id");
                pages.id = id;
                pages.username = tempjson[id].username;
                pages.userid = tempjson[id].userid;
                pages.mobile = tempjson[id].mobile;
                pages.STATUS = tempjson[id].STATUS == 1 ? true : false;
                /////layui 控件只能用js复制 vue赋值不好用 而且要重新渲染界面
                $("#userid").prop("readonly", true);  //用户id 修改只读
                $("#STATUS").prop("checked", pages.STATUS);

                pages.title = "修改子账号";
                pages.buttonname = "确定修改";
                layer.open({
                    type: 1,
                    title: '修改子账号',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['60%', '75%'], //宽高
                    shade: 0.3,
                    content: $("#edit-pages"),
                    cancel: function (index, layero) {
                        //if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
                        //layer.close(index)
                        //$("#edit-pages").hide();
                        // }
                        // return false;
                    }
                });
                ////很重要 不然vue付不了控件值
                form.render('checkbox');
            });
        });*/
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
                    if (data.code == 'ok') {
                        return "ok";
                    }
                    else {
                        return "no";
                    }
                },
                error: function () {
                    return "连接超时，请重新登录";
                }
            })
        },
		reset_now:function(){
			var self = this;
			$("#dateBegin").html("");
			$("#dateEnd").html("");
			self.dateBegin = "";
			self.dateEnd = "";
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


