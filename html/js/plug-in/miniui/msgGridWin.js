var msgCallBack;
function msgGridWin(param)
{
	var defaults = {
		title: "提示", 
		msg: "", 
		width: "700px",
		height: "430px",
		columns: [
            { type: "indexcolumn" },
            { field: "id", width: 120, headerAlign: "center", header: "编号"},
            { field: "text", width: 200, headerAlign: "center", header: "标题"},
        ],
		type: 'alert',
		callBack: null,
		data: null
	};
	
	param = $.extend(defaults,param);
	msgCallBack = param.callBack;
	var obj = mini.get("msgGridWin");
	if(obj)
	{
		obj.destroy();
	}	
	var btnStr = param.type != 'confirm' ? '<a id="button_ok" class="mini-button" iconCls="icon-ok" onClick="closeMsgGridWin(\'ok\')" >确定</a>' : '<a class="mini-button" iconCls="icon-ok" onClick="closeMsgGridWin(\'ok\')" >确定</a><a class="mini-button" iconCls="icon-cancel" onClick="closeMsgGridWin(\'cancel\')" >取消</a>';

	var winHtml = '<div id="msgGridWin" class="mini-window" title="'+param.title+'" style="width:'+param.width+';height:'+param.height+';" '	
					+'showModal="true" allowResize="false" allowDrag="true">'
					+'<div><strong>'+param.msg+'</strong></div>'
					+'<div class="mini-fit">'
						+'<div id="panel1" class="mini-panel" title="'+param.title+'" style="width:100%;height:100%;" showFooter="true" showToolbar="false" showHeader="false" >'
							+'<div id="dataGridMsgList" class="mini-datagrid" style="width:100%;height:100%;" '
								+'allowResize="true" pageSize="1000000" virtualScroll="true" showPager="false">'
							+'</div>'
							+'<div property="footer" style="text-align:right">'+btnStr
							+'</div>'
						+'</div>'
					+'</div>'
				  +'</div>';
	$("body").append(winHtml);
	mini.parse();
	showGridWin(param);
}

function showGridWin(param)
{
	var obj = mini.get("msgGridWin");
	obj.on("beforebuttonclick",function(e){
		if(e.name == 'close'){
			closeMsgGridWin('close');
		}
	});
	var gridObj = mini.get("dataGridMsgList");
	param.width = "100%";
	param.height = "100%";
	gridObj.set(param);
	obj.show();
	if(param.type == 'alert'){
		$('#button_ok').focus();
	}
}

function closeMsgGridWin(act)
{
	var obj = mini.get("msgGridWin");	
	obj.hide();
	if(typeof(msgCallBack) === 'function')
	{
		msgCallBack(act);	
	}
}