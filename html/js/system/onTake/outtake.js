var onTake = new Vue({
	el: '#onTake',
	data: {
		arr:[],
		dataArr:[],
		tableArr:[],
		sumall:[],
		bool:[false,false,false],
		m:0,
		pageNum:0,
		pageArr:[],
		page:"page1",											//每次点击导航都将值赋给此变量，以便查询按钮获取此变量的值
		status:"WAIT_ACCEPT",
	},
	mounted: function() {
		var self = this;
		//日期选择器=======================================================================================================
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {								//=========
            var $ = layui.jquery, element = layui.element, layer = layui.layer ;								//=========
            var form = layui.form(),layer = layui.layer,layedit = layui.layedit,laydate = layui.laydate;		//=========
            // 初始化表格																						//=========
            var jqtb = $('#dateTable').DataTable({																//=========
                "`dom": '<"top">rt<"bottom"flp><"clear">',														//=========
                "autoWidth": false,                     // 自适应宽度											//=========
                "paging": true,																					//=========
                "pagingType": "full_numbers",																	//=========
                "processing": true,																				//=========
                "serverSide": true,//开启服务器获取数据															//=========
                "fnServerParams": function (aoData) {															//=========
                },																								//=========
                //请求url																						//=========
                "sAjaxSource": "index.php?m=system&c=message&a=getChildAccount",								//=========
                // 初始化表格																					//=========
            });																									//=========
																												//=========
        });																										//=========
		//日期选择器结束===================================================================================================
		
		$.ajax({
		url: "/index.php?m=system&c=onTake&a=searchcust",
		type: 'post',
		data: {},
		dataType: 'json',
		success: function (data) {
			if(data){
				self.arr = data;
			}
		}
		});
		$.ajax({
		url: "/index.php?m=system&c=onTake&a=searchsumall",
		type: 'post',
		data: {},
		dataType: 'json',
			success: function (data) {
				if(data){
					self.sumall = data;
				}
			}
		});
		$.ajax({
				url: "/index.php?m=system&c=onTake&a=getOutData",
				type: 'post',
				data: {data:"WAIT_ACCEPT",num:0},
				dataType: 'json',
				success: function (data) {
					//console.log(data);
					if(data){
						self.pageArr = [];
							self.dataArr = data;
							self.pageNum = Math.ceil(data[0].pageNum / 10);
							for(var j = 0; j <  Math.ceil(data[0].pageNum / 10); j++){
								self.pageArr.push(j+1);
							}
							self.bool = [];
							for(var i = 0; i < data.length; i++){
								self.bool.push(false);
						}
					}
				}
		});
		
	},
	methods: {
		flod:function(a,index,tab,wave){
			
			var self = this;
			var toggle = event.currentTarget;
			//每次点击都将箭头初始化为初始状态
			$("." + tab + " .tableOut").find("i").each(function(){
				$(this).html("&#xe602;");
			});
			
			//箭头改变方向===============================
			if(self.bool[index] == false){
				$(toggle).find("i").html("&#xe61a;");
				self.bool[index] = true;
			}else if(self.bool[index] == true){
				$("#" + a).css("display","none");
				$(toggle).find("i").html("&#xe602;");
				self.bool[index] = false;
			}
			//箭头改变方向结束===========================
			
			if(self.bool[index] == true){
				
				$.ajax({
					url: "/index.php?m=system&c=onTake&a=getOutTable",
					type: 'post',
					data: {data:wave},
					dataType: 'json',
					success: function (data) {
						if(data){
							console.log($("." + tab + " .tableOut").find("i"));
							$("." + tab + " .tableIn").each(function(){
								$(this).css("display","none");
							});
							//每次点击将bool内的值都初始化为false
							for(var i = 0; i < self.bool.length; i++){
								self.bool[i] = false;
							}
							self.bool[index] = true;
							self.tableArr = data;
							$("#" + a).css("display","block");
						}
					}
				});
				
			}
		},
		choose:function(a,sta,page){
			var self = this;
			self.bool = [];
			
			self.page = a;
			self.status = sta;
			
			var cusno = "";
			var summary = "";
			var dateBegin = "";
			var dateEnd = "";
			
			//每次点击将具体内容模块都隐藏=========================================
			$(".tableIn").each(function(){								//=========			
				$(this).css("display","none");							//=========		
			});															//=========
			//=====================================================================
			
			
			//如果为查询按钮=======================================================
			if(page == "search"){										//=========
				if($("#cusno").val() != ""){							//=========
					cusno = $("#combo").val();							//=========
				}														//=========
				if($("#summary").val() != ""){							//=========
					summary = $("#summary").val();						//=========
				}														//=========
				if($("#dateBegin").val() != ""){						//=========
					dateBegin = $("#dateBegin").val();					//=========
				}														//=========
				if($("#dateEnd").val() != ""){							//=========
					dateEnd = $("#dateEnd").val();						//=========
				}														//=========
																		//=========
			}															//=========
			//=====================================================================
			else{
			//每次点击都将箭头初始化为初始状态 ====================================
				$(".tableOut").find("i").each(function(){				//=========
					$(this).html("&#xe602;");							//=========
				});														//=========
			//=====================================================================
			
			}
			
			if(page == "first"){
				self.m = 0;
			}else if(page == "previous" && self.m > 0){
				self.m--;
			}else if(page == "next" && self.m <= (self.pageNum - 2)){
				self.m++;
			}else if(page == "last"){
				self.m = self.pageNum - 1;
			}else if(page != "first" && page != "previous" && page != "next" && page != "last"){
				self.m = (page - 1);
			}
			if(a != "F"){
				
				var toggle = event.currentTarget;
				$(".UL li").each(function(){
					$(this).css("backgroundColor","white");
				});
				toggle.style.backgroundColor = "lightblue";
				
				$(".page").each(function(){
					$(this).css("display","none");
				});
				$("." + a).css("display","block");
			}
			
			
			$(".page input[name='EFF_ID']").each(function(){
						$(this).prop("checked", false);
					}); 
					
				$.ajax({
					url: "/index.php?m=system&c=onTake&a=getOutData",
					type: 'post',
					data: {data:sta,num:self.m,cusno:cusno, summary:summary, dateBegin:dateBegin, dateEnd:dateEnd},
					dataType: 'json',
					success: function (data) {
						
						if(data){
							self.pageArr = [];
							self.dataArr = data;
							self.pageNum = Math.ceil(data[0].pageNum / 10);
							for(var j = 0; j <  Math.ceil(data[0].pageNum / 10); j++){
								self.pageArr.push(j+1);
							}
							self.bool = [];
							for(var i = 0; i < data.length; i++){
								self.bool.push(false);
							}
						}else{
							//若无数据，则全部制空																							//=============
							self.pageArr = [];																								//=============
							self.pageNum = 0;																								//=============
							self.dataArr = [];																								//=============
							self.bool = [];	
						}
					}
				});
			
		},
		selectAll:function(a,b){
			
				if ($("#" + a).prop("checked") == false) { 
					$("#" + a).prop("checked",true);
					$("."+b+" input[name='EFF_ID']").each(function(){
						$(this).prop("checked", true);
					});  
				} else {  
					$("#" + a).prop("checked",false);
					$("."+b+" input[name='EFF_ID']").each(function(){
						$(this).prop("checked", false);
					});
				} 
		},
		reset1:function(){
			$("#stalls").val("");
			$("#summary").val("");
			$("#dateBegin").val("");
			$("#dateEnd").val("");
		},
		setgoods:function(wave_no,prd_no,take_status,index,tabs){
			var self = this;
			$.ajax({
					url: "/index.php?m=system&c=onTake&a=setgoodstatus",
					type: 'post',
					data: {wave_no:wave_no,prd_no:prd_no,take_status:take_status},
					dataType: 'json',
					success: function (data) {
						
						$(".tableIn").each(function(){
								$(this).css("display","none")
								
						})
						//每次点击都将箭头初始化为初始状态
						$("." + tabs + " .tableOut").find("i").each(function(){
							$(this).html("&#xe602;");
						});
						//每次点击将bool内的值都初始化为false
							for(var i = 0; i < self.bool.length; i++){
								self.bool[i] = false;
							}
						
						
						
					}
				});
			
		},
		setyesorder:function(tabs,type,status){
			var self = this;
			var wave_no = "";
			var statusorder ;
			alert("请选择至少一条数据");
			console.log(222);
			
			
			if($("." + tabs + " input[name='EFF_ID']:checked").length == 0){
				alert("请选择至少一条数据");
				return false;
			}
			
			if(confirm("确认执行此操作么？")){
				
				$("."+tabs+" input[name='EFF_ID']:checked").each(function(){
					statusorder = $(this).attr('status');
					if(statusorder==status){
						if(wave_no==''){
						wave_no = $(this).prop("id");
						}else{
							wave_no = wave_no+","+$(this).prop("id");
						}
					}
				}); 
				
			}else{
				return false;
			}
			
			
			$.ajax({
					url: "/index.php?m=system&c=onTake&a=setorders",
					type: 'post',
					data: {type:type,wave_no:wave_no},
					dataType: 'json',
					success: function (data) {
						
						$.ajax({
								url: "/index.php?m=system&c=onTake&a=getOutData",
								type: 'post',
								data: {data:status,num:0},
								dataType: 'json',
								success: function (data) {
									if(data){
										self.pageArr = [];
											self.dataArr = data;
											self.pageNum = Math.ceil(data[0].pageNum / 10);
											for(var j = 0; j <  Math.ceil(data[0].pageNum / 10); j++){
												self.pageArr.push(j+1);
											}
											self.bool = [];
											for(var i = 0; i < data.length; i++){
												self.bool.push(false);
										}
										
									}else{
										//若无数据，则全部制空																							//=============
										self.pageArr = [];																								//=============
										self.pageNum = 0;																								//=============
										self.dataArr = [];																								//=============
										self.bool = [];	
									}
								}
						});
						
						$.ajax({
							url: "/index.php?m=system&c=onTake&a=searchsumall",
							type: 'post',
							data: {},
							dataType: 'json',
								success: function (data) {
									if(data){
										self.sumall = data;
									}
								}
							});
						msg(data.msg,'#dff0d8','#3c763d');
					}
			});
			
		},
		
		
		
		
		
	},
});

