var faceAlone = new Vue({
	el: '#faceAlone',
	data: {
		expressArr:[],
	},
	mounted: function() {
		var self = this;
		$.ajax({																																													
			url: "/index.php?m=print&c=dzmdDesign&a=getExpress",																																		
			type: 'post',																																											
			data: {},																																												
			dataType: 'json',																																										
			success: function (data) {																																								
				self.expressArr = data;	
                
			}																																														
		});	
	},
	methods: {
		
	},
});

layui.use(['form', 'element',  'layer'], function(){
    var $ = layui.jquery, 
    layer = layui.layer, 
    form = layui.form();
    reLoadWindow();
    onLoadData();
    form.on('checkbox(node)', function(data){
        var dataField = $(data.elem).attr('data-field');
        var dataType = $(data.elem).attr('data-type');
        onTdChange(dataField,data.elem.checked);
    });
	form.on('checkbox(gridConfig)', function(data){
        loadTableName();
    });
    
    $('.my-action-btn').click(function(){
        var dataField = $(this).attr('data-field');
        var dataType = $(this).attr('data-type');
        var datahtml = $(this).html();
        switch(dataType){
            case 'text':
                setPrintText();
            break;
            case 'field':
                setPrintData(dataField,datahtml);
            break;
			case 'barcode':
                setPrintCode(dataField,datahtml);
            break;
			case 'print_QRCode':
                setPrintQRCode();
            break;
            case 'deleteControl':
                delField();
            break;
            case 'saveTemplate':
                saveTemplate();
            break;
            case 'viewTemplate':
                //先保存后预览
                saveTemplate(true);
            break;
            case 'downloadTemplate':
                downloadTemplate();
            break;
        }
    });
});

function onLoadData()
{
	LODOP = getLodop(document.getElementById('LODOP'),document.getElementById('LODOP_EM2')); 	
	DisplaySetup();
}

function DisplaySetupNew() {
	CreatePageNew();
	LODOP.SET_SHOW_MODE("SETUP_IN_BROWSE",1);
	LODOP.SET_SHOW_MODE("MESSAGE_NOSET_PROPERTY",'');
	LODOP.SET_SHOW_MODE("SETUP_ENABLESS",'11111111011110');
	LODOP.SET_SHOW_MODE("HIDE_ABUTTIN_SETUP",1);//隐藏应用按钮
	LODOP.SET_SHOW_MODE("HIDE_VBUTTIN_SETUP",1);//隐藏预览按钮
	LODOP.SET_SHOW_MODE("HIDE_RBUTTIN_SETUP",1);//隐藏还原按钮
	LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_SETUP",1);//隐藏打印按钮
	LODOP.SET_SHOW_MODE("HIDE_GROUND_LOCK",1);//隐藏纸钉按钮
	LODOP.PRINT_SETUP();
}
function CreatePageNew()
{
	LODOP=getLodop(document.getElementById('LODOP'),document.getElementById('LODOP_EM2'));
	var lodopStr = LODOP.GET_VALUE("ProgramCodes",0);
	var a = lodopStr.indexOf('Page");');
	var tempStr = lodopStr.substring(a,lodopStr.length);
	var printName = $('#tpl_name').val(); 
	if(printName == "")
	{
		printName = "@打印@";	
	}
	var left = $('#left').val() ? $('#left').val() : '0';  
	var top = $('#top').val() ? $('#top').val() : '0';
	var width = $('#width').val() ? $('#width').val() : '0';
	var height = $('#height').val() ? $('#height').val() : '0';
	var orientation = $('#orientation').val() ? $('#orientation').val() : '0';
	if(orientation == 2)
	{
		lodopStr = 'LODOP.PRINT_INITA('+top+','+left+',"'+height+'mm","'+width+'mm","'+printName+'");'+'LODOP.SET_PRINT_PAGESIZE('+orientation+',"'+height+'mm","'+width+'mm","CreateCustom'+tempStr;	
	}
	else
	{
		lodopStr = 'LODOP.PRINT_INITA('+top+','+left+',"'+width+'mm","'+height+'mm","'+printName+'");'+'LODOP.SET_PRINT_PAGESIZE('+orientation+',"'+width+'mm","'+height+'mm","CreateCustom'+tempStr;
	}
	eval(lodopStr);
};

