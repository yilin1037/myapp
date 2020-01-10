var vue = new Vue({
    el: '#vue',
    data: {
        data: [],
    }
});

layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function() {
    var laydate = layui.laydate //日期
        ,
        laypage = layui.laypage //分页
    layer = layui.layer //弹层
        , form = layui.form //表单
        , element = layui.element; //元素操作
    var table = layui.table;

    laydate.render({
        elem: '#timeStart'
    });
    laydate.render({
        elem: '#timeEnd'
    });

    table.render({
        elem: '#dataList',
        url: '/?m=system&c=ForOrder&a=getData',
        skin: 'row',
        page: true,
        limits: [20, 50, 100],
        limit: 50,
        cellMinWidth: 80,
        height: 'full-100',
        cols: [
            [
                { type: 'numbers', width: 100, title: '序号' }, { field: 'tid', minWidth: 200, title: '订单号' }, { field: 'system_id', width: 200, title: '客户电话' }, { field: 'print_type', width: 200, title: '打单状态' }, { field: 'ADDTIME', minWidth: 250, title: '打单时间' }
            ]
        ],
        id: 'dataList',
        even: true
    });

});
//回车搜索
function searchTable() {
    var table = layui.table;
    var $ = layui.$;
    var active = {
        reload: function() {
            var usrCall = $('#usrCall').val();
            var orderNum = $('#orderNum').val();
            var singleState = $('#singleState').val();
            var timeStart = $('#timeStart').val();
            var timeEnd = $('#timeEnd').val();
            table.reload('dataList', {
                page: {
                    curr: 1
                },
                where: {
                    usrCall: usrCall,
                    orderNum: orderNum,
                    singleState: singleState,
                    timeStart: timeStart,
                    timeEnd: timeEnd,
                }
            });
        }
    };
    active['reload'] ? active['reload'].call(this) : '';
}