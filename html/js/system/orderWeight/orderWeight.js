var vue = new Vue({
	el: '#vue',
	data: {
		
	},
	mounted: function() {
		layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
			var laydate = layui.laydate 	//日期
				,laypage = layui.laypage 	//分页
				,layer = layui.layer 		//弹层
				,form = layui.form 			//表单
				,element = layui.element 	//元素操作
				,table = layui.table;		//表格	

			$("#express_no").focus();
		})
	},
	methods:{
		express_no_input:function(){
			var self = this;
			var express_no = $("#express_no").val();
			if(express_no == ''){
				layer.msg('请扫描物流单号',{icon: 2});
				return false;
			}
			
			$("#orderWeight").focus();
		},
		orderWeight_input:function(){
			var self = this;
			var express_no = $("#express_no").val();
			var orderWeight = $("#orderWeight").val();
			if(express_no == ''){
				layer.msg('请扫描物流单号',{icon: 2});
				return false;
			}
			if(orderWeight == ''){
				layer.msg('请录入订单重量',{icon: 2});
				return false;
			}
			
			$.ajax({
				url:'?m=system&c=orderWeight&a=orderWeightSave',
				dataType: 'json',
				type: "post",
				data:{
					express_no: express_no,
					orderWeight: orderWeight,
				},
				success:function(data){
					if(data['code'] == "error"){
						layer.msg(data.msg,{icon: 2});
						if(data['msg'] == "没有查找到对应的订单"){
							$("#express_no").val("");
							$("#orderWeight").val("");
							$("#express_no").focus();
						}
					}else{
						layer.msg('称重完成',{icon: 1});
						
						$("#express_no").val("");
						$("#orderWeight").val("");
						$("#express_no").focus();
					}
				}
			})
			
		},
	}
})