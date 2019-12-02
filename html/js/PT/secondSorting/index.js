var flow = new Vue({
	el: '#flow',
	data: {
		wave_no:'',		//当前选择的档口
		courier:0,		//是否打印快递单开关 
		itm:'',			//格几
		getTemplate:[],	//打印模板数据
		layprint:[],	//打印机数据
		over:'0',		//当前波次分拣是否完成 0未完成  1完成
	},
	mounted: function() {
		layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
			var laydate = layui.laydate 	//日期
				,laypage = layui.laypage 	//分页
				,layer = layui.layer 		//弹层
				,upload = layui.upload 		//上传
				,form = layui.form 			//表单
				,element = layui.element; 	//元素操作
			var table = layui.table;
			
			//选择波次赋值
			table.on('tool(dataList)', function(obj){
				var data = obj.data;
				if(obj.event === 'setSign'){
					$("#wave_no").val(data['wave_no']);
					$("#barcode").val("");
					flow.itm = "";
					layer.closeAll();
				}
			});
			
			//打印快递单开关选择
			form.on('switch(courier)', function(data){
				if(data.elem.checked == true){
					flow.courier = 1;
				}else{
					flow.courier = 0;
				}
			}); 
				
			$("#chooseWave").click(function(){
				tableLoad.tableLoadFunction();
				layer.open({
					type: 1,
					title: '波次选择',
					skin: 'layui-layer-rim', 
					area: ['700px', '500px'], 
					shade: 0.3,
					content: $("#chooseWaveBox"),
				});	
			})
		})
	}
});

var dataList = {
	elem: '#dataList'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: '410'
	,cols: [[
		{type:'numbers', width:100, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'wave_no', minWidth:200, title: '波次号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'create_time', minWidth:200, title: '生成时间', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
};
var tableLoad = {
	tableObj:false,
	tableLoadFunction:function(){
		var table = layui.table;
		dataList['page'] = {
			curr: 1 
		};
		var express_no = $("#logisticsSingle").val();
		$.ajax({
			url:'?m=PT&c=secondSorting&a=getChooseWave',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				if(data){
					if(!tableLoad.tableObj){
						for(var i=0;i<data.length;i++){
							dataList.data.push(data[i]);
						}
						tableLoad.tableObj = table.render(dataList);
					}else{
						dataList.data = [];
						for(var i=0;i<data.length;i++){
							dataList.data.push(data[i]);
						}
						tableLoad.tableObj.reload(dataList);
					}
				}else{
					table.render(dataList);
				}
			}
		})
	}
};

//扫描商品条码
function pickingSure(){
	var wave_no = $("#wave_no").val();
	if(flow.over == 1 && flow.wave_no == wave_no){
		speckText('波次分拣完成');
		layer.msg('当前波次已分拣完成，请切换其他波次',{
			icon: 2,
			time: 2000
		});
		$("#barcode").val("");
		flow.itm = "";
		return false;
	}
	flow.over == 0;
	flow.wave_no = wave_no;
	var barcode = $("#barcode").val();
	$("#barcode").val("");
	var courier = flow.courier;
	$.ajax({
		url:'?m=PT&c=secondSorting&a=setPickingSure',
		dataType: 'json',
		type: "post",
		data:{
			wave_no:wave_no,
			barcode:barcode,
			courier:courier,
		},
		success:function(data){
			if(data['code'] == 'ok'){
				if(data['msg'] == '1'){
					layer.msg('通过',{
						icon: 1,
						time: 2000
					});
					flow.itm = data['itm'];
					speckText('格'+data['itm']);
				}else if(data['msg'] == '2'){
					//订单已配齐，打印物流单
					layer.msg('可发货',{
						icon: 1,
						time: 2000
					});
					flow.itm = data['itm'];
					speckText('格'+data['itm']);
					setTimeout(function(){
						speckText('可发货');
					},1000);
					if(flow.courier == 1){
						//获取默认模板和打印机
						$.ajax({								
							url: "/index.php?m=system&c=printShip&a=getDef",
							type: 'post',							
							data: {express_type: data['express_id']},
							async:false,
							dataType: 'json',				
							success: function (def) {
								if(def){
									flow.unprintTplBq = def['id'];
									flow.unprintname = def['print'];
									butDelivery( data['new_tid'],data['express_type'] );
								}else{
									layer.msg('请设置默认打印机模板',{
										icon: 2,
										time: 2000
									});
								}
							}													
						});
					}
					if(data['over'] == '1'){
						flow.over = 1;
					}
				}
			}else{
				speckText(data['msg']);
				layer.msg(data['msg'],{
					icon: 2,
					time: 2000
				});
			}
		}
	})
}

//打印物流单
function butDelivery( new_tid,express_type ){
	$.ajax({														
		url: "/index.php?m=system&c=printShip&a=printNow",			
		type: 'post',															
		data: {
			data: new_tid, 
			type: express_type, 
			force: false, 
			system_id: '', 
			preLogistics:'T',
		},
		dataType: 'json',
		success: function (data) {
			if(data.dates && data.dates[0] != ""){
				var newData = [];
				doGetPrinters(function(){
					newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
					printTpl[flow.unprintTplBq](flow.unprintname,newData);
				});
			}else{
				if(data.code == "error"){
					layer.msg(data.msg,{
						icon: 2,
						time: 2000
					});
				}else{
					layer.msg('订单已打印',{
						icon: 2,
						time: 2000
					});
				}
			}
		}																
	});
}

function userPrinterSetup(){
	$("#layprintTplBq").val("");
	$("#layprint").val("");
	//打印模板
	$.ajax({
		url:'/?m=system&c=printShip&a=getTemplate',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			flow.getTemplate = data;
		}
	})
	//打印机
	doGetPrinters(function(data){
		flow.layprint = data;
	});

	layer.open({
		type: 1,
		title: '当前操作员打印机设置',
		skin: 'layui-layer-rim', 
		area: ['500px', '320px'], 
		shade: 0.3,
		shade: 0,
		content: $("#userPrinterSetup"),
		btn: ['确定', '取消'],
		yes: function(index, layero){
			var layprintTplBq = $("#layprintTplBq").val();
			//console.log(layprintTplBq);
			var layprint = $("#layprint").val();
			$.ajax({
				url:'/?m=system&c=printShip&a=getTplBqLayprint',
				dataType: 'json',
				type: "post",
				data:{
					layprintTplBq:layprintTplBq,
					layprint:layprint,
				},
				success:function(data){
					if(data.code == 'error'){
						layer.msg(data.msg);
					}else{
						layer.msg('绑定成功');
					}
				}
			});
		}
	});
}

//监听打印机
function layprintTplBqChoose(){
	var layprintTplBq = $("#layprintTplBq").val();
	//console.log(layprintTplBq);
	$.ajax({
		url:'/?m=system&c=printShip&a=getLayprintChoose',
		dataType: 'json',
		type: "post",
		data:{
			layprintTplBq:layprintTplBq
		},
		success:function(data){
			if(data.code == 'ok'){
				var layprintList = flow.layprint;
				var layOnOff = 0;
				var values = data.msg;
				for(var i=0;i<layprintList.length;i++){
					if(layprintList[i]['name'] == values){
						$("#layprint").val(values);
						layOnOff = 1;
					}
				}
				if(layOnOff == 0){
					$("#layprint").append('<option style="display:none;" value="'+values+'">'+values+'</option>');
					layer.msg('不存在当前名称的打印机');
					$("#layprint").val(values);
				}
			}else{
				$("#layprint").val("");
			}
		}
	})
}





