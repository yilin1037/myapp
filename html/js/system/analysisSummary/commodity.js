var flow = new Vue({
	el: '#flow',
	data: {
		arr:[],
		myChart:"",
		num:10,
		type:"money",
		num_type:'hot',
		num:10,
		time_type:"today",
		dateBegin:"",
		dateEnd:"",
	},
	mounted: function() {
		var self = this;
        //var jqtb;
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				var laydate = layui.laydate;
				//自定义格式
				laydate.render({
					elem: '#dateBegin'
					,format: 'yyyy-MM-dd'
					,done: function(value, date){
						self.dateBegin = value;
					}
				});
				
				//自定义格式
				laydate.render({
					elem: '#dateEnd'
					,format: 'yyyy-MM-dd'
					,done: function(value, date){
						self.dateEnd = value;
					}
				});
				
				self.myChart = echarts.init(document.getElementById('main'));
				// 指定图表的配置项和数据
				var option = {
					
					tooltip: {},
					legend: {
						data:[]
					},
					xAxis: {
						data: []
					},
					yAxis: {},
					series: []
				};
				self.myChart.setOption(option, true);
				self.loadReport(self.type,'today','','',self.num_type,self.num);
				$("#reportType").find('.day_type').on('click',function(){
					self.time_type = $(this).attr('lay-id');
					self.loadReport(self.type,$(this).attr('lay-id'),'','',self.num_type,self.num);
					$("#dateBegin").val("");
					$("#dateEnd").val("");
					self.dateBegin = "";
					self.dateEnd = "";
					$(".other").css("display","none");
				});
				
				$("#reportType").find('.other_type').on('click',function(){
					$(".other").css("display","block");
				});
				
			});
		});
	},
	methods: {
		loadReport:function(type,time_type,dateBegin,dateEnd,num_type,num){
			var self = this;
			self.myChart.showLoading();
			execAjax({
				m:'system',
				c:'analysisSummary',
				a:'getGoods',
				data:{time_type:time_type,dateBegin:dateBegin,dateEnd:dateEnd,num_type:num_type,num:num,order_type:type},
				success:function(data){
					if(data){
						self.arr = data;
						var name = [];
						var money = [];
						var qty = [];
						for(var i = 0; i < data.length; i++){
							name.push(data[i].prd_no+"_"+data[i].prd_sku_name);
							money.push(data[i].total_fee);
							qty.push(data[i].qty);
						}
						self.myChart.hideLoading();
						if(self.type == "money"){
							self.myChart.setOption({
								legend: {
									data:['销售额']
								},
								xAxis: {
									type: 'category',
									boundaryGap: true,
									data: name
								},
								series: [{
									// 根据名字对应到相应的系列
									name: '销售额',
									type: 'bar',
									data: money
								}]
							});
						}else if(type == "number"){
							self.myChart.setOption({
								legend: {
									data:['销量']
								},
								xAxis: {
									type: 'category',
									boundaryGap: true,
									data: name
								},
								series: [{
									// 根据名字对应到相应的系列
									name: '销量',
									type: 'bar',
									data: qty
								}]
							});
						}
					}else{
						self.arr = [];
						self.myChart.hideLoading();
						self.myChart.setOption({
								legend: {
									data:[]
								},
								xAxis: {
									type: 'category',
									boundaryGap: true,
									data: []
								},
								series: [{
									// 根据名字对应到相应的系列
									name: '销量',
									type: 'bar',
									data: []
								}]
							});
					}
					//vueObj.prdtItems = data['Sale'];
				}
			});
		},
		
		search:function(){
			var self = this;
			
			self.loadReport(self.type,'other',self.dateBegin,self.dateEnd,self.num_type,self.num);
		}
	}
});

$('#money').on('ifChecked ifUnchecked', function(event){
	if (event.type == 'ifChecked') {																																								
		flow.type = 'money';
		flow.loadReport(flow.type,flow.time_type,flow.dateBegin,flow.dateEnd,flow.num_type,flow.num);		
	}
		
});

$('#number').on('ifChecked ifUnchecked', function(event){
	if (event.type == 'ifChecked') {																																								
		flow.type = 'number';
		flow.loadReport(flow.type,flow.time_type,flow.dateBegin,flow.dateEnd,flow.num_type,flow.num);			
	}
		
});

function saleChange(value){
	if(value == "hot_10"){
		flow.num_type = 'hot';
		flow.num = 10;
	}else if(value == "hot_20"){
		flow.num_type = 'hot';
		flow.num = 20;
	}else if(value == "hot_30"){
		flow.num_type = 'hot';
		flow.num = 30;
	}else if(value == "cold_30"){
		flow.num_type = 'cold';
		flow.num = 30;
	}
	flow.loadReport(flow.type,flow.time_type,flow.dateBegin,flow.dateEnd,flow.num_type,flow.num);	
}

$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});