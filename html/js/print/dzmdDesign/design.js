var faceAlone = new Vue({
	el: '#faceAlone',
	data: {
		expressArr:[],
		layprint:[],
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
		setTimeout(function() {
			doGetPrinters(function(data){
				self.layprint = data;
			});
		},100);
	},
	methods: {
		
	},
});
layui.use(['form', 'element',  'layer'], function(){
    var $ = layui.jquery, 
    layer = layui.layer, 
    form = layui.form();
    reLoadWindow();
    loadPrintDesign();

    var widthEl = $("input[name='width']");
    var heightEl = $("input[name='height']");
    widthEl.change(function(){
        if($(this).val()){
            $("#CNPrintDesigner_DrawPanel").css({
                width : (widthEl.val()+'mm'),
                height : (heightEl.val()+'mm')
            });
			$("#CUSTOM_AREA").css({
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
			$("#CUSTOM_AREA").css({
				width : (widthEl.val()+'mm'),
                height : (heightEl.val()+'mm')
			});
        }
    });

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
			case 'horizontal'://横
                setPrintHorizontal();
            break;
			case 'vertical'://竖
                setPrintVertical();
            break;
			case 'square'://方形
                setPrintSquare();
            break;
            case 'text':
                setPrintText();
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
var printParamObj = {};
function loadPrintDesign(){
    var indexLoad = layer.load();
    execAjax({
        m:'print',
        c:'dzmdDesign',
        a:'getPrintDesign',
        data:{
            id:paramObject.id
        },
        success:function(data){
            createPage(data);
            printParamObj = data;
            layer.close(indexLoad);
        }
    });
}

function createPage(data){
    var tpl_name = data['tpl_name'];
    var express_no = data['express_no'];
	var printer = data['printer'];
    var def = data['def'];
    var paramObj = data['param_json'];
    var tplObj = data['tpl_json'];
    var pageWidth = paramObj['width'];
    var pageHeight = paramObj['height'];
    var pageHorizontalOffset = paramObj['horizontalOffset'];
    var pageVerticalOffset = paramObj['verticalOffset'];
    var pageTop = paramObj['top'];
    var pageLeft = paramObj['left'];
    var TEMPLATE_TYPE = paramObj['TEMPLATE_TYPE'];
    
    $("#CNPrintDesigner_DrawPanel").css({
        width : (pageWidth+'mm'),
        height : (pageHeight+'mm'),
        left : (pageLeft+'mm'),
        top : (pageTop+'mm'),
    }).addClass(TEMPLATE_TYPE);
    var CUSTOM_AREA_HEIGHT = 40;
    if(paramObj['template_url'].indexOf('JD.xml') >= 0){
		CUSTOM_AREA_HEIGHT = pageHeight;
		$("#trWidth").css({
			'display':'table-row'
		});
		$("#trHeight").css({
			'display':'table-row'
		});
	}else if(paramObj['template_url'].indexOf('JD_ZDY.xml') >= 0){
		CUSTOM_AREA_HEIGHT = 113;
	}else if(paramObj['template_url'].indexOf('SF_ZDY.xml') >= 0){
		CUSTOM_AREA_HEIGHT = 210;
	}else if(express_no == 'JDKD_YTH'){
        CUSTOM_AREA_HEIGHT = 0;
    }
    $("#CUSTOM_AREA").css({
        width : (pageWidth+'mm'),
        height : (CUSTOM_AREA_HEIGHT+'mm'),
        left : (pageLeft+'mm'),
        top : ((pageHeight-CUSTOM_AREA_HEIGHT)+'mm'),
    });
    $("input[name='tpl_name']").val(tpl_name);
	$("input[name='width']").val(pageWidth);
    $("input[name='height']").val(pageHeight);
    $("input[name='horizontalOffset']").val(pageHorizontalOffset);
    $("input[name='verticalOffset']").val(pageVerticalOffset);
    $("select[name='express_no']").val(express_no);
	$("select[name='print_name']").val(printer);
    
    if(paramObj['express_logo'] == 'T'){
        $("input[name='express_logo']").attr('checked',true);
        $("input[name='express_logo']").parent().find('.layui-form-checkbox').addClass('layui-form-checked');        
    }
	if(paramObj['concat_text'] && paramObj['concat_text'] == 'T'){
        $("input[name='concat_text']").attr('checked',true);
        $("input[name='concat_text']").parent().find('.layui-form-checkbox').addClass('layui-form-checked');        
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
    var form = layui.form();
    form.render();
}

//记录字段属性
var FIELD_WIDGET_JSON = {};
function addField(param){
    var newFieldHtml = '';
    switch(param['TYPE']){
		case 'horizontal':
			newFieldHtml = "<div id='"+param['ID']+"' class='field field2 isMultiple'>"
                +"<div class='conent'>"
                +"<div>"
            +"</div>";
		break;
		case 'vertical':
			newFieldHtml = "<div id='"+param['ID']+"' class='field field2 isMultiple'>"
                +"<div class='conent'>"
                +"<div>"
            +"</div>";
		break;
		case 'square':
			newFieldHtml = "<div id='"+param['ID']+"' class='field field2 isMultiple'>"
                +"<div class='conent'>"
                +"<div>"
            +"</div>";
		break;
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
	var maxWidth = null;
	var maxHeight = null;
	var nodeCss = {
	   left:param['newLeft'],
       top:param['newTop'],
       width:param['newWidth'],
       height:param['newHeight'],
       'font-size':param['newFontSize']+'px',
	};
	if(param['TYPE'] == 'horizontal' || param['TYPE'] == 'vertical' || param['TYPE'] == 'square'){
		nodeCss = {
		   left:param['newLeft'],
		   top:param['newTop'],
		   width:param['newWidth'],
		   height:param['newHeight'],
		   'font-size':param['newFontSize']+'px',
		};
		switch(param['TYPE']){
			case 'horizontal':
				nodeCss['border-top'] = '1px solid #000';
				maxHeight = 10;
			break;
			case 'vertical':
				nodeCss['border-left'] = '1px solid #000';
				maxWidth = 10;
			break;
			case 'square':
				nodeCss['border'] = '1px solid #000';
			break;
		}
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
		maxWidth:maxWidth,
		maxHeight:maxHeight,
        stop:function(event, ui){
            var size = ui.size;
            var newHeight = parseInt(size.height);
            var newWidth = parseInt(size.width);
            $(this).css({
                width:(newWidth+'px'),
                height:(newHeight+'px')
            });
        }
	}).css(nodeCss).on("click",function(){
        $(".fieldSelected").removeClass("fieldSelected");
        $(this).addClass("fieldSelected");
        showConfig({
            thisEl:this,
            FIELD_TYPE:param['FIELD_TYPE'],
            TYPE:param['TYPE']
        });
	});
    param['STYLE'] = param['STYLE'] || nodeCss;
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
    var align = FIELD_WIDGET_JSON[elId]['STYLE']['text-align'] || 'left';
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
function setPrintHorizontal(){
	var param = {};
    param['ID'] = getTimeStamp();
    param['FIELD'] = '';
    param['VALUE'] = '';
    param['FIELD_TYPE'] = '';
    param['TYPE'] = 'horizontal';
    param['newLeft'] = 0;
    param['newTop'] = 0;
    param['newWidth'] = 150;
    param['newHeight'] = 10;
    param['newFontSize'] = 0;
    addField(param);
}
function setPrintVertical(){
	var param = {};
    param['ID'] = getTimeStamp();
    param['FIELD'] = '';
    param['VALUE'] = '';
    param['FIELD_TYPE'] = '';
    param['TYPE'] = 'vertical';
    param['newLeft'] = 0;
    param['newTop'] = 0;
    param['newWidth'] = 10;
    param['newHeight'] = 150;
    param['newFontSize'] = 0;
    addField(param);
}
function setPrintSquare(){
	var param = {};
    param['ID'] = getTimeStamp();
    param['FIELD'] = '';
    param['VALUE'] = '';
    param['FIELD_TYPE'] = '';
    param['TYPE'] = 'square';
    param['newLeft'] = 0;
    param['newTop'] = 0;
    param['newWidth'] = 150;
    param['newHeight'] = 150;
    param['newFontSize'] = 0;
    addField(param);
}
function setPrintText(){
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
    var express_no = $("select[name='express_no']").val();
	var print_name = $("select[name='print_name']").val();
    var express_logo = $("input[name='express_logo']").parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
	var concat_text = $("input[name='concat_text']").parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
    express_logo = express_logo?'T':'F';
	concat_text = concat_text ? 'T' : 'F';
	var width = $("input[name='width']").val();//水平偏移量
    var height = $("input[name='height']").val();//垂直偏移量
    var horizontalOffset = $("input[name='horizontalOffset']").val();//水平偏移量
    var verticalOffset = $("input[name='verticalOffset']").val();//垂直偏移量
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
    if(express_no == ''){
        layer.msg('所属快递不能为空', {
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
        c:'dzmdDesign',
        a:'saveTemplate',
        data:{
            id:paramObject.id,
            tpl_name:tpl_name,
            express_no:express_no,
            def:def,
			width:width,
            height:height,
            horizontalOffset:horizontalOffset,
            verticalOffset:verticalOffset,
            express_logo:express_logo,
			concat_text:concat_text,
            tpl_json:tpl_json,
			print_name:print_name
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
					cust_data[cust_template_orderField[i]+'barcode'] = '123456789';
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
                                 "name": "始发分拣中心名称",  
                                 "code": "始发道口号-笼车号"  
                             },  
                             "origin": {  
                                 "code": "目的地站点名称" ,  
                                 "customerCode": "商家ID" ,  
                             },  
                             "sortation": {  
                                 "name": "目的分拣中心名称",  
                                 "code": "目的道口号-笼车号",  
                             },  
                             "routeCode": "路区",
                             "tid":"订单号"  
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