function setpricenew(e){
	
			$.ajax({
				url: '/index.php?m=system&c=onTake&a=setpricenew',
				type: "POST",
				dataType:"json",
				data:{wave_no:$(e).attr('waveno'),prd_no:$(e).attr('prdno'),price_new:$(e).val()},
				success:function(data){
							$(".tableIn").each(function(){
								$(this).css("display","none")
								
							})
							//每次点击都将箭头初始化为初始状态
							$(".tab .tableOut").find("i").each(function(){
								$(this).html("&#xe602;");
							});
							//每次点击将bool内的值都初始化为false
								for(var i = 0; i < onTake.bool.length; i++){
									onTake.bool[i] = false;
								}
					}
			});
	
		}
function setsendorder(e){

		$.ajax({
			url: '/index.php?m=system&c=onTake&a=setsendorder',
			type: "POST",
			dataType:"json",
			data:{wave_no:$(e).attr('waveno'),prd_no:$(e).attr('prdno'),sendorder:$(e).val()},
			success:function(data){
						$(".tableIn").each(function(){
								$(this).css("display","none")
								
							})
							//每次点击都将箭头初始化为初始状态
							$(".tab .tableOut").find("i").each(function(){
								$(this).html("&#xe602;");
							});
							//每次点击将bool内的值都初始化为false
								for(var i = 0; i < onTake.bool.length; i++){
									onTake.bool[i] = false;
								}
				}
		});

	}	
		
		
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

function getData(dataArr,bool,sta){
	
}

