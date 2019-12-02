var tab;
var tableList = new Vue({
	el: '#tableList',
	data: {
		searchData:{},
	},
	mounted: function() {
		var self = this;
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate','tree'], function(){
				var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  
				tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=goods&c=giftRule&a=getData'
					,cols: [[
					   {checkbox: true ,fixed: true}
					  ,{field:'LAY_TABLE_INDEX', width:40, title: '' , templet: '#indexTpl', align: 'center', unresize: true ,fixed: true, event: 'rowClick'}
					  ,{field:'', title: '操作',"width":180 ,fixed: true, templet: '#actionTpl', event: 'rowClick', align: 'center'}
					  ,{field:'activity_no', title: '活动编号',"width":120,fixed: true, event: 'rowClick'}
					  ,{field:'activity_name', title: '活动名称',"width":200}
					  ,{field:'activity_disable', title: '活动状态',"width":100, event: 'rowClick'}
					  ,{field:'shopname', title: '活动店铺',"width":300, event: 'rowClick'}
					  ,{field:'rule_plan_name', title: '赠送方式',"width":100, event: 'rowClick'}
					  ,{field:'timeRule_name', title: '时间类型',"width":90, event: 'rowClick'}
					  ,{field:'start_time', title: '开始时间',"width":160, event: 'rowClick'}
					  ,{field:'end_time', title: '结束时间',"width":160, event: 'rowClick'}
					  ,{field:'isTime_name', title: '倍数赠送',"width":100, event: 'rowClick'}
					  ,{field:'remark', title: '备注',"width":300, event: 'rowClick'}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-150'
					,limit: 20
					,where:{
						data: {
							/*dateBegin: layui.$("#dateBegin").val(),
							dateEnd: layui.$("#dateEnd").val(),*/
						}
					}
					,done:function(res, curr, count){
						var data = res['data'];
						var dataLength = data.length;
						if(dataLength > 0){
							for(var i in data){
								if(data[i]['activity_disable'] != '启用'){
									$("#tableList").find("tr[data-index='"+data[i]['LAY_TABLE_INDEX']+"']").css({
										'background-color':'#FFECEC'
									});
								}
							}
						}
					}
				});
				  
				var $ = layui.$, active = {
					reload: function(){
						var searchdata = self.searchData;
						searchdata.activity_no = $("#activity_no").val();
						searchdata.activity_name = $("#activity_name").val();
						
						self.searchData = searchdata;
						
						tab.reload({
							where: {
								data: searchdata
							}
					  });
					}
				};
				  
				$('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					
					active[type] ? active[type].call(this) : '';
				});
				
				table.on('tool(user)', function(obj){
					var data = obj.data;
					var activity_no = data.activity_no;
					
					if(obj.event === 'edit'){
						tableList.giftRuleAction('edit',activity_no);
					}else if(obj.event === 'look'){
						tableList.giftRuleAction('look',activity_no);
					}else if(obj.event === 'del'){
						layer.confirm('确定删除？删除后数据无法恢复！', function(index){
							$.ajax({																																														
								url: "/index.php?m=goods&c=giftRule&a=delGiftRule",																																		
								type: 'post',																																												
								data: {activity_no: activity_no},																																													
								dataType: 'json',																																											
								success: function (data) {
									if(data.code == "ok"){
										layer.msg('操作成功',{
											icon: 1,
											time: 2000
										});
										
										layer.close(index);
										tab.reload({
											where: {
												data: self.searchData
											}
										});
									}else if(data.code == "error"){
										layer.msg(data.msg,{
											icon: 2,
											time: 2000
										});
										layer.close(index);
									}
								}																																															
							});
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
			
			if(self.show){
				$('input[name="shop"]').each(function(){
					$(this).iCheck('uncheck');
				});
			}
			
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
		},
		giftRuleAction:function(type,activity_no){
			var self = this;
			
			if(type == "add"){
				var title = "新增赠品规则";
			}else if(type == "edit"){
				var title = "编辑赠品规则";
			}else{
				var title = "查看赠品规则";
			}
			
			layer.open({
				title :title,
				type: 2,
				shade: 0.3,
				area: ['1300px', '800px'],
				maxmin: false,
				content: '?m=goods&c=giftRule&a=giftRuleWindow',
				success: function(layero, index){
					var body = layer.getChildFrame('body', index);
					var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
					iframeWin.vueObj.loadOrders({'action': type, 'activity_no': activity_no});
				}
			});
		},
	},
});

function tableReload(){
	tab.reload({
		where: {
			data: tableList.searchData
		}
	});
}