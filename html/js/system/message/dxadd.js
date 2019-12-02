var pages = new Vue({ //vue 模块入口
    el: '#app',
    data: {
        id: '',
        zfb: '',
        wx: '',
        send_tel: '',
        ratio: '',
        title: '',
		DXSUM: '',
		DXNAME: '',
		zftype: '',
		buttonname:'提交',
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
                
				"dom": '<"top">rt<"bottom"flp><"clear">',
				"autoWidth": false,                     // 自适应宽度
				"paging": false,
				"pagingType": "full_numbers",
				"lengthMenu": [5, 10, 25, 50],
				"processing": true,
				"ordering":  false,
				"draw":true,
				"searching": false, //是否开启搜索
				"serverSide": true,//开启服务器获取数据
				"order": [[3, "desc"]], //默认排序
                "fnServerParams": function (aoData) {
                    aoData.push(
                        {"name": "keyword", "value": $(".layui-input").val()},
                        {"name": "keywor2", "value": $(".layui-input").val()}
                    );
                },
                //请求url
                "sAjaxSource": "index.php?m=system&c=message&a=getdxadd",
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
					{'title':'序号','data':'id','width': '50px'},
					{'title':"充值短信包",'data':"DXSUM",'width': '150px',"render": function (data,type,row,meta) {
                          return data+' 条' ;
                    }},
					{'title':"市场价",'data':"DXOLD",'width': '150px',"render": function (data,type,row,meta) {
                          return '<div style="text-decoration: line-through;">'+data+' 元</div>' ;
                    }},
					{'title':"优惠价",'data':"DXNAME",'width': '150px',"render": function (data,type,row,meta) {
                          return  data+' 元' ;
                    }},
					{'title':"短信单价",'data':"DXDJ",'width': '150px'},
					{'title':"操作",'data':"id",'width': '150px'},
                ],
				//text-decoration: line-through;
                'columnDefs':  [{
						'targets': 5,
						'searchable': false,
						'orderable': false,
						'width': '150px',
						'className': 'dt-body-center',
						'render': function (data, type, full, meta) {
							tempjson[full.id] = full;
							return '<a id=' + full.id + ' class="layui-btn layui-btn-warm edit-page" >立即购买</a>';
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
							url: "/index.php?m=system&c=message&a=savedxadd",
							type: "POST",
							dataType:"json",
							data:{data:data.field},
							success:function(data){
								
								layer.closeAll();
								var zftypeStr = '支付宝';
        						if(data['zftype']=='wx'){
        							zftypeStr = '微信'
        						}
								$('#imgpach').attr('src',"images/"+data['imageUrl']+"?"+getTimeStamp(true));
								console.log(data);
								layer.open({
									type: 1,
									title: '请用'+zftypeStr+'扫描二维码支付',
									skin: 'layui-layer-rim', //加上边框
									area: ['60%', '75%'], //宽高
									shade: 0.3,
									content: $("#add-price"),
									cancel: function (index, layero) {
										
									}
								});
							}
						});
						return false;
						
            });
			
			form.on('submit(pricesearch)', function (data) {
						
						layer.closeAll();
								
						return false;
						
            });
			form.on('checkbox', function(data){
				console.log(data.elem.id)
				console.log(data.elem.checked)
				$(".province"+data.elem.id+" input:checkbox").prop("checked", data.elem.checked)
				form.render('checkbox');
			
			})
			 form.on('switch(switchszfb)', function(data){
				  console.log(data);
				  
				  $("#wx").prop("checked", !data.elem.checked)
				  if(data.elem.checked){
					pages.zftype = 'zfb'; 
				  }else{
					pages.zftype = 'wx';   
				  }
				 
				  
				  form.render('checkbox');
				});
			form.on('switch(switchwx)', function(data){
				  console.log(data);
				  
				  $("#zfb").prop("checked", !data.elem.checked)
				  if(data.elem.checked){
					pages.zftype = 'wx'; 
				  }else{
					pages.zftype = 'zfb';   
				  }
				  form.render('checkbox');
				});	
				$(document).on('click', '.delete', function () {
						var idstr='';
						 $("input:checkbox[name='my-checkbox']:checked").each(function() {
							 idstr=idstr+$(this).attr("id")+',';
						 });
						idstr=(idstr.substring(idstr.length-1)==',')?idstr.substring(0,idstr.length-1):idstr;
						$.ajax({
								url: '/index.php?m=system&c=setup&a=deleteExpress',
								type: "POST",
								dataType:"json",
								data:{ids:idstr},
								success:function(data){
								jqtb.ajax.reload();
								}
							});
				});
            
            
            $(document).on('click', '.table-address', function () {
                
				var id = $(this).attr("id");
				console.log(id)
				pages.addressid = id;
				$(".province input:checkbox").prop("checked", false)
				
				$.ajax({
							url: '/index.php?m=system&c=setup&a=getcitys',
							type: "POST",
							dataType:"json",
							data:{id:id},
							success:function(data){
									 for(var i=0;i<data.length;i++){
									 $("#"+data[i].city_code+"").prop("checked", true);
									 }
								form.render('checkbox');
								layer.open({
									type: 1,
									title: '修改不送区域',
									skin: 'layui-layer-rim', //加上边框
									area: ['90%', '90%'], //宽高
									shade: 0.3,
									content: $("#table-address"),
									cancel: function (index, layero) {
										//if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
										//layer.close(index)
										//$("#edit-pages").hide();
										// }
										// return false;
									}
								});
								
							}
						});
							
				
                //很重要 不然vue付不了控件值
                
            });
			
            $(document).on('click', '.edit-page', function () {
                
                var id = $(this).attr("id");
				pages.id = id;
				// pages.assist_print = tempjson[id].assist_print;
				// pages.send_username = tempjson[id].send_username;
				// pages.send_tel = tempjson[id].send_tel;
				// pages.ratio = tempjson[id].ratio;
				// pages.status = tempjson[id].status == 0 ? true : false;
				// pages.default = tempjson[id].default == 1 ? true : false;
				// $("#status").prop("checked", pages.status);
				// $("#default").prop("checked", pages.default);
				// var arr = tempjson[id].send_shopids.split(",");
				// $(".shoplist input:checkbox").prop("checked", false)
				
				// for(var i=0;i<arr.length;i++){
					// $("#"+arr[i]+"").prop("checked", true);
				// }
				pages.zftype = 'zfb';
				pages.DXSUM = tempjson[id].DXSUM;
				pages.DXNAME = tempjson[id].DXNAME;
				$("#zfb").prop("checked", true)
				$("#wx").prop("checked", false)
                layer.open({
                    type: 1,
                    title: '请选择充值方式',
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
                //很重要 不然vue付不了控件值
                form.render('checkbox');
            });
			
            $(document).on('click', '.adsbigclick', function () {
                var id = $(this).attr("id");
				if($("."+id).css("display")=="block"){
					$("."+id).hide()
                  }else{
					$("."+id).show()
				  }
            });
			$(document).on('click', '.table-taobao', function () {
					$.ajax({
							url: '/index.php?m=system&c=setup&a=getExpressTaobao',
							type: "POST",
							dataType:"json",
							data:{},
							success:function(data){
								console.log(data)
							}
						});
				
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