function DisplaySetup() {		
	CreatePage();
	LODOP.SET_SHOW_MODE("SETUP_IN_BROWSE",1);
	LODOP.SET_SHOW_MODE("MESSAGE_NOSET_PROPERTY",'');
	LODOP.SET_SHOW_MODE("SETUP_ENABLESS",'11111111011110');
	LODOP.SET_SHOW_MODE("HIDE_ABUTTIN_SETUP",1);//隐藏应用按钮
	LODOP.SET_SHOW_MODE("HIDE_VBUTTIN_SETUP",1);//隐藏预览按钮
	LODOP.SET_SHOW_MODE("HIDE_RBUTTIN_SETUP",1);//隐藏还原按钮
	LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_SETUP",1);//隐藏打印按钮
	LODOP.SET_SHOW_MODE("HIDE_GROUND_LOCK",1);//隐藏纸钉按钮
	LODOP.PRINT_SETUP();
}

function reLoadWindow(){
    var designerHeight = $('body').height();
    var designerWidth = $('body').width() - 391;
    $(".designer").height(designerHeight);
    $(".designer-left").width(designerWidth);
    $(".desiginer-canvas").height(designerHeight - 75);
}
//获取临时标识
function getTimeStamp(isRandom) {
    var timestamp = new Date().getTime();
    if (isRandom) {
        return parseInt(timestamp * Math.random());
    }
    return timestamp;
}

//删除字段
function delField(){
	var uid = LODOP.GET_VALUE('ItemName','selected');
    if(uid){
        delFieldWidget();
    }
}
function delFieldWidget(){
	var item_id;
	var uid = LODOP.GET_VALUE('ItemName','selected');
	while (uid != "")
	{
		if(uid.substr(0,3) == "_ls")
		{
			LODOP.SET_PRINT_STYLEA(uid,'Deleted',true);
		}
		else if(uid == 'gridTable')
		{
			LODOP.SET_PRINT_STYLEA(uid,'Deleted',true);
			var tableJson = {};
			tableJson['tdName'] = {};
			tableJson['footName'] = {};
		}
		else
		{
			LODOP.SET_PRINT_STYLEA(uid,'Deleted',true);	
		}
		uid = LODOP.GET_VALUE('ItemName','selected');
	}
}
var isShowDelay = false;
var lastElId;
function showConfig(){
	if(tableJson['tableBorder'] == true)
	{
		var obj = $("#tableBorder");
		obj.attr('checked',true);
		obj.parent().find('.layui-form-checkbox').addClass('layui-form-checked');
	}
	if(tableJson['tableHeader'] == true)
	{
		var obj = $("#tableHeader");
		obj.attr('checked',true);
		obj.parent().find('.layui-form-checkbox').addClass('layui-form-checked');
	}
	if(tableJson['tableStrong'] == true)
	{
		var obj = $("#tableStrong");
		obj.attr('checked',true);
		obj.parent().find('.layui-form-checkbox').addClass('layui-form-checked');
	}
	$('#tableFontSize').val(tableJson['tableFontSize']);

    if(tableJson['tdName']){
		for(var i in tableJson['tdName']){
            tdName = i;
			var obj = $("input[data-field='"+tdName+"']");
			obj.attr('checked',true);
			var title = tableJson['tdName'][tdName];
			obj.parent().find('.layui-form-checkbox').addClass('layui-form-checked');
			$("#footName").append("<option value='"+tdName+"'>"+title+"</option>");
        }
	}
}

