layui.use(['form', 'layer', 'table'], function(){
	var layer = layui.layer,form = layui.form;
	var table = layui.table;
	
	$.ajax({
		url: "/index.php?m=system&c=setup&a=getBaseConfig",
		type: 'post',
		data: {},
		dataType: 'json',
		success: function (data) {
			$("#orderFullLink").prop("checked", data.orderFullLink);
			$("#autoMarketLabel").prop("checked", data.autoMarketLabel);
			$("#useUniqueSync").prop("checked", data.useUniqueSync);
			$("#WMS_STOCK_BAOKUAN").prop("checked", data.WMS_STOCK_BAOKUAN);
			$("#stockPrint").prop("checked", data.stockPrint);
			$("#moreCheck").prop("checked", data.moreCheck);
			$("#sellerMemoAfter").prop("checked", data.sellerMemoAfter);
			$("#brushOrder").prop("checked", data.brushOrder);
			$("#isexpress").prop("checked", data.isexpress);
			$("#sellerMemoSplit").prop("checked", data.sellerMemoSplit);
			$("#exchangeSend").prop("checked", data.exchangeSend);
			$("#scanSendSingleCheck").prop("checked", data.scanSendSingleCheck);
			$("#unpackingRefund").prop("checked", data.unpackingRefund);
			$("#down_delay").val(data.down_delay);
			$("#uniqueNotTitle").val(data.uniqueNotTitle);
			$("#uniqueNotSkuName").val(data.uniqueNotSkuName);
			$("#check_serial_no").prop("checked", data.check_serial_no);
			$("#check_regular_cust").prop("checked", data.check_regular_cust);
			$("#mogujie_warning").prop("checked", data.mogujie_warning);
			$("#isFetch").prop("checked", data.isFetch);
			$("#splitMerge").prop("checked", data.splitMerge);
			$("#scanHaveCheck").prop("checked", data.scanHaveCheck);
			$("#waveAllPrint").prop("checked", data.waveAllPrint);
			$("#waveAllCreate").prop("checked", data.waveAllCreate);
			$("#localPicPath").prop("checked", data.localPicPath);
			$("#multiPackage").prop("checked", data.multiPackage);
			$("#autoSpotGoods").prop("checked", data.autoSpotGoods);
			$("#single_weight").val(data.single_weight);
			
			$("input[name='autoItem'][value="+data.autoItem+"]").prop("checked","checked");
			$("input[name='autoDeListing'][value="+data.autoDeListing+"]").prop("checked","checked");
			$("input[name='soldOutType'][value="+data.soldOutType+"]").prop("checked","checked");
			
			
			$("#setupPrint").val(data.PrintAttr);
			$("#uniqueNotTitleSingle").val(data.uniqueNotTitleSingle);
			//$("input[name='sellerMemoAfterFlag'][value="+(data.sellerMemoAfterFlag ? data.sellerMemoAfterFlag : '')+"]").prop("checked","checked");
			//$("input[name='exchangeSendFlag'][value="+(data.exchangeSendFlag ? data.exchangeSendFlag : '')+"]").prop("checked","checked");
			if(data.sellerMemoAfterFlag != ''){
				$("input[name='sellerMemoAfterFlag'][value="+data.sellerMemoAfterFlag+"]").prop("checked","checked");	
			}
			if(data.manualSetSingleCode != ''){
				$("input[name='manualSetSingleCode'][value="+data.manualSetSingleCode+"]").prop("checked","checked");	
			}
			if(data.sellerMemoSplitFlag != ''){
				$("input[name='sellerMemoSplitFlag'][value="+data.sellerMemoSplitFlag+"]").prop("checked","checked");	
			}
			if(data.exchangeSendFlag != ''){
				$("input[name='exchangeSendFlag'][value="+data.exchangeSendFlag+"]").prop("checked","checked");	
			}
			form.render();
		}
	});
		
	form.on('submit(formSubmit)', function(data){
		var obj = data.field;
		var down_delay = obj.down_delay;
		if(/^\d+$/.test(down_delay)){
			if(down_delay > 30){
				parent.layer.msg('付款延时最大延时时间为30分钟',{
					icon: 0,
					time: 2000
				});
				
				return false;
			}
		}else if(down_delay != ""){
			parent.layer.msg('付款延时时间请输入一个整数',{
				icon: 0,
				time: 2000
			});
			
			return false;
		}
		
		$.ajax({
			url: "/index.php?m=system&c=setup&a=saveBaseConfig", 
			type: 'post',
			data: {data: obj},
			dataType: 'json',
			success: function (data) {
				if(data.code == 'ok'){
					parent.layer.msg('保存成功',{
						icon: 1,
						time: 2000
					});
				}
				else
				{
					parent.layer.msg(data.msg,{
						icon: 2,
						time: 2000
					});		
				}
			}
		});

		return false;
	});
})

//弹出打印设置框 LAY_CHECKED:true
/*$("#setupPrintOpen").click(function(){
	tableLoad.tableLoadFunction();
	layer.open({
		type: 1,
		title: '省份打印设置',
		skin: 'layui-layer-rim',
		area: ['550px', '450px'],
		shade: 0.3,
		content: $("#setupPrintList"),
		btn: ['确定', '取消'],
		yes: function(index, layero){
			var data = dataList.data;
			var attrStr = "";
			for(var i=0;i<data.length;i++){
				if(data[i]['LAY_CHECKED'] == true){
					attrStr += data[i]['province_name']+",";
				}
			}
			var lastIndex = attrStr.lastIndexOf(',');
			if (lastIndex > -1) {
				attrStr = attrStr.substring(0, lastIndex);
			}
			$("#setupPrint").val(attrStr);
			layer.close(index);
		}
	})
})*/

var dataList = {
	elem: '#dataList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,cellMinWidth: 80
	,height: '310'
	,cols: [[ 
		{type: 'checkbox', fixed: 'left'}
		,{type:'numbers', width:100, title: '序号'}
		,{field:'province_name', minWidth:150, title: '省份'}
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
		$.ajax({
			url:'/?m=system&c=setup&a=setupPrintList',
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
				}
			}
		})
	}
};