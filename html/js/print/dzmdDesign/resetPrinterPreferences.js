var labelDiv = new Vue({
	el: '#labelDiv',
	data: {
		layprint:[],
	},
	mounted: function() {
		var self = this;
		setTimeout(function(){
			doConnect();
			doGetPrinters(function(data){																																							
				self.layprint =  data;																																								
			});	
		})
	}
})