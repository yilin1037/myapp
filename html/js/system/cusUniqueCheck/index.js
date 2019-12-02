var unique = new Vue({
	el: '#container',
	data: {
		layprint:[],
		layprintTplBq:[],
		chooseLayprint:"",
		chooseTplBq:"",
		uniqueCode:"",
		defPrinter:"",
		defTpl:"",
	},
	mounted: function() {
		//获取模板
		$.ajax({
			url:'/?m=system&c=cusUniqueCheck&a=getPrintTpl',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				unique.layprintTplBq = data['data'];
			}
		})
		//获取默认模板和打印机
		$.ajax({
			url:'/?m=system&c=cusUniqueCheck&a=getDefaultTplPrinter',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				unique.defPrinter = data['defPrinter'];
				unique.defTpl = data['defTpl'];
			}
		})
		layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
			var laydate = layui.laydate //日期
				,laypage = layui.laypage //分页
				layer = layui.layer //弹层
				,upload = layui.upload //上传
				,form = layui.form //表单
				,element = layui.element; //元素操作
			var table = layui.table;
			
			//初始化表格在没有数据时加载表头
			table.render(tableLoad);
			
			$("#vendorList").click(function(){
				vendorTableLoad.tableLoadTable();
				layer.open({
					type: 1,
					title: '档口到货详情',
					skin: 'layui-layer-rim',
					area: ['850px', '450px'],
					shade: 0.3,
					content: $("#vendorArriveList"),
				});
			})
			
			//获取打印机
			doGetPrinters(function(data){
				var layprint = '<option value="">打印机</option>';
				for(var i=0;i<data.length;i++){
					if(data[i]['name'] == unique.defPrinter){
						layprint += '<option value="'+data[i]['name']+'" selected>'+data[i]['name']+'</option>';
					}else{
						layprint += '<option value="'+data[i]['name']+'">'+data[i]['name']+'</option>';
					}
				}
				$("#layprint").html(layprint);
				form.render('select');
			});
			
			//保存并打标签
			$("#savePrintOrder").click(function(){
				if($("#savePrintOrder").hasClass("layui-btn-disabled")){
					return false;
				}
				$("#savePrintOrder").addClass("layui-btn-disabled");
				var layprint = $("#layprint").val();
				if(layprint == ""){
					layer.msg('请选择打印机');
					$("#savePrintOrder").removeClass("layui-btn-disabled");
					return false;
				}
				unique.chooseLayprint = layprint;
				var layprintTplBq = $("#layprintTplBq").val();
				if(layprintTplBq == ""){
					layer.msg('请选择打印模板');
					$("#savePrintOrder").removeClass("layui-btn-disabled");
					return false;
				}
				unique.chooseTplBq = layprintTplBq;
				if(!unique.defPrinter || !unique.defTpl || layprint != unique.defPrinter || layprintTplBq != unique.defTpl ){
					//模板或打印机不存在，保存模板打印机
					$.ajax({
						url:'/?m=system&c=cusUniqueCheck&a=saveDefaultTplPrinter',
						dataType: 'json',
						type: "post",
						data:{
							layprint:layprint,
							layprintTplBq:layprintTplBq,
						},
						success:function(data){
							
						}
					})
					unique.defPrinter = layprint;
					unique.defTpl = layprintTplBq;
				}
				var saveData = tableLoad.data;
				if(saveData == ""){
					layer.msg('请先扫描档口条码');
					$("#savePrintOrder").removeClass("layui-btn-disabled");
					return false;
				}
				var UniqueCode = unique.uniqueCode;
				$.ajax({
					url:'/?m=system&c=cusUniqueCheck&a=saveDataCheck',
					dataType: 'json',
					type: "post",
					data:{
						saveData:saveData,
						UniqueCode:UniqueCode,
					},
					success:function(data){
						if(data.code == 'ok'){ //成功返回返回唯一码集合
							playSingle( data.msg );
						}else if( data.code == 'repeat' ){
							/**
							layer.confirm(data.msg, {
								btn: ['确定','取消']
							}, function(index, layero){
								//layer.close(index);
								$.ajax({
									url:'/?m=system&c=cusUniqueCheck&a=saveRedOrder',
									dataType: 'json',
									type: "post",
									data:{
										saveData:saveData,
										UniqueCode:UniqueCode,
									},
									success:function(data){
										if(data.code == 'ok'){//成功返回返回唯一码集合
											playSingle( data.msg );
										}else{
											layer.msg('部分商品保存失败，请重新保存');
											$("#savePrintOrder").removeClass("layui-btn-disabled");
										}
									}
								})
							}, function(){
								$("#savePrintOrder").removeClass("layui-btn-disabled");
							});
							*/
							layer.confirm(
								data.msg, {
									btn: ['确定','取消'],
									cancel: function(index, layero){ 
										$("#savePrintOrder").removeClass("layui-btn-disabled");
									}  
								}, function(index, layero){
									$.ajax({
										url:'/?m=system&c=cusUniqueCheck&a=saveRedOrder',
										dataType: 'json',
										type: "post",
										data:{
											saveData:saveData,
											UniqueCode:UniqueCode,
										},
										success:function(data){
											if(data.code == 'ok'){//成功返回返回唯一码集合
												playSingle( data.msg );
											}else{
												layer.msg('部分商品保存失败，请重新保存');
												$("#savePrintOrder").removeClass("layui-btn-disabled");
											}
										}
									})
								}, function(){
									$("#savePrintOrder").removeClass("layui-btn-disabled");
								}
							);
						}else{
							layer.msg('部分商品保存失败，请重新保存');
							$("#savePrintOrder").removeClass("layui-btn-disabled");
						}
					}
				})
			})
			form.render('select');
			if(unique.defTpl){
				$("#layprintTplBq").val(unique.defTpl);
			}
		})
	}
})

