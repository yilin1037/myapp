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
		permData:[]           //记录权限选择情况
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
                "order": [[4, "desc"]], //默认排序
                "fnServerParams": function (aoData) {
                    aoData.push(
                        {"name": "keyword", "value": $(".layui-input").val()},
                        {"name": "keywor2", "value": $(".layui-input").val()}
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
                    {'title': "<input type='checkbox' class='my-checkbox'>", 'data': "id"},
                    {'title': "子账号ID", 'data': "show_userid"},
                    {'title': "子账号名称", 'data': "username"},//隐藏
                    {'title': "手机", 'data': "mobile"},
                    {'title': "创建时间", 'data': "create_login_time"},
                    {'title': "状态", 'data': "STATUS","render": function (data,type,row,meta) {
                          return data==1 ? "<span style='color:green;'>启用</span>" : "<span style='color:red;'>禁用</span>";
                    }}, // 自定义列
                    {'title': "操作", 'data': "id"} // 自定义列
                ],
                'columnDefs': [{
                    'targets': 0,
                    'searchable': false,
                    'orderable': false,
                    'width': '1%',
                    'className': 'dt-body-center',
                    'render': function (data, type, full, meta) {
                        return '<input type="checkbox" name="my-checkbox" id="' + data + '" class="my-checkbox">';
                    }
                }, {
                    'targets': 1,
                    'searchable': false,
                    'orderable': false,
                    'width': '',
                    'className': 'dt-body-center'
                },{
                    'targets': 5,
                    'searchable': false,
                    'orderable': false,
                    'width': '',
                    'className': 'dt-body-center'
                },  {
                    'targets': 6,
                    'searchable': false,
                    'orderable': false,
                    'width': '12%',
                    'className': 'dt-body-center',
                    'render': function (data, type, full, meta) {
                        //修改和查看数据源
                        tempjson[data] = full;
                        //修改和查看数据源
						//return '<a id=' + data + ' class="edit-page"    style="color: rgb(18, 150, 219); font-size: 14px; margin-left: 4px; cursor: pointer;"><img  src="images/edit.png" style="width: 13px; height: 13px;"> 编辑</a>';
                        return '<a id=' + data + ' class="edit-page"    style="color: rgb(18, 150, 219); font-size: 14px; margin-left: 4px; cursor: pointer;"><img  src="images/edit.png" style="width: 13px; height: 13px;"> 编辑</a><a id=' + data + ' class="perm-page"    style="color: rgb(18, 150, 219); font-size: 14px; margin-left: 4px; cursor: pointer;"><img  src="images/quanxian.png" style="width: 13px; height: 13px;"> 权限</a><br/><a id=' + data + ' class="shop-perm-page"    style="color: rgb(18, 150, 219); font-size: 14px; margin-left: 4px; cursor: pointer;"><img  src="images/quanxian.png" style="width: 13px; height: 13px;"> 店铺权限</a><a id=' + data + ' class="func-perm-page"    style="color: rgb(18, 150, 219); font-size: 14px; margin-left: 4px; cursor: pointer;"><img  src="images/yeshang.png" style="width: 13px; height: 13px;"> 功能权限</a>';
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
			
			$("#seach").keydown(function(){
				var e = event || window.event;
				if(e.keyCode == 13){
					jqtb.ajax.reload();
				}
			});
			
            //checkbox全选
            $(".my-checkbox").click(function () {
                var check = $(this).prop("checked");
                $(".my-checkbox").prop("checked", check);
            });
            //自定义验证规则
            form.verify({
                userid: function (value) {
                    if (value.length == "") {
                        return '子账号ID不能为空';
                    }
                },
                username: function (value) {
                    if (value.length == "") {
                        return '子账号名称不能为空';
                    }
                },
                mobile: function (value) {
                    if (value.length < 5) {
                        return '电话号码至少得5个字符';
                    }
                },password: function (value) {
                    if (value.length < 6) {
                        return '密码不能小于6位';
                    }
                },password1: function (value) {
                    if (value.length < 6) {
                        return '确认密码不能小于6位';
                    }
					if(value != $('#password').val())
					{
						return '两次输入密码不相同';	
					}
                }
				
            });
            //监听提交 添加修改
            form.on('submit(childAccount_addedit)', function (data) {

				
                if (data.field.id == 0) {

                        var re = pages.jqajax("/index.php?m=system&c=setup&a=addChildAccount", data.field);
                        jqtb.ajax.reload();
                    return false;

                } else {

                        var re = pages.jqajax("/index.php?m=system&c=setup&a=editChildAccount", data.field);
                        jqtb.ajax.reload();
                        //layer.closeAll();
                        return false;

                }
            });
            ///删除子账号
            $(document).on('click', '#batdel', function () {
                var r = false;
				layer.open({																																											
						title: '提示',																																										
						content: '确定删除吗？',																																						
						btn: ['确定', '取消'],																																								
						yes:function(index){																																										
							var idstr = '';
							$("input:checkbox[name='my-checkbox']:checked").each(function () {
								idstr = idstr + $(this).attr("id") + ',';
							});
							idstr = (idstr.substring(idstr.length - 1) == ',') ? idstr.substring(0, idstr.length - 1) : idstr;
							var re = pages.jqajax("/index.php?m=system&c=setup&a=delChildAccount", {'ids': idstr});
							jqtb.ajax.reload();
							layer.close(index);
							layer.msg('删除成功',{
								icon: 1,
								time: 2000
							});
						}																																													
					});
            })
            //open添加子账号
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
				pages.password = '';
				pages.password1 = '';
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
			
			$(document).on('click', '.table-manage', function () {
				layer.open({
					title :'管理网店子账号',
					type: 2,
					shade: 0.3,
					area: ['60%', '75%'],
					maxmin: false,
					content: '?m=system&c=setup&a=userOnline',
					success: function(layero, index){
						//var body = layer.getChildFrame('body', index);
						//var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
						//iframeWin.vueObj.loadOrders('',{});
					}
				});
			});
			

            //增加点击添加行
            // $('#dateTable').on('click', 'tr', function () {
            //
            //     var data = jqtb.row( this ).data();
            //     if($("#id"+data['id']).length>0 )
            //         $("#id"+data['id']).remove();
            //     else{
            //         $(this).after('<tr id="id'+data['id']+'" class="tr"><td colspan="7">22222</td></tr>');
            //     }
            //
            // } );

            //open修改子账号
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
				pages.password = '******';
				pages.password1 = '******';
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
			
			//设置子账号权限
			$(document).on('click', '.shop-perm-page', function () {
				var id = $(this).attr("id");
				$("input[name='shopPermCode']:checkbox").prop("checked", false);
				
				form.render('checkbox');
				//获取当前权限数据
				$.ajax({
					url:'/?m=system&c=setup&a=getShopPremList',
					dataType: 'json',
					type: "post",
					data:{
						id:id,
					},
					success:function(data){
						if(data){
							for(var i = 0; i < data.length; i++){
								$("input[name='shopPermCode']:checkbox").each(function(){
									if($(this).val() == data[i]){
										$(this).prop("checked","checked");
									}
								});
							}
							
							form.render('checkbox');
						}
					}
				})
                layer.open({
					type: 1,
					title: '店铺权限设置',
					skin: 'layui-layer-rim', //加上边框
					area: ['550px', '400px'], //宽高
					shade: 0.3,
					content: $("#addShopPermChoose"),
					btn: ['确定', '取消'],
					yes: function(index, layero){
						var shopPermCode = "";
						$("input[name='shopPermCode']:checkbox").each(function(){
							if(true == $(this).is(':checked')){
								shopPermCode += ($(this).val() + ",");
							}//拼接当前页的货品唯一码
						});
						shopPermCode = shopPermCode.substring(0, shopPermCode.length-1);
						
						$.ajax({
							url:'/?m=system&c=setup&a=saveShopPremList',
							dataType: 'json',
							type: "post",
							data:{
								id: id,
								data: shopPermCode,
							},
							success:function(data){
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
							}
						});
					}    
				});
			});
			
			//设置子账号功能权限
			$(document).on('click', '.func-perm-page', function () {
				var id = $(this).attr("id");
				$("input[name='funcPermCode']:checkbox").prop("checked", false);
				
				form.render('checkbox');
				//获取当前权限数据
				$.ajax({
					url:'/?m=system&c=setup&a=getFuncPremList',
					dataType: 'json',
					type: "post",
					data:{
						id:id,
					},
					success:function(data){
						if(data && data!='T' && data!='F'){
							for(var i = 0; i < data.length; i++){
								$("input[name='funcPermCode']:checkbox").each(function(){
									if($(this).val() == data[i]){
										$(this).prop("checked","checked");
									}
								});
							}
							form.render('checkbox');
						}else if(data=='F'){
							for(var i = 0; i < data.length; i++){
								$("input[name='funcPermCode']:checkbox").each(function(){
									if($(this).val() == data[i]){
										$(this).prop("checked","false");
									}
								});
							}
							form.render('checkbox');
						}else if(data=='T'){
							for(var i = 0; i < data.length; i++){
								$("input[name='funcPermCode']:checkbox").each(function(){
									$(this).prop("checked","false");
								});
							}
							form.render('checkbox');
						}
					}
				})
                layer.open({
					type: 1,
					title: '店铺权限设置',
					skin: 'layui-layer-rim', //加上边框
					area: ['550px', '400px'], //宽高
					shade: 0.3,
					content: $("#addFuncPermChoose"),
					btn: ['确定', '取消'],
					yes: function(index, layero){
						var funcPermCode = "";
						$("input[name='funcPermCode']:checkbox").each(function(){
							if(true == $(this).is(':checked')){
								funcPermCode += ($(this).val() + ",");
							}//拼接当前页的货品唯一码
						});
						funcPermCode = funcPermCode.substring(0, funcPermCode.length-1);
						
						$.ajax({
							url:'/?m=system&c=setup&a=saveFuncPremList',
							dataType: 'json',
							type: "post",
							data:{
								id: id,
								data: funcPermCode,
							},
							success:function(data){
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
							}
						});
					}    
				});
			});
			
            $(document).on('click', '.perm-page', function () {
                var id = $(this).attr("id");
				$("input[name='menuCode']:checkbox").prop("checked", false);
				
				form.render('checkbox');
				//获取当前权限数据
				$.ajax({
					url:'/?m=system&c=setup&a=getPremList',
					dataType: 'json',
					type: "post",
					data:{
						id:id,
					},
					success:function(data){
						if(data){
							for(var i = 0; i < data.length; i++){
								$("input[name='menuCode']:checkbox").each(function(){
									if($(this).val() == data[i]){
										$(this).prop("checked","checked");
									}
								});
							}
							
							form.render('checkbox');
						}
					}
				})
                layer.open({
					type: 1,
					title: '权限设置',
					skin: 'layui-layer-rim', //加上边框
					area: ['850px', '600px'], //宽高
					shade: 0.3,
					content: $("#addPermChoose"),
					btn: ['确定', '取消'],
					yes: function(index, layero){
						var menuCode = "";
						$("input[name='menuCode']:checkbox").each(function(){
							if(true == $(this).is(':checked')){
								menuCode += ($(this).val() + ",");
							}//拼接当前页的货品唯一码
						});
						menuCode = menuCode.substring(0, menuCode.length-1);
						
						$.ajax({
							url:'/?m=system&c=setup&a=savePremList',
							dataType: 'json',
							type: "post",
							data:{
								id: id,
								data: menuCode,
							},
							success:function(data){
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
							}
						});
					}    
				});
            });
			
			form.on('checkbox(shopMainBox)', function(data){
				var dataId = data.value;
				var menuId = data.elem.id;
				var inputIndex = menuId.replace('menuId_','');
				if(data.elem.checked){
					$("input[name='shopPermCode']").prop("checked","checked");
					$("#shopIdCheckBox").prop("title","全清");
				}else{
					$("input[name='shopPermCode']").prop("checked",false);
					$("#shopIdCheckBox").prop("title","全选");
				}
				
				form.render('checkbox');
			});
			
			form.on('checkbox(funcMainBox)', function(data){
				console.log(data);
				var dataId = data.value;
				var menuId = data.elem.id;
				var inputIndex = menuId.replace('menuId_','');
				if(data.elem.checked){
					$("input[name='funcPermCode']").prop("checked","checked");
					$("#funcIdCheckBox").prop("title","全清");
				}else{
					$("input[name='funcPermCode']").prop("checked",false);
					$("#funcIdCheckBox").prop("title","全选");
				}
				
				form.render('checkbox');
			});
			
			form.on('checkbox(mainBox)', function(data){
				//console.log(data.elem); //得到checkbox原始DOM对象
				//console.log(data.elem.checked); //是否被选中，true或者false
				//console.log(data.value); //复选框value值，也可以通过data.elem.value得到
				//console.log(data.othis); //得到美化后的DOM对象
				//console.log(data);
				var dataId = data.value;
				var menuId = data.elem.id;
				var inputIndex = menuId.replace('menuId_','');
				if(data.elem.checked){
					var permObj = $("#perm_" + dataId).find(".layui-inline");
					var permIndex = permObj.length;
					permObj.find("input").prop("checked","checked");
					pages.permData[inputIndex] = [];
					for(var i = 0; i < permIndex;i++){
						pages.permData[inputIndex].push(i);
					}
					updateBtn(pages.permData, dataId, inputIndex);
				}else{
					$("#perm_" + dataId).find(".layui-inline").find("input").prop("checked", false);
					pages.permData[inputIndex] = [];
					updateBtn(pages.permData, dataId, inputIndex);
				}
				
				form.render('checkbox');
			});    
			
			form.on('checkbox(childBox)', function(data){
				//console.log(data.elem.checked); //是否被选中，true或者false
				//console.log(data.value); //复选框value值，也可以通过data.elem.value得到
				var value = data.value;
				var menuObj = value.split('_');
				var menuIdObj = menuObj[0];
				var menuIdd = $("#perm_" + menuIdObj).attr("name");
				var menuId = menuIdd.replace('menuIdd_','');
				if(data.elem.checked){
					$("#menuId_" + menuId).prop("checked","checked");
				}else{
					var removeCheck = 'T';
					$("input[class='child_" + menuIdObj + "']:checkbox").each(function(){
						if(true == $(this).is(':checked')){
							var thisVal = $(this).val();
							var thisValObj = thisVal.split('_');
							var thisValFirst = thisValObj[0];
							if(thisValFirst == menuIdObj){
								removeCheck = 'F';
							}
						}
					});
					
					if(removeCheck == "T"){
						$("#menuId_" + menuId).prop("checked", false);
					}
				}
				form.render('checkbox');
			});
			
        });
    },
    methods: {
        //通用ajax
        test:function(){
            // alert(1111)
            // parent.parent.addTab('test','?m=system&c=setup&a=test','test');
        },
        jqajax: function (url, data) {
            $.ajax({
                url: url,
                data: data,
                dataType: "json",
                type: "POST",
                success: function (data) {
                    if (data.code == 'ok') {
                        
						layer.closeAll();
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
                    }
                    else {
                        layer.msg(data.msg,{
							icon: 0,
							time: 2000
						});
                    }
                },
                error: function () {
                    return "连接超时，请重新登录";
                }
            })
        },
		reset_now:function(){
			$("#seach").val("");
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

function updateBtn(data, dataId, inputIndex){
	var form = layui.form();
	
	for(var i=0;i < data.length; i++){
		if(data[i]){
			$("#perm_" + dataId).find(".layui-inline").find("input").prop("checked", false);
			for(var j=0;j<data[inputIndex].length;j++){
				$("#perm_" + dataId).find(".layui-inline").eq(data[inputIndex][j]).find("input").prop("checked","checked");
			}
		}
	}
	form.render('checkbox');
}
