var pages = new Vue({ //vue 模块入口
    el: '#app',
    data: {
        id: '',
		no: '',
        assist_print: '',
		express_name: '',
		express_fee: '',
        send_username: '',
        send_tel: '',
        ratio: '',
        title: '',
		buttonname:'保存',
		buttonnames:'保存',
		addressid:'',
		addattrid:'',       //可送区域选择的物流id
		shopArr:[],
		jdshopArr:[],
		expressArr:[],
		shop_id: 0,
		data_city:[],       //城市
		data_province:[],	//省份 
		zto_partner:'',		//中通信息
		sf_partner:[],		//顺丰信息
		jd_partner:[],		//京东到付外单信息
		yto_partner:[],		//圆通信息
		yunda_partner:[],   //韵达信息
		dbkd_partner:[],
		delid:"",			//删除物流的id
    },
    mounted: function () {
        var tempjson = new Array();
        var jqtb;
		var self = this;
		var del_type = '1';
        //layui 模块 入口
        layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
            var $ = layui.jquery, element = layui.element, layer = layui.layer;
            var form = layui.form(), layer = layui.layer, layedit = layui.layedit, laydate = layui.laydate;
			
			if(del_type == 1){
				$("#recovery").hide();
				$("#effective").show();
				$("#invalid").show();
				$("#delete").show();
				$("#deleted").show();
				$("#taobao").show();
				$("#jdwj").show();
				$("#pinduoduo").show();
				$("#addjdyth").show();
				$("#addjdythcod").show();
				$("#addjdythwd").show();
				$("#wuliuSet").show();
				$("#secretSetup").show();
				$("#availableWuliu").hide();
			}

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
                        {"name": "keywor2", "value": $(".layui-input").val()},
						{"name": "del_type", "value":del_type}
                    );
                },
                //请求url
                "sAjaxSource": "index.php?m=system&c=setup&a=getExpress",
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
					{'title':'<input type="checkbox" class="my-checkbox"/>','data':'id'},
					{'title':"状态",'data':"status",'width': '40px',"defaultContent": ""},
					{'title':"默认快递",'data':"default",'width': '75px',"defaultContent": ""},//隐藏
					{'title':"快递公司",'data':"name",'width': '75px',"defaultContent": "","render": function (data,type,row,meta) {
						if(data == ""){
							return "<input onBlur='nameChage("+0+","+row.id+",this)'>"
						}else{
							return "<input value='"+data+"' onBlur='nameChage("+0+","+row.id+",this)'>"
						}
					}},
					{'title':"网点",'data':"site",'width': '75px',"defaultContent": "","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
					}},
					{'title':"签约地址",'data':"send_address","defaultContent": "","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
					}}, 
					{'title':"发货地址",'data':"print_address","defaultContent": "","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
					}}, 
					{'title':"关联店铺",'data':"send_shopid","defaultContent": "","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
					}}, 
					{'title':"匹配比例",'data':"ratio",'width': '75px',"defaultContent": "","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
					}}, 
					{'title':"发货人",'data':"send_username",'width': '60px',"defaultContent": "","render": function (data,type,row,meta) {
						if(data == ""){
							return "<input onBlur='nameChage("+1+","+row.id+",this)'>"
						}else{
							return "<input value='"+data+"' onBlur='nameChage("+1+","+row.id+",this)'>"
						}
					}}, 
					{'title':"发货电话",'data':"send_tel",'width': '75px',"defaultContent": "","render": function (data,type,row,meta) {
						if(data == ""){
							return "<input onBlur='nameChage("+2+","+row.id+",this)'>"
						}else{
							return "<input value='"+data+"' onBlur='nameChage("+2+","+row.id+",this)'>"
						}
					}}, 
					{'title':"代发价",'data':"assist_print",'width': '60px',"defaultContent": "","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
					}}, 
					{'title':"已用面单",'data':"allocated_quantity",'width': '75px',"defaultContent": "","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
					}}, 
					{'title':"剩余面单",'data':"quantity",'width': '75px',"defaultContent": "","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
					}}, 
					{'title':"所属店铺",'data':"shopname",'width': '75px',"defaultContent": "","render": function (data,type,row,meta) {
						if(data == ""){
							return "";
						}else{
							return data;
						}
					}}, 
					{'title':"操作",'data':"edit","defaultContent": "",'width': '200px'}, 
                ],
                'columnDefs':  [{
					'targets': 0,
					'searchable': false,
					'orderable': false,
					'width': '1%',
					'className': 'dt-body-center',
					'render': function (data, type, full, meta) {
						return '<input type="checkbox"  name="my-checkbox" id="' + data + '" class="my-checkbox">';
					}
				}
				, {
					'targets': 1,
					'searchable': false,
					'orderable': false,
					'width': '60px',
					'className': 'dt-body-center',
					'render': function (data, type, full, meta) {
						
						if(full.status=='0'){
							return '<div class="yes">有效</div>';
						}
						if(full.status=='1'){
							return '<div class="no">无效</div>';
						}
						
					}
				}
				, {
					'targets': 2,
					'searchable': false,
					'orderable': false,
					'width': '60px',
					'className': 'dt-body-center',
					'render': function (data, type, full, meta) {
						if(full.default=='0'){
							return "<button class='no'   onclick='statusChage("+full.id+",this)'>否</button>"
						}
						if(full.default=='1'){
							return "<button class='yes'   onclick='statusChage("+full.id+",this)'>是</button>"
						}
					}
				} , 
				{
					'targets': 15,
					'searchable': false,
					'orderable': false,
					'width': '200px',
					'className': 'dt-body-center',
					'render': function (data, type, full, meta) {
						tempjson[full.id] = full;
						var yiliandan = '';
						if(full.yiliandan == '1'){
							yiliandan = '<a id=' + full.id + ' class="table-yiliandan"  style="color: rgb(18, 150, 219); font-size: 14px; margin-left: 4px; cursor: pointer;">开通一联单</a>';
						}
						var content = "";
						if(full.status=='1' && del_type == '1'){
							content = '<a id=' + full.id + ' class="edit-page"  style="color: rgb(18, 150, 219); font-size: 14px; margin-left: 4px; cursor: pointer;"><img  src="images/edit.png" style="width: 13px; height: 13px;"> 修改</a><a id=' + full.express_id + ' class="table-address"  style="color: rgb(18, 150, 219); font-size: 14px; margin-left: 4px; cursor: pointer;">不送区域</a><a id=' + full.id + ' class="table-del"  style="color: rgb(18, 150, 219); font-size: 14px; margin-left: 4px; cursor: pointer;">删除</a>' + yiliandan;
						}else if(full.status=='0' && del_type == '1'){
							content = '<a id=' + full.id + ' class="edit-page"  style="color: rgb(18, 150, 219); font-size: 14px; margin-left: 4px; cursor: pointer;"><img  src="images/edit.png" style="width: 13px; height: 13px;"> 修改</a><a id=' + full.express_id + ' class="table-address"  style="color: rgb(18, 150, 219); font-size: 14px; margin-left: 4px; cursor: pointer;">不送区域</a><a id="'+full.express_id+'_on" class="table-addattr"  style="color: rgb(18, 150, 219); font-size: 14px; margin-left: 4px; cursor: pointer;">配送区域</a><a id="' + full.id + '" class="table-del"  style="color: rgb(18, 150, 219); font-size: 14px; margin-left: 4px; cursor: pointer;">删除</a>' + yiliandan;
						}
						return content;
					},
						
				} 
				],
                "language": {// 国际化
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
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getShop",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					self.shopArr = data;
				}
			});	
			
			$.ajax({
				url: "/index.php?m=system&c=setup&a=getShopJD",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					self.jdshopArr = data;
				}
			});	
			
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getExpress",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					self.expressArr = data;
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
           
			$.ajax({
				url: '/index.php?m=system&c=setup&a=getshoplist',
				type: "POST",
				dataType:"json",
				data:{},
				success:function(data){
					if(data){
						var html = "";
						for(var i=0;i<data.length;i++){
							html = html +'<div class="layui-input-block shoplast" > <input type="checkbox"  name="'+data[i].shopid+'" id="shop_'+data[i].id+'" >'+data[i].shopname+'</div>';
						}
						$(".shoplist").html(html)
					}
				}
			});
			 
			$.ajax({
				url: '/index.php?m=system&c=setup&a=getdetail',
					type: "POST",
					dataType:"json",
					data:{},
					success:function(data){
						if(data){
							self.data_city = data.data_city;
							self.data_province = data.data_province;
							var data_city =	data.data_city;
							var data_province =	data.data_province;
							var maohtml = "";
							var html = "";
							var i = 0;
							for(var province_code in data_province){
								if(i%2==0){
									maohtml = maohtml + '<div class="maodian1"><a style="color: black;font-weight: bolder;" href="#maodian'+province_code+'">'+data_province[province_code]+'</a></div>';
								}else{
									maohtml = maohtml + '<div class="maodian2"><a style="color: black;font-weight: bolder;" href="#maodian'+province_code+'">'+data_province[province_code]+'</a></div>';
								}
								//html += data_province[province_code]+'</br>';
								//console.log(data_city[province_code]);
								html = html + '<div class="ads" id = "maodian'+province_code+'" style=""><div class="layui-input-block shoplast adsbig"  style="background-color:white;color:black;"> <input type="checkbox"  class="provinces"  name="provinces" id="'+province_code+'" >'+data_province[province_code]+'</div>'
								html = html + '<a id="province'+province_code+'" class="adsbigclick" style="color:grey;"  >收缩<i class="layui-icon" style="font-size: 14px; color: grey;">&#xe619;</i></a></div>'
								html = html + '<div class="province'+province_code+'" style="float: left;line-height: 36px;">'
								for(var city_code in data_city[province_code])
								{
								
								html = html + '<div class="layui-input-block shoplast" > <input type="checkbox"  name="cityCode" id="'+city_code+'" value="'+city_code+'">'+data_city[province_code][city_code]+'</div>'
							
								} 
								html = html + '</div>'
								i = i+1;
							}
							html = html + '<div class="layui-input-block shoplast" style="padding-bottom: 25px;padding-top: 25px;text-align: center;width: 100%; display: none;"><button class="layui-btn" lay-submit="" lay-filter="city_addedit"> 保存 </button></div>';
						$(".province").html(html);
						$(".containerleft").html(maohtml);
					}
				}
			});
			form.on('checkbox', function(data){
				$(".province"+data.elem.id+" input:checkbox").prop("checked", data.elem.checked);
				$(".province"+data.elem.id+"_no input:checkbox").prop("checked", data.elem.checked);
				form.render('checkbox');
			})
			$(document).on('click', '.effective', function () {
				var idstr='';
				$("input:checkbox[name='my-checkbox']:checked").each(function() {
					 idstr=idstr+$(this).attr("id")+',';
				});
				idstr=idstr.substring(0,idstr.length-1);
				$.ajax({
					url: '/index.php?m=system&c=setup&a=setstatus',
					type: "POST",
					dataType:"json",
					data:{ids:idstr,type:'effective'},
					success:function(data){
						jqtb.ajax.reload();
					}
				});
			});
			$(document).on('click', '.invalid', function () {
				var idstr='';
				 $("input:checkbox[name='my-checkbox']:checked").each(function() {
					 idstr=idstr+$(this).attr("id")+',';
				 });
				idstr=idstr.substring(0,idstr.length-1);
				$.ajax({
					url: '/index.php?m=system&c=setup&a=setstatus',
					type: "POST",
					dataType:"json",
					data:{ids:idstr,type:'invalid'},
					success:function(data){
						jqtb.ajax.reload();	
					}
				});
			});
			$(document).on('click', '.delete', function () {
				var idstr='';
				$("input:checkbox[name='my-checkbox']:checked").each(function() {
					idstr=idstr+$(this).attr("id")+',';
				});
				idstr=idstr.substring(0,idstr.length-1);
				$.ajax({
					url: '/index.php?m=system&c=setup&a=deleteExpress',
					type: "POST",
					dataType:"json",
					data:{ids:idstr},
					success:function(data){
						if(data.code == "error"){
							layer.msg(data.msg,{
								icon: 0,
								time: 2000
							});
						}else{
							layer.msg(data.msg,{
								icon: 0,
								time: 2000
							});
						}
						jqtb.ajax.reload();
					}
				});
			});
			
			$(document).on('click', '.recovery', function () {
				var idstr='';
				$("input:checkbox[name='my-checkbox']:checked").each(function() {
					idstr=idstr+$(this).attr("id")+',';
				});
				idstr=idstr.substring(0,idstr.length-1);
				$.ajax({
					url: '/index.php?m=system&c=setup&a=recoveryExpress',
					type: "POST",
					dataType:"json",
					data:{ids:idstr},
					success:function(data){
						if(data.code == "error"){
							layer.msg(data.msg,{
								icon: 0,
								time: 2000
							});
						}else{
							layer.msg(data.msg,{
								icon: 0,
								time: 2000
							});
						}
						jqtb.ajax.reload();
					}
				});
			});
			
			$(document).on('click', '.deleted', function () {
				del_type = 2;
				$("#recovery").show();
				$("#effective").hide();
				$("#invalid").hide();
				$("#delete").hide();
				$("#deleted").hide();
				$("#taobao").hide();
				$("#jdwj").hide();
				$("#pinduoduo").hide();
				$("#addjdyth").hide();
				$("#addjdythcod").hide();
				$("#addjdythwd").hide();
				$("#wuliuSet").hide();
				$("#secretSetup").hide();
				$("#availableWuliu").show();
				jqtb.ajax.reload();	
			});
			
			$(document).on('click', '.availableWuliu', function () {
				del_type = 1;
				$("#availableWuliu").hide();
				$("#recovery").hide();
				$("#effective").show();
				$("#invalid").show();
				$("#delete").show();
				$("#deleted").show();
				$("#taobao").show();
				$("#jdwj").show();
				$("#pinduoduo").show();
				$("#addjdyth").show();
				$("#addjdythcod").show();
				$("#addjdythwd").show();
				$("#wuliuSet").show();
				$("#secretSetup").show();
				jqtb.ajax.reload();	
			});
			
            $(document).on('click', '.table-address', function () {
				var id = $(this).attr("id");
				pages.addressid = id;
				$(".province input:checkbox").prop("checked", false)
				$("#shop").val("");
				
				$.ajax({
					url: '/index.php?m=system&c=setup&a=getcitys',
					type: "POST",
					dataType:"json",
					data:{type: id},
					success:function(data){
						if(data){
							for(var i=0;i<data.length;i++){
								$("#"+data[i].city_code).prop("checked", true);
								
							}
							form.render('checkbox');
						}
					}
				});
				
				$.ajax({
					url: '/index.php?m=system&c=setup&a=getReplaceExpress',
					type: "POST",
					dataType:"json",
					data:{type: id},
					success:function(data){
						if(data.replaceExpress){
							$("#replaceExpress").val(data.replaceExpress);
						}
					}
				});
				
                //很重要 不然vue付不了控件值
                layer.open({
					type: 1,
					title: '修改不送区域',
					skin: 'layui-layer-rim', //加上边框
					area: ['900px', '510px'], //宽高
					shade: 0.3,
					content: $("#table-address"),
					btn: ['确定', '取消'],
					yes: function(index, layero){
						var arr = new Array();
						$("input[name=cityCode]:checked").each(function(i){
							arr[i] = $(this).val();
						});
						var cityid = arr.join(",");	
						var data={'cityid':cityid,'addressid':pages.addressid,'shop_id':pages.shop_id,'replaceExpress':$("#replaceExpress").val()};
						var re = pages.jqajax("/index.php?m=system&c=setup&a=updatecity", data);
						jqtb.ajax.reload();
						layer.closeAll();
					}
				});
				
				form.render('checkbox');
            });
			
			//快递删除
			$(document).on('click', '.table-del', function () {
				var id = $(this).attr("id");
				pages.delid = id;
				layer.confirm('确认删除此物流吗？', {
					btn: ['确定','取消'] //按钮
				}, function(){
					$.ajax({
						url: '/index.php?m=system&c=setup&a=delTableOnceExpress',
						type: "POST",
						dataType:"json",
						data:{type: id},
						success:function(data){
							if(data){
								if(data['code'] == "ok"){
									jqtb.ajax.reload();
								}
								layer.msg(data.msg, {icon: 1});
								layer.close(index);
							}
						}
					});
				}, function(){});
            });
			
			//一联单开通
			$(document).on('click', '.table-yiliandan', function () {
				var id = $(this).attr("id");
				pages.delid = id;
				layer.confirm('确认开通此物流的一联单吗？', {
					btn: ['确定','取消'] //按钮
				}, function(){
					$.ajax({
						url: '/index.php?m=system&c=setup&a=yiliandanadd',
						type: "POST",
						dataType:"json",
						data:{id: id},
						success:function(data){
							if(data){
								if(data['code'] == "ok"){
									jqtb.ajax.reload();
									layer.msg(data.msg, {icon: 1});
								}else{
									layer.msg(data.msg, {icon: 0});
								}
								
								layer.close(index);
							}
						}
					});
				}, function(){});
            });
			
			//可送区域设置
			$(document).on('click', '.table-addattr', function () {
				$("#provinceAttr")[0].reset();
				var id = $(this).attr("id");
				pages.addattrid = id;
				shopChangeOn();
                //很重要 不然vue付不了控件值
                layer.open({
					type: 1,
					title: '修改配送区域',
					skin: 'layui-layer-rim', //加上边框
					area: ['900px', '510px'], //宽高
					shade: 0.3,
					content: $("#table-attr"),
					btn: ['确定', '取消'],
					yes: function(index, layero){
						var arr = new Array();
						$("input[name=cityKey]:checked").each(function(i){
							arr[i] = $(this).val();
						});
						var vals = arr.join(",");
						var addattrid = pages.addattrid;
						$.ajax({
							url: '/index.php?m=system&c=setup&a=updatecityon',
							type: "POST",
							dataType:"json",
							data:{
								data:vals,
								addattrid:addattrid,
							},
							success:function(data){
								layer.msg(data.msg);
								layer.close(index);
							}
						});
					}
				});
				form.render('checkbox');
			});
			
			
            $(document).on('click', '.edit-page', function () {
				$(".zto_partner_show").css('display','none');
				$(".yto_partner_show").css('display','none');
				$(".yunda_partner_show").css('display','none');
				$(".SF_appid_show").css('display','none');
				$(".SF_appkey_show").css('display','none');
				$(".SF_state_show").css('display','none');
				$(".SF_paystate_show").css('display','none');
				$(".SF_custId_show").css('display','none');
				$(".JD_customerCode_show").css('display','none');
				$(".JD_wareHouseCode_show").css('display','none');
				$(".JD_shopid_show").css('display','none');
				$(".JD_promiseTimeType_show").css('display','none');
				$(".DBKD_customerCode_show").css('display','none');
				$(".DBKD_customerCode_show").css('display','none');
                var id = $(this).attr("id");
				pages.id = id;
				pages.no = tempjson[id].no;
				pages.assist_print = tempjson[id].assist_print;
				pages.express_name = tempjson[id].name;
				pages.express_fee = tempjson[id].express_fee;
				pages.send_username = tempjson[id].send_username;
				pages.send_tel = tempjson[id].send_tel;
				pages.ratio = tempjson[id].ratio;
				pages.status = tempjson[id].status == 0 ? true : false;
				pages.default = tempjson[id].default == 1 ? true : false;
				if(tempjson[id].express_form == 'ZJ_ZTO'){
					pages.zto_partner = tempjson[id].express_config;
				}else if(tempjson[id].express_form == 'ZJ_SF' || tempjson[id].express_form == 'ZJ_SF_COD'){
					if(tempjson[id].express_config != ''){
						pages.sf_partner = JSON.parse(tempjson[id].express_config);
						$("#expressType").val(pages.sf_partner.expressType);
						$("#payMethod").val(pages.sf_partner.payMethod);
						$("#printMethod").val(pages.sf_partner.printMethod);
						form.render('select');
					}
				}else if(tempjson[id].express_form == 'JDKD_YTH_COD' || tempjson[id].express_form == 'JDKD_YTH_WD'){
					if(tempjson[id].express_config != ''){
						pages.jd_partner = JSON.parse(tempjson[id].express_config);
						$("#JD_shopid").val(pages.jd_partner.JD_shopid);
						form.render('select');
					}
				}else if(tempjson[id].express_form == 'ZJ_YTO_COD'){
					if(tempjson[id].express_config != ''){
						pages.yto_partner = JSON.parse(tempjson[id].express_config);
					}
				}else if(tempjson[id].express_form == 'ZJ_YUNDA_COD'){
					if(tempjson[id].express_config != ''){
						pages.yunda_partner = JSON.parse(tempjson[id].express_config);
					}
				}else if (tempjson[id].express_form == 'ZJ_DBKD' || tempjson[id].express_form == 'ZJ_DBKD_COD'){
					if(tempjson[id].express_config != ''){
						pages.dbkd_partner = JSON.parse(tempjson[id].express_config);
						$("#payType").val(pages.dbkd_partner.payType);
					}
				}
				
				if(tempjson[id].no.indexOf("JDKD") > -1 ){
					if(tempjson[id].express_config != ''){
						pages.jd_partner = JSON.parse(tempjson[id].express_config);
						$("#JD_promiseTimeType").val(pages.jd_partner.JD_promiseTimeType);
						form.render('select');
					}
				}
				
				$("#status").prop("checked", pages.status);
				$("#default").prop("checked", pages.default);
				$(".shoplist input:checkbox").prop("checked", false)
				if(tempjson[id].send_shopids){
					var arr = tempjson[id].send_shopids.split(",");
					for(var i=0;i<arr.length;i++){
						$("#shop_"+arr[i]+"").prop("checked", true);
					}
				}
				if(tempjson[id].print_province != ""){
					loadProvince();
					var areaValue = "";
					var a = "";
					var index1 = "";
					$("#province").val(tempjson[id].print_province);
					
					var value = $("#province").find("option[value="+tempjson[id].print_province+"]").attr("name");
					var d = value.split('_');
					var code = d[0];
					var count = d[1];
					var index = d[2];
					if(tempjson[id].print_city != ""){
						loadCity(Area[index].mallCityList);
						$("#city").val(tempjson[id].print_city);
						areaValue = $("#city").find("option[value="+tempjson[id].print_city+"]").attr("name");
						a = areaValue.split('_');
						index1 = a[2];
					}
					if(tempjson[id].print_district != ""){
						loadArea(Area[index].mallCityList[index1].mallAreaList);
						$("#area").val(tempjson[id].print_district);
					}
				}
				if(tempjson[id].express_form == 'ZJ_ZTO'){
					$(".zto_partner_show").css('display','block');
				}else if(tempjson[id].express_form == 'ZJ_SF' || tempjson[id].express_form == 'ZJ_SF_COD'){
					$(".SF_appid_show").css('display','block');
					$(".SF_appkey_show").css('display','block');
					$(".SF_state_show").css('display','block');
					$(".SF_paystate_show").css('display','block');
					$(".SF_custId_show").css('display','block');
				}else if(tempjson[id].express_form == 'JDKD_YTH_COD' || tempjson[id].express_form == 'JDKD_YTH_WD'){
					$(".JD_customerCode_show").css('display','block');
					$(".JD_wareHouseCode_show").css('display','block');
					$(".JD_shopid_show").css('display','block');
				}else if(tempjson[id].express_form == 'ZJ_YTO_COD'){
					$(".yto_partner_show").css('display','block');
				}else if(tempjson[id].express_form == 'ZJ_YUNDA_COD'){
					$(".yunda_partner_show").css('display','block');
				}else if(tempjson[id].express_form == 'ZJ_DBKD' || tempjson[id].express_form == 'ZJ_DBKD_COD'){
					$(".DBKD_customerCode_show").css('display','block');
					$(".DBKD_payType_show").css('display','block');
				}
				
				if(tempjson[id].no.indexOf("JDKD") > -1 ){
					$(".JD_promiseTimeType_show").css('display','block');
				}
				
				$("#detail").val(tempjson[id].print_detail);
				form.render();
                layer.open({
                    type: 1,
                    title: '修改快递信息',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['1000px', '600px'], //宽高
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
			
			form.on('submit(childAccount_addedit)', function (data) {
				/**
				var SF_appid = $("#SF_appid").val();				//商家代码
				var SF_appkey = $("#SF_appkey").val();				//商家秘钥
				var expressType = $("#expressType").val();			//产品类别
				var payMethod = $("#payMethod").val();				//付款方式
				var custId = $("#custId").val();					//月结卡号
				var isDoCall = $("#isDoCall").val();				//是否下call
				var isGenBillno = $("#isGenBillno").val();			//是否申请运单号
				var isGenEletricPic = $("#isGenEletricPic").val();	//是否生成电子运单图片
				var SFdata = {
					SF_appid:SF_appid,
					SF_appkey:SF_appkey,
					expressType:expressType,
					payMethod:payMethod,
					custId:custId,
					isDoCall:isDoCall,
					isGenBillno:isGenBillno,
					isGenEletricPic:isGenEletricPic
				}
				*/
				
				var province = $("#province").val();
				var city = $("#city").val();
				var area1 = $("#area").val();
				if($("#send_username").val() == ""){
					layer.msg('请填写发货人姓名',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				if($("#send_tel").val() == ""){
					layer.msg('请填写发货人电话',{
						icon: 0,
						time: 2000
					});
					return false;
				}
				data.field.province = province;
				data.field.city = city;
				data.field.area1 = area1;
				
				var re = pages.jqajax("/index.php?m=system&c=setup&a=updateExpress", data.field);
				
				setTimeout(function(e){
					jqtb.ajax.reload();
				},1500);
				
				layer.closeAll();
				return false;
            });
			
            $(document).on('click', '.adsbigclick', function () {
                var id = $(this).attr("id");
				if($("."+id).css("display")=="block"){
					$(this).html('展开<i class="layui-icon" style="font-size: 14px; color: grey;">&#xe61a;</i>');
					$("."+id).hide()
                }else{
					$(this).html('收缩<i class="layui-icon" style="font-size: 14px; color: grey;">&#xe619;</i>');
					$("."+id).show()
				}
            });
			
			form.on('submit(city_addedit)', function (data) {
				var cityid=''
				var reg = new RegExp(/^\d{6}$/);
				for(var i in data.field){
					if(reg.test(i)){
						if(cityid==''){
						cityid = i;
						}else{
							cityid = cityid +","+i
						}
					}
				}		
				var data={'cityid':cityid,'addressid':data.field.addressid,'shop_id':pages.shop_id,'replaceExpress':$("#replaceExpress").val()};
				var re = pages.jqajax("/index.php?m=system&c=setup&a=updatecity", data);
				jqtb.ajax.reload();
				layer.closeAll();
				return false;
            });
			
			//可选地址保存修改
			form.on('submit(city_addedit_attr)', function (data) {
				var addattrid = pages.addattrid;
				$.ajax({
					url: '/index.php?m=system&c=setup&a=updatecityon',
					type: "POST",
					dataType:"json",
					data:{
						data:data['field'],
						addattrid:addattrid,
					},
					success:function(data){
						layer.msg(data.msg);
						//layer.closeAll();
					}
				});
				return false;
            });
			
			form.on('submit(childAccount_cancel)', function (data) {
				layer.closeAll();
				return false;
            });
			
			$(document).on('click', '.table-taobao', function () {
				$.ajax({
					url: '/index.php?m=system&c=setup&a=getExpressTaobao',
					type: "POST",
					dataType:"json",
					data:{},
					success:function(data){
						layer.msg("获取成功");
						jqtb.ajax.reload();
					}
				});
			});
			
			$(document).on('click', '.table-jdwj', function () {
				$.ajax({
					url: '/index.php?m=system&c=setup&a=getExpressJdwj',
					type: "POST",
					dataType:"json",
					data:{},
					success:function(data){
						layer.msg("获取成功");
						jqtb.ajax.reload();
					}
				});
			});
			
			$(document).on('click', '.table-pinduoduo', function () {
				$.ajax({
					url: '/index.php?m=system&c=setup&a=getExpressPdd',
					type: "POST",
					dataType:"json",
					data:{},
					success:function(data){
						layer.msg("获取成功");
						jqtb.ajax.reload();
					}
				});
			});
			
			$(document).on('click', '.table-addjd', function () {
				$.ajax({
					url: '/index.php?m=system&c=setup&a=getExpressJd',
					type: "POST",
					dataType:"json",
					data:{},
					success:function(data){
						layer.msg("获取成功");
						jqtb.ajax.reload();
					}
				});
			});
			
			$(document).on('click', '.table-addjdyth', function () {
				$.ajax({
					url: '/index.php?m=system&c=setup&a=getExpressJdYth',
					type: "POST",
					dataType:"json",
					data:{},
					success:function(data){
						layer.msg("获取成功");
						jqtb.ajax.reload();
					}
				});
			});
			
			$(document).on('click', '.table-addjdythcod', function () {
				$.ajax({
					url: '/index.php?m=system&c=setup&a=getExpressJdYthCod',
					type: "POST",
					dataType:"json",
					data:{},
					success:function(data){
						layer.msg("获取成功");
						jqtb.ajax.reload();
					}
				});
			});
			
			$(document).on('click', '.table-addjdythwd', function () {
				$.ajax({
					url: '/index.php?m=system&c=setup&a=getExpressJdYthWd',
					type: "POST",
					dataType:"json",
					data:{},
					success:function(data){
						layer.msg("获取成功");
						jqtb.ajax.reload();
					}
				});
			});
			
			$(document).on('click', '.table-addzjzto', function () {
				$.ajax({
					url: '/index.php?m=system&c=setup&a=getExpresszjzto',
					type: "POST",
					dataType:"json",
					data:{},
					success:function(data){
						layer.msg("获取成功");
						jqtb.ajax.reload();
					}
				});
			});
			
			$(document).on('click', '.table-addzjsf', function () {
				$.ajax({
					url: '/index.php?m=system&c=setup&a=getExpresszjsf',
					type: "POST",
					dataType:"json",
					data:{},
					success:function(data){
						layer.msg("获取成功");
						jqtb.ajax.reload();
					}
				});
			});
			
			/**
			* @author => zn,
			* @time   => 2018-06-30
			* @anno	  => 保密设置
			* @param  => 
			*/
			$("#secretSetup").click(function(){
				$.ajax({
					url: '/index.php?m=system&c=setup&a=secretSel',
					dataType: "json",
					type: "POST",
					success: function (data) {
						if(data){
							/**
							if(data['is_set'] == 1){
								$("#onOff").prop("checked",true);
							}else{
								$("#onOff").prop("checked",false);
							}
							form.render('checkbox');
							*/
							$("#setAttr").val(data['address_df']);
						}
					},
					error: function () {
						layer.msg('连接超时，请重新登录');
					}
				})
				layer.open({
                    type: 1,
                    title: '保密设置',
                    skin: 'layui-layer-rim', 
                    area: ['1000px', '350px'],
                    shade: 0.3,
                    content: $("#secret_setup"),
					btn:['确定','取消'],
                    yes: function (index, layero) {
						//var is_set = $('#onOff').is(':checked');
						var address_df = $("#setAttr").val();
						$.ajax({
							url: '/index.php?m=system&c=setup&a=secretSetup',
							data: {
								//is_set:is_set,
								address_df:address_df,
							},
							dataType: "json",
							type: "POST",
							success: function (data) {
								if(data['code'] == 'ok'){
									layer.close(index);
								}
								layer.msg(data["msg"]);
							},
							error: function () {
								layer.msg('连接超时，请重新登录');
							}
						})
                    }
                });
			})
			
			/**
			* @author => zn,
			* @time   => 2018-07-06
			* @anno	  => 物流设置
			* @param  => 
			*/
			$("#wuliuSet").click(function(){
				$.ajax({
					url: '/index.php?m=system&c=setup&a=getWuliuList',
					dataType: "json",
					type: "POST",
					success: function (data) {
						if(data){
							//var oHtml = "";
							var oHtmlZj = "";
							for(var i=0;i<data.length;i++){
								//oHtml += '<input type="checkbox" name="wuliu" lay-skin="primary" title="'+data[i]['WL_NAME']+'" value="ZJ_'+data[i]['TB_ID']+'">';
								oHtmlZj += '<input type="checkbox" name="wuliu" lay-skin="primary" title="'+data[i]['WL_NAME']+'" value="PT_'+data[i]['TB_ID']+'">';
							}
							//$("#directlyWuliu").html(oHtml);
							$("#handWuliu").html(oHtmlZj);
							form.render('checkbox');
						}
					},
					error: function () {
						layer.msg('连接超时，请重新登录');
					}
				})
				layer.open({
                    type: 1,
                    title: '物流设置',
                    skin: 'layui-layer-rim', 
                    area: ['1000px', '600px'],
                    shade: 0.3,
                    content: $("#wuliu_setup"),
					btn:['确定','取消'],
                    yes: function (index, layero) {
						var wuliu_value =[]; 
						$('input[name="wuliu"]:checked').each(function(){ 
							wuliu_value.push($(this).val()); 
						}); 
						$.ajax({
							url: '/index.php?m=system&c=setup&a=setAllWuliu',
							data: {
								data:wuliu_value,
							},
							dataType: "json",
							type: "POST",
							success: function (data) {
								if(data['code'] == 'ok'){
									layer.close(index);
									jqtb.ajax.reload();
								}
								layer.msg(data["msg"]);
							},
							error: function () {
								layer.msg('连接超时，请重新登录');
							}
						})
                    }
                });
			})
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
    },
})

//初始数据
var areaData = Area;
var provinceValue = "";
var cityValue = "";
var areaValue = "";
var $form;
var form;
var $;
layui.use(['jquery', 'form'], function() {
	$ = layui.jquery;
	form = layui.form();
	$form = $('form');
	loadProvince();
});
 //加载省数据
function loadProvince() {
	var proHtml = '';
	for (var i = 0; i < areaData.length; i++) {
		proHtml += '<option name="' + areaData[i].provinceCode + '_' + areaData[i].mallCityList.length + '_' + i + '" value="' + areaData[i].provinceName+ '">' + areaData[i].provinceName + '</option>';
	}
	//初始化省数据
	$form.find('select[name=province]').append(proHtml);
	form.render();
	form.on('select(province)', function(data) {
		//$form.find('select[name=area]').html('<option value="">请选择县/区</option>').parent().hide();
		var value = data.value;
		value = $("#province").find("option[value="+value+"]").attr("name");
		var d = value.split('_');
		var code = d[0];
		var count = d[1];
		var index = d[2];
		if (count > 0) {
			loadCity(areaData[index].mallCityList);
			
		} else {
			//$form.find('select[name=city]').parent().hide();
		}
	});
}
 //加载市数据
function loadCity(citys) {
	var cityHtml = '<option name="" value=""></option>';
	for (var i = 0; i < citys.length; i++) {
		cityHtml += '<option name="' + citys[i].cityCode + '_' + citys[i].mallAreaList.length + '_' + i + '" value="' + citys[i].cityName + '">' + citys[i].cityName + '</option>';
	}
	$form.find('select[name=city]').html(cityHtml).parent().show();
	form.render();
	form.on('select(city)', function(data) {
		var value = data.value;
		value = $("#city").find("option[value="+value+"]").attr("name");
		var d = value.split('_');
		var code = d[0];
		var count = d[1];
		var index = d[2];
		if (count > 0) {
			loadArea(citys[index].mallAreaList);
		} else {
			$form.find('select[name=area]').parent().show();
		}
	});
}
 //加载县/区数据
function loadArea(areas) {
	var areaHtml = '<option name="" value=""></option>';
	for (var i = 0; i < areas.length; i++) {
		areaHtml += '<option value="' + areas[i].areaName + '">' + areas[i].areaName + '</option>';
	}
	$form.find('select[name=area]').html(areaHtml).parent().show();
	form.render();
	form.on('select(area)', function(data) {
		//console.log(data);
	});
}

function shopChange(){
	var toggle = event.currentTarget;	
	pages.shop_id = toggle.value;
	$(".province input:checkbox").prop("checked", false);
	$.ajax({
		url: '/index.php?m=system&c=setup&a=getcitys',
		type: "POST",
		dataType:"json",
		data:{type: pages.addressid, shop_id: pages.shop_id},
		success:function(data){
			if(data){
				for(var i=0;i<data.length;i++){
					$("#"+data[i].city_code).prop("checked", true);
					
				}
				form.render('checkbox');
			}
		}
	});
	
	form.render('checkbox');
}
function shopChangeOn(){
	var addattrid = pages.addattrid;
	$.ajax({
		url: '/index.php?m=system&c=setup&a=getcityson',
		type: "POST",
		dataType:"json",
		data:{addattrid:addattrid},
		success:function(data){
			if(data){
				for(var i=0;i<data.length;i++){
					$("#"+data[i].city_code+"_no").prop("checked", true);
					
				}
				form.render('checkbox');
			}
		}
	});
	
	form.render('checkbox');
}	

function GetRequest() {
	var url = location.search;
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

function nameChage(state,obj,values){

	var data={'cityid':obj,'value':$(values).val(),"status":state};
	$.ajax({
		url: "/index.php?m=system&c=setup&a=updatecityNew",
		data: data,
		dataType: "json",
		type: "POST",
		success: function (data) {
		},
		error: function () {
			alert(data.msg)
		}
	})  
}

function statusChage(id,values){
	var state =values.className;
	if(state == 'no'){
		var state = 1
	}else{
		var state = 0
	}
	var obj = values
	var data={'cityid':id,'value':state,"status":3};
	$.ajax({
		url: "/index.php?m=system&c=setup&a=updatecityNew",
		data: data,
		dataType: "json",
		type: "POST",
		success: function (data) {
			if(data.code == 'ok'){
				if(state == 0){
					$(obj).addClass('no');
					$(obj).text('否');
					$(obj).removeClass('yes');
				}else{
					$(obj).addClass('yes');
					$(obj).text('是');
					$(obj).removeClass('no');
				}
			}else{
				alert(data.msg)
			}
		},
		error: function () {
			alert(data.msg)
		}
	})  	
}