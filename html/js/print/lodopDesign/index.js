var vueObj = new Vue({
    el: '#template-list',
    data: {
        items: []
    }
});
getPrintDesignList();
layui.use(['layer','upload'], function(){
    var $ = layui.jquery, layer = layui.layer;
	var upload = layui.upload;
	$('#resetPrinterPreferences').unbind('click').on('click', function(){
        doConnect();
		setTimeout(function(){
			doGetPrinters(function(){
				layer.msg('全部打印机设置已恢复默认', {time: 3000, icon:1});
			});	
		},500);
		
    });
	
    $('#addTemplate').unbind('click').on('click', function(){
		parent.parent.addTab('fhqd',"?m=print&c=lodopDesign&a=addDesign&type="+type,"新建模板");
    });
	upload.render({
		elem: '#uploadTemplate' //绑定元素
		,url: '/index.php?m=print&c=lodopDesign&a=uploadTemplate' //上传接口
		,accept: 'file'
		,exts: 'txt'
		,done: function(res){
            if(res['code'] == 'ok'){
                //上传完毕回调
    			layer.msg("导入成功",{
    				icon: 1,
    				time: 2000
    			});
                getPrintDesignList();
                parent.parent.reMenuOpen();
            }else{
                layer.msg(res['msg'],{
    				icon: 2,
    				time: 2000
    			});
            }
		}
	});
});
function getPrintDesignList(){
    execAjax({
        m:'print',
        c:'lodopDesign',
        a:'getPrintDesignList',
        data:{
            type:type
        },
        success:function(data){
            var dataItem = [];
            for(var i in data){
                dataItem.push({
                    id:data[i]['id'],
                    tpl_name:data[i]['tpl_name'],
                    template_id:data[i]['param_json']['template_id'],
                });
            }
            vueObj.items = dataItem;
            setTimeout(function() {
                $('.item').hover(function (){  
                    $(this).addClass('itemSelect');
                },function (){  
                    $(this).removeClass('itemSelect');
                });
				$('.item .export').hover(function (){  
                    $(this).addClass('exportSelect');
                },function (){  
                    $(this).removeClass('exportSelect');
                });
                $('.item .edit').hover(function (){  
                    $(this).addClass('editSelect');
                },function (){  
                    $(this).removeClass('editSelect');
                });
                $('.item .delete').hover(function (){  
                    $(this).addClass('deleteSelect');
                },function (){  
                    $(this).removeClass('deleteSelect');
                });
				$('.item .export').unbind('click').on('click', function(){
                    var itemEl = $(this).parent().parent();
                    var title = $(".template-title",itemEl).text();
                    var id = $(this).attr('data-id');
                    var indexLoad = layer.load();
                    execAjax({
                        m:'print',
                        c:'lodopDesign',
                        a:'createPrintDesign',
                        data:{
                            id:id
                        },
                        success:function(data){
                            layer.close(indexLoad);
                            $("#txtFileId").val(data['txtFileId']);
                            $("#txtForm").submit();
                        }
                    });
                });
                $('.item .edit').unbind('click').on('click', function(){
                    var itemEl = $(this).parent().parent();
                    var title = $(".template-title",itemEl).text();
                    var id = $(this).attr('data-id');
                    layer.prompt({
                        formType: 0,
                        value: title,
                        title: '名称',
                        maxlength: 10,
                    area: ['200px', '50px'] //自定义文本域宽高
                    }, function(value, index, elem){
                        if(value == ''){
                            layer.msg('名称不能为空', {time: 2000, icon:2});
                            return;
                        }else if(value.length > 10){
                            layer.msg('最多输入10个字数', {time: 2000, icon:2});
                            return;
                        }
                        execAjax({
                            m:'print',
                            c:'lodopDesign',
                            a:'updateNameTemplate',
                            data:{
                                id:id,
                                value:value
                            },
                            success:function(data){
                                if(data['code'] == 'ok'){
                                    layer.close(index);
                                    getPrintDesignList();
                                    parent.parent.reMenuOpen();
                                }else{
                                    layer.msg(data['msg'], {time: 2000, icon:2});
                                }
                            }
                        });
                    });
                });
                $('.item .delete').unbind('click').on('click', function(){
                    var itemEl = $(this).parent().parent();
                    var title = $(".template-title",itemEl).text();
                    var id = $(this).attr('data-id');
                    layer.confirm('删除['+title+']快递模版', {icon: 3, title:'删除提醒'}, function(index){
                        execAjax({
                            m:'print',
                            c:'lodopDesign',
                            a:'deleteTemplate',
                            data:{
                                id:id
                            },
                            success:function(data){
                                if(data['code'] == 'ok'){
                                    layer.close(index);
                                    getPrintDesignList();
                                    parent.parent.reMenuOpen();
                                }else{
                                    layer.msg(data['msg'], {time: 2000, icon:2});
                                }
                            }
                        });
                    });
                });
                $(".print_item").unbind('click').on('click', function(){
                    var id = $(this).attr('data-id');
                    var htrf = $(this).attr('data-href');
                    var itemEl = $(this).parent().parent();
                    var title = $(".template-title",itemEl).text();
                    parent.parent.addTab(id,htrf,title);
                });
            },100);
        }
    });
}