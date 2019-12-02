var vueObj = new Vue({
    el: '#template-list',
    data: {
        items: []
    }
});
getPrintDesignList();
layui.use(['layer'], function(){
    var $ = layui.jquery, layer = layui.layer;
    $('#addTemplate').unbind('click').on('click', function(){
        layer.open({
            type: 2, 
            resize: false,
            title :'新建模版',
            area: ['500px', '300px'],
            btn: ['确定', '取消'],
            content: ['?m=print&c=storageDesign&a=addTemplate', 'no'],
            yes: function(index, layero){
                var body = layer.getChildFrame('body', index);
                var tpl_name = body.find('input[name="tpl_name"]').val();
                var width = body.find('input[name="width"]').val();
                var height = body.find('input[name="height"]').val();
                
                if(tpl_name == ''){
                    layer.msg('名称不能为空', {time: 2000, icon:2});
                    return;
                }else if(tpl_name.length > 10){
                    layer.msg('最多输入10个字数', {time: 2000, icon:2});
                    return;
                }else if(width == ''){
                    layer.msg('宽度不能为空', {time: 2000, icon:2});
                    return;
                }else if(height == ''){
                    layer.msg('高度不能为空', {time: 2000, icon:2});
                    return;
                }
                
                execAjax({
                    m:'print',
                    c:'storageDesign',
                    a:'creatTemplate',
                    data:{
                        tpl_name:tpl_name,
                        width:width,
                        height:height,
                        type:'storage',
                    },
                    success:function(data){
                        if(data['code'] == 'ok'){
                            getPrintDesignList();
                            parent.parent.reMenuOpen();
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
        c:'storageDesign',
        a:'getPrintDesignList',
        data:{
            type:'storage'
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
                            c:'storageDesign',
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
                    layer.confirm('删除['+title+']模版', {icon: 3, title:'删除提醒'}, function(index){
                        execAjax({
                            m:'print',
                            c:'storageDesign',
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