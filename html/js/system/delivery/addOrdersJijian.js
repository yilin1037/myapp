
var layer;
var tableParam = {
    elem: '#tid_items'
    , id: 'tid_items'
	,url: '/index.php?m=system&c=freePrinting&a=getData'
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
};

var vueObj = new Vue({
    el: '#app',
    data: {
        expressArr: paramObject.expressArr,
        shopidArr: paramObject.shopidArr,
        storageArr: paramObject.storageArr,
        tableObj: false,
        dataSpecial: {},//外部传特殊标志，如复制订单、换货订单、补发订单等参数
		data:{},
		list_length:false,
		num:0,
		alter_index:false,
		list:{},
        name : '',    //修改框 收件人
        phone :  '',  //修改框  手机号
        type : '',     //修改框  备注
        kuaidi:'',  //修改框快递
        kuaidi_name:'',//快递名
        pageSize:20,
        dy_arr:[],//checkbos选中的条数
		m:0,
		pageNum:1,
		pageCount:1, //页数 
        DROP_SHIPPING:"F",
        layprintTplBq:[],
        printTplDzmd:{},
        layprint:[],
        expressSort:[],
        shippingId:"",
		defaultMsg:[],
        isAll:0,
        download_type:false,
    },
    mounted: function () {
        layui.use(['element', 'table', 'layer','laydate'], function () {
            var table = layui.table,layer = layui.layer;
			var layedit = layui.layedit,laydate = layui.laydate;
            var $ = layui.jquery, element = layui.element;
            vueObj.itmesTable();
            table.on('tool(tid_items)', function (obj) {
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值
                var tr = obj.tr; //获得当前行 tr 的DOM对象
                if (layEvent === 'del') { //删除
                    layer.confirm('真的删除行么', function (index) {
                        obj.del(); //删除对应行（tr）的DOM结构
                        layer.close(index);
                        for (var i in tableParam.data) {
                            if (tableParam.data[i]['temp_id'] == data['temp_id']) {
                                tableParam.data.splice(i, 1);
                                break;
                            }
                        }
                    });
                } else if (layEvent === 'skuModify') {//修改SKU属性
                    var title = data['title'];
                    var temp_id = data['temp_id'];
                    title = encodeURIComponent(title);

                    layer.open({
                        title: '选择商品',
                        type: 2,
                        shade: false,
                        area: ['880px', '620px'],
                        maxmin: false,
                        content: '?m=widget&c=selectProduct&a=index&action=modify&type=1&param=' + temp_id + '&title=' + title
                    });
                }
            });
            table.on('edit(tid_items)', function (obj) {
                var num = obj.data['num'] * 1;
                var price = obj.data['price'] * 1;
                var sum_price = obj.data['sum_price'] * 1;
                switch (obj.field) {
                    case 'num':
                        num = obj.value * 1;
                        if (num == 0) {
                            obj.update({
                                num: obj.data['num']
                            });
                            return;
                        }
                        sum_price = num * price;
                        break;
                    case 'price':
                        price = obj.value * 1;
                        sum_price = num * price;
                        break;
                    case 'sum_price':
                        sum_price = obj.value * 1;
                        price = sum_price / num;
                        break;
                }
                for (var i in tableParam.data) {
                    if (tableParam.data[i]['temp_id'] == obj.data['temp_id']) {
                        tableParam.data[i]['num'] = (num);
                        tableParam.data[i]['price'] = (formatFloatEnd(price, 2));
                        tableParam.data[i]['sum_price'] = (formatFloatEnd(sum_price, 2));
                        break;
						
                    }
                }
                vueObj.itmesTable();
            });
        });
        $(document).ready(function(){
            searchALLNow(self,'F');
        });
		
        //保存物流，店铺
        $.ajax({
            url: "/index.php?m=system&c=delivery&a=getShopExpress",
            type: 'post',
            data: {},
            dataType: 'json',
            success: function (data) {
                if (data) {
                    $("#shopid").val(data['shopid']);
                    $("#express").val(data['express']);
                }
            }
        });

    },
    methods: {
        loadOrders: function (new_tid, dataSpecial) {
            vueObj.dataSpecial = dataSpecial;
            if (new_tid) {
                $.ajax({																																													//===========
                    url: "/index.php?m=system&c=delivery&a=getOrders",																																		//===========
                    type: 'post',																																											//===========
                    data: {new_tid: new_tid},																																												//===========
                    dataType: 'json',																																										//===========
                    success: function (data) {
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
        del_ajax:function(index_num,order_id){
            var self =this;
            layer.confirm('确定删除此条记录?', {
              btn: ['确定', '取消'] //可以无限个按钮
            }, function(index, layero){
              //按钮【按钮一】的回调
              $.ajax({                                                                                                                                                                                  //===========
                    url: "/index.php?m=system&c=delivery&a=del_ajax",                                                                                                                                      //===========
                    type: 'post',                                                                                                                                                                           //===========
                    data: {order_id: order_id},                                                                                                                                                                               //===========
                    dataType: 'json',                                                                                                                                                                       //===========
                    success: function (data) {
                       if(data.code=='ok'){
                             layer.msg(data.msg, {
                                icon: 1,
                                time: 2000
                            });
                            self.data.splice(index_num, 1);
                            $("[name='order']").prop("checked",false);
                       }else{
                            layer.msg(data.msg, {
                                icon: 2,
                                time: 2000
                            });
                       }
                        layer.close(index);
                    }                                                                                                                                                                                       //===========
                });

            }, function(index){
              //按钮【按钮二】的回调
               layer.close(index);
            })
        },
        del_all:function(){
            var self =this;
			var data = '';
            if($("#demo input[name='order']").filter(':checked').length == 0){	
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			$("input[name='order']:checkbox").each(function(){						
				if(true == $(this).is(':checked')){									
					data += ($(this).val()+",");									
				}																					
			});
			var order_str = data.substring(0,data.length-1);	
            layer.confirm('确定删除选中的所有记录?', {
              btn: ['确定', '取消'] //可以无限个按钮
            }, function(index, layero){
              //按钮【按钮一】的回调
              $.ajax({                                                                                                                                                                                  //===========
                    url: "/index.php?m=system&c=delivery&a=del_ajax",                                                                                                                                      //===========
                    type: 'post',                                                                                                                                                                           //===========
                    data: {order_id: order_str},                                                                                                                                                                               //===========
                    dataType: 'json',                                                                                                                                                                       //===========
                    success: function (data) {
                       if(data.code=='ok'){
                             layer.msg(data.msg, {
                                icon: 1,
                                time: 2000
                            });
                            $("[name='order']").prop("checked",false);
                       }else{
                            layer.msg(data.msg, {
                                icon: 2,
                                time: 2000
                            });
                       }
                        layer.close(index);
                    }                                                                                                                                                                                       //===========
                });

            }, function(index){
              //按钮【按钮二】的回调
               layer.close(index);
            })
        },
		alter:function(index_num,item){
			var self =this
            self.name = '';
            self.phone =  '';
            self.type = '';
            self.kuaidi ='';
            self.kuaidi_name='';
            item.seller_memo=item.seller_memo=='0'?'':item.seller_memo;
			self.list=item;
			layer.open({
			  type: 1,
			  title:"手工订单修改",
			  content: $('#alter_index'),
			  offset: 'auto',//这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			  area: ['700px', '300px'],
			  btn: ['确定', '取消']
			 ,yes: function(index, layero){

                    if($("#receivername").val() == '' || $("#receivername").val() == undefined || $("#receivername").val() == null){
                        layer.msg("收件人为空", {
                            icon: 2,
                            time: 2000
                        });
                        return false;
                    }
                    if($("#receivermobile").val() == '' || $("#receivermobile").val() == undefined || $("#receivermobile").val() == null){
                        layer.msg("手机号为空", {
                            icon: 2,
                            time: 2000
                        });
                        return false;
                    }
                    if($("#express_update").val() == '0' || $("#express_update").val() == undefined || $("#express_update").val() == null){
                        layer.msg("快递为空", {
                            icon: 2,
                            time: 2000
                        });
                        return false;
                    }
					self.name = $("#receivername").val();
					self.phone =  $("#receivermobile").val();
					self.type = $("#dfexpresstype").val();
                    self.kuaidi = $("#express_update").val();
                    self.kuaidi_name = $("#express_update").find("option:selected").text();
                    //修改
                    self.update_ajax(index_num);
                     layer.close(index);
				}
			});
		},
        alter_kuaidi:function(){
            var self =this;
            if(self.dy_arr.length<=0){
                layer.msg("请选择一条记录", {
                    icon: 2,
                    time: 2000
                });
                return false;
            }
            self.kuaidi ='';
            self.kuaidi_name='';
            layer.open({
              type: 1,
              title:"手工订单快递修改",
              content: $('#alter_kuaidi'),
              offset: 'auto',//这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
              area: ['700px', '300px'],
              btn: ['确定', '取消']
             ,yes: function(index, layero){
                    if($("#express_update_all").val() == '0' || $("#express_update_all").val() == undefined || $("#express_update_all").val() == null){
                        layer.msg("快递为空", {
                            icon: 2,
                            time: 2000
                        });
                        return false;
                    }
                    self.kuaidi = $("#express_update_all").val();
                    self.kuaidi_name = $("#express_update_all").find("option:selected").text();
                    //修改
                    self.update_kuaidi_all();
                    layer.close(index);
                }
            });
        },
        update_kuaidi_all:function(){
            var self =this
            var dy_arr = self.dy_arr
            var result = '';
            var kuaidi_id=[];
            var data = vueObj.data
            for(var i=0;i<dy_arr.length;i++){
                result = data.find(ele=>ele.order_id === dy_arr[i]);
                if(result['print_time'] == "未打印"){
                    kuaidi_id.push(dy_arr[i]);
                }
            }
            if(kuaidi_id.length > 0){
                $.ajax({                                                                                                                                                                                  //===========
                    url: "/index.php?m=system&c=delivery&a=update_kuaidi_ajax",                                                                                                                                      //===========
                    type: 'post',                                                                                                                                                                           //===========
                    data: {order_id:kuaidi_id.join(','),kuaidi:self.kuaidi},                                                                                                                                                                               //===========
                    dataType: 'json',                                                                                                                                                                       //===========
                    success: function (data) {
                        if(data.code=='ok'){
                             layer.msg(data.msg, {
                                icon: 1,
                                time: 2000
                            });
                            $("input[name='order']").iCheck('uncheck'); 
                            searchALLNow(self,'page');
                            self.dy_arr=[];
                        }else{
                            layer.msg(data.msg, {
                                icon: 2,
                                time: 2000
                            });
                        }
                       
                    }                                                                                                                                                                                       //===========
                });
            }else{
                $("input[name='order']").iCheck('uncheck'); 
                alert('已打印不允许修改快递');
            }
        },
        update_ajax:function(index_num){
            var self =this
             $.ajax({                                                                                                                                                                                  //===========
                url: "/index.php?m=system&c=delivery&a=update_ajax",                                                                                                                                      //===========
                type: 'post',                                                                                                                                                                           //===========
                data: {name: self.name,phone:self.phone,type:self.type,order_id:self.list.order_id,kuaidi:self.kuaidi},                                                                                                                                                                               //===========
                dataType: 'json',                                                                                                                                                                       //===========
                success: function (data) {
                    if(data.code=='ok'){
                         layer.msg(data.msg, {
                            icon: 1,
                            time: 2000
                        });
                        self.data[index_num].receiver_name=self.name;
                        self.data[index_num].receiver_mobile=self.phone;
                        self.data[index_num].seller_memo=self.type;
                        self.data[index_num].express_name=self.kuaidi_name;
                    }else{
                        layer.msg(data.msg, {
                            icon: 2,
                            time: 2000
                        });
                    }
                   
                }                                                                                                                                                                                       //===========
            });
        },
		page: function(page){
			var self = this;			
			if(page == "prev"){
				if(self.pageCount == 1){
					return false;
				}
				self.pageCount = parseInt(self.pageCount) - 1 ;
				console.log(self.pageCount)
				searchALLNow(tableParam);
			}else if(page == "next"){
				if(self.pageCount == (self.pageNum -1)){
					return false;
				}
				self.pageCount = parseInt(self.pageCount) + 1;
				searchALLNow(tableParam);
				console.log(self)
			}
			
			
		},
        //查询方法
        searchALL:function(){
            var self = this;
            searchALLNow(self,'F');
        },
        addOrder:function(){
            var self =this;
            $("#create").attr("disabled",true);
            //http://127.0.0.1/index.php?m=system&c=delivery&a=freeWaybill
            var receiver_name = $("#receiver_name").val();//收件人
            var mobile =  $("#mobile").val();//手机号码
            var receiver_state =  $("#receiver_state").val();//省
            var receiver_city = $("#receiver_city").val();//市
            var receiver_district = $("#receiver_district").val();//区
            var receiver_address = $("#receiver_address").val();//详细地址
            var title = $("[name='order_id']").val();//订单号
            var express = $("#express").val();//快递
            var seller_memo = $('#seller_memo').val();//自定义备注
            var express_no = $("#express_no").val();//快递单号
            var t1 = mini.get("pages1_name_df");//代发人
            var pages1_name_df = t1.getValue();
            var t2 = mini.get("pages1_mobile_df");//代发人电话
            var pages1_mobile_df = t2.getValue();
            var t3 = mini.get("pages1_address_df");//代发人地址
            var pages1_address_df =t3.getValue();
            if(!receiver_name){
                layer.msg('收件人不能为空', {
                    icon: 2,
                    time: 2000
                });
                $("#create").attr("disabled",false);
                return false;
            }
            if(!mobile){
                layer.msg('手机号不能为空', {
                    icon: 2,
                    time: 2000
                });
                $("#create").attr("disabled",false);
                return false;
            }
            if(!receiver_state){
                layer.msg('省不能为空', {
                    icon: 2,
                    time: 2000
                });
                $("#create").attr("disabled",false);
                return false;
            }
            if(!receiver_city){
                layer.msg('市不能为空', {
                    icon: 2,
                    time: 2000
                });
                $("#create").attr("disabled",false);
                return false;
            }
            if(!receiver_district){
                layer.msg('区不能为空', {
                    icon: 2,
                    time: 2000
                });
                $("#create").attr("disabled",false);
                return false;
            }
            if(!receiver_address){
                layer.msg('详细地址不能为空', {
                    icon: 2,
                    time: 2000
                });
                $("#create").attr("disabled",false);
                return false;
            }
            if(!express){
                layer.msg('快递不能为空', {
                    icon: 2,
                    time: 2000
                });
                $("#create").attr("disabled",false);
                return false;
            }
            
            $.ajax({
                url: "/index.php?m=system&c=delivery&a=freeWaybillInsert",
                data: {express:express,express_no:express_no,receiver_address:receiver_address,receiver_district:receiver_district,receiver_city:receiver_city,receiver_state:receiver_state,mobile:mobile,receiver_name:receiver_name,seller_memo:seller_memo,title:title,pages1_name_df: pages1_name_df,pages1_mobile_df: pages1_mobile_df,pages1_address_df: pages1_address_df},
                type: "POST",
                async: true,
                dataType: 'json',
                success: function (data) {
                    if(data.code=='ok'){
                        layer.msg('创建成功', {
                            icon: 1,
                            time: 2000 //2秒关闭（如果不配置，默认是3秒）
                        });
                        $("#receiver_name").val('');//收件人
                        $("#mobile").val('');//手机号码
                        $("#receiver_state").val('北京市');//省
                        $("#receiver_city").val('北京市');//市
                        $("#receiver_district").val('东城区');//区
                        $("#receiver_address").val('');//详细地址
                        $("[name='order_id']").val('');//订单号
                        $("#seller_memo").val('');//自定义备注
                        //$("#express").val('');//快递
                        $("#express_no").val('');//快递单号
                        $("#address").val('');//一键粘贴
                        searchALLNow(self,'page');
                    }else{
                        layer.msg(data.msg, {
                            icon: 2,
                            time: 2000
                        });
                    }
                    $("#create").attr("disabled",false);
                }
            });


        },
        addressThink:function(){
            var address = $("#address").val();
            $.ajax({
                url: "/index.php?m=system&c=delivery&a=addressThink",
                data: {address:address},
                type: "POST",
                async: true,
                dataType: 'json',
                success: function (data) {
                    if(data.code=='ok'){
                        layer.msg('创建成功', {
                            icon: 1,
                            time: 2000 //2秒关闭（如果不配置，默认是3秒）
                        });
                    }else{
                        layer.msg(data.msg, {
                            icon: 2,
                            time: 2000
                        });
                    }

                }
            });
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

                    // tableParam.data.push({
                        // temp_id: getTimeStamp(true),
                        // prd_no: $('#pages1-prd_no').val(),
                        // title: $('#pages1-title').val(),
                        // sku_name: $('#pages1-sku_name').val(),
                        // num: num,
                        // price: price,
                        // image_url: $('#pages1-pic_path').val(),
                        // old_image_url: $('#pages1-pic_path').val(),
                        // sum_price: sum_price,
                        // take_price: $('#pages1-take_price').val(),
                    // });

                    vueObj.itmesTable();
                    fastClear();
                    $("#pages1-prd_no").focus();
                },
                cancel: function (index, layero) {

                }
            });
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
			$("#order_id_select").val('');
			$("#kuaidi_type").val('');
			$("#express_no_select").val('');
			$('#mobile_select').val('');
			$('#print_kd_num').val('');
			$('#express_type').val('');
        },
        searchALLNow_sel:function(e=''){
            var self=this;
            if(e.target.id=='Modify_page'){
                self.pageCount=e.target.value;
            }
            searchALLNow(self,'page');
        },
        //打印快递单
        aloneFace:function(type){
            var self = this;
            self.defaultMsg = [];
            var data = "";
            var nowIsAll = self.isAll;
            
            var data = '';
            if($("#demo input[name='order']").filter(':checked').length == 0){	
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			$("input[name='order']:checkbox").each(function(){						
				if(true == $(this).is(':checked')){									
					data += ($(this).val()+",");									
				}																					
			});
			data = data.substring(0,data.length-1);
            var tmp = '';
            //self.face = param;
            $("#layprint1").val(0); 
            //$("#layprintTplBq1").val(0);
            //if(checkPrintFace == "T"){
                $.ajax({
                    url: "/index.php?m=system&c=freePrinting&a=printFaceJijian",
                    type: 'post',
                    data: {order_ids: data, isAll: self.isAll, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
                    dataType: 'json',
                    success: function (data) {
                        if(data){
                            tmp = data;
                            self.expressSort = data;
                            console.log(data);
                            self.printTplDzmd = printTplDzmd;
                            
                            doGetPrinters(function(data){
                                    self.layprint =  data;
                            }); 
                            if(self.layprint.length==0){
                                doGetPrinters2(function(data){
                                    self.layprint =  data;
                                }); 
                            }
                            $("#layprint1").val(0);
                            //-----初始化选择框                                                                                                       
                            //$("#layprintTplBq1").val(0);
                            //-----初始化选择框
                            self.layprintTplBq = printTplBq;    
                            
                            $(document).ready(function(){
                                $('#prin input').iCheck({
                                    checkboxClass: 'icheckbox_minimal',
                                    radioClass: 'iradio_minimal',
                                    increaseArea: '20%'
                                });
                            });
                            
                            $.ajax({
                                url: "/index.php?m=system&c=delivery&a=getWLMianDan",
                                type: 'post',
                                data: {data:tmp},
                                dataType: 'json',                           
                                success: function (data) {
                                    for( var i=0; i<data.length; i++ ) {  
                                        if(data[i].printer != ""){
                                            
                                            $("#layprintBq" + i).val(data[i].printer);
                                            //$("#printer select").val(data[i].printer);
                                        }else{
                                            //$("#printer select").val(0);
                                            $("#layprintBq" + i).val(0);
                                            printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
                                        }
                                    }
                                }                                                               
                            });
                        }
                    }                                               
                });
                var layerTitle = "打面单";
                $("#tr-aloneFace").hide();
                self.progress_print_now(0,"获取打印信息中……");
                layer.open({                            
                    type: 1,
                    title: layerTitle,
                    skin: 'layui-layer-rim', 
                    area: ['1200px', '400px'], 
                    shade: 0.3,     
                    content: $("#aloneFace"),
                    cancel: function(index, layero){
                        if(type == "page"){
                            searchALLNow(self,'page');
                            $("input[name='order']").iCheck('uncheck'); 
                            $(".inputTe").css("color","white");
                            self.isAll = 0;
                            self.dy_arr = [];
                            self.nowPage = false;
                            self.allPage = false;
                        }
                    }
                });
                
                self.isAll = nowIsAll;  
            //}
        },
        //打面单->打印
        print_face:function(type,index,show,send,batch){
            var self = this;    
            self.defaultMsg = [];
            var data = "";
            var isrepeat = "";
            if($("#layprintBq" + index).val() != 0){
                var unprintname = $("#layprintBq" + index).val();
            }else{
                layer.msg('请选择打印机！',{
                    icon: 2,
                    time: 2000
                });
                return
            }
            if($("#layprintTplBq" + index).val() != 0){
                var unprintTplBq = $("#layprintTplBq" + index).val();
            }else{
                layer.msg('请选择打印模板！',{
                    icon: 2,
                    time: 2000
                });
                return
            }
			if($("#demo input[name='order']").filter(':checked').length == 0){	
				layer.msg('请选择至少一条数据',{
					icon: 0,
					time: 2000
				});
				return false;
			}
			$("input[name='order']:checkbox").each(function(){						
				if(true == $(this).is(':checked')){									
					data += ($(this).val()+",");									
				}																					
			});
			data = data.substring(0,data.length-1);	

            if($("#printinput" + index).is(':checked')){
                isrepeat = "no";
            }else{
                isrepeat = "yes";
            }
            
            var btnObj = $(event.target);
            btnObj.prop("disabled",true);
            if(self.sysPlan == "send" || self.sysPlan == "overTime" || self.sysPlan == "falseSend")
            {
               var attribute = "0";
            }
            else
            {
                var attribute = "1";    
            }

            send = "F";
            self.do_print_now(data,type,isrepeat,show,'F',unprintTplBq,unprintname,batch,index,btnObj,attribute);//打印
            return false;
        },
        do_print_now:function(data,type,isrepeat,show,send,unprintTplBq,unprintname,batch,index,btnObj,attribute){
            var self = this;
            var printSoft = '';
            if(show != "show")
            {
                $("#tr-facePop").show();
            }
            self.progress_print_now(0,"获取打印信息中……");
            $.ajax({                                                                                                                                                                    
                url: "/index.php?m=system&c=freePrinting&a=printNowFreeJijian",                                                                                                                           
                type: 'post',                                                                                                                                                               
                data: {data:data,isAll:(self.isAll == 5 ? 0 : self.isAll),type:type,isrepeat:isrepeat,show:show,send:send,exception:self.exception, DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId, printTpl: unprintTplBq, printSoft: printSoft,attribute:attribute},                                                                                                                                                                  
                dataType: 'json',                                                                                                                                                       
                success: function (data) {
                    btnObj.prop("disabled",false);
                    if(data.dataCheck && data.numCheck > 0){
                        self.defaultMsg = data.dataCheck;
                        
                        layer.open({
                            type: 1,                                                                                                                                                                            
                            title: '打印详情',                                                                                                                                                              
                            skin: 'layui-layer-rim', //加上边框                                                                                                                                                 
                            area: ['800px', '400px'], //宽高                                                                                                                                                  
                            shade: 0.3,                                                                                                                                                                         
                            content: $("#default")                                                                                                                                                                                  
                        }); 
                    }
                    if(data.dates && data.dates.length > 0){
                        var newData = [];
                        var percent = 0;
                        var num = 0;
                        if(show == "F"){
                            doGetPrinters(function(){
                                newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
                                if(unprintname){
                                    printTpl[unprintTplBq](unprintname,newData,false,true,self.progress_print_now);//第四个参数暂时没有用
									var expressSort = self.expressSort;
									expressSort.splice(index,1);
									self.expressSort = expressSort;
									setTimeout(function(){
										//layer.closeAll();
										searchALLNow(self,'page');
									},1000)

                                }
                                layer.closeAll();
                            });
                        }else if(show == "show"){
                            doGetPrinters(function(){
                                newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'T');//订单数据,商品数据，订单详情数据,预览
                                if(unprintname){
                                    printTpl[unprintTplBq](unprintname,newData,true);
                                    layer.closeAll();
                                }else{
                                    layer.msg('打印机不存在,无法预览', {time: 2000, icon:2});
                                }
                            });
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    btnObj.prop("disabled",false);
                }
            });
        },
        print_now_free:function(free_order_id,show){
            var self = this;
            self.defaultMsg = [];
            
            if($("#layprintFree").val() != 0){
                var unprintname = $("#layprintFree").val();                                                                                                                                             
            }else{
                layer.msg('请选择打印机！',{
                    icon: 2,
                    time: 2000
                });
                return                                                                                                                                                                              
            }                                                                                                                                                                                       
            if($("#layprintTplBqFree").val() != 0){                                                                                                                                                     
                var unprintTplBq = $("#layprintTplBqFree").val();                                                                                                                                       
            }else{
                layer.msg('请选择打印模板！',{
                    icon: 2,
                    time: 2000
                });
                return                                                                                                                                                                              
            }

            var a = $(event.target);
            a.prop("disabled",true);
            
            $.ajax({
                url: "/index.php?m=system&c=freePrinting&a=printNowFreeJijian",                                                                                                                           
                type: 'post',                                                                                                                                                               
                data: {free_order_id: free_order_id, printTpl: unprintTplBq, show: show},                                                                                                                                                                   
                dataType: 'json',                                                                                                                                                       
                success: function (data) {
                    a.prop("disabled",false);
                    
                    if(data.dates && data.dates.length > 0){
                        var newData = [];                       
                        var percent = 0;                                            
                        var num = 0;
                        if(show == "F"){
                            doGetPrinters(function(){
                                newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
                                if(unprintname){
                                    printTpl[unprintTplBq](unprintname,newData);
                                    var expressSort = self.expressSort;
									expressSort.splice(index,1);
									self.expressSort = expressSort;
                                    setTimeout(function(){
                                        layer.closeAll();
                                    },1000)
                                }
                            });
                        }else if(show == "show"){
                            doGetPrinters(function(){
                                newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'T');//订单数据,商品数据，订单详情数据,预览
                                if(unprintname){
                                    printTpl[unprintTplBq](unprintname,newData,true);
                                }else{
                                    layer.msg('打印机不存在,无法预览', {time: 2000, icon:2});
                                }
                            });
                        }
                    }                                                                                                                                       
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    a.prop("disabled",false);
                }
            });
        },
        checkbox_all:function(e){
            var self =this;
            var type = e.target.checked;
            if(type){
                self.dy_arr=[];
                var arr =[];
                $("[name='order']").prop("checked",true);
                for(var i=0;i<self.data.length;i++){
                    self.dy_arr.push(self.data[i].order_id);
                }
            }else{
                self.dy_arr=[];
                $("[name='order']").prop("checked",false);
            }
            //console.log(self.dy_arr);
        },
        //打印进度条
        progress_print_now:function(progress, title)
        {
            setTimeout(function(){
                layui.use('element', function(){
                     var element = layui.element;
                     element.init();         //进度条
                     element.progress('facePop', progress+'%');
                     $("#facePopStatus").html(title);                    
                 });
             },1)
        },
        checkbox_index:function(e,index){
            var self =this;
            var type = e.target.checked;
            if(type){
                //self.dy_arr["d"+self.data[index].order_id]=self.data[index].order_id;
                self.dy_arr.push(self.data[index].order_id);
            }else{
                if(self.dy_arr.length>0){
                    for (var i = 0; i < self.dy_arr.length; i++) {
                        if(self.data[index].order_id==self.dy_arr[i]){
                            self.dy_arr.splice(i,1);
                        }
                    }
                }
            }
        },
        setPagesize:function(e){
            var self=this;
            self.pageSize=e.target.value;
            searchALLNow(self,'page');            
        },
        //物流单号回收
        recycle_rder:function(index,item){
            //成功后把物流单号清了
            var self =this;
            $.ajax({
                url: "/index.php?m=system&c=freePrinting&a=returnPrintsManual",
                type: 'post',
                data: {order_id:self.data[index].order_id},
                dataType: 'json',                           
                success: function (data) {
                    if(data.code=='ok'){
                        layer.msg(data.msg, {
                            icon: 1,
                            time: 2000
                        });
                        self.data[index].express_no='';
                    }else{
                        layer.msg(data.msg, {
                            icon: 2,
                            time: 2000
                        });
                    }
                }                                                               
            }); 
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
//代发人记忆
function receiverChanged(e) {
    var item = e.selected;
    var sender_id = e.sender.id
    var t1 = mini.get("pages1_name_df");
    var t2 = mini.get("pages1_mobile_df");
    var t3 = mini.get("pages1_address_df");
    if(item){
        t1.setValue(item.receiver_name);
        t1.setText(item.receiver_name);
        t2.setValue(item.receiver_mobile);
        t2.setText(item.receiver_mobile);
        t3.setValue(item.receiver_address);
        t3.setText(item.receiver_address);
    }
}
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
$("#outputExcel").click(function(){
    var dateBegin = $("#printdsosdateBegin").val();              //-----开始日期                     
    var dateEnd = $("#printdsosdateEnd").val();
    var order_id = $("#order_id_select").val();//订单号
    var express_type = $("#express_type").val();//快递类型
   // alert(express_type);
    var print_kd_num = $("#print_kd_num").val();//打印状态
    var mobile_select =$("#mobile_select").val();//手机号
    var express_no_select =$("#express_no_select").val();//快递单号
    var kuaidi_type = $("#kuaidi_type").val();//快递来源
    var Modify_page = $('#Modify_page').val();//页面
    var data = {
        "dateBegin": dateBegin,
        "dateEnd": dateEnd,
        "order_id": order_id,
        "express_type":express_type,
        "print_kd_num":print_kd_num,
        "mobile_select":mobile_select,
        "express_no_select":express_no_select,
        "kuaidi_type":kuaidi_type,
        "pageSize":vueObj.pageSize,
        'pageNum':vueObj.pageCount,
    };
    var str =JSON.stringify(data);

    var url = "?m=system&c=freePrinting&a=download_csv&data="+str;
    $("#selected").attr('src',url);
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
function expressChange(){

    searchALLNow(tableParam,'page');
}
	//表格页面的条数 
function expressscreening(page,num){
	if(num =="screening"){
		$('#expressscreening').val(page);
		var pageSize = vueObj.pageSize
		pageSize = page 
		searchALLNow(tableParam,page);
		return page
	}else{
	 var page = $('#expressscreening').val();
	}
	
	screening(page,'expressscreening')
}
function screening(page, num){
	if(num == "expressscreening"){
		$('#screening').val(page);
		var pageSize = vueObj.pageSize
		pageSize = page
		searchALLNow(tableParam,page);
		return page
	}else{
		var page = $('#screening').val();
	}
	
	expressscreening(page,'screening')
}
//查询方法封装
function searchALLNow(self,page){
    var dateBegin = $("#printdsosdateBegin").val();              //-----开始日期                     
    var dateEnd = $("#printdsosdateEnd").val();
    var order_id = $("#order_id_select").val();//订单号
    var express_type = $("#express_type").val();//快递类型
    var download_type =self.download_type;//true 下载  flase 查询
   // alert(express_type);
    var print_kd_num = $("#print_kd_num").val();//打印状态
    var mobile_select =$("#mobile_select").val();//手机号
    var express_no_select =$("#express_no_select").val();//快递单号
    var kuaidi_type = $("#kuaidi_type").val();//快递来源
	var Modify_page = $('#Modify_page').val();//页面
    var data = {
        "dateBegin": dateBegin,
        "dateEnd": dateEnd,
        "order_id": order_id,
        "express_type":express_type,
        "print_kd_num":print_kd_num,
        "mobile_select":mobile_select,
        "express_no_select":express_no_select,
        "kuaidi_type":kuaidi_type,
		"pageSize":vueObj.pageSize,
        'pageNum':vueObj.pageCount,
    };
    var url_str = "/index.php?m=system&c=freePrinting&a=getDataJijian";
    
    $.ajax({
        url: url_str,
        type: 'post',
        data: {data: data, num: self.m},
        dataType: 'json',
        success: function (data) {
                self.pageNum = Math.ceil(data.pageNum / 20);
                self.pageNum = data.pageNum
                self.data = data.data;
                vueObj.data = data.data;
            	vueObj.list_length = true;
            	vueObj.num = data.count
            	vueObj.pageCount =  data.currentPage
                self.isFirst = false;
                if(self.pageNum == 0){
                    self.page_m = 0;
                }else{
                    self.page_m = self.m+1;
                }
                self.nowPage = false;
                self.allPage = false;
        }
    });
}
function addoption(){
    var type=0;
    $("#receiver_district option").each(function(index,el){
        if($(el).val()=='其他区'){
            type=1;
            return false;
        }
    });
    if(type!=1){
        $("#receiver_district").append('<option value="其他区" name="其他区" data-code="999999">其他区</option>');
    }

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
	