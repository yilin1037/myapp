var outTake = new Vue({
	el: '#outTake',
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
		layprintTplBq:[],
		layprint:[],
		wave_nos:'',
		uniqueall:[],
		tableWaveArr:[],
		isshow:'',
		unisshow:'',
		btisshow:true,
		btisnoshow:false
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
		url: "/index.php?m=system&c=outTake&a=searchcust",
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
		url: "/index.php?m=system&c=outTake&a=searchsumall",
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
				url: "/index.php?m=system&c=outTake&a=getOutData",
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
					}else{
						$(".page").each(function(){
								$(this).css("display","none");
							});
						$(".pagemsg").css("display","block");
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
					url: "/index.php?m=system&c=outTake&a=getOutTable",
					type: 'post',
					data: {wave_no:wave},
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
			var prd_no = "";
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
				if($("#prd_no").val() != ""){							//=========
					prd_no = $("#prd_no").val();						//=========
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
					$(this).css("borderBottom","none");
				});
				toggle.style.borderBottom = "3px solid rgb(95, 184, 120)";
				
				$(".page").each(function(){
					$(this).css("display","none");
				});
				$("." + a).css("display","block");
			}
			
			
			$(".page input[name='EFF_ID']").each(function(){
						$(this).prop("checked", false);
					}); 
					
				$.ajax({
					url: "/index.php?m=system&c=outTake&a=getOutData",
					type: 'post',
					data: {data:sta,num:self.m,cusno:cusno, summary:summary, dateBegin:dateBegin, dateEnd:dateEnd,prd_no:prd_no},
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
							$(".page").each(function(){
								$(this).css("display","none");
							});
							$(".pagemsg").css("display","block");
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
			$("#combo").val("");
			$("#summary").val("");
			$("#dateBegin").val("");
			$("#dateEnd").val("");
		},
		setgoods:function(wave_no,prd_no,take_status,index,tabs){
			var self = this;
			$.ajax({
					url: "/index.php?m=system&c=outTake&a=setgoodstatus",
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
			
			if(type=='unprint'){
				if($("#layprint").val() != ""){
					var unprintname = $("#layprint").val();
				}else{
					alert("请选择打印机！");
					return
				}	
				if($("#layprintTplBq").val() != ""){
					var unprintTplBq = $("#layprintTplBq").val();
				}else{
					alert("请选择打印模板！");
					return
				}
			}
			var self = this;
			var wave_no = "";
			var statusorder ;
			
			var cusno = "";
			var summary = "";
			var prd_no = "";
			var dateBegin = "";
			var dateEnd = "";
			var selectall = "";
			if ($("#current"+tabs).prop("checked") == true) { 
				var selectall = "yes";
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
				if($("#prd_no").val() != ""){							//=========
					prd_no = $("#prd_no").val();						//=========
				}														//=========
																		//=========
			}															//=========
			
			
			if($("." + tabs + " input[name='EFF_ID']:checked").length == 0){
				alert("请选择至少一条数据");
				return false;
			}
			
			if(confirm("确认执行此操作么？")){
				var notstyle =''
				$("."+tabs+" input[name='EFF_ID']:checked").each(function(){
					statusorder = $(this).attr('status');
					if(statusorder==status){
						if(wave_no==''){
						wave_no = $(this).prop("id");
						}else{
							wave_no = wave_no+","+$(this).prop("id");
						}
					}else{
						 notstyle ='1'
						alert('选中批次不符合操作状态')
						return false;
					}
					
				}); 
				if(notstyle=='1'){
					
					return false;
				}
				
				if(type=='unprintsend'){
					
					var len = $("."+tabs+" input[name='EFF_ID']:checked").length;
					if(len>1){
						alert("配货扫描请选择一个交易批次");
						return false;
					}
					this.wave_nos = wave_no;
					this.isshow = true;
					this.unisshow = false;
					if(tabs=='tab7'){
						this.btisshow = false;
						this.btisnoshow = true;
					}else{
						this.btisshow = true;
						this.btisnoshow = false;
					}
					$.ajax({
						url: "/index.php?m=system&c=outTake&a=getOutTable",
						type: 'post',
						data: {wave_no:wave_no,type:'getwave'},
						dataType: 'json',
						success: function (data) {
							if(data){
								outTake.uniqueall = [];
								$("#addunprint").val("");
								self.tableWaveArr = data;
							}
						}
					});
					layer.open({
									type: 1,
									title: '已配货货品确认 批次号：'+wave_no,
									skin: 'layui-layer-rim', //加上边框
									area: ['900px', '500px'], //宽高
									shade: 0.3,
									content: $("#table-unprintsend"),
									cancel: function (index, layero) {
										
									}
								});
					
					return false;
					
				}
				
				if(type=='unprintsend1'){
					
					var len = $("."+tabs+" input[name='EFF_ID']:checked").length;
					if(len>1){
						alert("配货扫描请选择一个交易批次");
						return false;
					}
					this.wave_nos = wave_no;
					this.isshow = false;
					this.unisshow = true;
					$.ajax({
						url: "/index.php?m=system&c=outTake&a=getOutTable",
						type: 'post',
						data: {wave_no:wave_no,type:'getwave'},
						dataType: 'json',
						success: function (data) {
							if(data){
								outTake.uniqueall = [];
								$("#addunprint").val("");
								self.tableWaveArr = data;
							}
						}
					});
					layer.open({
									type: 1,
									title: '已配货货品确认 批次号：'+wave_no,
									skin: 'layui-layer-rim', //加上边框
									area: ['700px', '500px'], //宽高
									shade: 0.3,
									content: $("#table-unprintsend"),
									cancel: function (index, layero) {
										
									}
								});
					
					return false;
					
				}
			}else{
				return false;
			}
			
			if(type=='unprintall'){
				doGetPrinters(function(data){
				outTake.layprint =  data;
				});
			 
				this.layprintTplBq = printTplBq;
					layer.open({
									type: 1,
									title: '选择打印机和模板',
									skin: 'layui-layer-rim', //加上边框
									area: ['50%', '60%'], //宽高
									shade: 0.3,
									content: $("#table-print"),
									cancel: function (index, layero) {
										//if (confirm('确定要关闭么')) { //只有当点击confirm框的确定时，该层才会关闭
										//layer.close(index)
										//$("#edit-pages").hide();
										// }
										// return false;
									}
								});
				return
			}
			
			
			
			$.ajax({
					url: "/index.php?m=system&c=outTake&a=setorders",
					type: 'post',
					data: {status:status,prd_no:prd_no,type:type,wave_no:wave_no,selectall:selectall,cusno:cusno,summary:summary,dateBegin:dateBegin,dateEnd:dateEnd},
					dataType: 'json',
					success: function (data) {
						
						if(type=='unprint'){
							
								var i = 0;
								var percent = 0;
								countSecond(i,data)		
								layer.closeAll();
								$(".sche").css("display","block");								
								function countSecond(i,data)
								{   
									
									if(i<data.length){
										layui.use('element', function(){
											var element = layui.element();
											element.init();
											percent += 100 / data.length;
											element.progress('demo', percent + '%');
										});
										printTpl[unprintTplBq](unprintname,data[i]);
										i = i+1;
										console.log(data[i])
										setTimeout(function(){
											countSecond(i,data);
										}, 1000)
										
									}else{
										$(".sche").css("display","none");
										msg('打印完成','#dff0d8','#3c763d');
										return
									}
									
								}
							
							
						}
						if(type=='setwait'){
								layer.closeAll();
							}
						
						if(tabs=='tab7'){
							status="ALL";
						}
						$.ajax({
								url: "/index.php?m=system&c=outTake&a=getOutData",
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
							url: "/index.php?m=system&c=outTake&a=searchsumall",
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
		colseall:function(){
			layer.closeAll();
		},
		setwait:function(){
			$.ajax({
							url: "/index.php?m=system&c=outTake&a=setorders",
							type: 'post',
							data: {type:'setwait'},
							dataType: 'json',
								success: function (data) {
									if(data){
										self.sumall = data;
									}
								}
							});
			
		},
	},
});


function onUniqueCode(e){
	
	$.ajax({
				url: '/index.php?m=system&c=outTake&a=onUniqueCode',
				type: "POST",
				dataType:"json",
				data:{wave_no:outTake.wave_nos,unique_code:e.value},
				success:function(data){
						if(data.code=='ok'){
							outTake.uniqueall = data.data;
							outTake.uniqueall.msg = '<div style="color:rgb(37, 220, 70)">'+data.msg+'</div>';
							//'<div style="color:rgb(37, 220, 70)">'+data.msg+'</div>'
							$("#addunprint").val("");
							$.ajax({
								url: "/index.php?m=system&c=outTake&a=getOutTable",
								type: 'post',
								data: {wave_no:outTake.wave_nos,type:'getwave'},
								dataType: 'json',
								success: function (data) {
									if(data){
										outTake.tableWaveArr = data;
									}
								}
							});
						
						}else{
							outTake.uniqueall = [];
							$("#addunprint").val("");
							outTake.uniqueall.msg = '<div style="color:red">'+data.msg+'</div>';
						}
					}
			});
}
function onUniqueCode1(e){
	
	var allsums =  $(e).attr('allsums');
	var val = $(e).val();
	
	if(val<=allsums && val>=0){
		$.ajax({
				url: '/index.php?m=system&c=outTake&a=onUniqueCode',
				type: "POST",
				dataType:"json",
				data:{sku_name:$(e).attr('sku'),wave_no:$(e).attr('waveno'),prd_no:$(e).attr('prdno'),sendsums:$(e).val()},
				success:function(data){
						if(data.code=='ok'){
							
							$.ajax({
								url: "/index.php?m=system&c=outTake&a=getOutTable",
								type: 'post',
								data: {wave_no:outTake.wave_nos,type:'getwave'},
								dataType: 'json',
								success: function (data) {
									if(data){
										outTake.tableWaveArr = data;
										msg('通过','#dff0d8','#3c763d');
									}
								}
							});
							
						}
					}
			});
	}else{
		alert('已配数量不得超过总数')
		
	}
	
	
}
function setpricenew(e){
	
			$.ajax({
				url: '/index.php?m=system&c=outTake&a=setpricenew',
				type: "POST",
				dataType:"json",
				data:{sku_name:$(e).attr('sku'),wave_no:$(e).attr('waveno'),prd_no:$(e).attr('prdno'),price_new:$(e).val()},
				success:function(data){
							$(".tableIn").each(function(){
								$(this).css("display","none")
								
							})
							//每次点击都将箭头初始化为初始状态
							$(".tab .tableOut").find("i").each(function(){
								$(this).html("&#xe602;");
							});
							//每次点击将bool内的值都初始化为false
								for(var i = 0; i < outTake.bool.length; i++){
									outTake.bool[i] = false;
								}
					}
			});
	
		}
function setsendorder(e){

		$.ajax({
			url: '/index.php?m=system&c=outTake&a=setsendorder',
			type: "POST",
			dataType:"json",
			data:{sku_name:$(e).attr('sku'),wave_no:$(e).attr('waveno'),prd_no:$(e).attr('prdno'),sendorder:$(e).val()},
			success:function(data){
						$(".tableIn").each(function(){
								$(this).css("display","none")
								
							})
							//每次点击都将箭头初始化为初始状态
							$(".tab .tableOut").find("i").each(function(){
								$(this).html("&#xe602;");
							});
							//每次点击将bool内的值都初始化为false
								for(var i = 0; i < outTake.bool.length; i++){
									outTake.bool[i] = false;
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

