layui.use(['form', 'element',  'layer'], function(){
    var $ = layui.jquery, 
    layer = layui.layer, 
    form = layui.form();
    reLoadWindow();
    loadPrintDesign();
    
    form.on('checkbox(node)', function(data){
        var dataField = $(data.elem).attr('data-field');
        var dataType = $(data.elem).attr('data-type');
        onTdChange(dataField,data.elem.checked);
    });
    
    $('.my-action-btn').click(function(){
        var dataField = $(this).attr('data-field');
        var dataType = $(this).attr('data-type');
        var datahtml = $(this).html();
        switch(dataType){
            case 'text':
                setPrintText(dataField);
            break;
            case 'font':
                setPrintFont(dataField);
            break;
            case 'field':
                setPrintData(dataField,datahtml);
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
    var widthEl = $("input[name='width']");
    var heightEl = $("input[name='height']");
    widthEl.change(function(){
        if($(this).val()){
            $("#CNPrintDesigner_DrawPanel").css({
                width : (widthEl.val()+'mm'),
                height : (heightEl.val()+'mm')
            });
        }
    });
    heightEl.change(function(){
        if($(this).val()){
            $("#CNPrintDesigner_DrawPanel").css({
                width : (widthEl.val()+'mm'),
                height : (heightEl.val()+'mm')
            });
        }
    });
    //文本内容变化
    var valueEl = $("#value");
    valueEl.change(function(){
        if(lastElId){
            var id = lastElId.attr('id');
            FIELD_WIDGET_JSON[id]['VALUE'] = $(this).val();
            reloadControl();
        }
    });
    //字体大小变化
    var fontSizeEl = $("#font-size");
    fontSizeEl.change(function(){
        if(lastElId){
            var id = lastElId.attr('id');
            FIELD_WIDGET_JSON[id]['STYLE']['font-size'] = $(this).val() || 12;
            reloadControl();
        }
    });
	//left左
    var fieldLeftEl = $("#field-left");
    fieldLeftEl.change(function(){
        if(lastElId){
            var id = lastElId.attr('id');
            FIELD_WIDGET_JSON[id]['STYLE']['left'] = $(this).val();
            lastElId.css({
				'left':FIELD_WIDGET_JSON[id]['STYLE']['left']+'px'
			});
        }
    });
	//top上
    var fieldTopEl = $("#field-top");
    fieldTopEl.change(function(){
        if(lastElId){
            var id = lastElId.attr('id');
            FIELD_WIDGET_JSON[id]['STYLE']['top'] = $(this).val();
            lastElId.css({
				'top':FIELD_WIDGET_JSON[id]['STYLE']['top']+'px'
			});
        }
    });
	//width宽
    var fieldWidthEl = $("#field-width");
    fieldWidthEl.change(function(){
        if(lastElId){
            var id = lastElId.attr('id');
            FIELD_WIDGET_JSON[id]['STYLE']['width'] = $(this).val();
            lastElId.css({
				'width':FIELD_WIDGET_JSON[id]['STYLE']['width']+'px'
			});
        }
    });
	//height高
    var fieldHeightEl = $("#field-height");
    fieldHeightEl.change(function(){
        if(lastElId){
            var id = lastElId.attr('id');
            FIELD_WIDGET_JSON[id]['STYLE']['height'] = $(this).val();
            lastElId.css({
				'height':FIELD_WIDGET_JSON[id]['STYLE']['height']+'px'
			});
        }
    });
    //字体粗细变化
    form.on('checkbox(fontWeight)', function(data){
        if(lastElId){
            var id = lastElId.attr('id');
            if(this.checked){
                FIELD_WIDGET_JSON[id]['STYLE']['font-weight'] = 'bold';
            }else{
                FIELD_WIDGET_JSON[id]['STYLE']['font-weight'] = 'normal';
            }
            reloadControl();
        }
    });
    //条形码
    form.on('checkbox(fontCode)', function(data){
        if(lastElId){
            var id = lastElId.attr('id');
            if(this.checked){
                FIELD_WIDGET_JSON[id]['STYLE']['ATTR-BARCODE'] = 'T';
            }else{
                FIELD_WIDGET_JSON[id]['STYLE']['ATTR-BARCODE'] = 'F';
            }
            reloadControl();
        }
    });
    //对齐方式
    $('.my-action-align').click(function(){
        if(lastElId){
            var dataId = $(this).attr('id');
            var textLeftEl = $("#text-align-left");
            var textCenterEl = $("#text-align-center");
            var textRightEl = $("#text-align-right");
            var id = lastElId.attr('id');
            switch(dataId){
                case 'text-align-left':
                    textRightEl.removeClass('layui-btn-normal').addClass('layui-btn-primary');
                    textCenterEl.removeClass('layui-btn-normal').addClass('layui-btn-primary');
                    textLeftEl.removeClass('layui-btn-primary').addClass('layui-btn-normal');
                    FIELD_WIDGET_JSON[id]['STYLE']['text-align'] = 'left';
                break;
                case 'text-align-center':
                    textRightEl.removeClass('layui-btn-normal').addClass('layui-btn-primary');
                    textCenterEl.removeClass('layui-btn-primary').addClass('layui-btn-normal');
                    textLeftEl.removeClass('layui-btn-normal').addClass('layui-btn-primary');
                    FIELD_WIDGET_JSON[id]['STYLE']['text-align'] = 'center';
                break;
                case 'text-align-right':
                    textRightEl.removeClass('layui-btn-primary').addClass('layui-btn-normal');
                    textCenterEl.removeClass('layui-btn-normal').addClass('layui-btn-primary');
                    textLeftEl.removeClass('layui-btn-normal').addClass('layui-btn-primary');
                    FIELD_WIDGET_JSON[id]['STYLE']['text-align'] = 'right';
                break;
            }
            reloadControl();
        }
    });
});
function reLoadWindow(){
    var designerHeight = $('body').height();
    var designerWidth = $('body').width() - 371;
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
//加载打印设计画布
function loadPrintDesign(){
    var indexLoad = layer.load();
    execAjax({
        m:'print',
        c:'prdtDesign',
        a:'getPrintDesign',
        data:{
            id:paramObject.id
        },
        success:function(data){
            createPage(data);
            layer.close(indexLoad);
        }
    });
}
function createPage(data){
    var tpl_name = data['tpl_name'];
    var express_no = data['express_no'];
    var def = data['def'];
    var paramObj = data['param_json'];
    var tplObj = data['tpl_json'];
    var pageWidth = paramObj['width'];
    var pageHeight = paramObj['height'];
    var pageHorizontalOffset = paramObj['horizontalOffset'];
    var pageVerticalOffset = paramObj['verticalOffset'];
    var pageTop = paramObj['top'];
    var pageLeft = paramObj['left'];
    $("#CNPrintDesigner_DrawPanel").css({
        width : (pageWidth+'mm'),
        height : (pageHeight+'mm'),
        left : (pageLeft+'mm'),
        top : (pageTop+'mm'),
    });
    $("input[name='tpl_name']").val(tpl_name);
    $("input[name='width']").val(pageWidth);
    $("input[name='height']").val(pageHeight);
    $("input[name='horizontalOffset']").val(pageHorizontalOffset);
    $("input[name='verticalOffset']").val(pageVerticalOffset);
    if(paramObj['double_row'] == 'T'){
        $("input[name='double_row']").attr('checked',true);
         $("input[name='double_row']").parent().find('.layui-form-checkbox').addClass('layui-form-checked');        
    }
    if(def == 'T'){
        $("input[name='def']").attr('checked',true);
         $("input[name='def']").parent().find('.layui-form-checkbox').addClass('layui-form-checked');        
    }
    var elStyle = {'top':true,'left':true,'bottom':true,'right':true,'width':true,'height':true,'position':true,'border':true};
    for(var i in tplObj){
        if(typeof(tplObj[i]) == 'object'){
            var widget = tplObj[i];
            addField(widget);
            var elId = widget['ID'];
            var el = $("#"+elId);
            if(widget['STYLE']){
                for(var j in widget['STYLE']){
                    if(elStyle[j]){
                        el.css(j,widget['STYLE'][j]);
                    }else{
                        el.find(".conent").css(j,widget['STYLE'][j]);
                        el.find(".tableGrid").css(j,widget['STYLE'][j]);
                    }
                }
            }
        }
    }
}

//记录字段属性
var FIELD_WIDGET_JSON = {};
function addField(param){
    var newFieldHtml = '';
    switch(param['TYPE']){
        case 'field':
            newFieldHtml = "<div id='"+param['ID']+"' class='field isMultiple'>"
                +"<div class='conent'>"
                    +"#"+param['VALUE']+"#"
                +"<div>"
            +"</div>";
        break;
        case 'text':
            newFieldHtml = "<div id='"+param['ID']+"' class='field isMultiple'>"
                +"<div class='conent'>"
                    +param['VALUE']
                +"<div>"
            +"</div>";
        break;
		case 'img':
            newFieldHtml = "<div id='"+param['ID']+"' class='field isMultiple'>"
                +"<div class='conent'>"
                    +'<img src="'+param['VALUE']+'" style="width:80px;height:60px;">'
                +"<div>"
            +"</div>";
        break;
        case 'gridList':
            newFieldHtml = "<div id='"+param['ID']+"' class='gridList' style='width:100%;height:70px;'>"
                +'<div id="'+param['FIELD']+'" class="tableGrid" style="width:100%;height:100%;">'
                +"</div>"
            +"</div>";
        break;
    }
    $( "#CUSTOM_AREA" ).append(newFieldHtml);
    $( "#"+param['ID'] ).draggable({
        grid: [ 1, 1 ],
        distance: 1,
        stop: function( event, ui ) {
            var originalPosition = ui.originalPosition;
            var position = ui.position;
            var offsetLeft = position.left - originalPosition.left;
            var offsetTop = position.top - originalPosition.top;
            var dragId = $(this).attr("id");
            position.left = parseInt(position.left);
            position.top = parseInt(position.top);
            $(this).css({
                left:(position.left+'px'),
                top:(position.top+'px')
            });
            if($(this).hasClass("fieldSelected")){
                $( ".fieldSelected" ).each(function() {
                    if($(this).attr("id")!=dragId){
                        var elLeft = $(this).css('left').replace('px','') * 1 + offsetLeft;
                        var elTop = $(this).css('top').replace('px','') * 1 + offsetTop;
                        $(this).css({
                            left:(elLeft+'px'),
                            top:(elTop+'px')
                        });
                    }
                });
            }
        }
    }).resizable({
        grid: 1,
		handles: "se",
        stop:function(event, ui){
            var size = ui.size;
            var newHeight = parseInt(size.height);
            var newWidth = parseInt(size.width);
            $(this).css({
                width:(newWidth+'px'),
                height:(newHeight+'px')
            });
        }
	}).css({
	   left:param['newLeft'],
       top:param['newTop'],
       width:param['newWidth'],
       height:param['newHeight'],
       'font-size':param['newFontSize']+'px',
       'font-family':(param['family']||'宋体'),
	}).on("click",function(){
        $(".fieldSelected").removeClass("fieldSelected");
        $(this).addClass("fieldSelected");
        showConfig({
            thisEl:this,
            FIELD_TYPE:param['FIELD_TYPE'],
            TYPE:param['TYPE']
        });
	});
    param['STYLE'] = param['STYLE'] || {
        'left':'0px',
        'bottom':'0px',
        'width':'100%'
    };
    param['STYLE']['font-size'] = param['STYLE']['font-size'] || param['newFontSize'] || 12;
    param['STYLE']['font-family'] = (param['family']||'黑体');
    //默认无样式
    FIELD_WIDGET_JSON[param['ID']] = param;
    loadTableName('tableGrid');
}
//删除字段
function delField(){
    if(lastElId){
        layer.confirm('确定删除该控件?', {
          btn: ['删除', '取消']
        }, function(index, layero){
            delFieldWidget();
            layer.close(index);
        });
        function delFieldWidget(){
            var elId = lastElId.attr("id");
            delete FIELD_WIDGET_JSON[elId];
            $( "#"+elId ).remove();
        }
    }
}
var isShowDelay = false;
var lastElId;
function showConfig(param){
    if(isShowDelay){
        return;
    }
    setTimeout(function() {
        isShowDelay = false;
    },300);
    isShowDelay = true;
    //控件
    var thisEl = $(param['thisEl']);
    lastElId = thisEl;
    var FIELD_TYPE = param['FIELD_TYPE'];
    var TYPE = param['TYPE'];
    //控件ID
    var elId = thisEl.attr("id");
    var valueEl = $("#value");
    var fontSizeEl = $("#font-size");
    var fontCodeEl = $("#font-code");
    var fontWeightEl = $("#font-weight");
    var textLeftEl = $("#text-align-left");
    var textCenterEl = $("#text-align-center");
    var textRightEl = $("#text-align-right");
	var fieldLeftEl = $("#field-left");
	var fieldTopEl = $("#field-top");
	var fieldWidthEl = $("#field-width");
	var fieldHeightEl = $("#field-height");
    switch(TYPE){
        case 'text':
            valueEl.attr('disabled',false);
            valueEl.val(FIELD_WIDGET_JSON[elId]['VALUE']);
        break;
        case 'field':
            valueEl.attr('disabled',true);
            valueEl.val('');
        break;
        case 'gridList':
            valueEl.attr('disabled',true);
            valueEl.val('');
        break;
    }
	fieldLeftEl.val($("#"+elId).css('left').replace('px',''));
	fieldTopEl.val($("#"+elId).css('top').replace('px',''));
	fieldWidthEl.val($("#"+elId).css('width').replace('px',''));
	fieldHeightEl.val($("#"+elId).css('height').replace('px',''));
    fontSizeEl.val(FIELD_WIDGET_JSON[elId]['STYLE']['font-size'] || 12);
    if(FIELD_WIDGET_JSON[elId]['STYLE']['font-weight'] == 'bold'){
        fontWeightEl.attr('checked',true);
        fontWeightEl.parent().find('.layui-form-checkbox').addClass('layui-form-checked');
    }else{
        fontWeightEl.attr('checked',false);
        fontWeightEl.parent().find('.layui-form-checkbox').removeClass('layui-form-checked');
    }
    fontCodeEl.val(FIELD_WIDGET_JSON[elId]['STYLE']['ATTR-BARCODE'] || '');
    if(FIELD_WIDGET_JSON[elId]['STYLE']['ATTR-BARCODE'] == 'T'){
        fontCodeEl.attr('checked',true);
        fontCodeEl.parent().find('.layui-form-checkbox').addClass('layui-form-checked');
    }else{
        fontCodeEl.attr('checked',false);
        fontCodeEl.parent().find('.layui-form-checkbox').removeClass('layui-form-checked');
    }
    if(FIELD_WIDGET_JSON[elId]['STYLE']['text-align'] == 'right'){
        textRightEl.removeClass('layui-btn-primary').addClass('layui-btn-normal');
        textLeftEl.removeClass('layui-btn-normal').addClass('layui-btn-primary');
        textCenterEl.removeClass('layui-btn-normal').addClass('layui-btn-primary');
    }else if(FIELD_WIDGET_JSON[elId]['STYLE']['text-align'] == 'center'){
        textRightEl.removeClass('layui-btn-normal').addClass('layui-btn-primary');
        textCenterEl.removeClass('layui-btn-primary').addClass('layui-btn-normal');
        textLeftEl.removeClass('layui-btn-normal').addClass('layui-btn-primary');
    }else{
        textRightEl.removeClass('layui-btn-normal').addClass('layui-btn-primary');
        textCenterEl.removeClass('layui-btn-normal').addClass('layui-btn-primary');
        textLeftEl.removeClass('layui-btn-primary').addClass('layui-btn-normal');
    }
}
function reloadControl(){
    var elId = lastElId.attr("id");
    var type = FIELD_WIDGET_JSON[elId]['TYPE'];
    var value = FIELD_WIDGET_JSON[elId]['VALUE'];
    var size = FIELD_WIDGET_JSON[elId]['STYLE']['font-size'] || 12;
    var weight = FIELD_WIDGET_JSON[elId]['STYLE']['font-weight'] || 'normal';
    if(type == 'text'){
        lastElId.find('.conent').text(value);
    }
    if(type == 'gridList'){
        lastElId.find('.tableGrid').css({
            'font-size':size+'px',
            'font-weight':weight,
            'text-align':align,
        });
    }else{
        lastElId.find('.conent').css({
            'font-size':size+'px',
            'font-weight':weight,
            'text-align':align,
        });
    }
}
//添加字段
function setPrintData(FIELD,VALUE){
    var param = {};
    param['ID'] = getTimeStamp();
    param['FIELD'] = FIELD;
    param['VALUE'] = VALUE;
    param['FIELD_TYPE'] = '';
    param['TYPE'] = 'field';
    param['newLeft'] = 0;
    param['newTop'] = 0;
    param['newWidth'] = 150;
    param['newHeight'] = 20;
    param['newFontSize'] = 12;
    addField(param);
}
function setPrintText(dataField){
    var param = {};
    param['ID'] = getTimeStamp();
    param['FIELD'] = '';
    param['VALUE'] = '请输入文本内容';
    param['FIELD_TYPE'] = '';
    param['TYPE'] = 'text';
    param['newLeft'] = 0;
    param['newTop'] = 0;
    param['newWidth'] = 150;
    param['newHeight'] = 20;
    param['newFontSize'] = 12;
    if(dataField == 'expire_code'){
        param['VALUE'] = '▍';
        param['newFontSize'] = 50;
        param['newWidth'] = 15;
        param['newHeight'] = 50;
    }
    addField(param);
}
function setPrintFont(dataField){
    var param = {};
    param['ID'] = getTimeStamp();
    param['FIELD'] = '';
    param['VALUE'] = dataField;
    param['FIELD_TYPE'] = '';
    param['family'] = "jqsoftXD";
    param['TYPE'] = 'text';
    param['newLeft'] = 0;
    param['newTop'] = 0;
    param['newWidth'] = 150;
    param['newHeight'] = 20;
    param['newFontSize'] = 32;
    addField(param);
}
function setPrintImg(){
    var param = {};
    param['ID'] = getTimeStamp();
    param['FIELD'] = '';
    param['VALUE'] = '';
    param['FIELD_TYPE'] = '';
    param['TYPE'] = 'img';
    param['newLeft'] = 0;
    param['newTop'] = 0;
    param['newWidth'] = 80;
    param['newHeight'] = 60;
    param['newFontSize'] = 12;
    addField(param);
}
//创建表格
function createTable(){
    var param = {};
    param['ID'] = getTimeStamp();
    param['FIELD'] = 'tableGrid';
    param['VALUE'] = '';
    param['FIELD_TYPE'] = '';
    param['TYPE'] = 'gridList';
    param['newLeft'] = 0;
    param['newTop'] = 0;
    param['newWidth'] = 200;
    param['newHeight'] = 100;
    param['newFontSize'] = 12;
    addField(param);
}
//表格
function loadTableName(tableName){
    var tdText = [];
    var tableGrid = $('#'+tableName);
    var elId = tableGrid.parent().attr('id');
    if(FIELD_WIDGET_JSON[elId] && FIELD_WIDGET_JSON[elId]['tdName']){
        for(var i in FIELD_WIDGET_JSON[elId]['tdName']){
            if(typeof(FIELD_WIDGET_JSON[elId]['tdName'][i]) == 'string' && FIELD_WIDGET_JSON[elId]['tdName'][i]){
                var obj = $("input[data-field='"+FIELD_WIDGET_JSON[elId]['tdName'][i]+"']");
                var title = obj.attr('title');
                tdText.push(title);
                obj.attr('checked',true);
            }
        }
        tableGrid.html(tdText.join('&nbsp;&nbsp;&nbsp;&nbsp;'));
        layui.form().render();
    }
}
function onTdChange(tdName,checked){
    var tableGrid = $('#tableGrid');
    if(tableGrid.length == 0){
        createTable();
        tableGrid = $('#tableGrid');
    }
    var elId = tableGrid.parent().attr('id');
    FIELD_WIDGET_JSON[elId]['tdName'] = FIELD_WIDGET_JSON[elId]['tdName'] || [];
	if(checked == true){
        FIELD_WIDGET_JSON[elId]['tdName'].push(tdName);
    }else{
        for(var i in FIELD_WIDGET_JSON[elId]['tdName']){
            if(FIELD_WIDGET_JSON[elId]['tdName'][i] == tdName){
                delete FIELD_WIDGET_JSON[elId]['tdName'][i];
            }
        }
    }
    loadTableName('tableGrid');
}
function getPrinterView(){
    for(var i in FIELD_WIDGET_JSON){
        if(typeof(FIELD_WIDGET_JSON[i]) == 'object'){
            var top = $("#"+i).css("top");
            var left = $("#"+i).css("left");
            var bottom = $("#"+i).css("bottom");
            var right = $("#"+i).css("right");
            var width = $("#"+i).css("width");
            var height = $("#"+i).css("height");
            var param = FIELD_WIDGET_JSON[i]['STYLE'];
            if(top){
                param['top'] = top;
            }
            if(left){
                param['left'] = left;
            }
            if(bottom){
                param['bottom'] = bottom;
            }
            if(right){
                param['right'] = right;
            }
            param['width'] = width;
            param['height'] = height;
            param['position'] = 'absolute';
            FIELD_WIDGET_JSON[i]['STYLE'] = param;
        }
    }
}
function saveTemplate(isView){
    var tpl_name = $("input[name='tpl_name']").val();
    var width = $("input[name='width']").val();
    var height = $("input[name='height']").val();
    var horizontalOffset = $("input[name='horizontalOffset']").val();//水平偏移量
    var verticalOffset = $("input[name='verticalOffset']").val();//垂直偏移量
    var double_row = $("input[name='double_row']").parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
    double_row = double_row?'T':'F';
    var def = $("input[name='def']").parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
    def = def?'T':'F';
    if(tpl_name == ''){
        layer.msg('模版名称不能为空', {
          icon: 2,
          time: 2000
        });
        return;
    }else if(tpl_name.length > 10){
        layer.msg('模版名称最多输入10个字数', {
            time: 2000, 
            icon:2
        });
        return;
    }
    if(width == ''){
        layer.msg('宽度不能为空', {
          icon: 2,
          time: 2000
        });
        return;
    }
    if(height == ''){
        layer.msg('高度不能为空', {
          icon: 2,
          time: 2000
        });
        return;
    }
    var indexLoad = layer.load();
    getPrinterView();
    var tpl_json = JSON.stringify(FIELD_WIDGET_JSON);
    execAjax({
        m:'print',
        c:'prdtDesign',
        a:'saveTemplate',
        data:{
            id:paramObject.id,
            tpl_name:tpl_name,
            def:def,
            width:width,
            height:height,
            horizontalOffset:horizontalOffset,
            verticalOffset:verticalOffset,
            double_row:double_row,
            tpl_json:tpl_json
        },
        success:function(data){
            layer.close(indexLoad);
            if(data['code'] == 'ok'){
                if(isView){
                    doPrintView();
                }else{
                    layer.msg(data['msg'], {time: 2000, icon:1});
                }
                parent.parent.reMenuOpen();
            }else{
                layer.msg(data['msg'], {time: 2000, icon:2});
            }
            
        }
    });
}
function doPrintView(){
    var indexLoad = layer.load();
    execAjax({
        m:'print',
        c:'prdtDesign',
        a:'getPrintDesign',
        data:{
            id:paramObject.id
        },
        success:function(data){
            var cust_data = {};
            var cust_template_orderField = data['param_json']['cust_template_orderField'];
            var double_row = $("input[name='double_row']").parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
            for(var i in cust_template_orderField){
                if(typeof(cust_template_orderField[i]) == 'string'){
                    var obj = $("button[data-field='"+cust_template_orderField[i]+"']");
                    var title = obj.text();
                    cust_data[cust_template_orderField[i]] = title;
                    cust_data[cust_template_orderField[i]+'barcode'] = '123456789';
                }
            }
            $.getScript("?m=print&c=script&a=createTplScript&_t="+Math.random(),function(){
                setTimeout(function() {
                    layer.close(indexLoad);
                    doGetPrinters(function(data){
                        if((data[0]['name'])){
                            if(double_row){
                                printTpl[paramObject.id](data[0]['name'],[{cust_data:cust_data},{cust_data:cust_data}],true);
                            }else{
                                printTpl[paramObject.id](data[0]['name'],[{cust_data:cust_data}],true);
                            }
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
    var double_row = $("input[name='double_row']").parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
    var width = $("input[name='width']").val() * 8;
    var height = $("input[name='height']").val() * 8;
    if(double_row){
        width = width * 2;
    }
    layer.open({
        type: 1
        ,title: false //不显示标题栏
        ,closeBtn: false
        ,area: width+'px;'
        ,shade: 0.8
        ,id: 'previewImage' //设定一个id，防止重复弹出
        ,btn: ['关闭']
        ,moveType: 1 //拖拽模式，0或者1
        ,content: '<div style="width:'+width+'px;height:'+height+'px;"><img style="width:100%;height:100%;" src="'+data['previewImage'][0]+'" /></div>'
    });
}
function downloadTemplate(){
    $("#printIFrame").attr('src','http://cloudprint.cainiao.com/cloudprint/client/CNPrintSetup.exe');
}