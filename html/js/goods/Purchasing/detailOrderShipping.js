var vueObj = new Vue({
    el: '#app',
    data: {
        shippingClientArr: paramObject.shippingClientObj,
		dateBegin:nowdate,
		dateEnd:nowdate,
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
				  
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=report&c=sendOrderDetail&a=detailOrderShippingTable'
					
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'new_tid', title: '订单号',"width":170}
					  ,{field:'status_name', title: '发货状态',"width":170}
					  ,{field:'express_no', title: '运单号',"width":170}
					  ,{field:'addtime', title: '创建时间',"width":170} 
					  ,{field:'branch_code', title: '网点编码',"width":170}
					  ,{field:'branch_name', title: '网点名称',"width":170}
					  ,{field:'system_id', title: '客户编码',"width":170}
					  ,{field:'system_name', title: '客户名称',"width":170}
					  //,{field:'billProvideSiteName', title: '目的网点',"width":170}
					  //,{field:'system_name', title: '目的分拨',"width":170}
					  ,{field:'receiver_state', title: '目的省份',"width":170}
					  ,{field:'receiver_city', title: '目的市',"width":170}
					  ,{field:'receiver_district', title: '目的区',"width":170}
					  ,{field:'receiver_address', title: '收件详细地址',"width":170}
					  ,{field:'receiver_name', title: '收件人姓名',"width":170}
					  ,{field:'receiver_mobile', title: '收件人电话',"width":170}
					  ,{field:'sortation', title: '大头笔',"width":170}
					  ,{field:'consolidation', title: '集包地',"width":170}
					]]
					,id: 'testReload'
					,page: true
					,limit: 50 //每页默认显示的数量
					,height: 'full-80'
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
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
        $("#submitExcel").click(function () {
            var indexLoad = layer.load();
			var shipping = $("#shipping").val();
            execAjax({
                m:'report',
                c:'sendOrderDetail',
                a:'exportDetailOrderShippingTable',
				data:{shipping: shipping, dateBegin:self.dateBegin, dateEnd:self.dateEnd},
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
			self.dateBegin = "";
			self.dateEnd = "";				
		}
    }
});