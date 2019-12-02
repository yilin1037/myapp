mini.parse();
var datagrid1 = mini.get('datagrid1');
searchOrder();

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
		if(value == '0'){//待审核
			e.cellStyle = "background:#FF6B00;color:#FFF";
		}else if(value == '1'){//已审核
			e.cellStyle = "background:#00E7FF;color:#000";
		}else if(value == '2'){//完成
			e.cellStyle = "background:#99E626;color:#000";
		}else if(value == '3'){//作废
			e.cellStyle = "background:#FF0000;color:#FFF";
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
	
	var refund_no_search = mini.get('refund_no_search').value;
	var sh_no_search = mini.get('sh_no_search').value;
	var new_tid_search = mini.get('new_tid_search').value;
	var buyer_nick_search = mini.get('buyer_nick_search').value;
	var shopid_search = mini.get('shopid_search').value;
	var status_search = mini.get('status_search').value;
	var created_time_begin = mini.get("created_date1").getFormValue()+' '+mini.get("created_time1").getFormValue();
	if(mini.get("created_date1").getFormValue() == ""){
		created_time_begin = "";
	}
	var created_time_end = mini.get("created_date2").getFormValue()+' '+mini.get("created_time2").getFormValue();
	if(mini.get("created_date2").getFormValue() == ""){
		created_time_end = "";
	}

	var searchParam = {refund_no_search: refund_no_search, sh_no_search: sh_no_search, new_tid_search: new_tid_search, buyer_nick_search: buyer_nick_search, created_time_begin: created_time_begin, created_time_end: created_time_end, shopid_search: shopid_search, status_search: status_search};
	
	datagrid1.load({data: searchParam});
}

function clearSearch(){
	mini.get('refund_no_search').setValue('');
	mini.get('sh_no_search').setValue('');
	mini.get('new_tid_search').setValue('');
	mini.get('buyer_nick_search').setValue('');
	mini.get('created_date1').setValue(search_date2);
	mini.get('created_time1').setValue('00:00');
	mini.get('created_date2').setValue(search_date1);
	mini.get('created_time2').setValue('23:59');
	mini.get('shopid_search').setValue('');
	mini.get('shopid_search').setText('');
	mini.get('status_search').setValue('');
	mini.get('status_search').setText('');
}

function OnCellBeginEdit(e){
	var record = e.record, field = e.field;
	if(field == 'status'){
		e.cancel = true;
	}
	if(field == 'refund_amtn' ||field == 'refund_channel' || field == 'pay_account_no' || field == 'remark'){
		if(record.status == '1' || record.status == '2' || record.status == '3'){
			e.cancel = true;
		}
	}
	
	if(datagrid1.isChanged() && datagrid1.isValid()){
		updateRowdatagrid1();
	}
}

function refundSave(){
	updateRowdatagrid1();
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
	var sh_no = rowData[0].refund_no;
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
		url: "/index.php?m=aftersale&c=aftersaleNew&a=saveRefundOrdersTk",
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
			}
			else
			{
				datagrid1.unmask();	
				msgGridWin({
					title: "警告", 
					msg: "以下退款单操作失败", 
					width: "700px",
					height: "430px",
					columns: [
						{ type: "indexcolumn" },
						{ field: "refund_no", width: 120, headerAlign: "center", header: "退款单号"},
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

function confirmOrder(status){
	var rowData = datagrid1.getSelecteds();
	if(rowData.length == 0){
		mini.showTips({
            content: "请先选择一个退款单",
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
		var title = "确认审核退款单？";
	}else if(status == 'un'){
		var title = "确认反审核退款单？";
	}else if(status == 'complete'){
		var title = "确认退款完成？此操作不可逆！";
	}else if(status == 'cancel'){
		var title = "确认作废订单？此操作不可逆！";
	}
	mini.confirm(title, "确定？",
		function (action) {
			if (action == "ok") {
				$.ajax({
					url: "/index.php?m=aftersale&c=aftersaleNew&a=confirmOrderTk",
					type: 'post',
					data: {status: status, data: data},
					dataType: 'json',
					success: function (data) {
						if(data.code == "error"){
							msgGridWin({
								title: "警告", 
								msg: "以下退款单操作失败", 
								width: "700px",
								height: "430px",
								columns: [
									{ type: "indexcolumn" },
									{ field: "refund_no", width: 120, headerAlign: "center", header: "退款单号"},
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

function onCloseClick(e){
	var obj = e.sender;
	obj.setText("");
	obj.setValue("");
}