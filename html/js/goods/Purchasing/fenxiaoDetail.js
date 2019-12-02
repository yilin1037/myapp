var $;
var vueObj = new Vue({
    el: '#app',
    data: {
        shippingClientArr: paramObject.shippingClientObj,
		dateBegin: nowdate,
		dateEnd: nowdate,
    },
    mounted: function () {
		var self = this;
        var tempjson = new Array();
        var jqtb;
        //layui 模块 入口
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  $ = layui.$;
				  
				  if(DROP_SHIPPING_SYNC != 'T'){
					$("#shipping").val(LOGIN_SYSTEM_ID);	
				  }
				  
				  //时间选择器
				  laydate.render({
					elem: '#dateBegin'
					,type: 'date'
					,value: nowdate
					,done: function(value, date, endDate){
						self.dateBegin = value;
					  }
				  });

				  laydate.render({
					elem: '#dateEnd'
					,type: 'date'
					,value: nowdate
					,done: function(value, date, endDate){
						self.dateEnd = value;
					}
				  });
				  
				  layer.load(2);
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=report&c=sendOrderDetail&a=fenxiaoDetailList'
					
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'prd_no', title: '商品编号',"width":170}
					  ,{field:'title', title: '商品名称',"width":170}
					  ,{field:'num', title: '商品数量',"width":180}
					  ,{field:'costSum', title: '商品金额',"width":170}
					]]
					,id: 'testReload'
					,page: true
					,limit: 20 //每页默认显示的数量
					,height: 'full-145'
					,done: function(res, curr, count){
						layer.closeAll('loading');
					}
				  });
				  
				  var active = {
					reload: function(){
						layer.load(2);
						tab.reload({
							where: {
								shipping:$("#shipping").val(),
								dateBegin:self.dateBegin,
								dateEnd:self.dateEnd,
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
        /*$("#submitExcel").click(function () {
            var indexLoad = layer.load();
			var shipping = $("#shipping").val();
            execAjax({
                m:'report',
                c:'sendOrderDetail',
                a:'exportDetailSumShippingTable',
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
        });*/
    },
    methods: {
        resetNow:function(){
			var self = this;
			$("#dateBegin").html(nowdate);
			$("#dateEnd").html(nowdate);
			self.dateBegin = nowdate;
			self.dateEnd = nowdate;
			if(DROP_SHIPPING_SYNC == 'T'){
				$("#shipping").val("");	
			}else{
				$("#shipping").val(LOGIN_SYSTEM_ID);
			}
		}
    }
});