//添加字段
function setPrintData(uid,title){
   	count++;
	LODOP.ADD_PRINT_TEXTA(uid+"|"+count,0,0,200,24,title);
	LODOP.SET_PRINT_STYLEA("Last","FontName","黑体");
	LODOP.SET_PRINT_STYLEA("Last","FontSize",9);
	LODOP.SET_PRINT_STYLEA("Last","ReadOnly",1);
}
function setPrintText(){
    LODOP.ADD_PRINT_TEXTA("_ls-"+Math.floor(Math.random()*10000000),0,0,88,24,"请输入文本");
	LODOP.SET_PRINT_STYLEA("Last","FontName","黑体");
	LODOP.SET_PRINT_STYLEA("Last","FontSize",9);
	LODOP.SET_PRINT_STYLEA("Last","ReadOnly",0);
}
function setPrintQRCode(){
	layer.prompt({
		formType: 2,
		offset: 'r',
		title: '请输入要打印的二维码内容：',
		area: ['300px', '100px'] //自定义文本域宽高
	}, function(value, index, elem){
		if(value == ''){
			return;	
		}
		LODOP.ADD_PRINT_BARCODEA("_ls-"+Math.floor(Math.random()*10000000),20,20,100,100,"QRCode",value);
		LODOP.SET_PRINT_STYLEA("Last","QRCodeVersion",7);
		LODOP.SET_PRINT_STYLEA("Last","ReadOnly",0);
		layer.close(index);
	});
};
function setPrintCode(uid,code){
	count++;
	LODOP.ADD_PRINT_BARCODEA(uid+"|"+count,40,30,200,30,"128Auto",code);
};
//表格
function loadTableName(){
	tableJson['tableBorder'] = $('#tableBorder').parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
	tableJson['tableHeader'] = $('#tableHeader').parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
	tableJson['tableStrong'] = $('#tableStrong').parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
	tableJson['tableFontSize'] = $('#tableFontSize').val();
	if(tableJson['tableBorder'] == true){
		var border	= "1";
	}else{
		var border	= "0";
	}
	var theadStr = '';
	var tfootStr = '';
    if(tableJson['tdName']){
		var tableStr = "<TABLE border="+border+" cellSpacing=0 cellPadding=1 style='width:100%;height:100%;border-collapse:collapse;font-size:"+tableJson['tableFontSize']+"px' bordercolor='#333333'>";
		if(tableJson['tableHeader'] == true)
		{
			theadStr = '<thead><TR height="28px">';
		}
		var tbodyStr = '<tbody><TR height="28px">';
        for(var i in tableJson['tdName']){
            if(typeof(tableJson['tdName'][i]) == 'string' && tableJson['tdName'][i]){
                var title = tableJson['tdName'][i];
				if(tableJson['tableHeader'] == true)
				{
					theadStr += '<td><b>'+title+'</b></td>';
				}
				title = tableJson['tableStrong'] == true ? '<b>'+title+':$data</b>' : title+':$data';
				var width = Math.ceil(100 / tableJson['tdName'].length);
				tbodyStr += '<td width="'+width+'%">'+title+'</td>';
				if(tableJson['footName'][i])
				{
					if(tableJson['footName'][i] == "footNowPage"){
						tfootStr += "<TD tdata='pageNO' format='#' align='left'><p align='left'><b>第#页</b></p></TD>";
					}else if(tableJson['footName'][i] == "footAllPage"){
						tfootStr += "<TD tdata='pageCount' format='#' align='left'><p align='left'><b>共#页</b></p></TD>";
					}else if(tableJson['footName'][i] == "footSubCount"){
						tfootStr += "<TD tdata='SubCount' format='#' align='left'><p align='left'><b>页行数(##)</b></p></TD>";
					}else if(tableJson['footName'][i] == "footAllCount"){
						tfootStr += "<TD tdata='AllCount' format='#' align='left'><p align='left'><b>总行数(##)</b></p></TD>";
					}else if(tableJson['footName'][i] == "footSubSum"){
						tfootStr += "<TD tdata='subSum' format='#' align='left'><p align='left'><b>页合计(###)</b></p></TD>";
					}else if(tableJson['footName'][i] == "footAllSum"){
						tfootStr += "<TD tdata='AllSum' format='#' align='left'><p align='left'><b>总合计(####)</b></p></TD>";
					}else{
						tfootStr += "<TD align='left'><p align='left'><b>"+tableJson['footName'][i]+"</b></p></TD>";
					}
				}
				else
				{
					tfootStr += "<TD align='left'></TD>";	
				}
            }
        }
		tbodyStr += '</TR><tr height="100%"></tr></tbody>';
		if(tableJson['tableHeader'] == true)
		{
			theadStr += '</TR></thead>';
		}
		if(tfootStr != '')
		{
			tfootStr = '<tfoot><TR height="28px">'+tfootStr+'</TR></tfoot>';
		}
		tableStr += theadStr+tbodyStr+tfootStr+ "</TABLE>";
        layui.form().render();
		if(LODOP.GET_VALUE('ItemName','gridTable') == "")
		{
			LODOP.ADD_PRINT_TABLE(100,"5%",($('#width').val()*0.9)+"mm",74,tableStr);
			LODOP.SET_PRINT_STYLEA("Last","ItemName",'gridTable');
		}else{
			LODOP.SET_PRINT_STYLEA('gridTable','Content',tableStr);
		}
    }
}
function onTdChange(tdName,checked){
	if(checked == true){
		var obj = $("input[data-field='"+tdName+"']");
        var title = obj.attr('title');
		tableJson['tdName'][tdName] = title;
		$("#footName").append("<option value='"+tdName+"'>"+title+"</option>");
    }else{
        for(var i in tableJson['tdName']){
            if(i == tdName){
                delete tableJson['tdName'][i];
				$("#footName option[value="+tdName+"]").remove();
				delete tableJson['footName'][tdName];
            }
        }
    }
    loadTableName();
}

