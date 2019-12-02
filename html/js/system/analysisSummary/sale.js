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
		wh:[],
		wh_value:"",
	},
	mounted: function() {
		var self = this;
		
		$.ajax({
			url: "/index.php?m=system&c=analysisSummary&a=get_wh",
			data: {},
			dataType: "json",
			type: "POST",
			success: function (data) {
				if(data){
					self.wh = data;
				}
			}
		});
			
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
				//self.loadReport(self.type,'today','','',self.wh_value);
				$("#reportType").find('.day_type').on('click',function(){
					self.time_type = $(this).attr('lay-id');
					self.loadReport(self.type,$(this).attr('lay-id'),'','',self.wh_value);
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
		loadReport:function(type,time_type,dateBegin,dateEnd,wh){
			var self = this;
			self.myChart.showLoading();
			execAjax({
				m:'system',
				c:'analysisSummary',
				a:'getSale',
				data:{time_type:time_type,dateBegin:dateBegin,dateEnd:dateEnd,order_type:type,wh:wh},
				success:function(data){
					if(data){
						
						self.arr = data;
						var date = [];
						var money = [];
						var total_fee = [];
						for(var i = 0; i < data.length; i++){
							date.push(data[i].effect_date);
							money.push(data[i].money);
							total_fee.push(data[i].total_fee);
						}
					
						self.myChart.hideLoading();
						
						self.myChart.setOption({
							legend: {
								data:['销售金额','利润']
							},
							xAxis: {
								type: 'category',
								boundaryGap: true,
								data: date
							},
							series: [{
								// 根据名字对应到相应的系列
								name: '销售金额',
								type: 'bar',
								stack: 'one',
								data: total_fee
							},{
								// 根据名字对应到相应的系列
								name: '利润',
								type: 'bar',
								stack: 'one',
								data: money
							}]
						});
						
					}else{
						self.arr = [];
						self.myChart.hideLoading();
						self.myChart.setOption({
								legend: {
									data:['销售金额','利润']
								},
								xAxis: {
									type: 'category',
									boundaryGap: true,
									data: []
								},
								series: [{
									// 根据名字对应到相应的系列
									name: '销售金额',
									type: 'bar',
									data: []
								},{
									// 根据名字对应到相应的系列
									name: '利润',
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
			
			self.loadReport(self.type,'other',self.dateBegin,self.dateEnd,self.wh_value);
		}
	}
});

function saleChange(value){
	flow.wh_value = value;
	flow.loadReport(flow.type,flow.time_type,flow.dateBegin,flow.dateEnd,flow.wh_value);	
}

$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});