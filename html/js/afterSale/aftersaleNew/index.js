mini.parse();
var datagrid1 = mini.get('datagrid1');
var employee_grid = mini.get('employee_grid');
mini.get('ag_status_search').setData("[{id: '0', text: '未处理'},{id: '1', text: '成功'},{id: '2', text: '失败'}]");
searchOrder();
layui.use(['layer'], function () {									
            var layer = layui.layer ;
	});
$.ajax({
	url: "/index.php?m=system&c=delivery&a=getPrinter",
	type: 'post',
	data: {},
	dataType: 'json',
	success: function (data) {
		if(data['result'].printer != "" && data['bq'].id != ""){
			$("#layprint").val(data['result'].printer);
			$("#layprintTplBq").val(data['bq'].id);
		}
	}
});
datagrid1.on("drawcell", function (e) {
	var record = e.record,
	column = e.column,
	field = e.field,
	row = e.row,
	value = e.value;
	
	if(field == "buyer_nick"){
		if(row.shoptype == 'TB' || row.shoptype == 'TM'){
			e.cellHtml = '<a target="_blank" href="http://amos.alicdn.com/msg.aw?v=2&uid='+row.buyer_nick+'&site=cntaobao&s=11&charset=utf-8" style="background-image: url(http://amos.alicdn.com/realonline.aw?v=2&uid='+row.buyer_nick+'&site=cntaobao&s=2&charset=utf-8); background-size: contain; background-repeat:no-repeat ;padding-left:16px"></a>'+row.buyer_nick;
		}else if(row.shoptype == 'ALBB'){
			e.cellHtml = '<a target="_blank" href="http://amos.alicdn.com/msg.aw?v=2&uid='+row.buyer_nick+'&site=cnalichn&s=11&charset=utf-8" style="background-image: url(http://amos.alicdn.com/realonline.aw?v=2&uid='+row.buyer_nick+'&site=cnalichn&s=2&charset=utf-8); background-size: contain; background-repeat:no-repeat ;padding-left:16px"></a>'+row.buyer_nick;
		}else{
			e.cellHtml = row.buyer_nick;	
		}
	}
	
	if(field == "status"){
		if(value == '0'){
			e.cellStyle = "background:#FF6B00;color:#FFF";
		}else if(value == '1'){
			e.cellStyle = "background:#FF0000;color:#FFF";
		}else if(value == '2'){
			e.cellStyle = "background:#99E626;color:#000";
		}
	}
	
	if(field == "goods_status"){
		if(record.goods_status == '1'){//已收到货物
			e.cellStyle = "background:#00FF66;";
		}
	}
	
});

employee_grid.on("drawcell", function (e) {
	var record = e.record,
	column = e.column,
	field = e.field,
	row = e.row,
	value = e.value;
	
	if(field == "action_type"){
		if(record.type == '0'){//退货
			e.cellStyle = "background:#FF0000;color:#FFF";
		}else if(record.type == '1'){//换货
			e.cellStyle = "background:#FF6B00;color:#FFF";
		}else if(record.type == '2'){//补发
			e.cellStyle = "background:#99E626;color:#000";
		}
	}
});
function searchOrder(){
	if(mini.get("created_date1").getFormValue() == ""){
		mini.get('created_date1').setValue(search_date2);
	}
	if(mini.get("created_date2").getFormValue() == ""){
		mini.get('created_date2').setValue(search_date1);
	}
	
	var sh_no_search = mini.get('sh_no_search').value;
	var key_search = mini.get('key_search').value;
	var sh_type_search = mini.get('sh_type_search').value;
	var refund_mark_search = mini.get('refund_mark_search').value;
	var shopid_search = mini.get('shopid_search').value;
	var status_search = mini.get('status_search').value;
	var goods_status_search = mini.get('goods_status_search').value;
	var created_time_begin = mini.get("created_date1").getFormValue()+' '+mini.get("created_time1").getFormValue();
	if(mini.get("created_date1").getFormValue() == ""){
		created_time_begin = "";
	}
	var created_time_end = mini.get("created_date2").getFormValue()+' '+mini.get("created_time2").getFormValue();
	if(mini.get("created_date2").getFormValue() == ""){
		created_time_end = "";
	}
	var reasons_search = mini.get('reasons_search').value;
	var ag_status_search = mini.get('ag_status_search').value;
	var refund_type_search = mini.get('refund_type').value;

	var searchParam = {sh_no_search: sh_no_search, key_search: key_search, created_time_begin: created_time_begin, created_time_end: created_time_end, sh_type_search: sh_type_search, shopid_search: shopid_search, status_search: status_search, goods_status_search: goods_status_search, refund_mark_search: refund_mark_search, reasons_search: reasons_search, ag_status_search: ag_status_search, refund_type_search: refund_type_search};
	
	datagrid1.load({data: searchParam});
}