function onFootNameChange(){
	var tdName = $("#footName").val();
	var value = tableJson['footName'][tdName] ? tableJson['footName'][tdName] : '';
	$("#footValue").val(value);
}


function onFootValueChange(){
	var tdName = $("#footName").val();
	var value = $("#footValue").val();
	if(value != ''){
        if(value == 'footText')
		{
			value = prompt("请输入自定义文本:","");
			if(value == '')
			{
				return;	
			}
			tableJson['footName'][tdName] = value;
			loadTableName();
		}
		else
		{
			tableJson['footName'][tdName] = value;
			loadTableName();
		}
    }else{
		delete tableJson['footName'][tdName];
		loadTableName();
    }
}

function saveTemplate(isView){
    var tpl_name = $("#tpl_name").val();
	var def = $("input[name='def']").parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
	var left = $("#left").val() == '' ? 0 : $("#left").val();
	var top = $("#top").val() == '' ? 0 : $("#top").val();
	var width = $("#width").val() == '' ? 0 : $("#width").val();
	var height = $("#height").val() == '' ? 0 : $("#height").val();
	var orientation = $("#orientation").val() ? $("#orientation").val() : 0;
	var print_bottom = $("#print_bottom").val() ? $("#print_bottom").val() : 0;
	var extraPrintCount = $("#extraPrintCount").val() ? $("#extraPrintCount").val() : 0;

	alert

    def = def ? 'T' : 'F';
    if(tpl_name == ''){
		alert("模版名称不能为空");
        return;
    }else if(tpl_name.length > 10){
		alert("模版名称最多输入10个字数");
        return;
    }
	var lodopStr = LODOP.GET_VALUE("ProgramCodes",0);
	var a = lodopStr.indexOf('Page");');
	var tempStr = lodopStr.substring(a,lodopStr.length);
	if(tpl_name == "")
	{
		tpl_name = "@打印@";	
	}
	lodopStr = 'LODOP.PRINT_INITA('+top+','+left+',"'+width+'mm","'+height+'mm","'+tpl_name+'");'+"\r\n"+'LODOP.SET_PRINT_PAGESIZE('+orientation+',"'+width+'mm","'+(orientation=='3' ? print_bottom : height)+'mm","CreateCustom'+tempStr;
	if(lodopStr == ""){
		alert("请设置打印模板之后再保存");
		return;	
	}
	var indexLoad = layer.load();
    execAjax({
        m:'print',
        c:'lodopDesign',
        a:'saveTemplate',
        data:{
            act:act,
			type:type,
			id:paramObject.id,
            tpl_name:tpl_name,
            def:def,
            left:left,
            top:top,
            width:width,
            height:height,
			orientation:orientation,
			print_bottom:print_bottom,
			extraPrintCount:extraPrintCount,
			tableJson:JSON.stringify(tableJson),
			tpl_json:lodopStr,
        },
        success:function(data){
            layer.close(indexLoad);
            if(data['code'] == 'ok'){
				act = 'edit';
				paramObject.id = data.id;
                if(isView){
                    doPrintView();
                }else{
					alert(data['msg']);
                }
                parent.parent.reMenuOpen();
                parent.parent.add_name();
            }else{
                alert(data['msg']);
            }
            
        }
    });
}
function doPrintView(){
    var indexLoad = layer.load();
    execAjax({
        m:'print',
        c:'dzmdDesign',
        a:'getPrintDesign',
        data:{
            id:paramObject.id
        },
        success:function(data){
            var cust_data = {};
            var cust_template_orderField = data['param_json']['cust_template_orderField'];
            
            var cust_template_itemField = data['param_json']['cust_template_itemField'];
            var item = [];
            for(var i in cust_template_orderField){
                if(typeof(cust_template_orderField[i]) == 'string'){
                    var obj = $("button[data-field='"+cust_template_orderField[i]+"']");
                    var title = obj.text();
                    cust_data[cust_template_orderField[i]] = title;
                }
            }
            for(var j =0; j<=3;j++){
                var row = {};
                for(var i in cust_template_itemField){
                    if(typeof(cust_template_itemField[i]) == 'string'){
                        var obj = $("input[data-field='"+cust_template_itemField[i]+"']");
                        var title = obj.attr('title');
                        row[cust_template_itemField[i]] = title;
                    }
                }
                item.push(row);
            }
            cust_data['item'] = item;
            $.getScript("?m=print&c=script&a=createTplScript&_t="+Math.random(),function(){
                setTimeout(function() {
                    layer.close(indexLoad);
                    var sys_data = {
						"recipient": {
							"address": {
								"city": "北京市",
								"detail": "花家地社区卫生服务站三层楼我也不知道是哪儿了",
								"district": "朝阳区",
								"province": "北京",
								"town": "望京街道"
							},
							"mobile": "1326443654",
							"name": "张三",
							"phone": "057123222"
						},
						"routingInfo": {
							"consolidation": {
								"name": "杭州",
								"code": "hangzhou"
							},
							"origin": {
								"code": "POSTB"
							},
							"sortation": {
								"name": "杭州"
							},
							"routeCode": "380D-56-04"
						},
						"sender": {
							"address": {
								"city": "北京市",
								"detail": "花家地社区卫生服务站二层楼我也不知道是哪儿了",
								"district": "朝阳区",
								"province": "北京",
								"town": "望京街道"
							},
							"mobile": "1326443654",
							"name": "张三",
							"phone": "057123222"
						},
						"shippingOption": {
							"code": "COD",
							"services": {
								"SVC-COD": {
									"value": "200"
								}
							},
							"title": "代收货款"
						},
						"waybillCode": "9890000160004"
					};
                    doGetPrinters(function(data){
                        if((data[0]['name'])){
                            printTpl[paramObject.id](data[0]['name'],[{data:sys_data,cust_data:cust_data}],true);
                        }else{
                            layer.msg('打印机不存在,无法预览', {time: 2000, icon:2});
                        }
                    });
                }, 100);
            });
        }
    });
}
function cbPrintView(data){
    var paramObj = printParamObj['param_json'];
    var pageWidth = paramObj['width'] * 3;
    var pageHeight = paramObj['height'] * 3;
    
    layer.open({
        type: 1
        ,title: false //不显示标题栏
        ,closeBtn: false
        ,area: pageWidth+'px;'
        ,shade: 0.8
        ,id: 'previewImage' //设定一个id，防止重复弹出
        ,btn: ['关闭']
        ,moveType: 1 //拖拽模式，0或者1
        ,content: '<div style="width:'+pageWidth+'px;height:'+pageHeight+'px;"><img style="width:100%;height:100%;" src="'+data['previewImage'][0]+'" /></div>'
    });
}
function downloadTemplate(){
    $("#printIFrame").attr('src','http://cloudprint.cainiao.com/cloudprint/client/CNPrintSetup.exe');
}
//选中项位置跟随表格
function setLinkedItem(top) {
	// var uid = LODOP.GET_VALUE('ItemName','selected');
	// alert(uid);
	// return;

	clearLinkedItem();

	var ItemHeight = LODOP.GET_VALUE('ItemTop','gridTable')*1+LODOP.GET_VALUE('ItemHeight','gridTable')*1;
	var linkHeight = LODOP.GET_VALUE('ItemTop','selected')-ItemHeight;
	var uid = LODOP.GET_VALUE('ItemName','selected');
	if(top)
	{
		LODOP.SET_PRINT_STYLEA(uid,"ItemName",uid+'||link'+linkHeight);
		uid = uid+'||link'+linkHeight;
	}
	else
	{
		LODOP.SET_PRINT_STYLEA(uid,"ItemType",1);
	}
	LODOP.SET_PRINT_STYLEA(uid,"LinkedItem",'gridTable');

}
//取消选中项位置跟随表格
function clearLinkedItem() {
	var uid = LODOP.GET_VALUE('ItemName','selected');
	var left = uid.indexOf ('||link');
	var newUid = uid;
	if(left>0)
	{
		newUid = uid.substring(0,left);
	}
	LODOP.SET_PRINT_STYLEA(uid,"ItemName",newUid);   //更名
	LODOP.SET_PRINT_STYLEA(newUid,"LinkedItem",0);    //设置关联内容项的项目编号,整数代表被关联项的序号
	LODOP.SET_PRINT_STYLEA(newUid,"ItemType",0);    //设定打印项的基本属性, 0--普通项 1--页眉页脚 2--页号项 3--页数项 4--多页项
}