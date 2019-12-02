layui.use(['element','layer'], function(){
    var $ = layui.jquery,element = layui.element,layer = layui.layer;

    // 初始化表格
    $('#dateTable').DataTable({
        "dom": '<"top">rt<"bottom"flp><"clear">',
        "autoWidth": false,                     // 自适应宽度
        "stateSave": true,                      // 刷新后保存页数
        "order": [[ 1, "desc" ]],               // 排序
        "searching": false,                     // 本地搜索
        "info": true,                           // 控制是否显示表格左下角的信息
        "stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
        "aoColumnDefs": [{                      // 指定列不参与排序
            "orderable": false,
            "aTargets": [0,6]                   // 对应你的表格的列数
        }],
        "pagingType": "simple_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
        "language": {                           // 国际化
            "sProcessing": "正在加载中......",
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "对不起，查询不到相关数据！",
            "sEmptyTable": "表中无数据存在！",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
            "sSearch": "搜索",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "末页"
            }
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

    // mounted


});