function clearSearch(){
	mini.get('sh_no_search').setValue('');
	mini.get('key_search').setValue('');
	mini.get('created_date1').setValue(search_date2);
	mini.get('created_time1').setValue('00:00');
	mini.get('created_date2').setValue(search_date1);
	mini.get('created_time2').setValue('23:59');
	mini.get('sh_type_search').setValue('');
	mini.get('refund_mark_search').setValue('');
	mini.get('shopid_search').setValue('');
	mini.get('status_search').setValue('0');
	mini.get('goods_status_search').setValue('');
	mini.get('reasons_search').setValue('');
	mini.get('ag_status_search').setValue('');
	mini.get('refund_type').setValue('');
}

function onSelectionChanged(e){
	var record = e.record;
	if (record) {
		var sh_no = record.sh_no;
		var sh_no = record.sh_no;
		mini.get('form_sh_no').setValue(sh_no);
		employee_grid.load({sh_no: sh_no});
		if(record.status == '1' || record.status == '2' || record.goods_status == '1'){
			employee_grid.setAllowCellEdit(false);
		}else{
			employee_grid.setAllowCellEdit(true);
		}
		buttonControl(record.sh_type, record.status, record.goods_status);
	}
}

function toggleBtnOrder(type){
	var sh_no = mini.get('form_sh_no').value;
	if(sh_no == ''){
		mini.showTips({
            content: "请先选择一个售后单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	
	mini.open({
		title:"选择订单商品",
		width:800,
		allowResize:false,
		showMaxButton:true,
		height:400,
		url:"/index.php?m=aftersale&c=aftersaleNew&a=refundDetailList",
		loadOnRefresh: true,
		onload: function () {       //弹出页面加载完成
			var iframe = this.getIFrameEl(); 
			var data = {sh_no: sh_no, type: type};
			//调用弹出页面方法进行初始化
			iframe.contentWindow.SetData(data); 
		},
		ondestroy: function (action) {
			if (action == "ok") {
				mini.showTips({
					content: "添加成功",
					state: 'success',
					x: 'center',
					y: 'center',
					timeout: 3000
				});
				
				datagrid1.reload();
				employee_grid.load({sh_no: sh_no});
			}
		}
	});
}

function toggleBtnGoods(type){
	var sh_no = mini.get('form_sh_no').value;
	if(sh_no == ''){
		mini.showTips({
            content: "请先选择一个售后单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	
	mini.open({
		title:"选择商品",
		width:900,
		allowResize:false,
		showMaxButton:true,
		height:600,
		url:"/index.php?m=widget&c=selectProduct&a=index&type=2&param="+type
	});
}

function btnNewItems1(){
	mini.open({
		title:"创建售后单",
		width:1200,
		allowResize:false,
		showMaxButton:true,
		height:700,
		url:"/index.php?m=aftersale&c=aftersaleNew&a=newAfterSale",
		loadOnRefresh: true,
		ondestroy: function (action) {
			if (action == "ok") {
				mini.showTips({
					content: "新增成功",
					state: 'success',
					x: 'center',
					y: 'center',
					timeout: 3000
				});
				
				datagrid1.reload();
			}
		}
	});
}

function btnNewItems2(){
	mini.open({
		title:"创建无信息件售后单",
		width:800,
		allowResize:false,
		showMaxButton:true,
		height:300,
		url:"/index.php?m=aftersale&c=aftersaleNew&a=newAfterSale",
		loadOnRefresh: true,
		onload: function () {       //弹出页面加载完成
			var iframe = this.getIFrameEl(); 
			var data = {special: 'wuxinxijian'};
			//调用弹出页面方法进行初始化
			iframe.contentWindow.SetData(data);
		},
		ondestroy: function (action) {
			if (action == "ok") {
				mini.showTips({
					content: "新增成功",
					state: 'success',
					x: 'center',
					y: 'center',
					timeout: 3000
				});
				
				datagrid1.reload();
			}
		}
	});
}

function btnNewItems3(){
	var rowData = datagrid1.getSelecteds();
	if(rowData.length != 1){
		mini.showTips({
            content: "必须选择一个售后单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	
	var sh_no = rowData[0].sh_no;
	var new_tid = rowData[0].new_tid;
	if(new_tid != '无信息件'){
		mini.showTips({
            content: "请选择一个无信息件",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	
	mini.open({
		title:"绑定无信息件售后单",
		width:1200,
		allowResize:false,
		showMaxButton:true,
		height:500,
		url:"/index.php?m=aftersale&c=aftersaleNew&a=newAfterSale",
		loadOnRefresh: true,
		onload: function () {       //弹出页面加载完成
			var iframe = this.getIFrameEl(); 
			var data = {special: 'bangding', sh_no: sh_no};
			//调用弹出页面方法进行初始化
			iframe.contentWindow.SetData(data);
		},
		ondestroy: function (action) {
			if (action == "ok") {
				mini.showTips({
					content: "操作成功",
					state: 'success',
					x: 'center',
					y: 'center',
					timeout: 3000
				});
				
				datagrid1.reload();
			}
		}
	});
}

function OnCellBeginEdit(e){
	var record = e.record, field = e.field;
	if(field == 'status'){
		e.cancel = true;
	}
	if(field == 'sh_type' || field == 'compensate_amtn' || field == 'refund_post' || field == 'compensate_amtn'){
		if(record.status == '1' || record.status == '2'){
			e.cancel = true;
		}
	}
	
	if(datagrid1.isChanged() && datagrid1.isValid()){
		updateRowdatagrid1();
	}
}

function OnCellEndEditSub(e){
	if(employee_grid.isChanged() && employee_grid.isValid()){
		updateRowemployee_grid();
	}
}

function refundSave(){
	updateRowdatagrid1();
}

function toggleBtn8(){
	updateRowemployee_grid();
}
function onAdd(e) {
	var rowData = datagrid1.getSelecteds();
	if(rowData.length == 0){
		mini.showTips({
            content: "请先选择一个售后单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	if(rowData.length != 1){
		mini.showTips({
            content: "必须选择一个售后单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	var sh_no = rowData[0].sh_no;
	mini.open({
		title:"操作记录",
		width:1000,
		allowResize:false,
		showMaxButton:true,
		height:600,
		url:"/index.php?m=aftersale&c=aftersaleNew&a=history",
		loadOnRefresh: true,
		onload: function () {       //弹出页面加载完成
			var iframe = this.getIFrameEl(); 
			var data = {sh_no: sh_no};
			//调用弹出页面方法进行初始化
			iframe.contentWindow.SetData(data);
		},
		ondestroy: function (action) {
			if (action == "ok") {
				mini.showTips({
					content: "操作成功",
					state: 'success',
					x: 'center',
					y: 'center',
					timeout: 3000
				});
				
				datagrid1.reload();
			}
		}
		
	});
}
function updateRowdatagrid1(){
	var rowData = datagrid1.getChanges();
	datagrid1.loading("保存中，请稍后......");
	rowData = JSON.stringify(rowData);
	rowData = encodeURI(rowData);

	$.ajax({
		type: 'post',
		url: "/index.php?m=aftersale&c=aftersaleNew&a=saveRefundOrders",
		data: { data: rowData },
		dataType: "json",
		success: function (data) {
			if(data.code == 'ok')
			{
				mini.showTips({
					content: "修改保存成功",
					state: 'success',
					x: 'center',
					y: 'center',
					timeout: 3000
				});
				
				datagrid1.reload();
				datagrid1.clearSelect();
				buttonControl('999','1','1');//初始化button  
			}
			else
			{
				datagrid1.unmask();	
				msgGridWin({
					title: "警告", 
					msg: "以下售后单操作失败", 
					width: "700px",
					height: "430px",
					columns: [
						{ type: "indexcolumn" },
						{ field: "sh_no", width: 120, headerAlign: "center", header: "售后单号"},
						{ field: "msg", width: 500, headerAlign: "center", header: "消息"},
					],
					data: data.msgList,
					type: 'alert',
					callBack: function(){
						datagrid1.reload();
					}
				});
			}
		}/*,
		error: function (jqXHR, textStatus, errorThrown) {
			alert(jqXHR.responseText);
		}*/
	});
}

function updateRowemployee_grid() {
	var rowData = employee_grid.getChanges();
	employee_grid.loading("保存中，请稍后......");
	rowData = JSON.stringify(rowData);
	rowData = encodeURI(rowData);

	$.ajax({
		type: 'post',
		url: "/index.php?m=aftersale&c=aftersaleNew&a=saveRefundItems",
		data: { data: rowData },
		dataType: "json",
		success: function (data) {
			if(data.code == 'ok')
			{
				mini.showTips({
					content: "修改保存成功",
					state: 'success',
					x: 'center',
					y: 'center',
					timeout: 3000
				});
				employee_grid.reload();	
				datagrid1.reload();
			}
			else
			{
				msgGridWin({
					title: "警告", 
					msg: "以下售后单操作失败", 
					width: "700px",
					height: "430px",
					columns: [
						{ type: "indexcolumn" },
						{ field: "sh_no", width: 120, headerAlign: "center", header: "售后单号"},
						{ field: "msg", width: 500, headerAlign: "center", header: "消息"},
					],
					data: data.msgList,
					type: 'alert',
					callBack: function(){
						datagrid1.reload();
					}
				});
				employee_grid.unmask();
				employee_grid.reload();
			}
		}/*,
		error: function (jqXHR, textStatus, errorThrown) {
			alert(jqXHR.responseText);
		}*/
	});
}

function toggleBtn7(){
	var rowData = employee_grid.getSelecteds();
	if(rowData.length == 0){
		mini.showTips({
            content: "请先选择一个商品",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	data = JSON.stringify(rowData);
	data = encodeURI(data);
	
	mini.confirm("确定删除？", "确定？",
		function (action) {
			if (action == "ok") {
				$.ajax({
					url: "/index.php?m=aftersale&c=aftersaleNew&a=deleteRefundItems",
					type: 'post',
					data: {data: data},
					dataType: 'json',
					success: function (data) {
						if(data.code == "error"){
							msgGridWin({
								title: "警告", 
								msg: "以下售后单操作失败", 
								width: "700px",
								height: "430px",
								columns: [
									{ type: "indexcolumn" },
									{ field: "sh_no", width: 120, headerAlign: "center", header: "售后单号"},
									{ field: "msg", width: 500, headerAlign: "center", header: "消息"},
								],
								data: data.msgList,
								type: 'alert',
								callBack: function(){
									datagrid1.reload();
								}
							});
						}else{
							mini.showTips({
								content: "删除成功",
								state: 'success',
								x: 'center',
								y: 'center',
								timeout: 3000
							});
							
							datagrid1.reload();
							employee_grid.reload();
						}
					}
				});
			}
		}
	);
}

function goodsStatus(status){
	var rowData = datagrid1.getSelecteds();
	if(rowData.length == 0){
		mini.showTips({
            content: "请先选择一个售后单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	data = JSON.stringify(rowData);
	data = encodeURI(data);
	
	if(status == 'ok'){
		var title = "确认收到货物？确认后将进行商品入库！";
	}else{
		var title = "取消收到货物？确认后将取消商品入库！";
	}
	mini.confirm(title, "确定？",
		function (action) {
			if (action == "ok") {
				$.ajax({
					url: "/index.php?m=aftersale&c=aftersaleNew&a=goodsStatusAction",
					type: 'post',
					data: {status: status, data: data},
					dataType: 'json',
					success: function (data) {
						if(data.code == "error"){
							msgGridWin({
								title: "警告", 
								msg: "以下售后单操作失败", 
								width: "700px",
								height: "430px",
								columns: [
									{ type: "indexcolumn" },
									{ field: "sh_no", width: 120, headerAlign: "center", header: "售后单号"},
									{ field: "msg", width: 500, headerAlign: "center", header: "消息"},
								],
								data: data.msgList,
								type: 'alert',
								callBack: function(){
									datagrid1.reload();
								}
							});
						}else{
							mini.showTips({
								content: "操作成功",
								state: 'success',
								x: 'center',
								y: 'center',
								timeout: 3000
							});
							
							datagrid1.reload();
						}
					}
				});
			}
		}
	);
}

function confirmOrder(status){
	var rowData = datagrid1.getSelecteds();
	if(rowData.length == 0){
		mini.showTips({
            content: "请先选择一个售后单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	data = JSON.stringify(rowData);
	data = encodeURI(data);
	
	if(status == 'ok'){
		var title = "确认订单？确认后补发、换货将生成电商订单，有实际应退金额将会生成退款单！";
	}else{
		var title = "反确认订单？反确认后补发、换货订单、退款单 将作废！";
	}
	mini.confirm(title, "确定？",
		function (action) {
			if (action == "ok") {
				$.ajax({
					url: "/index.php?m=aftersale&c=aftersaleNew&a=confirmOrder",
					type: 'post',
					data: {status: status, data: data},
					dataType: 'json',
					success: function (data) {
						if(data.code == "error"){
							msgGridWin({
								title: "警告", 
								msg: "以下售后单操作失败", 
								width: "700px",
								height: "430px",
								columns: [
									{ type: "indexcolumn" },
									{ field: "sh_no", width: 120, headerAlign: "center", header: "售后单号"},
									{ field: "msg", width: 500, headerAlign: "center", header: "消息"},
								],
								data: data.msgList,
								type: 'alert',
								callBack: function(){
									datagrid1.reload();
								}
							});
						}else{
							mini.showTips({
								content: "操作成功",
								state: 'success',
								x: 'center',
								y: 'center',
								timeout: 3000
							});
							
							datagrid1.reload();
						}
					}
				});
			}
		}
	);
}
function batchModifyStatusMark(){
	var rowData = datagrid1.getSelecteds();
	if(rowData.length == 0){
		mini.showTips({
            content: "请先选择一个售后单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	rowData = JSON.stringify(rowData);
	rowData = encodeURI(rowData);
	mini.open({
		title:"标记售后单",
		width:500,
		allowResize:false,
		showMaxButton:true,
		height:300,
		url:"/index.php?m=aftersale&c=aftersaleNew&a=StatusMark",
		loadOnRefresh: true,
		onload: function () {       //弹出页面加载完成
			var iframe = this.getIFrameEl(); 
			var data = {rowData: rowData};
			//调用弹出页面方法进行初始化
			iframe.contentWindow.SetData(data);
		},
		ondestroy: function (action) {
			if (action == "ok") {
				mini.showTips({
					content: "操作成功",
					state: 'success',
					x: 'center',
					y: 'center',
					timeout: 3000
				});
				
				datagrid1.reload();
			}
		}
	});
	
}

function actionAG(){
	var rowData = datagrid1.getSelecteds();
	if(rowData.length == 0){
		mini.showTips({
            content: "请先选择一个售后单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	rowData = JSON.stringify(rowData);
	rowData = encodeURI(rowData);
	
	mini.confirm('确定AG售后退款吗?', "确定？",
		function (action) {
			if (action == "ok") {
				$.ajax({
					url: "/index.php?m=aftersale&c=aftersaleNew&a=actionAG",
					type: 'post',
					data: {data: rowData},
					dataType: 'json',
					success: function (data) {
						if(data.code == "error"){
							msgGridWin({
								title: "警告", 
								msg: "以下售后单操作失败", 
								width: "700px",
								height: "430px",
								columns: [
									{ type: "indexcolumn" },
									{ field: "sh_no", width: 120, headerAlign: "center", header: "售后单号"},
									{ field: "msg", width: 500, headerAlign: "center", header: "消息"},
								],
								data: data.msgList,
								type: 'alert',
								callBack: function(){
									datagrid1.reload();
								}
							});
						}else{
							mini.showTips({
								content: "操作成功，请查看AG退款状态和AG退款说明",
								state: 'success',
								x: 'center',
								y: 'center',
								timeout: 3000
							});
							
							datagrid1.reload();
						}
					}
				});
			}
		}
	);
}

function setupTplPrinter(){
	doGetPrinters(function(rowData){
	mini.open({
		title:"设置打印机、模板",
		width:650,
		allowResize:false,
		showMaxButton:true,
		height:400,
		url:"/index.php?m=aftersale&c=aftersaleNew&a=setupTplPrinter",
		loadOnRefresh: true,
		onload: function () {       //弹出页面加载完成
			var iframe = this.getIFrameEl(); 
			var data = {rowData: rowData};
			//调用弹出页面方法进行初始化
			iframe.contentWindow.SetData(data);
		},
		ondestroy: function (action) {
			if (action == "ok") {
				mini.showTips({
					content: "操作成功",
					state: 'success',
					x: 'center',
					y: 'center',
					timeout: 3000
				});
				
				datagrid1.reload();
			}
		}
	});
});
	
}
var isClick = true;
function printUniqueLabel(goods_type){
  if(isClick) {
	isClick = false;
	setTimeout(function() {
		isClick = true;
			}, 3000);
	var rowData = datagrid1.getSelecteds();
	if(rowData.length == 0){
		mini.showTips({
            content: "请先选择一个售后单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	if(rowData.length != 1){
		mini.showTips({
            content: "必须选择一个售后单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	var new_tid = rowData[0].new_tid;
	var row = employee_grid.getSelecteds();
	if(row == ""){
		mini.showTips({
			content: "【请先选择一个售后商品信息选项】",
			state: 'danger',
			x: 'center',
			y: 'center',
			timeout: 3000
		});
		return false;
	}
	for(var i = 0;i<row.length;i++){
		if(row[i].oid == 'manual'){
			mini.showTips({
				content: "【所选单包含不能打印单】",
				state: 'danger',
				x: 'center',
				y: 'center',
				timeout: 3000
			});
			return false;
		}
		if(row[i].type!='0'){
			mini.showTips({
				content: "【请选择退货商品】",
				state: 'danger',
				x: 'center',
				y: 'center',
				timeout: 3000
			});
			return false;
		}
	}
	var unprintTplBq = "";
	var unprintname = "";
	var delList = "";
	var delListBad = "";
	$.ajax({
		url: "/index.php?m=afterSale&c=unpacking&a=getDefaultSetup",
		type: 'post',
		data: {},
		async:false,
		dataType: 'json',
		success: function (data) {
			unprintname = data['defaultSetup'][0];
			delList = data['defaultSetup'][1];
			delListBad = data['defaultSetup'][2];
		}
	});
	if(!unprintname){
		unprintname = $('#layprint').val();
		if(unprintname == ""){
			mini.showTips({
				content: "【请先设置打印机】",
				state: 'danger',
				x: 'center',
				y: 'center',
				timeout: 3000
			});
			return false;
		}else{
			mini.showTips({
				content: "【未设置具体打印机，使用默认打印机】",
				state: 'success',
				x: 'center',
				y: 'center',
				timeout: 3000
			});
		}
	}
	if(goods_type == "good" && delList){
		unprintTplBq = delList;
	}else if(goods_type == "bad" && delList){
		unprintTplBq = delListBad;
	}else{
		unprintTplBq = $('#layprintTplBq').val();
		if(unprintTplBq == ""){
			mini.showTips({
				content: "请先设置标签打印模板",
				state: 'danger',
				x: 'center',
				y: 'center',
				timeout: 3000
			});
			return false;
		}else{
			mini.showTips({
				content: "未设置具体模板，使用默认模板",
				state: 'success',
				x: 'center',
				y: 'center',
				timeout: 3000
			});
		}
	}
	$.ajax({																																									
		url: "/index.php?m=afterSale&c=unpacking&a=getPrintData",																															
		type: 'post',																																										
		data: {new_tid: new_tid, goods_type: goods_type, itemdata: row},																																									
		dataType: 'json',																																						
		success: function (data) {
			if(data.code == "ok"){
				mini.showTips({
					content: "打印成功",
					state: 'success',
					x: 'center',
					y: 'center',
					timeout: 1000
				});
				for(var i = 0; i < data.printData.length; i++){
					printTpl[unprintTplBq](unprintname,data.printData[i]);	
				}
			}else{
				mini.showTips({
					content: "数据异常",
					state: 'danger',
					x: 'center',
					y: 'center',
					timeout: 3000
				});
			}
		}
	});
  }
}

function orderCancel(){
	var rowData = datagrid1.getSelecteds();
	if(rowData.length == 0){
		mini.showTips({
            content: "请先选择一个售后单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	data = JSON.stringify(rowData);
	data = encodeURI(data);
	
	mini.confirm('确认作废售后单？此操作不可逆！', "确定？",
		function (action) {
			if (action == "ok") {
				$.ajax({
					url: "/index.php?m=aftersale&c=aftersaleNew&a=orderCancel",
					type: 'post',
					data: {status: status, data: data},
					dataType: 'json',
					success: function (data) {
						if(data.code == "error"){
							msgGridWin({
								title: "警告", 
								msg: "以下售后单操作失败", 
								width: "700px",
								height: "430px",
								columns: [
									{ type: "indexcolumn" },
									{ field: "sh_no", width: 120, headerAlign: "center", header: "售后单号"},
									{ field: "msg", width: 500, headerAlign: "center", header: "消息"},
								],
								data: data.msgList,
								type: 'alert',
								callBack: function(){
									datagrid1.reload();
								}
							});
						}else{
							mini.showTips({
								content: "操作成功",
								state: 'success',
								x: 'center',
								y: 'center',
								timeout: 3000
							});
							
							datagrid1.reload();
						}
					}
				});
			}
		}
	);
}

function cbProductRows(data,type){
	var prdObj = [];
	if(data.length == 0){
		mini.showTips({
            content: "请先选择一个商品",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	
	var sh_no = mini.get('form_sh_no').value;
	if(sh_no == ''){
		mini.showTips({
            content: "请先选择一个售后单",
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 3000
        });
		return false;
	}
	
	if(type == 'tuihuo' || type == 'huanhuo' || type == 'bufa' || type == 'qita'){
		for(var i = 0; i < data.length; i++){
			prdObj.push({
				pic_url: data[i]['image_url'],
				num: 1,
				prd_no: data[i]['prd_no'],
				sku_name: data[i]['sku_name'],
				price: data[i]['sum_price'],
				payment: data[i]['sum_price'],
				title: data[i]['title']
			});
		}
		
		data = JSON.stringify(prdObj);
		data = encodeURI(data);
		
		$.ajax({
			url: "/index.php?m=aftersale&c=aftersaleNew&a=addRefundItems2",
			type: 'post',
			data: {sh_no: sh_no, type: type, data: data},
			dataType: 'json',
			success: function (data) {
				if(data.code == "error"){
					mini.showTips({
						content: "添加失败【" + data.msg + "】",
						state: 'danger',
						x: 'center',
						y: 'center',
						timeout: 3000
					});
				}else{
					mini.showTips({
						content: "添加成功",
						state: 'success',
						x: 'center',
						y: 'center',
						timeout: 3000
					});
					
					datagrid1.reload();
					employee_grid.load({sh_no: sh_no});
				}
			}
		});
	}
}

function buttonControl(sh_type, status, goods_status){
	if(sh_type == '0'){//普通退货
		$('#toggleBtn1').show();
		$('#toggleBtn2').show();
		$('#toggleBtn3').hide();
		$('#toggleBtn4').hide();
		$('#toggleBtn5').hide();
		$('#toggleBtn6').hide();
		$('#toggleBtn7').show();
		$('#toggleBtn8').show();
		$('#toggleBtn9').hide();
		$('#toggleBtn10').hide();
	}else if(sh_type == '1'){//换货
		$('#toggleBtn1').show();
		$('#toggleBtn2').show();
		$('#toggleBtn3').show();
		$('#toggleBtn4').show();
		$('#toggleBtn5').hide();
		$('#toggleBtn6').hide();
		$('#toggleBtn7').show();
		$('#toggleBtn8').show();
		$('#toggleBtn9').hide();
		$('#toggleBtn10').hide();
	}else if(sh_type == '2'){//补发
		$('#toggleBtn1').hide();
		$('#toggleBtn2').hide();
		$('#toggleBtn3').hide();
		$('#toggleBtn4').hide();
		$('#toggleBtn5').show();
		$('#toggleBtn6').show();
		$('#toggleBtn7').show();
		$('#toggleBtn8').show();
		$('#toggleBtn9').hide();
		$('#toggleBtn10').hide();
	}else if(sh_type == '3'){//仅退款
		$('#toggleBtn1').hide();
		$('#toggleBtn2').hide();
		$('#toggleBtn3').hide();
		$('#toggleBtn4').hide();
		$('#toggleBtn5').hide();
		$('#toggleBtn6').hide();
		$('#toggleBtn7').show();
		$('#toggleBtn8').show();
		$('#toggleBtn9').show();
		$('#toggleBtn10').show();
	}else if(sh_type == '4'){//拒收退货
		$('#toggleBtn1').hide();
		$('#toggleBtn2').hide();
		$('#toggleBtn3').hide();
		$('#toggleBtn4').hide();
		$('#toggleBtn5').hide();
		$('#toggleBtn6').hide();
		$('#toggleBtn7').show();
		$('#toggleBtn8').show();
		$('#toggleBtn9').hide();
		$('#toggleBtn10').hide();
	}
	
	if(status == '1' || status == '2'){
		$('#toggleBtn1').hide();
		$('#toggleBtn2').hide();
		$('#toggleBtn3').hide();
		$('#toggleBtn4').hide();
		$('#toggleBtn5').hide();
		$('#toggleBtn6').hide();
		$('#toggleBtn7').hide();
		$('#toggleBtn8').hide();
		$('#toggleBtn9').hide();
		$('#toggleBtn10').hide();
	}
	
	if(goods_status == '1'){
		$('#toggleBtn1').hide();
		$('#toggleBtn2').hide();
	}
}

function onCloseClick(e){
	var obj = e.sender;
	obj.setText("");
	obj.setValue("");
}

function toExcel(){
	if(mini.get("created_date1").getFormValue() == ""){
			mini.get('created_date1').setValue(search_date2);
		}
	if(mini.get("created_date2").getFormValue() == ""){
		mini.get('created_date2').setValue(search_date1);
	}
	
	var sh_no_search = mini.get('sh_no_search').value;
	var key_search = mini.get('key_search').value;
	var sh_type_search = mini.get('sh_type_search').value;
	var refund_mark_search = mini.get('refund_mark_search').value;
	var shopid_search = mini.get('shopid_search').value;
	var status_search = mini.get('status_search').value;
	var goods_status_search = mini.get('goods_status_search').value;
	var ag_status_search = mini.get('ag_status_search').value;
	var refund_type_search = mini.get('refund_type').value;
	var created_time_begin = mini.get("created_date1").getFormValue()+' '+mini.get("created_time1").getFormValue();
	if(mini.get("created_date1").getFormValue() == ""){
		created_time_begin = "";
	}
	var created_time_end = mini.get("created_date2").getFormValue()+' '+mini.get("created_time2").getFormValue();
	if(mini.get("created_date2").getFormValue() == ""){
		created_time_end = "";
	}
	var time = new Date().getTime();
	exportExcel("/?m=afterSale&c=aftersaleNew&a=exportExcel&loginact=file", {sh_no_search: sh_no_search, key_search: key_search, created_time_begin: created_time_begin, created_time_end: created_time_end, sh_type_search: sh_type_search, shopid_search: shopid_search, status_search: status_search, goods_status_search: goods_status_search, refund_mark_search: refund_mark_search, ag_status_search: ag_status_search, refund_type_search: refund_type_search, time: time});
}