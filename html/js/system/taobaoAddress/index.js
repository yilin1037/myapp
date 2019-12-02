var address = new Vue({
	el: '#address',
	data: {
		arr:[],
		shop:"淘宝"
	},
	mounted: function() {
		var self = this;
		
	},
	methods: {
		getShopName:function(){
			var self = this;
			$.ajax({
				url: '/index.php?m=system&c=taobaoAddress&a=getShopName',
				type: "POST",
				dataType:"json",
				data:{},
				success:function(data){
					if(data != 0){
						self.arr = data;
					}else{
						self.arr = [];
						alert("无淘宝店铺信息");
						
					}
				}
			});
		},
		selectAll:function(){
			
			if ($("#checkAll").prop("checked")) {  
				$(":checkbox").prop("checked", true);  
			} else {  
				$(":checkbox").prop("checked", false);  
			} 
		},
		deleteShop:function(){
			var self = this;
			var data = "";
			$('input[name="my-checkbox"]:checked').each(function(){ 
				data += ($(this).val() + ","); 
			});
			if(data == ""){
				alert("请选择至少一行数据");
				return false;
			}else if(data != ""){
				if(confirm("确定删除么？")){
					$.ajax({
						url: '/index.php?m=system&c=taobaoAddress&a=deleteShop',
						type: "POST",
						dataType:"json",
						data:{data:data},
						success:function(data){
							if(data.code == "ok"){
								success();
								reloadnow(self, self.arr);
							}else{
								faild();
							}
						}
					});
				}
			}
		}

	},
});

function faild(){
	var div = document.createElement(div);
	div.className = "alert alert-danger";
	div.roleName = "alert";
	div.innerHTML = "删除失败";
	div.style.position = "fixed";
	div.style.left = "50%";
	div.style.top = "50%";
	div.style.marginLeft = "-44px";
	div.style.marginTop = "-26px";
	div.style.zIndex = "1000";
	document.body.appendChild(div);
	setTimeout(function(){
		document.body.removeChild(div);
	},1000);
}

function success(){
	var div = document.createElement(div);
	div.className = "alert alert-success";
	div.roleName = "alert";
	div.innerHTML = "删除成功";
	div.style.position = "fixed";
	div.style.left = "50%";
	div.style.top = "50%";
	div.style.marginLeft = "-44px";
	div.style.marginTop = "-26px";
	div.style.zIndex = "1000";
	document.body.appendChild(div);
	setTimeout(function(){
		document.body.removeChild(div);
	},1000);
}

function reloadnow(self, arr){
	$.ajax({
		url: '/index.php?m=system&c=taobaoAddress&a=search',
		type: "POST",
		dataType:"json",
		data:{},
		success:function(data){
			self.arr = data;
		}
	});
}

