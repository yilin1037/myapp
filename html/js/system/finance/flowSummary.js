var flow = new Vue({
	el: '#flow',
	data: {
		price:0,
		dateBegin:"",
		dateEnd:"",
	},
	mounted: function() {
		var self = this;
		
		$.ajax({
			url: "/index.php?m=system&c=finance&a=balance",
			data: {},
			dataType: "json",
			type: "POST",
			success: function (data) {
				self.price = data[0].price;
			}
		})
		
		var tempjson = new Array();
        //var jqtb;
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  //时间选择器
				  laydate.render({
					elem: '#dateBegin'
					,type: 'datetime'
					,done: function(value, date, endDate){
						self.dateBegin = value;
					  }
				  });

				  laydate.render({
					elem: '#dateEnd'
					,type: 'datetime'
					,done: function(value, date, endDate){
						self.dateEnd = value;
					}
				  });
				  
				  layer.load(2);
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=system&c=finance&a=getflowSummary'
					
					,cols: [[
					   {field:'index', title: '序号',"width":60 ,fixed: true}
					  ,{field:'create_date', title: '日期',"width":240}
					  ,{field:'type', title: '类型',"width":180}
					  ,{field:'money', title: '金额（元）',"width":180}
					  ,{field:'', title: '面单数',"width":180}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-245'
					,done: function(res, curr, count){
						layer.closeAll('loading');
					}
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
					  layer.load(2);
					  tab.reload({
						
						where: {
							separator:$("#separator").val(),
							dateBegin:self.dateBegin,
							dateEnd:self.dateEnd
						}
					  });
					}
				  };
				  
				  $('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					
					active[type] ? active[type].call(this) : '';
				  });
				  
				  
				
			});
		});

	},
	methods: {
		reset:function(){
			var self = this;
			$("#separator").val("");
			$("#dateBegin").html("");
			$("#dateEnd").html("");
			self.dateBegin = "";
			self.dateEnd = "";
		},
		turnTo:function(a,url){
			parent.addTab(a,url,a);
		}
	}
});