function playSingle(data){
	var unprintname = unique.chooseLayprint;
	var unprintTplBq = unique.chooseTplBq;
	$.ajax({
		url:'/?m=system&c=cusUniqueCheck&a=getSingleData',
		dataType: 'json',
		type: "post",
		data:{
			data:data,
		},
		success:function(data){
			if(data['code'] == 'ok'){
				var percent = 0;							//进度条初始化
				layer.closeAll();	
				$(".sche").css("display","block");			//进度条窗口显示
				var i = 0;
				countSecond(i,data['data'],unprintTplBq);			
				function countSecond(i,data,printTplBq)				
				{
					if(i<data.length){			
						element.init();
						//进度条
						percent += 100 / data.length;
						percent = Math.ceil(percent);
						element.progress('demo', percent + '%');
						console.log(percent);
						printTpl[printTplBq](unprintname,data[i]);
						//打印成功后，修改打印次数
						updPrintCount(data[i]);
						i = i+1;
						setTimeout(function(){					
							countSecond(i,data,printTplBq);		
						}, 1000)									
					}else{										
						$(".sche").css("display","none");//进度条窗口关闭
						layer.msg('打印完成',{
							icon: 1,
							time: 2000
						});
						vueLoad.tableLoadTable();
						$("#savePrintOrder").removeClass("layui-btn-disabled");
						return										
					}
				}
			}else{
				layer.msg(data['msg'],{
					icon: 0,
					time: 2000
				});
				$("#savePrintOrder").removeClass("layui-btn-disabled");
			}
		}
	})
}

//修改打印次数
function updPrintCount(data){
	$.ajax({
		url:'/?m=system&c=cusUniqueCheck&a=updPrintCount',
		dataType: 'json',
		type: "post",
		data:{
			data:data,
		},
		success:function(data){}
	})
}

//到货点货
function uniqueCheck(){
	vueLoad.tableLoadTable();
}

var tableLoad = {
	elem: '#uniqueTable'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,height: 'full'
	,cols: [[ 
		{type:'numbers', width:80, title: '序号'}
		,{field:'cus_no', minWidth:100, title: '档口'}
		,{field:'prd_no', width:150, title: '商品编码'}
		,{field:'sku_name', width:150, title: '商品属性'}
		,{field:'nums', width:100, title: '应到数量'}
		,{field:'num', width:100, title: '实到数量', edit: 'text'}
	]]
	,id: 'uniqueTable'
	,data:[]
	,even: true
};

var vueLoad = {
	oldTree:false,
	tableObj:false,
	tableLoadTable:function(){
		var UniqueCode = $('#UniqueCode').val();
		if(UniqueCode == ""){
			UniqueCode = unique.uniqueCode;
		}else{
			unique.uniqueCode = UniqueCode;
		}
		var timeChoose = $("#timeChoose").val();
		$('#UniqueCode').val("");
		var table = layui.table;
		tableLoad['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=system&c=cusUniqueCheck&a=getTodayGoods',
			dataType: 'json',
			type: "post",
			data:{
				UniqueCode:UniqueCode,
				timeChoose:timeChoose,
			},
			success:function(data){
				if(!vueLoad.tableObj){
					for(var i=0;i<data.length;i++){
						tableLoad.data.push(data[i]);
					}
					vueLoad.tableObj = table.render(tableLoad);
				}else{
					tableLoad.data = [];
					for(var i=0;i<data.length;i++){
						tableLoad.data.push(data[i]);
					}
					vueLoad.tableObj.reload(tableLoad);
				}
			}
		})
	}
};

//档口列表显示
var vendorLoad = {
	elem: '#vendorTable'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,height: '350'
	,cols: [[ 
		{type:'numbers', width:50}
		,{field:'cus_no', minWidth:100, title: '档口'}
		,{field:'dj_dd', width:170, title: '打印时间'}
		,{field:'the_number', width:90, title: '档口序号'}
		,{field:'have_states', width:90, title: '取货状态'}
		,{field:'all_states', width:90, title: '货品状态'}
		,{field:'lack_states', width:100, title: '需配数量'}
	]]
	,id: 'vendorTable'
	,data:[]
	,even: true
};

var vendorTableLoad = {
	oldTree:false,
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		vendorLoad['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=system&c=cusUniqueCheck&a=getVendorTable',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				if(data){
					if(!vendorTableLoad.tableObj){
						for(var i=0;i<data.length;i++){
							vendorLoad.data.push(data[i]);
						}
						vendorTableLoad.tableObj = table.render(vendorLoad);
					}else{
						vendorLoad.data = [];
						for(var i=0;i<data.length;i++){
							vendorLoad.data.push(data[i]);
						}
						vendorTableLoad.tableObj.reload(vendorLoad);
					}
				}else{
					table.render(vendorLoad);
				}
			}
		})
	}
};

$("#vendorTep").click(function(){
	//var lastTime = $("#last_time").val();
	//var num_iid_type = $("#num_iid_type").val();
	//var url = "?m=system&c=cusUniqueCheck&a=outputExcel";
	//$("#ifile").attr('src',url);
	var time = new Date().getTime();
	$.ajax({
		url: "/index.php?m=system&c=cusUniqueCheck&a=outputExcel&loginact=file",
		type: 'post',
		data: {
			time:time,
		},
		dataType: 'text',
		success: function (text){
			layer.close(indexLoad);
			if(!text){
				var url = "/xls/WaitSendorders"+time+".xls?loginact=file";
				$("#ifile").attr('src',url);
			}
		},error: function (jqXHR, textStatus, errorThrown) {
			layer.msg('jqXHR.responseText',{
				icon: 0,
				time: 2000
			});
		}
	});
})



