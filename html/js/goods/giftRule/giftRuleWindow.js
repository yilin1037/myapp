var layer;
var tableParam = {
    elem: '#tid_items'
    ,id:'tid_items'
    ,cols: [[
      {width:120, templet: '#prdActionTpl'}
      ,{field:'prd_no', title: '商品编号', width:200}
      ,{field:'title', title: '商品名称', width:200}
      ,{field:'num', title: '数量', width:80, edit:'text'}
    ]]
    ,data:[]
    ,page: false
    ,limit:99999
    ,height: 185
};

var tableGiftParam = {
    elem: '#gift_items'
    ,id:'gift_items'
    ,cols: [[
      {width:120, templet: '#prdActionTpl'}
      ,{field:'prd_no', title: '商品编号', width:200}
      ,{field:'title', title: '商品名称', width:200}
      ,{field:'num', title: '数量', width:80, edit:'text'}
    ]]
    ,data:[]
    ,page: false
    ,limit:99999
    ,height: 185
};

var vueObj = new Vue({
    el: '#app',
    data: {
        shopidArr:paramObject.shopidArr,
        tableObj:false,
		tableGiftObj:false,
		dataSpecial:{},//外部传特殊标志，如复制订单、换货订单、补发订单等参数
		show:false,
    },
    mounted: function () {
        layui.use(['table', 'layer', 'laydate'], function(){
            var table = layui.table;
			var laydate = layui.laydate;
			layer = layui.layer;
			  
			//时间选择器
			laydate.render({
				elem: '#dateBegin'
				,type: 'datetime'
				/*,done: function(value, date, endDate){
					self.dateBegin = value;
				}*/
			});

			laydate.render({
				elem: '#dateEnd'
				,type: 'datetime'
				/*,done: function(value, date, endDate){
					self.dateEnd = value;
				}*/
			});
			
			$(document).ready(function(){
				$('.skin-minimal input').iCheck({
					checkboxClass: 'icheckbox_minimal',
					radioClass: 'iradio_minimal',
					increaseArea: '20%'
				});
			});	
				
            vueObj.itmesTable();
			vueObj.itmesGiftTable();
            table.on('tool(tid_items)', function(obj){
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值
                var tr = obj.tr; //获得当前行 tr 的DOM对象
                if(layEvent === 'del'){ //删除
                    layer.confirm('真的删除行么', function(index){
                        obj.del(); //删除对应行（tr）的DOM结构
                        layer.close(index);
                        for(var i in tableParam.data){
                            if(tableParam.data[i]['temp_id'] == data['temp_id']){
                                tableParam.data.splice(i, 1);
                                break;
                            }
                        }
                    });
                }
            });
			
			table.on('tool(gift_items)', function(obj){
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值
                var tr = obj.tr; //获得当前行 tr 的DOM对象
                if(layEvent === 'del'){ //删除
                    layer.confirm('真的删除行么', function(index){
                        obj.del(); //删除对应行（tr）的DOM结构
                        layer.close(index);
                        for(var i in tableGiftParam.data){
                            if(tableGiftParam.data[i]['temp_id'] == data['temp_id']){
                                tableGiftParam.data.splice(i, 1);
                                break;
                            }
                        }
                    });
                }
            });
        });
    },
    methods: {
        loadOrders:function(dataSpecial){
			vueObj.dataSpecial = dataSpecial;
			if(dataSpecial.action == 'edit' || dataSpecial.action == 'look'){
				var activity_no = dataSpecial.activity_no;
				
				if(activity_no){
					$.ajax({																																													//===========
						url: "/index.php?m=goods&c=giftRule&a=getGiftRule",																																		//===========
						type: 'post',																																											//===========
						data: {activity_no:activity_no},																																												//===========
						dataType: 'json',																																										//===========
						success: function (data) {
							$("#activity_name").val(data['dataGiftRule']['activity_name']);
							$("#shopname").val(data['dataGiftRule']['shopname']);
							$("#shopname").attr("name",data['dataGiftRule']['shopid']);
							$("#timeRule").val(data['dataGiftRule']['timeRule']);
							$("#activity_disable").val(data['dataGiftRule']['activity_disable']);
							$("#isTime").val(data['dataGiftRule']['isTime']);
							$("#dateBegin").val(data['dataGiftRule']['start_time']);
							$("#dateEnd").val(data['dataGiftRule']['end_time']);
							$("#remark").val(data['dataGiftRule']['remark']);
							
							cbProductRows(data['dataSub'],'normal');
							cbProductRows(data['dataGiftSub'],'gift');
						}																																														//===========
					});
					
					if(dataSpecial.action == 'look'){
						$('.showBtn').hide();
						$("#activity_name").attr("disabled","disabled");
						$("#shopname").attr("disabled","disabled");
						$("#timeRule").attr("disabled","disabled");
						$("#activity_disable").attr("disabled","disabled");
						$("#isTime").attr("disabled","disabled");
						$("#dateBegin").attr("disabled","disabled");
						$("#dateEnd").attr("disabled","disabled");
						$("#remark").attr("disabled","disabled");
						
						tableParam = {
							elem: '#tid_items'
							,id:'tid_items'
							,cols: [[
							  {field:'prd_no', title: '商品编号', width:200}
							  ,{field:'title', title: '商品名称', width:200}
							  ,{field:'num', title: '数量', width:80}
							]]
							,data:[]
							,page: false
							,limit:99999
							,height: 185
						};
						
						tableGiftParam = {
							elem: '#gift_items'
							,id:'gift_items'
							,cols: [[
							  {field:'prd_no', title: '商品编号', width:200}
							  ,{field:'title', title: '商品名称', width:200}
							  ,{field:'num', title: '数量', width:80}
							]]
							,data:[]
							,page: false
							,limit:99999
							,height: 185
						};
					}
				}
			}
        },
		shopHide:function(){
			var self = this;
			self.show = !self.show;
			// if(self.dataSpecial.action == 'look'){
			// 	self.show = false;
			// }
			
			// if(self.show){
			// 	$('input[name="shop"]').each(function(){
			// 		$(this).iCheck('uncheck');
			// 	});
			// }
			
			var arr = [];
			var name = [];
			
			$('input[name="shop"]').each(function(){
				$(this).on('ifChecked ifUnchecked', function(event){																																			
					var newArr = [];
					var nameArr = [];
					if (event.type == 'ifChecked') {
						console.log($("label").attr("for"))
						
						$('input[name="shop"]').each(function(){
							if(true == $(this).is(':checked')){
								newArr.push($(this).prop("class"));
								nameArr.push($(this).val());
							}
							
						});
						arr = newArr;
						name = nameArr;
						//$(".southwest input[name='places']").iCheck('check');																																		
					} else {																																														
						//$(".southwest input[name='places']").iCheck('uncheck');
						$('input[name="shop"]').each(function(){
							if(true == $(this).is(':checked')){
								newArr.push($(this).prop("class"));
								nameArr.push($(this).val());
							}
						});
						arr = newArr;
						name = nameArr;
					}
					var a = "";
					var b = "";
					for(var i = 0; i < arr.length; i++){
						a += (arr[i] + ",");
						b += (name[i] + ",");
					}
					a = a.substring(0,a.length-1);
					b = b.substring(0,b.length-1);
					$("#shopname").val(a);
					$("#shopname").attr("name",b);
				});
			});
		},
		//店铺查询条件清空按钮事件
		clearValue:function(){
			$("#shopname").val("");
			$("#shopname").attr("name","");
			$("[name='shop']:checked").each(function(index, el) {
				//$(el).attr('checked','');
				$(el).iCheck('uncheck');
				//$(el).parent().attr('class','icheckbox_minimal');
			});
		},
        itmesTable:function(){
            var table = layui.table;
            tableParam['where'] = {
                key: ''
            };
            if(!vueObj.tableObj){
                vueObj.tableObj = table.render(tableParam);
            }else{
                vueObj.tableObj.reload(tableParam);
            }
        },
		itmesGiftTable:function(){
            var table = layui.table;
            tableGiftParam['where'] = {
                key: ''
            };
            if(!vueObj.tableGiftObj){
                vueObj.tableGiftObj = table.render(tableGiftParam);
            }else{
                vueObj.tableGiftObj.reload(tableGiftParam);
            }
        },
        openSelectProductNormal:function(){
            layer.open({
                title :'选择商品',
                type: 2,
                shade: false,
                area: ['700px', '500px'],
                maxmin: false,
                content: '?m=widget&c=selectLocalProduct&a=index&param=normal'
            }); 
        },
		openSelectProductGift:function(){
            layer.open({
                title :'选择商品',
                type: 2,
                shade: false,
                area: ['700px', '500px'],
                maxmin: false,
                content: '?m=widget&c=selectLocalProduct&a=index&param=gift'
            }); 
        },
        saveOrders:function(){
			var action = vueObj.dataSpecial.action;
            var activity_no = vueObj.dataSpecial.activity_no;
            var activity_name = $("#activity_name").val();
            var shopid = $("#shopname").attr("name");
            var timeRule = $("#timeRule").val();
            var start_time = $("#dateBegin").val();
            var end_time = $("#dateEnd").val();
            var remark = $("#remark").val();
            var activity_disable = $("#activity_disable").val();
            var isTime = $("#isTime").val();
            
			if(action == ''){
				layer.msg('非法请求',{
					icon: 2,
					time: 2000
				});
                return;
			}
			
            if(activity_name == ''){
                layer.msg('活动名称不能为空',{
					icon: 2,
					time: 2000
				});
                return;
            }
            if(shopid == ''){
                layer.msg('店铺不能为空',{
					icon: 2,
					time: 2000
				});
                return;
            }
            if(start_time == ''){
                layer.msg('开始时间不能为空',{
					icon: 2,
					time: 2000
				});
                return;
            }
            if(end_time == ''){
                layer.msg('结束时间不能为空',{
					icon: 2,
					time: 2000
				});
                return;
            }
			
            if(tableParam.data.length == 0){
                layer.msg('活动商品不能为空',{
					icon: 2,
					time: 2000
				});
                return;
            }
			
			if(tableGiftParam.data.length == 0){
                layer.msg('赠送商品不能为空',{
					icon: 2,
					time: 2000
				});
                return;
            }
			
			if(start_time > end_time){
				layer.msg('开始时间不能大于结束时间',{
					icon: 2,
					time: 2000
				});
                return;
			}
			
            var prdData = JSON.stringify(tableParam.data);
			var prdDataGift = JSON.stringify(tableGiftParam.data);
            execAjax({
                m:'goods',
                c:'giftRule',
                a:'saveGiftRule',
                data:{
					action: action,
                    activity_no: activity_no,
					activity_name: activity_name,
                    shopid: shopid,
                    timeRule: timeRule,
                    start_time: start_time,
                    end_time: end_time,
                    remark: remark,
					activity_disable: activity_disable,
					isTime: isTime,
                    prdData: prdData,
					prdDataGift: prdDataGift,
                },
                success:function(data){
					if(data['code'] == 'ok'){
						vueObj.cancel();
						var index = parent.layer.getFrameIndex(window.name);
						layer.close(index);
						parent.tableReload();
					}else{
                        layer.msg(data['msg'],{
							icon: 2,
							time: 2000
						});
					}
                }
            });
        },
        cancel:function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
    }
});

function cbProductRows(data,widgetType){
	if(widgetType == 'normal'){
		for(var i = 0; i < data.length; i++){
			data[i]['temp_id'] = getTimeStamp(true);

			tableParam.data.push(data[i]);
		}
		vueObj.itmesTable();
	}else if(widgetType == 'gift'){
		for(var i = 0; i < data.length; i++){
			data[i]['temp_id'] = getTimeStamp(true);

			tableGiftParam.data.push(data[i]);
		}
		vueObj.itmesGiftTable();
	}
}