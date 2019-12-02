mini.parse();
var layer;
var grid = mini.get('grid1');

$.ajax({
	url:'/?m=PT&c=purchase&a=getTemplate',
	dataType: 'json',
	type: "post",
	data:{},
	success:function(data){
		if(data){
			mini.get('printTpl').setData(data);
		}
	}
})

layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
    layer = layui.layer;
});

$(document).ready(function(){
	doGetPrinters(function(data){
		mini.get('printer').setData(data);
		$.ajax({
			url:'/?m=goods&c=association&a=setTemplateTpl',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				if(data['code'] == 'ok'){
					mini.get('printer').setValue(data['msg']['printer']);
					mini.get('printTpl').setValue(data['msg']['usr']);
				}
			}
		})
	});
});	
//提交保存

function onOk(){
	var printer = mini.get('printer').value;
	var printTplModule = mini.get('printTpl').value;
	
	if(printer == ""){
		layer.msg('请选择打印机！',{
			icon: 2,
			time: 2000
		});
		
		return false;
	}
	
	if(printTplModule == ""){
		layer.msg('请选择打印模板！',{
			icon: 2,
			time: 2000
		});
		
		return false;
	}
	
	var data = grid.getChanges();
	var json = mini.encode(data);
	
	//记忆打印机和模板
	$.ajax({																	
		url: '/index.php?m=goods&c=association&a=memoryPrinterTpl',							
		type: 'post',																		
		data: {
			printer:printer,
			printTplModule:printTplModule,
		},
		dataType: 'json',														
		success: function (data) {
				
		}																				
	});
	
	$.ajax({																	
		url: '/index.php?m=goods&c=association&a=printBarCodeData',							
		type: 'post',																		
		data: { submitData: json },
		dataType: 'json',														
		success: function (data) {
			if(data.code == "ok"){													
				var percent = 0;											//-----进度条初始化		
				countSecond(data['data'],printer,printTplModule);
			}	
		}																				
	});
}

function countSecond(data,unprintname,unprintTplBq){
	for(var i in data){
		printTpl[unprintTplBq](unprintname,data[i]);
	}
	layer.msg('打印完成',{
		icon: 1,
		time: 2000
	});
}

function onCancel(){
	CloseWindow("cancel");
}

function GetData(){
	var data = grid.getData();
	var json = mini.encode(data);
    return json;
}

function SetData(data){
	grid.load({prd_ids: data});
}

function CloseWindow(action) {
	if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
	else window.close();
}