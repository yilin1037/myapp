var tableList = new Vue({
	el: '#tableList',
	data: {
		unique_code:"",
		order:"",
	},
	mounted: function() {
		var self = this;
		$("#unique_code").focus();
		layui.use(['tree', 'layer','element'], function(){
			var layer = layui.layer,element=layui.element
			,$ = layui.jquery; 
		  
		   
		});
	},
	methods: {
		
	},
		
																																																	
																																																	
});	


$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});																																																	
