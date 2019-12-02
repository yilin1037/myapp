var vueObj = new Vue({
    el: '#app',
    data: {
        shippingClientArr: paramObject.shippingClientObj,
		dateBegin:'',
		dateEnd:'',
		expressList:[],
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
					,url: 'index.php?m=report&c=sendOrderDetail&a=detailSumShippingTable'
					
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'addtime', title: '时间',"minWidth":170} 
					  ,{field:'system_id', title: '代发客户',"minWidth":170}
					  ,{field:'system_name', title: '昵称',"minWidth":170}
					  ,{field:'express_name', title: '快递',"width":170}
					  ,{field:'express_money', title: '面单价',"width":180}
					  ,{field:'tid', title: '订单号',"minWidth":170}
					  ,{field:'express_no', title: '运单号',"minWidth":170}
					  ,{field:'express_fee', title: '对账金额',"minWidth":100}
					]]
					,id: 'testReload'
					,page: true
					,limit: 20 //每页默认显示的数量
					,height: 'full-95'
					,method: 'post'
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
								expressName:$("#expressName").val(),
							}
						});
					}
				  };
				  
				  $('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					//self.expressName = $("#expressName").val();
					active[type] ? active[type].call(this) : '';
				  });
				  
				  $('.key_search').on('keydown', function(){
					  var e = event || window.event;
					  if(e.keyCode == 13){
						var type = $(this).data('type');
					
						active[type] ? active[type].call(this) : '';
					  }
				  });
				  $.ajax({
						url:'/?m=report&c=sendOrderDetail&a=getexpress',
						dataType: 'json',
						type: "post",
						data:{},
						success:function(data){
							vueObj.expressList = data;
						}
					})
			});
		});
		
        
        //导出
        $("#submitExcel").click(function () {
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
        });
		
		//导出
        $("#submitExcelDetail").click(function () {
            var indexLoad = layer.load();
			var shipping = $("#shipping").val();
            execAjax({
                m:'report',
                c:'sendOrderDetail',
                a:'exportDetailSumShippingDetailTable',
				data:{
					shipping:$("#shipping").val(),
					dateBegin:self.dateBegin,
					dateEnd:self.dateEnd,
					express_no:$("#express_no").val(),
					tid:$("#tid").val(),
					expressName:$("#expressName").val(),
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
			$("#express_no").val("");
            $("#tid").val("");
			$("#expressName").val("");
			self.dateBegin = "";
			self.dateEnd = "";
		}
    }
});