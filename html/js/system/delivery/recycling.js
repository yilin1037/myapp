var flow = new Vue({
    el: '#app',
    data: {
        express_no:'',
        express_name:'',
        show_tid:'',
        send_status_text:'',
        receiver_name:'',
        address:'',
        tid:'',
        express_form_text:'',
        new_tid:'',
        tableIns:{},
        express_no_search:''
    },
    mounted: function () {
        var self = this;
        layui.use(['form', 'jquery','table'], function() {
            var $ = layui.jquery;
            var form = layui.form;
            var table = layui.table;

            //搜索
            form.on('submit(formDemo2)', function(data){
                var formData = data.field;
                //alert(JSON.stringify(formData));
                //formData = JSON.stringify(formData);
                $.ajax({
                    url: "/index.php?m=system&c=delivery&a=getExpressNoInfo",
                    async: false,
                    type: "post",
                    dataType: "json",
                    data: formData,
                    success: function (json) {
                        if(json.show_tid == ''){
                            layer.msg("未查询到数据",{
                                icon: 2,
                                time: 3000
                            });
                        }

                        console.log(json);
                        self.express_no = json.express_no;
                        self.express_name = json.express_name;
                        self.show_tid = json.show_tid;
                        self.send_status_text = json.send_status_text;
                        self.receiver_name = json.receiver_name;
                        self.address = json.address;
                        self.express_form_text = json.express_form_text;
                        self.tid = json.tid;
                        self.new_tid = json.new_tid;
                        self.express_no_search = '';

                    }
                });
                return false;
            });

            self.tableIns = table.render({
                elem: '#demo'
                ,url: "/index.php?m=system&c=delivery&a=getExpressRecovery" //数据接口
                ,page: true //开启分页
                ,limit: 20
                ,cols: [[ //表头
                     {field: 'express_no', title: '快递单号', width:'20%'}
                    ,{field: 'express_name', title: '快递公司', width:'20%', sort: true}
                    ,{field: 'express_form_text', title: '面单来源', width:'30%'}
                    ,{field: 'recovery_time_format', title: '回收时间', width: '30%'}
                ]]
            });


        });



    },
    methods: {
        expressCancel:function(){
            var self = this;
            if(self.new_tid == '' || self.new_tid == null || self.new_tid == undefined){
                layer.msg("请先查询快递单号",{
                    icon: 2,
                    time: 3000
                });
                return false;
            }
            //return false;
            $.ajax({
                url: "/index.php?m=system&c=delivery&a=expressCancel",
                type: 'post',
                data: {tid: self.new_tid},
                dataType: 'json',
                success: function (data) {
                    if(data.code == "ok"){
                        layer.msg("回收成功",{
                            icon: 1,
                            time: 2000
                        });
                    }else if(data.code == "error"){
                        layer.msg(data.msg,{
                            icon: 2,
                            time: 3000
                        });
                    }
                    self.tableIns.reload();
                    $("#express_no").focus();
                }
            });
        },
		
        loadOrders: function (new_tid, dataSpecial) {
            vueObj.dataSpecial = dataSpecial;
            if (new_tid) {
				console.log(new_tid)
                $.ajax({																																													//===========
                    url: "/index.php?m=system&c=delivery&a=getOrders",																																		//===========
                    type: 'post',																																											//===========
                    data: {new_tid: new_tid},																																												//===========
                    dataType: 'json',																																										//===========
                    success: function (data) {
						console.log(data)
                        $("#express").val(data['ordersObj']['express']);
                        $("#mobile").val(data['ordersObj']['mobile']);
                        $("#receiver_address").val(data['ordersObj']['receiver_address']);
                        $("#receiver_state").attr('data-province', data['ordersObj']['receiver_state']);
                        $("#receiver_city").attr('data-city', data['ordersObj']['receiver_city']);
                        $("#receiver_district").attr('data-district', data['ordersObj']['receiver_district']);
                        $("#receiver_name").val(data['ordersObj']['receiver_name']);
                        $("#buyer_name").val(data['ordersObj']['buyer_nick']);
                        $("#remark").val(data['ordersObj']['remark']);
                        $("#seller_memo").val(data['ordersObj']['seller_memo']);
                        $("#storage").val(data['ordersObj']['wh']);
                        $("#shopid").val(data['ordersObj']['shopid']);
                        $('#distpicker').distpicker();
                        cbProductRows(data['itemsObjs']);
						
                    }																																														//===========
                });
            } else {
                $('#distpicker').distpicker();
            }
        },
        itmesTable: function () {
			this.loadOrders('',{});
            var table = layui.table;
            tableParam['where'] = {
                key: ''
            };
            if (!vueObj.tableObj) {
                vueObj.tableObj = table.render(tableParam);
            } else {
                vueObj.tableObj.reload(tableParam);
            }
        },
        openSelectProduct: function () {
            layer.open({
                title: '选择商品',
                type: 2,
                shade: false,
                area: ['880px', '620px'],
                maxmin: false,
                content: '?m=widget&c=selectProduct&a=index'
            });
        },
        fastSelectProduct: function () {
            var timestamp = Date.parse(new Date());
            $("#pages1-newtimestramp").val(timestamp);
            fastClear();
            layer.open({
                type: 1,
                title: '快速新增商品',
                skin: 'layui-layer-rim', //加上边框
                area: ['40%', '80%'], //宽高
                shade: 0.3,
                content: $("#edit-pages1"),
                btn: ['确定', '取消'],
                success: function (layero, index) {
                    $("#pages1-prd_no").focus();
                },
                yes: function (index, layero) {
                    if ($("#pages1-prd_no").val() == "") {
                        layer.msg('请先录入商品编号', {
                            icon: 0,
                            time: 2000
                        });
                        return false;
                    }

                    if ($('#pages1-title').val() == '') {
                        $('#pages1-title').val($("#pages1-prd_no").val());
                    }

                    if ($("#pages1-num").val() == "" || $("#pages1-num").val() == 0) {
                        layer.msg('请先填写商品的数量', {
                            icon: 0,
                            time: 2000
                        });
                        return false;
                    }

                    var num = $('#pages1-num').val();
                    num = parseFloat(num);
                    if (isNaN(num)) {
                        num = 0;
                    }

                    var price = $('#pages1-price').val();
                    price = parseFloat(price);
                    if (isNaN(price)) {
                        price = 0;
                    }
                    var sum_price = num * price;

                    tableParam.data.push({
                        temp_id: getTimeStamp(true),
                        prd_no: $('#pages1-prd_no').val(),
                        title: $('#pages1-title').val(),
                        sku_name: $('#pages1-sku_name').val(),
                        num: num,
                        price: price,
                        image_url: $('#pages1-pic_path').val(),
                        old_image_url: $('#pages1-pic_path').val(),
                        sum_price: sum_price,
                        take_price: $('#pages1-take_price').val(),
                    });

                    vueObj.itmesTable();
                    fastClear();
                    $("#pages1-prd_no").focus();
                },
                cancel: function (index, layero) {

                }
            });
        },
        getwxxc: function () {
            fastClear();
            layer.open({
                type: 1,
                title: '相册快速选择',
                page: false,
                area: ['100%', '100%'], //宽高
                content: $("#edit-pages-xc"),

            });
            layui.use(["jquery", "upload", "form", "table", "layer", "element", "laydate"], function () {
                $ = layui.jquery;
                var element = layui.element,
                    layer = layui.layer,
                    upload = layui.upload,
                    form = layui.form,
                    laydate = layui.laydate,
                    table2 = layui.table;

                table2.render({
                    elem: '#xiangce'
                    , url: '/index.php?m=system&c=delivery&a=getOrdersxc'
                    , cols: [[

                        {field: 'img', title: '图片', "width": 400, fixed: true},
                        {field: 'word', title: '描述', "width": 700,
                            templet: function(d){
                                    return '' + d.word +''
                             }, fixed: true},

                    ]]
                    , id: 'xiangce'
                    , page: false
                    , height: 'full'
                    , done: function (res, curr, count) {
                        layui.use(['jquery'], function () {
                            var $ = jQuery = layui.$;
                            $("div").each(function (i, e) {
                                $(this).click(function (e) {
                                    return false;
                                })

                            })

                            $("img").each(function (i, e) {

                                $(this).click(function (e) {
                                    var it=this;
                                    if($(this).parent().parent().next().children()){
                                        $.ajax({
                                            url: "/index.php?m=system&c=delivery&a=getOrdersxctext",
                                            data: {text: $(this).parent().parent().next().children().text()},
                                            type: "POST",
                                            async: true,
                                            dataType: 'json',
                                            success: function (data) {
                                                $('#pages1-num').val(data['pages1-num']);
                                                $('#pages1-prd_no').val(data['pages1-prd_no']);
                                                $('#pages1-price').val(data['pages1-price']);
                                                $('#pages1-sku_name').val(data['pages1-sku_name']);
                                                $('#pages1-title').val(data['pages1-title']);
                                                $('#pages1-take_price').val(data['pages1-take_price']);

                                                $('#pages1-pic_path').val(it.src);
                                                $("#img").attr("src", it.src);
                                                $("#input-area").val("相册图片上传完成！！");
                                                layer.close(layer.index);
                                                layer.msg('相册图片上传跟参数获取完成', {
                                                    icon: 1,
                                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                                });




                                            }
                                        });
                                    }


                                    return false;
                                })
                            })
                        })
                    }
                });
                //搜索加载--数据表格重载
                var $ = layui.$, active = {

                    reload: function () {
                        //执行重载
                        table2.reload('xiangce', {
                             where: {
                                keywords: $("#keywords").val()
                            }
                        });
                    }
                };

                $('.layui-btn.layui-btn-normal').on('click', function () {

                    var type = $(this).data('type');

                    active[type] ? active[type].call(this) : '';
                });
                element.init();
                $("img").click(function () {

                    $('#pages1-pic_path').val(this.src);
                    $("#img").attr("src", this.src);
                    $("#input-area").val("相册图片上传完成！！");

                });
                element.init();

            })
        },
        addrChanged: function () {
            if (event.keyCode == 13) {
                var addr = $("#address").val();
                if (addr != '') {
                    arrAddr = getCountryMap(addr);
                    var province = arrAddr['province'];
                    var city = arrAddr['city'];
                    city = $.trim(city);
                    var area = arrAddr['area'];
                    area = $.trim(area);
                    var address = arrAddr['address'];
                    address = $.trim(address);
                    var receiverName = arrAddr['receiver_name'];
                    var telePhone = arrAddr['telephone'];
                    $("#receiver_address").val(address);
                    $("#receiver_state").val(province);
                    $("#receiver_state").trigger("change");
                    console.log(city);
                    $("#receiver_city").val(city);
                    console.log($("#receiver_city").val());
                    $("#receiver_city").trigger("change");
                    $("#receiver_district").val(area);
                }

                if (receiverName != "" && receiverName != null) {
                    $("#receiver_name").val(receiverName);
                }
                if (telePhone != "" && telePhone != null) {
                    $("#mobile").val(telePhone);
                }
            }
        },
        resetNow: function () {
            $("#address").val('');
        },
        saveOrders: function (state) {
            var btnClass = $("#saveOrderBtn").attr('class');
            if (btnClass.indexOf('layui-btn-disabled') != -1) {//按钮只读
                return false;
            }

            $("#saveOrderBtn").attr("disabled", true);
            $("#saveOrderBtn").addClass("layui-btn-disabled");
            var shopid = $("#shopid").val();
            var express = $("#express").val();
            var pages1_name_df = $("#pages1_name_df").val();
            var pages1_mobile_df = $("#pages1_mobile_df").val();
            var pages1_address_df = $("#pages1_address_df").val();
            var receiver_state = $("#receiver_state").val();
            var receiver_city = $("#receiver_city").val();
            var receiver_district = $("#receiver_district").val();
            var receiver_address = $("#receiver_address").val();
            var receiver_name = $("#receiver_name").val();
            var mobile = $("#mobile").val();
            var seller_memo = $("#seller_memo").val();
            var remark = $("#remark").val();
            var buyer_nick = $("#buyer_name").val();
            var storage = $("#storage").val();
            if (shopid == '' || shopid == '0') {
                layer.msg('店铺不能为空', {
                    icon: 2,
                    time: 2000
                });

                $("#saveOrderBtn").attr("disabled", false);
                $("#saveOrderBtn").removeClass("layui-btn-disabled");
                return;
            }
            if (receiver_name == '') {
                layer.msg('收件人不能为空', {
                    icon: 2,
                    time: 2000
                });

                $("#saveOrderBtn").attr("disabled", false);
                $("#saveOrderBtn").removeClass("layui-btn-disabled");
                return;
            }
            if (mobile == '') {
                layer.msg('电话不能为空', {
                    icon: 2,
                    time: 2000
                });

                $("#saveOrderBtn").attr("disabled", false);
                $("#saveOrderBtn").removeClass("layui-btn-disabled");
                return;
            }
			if (!receiver_state ) {
                layer.msg('省不能为空', {
                    icon: 2,
                    time: 2000
                });

                $("#saveOrderBtn").attr("disabled", false);
                $("#saveOrderBtn").removeClass("layui-btn-disabled");
                return;
            }
			if (!receiver_city ) {
                layer.msg('市不能为空', {
                    icon: 2,
                    time: 2000
                });

                $("#saveOrderBtn").attr("disabled", false);
                $("#saveOrderBtn").removeClass("layui-btn-disabled");
                return;
            }
			if (!receiver_district) {
                layer.msg('区不能为空', {
                    icon: 2,
                    time: 2000
                });receiver_district

                $("#saveOrderBtn").attr("disabled", false);
                $("#saveOrderBtn").removeClass("layui-btn-disabled");
                return;
            }
            if (receiver_address == '') {
                layer.msg('详细地址不能为空', {
                    icon: 2,
                    time: 2000
                });

                $("#saveOrderBtn").attr("disabled", false);
                $("#saveOrderBtn").removeClass("layui-btn-disabled");
                return;
            }
            if (tableParam.data.length == 0) {
                layer.msg('商品不能为空', {
                    icon: 2,
                    time: 2000
                });

                $("#saveOrderBtn").attr("disabled", false);
                $("#saveOrderBtn").removeClass("layui-btn-disabled");
                return;
            }
            /*if(storage == '' || storage == '0' || storage == null){
                layer.msg('仓库不能为空',{
                    icon: 2,
                    time: 2000
                });
                return;
            }*/
            //保存物流，店铺
            $.ajax({
                url: "/index.php?m=system&c=delivery&a=saveShopExpress",
                type: 'post',
                data: {
                    shopid: shopid,
                    express: express,
                },
                dataType: 'json',
                success: function (data) {
                }
            })

            var prdData = JSON.stringify(tableParam.data);
            execAjax({
                m: 'system',
                c: 'delivery',
                a: 'saveOrders',
                data: {
                    shopid: shopid,
                    wh: storage,
                    express: express,
                    receiver_state: receiver_state,
                    receiver_city: receiver_city,
                    receiver_district: receiver_district,
                    receiver_address: receiver_address,
                    receiver_name: receiver_name,
                    mobile: mobile,
                    seller_memo: seller_memo,
                    remark: remark,
                    prdData: prdData,
                    buyer_nick: buyer_nick,
                    dataSpecial: vueObj.dataSpecial,
                    state: state,
                    pages1_name_df: pages1_name_df,
                    pages1_mobile_df: pages1_mobile_df,
                    pages1_address_df: pages1_address_df,
                },
                success: function (data) {
                    $("#saveOrderBtn").attr("disabled", false);
                    $("#saveOrderBtn").removeClass("layui-btn-disabled");
                    if (data['code'] == 'ok') {
                        layer.alert(data['msg'], {closeBtn: 1}, function (index) {
                            if (typeof (parent.searchALLNow) == "function") {
                                parent.searchALLNow(parent.flow, 'F');
                            } else if (typeof (parent.tableReload) == "function") {
                                parent.tableReload();
                            }

                            layer.close(index);
                        });
                        $("#address").val('');
                        $("#receiver_name").val('');
                        $("#mobile").val('');
                        $("#buyer_name").val('');
                        $("#receiver_state").val('');//省
                        $("#receiver_city").val('');//市
                        $("#receiver_district").val('');//区
                        $("#receiver_address").val('');//区
                        $("#seller_memo").val('');//区
                        $("#remark").val('');//区
                        $("#pages1_name_df").val('');//区
                        $("#pages1_mobile_df").val('');//区
                        $("#pages1_address_df").val('');//区
                        $("#pages1_address_df").val('');//区
                         
                    } else {
                        layer.msg(data['msg'], {
                            icon: 2,
                            time: 2000
                        });
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#saveOrderBtn").attr("disabled", false);
                    $("#saveOrderBtn").removeClass("layui-btn-disabled");
                }
            });
        },
        cancel: function () {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
    }
});



var layer;
var tableParam = {
    elem: '#tid_items'
    , id: 'tid_items'
    //,url: '/?m=widget&c=selectProduct&a=getProductDateList'
    , cols: [[
        {width: 150, templet: '#prdActionTpl'}
        , {field: 'image_url', title: '图片', width: 100, templet: '#prdImageTpl',}
        , {field: 'prd_no', title: '商品编号', width: 100,}
        , {field: 'title', title: '商品名称', width: 190,}
        , {field: 'sku_name', title: '属性', width: 190,}
        //,{field:'sku_name1', title: '颜色', width:70,}
        //,{field:'sku_name2', title: '尺码', width:70,}
        , {field: 'num', title: '数量', width: 80, edit: 'text',}
        , {field: 'price', title: '单价', width: 80, edit: 'text',}
        , {field: 'sum_price', title: '金额', width: 80, edit: 'text',}
        , {field: 'take_price', title: '成本', width: 80, edit: 'text',}
    ]]
    , data: []
    , page: false
    , limit: 99999
    ,
};

function cbProductRows(data) {
	
    for (var i = 0; i < data.length; i++) {
        //if(!data[i]['temp_id']){
        data[i]['temp_id'] = getTimeStamp(true);
        //}
        data[i]['price'] = data[i]['price'] || 0;

        tableParam.data.push(data[i]);
    }
    vueObj.itmesTable();
}

function cbProductRowsModify(return_data, temp_id) {
    console.log("aa")
    for (var i in tableParam.data) {
        if (tableParam.data[i]['temp_id'] == temp_id) {
            tableParam.data[i]['image_url'] = return_data[0].image_url;
            tableParam.data[i]['prd_no'] = return_data[0].prd_no;
            tableParam.data[i]['title'] = return_data[0].title;
            tableParam.data[i]['sku_name'] = return_data[0].sku_name;
			tableParam.data[i]['sku_id'] = return_data[0].sku_id;
            break;
        }
    }
    vueObj.itmesTable();
}

layui.use('upload', function () {
    var upload = layui.upload;
    var uploadInst = upload.render({
        elem: '#orderExcelInput' //绑定元素
        , url: '/index.php?m=system&c=delivery&a=orderExcelInput' //上传接口
        , accept: 'file'
        , exts: 'xls|xlsx'
        , done: function (res) {
            //上传完毕回调
        }
        /*,error: function(){
            //请求异常回调
        }*/
    });
});

function getCountryMap(address) {
	
    var ascllCode = "8203";
    var specialCode = String.fromCharCode(ascllCode);

    address = $.trim(address);

    var allAddress = address;
    var receiver_name = '';
    var telephone = '';
    var province = '';
    var city = '';
    var area = '';
    var county = '';
    var index;
    var countryMap = [];
	
    $.ajax({
        url: "/index.php?m=system&c=delivery&a=addressThink",
        data: {address: allAddress},
        type: "POST",
        async: false,
        dataType: 'json',
        success: function (data) {
            if (data.type == "success") {
                countryMap['province'] = data.province;
                countryMap['city'] = data.city;
                countryMap['area'] = data.area;
                countryMap['receiver_name'] = data.receiver_name;
                countryMap['telephone'] = data.telephone;
                countryMap['address'] = data.address;
            }
        }
    });

    return countryMap;
}
function jiexidz(t){
    $.ajax({
        url: "/index.php?m=system&c=delivery&a=getOrdersxctext",
        data: {text: $(t).next().text()},
        type: "POST",
        async: true,
        dataType: 'json',
        success: function (data) {
            $('#pages1-num').val(data['pages1-num']);
            $('#pages1-prd_no').val(data['pages1-prd_no']);
            $('#pages1-price').val(data['pages1-price']);
            $('#pages1-sku_name').val(data['pages1-sku_name']);
            $('#pages1-title').val(data['pages1-title']);
            $('#pages1-take_price').val(data['pages1-take_price']);
            layer.msg('参数获取成功', {
                icon: 1,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            });
        }
    });
}
function startUpload() {

    $("#form2").ajaxSubmit({
        type: 'POST',
        dataType: "json",
        success: function (data) {
            var serverObj = mini.decode(data);
            if (serverObj.code == "error") {
                layer.msg(serverObj.msg, {
                    icon: 2,
                    time: 2000
                });
            } else {
                $('#pages1-pic_path').val(serverObj.pic_name);
                layer.msg('上传成功', {
                    icon: 1,
                    time: 2000
                });
            }
        }
    });
}

function fastClear() {
    $("#form2")[0].reset();
    $("#pages1-prd_no").val('');
    var timestamp = Date.parse(new Date());
    $("#pages1-newtimestramp").val(timestamp);
    $("#pages1-pic_path").val('');
    $("#pages1-title").val('');
    $("#pages1-sku_name").val('');
    $("#pages1-num").val(1);
    $("#pages1-price").val('');
    $("#pages1-take_price").val(0);
    $("#input-area").val('');
    $("#img").attr("src", '');
}
	