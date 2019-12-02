layui.use(['laypage', 'layer', 'form'], function(){
    var $ = layui.jquery, form = layui.form();
    var laypage = layui.laypage
    ,layer = layui.layer;
    execAjax({
        m:'print',
        c:'dzmdDesign',
        a:'getCaiNiaoStdTemplates',
        data:{},
        success:function(data){
            new Vue({
                el: '#template',
                data: {
                    items: data
                }
            });
            form.render();
        }
    });
});