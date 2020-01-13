var vueObj = new Vue({
    el: '#template-list',
    data: {
        items: []
    }
});
getPrintDesignList();
layui.use(['layer'], function(){
    var $ = layui.jquery, layer = layui.layer;
	$('#resetPrinterPreferences').unbind('click').on('click', function(){
        doConnect();
		setTimeout(function(){
			doGetPrinters(function(){
				layer.msg('全部打印机设置已恢复默认', {time: 3000, icon:1});
			});	
		},500);
		
    });
	
    $('#addTemplate').unbind('click').on('click', function(){
        layer.open({
            type: 2, 
            resize: false,
            title :'新建模版',
            area: ['500px', '450px'],
            btn: ['确定', '取消'],
            content: ['?m=print&c=dzmdDesign&a=addTemplate', 'no'],
            yes: function(index, layero){
                var body = layer.getChildFrame('body', index);
                var tpl_name = body.find('input[name="tpl_name"]').val();
                var template = body.find('select[name="template"]').val();
                var template_id = body.find('select[name="template"] :selected').attr('data-standard_template_id');
                var template_name = body.find('select[name="template"] :selected').attr('data-standard_template_name');
                var template_url = body.find('select[name="template"] :selected').attr('data-standard_template_url');
                var express_no = body.find('select[name="template"] :selected').attr('data-standard_express_no');
				if(tpl_name == ''){
                    layer.msg('名称不能为空', {time: 2000, icon:2});
                    return;
                }else if(tpl_name.length > 10){
                    layer.msg('最多输入10个字数', {time: 2000, icon:2});
                    return;
                }
                if(template == ''){
                    layer.msg('标准模版不能为空', {time: 2000, icon:2});
                    return;
                }
                execAjax({
                    m:'print',
                    c:'dzmdDesign',
                    a:'creatTemplate',
                    data:{
                        tpl_name:tpl_name,
                        template_id:template_id,
						express_no:express_no,
                        template_name:template_name,
                        template_url:template_url,
                        type:'YUN',
                    },
                    success:function(data){
                        if(data['code'] == 'ok'){
                            getPrintDesignList();
                            parent.parent.reMenuOpen();
                            parent.parent.add_name();
                        }else{
                            layer.msg(data['msg'], {time: 2000, icon:2});
                        }
                    }
                });
                layer.close(index);
            }
        }); 
    });
});
function getPrintDesignList(){
    execAjax({
        m:'print',
        c:'dzmdDesign',
        a:'getPrintDesignList',
        data:{
            type:'YUN'
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
                            c:'dzmdDesign',
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
                                    parent.parent.add_name();
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
                            c:'dzmdDesign',
                            a:'deleteTemplate',
                            data:{
                                id:id
                            },
                            success:function(data){
                                if(data['code'] == 'ok'){
                                    layer.close(index);
                                    getPrintDesignList();
                                    parent.parent.reMenuOpen();
                                    parent.parent.add_name();
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