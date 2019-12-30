var vueObj = new Vue({
    el: '#app',
    data: {
        expressItems: paramObject.expressObj,
        shopItems: paramObject.shopObj,
		dateBegin:'',
		dateEnd:'',
		DROP_SHIPPING:"F",
		shippingId:"",
		expressArr:[],	
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
				  var laydate = layui.laydate;
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
					,url: 'index.php?m=report&c=sendOrderDetail&a=sendOrderFreightList'
					,where:  {
						dateBegin: jQuery("#toDayWeek").val(),
						dateEnd: jQuery("#toDayTime").val(),
						changeDiv1: jQuery("#changeDiv1").val(),
					}
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'send_time', title: '发货时间',"width":180}
					  ,{field:'new_tid', title: '订单号',"width":150}
					  ,{field:'statusName', title: '标记状态',"width":150}
					  ,{field:'buyer_nick', title: '买家昵称',"width":100}
					  ,{field:'express_name', title: '快递',"width":100}
					  ,{field:'express_no', title: '运单号',"width":150}
					  ,{field:'shopname', title: '店铺',"width":100}
					  ,{field:'weight', title: '称重重量',"width":100, sort: true}
					  ,{field:'weight_goods', title: '理论重量',"width":100}
					  ,{field:'post_fee', title: '运费收入',"width":100}
					  ,{field:'expense_fee', title: '运费成本',"width":100}
					  ,{field:'profit', title: '运费收益',"width":100}
					  ,{field:'receiver_state', title: '省',"width":100}
					  ,{field:'receiver_city', title: '市',"width":100}
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
							dateBegin:self.dateBegin,
							dateEnd:self.dateEnd,
							express_type:$("#express_type").val(),
							express_no:$("#express_no").val(),
							changeDiv1:$("#changeDiv1").val(),
							shop_id:$("#shop_id").val(),
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
		
        //导出
        $("#submitExcel").click(function () {
            var indexLoad = layer.load();
			layer.load(2);
            execAjax({
                m:'report',
                c:'sendOrderDetail',
                a:'exportTakeSendOrderFreight',
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
		$("#importWeight").click(function () {
            var indexLoad = layer.load();
			$("#fileName").val("");
			$("#fileExcel").val("");
			//导入
			layer.open({
				type: 1,
				title: '导入称重重量',
				skin: 'layui-layer-rim',
				area: ['490px', '250px'],
				shade: 0.3,
				content: $("#importExcel"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					//采用FormData上传文件
					var fileExcel = $("#fileExcel")[0].files[0];
					if(!fileExcel){
						layer.msg('请选择上传文件', {icon: 2});
						return false;
					}
					var formData = new FormData();
					formData.append("file",fileExcel );
					$.ajax({
						url:'/?m=report&c=sendOrderDetail&a=saveImportExcel',
						type: "post",
						data: formData,
						processData: false,
						contentType: false,
						success:function(data){
							layer.close(indexLoad);
							if (typeof data == 'string') {
								var data = JSON.parse(data);
							}
							if(data['code'] == 'ok'){
								layer.close(index);
								layer.msg(data['msg'], {icon: 1});
								$('#submitSearch') .click(); 
							} else {
								layer.msg(data.msg, {icon: 2});
							}
							
						}
					});	
				},
				btn2: function(index, layero){
					layer.close(indexLoad);
				},
				cancel: function (index, layero) {	
					layer.close(indexLoad);
				}
			});
        });
        self.getSignStatus();
    },
    methods: {
        resetNow:function(){
			$("#dateBegin").html("");
			$("#dateEnd").html("");
			$("#express_type").val("");
			$("#express_no").val("");
            $("#shop_id").val("");
            $("#tid").val("");
			self.dateBegin = "";
			self.dateEnd = "";
		},
		calFreight:function(){
			var self = this;
			var dateBegin = self.dateBegin;
			var dateEnd = self.dateEnd;
			var indexLoad = layer.load();

			layer.load(2);
            execAjax({
                m:'report',
                c:'sendOrderDetail',
                a:'calFreight',
                data:{dateBegin: dateBegin, dateEnd: dateEnd},
                success:function(data){
                    layer.close(indexLoad);
                    if(data['code'] == 'ok'){
                        layer.msg('计算完毕',{
        					icon: 1,
        					time: 2000
        				});
                    }else{
                        layer.msg(data['msg'],{
        					icon: 2,
        					time: 2000
        				});	
                    }
					layer.closeAll('loading');
                }
            });
		},
		getSignStatus:function(){
			var self =this;
			$.ajax({
				url: "/index.php?m=system&c=delivery&a=getSignStatus",
				type: 'post',
				data: {DROP_SHIPPING: self.DROP_SHIPPING, shippingId: self.shippingId},
				dataType: 'json',
				success: function (data) {
					self.expressArr = data;	
					var dsosHtml = '<div style="float:left;"><select class="sign_status form-control separator" style="background: url(\'images/down.png\') no-repeat scroll 90% center transparent;background-size:17px 15px;border:solid 1px #ccc;width:204px;">';
					dsosHtml += '<option value=""></option><option value="0">无标记状态</option>';
					if(data){
						for(var i = 0; i < data.length; i++){
							dsosHtml += '<option value="' + data[i]['id'] + '">' + data[i]['statusName'] + '</option>';
						}
						dsosHtml += '</select>';
					}
					dsosHtml += '</select></div><div style="margin-left:10px;float:left;"><button id="signStatusManage" class="btn" style="width:120px;" onclick="signStatusManage()">添加标记状态</button></div>';
					$("#changeDiv1").html(dsosHtml);
				}
			});
		},
    }
});

function postTemplate(){
	layer.open({
		title :'运费规则',
		type: 2,
		shade: 0.3,
		area: ['1000px', '630px'],
		maxmin: false,
		content: '?m=system&c=setup&a=expressExpenses',
		success: function(layero, index){
			/*var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			iframeWin.vueObj.loadOrders('',{});*/
		}
	}); 
}
function signStatusManage(){
	layer.open({
		title :'添加标记状态',
		type: 2,
		shade: 0.3,
		area: ['350px', '450px'],
		maxmin: false,
		content: '?m=system&c=delivery&a=signStatusManage'
		
	}); 
}