var flow = new Vue({
	el: '#flow',
	data: {
		datas:[],
		tid:"",
		ceshi:"测试",
	}
})
layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;	
	
	doGetPrinters(function(data){
		var printerHtml = "<option value=''>请选择打印机</option>";
		for(var i=0;i<data.length;i++){
			printerHtml += "<option value='"+data[i]['name']+"'>"+data[i]['name']+"</option>";
		}
		$("#printer").html(printerHtml);
		form.render('select');
	});
	
	//获取模板
	$.ajax({
		url:'/?m=system&c=uniqueCheck&a=getPrintTpl',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			var oHtml = "<option value=''>请选择模板</option>";
			if(data.code == "ok"){
				for(var i=0;i<data.data.length;i++){
					oHtml += "<option value='"+data.data[i].id+"'>"+data.data[i].tpl_name+"</option>";
				}
				$("#report_DSOS").html(oHtml);
				form.render('select'); 
			}
		}
	});
})

function scanProInventory(){
	var unique_code = $("#prdBarcode").val();
	if(unique_code == ''){
		layer.msg('请扫描唯一码',{
			icon: 0,
			time: 2000
		});
		return false;
	}
	$("#prdBarcode").val("");
	$.ajax({
		url:'/?m=WMS&c=Storage&a=getOrderToCode',
		dataType: 'json',
		type: "post",
		data:{
			unique_code: unique_code,
		},
		success:function(data){
			if(data['code'] == 'ok'){
				flow.datas = data['goods'];
				flow.tid = data['datas']['new_tid'];
			}else{
				layer.msg(data['msg'],{
					icon: 0,
					time: 2000
				});
			}
		}
	});
}

function setyesorder(){		
	var data = "";
	if($("#printer").val() != 0){
		var unprintname = $("#printer").val();
	}else{
		layer.msg('请选择打印机',{
			icon: 0,
			time: 2000
		});									
		return					
	}
	
	var report_DSOS = $("#report_DSOS").val();
	if(report_DSOS == ""){
		layer.msg('请选择打印模板',{
			icon: 0,
			time: 2000
		});												
		return false;
	}
	var codes = "";
	var datas = flow.datas;
	console.log(datas);
	for(var i=0;i<datas.length;i++){
		codes += datas[i]['unique_code']+",";
	}
	lastIndex = codes.lastIndexOf(',');
    if (lastIndex > -1) {
        codes = codes.substring(0, lastIndex);
    }
	layer.load(2);
	$.ajax({
		url:'/?m=WMS&c=CodeToOrder&a=getPrinterArr',
		dataType: 'json',
		type: "post",
		data:{
			codes: codes,
		},
		success:function(data){
			layer.closeAll('loading');
			for(var i=0;i<data.length;i++){
				printTpl[report_DSOS](unprintname,data[i][0]);
			}
		}
	});
}
