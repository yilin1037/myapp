mini.parse(); 

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
   
	var AreaName = mini.get('AreaName').value;
	var AreaScope = mini.get('AreaScope').value;
	var Remarks = mini.get('Remarks').value;
	
	if($.trim(AreaName) == ""){
		mini.alert("区域名称必须填写！！");
		return false;
	}
	
	if($.trim(AreaScope) == ""){
		mini.alert("必须选择对应的区域范围！！");
		return false;
	}
   
	$.ajax({
		url: "?m=system&c=setup&a=areaAdd",
		type: "post",
		data: {AreaName: AreaName, AreaScope: AreaScope, Remarks: Remarks},
		dataType:'json',
		success: function (data) {
			if(data.code == 'ok'){
				mini.alert("新增成功");
			}else{
				mini.alert(data.msg);	
			}
			
			mini.get("save").setEnabled(false);
		}
	});

}
	