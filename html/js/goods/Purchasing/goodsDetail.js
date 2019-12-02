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
				  var laydate = layui.laydate;
				  //时间选择器
				  laydate.render({
					elem: '#dateBegin'
					,type: 'date'
					,value: toDayWeek
					,done: function(value, date, endDate){
						self.dateBegin = value;
					  }
				  });

				  laydate.render({
					elem: '#dateEnd'
					,type: 'date'
					,value:toDayTime
					,done: function(value, date, endDate){
						self.dateEnd = value;
					}
				  });
				  
				  layer.load(2);
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=report&c=sendOrderDetail&a=sendOrderGoodsDetailList'
					,where:  {
						dateBegin: jQuery("#toDayWeek").val(),
						dateEnd: jQuery("#toDayTime").val(),
					}
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'send_time', title: '发货时间',"width":170}
					  ,{field:'shopname', title: '店铺',"width":120}
					  ,{field:'new_tid', title: '订单号',"width":180}
					  ,{field:'show_tid', title: '网店订单号',"width":180}
					  ,{field:'buyer_nick', title: '买家昵称',"width":120}
					  ,{field:'express_name', title: '快递',"width":80}
					  ,{field:'express_no', title: '运单号',"width":130}
					  ,{field:'payment_time', title: '付款时间',"width":170}
					  ,{field:'prd_no', title: '商品编号',"width":100}
					  ,{field:'title', title: '商品标题',"width":150}
					  ,{field:'sku_name', title: '销售属性',"width":150}
					  ,{field:'num', title: '数量',"width":80}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-145'
					,limit: 50
					,done: function(res, curr, count){
						layer.closeAll('loading');
					}
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
					  layer.load(2);
					  tab.reload({
						where: {
							dateBegin: self.dateBegin,
							dateEnd: self.dateEnd,
							express_type: $("#express_type").val(),
							express_no: $("#express_no").val(),
							shop_id: $("#shop_id").val(),
							tid: $("#tid").val()
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
                a:'exportTakeSendOrderGoodsDetail',
                data:{dateBegin: vueObj.dateBegin,
					  dateEnd: vueObj.dateEnd,
					  express_type: $("#express_type").val(),
					  express_no: $("#express_no").val(),
					  shop_id: $("#shop_id").val(),
					  tid: $("#tid").val()
				},
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
			var self = this;
			
			$("#dateBegin").html("");
			$("#dateEnd").html("");
			$("#express_type").val("");
			$("#express_no").val("");
            $("#shop_id").val("");
            $("#tid").val("");
			self.dateBegin = "";
			self.dateEnd = "";
		}
    }
});