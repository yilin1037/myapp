layui.use(['tree','element', 'layer'], function() {
    var $ = layui.jquery,element = layui.element,layer = layui.layer;

    // 树        更多操作请查看 http://www.layui.com/demo/tree.html
    layui.tree({
        elem: '#tree' //传入元素选择器
        ,click: function(item){ //点击节点回调
            layer.msg('当前节名称：'+ item.name + '<br>全部参数：'+ JSON.stringify(item));
            console.log(item);
        }
        ,nodes: [{ //节点
            name: '父节点1'
            ,children: [{
                name: '子节点11'
                ,children: [{
                    name: '子节点111'
                }]
            },{
                name: '子节点12'
            }]
        },{
            name: '父节点2'
            ,children: [{
                name: '子节点21'
                ,children: [{
                    name: '子节点211'
                }]
            }]
        }]
    });

    // 初始化表格
    $('#dateTable').DataTable({
        "dom": '<"top">rt<"bottom"flp><"clear">',
        "autoWidth": false,                     // 自适应宽度
        "stateSave": true,                      // 刷新后保存页数
        "order": [[1, "desc"]],               // 排序
        "searching": false,                     // 本地搜索
        "info": true,                           // 控制是否显示表格左下角的信息
        "stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
        "aoColumnDefs": [{                      // 指定列不参与排序
            "orderable": false,
            "aTargets": [0, 6]                   // 对应你的表格的列数
        }],
        "pagingType": "simple_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
        "language": {                           // 国际化
            "url": 'language.json'
        }
    });

    // 例:获取ids
    $(document).on('click','#btn-delete-all', function(){
        // getIds(table对象,获取input为id的属性)
        var list = getIds($('#dateTable'),'data-id');
        if(list == null || list == ''){
            layer.msg('未选择');
        }else{
            layer.msg(list);
        }
    });

    // you code ...

});