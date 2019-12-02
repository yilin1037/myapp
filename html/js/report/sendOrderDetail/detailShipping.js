var vueObj = new Vue({
    el: '#app',
    data: {
        shippingClientArr: paramObject.shippingClientObj,
		dateBegin:nowDate,
		dateEnd:nowDate,
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
					,value: toDayTime
					,done: function(value, date, endDate){
						self.dateEnd = value;
					}
				  });
				  
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=report&c=sendOrderDetail&a=sendOrderGoodsDetailList'
					
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'cus_no', title: '档口',"width":170}
					  ,{field:'send_time', title: '发货时间',"width":170}
					  ,{field:'shopname', title: '店铺',"width":120}
					  ,{field:'new_tid', title: '订单号',"width":180}
					  //,{field:'show_tid', title: '网店订单号',"width":180}
					  ,{field:'buyer_nick', title: '买家昵称',"width":120}
					  ,{field:'receiver_state', title: '目的省份',"width":200}
					  ,{field:'receiver_address', title: '收货地址',"width":200}
					  ,{field:'express_name', title: '快递',"width":80}
					  ,{field:'express_no', title: '运单号',"width":130}
					  ,{field:'prd_no', title: '商品编号',"width":200}
					  ,{field:'title', title: '商品标题',"width":150}
					  ,{field:'sku_name', title: '销售属性',"width":200}
					  ,{field:'num', title: '数量',"width":80}
					  ,{field:'cost_price', title: '拿货价',"width":80}
					  ,{field:'sum_price', title: '拿货金额',"width":100}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-145'
					,where:{
						DROP_SHIPPING: "T",
						dateBegin: jQuery("#toDayWeek").val(),
						dateEnd: jQuery("#toDayTime").val(),
					}
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
						tab.reload({
							where: {
								shipping:$("#shipping").val(),
								dateBegin:self.dateBegin,
								dateEnd:self.dateEnd,
								express_no:$("#express_no").val(),
								tid:$("#tid").val(),
								DROP_SHIPPING: "T",
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
			var shipping = $("#shipping").val();
            execAjax({
                m:'report',
                c:'sendOrderDetail',
                a:'exportTakeSendOrderGoodsDetail',
                data:{
					DROP_SHIPPING: 'T', 
					shipping: shipping,
					dateBegin:self.dateBegin,
					dateEnd:self.dateEnd,
					express_no:$("#express_no").val(),
					tid:$("#tid").val(),
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
                }
            });
        });
    },
    methods: {
        resetNow:function(){
			var self = this;
			$("#dateBegin").html("");
			$("#dateEnd").html("");
			$("#shipping").val("");
			$("#express_no").val("");
            $("#tid").val("");
			self.dateBegin = "";
			self.dateEnd = "";
		}
    }
});