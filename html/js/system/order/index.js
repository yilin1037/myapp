var dataItem = [];
for(var i=0;i<10;i++){
    dataItem.push({
        d1: 'd1',
        d2: 'd2',
        d3: 'd3',
        d4: 'd4'
    });
}
var vueObj = new Vue({
    el: '#order-list',
    data: {
        items: dataItem
    }
});
layui.use(['laypage', 'layer', 'element','form'], function(){
    var $ = layui.jquery, form = layui.form();
    var laypage = layui.laypage
    ,layer = layui.layer;
    //全选
    form.on('checkbox(allChoose)', function(data){
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function(index, item){
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
    laypage({
        cont: 'demo7'
        ,pages: 100
        ,skip: true
        ,jump: function(obj, first){
            if(!first){
                vueObj.items = [];
                for(var i=0;i<10;i++){
                    vueObj.items.push({
                        d1: 'd1'+obj.curr,
                        d2: 'd2'+obj.curr,
                        d3: 'd3'+obj.curr,
                        d4: 'd4'+obj.curr
                    });
                }
                //layer.msg('第 '+ obj.curr +' 页');
            }
        }
    });
});