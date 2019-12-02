var labelDiv = new Vue({
	el: '#labelDiv',
	data: {
		layprint:[],
	},
	mounted: function() {
		var self = this;
		$.ajax({
			url: "/index.php?m=system&c=setUp&a=getLabel",
			type: 'post',
			data: {},
			dataType: 'json',
			success: function (data) {
				$("#separator").val(data[0].split_str);
				$("#first").val(data[0].node1);
				$("#second").val(data[0].node2);
				$("#third").val(data[0].node3);
				$("#fourth").val(data[0].node4);
				$("#fifth").val(data[0].node5);
				$("#sixth").val(data[0].node6);
				$("#fourCode").val(data[0].fourCode);
				if(data[0].order_one == 1){
					$("#single").prop("checked",true);
				}else{
					$("#single").prop("checked",false);
				}
				if(data[0].print_space == 1){
					$("#cut").prop("checked",true);
				}else{
					$("#cut").prop("checked",false);
				}
			}
		});
		
		
	},
	methods: {
		sure:function(){
			var self = this;
			var data = [];
			
			var separator = $("#separator").val();
			var first = $("#first").val();
			var second = $("#second").val();
			var third = $("#third").val();
			var fourth = $("#fourth").val();
			var fifth = $("#fifth").val();
			var sixth = $("#sixth").val();
			var fourCode = $("#fourCode").val();
			if((first != "" || second != "" || third != "" || fourth != "" || fifth != "" || sixth != "") && separator == ""){
				   
				layui.use('layer', function(){
					var layer = layui.layer; 
					layer.msg("请选择分隔符",{
						icon: 0,
						time: 2000
					});
				});    
				return false;
			}
			
			data.push(separator);
			if(first != ""){
				data.push(first);
			}
			if(second != ""){
				data.push(second);
			}
			if(third != ""){
				data.push(third);
			}
			if(fourth != ""){
				data.push(fourth);
			}
			if(fifth != ""){
				data.push(fifth);
			}
			if(sixth != ""){
				data.push(sixth);
			}
			
			for(var i = data.length; i < 7; i++){
				data.push("");
			}
			
			var single = $("#single").prop("checked");
			
			if(single){
				single = 1;
			}else{
				single = 0;
			}
			data.push(single);
			var cut = $("#cut").prop("checked");
			
			if(cut){
				cut = 1;
			}else{
				cut = 0;
			}
			data.push(cut);
			data.push(fourCode);
			$.ajax({
				url: "/index.php?m=system&c=setUp&a=insertLabel",
				type: 'post',
				data: {data:data},
				dataType: 'json',
				success: function (data) {
					if(data.cede = "ok"){
						layui.use('layer', function(){
							var layer = layui.layer; 
							layer.msg("修改成功",{
								icon: 1,
								time: 2000
							});
						}); 
						$.ajax({
							url: "/index.php?m=system&c=setUp&a=getLabel",
							type: 'post',
							data: {data:data},
							dataType: 'json',
							success: function (data) {
								$("#separator").val(data[0].split_str);
								$("#first").val(data[0].node1);
								$("#second").val(data[0].node2);
								$("#third").val(data[0].node3);
								$("#fourth").val(data[0].node4);
								$("#fifth").val(data[0].node5);
								$("#sixth").val(data[0].node6);
								$("#fourCode").val(data[0].fourCode);
								if(data[0].order_one == 1){
									$("#single").prop("checked",true);
								}else{
									$("#single").prop("checked",false);
								}
								if(data[0].print_space == 1){
									$("#cut").prop("checked",true);
								}else{
									$("#cut").prop("checked",false);
								}
							}
						});
					}else{
						layui.use('layer', function(){
							var layer = layui.layer; 
							layer.msg("修改失败",{
								icon: 2,
								time: 2000
							});
						}); 
					}
				}
			});
		},
		
	},
});

																																												
																																																	
