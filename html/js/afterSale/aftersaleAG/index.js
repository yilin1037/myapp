var tab;
var tableList = new Vue({
	el: '#tableList',
	data: {
		shopArr:[],
		show:false,
		searchData:{},
	},
	mounted: function() {
		var self = this;
		
		//获取网店
		$.ajax({
			url: "/index.php?m=afterSale&c=aftersaleSuccess&a=getShop",										
			type: 'post',																		
			data: {},																	
			dataType: 'json',																	
			success: function (data) {			
				self.shopArr = data;
				$(document).ready(function(){
					$('.skin-minimal input').iCheck({
						checkboxClass: 'icheckbox_minimal',
						radioClass: 'iradio_minimal',
						increaseArea: '20%'
					});
				});	
			}																					
		});

		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate','tree'], function(){
				var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				var laydate = layui.laydate;
				
				var $ = layui.$, active = {
					reload: function(){
						var searchdata = self.searchData;
						searchdata.shopid = $("#shopname").attr("name");
						searchdata.refund_id = $("#aftersale_refund_id").val();
						searchdata.tid = $("#aftersale_tid").val();
						searchdata.ag_status = $("#aftersale_ag_status").val();
						searchdata.has_good_return = $("#aftersale_has_good_return").val();
						searchdata.good_status = $("#aftersale_good_status").val();
						searchdata.buyer_nick = $("#aftersale_buyer_nick").val();
						searchdata.dateBegin = $("#dateBegin").val();
						searchdata.dateEnd = $("#dateEnd").val();
						searchdata.refund_goods_status = $("#aftersale_refund_goods_status").val();
						
						self.searchData = searchdata;
						
						tab.reload({
							where: {
								data: searchdata
							}
					  });
					}
				};
				
				//时间选择器
				laydate.render({
					elem: '#dateBegin'
					,type: 'datetime'
					,done: function(value, date, endDate){
						//self.dateBegin = value;
					}
				});

				laydate.render({
					elem: '#dateEnd'
					,type: 'datetime'
					,done: function(value, date, endDate){
						//self.dateEnd = value;
					}
				});
				  
				tab = table.render({
					elem: '#LAY_table_user'
					,url:'index.php?m=afterSale&c=aftersaleAG&a=getData'
					,skin: 'row'
					,page: true 
					,limits: [10, 20, 50, 100]
					,limit: 20 
					,cellMinWidth: 80
					,height: 'full-100'
					,cols: [[
						{field:'LAY_TABLE_INDEX', width:40, title: '' , templet: '#indexTpl', align: 'center', unresize: true ,fixed: true}
						,{field:'', title: '处理',"width":90 ,fixed: true, templet: '#actionTpl'}
						,{field:'refund_id', title: '退款单号',"width":170,fixed: true}
						,{field:'has_good_return_name', title: '退款类型',"width":90,fixed: true}
						,{field:'ag_status_name', title: '退款状态(AG)',"width":120,fixed: true}
						,{field:'shopname', title: '来源店铺',"minWidth":125,fixed: true}
						,{field:'tid', title: '订单号',"minWidth":175,fixed: true}
						,{field:'buyer_nick', title: '买家昵称',"minWidth":120, templet: '#buyer_nickTpl'}
						,{field:'refund_status_name', title: '退款状态',"width":120}
						,{field:'refund_goods_status_name', title: '货物退回状态',"width":120}
						,{field:'refund_express_status_name', title: '物流登记状态',"width":120}
						,{field:'refund_aftersale_status', title: '换货补发状态',"width":130}
						,{field:'created', title: '退款申请时间',"width":170}
						,{field:'refund_fee', title: '退款金额',"width":90}
						,{field:'good_status_name', title: '货物状态',"width":120}
						,{field:'order_status_name', title: '订单状态',"width":100}
						,{field:'company_name', title: '退货快递',"width":90}
						,{field:'sid', title: '退货快递单号',"width":120}
						,{field:'num', title: '商品数量',"width":90}
						,{field:'reason', title: '退款原因',"width":200}
						,{field:'desc', title: '退款说明',"width":300}
						,{field:'title', title: '商品标题',"width":500}
						,{field:'sku', title: '商品SKU信息',"width":500}
						,{field:'ag_reason', title: 'AG退款说明',"width":300}
					]]
					,id: 'testReload'
					,even: true
					,where:{
						data: {dateBegin: $("#dateBegin").val(), dateEnd: $("#dateEnd").val(), has_good_return: $("#aftersale_has_good_return").val(), ag_status: $("#aftersale_ag_status").val()}
					}
				});
				  
				$('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					
					active[type] ? active[type].call(this) : '';
				});
				
				table.on('tool(user)', function(obj){
					var data = obj.data;
					var refund_id = data.refund_id;
					
					if(obj.event === 'actionAG'){
						layer.confirm('确定AG售后退款吗?', function(index){
							$.ajax({
								url: "/index.php?m=afterSale&c=aftersaleAG&a=actionAG",																																		
								type: 'post',
								data: {refund_id: refund_id},																																													
								dataType: 'json',																																											
								success: function (data) {
									if(data.code == "ok"){
										layer.msg("操作成功",{
											icon: 1,
											time: 2000
										});
										
										tableReload();
									}else if(data.code == "error"){
										layer.msg(data.msg,{
											icon: 2,
											time: 2000
										});
									}
								}																																															
							});
							
							layer.close(index);
						});
					}else if(obj.event === 'actionPT'){
						layer.confirm('确定退款处理吗?', function(index){
							$.ajax({
								url: "/index.php?m=afterSale&c=aftersaleAG&a=actionPT",																																		
								type: 'post',
								data: {refund_id: refund_id},																																													
								dataType: 'json',																																											
								success: function (data) {
									if(data.code == "ok"){
										layer.msg("操作成功",{
											icon: 1,
											time: 2000
										});
										
										tableReload();
									}else if(data.code == "error"){
										layer.msg(data.msg,{
											icon: 2,
											time: 2000
										});
									}
								}																																															
							});
							
							layer.close(index);
						});
					}
				});
			});
		});
	},
	methods: {
		//店铺查询条件
		shopHide:function(){
			var self = this;
			self.show = !self.show;
			
			/*if(self.show){
				$('input[name="shop"]').each(function(){
					$(this).iCheck('uncheck');
				});
			}*/
			
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
		},
		//重置按钮
		reset_now:function(){
			$("input[name='reset']").val("");
			$("select").val("");
			$("#circle_time").val("month");
			$("#shopname").val("");
			$("#shopname").attr("name","");
			$("#dateBegin").val(nowDateWeek);
			$("#dateEnd").val(nowDate);
			$("#aftersale_has_good_return").val("1");
			$("#aftersale_ag_status").val("0");
			$('input[name="shop"]').each(function(){
				$(this).iCheck('uncheck');
			});
			tab.reload({
				where: {
					data: {dateBegin: $("#dateBegin").val(), dateEnd: $("#dateEnd").val(), has_good_return: $("#aftersale_has_good_return").val(), ag_status: $("#aftersale_ag_status").val()},
					page : 1
				}
			});
		},
	},
});	

$('.dropdown-toggle').dropdown();

function timeChange(value){
	if(value == "taday"){
		$("#dateBegin").val(nowDateDay);
		$("#dateEnd").val(nowDate);
	}else if(value == "week"){
		$("#dateBegin").val(nowDateWeek);
		$("#dateEnd").val(nowDate);
	}else if(value == "month"){
		$("#dateBegin").val(nowDateMonth);
		$("#dateEnd").val(nowDate);
	}else if(value == "three_month"){
		$("#dateBegin").val(nowDate3Month);
		$("#dateEnd").val(nowDate);
	}
}

function tableReload(){
	tab.reload({
		where: {
			data: tableList.searchData
		}
	});
}


