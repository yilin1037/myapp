mini.parse(); 

function SetData(id){
	$.ajax({
		url: "?m=system&c=setup&a=areaGet",
		type: "post",
		data: {id: id},
		dataType:'json',
		success: function (data) {
			mini.get('AreaId').setValue(id);
			mini.get('AreaName').setValue(data.areaName);
			mini.get('AreaScope').setValue(data.AreaScope);
			mini.get('Remarks').setValue(data.remark);
		}
	});
}

function Area(){
	mini.open({
		title:"区域地区设置",
		width:300,
		allowResize:true,
		showMaxButton:true,
		height:400,
		bodyStyle: "padding:5px;",
		url:"?m=system&c=setup&a=areaTree",
		onload: function () {
			var iframe = this.getIFrameEl();
			var data = mini.get('AreaScope').value;
			
			iframe.contentWindow.SetData(data);
		},
		ondestroy: function (action) {
			if (action == "ok") {
				var iframe = this.getIFrameEl();
				var data = iframe.contentWindow.GetData();
				data = mini.clone(data);
				
				mini.get('AreaScope').setValue(data);
			}
		}
	});   
}


function sendForm(){
    var AreaId = mini.get('AreaId').value;
	var AreaName = mini.get('AreaName').value;
	var AreaScope = mini.get('AreaScope').value;
	var Remarks = mini.get('Remarks').value;
	
	if($.trim(AreaId) == ""){
		mini.alert("异常，请重新打开页面！！");
		return false;
	}
	
	if($.trim(AreaName) == ""){
		mini.alert("区域名称必须填写！！");
		return false;
	}
	
	if($.trim(AreaScope) == ""){
		mini.alert("必须选择对应的区域范围！！");
		return false;
	}
   
	$.ajax({
		url: "?m=system&c=setup&a=areaUpdate",
		type: "post",
		data: {AreaId: AreaId, AreaName: AreaName, AreaScope: AreaScope, Remarks: Remarks},
		dataType:'json',
		success: function (data) {
			if(data.code == 'ok'){
				mini.alert("编辑成功");
			}else{
				mini.alert(data.msg);	
			}
			
			mini.get("save").setEnabled(false);
		}
	});
}
	